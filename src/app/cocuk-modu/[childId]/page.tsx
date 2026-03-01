
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Loader2, LogOut, Award, Star, Heart, Lock, Infinity as InfinityIcon } from 'lucide-react';
import { TopicCard } from '@/components/child-mode/topic-card';
import topics from '@/data/topics.json';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ExitDialog } from "@/components/child-mode/exit-dialog";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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

  // Filter completed topics (exclude sub-games with hyphens)
  const completedTopicsCount = useMemo(() => {
      if (!childData?.completedTopics) return 0;
      return childData.completedTopics.filter((id: string) => !id.includes('-')).length;
  }, [childData?.completedTopics]);

  // Award new item logic
  useEffect(() => {
    if (!db || !childDocRef || !childData) return;
  
    // Award an item every 3 topics
    if (completedTopicsCount > 0 && completedTopicsCount % 3 === 0) {
      const itemToAward = Math.floor(completedTopicsCount / 3);
      if (itemToAward >= 1 && itemToAward <= 7) {
        const equippedItems = childData.equippedItems || [];
        if (!equippedItems.includes(itemToAward)) {
          const awardNewItem = async () => {
            try {
              await updateDoc(childDocRef, {
                equippedItems: arrayUnion(itemToAward)
              });
            } catch (e) {
              console.error("Error awarding item:", e);
            }
          };
          awardNewItem();
        }
      }
    }
  }, [db, childDocRef, completedTopicsCount, childData]);

  const isTopicUnlocked = (index: number) => {
      if (index === 0) return true; 
      if (!childData?.completedTopics) return false;
      const previousTopic = topics[index - 1];
      return childData.completedTopics.includes(previousTopic.id);
  };
  
  const isTopicCompleted = (topicId: string) => childData?.completedTopics?.includes(topicId) ?? false;

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
          {/* ÜST PANEL KONTEYNERI */}
          <div className="absolute top-10 inset-x-0 z-30 flex justify-between px-16 pointer-events-none">
            
            {/* SOL: GEZGİN PROFİL KARTI */}
            <div className="flex flex-col pointer-events-auto">
              <div className="relative w-[30vw] max-w-[340px] bg-white/90 backdrop-blur-xl rounded-[45px] border-[6px] border-white shadow-2xl overflow-hidden">
                
                {/* Kart Başlığı (Level Alanı) */}
                <div className="h-24 bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center pb-6">
                  <div className="bg-white/30 backdrop-blur-md px-5 py-1 rounded-full border border-white/50">
                    <span className="text-white font-black text-lg uppercase">
                      SEVİYE {Math.floor(completedTopicsCount / 3) + 1}
                    </span>
                  </div>
                </div>

                {/* Karakter Avatarı (Tam Orta) */}
                <div className="relative -mt-10 flex flex-col items-center">
                  <div className="relative w-44 h-44 bg-sky-50 rounded-full border-[8px] border-white shadow-lg overflow-hidden">
                    {/* Ana Karakter (ch1) */}
                    <Image 
                      src="/images/avatars/karakter1/ch1.png" 
                      fill 
                      className="object-contain scale-125 translate-y-4" 
                      alt="Profil" 
                      priority
                    />
                    {/* Giydiği İtemler */}
                    {(childData.equippedItems || []).map((id: number) => (
                      <Image 
                        key={id} 
                        src={`/images/avatars/karakter1/${id}.png`} 
                        fill 
                        className="object-contain scale-125 translate-y-4 z-20" 
                        alt="Item" 
                      />
                    ))}
                  </div>

                  {/* İsim ve İstatistik */}
                  <div className="p-6 text-center w-full">
                    <h2 className="text-2xl font-black text-slate-800 uppercase leading-none mb-1">
                      {childData.firstName || childData.ad}
                    </h2>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">Usta Gezgin</p>
                    
                    <div className="flex justify-center gap-3 border-t pt-4 border-slate-100">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Bölümler</p>
                        <p className="text-xl font-black text-slate-700">{completedTopicsCount}</p>
                      </div>
                      <div className="w-[1px] bg-slate-100" />
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Hediyeler</p>
                        <p className="text-xl font-black text-slate-700">{(childData.equippedItems || []).length}/7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ: ROZETLER VE GARDIROP */}
            <div className="flex flex-col gap-6 pointer-events-auto w-[350px]">
              
              {/* ROZETLER (Bölüm Rozetleri) */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-[35px] border-4 border-orange-100 shadow-xl">
                <h3 className="text-center font-black text-orange-400 text-sm mb-4 tracking-widest uppercase">Rozet Koleksiyonu</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {(childData.badges || []).map((badgeId: string, index: number) => {
                    const topic = topics.find(t => t.id === badgeId);
                    if (!topic) return null;
                    return (
                        <div key={index} className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-3xl relative hover:scale-110 transition-transform cursor-help" title={topic.name}>
                          {topic.icon}
                        </div>
                    );
                  })}
                  {(childData.badges || []).length === 0 && (
                    <p className="text-[10px] text-slate-400 font-bold text-center w-full uppercase">Henüz rozet kazanılmadı</p>
                  )}
                </div>
              </div>

              {/* GARDIROP (Level Mantığı ile Kilit Açma) */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-[35px] border-4 border-sky-100 shadow-xl">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-black text-sky-400 text-sm tracking-widest uppercase">GARDIROP</h3>
                  <span className="text-[10px] font-bold text-sky-300">Level {Math.floor(completedTopicsCount / 3) + 1}</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((id) => {
                    const isUnlocked = completedTopicsCount >= (id * 3);
                    return (
                      <div 
                        key={id} 
                        className={`relative aspect-square rounded-2xl flex items-center justify-center p-2 transition-all border-2 
                          ${isUnlocked ? 'bg-sky-50 border-sky-200' : 'bg-slate-50 border-slate-100 grayscale opacity-40'}`}
                      >
                        <Image src={`/images/avatars/karakter1/${id}.png`} width={45} height={45} className="object-contain" alt="item" />
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[9px] font-black text-slate-400 mt-7">Lvl {id + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
