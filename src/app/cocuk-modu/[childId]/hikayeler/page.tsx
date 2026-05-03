'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, BookOpen, Volume2 } from 'lucide-react';
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
    <div className="h-screen w-full overflow-hidden font-sans bg-gradient-to-b from-[#f3e8ff] via-[#e9d5ff] to-[#d8b4fe] relative">
      <main className="h-full w-full flex flex-col md:flex-row relative z-10">
        
        {/* SOL PANEL: Ortak Sidebar */}
        <ChildSidebar childId={childId} childData={childData} />

        {/* ORTA ALAN: Hikayeler İçeriği */}
        <div className="flex-1 relative order-3 md:order-2 overflow-y-auto flex items-center justify-center p-8">
          <div 
            className={cn(
              "bg-white/60 backdrop-blur-md rounded-[40px] p-12 text-center max-w-2xl border-4 border-white shadow-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group relative",
              isPlaying && "ring-4 ring-purple-300 ring-offset-4"
            )}
            onClick={() => speak("Hikaye Zamanı! Çok yakında burası birbirinden güzel, heyecanlı ve eğitici hikayelerle dolacak. Maceralara katılmak için beklemede kal!")}
          >
            <div className={cn(
              "bg-purple-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-purple-300 shadow-inner transition-transform",
              isPlaying && "animate-bounce"
            )}>
              <BookOpen className="w-16 h-16 text-purple-500" />
            </div>
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <Volume2 className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-black text-purple-800 mb-4 drop-shadow-sm">Hikaye Zamanı!</h1>
            <p className="text-xl text-purple-600 font-medium leading-relaxed">
              Çok yakında burası birbirinden güzel, heyecanlı ve eğitici hikayelerle dolacak. Maceralara katılmak için beklemede kal! ✨
            </p>
            {isPlaying && (
              <div className="flex justify-center gap-1 mt-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
