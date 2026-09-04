'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Mic, Square, Sparkles, RotateCcw, ArrowLeft } from 'lucide-react';
import { ChildSidebar } from '@/components/child-mode/sidebar';
import { cn } from '@/lib/utils';
import { childConversationFlow } from '@/ai/flows/child-conversation-flow';
import { useTTS } from '@/hooks/use-tts';
import { PatiAvatar } from '@/components/child-mode/pati-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeUnlockModal } from '@/components/child-mode/badge-unlock-modal';
import { updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const AI_BADGES = [
  { id: 'soru-makinesi', name: 'Soru Makinesi', description: 'AI’ya 10 adet "Neden?" veya "Nasıl?" sorusu sorana verilir.', icon: '/rozetler/ai/soru-makinesi.png', requirement: 10 },
  { id: 'nezaket-elcisi', name: 'Nezaket Elçisi', description: 'AI ile konuşurken "Lütfen", "Teşekkür ederim" gibi kelimeleri kullananlara.', icon: '/rozetler/ai/nezaket-elcisi.png', requirement: 5 },
  { id: 'geveze', name: 'Geveze', description: 'AI ile toplamda 1 saatten fazla vakit geçirene verilir.', icon: '/rozetler/ai/geveze.png', requirement: 50 },
  { id: 'kelime-avcisi', name: 'Kelime Avcısı', description: 'AI ile konuşurken 5 yeni ve zor kelime öğrenip kullananlara.', icon: '/rozetler/ai/kelime-avcisi.png', requirement: 5 },
  { id: 'en-iyi-dost', name: 'En İyi Dost', description: 'AI ile her gün üst üste 7 gün boyunca sohbet edene verilir.', icon: '/rozetler/ai/en-iyi-dost.png', requirement: 7 },
];

export default function KonusmaPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("Pati seni bekliyor! Haydi konuşmaya başlayalım!");
  const [currentEmotion, setCurrentEmotion] = useState<string>('oturuyor');
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const { speak, stop, isPlaying: isAudioPlaying } = useTTS();
  const [hasInteracted, setHasInteracted] = useState(false);
  const greetingTriggered = useRef(false);
  const transcriptRef = useRef("");
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const pin = localStorage.getItem(`child-pin-${childId}`);
    if (!pin) router.push('/ebeveyn-portali');
  }, [childId, router]);

  const childDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

  // Ebeveyn verilerini al (abonelik kontrolü için)
  const userDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid) return null;
    return doc(db, 'users', authUser.uid);
  }, [db, authUser?.uid]);
  const { data: userData } = useDoc(userDocRef);
  const isChildAssigned = userData?.subscriptionChildIds?.includes(childId as string);
  const subscriptionTier = (userData?.subscriptionTier !== 'free' && isChildAssigned) 
      ? (userData?.subscriptionTier as string) 
      : 'free';

  // --- KULLANIM SÜRESİ TAKİBİ ---
  const [usageSeconds, setUsageSeconds] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    if (!childData || !isMounted) return;

    const stats = (childData as any).stats?.ai || {};
    
    // UTC yerine kullanıcının yerel saatine (Local Time) göre bugünün tarihini al (YYYY-MM-DD)
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    if (subscriptionTier === 'free') {
      // ÜCRETSİZ PAKET: Günlük Sıfırlama
      if (stats.lastUsageDate !== today) {
        setUsageSeconds(0);
        setIsLimitReached(false);
        if (childDocRef) {
          updateDoc(childDocRef, { 
            'stats.ai.dailyUsageSeconds': 0,
            'stats.ai.lastUsageDate': today 
          });
        }
      } else {
        setUsageSeconds(stats.dailyUsageSeconds || 0);
      }
    } else {
      // PREMIUM PAKET: Aylık Sıfırlama
      const cycleEnd = (childData as any).aiCycleEnd?.toDate?.() || null;
      if (!cycleEnd || now > cycleEnd) {
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setHours(0, 0, 0, 0);
        
        setUsageSeconds(0);
        setIsLimitReached(false);
        if (childDocRef) {
          updateDoc(childDocRef, { 
            'stats.ai.dailyUsageSeconds': 0, // Toplam kullanımı burada tutuyoruz
            aiCycleEnd: nextMonth 
          });
        }
      } else {
        setUsageSeconds(stats.dailyUsageSeconds || 0);
      }
    }
  }, [childData, isMounted, childDocRef, subscriptionTier]);

  // Saniye sayacı (Konuşma veya Dinleme sırasında çalışır)
  useEffect(() => {
    let interval: any;
    if ((isListening || isAiSpeaking || isAudioPlaying) && !isLimitReached) {
      interval = setInterval(() => {
        setUsageSeconds(prev => {
          const next = prev + 1;
          // Ücretsiz sürüm için 2 dakika (120 saniye) sınırı
          if (subscriptionTier === 'free' && next >= 120) {
            setIsLimitReached(true);
            stop(); // Pati'yi sustur
            if (recognitionRef.current) recognitionRef.current.stop();
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isListening, isAiSpeaking, isAudioPlaying, isLimitReached, subscriptionTier]);

  // Veritabanını belirli aralıklarla veya çıkışta güncelle (Performans için debounced veya efektle)
  useEffect(() => {
    if (usageSeconds > 0 && usageSeconds % 5 === 0 && childDocRef) {
      updateDoc(childDocRef, { 'stats.ai.dailyUsageSeconds': usageSeconds });
    }
  }, [usageSeconds, childDocRef]);

  const handleRepeat = () => {
    if (isLimitReached) return;
    if (aiResponse && !isListening) {
      speak(aiResponse);
    }
  };

  const startConversation = async () => {
    if (subscriptionTier === 'free' && usageSeconds >= 120) {
      setAiResponse("Günlük konuşma limitine ulaştın! Yarın tekrar bekliyorum ya da ebeveyninden paketi yükseltmesini isteyebilirsin! ✨");
      setIsLimitReached(true);
      setHasInteracted(true);
      return;
    }

    setHasInteracted(true);
    if (childData && !greetingTriggered.current) {
      greetingTriggered.current = true;
      try {
        const childName = childData.firstName || childData.name || "arkadaşım";
        const res = await childConversationFlow({
          history: [],
          question: `Sisteme ${childName} isimli çocuk giriş yaptı. Onu çok neşeli karşıla.`,
          childName: childName
        });
        setAiResponse(res.answer);
        setCurrentEmotion(res.emotion as any);
        setHistory([{ role: 'assistant', content: res.answer }]);
        speak(res.answer);
      } catch (e) {
        console.error("Initial greeting error:", e);
      }
    }
  };

  const toggleRecording = async () => {
    if (isLimitReached) {
      toast({
        title: 'Süre Doldu',
        description: 'Ücretsiz sürümde konuşma süreniz doldu.',
        variant: 'destructive',
      });
      return;
    }

    if (typeof window === 'undefined') return;

    // Pati konuşuyorsa sustur
    stop();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAiResponse("Maalesef tarayıcın ses tanımayı desteklemiyor.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
        transcriptRef.current = "";
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast({ variant: 'destructive', title: 'Mikrofon Hatası', description: 'Seni duyamadım, mikrofonunu kontrol eder misin?' });
        }
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
        transcriptRef.current = text;
      };

      recognition.onend = async () => {
        setIsListening(false);
        const finalTranscript = transcriptRef.current.trim().toLowerCase();

        if (finalTranscript.length > 0) {
          // --- ANALİZ VE İSTATİSTİK TAKİBİ ---
          try {
            const stats = (childData as any).stats || {};
            const earnedBadges = (childData as any).earnedBadges || [];
            const aiStats = stats.ai || {
              totalQuestions: 0,
              whyHowQuestions: 0,
              politeWordsCount: 0,
              totalChats: 0,
              uniqueWords: []
            };

            // 1. Nezaket Kontrolü
            const politeWords = ['lütfen', 'teşekkür', 'sagol', 'sağol', 'rica ederim'];
            const hasPolite = politeWords.some(w => finalTranscript.includes(w));
            if (hasPolite) aiStats.politeWordsCount = (aiStats.politeWordsCount || 0) + 1;

            // 2. Soru Kontrolü (Neden/Nasıl)
            const questionWords = ['neden', 'nasıl', 'niçin', 'niye', 'ne zaman'];
            const isWhyHow = questionWords.some(w => finalTranscript.includes(w));
            if (isWhyHow) aiStats.whyHowQuestions = (aiStats.whyHowQuestions || 0) + 1;

            // 3. Genel Sayaç
            aiStats.totalChats = (aiStats.totalChats || 0) + 1;

            // --- ROZET KONTROLÜ ---
            let newlyEarned: any = null;
            for (const badge of AI_BADGES) {
              if (earnedBadges.includes(badge.id)) continue;

              let isUnlocked = false;
              if (badge.id === 'soru-makinesi') isUnlocked = aiStats.whyHowQuestions >= badge.requirement;
              if (badge.id === 'nezaket-elcisi') isUnlocked = aiStats.politeWordsCount >= badge.requirement;
              if (badge.id === 'geveze') isUnlocked = aiStats.totalChats >= badge.requirement;

              if (isUnlocked) {
                newlyEarned = badge;
                earnedBadges.push(badge.id);
                break; // Bir seferde tek rozet gösterelim
              }
            }

              // Veritabanını Güncelle
              if (db && childDocRef) {
                const updateData: any = { 'stats.ai': aiStats };
                if (newlyEarned) {
                  updateData.earnedBadges = earnedBadges;
                  setNewlyUnlockedBadge(newlyEarned);
                }

                await updateDoc(childDocRef, updateData);
              }
          } catch (err) {
            console.error("Stats update error:", err);
          }

          setIsAiSpeaking(true);
          try {
            const res = await childConversationFlow({
              history: history.slice(-10),
              question: finalTranscript,
              childName: childData?.name
            });

            setAiResponse(res.answer);
            setCurrentEmotion(res.emotion as any);
            setHistory(prev => [...prev,
            { role: 'user', content: finalTranscript },
            { role: 'assistant', content: res.answer }
            ]);
            speak(res.answer);
          } catch (e) {
            setAiResponse("Seni duydum ama şu an cevap veremiyorum.");
          } finally {
            setIsAiSpeaking(false);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Mic start error:", err);
      setIsListening(false);
      toast({ variant: 'destructive', title: 'Hata', description: 'Mikrofon başlatılamadı. Sayfayı yenilemeyi deneyin.' });
    }
  };

  if (!isMounted || childLoading || !childData) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-50">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden font-sans bg-[#E0F7FA] relative">
      <BadgeUnlockModal
        badge={newlyUnlockedBadge}
        onClose={() => setNewlyUnlockedBadge(null)}
      />
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4DD0E1 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

      {!hasInteracted && (
        <div className="absolute inset-0 z-[500] bg-black/40 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[50px] p-10 shadow-2xl text-center max-w-sm border-b-[12px] border-slate-200"
          >
            <div className="relative w-40 h-40 mx-auto mb-6 bg-sky-50 rounded-full p-4 border-4 border-white">
              <PatiAvatar emotion="happy" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase italic">Miyav Hazır!</h2>
            <button
              onClick={startConversation}
              className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white font-black py-5 rounded-[25px] text-xl shadow-xl transition-all active:scale-95 border-b-[6px] border-[#2E7D32] flex items-center justify-center gap-3"
            >
              HAYDİ BAŞLA! <Sparkles className="w-6 h-6" />
            </button>

            <button
              onClick={() => router.push(`/cocuk-modu/${childId}`)}
              className="w-full mt-4 bg-[#FF5252] hover:bg-[#FF1744] text-white font-bold py-3 rounded-[20px] text-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-[#C62828]"
            >
              <ArrowLeft className="w-5 h-5" /> Vazgeç
            </button>
          </motion.div>
        </div>
      )}

      <main className="h-full w-full flex flex-col md:flex-row relative z-10">
        <ChildSidebar childId={childId} childData={childData} />

        <div className="flex-1 relative flex flex-col items-center px-4 pt-20 md:pt-12 overflow-y-auto custom-scrollbar">
          {/* Back Button for easier navigation */}
          <button
            onClick={() => router.push(`/cocuk-modu/${childId}`)}
            className="absolute top-4 left-4 md:top-6 md:left-6 z-[250] bg-white/80 hover:bg-white text-slate-600 p-2 md:p-3 rounded-2xl shadow-lg border-b-4 border-slate-200 transition-all active:scale-95 active:border-b-0 active:translate-y-1 flex items-center gap-2 font-bold"
          >
            <ArrowLeft className="w-5 h-5" /> <span className="hidden md:inline">Haritaya Dön</span>
          </button>

          <div className="w-full max-w-4xl flex flex-col items-center gap-2 md:gap-4 shrink-0">

            {/* Speech Bubble - More Compact */}
            <AnimatePresence mode="wait">
              {aiResponse && (
                <motion.div
                  key={aiResponse}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative z-20 w-full flex justify-center"
                >
                  <div className={cn(
                    "relative w-[95%] md:max-w-lg bg-white px-6 py-4 md:px-8 md:py-6 rounded-[30px] md:rounded-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border-4 transition-all duration-500",
                    (isAiSpeaking || isAudioPlaying) ? "border-[#4DB6AC] scale-102" : "border-white"
                  )}>
                    <p className="text-base md:text-xl font-black text-slate-700 text-center leading-tight italic">
                      {aiResponse}
                    </p>

                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Avatar - Reduced Size on Desktop */}
            <div className={cn(
              "relative w-32 h-32 md:w-56 md:h-56 transition-all duration-700",
              isListening ? "scale-90" : "scale-100"
            )}>
              <PatiAvatar
                emotion={currentEmotion as any}
                isSpeaking={isAiSpeaking || isAudioPlaying}
              />
            </div>
          </div>

          {/* Spacer to push controls to the bottom naturally */}
          <div className="flex-1 min-h-[2rem] w-full" />

          {/* Controls - More Compact */}
          <div className="w-full max-w-xl flex flex-col items-center gap-2 md:gap-4 mt-2 md:mt-4 relative z-[200] shrink-0">

            {/* Transcript - Integrated better */}
            <div className={cn(
              "min-h-[3rem] w-full max-w-[85%] px-6 py-1.5 rounded-[20px] bg-white/60 backdrop-blur-sm border-2 border-white/40 text-base md:text-lg font-bold text-[#00796B] shadow-sm transition-all flex items-center justify-center text-center",
              transcript ? "opacity-100" : "opacity-0 invisible"
            )}>
              {transcript}
            </div>

            {/* Kalan Süre - Centered and slightly higher */}
            <div className={cn(
              "mb-4 px-4 py-2 rounded-2xl border-2 flex items-center gap-2 transition-all duration-500 shadow-sm",
              (subscriptionTier === 'free' && usageSeconds > 100) ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-sky-50 border-sky-100 text-sky-600"
            )}>
              <div className="w-2 h-2 rounded-full bg-current" />
              <span className="font-black text-xs uppercase tracking-wider italic">
                {(() => {
                  // Toplam saniyeyi pakete göre belirle
                  let totalSeconds = 120; // Default free
                  if (subscriptionTier === 'adventurer') totalSeconds = 5 * 3600;
                  if (subscriptionTier === 'hero') totalSeconds = 20 * 3600;
                  
                  const remaining = Math.max(0, totalSeconds - usageSeconds);
                  const hrs = Math.floor(remaining / 3600);
                  const mins = Math.floor((remaining % 3600) / 60);
                  const secs = remaining % 60;
                  
                  if (hrs > 0) {
                    return `Kalan: ${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                  }
                  return `Kalan: ${mins}:${secs.toString().padStart(2, '0')}`;
                })()}
              </span>
            </div>

            {/* Buttons Row */}
            <div className="flex items-end justify-center gap-8 md:gap-12 w-full">

              {/* Repeat Button */}
              <div className="flex flex-col items-center gap-2 mb-2">
                <button
                  onClick={handleRepeat}
                  disabled={isListening || !hasInteracted || isLimitReached}
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-b-[6px] cursor-pointer active:scale-95 active:border-b-0 active:translate-y-1",
                    (isListening || !hasInteracted || isLimitReached) ? "bg-slate-200 border-slate-300 text-slate-400 grayscale" : "bg-[#FFB74D] border-[#F57C00] text-white"
                  )}
                >
                  <RotateCcw className="w-8 h-8" />
                </button>
                <p className="text-[#E65100] font-black text-[10px] uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full">
                  TEKRAR
                </p>
              </div>

              {/* Mic Button - More Compact Size */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {isListening && (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="absolute inset-0 rounded-full bg-red-400"
                    />
                  )}
                  <button
                    onClick={toggleRecording}
                    className={cn(
                      "relative z-[210] w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-b-[8px] cursor-pointer active:scale-95 active:border-b-0 active:translate-y-1",
                      isListening ? "bg-[#FF5252] border-[#D32F2F] text-white" : "bg-[#4CAF50] border-[#388E3C] text-white"
                    )}
                  >
                    {isListening ? (
                      <Square className="w-12 h-12 fill-current" />
                    ) : (
                      <Mic className="w-14 h-14" />
                    )}
                  </button>
                </div>
                <p className="text-[#004D40] font-black text-sm uppercase tracking-widest bg-white/50 px-4 py-1 rounded-full">
                  {isListening ? "DURDUR" : "KONUŞ"}
                </p>
              </div>

              {/* Empty spacing for symmetry */}
              <div className="w-16 h-16 hidden md:block" />
            </div>
          </div>

          {/* Explicit Bottom Spacer */}
          <div className="h-8 md:h-8 w-full shrink-0" />
        </div>
      </main>
    </div>
  );
}
