import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { stripeCustomerId, stripeSubscriptionId, newPriceId } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    
    // Taslak faturayı alarak mahsuplaşmayı (proration) önizle
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: stripeCustomerId,
      subscription: stripeSubscriptionId,
      subscription_proration_behavior: 'always_invoice',
      subscription_items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId, // Yeni fiyatla taslak fatura
        },
      ],
    });

    return NextResponse.json({ 
      amountDue: invoice.amount_due,
      currency: invoice.currency
    });
  } catch (error: any) {
    console.error("Preview Proration Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
