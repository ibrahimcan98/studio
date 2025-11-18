'use client';

import { Crown, Check, Mail, CreditCard, Download, AlertTriangle, X, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const paymentHistory = [
    { date: "15 Kasım 2025", amount: "14 €", status: "Başarılı" },
    { date: "15 Ekim 2025", amount: "14 €", status: "Başarılı" },
    { date: "15 Eylül 2025", amount: "14 €", status: "Başarılı" },
];

const plans = [
    { name: "Aylık", price: "14 €", period: "/ ay", discount: "Şu anki plan", current: true },
    { name: "3 Aylık", price: "36 €", period: "/ 3 ay", discount: "%15 indirim" },
    { name: "Yıllık", price: "129 €", period: "/ yıl", discount: "%25 indirim" },
];

const premiumFeatures = [
    "Tüm konular & seviyeler açılır",
    "Görevler & rozetler sınırsız",
    "Çocuk modu power-up’ları",
    "Reklamsız",
    "İlerleme raporları",
    "Sınırsız can",
];

function UyelikContent({ user, userData }: { user: NonNullable<ReturnType<typeof useUser>['user']>, userData: any }) {
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isCancelling, setIsCancelling] = useState(false);

    const formatDate = (isoString: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    const premiumStartDate = formatDate(userData?.premiumStartDate);
    const premiumEndDate = formatDate(userData?.premiumEndDate);

    const handleCancelSubscription = async () => {
        if (!user || !db) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: "İşlem için giriş yapmalısınız.",
            });
            return;
        }

        setIsCancelling(true);
        const userDocRef = doc(db, 'users', user.uid);

        try {
            await updateDoc(userDocRef, {
                isPremium: false,
                premiumStartDate: null,
                premiumEndDate: null,
            });

            toast({
                title: "Başarılı",
                description: "Premium üyeliğiniz iptal edildi.",
            });

            router.push('/ebeveyn-portali');

        } catch (error) {
            console.error("Cancellation error:", error);
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Üyelik iptal edilirken bir sorun oluştu.",
            });
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
            <h2 className="text-3xl font-bold tracking-tight">Üyelik Yönetimi</h2>
            
            <Card className="shadow-lg">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-primary"><Crown /> Premium Üyeliğiniz Aktif</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p><strong>Başlangıç Tarihi:</strong> {premiumStartDate}</p>
                        <p><strong>Yenileme Tarihi:</strong> {premiumEndDate} (Her ay 14 € otomatik yenilenir)</p>
                        <p><strong>Plan Tipi:</strong> Aylık • Sınırsız Can • Tüm Konular Açık • Özel Rozetler</p>
                    </div>
                    <div className="space-y-4 md:text-right">
                        <p><strong>Ödeme Yöntemi:</strong> <span className="font-mono">**** **** **** 4242</span></p>
                        <Button variant="outline"><CreditCard className="mr-2" /> Ödeme Yöntemini Değiştir</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Faturalandırma</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Sonraki Ödeme</p>
                            <p className="font-semibold">{premiumEndDate}</p>
                            <p className="text-2xl font-bold">14 €</p>
                        </div>
                        <h3 className="font-semibold mb-2">Ödeme Geçmişi</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tarih</TableHead>
                                    <TableHead>Tutar</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="text-right">Fatura</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentHistory.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.amount}</TableCell>
                                        <TableCell><span className="text-green-600 font-medium">{item.status}</span></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">PDF</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <Button variant="outline" className="mt-4 w-full"><Download className="mr-2"/> Tüm Faturaları İndir</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"> Planını Değiştir</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {plans.map((plan) => (
                            <Card key={plan.name} className={`p-4 ${plan.current ? 'border-primary border-2' : ''}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{plan.name} <span className="text-sm font-normal text-muted-foreground">{plan.discount}</span></p>
                                        <p><span className="font-semibold">{plan.price}</span> {plan.period}</p>
                                    </div>
                                    <Button disabled={plan.current}>{plan.current ? 'Mevcut Plan' : 'Bu Plana Geç'}</Button>
                                </div>
                                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                                    <li><Check className="w-3 h-3 inline-block text-green-500 mr-1"/>Sınırsız can</li>
                                    <li><Check className="w-3 h-3 inline-block text-green-500 mr-1"/>Tüm konular açık</li>
                                    <li><Check className="w-3 h-3 inline-block text-green-500 mr-1"/>Özel rozetler</li>
                                    <li><Check className="w-3 h-3 inline-block text-green-500 mr-1"/>Hikayeler & şarkılar</li>
                                </ul>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2"><Star/> Premium ile neler kazanıyorsunuz?</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="grid grid-cols-2 gap-4">
                            {premiumFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500"/>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                         <CardTitle className="flex items-center gap-2"><Mail/> Destek Alın</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <p className="text-muted-foreground mb-4">Üyelikle ilgili sorular için bizimle iletişime geçin.</p>
                        <a href="mailto:support@turkcocukakademisi.com" className="font-semibold text-primary">
                            support@turkcocukakademisi.com
                        </a>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="bg-red-50 border-red-200">
                 <CardContent className="p-6 grid sm:grid-cols-2 gap-6 items-center">
                    <div>
                        <h3 className="font-bold flex items-center gap-2 text-destructive"><AlertTriangle/> Premium Üyeliği İptal Et</h3>
                        <p className="text-sm text-muted-foreground mt-1">İptal ettiğinizde üyeliğiniz dönem sonunda biter.</p>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto sm:justify-self-end">Üyeliği İptal Et</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Premium’u iptal ederseniz şu özellikleri kaybedersiniz:
                                    <ul className="list-disc pl-5 mt-4 space-y-2 text-left">
                                        <li>Sınırsız can</li>
                                        <li>Tüm kategorilere ve seviyelere erişim</li>
                                        <li>Özel rozetler ve ödüller</li>
                                        <li>Tüm hikaye & şarkılar</li>
                                    </ul>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCancelSubscription}
                                    disabled={isCancelling}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {isCancelling ? 'İptal Ediliyor...' : 'Evet, İptal Et'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </CardContent>
            </Card>
        </div>
    );
}

export default function UyelikYonetimiPage() {
    const { user, isUserLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

    const isLoading = isUserLoading || isUserDataLoading;

    useEffect(() => {
        // Only redirect when loading is completely finished
        if (!isLoading) {
            // If there's no user or the user is not premium, redirect
            if (!user || !userData?.isPremium) {
                router.replace('/ebeveyn-portali');
            }
        }
    }, [isLoading, user, userData, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    // Only render content if the user is logged in and premium
    if (user && userData?.isPremium) {
        return <UyelikContent user={user} userData={userData} />;
    }

    // Otherwise, render nothing while redirecting
    return null;
}
