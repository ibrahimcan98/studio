'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Crown, Calendar, Check, Star, RefreshCw, Snowflake, Mail, CreditCard, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";

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

export default function UyelikYonetimiPage() {
    const { user, isUserLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

    useEffect(() => {
        if (!isUserLoading && !isUserDataLoading) {
            if (!user) {
                router.push('/login');
            } else if (!userData?.isPremium) {
                router.push('/premium');
            }
        }
    }, [isUserLoading, isUserDataLoading, user, userData, router]);
    
    const handleCancelSubscription = async () => {
        if (!user || !db) return;

        const userDocRef = doc(db, 'users', user.uid);
        setDocumentNonBlocking(userDocRef, { 
            isPremium: false,
            premiumEndDate: null,
         }, { merge: true });

        toast({
            title: 'Üyelik İptal Edildi',
            description: 'Premium üyeliğiniz bir sonraki yenileme tarihinde sona erecektir.',
        });
        router.push('/ebeveyn-portali');
    };

    if (isUserLoading || isUserDataLoading || !userData?.isPremium) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-muted/20">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
    };

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
            <h2 className="text-3xl font-bold tracking-tight">Üyelik Yönetimi</h2>
            
            {/* Üyelik Durumu Kartı */}
            <Card className="shadow-lg">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-primary"><Crown /> Premium Üyeliğiniz Aktif</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p><strong>Başlangıç Tarihi:</strong> {formatDate(userData.premiumStartDate)}</p>
                        <p><strong>Yenileme Tarihi:</strong> {formatDate(userData.premiumEndDate)} (Her ay 14 € otomatik yenilenir)</p>
                        <p><strong>Plan Tipi:</strong> Aylık • Sınırsız Can • Tüm Konular Açık • Özel Rozetler</p>
                    </div>
                    <div className="space-y-4 md:text-right">
                        <p><strong>Ödeme Yöntemi:</strong> <span className="font-mono">**** **** **** 4242</span></p>
                        <Button variant="outline"><CreditCard className="mr-2" /> Ödeme Yöntemini Değiştir</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Faturalandırma ve Plan Değiştirme */}
            <div className="grid md:grid-cols-2 gap-8">
                 {/* Faturalandırma */}
                <Card>
                    <CardHeader>
                        <CardTitle>Faturalandırma</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Sonraki Ödeme</p>
                            <p className="font-semibold">{formatDate(userData.premiumEndDate)}</p>
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

                 {/* Planı Değiştir */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><RefreshCw/> Planını Değiştir</CardTitle>
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

            {/* Premium Avantajları ve Destek */}
            <div className="grid md:grid-cols-3 gap-8">
                 {/* Premium Avantajları */}
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
                {/* Destek */}
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
            
            {/* Üyelik İptali / Dondurma */}
            <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6 grid sm:grid-cols-2 gap-6 items-center">
                    <div>
                        <h3 className="font-bold flex items-center gap-2"><Snowflake/> Üyeliği Dondur</h3>
                        <p className="text-sm text-muted-foreground mt-1">En fazla 3 ay dondurabilirsiniz. Bu sürede yenileme durur.</p>
                    </div>
                     <Button variant="outline" className="w-full sm:w-auto sm:justify-self-end">Üyeliği Dondur</Button>
                </CardContent>
                <div className="border-t border-red-200"></div>
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
                                <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive hover:bg-destructive/90">
                                    Evet, İptal Et
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </CardContent>
            </Card>

        </div>
    );
}
