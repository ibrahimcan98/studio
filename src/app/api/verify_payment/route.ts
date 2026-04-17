import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendAdminNotification } from '@/lib/notify';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/server';



export async function POST(req: Request) {
  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Fulfillment now handled by Webhook. 
    // This endpoint only checks the current state for UI feedback.
    if (session.payment_status === 'paid') {
      return NextResponse.json({ 
          success: true, 
          status: session.payment_status,
          fulfilled: session.metadata?.fulfilled === 'true'
      });
    } else {
      return NextResponse.json({ error: 'Payment not successful', status: session.payment_status }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Verification error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
