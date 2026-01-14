
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
import { doc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
    return [...array].sort(() => Math.random() - 0.5);
};

export default function PuzzleClient({ words }: PuzzleClientProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [shuffledPieces, setShuffledPieces] = useState<(number | null)[]>(pieceIndices);
    const [placedPieces, setPlacedPieces] = useState<(number | null)[]>(Array(PIECES_COUNT).fill(null));
    const [selectedPiece, setSelectedPiece] = useState<{ index: number; piece: number } | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);

    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { childId, topicId } = params;
    const { width, height } = useWindowSize();
    const audioRef = useRef<HTMLAudioElement>(null);

    const { user: authUser } = useUser();
    const db = useFirestore();
    
    const userDocRef = useMemoFirebase(() => (db && authUser?.uid) ? doc(db, 'users', authUser.uid) : null, [db, authUser?.uid]);
    const { data: userData } = useDoc(userDocRef);
    const [lives, setLives] = useState(5);

    const childDocRef = useMemoFirebase(() => (db && authUser?.uid && childId) ? doc(db, 'users', authUser.uid, 'children', childId as string) : null, [db, authUser?.uid, childId]);
    const { data: childData } = useDoc(childDocRef);
    
    const currentWord = words[currentWordIndex];

    useEffect(() => {
        if (userData) setLives(userData.lives ?? 5);
    }, [userData]);

    useEffect(() => {
        // Shuffle pieces on the client side to avoid hydration errors
        setShuffledPieces(shuffleArray([...pieceIndices]));
        setPlacedPieces(Array(PIECES_COUNT).fill(null));
        setIsSolved(false);
        setSelectedPiece(null);
    }, [currentWordIndex]);

    const handleSelectPiece = (piece: number, index: number) => {
        if (isSolved || piece === null) return;
        setSelectedPiece({ piece, index });
    };

    const handlePlacePiece = async (gridIndex: number) => {
        if (isSolved || selectedPiece === null || placedPieces[gridIndex] !== null) return;

        if (selectedPiece.piece === gridIndex) {
            const newPlaced = [...placedPieces];
            newPlaced[gridIndex] = selectedPiece.piece;
            setPlacedPieces(newPlaced);

            const newShuffled = [...shuffledPieces];
            newShuffled[selectedPiece.index] = null;
            setShuffledPieces(newShuffled);
            
            setSelectedPiece(null);

            if (newPlaced.every(p => p !== null)) {
                setIsSolved(true);
                audioRef.current?.play().catch(() => {});
            }
        } else {
            if (!(userData?.isPremium)) {
                const newLives = Math.max(0, lives - 1);
                setLives(newLives);
                if (userDocRef) await updateDoc(userDocRef, { lives: newLives, livesLastUpdatedAt: serverTimestamp() });
                if (newLives <= 0) {
                    toast({ variant: "destructive", title: "Canların Bitti!" });
                    router.push('/ebeveyn-portali');
                }
            }
            setSelectedPiece(null);
        }
    };
    
    if (gameFinished) {
        return (
            <div className="bg-green-100 h-screen flex flex-col items-center justify-center p-8 text-center">
                <Confetti width={width} height={height} recycle={false}/>
                <Star className="w-24 h-24 text-yellow-400 fill-yellow-400 mb-6" />
                <h1 className="text-4xl font-bold text-green-800 mb-2">Harika İş!</h1>
                <p className="text-lg text-green-700 mb-8">Yapboz oyununu tamamladın!</p>
                <Button onClick={() => router.push(`/cocuk-modu/${childId}/${topicId}/oyunlar`)}>Devam Et</Button>
            </div>
        )
    }

    return (
        <div className="bg-blue-50 h-screen p-4 sm:p-8 flex flex-col">
            <audio ref={audioRef} src={currentWord.audio} />
            <header className="flex-shrink-0 mb-4 flex items-center justify-between max-w-4xl mx-auto w-full">
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => router.back()}><ArrowLeft /></Button>
                <h1 className="text-2xl font-bold text-gray-800">Resmi Tamamla: {currentWord.word}</h1>
                <div className="flex items-center gap-2 text-destructive font-bold"><Heart className="fill-current" /><span>{userData?.isPremium ? '∞' : lives}</span></div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
                <div className="relative w-[300px] h-[300px] grid grid-cols-2 grid-rows-2 gap-1 bg-gray-200 rounded-lg overflow-hidden shadow-xl">
                    <Image src={currentWord.image} layout="fill" objectFit="cover" className="opacity-20" alt="bg"/>
                    {pieceIndices.map((i) => (
                        <div key={i} onClick={() => handlePlacePiece(i)} className={cn("transition-all border-2", placedPieces[i] === null ? "border-dashed border-gray-400" : "border-transparent")}>
                            {placedPieces[i] !== null && <div className="w-full h-full" style={{ backgroundImage: `url(${currentWord.image})`, backgroundSize: '200% 200%', backgroundPosition: `${(i % 2) * 100}% ${Math.floor(i / 2) * 100}%` }} />}
                        </div>
                    ))}
                    {isSolved && <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center z-50"><Button onClick={() => currentWordIndex < words.length - 1 ? setCurrentWordIndex(c => c + 1) : setGameFinished(true)}>İleri <ArrowRight className="ml-2"/></Button></div>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {shuffledPieces.map((p, i) => (
                        p !== null ? <div key={i} onClick={() => handleSelectPiece(p, i)} className={cn("w-[140px] h-[140px] rounded-lg cursor-pointer transition-all", selectedPiece?.index === i ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105')} style={{ backgroundImage: `url(${currentWord.image})`, backgroundSize: '200% 200%', backgroundPosition: `${(p % 2) * 100}% ${Math.floor(p / 2) * 100}%` }} /> : <div key={i} className="w-[140px] h-[140px] bg-gray-300 rounded-lg opacity-30" />
                    ))}
                </div>
            </main>
        </div>
    );
}
