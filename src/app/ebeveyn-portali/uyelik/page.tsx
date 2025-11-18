'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useState, useEffect, ReactNode } from 'react';
import { Loader2, Crown, Calendar, CreditCard, ChevronRight, Settings, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
} from "@/components/ui/alert-dialog"
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

function UyelikContent({ userData, onCancel }: { userData: any, onCancel: () => Promise<void> }) {
    
    const [isCancelling, setIsCancelling] = useState(false);

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: tr });
    };

    const handleCancelClick = async () => {
        setIsCancelling(true);
        try {
            await onCancel();
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Üyelik Yönetimi</h2>
                <p className="text-muted-foreground">Premium aboneliğinizi ve ödeme detaylarınızı buradan yönetin.</p>
            </div>

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
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star/> Premium ile neler kazanıyorsunuz?</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="grid grid-cols-2 gap-4">
                        <li className="flex items-center gap-2 text-muted-foreground"><Crown className="w-4 h-4 text-primary"/>Sınırsız Can</li>
                        <li className="flex items-center gap-2 text-muted-foreground"><Crown className="w-4 h-4 text-primary"/>Bütün içerik</li>
                        <li className="flex items-center gap-2 text-muted-foreground"><Crown className="w-4 h-4 text-primary"/>Reklamsız</li>
                        <li className="flex items-center gap-2 text-muted-foreground"><Crown className_y="w-4 h-4 text-primary"/>Özel Rozetler</li>
                     </ul>
                </CardContent>
            </Card>

             <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Tehlikeli Alan</CardTitle>
                </CardHeader>
                <CardContent>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                 <Settings className="w-4 h-4 mr-2" /> Üyeliği İptal Et
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                <AlertDialogDescription>
                                   Premium üyeliğinizi bir sonraki yenileme tarihinde sonlandırmak istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isCancelling}>Vazgeç</AlertDialogCancel>
                                <AlertDialogAction
                                    disabled={isCancelling}
                                    onClick={handleCancelClick}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Evet, İptal Et
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <p className="text-xs text-muted-foreground mt-2">
                        Üyeliğinizi iptal ettiğinizde, mevcut fatura döneminizin sonuna kadar premium özelliklerden faydalanmaya devam edebilirsiniz.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

function PremiumRedirect({ userData, isLoading, children }: { userData: any, isLoading: boolean, children: ReactNode }) {
    const router = useRouter();
    
    useEffect(() => {
        if (isLoading) return; 

        if (!userData?.isPremium) {
            router.replace('/ebeveyn-portali');
        }
    }, [userData, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    if (userData?.isPremium) {
        return <>{children}</>;
    }

    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
}

export default function UyelikYonetimiPage() {
    const { user, loading: isUserLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    
    const isLoading = isUserLoading || isUserDataLoading;

    const handleCancelSubscription = async () => {
        if (!userDocRef) return;

        try {
            await updateDoc(userDocRef, {
                isPremium: false,
                premiumStartDate: null,
                premiumEndDate: null,
            });

            toast({
                title: 'Üyelik İptal Edildi',
                description: 'Premium üyeliğiniz başarıyla sonlandırıldı. Ebeveyn portalına yönlendiriliyorsunuz.',
            });

            router.push('/ebeveyn-portali');
        } catch (error) {
            console.error("Subscription cancellation error: ", error);
            toast({
                variant: 'destructive',
                title: 'Bir hata oluştu',
                description: 'Üyelik iptal edilirken bir sorun yaşandı. Lütfen tekrar deneyin.',
            });
        }
    };
    
    return (
        <PremiumRedirect userData={userData} isLoading={isLoading}>
            <UyelikContent userData={userData} onCancel={handleCancelSubscription} />
        </PremiumRedirect>
    );
}
