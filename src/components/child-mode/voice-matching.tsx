'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, Star } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useTTS } from '@/hooks/use-tts';

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
    const { speak, isPlaying: isTTSSpeaking } = useTTS();

    const currentWord = wordList[currentIndex];

    const successPhrases = [
        "Harikasın! Tam üstüne bastın!",
        "Aferin sana, doğru bildin! Süpersin!",
        "İşte bu! Gerçek bir dedektifsin!",
        "Vay canına, ne kadar da hızlı buldun! Bravo!",
        "Çok iyisin! Doğru kartı şak diye buldun!"
    ];

    const errorPhrases = [
        "Aman, bu o değilmiş sanki. Bir daha dene bakalım!",
        "Yaklaştın ama tam bu değil. Hadi bir şans daha!",
        "Hay aksi! Başka bir karta bakmaya ne dersin?",
        "Olmadı ama üzülmek yok, eminim bir sonrakinde bulacaksın!",
        "Denemeye devam! Bir tane daha seç bakalım."
    ];

    // YENİ KURAL: Kelimeyi bükmüyoruz, sonuna "kelimesi" ekliyoruz.
    const promptPhrases = [
        "Hadi bakalım, şimdi {target} kelimesi nerede?",
        "Acaba {target} kelimesi hangisi? Onu bana gösterebilir misin?",
        "Gözlerim {target} kelimesini arıyor, hadi onu bulalım!",
        "Bakalım {target} kelimesi hangi kartın arkasına saklanmış?",
        "Şimdi sıra {target} kelimesini bulmakta! Haydi bastır!"
    ];

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
        if (!currentWord?.word) return;
        
        const randomPrompt = promptPhrases[Math.floor(Math.random() * promptPhrases.length)];
        
        // Doğrudan kelimeyi yerleştiriyoruz. Gramer karmaşası bitti!
        const text = randomPrompt.replace('{target}', currentWord.word);
        
        speak(text);
    }, [currentWord, speak]);

    useEffect(() => {
        playAudio();
    }, [playAudio]);

    const handleAnswer = (answer: Word) => {
        if (selectedAnswer || isTTSSpeaking) return;

        setSelectedAnswer(answer);
        const correct = answer.word === currentWord.word;
        setIsCorrect(correct);

        if (correct) {
            const randomSuccess = successPhrases[Math.floor(Math.random() * successPhrases.length)];
            speak(randomSuccess, {
                onEnd: () => {
                    if (currentIndex < wordList.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                        setSelectedAnswer(null);
                        setIsCorrect(null);
                    } else {
                        onComplete();
                    }
                }
            });
        } else {
            const randomError = errorPhrases[Math.floor(Math.random() * errorPhrases.length)];
            speak(randomError, {
                onEnd: () => {
                    setSelectedAnswer(null);
                    setIsCorrect(null);
                    playAudio();
                }
            });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-center">
            <div className="flex items-center gap-6 bg-white p-6 rounded-3xl shadow-xl">
                <Button
                    size="icon"
                    className="w-20 h-20 rounded-full bg-blue-500 hover:bg-blue-600 text-white border-none shadow-lg border-b-8 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
                    onClick={playAudio}
                    disabled={isTTSSpeaking}
                >
                    <Volume2 className={cn("w-10 h-10", isTTSSpeaking && "animate-pulse")} />
                </Button>
                <div className="flex flex-col">
                    <span className="text-blue-400 text-sm font-black uppercase tracking-widest italic">Dinle ve Seç</span>
                    <h2 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter">"{currentWord.word}" kelimesi nerede?</h2>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                {options.map((option, index) => (
                    <Card
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className={`relative aspect-square rounded-[40px] overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center p-8 bg-white border-4 border-white shadow-md
                            ${selectedAnswer?.word === option.word && isCorrect === true ? 'ring-8 ring-green-500 scale-105' : ''}
                            ${selectedAnswer?.word === option.word && isCorrect === false ? 'ring-8 ring-red-500 animate-shake' : ''}
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
                            <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
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

// Helper function to use class names conditionally
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
