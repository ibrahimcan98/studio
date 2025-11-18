'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function EbeveynPortaliPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Ebeveyn Portalı</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Hoş geldiniz, {user.displayName || 'Ebeveyn'}! Burası sizin kontrol paneliniz.
      </p>
    </div>
  );
}
