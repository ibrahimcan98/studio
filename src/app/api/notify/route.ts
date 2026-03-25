import { NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/notify';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { event, details, icon } = body;

        if (!event) {
            return NextResponse.json({ error: 'event is required' }, { status: 400 });
        }

        // Send email to admin
        await sendAdminNotification({ event, details: details || {} });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[notify route] Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
