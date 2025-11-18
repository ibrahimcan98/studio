'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Crown, Zap, Star, Award, CheckCircle, Shield, Lock, Infinity as InfinityIcon } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from 'next/link';
import { addMonths } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


const premiumFeatures = [
    {
        icon: Zap,
        title: "Sınırsız Can",
        description: "Hiç bekleme, sınırsız öğrenme! Yanlış cevap verdiğinizde can düşmez.",
    },
    {
        icon: Star,
        title: "Tüm Kategorilere Erişim",
        description: "Premium kategoriler dahil tüm konulara anında erişim",
    },
    {
        icon: Award,
        title: "Özel Rozetler",
        description: "Premium üyelere özel rozetler ve ödüller kazanın",
    },
    {
        icon: Shield,
        title: "Reklamsız Deneyim",
        description: "Kesintisiz, tamamen reklamsız öğrenme ortamı",
    },
];

const comparisonData = [
    { feature: "Can Sistemi", free: "5 can / 2 saat", premium: "Sınırsız", premiumIcon: true },
    { feature: "Kategoriler", free: "Sadece ücretsiz", premium: "Tüm kategoriler", premiumIcon: true },
    { feature: "Özel Rozetler", free: "-", premium: true, premiumIcon: true },
    { feature: "Reklamsız", free: false, premium: true, premiumIcon: true },
];

const plans = [
    {
        name: "Aylık",
        price: "14 €",
        period: "/ ay",
        discount: null,
        popular: true,
    },
    {
        name: "3 Aylık",
        price: "36 €",
        period: "/ 3 ay",
        discount: "%15 indirim",
        popular: false,
    },
    {
        name: "Yıllık",
        price: "129 €",
        period: "/ yıl",
        discount: "%25 indirim",
        popular: false,
    },
];


export default function PremiumPage() {
    const { user } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, "users", user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

    useEffect(() => {
        if (!isUserDataLoading && userData?.isPremium) {
            router.replace('/ebeveyn-portali/uyelik');
        }
    }, [isUserDataLoading, userData, router]);

    const handlePurchase = async () => {
        if (!user || !db) {
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Satın alma işlemi için giriş yapmalısınız.',
            });
            router.push('/login');
            return;
        }

        setIsProcessing(true);

        const userDocRef = doc(db, 'users', user.uid);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            const now = new Date();
            const endDate = addMonths(now, 1);

            await updateDoc(userDocRef, {
                isPremium: true,
                premiumStartDate: now.toISOString(),
                premiumEndDate: endDate.toISOString(),
            });

            toast({
                title: 'Tebrikler! 🎉',
                description: 'Premium üyeliğiniz başarıyla aktif edildi.',
                className: 'bg-green-500 text-white',
            });

            router.push('/ebeveyn-portali');

        } catch (error) {
            console.error("Premium purchase error: ", error);
            toast({
                variant: 'destructive',
                title: 'Bir hata oluştu',
                description: 'Premium üyelik aktif edilirken bir sorun yaşandı. Lütfen tekrar deneyin.',
            });
        } finally {
             setIsProcessing(false);
        }
    };


    if (isUserDataLoading || userData?.isPremium) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    

    return (
        <div className="bg-sky-50/50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center space-y-4 mb-12">
                    <Crown className="w-16 h-16 text-yellow-400 mx-auto" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Premium'a Geçin</h1>
                    <p className="text-lg text-muted-foreground">Sınırsız öğrenme, tüm kategoriler ve daha fazlası</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={cn(`flex flex-col h-full transition-all shadow-lg`, plan.popular ? 'border-primary border-2 transform lg:-translate-y-4 bg-gradient-to-br from-yellow-300 to-orange-400 text-white' : 'bg-white hover:shadow-xl')}>
                            <CardHeader className="items-center text-center">
                                {plan.popular && <Badge className="mb-4 bg-white text-orange-500 hover:bg-white/90">En Popüler</Badge>}
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <div className="flex items-baseline gap-2 mt-4">
                                <span className="text-4xl font-extrabold">{plan.price}</span>
                                {plan.discount && <span className={cn("font-semibold", plan.popular ? "text-white/80" : "text-green-600")}>{plan.discount}</span>}
                                </div>
                                <CardDescription className={cn(plan.popular ? "text-white/80" : "")}>{plan.period}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className={cn("text-sm space-y-2 text-left px-4", plan.popular ? "text-white/90" : "text-muted-foreground")}>
                                     <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400"/>Sınırsız can</li>
                                     <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400"/>Tüm kategoriler açık</li>
                                     <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400"/>Özel rozetler</li>
                                     <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400"/>Reklamsız deneyim</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={cn("w-full font-bold", plan.popular ? 'bg-white text-orange-500 hover:bg-gray-100' : 'bg-primary text-primary-foreground')}
                                    onClick={handlePurchase}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <Crown className="mr-2 h-5 w-5" />
                                    )}
                                    {isProcessing ? 'İşleniyor...' : 'Şimdi Premium Ol'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>


                <div className="text-center space-y-2 mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Premium Özellikler</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {premiumFeatures.map((feature, index) => (
                        <Card key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>


                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Ücretsiz vs Premium</h2>
                </div>
                <Card className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flow-root">
                        <div className="-my-4 divide-y divide-gray-200">
                            {comparisonData.map((item) => (
                                <div key={item.feature} className="py-4 grid grid-cols-3 items-center gap-4">
                                    <p className="font-medium text-gray-700 col-span-1">{item.feature}</p>
                                    <div className="text-center col-span-1">
                                        {typeof item.free === 'boolean' ? (
                                            item.free ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <div className="w-5 h-5 font-bold text-red-400 mx-auto">-</div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">{item.free}</span>
                                        )}
                                    </div>
                                    <div className="text-center col-span-1">
                                        {item.premium === true ? (
                                            <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                                        ) : (
                                            item.premium === "Sınırsız" ? (
                                                <div className="flex items-center justify-center gap-1 font-bold text-green-600">
                                                   <InfinityIcon className="w-5 h-5"/> <span>{item.premium}</span>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-green-600 text-sm">{item.premium}</span>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                 <div className="text-center mt-12">
                    <p className="text-muted-foreground mb-2">Sorularınız mı var?</p>
                    <Button variant="outline" asChild>
                        <Link href="/#faq">SSS'yi İnceleyin</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

    