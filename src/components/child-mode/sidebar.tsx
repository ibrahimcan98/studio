'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Star, Map, BookOpen, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ChildSidebarProps {
  childId: string;
  childData: any;
}

export function ChildSidebar({ childId, childData }: ChildSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const level = useMemo(() => {
    if (!childData?.completedTopics) return 1;
    return Math.floor(childData.completedTopics.length / 5) + 1;
  }, [childData?.completedTopics]);

  return (
    <div className="w-full md:w-[260px] lg:w-[280px] p-3 lg:p-4 flex flex-row md:flex-col gap-3 flex-shrink-0 z-20 md:h-full bg-transparent overflow-hidden">
      {/* Avatar ve Seviye */}
      <div className="flex-1 md:flex-none bg-[#8D6E63] p-1 rounded-[30px] md:rounded-[36px] shadow-2xl border-b-[4px] md:border-b-[6px] border-[#5D4037]">
        <div className="bg-[#FFF9C4] rounded-[24px] md:rounded-[32px] p-3 lg:p-4 flex flex-row md:flex-col items-center gap-4 md:gap-2 border-[3px] md:border-[4px] border-[#FBC02D]">
          <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-sky-100 rounded-full border-[3px] md:border-[4px] border-white shadow-inner overflow-hidden flex-shrink-0">
            <Image
              src="/images/child-mode/avatar_fox.png"
              fill
              className="object-contain scale-110"
              alt="Avatar"
            />
          </div>
          <div className="flex-1 md:w-full text-left md:text-center overflow-hidden">
            <h2 className="text-sm md:text-xl font-black text-[#5D4037] uppercase tracking-tight truncate">
              {childData.firstName || 'Gezgin'}
            </h2>

            <div className="w-full mt-1 lg:mt-3 space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[8px] lg:text-[10px] font-black text-[#8D6E63] uppercase">Seviye {level}</span>
                <span className="text-[8px] lg:text-[10px] font-black text-[#FBC02D]">{(childData.completedTopics?.length || 0) % 5}/5</span>
              </div>
              <div className="w-full h-2 lg:h-3 bg-[#E0E0E0] rounded-full overflow-hidden border border-white shadow-sm">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                  style={{ width: `${((childData.completedTopics?.length || 0) % 5) * 20}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rozetlerin */}
      <div className="hidden lg:block bg-white/40 backdrop-blur-md rounded-[24px] p-3 border-2 border-white/60">
        <h3 className="text-center font-black text-blue-500 text-[10px] uppercase tracking-widest mb-2 italic">Rozetlerin</h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-square bg-white/60 rounded-xl flex items-center justify-center grayscale opacity-20 border border-white/50">
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Etiketlerin (Stickers) */}
      <div className="hidden lg:block bg-white/40 backdrop-blur-md rounded-[24px] p-3 border-2 border-white/60">
        <h3 className="text-center font-black text-purple-500 text-[10px] uppercase tracking-widest mb-2 italic">Etiketlerin</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(childData?.stickers || {}).length > 0 ? (
            Object.values(childData.stickers).slice(0, 6).map((stickerUrl: any, i) => (
              <div key={i} className="aspect-square bg-white/80 rounded-xl flex items-center justify-center border-2 border-purple-200 shadow-[0_4px_10px_rgba(0,0,0,0.1)] p-1 hover:scale-110 hover:rotate-3 transition-transform cursor-pointer">
                <Image src={stickerUrl} width={50} height={50} alt="Sticker" className="object-contain w-full h-full drop-shadow-md" />
              </div>
            ))
          ) : (
            [1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-white/60 rounded-xl flex items-center justify-center grayscale opacity-30 border border-white/50 border-dashed">
                <span className="text-lg">❓</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Navigasyon Menüsü */}
      <div className="hidden lg:flex flex-col gap-2 mt-auto pb-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/cocuk-modu/${childId}`)}
          className={cn(
            "w-full justify-start gap-3 h-12 rounded-[20px] border-[3px] font-black text-sm lg:text-base transition-transform hover:scale-105 shadow-md",
            pathname === `/cocuk-modu/${childId}` 
              ? "border-sky-400 bg-sky-100/90 text-sky-700 hover:bg-sky-200" 
              : "border-white/60 bg-white/40 text-slate-600 hover:bg-white/60 backdrop-blur-sm"
          )}
        >
          <div className="bg-white p-1.5 rounded-xl shadow-sm">
            <Map className={cn("w-5 h-5", pathname === `/cocuk-modu/${childId}` ? "text-sky-500" : "text-slate-400")} />
          </div>
          Macera Haritası
        </Button>
        
        <Button
          variant="outline"
          onClick={() => router.push(`/cocuk-modu/${childId}/hikayeler`)}
          className={cn(
            "w-full justify-start gap-3 h-12 rounded-[20px] border-[3px] font-black text-sm lg:text-base transition-transform hover:scale-105 shadow-md",
            pathname.includes('/hikayeler')
              ? "border-purple-400 bg-purple-100/90 text-purple-700 hover:bg-purple-200" 
              : "border-white/60 bg-white/40 text-slate-600 hover:bg-white/60 backdrop-blur-sm"
          )}
        >
          <div className="bg-white p-1.5 rounded-xl shadow-sm">
            <BookOpen className={cn("w-5 h-5", pathname.includes('/hikayeler') ? "text-purple-500" : "text-slate-400")} />
          </div>
          Hikayeler
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push(`/cocuk-modu/${childId}/konusma`)}
          className={cn(
            "w-full justify-start gap-3 h-12 rounded-[20px] border-[3px] font-black text-sm lg:text-base transition-transform hover:scale-105 shadow-md",
            pathname.includes('/konusma')
              ? "border-green-400 bg-green-100/90 text-green-700 hover:bg-green-200" 
              : "border-white/60 bg-white/40 text-slate-600 hover:bg-white/60 backdrop-blur-sm"
          )}
        >
          <div className="bg-white p-1.5 rounded-xl shadow-sm">
            <MessageCircle className={cn("w-5 h-5", pathname.includes('/konusma') ? "text-green-500" : "text-slate-400")} />
          </div>
          Konuşma
        </Button>
      </div>
    </div>
  );
}
