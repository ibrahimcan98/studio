'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { TopicCard } from '@/components/child-mode/topic-card';
import topics from '@/data/topics.json';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ExitDialog } from "@/components/child-mode/exit-dialog";


/**
 * Patika yol üzerindeki hassas koordinatlar [% Top, % Left]
 * Bu koordinatları haritanızdaki yolun kıvrımlarına göre buradan ince ayar yapabilirsiniz.
 */
const topicPositions = [
  [8, 25],
  [13, 50],
  [19, 75],
  [28, 65],
  [35, 45],
  [42, 25],
  [50, 50],
  [58, 75],
  [67, 60],
  [75, 40],
  [83, 20],
  [90, 50],
  [95, 78],
];

export default function CocukModuPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser, loading: authLoading } = useUser();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMounted(true);
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
      if (index === 0) return true; 
      if (!childData?.completedTopics) return false;
      const previousTopic = topics[index - 1];
      return childData.completedTopics.includes(previousTopic.id);
  };
  
  const isTopicCompleted = (topicId: string) => {
    return childData?.completedTopics?.includes(topicId) ?? false;
  }

  if (!isMounted || authLoading || childLoading || userDataLoading || isAuthenticated === null || !childData || !userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-100">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="h-screen w-full overflow-hidden bg-[#e8f5e9]">
        <div className="fixed top-4 left-4 z-30 flex items-center gap-4">
            <Image 
                src="/images/avatars/karakter1/ch1.png"
                width={200}
                height={200}
                alt="Karakter"
                className="w-48 h-auto"
            />
            <div className="flex flex-col gap-2">
                 <Image 
                    src="/images/cerceve.png"
                    width={120}
                    height={120}
                    alt="Çerçeve 1"
                    className="w-28 h-auto"
                />
                 <Image 
                    src="/images/cerceve.png"
                    width={120}
                    height={120}
                    alt="Çerçeve 2"
                    className="w-28 h-auto"
                />
            </div>
        </div>

        <div className="fixed top-4 right-4 z-30">
            <ExitDialog childId={childId}>
                <Button variant="outline" className="bg-white/50 hover:bg-white/80 border-white/30 h-14 text-lg shadow-lg">
                    <LogOut className="mr-2"/>
                    Çıkış Yap
                </Button>
            </ExitDialog>
        </div>
      
      {/* Harita Alanı */}
      <main className="h-full w-full overflow-y-auto scroll-smooth scrollbar-hide pb-20">
        <div 
          className="relative w-full mx-auto"
          style={{
            backgroundImage: "url('/map-path-background.png')",
            backgroundSize: '100% auto',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            width: '100%',
            height: '450vw',
            minHeight: '100vh',
            paddingTop: '250px'
          }}
        >
          {topics.map((topic, index) => {
            const position = topicPositions[index] || [0, 0];
            const unlocked = isTopicUnlocked(index);
            const completed = isTopicCompleted(topic.id);

            return (
              <div
                key={topic.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95"
                style={{
                  top: `${position[0]}%`,
                  left: `${position[1]}%`,
                  zIndex: 20 + index
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
