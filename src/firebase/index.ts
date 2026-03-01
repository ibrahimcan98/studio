
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
  Timestamp
} from 'firebase/firestore'
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


// Re-export firestore functions for convenience across the app
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
  Timestamp
};

// Global instances for direct imports if needed
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use initializeFirestore once at the module level to ensure settings are applied consistently
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export function initializeFirebase() {
  return {
    firebaseApp: app,
    auth,
    firestore: db
  };
}

export function getSdks(firebaseApp: FirebaseApp) {
  // Return the single instances
  return {
    firebaseApp: app,
    auth,
    firestore: db
  };
}

// Non-blocking helpers
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options?: SetOptions) {
  setDoc(docRef, data, options || {}).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: data,
      })
    )
  })
}

export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  return addDoc(colRef, data).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: colRef.path,
        operation: 'create',
        requestResourceData: data,
      })
    )
  });
}

export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: data,
      })
    )
  });
}

export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      })
    )
  });
}

// Barrel exports
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
