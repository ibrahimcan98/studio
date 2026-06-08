import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, subscriptionId } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const params: Stripe.BillingPortal.SessionCreateParams = {
      customer: customerId,
      return_url: `${req.headers.get('origin')}/ebeveyn-portali/uyelik`,
    };

    if (subscriptionId) {
      params.flow_data = {
        type: 'subscription_cancel',
        subscription_cancel: {
          subscription: subscriptionId
        }
      };
    }

    const session = await stripe.billingPortal.sessions.create(params);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Portal Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
