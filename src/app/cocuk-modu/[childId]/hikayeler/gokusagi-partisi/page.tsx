'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Loader2, BookOpen, Volume2, Smartphone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/use-tts';
import useEmblaCarousel from 'embla-carousel-react';
import { BadgeUnlockModal } from '@/components/child-mode/badge-unlock-modal';

// Hikaye İçeriği
const storyContent = [
  { id: 1, image: "/hikayeler/4-gokusagi-partisi/1.png", text: "Ormanda hava çok güzeldi. Ağaçların yaprakları hafif hafif sallanıyor, kuşlar neşeyle ötüyordu. Maymun Mimo, her zamanki gibi yüksek bir dala çıkmış, etrafı izliyordu. Tam o sırada burnuna serin bir yağmur damlası düştü." },
  { id: 2, image: "/hikayeler/4-gokusagi-partisi/2.png", text: "Mimo çok heyecanlandı. Çünkü ormanda herkes şunu bilirdi: Yağmur yağar, sonra güneş çıkarsa gökkuşağı görünürdü. İşte o zaman bütün hayvanlar Gökkuşağı Partisi için orman meydanında toplanırdı." },
  { id: 3, image: "/hikayeler/4-gokusagi-partisi/3.png", text: "Yağmur kısa süre sonra dindi. Bulutların arasından güneş çıktı. Mimo sevinçle, “Haydi, meydana!” diye bağırdı. Hayvanlar birer birer orman meydanına gelmeye başladı." },
  { id: 4, image: "/hikayeler/4-gokusagi-partisi/4.png", text: "Meydanda herkes gökyüzüne baktı. Ama ortada bir sorun vardı. Gökkuşağı görünmüyordu. Tavşan Tumi şaşkınlıkla, “Ama güneş çıktı,” dedi. Fil Fufu da, “Yağmur da yağdı,” diye ekledi." },
  { id: 5, image: "/hikayeler/4-gokusagi-partisi/5.png", text: "Herkes heyecanla tartışmaya başladı. Kimse gökkuşağının neden gelmediğini anlayamadı. O sırada akıllı sincap Sisi sessizce oturdu, düşündü, etrafa baktı. Birden gözleri parladı. “Buldum!” dedi." },
  { id: 6, image: "/hikayeler/4-gokusagi-partisi/6.png", text: "Sisi, “Belki de gökyüzüne biraz renk göndermemiz gerekiyor,” dedi. Sonra çalışkan arı Bibi’yi çağırdı. “Rengarenk çiçeklerden polen toplamalısın. Kırmızı, sarı, mavi, mor… Ne kadar renk varsa hepsini getir lütfen!”" },
  { id: 7, image: "/hikayeler/4-gokusagi-partisi/7.png", text: "Bibi hemen arkadaşlarını topladı. Arılar vızır vızır çalışmaya başladı. Çiçekten çiçeğe uçtular, rengarenk polenleri dikkatle topladılar." },
  { id: 8, image: "/hikayeler/4-gokusagi-partisi/8.png", text: "Bir süre sonra her şey hazırdı. Sisi, meydana büyük bir taşın üstüne çıktı. Eline ince bir dal aldı. Tıpkı bir orkestra şefi gibi duruyordu. “Şimdi hep birlikte ona kadar sayacağız,” dedi." },
  { id: 9, image: "/hikayeler/4-gokusagi-partisi/9.png", text: "Sisi elindeki dalı havaya kaldırdı. Bütün orman hep bir ağızdan saymaya başladı: “Bir, iki, üç, dört, beş, altı, yedi, sekiz, dokuz, on!” “Şimdi!” diye bağırdı Sisi. Arılar hızla gökyüzüne yükseldi ve topladıkları polenleri havaya bıraktı." },
  { id: 10, image: "/hikayeler/4-gokusagi-partisi/10.png", text: "Bir anda gökyüzünde renkler belirdi. Kırmızı, turuncu, sarı, yeşil, mavi ve mor ışıl ışıl parladı. Gökkuşağı sonunda ortaya çıkmıştı. Bütün hayvanlar sevinçle dans etti. O gün herkes, birlikte çalışınca en güzel şeylerin mümkün olduğunu bir kez daha anladı." },
];

