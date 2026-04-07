import { NextResponse } from 'next/server';
import { notifyAdmin } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const { title, body, link } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Başlık ve mesaj gereklidir.' }, { status: 400 });
    }

    const result = await notifyAdmin(title, body, link);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Notify Admin API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
