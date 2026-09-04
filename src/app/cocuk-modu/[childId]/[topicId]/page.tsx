'use client';

import { useParams, useRouter } from 'next/navigation';
import topicsData from '@/data/topics.json';
import { ArrowLeft, Loader2, ArrowRight, Footprints, Cloud } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { WordCard } from '@/components/child-mode/word-card';
import { VoiceMatching } from '@/components/child-mode/voice-matching';
import { JigsawPuzzle } from '@/components/child-mode/jigsaw-puzzle';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, setDoc, increment, arrayRemove, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { CheckCircle, Trophy, Star, Sparkles, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/use-tts';
import { motion, AnimatePresence } from 'framer-motion';

const TreasureChest = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 64 64" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-transform duration-500">
    <path d="M12 32 L52 32 L48 56 L16 56 Z" fill="#8B4513" stroke="#5C2E0B" strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 32 L24 56 M40 32 L40 56" stroke="#DAA520" strokeWidth="4" />
    {isOpen ? (
        <g transform="translate(0, -12) rotate(-10, 32, 32)" className="transition-all duration-500">
            <path d="M12 32 Q 32 4 52 32 Z" fill="#A0522D" stroke="#5C2E0B" strokeWidth="2" strokeLinejoin="round" />
            <path d="M24 32 Q 28 16 32 14 M40 32 Q 36 16 32 14" stroke="#DAA520" strokeWidth="4" fill="none" />
        </g>
    ) : (
        <g className="transition-all duration-500">
            <path d="M12 32 Q 32 4 52 32 Z" fill="#A0522D" stroke="#5C2E0B" strokeWidth="2" strokeLinejoin="round" />
            <path d="M24 32 Q 28 16 32 14 M40 32 Q 36 16 32 14" stroke="#DAA520" strokeWidth="4" fill="none" />
            <rect x="28" y="28" width="8" height="10" rx="2" fill="#DAA520" stroke="#B8860B" strokeWidth="1" />
            <circle cx="32" cy="33" r="1.5" fill="#000" />
        </g>
    )}
    {isOpen && <circle cx="32" cy="32" r="10" fill="#FFD700" filter="blur(4px)" opacity="0.8" />}
  </svg>
);


type Word = {
    word: string;
    image: string;
    audio: string;
};

type Topic = {
    id: string;
    name: string;
    icon: string;
    words: number;
    unlocked: boolean;
    wordList: Word[];
};

type GameStage = 'map' | 'learning' | 'matching' | 'quiz' | 'completed';

