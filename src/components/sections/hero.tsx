
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PartyPopper, ArrowRight, Loader2, ChevronLeft, Check } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Step = 'name' | 'level' | 'age' | 'style' | 'final';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-child');
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>('name');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    childName: '',
    gender: '' as 'erkek' | 'kiz' | '',
    level: '',
    ageGroup: '',
    learningStyle: ''
  });

  const nextStep = (current: Step) => {
    if (current === 'name') {
      if (!formData.childName || !formData.gender) {
        toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen çocuğun adını ve cinsiyetini seçin." });
        return;
      }
      setStep('level');
    }
  };

  const prevStep = () => {
    if (step === 'level') setStep('name');
    else if (step === 'age') setStep('level');
    else if (step === 'style') setStep('age');
    else if (step === 'final') setStep('style');
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const params = new URLSearchParams({
      name: formData.childName,
      gender: formData.gender,
      level: formData.level,
      age: formData.ageGroup,
      style: formData.learningStyle
    });
    router.push(`/register?${params.toString()}`);
  };

  const renderStep = () => {
    switch (step) {
      case 'name':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center relative">
              <h3 className="text-lg font-bold text-[#243B53]">Çocuğun adı</h3>
            </div>
            <div className="space-y-4">
              <Input 
                placeholder="Ad" 
                className="h-12 rounded-2xl border-2 border-slate-200 bg-white text-sm px-6 focus:ring-primary/20"
                value={formData.childName}
                onChange={(e) => setFormData(prev => ({...prev, childName: e.target.value}))}
                suppressHydrationWarning
              />
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-12 rounded-2xl border-2 text-sm font-medium transition-all",
                    formData.gender === 'erkek' ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-600"
                  )}
                  onClick={() => setFormData(prev => ({...prev, gender: 'erkek'}))}
                  suppressHydrationWarning
                >
                  Erkek
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-12 rounded-2xl border-2 text-sm font-medium transition-all",
                    formData.gender === 'kiz' ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-600"
                  )}
                  onClick={() => setFormData(prev => ({...prev, gender: 'kiz'}))}
                  suppressHydrationWarning
                >
                  Kız
                </Button>
              </div>
            </div>
            <Button 
              className="w-full h-12 text-sm font-bold rounded-2xl bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all mt-4"
              onClick={() => nextStep('name')}
              suppressHydrationWarning
            >
              Devam
            </Button>
          </div>
        );

      case 'level':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-slate-500 text-white hover:bg-slate-600 h-8 w-8 shrink-0" onClick={prevStep} suppressHydrationWarning>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-lg font-bold text-[#243B53]">Türkçe seviyesi nedir?</h3>
            </div>
            <div className="space-y-3">
              {[
                { id: 'new', label: 'Hiç bilmiyor / Yeni başlıyor' },
                { id: 'mid', label: 'Anlıyor ama konuşamıyor' },
                { id: 'fluent', label: 'Akıcı konuşuyor (Destek gerekiyor)' }
              ].map((opt) => (
                <Button
                  key={opt.id}
                  variant="outline"
                  className={cn(
                    "w-full h-14 justify-start px-6 rounded-2xl border-2 text-left whitespace-normal",
                    formData.level === opt.id ? "border-primary bg-primary/5" : "border-slate-100"
                  )}
                  onClick={() => { 
                    setFormData(prev => ({...prev, level: opt.id})); 
                    setTimeout(() => setStep('age'), 250); 
                  }}
                  suppressHydrationWarning
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", formData.level === opt.id ? "border-primary bg-primary" : "border-slate-300")}>
                      {formData.level === opt.id && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="font-medium text-slate-700 text-sm">{opt.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 'age':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-slate-500 text-white hover:bg-slate-600 h-8 w-8 shrink-0" onClick={prevStep} suppressHydrationWarning>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-lg font-bold text-[#243B53]">Çocuğunuz kaç yaşında?</h3>
            </div>
            <div className="space-y-3">
              {[
                { id: '4-6', label: '4-6 Yaş (Okul öncesi)' },
                { id: '7-10', label: '7-10 Yaş (İlkokul)' },
                { id: '11-14', label: '11-14 Yaş (Ortaokul)' }
              ].map((opt) => (
                <Button
                  key={opt.id}
                  variant="outline"
                  className={cn(
                    "w-full h-14 justify-start px-6 rounded-2xl border-2 text-left",
                    formData.ageGroup === opt.id ? "border-primary bg-primary/5" : "border-slate-100"
                  )}
                  onClick={() => { 
                    setFormData(prev => ({...prev, ageGroup: opt.id})); 
                    setTimeout(() => setStep('style'), 250); 
                  }}
                  suppressHydrationWarning
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", formData.ageGroup === opt.id ? "border-primary bg-primary" : "border-slate-300")}>
                      {formData.ageGroup === opt.id && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="font-medium text-slate-700 text-sm">{opt.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-slate-500 text-white hover:bg-slate-600 h-8 w-8 shrink-0" onClick={prevStep} suppressHydrationWarning>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-lg font-bold text-[#243B53]">Öğrenme tarzı nasıldır?</h3>
            </div>
            <div className="space-y-3">
              {[
                { id: 'fun', label: 'Oyun ve eğlence odaklı' },
                { id: 'structured', label: 'Disiplinli ve yapılandırılmış' },
                { id: 'visual', label: 'Hikayeler ve görsel içeriklerle' }
              ].map((opt) => (
                <Button
                  key={opt.id}
                  variant="outline"
                  className={cn(
                    "w-full h-14 justify-start px-6 rounded-2xl border-2 text-left whitespace-normal",
                    formData.learningStyle === opt.id ? "border-primary bg-primary/5" : "border-slate-100"
                  )}
                  onClick={() => { 
                    setFormData(prev => ({...prev, learningStyle: opt.id})); 
                    setTimeout(() => setStep('final'), 250); 
                  }}
                  suppressHydrationWarning
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", formData.learningStyle === opt.id ? "border-primary bg-primary" : "border-slate-300")}>
                      {formData.learningStyle === opt.id && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="font-medium text-slate-700 text-sm">{opt.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 'final':
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <PartyPopper className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#243B53]">Harika!</h3>
            <p className="text-slate-600 text-sm leading-relaxed px-4">
              Çocuğunuzun dünyasına uygun eğlenceli bir öğrenme serüveni başlamak üzere. 
              Ücretsiz tanışma dersinizi ayırtmak için hesabınızı oluşturun.
            </p>
            <Button 
              className="w-full h-12 text-sm font-black rounded-2xl shadow-xl shadow-primary/20 transition-transform active:scale-95 mt-2"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              suppressHydrationWarning
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "HESABIMI OLUŞTUR"}
            </Button>
            <Button variant="ghost" className="text-slate-400 text-xs" onClick={prevStep} suppressHydrationWarning>
              Geri Dön
            </Button>
          </div>
        );
    }
  };

  return (
    <section className="relative w-full bg-amber-50/50 overflow-x-clip">
      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-16 md:py-28">
        <div className="space-y-8 text-center lg:text-left min-w-0">
          <div className="space-y-4">
            <span className="inline-block text-primary font-black tracking-[0.2em] text-xs md:text-sm uppercase">
              ÇOCUKLAR İÇİN ÇEVRİMİÇİ TÜRKÇE DERSLER
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Çocuğunuz Türkçeyi Uzman Öğretmenlerle, Eğlenerek ve Canlı Derslerle Öğrensin.
            </h1>
          </div>

          <Card className="p-8 bg-white shadow-2xl border-none rounded-[40px] w-full mx-auto lg:mx-0 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              {renderStep()}
            </div>
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
              <p className="text-xl font-black text-accent-foreground tracking-tighter">+50 XP</p>
            </Card>
            <Card className="absolute -bottom-6 -right-8 transform rotate-6 bg-emerald-500/90 backdrop-blur-sm p-5 rounded-2xl shadow-xl border-none flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <PartyPopper className="text-white w-6 h-6" />
              </div>
              <p className="font-black text-white text-xs uppercase tracking-wider">Konu tamamlandı!</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
