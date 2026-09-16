import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const INTERNAL_PATH_PREFIXES = ['/yonetici', '/ogretmen-portali'];
const BOT_PATTERN = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview/i;

function normalizePath(rawUrl?: string) {
  if (!rawUrl) return '/';

  try {
    const url = new URL(rawUrl);
    return url.pathname || '/';
  } catch {
    const [path] = rawUrl.split('?');
    return path.startsWith('/') ? path || '/' : '/';
  }
}

function isInternalPath(path: string) {
  return INTERNAL_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventSourceUrl, customData, eventId } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || '';
    const rawSourceUrl = eventSourceUrl || req.headers.get('referer') || '';
    const path = normalizePath(rawSourceUrl);

    if (BOT_PATTERN.test(userAgent) || isInternalPath(path)) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');

    await db.collection('analytics-events').add({
      eventName,
      eventSourceUrl: rawSourceUrl,
      path,
      customData: customData || {},
      eventId: eventId || null,
      userAgent,
      ip: ip ? ip.split(',')[0].trim() : null,
      source: 'internal',
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Site Analytics Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
