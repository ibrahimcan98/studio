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

// Use initializeFirestore with long polling to avoid connection issues in virtual environments
export const db = getApps().length > 0 
  ? getFirestore(app) 
  : initializeFirestore(app, {
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
