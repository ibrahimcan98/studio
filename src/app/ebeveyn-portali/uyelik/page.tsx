'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2, Crown, Calendar, RefreshCw, CreditCard, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

function UyelikContent({ userData }: { userData: any }) {
    const { user } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancelSubscription = async () => {
        if (!user || !db) return;
        setIsCancelling(true);
        const userDocRef = doc(db, 'users', user.uid);
        try {
            await updateDoc(userDocRef, {
                isPremium: false,
                premiumEndDate: null,
            });
            toast({
                title: 'Üyelik İptal Edildi',
                description: 'Premium üyeliğiniz bir sonraki yenileme tarihinde sona erecektir.',
                className: 'bg-green-500 text-white',
            });
            router.push('/ebeveyn-portali');
        } catch (error) {
            console.error("Subscription cancellation error:", error);
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Üyelik iptal edilirken bir sorun oluştu.',
            });
        } finally {
            setIsCancelling(false);
        }
    };

    const startDate = userData.premiumStartDate ? new Date(userData.premiumStartDate) : null;
    const endDate = userData.premiumEndDate ? new Date(userData.premiumEndDate) : null;

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Üyelik Yönetimi</h2>
                <p className="text-muted-foreground">
                    Premium abonelik detaylarınızı buradan görüntüleyebilir ve yönetebilirsiniz.
                </p>
            </div>

            <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl"><Crown /> Premium Üyeliğiniz Aktif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {startDate && (
                            <div className="flex items-center gap-3">
                                <Calendar className="w-8 h-8 opacity-80" />
                                <div>
                                    <p className="font-semibold">Başlangıç Tarihi</p>
                                    <p className="text-white/80">{format(startDate, 'dd MMMM yyyy', { locale: tr })}</p>
                                </div>
                            </div>
                        )}
                        {endDate && (
                             <div className="flex items-center gap-3">
                                <RefreshCw className="w-8 h-8 opacity-80" />
                                <div>
                                    <p className="font-semibold">Yenileme Tarihi</p>
                                    <p className="text-white/80">{format(endDate, 'dd MMMM yyyy', { locale: tr })}</p>
                                </div>
                            </div>
                        )}
                    </div>
                     <div>
                        <p className="font-semibold">Plan Tipi</p>
                        <p className="text-white/80 flex items-center gap-2 flex-wrap">
                            Aylık <span className="text-xs">•</span> Sınırsız Can <span className="text-xs">•</span> Tüm Konular Açık <span className="text-xs">•</span> Özel Rozetler
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Ödeme Yöntemi</CardTitle>
                        <CardDescription>Kayıtlı ödeme yönteminiz.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                            <CreditCard className="w-8 h-8 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Visa **** 4242</p>
                                <p className="text-sm text-muted-foreground">Son kullanma tarihi: 12/26</p>
                            </div>
                        </div>
                        <Button variant="outline">Ödeme Yöntemini Değiştir</Button>
                    </CardContent>
                </Card>
                 <Card className="border-destructive/50 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2"><AlertCircle /> Üyeliği İptal Et</CardTitle>
                        <CardDescription className="text-destructive/80">Üyeliğinizi bir sonraki yenileme tarihinde sonlandırabilirsiniz.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={isCancelling}>
                                    {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Üyeliği İptal Et
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Premium üyeliğinizi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz. Mevcut haklarınız yenileme tarihine kadar devam edecektir.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive hover:bg-destructive/90">
                                        Evet, İptal Et
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


// This is the main page component that handles loading and redirection.
export default function UyelikYonetimiPage() {
    const { user, loading: isUserLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    
    // This effect handles redirection after data has been loaded.
    useEffect(() => {
        // Don't do anything while user or user data is loading.
        if (isUserLoading || isUserDataLoading) {
            return;
        }
        
        // If loading is finished and user is not premium, redirect.
        if (!userData?.isPremium) {
            router.replace('/ebeveyn-portali');
        }

    }, [isUserLoading, isUserDataLoading, userData, router]);


    // While loading any data, show a spinner.
    if (isUserLoading || isUserDataLoading) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    // If loading is complete and user is premium, show the content.
    // If they are not premium, the useEffect above will have already started the redirection.
    // Rendering null here prevents a flash of content before redirection.
    if (userData?.isPremium) {
       return <UyelikContent userData={userData} />;
    }

    return (
       <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
       </div>
    );
}