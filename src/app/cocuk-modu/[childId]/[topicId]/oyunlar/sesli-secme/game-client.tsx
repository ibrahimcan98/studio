
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, ArrowLeft, Star, Heart } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';

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
    const { childId, topicId } = params;
    const { width, height } = useWindowSize();

    const { user: authUser } = useUser();
    const db = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid) return null;
        return doc(db, 'users', authUser.uid);
    }, [db, authUser?.uid]);
    const { data: userData } = useDoc(userDocRef);
    const isPremium = userData?.isPremium || false;

    const childDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid || !childId) return null;
        return doc(db, 'users', authUser.uid, 'children', childId as string);
    }, [db, authUser?.uid, childId]);
    
    const { data: childData } = useDoc(childDocRef);
    const [lives, setLives] = useState(5);

     useEffect(() => {
        if (childData) {
            setLives(childData.lives ?? 5);
        }
    }, [childData]);


    const currentQuestion = questions[currentIndex];

    const playQuestionAudio = () => {
        if (audioRef.current) {
            audioRef.current.src = currentQuestion.audio;
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    };

    useEffect(() => {
        playQuestionAudio();
    }, [currentIndex, currentQuestion.audio]);

    const handleAnswer = async (answer: Word) => {
        if (selectedAnswer) return; // Prevent multiple selections

        setSelectedAnswer(answer);
        const correct = answer.word === currentQuestion.correctAnswer.word;
        setIsCorrect(correct);

        if (!correct && !isPremium) {
            const newLives = lives - 1;
            setLives(newLives);
            if (childDocRef) {
                await updateDoc(childDocRef, { 
                    lives: newLives,
                    livesLastUpdatedAt: serverTimestamp()
                });
            }
            if (newLives <= 0) {
                 setTimeout(() => {
                    alert('Canların bitti! Ebeveyn portalına yönlendiriliyorsun.');
                    router.push('/ebeveyn-portali');
                }, 1500);
                return;
            }
        }

        setTimeout(() => {
            if (correct) {
                if (currentIndex < questions.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    handleGameFinish();
                }
            }
            // Reset for next question
            setSelectedAnswer(null);
            setIsCorrect(null);
        }, 1500);
    };

    const handleGameFinish = async () => {
        if (childDocRef && topicId) {
            const completedKey = `${topicId}-sesli-secme`;
            await updateDoc(childDocRef, {
                completedTopics: arrayUnion(completedKey),
                rozet: increment(1)
            });
        }
        setGameFinished(true);
    };
    
    if (gameFinished) {
        return (
            <div className="bg-green-100 h-screen flex flex-col items-center justify-center p-8 text-center">
                <Confetti width={width} height={height} recycle={false} numberOfPieces={500}/>
                <Star className="w-24 h-24 text-yellow-400 fill-yellow-400 mb-6" />
                <h1 className="text-4xl font-bold text-green-800 mb-2">Harika İş!</h1>
                <p className="text-lg text-green-700 mb-8">Bu bölümü tamamladın ve 1 yeni rozet kazandın!</p>
                <Button onClick={() => router.push(`/cocuk-modu/${childId}/${topicId}/oyunlar`)}>
                    Diğer Oyunlara Devam Et
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-amber-50 h-screen p-4 sm:p-8 flex flex-col">
            <header className="flex-shrink-0 mb-4">
                <div className="w-full max-w-4xl mx-auto flex items-center justify-between relative">
                     <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-12 w-12 bg-white/50"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex-1 flex justify-center items-center gap-4">
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full w-14 h-14 bg-green-100 hover:bg-green-200 text-green-600"
                            onClick={playQuestionAudio}
                        >
                            <Volume2 className="w-7 h-7" />
                        </Button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
                           {currentQuestion.correctAnswer.word} nerede?
                        </h1>
                    </div>
                    <div className="w-auto flex items-center gap-2 font-semibold text-destructive px-4">
                        <Heart className="w-7 h-7 fill-current" />
                        <span className="text-2xl">{isPremium ? 'Sınırsız' : lives}</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 p-4">
                {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer?.word === option.word;
                    const isCorrectOption = option.word === currentQuestion.correctAnswer.word;

                    return (
                        <Card
                            key={index}
                            onClick={() => handleAnswer(option)}
                            className={`relative rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 transform
                                ${selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:shadow-xl'}
                                ${isSelected && isCorrect === true ? 'border-4 border-green-500 scale-105' : ''}
                                ${isSelected && isCorrect === false ? 'border-4 border-red-500 scale-105' : 'border-2 border-transparent'}
                            `}
                        >
                            <Image
                                src={option.image}
                                alt={option.word}
                                fill
                                className="object-contain p-4 sm:p-8"
                                unoptimized
                            />
                            {isSelected && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    {isCorrect ?
                                        <CheckCircle className="w-20 h-20 text-white" /> :
                                        <XCircle className="w-20 h-20 text-white" />
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
