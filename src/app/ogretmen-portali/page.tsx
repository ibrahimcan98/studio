
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

const allowedTeacherEmails = ['ibrahimcan@turkcocukakademisii.com'];

export default function OgretmenPortaliPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!userLoading && (!user || !user.email || !allowedTeacherEmails.includes(user.email))) {
      router.push('/ogretmen-giris');
    }
  }, [user, userLoading, router]);

  if (userLoading || userDataLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const getTeacherName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
     if (userData?.firstName) {
      return userData.firstName;
    }
    if (user.displayName) {
      return user.displayName;
    }
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Öğretmen';
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Öğretmen Portalı</h1>
      <p className="mt-4">Hoş geldiniz, {getTeacherName()}!</p>
      {/* Öğretmenlere özel içerik buraya gelecek */}
    </div>
  );
}
