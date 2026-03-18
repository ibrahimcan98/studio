
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PartyPopper, ArrowRight, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-child');
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contact: ''
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Lütfen isim ve iletişim bilgilerinizi girin."
      });
      return;
    }

    setIsSubmitting(true);
    // Simüle edilen işlem: Bilgileri alıp kayıt sayfasına yönlendiriyoruz
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/register?name=${encodeURIComponent(formData.name)}&contact=${encodeURIComponent(formData.contact)}`);
    }, 1000);
  };

  return (
    <section className="relative w-full bg-amber-50/50 overflow-x-clip">
      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-16 md:py-28">
        <div className="space-y-8 text-center lg:text-left min-w-0">
          <div className="space-y-4">
            <span className="inline-block text-primary font-black tracking-[0.2em] text-xs md:text-sm uppercase">
              ÇOCUKLAR İÇİN ÇEVRİMİÇİ TÜRKÇE DERSLER
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Çocuğunuz Türkçeyi Uzman Öğretmenlerle, Eğlenerek ve Canlı Derslerle Öğrensin.
            </h1>
          </div>

          {/* Hızlı Kayıt Formu */}
          <Card className="p-6 md:p-8 bg-white shadow-2xl border-none rounded-[32px] max-w-md mx-auto lg:mx-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
            <form onSubmit={handleFormSubmit} className="relative z-10 space-y-4">
              <div className="space-y-2 text-left">
                <h3 className="font-bold text-slate-800">Hemen Ücretsiz Deneme Planla</h3>
                <p className="text-xs text-slate-400 font-medium">Bilgilerini bırak, eğitim danışmanımız seni arasın.</p>
              </div>
              <div className="space-y-3">
                <Input 
                  placeholder="Adınız Soyadınız" 
                  className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary/20 font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  suppressHydrationWarning
                />
                <Input 
                  placeholder="Telefon veya E-posta" 
                  className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary/20 font-medium"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  suppressHydrationWarning
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-black rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95"
                disabled={isSubmitting}
                suppressHydrationWarning
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>ÜCRETSİZ DENEME DERSİ AL <ArrowRight className="ml-2 w-5 h-5" /></>
                )}
              </Button>
            </form>
          </Card>
        </div>

        <div className="relative flex justify-center h-full min-h-[400px] lg:min-h-[600px]">
          <div className="relative w-[300px] h-[400px] lg:w-[450px] lg:h-[600px]">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="rounded-[40px] object-cover shadow-2xl transform rotate-2"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
            <Card className="absolute -top-6 -left-10 transform -rotate-12 bg-accent/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border-none">
              <p className="text-2xl font-black text-accent-foreground tracking-tighter">+50 XP</p>
            </Card>
            <Card className="absolute -bottom-6 -right-8 transform rotate-6 bg-emerald-500/90 backdrop-blur-sm p-5 rounded-2xl shadow-xl border-none flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <PartyPopper className="text-white w-6 h-6" />
              </div>
              <p className="font-black text-white text-sm uppercase tracking-wider">Konu tamamlandı!</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
