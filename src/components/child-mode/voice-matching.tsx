
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, Star } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

type Word = {
    word: string;
    image: string;
    audio: string;
};

type VoiceMatchingProps = {
    wordList: Word[];
    onComplete: () => void;
};

export function VoiceMatching({ wordList, onComplete }: VoiceMatchingProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<Word | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [options, setOptions] = useState<Word[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { width, height } = useWindowSize();

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

    const playAudio = useCallback(async () => {
        if (audioRef.current && currentWord?.audio) {
            audioRef.current.src = currentWord.audio;
            try {
                await audioRef.current.play();
            } catch (error) {
                console.error("Audio play failed:", error);
            }
        }
    }, [currentWord]);

    useEffect(() => {
        playAudio();
    }, [playAudio]);

    const handleAnswer = (answer: Word) => {
        if (selectedAnswer) return;

        setSelectedAnswer(answer);
        const correct = answer.word === currentWord.word;
        setIsCorrect(correct);

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
                playAudio(); // Replay on wrong answer
            }
        }, 1500);
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-center">
            <div className="flex items-center gap-6 bg-white p-6 rounded-3xl shadow-xl">
                <Button
                    size="icon"
                    className="w-20 h-20 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 border-none shadow-lg"
                    onClick={playAudio}
                >
                    <Volume2 className="w-10 h-10" />
                </Button>
                <div className="flex flex-col">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Dinle ve Seç</span>
                    <h2 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter">"{currentWord.word}" nerede?</h2>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                {options.map((option, index) => (
                    <Card
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className={`relative aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center p-8
                            ${selectedAnswer?.word === option.word && isCorrect === true ? 'ring-8 ring-green-400 scale-105' : ''}
                            ${selectedAnswer?.word === option.word && isCorrect === false ? 'ring-8 ring-red-400 animate-shake' : 'border-4 border-white'}
                        `}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={option.image}
                                alt={option.word}
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                        {selectedAnswer?.word === option.word && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                {isCorrect ? 
                                    <CheckCircle className="w-24 h-24 text-green-500 bg-white rounded-full p-2" /> : 
                                    <XCircle className="w-24 h-24 text-red-500 bg-white rounded-full p-2" />
                                }
                            </div>
                        )}
                    </Card>
                ))}
            </div>
            <audio ref={audioRef} />
        </div>
    );
}
