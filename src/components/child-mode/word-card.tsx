'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ArrowLeft, ArrowRight, Gamepad2, Maximize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTTS } from '@/hooks/use-tts';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

type Word = {
    word: string;
    image: string;
    audio: string;
};

type WordCardProps = {
    wordList: Word[];
    childId: string;
    topicId: string;
    onComplete?: () => void;
};

const backgroundGradients = [
    'from-green-200 to-cyan-200',
    'from-yellow-200 to-orange-200',
    'from-pink-200 to-purple-200',
    'from-teal-200 to-blue-200',
    'from-red-200 to-yellow-200',
];

export function WordCard({ wordList, childId, topicId, onComplete }: WordCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gradient, setGradient] = useState(backgroundGradients[0]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const router = useRouter();
    const { speak, isPlaying: isTTSSpeaking } = useTTS();
    const currentWord = wordList[currentIndex];

    const isFirstWord = currentIndex === 0;
    const isLastWord = currentIndex === wordList.length - 1;

    const playAudio = useCallback(async (audioSrc: string) => {
        if (!audioSrc || !audioRef.current) return;

        if (audioRef.current) {
            if (!audioRef.current.paused) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current.src = audioSrc;
            try {
                await audioRef.current.play();
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error("Audio play failed:", error);
                }
            }
        }
    }, []);

    useEffect(() => {
        setGradient(backgroundGradients[currentIndex % backgroundGradients.length]);
        if (currentWord?.audio) {
            playAudio(currentWord.audio);
        } else if (currentWord?.word) {
            speak(currentWord.word);
        }
    }, [currentIndex, currentWord, playAudio, speak]);


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

    const goToNextStage = () => {
        if (onComplete) {
            onComplete();
        } else {
            router.push(`/cocuk-modu/${childId}/${topicId}/oyunlar`);
        }
    };

    const triggerAudio = () => {
        if (currentWord?.audio) {
            playAudio(currentWord.audio);
        } else {
            speak(currentWord.word);
        }
    };

    return (
        <Card className={`w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col bg-gradient-to-br ${gradient} border-none`}>
            {/* Clickable Area for Popup */}
            <Dialog onOpenChange={(open) => open && triggerAudio()}>
                <DialogTrigger asChild>
                    <div className="relative w-full aspect-video mx-auto mt-6 mb-2 px-6 flex items-center justify-center cursor-pointer group transition-transform active:scale-95">
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] m-4" />
                        <Image
                            src={currentWord.image}
                            alt={currentWord.word}
                            width={500}
                            height={300}
                            className="object-contain rounded-3xl drop-shadow-2xl transition-transform group-hover:scale-105 duration-500"
                            unoptimized
                        />
                        <div className="absolute top-4 right-8 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </DialogTrigger>

                <DialogContent className="max-w-[90vw] md:max-w-3xl rounded-[40px] p-0 overflow-hidden border-none bg-transparent shadow-none focus-visible:outline-none">
                    <DialogTitle className="sr-only">Kelime Kartı Büyütme</DialogTitle>
                    <DialogDescription className="sr-only">{currentWord.word} kelimesinin büyük görseli ve telaffuzu.</DialogDescription>
                    <Card className={cn(
                        "w-full flex flex-col items-center justify-center p-8 md:p-12 border-none shadow-2xl bg-gradient-to-br",
                        gradient
                    )}>
                         <div className="relative w-full aspect-square md:aspect-video flex items-center justify-center mb-8">
                            <Image
                                src={currentWord.image}
                                alt={currentWord.word}
                                width={800}
                                height={600}
                                className="object-contain rounded-[40px] drop-shadow-2xl"
                                unoptimized
                            />
                        </div>
                        <div className="bg-white/90 backdrop-blur-md px-12 py-6 rounded-[32px] flex items-center gap-6 shadow-xl animate-in fade-in zoom-in duration-500">
                             <Button
                                size="icon"
                                className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 text-white border-none shadow-lg transition-transform hover:scale-110 active:scale-90"
                                onClick={triggerAudio}
                            >
                                <Volume2 className={cn("w-8 h-8", isTTSSpeaking && "animate-pulse")} />
                            </Button>
                            <h2 className="text-6xl md:text-8xl font-black text-gray-800 tracking-tight">{currentWord.word}</h2>
                        </div>
                    </Card>
                </DialogContent>
            </Dialog>

            <div className="bg-white p-8 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-center gap-4 mb-10">
                    <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full w-16 h-16 bg-green-100 hover:bg-green-200 text-green-600 border-none shadow-md transition-all active:scale-90"
                        onClick={triggerAudio}
                        disabled={isTTSSpeaking}
                    >
                        <Volume2 className={cn("w-8 h-8", isTTSSpeaking && "animate-pulse")} />
                    </Button>
                    <h2 className="text-5xl font-black text-slate-800 tracking-tight italic">{currentWord.word}</h2>
                    <audio ref={audioRef} />
                </div>
                
                <div className="flex justify-between items-center gap-4">
                    <Button
                        variant="outline"
                        className="flex-1 rounded-[24px] py-8 px-8 font-black text-xl border-4 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-30"
                        onClick={goToPrevious}
                        disabled={isFirstWord}
                    >
                        <ArrowLeft className="mr-3 w-6 h-6" />
                        GERİ
                    </Button>
                    
                    {isLastWord ? (
                        <Button
                            className="flex-[1.5] rounded-[24px] py-8 px-8 font-black text-xl bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200 transition-all active:scale-95 border-b-8 border-green-700"
                            onClick={goToNextStage}
                        >
                            OYUNA BAŞLA!
                            <Gamepad2 className="ml-3 w-6 h-6" />
                        </Button>
                    ) : (
                        <Button
                            className="flex-[1.5] rounded-[24px] py-8 px-8 font-black text-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 border-b-8 border-primary/70"
                            onClick={goToNext}
                        >
                            İLERİ
                            <ArrowRight className="ml-3 w-6 h-6" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
