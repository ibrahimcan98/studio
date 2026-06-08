'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, BookOpen, Volume2, Crown } from 'lucide-react';
import Image from 'next/image';
import { ChildSidebar } from '@/components/child-mode/sidebar';
import { LockedFeatureDialog } from '@/components/child-mode/locked-feature-dialog';
import { useTTS } from '@/hooks/use-tts';

import { cn } from '@/lib/utils';

export default function HikayelerPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser, loading: authLoading } = useUser();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLockedDialogOpen, setIsLockedDialogOpen] = useState(false);
  const { speak, stop, isPlaying } = useTTS();

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

  // Ebeveyn verilerini al (abonelik kontrolü için)
  const userDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid) return null;
    return doc(db, 'users', authUser.uid);
  }, [db, authUser?.uid]);
  const { data: userData } = useDoc(userDocRef);
  const isChildAssigned = userData?.subscriptionChildIds?.includes(childId as string);
  const subscriptionTier = (userData?.subscriptionTier !== 'free' && isChildAssigned) 
      ? (userData?.subscriptionTier as string) 
      : 'free';

  useEffect(() => {
    if (childData) {
      const savedScroll = sessionStorage.getItem('hikayelerScrollPos');
      if (savedScroll) {
        const container = document.getElementById('hikayeler-scroll-container');
        if (container) {
          requestAnimationFrame(() => {
            container.scrollTop = parseInt(savedScroll, 10);
          });
        }
      }
    }
  }, [childData]);

  if (!isMounted || isAuthenticated === null || childLoading || !childData) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-100">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Hikayeler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleStoryClick = (path: string, index: number) => {
    if (subscriptionTier === 'free' && index >= 1) {
      setIsLockedDialogOpen(true);
      return;
    }
    const container = document.getElementById('hikayeler-scroll-container');
    if (container) {
      sessionStorage.setItem('hikayelerScrollPos', container.scrollTop.toString());
    }
    router.push(path);
  };

  return (
    <div className="h-screen w-full overflow-hidden font-sans relative">
      <LockedFeatureDialog
        isOpen={isLockedDialogOpen}
        onClose={() => setIsLockedDialogOpen(false)}
      />
      {/* Arkaplan Görseli ve Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hikayeler/hikayeler-arkaplan.png" 
          fill 
          className="object-cover" 
          alt="Library Background" 
          priority
        />
        {/* Görselin üzerine hafif bir derinlik katmanı */}
        <div className="absolute inset-0 bg-indigo-950/30 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-indigo-950/60" />
      </div>

      <main className="h-full w-full flex flex-col md:flex-row relative z-10">
        
        {/* SOL PANEL: Ortak Sidebar */}
        <ChildSidebar childId={childId} childData={childData} />

        {/* ORTA ALAN: Hikayeler İçeriği */}
        <div id="hikayeler-scroll-container" className="flex-1 relative order-3 md:order-2 overflow-y-auto p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-5xl mx-auto">
            <header className="mb-6 md:mb-10 text-center bg-indigo-900/20 backdrop-blur-xl p-4 md:p-6 rounded-[30px] md:rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.2)] mx-2 md:mx-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 mb-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] italic tracking-tighter uppercase break-words">
                Gizemli Kütüphane
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-indigo-100 font-medium italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Büyülü bir hikayenin kapılarını aralamaya hazır mısın? 🪄✨
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto pb-20">
              {/* Hikaye Kartı: Sarı Top */}
              <div 
                onClick={() => handleStoryClick(`/cocuk-modu/${childId}/hikayeler/sari-top`, 0)}
                onMouseEnter={() => speak('/hikayeler/1-sari-top/kapak.m4a')}
                onMouseLeave={() => stop()}
                className="group relative bg-white/95 rounded-[45px] p-4 border-[6px] border-amber-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.4)] cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] active:scale-95 overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] bg-amber-50/50 rounded-[32px] overflow-hidden">
                   <Image 
                     src="/hikayeler/1-sari-top/kapak.png" 
                     fill 
                     className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                     alt="Sarı Top Kapak" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent" />
                </div>
                
                <div className="p-4 flex flex-col items-center">
                   <h3 className="text-2xl font-black text-amber-900 mb-4 uppercase italic tracking-tight">Kayıp Sarı Top</h3>
                   <span className="w-full text-center bg-gradient-to-r from-amber-600 to-orange-700 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg transform group-hover:translate-y-[-4px] transition-all border-b-4 border-amber-800">
                      MACERAYA BAŞLA
                   </span>
                </div>


              </div>

              {/* Hikaye Kartı: Bir İki Üç Başardım */}
              {(() => {
                const isLocked = subscriptionTier === 'free';
                return (
                  <div 
                    onClick={() => handleStoryClick(`/cocuk-modu/${childId}/hikayeler/bir-iki-uc-basardim`, 1)}
                    onMouseEnter={() => !isLocked && speak('/hikayeler/2-bir-iki-uc-basardim/kapak.m4a')}
                    onMouseLeave={() => !isLocked && stop()}
                    className={cn(
                      "group relative bg-white/95 rounded-[45px] p-4 border-[6px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all overflow-hidden flex flex-col",
                      isLocked ? "border-slate-200 cursor-not-allowed opacity-80" : "border-blue-200/50 cursor-pointer hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] active:scale-95"
                    )}
                  >
                    <div className="relative w-full aspect-[4/3] bg-blue-50/50 rounded-[32px] overflow-hidden">
                       <Image 
                         src="/hikayeler/2-bir-iki-uc-basardim/kapak.png" 
                         fill 
                         className={cn("object-contain p-4 transition-transform duration-700", !isLocked && "group-hover:scale-110")} 
                         alt="Bir İki Üç Başardım Kapak" 
                       />
                       {isLocked && (
                         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                            <Crown className="w-12 h-12 text-amber-400 mb-3 animate-bounce" />
                            <p className="text-white font-black text-sm uppercase italic">Premium Üyelik Gerekli</p>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
                    </div>
                    
                    <div className="p-4 flex flex-col items-center">
                       <h3 className={cn("text-2xl font-black mb-4 uppercase italic tracking-tight", isLocked ? "text-slate-400" : "text-blue-900")}>1-2-3 Başardım!</h3>
                       <span className={cn(
                         "w-full text-center py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg transform transition-all border-b-4",
                         isLocked ? "bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-800 group-hover:translate-y-[-4px]"
                       )}>
                          {isLocked ? "KİLİTLİ" : "MACERAYA BAŞLA"}
                       </span>
                    </div>


                  </div>
                );
              })()}

              {/* Hikaye Kartı: Kaptan Kahvaltısı */}
              {(() => {
                const isLocked = subscriptionTier === 'free';
                return (
                  <div 
                    onClick={() => handleStoryClick(`/cocuk-modu/${childId}/hikayeler/kaptan-kahvaltisi`, 2)}
                    onMouseEnter={() => !isLocked && speak('/hikayeler/3-kaptan-kahvaltisi/kapak.m4a')}
                    onMouseLeave={() => !isLocked && stop()}
                    className={cn(
                      "group relative bg-white/95 rounded-[45px] p-4 border-[6px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all overflow-hidden flex flex-col",
                      isLocked ? "border-slate-200 cursor-not-allowed opacity-80" : "border-emerald-200/50 cursor-pointer hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-95"
                    )}
                  >
                    <div className="relative w-full aspect-[4/3] bg-emerald-50/50 rounded-[32px] overflow-hidden">
                       <Image 
                         src="/hikayeler/3-kaptan-kahvaltisi/kapak.png" 
                         fill 
                         className={cn("object-contain p-4 transition-transform duration-700", !isLocked && "group-hover:scale-110")} 
                         alt="Kaptan Kahvaltısı Kapak" 
                       />
                       {isLocked && (
                         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                            <Crown className="w-12 h-12 text-amber-400 mb-3 animate-bounce" />
                            <p className="text-white font-black text-sm uppercase italic">Premium Üyelik Gerekli</p>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent" />
                    </div>
                    
                    <div className="p-4 flex flex-col items-center">
                       <h3 className={cn("text-2xl font-black mb-4 uppercase italic tracking-tight", isLocked ? "text-slate-400" : "text-emerald-900")}>Kaptan Kahvaltısı</h3>
                       <span className={cn(
                         "w-full text-center py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg transform transition-all border-b-4",
                         isLocked ? "bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-800 group-hover:translate-y-[-4px]"
                       )}>
                          {isLocked ? "KİLİTLİ" : "MACERAYA BAŞLA"}
                       </span>
                    </div>


                  </div>
                );
              })()}

              {/* Hikaye Kartı: Gökkuşağı Partisi */}
              {(() => {
                const isLocked = subscriptionTier === 'free';
                return (
                  <div 
                    onClick={() => handleStoryClick(`/cocuk-modu/${childId}/hikayeler/gokusagi-partisi`, 3)}
                    onMouseEnter={() => !isLocked && speak('/hikayeler/4-gokusagi-partisi/kapak.m4a')}
                    onMouseLeave={() => !isLocked && stop()}
                    className={cn(
                      "group relative bg-white/95 rounded-[45px] p-4 border-[6px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all overflow-hidden flex flex-col",
                      isLocked ? "border-slate-200 cursor-not-allowed opacity-80" : "border-purple-200/50 cursor-pointer hover:scale-105 hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] active:scale-95"
                    )}
                  >
                    <div className="relative w-full aspect-[4/3] bg-purple-50/50 rounded-[32px] overflow-hidden">
                       <Image 
                         src="/hikayeler/4-gokusagi-partisi/kapak.png" 
                         fill 
                         className={cn("object-contain p-4 transition-transform duration-700", !isLocked && "group-hover:scale-110")} 
                         alt="Gökkuşağı Partisi Kapak" 
                       />
                       {isLocked && (
                         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                            <Crown className="w-12 h-12 text-amber-400 mb-3 animate-bounce" />
                            <p className="text-white font-black text-sm uppercase italic">Premium Üyelik Gerekli</p>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />
                    </div>
                    
                    <div className="p-4 flex flex-col items-center">
                       <h3 className={cn("text-2xl font-black mb-4 uppercase italic tracking-tight", isLocked ? "text-slate-400" : "text-purple-900")}>Gökkuşağı Partisi</h3>
                       <span className={cn(
                         "w-full text-center py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg transform transition-all border-b-4",
                         isLocked ? "bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white border-purple-800 group-hover:translate-y-[-4px]"
                       )}>
                          {isLocked ? "KİLİTLİ" : "MACERAYA BAŞLA"}
                       </span>
                    </div>


                  </div>
                );
              })()}

              {/* Yakında Gelecek Kartı */}
              <div className="md:col-span-2 flex justify-center">
                <div className="bg-white/5 backdrop-blur-md rounded-[40px] px-12 py-8 border-4 border-white/10 border-dashed flex flex-col items-center justify-center opacity-80 group hover:bg-white/10 transition-all cursor-default">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white/50" />
                  </div>
                  <h3 className="text-xl font-black text-white/50 italic uppercase tracking-widest">Kilitli Bölümler</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
