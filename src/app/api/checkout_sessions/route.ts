import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerEmail, transactionId, currency } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => {
        const isZeroDecimal = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'].includes((currency || 'gbp').toLowerCase());
        const unit_amount = isZeroDecimal ? Math.round(item.price) : Math.round(item.price * 100);

        return {
          price_data: {
            currency: currency || 'gbp',
            product_data: {
              name: item.name,
              description: item.description || '',
            },
            unit_amount,
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/ebeveyn-portali/paketlerim?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/sepet?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        transactionId: transactionId || ''
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
