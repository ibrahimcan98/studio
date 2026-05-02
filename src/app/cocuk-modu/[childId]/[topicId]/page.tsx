'use client';

import { useParams, useRouter } from 'next/navigation';
import topicsData from '@/data/topics.json';
import { ArrowLeft, Loader2, ArrowRight, Footprints, Cloud } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { WordCard } from '@/components/child-mode/word-card';
import { VoiceMatching } from '@/components/child-mode/voice-matching';
import { TopicQuiz } from '@/components/child-mode/topic-quiz';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { CheckCircle, Trophy, Star, Sparkles, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            setMaxStageReached(max);
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

    const handleStageComplete = async (currentStage: GameStage) => {
        if (childDocRef && topicId) {
            const completedKey = `${topicId}-${currentStage}`;
            await updateDoc(childDocRef, {
                completedTopics: arrayUnion(completedKey)
            });

            if (currentStage === 'learning') {
                setStage('matching');
                setMaxStageReached(prev => Math.max(prev, 1));
            } else if (currentStage === 'matching') {
                setStage('quiz');
                setMaxStageReached(prev => Math.max(prev, 2));
            } else if (currentStage === 'quiz') {
                await handleTopicComplete();
            }
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
            
            await setDoc(childDocRef, {
                stickers: {
                    [topicId as string]: randomWord.image
                }
            }, { merge: true });

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
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-[10px] border-gray-100">
                        <Trophy className="w-24 h-24 text-yellow-400 animate-bounce" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-100">
                        <Star className="w-8 h-8 text-white fill-current" />
                    </div>
                </div>

                <div className="space-y-4 max-w-xl">
                    <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">HARİKA İŞ!</h1>
                    <p className="text-2xl font-bold text-sky-100 uppercase tracking-widest drop-shadow-md">
                        "{topic.name.toUpperCase()}" KONUSUNU TAMAMLADIN VE SEVİYE ATLADIN!
                    </p>
                </div>

                <Button
                    className="mt-12 h-20 px-12 rounded-[32px] text-2xl font-black bg-white text-sky-500 hover:bg-sky-50 hover:scale-105 transition-all shadow-2xl border-b-[6px] border-gray-200 active:border-b-0 active:translate-y-1"
                    onClick={() => router.push(`/cocuk-modu/${childId}`)}
                >
                    MACERAYA DEVAM ET
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

    if (stage === 'map') {
        return (
            <div className={cn("bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] h-screen w-full relative flex flex-col items-center overflow-hidden transition-colors duration-1000", currentGradient)}>
                <style>{cloudStyles}</style>
                {showConfetti && <Confetti width={width} height={height} className="z-50" />}

                {/* Sol Üst Geri Butonu */}
                <div className="absolute top-8 left-8 z-50">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-2xl h-16 w-16 bg-white/90 border-none shadow-xl hover:scale-110 transition-transform active:scale-95"
                        onClick={() => router.push(`/cocuk-modu/${childId}`)}
                    >
                        <ArrowLeft className="w-8 h-8 text-slate-600" />
                    </Button>
                </div>

                {/* Arka Plan Atmosfer: Dokular ve Dev İkon */}
                <div className="absolute inset-0 bg-white/10 z-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.15 }}></div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[40vw] opacity-[0.07] pointer-events-none select-none filter blur-[2px] z-0 drop-shadow-2xl">
                    {topic.icon}
                </div>

                {/* Hareketli Bulutlar */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                    <Cloud className="absolute top-[10%] left-0 w-32 h-32 text-white/40 fill-white/40 cloud-1 drop-shadow-md" />
                    <Cloud className="absolute top-[35%] left-0 w-48 h-48 text-white/30 fill-white/30 cloud-2 drop-shadow-lg" />
                    <Cloud className="absolute top-[60%] left-0 w-24 h-24 text-white/50 fill-white/50 cloud-3 drop-shadow-sm" />
                    <Cloud className="absolute top-[80%] left-0 w-40 h-40 text-white/20 fill-white/20 cloud-4 drop-shadow-xl" />
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mt-12 z-20 bg-white/20 px-10 py-4 rounded-full backdrop-blur-md border-4 border-white/40">
                    {topic.name.toUpperCase()} ADASI
                </h1>

                {/* Harita Yolu (Yukarıdan Aşağı Zigzag) */}
                <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center mt-12 mb-20 z-20 min-h-[700px]">

                    {/* Level 1: Öğrenme (Sol Üst) */}
                    <div className="absolute left-[5%] md:left-[15%] top-[0%] flex flex-col items-center group cursor-pointer z-20" onClick={() => setStage('learning')}>
                        {/* Ok İpucu (Hint) */}
                        {maxStageReached === 0 && (
                            <div className="absolute -top-20 arrow-hint flex flex-col items-center">
                                <div className="bg-yellow-400 text-yellow-900 font-black px-4 py-1 rounded-full text-sm mb-1 shadow-lg border-2 border-white uppercase tracking-tighter">BAŞLA</div>
                                <ArrowRight className="w-10 h-10 text-yellow-400 rotate-90 drop-shadow-lg fill-current" />
                            </div>
                        )}
                        <div className="floating-island relative">
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
                        {childData?.completedTopics?.includes(`${topicId}-learning`) && (
                            <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1 md:p-2 border-4 border-white shadow-lg z-30 scale-110 animate-bounce">
                                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                        )}
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
                        {maxStageReached === 1 && (
                            <div className="absolute -top-20 arrow-hint flex flex-col items-center">
                                <div className="bg-blue-400 text-blue-900 font-black px-4 py-1 rounded-full text-sm mb-1 shadow-lg border-2 border-white uppercase tracking-tighter">SIRADAKİ</div>
                                <ArrowRight className="w-10 h-10 text-blue-400 rotate-90 drop-shadow-lg fill-current" />
                            </div>
                        )}
                        <div className={cn("floating-island relative", maxStageReached < 1 && "grayscale opacity-70")}>
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
                        {childData?.completedTopics?.includes(`${topicId}-matching`) && (
                            <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1 md:p-2 border-4 border-white shadow-lg z-30 scale-110 animate-bounce">
                                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                        )}
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
                        {maxStageReached === 2 && (
                            <div className="absolute -top-20 arrow-hint flex flex-col items-center">
                                <div className="bg-purple-400 text-purple-900 font-black px-4 py-1 rounded-full text-sm mb-1 shadow-lg border-2 border-white uppercase tracking-tighter">FİNAL</div>
                                <ArrowRight className="w-10 h-10 text-purple-400 rotate-90 drop-shadow-lg fill-current" />
                            </div>
                        )}
                        <div className={cn("floating-island relative", maxStageReached < 2 && "grayscale opacity-70")}>
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
                            <span className={cn("font-bold text-sm md:text-xl uppercase tracking-wider", maxStageReached >= 2 ? "text-purple-600" : "text-gray-500")}>Bulmaca</span>
                        </div>
                        {childData?.completedTopics?.includes(`${topicId}-quiz`) && (
                            <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1 md:p-2 border-4 border-white shadow-lg z-30 scale-110 animate-bounce">
                                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                        )}
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
                                    <span className="font-bold text-yellow-900 text-sm md:text-lg uppercase">Sticker Kazandın!</span>
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
                                    <div className="absolute -top-24 arrow-hint flex flex-col items-center">
                                        <div className="bg-yellow-400 text-yellow-900 font-black px-6 py-2 rounded-full text-lg mb-1 shadow-lg border-2 border-white uppercase tracking-tighter">ÖDÜLÜ AL</div>
                                        <ArrowRight className="w-12 h-12 text-yellow-400 rotate-90 drop-shadow-lg fill-current" />
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
            <aside className="w-24 md:w-32 bg-white/20 backdrop-blur-xl border-r border-white/40 flex flex-col items-center py-8 justify-between z-50 shadow-2xl">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-2xl h-14 w-14 bg-white/90 border-none shadow-xl hover:scale-110 transition-all hover:bg-white active:scale-95"
                    onClick={() => setStage('map')}
                >
                    <ArrowLeft className="w-8 h-8 text-sky-500" />
                </Button>

                <div className="flex flex-col gap-10 items-center">
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
                                        "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 text-xl font-black border-b-4",
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

                <div className="h-14 w-14" /> {/* Spacer to balance the top button */}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative">

                {/* Floating "Next" Button overlay if completed */}
                {childData?.completedTopics?.includes(`${topicId}-${stage}`) && stage !== 'quiz' && (
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center z-40 pointer-events-none">
                        <Button
                            className="pointer-events-auto bg-white text-sky-600 hover:bg-sky-50 font-black rounded-full px-12 h-20 text-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-b-8 border-gray-100 active:border-b-0 active:translate-y-2 transition-all group animate-bounce"
                            onClick={() => {
                                if (stage === 'learning') setStage('matching');
                                else if (stage === 'matching') setStage('quiz');
                            }}
                        >
                            SONRAKİ BÖLÜME GEÇ
                            <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </div>
                )}

                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-40 right-20 w-[500px] h-[500px] bg-white rounded-full blur-[150px] animate-pulse delay-1000" />
                </div>

                <div className="flex-1 w-full flex items-center justify-center p-8 transition-all duration-500">
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
                            <TopicQuiz
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
