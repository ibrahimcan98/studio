'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Star, Map, BookOpen, MessageCircle, Trophy, LayoutGrid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

  const stickers = useMemo(() => Object.values(childData?.stickers || {}), [childData?.stickers]);

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
        <div className="flex items-center justify-between mb-2 px-1">
           <h3 className="font-black text-blue-500 text-[10px] uppercase tracking-widest italic">Rozetlerin</h3>
           <Dialog>
              <DialogTrigger asChild>
                <button className="text-[9px] font-black text-blue-600/60 hover:text-blue-600 transition-colors flex items-center gap-1">
                  HEPSİ <LayoutGrid className="w-2.5 h-2.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-[40px] p-8 md:p-12 border-none bg-gradient-to-br from-blue-50 to-indigo-100 shadow-2xl">
                 <DialogTitle className="text-3xl md:text-5xl font-black text-blue-600 mb-2 italic text-center uppercase tracking-tighter">Rozet Koleksiyonun</DialogTitle>
                 <DialogDescription className="text-slate-500 font-bold text-center mb-8">Tamamladığın her macera için yeni bir rozet kazanırsın!</DialogDescription>
                 <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-white/80 rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-sm grayscale opacity-30 hover:opacity-50 transition-all group">
                         <Trophy className="w-8 h-8 text-blue-300 group-hover:scale-110 transition-transform" />
                         <span className="text-[8px] font-black mt-1 text-blue-400 italic uppercase">Kilitli</span>
                      </div>
                    ))}
                 </div>
              </DialogContent>
           </Dialog>
        </div>
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
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-black text-purple-500 text-[10px] uppercase tracking-widest italic">Etiketlerin</h3>
          <Dialog>
              <DialogTrigger asChild>
                <button className="text-[9px] font-black text-purple-600/60 hover:text-purple-600 transition-colors flex items-center gap-1">
                  HEPSİ <LayoutGrid className="w-2.5 h-2.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-[40px] p-8 md:p-12 border-none bg-gradient-to-br from-purple-50 to-pink-100 shadow-2xl">
                 <DialogTitle className="text-3xl md:text-5xl font-black text-purple-600 mb-2 italic text-center uppercase tracking-tighter">Etiket Defterin</DialogTitle>
                 <DialogDescription className="text-slate-500 font-bold text-center mb-8">Maceralarında topladığın tüm çıkartmalar burada saklanır!</DialogDescription>
                 <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {stickers.length > 0 ? (
                      stickers.map((url: any, i) => (
                        <div key={i} className="aspect-square bg-white rounded-2xl flex items-center justify-center border-2 border-purple-200 shadow-sm p-2 hover:scale-110 hover:rotate-3 transition-transform cursor-pointer group">
                           <Image src={url} width={80} height={80} alt="Sticker" className="object-contain w-full h-full drop-shadow-md group-hover:drop-shadow-xl" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-purple-400 font-black italic">Henüz hiç etiketin yok. Maceralara katılmaya başla! 🚀</p>
                      </div>
                    )}
                 </div>
              </DialogContent>
           </Dialog>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {stickers.length > 0 ? (
            stickers.slice(0, 6).map((stickerUrl: any, i) => (
              <Dialog key={i}>
                <DialogTrigger asChild>
                  <div className="aspect-square bg-white/80 rounded-xl flex items-center justify-center border-2 border-purple-200 shadow-[0_4px_10px_rgba(0,0,0,0.1)] p-1 hover:scale-110 hover:rotate-3 transition-transform cursor-pointer group">
                    <Image src={stickerUrl} width={50} height={50} alt="Sticker" className="object-contain w-full h-full drop-shadow-md" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-sm rounded-[40px] p-0 overflow-hidden border-none bg-transparent shadow-none">
                  <DialogTitle className="sr-only">Etiket Görüntüle</DialogTitle>
                  <DialogDescription className="sr-only">Kazandığın etiket büyütülmüş hali.</DialogDescription>
                  <div className="bg-gradient-to-br from-purple-100 via-white to-pink-100 p-10 flex flex-col items-center">
                    <div className="relative w-48 h-48 drop-shadow-[0_20px_40px_rgba(168,85,247,0.4)] animate-in zoom-in duration-500">
                       <Image src={stickerUrl} fill alt="Sticker Big" className="object-contain" />
                    </div>
                    <div className="mt-8 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-purple-200 shadow-sm">
                      <p className="text-purple-600 font-black text-lg">HARİKA BİR ÇIKARTMA! ✨</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
