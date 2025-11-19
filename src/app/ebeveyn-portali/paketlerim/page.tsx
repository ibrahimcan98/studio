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

export default function PaketlerimPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const db = useFirestore();

    const purchasesRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return query(collection(db, 'users', user.uid, 'purchases'), orderBy('purchaseDate', 'desc'));
    }, [db, user?.uid]);

    const { data: purchases, isLoading: purchasesLoading } = useCollection(purchasesRef);

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

    if (userLoading || purchasesLoading || userDataLoading) {
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
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Geri Dön
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Paketlerim</h2>
                    <p className="text-muted-foreground">
                        Satın aldığınız ders paketlerini ve geçmiş siparişlerinizi burada görebilirsiniz.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <StatCard title="Kalan Ders" value={remainingLessons} icon={BookOpen}>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-muted-foreground">Paketler</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                            {enrolledPackages.length > 0 ? (
                                enrolledPackages.map((pkg, index) => <Badge key={index} variant="secondary">{pkg}</Badge>)
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Harcama</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       <div className="text-2xl font-bold">
                         €{purchases?.reduce((acc, p) => acc + p.finalTotal, 0).toFixed(2) ?? '0.00'}
                       </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Sipariş Geçmişi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {purchases && purchases.length > 0 ? (
                        <div className="space-y-6">
                            {purchases.map(purchase => (
                                <div key={purchase.id} className="p-4 border rounded-lg bg-background">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b">
                                        <div>
                                            <p className="font-semibold">Sipariş Tarihi</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(purchase.purchaseDate.toDate(), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                                            </p>
                                        </div>
                                        <div className="mt-2 sm:mt-0 sm:text-right">
                                            <p className="font-semibold">Toplam Tutar</p>
                                            <p className="text-sm font-bold">€{purchase.finalTotal.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {purchase.items.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <p>{item.name} <span className="text-muted-foreground">({item.description})</span> x{item.quantity}</p>
                                                <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {purchase.appliedCoupon && (
                                        <div className="mt-3 pt-3 border-t text-sm text-green-600 flex justify-between">
                                            <span>Kupon indirimi ({purchase.appliedCoupon}):</span>
                                            <span>-€{purchase.discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
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