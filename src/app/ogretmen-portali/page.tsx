'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Calendar, Users } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
    if (!userLoading && (!user || userData?.role !== 'teacher')) {
      router.push('/ogretmen-giris');
    }
  }, [user, userLoading, userData, router]);

  if (userLoading || userDataLoading || !user || userData?.role !== 'teacher') {
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
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Öğretmen Portalı</h1>
        <p className="mt-2 text-muted-foreground">Hoş geldiniz, {getTeacherName()}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Müsaitlik Takvimi</CardTitle>
                <CardDescription>Haftalık ve günlük ders saatlerinizi yönetin.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/ogretmen-portali/takvim">Takvimi Yönet</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <CardTitle>Öğrencilerim</CardTitle>
                <CardDescription>Yaklaşan derslerinizi ve öğrenci listesini görüntüleyin.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
             <Button disabled variant="secondary">Yakında</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
