'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, ArrowLeft, Star, Heart } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useTTS } from '@/hooks/use-tts';
import { cn } from '@/lib/utils';

type Word = {
    word: string;
    image: string;
    audio: string;
};

type Question = {
    question: string;
    audio: string;
    options: Word[];
    correctAnswer: Word;
};

type GameClientProps = {
    questions: Question[];
};

export default function GameClient({ questions }: GameClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<Word | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [gameFinished, setGameFinished] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { childId, topicId } = params;
    const { width, height } = useWindowSize();
    const { speak, isPlaying: isTTSSpeaking } = useTTS();

    const { user: authUser } = useUser();
    const db = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid) return null;
        return doc(db, 'users', authUser.uid);
    }, [db, authUser?.uid]);

    const { data: userData } = useDoc(userDocRef);
    const isPremium = userData?.isPremium || false;
    const [lives, setLives] = useState(5);

    const childDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid || !childId) return null;
        return doc(db, 'users', authUser.uid, 'children', childId as string);
    }, [db, authUser?.uid, childId]);
    
    const { data: childData } = useDoc(childDocRef);

     useEffect(() => {
        if (userData) {
            setLives(userData.lives ?? 5);
        }
    }, [userData]);


    const currentQuestion = questions[currentIndex];

    // YENİ KURAL: Kelimeyi olduğu gibi kullanıyoruz, sonuna "kelimesi nerede?" ekliyoruz.
    const displayWord = currentQuestion.correctAnswer.word;
    const questionSentence = `${displayWord} kelimesi nerede?`;

    const playQuestionAudio = useCallback(async () => {
        if (currentQuestion?.audio && currentQuestion.audio !== "") {
            if (audioRef.current) {
                audioRef.current.src = currentQuestion.audio;
                audioRef.current.play().catch(console.error);
            }
        } else {
            speak(questionSentence);
        }
    }, [currentQuestion, questionSentence, speak]);

    useEffect(() => {
        playQuestionAudio();
    }, [currentIndex, playQuestionAudio]);

    const handleAnswer = async (answer: Word) => {
        if (selectedAnswer || isTTSSpeaking) return;

        setSelectedAnswer(answer);
        const correct = answer.word === currentQuestion.correctAnswer.word;
        setIsCorrect(correct);

        if (correct) {
            const successPhrases = ["Harika!", "Süpersin!", "Doğru bildin!", "Bravo!"];
            const randomSuccess = successPhrases[Math.floor(Math.random() * successPhrases.length)];
            speak(randomSuccess);
        } else {
            if (!isPremium) {
                const newLives = Math.max(0, lives - 1);
                setLives(newLives);
                if (userDocRef) {
                    await updateDoc(userDocRef, { lives: newLives, livesLastUpdatedAt: serverTimestamp() });
                }
                if (newLives <= 0) {
                    toast({ variant: "destructive", title: "Canların Bitti!", description: "Ebeveyn portalına yönlendiriliyorsun." });
                    setTimeout(() => router.push('/ebeveyn-portali'), 1500);
                    return;
                }
            }
            speak("Hay aksi, bu değil! Tekrar dene.");
        }

        setTimeout(() => {
            if (correct) {
                if (currentIndex < questions.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    handleGameFinish();
                }
            }
            setSelectedAnswer(null);
            setIsCorrect(null);
        }, 1500);
    };

    const handleGameFinish = async () => {
        if (childDocRef && topicId) {
            const completedKey = `${topicId}-sesli-secme`;
            await updateDoc(childDocRef, { completedTopics: arrayUnion(completedKey) });
        }
        setGameFinished(true);
    };
    
    if (gameFinished) {
        return (
            <div className="bg-green-100 h-screen flex flex-col items-center justify-center p-8 text-center">
                <Confetti width={width} height={height} recycle={false} numberOfPieces={500}/>
                <Star className="w-24 h-24 text-yellow-400 fill-yellow-400 mb-6" />
                <h1 className="text-4xl font-bold text-green-800 mb-2 font-black italic">MUHTEŞEM!</h1>
                <p className="text-xl text-green-700 mb-8 font-bold">Bu bölümü tamamladın!</p>
                <Button 
                    className="bg-green-600 hover:bg-green-700 text-white font-black py-6 px-10 rounded-full text-xl shadow-xl"
                    onClick={() => router.push(`/cocuk-modu/${childId}/${topicId}/oyunlar`)}
                >
                    DEVAM ET
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-[#FFFDE7] h-screen p-4 sm:p-8 flex flex-col font-sans overflow-hidden">
            <header className="flex-shrink-0 mb-6">
                <div className="w-full max-w-5xl mx-auto flex items-center justify-between relative">
                     <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-12 w-12 bg-white shadow-md border-2"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    
                    <div className="flex-1 flex justify-center items-center gap-6">
                        <Button
                            size="icon"
                            className="rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 text-white shadow-xl border-b-8 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
                            onClick={playQuestionAudio}
                            disabled={isTTSSpeaking}
                        >
                            <Volume2 className={cn("w-10 h-10", isTTSSpeaking && "animate-pulse")} />
                        </Button>
                        <div className="flex flex-col">
                             <span className="text-blue-400 text-sm font-black uppercase tracking-widest italic">DİNLE VE SEÇ</span>
                             <h1 className="text-3xl md:text-5xl font-black text-gray-800 uppercase italic tracking-tighter">
                                "{displayWord}" kelimesi nerede?
                             </h1>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full flex items-center gap-3 shadow-md border-2 border-red-100">
                        <Heart className="w-8 h-8 text-red-500 fill-current" />
                        <span className="text-2xl font-black text-red-600">{isPremium ? '∞' : (lives < 0 ? 0 : lives)}</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto w-full p-2">
                {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer?.word === option.word;

                    return (
                        <Card
                            key={index}
                            onClick={() => handleAnswer(option)}
                            className={cn(
                                "relative rounded-[40px] overflow-hidden flex items-center justify-center transition-all duration-300 transform shadow-xl bg-white",
                                !selectedAnswer && "cursor-pointer hover:scale-105 hover:shadow-2xl active:scale-95",
                                isSelected && isCorrect === true && "ring-8 ring-green-500 scale-105 z-10",
                                isSelected && isCorrect === false && "ring-8 ring-red-500 animate-shake z-10"
                            )}
                        >
                            <div className="relative w-full h-full p-8 md:p-12">
                                <Image
                                    src={option.image}
                                    alt={option.word}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            {isSelected && (
                                <div className="absolute inset-0 bg-white/20 flex items-center justify-center backdrop-blur-[2px]">
                                    {isCorrect ?
                                        <CheckCircle className="w-32 h-32 text-green-500 drop-shadow-lg" /> :
                                        <XCircle className="w-32 h-32 text-red-500 drop-shadow-lg" />
                                    }
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
            <audio ref={audioRef} />
        </div>
    );
}