export default function TopicPage() {
    const params = useParams();
    const router = useRouter();
    const { childId, topicId } = params;
    const [topic, setTopic] = useState<Topic | null>(null);
    const [stage, setStage] = useState<GameStage>('map');
    const [maxStageReached, setMaxStageReached] = useState<number>(0);
    const [isOpeningTreasure, setIsOpeningTreasure] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showStickerPopup, setShowStickerPopup] = useState<string | null>(null);
    const { width, height } = useWindowSize();

    const { user: authUser, loading: authLoading } = useUser();
    const db = useFirestore();

    const childDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid || !childId) return null;
        return doc(db, 'users', authUser.uid, 'children', childId as string);
    }, [db, authUser?.uid, childId]);

    const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

    useEffect(() => {
        if (childData?.completedTopics && topicId) {
            let max = 0;
            if (childData.completedTopics.includes(`${topicId}-learning`)) max = 1;
            if (childData.completedTopics.includes(`${topicId}-matching`)) max = 2;
            if (childData.completedTopics.includes(`${topicId}-quiz`)) max = 3;
            setMaxStageReached(prev => Math.max(prev, max));
        }
    }, [childData, topicId]);

    useEffect(() => {
        if (topicId) {
            const currentTopic = topicsData.find(t => t.id === topicId);
            if (currentTopic) {
                // @ts-ignore
                setTopic(currentTopic as Topic);
            }
        }
    }, [topicId]);

    const { speak } = useTTS();
    const [isShowingSuccess, setIsShowingSuccess] = useState(false);
    const [hasSpokenReward, setHasSpokenReward] = useState(false);

    useEffect(() => {
        if (stage === 'map' && childData?.completedTopics?.includes(`${topicId}-quiz`) && !childData?.stickers?.[topicId as string] && !hasSpokenReward) {
            speak("Harikasın! Tüm görevleri bitirdin. Şimdi aşağıdaki gizemli sandığa dokun ve sürpriz ödülünü al!");
            setHasSpokenReward(true);
        }
    }, [stage, childData, topicId, speak, hasSpokenReward]);

    const handleStageComplete = async (currentStage: GameStage) => {
        if (childDocRef && topicId) {
            const completedKey = `${topicId}-${currentStage}`;
            
            // Define XP for each stage
            let xpToAdd = 20; // Default for learning
            if (currentStage === 'matching') xpToAdd = 30;
            if (currentStage === 'quiz') xpToAdd = 50;

            const isHomework = Array.isArray((childData as any)?.activeHomeworkTopics) ? (childData as any).activeHomeworkTopics.includes(topicId) : (childData as any)?.activeHomeworkTopic === topicId;
            const isPremium = (childData as any)?.isPremium || false;

            if (!(isHomework && !isPremium)) {
                await updateDoc(childDocRef, {
                    completedTopics: arrayUnion(completedKey),
                    xp: increment(xpToAdd)
                });
            }

            if (currentStage === 'quiz') {
                // Her zaman veritabanında bu konuya ait atanmış ödev var mı diye kontrol et ve tamamlandı yap
                if (db) {
                    try {
                        const hwQuery = query(
                            collection(db, 'game-homeworks'), 
                            where('childId', '==', childId)
                        );
                        const snap = await getDocs(hwQuery);
                        const promises: Promise<void>[] = [];
                        snap.forEach(docSnap => {
                            const d = docSnap.data();
                            if (d.topicId === topicId && d.status === 'assigned') {
                                promises.push(updateDoc(docSnap.ref, { status: 'completed', completedAt: serverTimestamp() }));
                            }
                        });
                        await Promise.all(promises);
                    } catch(e: any) {
                        console.error("Error updating homework status:", e);
                        alert("Ödev güncellenirken hata oluştu: " + e.message + ". Lütfen kuralları güncellediğinizden emin olun!");
                    }
                }

                // Child dokümanındaki aktif ödev işaretlerini temizle
                if (isHomework) {
                    await updateDoc(childDocRef, { activeHomeworkTopic: null, activeHomeworkTopics: arrayRemove(topicId) });
                }
                setStage('completed');
                return;
            }

            // Başarı aşamasını göster
            setIsShowingSuccess(true);
            speak("Harika iş çıkardın! Bu bölümü tamamladın. Şimdi bir sonraki maceraya geçiyoruz!");
            setShowConfetti(true);

            setTimeout(() => {
                setIsShowingSuccess(false);
                setShowConfetti(false);
                if (currentStage === 'learning') {
                    setStage('matching');
                    setMaxStageReached(prev => Math.max(prev, 1));
                } else if (currentStage === 'matching') {
                    setStage('quiz');
                    setMaxStageReached(prev => Math.max(prev, 2));
                }
            }, 6000);
        }
    };

    const handleTopicComplete = async () => {
        if (childDocRef && topicId) {
            await updateDoc(childDocRef, {
                completedTopics: arrayUnion(topicId as string),
                badges: arrayUnion(topicId as string)
            });
            setStage('map');
        }
    };

    const handleOpenTreasure = async () => {
        if (!childDocRef || !topicId || !topic) return;
        // @ts-ignore
        if (childData?.stickers?.[topicId as string]) return; // Already opened

        setIsOpeningTreasure(true);
        
        // Wait a bit for the chest open animation, then pick random sticker
        setTimeout(async () => {
            const randomWord = topic.wordList[Math.floor(Math.random() * topic.wordList.length)];
            
            const isHomework = Array.isArray((childData as any)?.activeHomeworkTopics) ? (childData as any).activeHomeworkTopics.includes(topicId) : (childData as any)?.activeHomeworkTopic === topicId;
            const isPremium = (childData as any)?.isPremium || false;

            if (!(isHomework && !isPremium)) {
                await setDoc(childDocRef, {
                    stickers: {
                        [topicId as string]: randomWord.image
                    }
                }, { merge: true });
            }

            setShowStickerPopup(randomWord.image);
            speak("Tebrikler! Bir çıkartma kazandın!");
            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
            }, 6000);
        }, 600);
    };

    if (!topic || authLoading || childLoading || !childData) {
        return (
            <div className="flex h-screen items-center justify-center bg-amber-50">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (stage === 'completed') {
        return (
            <div className="bg-sky-400 h-screen flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                <Confetti width={width} height={height} />
                <div className="relative mb-4 md:mb-8">
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-[6px] md:border-b-[10px] border-gray-100">
                        <Trophy className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 animate-bounce" />
                    </div>
                    <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-100">
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" />
                    </div>
                </div>
                <div className="space-y-2 md:space-y-4 max-w-xl">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">HARİKA İŞ!</h1>
                    <p className="text-lg md:text-2xl font-bold text-sky-100 uppercase tracking-widest drop-shadow-md px-4">
                        "{topic.name.toUpperCase()}" KONUSUNU TAMAMLADIN VE SEVİYE ATLADIN!
                    </p>
                </div>

                <Button
                    className="mt-6 md:mt-12 h-14 md:h-20 px-6 md:px-12 rounded-[24px] md:rounded-[32px] text-lg md:text-2xl font-black bg-white text-sky-500 hover:bg-sky-50 hover:scale-105 transition-all shadow-2xl border-b-4 md:border-b-[6px] border-gray-200 active:border-b-0 active:translate-y-1"
                    onClick={() => setStage('map')}
                >
                    ADAYA DÖN VE ÖDÜLÜ AL
                </Button>
            </div>
        );
    }

    const gradients = [
        "from-sky-400 via-sky-300 to-blue-200",
        "from-green-400 via-emerald-300 to-teal-200",
        "from-purple-400 via-fuchsia-300 to-pink-200",
        "from-orange-400 via-amber-300 to-rose-200",
        "from-indigo-400 via-violet-300 to-purple-200",
        "from-yellow-400 via-orange-300 to-amber-200",
        "from-teal-400 via-cyan-300 to-blue-200",
    ];

    const themeIndex = topicId ? (topicId as string).charCodeAt((topicId as string).length - 1) % gradients.length : 0;
    const currentGradient = gradients[themeIndex];

    const cloudStyles = `
    @keyframes floatRight {
        0% { transform: translateX(-15vw); }
        100% { transform: translateX(115vw); }
    }
    .cloud-1 { animation: floatRight 45s linear infinite; }
    .cloud-2 { animation: floatRight 65s linear infinite; animation-delay: -15s; }
    .cloud-3 { animation: floatRight 55s linear infinite; animation-delay: -30s; }
    .cloud-4 { animation: floatRight 75s linear infinite; animation-delay: -45s; }
    
    @keyframes floatingIsland {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
    }
    .floating-island { animation: floatingIsland 4s ease-in-out infinite; }
    
    @keyframes arrowBounce {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
        50% { transform: translateY(-20px) scale(1.1); opacity: 0.7; }
    }
    .arrow-hint { animation: arrowBounce 1.5s ease-in-out infinite; }
    `;

    if (isShowingSuccess) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
                {showConfetti && <Confetti width={width} height={height} className="z-50" />}
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl border-b-[8px] border-gray-100 animate-bounce">
                        <Trophy className="w-24 h-24 text-yellow-400" />
                    </div>
                </div>
                <h2 className="mt-12 text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg animate-in zoom-in duration-500 delay-200 text-center px-2">
                    Mükemmel! ✨
                </h2>
                <p className="mt-4 text-lg md:text-2xl font-bold text-white/90 uppercase tracking-widest animate-in slide-in-from-bottom duration-500 delay-300 text-center px-4">
                    Sıradaki bölüme geçiyoruz...
                </p>
            </div>
        );
    }

    if (stage === 'map') {
        return (
            <div className={cn("bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] h-screen w-full relative flex flex-col items-center overflow-y-auto overflow-x-hidden scrollbar-hide transition-colors duration-1000", currentGradient)}>
                <style>{cloudStyles}</style>
                {showConfetti && <Confetti width={width} height={height} className="z-50" />}

                {/* YENİ STİCKER POP-UP EKRANI */}
                <AnimatePresence>
                    {showStickerPopup && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowStickerPopup(null)}
                        >
                            <div className="relative w-64 h-64 md:w-96 md:h-96 bg-white/40 backdrop-blur-md rounded-[3rem] border-8 border-yellow-300 shadow-[0_0_80px_rgba(250,204,21,0.8)] flex items-center justify-center p-8 animate-bounce" onClick={e => e.stopPropagation()}>
                                <img src={showStickerPopup} alt="Yeni Sticker" className="w-full h-full object-contain drop-shadow-2xl" />
                                <Sparkles className="absolute -top-8 -right-8 w-20 h-20 text-yellow-300 animate-spin-slow" />
                                <Sparkles className="absolute -bottom-8 -left-8 w-16 h-16 text-yellow-300 animate-spin-slow" style={{ animationDelay: '0.5s' }} />
                            </div>
                            <h2 className="mt-8 text-3xl md:text-6xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg text-center px-4">
                                BİR ÇIKARTMA KAZANDIN!
                            </h2>
                            <Button 
                                className="mt-8 h-14 md:h-16 px-8 md:px-12 rounded-full text-xl font-black bg-yellow-400 text-yellow-900 hover:bg-yellow-300 shadow-xl border-b-[6px] border-yellow-600 active:border-b-0 active:translate-y-1 transition-all"
                                onClick={() => setShowStickerPopup(null)}
                            >
                                DEVAM ET
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sol Üst Geri Butonu */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl md:rounded-2xl h-10 w-10 md:h-16 md:w-16 bg-white/90 border-none shadow-xl hover:scale-110 transition-transform active:scale-95"
                        onClick={() => router.push(`/cocuk-modu/${childId}`)}
                    >
                        <ArrowLeft className="w-5 h-5 md:w-8 md:h-8 text-slate-600" />
                    </Button>
                </div>

                {/* Arka Plan Atmosfer: Dokular ve Dev İkon */}
                <div className="absolute inset-0 bg-white/10 z-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.15 }}></div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[40vw] opacity-[0.05] pointer-events-none select-none filter blur-[2px] z-0 drop-shadow-2xl">
                    {topic.icon}
                </div>

                {/* Hareketli Bulutlar - Mobilde Sayısı Azaltıldı */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                    <Cloud className="absolute top-[10%] left-0 w-24 h-24 md:w-32 md:h-32 text-white/40 fill-white/40 cloud-1 drop-shadow-md" />
                    <Cloud className="hidden md:absolute top-[35%] left-0 w-32 h-32 md:w-48 md:h-48 text-white/30 fill-white/30 cloud-2 drop-shadow-lg" />
                </div>

                {/* Başlık: Yatay modda çok daha küçük, mobilde butonun altında kalsın diye mt-16 */}
                <h1 className="text-sm md:text-3xl lg:text-5xl font-black text-white drop-shadow-lg max-md:mt-16 mt-4 md:mt-12 z-20 bg-white/20 px-4 md:px-10 py-1 md:py-4 rounded-full backdrop-blur-md border-2 md:border-4 border-white/40 uppercase tracking-tighter">
                    {topic.name} ADASI
                </h1>

                {/* Harita Yolu */}
                <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center max-md:mt-8 max-md:mb-4 mt-12 mb-20 z-20 min-h-[400px] md:min-h-[700px] max-md:h-[75vh]">

                    {/* Level 1: Öğrenme (Sol Üst) */}
                    <div className="absolute left-[5%] md:left-[15%] top-[0%] flex flex-col items-center group cursor-pointer z-20" onClick={() => setStage('learning')}>
                        {/* Ok İpucu (Hint) */}
                        <div className="floating-island relative">
                            {/* Numara/Tamamlandı Rozeti */}
                            <div className={cn(
                                "absolute -top-4 -right-4 w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-30 font-black text-white text-2xl italic transition-all duration-500",
                                childData?.completedTopics?.includes(`${topicId}-learning`) ? "bg-green-500 scale-110" : "bg-emerald-500"
                            )}>
                                {childData?.completedTopics?.includes(`${topicId}-learning`) ? (
                                    <CheckCircle className="w-8 h-8 text-white" />
                                ) : (
                                    "1"
                                )}
                            </div>
                            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-white border-[6px] md:border-[10px] border-emerald-300 shadow-[0_15px_35px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center group-hover:scale-110 transition-transform group-active:scale-95 z-10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-transparent opacity-50" />
                                <span className="text-6xl md:text-8xl drop-shadow-sm relative z-10 animate-pulse">📖</span>
                                <div className="absolute bottom-0 w-full h-1/3 bg-emerald-100/50" />
                            </div>
                            {/* Platform Altı Gölgesi */}
                            <div className="w-24 md:w-32 h-6 bg-black/10 rounded-[100%] blur-md mx-auto mt-4 scale-x-125" />
                        </div>
                        <div className="mt-2 md:mt-4 bg-white px-6 py-2 md:px-8 md:py-3 rounded-full shadow-xl border-4 border-emerald-100 group-hover:bg-emerald-50 transition-colors">
                            <span className="font-bold text-emerald-600 text-sm md:text-xl uppercase tracking-wider">Öğrenme</span>
                        </div>
                    </div>

                    {/* Ayak İzleri 1 -> 2 */}
                    <div className="absolute top-[8%] left-[30%] md:left-[35%] rotate-[120deg] opacity-60 animate-pulse" style={{ animationDelay: '0s' }}>
                        <Footprints className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>
                    <div className="absolute top-[13%] left-[45%] md:left-[50%] rotate-[120deg] opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>
                        <Footprints className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>
                    <div className="absolute top-[20%] left-[50%] md:left-[62%] rotate-[130deg] opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>
                        <Footprints className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>

                    {/* Level 2: Dinle & Bul (Sağ Orta) */}
                    <div className="absolute right-[5%] md:right-[15%] top-[25%] flex flex-col items-center group cursor-pointer z-20" onClick={() => {
                        if (maxStageReached >= 1) setStage('matching');
                    }}>
                        {/* Ok İpucu (Hint) */}
                        <div className={cn("floating-island relative", maxStageReached < 1 && "grayscale opacity-70")}>
                            {/* Numara/Tamamlandı Rozeti */}
                            <div className={cn(
                                "absolute -top-4 -right-4 w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-30 font-black text-white text-2xl italic transition-all duration-500",
                                childData?.completedTopics?.includes(`${topicId}-matching`) ? "bg-green-500 scale-110" : maxStageReached >= 1 ? "bg-blue-500" : "bg-gray-400"
                            )}>
                                {childData?.completedTopics?.includes(`${topicId}-matching`) ? (
                                    <CheckCircle className="w-8 h-8 text-white" />
                                ) : (
                                    "2"
                                )}
                            </div>
                            <div className={cn(
                                "w-24 h-24 md:w-36 md:h-36 rounded-full border-[6px] md:border-[10px] shadow-[0_15px_35px_rgba(0,0,0,0.3)] flex items-center justify-center transition-transform z-10 relative overflow-hidden",
                                maxStageReached >= 1 ? "bg-white border-blue-300 group-hover:scale-110 group-active:scale-95" : "bg-gray-100 border-gray-300 cursor-not-allowed"
                            )}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent opacity-50" />
                                <span className={cn("text-6xl md:text-8xl drop-shadow-sm relative z-10", maxStageReached >= 1 && "animate-pulse")}>🎧</span>
                                <div className="absolute bottom-0 w-full h-1/3 bg-blue-100/50" />
                            </div>
                            {/* Platform Altı Gölgesi */}
                            <div className="w-24 md:w-32 h-6 bg-black/10 rounded-[100%] blur-md mx-auto mt-4 scale-x-125" />
                        </div>
                        <div className={cn(
                            "mt-2 md:mt-4 px-6 py-2 md:px-8 md:py-3 rounded-full shadow-xl border-4 transition-colors",
                            maxStageReached >= 1 ? "bg-white border-blue-100 group-hover:bg-blue-50" : "bg-gray-200 border-gray-300 opacity-80"
                        )}>
                            <span className={cn("font-bold text-sm md:text-xl uppercase tracking-wider", maxStageReached >= 1 ? "text-blue-600" : "text-gray-500")}>Dinle & Bul</span>
                        </div>
                    </div>

                    {/* Ayak İzleri 2 -> 3 */}
                    <div className="absolute top-[35%] right-[30%] md:right-[35%] rotate-[240deg] opacity-60 animate-pulse" style={{ animationDelay: '0s' }}>
                        <Footprints className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>
                    <div className="absolute top-[40%] right-[45%] md:right-[50%] rotate-[240deg] opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>
                        <Footprints className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>
                    <div className="absolute top-[46%] right-[60%] md:right-[65%] rotate-[240deg] opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>
                        <Footprints className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>

                    {/* Level 3: Bulmaca (Sol Alt) */}
                    <div className="absolute left-[5%] md:left-[15%] top-[50%] flex flex-col items-center group cursor-pointer z-20" onClick={() => {
                        if (maxStageReached >= 2) setStage('quiz');
                    }}>
                        {/* Ok İpucu (Hint) */}
                        <div className={cn("floating-island relative", maxStageReached < 2 && "grayscale opacity-70")}>
                            {/* Numara/Tamamlandı Rozeti */}
                            <div className={cn(
                                "absolute -top-4 -right-4 w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-30 font-black text-white text-2xl italic transition-all duration-500",
                                childData?.completedTopics?.includes(`${topicId}-quiz`) ? "bg-green-500 scale-110" : maxStageReached >= 2 ? "bg-purple-500" : "bg-gray-400"
                            )}>
                                {childData?.completedTopics?.includes(`${topicId}-quiz`) ? (
                                    <CheckCircle className="w-8 h-8 text-white" />
                                ) : (
                                    "3"
                                )}
                            </div>
                            <div className={cn(
                                "w-24 h-24 md:w-36 md:h-36 rounded-full border-[6px] md:border-[10px] shadow-[0_15px_35px_rgba(0,0,0,0.3)] flex items-center justify-center transition-transform z-10 relative overflow-hidden",
                                maxStageReached >= 2 ? "bg-white border-purple-300 group-hover:scale-110 group-active:scale-95" : "bg-gray-100 border-gray-300 cursor-not-allowed"
                            )}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-50 to-transparent opacity-50" />
                                <span className={cn("text-6xl md:text-8xl drop-shadow-sm relative z-10", maxStageReached >= 2 && "animate-pulse")}>🧩</span>
                                <div className="absolute bottom-0 w-full h-1/3 bg-purple-100/50" />
                            </div>
                            {/* Platform Altı Gölgesi */}
                            <div className="w-24 md:w-32 h-6 bg-black/10 rounded-[100%] blur-md mx-auto mt-4 scale-x-125" />
                        </div>
                        <div className={cn(
                            "mt-2 md:mt-4 px-6 py-2 md:px-8 md:py-3 rounded-full shadow-xl border-4 transition-colors",
                            maxStageReached >= 2 ? "bg-white border-purple-100 group-hover:bg-purple-50" : "bg-gray-200 border-gray-300 opacity-80"
                        )}>
                            <span className={cn("font-bold text-sm md:text-xl uppercase tracking-wider", maxStageReached >= 2 ? "text-purple-600" : "text-gray-500")}>Yapboz</span>
                        </div>
                    </div>

                    {/* Ayak İzleri 3 -> Hazine */}
                    <div className="absolute top-[60%] left-[30%] md:left-[35%] rotate-[120deg] opacity-60 animate-pulse" style={{ animationDelay: '0s' }}>
                        <Footprints className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>
                    <div className="absolute top-[65%] left-[45%] md:left-[50%] rotate-[120deg] opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>
                        <Footprints className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>
                    <div className="absolute top-[71%] left-[60%] md:left-[65%] rotate-[120deg] opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>
                        <Footprints className="text-white w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>

                    {/* Final: Hazine Sandığı (Sağ Alt) */}
                    <div className="absolute right-[5%] md:right-[15%] top-[75%] flex flex-col items-center">
                        {/* @ts-ignore */}
                        {childData?.stickers?.[topicId as string] ? (
                            // AÇILMIŞ VE STICKER KAZANILMIŞ DURUM
                            <div className="flex flex-col items-center animate-bounce">
                                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-white/40 backdrop-blur-md border-[6px] border-yellow-300 shadow-[0_0_40px_rgba(250,204,21,0.6)] flex items-center justify-center p-4">
                                    {/* @ts-ignore */}
                                    <img src={childData.stickers[topicId as string]} alt="Sticker" className="w-full h-full object-contain drop-shadow-xl" />
                                    <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-yellow-300 animate-spin-slow" />
                                </div>
                                <div className="mt-4 bg-yellow-400 px-6 py-2 rounded-full shadow-lg border-2 border-yellow-200">
                                    <span className="font-bold text-yellow-900 text-sm md:text-lg uppercase whitespace-nowrap">BİR ÇIKARTMA KAZANDIN!</span>
                                </div>
                            </div>
                        ) : childData?.completedTopics?.includes(`${topicId}-quiz`) ? (
                            // OYUNLAR BİTMİŞ, AÇILMAYA HAZIR SANDIK
                            <div 
                                className={cn("flex flex-col items-center cursor-pointer transition-all z-30", isOpeningTreasure ? "scale-110" : "hover:scale-110")}
                                onClick={handleOpenTreasure}
                            >
                                {/* Ok İpucu (Hint) */}
                                {!childData?.stickers?.[topicId as string] && (
                                    <div className="absolute -top-16 md:-top-24 right-4 md:right-0 arrow-hint flex flex-col items-center">
                                        <div className="bg-yellow-400 text-yellow-900 font-black px-4 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-lg mb-1 shadow-lg border-2 border-white uppercase tracking-tighter whitespace-nowrap">ÖDÜLÜ AL</div>
                                        <ArrowRight className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 rotate-90 drop-shadow-lg fill-current" />
                                    </div>
                                )}
                                <div className="relative drop-shadow-[0_0_25px_rgba(250,204,21,0.8)] floating-island">
                                    <TreasureChest isOpen={isOpeningTreasure} />
                                    <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-300 animate-spin-slow" />
                                    <Sparkles className="absolute -bottom-4 -left-4 w-6 h-6 text-yellow-300 animate-spin-slow" style={{ animationDelay: '0.5s' }} />
                                </div>
                                <div className="mt-4 bg-yellow-400 px-6 py-2 rounded-full shadow-lg border-2 border-yellow-200 animate-pulse">
                                    <span className="font-bold text-yellow-900 text-sm md:text-lg uppercase">Sandığı Aç!</span>
                                </div>
                            </div>
                        ) : (
                            // KİLİTLİ SANDIK
                            <div className="flex flex-col items-center opacity-60 grayscale transition-all">
                                <div className="drop-shadow-md">
                                    <TreasureChest isOpen={false} />
                                </div>
                                <div className="mt-4 bg-gray-200 px-6 py-2 rounded-full shadow-lg border-2 border-gray-300">
                                    <span className="font-bold text-gray-500 text-sm md:text-lg uppercase">Gizli Hazine</span>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#7dd3fc] h-screen w-full flex overflow-hidden">
            {/* Sidebar Left Panel */}
            <aside className="w-16 md:w-32 shrink-0 bg-white/20 backdrop-blur-xl border-r border-white/40 flex flex-col items-center py-4 md:py-8 justify-between z-50 shadow-2xl">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl md:rounded-2xl h-10 w-10 md:h-14 md:w-14 bg-white/90 border-none shadow-xl hover:scale-110 transition-all hover:bg-white active:scale-95"
                    onClick={() => setStage('map')}
                >
                    <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-sky-500" />
                </Button>

                <div className="flex flex-col gap-6 md:gap-10 items-center">
                    {[
                        { s: 'learning' as GameStage, label: '1' },
                        { s: 'matching' as GameStage, label: '2' },
                        { s: 'quiz' as GameStage, label: '3' }
                    ].map((step, idx) => {
                        const stageIndex = ['learning', 'matching', 'quiz'].indexOf(stage);
                        const isCompleted = idx < stageIndex || childData?.completedTopics?.includes(`${topicId}-${step.s}`);
                        const isCurrent = stage === step.s;

                        return (
                            <div key={step.s} className="relative flex flex-col items-center">
                                <button
                                    disabled={!isCompleted && !isCurrent && idx > maxStageReached}
                                    onClick={() => setStage(step.s)}
                                    className={cn(
                                        "w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 text-base md:text-xl font-black border-b-[3px] md:border-b-4",
                                        isCurrent ? "bg-white text-sky-500 scale-125 shadow-[0_10px_20px_rgba(0,0,0,0.15)] border-white" :
                                            isCompleted ? "bg-green-400 text-white cursor-pointer hover:scale-110 border-green-600" : "bg-white/10 text-white/40 cursor-not-allowed border-transparent"
                                    )}
                                >
                                    {step.label}
                                </button>
                                {idx < 2 && (
                                    <div className={cn(
                                        "absolute top-16 w-1 h-6 rounded-full transition-colors duration-500",
                                        isCompleted ? "bg-green-400" : "bg-white/10"
                                    )} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="h-10 w-10 md:h-14 md:w-14" /> {/* Spacer to balance the top button */}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative">

                {/* Floating "Next" Button overlay if completed */}
                {childData?.completedTopics?.includes(`${topicId}-${stage}`) && stage !== 'quiz' && (
                    <div className={cn("absolute left-0 right-0 flex justify-center z-40 pointer-events-none px-2", stage === 'matching' ? "bottom-8 md:bottom-12" : "top-8 md:top-12")}>
                        <Button
                            className="pointer-events-auto bg-white text-sky-600 hover:bg-sky-50 font-black rounded-full px-6 md:px-12 max-md:landscape:px-4 h-14 md:h-20 max-md:landscape:h-10 text-sm md:text-xl max-md:landscape:text-xs shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-b-4 md:border-b-8 max-md:landscape:border-b-[3px] border-gray-100 active:border-b-0 active:translate-y-2 transition-all group animate-bounce whitespace-nowrap"
                            onClick={() => {
                                if (stage === 'learning') setStage('matching');
                                else if (stage === 'matching') setStage('quiz');
                            }}
                        >
                            <span className="hidden md:inline">SONRAKİ BÖLÜME GEÇ</span>
                            <span className="md:hidden">SONRAKİ BÖLÜM</span>
                            <ArrowRight className="ml-2 md:ml-3 max-md:landscape:ml-1 w-5 h-5 md:w-8 md:h-8 max-md:landscape:w-4 max-md:landscape:h-4 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </div>
                )}

                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-40 right-20 w-[500px] h-[500px] bg-white rounded-full blur-[150px] animate-pulse delay-1000" />
                </div>

                <div className="flex-1 w-full flex items-center justify-center p-2 pt-4 md:p-8 transition-all duration-500">
                    <div className="w-full max-w-6xl h-full flex items-center justify-center">
                        {stage === 'learning' && (
                            <WordCard
                                wordList={topic.wordList}
                                childId={childId as string}
                                topicId={topicId as string}
                                onComplete={() => handleStageComplete('learning')}
                            />
                        )}
                        {stage === 'matching' && (
                            <VoiceMatching
                                wordList={topic.wordList}
                                onComplete={() => handleStageComplete('matching')}
                            />
                        )}
                        {stage === 'quiz' && (
                            <JigsawPuzzle
                                wordList={topic.wordList}
                                onComplete={() => handleStageComplete('quiz')}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
