'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopicCard } from '@/components/child-mode/topic-card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Sparkles, Gamepad2, Info } from 'lucide-react';

// Mock veriler
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

export default function OgretmenOyunlarPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
        const lastTopic = localStorage.getItem('last-demo-topic');
        if (lastTopic) {
            const element = document.getElementById(`topic-${lastTopic}`);
            if (element) {
                element.scrollIntoView({
                    behavior: 'instant',
                    block: 'center'
                });
            }
        }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="h-[calc(100vh-81px)] w-full overflow-hidden scrollbar-hide font-sans bg-gradient-to-b from-[#7dd3fc] via-[#bae6fd] to-[#e0f2fe] relative">
      
      {/* Sabit Arkaplan (Kaydırmadan Etkilenmez) */}
      <div className="absolute inset-0 z-0">
        <Cloud className="top-[15%] left-[10%] scale-50 md:scale-75" style={{ animationDelay: '0s' }} />
        <Cloud className="top-[5%] right-[20%] scale-75 md:scale-100 opacity-80" style={{ animationDelay: '2s' }} />
        <Cloud className="hidden md:block top-[40%] right-[8%] scale-50 opacity-50" style={{ animationDelay: '4s' }} />
        <Cloud className="bottom-[30%] left-[15%] scale-100 md:scale-125 opacity-40" style={{ animationDelay: '1s' }} />
        <Cloud className="bottom-[10%] right-[25%] scale-75 md:scale-90 opacity-60" style={{ animationDelay: '3s' }} />
      </div>

      <main className="h-full w-full flex flex-col md:flex-row relative z-10 overflow-hidden scrollbar-hide">
        
        {/* SOL PANEL: Demo Bilgi */}
        <aside className="w-16 md:w-64 shrink-0 bg-white/40 backdrop-blur-xl border-r border-white/60 flex flex-col items-center py-8 relative z-50 shadow-2xl transition-all duration-300 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/50 rounded-bl-full -z-10 blur-xl" />
            
            {/* Profil Görseli */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-sky-200/50 rounded-[2rem] blur-md animate-pulse" />
                <div className="w-12 h-12 md:w-28 md:h-28 bg-gradient-to-br from-white to-sky-50 rounded-[1.5rem] md:rounded-[2rem] shadow-xl flex items-center justify-center border-4 border-white relative z-10 overflow-hidden">
                    <Gamepad2 className="w-8 h-8 md:w-16 md:h-16 text-sky-500" />
                </div>
            </div>

            <div className="hidden md:flex flex-col items-center w-full px-4 text-center">
                <h2 className="text-xl font-black text-slate-800 drop-shadow-sm mb-1 uppercase">
                    Öğretmen Modu
                </h2>
                <div className="flex items-center gap-1.5 bg-sky-100/80 px-3 py-1 rounded-full border border-sky-200">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-xs font-bold text-sky-700 tracking-wider">Tüm Kilitler Açık</span>
                </div>
                
                <div className="mt-8 p-4 bg-white/60 rounded-2xl border-2 border-white text-sm text-slate-600 font-medium">
                    <Info className="w-5 h-5 text-sky-500 mx-auto mb-2" />
                    Bu alan öğrencilerinize veya velilerinize oyunları göstermeniz için tasarlanmıştır. Yaptığınız ilerlemeler kaydedilmez.
                </div>
            </div>
        </aside>

        {/* ORTA ALAN: Kaydırılabilir Macera Haritası */}
        <div className="flex-1 relative order-3 md:order-2 overflow-y-auto scrollbar-hide perspective-1000 flex flex-col items-center">
          {/* Başlık Bölümü */}
          <div className="w-full flex justify-center pt-8 md:pt-[100px] flex-shrink-0">
            <div className="relative md:absolute top-0 z-30 hover:scale-105 transition-transform duration-300 cursor-default select-none px-4">
              <Image
                src="/macera.png"
                width={550}
                height={687}
                alt="Macera Haritası"
                className="drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)] object-contain w-[280px] md:w-[550px]"
                priority
              />
            </div>
          </div>

          {/* Macera Haritası İçeriği (Adalar ve Köprüler) */}
          <div className="relative w-full min-h-[11100px] flex-shrink-0">
            {/* Masaüstü Köprü Efektleri */}
            <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
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

            {/* Mobil Köprü Efektleri */}
            <svg className="block md:hidden absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
              <path d="M 45% 150px Q 30% 300px 15% 450px" stroke="rgba(255,255,255,0.3)" strokeWidth="4" fill="transparent" strokeDasharray="8 8" strokeLinecap="round" />
              <path d="M 15% 450px Q 40% 600px 65% 750px" stroke="rgba(255,255,255,0.3)" strokeWidth="4" fill="transparent" strokeDasharray="8 8" strokeLinecap="round" />
              <path d="M 65% 750px Q 45% 900px 15% 1050px" stroke="rgba(255,255,255,0.3)" strokeWidth="4" fill="transparent" strokeDasharray="8 8" strokeLinecap="round" />
            </svg>

            {/* 3D CSS Platformları (Hepsi Açık) */}
            {MOCK_TOPICS.map((topic, index) => {
              return (
                <div
                  key={topic.id}
                  id={`topic-${topic.id}`}
                  className="absolute island-container animate-float"
                  style={{
                    top: topic.top,
                    '--desktop-left': topic.left,
                    '--mobile-left': topic.left === '65%' ? '55%' : '5%',
                    animationDelay: `${index * 0.7}s`,
                    zIndex: 20
                  } as any}
                >
                  <TopicCard
                    topic={topic}
                    number={index + 1}
                    isLocked={false}
                    isPremiumLocked={false}
                    isCompleted={true}
                    onClick={() => {
                        localStorage.setItem('last-demo-topic', topic.id);
                        router.push(`/ogretmen-portali/oyunlar/${topic.id}`);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .island-container {
          left: var(--desktop-left);
          transition: left 0.5s ease-in-out;
        }
        @media (max-width: 768px) {
          .island-container {
            left: var(--mobile-left) !important;
          }
        }
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
