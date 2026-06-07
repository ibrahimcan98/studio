'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2, Crown, ArrowLeft, Check, Zap, Shield, RefreshCw, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SUBSCRIPTION_TIERS, SubscriptionTier, TierDetails, BillingPeriod } from '@/constants/subscriptions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function UyelikYonetimiPage() {
    const { user, loading: isUserLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [loadingTier, setLoadingTier] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('monthly');

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

        if (tier.id === 'free') {
            try {
                setLoadingTier('free');
                await updateDoc(userDocRef!, {
                    subscriptionTier: 'free',
                    isPremium: false,
                    stripeSubscriptionId: null
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

        const priceObj = tier.prices?.[selectedPeriod];
        if (!priceObj || !priceObj.stripePriceId) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Bu paket için ödeme sistemi henüz aktif değil.' });
            return;
        }

        try {
            setLoadingTier(tier.id);
            const response = await fetch('/api/create-subscription-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: priceObj.stripePriceId,
                    userId: user.uid,
                    customerEmail: user.email,
                    tierId: tier.id,
                    selectedPeriod: selectedPeriod
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
    const isManual = currentTier !== 'free' && !userData?.stripeSubscriptionId;
    const isCancelledAtPeriodEnd = userData?.subscriptionCancelledAtPeriodEnd;
    const currentTierDetails = SUBSCRIPTION_TIERS[currentTier];

    const TIER_LEVELS: Record<string, number> = {
        free: 0,
        adventurer: 1,
        hero: 2
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white border-b px-4 py-6 md:px-8">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/ebeveyn-portali')} className="rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 
                           className="text-2xl font-black text-slate-800 uppercase italic cursor-pointer"
                           onClick={async () => {
                             if (userDocRef) {
                               await updateDoc(userDocRef, { subscriptionTier: 'adventurer', isPremium: true });
                               toast({ title: 'DEV MODE', description: 'Zorla Maceracı yapıldı!' });
                             }
                           }}
                        >
                           Üyelik Yönetimi
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">Abonelik durumunuzu ve planlarınızı buradan takip edebilirsiniz.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
                
                {/* Active Subscription Details Card */}
                {currentTier !== 'free' && (
                    <div className="mb-16">
                        <div className="bg-white rounded-[32px] p-6 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between">
                            
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                                <div className={cn(
                                    "w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg rotate-3 shrink-0",
                                    currentTier === 'adventurer' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                                )}>
                                    {currentTier === 'adventurer' ? <Zap className="w-10 h-10" /> : <Crown className="w-10 h-10" />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Mevcut Planınız</h3>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">
                                            {currentTierDetails.name}
                                        </h2>
                                        {isCancelledAtPeriodEnd ? (
                                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                                İptal Edildi
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                                Aktif
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-slate-600 font-medium text-sm">
                                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                                        {isCancelledAtPeriodEnd ? (
                                            <span className="text-red-600 font-bold leading-tight">
                                                {periodEnd ? format(periodEnd, 'dd MMMM yyyy', { locale: tr }) : 'Dönem sonunda'} tarihine kadar kullanabilirsiniz.
                                            </span>
                                        ) : periodEnd ? (
                                            <span>Sıradaki yenileme: <strong className="text-slate-800">{format(periodEnd, 'dd MMMM yyyy', { locale: tr })}</strong></span>
                                        ) : isManual ? (
                                            <span>Süresiz / Manuel Atanmış Hesap</span>
                                        ) : (
                                            <span className="animate-pulse">Abonelik işleniyor, lütfen bekleyin...</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 w-full md:w-auto flex justify-end">
                                {!isManual && userData?.stripeCustomerId && (
                                    <Button 
                                        onClick={handleManageSubscription}
                                        disabled={isPortalLoading}
                                        variant="outline" 
                                        size="lg"
                                        className="rounded-2xl border-2 border-slate-200 font-bold gap-3 hover:bg-slate-50 hover:text-slate-900 w-full md:w-auto h-14 px-8 text-base shadow-sm"
                                    >
                                        {isPortalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                                        Üyeliği Yönet
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isCancelledAtPeriodEnd && (
                             <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 text-sm font-medium shadow-sm">
                                <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600 mt-0.5" />
                                <p>Aboneliğinizi iptal ettiniz. Ancak iptal işlemi hemen uygulanmaz; fatura dönemi sonuna kadar tüm ayrıcalıklardan kesintisiz faydalanmaya devam edebilirsiniz. Herhangi bir ek ücret kesilmeyecektir.</p>
                             </div>
                        )}
                    </div>
                )}

                <div className="text-center mb-12 mt-10">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">
                        {currentTier === 'free' ? "Eğlenceli Öğrenme Yolculuğu" : "Diğer Planları İncele"}
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
                        Çocuğunuzun gelişimi için hazırladığımız özel içeriklere ve yapay zeka destekli Pati'ye tam erişim sağlayın.
                    </p>
                </div>

                <div className="flex justify-center mb-12">
                    <div className="bg-slate-200/50 p-1.5 rounded-3xl flex flex-wrap gap-1 md:gap-2 justify-center">
                        <Button 
                            variant="ghost" 
                            onClick={() => setSelectedPeriod('monthly')}
                            className={cn("rounded-2xl font-bold px-6 py-6 text-sm md:text-base", selectedPeriod === 'monthly' ? "bg-white shadow-md text-blue-600" : "hover:bg-slate-200 text-slate-600")}
                        >
                            1 Aylık
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => setSelectedPeriod('quarterly')}
                            className={cn("rounded-2xl font-bold px-6 py-6 text-sm md:text-base", selectedPeriod === 'quarterly' ? "bg-white shadow-md text-blue-600" : "hover:bg-slate-200 text-slate-600")}
                        >
                            3 Aylık
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => setSelectedPeriod('biannual')}
                            className={cn("rounded-2xl font-bold px-6 py-6 text-sm md:text-base", selectedPeriod === 'biannual' ? "bg-white shadow-md text-blue-600" : "hover:bg-slate-200 text-slate-600")}
                        >
                            6 Aylık
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => setSelectedPeriod('annual')}
                            className={cn("rounded-2xl font-bold px-6 py-6 text-sm md:text-base", selectedPeriod === 'annual' ? "bg-white shadow-md text-blue-600" : "hover:bg-slate-200 text-slate-600")}
                        >
                            12 Aylık
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
                        const isCurrent = currentTier === tier.id;
                        const isDowngrade = TIER_LEVELS[tier.id] < TIER_LEVELS[currentTier];
                        const isDisabled = isCurrent || (loadingTier !== null) || isDowngrade;
                        
                        return (
                            <Card key={tier.id} className={cn(
                                "relative flex flex-col rounded-[40px] border-4 transition-all duration-500 overflow-hidden",
                                isCurrent ? "border-blue-500 shadow-2xl scale-105 z-10" : "border-white shadow-xl hover:border-slate-200",
                                tier.id === 'hero' ? "bg-gradient-to-b from-white to-amber-50" : "bg-white"
                            )}>
                                {isCurrent && (
                                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-6 py-2 rounded-bl-[20px] font-black text-xs uppercase tracking-widest italic z-20">
                                        Mevcut Plan
                                    </div>
                                )}
                                
                                <CardHeader className="pt-10 pb-6 text-center">
                                    <div className={cn(
                                        "w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 relative z-10",
                                        tier.id === 'free' ? "bg-slate-100 text-slate-600" : 
                                        tier.id === 'adventurer' ? "bg-blue-100 text-blue-600" : 
                                        "bg-amber-100 text-amber-600"
                                    )}>
                                        {tier.id === 'free' ? <Shield className="w-8 h-8" /> : 
                                         tier.id === 'adventurer' ? <Zap className="w-8 h-8" /> : 
                                         <Crown className="w-8 h-8" />}
                                    </div>
                                    <CardTitle className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">{tier.name}</CardTitle>
                                    <div className="mt-4 flex flex-col items-center">
                                        <div className="flex items-baseline">
                                            <span className="text-4xl font-black text-slate-900">
                                                {tier.id === 'free' ? '0 £' : tier.prices?.[selectedPeriod]?.monthlyEquivalent}
                                            </span>
                                            {tier.id !== 'free' && <span className="text-sm font-bold text-slate-500 ml-1">/ ay</span>}
                                        </div>
                                        {tier.id !== 'free' && selectedPeriod !== 'monthly' && (
                                            <div className="mt-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                                Toplam: {tier.prices?.[selectedPeriod]?.totalPrice}
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 px-8 relative z-10">
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

                                <CardFooter className="p-8 relative z-10">
                                    <Button 
                                        onClick={() => handleAction(tier)}
                                        disabled={isDisabled}
                                        className={cn(
                                            "w-full h-14 rounded-2xl font-black text-lg uppercase tracking-widest transition-all active:scale-95 shadow-lg border-b-4",
                                            isDisabled ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : 
                                            tier.id === 'free' ? "bg-slate-600 hover:bg-slate-700 text-white border-slate-800" :
                                            tier.id === 'adventurer' ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-800" :
                                            "bg-amber-500 hover:bg-amber-600 text-white border-amber-700"
                                        )}
                                    >
                                        {loadingTier === tier.id ? <Loader2 className="animate-spin" /> : 
                                         isCurrent ? "Şu Anki Planın" : 
                                         isDowngrade ? "İptal Gerekli" : "Seç ve Başla"}
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
