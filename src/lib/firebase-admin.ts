import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let firebaseApp: App;

const initializeFirebaseAdmin = (): App => {
  const apps = getApps();
  if (apps.length > 0) return apps[0];

  try {
    const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const envKeys = Object.keys(process.env).filter(k => k.includes('FIREBASE') || k.includes('NEXT_PUBLIC') || k.includes('RESEND'));
    console.log('[Firebase Admin] Env Check:', { envKeys });

    // 1. Try Environment Variable (JSON string)
    if (serviceAccountVar) {
      try {
        const cleaned = serviceAccountVar.trim().replace(/^['"]|['"]$/g, '');
        const serviceAccount = JSON.parse(cleaned);
        if (serviceAccount.private_key) {
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        console.log('[Firebase Admin] Initializing from Environment Variable...');
        return initializeApp({
          credential: cert(serviceAccount)
        });
      } catch (e) {
        console.warn('[Firebase Admin] Env JSON parse failed, trying file fallback...');
      }
    }

    // 2. Try service-account.json File
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      console.log('[Firebase Admin] Initializing successfully from service-account.json file.');
      return initializeApp({
        credential: cert(serviceAccount)
      });
    }

    // 3. Last Fallback (Project ID only, might only work in limited GCP cases)
    if (projectId) {
      console.log('[Firebase Admin] Initializing with Project ID fallback...');
      return initializeApp({
        projectId: projectId
      });
    }

    throw new Error('No Firebase configuration found (env or file).');
  } catch (error: any) {
    console.error('[Firebase Admin] CRITICAL FAILURE:', error.message);
    throw error;
  }
};

firebaseApp = initializeFirebaseAdmin();

export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
