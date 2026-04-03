import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let firebaseApp: App;

const initializeFirebaseAdmin = (): App => {
  const apps = getApps();
  if (apps.length > 0) {
    console.log('[Firebase Admin] Using existing app instance.');
    return apps[0];
  }

  const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyBaMRqed7S3Hoo0rbD6yF1Kz5lAdzGkkEU';

  console.log('[Firebase Admin] Starting initialization. Project ID:', projectId);

  // 1. Try Environment Variable (JSON string)
  if (serviceAccountVar) {
    try {
      const cleaned = serviceAccountVar.trim().replace(/^['"]|['"]$/g, '');
      const serviceAccount = JSON.parse(cleaned);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      console.log('[Firebase Admin] Attempting init from Environment Variable. Account Email:', serviceAccount.client_email);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
        apiKey: apiKey
      } as any);
    } catch (e: any) {
      console.warn('[Firebase Admin] Env JSON parse failed:', e.message);
    }
  }

  // 2. Try service-account.json File
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      console.log('[Firebase Admin] Attempting init from service-account.json file.');
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
        apiKey: apiKey
      } as any);
    } catch (e: any) {
      console.warn('[Firebase Admin] File JSON parse failed:', e.message);
    }
  }

  // 3. Last Fallback (Project ID only)
  if (projectId) {
    console.log('[Firebase Admin] Initializing with Project ID fallback ONLY. Links may fail.');
    return initializeApp({
      projectId: projectId,
      apiKey: apiKey
    } as any);
  }

  // BUILD PHASE FALLBACK
  const isCI = !!process.env.CI;
  const isProbablyBuild = process.env.NODE_ENV === 'production' && !serviceAccountVar && !fs.existsSync(serviceAccountPath);

  if (isCI || isProbablyBuild) {
    console.warn('[Firebase Admin] Using placeholder for build phase.');
    return initializeApp({
      projectId: 'studio-placeholder-build'
    });
  }

  throw new Error('Firebase Admin Configuration Missing: No service-account.json or environment variables found.');
};

firebaseApp = initializeFirebaseAdmin();

export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
