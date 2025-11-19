
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const allowedTeacherDomain = 'turkcocukakademisi.com';

export default function OgretmenPortaliPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.email?.endsWith(allowedTeacherDomain))) {
      router.push('/ogretmen-giris');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Öğretmen Portalı</h1>
      <p className="mt-4">Hoş geldiniz, {user.displayName || user.email}!</p>
      {/* Öğretmenlere özel içerik buraya gelecek */}
    </div>
  );
}

    