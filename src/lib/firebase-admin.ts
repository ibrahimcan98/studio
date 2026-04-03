import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { firebaseConfig } from '@/firebase/config';

/**
 * GOAL: Use a singleton pattern to ensure Firebase Admin is initialized once.
 * This is crucial in Next.js development (HMR) to avoid "App already exists"
 * errors AND to ensure the internal auth instances maintain their state.
 */

declare global {
  // eslint-disable-next-line no-var
  var __firebaseAdminApp: App | undefined;
  // eslint-disable-next-line no-var
  var __firebaseAdminAuth: Auth | undefined;
  // eslint-disable-next-line no-var
  var __firebaseAdminDb: Firestore | undefined;
}

const initializeFirebaseAdmin = (): App => {
  // 1. Check if we already have an app in this runtime instance
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId = firebaseConfig.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const apiKey = firebaseConfig.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;

  console.log('[Firebase Admin] Initializing singleton for Project:', projectId);

  // Path Selection Logic
  let app: App;

  // 1. Try Environment Variable (JSON string)
  if (serviceAccountVar) {
    try {
      const cleaned = serviceAccountVar.trim().replace(/^['"]|['"]$/g, '');
      const serviceAccount = JSON.parse(cleaned);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
        apiKey: apiKey
      } as any);
      console.log('[Firebase Admin] Initialized via Environment Variable.');
      return app;
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
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
        apiKey: apiKey
      } as any);
      console.log('[Firebase Admin] Initialized via service-account.json.');
      return app;
    } catch (e: any) {
      console.warn('[Firebase Admin] File JSON parse failed:', e.message);
    }
  }

  // 3. Last Fallback (Project ID only - might limit some Auth features)
  if (projectId) {
    app = initializeApp({
      projectId: projectId,
      apiKey: apiKey
    } as any);
    console.log('[Firebase Admin] Initialized via Project ID fallback.');
    return app;
  }

  // BUILD PHASE FALLBACK
  const isCI = !!process.env.CI;
  const isProbablyBuild = process.env.NODE_ENV === 'production' && !serviceAccountVar && !fs.existsSync(serviceAccountPath);

  if (isCI || isProbablyBuild) {
    return initializeApp({
      projectId: 'studio-placeholder-build'
    });
  }

  throw new Error('Firebase Admin Configuration Missing: No service-account.json or environment variables found.');
};

// Singleton check via global to survive HMR in dev mode
if (!global.__firebaseAdminApp) {
  global.__firebaseAdminApp = initializeFirebaseAdmin();
  global.__firebaseAdminAuth = getAuth(global.__firebaseAdminApp);
  global.__firebaseAdminDb = getFirestore(global.__firebaseAdminApp);
}

export const auth = global.__firebaseAdminAuth!;
export const db = global.__firebaseAdminDb!;
