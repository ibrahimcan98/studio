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
import { motion, AnimatePresence } from 'framer-motion';
// Hikaye verisi
const storyContent = [
  { id: 1, image: "/hikayeler/2-bir-iki-uc-basardim/1.png", text: "Güneşli bir gündü. Emir, dışarı çıktı ve cebinden en sevdiği renkli tebeşirlerini çıkardı. Bir tane kırmızı, bir tane sarı, bir tane mavi, bir de turuncu. Kaldırımın üzerine özenle kadar kareler çizdi. Her kareyi farklı bir çizerken içi kıpır kıpırdı. 'Bugün bu sekseği bitireceğim, hiç takılmadan sonuna kadar zıplayacağım!' diye kendi kendine söz verdi." },
  { id: 2, image: "/hikayeler/2-bir-iki-uc-basardim/2.png", text: "Emir oyuna başladı. 'Bir!' dedi, tek ayağının üzerinde dengede durdu. 'İki!' derken biraz tökezledi ama kendini topladı. 'Üç!' dediğinde ayağı çizginin üzerine basınca dengesini kaybetti. 'Ah, olmadı!' dedi. Tekrar denedi, yine dörtte ayağı kaydı. Emir pes etmedi, tekrar denedi, tekrar denedi... Ama her seferinde ya çizgiyi aşıyor ya da dengesini kaybedip ellerini yere koymak zorunda kalıyordu." },
  { id: 3, image: "/hikayeler/2-bir-iki-uc-basardim/3.png", text: "Emir artık nefes nefese kalmıştı. Alnındaki terleri sildi, bacakları sızlıyordu. Tam derin bir nefes aldığı sırada, köpeği Zıp Zıp neşeyle sokağa daldı. Zıp Zıp, sanki oyunu biliyormuş gibi büyük bir heyecanla seksek karelerinin üzerine atladı. Hiç hata yapmadan kuyruğunu sallayarak karelerin sonuna kadar gitti, sonra zıplayarak geri döndü." },
  { id: 4, image: "/hikayeler/2-bir-iki-uc-basardim/4.png", text: "Emir, köpeğinin bu kadar kolay yapabildiğini görünce olduğu yere çöküverdi. Dizlerini kendine çekti, başını ellerinin arasına aldı. Gözleri dolmuştu. 'Köpeğim bile başarıyor, hem de hiç zorlanmadan,' diye düşündü. O kadar üzgündü ki, Zıp Zıp'ın havlamalarını bile duymak istemiyordu. Kendi kendine, kenarda sessizce oturmaya başladı. Emir, kaldırımın kenarında oturmuş, burnunu çekerek yere bakarken babası yanına geldi. Emir’in yanına çömeldi. Emir’in omzuna nazikçe elini koydu. 'Bazen bazı şeyleri ilk seferde yapamayız Emir,' dedi babası şefkatle. 'Önemli olan düşmek değil, düştüğünde kalkıp tekrar denemeye cesaret etmektir.' Emir, babasının gözlerindeki güveni görünce biraz olsun rahatladı." },
  { id: 5, image: "/hikayeler/2-bir-iki-uc-basardim/5.png", text: "Babası, 'Gel, şimdi seninle yavaş yavaş-deneyelim.' dedi. Emir'in elini tuttu. Babası her seferinde onu destekliyor, dengesini sağlamasına yardım ediyordu. Emir zıplamaya başladı. 'Bir, iki, üç...' diye saydılar. Emir her seferinde babasının elini tutarak kendini daha güvende hissediyordu. Düşse bile babası onu hemen kaldırıyor, 'Hadi, tekrar deneyelim, bu sefer başaracaksın!' diyerek onu cesaretlendiriyordu." },
  { id: 6, image: "/hikayeler/2-bir-iki-uc-basardim/6.png", text: "Emir, yorulmuştu ama babasının desteğiyle yeniden güç bulmuştu. Derin bir nefes aldı, zihninde sayıları bir melodi gibi sıraladı. 'Bir... iki... üç...' diye zıplamaya başladı. Ayakları artık daha kararlıydı. 'Dört, beş, altı...' Emir durmadı. 'Yedi ve sekiz!' Emir, sonuncu kareye geldiğinde kollarını havaya kaldırdı. Başarmıştı! Babası onu gururla alkışlıyordu. Emir sadece seksek oynamayı öğrenmemiş, sabretmenin ve yardım istemenin ne kadar güzel olduğunu da anlamıştı." },
];

