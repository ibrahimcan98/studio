
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/use-tts';

type Word = {
    word: string;
    image: string;
    audio: string;
};

type TopicQuizProps = {
    wordList: Word[];
    onComplete: () => void;
};

export function TopicQuiz({ wordList, onComplete }: TopicQuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<Word | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [options, setOptions] = useState<Word[]>([]);
    const { width, height } = useWindowSize();
    const { speak } = useTTS();

    const currentWord = wordList[currentIndex];

    const generateOptions = useCallback(() => {
        const correct = wordList[currentIndex];
        const others = wordList.filter(w => w.word !== correct.word);
        const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
        const selectedOthers = shuffledOthers.slice(0, 3);
        const allOptions = [...selectedOthers, correct].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
    }, [currentIndex, wordList]);

    useEffect(() => {
        generateOptions();
    }, [generateOptions]);

    const handleAnswer = (answer: Word) => {
        if (selectedAnswer) return;

        setSelectedAnswer(answer);
        const correct = answer.word === currentWord.word;
        setIsCorrect(correct);

        if (correct) {
            speak(answer.word);
        }

        setTimeout(() => {
            if (correct) {
                if (currentIndex < wordList.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    setSelectedAnswer(null);
                    setIsCorrect(null);
                } else {
                    onComplete();
                }
            } else {
                setSelectedAnswer(null);
                setIsCorrect(null);
            }
        }, 1500);
    };

    const getButtonClass = (option: Word) => {
        if (selectedAnswer?.word === option.word) {
            if (isCorrect === true) {
                return 'bg-green-500 text-white border-green-700 hover:bg-green-600 scale-105 shadow-2xl z-10';
            } else if (isCorrect === false) {
                return 'bg-red-500 text-white border-red-700 hover:bg-red-600 animate-shake';
            }
        }
        // Eğer yanlış bilindiyse ve bu seçenek aslında DOĞRUYSA, ona hafif bir yeşil ipucu da verebiliriz ama şimdilik sadece standart bırakalım.
        return 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200';
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-center">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-2xl text-center flex flex-col items-center border-b-[8px] border-gray-100">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                </div>
                <span className="text-gray-400 text-sm font-black uppercase tracking-[0.2em] mb-2">Final Testi</span>
                <h2 className="text-5xl font-black text-gray-800 italic tracking-tighter">BU NEDİR?</h2>
                
                <div className="relative w-full aspect-square max-w-[300px] mx-auto mt-8 bg-gray-50 rounded-3xl overflow-hidden p-6 border-4 border-dashed border-gray-200">
                    <Image
                        src={currentWord.image}
                        alt="Question"
                        fill
                        className="object-contain p-4"
                        unoptimized
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                {options.map((option, index) => (
                    <Button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        variant="outline"
                        className={cn(
                            "h-24 rounded-3xl text-2xl font-black transition-all duration-300 border-b-[6px] active:border-b-0 active:translate-y-1 relative",
                            getButtonClass(option)
                        )}
                        disabled={!!selectedAnswer} // Bir kere tıklandıktan sonra diğerlerini devre dışı bırak
                    >
                        {option.word}
                        {selectedAnswer?.word === option.word && (
                            <div className="absolute right-6">
                                {isCorrect ? (
                                    <div className="bg-white/20 p-2 rounded-full animate-bounce">
                                        <CheckCircle className="w-8 h-8 text-white drop-shadow-md" />
                                    </div>
                                ) : (
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <XCircle className="w-8 h-8 text-white drop-shadow-md" />
                                    </div>
                                )}
                            </div>
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
}
