import { FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}'
);

export function getFirebaseConfig() {
  if (!firebaseConfig?.projectId) {
    throw new Error('Missing NEXT_PUBLIC_FIREBASE_CONFIG');
  }
  return firebaseConfig;
}
