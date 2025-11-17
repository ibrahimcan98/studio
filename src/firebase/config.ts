import { FirebaseOptions } from 'firebase/app';

// Firebase config is hardcoded to avoid environment variable parsing issues.
const firebaseConfig: FirebaseOptions = {
  "projectId": "studio-5883545682-2eaa4",
  "appId": "1:447632160358:web:6203d93e3a6dc4a2971fa7",
  "apiKey": "AIzaSyBaMRqed7S3Hoo0rbD6yF1Kz5lAdzGkkEU",
  "authDomain": "studio-5883545682-2eaa4.firebaseapp.com",
  "messagingSenderId": "447632160358",
  "measurementId": "G-9T4C229K55",
  "storageBucket": "studio-5883545682-2eaa4.appspot.com"
};

export function getFirebaseConfig() {
  if (!firebaseConfig?.projectId) {
    // This error should not be thrown anymore as config is hardcoded.
    throw new Error('Missing Firebase config.');
  }
  return firebaseConfig;
}
