import { db as adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

/**
 * Firebase Admin instance and Firestore DB.
 * Initialization is handled in @/lib/firebase-admin for better support of
 * environment variables and service-account.json.
 */
export { adminDb, admin };
