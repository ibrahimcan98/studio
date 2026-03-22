import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any, // Using type 'any' to avoid strict enum issues depending on installed version
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

    // Retrieve the session from Stripe securely
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      if (session.metadata?.fulfilled === 'true') {
        // If already fulfilled, just return success without triggering again
        return NextResponse.json({ 
            success: true, 
            fulfilled: true, 
            transactionId: session.metadata.transactionId 
        });
      } else {
        // Mark the session as fulfilled in Stripe metadata to prevent double claims
        await stripe.checkout.sessions.update(session_id, {
          metadata: { ...session.metadata, fulfilled: 'true' }
        });

        // Return the transaction ID for the client to complete execution
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
