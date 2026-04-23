import { NextResponse } from 'next/server';
import { db, messaging } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getBaseTemplate } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    const { title, body, target, channels = ['push'], selectedUserIds = [], redirectPath = '' } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Başlık ve mesaj gereklidir.' }, { status: 400 });
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
      email: { successCount: 0, failureCount: 0 },
      persistence: { successCount: 0 }
    };

    const finalLink = redirectPath.startsWith('http') 
        ? redirectPath 
        : `https://turkcocukakademisi.com${redirectPath.startsWith('/') ? '' : '/'}${redirectPath}`;

    // 2. Persist to Firestore (Subcollection) - REMOVED AS REQUESTED TO SIMPLIFY
    /*
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
    */

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
      const emailUsers = users.filter(u => u.email);
      
      if (emailUsers.length > 0) {
        const htmlBody = body.split('\n').map((line: string) => `<p>${line}</p>`).join('');
        
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

        const emailHtml = getBaseTemplate(`${htmlBody}${callToActionHtml}`);

        // Fix: Use Resend Batch API to send INDIVIDUAL emails to each user
        // This ensures privacy so users don't see each other's email addresses.
        const batchData = emailUsers.map(u => ({
          from: FROM_EMAIL,
          to: [u.email], // Single recipient per email
          subject: title,
          html: emailHtml,
        }));

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
      createdAt: FieldValue.serverTimestamp(),
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
