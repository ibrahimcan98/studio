'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Gamepad2, Lock, Sparkles } from 'lucide-react';
import topicsData from '@/data/topics.json';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
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

    const childDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid || !childId) return null;
        return doc(db, 'users', authUser.uid, 'children', childId as string);
    }, [db, authUser?.uid, childId]);

    const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

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
            path: '#',
            icon: <Gamepad2 className="w-8 h-8 text-blue-500" />,
        },
    ];

    const isGameCompleted = (gameId: string) => {
        const completedKey = `${topicId}-${gameId}`;
        return childData?.completedTopics?.includes(completedKey);
    };

    const isGameUnlocked = (gameIndex: number) => {
        if (gameIndex === 0) return true; // First game is always unlocked
        const prevGameId = games[gameIndex - 1].id;
        return isGameCompleted(prevGameId);
    };
    
    if (authLoading || childLoading) {
        return (
             <div className="flex h-screen items-center justify-center bg-amber-50">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="bg-amber-50 h-screen p-4 sm:p-8 flex flex-col">
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
                                onClick={() => unlocked && !completed && router.push(game.path)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${!unlocked ? 'bg-gray-300' : 'bg-gray-100'}`}>
                                        {game.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-lg ${!unlocked ? 'text-gray-500' : 'text-gray-800'}`}>{game.name}</h3>
                                        <p className={`text-sm ${!unlocked ? 'text-gray-400' : 'text-muted-foreground'}`}>{game.description}</p>
                                    </div>
                                    {!unlocked ? (
                                        <Lock className="w-6 h-6 text-gray-400" />
                                    ) : completed ? (
                                        <div className="text-green-500 font-bold text-sm flex items-center gap-1">
                                            Tamamlandı
                                        </div>
                                    ): null}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
