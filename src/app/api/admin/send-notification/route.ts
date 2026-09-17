import { NextResponse } from 'next/server';
import { db, messaging } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getBaseTemplate } from '@/lib/email-templates';
import { createUnsubscribeToken } from '@/lib/email-unsubscribe';

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export async function POST(req: Request) {
  try {
    const { title, body, target, channels = ['push'], selectedUserIds = [], redirectPath = '', expiresAt = null } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Başlık ve mesaj gereklidir.' }, { status: 400 });
    }

    let expiryDate: Date | null = null;
    if (expiresAt) {
        expiryDate = new Date();
        if (expiresAt === '1_day') expiryDate.setDate(expiryDate.getDate() + 1);
        else if (expiresAt === '3_days') expiryDate.setDate(expiryDate.getDate() + 3);
        else if (expiresAt === '1_week') expiryDate.setDate(expiryDate.getDate() + 7);
        else expiryDate = new Date(expiresAt); // Custom date string
    }

    let users: any[] = [];
    
    // 1. Fetch target users
    if (target === 'selected_parents' && selectedUserIds.length > 0) {
      const userSnaps = await Promise.all(
        selectedUserIds.map((id: string) => db.collection('users').doc(id).get())
      );
      users = userSnaps.filter(s => s.exists).map(s => ({ id: s.id, ...s.data() }));
    } else {
      let userQuery;
      if (target === 'parents') {
        userQuery = db.collection('users').where('role', '==', 'parent');
      } else if (target === 'teachers') {
        userQuery = db.collection('users').where('role', '==', 'teacher');
      } else {
        userQuery = db.collection('users');
      }
      const snapshot = await userQuery.get();
      snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    }

    if (users.length === 0) {
      return NextResponse.json({ error: 'İşlem yapılacak kullanıcı bulunamadı.' }, { status: 404 });
    }

    const results: any = {
      push: { successCount: 0, failureCount: 0 },
      email: { successCount: 0, failureCount: 0, skippedCount: 0 },
      persistence: { successCount: 0 }
    };

    const finalLink = redirectPath.startsWith('http') 
        ? redirectPath 
        : `https://turkcocukakademisi.com${redirectPath.startsWith('/') ? '' : '/'}${redirectPath}`;

    // 2. Persist to Firestore (Subcollection)
    const persistenceChunks = [];
    for (let i = 0; i < users.length; i += 500) {
      persistenceChunks.push(users.slice(i, i + 500));
    }

    for (const chunk of persistenceChunks) {
      const batch = db.batch();
      chunk.forEach(user => {
        const notifRef = db.collection('users').doc(user.id).collection('notifications').doc();
        batch.set(notifRef, {
          title,
          body,
          type: 'announcement',
          redirectPath,
          isRead: false,
          expiresAt: expiryDate,
          createdAt: FieldValue.serverTimestamp(),
          metadata: {
            channels,
            target
          }
        });
      });
      await batch.commit();
      results.persistence.successCount += chunk.length;
    }

    // 3. Send Push Notifications
    if (channels.includes('push')) {
      const tokens: string[] = [];
      users.forEach((user) => {
        if (user.fcmTokens && Array.isArray(user.fcmTokens)) {
          tokens.push(...user.fcmTokens);
        }
      });

      if (tokens.length > 0) {
        const uniqueTokens = Array.from(new Set(tokens));
        const chunks = [];
        for (let i = 0; i < uniqueTokens.length; i += 500) {
          chunks.push(uniqueTokens.slice(i, i + 500));
        }

        const pushResults = await Promise.all(
          chunks.map((chunk) =>
            messaging.sendEachForMulticast({
              tokens: chunk,
              notification: { title, body },
              webpush: {
                fcmOptions: {
                  link: finalLink
                }
              },
              data: {
                link: finalLink,
                type: 'announcement'
              }
            })
          )
        );

        results.push.successCount = pushResults.reduce((acc, res) => acc + res.successCount, 0);
        results.push.failureCount = pushResults.reduce((acc, res) => acc + res.failureCount, 0);
      }
    }

    // 4. Send Emails
    if (channels.includes('email')) {
      const emailUsers = users.filter(u => u.email && u.emailPreferences?.marketingEmails !== false);
      results.email.skippedCount = users.filter(u => u.email && u.emailPreferences?.marketingEmails === false).length;
      
      if (emailUsers.length > 0) {
        const htmlBody = body.split('\n').map((line: string) => `<p>${escapeHtml(line)}</p>`).join('');
        
        let callToActionHtml = '';
        if (redirectPath) {
            callToActionHtml = `
              <div style="margin-top: 25px; text-align: center;">
                <a href="${finalLink}" style="display: inline-block; padding: 12px 24px; background: #0ea5e9; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px;">
                  Hemen Görüntüle →
                </a>
              </div>
            `;
        }

        // Fix: Use Resend Batch API to send INDIVIDUAL emails to each user
        // This ensures privacy so users don't see each other's email addresses.
        const batchData = emailUsers.map(u => {
          const unsubscribeToken = createUnsubscribeToken(u.id);
          const unsubscribeUrl = `https://turkcocukakademisi.com/api/email/unsubscribe?userId=${encodeURIComponent(u.id)}&token=${encodeURIComponent(unsubscribeToken)}`;
          const unsubscribeHtml = `
            <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <a href="${unsubscribeUrl}" style="color: #64748b; font-size: 12px; text-decoration: underline;">
                Duyuru ve kampanya e-postalarından çık
              </a>
            </div>
          `;
          const textBody = `${body}${redirectPath ? `\n\nHemen görüntüle: ${finalLink}` : ''}\n\nDuyuru ve kampanya e-postalarından çık: ${unsubscribeUrl}`;

          return {
            from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`,
            to: [u.email], // Single recipient per email
            replyTo: FROM_EMAIL,
            subject: title,
            html: getBaseTemplate(`${htmlBody}${callToActionHtml}${unsubscribeHtml}`),
            text: textBody,
            headers: {
              'List-Unsubscribe': `<${unsubscribeUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          };
        });

        // Resend batch limit is usually 100 emails per call
        for (let i = 0; i < batchData.length; i += 100) {
          const chunk = batchData.slice(i, i + 100);
          await resend.batch.send(chunk);
        }
        
        results.email.successCount = emailUsers.length; 
      }
    }

    // 5. Central Logging for History
    await db.collection('notifications-log').add({
      title,
      body,
      target,
      channels,
      redirectPath,
      expiresAt: expiryDate,
      createdAt: FieldValue.serverTimestamp(),
      recipients: users.map(u => ({ id: u.id, name: `${u.firstName || ''} ${u.lastName || ''}`.trim(), email: u.email })),
      results
    });

    return NextResponse.json({ 
      success: true, 
      results
    });

  } catch (error: any) {
    console.error('Send Notification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
