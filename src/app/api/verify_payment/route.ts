import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendAdminNotification } from '@/lib/notify';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      if (session.metadata?.fulfilled === 'true') {
        return NextResponse.json({ 
            success: true, 
            fulfilled: true, 
            transactionId: session.metadata.transactionId 
        });
      } else {
        await stripe.checkout.sessions.update(session_id, {
          metadata: { ...session.metadata, fulfilled: 'true' }
        });

        // Admin notification: new package purchased
        const amount = session.amount_total ? `€${(session.amount_total / 100).toFixed(2)}` : '-';
        const customerEmail = session.customer_email || '-';
        await sendAdminNotification({
            event: '📦 Paket Satın Alındı',
            details: { 'Müşteri': customerEmail, 'Tutar': amount }
        });
        await addDoc(collection(db, 'activity-log'), {
            event: '📦 Paket Satın Alındı',
            icon: '📦',
            details: { 'Müşteri': customerEmail, 'Tutar': amount },
            createdAt: Timestamp.fromDate(new Date()),
        });

        return NextResponse.json({ 
            success: true, 
            fulfilled: false, 
            transactionId: session.metadata?.transactionId 
        });
      }
    } else {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Verification error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
