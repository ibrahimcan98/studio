'use client';

import { useState } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const PACKAGES = [
    {
        id: 'tuba_4',
        name: '4 Derslik Tanışma Paketi',
        price: '£120',
        originalPrice: '£140',
        features: [
            'Birebir Canlı Dersler',
            'Kişiye Özel Müfredat',
            'Haftalık İlerleme Takibi',
            'Eğitici Materyal Desteği'
        ],
        badge: 'En Popüler',
        color: 'blue'
    },
    {
        id: 'tuba_8',
        name: '8 Derslik Gelişim Paketi',
        price: '£220',
        originalPrice: '£280',
        features: [
            'Birebir Canlı Dersler',
            'Yoğunlaştırılmış Program',
            'Sertifika İmkanı',
            'VIP WhatsApp Desteği',
            'Özel Ödev Sistemi'
        ],
        badge: 'Avantajlı',
        color: 'emerald',
        featured: true
    }
];

export default function TubaSpecialPage() {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handlePurchase = async (pkgId: string) => {
        setLoadingId(pkgId);
        // Stripe Checkout API'ye yönlendirme simülasyonu
        setTimeout(() => {
            alert("Stripe ödeme sistemine yönlendiriliyorsunuz... (API Anahtarlarınız girildiğinde aktif olacaktır)");
            setLoadingId(null);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-rose-100 selection:text-rose-900">
            {/* Header */}
            <header className="py-8 px-6 flex justify-center">
                <Logo className="text-2xl" />
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        Özel Eğitim Programı
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                        Tuba ile <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Kişiselleştirilmiş</span><br/>Öğrenme Deneyimi
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Çocuğunuzun potansiyelini Tuba Hanım'ın rehberliğinde keşfedin. Sadece size özel hazırlanan bu programla akademik başarıyı birlikte inşa ediyoruz.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {PACKAGES.map((pkg) => (
                        <Card 
                            key={pkg.id} 
                            className={cn(
                                "relative p-8 rounded-[32px] border-none shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden",
                                pkg.featured ? "bg-slate-900 text-white scale-105" : "bg-white text-slate-900"
                            )}
                        >
                            {pkg.badge && (
                                <Badge className={cn(
                                    "absolute top-6 right-6 px-3 py-1 border-none font-bold uppercase tracking-tighter text-[10px]",
                                    pkg.featured ? "bg-rose-500 text-white" : "bg-blue-100 text-blue-600"
                                )}>
                                    {pkg.badge}
                                </Badge>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">{pkg.name}</h3>
                                    <div className="flex items-baseline gap-2 mt-4">
                                        <span className="text-4xl font-black">{pkg.price}</span>
                                        <span className="text-sm line-through opacity-40 font-bold">{pkg.originalPrice}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {pkg.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                                pkg.featured ? "bg-rose-500/20 text-rose-400" : "bg-blue-50 text-blue-500"
                                            )}>
                                                <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                            <span className="text-sm font-semibold opacity-90">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button 
                                    onClick={() => handlePurchase(pkg.id)}
                                    disabled={loadingId === pkg.id}
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl",
                                        pkg.featured 
                                            ? "bg-rose-500 hover:bg-rose-600 text-white" 
                                            : "bg-slate-900 hover:bg-slate-800 text-white"
                                    )}
                                >
                                    {loadingId === pkg.id ? 'Hazırlanıyor...' : 'HEMEN BAŞLA'}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-16">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-rose-500">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800">Güvenli Ödeme</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Stripe altyapısı ile kart bilgileriniz 256-bit SSL ile korunur.</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-orange-500">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800">Butik Deneyim</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Kitlelere değil, bireylere odaklanan özel eğitim yaklaşımı.</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-500">
                            <Star className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800">Uzman Rehberlik</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Tuba Hanım'ın yıllara dayanan pedagojik tecrübesiyle.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
