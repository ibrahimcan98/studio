'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Heart, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { cn } from '@/lib/utils';

type Word = {
    word: string;
    image: string;
    audio: string;
};

type PuzzleClientProps = {
    words: Word[];
};

const PIECES_COUNT = 4;
const pieceIndices = Array.from(Array(PIECES_COUNT).keys());

const shuffleArray = <T,>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
};

export default function PuzzleClient({ words }: PuzzleClientProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [shuffledPieces, setShuffledPieces] = useState<(number | null)[]>([]);
    const [placedPieces, setPlacedPieces] = useState<(number | null)[]>(Array(PIECES_COUNT).fill(null));
    const [selectedPiece, setSelectedPiece] = useState<{ index: number; piece: number } | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);

    const router = useRouter();
    const params = useParams();
    const { childId, topicId } = params;
    const { width, height } = useWindowSize();
    const audioRef = useRef<HTMLAudioElement>(null);

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
    const [lives, setLives] = useState(3);

    const currentWord = words[currentWordIndex];

    useEffect(() => {
        if (childData) {
            setLives(childData.lives ?? 3);
        }
    }, [childData]);

     useEffect(() => {
        startNewPuzzle();
    }, [currentWordIndex]);


    const startNewPuzzle = () => {
        const shuffled = shuffleArray([...pieceIndices]);
        setShuffledPieces(shuffled);
        setPlacedPieces(Array(PIECES_COUNT).fill(null));
        setSelectedPiece(null);
        setIsSolved(false);
    };

    const handleSelectPiece = (piece: number, index: number) => {
        if (isSolved || piece === null) return;
        setSelectedPiece({ piece, index });
    };

    const handlePlacePiece = async (gridIndex: number) => {
        if (isSolved || selectedPiece === null || placedPieces[gridIndex] !== null) return;

        if (selectedPiece.piece === gridIndex) {
            // Correct placement
            const newPlacedPieces = [...placedPieces];
            newPlacedPieces[gridIndex] = selectedPiece.piece;
            setPlacedPieces(newPlacedPieces);

            const newShuffledPieces = [...shuffledPieces];
            newShuffledPieces[selectedPiece.index] = null; // Mark as placed
            setShuffledPieces(newShuffledPieces);
            
            setSelectedPiece(null); // Deselect piece

            const allPlaced = newPlacedPieces.every(p => p !== null);
            if (allPlaced) {
                setIsSolved(true);
                if (audioRef.current) {
                    audioRef.current.play().catch(e => console.error("Audio play failed:", e));
                }
            }
        } else {
            // Incorrect placement
            if (!isPremium) {
                const newLives = lives - 1;
                setLives(newLives);
                if (childDocRef) {
                    await updateDoc(childDocRef, { lives: newLives });
                }
                if (newLives <= 0) {
                     setTimeout(() => {
                        alert('Canların bitti! Ebeveyn portalına yönlendiriliyorsun.');
                        router.push('/ebeveyn-portali');
                    }, 1500);
                    return;
                }
            }
            setSelectedPiece(null); // Deselect piece after wrong attempt
        }
    };
    
    const goToNextWord = async () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(prev => prev + 1);
        } else {
            setGameFinished(true); // Trigger game finished state
        }
    }

    // Effect to handle the final database update and confetti when gameFinished is true
    useEffect(() => {
        if (gameFinished) {
            const handleGameFinish = async () => {
                if (childDocRef && topicId) {
                    const completedKey = `${topicId}-puzzle`;
                    // Avoid adding duplicate entries if game is replayed
                    if (!childData?.completedTopics?.includes(completedKey)) {
                        await updateDoc(childDocRef, {
                            completedTopics: arrayUnion(completedKey),
                            rozet: increment(1)
                        });
                    }
                }
            };
            handleGameFinish();
        }
    }, [gameFinished, childDocRef, topicId, childData]);


    const resetGame = () => {
        startNewPuzzle();
    }
    
    if (gameFinished) {
        return (
            <div className="bg-green-100 h-screen flex flex-col items-center justify-center p-8 text-center">
                <Confetti width={width} height={height} recycle={false} numberOfPieces={500}/>
                <Star className="w-24 h-24 text-yellow-400 fill-yellow-400 mb-6" />
                <h1 className="text-4xl font-bold text-green-800 mb-2">Harika İş!</h1>
                <p className="text-lg text-green-700 mb-8">Yapboz oyununu tamamladın ve 1 yeni rozet kazandın!</p>
                <Button onClick={() => router.push(`/cocuk-modu/${childId}/${topicId}/oyunlar`)}>
                    Diğer Oyunlara Devam Et
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-blue-50 h-screen p-4 sm:p-8 flex flex-col">
             <audio ref={audioRef} src={currentWord.audio} />
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
                        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
                           Resmi Tamamla: {currentWord.word}
                        </h1>
                    </div>
                    <div className="w-auto flex items-center gap-2 font-semibold text-destructive px-4">
                        <Heart className="w-7 h-7 fill-current" />
                        <span className="text-2xl">{isPremium ? 'Sınırsız' : lives}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
                 <div 
                    className="relative w-[302px] h-[302px] md:w-[402px] md:h-[402px] grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden shadow-lg bg-gray-200"
                >
                    {/* Background silhouette */}
                    <Image src={currentWord.image} layout="fill" objectFit="cover" className="opacity-20 pointer-events-none" alt="Puzzle silhouette"/>

                    {pieceIndices.map((index) => {
                        const placedPiece = placedPieces[index];

                        return (
                            <div
                                key={index}
                                onClick={() => handlePlacePiece(index)}
                                className={cn(
                                    "transition-colors border-2 z-10",
                                    placedPieces[index] === null ? "border-dashed border-gray-400/50 cursor-pointer hover:bg-black/10" : "border-transparent"
                                )}
                            >
                                {placedPiece !== null && (
                                     <div
                                        className="w-full h-full"
                                        style={{
                                            backgroundImage: `url(${currentWord.image})`,
                                            backgroundSize: '200% 200%',
                                            backgroundPosition: `${(placedPiece % 2) * 100}% ${Math.floor(placedPiece / 2) * 100}%`,
                                        }}
                                    />
                                )}
                            </div>
                        )
                    })}

                    {isSolved && (
                        <div className="absolute inset-0 bg-green-500/70 flex flex-col items-center justify-center gap-4 z-20">
                            <CheckCircle className="w-24 h-24 text-white" />
                             <Button onClick={goToNextWord} size="lg">
                                {currentWordIndex === words.length - 1 ? 'Bitir' : 'İleri'}
                                <ArrowRight className="ml-2 w-5 h-5"/>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-auto flex lg:flex-col items-center justify-center gap-4">
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
                        {shuffledPieces.map((piece, index) => {
                            if (piece === null) return <div key={index} className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-lg bg-gray-300/50" />;
                            const row = Math.floor(piece / 2);
                            const col = piece % 2;
                            return (
                                <div
                                    key={index}
                                    onClick={() => handleSelectPiece(piece, index)}
                                    className={cn(
                                        "w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-lg cursor-pointer transition-all",
                                        selectedPiece?.index === index ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'
                                    )}
                                    style={{
                                        backgroundImage: `url(${currentWord.image})`,
                                        backgroundSize: '200% 200%',
                                        backgroundPosition: `${col * 100}% ${row * 100}%`,
                                    }}
                                />
                            )
                        })}
                    </div>
                     <Button onClick={resetGame} variant="outline" size="icon" className="h-12 w-12" disabled={isSolved}>
                        <RefreshCw className="w-5 h-5" />
                    </Button>
                </div>
            </main>
        </div>
    );
}