export default function GokusagiPartisiPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser } = useUser();
  const db = useFirestore();
  const { speak, stop, isPlaying } = useTTS();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<any>(null);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const childDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setCurrentIndex(index);
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());

      // İlerlemeyi kaydet
      if (childDocRef) {
        updateDoc(childDocRef, {
          [`storyProgress.gokusagi-partisi`]: index
        });
      }
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, childDocRef]);

  // Sayfa değiştiğinde SADECE OTOMATİK OYNATMA AÇIKSA seslendir
  useEffect(() => {
    if (isAutoPlaying) {
      speak(`/hikayeler/4-gokusagi-partisi/${currentIndex + 1}.m4a`);
    }
  }, [currentIndex, isAutoPlaying, speak]);

  // Otomatik Oynatma Mantığı (Sayfa Geçişi)
  useEffect(() => {
    if (isAutoPlaying && !isPlaying && hasStarted) {
      const timer = setTimeout(() => {
        if (emblaApi && emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          setIsAutoPlaying(false);
        }
      }, 2000); // Ses bittikten 2 saniye sonra geç

      return () => clearTimeout(timer);
    }
  }, [isAutoPlaying, isPlaying, emblaApi, hasStarted]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const toggleAutoPlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      speak(`/hikayeler/4-gokusagi-partisi/${currentIndex + 1}.m4a`);
      setIsAutoPlaying(true);
    } else {
      if (isAutoPlaying) {
        setIsAutoPlaying(false);
        stop();
      } else {
        setIsAutoPlaying(true);
        speak(`/hikayeler/4-gokusagi-partisi/${currentIndex + 1}.m4a`);
      }
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-b from-pink-50 to-purple-100 font-sans relative">
      <BadgeUnlockModal 
        badge={newlyUnlockedBadge} 
        onClose={() => setNewlyUnlockedBadge(null)} 
      />
      
      {/* Üst Bar */}
      <div className="absolute top-0 left-0 right-0 p-3 sm:p-6 grid grid-cols-3 items-center z-50">
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stop();
              router.push(`/cocuk-modu/${childId}/hikayeler`);
            }}
            className="bg-white/80 hover:bg-white rounded-2xl w-10 h-10 sm:w-14 sm:h-14 shadow-lg border-2 border-purple-200 text-purple-600"
          >
            <X className="w-5 h-5 sm:w-8 sm:h-8" />
          </Button>
        </div>

        {/* Ortadaki Başlık */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl sm:rounded-3xl border-2 border-purple-200 shadow-lg flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="text-xs sm:text-base font-black text-purple-800 uppercase italic">Gökkuşağı Partisi</span>
            <span className="ml-1 text-purple-400 font-black text-xs sm:text-sm">{currentIndex + 1} / {storyContent.length}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={toggleAutoPlay}
            className={cn(
              "relative h-10 px-4 sm:h-16 sm:px-8 rounded-full border-2 sm:border-4 shadow-2xl transition-all duration-500 group overflow-hidden",
              isAutoPlaying 
                ? "bg-gradient-to-r from-red-500 to-rose-600 border-red-200 text-white hover:scale-105 active:scale-95" 
                : "bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:scale-105 active:scale-95"
            )}
          >
            {isAutoPlaying && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
            
            <div className="relative z-10 flex items-center gap-1 sm:gap-3">
              <div className={cn(
                "p-1 sm:p-2 rounded-lg sm:rounded-xl transition-colors",
                isAutoPlaying ? "bg-white/20" : "bg-purple-100"
              )}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <Volume2 className={cn("w-4 h-4 sm:w-6 sm:h-6", isPlaying && "animate-bounce")} />
                )}
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                {isLoading 
                  ? "..." 
                  : isAutoPlaying 
                    ? "DUR" 
                    : hasStarted 
                      ? "DEVAM" 
                      : "DİNLE"
                }
              </span>
            </div>
          </Button>
        </div>
      </div>

      {/* Hikaye Alanı */}
      <div className="h-full w-full flex flex-col items-center justify-center pt-16 pb-4 sm:pt-24 sm:pb-12 px-2 sm:px-6">
        <div className="relative w-full max-w-5xl aspect-[16/10] bg-white rounded-3xl sm:rounded-[60px] shadow-2xl border-4 sm:border-[8px] border-white overflow-hidden group">
          {/* Portrait Warning Overlay */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-[40] flex flex-col items-center justify-center p-4 text-center portrait:flex hidden cursor-pointer" onClick={() => speak("Lütfen hikayeyi daha iyi görebilmek için tabletinizi yan çevirin.")}>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2 animate-bounce">
              <Smartphone className="w-6 h-6 text-purple-500 rotate-90" />
            </div>
            <h3 className="text-sm sm:text-lg font-black text-slate-800 uppercase tracking-tight mb-1">Lütfen Cihazınızı Yan Çevirin</h3>
            <p className="text-slate-500 font-medium max-w-xs text-xs">Hikayeyi daha iyi okuyabilmek için cihazınızı yatay konuma getirin. 📖</p>
          </div>
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {storyContent.map((slide) => (
                <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-full">
                  <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                    <Image
                      src={slide.image}
                      alt={`Slide ${slide.id}`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigasyon Okları */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              "absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/90 shadow-xl border-2 sm:border-4 border-purple-100 flex items-center justify-center text-purple-500 transition-all hover:scale-110 active:scale-90 disabled:opacity-0 z-20",
              !canScrollPrev && "pointer-events-none"
            )}
          >
            <ChevronLeft className="w-6 h-6 sm:w-10 sm:h-10" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              "absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/90 shadow-xl border-2 sm:border-4 border-purple-100 flex items-center justify-center text-purple-500 transition-all hover:scale-110 active:scale-90 disabled:opacity-0 z-20",
              !canScrollNext && "pointer-events-none"
            )}
          >
            <ChevronRight className="w-6 h-6 sm:w-10 sm:h-10" />
          </button>
        </div>
      </div>
    </div>
  );
}
