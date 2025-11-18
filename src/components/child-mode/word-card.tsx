'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ArrowLeft, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { ttsFlow } from '@/ai/flows/tts-flow';
import { textToImageFlow } from '@/ai/flows/text-to-image-flow';

type Word = {
    word: string;
    image: string; // This will now be a hint for the AI
};

type WordCardProps = {
    wordList: Word[];
};

type WordCache = {
    [key: string]: {
        audio: string | null;
        image: string | null;
    }
}

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
    
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);

    const [wordCache, setWordCache] = useState<WordCache>({});

    const audioRef = useRef<HTMLAudioElement>(null);
    const currentWord = wordList[currentIndex];

    const generateAndCacheContent = useCallback(async (word: Word) => {
        if (wordCache[word.word]) {
            setImageSrc(wordCache[word.word].image);
            setAudioSrc(wordCache[word.word].audio);
            return;
        }

        setIsImageLoading(true);
        setIsAudioLoading(true);
        setImageSrc(null);
        setAudioSrc(null);

        const imagePromise = textToImageFlow(`A clear, simple, child-friendly cartoon image of a single '${word.word}' on a plain white background.`)
            .then(result => result.dataUri)
            .catch(err => {
                console.error("Image generation failed:", err);
                return null;
            });
        
        const audioPromise = ttsFlow(word.word)
            .then(result => result.media)
            .catch(err => {
                console.error("Audio generation failed:", err);
                return null;
            });

        const [imageData, audioData] = await Promise.all([imagePromise, audioPromise]);

        setWordCache(prev => ({
            ...prev,
            [word.word]: { image: imageData, audio: audioData }
        }));

        setImageSrc(imageData);
        setAudioSrc(audioData);
        setIsImageLoading(false);
        setIsAudioLoading(false);

    }, [wordCache]);

    useEffect(() => {
        setGradient(backgroundGradients[currentIndex % backgroundGradients.length]);
        generateAndCacheContent(currentWord);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, currentWord]);
    
    useEffect(() => {
        if (audioSrc && audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    }, [audioSrc]);


    const playAudio = () => {
        if (audioRef.current && audioSrc) {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        } else if (!isAudioLoading && currentWord) {
            // Regenerate only audio if it failed previously
            setIsAudioLoading(true);
            ttsFlow(currentWord.word)
                .then(result => {
                    const newAudio = result.media;
                    setAudioSrc(newAudio);
                    setWordCache(prev => ({ ...prev, [currentWord.word]: { ...prev[currentWord.word], audio: newAudio }}));
                })
                .catch(e => console.error("Audio generation failed:", e))
                .finally(() => setIsAudioLoading(false));
        }
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % wordList.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + wordList.length) % wordList.length);
    };

    const isLoading = isImageLoading || isAudioLoading;

    return (
        <Card className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-gradient-to-br ${gradient}`}>
            <div className="relative w-full aspect-video mx-auto mt-4 mb-2 px-4 flex items-center justify-center">
                {isImageLoading ? (
                    <div className='flex flex-col items-center gap-2 text-gray-600'>
                        <Loader2 className="w-12 h-12 animate-spin" />
                        <p>Resim oluşturuluyor...</p>
                    </div>
                ) : imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={currentWord.word}
                        fill
                        className="object-contain rounded-2xl"
                    />
                ) : (
                    <div className='flex flex-col items-center gap-2 text-gray-500'>
                        <ImageIcon className="w-12 h-12" />
                        <p>Resim yüklenemedi.</p>
                    </div>
                )}
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
                    <h2 className="text-5xl font-bold text-gray-800 capitalize">{currentWord.word}</h2>
                    {audioSrc && <audio ref={audioRef} src={audioSrc} />}
                </div>
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        className="rounded-full py-6 px-8 font-semibold text-lg"
                        onClick={goToPrevious}
                        disabled={isLoading}
                    >
                        <ArrowLeft className="mr-2" />
                        Önceki
                    </Button>
                    <Button
                        className="rounded-full py-6 px-8 font-semibold text-lg bg-primary hover:bg-primary/90"
                        onClick={goToNext}
                        disabled={isLoading}
                    >
                        Sonraki
                        <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
