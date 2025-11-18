'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { ttsFlow } from '@/ai/flows/tts-flow';

type Word = {
    word: string;
    image: string;
};

type WordCardProps = {
    wordList: Word[];
};

const backgroundGradients = [
    'from-green-200 to-cyan-200',
    'from-yellow-200 to-orange-200',
    'from-pink-200 to-purple-200',
    'from-teal-200 to-blue-200',
    'from-red-200 to-yellow-200',
];

export function WordCard({ wordList }: WordCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gradient, setGradient] = useState(backgroundGradients[0]);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentWord = wordList[currentIndex];

    const generateAudio = useCallback(async (text: string) => {
        setIsAudioLoading(true);
        setAudioSrc(null);
        try {
            const { media } = await ttsFlow(text);
            setAudioSrc(media);
        } catch (error) {
            console.error("Audio generation failed:", error);
        } finally {
            setIsAudioLoading(false);
        }
    }, []);

    useEffect(() => {
        setGradient(backgroundGradients[currentIndex % backgroundGradients.length]);
        generateAudio(currentWord.word);
    }, [currentIndex, currentWord.word, generateAudio]);
    
    useEffect(() => {
        if (audioSrc && audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    }, [audioSrc]);


    const playAudio = () => {
        if (audioRef.current && audioSrc) {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        } else if (!isAudioLoading) {
            generateAudio(currentWord.word);
        }
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % wordList.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + wordList.length) % wordList.length);
    };

    return (
        <Card className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-gradient-to-br ${gradient}`}>
            <div className="relative w-full aspect-video mx-auto mt-4 mb-2 px-4">
                <Image
                    src={`https://picsum.photos/seed/${currentWord.word}/600/338`}
                    alt={currentWord.word}
                    fill
                    className="object-cover rounded-2xl"
                    data-ai-hint={currentWord.word}
                />
            </div>
            <div className="bg-white p-8 rounded-t-3xl">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full w-16 h-16 bg-green-100 hover:bg-green-200 text-green-600 border-none shadow-md"
                        onClick={playAudio}
                        disabled={isAudioLoading}
                    >
                        {isAudioLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Volume2 className="w-8 h-8" />}
                    </Button>
                    <h2 className="text-5xl font-bold text-gray-800">{currentWord.word}</h2>
                    {audioSrc && <audio ref={audioRef} src={audioSrc} />}
                </div>
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        className="rounded-full py-6 px-8 font-semibold text-lg"
                        onClick={goToPrevious}
                    >
                        <ArrowLeft className="mr-2" />
                        Önceki
                    </Button>
                    <Button
                        className="rounded-full py-6 px-8 font-semibold text-lg bg-primary hover:bg-primary/90"
                        onClick={goToNext}
                    >
                        Sonraki
                        <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
