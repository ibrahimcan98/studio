
'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Star, Flag, Brain, Globe, Sparkles } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

const curriculumGroups = [
  {
    category: "Tematik Başlangıç",
    icon: <Star className="w-4 h-4" />,
    colorClass: "bg-blue-500",
    lightColorClass: "bg-blue-50",
    textColorClass: "text-blue-700",
    topics: [
      { name: "Hayvanlar", unlocked: true },
      { name: "Renkler", unlocked: true },
      { name: "Sağlıklı Yaşam", unlocked: true }
    ]
  },
  {
    category: "Milli Değerlerimiz",
    icon: <Flag className="w-4 h-4" />,
    colorClass: "bg-red-500",
    lightColorClass: "bg-red-50",
    textColorClass: "text-red-700",
    topics: [
      { name: "Atatürk'ün Hayatı", unlocked: false },
      { name: "Milli Bayramlarımız", unlocked: false }
    ]
  },
  {
    category: "Derinleşen Dil Becerisi",
    icon: <Brain className="w-4 h-4" />,
    colorClass: "bg-purple-500",
    lightColorClass: "bg-purple-50",
    textColorClass: "text-purple-700",
    topics: [
      { name: "Okuma ve Anlama", unlocked: false },
      { name: "Atasözleri ve Deyimler", unlocked: false }
    ]
  },
  {
    category: "Kültür ve Coğrafya",
    icon: <Globe className="w-4 h-4" />,
    colorClass: "bg-emerald-500",
    lightColorClass: "bg-emerald-50",
    textColorClass: "text-emerald-700",
    topics: [
      { name: "Marmara Bölgesi", unlocked: false },
      { name: "Türkiye'nin İklimleri", unlocked: false }
    ]
  }
];

const listItems = [
  {
    title: "Pedagojik Sarmal Yapı",
    desc: "Basitten karmaşığa, her seviyede üzerine koyarak ilerleyen ve öğrenilenleri unutulmaz kılan bilimsel metodoloji."
  },
  {
    title: "Dil ve Kimlik İnşası",
    desc: "Türkçeyi sadece bir iletişim aracı olarak değil; tarihimiz, değerlerimiz ve coğrafyamızla bir 'kimlik bağı' olarak sunuyoruz."
  },
  {
    title: "Birebir Kişiselleştirilmiş Akış",
    desc: "Çocuğunuzun ilgi alanlarına ve öğrenme hızına göre adapte edilebilen, esnek ve etkileşimi yüksek ders modülleri."
  },
  {
    title: "Akademik ve Sosyal Denge",
    desc: "Hem okuma-anlama gibi akademik becerileri hem de sağlıklı yaşam gibi günlük hayat pratiklerini kapsayan zengin içerik."
  }
];

export default function MapJourney() {
  const { user } = useUser();
  const router = useRouter();

  const handleChildModeClick = () => {
    if (user) {
      router.push('/ebeveyn-portali');
    } else {
      router.push('/login');
    }
  };

  return (
    <section id="map-journey" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="container grid lg:grid-cols-2 gap-16 items-center">
        {/* SOL KISIM */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-slate-900 leading-tight">
              Türkçe Öğrenmek Bir Serüvene Dönüşüyor!
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Türkçe öğrenimi sadece kelimelerden ibaret değil. Müfredatımız, çocuğunuzun dünyayı ve kültürünü Türkçe ile keşfetmesini sağlayan tematik bir yolculuk sunar.
            </p>
          </div>

          <div className="space-y-6">
            {listItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="mt-1 bg-green-100 p-1 rounded-full shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-base">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button size="lg" className="font-black h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={handleChildModeClick}>
            <Sparkles className="mr-2 h-5 w-5 fill-current"/>
            ÇOCUK MODUNU GÖR
          </Button>
        </div>

        {/* SAĞ KISIM - HARİTA */}
        <div className="flex justify-center items-center">
          <Card className="p-8 relative bg-slate-50/50 border-slate-100 rounded-[40px] shadow-2xl overflow-hidden w-full max-w-lg border-4">
            {/* Arka plan yol çizgisi */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M100 50 C 300 150, 100 350, 300 550" stroke="hsl(var(--primary))" fill="transparent" strokeWidth="8" strokeDasharray="20 20"/>
              </svg>
            </div>

            <div className="relative space-y-8">
              <div className="text-center space-y-1 mb-8">
                <h3 className="font-black text-slate-800 text-xl tracking-tight">Öğrenme Macerası</h3>
                <div className="w-12 h-1.5 bg-primary mx-auto rounded-full" />
              </div>

              {curriculumGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-3">
                  <div className="flex items-center gap-2 px-2">
                    <div className={cn("p-1.5 rounded-lg text-white shadow-md", group.colorClass)}>
                      {group.icon}
                    </div>
                    <span className={cn("font-bold text-xs uppercase tracking-widest", group.textColorClass)}>
                      {group.category}
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {group.topics.map((topic, topicIdx) => (
                      <Card 
                        key={topicIdx} 
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border-none shadow-md transition-all hover:scale-[1.02] cursor-default",
                          topic.unlocked ? "bg-white" : "bg-slate-100 opacity-70"
                        )}
                      >
                        <span className={cn("text-sm font-bold", topic.unlocked ? "text-slate-700" : "text-slate-400")}>
                          {topic.name}
                        </span>
                        {topic.unlocked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-slate-400" />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
