'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Loader2, LogOut } from 'lucide-react';
import { TopicCard } from '@/components/child-mode/topic-card';
import topics from '@/data/topics.json';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ExitDialog } from "@/components/child-mode/exit-dialog";
import { cn } from '@/lib/utils';

const topicPositions = [
  [20, 22], [19.8, 70], [23.8, 68], [23.7, 25], [29.7, 25], 
  [26.4, 75], [31.7, 72], [35, 12], [35.5, 70], [42, 78], 
  [39.4, 30], [43, 52], [48, 82]
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
    if (!pin) router.push('/ebeveyn-portali');
    else setIsAuthenticated(true);
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

  // Award new item logic
  useEffect(() => {
    if (!db || !childDocRef || !childData || !childData.completedTopics) return;
  
    // Count only completed topics (which don't have a hyphen in their ID)
    const completedTopicsCount = childData.completedTopics.filter((id: string) => !id.includes('-')).length;
    
    // Check if an item should be awarded (every 3 topics) and if it's a valid item (1-7)
    if (completedTopicsCount > 0 && completedTopicsCount % 3 === 0) {
      const itemIndexToAward = Math.floor(completedTopicsCount / 3);
      if (itemIndexToAward > 0 && itemIndexToAward <= 7) {
        const equippedItems = childData.equippedItems || [];
        const alreadyAwarded = equippedItems.includes(itemIndexToAward);
  
        if (!alreadyAwarded) {
          const awardNewItem = async () => {
            try {
              await updateDoc(childDocRef, {
                equippedItems: arrayUnion(itemIndexToAward)
              });
            } catch (e) {
              console.error("Error awarding item:", e);
            }
          };
          awardNewItem();
        }
      }
    }
  }, [db, childDocRef, childData?.completedTopics, childData?.equippedItems]);

  const isTopicUnlocked = (index: number) => {
      if (index === 0) return true; 
      if (!childData?.completedTopics) return false;
      const previousTopic = topics[index - 1];
      return childData.completedTopics.includes(previousTopic.id);
  };
  
  const isTopicCompleted = (topicId: string) => childData?.completedTopics?.includes(topicId) ?? false;
  
  const completedTopicsCount = useMemo(() => {
      if (!childData?.completedTopics) return 0;
      return childData.completedTopics.filter((id: string) => !id.includes('-')).length;
  }, [childData?.completedTopics]);


  if (!isMounted || authLoading || childLoading || userDataLoading || isAuthenticated === null || !childData || !userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-100">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="h-screen w-full overflow-hidden font-sans">
      <main className="h-screen w-full overflow-y-auto scrollbar-hide bg-[#e8f5e9]">
        <div
          className="relative w-full mx-auto"
          style={{
            backgroundImage: "url('/map-path-background.png')",
            backgroundSize: "100% auto",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "450vw",
            minHeight: "100vh",
          }}
        >
          {/* ÜST PANEL: Harita ile birlikte kayar (absolute) */}
          <div className="absolute top-10 inset-x-0 z-30 flex justify-between px-12 pointer-events-none">
            
            {/* SOL: Gelişen Avatar Bölümü */}
            <div className="flex flex-col items-center pointer-events-auto">
              <div className="relative w-[28vw] max-w-[320px] aspect-[1/1.2] group">
                
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75" />

                <Image
                  src="/images/avatars/karakter1/ch1.png"
                  width={480}
                  height={600}
                  alt="Ana Karakter"
                  className="relative z-10 object-contain drop-shadow-xl"
                  priority
                />

                {(childData.equippedItems || []).map((itemId: number) => (
                  <Image
                    key={itemId}
                    src={`/images/avatars/karakter1/${itemId}.png`}
                    fill
                    alt={`Aksesuar ${itemId}`}
                    className="absolute inset-0 z-20 object-contain animate-in fade-in zoom-in duration-500"
                  />
                ))}

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border-2 border-emerald-400 px-6 py-1 rounded-full shadow-lg z-30">
                  <p className="text-emerald-700 font-black text-lg whitespace-nowrap">
                    {childData.firstName || "Küçük Gezgin"}
                  </p>
                </div>
              </div>
            </div>

            {/* SAĞ: Ödül ve Garderop Çerçeveleri */}
            <div className="flex flex-col gap-6 pointer-events-auto">
              {/* Rozet Çerçevesi */}
              <div className="w-[20vw] max-w-[170px] aspect-square relative transform hover:scale-105 transition-transform drop-shadow-xl">
                <Image src="/images/avatars/cerceve.png" fill alt="Rozetler" className="object-contain" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-2 pt-4 text-center">
                    <span className="text-[11px] font-bold text-amber-800 absolute top-2.5">ROZETLER</span>
                    <div className="grid grid-cols-3 gap-1.5 p-2 w-full mt-2">
                        {(childData.badges || []).slice(0, 9).map((badgeId: string) => {
                        const topic = topics.find(t => t.id === badgeId);
                        return topic ? <span key={badgeId} title={topic.name} className="text-2xl flex items-center justify-center">{topic.icon}</span> : null;
                        })}
                    </div>
                    {(childData.badges?.length || 0) > 9 && <span className="text-xs mt-1">...</span>}
                </div>
              </div>

              {/* Eşya (Garderop) Çerçevesi */}
              <div className="w-[20vw] max-w-[170px] aspect-square relative transform hover:scale-105 transition-transform drop-shadow-xl">
                <Image src="/images/avatars/cerceve.png" fill alt="Garderop" className="object-contain" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-2 pt-4 text-center">
                     <span className="text-[11px] font-bold text-blue-800 uppercase absolute top-2.5">Garderop</span>
                     <div className="grid grid-cols-4 gap-1 p-2 w-full mt-2">
                        {Array.from({ length: 7 }, (_, i) => i + 1).map(itemId => {
                            const isUnlocked = childData.equippedItems?.includes(itemId);
                            return (
                                <div key={itemId} className={cn("aspect-square rounded-full flex items-center justify-center", isUnlocked ? 'bg-blue-100/50' : 'bg-gray-200/80')}>
                                    <Image 
                                        src={`/images/avatars/karakter1/${itemId}.png`} 
                                        width={24} 
                                        height={24} 
                                        alt={`Eşya ${itemId}`}
                                        className={cn(!isUnlocked && 'opacity-30 mix-blend-luminosity')}
                                    />
                                </div>
                            )
                        })}
                    </div>
                 </div>
                {/* Yeni eşya kazanınca çıkan bildirim noktası */}
                {completedTopicsCount > 0 && completedTopicsCount % 3 === 0 && (
                  <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
                )}
              </div>
            </div>
          </div>
          
          {topics.map((topic, index) => {
            const position = topicPositions[index] || [0, 0]
            const unlocked = isTopicUnlocked(index)
            const completed = isTopicCompleted(topic.id)

            return (
              <div
                key={topic.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95"
                style={{
                  top: `${position[0]}%`,
                  left: `${position[1]}%`,
                  zIndex: 20 + index,
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
      <div className="fixed bottom-6 right-6 z-40">
        <ExitDialog childId={childId}>
          <Button variant="outline" className="rounded-full bg-white/60 backdrop-blur-md hover:bg-white/90 border-white/50 h-12 px-6 shadow-xl font-bold text-slate-700">
            <LogOut className="mr-2 w-4 h-4" /> Çıkış Yap
          </Button>
        </ExitDialog>
      </div>
    </div>
  );
}
