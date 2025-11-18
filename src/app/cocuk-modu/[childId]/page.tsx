'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Sparkles, Heart, Award } from 'lucide-react';
import { ChildHeader } from '@/components/child-mode/child-header';
import { TopicCard } from '@/components/child-mode/topic-card';

const topics = [
  { name: 'Hayvanlar', icon: '🦁', words: 10, unlocked: true },
  { name: 'Renkler', icon: '🎨', words: 7, unlocked: true },
  { name: 'Aile Üyeleri', icon: '❤️', words: 10, unlocked: true },
  { name: 'Vücudumuz 1', icon: '👤', words: 11, unlocked: false },
  { name: 'Vücudumuz 2', icon: '💪', words: 8, unlocked: false },
  { name: 'Meyveler', icon: '🍎', words: 8, unlocked: false },
  { name: 'Sebzeler', icon: '🥕', words: 6, unlocked: false },
  { name: 'Şekiller', icon: '🔷', words: 4, unlocked: false },
  { name: 'Duygular', icon: '😊', words: 5, unlocked: false },
  { name: 'Doğa', icon: '🌳', words: 8, unlocked: false },
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

  const { data: userData } = useDoc(userDocRef);
  const isPremium = userData?.isPremium || false;

  if (authLoading || childLoading || isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  
  if (!childData) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-amber-50">
            <p>Çocuk bilgileri bulunamadı.</p>
        </div>
    );
  }


  return (
    <div className="bg-amber-50 min-h-screen">
      <ChildHeader 
        childName={childData.firstName} 
        lives={isPremium ? 'unlimited' : 3}
        badges={childData.rozet || 0}
        isPremium={isPremium}
        childId={childId}
      />
      <main className="container py-8 px-4 md:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Merhaba, {childData.firstName}! 👋
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Hangi konuyu öğrenmek istersin?
          </p>
        </div>

        <div className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-700">
                <Sparkles className="text-green-500"/>
                Kolay Konular
            </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topics.map((topic) => (
                <TopicCard 
                    key={topic.name}
                    topic={topic}
                    isPremium={isPremium}
                />
            ))}
        </div>
      </main>
    </div>
  );
}
