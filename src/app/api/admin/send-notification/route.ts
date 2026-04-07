import { NextResponse } from 'next/server';
import { db, messaging } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { title, body, target } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Başlık ve mesaj gereklidir.' }, { status: 400 });
    }

    let userQuery;
    if (target === 'parents') {
      userQuery = db.collection('users').where('role', '==', 'parent');
    } else if (target === 'teachers') {
      userQuery = db.collection('users').where('role', '==', 'teacher');
    } else {
      userQuery = db.collection('users');
    }

    const snapshot = await userQuery.get();
    const tokens: string[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.fcmTokens && Array.isArray(data.fcmTokens)) {
        tokens.push(...data.fcmTokens);
      }
    });

    if (tokens.length === 0) {
      return NextResponse.json({ error: 'Bildirim gönderilecek kayıtlı cihaz bulunamadı.' }, { status: 404 });
    }

    // Remove duplicates
    const uniqueTokens = Array.from(new Set(tokens));

    // FCM allows sending up to 500 tokens in a single call for multicast
    // We'll chunk them just in case
    const chunks = [];
    for (let i = 0; i < uniqueTokens.length; i += 500) {
      chunks.push(uniqueTokens.slice(i, i + 500));
    }

    const results = await Promise.all(
      chunks.map((chunk) =>
        messaging.sendEachForMulticast({
          tokens: chunk,
          notification: {
            title,
            body,
          },
          webpush: {
            fcmOptions: {
              link: 'https://turkcocukakademisi.com' // Adjust as needed
            }
          }
        })
      )
    );

    const successCount = results.reduce((acc, res) => acc + res.successCount, 0);
    const failureCount = results.reduce((acc, res) => acc + res.failureCount, 0);

    return NextResponse.json({ 
      success: true, 
      successCount, 
      failureCount 
    });

  } catch (error: any) {
    console.error('Send Notification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
