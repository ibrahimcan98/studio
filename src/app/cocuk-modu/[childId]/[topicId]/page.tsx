
'use client';

import { useParams, useRouter } from 'next/navigation';
import topicsData from '@/data/topics.json';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { WordCard } from '@/components/child-mode/word-card';
import { ChildHeader } from '@/components/child-mode/child-header';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';


type Word = {
    word: string;
    image: string;
    audio: string;
};

type Topic = {
    id: string;
    name: string;
    icon: string;
    words: number;
    unlocked: boolean;
    wordList: Word[];
};


export default function TopicPage() {
    const params = useParams();
    const router = useRouter();
    const { childId, topicId } = params;
    const [topic, setTopic] = useState<Topic | null>(null);

    const { user: authUser, loading: authLoading } = useUser();
    const db = useFirestore();

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
    const isPremium = userData?.isPremium || false;

     const handleLivesUpdate = useCallback(async (newLives: number) => {
        if (childDocRef) {
            await updateDoc(childDocRef, {
                lives: newLives,
                livesLastUpdatedAt: serverTimestamp()
            });
        }
    }, [childDocRef]);

    useEffect(() => {
        if(topicId) {
            const currentTopic = topicsData.find(t => t.id === topicId);
            if (currentTopic) {
                // @ts-ignore
                setTopic(currentTopic as Topic);
            }
        }
    }, [topicId]);


    if (!topic || authLoading || childLoading || userDataLoading || !childData) {
        return (
            <div className="flex h-screen items-center justify-center bg-amber-50">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    const currentLives = childData.lives ?? 5;

    return (
        <div className="bg-amber-50 h-screen flex flex-col">
             <ChildHeader 
                childName={childData.firstName} 
                lives={isPremium ? 'unlimited' : currentLives}
                badges={childData.rozet || 0}
                isPremium={isPremium}
                childId={childId as string}
                livesLastUpdatedAt={childData.livesLastUpdatedAt}
                onLivesUpdate={handleLivesUpdate}
            />
            <div className="p-4 sm:p-8 flex flex-col flex-1">
                <header className="flex-shrink-0 mb-4">
                    <div className="w-full max-w-4xl mx-auto flex items-center justify-center relative">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 bg-white/50"
                            onClick={() => router.push(`/cocuk-modu/${childId}`)}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">{topic.name}</h1>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center min-h-0">
                   <WordCard wordList={topic.wordList} childId={childId as string} topicId={topicId as string} />
                </main>
            </div>
        </div>
    );
}
