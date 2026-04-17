import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendAdminNotification, sendUserPaymentReceipt } from '@/lib/notify';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24-preview' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is missing');
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[Webhook] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    if (session.metadata?.fulfilled === 'true') {
        return NextResponse.json({ received: true, already_fulfilled: true });
    }

    try {
        // 1. Check Database connection
        if (!db) {
            throw new Error('Database (db) initialization failed. Check FIREBASE_SERVICE_ACCOUNT variable.');
        }

        // 2. Check Transaction Metadata
        const transactionId = session.metadata?.transactionId;
        if (!transactionId) {
            throw new Error('CRITICAL: No transactionId found in session metadata. Metadata found: ' + JSON.stringify(session.metadata));
        }

        const txRef = db.collection('transactions').doc(transactionId);
        const txDoc = await txRef.get();

        if (!txDoc.exists) {
            throw new Error(`Transaction ${transactionId} not found in Firestore.`);
        }

        if (txDoc.data()?.status === 'completed') {
            return NextResponse.json({ received: true, message: 'Already completed' });
        }

        if (txDoc.data()?.status === 'pending') {
            const txData = txDoc.data()!;
            const userId = txData.userId;
            const userName = txData.userName || 'Değerli Velimiz';
            const newPackages = txData.newPackages || [];
            const totalLessonsToAdd = txData.totalLessonsToAdd || 0;

            const userRef = db.collection('users').doc(userId);
            const childrenRef = userRef.collection('children');
            const childrenSnap = await childrenRef.get();
            const childrenList = childrenSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const isSingleChild = childrenList.length === 1;

            const batch = db.batch();

            if (isSingleChild) {
                const child = childrenList[0];
                const childRef = childrenRef.doc(child.id);
                const firstPackage = newPackages[0];
                const prefix = firstPackage ? firstPackage.replace(/[0-9]/g, '') : 'B';
                const courseNames: any = { 'B': 'Başlangıç Kursu (Pre A1)', 'K': 'Konuşma Kursu (A1)', 'A': 'Akademik Kurs (A2)', 'G': 'Gelişim Kursu (B1)', 'GCSE': 'GCSE Türkçe Kursu' };
                batch.update(childRef, {
                    remainingLessons: FieldValue.increment(totalLessonsToAdd),
                    assignedPackage: firstPackage || 'B4',
                    assignedPackageName: courseNames[prefix] || 'Standart Kurs',
                    updatedAt: FieldValue.serverTimestamp()
                });
            } else {
                batch.update(userRef, {
                    enrolledPackages: FieldValue.arrayUnion(...newPackages),
                    remainingLessons: FieldValue.increment(totalLessonsToAdd),
                });
            }

            if (txData.referrerId) {
                const referrerRef = db.collection('users').doc(txData.referrerId);
                batch.update(referrerRef, { academyPoints: FieldValue.increment(25) });
            }

            batch.update(txRef, { status: 'completed', fulfilledAt: FieldValue.serverTimestamp() });
            
            // Only update stripe if key exists
            if (process.env.STRIPE_SECRET_KEY) {
                await stripe.checkout.sessions.update(session.id, { metadata: { fulfilled: 'true' } });
            }

            await batch.commit();

            // Notifications (wrapped in try-catch to not block DB success)
            try {
                const currencySymbol = session.currency === 'gbp' ? '£' : (session.currency === 'eur' ? '€' : (session.currency?.toUpperCase() || ''));
                const amountFormatted = session.amount_total ? `${currencySymbol}${(session.amount_total / 100).toFixed(2)}` : '-';
                const customerEmail = session.customer_email || '-';
                const packageList = newPackages.join(', ');

                await sendAdminNotification({
                    event: '📦 Paket Satın Alındı (Otomatik)',
                    details: { 'Müşteri': customerEmail, 'Tutar': amountFormatted, 'Paketler': packageList, 'Ders Sayısı': String(totalLessonsToAdd) }
                });
                await sendUserPaymentReceipt(customerEmail, { name: userName, amount: amountFormatted, packageInfo: `${totalLessonsToAdd} Derslik Paket` });
            } catch (notifyErr: any) {
                console.error('[Webhook] Notification failed but DB was updated:', notifyErr.message);
            }

            console.log(`[Webhook] Success: ${transactionId}`);
        }
    } catch (fulfillErr: any) {
        console.error(`[Webhook] ERROR: ${fulfillErr.message}`);
        return NextResponse.json({ error: `Webhook Logic Error: ${fulfillErr.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
