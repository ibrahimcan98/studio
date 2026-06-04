const fs = require('fs');

const pageContent = `
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

import { CHESTS_CONTENT, Question, Activity } from '@/data/turkce-hazinem-data';

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
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // States for different activity types
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // State for Sorting Activity
  const [sortingAnswers, setSortingAnswers] = useState<Record<string, string>>({});
  
  // State for Fill in Blanks Activity
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});

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
    setCurrentActivityIndex(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSortingAnswers({});
    setFillAnswers({});
  };

  const nextActivity = (activities: Activity[], completeKey: string) => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setSortingAnswers({});
      setFillAnswers({});
    } else {
      handleQuizComplete(completeKey);
    }
  };

  // MULTIPLE CHOICE & TRUE FALSE LOGIC
  const handleAnswerSelect = (idx: number | boolean, questions: Question[], completeKey: string, activities?: Activity[]) => {
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
          if (activities) {
            nextActivity(activities, completeKey);
          } else {
            handleQuizComplete(completeKey); // For Okuyorum Anliyorum
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

  // SORTING LOGIC
  const handleSortItem = (itemLabel: string, selectedCategory: string, items: any[], activities: Activity[], completeKey: string) => {
    if (lives === 0) return;
    const correctCategory = items.find(i => i.label === itemLabel)?.category;
    
    if (selectedCategory === correctCategory) {
      const newAnswers = { ...sortingAnswers, [itemLabel]: selectedCategory };
      setSortingAnswers(newAnswers);
      
      // Check if all items are sorted correctly
      if (Object.keys(newAnswers).length === items.length) {
        setTimeout(() => {
          nextActivity(activities, completeKey);
        }, 1500);
      }
    } else {
      decreaseLives();
    }
  };

  // FILL IN BLANKS LOGIC
  const handleFillBlank = (sentenceIdx: number, selectedWord: string, sentences: any[], activities: Activity[], completeKey: string) => {
    if (lives === 0) return;
    const correctWord = sentences[sentenceIdx].answer;
    
    if (selectedWord === correctWord) {
      const newAnswers = { ...fillAnswers, [sentenceIdx]: selectedWord };
      setFillAnswers(newAnswers);
      
      // Check if all blanks are filled
      if (Object.keys(newAnswers).length === sentences.length) {
        setTimeout(() => {
          nextActivity(activities, completeKey);
        }, 1500);
      }
    } else {
      decreaseLives();
    }
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

  // --- RENDERERS ---

  const renderOkuyorumAnliyorum = (data: any, completeKey: string) => (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-amber-950 tracking-tight">{data.title}</h1>
        {data.theme && <p className="text-amber-800/80 font-medium text-lg mt-1">Tema: {data.theme}</p>}
      </div>

      <div className="bg-white/95 p-8 rounded-[30px] border-4 border-amber-200 shadow-lg relative">
        <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
          📖 Okuma Metni
        </div>
        <p className="text-amber-900 text-lg font-medium leading-relaxed indent-8 whitespace-pre-wrap">
          {data.text}
        </p>
      </div>

      <div className="bg-white/95 p-8 rounded-[30px] border-4 border-emerald-200 shadow-lg relative">
        <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2">
          <BookOpen className="w-4 h-4"/> Soru {currentQuestion + 1} / {data.questions.length}
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

  const renderActivitySection = (data: any, completeKey: string, icon: React.ReactNode, bgColor: string, textColor: string) => {
    const act = data.activities[currentActivityIndex];
    if (!act) return null;

    return (
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-amber-950 tracking-tight">{data.title}</h1>
          <p className="text-amber-800/80 font-medium text-lg mt-1">{act.title}</p>
        </div>

        {act.type === 'info' && (
          <div className={cn("bg-white/95 p-8 rounded-[30px] border-4 shadow-lg relative", bgColor)}>
            <div className={cn("absolute -top-4 -left-4 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2", textColor.replace('text-', 'bg-'))}>
              {icon} Bilgi
            </div>
            <p className="text-amber-900 text-lg font-medium leading-relaxed whitespace-pre-wrap">
              {act.text}
            </p>
            <Button
              className={cn("mt-8 h-14 w-full rounded-2xl text-lg font-black text-white hover:scale-105 transition-all shadow-xl", textColor.replace('text-', 'bg-').replace('500', '600'))}
              onClick={() => nextActivity(data.activities, completeKey)}
            >
              Devam Et <ArrowRight className="ml-2" />
            </Button>
          </div>
        )}

        {(act.type === 'multiple_choice' || act.type === 'true_false') && (
          <div className={cn("bg-white/95 p-8 rounded-[30px] border-4 shadow-lg relative", bgColor)}>
            <div className={cn("absolute -top-4 -left-4 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2", textColor.replace('text-', 'bg-'))}>
              {icon} Soru {currentQuestion + 1} / {act.questions.length}
            </div>
            {act.desc && <p className="text-amber-700 font-bold mb-4">{act.desc}</p>}
            <h3 className="text-xl font-black text-amber-950 mb-6">
              {act.questions[currentQuestion]?.q}
            </h3>

            <div className="grid gap-4">
              {act.type === 'multiple_choice' ? (
                act.questions[currentQuestion]?.options?.map((option: string, idx: number) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrectAnswer = idx === act.questions[currentQuestion]?.correct;

                  return (
                    <button
                      key={idx}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center justify-between",
                        isSelected
                          ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                          : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                      )}
                      onClick={() => handleAnswerSelect(idx, act.questions, completeKey, data.activities)}
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
                    </button>
                  );
                })
              ) : (
                // True/False
                [true, false].map((val, idx) => {
                  const isSelected = selectedAnswer === val;
                  const isCorrectAnswer = val === act.questions[currentQuestion]?.correct;

                  return (
                    <button
                      key={idx}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 font-bold text-center transition-all flex items-center justify-center",
                        isSelected
                          ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                          : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                      )}
                      onClick={() => handleAnswerSelect(val, act.questions, completeKey, data.activities)}
                      disabled={selectedAnswer !== null || lives === 0}
                    >
                      {val ? 'Doğru' : 'Yanlış'}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {act.type === 'sorting' && (
          <div className={cn("bg-white/95 p-8 rounded-[30px] border-4 shadow-lg relative", bgColor)}>
            <div className={cn("absolute -top-4 -left-4 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2", textColor.replace('text-', 'bg-'))}>
              {icon} Sınıflandırma
            </div>
            {act.desc && <p className="text-amber-700 font-bold mb-4">{act.desc}</p>}
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {act.categories.map((cat: string) => (
                <div key={cat} className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 min-h-[150px]">
                  <h4 className="font-black text-amber-900 mb-2 text-center border-b-2 border-amber-200 pb-2">{cat}</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(sortingAnswers).map(([item, selectedCat]) => {
                      if (selectedCat === cat) {
                        return <span key={item} className="bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold shadow">{item}</span>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {act.items.map((item: any) => {
                if (sortingAnswers[item.label]) return null; // already sorted
                
                return (
                  <div key={item.label} className="flex flex-col gap-2 items-center bg-white p-2 rounded-xl shadow-md border border-gray-200">
                    <span className="font-black text-2xl text-gray-800">{item.label}</span>
                    <div className="flex gap-2">
                      {act.categories.map((cat: string) => (
                        <Button key={cat} size="sm" variant="outline" className="text-xs" onClick={() => handleSortItem(item.label, cat, act.items, data.activities, completeKey)}>
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {act.type === 'fill_in_blanks' && (
          <div className={cn("bg-white/95 p-8 rounded-[30px] border-4 shadow-lg relative", bgColor)}>
            <div className={cn("absolute -top-4 -left-4 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2", textColor.replace('text-', 'bg-'))}>
              {icon} Boşluk Doldurma
            </div>
            {act.desc && <p className="text-amber-700 font-bold mb-4">{act.desc}</p>}
            
            <div className="flex flex-col gap-6 mb-8">
              {act.sentences.map((sentence: any, idx: number) => {
                const parts = sentence.text.split('{blank}');
                const isFilled = !!fillAnswers[idx];
                return (
                  <div key={idx} className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 font-medium text-lg flex flex-wrap items-center gap-2">
                    {parts[0]}
                    {isFilled ? (
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold">{fillAnswers[idx]}</span>
                    ) : (
                      <span className="inline-block border-b-2 border-dashed border-amber-400 w-24 mx-2"></span>
                    )}
                    {parts[1]}
                    
                    {!isFilled && (
                      <div className="flex gap-2 ml-auto mt-2 sm:mt-0">
                        {act.words.map((word: string) => {
                           // don't show words that are already used? actually let's show all available
                           const isUsed = Object.values(fillAnswers).includes(word);
                           if (isUsed) return null;
                           return (
                            <Button key={word} size="sm" variant="outline" onClick={() => handleFillBlank(idx, word, act.sentences, data.activities, completeKey)}>
                              {word}
                            </Button>
                           );
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    );
  };


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
            onClick={() => stage !== 'list' ? setStage('list') : router.push(\`/cocuk-modu/\${childId}/turkce-hazinem\`)}
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
            {/* List UI from before */}
            <div className="group bg-white/90 hover:bg-white p-6 rounded-3xl border-2 border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-lg flex items-center gap-6 cursor-pointer relative overflow-hidden" onClick={() => startStage('okuyorumAnliyorum')}>
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border-2 border-emerald-100">01</div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><BookOpen className="w-6 h-6" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><h3 className="font-black text-amber-950 text-xl mb-0.5">Okuyorum Anlıyorum</h3></div>
              </div>
            </div>
            
            <div className="group bg-white/90 hover:bg-white p-6 rounded-3xl border-2 border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-lg flex items-center gap-6 cursor-pointer relative overflow-hidden" onClick={() => startStage('dilimiOgreniyorum')}>
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border-2 border-blue-100">02</div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><Brain className="w-6 h-6" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><h3 className="font-black text-amber-950 text-xl mb-0.5">Dilimi Öğreniyorum</h3></div>
              </div>
            </div>

            <div className="group bg-white/90 hover:bg-white p-6 rounded-3xl border-2 border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-lg flex items-center gap-6 cursor-pointer relative overflow-hidden" onClick={() => startStage('ulkemiOgreniyorum')}>
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xl border-2 border-purple-100">03</div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><MapPin className="w-6 h-6" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><h3 className="font-black text-amber-950 text-xl mb-0.5">Ülkemi Öğreniyorum</h3></div>
              </div>
            </div>
          </div>
        )}

        {stage === 'okuyorumAnliyorum' && renderOkuyorumAnliyorum(content.okuyorumAnliyorum, \`chest-\${chestId}-1\`)}
        {stage === 'dilimiOgreniyorum' && renderActivitySection(content.dilimiOgreniyorum, \`chest-\${chestId}-2\`, <Brain className="w-4 h-4"/>, "border-blue-200", "text-blue-500")}
        {stage === 'ulkemiOgreniyorum' && renderActivitySection(content.ulkemiOgreniyorum, \`chest-\${chestId}-3\`, <MapPin className="w-4 h-4"/>, "border-purple-200", "text-purple-500")}
        
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
`;

fs.writeFileSync('src/app/cocuk-modu/[childId]/turkce-hazinem/[chestId]/page.tsx', pageContent, 'utf8');
console.log('Successfully updated page.tsx');
