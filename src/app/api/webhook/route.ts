import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendAdminNotification } from '@/lib/notify';

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
    
    // Check if already fulfilled via metadata to avoid double processing
    if (session.metadata?.fulfilled === 'true') {
        return NextResponse.json({ received: true, already_fulfilled: true });
    }

    try {
        const transactionId = session.metadata?.transactionId;
        if (!transactionId) {
            throw new Error('No transactionId found in session metadata');
        }

        const txRef = db.collection('transactions').doc(transactionId);
        const txDoc = await txRef.get();

        if (txDoc.exists && txDoc.data()?.status === 'pending') {
            const txData = txDoc.data()!;
            const userId = txData.userId;
            const newPackages = txData.newPackages || [];
            const totalLessonsToAdd = txData.totalLessonsToAdd || 0;

            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            const userData = userDoc.data();

            const childrenRef = db.collection('users').doc(userId).collection('children');
            const childrenSnap = await childrenRef.get();
            const childrenList = childrenSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const isSingleChild = childrenList.length === 1;

            const batch = db.batch();

            if (isSingleChild) {
                const child = childrenList[0];
                const childRef = childrenRef.doc(child.id);
                
                const firstPackage = newPackages[0];
                const prefix = firstPackage ? firstPackage.replace(/[0-9]/g, '') : 'B';
                
                const courseNames: { [key: string]: string } = {
                    'B': 'Başlangıç Kursu (Pre A1)',
                    'K': 'Konuşma Kursu (A1)',
                    'A': 'Akademik Kurs (A2)',
                    'G': 'Gelişim Kursu (B1)',
                    'GCSE': 'GCSE Türkçe Kursu'
                };
                const courseName = courseNames[prefix] || 'Standart Kurs';

                batch.update(childRef, {
                    remainingLessons: FieldValue.increment(totalLessonsToAdd),
                    assignedPackage: firstPackage || 'B4',
                    assignedPackageName: courseName,
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
            
            // Mark Stripe session as fulfilled too (for redundancy check)
            await stripe.checkout.sessions.update(session.id, {
                metadata: { fulfilled: 'true' }
            });

            await batch.commit();

            // Admin Notification
            const currencySymbol = session.currency === 'gbp' ? '£' : (session.currency === 'eur' ? '€' : (session.currency?.toUpperCase() || ''));
            const amountFormatted = session.amount_total ? `${currencySymbol}${(session.amount_total / 100).toFixed(2)}` : '-';
            const customerEmail = session.customer_email || '-';
            const packageList = newPackages.join(', ');

            await sendAdminNotification({
                event: '📦 Paket Satın Alındı (Otomatik)',
                details: { 
                    'Müşteri': customerEmail, 
                    'Tutar': amountFormatted, 
                    'Paketler': packageList,
                    'Toplam Ders': totalLessonsToAdd,
                    'İşlem': transactionId 
                }
            });

            await db.collection('activity-log').add({
                event: '📦 Paket Satın Alındı',
                icon: '📦',
                details: { 
                    'Müşteri': customerEmail, 
                    'Tutar': amountFormatted,
                    'Paket': packageList,
                    'Ders Sayısı': totalLessonsToAdd
                },
                createdAt: FieldValue.serverTimestamp(),
            });

            console.log(`[Webhook] Success: Transaction ${transactionId} fulfilled for ${customerEmail}`);
        }
    } catch (fulfillErr: any) {
        console.error(`[Webhook] Fulfillment error: ${fulfillErr.message}`);
        return NextResponse.json({ error: `Fulfillment error: ${fulfillErr.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
