
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/use-tts';

type Word = {
    word: string;
    image: string;
    audio: string;
};

type JigsawPuzzleProps = {
    wordList: Word[];
    onComplete: () => void;
};

const PIECES_COUNT = 4; // 2x2
const pieceIndices = [0, 1, 2, 3];

export function JigsawPuzzle({ wordList, onComplete }: JigsawPuzzleProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [shuffledPieces, setShuffledPieces] = useState<number[]>([]);
    const [placedPieces, setPlacedPieces] = useState<(number | null)[]>(Array(PIECES_COUNT).fill(null));
    const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const { speak } = useTTS();

    // Sadece 3 tane kelimeyi rastgele seçelim (eğer liste çok uzunsa)
    const activeWords = useMemo(() => {
        return [...wordList].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [wordList]);

    const currentWord = activeWords[currentWordIndex];

    const shuffle = useCallback(() => {
        const shuffled = [...pieceIndices].sort(() => Math.random() - 0.5);
        setShuffledPieces(shuffled);
        setPlacedPieces(Array(PIECES_COUNT).fill(null));
        setIsSolved(false);
        setSelectedPieceIndex(null);
    }, []);

    useEffect(() => {
        shuffle();
        // Kelime değiştiğinde yönergeyi seslendir
        if (currentWord) {
            speak(`Hadi bakalım şimdi ${currentWord.word} yapbozunu yapalım!`);
        }
    }, [currentWordIndex, shuffle, speak, currentWord]);

    const handleSelectPiece = (pieceIdx: number) => {
        if (isSolved) return;
        setSelectedPieceIndex(pieceIdx);
    };

    const handlePlacePiece = (gridIndex: number) => {
        if (isSolved || selectedPieceIndex === null) return;
        
        const pieceValue = shuffledPieces[selectedPieceIndex];

        // Eğer doğru yerse
        if (pieceValue === gridIndex) {
            const newPlaced = [...placedPieces];
            newPlaced[gridIndex] = pieceValue;
            setPlacedPieces(newPlaced);

            // Shuffled pieces'dan kaldır (null yap)
            const newShuffled = [...shuffledPieces];
            // @ts-ignore
            newShuffled[selectedPieceIndex] = null;
            setShuffledPieces(newShuffled);
            
            setSelectedPieceIndex(null);

            // Hepsi bitti mi?
            if (newPlaced.every(p => p !== null)) {
                setIsSolved(true);
                speak("Harikasın!");
            }
        } else {
            // Yanlış yer - sallanma efekti veya geri bildirim verilebilir
            setSelectedPieceIndex(null);
        }
    };

    const handleNext = () => {
        if (currentWordIndex < activeWords.length - 1) {
            setCurrentWordIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 items-center">
            
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-600 font-black text-sm uppercase tracking-widest mb-4">
                    <Sparkles className="w-4 h-4" />
                    Yapboz Zamanı
                </div>
                <h2 className="text-5xl font-black text-gray-800 italic tracking-tighter uppercase">
                    RESMİ TAMAMLA
                </h2>
                <p className="text-xl font-bold text-slate-500 uppercase">
                    Parçaları doğru yerlere yerleştir!
                </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full">
                
                {/* SOL: Hedef Grid */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full scale-110" />
                    <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] grid grid-cols-2 grid-rows-2 gap-2 bg-white/50 p-2 rounded-[40px] shadow-2xl border-[6px] border-white backdrop-blur-sm overflow-hidden">
                        {/* Arka planda silik resim (ipucu) */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <Image src={currentWord.image} fill className="object-cover p-4" alt="hint" unoptimized />
                        </div>

                        {pieceIndices.map((i) => (
                            <div 
                                key={i} 
                                onClick={() => handlePlacePiece(i)} 
                                className={cn(
                                    "relative rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer",
                                    placedPieces[i] === null 
                                        ? "bg-slate-200/50 border-4 border-dashed border-slate-300 hover:bg-slate-200" 
                                        : "bg-white border-0 shadow-lg"
                                )}
                            >
                                {placedPieces[i] !== null && (
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-full h-full" 
                                        style={{ 
                                            backgroundImage: `url(${currentWord.image})`, 
                                            backgroundSize: '200% 200%', 
                                            backgroundPosition: `${(i % 2) * 100}% ${Math.floor(i / 2) * 100}%` 
                                        }} 
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* SAĞ: Parçalar */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 bg-white/30 p-6 rounded-[40px] backdrop-blur-md border-4 border-white/50 shadow-xl">
                    {shuffledPieces.map((p, i) => (
                        <div key={i} className="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px]">
                            {p !== null ? (
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSelectPiece(i)} 
                                    className={cn(
                                        "w-full h-full rounded-[30px] cursor-pointer transition-all border-[6px] shadow-xl overflow-hidden",
                                        selectedPieceIndex === i 
                                            ? 'border-purple-500 ring-8 ring-purple-500/20 scale-105 z-50' 
                                            : 'border-white hover:border-purple-200'
                                    )} 
                                    style={{ 
                                        backgroundImage: `url(${currentWord.image})`, 
                                        backgroundSize: '200% 200%', 
                                        backgroundPosition: `${(p % 2) * 100}% ${Math.floor(p / 2) * 100}%` 
                                    }} 
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-200/30 rounded-[30px] border-4 border-dashed border-slate-200" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* BAŞARI MODALI VEYA BUTONU */}
            <AnimatePresence>
                {isSolved && (
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="fixed bottom-10 z-50"
                    >
                        <Button 
                            onClick={handleNext}
                            className="h-20 px-12 rounded-full text-2xl font-black bg-green-500 text-white hover:bg-green-600 shadow-[0_15px_30px_rgba(34,197,94,0.4)] border-b-[8px] border-green-700 active:border-b-0 active:translate-y-2 transition-all flex items-center gap-4"
                        >
                            {currentWordIndex < activeWords.length - 1 ? 'SIRADAKİ RESİM' : 'TAMAMLA'}
                            <ArrowRight className="w-8 h-8" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

