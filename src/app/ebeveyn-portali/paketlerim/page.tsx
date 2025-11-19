
'use client';

import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Package, ArrowLeft, BookOpen, History, ShoppingCart, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { COURSES, Course } from '@/data/courses';

function StatCard({ title, value, icon: Icon, unit, children }: { title: string, value: string | number, icon: React.ElementType, unit?: string, children?: React.ReactNode }) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {children ? (
            children
          ) : (
            <div className="text-2xl font-bold">
              {value} {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
  
const getCourseByCode = (code: string): Course | undefined => {
    const courseMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const courseId = courseMap[code];
    return COURSES.find(c => c.id === courseId);
};

export default function PaketlerimPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const db = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return doc(db, 'users', user.uid);
    }, [db, user?.uid]);

    const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);


    useEffect(() => {
        if (!userLoading && !user) {
            router.push('/login');
        }
    }, [user, userLoading, router]);

    if (userLoading || userDataLoading) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    const enrolledPackages: string[] = userData?.enrolledPackages || [];
    const remainingLessons = userData?.remainingLessons ?? 0;

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Paketlerim</h2>
                    <p className="text-muted-foreground">
                        Satın aldığınız ders paketlerini ve geçmiş siparişlerinizi burada görebilirsiniz.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                <StatCard title="Kalan Ders" value={remainingLessons} icon={BookOpen}>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-muted-foreground">Paketler</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                            {enrolledPackages.length > 0 ? (
                                enrolledPackages.map((pkg, index) => <Badge key={`${pkg}-${index}`} variant="secondary">{pkg}</Badge>)
                            ) : (
                                <span className="text-sm font-medium text-muted-foreground">-</span>
                            )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Kalan</p>
                            <p className="text-2xl font-bold">{remainingLessons}</p>
                        </div>
                    </div>
                </StatCard>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Sipariş Geçmişi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {enrolledPackages && enrolledPackages.length > 0 ? (
                        <div className="space-y-6">
                            {enrolledPackages.map((pkgCode, index) => {
                                const lessons = parseInt(pkgCode.replace(/\D/g, ''), 10);
                                const courseCode = pkgCode.replace(/[0-9]/g, '');
                                const course = getCourseByCode(courseCode);
                                if (!course) return null;

                                const pkgDetails = course.pricing.packages.find(p => p.lessons === lessons);
                                const price = pkgDetails ? pkgDetails.price : 0;
                                
                                return (
                                    <div key={`${pkgCode}-${index}`} className="p-4 border rounded-lg bg-background">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                            <div>
                                                <p className="font-semibold">{course.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                   ({lessons} derslik paket)
                                                </p>
                                            </div>
                                            <div className="mt-2 sm:mt-0 sm:text-right">
                                                <p className="font-semibold">Tutar</p>
                                                <p className="text-sm font-bold">€{price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Henüz Siparişiniz Yok</h3>
                            <p className="text-muted-foreground mt-2 mb-6">Ders paketlerini inceleyip öğrenme yolculuğuna başlayın!</p>
                            <Button asChild>
                                <Link href="/kurslar">Kursları İncele</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
