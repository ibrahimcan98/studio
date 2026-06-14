
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PartyPopper, ArrowRight, Loader2, ChevronLeft, Check, Globe2, Calendar, GraduationCap, Sparkles, Gamepad2, Puzzle, Mic, Bot } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Step = 'age' | 'level' | 'style' | 'final';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-child');
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>('age');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    level: '',
    ageGroup: '',
    learningStyle: ''
  });

  const nextStep = (current: Step) => {
    if (current === 'age') {
      if (!formData.ageGroup) {
        toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen bir yaş grubu seçin." });
        return;
      }
      setStep('level');
    }
  };

  const prevStep = () => {
    if (step === 'level') setStep('age');
    else if (step === 'style') setStep('level');
    else if (step === 'final') setStep('style');
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const params = new URLSearchParams({
      level: formData.level,
      age: formData.ageGroup,
      style: formData.learningStyle
    });
    router.push(`/register?${params.toString()}`);
  };

  const renderStep = () => {
    switch (step) {
      case 'age':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center relative">
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
                    setTimeout(() => setStep('level'), 250); 
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
                    setTimeout(() => setStep('style'), 250); 
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
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "ÜCRETSİZ TÜRKÇE DEĞERLENDİRMESİ ALIN"}
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
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.1] flex flex-col gap-2">
              <span>Çocuğunuz Türkçeyi anlıyor ama konuşmuyor mu?</span>
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-700 leading-[1.4] block mt-2">
                Oyun platformumuzu ve canlı derslerimizi keşfedin.
              </span>
            </h1>
            <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
              <Button 
                className="h-14 px-8 text-lg font-black bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                onClick={() => router.push('/register')}
                suppressHydrationWarning
              >
                ÜCRETSİZ KAYIT OLUN
              </Button>
            </div>
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
            
            <Card className="absolute -top-10 -left-12 transform -rotate-6 bg-accent/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border-none max-w-[180px] z-20">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-accent-foreground shrink-0" />
                <p className="text-[10px] font-black text-accent-foreground uppercase tracking-tight leading-tight">25 Farklı Ülkeden Mutlu Öğrenciler</p>
              </div>
            </Card>

            <Card className="absolute top-1/4 -right-12 transform rotate-12 bg-blue-500/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border-none flex items-center gap-2 max-w-[150px] z-20">
              <GraduationCap className="text-white w-4 h-4 shrink-0" />
              <p className="font-bold text-white text-[9px] uppercase tracking-wide">Uzman Öğretmen Kadrosu</p>
            </Card>

            <Card className="absolute bottom-1/4 -left-14 transform -rotate-12 bg-orange-500/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border-none flex items-center gap-2 max-w-[150px] z-20">
              <Calendar className="text-white w-4 h-4 shrink-0" />
              <p className="font-bold text-white text-[9px] uppercase tracking-wide">Esnek Gün ve Saatler</p>
            </Card>

            <Card className="absolute -bottom-8 -right-10 transform rotate-3 bg-emerald-500/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border-none flex items-center gap-3 z-20">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <p className="font-black text-white text-xs uppercase tracking-wider">Ücretsiz Deneme Dersi</p>
            </Card>

            {/* Yeni Oyun Modu Büyük Vurgu Kartı */}
            <Card className="absolute -left-16 lg:-left-24 bottom-20 transform -rotate-6 bg-white/95 backdrop-blur-xl p-4 rounded-[32px] shadow-2xl border-4 border-purple-500/20 flex flex-col gap-3 max-w-[240px] z-30 hover:-translate-y-2 hover:rotate-0 hover:shadow-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-orange-500 p-3 rounded-[20px] shadow-lg">
                  <Gamepad2 className="text-white w-7 h-7 shrink-0" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm tracking-tight leading-none mb-1">YENİ ÇOCUK MODU</h4>
                  <p className="text-[11px] text-purple-600 font-bold uppercase tracking-wider">Oyunlarla Türkçe</p>
                </div>
              </div>
              <div className="flex gap-2 w-full mt-1">
                 <div className="group relative flex-1 bg-purple-100 rounded-[14px] py-2 flex justify-center hover:bg-purple-200 transition-colors cursor-pointer">
                   <Puzzle className="w-5 h-5 text-purple-600"/>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">Macera Adası</div>
                 </div>
                 <div className="group relative flex-1 bg-orange-100 rounded-[14px] py-2 flex justify-center hover:bg-orange-200 transition-colors cursor-pointer">
                   <Mic className="w-5 h-5 text-orange-600"/>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">Türkçe Hazinem</div>
                 </div>
                 <div className="group relative flex-1 bg-blue-100 rounded-[14px] py-2 flex justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                   <Bot className="w-5 h-5 text-blue-600"/>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">AI Konuşma Arkadaşım</div>
                 </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
