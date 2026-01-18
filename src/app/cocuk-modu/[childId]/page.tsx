'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { TopicCard } from '@/components/child-mode/topic-card';
import topics from '@/data/topics.json';
import { ChildSidebar } from '@/components/child-mode/child-sidebar';

// Define positions for each topic on the map background.
// Each inner array is [top%, left%]. Use null for right positioning.
// e.g., [10, 25] is 10% from top, 25% from left.
// e.g., [15, null, 25] is 15% from top, 25% from right.
const topicPositions = [
  [8, 45],
  [14, 70],
  [21, 40],
  [28, 60],
  [36, 30],
  [45, 55],
  [52, 75],
  [59, 50],
  [67, 25],
  [74, 50],
  [81, 75],
  [88, 50],
  [95, 30],
  [102, 60],
];


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

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  const isTopicUnlocked = (index: number) => {
      if (index === 0) return true; // First topic is always unlocked
      if (!childData?.completedTopics) return false;
      const previousTopic = topics[index - 1];
      // A topic is unlocked if the previous one is completed.
      return childData.completedTopics.includes(previousTopic.id);
  };
  
  const isTopicCompleted = (topicId: string) => {
    return childData?.completedTopics?.includes(topicId) ?? false;
  }

  if (authLoading || childLoading || userDataLoading || isAuthenticated === null || !childData || !userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-100">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <ChildSidebar childData={childData} userData={userData} childId={childId} />
      
      <main className="flex-1 overflow-y-auto bg-green-50">
        <div 
          className="relative w-full min-h-full bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.ibb.co/pnv1v1W/cocuk-modu-bg-final.png')",
            backgroundSize: 'contain',
            backgroundPosition: 'center top',
            // This height should be proportional to the image aspect ratio
            // to allow scrolling through the whole map.
            height: '250vh' 
          }}
        >
          {topics.map((topic, index) => {
            const position = topicPositions[index % topicPositions.length];
            const unlocked = isTopicUnlocked(index);
            const completed = isTopicCompleted(topic.id);

            return (
              <div
                key={topic.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  top: `${position[0]}%`,
                  left: `${position[1]}%`,
                }}
              >
                <TopicCard 
                    topic={topic}
                    isPremium={userData.isPremium}
                    isLocked={!unlocked}
                    isCompleted={completed}
                    onClick={() => unlocked && router.push(`/cocuk-modu/${childId}/${topic.id}`)}
                />
              </div>
            )
          })}
        </div>
      </main>
    </div>
  );
}
