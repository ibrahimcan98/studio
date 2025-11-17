'use client';

import { Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { ReactNode, useEffect, useState } from 'react';

import { initializeFirebase, FirebaseProvider } from '@/firebase';

export type FirebaseClientProviderProps = {
  children: ReactNode;
};

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
  } | null>(null);

  useEffect(() => {
    const firebaseInstances = initializeFirebase();
    setFirebase(firebaseInstances);
  }, []);

  if (!firebase) {
    return null;
  }

  return (
    <FirebaseProvider app={firebase.app} auth={firebase.auth} db={firebase.db}>
      {children}
    </FirebaseProvider>
  );
}
