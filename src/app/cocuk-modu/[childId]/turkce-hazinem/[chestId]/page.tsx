'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import { Loader2, Trophy, BookOpen, Brain, MapPin, ArrowLeft, ArrowRight, CheckCircle, Heart } from 'lucide-react';
import { ChildSidebar } from '@/components/child-mode/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { BadgeUnlockModal } from '@/components/child-mode/badge-unlock-modal';
import { checkNewBadgeUnlock, getEarnedBadgesAsStickers, BadgeUnlock } from '@/lib/progression';

import { CHESTS_CONTENT, Question } from '@/data/turkce-hazinem-data';

type Stage = 'list' | 'okuyorumAnliyorum' | 'dilimiOgreniyorum' | 'ulkemiOgreniyorum' | 'success' | 'game_over';

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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState<BadgeUnlock | null>(null);

  const [lives, setLives] = useState(5);

  const content = useMemo(() => CHESTS_CONTENT[chestId], [chestId]);

  const childDocRef = useMemo(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!childDocRef || !childData) return;
    const topics = childData.completedTopics || [];
    if (topics.length === 0) return;
    const earnedStickers = getEarnedBadgesAsStickers(topics);
    if (Object.keys(earnedStickers).length === 0) return;
    const currentStickers = childData.stickers || {};
    const missing = Object.entries(earnedStickers).filter(([id]) => !currentStickers[id]);
    if (missing.length === 0) return;
    const merged = { ...currentStickers, ...earnedStickers };
    setDoc(childDocRef, { stickers: merged }, { merge: true });
  }, [childDocRef, childData?.completedTopics]);

  const decreaseLives = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives === 0) {
        setTimeout(() => setStage('game_over'), 1000);
      }
      return newLives;
    });
  };

  const handleAnswerSelect = (idx: number, questions: Question[], completeKey: string) => {
    if (selectedAnswer !== null || lives === 0) return;
    
    setSelectedAnswer(idx);
    const correct = idx === questions[currentQuestion].correct;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        } else {
          handleQuizComplete(completeKey);
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

  const handleQuizComplete = async (completedKey: string) => {
    if (childDocRef) {
      let xpToAdd = 20;
      if (completedKey.endsWith('-2')) xpToAdd = 30;
      if (completedKey.endsWith('-3')) xpToAdd = 50;

      const currentXp = childData?.xp || 0;
      const oldTopics = childData?.completedTopics || [];
      const newTopics = [...oldTopics];
      if (!newTopics.includes(completedKey)) {
        newTopics.push(completedKey);
      }
      
      const unlockedBadge = checkNewBadgeUnlock(oldTopics, newTopics);

      await updateDoc(childDocRef, {
        completedTopics: arrayUnion(completedKey),
        xp: increment(xpToAdd)
      });

      if (unlockedBadge) {
        setNewBadge(unlockedBadge);
        const newStickers = {
          ...(childData?.stickers || {}),
          [unlockedBadge.id]: unlockedBadge.icon
        };
        await setDoc(childDocRef, { stickers: newStickers }, { merge: true });
      }
    }
    setStage('success');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const startStage = (newStage: Stage) => {
    setStage(newStage);
    setLives(5);
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
        <p className="text-amber-900 font-bold text-xl">Veri bulunamadı. (Sandık {chestId})</p>
      </div>
    );
  }

  const renderQuiz = (data: any, completeKey: string, icon: React.ReactNode, bgColor: string, textColor: string) => (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-amber-950 tracking-tight">{data.title}</h1>
        {data.theme && <p className="text-amber-800/80 font-medium text-lg mt-1">Tema: {data.theme}</p>}
        {data.desc && <p className="text-amber-800/80 font-medium text-lg mt-1">{data.desc}</p>}
      </div>

      {data.text && (
        <div className="bg-white/95 p-8 rounded-[30px] border-4 border-amber-200 shadow-lg relative">
          <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
            📖 Okuma Metni
          </div>
          <p className="text-amber-900 text-lg font-medium leading-relaxed indent-8">
            {data.text}
          </p>
        </div>
      )}

      <div className={cn("bg-white/95 p-8 rounded-[30px] border-4 shadow-lg relative", bgColor)}>
        <div className={cn("absolute -top-4 -left-4 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2", textColor.replace('text-', 'bg-'))}>
          {icon} Soru {currentQuestion + 1} / {data.questions.length}
        </div>

        <h3 className="text-xl font-black text-amber-950 mb-6 mt-4">
          {data.questions[currentQuestion]?.q}
        </h3>

        <div className="grid gap-4">
          {data.questions[currentQuestion]?.options?.map((option: string, idx: number) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectAnswer = idx === data.questions[currentQuestion]?.correct;

            return (
              <button
                key={idx}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center justify-between",
                  isSelected
                    ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                    : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                )}
                onClick={() => handleAnswerSelect(idx, data.questions, completeKey)}
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
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans relative">
      <ChildSidebar childId={childId} childData={childData} />
      <BadgeUnlockModal badge={newBadge} onClose={() => setNewBadge(null)} />

      <div className="fixed inset-0 bg-gradient-to-b from-[#bae6fd] via-[#fef08a] to-[#fcd34d] z-0" />
      <div className="fixed inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] z-1" style={{ backgroundSize: '500px' }} />

      {showConfetti && <Confetti width={width} height={height} className="z-50" />}

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-5xl flex justify-between items-center mb-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-2xl h-12 w-12 bg-white/90 border-none shadow-lg hover:scale-105 transition-all"
            onClick={() => stage !== 'list' ? setStage('list') : router.push(`/cocuk-modu/${childId}/turkce-hazinem`)}
          >
            <ArrowLeft className="w-6 h-6 text-amber-700" />
          </Button>

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

        {stage === 'list' && (
          <div className="w-full max-w-3xl flex flex-col gap-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-black text-amber-950 tracking-tight">Sandık {chestId}</h1>
              <p className="text-amber-800/80 font-medium text-lg mt-2">Bu hazineyi tamamlamak için aşağıdaki adımları sırasıyla bitirmelisin.</p>
            </div>

            {/* 1. Okuyorum Anlıyorum */}
            <div
              className="group bg-white/90 hover:bg-white p-6 rounded-3xl border-2 border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-lg flex items-center gap-6 cursor-pointer relative overflow-hidden"
              onClick={() => startStage('okuyorumAnliyorum')}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border-2 border-emerald-100">01</div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><BookOpen className="w-6 h-6" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-amber-950 text-xl mb-0.5">Okuyorum Anlıyorum</h3>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* 2. Dilimi Öğreniyorum */}
            <div
              className="group bg-white/90 hover:bg-white p-6 rounded-3xl border-2 border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-lg flex items-center gap-6 cursor-pointer relative overflow-hidden"
              onClick={() => startStage('dilimiOgreniyorum')}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border-2 border-blue-100">02</div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><Brain className="w-6 h-6" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-amber-950 text-xl mb-0.5">Dilimi Öğreniyorum</h3>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* 3. Ülkemi Öğreniyorum */}
            <div
              className="group bg-white/90 hover:bg-white p-6 rounded-3xl border-2 border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-lg flex items-center gap-6 cursor-pointer relative overflow-hidden"
              onClick={() => startStage('ulkemiOgreniyorum')}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xl border-2 border-purple-100">03</div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><MapPin className="w-6 h-6" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-amber-950 text-xl mb-0.5">Ülkemi Öğreniyorum</h3>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        )}

        {stage === 'okuyorumAnliyorum' && renderQuiz(content.okuyorumAnliyorum, `chest-${chestId}-1`, <BookOpen className="w-4 h-4"/>, "border-emerald-200", "text-emerald-500")}
        {stage === 'dilimiOgreniyorum' && renderQuiz(content.dilimiOgreniyorum, `chest-${chestId}-2`, <Brain className="w-4 h-4"/>, "border-blue-200", "text-blue-500")}
        {stage === 'ulkemiOgreniyorum' && renderQuiz(content.ulkemiOgreniyorum, `chest-${chestId}-3`, <MapPin className="w-4 h-4"/>, "border-purple-200", "text-purple-500")}
        
        {stage === 'success' && (
          <div className="text-center bg-white/90 p-12 rounded-[40px] shadow-2xl max-w-2xl border-4 border-amber-200 animate-in zoom-in">
            <Trophy className="w-32 h-32 text-amber-400 mx-auto mb-6" />
            <h2 className="text-5xl font-black text-amber-950 mb-4">Harika İş Çıkardın!</h2>
            <p className="text-2xl text-amber-800 font-bold mb-8">Görev başarıyla tamamlandı.</p>
            <Button
              className="h-16 px-12 rounded-2xl text-xl font-black bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-all shadow-xl"
              onClick={() => setStage('list')}
            >
              Sandığa Dön
            </Button>
          </div>
        )}

        {stage === 'game_over' && (
          <div className="text-center bg-white/90 p-12 rounded-[40px] shadow-2xl max-w-2xl border-4 border-rose-200 animate-in zoom-in">
            <div className="text-6xl mb-6">💔</div>
            <h2 className="text-4xl font-black text-rose-950 mb-4">Canların Tükendi!</h2>
            <p className="text-xl text-rose-800 font-bold mb-8">Biraz dinlen ve tekrar dene.</p>
            <Button
              className="h-16 px-12 rounded-2xl text-xl font-black bg-rose-500 text-white hover:bg-rose-600 hover:scale-105 transition-all shadow-xl"
              onClick={() => setStage('list')}
            >
              Başa Dön
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
