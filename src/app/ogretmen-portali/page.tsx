'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Loader2, Calendar, Users, Wallet } from 'lucide-react';
import { doc, collection, query, where } from 'firebase/firestore';
import { startOfMonth, endOfMonth, isBefore } from 'date-fns';
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

  const currentMonthLessonsQuery = useMemoFirebase(() => {
    if (!user || typeof window === 'undefined') return null;
    const startOfCurrentMonth = startOfMonth(new Date());
    const endOfCurrentMonth = endOfMonth(new Date());
    return query(
        collection(db, 'lesson-slots'), 
        where('teacherId', '==', user.uid),
        where('status', '==', 'booked'),
        where('startTime', '>=', startOfCurrentMonth),
        where('startTime', '<=', endOfCurrentMonth)
    );
  }, [user, db]);

  const { data: monthSlots } = useCollection(currentMonthLessonsQuery);

  const getCourseId = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return 'FREE_TRIAL';
    const courseCodeMap: { [key: string]: string } = { 
        'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik', 'GCSE': 'gcse'
    };
    return courseCodeMap[code.replace(/[0-9]/g, '')] || null;
  };

  const { completedLessonsCount, monthlyEarnings } = useMemo(() => {
    if (!monthSlots) return { completedLessonsCount: 0, monthlyEarnings: 0 };
    const now = new Date();
    
    let count = 0;
    let earnings = 0;

    monthSlots.forEach(slot => {
        const endTime = slot.endTime?.toDate();
        if (endTime && isBefore(endTime, now)) {
            count++;
            const courseId = getCourseId(slot.packageCode);
            if (courseId && userData?.lessonRates) {
                const rate = userData.lessonRates[courseId] || 0;
                earnings += rate;
            } else if (!userData?.lessonRates && userData?.lessonRate) {
                // Fallback to legacy single rate
                earnings += userData.lessonRate;
            }
        }
    });

    return { completedLessonsCount: count, monthlyEarnings: earnings };
  }, [monthSlots, userData]);

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

        <Card className="hover:shadow-lg transition-shadow border-green-200 bg-green-50/30">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Aylık Kazanç Özeti</CardTitle>
                <CardDescription>Bu ay tamamlanan dersler üzerinden hesaplanır.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col gap-1">
                 <span className="text-3xl font-black text-green-700">€{monthlyEarnings.toLocaleString('tr-TR')}</span>
                 <span className="text-sm font-medium text-slate-500">
                     {completedLessonsCount} Tamamlanan Ders (Kurs Bazlı Kazançlar)
                 </span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
