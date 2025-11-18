'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Crown, Zap, Star, Award, CheckCircle, Shield, Lock, Infinity as InfinityIcon } from 'lucide-react';
import { useUser, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from 'next/link';
import { addMonths } from "date-fns";

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

export default function PremiumPage() {
    const { user } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

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

            setDocumentNonBlocking(userDocRef, { 
                isPremium: true,
                premiumStartDate: now.toISOString(),
                premiumEndDate: endDate.toISOString(),
            }, { merge: true });

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
            setIsProcessing(false);
        }
    };


    return (
        <div className="bg-sky-50/50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center space-y-4 mb-12">
                    <Crown className="w-16 h-16 text-yellow-400 mx-auto" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Premium'a Geçin</h1>
                    <p className="text-lg text-muted-foreground">Sınırsız öğrenme, tüm kategoriler ve daha fazlası</p>
                </div>

                <Card className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl shadow-2xl p-8 mb-16 text-center text-white">
                    <Crown className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <h2 className="text-3xl font-bold mb-2">Premium Üyelik</h2>
                    <p className="text-5xl font-extrabold mb-2">14 €</p>
                    <p className="text-lg opacity-80 mb-6">/ ay</p>

                    <Button
                        size="lg"
                        className="w-full max-w-sm mx-auto bg-white text-orange-500 font-bold text-lg hover:bg-gray-100 shadow-lg"
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
                    <p className="mt-4 text-sm text-white/70 flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" /> Güvenli ödeme - İstediğiniz zaman iptal
                    </p>
                </Card>

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
