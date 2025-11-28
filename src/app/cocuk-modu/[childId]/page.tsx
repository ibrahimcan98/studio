
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { Loader2, Sparkles } from 'lucide-react';
import { ChildHeader } from '@/components/child-mode/child-header';
import { TopicCard } from '@/components/child-mode/topic-card';
import topics from '@/data/topics.json';

export default function CocukModuPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser, loading: authLoading } = useUser();
  const db = useFirestore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const pin = localStorage.getItem(`child-pin-${childId}`);
    if (!pin) {
      router.push('/ebeveyn-portali');
    } else {
      setIsAuthenticated(true);
    }
  }, [childId, router]);

  const childDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);
  
  const userDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid) return null;
    return doc(db, 'users', authUser.uid);
  }, [db, authUser?.uid]);

  const { data: userData } = useDoc(userDocRef);
  const isPremium = userData?.isPremium || false;

  const handleTopicCompletion = async (topicId: string) => {
      if (childDocRef && childData && !childData.completedTopics?.includes(topicId)) {
        await updateDoc(childDocRef, {
            completedTopics: arrayUnion(topicId)
        });
      }
  };

  const isTopicUnlocked = (index: number) => {
      if (index === 0) return true;
      const previousTopic = topics[index - 1];
      return childData?.completedTopics?.includes(previousTopic.id) ?? false;
  };

  if (authLoading || childLoading || isAuthenticated === null || !childData) {
    return (
      <div className="flex h-screen items-center justify-center bg-amber-50">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-amber-50 h-screen flex flex-col">
      <ChildHeader 
        childName={childData.firstName} 
        childId={childId}
      />
      <main className="flex-1 container py-8 px-4 md:px-8 overflow-y-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Merhaba, {childData.firstName}! 👋
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Hangi konuyu öğrenmek istersin?
          </p>
        </div>

        <div className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-700">
                <Sparkles className="text-green-500"/>
                Başlangıç Konuları
            </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {topics.map((topic, index) => {
              const unlocked = isTopicUnlocked(index);
              return (
                <TopicCard 
                    key={topic.id}
                    topic={topic}
                    isPremium={isPremium}
                    isLocked={!unlocked}
                    onComplete={() => handleTopicCompletion(topic.id)}
                    onClick={() => unlocked && router.push(`/cocuk-modu/${childId}/${topic.id}`)}
                />
              )
            })}
        </div>
      </main>
    </div>
  );
}
