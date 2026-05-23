'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2, ChevronLeft, ChevronRight, X, Volume2, BookOpen, Brain, Smartphone } from 'lucide-react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/use-tts';
import { BadgeUnlockModal } from '@/components/child-mode/badge-unlock-modal';
import { StoryQuiz } from '@/components/child-mode/story-quiz';
import { StoryCompletionCelebration } from '@/components/child-mode/story-completion-celebration';
import { arrayUnion } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

const STORY_BADGES = [
  { id: 'ilk-sayfa', name: 'İlk Sayfa', description: 'İlk hikayeyi sonuna kadar okuyana verilir.', icon: '/rozetler/hikaye/ilk-sayfa.png', requirement: 1 },
  { id: 'okuma-merdiveni', name: 'Okuma Merdiveni', description: '4 hikayeyi sonuna kadar okuyana verilir.', icon: '/rozetler/hikaye/okuma-merdiveni.png', requirement: 4 },
  { id: 'kutuphane-krali', name: 'Kütüphane Kralı', description: '10 hikayeyi sonuna kadar okuyana verilir.', icon: '/rozetler/hikaye/kutuphane-krali.png', requirement: 10 },
  { id: 'dikkatli-gozler', name: 'Dikkatli Gözler', description: 'Hikaye sonundaki soruların hepsini doğru bilene verilir.', icon: '/rozetler/hikaye/dikkatli-gozler.png', requirement: 1 },
];

const SOCIAL_BADGES = [
  { id: 'sabah-yildizi', name: 'Sabah Yıldızı', description: 'Sabah erkenden sisteme girip çalışana verilir.', icon: '/rozetler/sosyal/sabah-yildizi.png', requirement: 1 },
  { id: 'gece-kusu', name: 'Gece Kuşu', description: 'Akşam vakti sisteme girip çalışana verilir.', icon: '/rozetler/sosyal/gece-kusu.png', requirement: 1 },
  { id: 'azimli-kaplumbaga', name: 'Azimli Kaplumbağa', description: 'Zorlandığı bir görevi 3. denemede başaranlara.', icon: '/rozetler/sosyal/azimli-kaplumbaga.png', requirement: 3 },
  { id: 'duzenli-calisan', name: 'Düzenli Çalışkan', description: '5 gün üst üste sisteme giriş yapana verilir.', icon: '/rozetler/sosyal/duzenli-calisan.png', requirement: 5 },
];

// Örnek hikaye verisi (Daha sonra bir JSON'dan gelebilir)
const storyContent = [
  { id: 1, image: "/hikayeler/1-sari-top/1.png", text: "Ela bahçede top oynuyordu. Bir yandan topunu havaya fırlatıp tutuyor, bir yandan da mutfaktaki pencereden gelen mis gibi tarçınlı kek kokusunu çekiyordu içine. Babası mutfakta ona taze bir bardak süt ve kek hazırlıyordu. Ela bir kez daha topunu var gücüyle yukarı fırlattı. Ancak top, beklenmedik bir hızla çitlerin arkasına yuvarlanıp gözden kayboldu." },
  { id: 2, image: "/hikayeler/1-sari-top/2.png", text: "Ela hemen çitlerin arasından baktı. Çitler, küçük birer geçit gibiydi. Dikkatlice arasından baktığında masmavi çiçeklerle dolu bir bahçe gördü. 'Topum burada mı acaba?' diye fısıldadı. Çiçeklerin arasında ağır ağır yürüdü, ancak topu orada bulamadı. Çiçekler rüzgarda usulca sallanıp Ela’ya 'burada değiliz' der gibi gülümsüyordu." },
  { id: 3, image: "/hikayeler/1-sari-top/3.png", text: "Ela biraz daha ilerleyince büyük bir elma ağacının gölgesine ulaştı. Yerde kıpkırmızı, kocaman bir elma duruyordu. Güneşin altında pırıl pırıl parlıyordu. Ela heyecanla eğildi, 'Acaba topum bu mu?' diye düşündü. Dokunduğunda elmanın sert ve soğuk olduğunu fark etti. Topu o değildi ama elma çok güzel kokuyordu. Ela, elmayı olduğu gibi bırakıp yoluna devam etti." },
  { id: 4, image: "/hikayeler/1-sari-top/4.png", text: "Derken bir ses duydu: 'Vırak, vırak!' Bir nilüferin üzerinde yeşil, benekli bir kurbağa oturuyordu. Ela usulca yaklaştı, 'Kurbağa kardeş, sarı bir top gördün mü?' diye sordu. Kurbağa, büyük gözlerini kırpıştırıp bir anda suya atladı. 'Şıp!' diye bir ses çıktı ve suyun üzerinde halkalar oluştu. Ela, suyun sakinleşmesini beklemeden yoluna devam etti." },
  { id: 5, image: "/hikayeler/1-sari-top/5.png", text: "Ela biraz ilerledikten sonra fındığını keyifle kemiren tüylü bir sincap gördü. Sincap fındığını bir kenara bırakıp patisiyle bir yönü işaret etti ve 'Sarı topunu mu arıyorsun? Havada yükselip şu tarafa doğru gitti!' dedi. Ela, sincabın gösterdiği yöne doğru yola koyuldu." },
  { id: 6, image: "/hikayeler/1-sari-top/6.png", text: "Sincabın gösterdiği yönde yürürken nehrin kıyısında sarı bir şeyin parladığını gördü. 'İşte topum!' dedi ve heyecanla koştu. Eğilip elini uzattı ama parmaklarına çarpan şey yumuşaktı. Bu bir top değil, suya düşmüş sarı bir sonbahar yaprağıydı. Ela hafifçe gülümsedi; doğa sanki onunla saklambaç oynuyordu." },
  { id: 7, image: "/hikayeler/1-sari-top/7.png", text: "Ela, yoluna devam etti ama artık çok yorulmuştu. Görkemli ve yaşlı bir ağacın altına oturdu. Sırtını kalın gövdeye yasladı, gözlerini kapattı. 'Babamın keki şimdi fırından çıkmıştır...' diye düşündü. Tam o sırada, ağacın üst dallarından bir 'çıt' diye bir ses duydu." },
  { id: 8, image: "/hikayeler/1-sari-top/8.png", text: "Ela başını yukarı kaldırdı. Ağacın en tepesindeki kuş yuvasının sağ tarafına sıkışmış sarı bir parıltı gördü. Topu, kuşlar tarafından yuvaya taşınmıştı! Ela ağaca yavaşça tırmandı ve topunu nazikçe yuvadan aldı. Kuşlar neşeyle öttü." },
  { id: 9, image: "/hikayeler/1-sari-top/9.png", text: "Ela topuna kavuşmuştu. Artık eve dönme vaktiydi; mutfaktan gelen o tatlı kek kokusu Ela'yı çoktan evine çağırıyordu." },
];

