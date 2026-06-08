import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { priceId, userId, customerEmail, tierId, selectedPeriod, childCount, stripeSubscriptionId, stripeCustomerId } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Eğer kullanıcının halihazırda aktif bir aboneliği varsa (Yükseltme/Düşürme Akışı - Proration)
    if (stripeSubscriptionId && stripeCustomerId) {
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const itemId = subscription.items.data[0].id; // Mevcut abonelik kalemi

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${req.headers.get('origin')}/ebeveyn-portali/uyelik?success=true`,
        flow_data: {
          type: 'subscription_update_confirm',
          subscription_update_confirm: {
            subscription: stripeSubscriptionId,
            items: [{
              id: itemId,
              price: priceId,
              quantity: 1,
            }],
          },
        },
      });

      return NextResponse.json({ url: portalSession.url });
    }

    // Kullanıcının aboneliği yoksa veya yeni sıfırdan alıyorsa (Normal Akış)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/ebeveyn-portali/uyelik?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/ebeveyn-portali/uyelik?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        userId: userId,
        tierId: tierId,
        type: 'subscription_upgrade',
        selectedPeriod: selectedPeriod || 'monthly',
        childCount: childCount?.toString() || '1'
      },
      subscription_data: {
        metadata: {
          userId: userId,
          tierId: tierId,
          selectedPeriod: selectedPeriod || 'monthly',
          childCount: childCount?.toString() || '1'
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Subscription Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
