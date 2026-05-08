'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, BookOpen, Volume2 } from 'lucide-react';
import Image from 'next/image';
import { ChildSidebar } from '@/components/child-mode/sidebar';
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
  const { speak, isPlaying } = useTTS();

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

  return (
    <div className="h-screen w-full overflow-hidden font-sans relative">
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
        <div className="flex-1 relative order-3 md:order-2 overflow-y-auto p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-5xl mx-auto">
            <header className="mb-10 text-center bg-indigo-900/20 backdrop-blur-xl p-6 rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.2)]">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 mb-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] italic tracking-tighter uppercase">
                Gizemli Kütüphane
              </h1>
              <p className="text-lg text-indigo-100 font-medium italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Büyülü bir hikayenin kapılarını aralamaya hazır mısın? 🪄✨
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto pb-20">
              {/* Hikaye Kartı: Sarı Top */}
              <div 
                onClick={() => router.push(`/cocuk-modu/${childId}/hikayeler/sari-top`)}
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
                   <h3 className="text-2xl font-black text-amber-900 mb-4 uppercase italic tracking-tight">Sarı Top</h3>
                   <span className="w-full text-center bg-gradient-to-r from-amber-600 to-orange-700 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg transform group-hover:translate-y-[-4px] transition-all border-b-4 border-amber-800">
                      MACERAYA BAŞLA
                   </span>
                </div>

                {/* Dekoratif Yıldızlar */}
                <div className="absolute top-6 right-6 text-amber-400 animate-pulse drop-shadow-md z-10 text-2xl">⭐</div>
              </div>

              {/* Hikaye Kartı: Bir İki Üç Başardım */}
              <div 
                onClick={() => router.push(`/cocuk-modu/${childId}/hikayeler/bir-iki-uc-basardim`)}
                className="group relative bg-white/95 rounded-[45px] p-4 border-[6px] border-blue-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.4)] cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] active:scale-95 overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] bg-blue-50/50 rounded-[32px] overflow-hidden">
                   <Image 
                     src="/hikayeler/2-bir-iki-uc-basardim/kapak.png" 
                     fill 
                     className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                     alt="Bir İki Üç Başardım Kapak" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
                </div>
                
                <div className="p-4 flex flex-col items-center">
                   <h3 className="text-2xl font-black text-blue-900 mb-4 uppercase italic tracking-tight">1-2-3 Başardım!</h3>
                   <span className="w-full text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg transform group-hover:translate-y-[-4px] transition-all border-b-4 border-blue-800">
                      MACERAYA BAŞLA
                   </span>
                </div>

                {/* Dekoratif Yıldızlar */}
                <div className="absolute top-6 right-6 text-blue-400 animate-pulse drop-shadow-md z-10 text-2xl">✨</div>
              </div>

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
