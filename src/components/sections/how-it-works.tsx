
"use client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, CalendarCheck, GraduationCap, Gamepad2 } from 'lucide-react';

const steps = [
  {
    number: "1",
    title: "Kayıt Ol ve Çocuğunuzu Ekleyin",
    description: "Saniyeler içinde profilinizi oluşturun.",
    icon: <UserPlus className="w-10 h-10 text-primary" />
  },
  {
    number: "2",
    title: "Ücretsiz Deneme Dersini Planlayın",
    description: "Size uygun gün ve saati seçin.",
    icon: <CalendarCheck className="w-10 h-10 text-primary" />
  },
  {
    number: "3",
    title: "Eğitime ve Gelişime Başlayın",
    description: "Çocuğunuz canlı derslere katılsın, siz ilerlemeyi izleyin.",
    icon: <GraduationCap className="w-10 h-10 text-primary" />
  },
  {
    number: "4",
    title: "Oyun Dünyasını Keşfet",
    subtitle: "(Çok Yakında!)",
    description: "Çocuğunuz tamamen güvenli oyunlarla Türkçesini geliştirsin, puanları ve ödülleri toplasın!",
    icon: <Gamepad2 className="w-10 h-10 text-primary" />,
    isSpecial: true
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white">
      <div className="container">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-slate-900">Nasıl Çalışır?</h2>
          <p className="text-lg text-slate-500">
            Eğlenceli bir öğrenme yolculuğuna başlamak çok kolay.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((item, index) => (
            <Card key={index} className="relative p-8 pt-12 text-center border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl bg-white hover:-translate-y-1 transition-transform">
              {/* Adım Numarası (Mavi Kare) */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
                {item.number}
              </div>
              
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/5">
                {item.icon}
              </div>
              
              <CardHeader className="p-0 space-y-3">
                <CardTitle className="text-lg font-bold leading-tight text-slate-800">
                  {item.title}
                  {item.subtitle && <span className="block text-sm text-primary mt-1 font-semibold">{item.subtitle}</span>}
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 font-medium">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
