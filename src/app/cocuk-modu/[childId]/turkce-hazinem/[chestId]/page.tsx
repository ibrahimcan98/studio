'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import { Loader2, Trophy, BookOpen, Brain, MapPin, ArrowLeft, ArrowRight, CheckCircle, Star, Sparkles, Heart, AlertTriangle, Waves, Globe } from 'lucide-react';
import { ChildSidebar } from '@/components/child-mode/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { BadgeUnlockModal } from '@/components/child-mode/badge-unlock-modal';
import { checkNewBadgeUnlock, getEarnedBadgesAsStickers, BadgeUnlock } from '@/lib/progression';
import { motion, AnimatePresence } from 'framer-motion';

import { CHESTS_CONTENT } from '@/data/turkce-hazinem-data';

type Stage = 'list' | 'quiz1' | 'lang_intro' | 'etkinlik1' | 'etkinlik2' | 'country_intro' | 'country_etkinlik1' | 'country_etkinlik2' | 'success' | 'game_over';

export default function ChestPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const chestId = params.chestId as string;
  const { user: authUser, loading: authLoading } = useUser();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  const { width, height } = useWindowSize();

  const [stage, setStage] = useState<Stage>('list');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completedSectionName, setCompletedSectionName] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [failedStage, setFailedStage] = useState<Stage | null>(null);
  const [newBadge, setNewBadge] = useState<BadgeUnlock | null>(null);

  // Can Sistemi
  const [lives, setLives] = useState(5);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [targetStage, setTargetStage] = useState<Stage>('list');

  // Cümle Mimarı için durumlar
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [constructedSentence, setConstructedSentence] = useState<string[]>([]);

  // Veriyi dış dosyadan çek
  const content = useMemo(() => {
    return CHESTS_CONTENT[chestId];
  }, [chestId]);

  // Firestore'dan çocuk verilerini al
  const childDocRef = useMemo(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);
  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sayfa yüklenince kazanılmış rozetleri otomatik sticker olarak kaydet
  useEffect(() => {
    if (!childDocRef || !childData) return;
    const topics = childData.completedTopics || [];
    if (topics.length === 0) return;
    const earnedStickers = getEarnedBadgesAsStickers(topics);
    if (Object.keys(earnedStickers).length === 0) return;
    // Mevcut sticker'larla karşılaştır
    const currentStickers = childData.stickers || {};
    const missing = Object.entries(earnedStickers).filter(([id]) => !currentStickers[id]);
    if (missing.length === 0) return;
    // Eksik sticker'ları Firestore'a ekle (useDoc otomatik günceller)
    const merged = { ...currentStickers, ...earnedStickers };
    setDoc(childDocRef, { stickers: merged }, { merge: true });
  }, [childDocRef, childData?.completedTopics]);


  const currentChest = useMemo(() => {
    const id = parseInt(chestId);
    return { id, title: content?.story?.title || content?.lang?.title || 'Bilinmeyen Konu' };
  }, [chestId, content]);

  // Kelimeleri karıştırma fonksiyonu
  const shuffleArray = (array: string[]) => {
    if (!array) return [];
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    if (stage === 'etkinlik2' && content?.lang?.etkinlik2.questions[currentQuestion]) {
      const words = content.lang.etkinlik2.questions[currentQuestion].words;
      if (words) {
        setScrambledWords(shuffleArray(words));
      } else {
        setScrambledWords([]);
      }
      setConstructedSentence([]);
    }
  }, [stage, currentQuestion, content]);

  const handleAnswerSelect = (index: number, stringValue?: string) => {
    if (selectedAnswer !== null || lives === 0 || !content) return;

    setSelectedAnswer(index);
    const questions =
      stage === 'quiz1' ? content?.story?.questions :
        stage === 'etkinlik1' ? content.lang?.etkinlik1.questions :
          stage === 'etkinlik2' ? content.lang?.etkinlik2.questions :
            stage === 'country_etkinlik1' ? content.country?.etkinlik1.questions :
              stage === 'country_etkinlik2' ? content.country?.etkinlik2.questions :
                null;

    if (!questions) return;

    // Eğer stringValue verildiyse (words dizisi kullanılıyorsa), string olarak karşılaştır.
    // Aksi takdirde index (options) olarak karşılaştır.
    const correct = stringValue !== undefined
      ? stringValue === questions[currentQuestion].correct
      : index === questions[currentQuestion].correct;
      
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        } else {
          if (stage === 'quiz1') {
            handleQuizComplete(`chest-${chestId}-1`);
          } else if (stage === 'etkinlik1') {
            setStage('etkinlik2');
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setIsCorrect(null);
          } else if (stage === 'etkinlik2') {
            handleQuizComplete(`chest-${chestId}-2`);
          } else if (stage === 'country_etkinlik1') {
            setStage('country_etkinlik2');
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setIsCorrect(null);
          } else if (stage === 'country_etkinlik2') {
            handleQuizComplete(`chest-${chestId}-3`);
          }
        }
      }, 1500);
    } else {
      decreaseLives();
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  const handleWordClick = (word: string, isFromScrambled: boolean) => {
    if (lives === 0) return;

    if (isFromScrambled) {
      setScrambledWords(prev => prev.filter(w => w !== word));
      setConstructedSentence(prev => [...prev, word]);
    } else {
      setConstructedSentence(prev => prev.filter(w => w !== word));
      setScrambledWords(prev => [...prev, word]);
    }
  };

  const checkSentence = () => {
    if (!content?.lang?.etkinlik2.questions[currentQuestion]) return;

    // Noktalama işaretlerini, büyük harfleri ve boşlukları normalize ederek kontrol et
    const normalize = (s: string) => s.replace(/İ/g, "i").replace(/I/g, "ı").replace(/['".,\/#!$%\^&\*;:{}=\-_`~()\s]/g, "").toLowerCase().trim();

    if (normalize(constructedSentence.join('')) === normalize(content.lang.etkinlik2.questions[currentQuestion].correct)) {
      setIsCorrect(true);
      setTimeout(() => {
        if (currentQuestion < content.lang!.etkinlik2.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setIsCorrect(null);
        } else {
          handleQuizComplete(`chest-${chestId}-2`);
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      decreaseLives();
      setTimeout(() => {
        setIsCorrect(null);
        // Kelimeleri sıfırla
        setScrambledWords(shuffleArray(content.lang!.etkinlik2.questions[currentQuestion].words));
        setConstructedSentence([]);
      }, 1500);
    }
  };

  const decreaseLives = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives === 0) {
        setFailedStage(stage); // Save the current stage
        setTimeout(() => {
          setStage('game_over');
        }, 1000);
      }
      return newLives;
    });
  };

  const handleQuizComplete = async (completedKey: string) => {
    let sectionName = "Görev";
    if (completedKey.endsWith('-1')) sectionName = "Okuyorum Anlıyorum";
    else if (completedKey.endsWith('-2')) sectionName = "Dilimi Geliştiriyorum";
    else if (completedKey.endsWith('-3')) sectionName = "Ülkemi Tanıyorum";
    setCompletedSectionName(sectionName);

    if (childDocRef) {
      let xpToAdd = 20;
      if (completedKey.endsWith('-2')) xpToAdd = 30;
      if (completedKey.endsWith('-3')) xpToAdd = 50;

      const currentXp = childData?.xp || 0;
      const newXp = currentXp + xpToAdd;

      const oldTopics = childData?.completedTopics || [];
      const newTopics = [...oldTopics];
      if (!newTopics.includes(completedKey)) {
        newTopics.push(completedKey);
      }
      
      const unlockedBadge = checkNewBadgeUnlock(oldTopics, newTopics);

      // Update Firestore with completed topic and XP
      await updateDoc(childDocRef, {
        completedTopics: arrayUnion(completedKey),
        xp: increment(xpToAdd)
      });

      if (unlockedBadge) {
        // Show badge modal
        setNewBadge(unlockedBadge);
        // Save badge icon as a sticker using setDoc merge (useDoc listener auto-refreshes UI)
        const newStickers = {
          ...(childData?.stickers || {}),
          [unlockedBadge.id]: unlockedBadge.icon
        };
        await setDoc(childDocRef, { stickers: newStickers }, { merge: true });
      }
    }
    setStage('success');
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const startStage = (newStage: Stage) => {
    setTargetStage(newStage);
    setShowWarningPopup(true);
  };

  const proceedToStage = () => {
    setShowWarningPopup(false);
    setStage(targetStage);
    setLives(5); // Canları yenile
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  if (!isMounted || authLoading || childLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fef3c7]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!childData || !content) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fef3c7]">
        <p className="text-amber-900 font-bold">Veri bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans relative">
      {/* Sol Panel (Sidebar) */}
      <ChildSidebar childId={childId} childData={childData} />

      <BadgeUnlockModal badge={newBadge} onClose={() => setNewBadge(null)} />

      {/* SABİT ARKA PLAN */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#bae6fd] via-[#fef08a] to-[#fcd34d] z-0" />
      <div
        className="fixed inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] z-1"
        style={{ backgroundSize: '500px' }}
      />

      {/* Konfeti */}
      {showConfetti && <Confetti width={width} height={height} className="z-50" />}

      {/* Ana İçerik Alanı */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 flex flex-col items-center py-12 px-6">

        {/* Üst Bar */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-2xl h-12 w-12 bg-white/90 border-none shadow-lg hover:scale-105 transition-all hover:bg-white active:scale-95"
            onClick={() => {
              if (stage !== 'list') {
                setStage('list');
              } else {
                router.push(`/cocuk-modu/${childId}/turkce-hazinem`);
              }
            }}
          >
            <ArrowLeft className="w-6 h-6 text-amber-700" />
          </Button>

          {/* Can Göstergesi */}
          {(stage !== 'list' && stage !== 'success' && stage !== 'game_over') && (
            <div className="bg-white/90 px-4 py-2 rounded-full shadow-md border border-amber-200 flex items-center gap-2">
              <Heart className={cn("w-5 h-5", lives > 0 ? "text-rose-500 fill-rose-500" : "text-gray-400")} />
              <span className="font-black text-amber-900 text-sm">{lives} CAN</span>
            </div>
          )}

          <div className="bg-white/90 px-6 py-2 rounded-full shadow-md border border-amber-200 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-600" />
            <span className="text-amber-900 font-black text-sm uppercase">Sandık {chestId}</span>
          </div>
        </div>

        {/* BÖLÜM LİSTESİ */}
        {stage === 'list' && (
          <>
            <div className="w-full max-w-3xl text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-amber-950 mb-3 tracking-tight">
                Sandık {chestId}
              </h1>
              <p className="text-amber-800/80 font-medium text-lg">
                Bu hazineyi tamamlamak için aşağıdaki adımları sırasıyla bitirmelisin.
              </p>
            </div>

            <div className="w-full max-w-3xl flex flex-col gap-6">
              {/* 1. Okuyorum Anlıyorum */}
              {content.story && (
                <div
                  className="group bg-white/90 hover:bg-white p-6 rounded-3xl border-2 border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-lg flex items-center gap-6 cursor-pointer relative overflow-hidden"
                  onClick={() => startStage('quiz1')}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border-2 border-emerald-100 flex-shrink-0">
                    01
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-amber-950 text-xl mb-0.5">Okuyorum Anlıyorum</h3>
                      {childData?.completedTopics?.includes(`chest-${chestId}-1`) && (
                        <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          TAMAMLANDI
                        </div>
                      )}
                    </div>
                    <p className="text-amber-800/70 text-sm font-medium">Verilen metni dikkatlice oku ve anlama sorularını cevapla.</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              )}

              {/* 2. Dilimi Geliştiriyorum */}
              {(() => {
                const isLocked = !content.lang || (content.story && !childData?.completedTopics?.includes(`chest-${chestId}-1`));
                return (
                  <div
                    className={cn(
                      "group p-6 rounded-3xl border-2 transition-all flex items-center gap-6 relative overflow-hidden",
                      isLocked
                        ? "bg-gray-100/80 border-gray-200 cursor-not-allowed opacity-75"
                        : "bg-white/90 hover:bg-white border-amber-100 hover:border-amber-300 cursor-pointer shadow-sm hover:shadow-lg"
                    )}
                    onClick={() => {
                      if (!isLocked) startStage('lang_intro');
                    }}
                  >
                    {!isLocked && <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />}
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 flex-shrink-0",
                      isLocked ? "bg-gray-200 text-gray-400 border-gray-300" : "bg-blue-50 text-blue-600 border-blue-100"
                    )}>
                      02
                    </div>
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      isLocked ? "bg-gray-200 text-gray-400" : "bg-amber-50 text-amber-700"
                    )}>
                      <Brain className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-black text-xl mb-0.5", isLocked ? "text-gray-500" : "text-amber-950")}>Dilimi Geliştiriyorum</h3>
                        {childData?.completedTopics?.includes(`chest-${chestId}-2`) && (
                          <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            TAMAMLANDI
                          </div>
                        )}
                        {isLocked && content.lang && (
                          <div className="flex items-center gap-1 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold border border-gray-300">
                            KİLİTLİ
                          </div>
                        )}
                      </div>
                      <p className={cn("text-sm font-medium", isLocked ? "text-gray-400" : "text-amber-800/70")}> Kelime dağarcığını geliştir ve dil bilgisi kurallarını uygula.</p>
                    </div>
                    {!isLocked && <ArrowRight className="w-6 h-6 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0" />}
                  </div>
                );
              })()}

              {/* 3. Ülkemi Tanıyorum */}
              {(() => {
                const isLocked = !content.country || (content.lang && !childData?.completedTopics?.includes(`chest-${chestId}-2`));
                return (
                  <div
                    className={cn(
                      "group p-6 rounded-3xl border-2 transition-all flex items-center gap-6 relative overflow-hidden",
                      isLocked
                        ? "bg-gray-100/80 border-gray-200 cursor-not-allowed opacity-75"
                        : "bg-white/90 hover:bg-white border-amber-100 hover:border-amber-300 cursor-pointer shadow-sm hover:shadow-lg"
                    )}
                    onClick={() => {
                      if (!isLocked) startStage('country_intro');
                    }}
                  >
                    {!isLocked && <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />}
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 flex-shrink-0",
                      isLocked ? "bg-gray-200 text-gray-400 border-gray-300" : "bg-purple-50 text-purple-600 border-purple-100"
                    )}>
                      03
                    </div>
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      isLocked ? "bg-gray-200 text-gray-400" : "bg-amber-50 text-amber-700"
                    )}>
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-black text-xl mb-0.5", isLocked ? "text-gray-500" : "text-amber-950")}>Ülkemi Tanıyorum</h3>
                        {childData?.completedTopics?.includes(`chest-${chestId}-3`) && (
                          <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            TAMAMLANDI
                          </div>
                        )}
                        {isLocked && content.country && (
                          <div className="flex items-center gap-1 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold border border-gray-300">
                            KİLİTLİ
                          </div>
                        )}
                      </div>
                      <p className={cn("text-sm font-medium", isLocked ? "text-gray-400" : "text-amber-800/70")}>Türkiye'nin kültürel ve coğrafi zenginliklerini keşfet.</p>
                    </div>
                    {!isLocked && <ArrowRight className="w-6 h-6 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0" />}
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* OKUMA VE ANLAMA TESTİ (BÖLÜM 1) */}
        {stage === 'quiz1' && content?.story && (
          <div className="w-full max-w-4xl flex flex-col gap-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-rose-100 px-4 py-1 rounded-full border border-rose-300 mb-2">
                <span className="text-rose-800 font-bold text-xs uppercase">Tema: {content.story.theme}</span>
              </div>
              <h1 className="text-3xl font-black text-amber-950 tracking-tight">{content.story.title}</h1>
            </div>

            <div className="bg-white/95 p-8 rounded-[30px] border-4 border-amber-200 shadow-lg relative">
              <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                📖 Okuma Metni
              </div>
              <p className="text-amber-900 text-lg font-medium leading-relaxed indent-8">
                {content.story.text}
              </p>
            </div>

            <div className="bg-white/95 p-8 rounded-[30px] border-4 border-blue-200 shadow-lg relative">
              <div className="absolute -top-4 -left-4 bg-blue-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                ❓ Soru {currentQuestion + 1} / {content.story.questions.length}
              </div>

              <h3 className="text-xl font-black text-amber-950 mb-6 mt-2">
                {content.story.questions[currentQuestion].q}
              </h3>

              <div className="grid gap-4">
                {content.story.questions[currentQuestion].options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrectAnswer = idx === content.story.questions[currentQuestion].correct;

                  return (
                    <button
                      key={idx}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center justify-between",
                        isSelected
                          ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                          : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                      )}
                      onClick={() => handleAnswerSelect(idx)}
                      disabled={selectedAnswer !== null || lives === 0}
                    >
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                          isSelected
                            ? isCorrectAnswer ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                            : "bg-white border border-amber-200 text-amber-700"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isSelected && (
                        isCorrectAnswer
                          ? <CheckCircle className="w-6 h-6 text-emerald-500" />
                          : <div className="w-6 h-6 text-rose-500 font-bold">X</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DİLİMİ GELİŞTİRİYORUM - BİLGİ EKRANI */}
        {stage === 'lang_intro' && content?.lang && (
          <div className="w-full max-w-4xl flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-black text-amber-950 tracking-tight">{content.lang.title}</h1>
              <p className="text-amber-800/80 font-medium text-lg mt-1">Harflerin dünyasını keşfet!</p>
            </div>

            <div className="bg-white/95 p-8 rounded-[30px] border-4 border-blue-200 shadow-lg relative">
              <div className="absolute -top-4 -left-4 bg-blue-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                {content.lang.info.title}
              </div>

              <div className="space-y-6 mt-4">
                {content.lang.info.rules.map((rule, idx) => (
                  <div key={idx} className="border-b border-amber-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-black text-amber-950 text-xl mb-1">{rule.name}:</h3>
                    <p className="text-amber-800 font-medium text-base mb-2">{rule.desc}</p>
                    {rule.example && (
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 font-bold text-sm">
                        Örnek: {rule.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="h-16 w-full max-w-md mx-auto rounded-2xl text-xl font-black bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              onClick={() => setStage('etkinlik1')}
            >
              ETKİNLİKLERE BAŞLA
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* ETKİNLİK 1: HARF AVCISI */}
        {stage === 'etkinlik1' && content?.lang && (
          <div className="w-full max-w-4xl flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-black text-amber-950 tracking-tight">{content.lang.etkinlik1.title}</h1>
              <p className="text-amber-800/80 font-medium text-base mt-1">{content.lang.etkinlik1.desc}</p>
            </div>

            <div className="bg-white/95 p-8 rounded-[30px] border-4 border-amber-200 shadow-lg relative">
              <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                ❓ Soru {currentQuestion + 1} / {content.lang.etkinlik1.questions.length}
              </div>

              <h3 className="text-2xl font-black text-amber-950 mb-8 mt-4 text-center">
                {content.lang.etkinlik1.questions[currentQuestion].q}
              </h3>

              <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                {content.lang.etkinlik1.questions[currentQuestion].options ? (
                  content.lang.etkinlik1.questions[currentQuestion].options!.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = idx === content.lang!.etkinlik1.questions[currentQuestion].correct;

                    return (
                      <button
                        key={idx}
                        className={cn(
                          "w-full min-h-[5rem] p-4 rounded-2xl border-2 font-bold text-lg md:text-xl transition-all flex items-center justify-center text-center",
                          isSelected
                            ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                            : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                        )}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={selectedAnswer !== null || lives === 0}
                      >
                        {option}
                      </button>
                    );
                  })
                ) : content.lang.etkinlik1.questions[currentQuestion].words ? (
                  content.lang.etkinlik1.questions[currentQuestion].words!.map((word, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = word === content.lang!.etkinlik1.questions[currentQuestion].correct;

                    return (
                      <button
                        key={idx}
                        className={cn(
                          "w-full min-h-[5rem] p-4 rounded-2xl border-2 font-bold text-lg md:text-xl transition-all flex items-center justify-center text-center",
                          isSelected
                            ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                            : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                        )}
                        onClick={() => handleAnswerSelect(idx, word)}
                        disabled={selectedAnswer !== null || lives === 0}
                      >
                        {word}
                      </button>
                    );
                  })
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* ETKİNLİK 2: CÜMLE MİMARI */}
        {stage === 'etkinlik2' && content?.lang && (
          <div className="w-full max-w-4xl flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-black text-amber-950 tracking-tight">{content.lang.etkinlik2.title}</h1>
              <p className="text-amber-800/80 font-medium text-base mt-1">{content.lang.etkinlik2.desc}</p>
            </div>

            <div className="bg-white/95 p-8 rounded-[30px] border-4 border-amber-200 shadow-lg relative">
              <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                🧩 Soru {currentQuestion + 1} / {content.lang.etkinlik2.questions.length}
              </div>

              {content.lang.etkinlik2.questions[currentQuestion].q && (
                <h3 className="text-xl font-black text-amber-950 mb-4 mt-4 text-center">
                  {content.lang.etkinlik2.questions[currentQuestion].q}
                </h3>
              )}

              {/* Oyun Alanı */}
              {content.lang.etkinlik2.questions[currentQuestion].words ? (
                <>
                  {/* Oluşturulan Cümle Alanı */}
                  <div className="min-h-[80px] bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200 p-4 flex flex-wrap gap-2 items-center justify-center mb-6 mt-4">
                    {constructedSentence.length === 0 ? (
                      <span className="text-amber-400 font-bold">Kelimelere tıklayarak cümleyi oluşturun...</span>
                    ) : (
                      constructedSentence.map((word, idx) => (
                        <button
                          key={idx}
                          className="bg-white px-4 py-2 rounded-xl border-2 border-amber-300 font-bold text-amber-900 shadow-sm hover:bg-amber-50 transition-colors"
                          onClick={() => handleWordClick(word, false)}
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Karışık Kelimeler */}
                  <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {scrambledWords.map((word, idx) => (
                      <button
                        key={idx}
                        className="bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border-2 border-blue-200 font-bold text-blue-700 shadow-sm transition-colors"
                        onClick={() => handleWordClick(word, true)}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </>
              ) : content.lang.etkinlik2.questions[currentQuestion].options ? (
                <div className="flex flex-col gap-4 max-w-2xl mx-auto mb-8 mt-4">
                  {content.lang.etkinlik2.questions[currentQuestion].options!.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = idx === content.lang!.etkinlik2.questions[currentQuestion].correct;

                    return (
                      <button
                        key={idx}
                        className={cn(
                          "w-full min-h-[5rem] p-4 rounded-2xl border-2 font-bold text-lg md:text-xl transition-all flex items-center justify-center text-center",
                          isSelected
                            ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                            : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                        )}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={selectedAnswer !== null || lives === 0}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {/* Kontrol Et Butonu */}
              <div className="flex justify-center">
                <Button
                  className={cn(
                    "h-14 px-8 rounded-xl text-lg font-black transition-all shadow-md flex items-center gap-2",
                    constructedSentence.length === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : isCorrect === true
                        ? "bg-emerald-500 text-white"
                        : isCorrect === false
                          ? "bg-rose-500 text-white"
                          : "bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105"
                  )}
                  onClick={checkSentence}
                  disabled={constructedSentence.length === 0 || isCorrect !== null || lives === 0}
                >
                  {isCorrect === true ? (
                    <>Doğru! <CheckCircle className="w-5 h-5" /></>
                  ) : isCorrect === false ? (
                    "Tekrar Dene!"
                  ) : (
                    "Kontrol Et"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ÜLKEMİ TANIYORUM - BİLGİ EKRANI (KÜLTÜR KARTI) */}
        {stage === 'country_intro' && content?.country && (
          <div className="w-full max-w-4xl flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-black text-amber-950 tracking-tight">{content.country.title}</h1>
              <p className="text-amber-800/80 font-medium text-lg mt-1">Ülkemizi Keşfedelim!</p>
            </div>

            <div className="bg-white/95 p-8 rounded-[30px] border-4 border-purple-200 shadow-lg relative">
              <div className="absolute -top-4 -left-4 bg-purple-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                📇 {content.country.info.title}
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-10">
                <Globe className="w-32 h-32 text-purple-900" />
              </div>

              <div className="space-y-6 mt-6 relative z-10">
                {content.country.info.rules.map((rule, idx) => (
                  <div key={idx} className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 hover:border-purple-300 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                        {idx === 0 ? <Waves className="w-5 h-5" /> : idx === 1 ? <Globe className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                      </div>
                      <h3 className="font-black text-purple-950 text-xl">{rule.name}</h3>
                    </div>
                    <p className="text-purple-900/80 font-medium text-base ml-11">{rule.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="h-16 w-full max-w-md mx-auto rounded-2xl text-xl font-black bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              onClick={() => setStage('country_etkinlik1')}
            >
              KEŞFE BAŞLA!
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* ETKİNLİK 1: KONUM AVCISI */}
        {stage === 'country_etkinlik1' && content?.country && (
          <div className="w-full max-w-4xl flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-black text-amber-950 tracking-tight">{content.country.etkinlik1.title}</h1>
              <p className="text-amber-800/80 font-medium text-base mt-1">{content.country.etkinlik1.desc}</p>
            </div>

            <div className="bg-white/95 p-8 rounded-[30px] border-4 border-amber-200 shadow-lg relative">
              <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                ❓ Soru {currentQuestion + 1} / {content.country.etkinlik1.questions.length}
              </div>

              <h3 className="text-xl font-black text-amber-950 mb-6 mt-2">
                {content.country.etkinlik1.questions[currentQuestion].q}
              </h3>

              <div className="grid gap-4">
                {content.country.etkinlik1.questions[currentQuestion].options ? (
                  content.country.etkinlik1.questions[currentQuestion].options!.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = idx === content.country!.etkinlik1.questions[currentQuestion].correct;

                    return (
                      <button
                        key={idx}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center justify-between",
                          isSelected
                            ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                            : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                        )}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={selectedAnswer !== null || lives === 0}
                      >
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                            isSelected
                              ? isCorrectAnswer ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                              : "bg-white border border-amber-200 text-amber-700"
                          )}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {isSelected && (
                          isCorrectAnswer
                            ? <CheckCircle className="w-6 h-6 text-emerald-500" />
                            : <div className="w-6 h-6 text-rose-500 font-bold">X</div>
                        )}
                      </button>
                    );
                  })
                ) : content.country.etkinlik1.questions[currentQuestion].words ? (
                  content.country.etkinlik1.questions[currentQuestion].words!.map((word, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = word === content.country!.etkinlik1.questions[currentQuestion].correct;

                    return (
                      <button
                        key={idx}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 font-bold text-center transition-all",
                          isSelected
                            ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                            : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                        )}
                        onClick={() => handleAnswerSelect(idx, word)}
                        disabled={selectedAnswer !== null || lives === 0}
                      >
                        {word}
                      </button>
                    );
                  })
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* ETKİNLİK 2: HARITA DEDEKTIFI */}
        {stage === 'country_etkinlik2' && content?.country && (
          <div className="w-full max-w-4xl flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-black text-amber-950 tracking-tight">{content.country.etkinlik2.title}</h1>
              <p className="text-amber-800/80 font-medium text-base mt-1">{content.country.etkinlik2.desc}</p>
            </div>

            <div className="bg-white/95 p-8 rounded-[30px] border-4 border-amber-200 shadow-lg relative">
              <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
                🧩 Soru {currentQuestion + 1} / {content.country.etkinlik2.questions.length}
              </div>

              <h3 className="text-xl font-black text-amber-950 mb-8 mt-4 text-center leading-relaxed">
                {content.country.etkinlik2.questions[currentQuestion].q}
              </h3>

              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {content.country.etkinlik2.questions[currentQuestion].words ? (
                  content.country.etkinlik2.questions[currentQuestion].words!.map((word, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = word === content.country!.etkinlik2.questions[currentQuestion].correct;

                    return (
                      <button
                        key={idx}
                        className={cn(
                          "px-6 py-3 rounded-xl border-2 font-bold text-lg transition-all",
                          isSelected
                            ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                            : "bg-white border-amber-200 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                        )}
                        onClick={() => handleAnswerSelect(idx, word)}
                        disabled={selectedAnswer !== null || lives === 0}
                      >
                        {word}
                      </button>
                    );
                  })
                ) : content.country.etkinlik2.questions[currentQuestion].options ? (
                  <div className="w-full flex flex-col gap-4">
                    {content.country.etkinlik2.questions[currentQuestion].options!.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrectAnswer = idx === content.country!.etkinlik2.questions[currentQuestion].correct;

                      return (
                        <button
                          key={idx}
                          className={cn(
                            "w-full p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center justify-between",
                            isSelected
                              ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                              : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                          )}
                          onClick={() => handleAnswerSelect(idx)}
                          disabled={selectedAnswer !== null || lives === 0}
                        >
                          <div className="flex items-center gap-4">
                            <span className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                              isSelected
                                ? isCorrectAnswer ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                : "bg-white border border-amber-200 text-amber-700"
                            )}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>

                          {isSelected && (
                            isCorrectAnswer
                              ? <CheckCircle className="w-6 h-6 text-emerald-500" />
                              : <div className="w-6 h-6 text-rose-500 font-bold">X</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* CAN BİTTİ EKRANI */}
        {stage === 'game_over' && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center py-12">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-rose-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl border-b-[8px] border-gray-100">
                <Heart className="w-20 h-20 text-gray-400 fill-gray-400" />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-rose-500">0</div>
            </div>

            <h1 className="text-5xl font-black text-amber-950 mb-4 tracking-tight">CANLARIN BİTTİ! 💔</h1>
            <p className="text-2xl font-bold text-amber-800 mb-2">Üzülme, tekrar deneyebilirsin.</p>
            <p className="text-lg text-amber-700/80 mb-8 font-medium">Soruları daha dikkatli okursan başarabilirsin!</p>

            <Button
              className="h-16 px-10 rounded-2xl text-xl font-black bg-amber-500 text-white hover:bg-amber-600 hover:scale-105 transition-all shadow-xl active:scale-95"
              onClick={() => {
                setLives(5);
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setIsCorrect(null);
                if (failedStage === 'quiz1') setStage('quiz1');
                else if (failedStage === 'etkinlik1' || failedStage === 'etkinlik2') setStage('lang_intro');
                else if (failedStage === 'country_etkinlik1' || failedStage === 'country_etkinlik2') setStage('country_intro');
                else setStage('list');
              }}
            >
              TEKRAR DENE
            </Button>
          </div>
        )}

        {/* BAŞARI VE KUTLAMA EKRANI */}
        {stage === 'success' && (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center py-12">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl border-b-[8px] border-gray-100 animate-bounce">
                <Trophy className="w-20 h-20 text-yellow-400" />
              </div>
              <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-yellow-400 animate-spin-slow" />
              <Star className="absolute -bottom-4 -left-4 w-8 h-8 text-yellow-400 animate-bounce delay-100" />
            </div>

            <h1 className="text-5xl font-black text-amber-950 mb-4 tracking-tight">TEBRİKLER! 🎉</h1>
            <p className="text-2xl font-bold text-amber-800 mb-2">Harika İş Çıkardın!</p>
            <p className="text-lg text-amber-700/80 mb-8 font-medium">Bu adımı başarıyla tamamladın.</p>

            <Button
              className="h-16 px-10 rounded-2xl text-xl font-black bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-all shadow-xl active:scale-95"
              onClick={() => setStage('list')}
            >
              HARİTAYA DÖN VE DEVAM ET
            </Button>
          </div>
        )}

      </div>

      {/* BAŞLANGIÇ UYARI POPUP'I */}
      <AnimatePresence>
        {showWarningPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative bg-white w-full max-w-md rounded-[40px] border-4 border-amber-300 shadow-2xl overflow-hidden z-10 p-8 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center border-4 border-rose-200">
                  <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-1 rounded-full border border-amber-300 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800 font-bold text-xs uppercase">Önemli Uyarı</span>
              </div>

              <h2 className="text-2xl font-black text-amber-950 mb-3">5 Canın Var!</h2>
              <p className="text-amber-800/80 font-medium text-base mb-6">
                Bu sandıkta toplam **5 canın** var. Emin olmadan soruları cevaplama! Canların biterse testi baştan almak zorunda kalırsın.
              </p>

              <Button
                className="w-full h-14 rounded-2xl text-lg font-black bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-all shadow-lg active:scale-95"
                onClick={proceedToStage}
              >
                ANLADIM, BAŞLA!
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
