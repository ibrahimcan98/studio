'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, serverTimestamp, arrayUnion, increment, setDoc, arrayRemove } from 'firebase/firestore';
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
  const isTeacherTestMode = childId === 'demo';
  const { user: authUser, loading: authLoading } = useUser();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  const { width, height } = useWindowSize();

  const isTekrar = chestId?.startsWith('tekrar-');
  const [stage, setStage] = useState<Stage>('list');
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // States for different activity types
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // State for Sorting Activity
  const [sortingAnswers, setSortingAnswers] = useState<Record<string, string>>({});
  const [selectedSortingItem, setSelectedSortingItem] = useState<string | null>(null);
  const [shuffledSortingItems, setShuffledSortingItems] = useState<any[] | null>(null);
  const [shuffledSortingCategories, setShuffledSortingCategories] = useState<string[] | null>(null);
  
  // State for Text Selection
  const [shuffledTextOptions, setShuffledTextOptions] = useState<any[] | null>(null);
  
  // State for Fill in Blanks Activity
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [wrongFills, setWrongFills] = useState<Record<string, string | null>>({});
  const [shuffledOptionsDict, setShuffledOptionsDict] = useState<Record<number, string[]>>({});
  
  // State for Multiple Choice Shuffled Questions
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[] | null>(null);

  // State for Image Selection Activity
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // State for Image Hotspots Activity
  const [selectedHotspotLabel, setSelectedHotspotLabel] = useState<string | null>(null);
  const [placedHotspots, setPlacedHotspots] = useState<Record<string, string>>({});
  const [wrongHotspot, setWrongHotspot] = useState<string | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState<BadgeUnlock | null>(null);

  const [lives, setLives] = useState(5);

  const content = useMemo(() => CHESTS_CONTENT[chestId], [chestId]);

  const childDocRef = useMemo(() => {
    if (!db || !authUser?.uid || !childId || isTeacherTestMode) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId, isTeacherTestMode]);

  const { data: rawChildData, isLoading: childLoading } = useDoc(childDocRef);
  const childData = isTeacherTestMode ? { firstName: 'Demo', completedTopics: [], stickers: {} } : rawChildData;

  const userDocRef = useMemo(() => {
    if (!db || !authUser?.uid) return null;
    return doc(db, 'users', authUser.uid);
  }, [db, authUser?.uid]);
  
  const { data: userData } = useDoc(userDocRef);
  const isChildAssigned = userData?.subscriptionChildIds?.includes(childId);
  const subscriptionTier = (userData?.subscriptionTier !== 'free' && isChildAssigned) 
      ? (userData?.subscriptionTier as string) 
      : 'free';

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
    if (!isTeacherTestMode) {
      setDoc(childDocRef, { stickers: merged }, { merge: true });
    }
  }, [childDocRef, childData?.completedTopics]);

  useEffect(() => {
    if (stage === 'list' || stage === 'success' || stage === 'game_over') return;
    
    let act;
    if (stage === 'okuyorumAnliyorum') {
      act = content?.okuyorumAnliyorum;
    } else if (stage === 'dilimiOgreniyorum' || stage === 'ulkemiOgreniyorum') {
      act = content?.[stage]?.activities?.[currentActivityIndex];
    }
    
    const shuffleArray = (array: any[]) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    if (act?.type === 'sorting') {
      if (act.items) {
        setShuffledSortingItems(shuffleArray(act.items));
      }
      if (act.categories) {
        setShuffledSortingCategories(shuffleArray(act.categories));
      }
    } else {
      setShuffledSortingItems(null);
      setShuffledSortingCategories(null);
    }
    
    if (act?.type === 'text_selection' && act.options) {
      setShuffledTextOptions(shuffleArray(act.options));
    } else {
      setShuffledTextOptions(null);
    }
    
    if (act?.type === 'fill_in_blanks') {
      const dict: Record<number, string[]> = {};
      act.sentences.forEach((s: any, idx: number) => {
        const options = s.options || act.words;
        if (options) {
          dict[idx] = shuffleArray(options);
        }
      });
      setShuffledOptionsDict(dict);
    }
    
    if (stage === 'okuyorumAnliyorum' || act?.type === 'multiple_choice' || act?.type === 'true_false') {
      const newQuestions = act.questions.map((q: Question) => {
        if (stage === 'okuyorumAnliyorum' || act.type === 'multiple_choice') {
          if (q.imageOptions) {
            const originalCorrect = q.imageOptions[q.correct as number];
            const shuffled = shuffleArray(q.imageOptions);
            const newCorrectIndex = shuffled.indexOf(originalCorrect);
            return { ...q, imageOptions: shuffled, correct: newCorrectIndex };
          } else if (q.options) {
            const originalCorrect = q.options[q.correct as number];
            const shuffled = shuffleArray(q.options);
            const newCorrectIndex = shuffled.indexOf(originalCorrect);
            return { ...q, options: shuffled, correct: newCorrectIndex };
          }
        }
        return q;
      });
      setShuffledQuestions(newQuestions);
    } else {
      setShuffledQuestions(null);
    }
  }, [stage, currentActivityIndex, content]);

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
    if (isTeacherTestMode) {
      setStage('success');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      return;
    }

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

      const isHomework = Array.isArray(childData?.activeHomeworkTopics) ? childData.activeHomeworkTopics.includes(params.chestId) : childData?.activeHomeworkTopic === params.chestId;
      const isPremium = subscriptionTier !== 'free';

      if (!isHomework || isPremium) {
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

      // Ödev Tamamlama Kontrolü (Spesifik Hazine)

      if (isHomework && childDocRef && db) {
        updateDoc(childDocRef, { activeHomeworkTopic: null, activeHomeworkTopics: arrayRemove(params.chestId) }).catch(console.error);
        
        const hwQuery = query(
          collection(db, 'game-homeworks'),
          where('childId', '==', childId)
        );
        getDocs(hwQuery).then(async (hwDocs) => {
            const promises: Promise<void>[] = [];
            hwDocs.forEach(docSnap => {
                const d = docSnap.data();
                if (d.topicId === params.chestId && d.status === 'assigned') {
                    promises.push(updateDoc(docSnap.ref, { status: 'completed', completedAt: serverTimestamp() }));
                }
            });
            await Promise.all(promises);
        }).catch((e: any) => {
            console.error(e);
            alert("Ödev durumu güncellenemedi: " + e.message);
        });
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
    setSelectedSortingItem(null);
    setFillAnswers({});
    setWrongFills({});
    setSelectedImages([]);
    setSelectedHotspotLabel(null);
    setPlacedHotspots({});
    setWrongHotspot(null);
  };

  const nextActivity = (activities: Activity[], completeKey: string) => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setSortingAnswers({});
      setSelectedSortingItem(null);
      setFillAnswers({});
      setWrongFills({});
      setSelectedImages([]);
      setSelectedHotspotLabel(null);
      setPlacedHotspots({});
      setWrongHotspot(null);
    } else {
      handleQuizComplete(completeKey);
    }
  };

  // MULTIPLE CHOICE & TRUE FALSE LOGIC
  const handleAnswerSelect = (idx: number | boolean, questions: Question[], completeKey: string, activities?: Activity[]) => {
    if (selectedAnswer !== null || lives === 0) return;
    
    setSelectedAnswer(idx);
    
    let correct = false;
    const qCorrect = questions[currentQuestion].correct;
    if (typeof idx === 'boolean') {
      const normalizedCorrect = qCorrect === 0 || qCorrect === true;
      correct = idx === normalizedCorrect;
    } else {
      correct = idx === qCorrect;
    }
    
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
  const handleSortItem = (itemLabel: string, category: string, items: any[], activities: Activity[], completeKey: string) => {
    if (lives === 0) return;
    const correctCat = items.find(i => i.label === itemLabel)?.category;
    if (correctCat === category) {
      const newAnswers = { ...sortingAnswers, [itemLabel]: category };
      setSortingAnswers(newAnswers);
      setSelectedSortingItem(null);
      if (Object.keys(newAnswers).length === items.length) {
        setTimeout(() => {
          nextActivity(activities, completeKey);
        }, 1500);
      }
    } else {
      decreaseLives();
      setSelectedSortingItem(null);
      setWrongFills(prev => ({ ...prev, [itemLabel as any]: category }));
      setTimeout(() => setWrongFills(prev => ({ ...prev, [itemLabel as any]: null })), 1000);
    }
  };

  // FILL IN BLANKS LOGIC
  const handleFillBlank = (sentenceIdx: number, selectedWord: string, sentences: any[], activities: Activity[], completeKey: string) => {
    if (lives === 0) return;
    const sentence = sentences[sentenceIdx];
    const expectedAnswers = Array.isArray(sentence.answer) ? sentence.answer : [sentence.answer];
    
    let targetBlankIdx = -1;
    for (let i = 0; i < expectedAnswers.length; i++) {
      if (!fillAnswers[`${sentenceIdx}-${i}`]) {
        targetBlankIdx = i;
        break;
      }
    }
    
    if (targetBlankIdx === -1) return;
    
    const correctWord = expectedAnswers[targetBlankIdx];
    const blankKey = `${sentenceIdx}-${targetBlankIdx}`;
    
    if (selectedWord === correctWord) {
      const newAnswers = { ...fillAnswers, [blankKey]: selectedWord };
      setFillAnswers(newAnswers);
      setWrongFills(prev => ({ ...prev, [blankKey]: null }));
      
      let totalBlanks = 0;
      sentences.forEach(s => {
        totalBlanks += Array.isArray(s.answer) ? s.answer.length : 1;
      });
      
      if (Object.keys(newAnswers).length === totalBlanks) {
        setTimeout(() => {
          nextActivity(activities, completeKey);
        }, 1500);
      }
    } else {
      decreaseLives();
      setWrongFills(prev => ({ ...prev, [blankKey]: selectedWord }));
      setTimeout(() => {
        setWrongFills(prev => ({ ...prev, [blankKey]: null }));
      }, 1000);
    }
  };

  // IMAGE SELECTION LOGIC
  const handleImageToggle = (src: string, activities: Activity[], completeKey: string) => {
    if (lives === 0) return;
    const act = activities[currentActivityIndex];
    if (act.type !== 'image_selection') return;
    
    if (selectedImages.includes(src)) return; // Already correctly selected
    
    const imgObj = act.images?.find(i => i.src === src);
    if (!imgObj) return;

    if (imgObj.isCorrect) {
      const newSelected = [...selectedImages, src];
      setSelectedImages(newSelected);
      
      const correctImagesCount = act.images?.filter(i => i.isCorrect).length || 0;
      if (newSelected.length === correctImagesCount) {
         setTimeout(() => nextActivity(activities, completeKey), 1500);
      }
    } else {
      decreaseLives();
      // use wrongFills to track wrong image clicks using index 9999 as a hack or just string keys
      // Actually wrongFills expects number key. Let's just cast or ignore since it's any in JS
      setWrongFills(prev => ({ ...prev, [src as any]: src }));
      setTimeout(() => setWrongFills(prev => ({ ...prev, [src as any]: null })), 1000);
    }
  };

  // TEXT SELECTION LOGIC
  const handleTextSelectionToggle = (text: string, activities: Activity[], completeKey: string) => {
    if (lives === 0) return;
    const act = activities[currentActivityIndex];
    if (act.type !== 'text_selection') return;
    
    if (selectedImages.includes(text)) return; // Reusing selectedImages state for text selections
    
    const optObj = act.options?.find((o: any) => o.text === text);
    if (!optObj) return;

    if (optObj.isCorrect) {
      const newSelected = [...selectedImages, text];
      setSelectedImages(newSelected);
      
      const correctOptionsCount = act.options?.filter((o: any) => o.isCorrect).length || 0;
      if (newSelected.length === correctOptionsCount) {
         setTimeout(() => nextActivity(activities, completeKey), 1500);
      }
    } else {
      decreaseLives();
      setWrongFills(prev => ({ ...prev, [text as any]: text }));
      setTimeout(() => setWrongFills(prev => ({ ...prev, [text as any]: null })), 1000);
    }
  };

  // IMAGE HOTSPOTS LOGIC
  const handleHotspotClick = (hotspotId: string, correctLabel: string, activities: Activity[], completeKey: string) => {
    if (lives === 0 || !selectedHotspotLabel) return;
    if (placedHotspots[hotspotId]) return; // Already placed

    if (selectedHotspotLabel === correctLabel) {
      const newPlaced = { ...placedHotspots, [hotspotId]: selectedHotspotLabel };
      setPlacedHotspots(newPlaced);
      setSelectedHotspotLabel(null);
      
      const act = activities[currentActivityIndex];
      if (act && act.hotspots && Object.keys(newPlaced).length === act.hotspots.length) {
        setTimeout(() => nextActivity(activities, completeKey), 1500);
      }
    } else {
      decreaseLives();
      setWrongHotspot(hotspotId);
      setTimeout(() => setWrongHotspot(null), 1000);
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
          {data.text?.replace(/\\n/g, '\n')}
        </p>
      </div>

      <div className="bg-white/95 p-8 rounded-[30px] border-4 border-emerald-200 shadow-lg relative">
        <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2">
          <BookOpen className="w-4 h-4"/> Soru {currentQuestion + 1} / {data.questions.length}
        </div>

        <h3 className="text-xl font-black text-amber-950 mb-6 mt-4">
          {(shuffledQuestions || data.questions)[currentQuestion]?.q}
        </h3>

        <div className="grid gap-4">
          {(shuffledQuestions || data.questions)[currentQuestion]?.options?.map((option: string, idx: number) => {
            const isSelected = selectedAnswer === idx;
            const currentQ = (shuffledQuestions || data.questions)[currentQuestion];
            const isCorrectAnswer = idx === currentQ?.correct;

            return (
              <button
                key={idx}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center justify-between",
                  isSelected
                    ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                    : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                )}
                onClick={() => handleAnswerSelect(idx, shuffledQuestions || data.questions, completeKey)}
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
            {act.image && (
              <div className="w-full rounded-2xl overflow-hidden border-2 border-amber-200 mb-6 mt-4 shadow-sm">
                <img src={act.image} alt="Bilgi Görseli" className="w-full h-auto object-cover" />
              </div>
            )}
            {act.infoImages && (
              <div className={cn(
                "grid gap-4 mb-6 mt-4",
                act.infoImages.length === 1 ? "grid-cols-1 md:w-3/4 lg:w-2/3 mx-auto" : "grid-cols-2 md:grid-cols-3"
              )}>
                {act.infoImages.map((img: any, idx: number) => (
                  <div key={idx} className="w-full flex flex-col gap-2">
                    <div className="w-full rounded-2xl overflow-hidden border-2 border-amber-200 shadow-sm aspect-[4/3] relative bg-white/80 flex items-center justify-center p-4">
                      <img src={img.src} alt={img.label || `Bilgi Görseli ${idx + 1}`} className="w-full h-full object-contain" />
                    </div>
                    {img.label && (
                      <div className="bg-amber-100 border border-amber-200 rounded-xl py-1 px-2 text-center text-amber-900 font-bold text-sm shadow-sm">
                        {img.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {act.videoUrl && (
              <div className="w-full rounded-2xl overflow-hidden border-2 border-amber-200 mb-6 mt-4 shadow-sm aspect-video">
                {act.videoUrl.endsWith('.mp4') ? (
                  <video controls poster={act.videoPoster} className="w-full h-full object-contain bg-black">
                    <source src={act.videoUrl} type="video/mp4" />
                    Tarayıcınız video etiketini desteklemiyor.
                  </video>
                ) : (
                  <iframe 
                    src={act.videoUrl} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen 
                    className="w-full h-full"
                  ></iframe>
                )}
              </div>
            )}
            <div className="text-amber-900 text-lg font-medium leading-relaxed whitespace-pre-wrap flex flex-col gap-4">
              {act.text?.replace(/\\n/g, '\n').split('\n\n').map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
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
              {(shuffledQuestions || act.questions)[currentQuestion]?.q}
            </h3>

            <div className="grid gap-4">
              {act.type === 'multiple_choice' ? (
                (shuffledQuestions || act.questions)[currentQuestion]?.imageOptions ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(shuffledQuestions || act.questions)[currentQuestion].imageOptions.map((opt: any, idx: number) => {
                      const currentQ = (shuffledQuestions || act.questions)[currentQuestion];
                      const isSelected = selectedAnswer === idx;
                      const isCorrectAnswer = idx === currentQ?.correct;

                      return (
                        <button
                          key={idx}
                          className={cn(
                            "relative flex flex-col rounded-2xl border-4 overflow-hidden transition-all duration-300 transform hover:scale-105 min-h-[180px] bg-white",
                            isSelected
                              ? isCorrectAnswer ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105" : "border-rose-500 bg-rose-100"
                              : "border-amber-200 hover:border-amber-400"
                          )}
                          onClick={() => handleAnswerSelect(idx, shuffledQuestions || act.questions, completeKey, data.activities)}
                          disabled={selectedAnswer !== null || lives === 0}
                        >
                          <div className="relative flex-1 w-full min-h-[130px]">
                            <img src={opt.src} alt={opt.label || "Seçenek"} className={cn("w-full h-full object-contain absolute inset-0 p-3", isSelected && !isCorrectAnswer && "opacity-50")} />
                          </div>
                          {opt.label && (
                            <div className="w-full bg-amber-50 py-2 px-1 text-center border-t border-amber-100 text-amber-950 font-bold text-sm md:text-base">
                              {opt.label}
                            </div>
                          )}
                          {isSelected && isCorrectAnswer && (
                            <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                              <div className="bg-white rounded-full p-1 shadow-lg">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                              </div>
                            </div>
                          )}
                          {isSelected && !isCorrectAnswer && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <div className="bg-white rounded-full p-1 shadow-lg">
                                <div className="w-8 h-8 flex items-center justify-center text-rose-500 font-black text-2xl">X</div>
                              </div>
                            </div>
                          )}

                        </button>
                      );
                    })}
                  </div>
                ) : (
                  (shuffledQuestions || act.questions)[currentQuestion]?.options?.map((option: string, idx: number) => {
                    const currentQ = (shuffledQuestions || act.questions)[currentQuestion];
                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = idx === currentQ?.correct;

                    return (
                      <button
                        key={idx}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center justify-between",
                          isSelected
                            ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                            : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                        )}
                        onClick={() => handleAnswerSelect(idx, shuffledQuestions || act.questions, completeKey, data.activities)}
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
                )
              ) : (
                // True/False
                [0, 1].map((val, idx) => {
                  const answerValue = val === 0 ? true : false;
                  const isSelected = selectedAnswer === answerValue;
                  const qCorrect = act.questions[currentQuestion]?.correct;
                  const normalizedCorrect = qCorrect === 0 || qCorrect === true;
                  const isCorrectAnswer = answerValue === normalizedCorrect;

                  return (
                    <button
                      key={idx}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 font-bold text-center transition-all flex items-center justify-center",
                        isSelected
                          ? isCorrectAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-rose-50 border-rose-500 text-rose-700 shadow-md"
                          : "bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
                      )}
                      onClick={() => handleAnswerSelect(answerValue, act.questions, completeKey, data.activities)}
                      disabled={selectedAnswer !== null || lives === 0}
                    >
                      {val === 0 ? 'Doğru' : 'Yanlış'}
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
            
            {(() => {
              const unsortedItems = (shuffledSortingItems || act.items).filter((item: any) => !sortingAnswers[item.label]);
              if (unsortedItems.length === 0) return null;
              
              const currentItem = selectedSortingItem 
                ? unsortedItems.find((i: any) => i.label === selectedSortingItem) || unsortedItems[0] 
                : unsortedItems[0];
                
              const colorPalettes = [
                "bg-amber-100 border-amber-500",
                "bg-blue-100 border-blue-500",
                "bg-emerald-100 border-emerald-500",
                "bg-purple-100 border-purple-500",
                "bg-pink-100 border-pink-500",
                "bg-orange-100 border-orange-500",
                "bg-cyan-100 border-cyan-500"
              ];
              
              return (
                <div className="mb-8 flex flex-col items-center justify-center bg-white/60 p-4 md:p-6 rounded-[2rem] border-4 border-amber-200 border-dashed mx-auto w-full max-w-4xl">
                  <div className="w-full text-center mb-6">
                    <span className="text-amber-800 font-bold text-sm bg-amber-100 px-4 py-2 rounded-full shadow-sm">Bir ifade seç ve aşağıdaki doğru kutuya yerleştir 👇</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center w-full">
                    {unsortedItems.map((item: any) => {
                      const isCurrent = currentItem.label === item.label;
                      const isWrong = (wrongFills as any)[item.label] !== undefined && (wrongFills as any)[item.label] !== null;
                      const itemIndex = act.items.findIndex((i: any) => i.label === item.label);
                      const colorClass = colorPalettes[itemIndex % colorPalettes.length];
                      
                      return (
                        <button
                          key={item.label}
                          onClick={() => setSelectedSortingItem(item.label)}
                          className={cn(
                            "flex flex-col gap-2 items-center px-6 py-4 rounded-3xl shadow-md border-4 transition-all text-left",
                            isWrong ? "bg-rose-100 border-rose-500" : colorClass,
                            isCurrent ? "scale-105 shadow-xl ring-4 ring-offset-2 ring-emerald-400" : "opacity-70 hover:opacity-100 hover:scale-105"
                          )}
                        >
                          <span className="font-black text-lg text-slate-800">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {act.categories.map((cat: string) => {
                const isCategoryWrong = Object.values(wrongFills).includes(cat);
                const unsorted = (shuffledSortingItems || act.items).filter((item: any) => !sortingAnswers[item.label]);
                const current = selectedSortingItem || (unsorted.length > 0 ? unsorted[0].label : null);
                
                return (
                <div 
                  key={cat} 
                  onClick={() => {
                    if (current) {
                      handleSortItem(current, cat, act.items, data.activities, completeKey);
                    }
                  }}
                  className={cn(
                    "border-4 rounded-2xl p-4 min-h-[100px] transition-all flex flex-col items-center cursor-pointer",
                    isCategoryWrong ? "bg-rose-100 border-rose-500 scale-95" :
                    current ? "bg-amber-50 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] hover:bg-amber-100 hover:scale-[1.02]" : "bg-amber-50 border-amber-200"
                  )}
                >
                  <h4 className="font-black text-amber-900 text-lg md:text-xl mb-4 text-center border-b-2 border-amber-200 w-full pb-2">
                    {/^[0-9]+$/.test(cat) ? '\u00A0' : cat}
                  </h4>
                  <div className="flex flex-col gap-2 w-full items-center">
                    {Object.entries(sortingAnswers).map(([item, selectedCat]) => {
                      if (selectedCat === cat) {
                        return <span key={item} className="bg-emerald-500 text-white px-3 py-2 rounded-xl font-bold shadow-md text-center w-full text-sm md:text-base">{item}</span>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

        {act.type === 'image_selection' && (
          <div className={cn("bg-white/95 p-8 rounded-[30px] border-4 shadow-lg relative", bgColor)}>
            <div className={cn("absolute -top-4 -left-4 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2", textColor.replace('text-', 'bg-'))}>
              {icon} Görsel Seçimi
            </div>
            {act.desc && <p className="text-amber-700 font-bold mb-4">{act.desc}</p>}
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {act.images?.map((img: any, idx: number) => {
                const isSelected = selectedImages.includes(img.src);
                const isWrong = (wrongFills as any)[img.src] === img.src;
                
                return (
                  <button
                    key={idx}
                    className={cn(
                      "relative rounded-2xl border-4 overflow-hidden transition-all duration-300 transform hover:scale-105 min-h-[150px] bg-white",
                      isSelected ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105" : 
                      isWrong ? "border-rose-500 bg-rose-100" : "border-amber-200 hover:border-amber-400"
                    )}
                    onClick={() => handleImageToggle(img.src, data.activities, completeKey)}
                    disabled={isSelected || lives === 0}
                  >
                    <img src={img.src} alt={img.label || "Görsel"} className={cn("w-full h-full object-contain absolute inset-0 p-2", isWrong && "opacity-50")} />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                        <div className="bg-white rounded-full p-1 shadow-lg">
                          <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                      </div>
                    )}
                    {isWrong && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-white rounded-full p-1 shadow-lg">
                          <div className="w-8 h-8 flex items-center justify-center text-rose-500 font-black text-2xl">X</div>
                        </div>
                      </div>
                    )}
                    {img.label && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs font-bold py-2 px-1 text-center truncate z-10">
                        {img.label}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {act.type === 'text_selection' && (
          <div className={cn("bg-white/95 p-8 rounded-[30px] border-4 shadow-lg relative", bgColor)}>
            <div className={cn("absolute -top-4 -left-4 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2", textColor.replace('text-', 'bg-'))}>
              {icon} Bilgi Kartı Seçimi
            </div>
            {act.desc && <p className="text-amber-700 font-bold mb-4">{act.desc}</p>}
            
            <div className="grid gap-4 mb-8">
              {(shuffledTextOptions || act.options)?.map((opt: any, idx: number) => {
                const text = opt.text;
                const isSelected = selectedImages.includes(text);
                const isWrong = (wrongFills as any)[text] === text;
                
                return (
                  <button
                    key={idx}
                    className={cn(
                      "relative p-4 rounded-2xl border-4 transition-all duration-300 transform hover:scale-[1.02] bg-white text-left font-medium text-lg",
                      isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]" : 
                      isWrong ? "border-rose-500 bg-rose-100 text-rose-900" : "border-amber-200 text-amber-900 hover:border-amber-400"
                    )}
                    onClick={() => handleTextSelectionToggle(text, data.activities, completeKey)}
                    disabled={isSelected || lives === 0}
                  >
                    <span className="pr-10 block">{text}</span>
                    {isSelected && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                    )}
                    {isWrong && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full">
                        <div className="w-8 h-8 flex items-center justify-center text-rose-500 font-black text-2xl">X</div>
                      </div>
                    )}
                  </button>
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
                const expectedAnswers = Array.isArray(sentence.answer) ? sentence.answer : [sentence.answer];
                const isCompletelyFilled = expectedAnswers.every((_: any, i: number) => !!fillAnswers[`${idx}-${i}`]);
                
                return (
                  <div key={idx} className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 font-medium text-lg flex flex-wrap items-center gap-2">
                    {parts.map((part: string, pIdx: number) => {
                      if (pIdx === parts.length - 1) return <span key={`text-${pIdx}`}>{part}</span>;
                      
                      const ansKey = `${idx}-${pIdx}`;
                      const isFilled = !!fillAnswers[ansKey];
                      const isWrong = !!wrongFills[ansKey];
                      
                      return (
                        <span key={`group-${pIdx}`} className="flex items-center gap-2">
                          <span>{part}</span>
                          {isFilled ? (
                            <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold">{fillAnswers[ansKey]}</span>
                          ) : (
                            <span className={cn(
                              "inline-flex items-center justify-center border-b-2 border-dashed h-8 min-w-[3rem] px-2",
                              isWrong ? "border-rose-500 text-rose-500" : "border-amber-400"
                            )}>
                              {isWrong ? wrongFills[ansKey] : ""}
                            </span>
                          )}
                        </span>
                      )
                    })}
                    
                    <div className="flex flex-wrap gap-2 w-full mt-3 justify-start sm:justify-end border-t border-amber-200/50 pt-3">
                      {(shuffledOptionsDict[idx] || sentence.options || act.words).map((word: string, wordIdx: number) => {
                         const isWrongOption = expectedAnswers.some((_: any, i: number) => wrongFills[`${idx}-${i}`] === word);
                         
                         return (
                          <Button 
                            key={`${word}-${wordIdx}`} 
                            variant="outline" 
                            className={cn(
                              "h-auto py-2 px-4 whitespace-normal text-left text-sm md:text-base leading-snug rounded-xl shadow-sm border-amber-300 hover:bg-amber-100 hover:text-amber-900 transition-all",
                              isWrongOption && "bg-rose-500 text-white border-rose-500 hover:bg-rose-600 hover:text-white"
                            )}
                            disabled={lives === 0}
                            onClick={() => handleFillBlank(idx, word, act.sentences, data.activities, completeKey)}
                          >
                            {word}
                          </Button>
                         );
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {act.type === 'image_hotspots' && (
          <div className={cn("bg-white/95 p-8 rounded-[30px] border-4 shadow-lg relative", bgColor)}>
            <div className={cn("absolute -top-4 -left-4 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md flex items-center gap-2", textColor.replace('text-', 'bg-'))}>
              {icon} Harita Etkinliği
            </div>
            {act.desc && <p className="text-amber-700 font-bold mb-4">{act.desc}</p>}
            
            <div className="flex flex-wrap gap-4 mb-6 justify-center">
              {act.labels?.map((label: string) => {
                const isPlaced = Object.values(placedHotspots).includes(label);
                const isSelected = selectedHotspotLabel === label;
                return (
                  <Button
                    key={label}
                    onClick={() => setSelectedHotspotLabel(label)}
                    disabled={isPlaced || lives === 0}
                    className={cn(
                      "text-lg font-bold rounded-xl transition-all shadow-md py-6 px-6",
                      isSelected ? "bg-amber-500 hover:bg-amber-600 text-white scale-110 shadow-xl" : "bg-white text-amber-800 border-2 border-amber-200 hover:bg-amber-50",
                      isPlaced && "opacity-50 grayscale cursor-not-allowed scale-100 shadow-none hover:bg-white"
                    )}
                  >
                    {label}
                  </Button>
                )
              })}
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden border-4 border-amber-200 shadow-inner select-none bg-[#e0f2fe]" style={{ aspectRatio: "16/9" }}>
              <img src={act.bgImage} alt="Harita" className="w-full h-full object-cover pointer-events-none" />
              {act.hotspots?.map((hs: any) => {
                const placedLabel = placedHotspots[hs.id];
                const isWrong = wrongHotspot === hs.id;
                
                return (
                  <div 
                    key={hs.id}
                    onClick={() => handleHotspotClick(hs.id, hs.correctLabel, data.activities, completeKey)}
                    className={cn(
                      "absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 rounded-xl transition-all font-bold text-sm cursor-pointer whitespace-nowrap px-4 py-2 shadow-md",
                      placedLabel ? "bg-emerald-500 text-white border-2 border-white scale-110 z-10" : 
                      isWrong ? "bg-rose-500 text-white border-2 border-rose-300 animate-bounce z-10" :
                      "bg-white/90 border-2 border-dashed border-amber-500 text-amber-600 hover:bg-amber-100 hover:scale-110 min-w-[80px] min-h-[40px] z-0"
                    )}
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  >
                    {placedLabel || "Buraya tıkla"}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };


  const pathname = usePathname();
  const isTeacherMode = pathname?.includes('ogretmen-portali');

  return (
    <div className="flex h-screen overflow-hidden font-sans relative">
      {isTeacherMode ? (
        <aside className="w-16 md:w-32 shrink-0 bg-white/20 backdrop-blur-xl border-r border-white/40 flex flex-col items-center py-4 md:py-8 justify-between z-50 shadow-2xl">
            <Button
                variant="outline"
                size="icon"
                className="rounded-xl md:rounded-2xl h-10 w-10 md:h-14 md:w-14 bg-white/90 border-none shadow-xl hover:scale-110 transition-all hover:bg-white active:scale-95"
                onClick={() => router.push('/ogretmen-portali/oyunlar')}
            >
                <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />
            </Button>
            <div className="h-10 w-10 md:h-14 md:w-14" /> {/* Spacer */}
        </aside>
      ) : (
        <ChildSidebar childId={childId} childData={childData} />
      )}
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
            onClick={() => {
              if (stage !== 'list') {
                setStage('list');
              } else {
                if (childId === 'demo') {
                  router.push('/ogretmen-portali/oyunlar');
                } else {
                  router.push(`/cocuk-modu/${childId}/turkce-hazinem`);
                }
              }
            }}
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
              <p className="text-amber-800/80 font-medium text-lg mt-2">
                {isTeacherTestMode
                  ? 'Öğretmen test modu: Tüm bölümler açıktır ve ilerleme kaydedilmez.'
                  : 'Bu hazineyi tamamlamak için aşağıdaki adımları sırasıyla bitirmelisin.'}
              </p>
            </div>
            {(() => {
              const act1Done = childData?.completedTopics?.includes(`chest-${chestId}-1`);
              const act2Done = childData?.completedTopics?.includes(`chest-${chestId}-2`);
              const act3Done = childData?.completedTopics?.includes(`chest-${chestId}-3`);

              const isAct2Locked = !isTeacherTestMode && !act1Done && !isTekrar;
              const isAct3Locked = !isTeacherTestMode && !act2Done && !isTekrar;

              return (
                <>
                  {content?.okuyorumAnliyorum && (
                    <div 
                      className={cn("group p-6 rounded-3xl border-2 transition-all flex items-center gap-6 relative overflow-hidden",
                        act1Done ? "bg-emerald-50 border-emerald-300 opacity-70" : "bg-white/90 border-amber-100 hover:border-amber-300 hover:bg-white shadow-sm hover:shadow-lg cursor-pointer"
                      )} 
                      onClick={() => startStage('okuyorumAnliyorum')}
                    >
                      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border-2 border-emerald-100">01</div>
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        {act1Done ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <BookOpen className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><h3 className="font-black text-amber-950 text-xl mb-0.5">Okuyorum Anlıyorum</h3></div>
                      </div>
                    </div>
                  )}
                  
                  {content?.dilimiOgreniyorum && (
                    <div 
                      className={cn("group p-6 rounded-3xl border-2 transition-all flex items-center gap-6 relative overflow-hidden",
                        isAct2Locked ? "bg-gray-100 border-gray-200 grayscale cursor-not-allowed opacity-60" : 
                        act2Done ? "bg-blue-50 border-blue-300 opacity-70" : "bg-white/90 border-amber-100 hover:border-amber-300 hover:bg-white shadow-sm hover:shadow-lg cursor-pointer"
                      )} 
                      onClick={() => !isAct2Locked && startStage('dilimiOgreniyorum')}
                    >
                      <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border-2 border-blue-100">02</div>
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        {isAct2Locked ? <div className="text-xl">🔒</div> : act2Done ? <CheckCircle className="w-6 h-6 text-blue-500" /> : <Brain className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><h3 className="font-black text-amber-950 text-xl mb-0.5">Dilimi Öğreniyorum</h3></div>
                      </div>
                    </div>
                  )}

                  {content?.ulkemiOgreniyorum && (
                    <div 
                      className={cn("group p-6 rounded-3xl border-2 transition-all flex items-center gap-6 relative overflow-hidden",
                        isAct3Locked ? "bg-gray-100 border-gray-200 grayscale cursor-not-allowed opacity-60" : 
                        act3Done ? "bg-purple-50 border-purple-300 opacity-70" : "bg-white/90 border-amber-100 hover:border-amber-300 hover:bg-white shadow-sm hover:shadow-lg cursor-pointer"
                      )} 
                      onClick={() => !isAct3Locked && startStage('ulkemiOgreniyorum')}
                    >
                      <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />
                      <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xl border-2 border-purple-100">03</div>
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        {isAct3Locked ? <div className="text-xl">🔒</div> : act3Done ? <CheckCircle className="w-6 h-6 text-purple-500" /> : <MapPin className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><h3 className="font-black text-amber-950 text-xl mb-0.5">Ülkemi Öğreniyorum</h3></div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {stage === 'okuyorumAnliyorum' && renderOkuyorumAnliyorum(content.okuyorumAnliyorum, `chest-${chestId}-1`)}
        {stage === 'dilimiOgreniyorum' && renderActivitySection(content.dilimiOgreniyorum, `chest-${chestId}-2`, <Brain className="w-4 h-4"/>, "border-blue-200", "text-blue-500")}
        {stage === 'ulkemiOgreniyorum' && renderActivitySection(content.ulkemiOgreniyorum, `chest-${chestId}-3`, <MapPin className="w-4 h-4"/>, "border-purple-200", "text-purple-500")}
        
        {stage === 'success' && (() => {
          const act1Req = !content?.okuyorumAnliyorum || childData?.completedTopics?.includes(`chest-${chestId}-1`);
          const act2Req = !content?.dilimiOgreniyorum || childData?.completedTopics?.includes(`chest-${chestId}-2`);
          const act3Req = !content?.ulkemiOgreniyorum || childData?.completedTopics?.includes(`chest-${chestId}-3`);
          const isFullyComplete = act1Req && act2Req && act3Req;

          return (
            <div className="text-center bg-white/90 p-12 rounded-[40px] shadow-2xl max-w-2xl border-4 border-amber-200 animate-in zoom-in">
              <Trophy className="w-32 h-32 text-amber-400 mx-auto mb-6" />
              <h2 className="text-5xl font-black text-amber-950 mb-4">{isFullyComplete ? 'Sandık Tamamlandı!' : 'Harika İş Çıkardın!'}</h2>
              <p className="text-2xl text-amber-800 font-bold mb-8">{isFullyComplete ? 'Tüm görevleri bitirdin.' : 'Görev başarıyla tamamlandı.'}</p>
              <Button
                className="h-16 px-12 rounded-2xl text-xl font-black bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-all shadow-xl"
                onClick={() => {
                  if (isFullyComplete) {
                    if (childId === 'demo') {
                      router.push('/ogretmen-portali/oyunlar');
                    } else {
                      router.push(`/cocuk-modu/${childId}/turkce-hazinem`);
                    }
                  } else {
                    setStage('list');
                  }
                }}
              >
                {isFullyComplete ? 'Haritaya Dön' : 'Sandığa Dön'}
              </Button>
            </div>
          );
        })()}

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
