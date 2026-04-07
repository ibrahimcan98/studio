import { NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const { userId, title, body, link } = await req.json();

    if (!userId || !title || !body) {
      return NextResponse.json({ error: 'Eksik bilgi (userId, title, body gereklidir)' }, { status: 400 });
    }

    const result = await sendPushNotification(userId, title, body, link);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Notify User API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
