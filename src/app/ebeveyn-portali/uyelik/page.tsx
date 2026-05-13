'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2, Crown, ArrowLeft, Check, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SUBSCRIPTION_TIERS, SubscriptionTier, TierDetails } from '@/constants/subscriptions';
import { cn } from '@/lib/utils';

export default function UyelikYonetimiPage() {
    const { user, loading: isUserLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [loadingTier, setLoadingTier] = useState<string | null>(null);

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    const handleManageSubscription = async () => {
        if (!userData?.stripeCustomerId) return;
        
        try {
            setIsPortalLoading(true);
            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId: userData.stripeCustomerId })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Portal error:", error);
        } finally {
            setIsPortalLoading(false);
        }
    };

    const handleAction = async (tier: TierDetails) => {
        if (!user || !db || loadingTier) return;

        // ÜCRETSİZ PAKET SEÇİMİ (Doğrudan Firestore)
        if (tier.id === 'free') {
            try {
                setLoadingTier('free');
                await updateDoc(userDocRef!, {
                    subscriptionTier: 'free',
                    isPremium: false,
                    stripeSubscriptionId: null // Mevcut aboneliği iptal etmek gerekebilir ama burada sadece UI kısıtlıyoruz
                });
                toast({
                    title: 'Plan Güncellendi',
                    description: 'Ücretsiz plana başarıyla geçiş yapıldı! ✨',
                    className: 'bg-green-600 text-white'
                });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Hata', description: 'Plan güncellenirken bir hata oluştu.' });
            } finally {
                setLoadingTier(null);
            }
            return;
        }

        // PREMİUM PAKET SEÇİMİ (Stripe)
        if (!tier.stripePriceId) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Bu paket için ödeme sistemi henüz aktif değil.' });
            return;
        }

        try {
            setLoadingTier(tier.id);
            const response = await fetch('/api/create-subscription-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: tier.stripePriceId,
                    userId: user.uid,
                    customerEmail: user.email,
                    tierId: tier.id
                })
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Stripe oturumu oluşturulamadı');
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Ödeme Hatası', description: error.message });
        } finally {
            setLoadingTier(null);
        }
    };

    if (isUserLoading || isUserDataLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-sky-50">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            </div>
        );
    }

    const currentTier = (userData?.subscriptionTier as SubscriptionTier) || 'free';
    const periodEnd = userData?.subscriptionPeriodEnd?.toDate ? userData.subscriptionPeriodEnd.toDate() : (userData?.subscriptionPeriodEnd ? new Date(userData.subscriptionPeriodEnd) : null);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b px-4 py-6 md:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/ebeveyn-portali')} className="rounded-full">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 uppercase italic">Üyelik Planları</h1>
                            <p className="text-slate-500 text-sm font-medium">Aileniz için en uygun planı seçin.</p>
                        </div>
                    </div>
                    
                    {currentTier !== 'free' && userData?.stripeCustomerId && (
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sıradaki Yenileme</p>
                                <p className="text-sm font-bold text-slate-700">
                                    {periodEnd ? format(periodEnd, 'dd MMMM yyyy', { locale: tr }) : 'Hesaplanıyor...'}
                                </p>
                            </div>
                            <Button 
                                onClick={handleManageSubscription}
                                disabled={isPortalLoading}
                                variant="outline" 
                                className="rounded-2xl border-2 border-slate-200 font-bold gap-2"
                            >
                                {isPortalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                Üyeliği Yönet
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">Eğlenceli Öğrenme Yolculuğu</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
                        Çocuğunuzun gelişimi için hazırladığımız özel içeriklere ve yapay zeka destekli Pati'ye tam erişim sağlayın.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
                        const isCurrent = currentTier === tier.id;
                        
                        return (
                            <Card key={tier.id} className={cn(
                                "relative flex flex-col rounded-[40px] border-4 transition-all duration-500 overflow-hidden",
                                isCurrent ? "border-blue-500 shadow-2xl scale-105 z-10" : "border-white shadow-xl hover:border-slate-200",
                                tier.id === 'hero' ? "bg-gradient-to-b from-white to-amber-50" : "bg-white"
                            )}>
                                {isCurrent && (
                                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-6 py-2 rounded-bl-[20px] font-black text-xs uppercase tracking-widest italic">
                                        Mevcut Plan
                                    </div>
                                )}
                                
                                <CardHeader className="pt-10 pb-6 text-center">
                                    <div className={cn(
                                        "w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3",
                                        tier.id === 'free' ? "bg-slate-100 text-slate-600" : 
                                        tier.id === 'adventurer' ? "bg-blue-100 text-blue-600" : 
                                        "bg-amber-100 text-amber-600"
                                    )}>
                                        {tier.id === 'free' ? <Shield className="w-8 h-8" /> : 
                                         tier.id === 'adventurer' ? <Zap className="w-8 h-8" /> : 
                                         <Crown className="w-8 h-8" />}
                                    </div>
                                    <CardTitle className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">{tier.name}</CardTitle>
                                    <div className="mt-4">
                                        <span className="text-4xl font-black text-slate-900">{tier.price}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 px-8">
                                    <ul className="space-y-4">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1 bg-emerald-100 rounded-full p-1">
                                                    <Check className="w-3 h-3 text-emerald-600 stroke-[4px]" />
                                                </div>
                                                <span className="text-slate-600 font-bold text-sm leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="p-8">
                                    <Button 
                                        onClick={() => handleAction(tier)}
                                        disabled={isCurrent || (loadingTier !== null)}
                                        className={cn(
                                            "w-full h-14 rounded-2xl font-black text-lg uppercase tracking-widest transition-all active:scale-95 shadow-lg border-b-4",
                                            isCurrent ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : 
                                            tier.id === 'free' ? "bg-slate-600 hover:bg-slate-700 text-white border-slate-800" :
                                            tier.id === 'adventurer' ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-800" :
                                            "bg-amber-500 hover:bg-amber-600 text-white border-amber-700"
                                        )}
                                    >
                                        {loadingTier === tier.id ? <Loader2 className="animate-spin" /> : 
                                         isCurrent ? "Şu Anki Planın" : "Seç ve Başla"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
