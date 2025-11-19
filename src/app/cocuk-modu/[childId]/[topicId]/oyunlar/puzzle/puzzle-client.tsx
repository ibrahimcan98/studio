
'use client';

import { useState, useEffect, useMemo } from 'react';
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
    const [shuffledPieces, setShuffledPieces] = useState<number[]>([]);
    const [placedPieces, setPlacedPieces] = useState<(number | null)[]>(Array(PIECES_COUNT).fill(null));
    const [draggedPiece, setDraggedPiece] = useState<{ index: number; piece: number } | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);

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
        setIsSolved(false);
    };

    const handleDragStart = (piece: number, index: number) => {
        setDraggedPiece({ piece, index });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (dropIndex: number) => {
        if (draggedPiece === null) return;
        
        // If piece is correct
        if (draggedPiece.piece === dropIndex) {
            const newPlacedPieces = [...placedPieces];
            newPlacedPieces[dropIndex] = draggedPiece.piece;
            setPlacedPieces(newPlacedPieces);

            const newShuffledPieces = [...shuffledPieces];
            newShuffledPieces[draggedPiece.index] = -1; // Mark as placed
            setShuffledPieces(newShuffledPieces);
            
            // Check if all pieces are placed
            const allPlaced = newPlacedPieces.every(p => p !== null);
            if (allPlaced) {
                setIsSolved(true);
            }
        }
        setDraggedPiece(null);
    };
    
    const goToNextWord = async () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(prev => prev + 1);
        } else {
            await handleGameFinish();
        }
    }


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
        setGameFinished(true);
    };

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
                    className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden shadow-lg bg-gray-200"
                >
                    {/* Background silhouette */}
                    <Image src={currentWord.image} layout="fill" objectFit="cover" className="opacity-20" alt="Puzzle silhouette"/>

                    {pieceIndices.map((index) => {
                        const placedPiece = placedPieces[index];
                        const row = Math.floor(index / 2);
                        const col = index % 2;

                        return (
                            <div
                                key={index}
                                onDrop={() => handleDrop(index)}
                                onDragOver={handleDragOver}
                                className={cn("transition-colors", placedPiece === null && "bg-transparent hover:bg-black/10")}
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
                        <div className="absolute inset-0 bg-green-500/70 flex flex-col items-center justify-center gap-4">
                            <CheckCircle className="w-24 h-24 text-white" />
                             <Button onClick={goToNextWord} size="lg">
                                {currentWordIndex === words.length - 1 ? 'Bitir' : 'İleri'}
                                <ArrowRight className="ml-2 w-5 h-5"/>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-48 flex lg:flex-col items-center justify-center gap-4">
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                        {shuffledPieces.map((piece, index) => {
                            if (piece === -1) return <div key={index} className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-300/50" />;
                            const row = Math.floor(piece / 2);
                            const col = piece % 2;
                            return (
                                <div
                                    key={index}
                                    draggable={!isSolved}
                                    onDragStart={() => handleDragStart(piece, index)}
                                    className={cn("w-24 h-24 md:w-32 md:h-32 rounded-lg cursor-grab active:cursor-grabbing", isSolved && "cursor-not-allowed")}
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

