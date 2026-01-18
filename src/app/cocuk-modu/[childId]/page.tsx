
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, ArrowLeft } from 'lucide-react';
import { TopicCard } from '@/components/child-mode/topic-card';
import topics from '@/data/topics.json';
import { Button } from '@/components/ui/button';

/**
 * Patika yol üzerindeki hassas koordinatlar [% Top, % Left]
 * Bu koordinatları haritanızdaki yolun kıvrımlarına göre buradan ince ayar yapabilirsiniz.
 */
const topicPositions = [
  [8.5, 48],   // 1. Konu
  [14.2, 62],  // 2. Konu
  [21.8, 55],  // 3. Konu
  [29.5, 42],  // 4. Konu
  [36.8, 35],  // 5. Konu
  [44.5, 48],  // 6. Konu
  [52.0, 65],  // 7. Konu
  [59.5, 58],  // 8. Konu
  [67.2, 40],  // 9. Konu
  [74.8, 32],  // 10. Konu
  [82.5, 45],  // 11. Konu
  [89.2, 62],  // 12. Konu
  [95.5, 50],  // 13. Konu
  [98.5, 35],  // 14. Konu
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
    <div className="h-screen w-full relative overflow-hidden bg-[#e8f5e9]">
      {/* Üst Sabit Panel */}
      <div className="fixed top-6 left-6 z-[100] flex gap-3 pointer-events-none">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full shadow-xl bg-white/95 hover:bg-white pointer-events-auto scale-110 border-2 border-primary/20"
          onClick={() => router.push('/ebeveyn-portali')}
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </Button>
        
        <div className="flex items-center gap-5 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-xl border-2 border-primary/20 pointer-events-auto transition-all hover:scale-105">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-sm">❤️</span>
            <span className="font-black text-xl text-slate-700">{userData.isPremium ? '∞' : (userData.lives ?? 5)}</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-sm">🏆</span>
            <span className="font-black text-xl text-slate-700">{childData.rozet || 0}</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary/60 leading-none uppercase tracking-tighter">Gezgin</span>
            <span className="font-black text-slate-800 text-sm leading-tight">{childData.firstName}</span>
          </div>
        </div>
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
