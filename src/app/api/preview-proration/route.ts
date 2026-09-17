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
    const subscriptionItem = subscription.items.data[0];

    if (!subscriptionItem) {
      return NextResponse.json(
        { error: 'Subscription has no billable item' },
        { status: 400 }
      );
    }
    
    // Taslak faturayı alarak mahsuplaşmayı (proration) önizle
    const invoice = await stripe.invoices.createPreview({
      customer: stripeCustomerId,
      subscription: stripeSubscriptionId,
      subscription_details: {
        proration_behavior: 'always_invoice',
        items: [
          {
            id: subscriptionItem.id,
            price: newPriceId, // Yeni fiyatla taslak fatura
          },
        ],
      },
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
