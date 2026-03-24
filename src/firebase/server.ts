import { firebaseConfig } from './config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';

// Initialize Firebase for Server-side (No 'use client')
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, Timestamp };