export default function BirIkiUcBasardimPage() {
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
    duration: 45,
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

  const childDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

  const BIR_IKI_UC_QUESTIONS = [
    { question: "Emir kaldırıma ne ile kareler çizdi?", options: ["Kalem ile çizdi", "Tebeşir ile çizdi", "Boya ile çizdi"], correctAnswer: 1 },
    { question: "Emir'e kim destek oldu ve elini tuttu?", options: ["Annesi destek oldu", "Arkadaşı destek oldu", "Babası destek oldu"], correctAnswer: 2 },
    { question: "Emir hangi oyunu oynamaya çalışıyordu?", options: ["Seksek oynuyordu", "Körebe oynuyordu", "Saklambaç oynuyordu"], correctAnswer: 0 },
  ];

  const handleQuizComplete = async (allCorrect: boolean) => {
    setIsQuizOpen(false);
    if (childDocRef) {
      const earnedBadges = (childData as any)?.earnedBadges || [];
      const storyStats = (childData as any)?.stats?.story || {};
      const currentAttempts = (storyStats['bir-iki-uc-basardim']?.attempts || 0) + 1;
      
      const updates: any = {
        [`stats.story.bir-iki-uc-basardim.attempts`]: currentAttempts
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
        updates[`stats.story.bir-iki-uc-basardim.perfectScore`] = true;
      }

      await updateDoc(childDocRef, updates);
    }
  };

  useEffect(() => {
    if (childDocRef && currentIndex > 0) {
      const updateData: any = {
        [`storyProgress.bir-iki-uc-basardim`]: currentIndex
      };

      // Hikaye bittiyse (Son sayfa)
      if (currentIndex === storyContent.length - 1 && !completionTracked.current) {
        completionTracked.current = true;
        updateData.completedStories = arrayUnion('bir-iki-uc-basardim');
        
        // Rozet Kontrolü
        const completedStories = (childData as any)?.completedStories || [];
        const earnedBadges = (childData as any)?.earnedBadges || [];
        const newCount = completedStories.includes('bir-iki-uc-basardim') ? completedStories.length : completedStories.length + 1;

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

  useEffect(() => {
    if (childData?.storyProgress?.['bir-iki-uc-basardim'] !== undefined && emblaApi && !hasInitialScrolled.current) {
      const lastPage = childData.storyProgress['bir-iki-uc-basardim'];
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
      speak(`/hikayeler/2-bir-iki-uc-basardim/${currentIndex + 1}.m4a`);
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

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      stop();
    } else {
      setIsAutoPlaying(true);
      setHasStarted(true);

      if (lastPlayedIndex !== currentIndex) {
        if (currentIndex === storyContent.length - 1 && lastPlayedIndex !== -1) {
          emblaApi?.scrollTo(0);
        } else {
          speak(`/hikayeler/2-bir-iki-uc-basardim/${currentIndex + 1}.m4a`);
          setLastPlayedIndex(currentIndex);
        }
      } else {
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
    <div className={cn(
      "h-screen w-full overflow-hidden font-sans relative",
      isPortrait ? "bg-amber-100" : "bg-gradient-to-b from-blue-50 to-cyan-100"
    )}>
      <BadgeUnlockModal 
        badge={currentBadgeToShow} 
        onClose={() => setUnlockedBadgesQueue(prev => prev.slice(1))} 
      />
      {isQuizOpen && (
        <StoryQuiz 
          questions={BIR_IKI_UC_QUESTIONS} 
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
      <div className="absolute top-0 left-0 right-0 p-3 sm:p-6 grid grid-cols-3 items-center z-50">
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stop();
              router.push(`/cocuk-modu/${childId}/hikayeler`);
            }}
            className="bg-white/80 hover:bg-white rounded-2xl w-10 h-10 sm:w-14 sm:h-14 shadow-lg border-2 border-blue-200 text-blue-600"
          >
            <X className="w-5 h-5 sm:w-8 sm:h-8" />
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl sm:rounded-3xl border-2 border-blue-200 shadow-lg flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="text-xs sm:text-base font-black text-blue-800 uppercase italic">Bir İki Üç Başardım</span>
            <span className="ml-1 text-blue-400 font-black text-xs sm:text-sm">{currentIndex + 1} / {storyContent.length}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={toggleAutoPlay}
            className={cn(
              "relative h-10 px-4 sm:h-16 sm:px-8 rounded-full border-2 sm:border-4 shadow-2xl transition-all duration-500 group overflow-hidden",
              isAutoPlaying
                ? "bg-gradient-to-r from-red-500 to-rose-600 border-red-200 text-white"
                : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
            )}
          >
            {isAutoPlaying && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
            <div className="relative z-10 flex items-center gap-1 sm:gap-3">
              <div className={cn("p-1 sm:p-2 rounded-lg sm:rounded-xl transition-colors", isAutoPlaying ? "bg-white/20" : "bg-blue-100")}>
                {isLoading ? <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 animate-spin" /> : <Volume2 className={cn("w-4 h-4 sm:w-6 sm:h-6", isPlaying && "animate-bounce")} />}
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                {isLoading ? "..." : (isAutoPlaying ? "DUR" : hasStarted ? "DEVAM" : "DİNLE")}
              </span>
            </div>
            {!isAutoPlaying && (
              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="h-full w-full flex flex-col items-center justify-center pt-16 pb-4 sm:pt-24 sm:pb-12 px-2 sm:px-6">
        <div className="relative w-full max-w-5xl aspect-[16/10] bg-white rounded-3xl sm:rounded-[60px] shadow-2xl border-4 sm:border-[8px] border-white overflow-hidden group">
          {/* Portrait Warning Overlay */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-[40] flex flex-col items-center justify-center p-4 text-center portrait:flex hidden cursor-pointer" onClick={() => speak("Lütfen hikayeyi daha iyi görebilmek için tabletinizi yan çevirin.")}>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 animate-bounce">
              <Smartphone className="w-6 h-6 text-blue-500 rotate-90" />
            </div>
            <h3 className="text-sm sm:text-lg font-black text-slate-800 uppercase tracking-tight mb-1">Lütfen Cihazınızı Yan Çevirin</h3>
            <p className="text-slate-500 font-medium max-xs text-xs">Hikayeyi daha iyi okuyabilmek için cihazınızı yatay konuma getirin. 📖</p>
          </div>
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {storyContent.map((slide) => (
                <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-full">
                  <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                    <Image src={slide.image} alt={`Slide ${slide.id}`} fill className="object-contain" priority />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={scrollPrev} disabled={!canScrollPrev} className={cn("absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/90 shadow-xl border-2 sm:border-4 border-blue-100 flex items-center justify-center text-blue-500 transition-all hover:scale-110 active:scale-90 disabled:opacity-0 z-20", !canScrollPrev && "pointer-events-none")}>
            <ChevronLeft className="w-6 h-6 sm:w-10 sm:h-10" />
          </button>
          <button onClick={scrollNext} disabled={!canScrollNext} className={cn("absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/90 shadow-xl border-2 sm:border-4 border-blue-100 flex items-center justify-center text-blue-500 transition-all hover:scale-110 active:scale-90 disabled:opacity-0 z-20", !canScrollNext && "pointer-events-none")}          >
            <ChevronRight className="w-6 h-6 sm:w-10 sm:h-10" />
          </button>

          {/* Test Çöz Butonu (Sadece Quiz daha önce çözüldüyse) */}
          {currentIndex === storyContent.length - 1 && ((childData as any)?.stats?.story?.['bir-iki-uc-basardim']?.attempts > 0) && (
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



      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl -z-10" />
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl -z-10" />
    </div>
  );
}
