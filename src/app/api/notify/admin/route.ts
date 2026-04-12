import { NextResponse } from 'next/server';
import { notifyAdmin } from '@/lib/notifications';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { title, body, link, logData } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Başlık ve mesaj gereklidir.' }, { status: 400 });
    }

    // 1. Send FCM Push to specified admins
    const resultValue = await notifyAdmin(title, body, link);

    // 2. Optionally log to the operational activity feed
    if (logData) {
        try {
            await db.collection('activity-log').add({
                icon: logData.icon || '🔔',
                event: logData.event || title,
                details: logData.details || {},
                createdAt: FieldValue.serverTimestamp()
            });
        } catch (e) {
            console.error('Activity Log Error:', e);
        }
    }

    return NextResponse.json(resultValue);
  } catch (error: any) {
    console.error('Notify Admin API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
