'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { Loader2, Crown, Calendar, CreditCard, ChevronRight, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

function UyelikContent({ userData }: { userData: any }) {
    
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: tr });
    };

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Üyelik Yönetimi</h2>
                <p className="text-muted-foreground">Premium aboneliğinizi ve ödeme detaylarınızı buradan yönetin.</p>
            </div>

            {/* Üyelik Durumu Kartı */}
            <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-400 to-teal-500 text-white p-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Crown className="w-8 h-8" />
                        <span>Premium Üyeliğiniz Aktif</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Başlangıç Tarihi</p>
                        <p className="font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(userData?.premiumStartDate)}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Sıradaki Yenileme Tarihi</p>
                        <p className="font-semibold flex items-center gap-2">
                             <Calendar className="w-4 h-4" />
                            {formatDate(userData?.premiumEndDate)}
                        </p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Mevcut Plan</p>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">Aylık</Badge>
                            <Badge variant="outline">Sınırsız Can</Badge>
                            <Badge variant="outline">Tüm Konular Açık</Badge>
                            <Badge variant="outline">Özel Rozetler</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ödeme Yöntemi Kartı */}
            <Card>
                <CardHeader>
                    <CardTitle>Ödeme Yöntemi</CardTitle>
                    <CardDescription>Aktif ödeme yönteminiz ve fatura bilgileriniz.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                            <CreditCard className="w-8 h-8" />
                            <div>
                                <p className="font-semibold">Visa **** 4242</p>
                                <p className="text-sm text-muted-foreground">Son kullanma tarihi 12/26</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Değiştir
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
             <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Tehlikeli Alan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                         <div>
                            <p className="font-semibold">Üyeliği İptal Et</p>
                            <p className="text-sm text-muted-foreground">
                                Premium üyeliğinizi bir sonraki yenileme tarihinde sonlandırır.
                            </p>
                        </div>
                        <Button variant="destructive">
                            <Settings className="w-4 h-4 mr-2" /> Üyeliği İptal Et
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function UyelikYonetimiPage() {
    const { user, loading: isUserLoading } = useUser();
    const router = useRouter();
    const db = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    
    useEffect(() => {
        const isDataReady = !isUserLoading && !isUserDataLoading;
        if (isDataReady && !userData?.isPremium) {
            router.replace('/ebeveyn-portali');
        }
    }, [isUserLoading, isUserDataLoading, userData, router]);

    const isLoading = isUserLoading || isUserDataLoading;

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!userData?.isPremium) {
        return null;
    }

    return <UyelikContent userData={userData} />;
}
