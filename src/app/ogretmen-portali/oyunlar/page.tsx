'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TopicCard } from '@/components/child-mode/topic-card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Sparkles, Gamepad2, Info, BookOpen, User, Loader2, Map } from 'lucide-react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CHEST_DATA } from '@/data/turkce-hazinem-data';
import { MOCK_TOPICS, STORY_DATA } from '@/data/teacher-game-content';

const Cloud = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <div
    className={cn("absolute opacity-60 animate-float-slow pointer-events-none z-0", className)}
    style={style}
  >
    <div className="w-32 h-10 bg-white rounded-full relative shadow-sm">
      <div className="absolute w-16 h-16 bg-white rounded-full -top-6 left-4" />
      <div className="absolute w-20 h-20 bg-white rounded-full -top-10 right-4" />
    </div>
  </div>
);

export default function OgretmenOyunlarPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<'adalar' | 'hikayeler' | 'turkce-hazinem'>('adalar');


  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
        const lastTopic = localStorage.getItem('last-demo-topic');
        if (lastTopic) {
            const element = document.getElementById(`topic-${lastTopic}`);
            if (element) {
                element.scrollIntoView({
                    behavior: 'instant',
                    block: 'center'
                });
            }
        }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleIslandClick = (topic: any) => {
    localStorage.setItem('last-demo-topic', topic.id);
    
    if (selectedCategory === 'hikayeler') {
      router.push(`/ogretmen-portali/oyunlar/hikayeler/${topic.id}`);
    } else if (selectedCategory === 'turkce-hazinem') {
      router.push(`/ogretmen-portali/oyunlar/turkce-hazinem/${topic.id}`);
    } else {
      router.push(`/ogretmen-portali/oyunlar/${topic.id}`);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="h-[calc(100vh-81px)] w-full overflow-hidden scrollbar-hide font-sans bg-gradient-to-b from-[#7dd3fc] via-[#bae6fd] to-[#e0f2fe] relative">
      
      {/* Sabit Arkaplan (Kaydırmadan Etkilenmez) */}
      <div className="absolute inset-0 z-0">
        <Cloud className="top-[15%] left-[10%] scale-50 md:scale-75" style={{ animationDelay: '0s' }} />
        <Cloud className="top-[5%] right-[20%] scale-75 md:scale-100 opacity-80" style={{ animationDelay: '2s' }} />
        <Cloud className="hidden md:block top-[40%] right-[8%] scale-50 opacity-50" style={{ animationDelay: '4s' }} />
        <Cloud className="bottom-[30%] left-[15%] scale-100 md:scale-125 opacity-40" style={{ animationDelay: '1s' }} />
        <Cloud className="bottom-[10%] right-[25%] scale-75 md:scale-90 opacity-60" style={{ animationDelay: '3s' }} />
      </div>

      <main className="h-full w-full flex flex-col md:flex-row relative z-10 overflow-hidden scrollbar-hide">
        
        {/* SOL PANEL: Demo Bilgi */}
        <aside className="w-16 md:w-64 shrink-0 bg-white/40 backdrop-blur-xl border-r border-white/60 flex flex-col items-center py-8 relative z-50 shadow-2xl transition-all duration-300 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/50 rounded-bl-full -z-10 blur-xl" />
            
            {/* Profil Görseli */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-sky-200/50 rounded-[2rem] blur-md animate-pulse" />
                <div className="w-12 h-12 md:w-28 md:h-28 bg-gradient-to-br from-white to-sky-50 rounded-[1.5rem] md:rounded-[2rem] shadow-xl flex items-center justify-center border-4 border-white relative z-10 overflow-hidden">
                    <Gamepad2 className="w-8 h-8 md:w-16 md:h-16 text-sky-500" />
                </div>
            </div>

            <div className="hidden md:flex flex-col items-center w-full px-4 text-center">
                <h2 className="text-xl font-black text-slate-800 drop-shadow-sm mb-1 uppercase">
                    Öğretmen Modu
                </h2>
                <div className="flex items-center gap-1.5 bg-sky-100/80 px-3 py-1 rounded-full border border-sky-200 mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-xs font-bold text-sky-700 tracking-wider">Tüm Kilitler Açık</span>
                </div>

                <div className="mt-4 p-4 bg-white/60 rounded-2xl border-2 border-white text-sm text-slate-600 font-medium">
                    <Info className="w-5 h-5 text-sky-500 mx-auto mb-2" />
                    Bu alan öğrencilerinize oyunları ve içerikleri göstermeniz içindir. İlerlemeler kaydedilmez.
                </div>

                <div className="w-full mt-6 space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" /> BÖLÜMLER
                  </label>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      className={cn("w-full justify-start border-2 border-white shadow-sm text-sky-700", selectedCategory === 'adalar' ? 'bg-sky-100' : 'bg-white/80 hover:bg-sky-50')} 
                      onClick={() => setSelectedCategory('adalar')}
                    >
                      🗺️ Macera Haritası
                    </Button>
                    <Button 
                      variant="outline" 
                      className={cn("w-full justify-start border-2 border-white shadow-sm text-purple-700", selectedCategory === 'hikayeler' ? 'bg-purple-100' : 'bg-white/80 hover:bg-purple-50')} 
                      onClick={() => setSelectedCategory('hikayeler')}
                    >
                      📚 Hikayeler
                    </Button>
                    <Button 
                      variant="outline" 
                      className={cn("w-full justify-start border-2 border-white shadow-sm text-amber-700", selectedCategory === 'turkce-hazinem' ? 'bg-amber-100' : 'bg-white/80 hover:bg-amber-50')} 
                      onClick={() => setSelectedCategory('turkce-hazinem')}
                    >
                      🏴‍☠️ Türkçe Hazinem
                    </Button>
                  </div>
                </div>
            </div>
        </aside>

        {/* ORTA ALAN: Kaydırılabilir İçerik */}
        <div className="flex-1 relative order-3 md:order-2 overflow-y-auto scrollbar-hide perspective-1000 flex flex-col items-center w-full p-4 md:p-8">
          
          {selectedCategory === 'adalar' && (
            <>
              {/* Başlık Bölümü */}
              <div className="w-full flex justify-center pt-8 md:pt-[100px] flex-shrink-0">
                <div className="relative md:absolute top-0 z-30 hover:scale-105 transition-transform duration-300 cursor-default select-none px-4">
                  <Image
                    src="/macera.png"
                    width={550}
                    height={687}
                    alt="Macera Haritası"
                    className="drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)] object-contain w-[280px] md:w-[550px]"
                    priority
                  />
                </div>
              </div>

              {/* Macera Haritası İçeriği (Adalar ve Köprüler) */}
              <div className="relative w-full min-h-[11100px] flex-shrink-0">
                {/* 3D CSS Platformları (Hepsi Açık) */}
                {MOCK_TOPICS.map((topic, index) => {
                  return (
                    <div
                      key={topic.id}
                      id={`topic-${topic.id}`}
                      className="absolute island-container animate-float"
                      style={{
                        top: topic.top,
                        '--desktop-left': topic.left,
                        '--mobile-left': topic.left === '65%' ? '55%' : '5%',
                        animationDelay: `${index * 0.7}s`,
                        zIndex: 20
                      } as any}
                    >
                      <TopicCard
                        topic={topic}
                        number={index + 1}
                        isLocked={false}
                        isPremiumLocked={false}
                        isCompleted={true}
                        onClick={() => handleIslandClick(topic)}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {selectedCategory === 'hikayeler' && (
            <div className="w-full max-w-5xl mx-auto pt-8">
              <h2 className="text-3xl font-black text-sky-800 mb-8 text-center uppercase tracking-wider bg-white/50 py-4 rounded-3xl border-4 border-white shadow-sm backdrop-blur-sm">📖 HİKAYELER</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STORY_DATA.map(story => (
                  <div 
                    key={story.id}
                    onClick={() => handleIslandClick({ id: story.id, name: `${story.name} (Hikaye)` })}
                    className="bg-white/95 rounded-[30px] p-4 border-[4px] border-purple-200/50 shadow-lg cursor-pointer hover:scale-105 transition-all overflow-hidden flex flex-col items-center group"
                  >
                    <div className="relative w-full aspect-[4/3] bg-purple-50 rounded-2xl overflow-hidden mb-4">
                      <Image src={story.cover} fill alt={story.name} className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-900 text-center mb-2">{story.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedCategory === 'turkce-hazinem' && (
            <div className="w-full max-w-5xl mx-auto pt-8">
              <h2 className="text-3xl font-black text-amber-800 mb-8 text-center uppercase tracking-wider bg-white/50 py-4 rounded-3xl border-4 border-white shadow-sm backdrop-blur-sm">🏴‍☠️ TÜRKÇE HAZİNEM</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {CHEST_DATA.map((chest, i) => (
                  <div 
                    key={chest.id}
                    onClick={() => handleIslandClick({ id: chest.id, name: `Sandık ${i + 1}` })}
                    className="bg-white/95 rounded-[30px] p-6 border-[4px] border-amber-200 shadow-lg cursor-pointer hover:scale-105 transition-all flex flex-col items-center group"
                  >
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                      <span className="text-5xl">🎁</span>
                    </div>
                    <h3 className="text-lg font-bold text-amber-900 text-center mb-1">Sandık {i + 1}</h3>
                    <p className="text-sm text-slate-500 mb-4">{chest.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .island-container {
          left: var(--desktop-left);
          transition: left 0.5s ease-in-out;
        }
        @media (max-width: 768px) {
          .island-container {
            left: var(--mobile-left) !important;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
