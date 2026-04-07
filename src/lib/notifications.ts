import { db, messaging } from '@/lib/firebase-admin';

/**
 * Sends a push notification to a specific user using their FCM tokens stored in Firestore.
 */
export async function sendPushNotification(userId: string, title: string, body: string, link?: string) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return { success: false, error: 'User not found' };

    const data = userDoc.data();
    const tokens: string[] = data?.fcmTokens || [];

    if (tokens.length === 0) {
      console.log(`No FCM tokens found for user ${userId}`);
      return { success: false, error: 'No tokens found' };
    }

    const uniqueTokens = Array.from(new Set(tokens));

    const response = await messaging.sendEachForMulticast({
      tokens: uniqueTokens,
      notification: { title, body },
      webpush: {
        fcmOptions: {
          link: link || 'https://turkcocukakademisi.com'
        }
      }
    });

    console.log(`Successfully sent ${response.successCount} messages to user ${userId}`);
    return { success: true, successCount: response.successCount };
  } catch (error) {
    console.error(`Error sending push notification to user ${userId}:`, error);
    return { success: false, error };
  }
}

/**
 * Sends a notification to all users with a specific role (e.g., 'admin').
 */
export async function sendNotificationToRole(role: string, title: string, body: string, link?: string) {
  try {
    const snapshot = await db.collection('users').where('role', '==', role).get();
    const tokens: string[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.fcmTokens && Array.isArray(data.fcmTokens)) {
        tokens.push(...data.fcmTokens);
      }
    });

    if (tokens.length === 0) return { success: false, error: 'No tokens found for role' };

    const uniqueTokens = Array.from(new Set(tokens));

    const response = await messaging.sendEachForMulticast({
      tokens: uniqueTokens,
      notification: { title, body },
      webpush: {
        fcmOptions: {
          link: link || 'https://turkcocukakademisi.com'
        }
      }
    });

    return { success: true, successCount: response.successCount };
  } catch (error) {
    console.error(`Error sending notification to role ${role}:`, error);
    return { success: false, error };
  }
}

/**
 * Sends a notification to the main admin(s).
 */
export async function notifyAdmin(title: string, body: string, link?: string) {
  return sendNotificationToRole('admin', title, body, link);
}
