import { NextRequest, NextResponse } from 'next/server';
import { sendMetaEvent } from '@/lib/meta-pixel';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

function normalizePath(eventSourceUrl?: string) {
  if (!eventSourceUrl) return '/';

  try {
    const url = new URL(eventSourceUrl);
    return `${url.pathname}${url.search}`;
  } catch {
    return eventSourceUrl.startsWith('/') ? eventSourceUrl : '/';
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventSourceUrl, userData, customData, eventId, testEventCode } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    // Get client IP and User Agent from headers for better matching
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    const userAgent = req.headers.get('user-agent');
    const path = normalizePath(eventSourceUrl || req.headers.get('referer') || '');

    try {
      await db.collection('analytics-events').add({
        eventName,
        eventSourceUrl: eventSourceUrl || req.headers.get('referer') || '',
        path,
        customData: customData || {},
        eventId: eventId || null,
        userAgent: userAgent || null,
        ip: ip ? ip.split(',')[0].trim() : null,
        createdAt: FieldValue.serverTimestamp(),
      });
    } catch (logError) {
      console.error('Analytics Firestore Log Error:', logError);
    }

    const result = await sendMetaEvent({
      eventName,
      eventSourceUrl: eventSourceUrl || req.headers.get('referer') || '',
      userData: {
        ...userData,
        clientIpAddress: ip,
        userAgent: userAgent,
      },
      customData,
      eventId,
      testEventCode,
    });


    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('API Pixel Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
