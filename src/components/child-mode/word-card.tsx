'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ArrowLeft, ArrowRight, Gamepad2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Word = {
    word: string;
    image: string;
    audio: string;
};

type WordCardProps = {
    wordList: Word[];
    childId: string;
    topicId: string;
};

const backgroundGradients = [
    'from-green-200 to-cyan-200',
    'from-yellow-200 to-orange-200',
    'from-pink-200 to-purple-200',
    'from-teal-200 to-blue-200',
    'from-red-200 to-yellow-200',
];

export function WordCard({ wordList, childId, topicId }: WordCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gradient, setGradient] = useState(backgroundGradients[0]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const router = useRouter();
    const currentWord = wordList[currentIndex];

    const isFirstWord = currentIndex === 0;
    const isLastWord = currentIndex === wordList.length - 1;


    useEffect(() => {
        setGradient(backgroundGradients[currentIndex % backgroundGradients.length]);
        // Autoplay audio when word changes
        if (audioRef.current) {
            audioRef.current.src = currentWord.audio;
            audioRef.current.load();
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    }, [currentIndex, currentWord]);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    };

    const goToNext = () => {
        if (!isLastWord) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const goToPrevious = () => {
        if (!isFirstWord) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };
    
    const goToGames = () => {
        router.push(`/cocuk-modu/${childId}/${topicId}/oyunlar`);
    };

    return (
        <Card className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-gradient-to-br ${gradient}`}>
            <div className="relative w-full aspect-video mx-auto mt-4 mb-2 px-4 flex items-center justify-center">
                <Image
                    src={currentWord.image}
                    alt={currentWord.word}
                    width={500}
                    height={300}
                    className="object-contain rounded-2xl"
                    unoptimized // Since images are local, we can disable optimization for simplicity
                />
            </div>
            <div className="bg-white p-8 rounded-t-3xl">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full w-16 h-16 bg-green-100 hover:bg-green-200 text-green-600 border-none shadow-md"
                        onClick={playAudio}
                    >
                        <Volume2 className="w-8 h-8" />
                    </Button>
                    <h2 className="text-5xl font-bold text-gray-800 ">{currentWord.word}</h2>
                    <audio ref={audioRef} src={currentWord.audio} preload="auto" />
                </div>
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        className="rounded-full py-6 px-8 font-semibold text-lg"
                        onClick={goToPrevious}
                        disabled={isFirstWord}
                    >
                        <ArrowLeft className="mr-2" />
                        Önceki
                    </Button>
                    {isLastWord ? (
                         <Button
                            className="rounded-full py-6 px-8 font-semibold text-lg bg-green-500 hover:bg-green-600"
                            onClick={goToGames}
                        >
                            Oyunlara Geç
                            <Gamepad2 className="ml-2" />
                        </Button>
                    ) : (
                        <Button
                            className="rounded-full py-6 px-8 font-semibold text-lg bg-primary hover:bg-primary/90"
                            onClick={goToNext}
                        >
                            Sonraki
                            <ArrowRight className="ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
