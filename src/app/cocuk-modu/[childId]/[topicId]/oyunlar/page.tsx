
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Gamepad2, Lock, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import topicsData from '@/data/topics.json';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

type Game = {
    id: string;
    name: string;
    description: string;
    path: string;
    icon: React.ReactNode;
};

export default function GamesPage() {
    const params = useParams();
    const router = useRouter();
    const { childId, topicId } = params;

    const { user: authUser, loading: authLoading } = useUser();
    const db = useFirestore();

    const [topicName, setTopicName] = useState('');
    const [allGamesCompleted, setAllGamesCompleted] = useState(false);

    const childDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid || !childId) return null;
        return doc(db, 'users', authUser.uid, 'children', childId as string);
    }, [db, authUser?.uid, childId]);

    const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

    const userDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid) return null;
        return doc(db, 'users', authUser.uid);
    }, [db, authUser?.uid]);

    const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

    useEffect(() => {
        const topic = topicsData.find(t => t.id === topicId);
        if (topic) {
            setTopicName(topic.name);
        }
    }, [topicId]);

    const games: Game[] = [
        {
            id: 'sesli-secme',
            name: 'Doğru Olanı Seç',
            description: 'Sesi dinle ve doğru resmi bul.',
            path: `/cocuk-modu/${childId}/${topicId}/oyunlar/sesli-secme`,
            icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
        },
        {
            id: 'puzzle',
            name: 'Puzzle Tamamlama',
            description: 'Parçaları birleştirerek resmi tamamla.',
            path: `/cocuk-modu/${childId}/${topicId}/oyunlar/puzzle`,
            icon: <Gamepad2 className="w-8 h-8 text-blue-500" />,
        },
    ];

    const isGameCompleted = (gameId: string) => {
        if (!childData?.completedTopics) return false;
        const completedKey = `${topicId}-${gameId}`;
        return childData.completedTopics.includes(completedKey);
    };
    
    // Check if all games are completed and update the topic as completed
    useEffect(() => {
        if (childData && games.every(game => isGameCompleted(game.id))) {
            const markTopicAsCompleted = async () => {
                if (childDocRef && !childData.completedTopics?.includes(topicId as string)) {
                     await updateDoc(childDocRef, {
                        completedTopics: arrayUnion(topicId as string),
                        badges: arrayUnion(topicId as string)
                    });
                     setAllGamesCompleted(true);
                }
            };
            markTopicAsCompleted();
        }
    }, [childData, games, childDocRef, topicId]);

    const isGameUnlocked = (gameIndex: number) => {
        if (gameIndex === 0) return true; // First game is always unlocked
        const prevGameId = games[gameIndex - 1].id;
        return isGameCompleted(prevGameId);
    };
    
    if (authLoading || childLoading || userDataLoading || !childData) {
        return (
             <div className="flex h-screen items-center justify-center bg-amber-50">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    if (allGamesCompleted) {
        return (
             <div className="bg-green-100 h-screen flex flex-col items-center justify-center p-8 text-center">
                <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                <h1 className="text-4xl font-bold text-green-800 mb-2">Tebrikler!</h1>
                <p className="text-lg text-green-700 mb-8">"{topicName}" konusundaki tüm oyunları tamamladın ve yeni bir rozet kazandın!</p>
                <Button onClick={() => router.push(`/cocuk-modu/${childId}`)}>
                    Yeni Konulara Geç
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-amber-50 h-screen flex flex-col">
            <div className="p-4 sm:p-8 flex flex-col flex-1">
                <header className="flex-shrink-0 mb-8">
                    <div className="w-full max-w-4xl mx-auto flex items-center justify-center relative">
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 bg-white/50"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div className="text-center">
                            <p className="text-muted-foreground">{topicName}</p>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Oyun Zamanı!</h1>
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-2xl mx-auto w-full">
                    <div className="space-y-6">
                        {games.map((game, index) => {
                            const unlocked = isGameUnlocked(index);
                            const completed = isGameCompleted(game.id);

                            return (
                                <Card
                                    key={game.id}
                                    className={`p-4 rounded-xl transition-all ${!unlocked ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:shadow-lg hover:-translate-y-1 cursor-pointer'}`}
                                    onClick={() => unlocked && router.push(game.path)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${!unlocked ? 'bg-gray-300' : 'bg-gray-100'}`}>
                                           {unlocked ? game.icon : <Lock className="w-8 h-8 text-gray-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-bold text-lg ${!unlocked ? 'text-gray-500' : 'text-gray-800'}`}>{game.name}</h3>
                                            <p className={`text-sm ${!unlocked ? 'text-gray-400' : 'text-muted-foreground'}`}>{game.description}</p>
                                        </div>
                                        {unlocked && completed && (
                                            <div className="text-green-500 flex items-center gap-1 font-semibold text-sm">
                                                <CheckCircle className="w-5 h-5"/>
                                                <span>Tamamlandı</span>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}
