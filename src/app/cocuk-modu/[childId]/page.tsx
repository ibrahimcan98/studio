
'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, LogOut, Star, Settings, Home, User as UserIcon, Coins, Gem, Map, BookOpen, MessageCircle } from 'lucide-react';
import { TopicCard } from '@/components/child-mode/topic-card';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ExitDialog } from "@/components/child-mode/exit-dialog";
import { cn } from '@/lib/utils';
import { ChildSidebar } from '@/components/child-mode/sidebar';

// Mock veriler (Sizden başlıklar gelene kadar test için)
const MOCK_TOPICS = [
  { id: 'hayvanlar', name: 'HAYVANLAR', icon: '🦁', color: 'green', top: '250px', left: '65%', imageUrl: '/images/1-hayvanlar/1-hayvanlar.png' },
  { id: 'renkler', name: 'RENKLER', icon: '🎨', color: 'purple', top: '450px', left: '25%', imageUrl: '/images/2-renkler/2-renkler.png' },
  { id: 'vucudumuz', name: 'VÜCUDUMUZ', icon: '🖐️', color: 'orange', top: '750px', left: '65%', imageUrl: '/images/3-vucudumuz/3-vucudumuz.png' },
  { id: 'meyveler-sebzeler', name: 'MEYVELER VE SEBZELER', icon: '🍎', color: 'red', top: '1050px', left: '25%', imageUrl: '/images/4-meyvelersebzeler/4-meyvelersebzeler.png' },
  { id: 'sekiller', name: 'ŞEKİLLER', icon: '📐', color: 'blue', top: '1350px', left: '65%', imageUrl: '/images/5-sekiller/5-sekiller.png' },
  { id: 'duygular', name: 'DUYGULAR', icon: '😊', color: 'pink', top: '1650px', left: '25%', imageUrl: '/images/6-duygular/6-duygular.png' },
  { id: 'yemekler', name: 'YEMEKLER', icon: '🍲', color: 'yellow', top: '1950px', left: '65%', imageUrl: '/images/7-yemekler/7-yemekler.png' },
  { id: 'meslekler', name: 'MESLEKLER', icon: '👨‍✈️', color: 'slate', top: '2250px', left: '25%', imageUrl: '/images/8-meslekler/8-meslekler.png' },
  { id: 'uzay', name: 'UZAY', icon: '🚀', color: 'indigo', top: '2550px', left: '65%', imageUrl: '/images/9-uzay/9-uzay.png' },
  { id: 'duyu-organlari', name: 'DUYU ORGANLARI', icon: '👂', color: 'amber', top: '2850px', left: '25%', imageUrl: '/images/10-duyuorganlari/10-duyuorganlari.png' },
  { id: 'kisisel-bakim', name: 'KİŞİSEL BAKIM', icon: '🪥', color: 'cyan', top: '3150px', left: '65%', imageUrl: '/images/11-kisiselbakim/11-kisiselbakim.png' },
  { id: 'hava-durumu', name: 'HAVA DURUMU', icon: '🌤️', color: 'blue', top: '3450px', left: '25%', imageUrl: '/images/12-havadurumu/12-havadurumu.png' },
  { id: 'kiyafetler', name: 'KIYAFETLER', icon: '👕', color: 'orange', top: '3750px', left: '65%', imageUrl: '/images/13-kiyafetler/13-kiyafetler.png' },
  { id: 'mevsimler', name: 'MEVSİMLER', icon: '🍂', color: 'green', top: '4050px', left: '25%', imageUrl: '/images/14-mevsimler/14-mevsimler.png' },
  { id: 'dogum-gunu', name: 'DOĞUM GÜNÜ', icon: '🎂', color: 'pink', top: '4250px', left: '65%', imageUrl: '/images/15-dogumgunu/15-dogumgunu.png' },
  { id: 'hareket', name: 'HAREKET', icon: '🏃', color: 'orange', top: '4650px', left: '25%', imageUrl: '/images/16-hareket/16-hareket.png' },
  { id: 'deniz-canlilari', name: 'DENİZ CANLILARI', icon: '🐙', color: 'blue', top: '4950px', left: '65%', imageUrl: '/images/17-denizcanlilari/17-denizcanlilari.png' },
  { id: 'ciftlik-hayvanlari', name: 'ÇİFTLİK HAYVANLARI', icon: '🐄', color: 'green', top: '5250px', left: '25%', imageUrl: '/images/18-ciftlikhayvanlari/18-ciftlikhayvanlari.png' },
  { id: 'rakamlar', name: 'RAKAMLAR', icon: '🔢', color: 'indigo', top: '5550px', left: '65%', imageUrl: '/images/19-rakamlar/19-rakamlar.png' },
  { id: 'seyahat', name: 'SEYAHAT', icon: '✈️', color: 'cyan', top: '5850px', left: '25%', imageUrl: '/images/20-seyahat/20-seyahat.png' },
  { id: 'muzik-aletleri', name: 'MÜZİK ALETLERİ', icon: '🎸', color: 'orange', top: '6150px', left: '65%', imageUrl: '/images/21-muzikaletleri/21-muzikaletleri.png' },
  { id: 'tasitlar', name: 'TAŞITLAR', icon: '🚗', color: 'slate', top: '6450px', left: '25%', imageUrl: '/images/22-tasitlar/22-tasitlar.png' },
  { id: 'ev', name: 'EV', icon: '🏠', color: 'orange', top: '6750px', left: '65%', imageUrl: '/images/23-ev/23-ev.png' },
  { id: 'alisveris', name: 'ALIŞVERİŞ', icon: '🛒', color: 'indigo', top: '7050px', left: '25%', imageUrl: '/images/24-alisveris/24-alisveris.png' },
  { id: 'yemek-yapiyorum', name: 'YEMEK YAPIYORUM', icon: '👨‍🍳', color: 'orange', top: '7250px', left: '65%', imageUrl: '/images/25-yemekyapiyorum/25-yemekyapiyorum.png' },
  { id: 'hastalik', name: 'HASTALIK', icon: '🤒', color: 'red', top: '7650px', left: '25%', imageUrl: '/images/26-hastalik/26-hastalik.png' },
  { id: 'spor', name: 'SPOR', icon: '⚽', color: 'green', top: '7950px', left: '65%', imageUrl: '/images/27-spor/27-spor.png' },
  { id: 'yeryuzu', name: 'YERYÜZÜ', icon: '🌍', color: 'blue', top: '8250px', left: '25%', imageUrl: '/images/28-yeryuzu/28-yeryuzu.png' },
  { id: 'cihazlar', name: 'CİHAZLAR', icon: '💻', color: 'slate', top: '8650px', left: '65%', imageUrl: '/images/29-cihazlar/29-cihazlar.png' },
  { id: 'kisisel-ozellikler', name: 'KİŞİSEL ÖZELLİKLER', icon: '👤', color: 'amber', top: '8850px', left: '25%', imageUrl: '/images/30-kisilikozellikleri/30-kisiselozellik.png' },
  { id: 'sanat', name: 'SANAT', icon: '🎨', color: 'pink', top: '9150px', left: '65%', imageUrl: '/images/31-sanat/31-sanat.png' },
  { id: 'kamp', name: 'KAMP', icon: '⛺', color: 'green', top: '9450px', left: '25%', imageUrl: '/images/32-kamp/32-kamp.png' },
  { id: 'ev-isleri', name: 'EV İŞLERİ', icon: '🧹', color: 'blue', top: '9750px', left: '65%', imageUrl: '/images/33-evisleri/33-evisleri.png' },
  { id: 'vahsi-ve-evcil-hayvanlar', name: 'VAHŞİ VE EVCİL HAYVANLAR', icon: '🦁', color: 'green', top: '10050px', left: '25%', imageUrl: '/images/34-vahsiveevcilhayvanlar/34-vahsievcil.png' },
  { id: 'mekanlar', name: 'MEKANLAR', icon: '🏢', color: 'blue', top: '10250px', left: '65%', imageUrl: '/images/35-mekanlar/35-mekanlar.png' },
  { id: 'sifatlar', name: 'SIFATLAR', icon: '✨', color: 'orange', top: '10650px', left: '25%', imageUrl: '/images/36-sifatlar/36-sifatlar.png' },
];

