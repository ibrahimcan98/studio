
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';
import { 
  initializeFirestore,
  getFirestore, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  CollectionReference, 
  DocumentReference, 
  SetOptions,
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  writeBatch,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export { 
  doc, 
  collection, 
  query, 
  where, 
  getDoc, 
  getDocs, 
  writeBatch, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  serverTimestamp
};

// Singleton initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// App Check initialization
if (typeof window !== 'undefined' && (firebaseConfig as any).recaptchaSiteKey) {
  // LocalHost için debug token desteği (Geliştirme sırasında hata almamak için)
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider((firebaseConfig as any).recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

// Safe messaging initialization (prevents crash in restricted browsers like Instagram/iOS)
export const getSafeMessaging = async () => {
  if (typeof window === 'undefined') return null;
  try {
    const supported = await isSupported();
    if (supported) {
      return getMessaging(app);
    }
    return null;
  } catch (e) {
    console.warn('Messaging is not supported in this environment:', e);
    return null;
  }
};

// For backward compatibility but it will be null or messaging depending on support
// Note: Some legacy components might still expect 'messaging' to be available immediately.
// We initialize it as null and hooks should use it only after checking.
export let messaging: Messaging | null = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      messaging = getMessaging(app);
    }
  }).catch(() => {
    messaging = null;
  });
}

// Use initializeFirestore with long polling to avoid connection issues in virtual environments
// We use a singleton pattern to ensure initializeFirestore is only called once
let firestoreDb;
try {
  if (getApps().length === 0) {
    firestoreDb = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } else {
    firestoreDb = getFirestore(app);
  }
} catch (e) {
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;

export function initializeFirebase() {
  return {
    firebaseApp: app,
    auth,
    firestore: db
  };
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp: app,
    auth,
    firestore: db
  };
}

// Non-blocking helpers with robust error reporting
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options?: SetOptions) {
  setDoc(docRef, data, options || {}).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: docRef.path,
      operation: options && 'merge' in options ? 'update' : 'create',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  return addDoc(colRef, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: colRef.path,
      operation: 'create',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: docRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: docRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

// Barrel exports
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
