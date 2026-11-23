import { createHash, randomUUID } from 'node:crypto';
import { FieldValue, type Firestore } from 'firebase-admin/firestore';

/** Claims a delivery atomically; Resend's key also protects a retry after send succeeds but persistence fails. */
export async function deliverReminderOnce(
  db: Firestore,
  identity: string,
  channel: 'email' | 'push',
  send: (idempotencyKey: string) => Promise<string | void>,
  now: () => number = Date.now,
): Promise<'sent' | 'already-sent' | 'busy'> {
  const key = `lesson-start-${channel}-${createHash('sha256').update(identity).digest('hex')}`;
  const ref = db.collection('reminder-deliveries').doc(key);
  const owner = randomUUID();
  const claim = await db.runTransaction(async transaction => {
    const data = (await transaction.get(ref)).data();
    if (data?.status === 'sent') return 'already-sent' as const;
    if (data?.status === 'sending' && data.leaseUntil > now()) return 'busy' as const;
    transaction.set(ref, { status: 'sending', owner, leaseUntil: now() + 90_000, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return 'claimed' as const;
  });
  if (claim !== 'claimed') return claim;
  try {
    const providerId = await send(key);
    await db.runTransaction(async transaction => {
      const data = (await transaction.get(ref)).data();
      if (data?.owner !== owner) return;
      transaction.set(ref, { status: 'sent', leaseUntil: 0, providerId: providerId || null, sentAt: FieldValue.serverTimestamp() }, { merge: true });
    });
    return 'sent';
  } catch (error) {
    // Only release our own lease; a stale worker must not overwrite a newer delivery.
    await db.runTransaction(async transaction => {
      const data = (await transaction.get(ref)).data();
      if (data?.owner === owner && data.status !== 'sent') transaction.set(ref, { status: 'retry', leaseUntil: 0 }, { merge: true });
    }).catch(() => {});
    throw error;
  }
}