const Cloud = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <div
    className={cn("absolute opacity-60 animate-float-slow pointer-events-none z-0", className)}
    style={style}
  >
    <div className="w-32 h-10 bg-white rounded-full relative shadow-sm">
      <div className="absolute w-16 h-16 bg-white rounded-full -top-6 left-4" />
      <div className="absolute w-20 h-20 bg-white rounded-full -top-10 right-4" />
    </div>
  </div>
);

export default function CocukModuPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser, loading: authLoading } = useUser();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const pin = localStorage.getItem(`child-pin-${childId}`);
    if (!pin) {
      router.push('/ebeveyn-portali');
    } else {
      setIsAuthenticated(true);
    }
  }, [childId, router]);

  // Kaldığı adaya odaklan
  useEffect(() => {
    if (isMounted && isAuthenticated) {
      const timer = setTimeout(() => {
        const lastTopic = localStorage.getItem('last-topic');
        if (lastTopic) {
          const element = document.getElementById(`topic-${lastTopic}`);
          if (element) {
            element.scrollIntoView({
              behavior: 'instant',
              block: 'center'
            });
          }
        }
      }, 300); // Adaların tam render olması için süreyi biraz artırdım
      return () => clearTimeout(timer);
    }
  }, [isMounted, isAuthenticated]);

  const childDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

  const level = useMemo(() => {
    if (!childData?.completedTopics) return 1;
    return Math.floor(childData.completedTopics.length / 5) + 1;
  }, [childData?.completedTopics]);

  if (!isMounted || isAuthenticated === null || childLoading || !childData) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-100">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Macera Başlıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden font-sans bg-gradient-to-b from-[#7dd3fc] via-[#bae6fd] to-[#e0f2fe] relative">

      {/* Sabit Arkaplan (Kaydırmadan Etkilenmez) */}
      <div className="absolute inset-0 z-0">
        <Cloud className="top-[15%] left-[10%] scale-50 md:scale-75" style={{ animationDelay: '0s' }} />
        <Cloud className="top-[5%] right-[20%] scale-75 md:scale-100 opacity-80" style={{ animationDelay: '2s' }} />
        <Cloud className="hidden md:block top-[40%] right-[8%] scale-50 opacity-50" style={{ animationDelay: '4s' }} />
        <Cloud className="bottom-[30%] left-[15%] scale-100 md:scale-125 opacity-40" style={{ animationDelay: '1s' }} />
        <Cloud className="bottom-[10%] right-[25%] scale-75 md:scale-90 opacity-60" style={{ animationDelay: '3s' }} />
      </div>

      <main className="h-full w-full flex flex-col md:flex-row relative z-10">

        {/* SOL PANEL: Profil ve Seviye */}
        <ChildSidebar childId={childId} childData={childData} />

        {/* ORTA ALAN: Kaydırılabilir Macera Haritası */}
        <div className="flex-1 relative order-3 md:order-2 overflow-y-auto scrollbar-hide perspective-1000 flex flex-col items-center">

          {/* Başlık Bölümü */}
          <div className="w-full flex justify-center pt-[100px] flex-shrink-0">
            <div className="absolute top-0 z-30 hover:scale-105 transition-transform duration-300 cursor-default select-none">
              <Image
                src="/macera.png"
                width={550}
                height={687}
                alt="Macera Haritası"
                className="drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)] object-contain"
                priority
              />
            </div>
          </div>

          {/* Macera Haritası İçeriği (Adalar ve Köprüler) */}
          <div className="relative w-full min-h-[11100px] flex-shrink-0">

            {/* Köprü Efektleri */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path d="M 45% 150px Q 30% 300px 25% 450px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 25% 450px Q 40% 600px 55% 750px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 750px Q 45% 900px 35% 1050px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 1050px Q 45% 1200px 55% 1350px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 1350px Q 40% 1500px 25% 1650px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 25% 1650px Q 35% 1800px 45% 1950px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 45% 1950px Q 35% 2100px 25% 2250px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 25% 2250px Q 40% 2400px 55% 2550px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 2550px Q 45% 2700px 35% 2850px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 2850px Q 45% 3000px 55% 3150px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 3150px Q 45% 3300px 35% 3450px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 3450px Q 45% 3600px 55% 3750px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 3750px Q 45% 3900px 35% 4050px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 4050px Q 45% 4200px 55% 4350px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 4350px Q 45% 4500px 35% 4650px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 4650px Q 45% 4800px 55% 4950px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 4950px Q 45% 5100px 35% 5250px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 5250px Q 45% 5400px 55% 5550px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 5550px Q 45% 5700px 35% 5850px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 5850px Q 45% 6000px 55% 6150px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 6150px Q 45% 6300px 35% 6450px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 6450px Q 45% 6600px 55% 6750px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 6750px Q 45% 6900px 35% 7050px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 7050px Q 45% 7200px 55% 7350px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 7350px Q 45% 7500px 35% 7650px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 7650px Q 45% 7800px 55% 7950px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 7950px Q 45% 8100px 35% 8250px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 8250px Q 45% 8400px 55% 8550px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 8550px Q 45% 8700px 35% 8850px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 8850px Q 45% 9000px 55% 9150px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 9150px Q 45% 9300px 35% 9450px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 9450px Q 45% 9600px 55% 9750px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 9750px Q 45% 9900px 35% 10050px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 35% 10050px Q 45% 10150px 55% 10250px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
              <path d="M 55% 10250px Q 45% 10450px 35% 10650px" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="transparent" strokeDasharray="10 10" strokeLinecap="round" filter="url(#glow)" />
            </svg>

            {/* 3D CSS Platformları */}
            {MOCK_TOPICS.map((topic, index) => (
              <div
                key={topic.id}
                id={`topic-${topic.id}`}
                className="absolute animate-float"
                style={{
                  top: topic.top,
                  left: topic.left,
                  animationDelay: `${index * 0.7}s`,
                  zIndex: 20
                }}
              >
                <TopicCard
                  topic={topic}
                  number={index + 1}
                  onClick={() => {
                    localStorage.setItem('last-topic', topic.id);
                    router.push(`/cocuk-modu/${childId}/${topic.id}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
