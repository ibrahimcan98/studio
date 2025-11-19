
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Heart, CheckCircle, RefreshCw } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

const shuffleArray = <T,>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
};

const PIECES = [0, 1, 2, 3];

export default function PuzzleClient({ imageUrl }: { imageUrl: string }) {
    const [pieces, setPieces] = useState(() => shuffleArray([...PIECES]));
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [solved, setSolved] = useState(false);
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

    useEffect(() => {
        if (childData) {
            setLives(childData.lives ?? 3);
        }
    }, [childData]);

    const checkSolution = (currentPieces: number[]) => {
        if (currentPieces.every((p, i) => p === i)) {
            setSolved(true);
            setTimeout(() => {
                handleGameFinish();
            }, 1000);
        }
    };
    
    const handlePieceClick = (index: number) => {
        if (solved) return;

        if (selectedPiece === null) {
            setSelectedPiece(index);
        } else {
            const newPieces = [...pieces];
            // Swap pieces
            [newPieces[selectedPiece], newPieces[index]] = [newPieces[index], newPieces[selectedPiece]];
            setPieces(newPieces);
            setSelectedPiece(null);
            checkSolution(newPieces);
        }
    };

    const handleGameFinish = async () => {
        if (childDocRef && topicId) {
            const completedKey = `${topicId}-puzzle`;
            await updateDoc(childDocRef, {
                completedTopics: arrayUnion(completedKey),
                rozet: increment(1)
            });
        }
        setGameFinished(true);
    };

    const resetGame = () => {
        setPieces(shuffleArray([...PIECES]));
        setSelectedPiece(null);
        setSolved(false);
    }
    
    if (gameFinished) {
        return (
            <div className="bg-green-100 h-screen flex flex-col items-center justify-center p-8 text-center">
                <Confetti width={width} height={height} recycle={false} numberOfPieces={500}/>
                <Star className="w-24 h-24 text-yellow-400 fill-yellow-400 mb-6" />
                <h1 className="text-4xl font-bold text-green-800 mb-2">Harika İş!</h1>
                <p className="text-lg text-green-700 mb-8">Yapbozu tamamladın ve 1 yeni rozet kazandın!</p>
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
                           Resmi Tamamla
                        </h1>
                    </div>
                    <div className="w-auto flex items-center gap-2 font-semibold text-destructive px-4">
                        <Heart className="w-7 h-7 fill-current" />
                        <span className="text-2xl">{isPremium ? 'Sınırsız' : lives}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center gap-8">
                 <div 
                    className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] grid grid-cols-2 grid-rows-2 gap-1 rounded-lg overflow-hidden shadow-lg"
                    style={{ pointerEvents: solved ? 'none' : 'auto' }}
                >
                    {pieces.map((piece, index) => {
                        const row = Math.floor(piece / 2);
                        const col = piece % 2;
                        return (
                            <div
                                key={index}
                                onClick={() => handlePieceClick(index)}
                                className={`transition-all duration-300 ease-in-out cursor-pointer ${selectedPiece === index ? 'ring-4 ring-yellow-400 z-10 scale-105' : 'hover:scale-105'}`}
                                style={{
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundSize: '200% 200%',
                                    backgroundPosition: `${col * 100}% ${row * 100}%`,
                                }}
                            />
                        )
                    })}

                    {solved && (
                        <div className="absolute inset-0 bg-green-500/70 flex items-center justify-center">
                            <CheckCircle className="w-24 h-24 text-white" />
                        </div>
                    )}
                </div>

                <Button onClick={resetGame} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Yeniden Karıştır
                </Button>
            </main>
        </div>
    );
}

