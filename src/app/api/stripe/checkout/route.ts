import { NextResponse } from 'next/server';
import { getStripeSession } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { priceId, customerEmail, userId, userName } = await req.json();

    if (!priceId || !customerEmail) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const session = await getStripeSession(priceId, customerEmail, {
      userId,
      userName,
      isSpecial: 'tuba'
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