export default function SariTopPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser } = useUser();
  const db = useFirestore();
  const { speak, stop, resume, preload, isPlaying, isLoading } = useTTS();
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [lastPlayedIndex, setLastPlayedIndex] = useState(-1);
  const hasInitialScrolled = useRef(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    duration: 45, // Daha yavaş geçiş (Varsayılan 25)
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [unlockedBadgesQueue, setUnlockedBadgesQueue] = useState<any[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const completionTracked = useRef(false);
  const celebrationShown = useRef(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    setIsPortrait(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isPortrait) {
      speak("Lütfen hikayeyi daha iyi görebilmek için tabletinizi yan çevirin.");
    }
  }, [isPortrait, speak]);

  // Firestore referansı
  const childDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

  const SARI_TOP_QUESTIONS = [
    { question: "Ela bahçede ne oynuyordu?", options: ["Top oynuyordu", "Saklambaç oynuyordu", "Seksek oynuyordu"], correctAnswer: 0 },
    { question: "Ela'nın topu ne renkti?", options: ["Mavi renkti", "Sarı renkti", "Kırmızı renkti"], correctAnswer: 1 },
    { question: "Topu en sonunda nerede buldu?", options: ["Ağaçtaki yuvada buldu", "Nehirde buldu", "Çiçekler arasında buldu"], correctAnswer: 0 },
  ];

  const handleQuizComplete = async (allCorrect: boolean) => {
    setIsQuizOpen(false);
    if (childDocRef) {
      const earnedBadges = (childData as any)?.earnedBadges || [];
      const storyStats = (childData as any)?.stats?.story || {};
      const currentAttempts = (storyStats['sari-top']?.attempts || 0) + 1;
      
      const updates: any = {
        [`stats.story.sari-top.attempts`]: currentAttempts
      };

      // Dikkatli Gözler (İlk denemede full doğru)
      if (allCorrect && currentAttempts === 1 && !earnedBadges.includes('dikkatli-gozler')) {
        updates.earnedBadges = arrayUnion('dikkatli-gozler');
        setUnlockedBadgesQueue(prev => [...prev, STORY_BADGES.find(b => b.id === 'dikkatli-gozler')]);
      }

      // Azimli Kaplumbağa (3. denemede başarı)
      if (allCorrect && currentAttempts === 3 && !earnedBadges.includes('azimli-kaplumbaga')) {
        updates.earnedBadges = arrayUnion('azimli-kaplumbaga');
        setUnlockedBadgesQueue(prev => [...prev, SOCIAL_BADGES.find(b => b.id === 'azimli-kaplumbaga')]);
      }

      if (allCorrect) {
        updates[`stats.story.sari-top.perfectScore`] = true;
      }

      await updateDoc(childDocRef, updates);
    }
  };

  // Kaldığı yeri kaydet
  useEffect(() => {
    if (childDocRef && currentIndex > 0) {
      const updateData: any = {
        [`storyProgress.sari-top`]: currentIndex
      };

      // Hikaye bittiyse (Son sayfa)
      if (currentIndex === storyContent.length - 1 && !completionTracked.current) {
        completionTracked.current = true;
        updateData.completedStories = arrayUnion('sari-top');
        
        // Rozet Kontrolü
        const completedStories = (childData as any)?.completedStories || [];
        const earnedBadges = (childData as any)?.earnedBadges || [];
        const newCount = completedStories.includes('sari-top') ? completedStories.length : completedStories.length + 1;

        let newlyEarned: any = null;
        for (const badge of STORY_BADGES) {
          if (earnedBadges.includes(badge.id)) continue;
          if (badge.id === 'ilk-sayfa' && newCount >= 1) newlyEarned = badge;
          if (badge.id === 'okuma-merdiveni' && newCount >= 4) newlyEarned = badge;
          if (badge.id === 'kutuphane-krali' && newCount >= 10) newlyEarned = badge;
          
          if (newlyEarned) {
            updateData.earnedBadges = arrayUnion(badge.id);
            setUnlockedBadgesQueue(prev => [...prev, newlyEarned]);
            break;
          }
        }
      }

      updateDoc(childDocRef, updateData).catch(console.error);
    }
  }, [currentIndex, childDocRef, childData]);

  // İlk girişte kaldığı yerden başlat (SADECE BİR KEZ)
  useEffect(() => {
    if (childData?.storyProgress?.['sari-top'] !== undefined && emblaApi && !hasInitialScrolled.current) {
      const lastPage = childData.storyProgress['sari-top'];
      if (lastPage > 0) {
        emblaApi.scrollTo(lastPage);
        setCurrentIndex(lastPage);
      }
      hasInitialScrolled.current = true;
    }
  }, [childData, emblaApi]);

  // Kutlama Gösterimi İçin useEffect
  useEffect(() => {
    if (currentIndex === storyContent.length - 1) {
      if (isPlaying || isLoading || isAutoPlaying) return;
      
      const timer = setTimeout(() => {
        if (!celebrationShown.current) {
          celebrationShown.current = true;
          setShowCelebration(true);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPlaying, isLoading, isAutoPlaying]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();

    setCurrentIndex(newIndex);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Sayfa değiştiğinde SADECE OTOMATİK OYNATMA AÇIKSA seslendir
  useEffect(() => {
    if (isAutoPlaying) {
      setLastPlayedIndex(currentIndex);
      speak(`/hikayeler/1-sari-top/${currentIndex + 1}.m4a`);
    }
  }, [currentIndex, isAutoPlaying, speak]);

  // Otomatik Oynatma Mantığı (Sayfa Geçişi)
  useEffect(() => {
    if (isAutoPlaying && !isPlaying && hasStarted) {
      const timer = setTimeout(() => {
        if (currentIndex < storyContent.length - 1) {
          scrollNext();
        } else {
          setIsAutoPlaying(false);
        }
      }, 2000); // Ses bittikten 2 saniye sonra geç

      return () => clearTimeout(timer);
    }
  }, [isAutoPlaying, isPlaying, currentIndex, scrollNext, hasStarted]);

  // Otomatik oynatmayı başlat/durdur
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      stop();
    } else {
      setIsAutoPlaying(true);
      setHasStarted(true);

      // Eğer sayfa değişmişse veya hiç başlamamışsa en baştan (speak)
      if (lastPlayedIndex !== currentIndex) {
        if (currentIndex === storyContent.length - 1 && lastPlayedIndex !== -1) {
          emblaApi?.scrollTo(0);
        } else {
          speak(`/hikayeler/1-sari-top/${currentIndex + 1}.m4a`);
          setLastPlayedIndex(currentIndex);
        }
      } else {
        // Aynı sayfadaysak ve duraklatılmışsa devam et (resume)
        resume();
      }
    }
  };

  if (childLoading || !childData) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-100">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const currentBadgeToShow = (!showCelebration && !isQuizOpen && unlockedBadgesQueue.length > 0) ? unlockedBadgesQueue[0] : null;

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-b from-yellow-50 to-orange-100 font-sans relative">
      <BadgeUnlockModal 
        badge={currentBadgeToShow} 
        onClose={() => setUnlockedBadgesQueue(prev => prev.slice(1))} 
      />
      {isQuizOpen && (
        <StoryQuiz 
          questions={SARI_TOP_QUESTIONS} 
          onComplete={handleQuizComplete} 
          onClose={() => setIsQuizOpen(false)}
        />
      )}
      <StoryCompletionCelebration 
        show={showCelebration} 
        onAction={() => {
          setShowCelebration(false);
          setIsQuizOpen(true);
        }} 
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
            className="bg-white/80 hover:bg-white rounded-2xl w-10 h-10 sm:w-14 sm:h-14 shadow-lg border-2 border-orange-200 text-orange-600"
          >
            <X className="w-5 h-5 sm:w-8 sm:h-8" />
          </Button>
        </div>

        {/* Ortadaki Başlık */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl sm:rounded-3xl border-2 border-orange-200 shadow-lg flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="text-xs sm:text-base font-black text-orange-800 uppercase italic">Sarı Top</span>
            <span className="ml-1 text-orange-400 font-black text-xs sm:text-sm">{currentIndex + 1} / {storyContent.length}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={toggleAutoPlay}
            className={cn(
              "relative h-10 px-4 sm:h-16 sm:px-8 rounded-full border-2 sm:border-4 shadow-2xl transition-all duration-500 group overflow-hidden",
              isAutoPlaying 
                ? "bg-gradient-to-r from-red-500 to-rose-600 border-red-200 text-white hover:scale-105 active:scale-95" 
                : "bg-white border-orange-200 text-orange-600 hover:bg-orange-50 hover:scale-105 active:scale-95"
            )}
          >
            {/* Arkaplan Animasyonu (Aktifken) */}
            {isAutoPlaying && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
            
            <div className="relative z-10 flex items-center gap-1 sm:gap-3">
              <div className={cn(
                "p-1 sm:p-2 rounded-lg sm:rounded-xl transition-colors",
                isAutoPlaying ? "bg-white/20" : "bg-orange-100"
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
            
            {!isAutoPlaying && (
              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Hikaye Alanı */}
      <div className="h-full w-full flex flex-col items-center justify-center pt-16 pb-4 sm:pt-24 sm:pb-12 px-2 sm:px-6">
        <div className="relative w-full max-w-5xl aspect-[16/10] bg-white rounded-3xl sm:rounded-[60px] shadow-2xl border-4 sm:border-[8px] border-white overflow-hidden group">
          {/* Portrait Warning Overlay */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-[40] flex flex-col items-center justify-center p-4 text-center portrait:flex hidden cursor-pointer" onClick={() => speak("Lütfen hikayeyi daha iyi görebilmek için tabletinizi yan çevirin.")}>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-2 animate-bounce">
              <Smartphone className="w-6 h-6 text-orange-500 rotate-90" />
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
                    {/* Görsel yüklenmemişse gösterilecek placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100 -z-10">
                      <Loader2 className="w-12 h-12 animate-spin mb-4" />
                      <p className="font-bold uppercase tracking-widest text-xs">Resim Bekleniyor...</p>
                    </div>
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
              "absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/90 shadow-xl border-2 sm:border-4 border-orange-100 flex items-center justify-center text-orange-500 transition-all hover:scale-110 active:scale-90 disabled:opacity-0 z-20",
              !canScrollPrev && "pointer-events-none"
            )}
          >
            <ChevronLeft className="w-6 h-6 sm:w-10 sm:h-10" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              "absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/90 shadow-xl border-2 sm:border-4 border-orange-100 flex items-center justify-center text-orange-500 transition-all hover:scale-110 active:scale-90 disabled:opacity-0 z-20",
              !canScrollNext && "pointer-events-none"
            )}
          >
            <ChevronRight className="w-6 h-6 sm:w-10 sm:h-10" />
          </button>

          {/* Test Çöz Butonu (Sadece Quiz daha önce çözüldüyse) */}
          {currentIndex === storyContent.length - 1 && ((childData as any)?.stats?.story?.['sari-top']?.attempts > 0) && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
            >
              <Button
                onClick={() => setIsQuizOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black px-10 py-8 rounded-[30px] text-2xl shadow-[0_15px_30px_rgba(147,51,234,0.4)] border-b-[8px] border-purple-900 transition-all active:scale-95 flex items-center gap-4 group"
              >
                <Brain className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                TESTİ ÇÖZ & ROZET KAZAN! 🏆
              </Button>
            </motion.div>
          )}
        </div>
      </div>



      {/* Arkaplan Dekorasyonu */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl -z-10" />
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl -z-10" />
    </div>
  );
}
