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
  [20, 22],   // 1. Konu
  [19.8, 70],  // 2. Konu
  [23.8, 68],  // 3. Konu
  [23.7, 25],  // 4. Konu
  [29.7, 25],  // 5. Konu
  [26.4, 75],  // 6. Konu
  [31.7, 72],  // 7. Konu
  [35, 12],  // 8. Konu
  [35.5, 70],  // 9. Konu
  [42, 78],  // 10. Konu
  [39.4, 30],  // 11. Konu
  [43, 52],  // 12. Konu
  [48, 82],  // 13. Konu
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
    <div className="relative h-screen w-full overflow-hidden bg-[#e8f5e9]">
        <div className="fixed top-4 left-4 z-30">
            {/* Character Image */}
            <div className="w-32 md:w-48 h-auto relative">
                <Image
                    src="/images/avatars/karakter1/ch1.png"
                    alt="Karakter"
                    width={192}
                    height={240}
                    className="object-contain drop-shadow-lg"
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
            /* 
               ÖNEMLİ: Görselin en-boy oranına göre bu yüksekliği ayarlayın.
               Eğer görsel genişliğinden 3 kat daha uzunsa '300vw' gibi bir değer kullanın.
            */
            width: '100%',
            height: '450vw', // Haritanızın uzunluğuna göre bu değeri değiştirebilirsiniz
            minHeight: '100vh'
          }}
        >
          {/* Top padding to avoid overlap with fixed header */}
          <div className="h-64" />

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
