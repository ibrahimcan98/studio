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
import { Heart, Award, Crown, LogOut, Infinity as InfinityIcon, Sparkles } from "lucide-react";
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
  
  const isPremium = userData?.isPremium || false;
  const lives = userData?.lives ?? 5;
  const badges = childData?.rozet || 0;
  const stickers = 5; // Placeholder for stickers


  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#e8f5e9]">
       <aside className="w-72 h-screen bg-blue-400/80 backdrop-blur-sm text-white flex flex-col items-center p-6 shadow-2xl z-20 border-r-4 border-white/50 shrink-0">
        <div className="flex flex-col items-center text-center mt-4">
            <div className="relative w-48 h-48 mb-3">
            <Image src="/ch1.png" alt={childData.firstName} layout="fill" objectFit="contain" />
            </div>
            <h2 className="text-2xl font-bold">{childData.firstName}</h2>
            {isPremium && (
                <div className="flex items-center gap-1 mt-2 text-yellow-300">
                    <Crown className="w-5 h-5" />
                    <span className="font-semibold">Premium</span>
                </div>
            )}
        </div>

        <div className="w-full space-y-4 mt-8 text-lg">
            <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                    <span className="font-bold">Sticker</span>
                </div>
                <span className="font-bold text-3xl">{stickers}</span>
            </div>

            <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-amber-400" />
                    <span className="font-bold">Rozet</span>
                </div>
                <span className="font-bold text-3xl">{badges}</span>
            </div>

            <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                    <Heart className="w-8 h-8 text-red-400 fill-current" />
                    <span className="font-bold">Can</span>
                </div>
                <span className="font-bold text-3xl">
                    {isPremium ? <InfinityIcon className="w-8 h-8" /> : Math.max(0, lives)}
                </span>
            </div>
        </div>
      
        <div className="mt-auto w-full">
            <ExitDialog childId={childId}>
                <Button variant="outline" className="w-full bg-white/20 text-white hover:bg-white/30 hover:text-white border-white/30 h-14 text-lg">
                    <LogOut className="mr-2"/>
                    Çıkış Yap
                </Button>
            </ExitDialog>
        </div>
    </aside>
      
      {/* Harita Alanı */}
      <main className="flex-1 h-full w-full overflow-y-auto scroll-smooth scrollbar-hide pb-20">
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
