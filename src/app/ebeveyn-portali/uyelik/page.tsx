'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, updateDoc, collection } from 'firebase/firestore';
import { Loader2, Crown, ArrowLeft, Check, Zap, Shield, RefreshCw, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { SUBSCRIPTION_TIERS, SubscriptionTier, TierDetails, BillingPeriod, ChildCount } from '@/constants/subscriptions';
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
    const [childCount, setChildCount] = useState<ChildCount>(1);
    const [downgradeTier, setDowngradeTier] = useState<TierDetails | null>(null);

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    const childrenRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return collection(db, 'users', user.uid, 'children');
    }, [user, db]);
    const { data: childrenListNullable, isLoading: isChildrenLoading } = useCollection(childrenRef);
    const childrenList = childrenListNullable || [];

    const subscriptionChildLimit = userData?.subscriptionChildLimit || 1;
    const subscriptionChildIds = userData?.subscriptionChildIds || [];

    useEffect(() => {
        if (!userDocRef || childrenList.length === 0) return;
        const currentTier = userData?.subscriptionTier || 'free';
        
        if (currentTier !== 'free' && childrenList.length <= subscriptionChildLimit) {
            const allIds = childrenList.map((c: any) => c.id);
            const needsUpdate = allIds.some((id: string) => !subscriptionChildIds.includes(id));
            if (needsUpdate) {
                updateDoc(userDocRef, { subscriptionChildIds: allIds }).catch(console.error);
            }
        }
    }, [childrenList, subscriptionChildLimit, subscriptionChildIds, userData?.subscriptionTier, userDocRef]);

    const handleToggleChildPremium = async (childId: string) => {
        if (!userDocRef) return;
        
        let newIds = [...subscriptionChildIds];
        if (newIds.includes(childId)) {
            toast({ variant: 'destructive', title: 'Uyarı', description: 'Premium ataması yapıldıktan sonra iptal edilemez veya değiştirilemez.' });
            return;
        } else {
            if (newIds.length >= subscriptionChildLimit) {
                toast({ variant: 'destructive', title: 'Limit Doldu', description: `En fazla ${subscriptionChildLimit} çocuğa atama yapabilirsiniz. Lütfen önce bir atamayı kaldırın.` });
                return;
            }
            newIds.push(childId);
        }

        try {
            await updateDoc(userDocRef, { subscriptionChildIds: newIds });
            toast({ title: 'Başarılı', description: 'Lisans ataması güncellendi.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Güncelleme başarısız oldu.' });
        }
    };

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
                if (userData?.stripeSubscriptionId && userData?.stripeCustomerId) {
                    const response = await fetch('/api/create-portal-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            customerId: userData.stripeCustomerId,
                            subscriptionId: userData.stripeSubscriptionId
                        })
                    });
                    const data = await response.json();
                    if (data.url) {
                        window.location.href = data.url;
                    }
                } else {
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
                }
            } catch (error) {
                toast({ variant: 'destructive', title: 'Hata', description: 'Plan güncellenirken bir hata oluştu.' });
            } finally {
                setLoadingTier(null);
            }
            return;
        }

        const priceObj = tier.prices?.[childCount]?.[selectedPeriod];
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
                    selectedPeriod: selectedPeriod,
                    childCount: childCount,
                    stripeSubscriptionId: userData?.stripeSubscriptionId,
                    stripeCustomerId: userData?.stripeCustomerId
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
    const currentPeriod = (userData?.subscriptionPeriod as BillingPeriod) || 'monthly';
    const currentChildLimit = (userData?.subscriptionChildLimit as number) || 1;
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
                        {!isCancelledAtPeriodEnd && !isManual && (
                            <div className="mb-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3 text-slate-600 text-sm font-medium shadow-sm items-center">
                                <AlertTriangle className="w-6 h-6 shrink-0 text-slate-400" />
                                <p>ÖNEMLİ: Aboneliğinizi iptal etmediğiniz takdirde fatura dönemi sonunda hesabınızdan otomatik olarak para çekilecektir.</p>
                            </div>
                        )}
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
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                                İptal Edilecek
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
                                            <span className="text-orange-600 font-bold leading-tight">
                                                Son kullanım tarihi: {periodEnd ? format(periodEnd, 'dd MMMM yyyy', { locale: tr }) : 'Dönem sonu'}
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

                            <div className="relative z-10 w-full md:w-auto flex justify-end gap-3">
                                {isManual && (
                                    <Button 
                                        onClick={async () => {
                                            if (userDocRef) {
                                                await updateDoc(userDocRef, { 
                                                    subscriptionTier: 'free', 
                                                    isPremium: false,
                                                    stripeSubscriptionId: null,
                                                    subscriptionPeriodEnd: null 
                                                });
                                                toast({ title: 'Plan Sıfırlandı', description: 'Hesabınız ücretsiz plana çekildi.' });
                                            }
                                        }}
                                        variant="outline"
                                        size="lg"
                                        className="rounded-2xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 hover:text-red-700 h-14 px-8"
                                    >
                                        Manuel İptal Et
                                    </Button>
                                )}
                                {!isManual && userData?.stripeCustomerId && (
                                    <>

                                        <Button 
                                            onClick={async () => {
                                                if (userDocRef) {
                                                    if (isCancelledAtPeriodEnd) {
                                                        await updateDoc(userDocRef, { 
                                                            subscriptionCancelledAtPeriodEnd: false
                                                        });
                                                    } else {
                                                        await updateDoc(userDocRef, { 
                                                            subscriptionCancelledAtPeriodEnd: true
                                                        });
                                                    }
                                                }
                                            }}
                                            variant="outline"
                                            size="lg"
                                            className="rounded-2xl border-2 border-amber-200 text-amber-600 font-bold hover:bg-amber-50 hover:text-amber-700 h-14 px-8"
                                        >
                                            {isCancelledAtPeriodEnd ? 'Aboneliği Geri Aç (Test)' : 'İptal Tasarımını Gör (Test)'}
                                        </Button>
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
                                    </>
                                )}
                            </div>
                        </div>

                        {isCancelledAtPeriodEnd && (
                             <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 text-sm font-medium shadow-sm">
                                <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600 mt-0.5" />
                                <p>Aboneliğinizi iptal ettiniz. Ancak iptal işlemi hemen uygulanmaz; fatura dönemi sonuna kadar tüm ayrıcalıklardan kesintisiz faydalanmaya devam edebilirsiniz. Herhangi bir ek ücret kesilmeyecektir.</p>
                             </div>
                        )}

                        {/* PREMIUM LISANS YONETIMI */}
                        {childrenList.length > subscriptionChildLimit && (
                            <div className="mt-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 uppercase italic">Premium Lisans Yönetimi</h3>
                                    <p className="text-slate-500 font-medium mt-1">Paketinizi çocuklarınız arasında paylaştırın.</p>
                                </div>
                                <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100">
                                    Kullanılan: {subscriptionChildIds.length} / {subscriptionChildLimit}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {childrenList.map((child: any) => {
                                    const isAssigned = subscriptionChildIds.includes(child.id);
                                    return (
                                        <div key={child.id} className={cn("p-4 rounded-2xl border-2 transition-all", isAssigned ? "border-blue-500 bg-blue-50/50" : "border-slate-200 bg-slate-50")}>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${child.id}`} alt="avatar" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 line-clamp-1">{child.firstName}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{isAssigned ? 'Premium Aktif' : 'Ücretsiz Plan'}</p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    onClick={() => !isAssigned && handleToggleChildPremium(child.id)}
                                                    variant={isAssigned ? "default" : "outline"}
                                                    className={cn("rounded-xl font-bold ml-2", isAssigned ? "bg-blue-600 hover:bg-blue-700 text-white cursor-default" : "text-slate-600 hover:bg-slate-200")}
                                                >
                                                    {isAssigned ? "Atandı" : "Ata"}
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                                {childrenList.length === 0 && (
                                    <div className="col-span-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-500 font-medium">
                                        Henüz çocuk profili eklemediniz. Çocuğunuzu ekledikten sonra lisans ataması yapabilirsiniz.
                                    </div>
                                )}
                            </div>
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

                <div className="flex flex-col items-center gap-6 mb-12">
                    {/* Çocuk Sayısı Seçimi */}
                    <div className="bg-slate-200/50 p-1.5 rounded-3xl flex flex-wrap gap-1 md:gap-2 justify-center">
                        {[1, 2, 3].map((num) => (
                            <Button 
                                key={`child-${num}`}
                                variant="ghost" 
                                onClick={() => setChildCount(num as ChildCount)}
                                className={cn("rounded-2xl font-bold px-6 py-4 text-sm md:text-base", childCount === num ? "bg-white shadow-md text-blue-600" : "hover:bg-slate-200 text-slate-600")}
                            >
                                {num} Çocuk
                            </Button>
                        ))}
                    </div>

                    {/* Plan Süresi Seçimi */}
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
                            onClick={() => setSelectedPeriod('annual')}
                            className={cn("rounded-2xl font-bold px-6 py-6 text-sm md:text-base", selectedPeriod === 'annual' ? "bg-white shadow-md text-blue-600" : "hover:bg-slate-200 text-slate-600")}
                        >
                            12 Aylık
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
                        const priceObj = tier.id !== 'free' ? tier.prices?.[childCount]?.[selectedPeriod] : null;
                        const isCurrent = currentTier === tier.id && (tier.id === 'free' || (selectedPeriod === currentPeriod && childCount === currentChildLimit));
                        
                        // Downgrade engelleme mantığı:
                        // 1. Daha düşük pakete geçiş (Örn: Kahraman -> Maceracı)
                        // 2. Aynı paket ama daha az çocuk (Örn: 3 Çocuk -> 1 Çocuk)
                        // 3. Aynı paket, aynı çocuk sayısı ama Yıllık -> Aylık geçiş
                        const isDowngrade = TIER_LEVELS[tier.id] < TIER_LEVELS[currentTier] ||
                                            (TIER_LEVELS[tier.id] === TIER_LEVELS[currentTier] && childCount < currentChildLimit) ||
                                            (TIER_LEVELS[tier.id] === TIER_LEVELS[currentTier] && childCount === currentChildLimit && selectedPeriod === 'monthly' && currentPeriod === 'annual');
                                            
                        const isDisabled = isCurrent || (loadingTier !== null);
                        
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
                                        <div className="flex items-baseline flex-wrap justify-center gap-x-2">
                                            {tier.id !== 'free' && priceObj?.originalPrice && (
                                                <span className="text-xl font-bold text-slate-400 line-through decoration-2 decoration-red-400/50">
                                                    {priceObj.originalPrice}
                                                </span>
                                            )}
                                            <span className="text-4xl font-black text-slate-900">
                                                {tier.id === 'free' ? '0 £' : priceObj?.monthlyEquivalent}
                                            </span>
                                            {tier.id !== 'free' && <span className="text-sm font-bold text-slate-500">/ ay</span>}
                                        </div>
                                        {tier.id !== 'free' && selectedPeriod !== 'monthly' && (
                                            <div className="mt-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                                Toplam: {priceObj?.totalPrice}
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
                                        onClick={() => {
                                            if (isDowngrade) {
                                                setDowngradeTier(tier);
                                            } else {
                                                handleAction(tier);
                                            }
                                        }}
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
                                         isDowngrade ? (tier.id === 'free' ? "İptal Et" : "Plana Düş") : "Seç ve Başla"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <AlertDialog open={downgradeTier !== null} onOpenChange={(open) => !open && setDowngradeTier(null)}>
                <AlertDialogContent className="rounded-[32px] sm:rounded-[40px] p-6 sm:p-8">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mb-4 rotate-3 shadow-sm mx-auto sm:mx-0">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black text-slate-800 text-center sm:text-left">
                            {downgradeTier?.id === 'free' ? 'Aboneliği İptal Etmek Üzeresiniz' : 'Planı Düşürmek Üzeresiniz'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-slate-600 font-medium text-center sm:text-left mt-3">
                            <span className="font-bold text-slate-800 uppercase">{downgradeTier?.name}</span> planına geçiş yapıyorsunuz. İşlemi onaylarsanız güvenli bir şekilde değişiklikleri tamamlamanız için Stripe portalına yönlendirileceksiniz. Onaylıyor musunuz?
                        </AlertDialogDescription>
                        
                        {downgradeTier?.id !== 'free' && (
                            <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-xl text-sm border border-amber-200 text-left">
                                <strong className="block mb-1">💡 Lütfen Unutmayın:</strong>
                                Stripe güvenlik ekranında <strong>"Abone ol ve öde"</strong> yazsa dahi, paket düşürme işlemi yaptığınız için <strong>bugün kartınızdan hiçbir ücret ÇEKİLMEYECEKTİR.</strong> Yeni paketinizin daha düşük olan ücreti, mevcut fatura ayınız bittikten sonra (gelecek ay) kesilmeye başlanacaktır.
                            </div>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 flex gap-3 sm:gap-4 flex-col sm:flex-row">
                        <AlertDialogCancel disabled={loadingTier !== null} className="rounded-2xl h-14 font-black uppercase text-slate-500 border-2 hover:bg-slate-100 flex-1 m-0">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                if (downgradeTier) {
                                    handleAction(downgradeTier);
                                    setDowngradeTier(null);
                                }
                            }}
                            className="rounded-2xl h-14 font-black uppercase bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 border-b-4 border-red-700 active:translate-y-1 active:border-b-0 flex-1 m-0"
                        >
                            Onaylıyorum
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
