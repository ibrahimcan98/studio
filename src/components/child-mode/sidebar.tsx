'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Star, Map, BookOpen, MessageCircle, Trophy, LayoutGrid, Edit2, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ExitDialog } from "./exit-dialog";

interface ChildSidebarProps {
  childId: string;
  childData: any;
}

export function ChildSidebar({ childId, childData }: ChildSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const level = useMemo(() => {
    if (!childData?.completedTopics) return 1;
    return Math.floor(childData.completedTopics.length / 5) + 1;
  }, [childData?.completedTopics]);

  const stickers = useMemo(() => Object.values(childData?.stickers || {}), [childData?.stickers]);

  const handleSelectAvatar = async (url: string) => {
    if (!db || !user?.uid || !childId) return;

    try {
      const childRef = doc(db, 'users', user.uid, 'children', childId);
      await updateDoc(childRef, {
        avatarUrl: url
      });
      setIsAvatarDialogOpen(false);
      toast({
        title: "Harika!",
        description: "Yeni karakterin hazır! ✨",
      });
    } catch (error) {
      console.error("Avatar update error:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Resim değiştirilemedi.",
      });
    }
  };

  return (
    <div className="w-full md:w-[260px] lg:w-[280px] p-3 lg:p-4 flex flex-row md:flex-col gap-3 flex-shrink-0 z-20 md:h-full bg-transparent overflow-hidden">
      {/* Büyülü Karakter Kartı */}
      <div className="flex-1 md:flex-none relative group">
        {/* Arka Plan Parlaması (Glow) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-gradient-to-b from-[#795548] to-[#5D4037] p-[3px] rounded-[38px] shadow-2xl">
          <div className="bg-gradient-to-br from-[#FFFDE7] via-[#FFF9C4] to-[#FFF59D] rounded-[34px] p-4 flex flex-row md:flex-col items-center gap-4 md:gap-3 border-b-8 border-amber-200/50">
            
            {/* Avatar Bölümü */}
            <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                  {/* Avatar Hareli Parlama */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-full blur-md opacity-20 group-hover:opacity-40 animate-pulse"></div>
                  
                  <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-b from-white to-sky-50 rounded-full border-[6px] border-white shadow-[0_10px_25px_rgba(0,0,0,0.15)] overflow-hidden flex-shrink-0">
                    <Image
                      src={childData.avatarUrl || "/images/child-mode/avatar_fox.png"}
                      fill
                      className="object-contain scale-110 group-hover:scale-125 transition-all duration-500 ease-out"
                      alt="Avatar"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                      <Edit2 className="text-white w-8 h-8 drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Seviye Rozeti */}
                  <div className="absolute -bottom-2 -right-1 bg-gradient-to-r from-orange-500 to-red-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xs md:text-sm border-4 border-white shadow-lg z-10">
                    {level}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-[40px] p-8 md:p-12 border-none bg-gradient-to-br from-yellow-50 to-orange-50 shadow-2xl">
                <DialogTitle className="text-3xl md:text-5xl font-black text-orange-600 mb-2 italic text-center uppercase tracking-tighter">Karakterini Seç!</DialogTitle>
                <DialogDescription className="text-slate-500 font-bold text-center mb-8">Kazandığın etiketlerden birini profil resmin yapabilirsin.</DialogDescription>
                
                <div className="grid grid-cols-3 md:grid-cols-4 gap-6 max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
                  {stickers.length > 0 ? (
                    stickers.map((url: any, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleSelectAvatar(url)}
                        className={cn(
                          "aspect-square bg-white rounded-3xl flex items-center justify-center border-4 shadow-md p-3 hover:scale-110 hover:rotate-3 transition-transform cursor-pointer group",
                          childData.avatarUrl === url ? "border-orange-500 shadow-orange-200" : "border-white hover:border-orange-200"
                        )}
                      >
                        <Image src={url} width={120} height={120} alt="Sticker Option" className="object-contain w-full h-full drop-shadow-md" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center bg-white/50 rounded-3xl border-2 border-dashed border-orange-200">
                      <p className="text-orange-400 font-black italic p-4">Henüz hiç etiketin yok! Oyunları tamamlayıp yeni karakterler kazanabilirsin. 🚀</p>
                    </div>
                  )}
                  
                  <div 
                    onClick={() => handleSelectAvatar("/images/child-mode/avatar_fox.png")}
                    className={cn(
                      "aspect-square bg-white rounded-3xl flex items-center justify-center border-4 shadow-md p-3 hover:scale-110 hover:rotate-3 transition-transform cursor-pointer group",
                      (!childData.avatarUrl || childData.avatarUrl === "/images/child-mode/avatar_fox.png") ? "border-orange-500 shadow-orange-200" : "border-white hover:border-orange-200"
                    )}
                  >
                    <Image src="/images/child-mode/avatar_fox.png" width={120} height={120} alt="Default Fox" className="object-contain w-full h-full drop-shadow-md" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* İsim ve İlerleme Alanı */}
            <div className="flex-1 md:w-full text-left md:text-center overflow-hidden flex flex-col items-start md:items-center">
              <div className="flex items-center gap-2 w-full justify-between md:justify-center">
                <h2 className="text-lg md:text-2xl font-black text-[#5D4037] uppercase tracking-tight truncate drop-shadow-sm">
                  {childData.firstName || 'Gezgin'}
                </h2>
                
                {/* MOBİL HIZLI KONTROL PANELİ (Sadece Koleksiyonlar) */}
                <div className="flex lg:hidden gap-1 items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="p-2 bg-amber-500 rounded-xl shadow-lg border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all">
                        <Trophy className="w-4 h-4 text-white" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl rounded-[40px] p-8 md:p-12 border-none bg-gradient-to-br from-blue-50 to-indigo-100 shadow-2xl">
                       <DialogTitle className="text-3xl md:text-5xl font-black text-blue-600 mb-2 italic text-center uppercase tracking-tighter">Rozet Koleksiyonun</DialogTitle>
                       <DialogDescription className="text-slate-500 font-bold text-center mb-8">Tamamladığın her macera için yeni bir rozet kazanırsın!</DialogDescription>
                       <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-white/80 rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-sm grayscale opacity-30">
                               <Trophy className="w-8 h-8 text-blue-300" />
                            </div>
                          ))}
                       </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="p-2 bg-pink-500 rounded-xl shadow-lg border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all">
                        <Star className="w-4 h-4 text-white fill-current" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl rounded-[40px] p-8 md:p-12 border-none bg-gradient-to-br from-purple-50 to-pink-100 shadow-2xl">
                       <DialogTitle className="text-3xl md:text-5xl font-black text-purple-600 mb-2 italic text-center uppercase tracking-tighter">Etiket Defterin</DialogTitle>
                       <DialogDescription className="text-slate-500 font-bold text-center mb-8">Maceralarında topladığın tüm çıkartmalar burada saklanır!</DialogDescription>
                       <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                          {stickers.length > 0 ? (
                            stickers.map((url: any, i) => (
                              <div key={i} className="aspect-square bg-white rounded-2xl flex items-center justify-center border-2 border-purple-200 p-2">
                                 <Image src={url} width={80} height={80} alt="Sticker" className="object-contain w-full h-full" />
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full py-12 text-center">
                              <p className="text-purple-400 font-black italic">Henüz hiç etiketin yok! 🚀</p>
                            </div>
                          )}
                       </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Ünvan */}
              <div className="bg-orange-100/80 px-4 py-0.5 rounded-full border border-orange-200 mb-1 md:mb-2">
                <span className="text-[9px] md:text-xs font-bold text-orange-700 uppercase italic">
                  {level < 5 ? "🧗 Minik Kaşif" : level < 10 ? "🎖️ Gümüş Gezgin" : "👑 Altın Kahraman"}
                </span>
              </div>

              <div className="w-full mt-0.5 md:mt-1 space-y-1">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] md:text-[10px] font-black text-amber-700/70 uppercase">İlerleme</span>
                  <span className="text-[8px] md:text-[10px] font-black text-orange-600 bg-white/50 px-2 rounded-full border border-white">
                    {(childData.completedTopics?.length || 0) % 5}/5
                  </span>
                </div>
                
                {/* Parlayan İlerleme Çubuğu */}
                <div className="w-full h-2 md:h-4 bg-slate-200/50 rounded-full overflow-hidden border-2 border-white shadow-inner relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-[length:200%_auto] animate-shimmer transition-all duration-1000 relative"
                    style={{ width: `${((childData.completedTopics?.length || 0) % 5) * 20}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 skew-x-[-20deg] translate-x-[-100%] animate-[shine_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rozet Koleksiyonu (Maceracı Madalyaları) */}
      <div className="hidden lg:block bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-[30px] p-4 border-2 border-white shadow-[0_8px_20px_rgba(0,0,0,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/20 rounded-full -mr-8 -mt-8 blur-2xl"></div>
        
        <div className="flex items-center justify-between mb-3 relative z-10">
           <div className="flex items-center gap-1.5">
             <div className="bg-blue-500 p-1 rounded-lg shadow-sm">
               <Trophy className="w-3 h-3 text-white" />
             </div>
             <h3 className="font-black text-blue-600 text-[11px] uppercase tracking-wider italic">Rozetlerin</h3>
           </div>
           
           <Dialog>
              <DialogTrigger asChild>
                <button className="text-[10px] font-black text-blue-500/50 hover:text-blue-600 transition-all hover:scale-110 flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded-full border border-white">
                  HEPSİ <LayoutGrid className="w-2.5 h-2.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-[40px] p-8 md:p-12 border-none bg-gradient-to-br from-blue-50 to-indigo-100 shadow-2xl">
                 <DialogTitle className="text-3xl md:text-5xl font-black text-blue-600 mb-2 italic text-center uppercase tracking-tighter">Rozet Koleksiyonun</DialogTitle>
                 <DialogDescription className="text-slate-500 font-bold text-center mb-8">Tamamladığın her macera için yeni bir rozet kazanırsın!</DialogDescription>
                 <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-white/80 rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-sm grayscale opacity-30 hover:opacity-50 transition-all group relative overflow-hidden">
                         <Trophy className="w-8 h-8 text-blue-300 group-hover:scale-110 transition-transform" />
                         <span className="text-[8px] font-black mt-1 text-blue-400 italic uppercase">Kilitli</span>
                         <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                 </div>
              </DialogContent>
           </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-2.5 relative z-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-square bg-white/40 rounded-2xl flex items-center justify-center border-2 border-white/80 shadow-sm relative group/badge overflow-hidden">
               <Star className="w-5 h-5 text-slate-300 transition-colors group-hover/badge:text-yellow-400/50" />
               
               {/* Hedef İpucu */}
               <div className="absolute inset-0 bg-blue-500/80 flex items-center justify-center opacity-0 group-hover/badge:opacity-100 transition-opacity cursor-help p-1">
                 <span className="text-[7px] font-black text-white text-center leading-tight uppercase">Macerayı Bitir!</span>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Etiket Albümü (Sticker Album Feel) */}
      <div className="hidden lg:block bg-[#FFF9C4]/30 rounded-[30px] p-4 border-2 border-dashed border-[#FBC02D]/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-1.5">
            <div className="bg-purple-500 p-1 rounded-lg shadow-sm">
              <Star className="w-3 h-3 text-white fill-current" />
            </div>
            <h3 className="font-black text-purple-600 text-[11px] uppercase tracking-wider italic">Etiketlerin</h3>
          </div>

          <Dialog>
              <DialogTrigger asChild>
                <button className="text-[10px] font-black text-purple-500/50 hover:text-purple-600 transition-all hover:scale-110 flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded-full border border-white">
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

        <div className="grid grid-cols-3 gap-2.5 relative z-10">
          {stickers.length > 0 ? (
            stickers.slice(0, 6).map((stickerUrl: any, i) => (
              <Dialog key={i}>
                <DialogTrigger asChild>
                  <div className="aspect-square bg-white rounded-xl flex items-center justify-center border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-1.5 hover:scale-110 hover:-rotate-3 transition-all cursor-pointer group relative">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white/40 backdrop-blur-sm rounded-sm rotate-3 border border-white/20"></div>
                    <Image src={stickerUrl} width={50} height={50} alt="Sticker" className="object-contain w-full h-full drop-shadow-sm group-hover:drop-shadow-md" />
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
              <div key={i} className="aspect-square bg-white/40 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300/50 opacity-40">
                <span className="text-lg grayscale">❓</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Navigasyon Menüsü (Masaüstü ve Mobil Ayrımı) */}
      
      {/* 1. MASAÜSTÜ MENÜ (Sol Kenar) */}
      <div className="hidden lg:flex flex-col gap-2 mt-auto pb-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/cocuk-modu/${childId}`)}
          className={cn(
            "w-full justify-start gap-3 h-12 rounded-[20px] border-[3px] font-black text-sm transition-transform hover:scale-105 shadow-md",
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
            "w-full justify-start gap-3 h-12 rounded-[20px] border-[3px] font-black text-sm transition-transform hover:scale-105 shadow-md",
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
            "w-full justify-start gap-3 h-12 rounded-[20px] border-[3px] font-black text-sm transition-transform hover:scale-105 shadow-md",
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

      {/* 2. MOBİL ALT NAVİGASYON BAR (4'lü Sistem: Harita, Hikaye, Konuşma, Çıkış) */}
      <div className="flex lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-16 bg-white/90 backdrop-blur-xl rounded-[30px] border-2 border-white shadow-[0_15px_30px_rgba(0,0,0,0.1)] z-[100] px-2 items-center justify-between">
         <button 
          onClick={() => router.push(`/cocuk-modu/${childId}`)}
          className={cn(
            "flex-1 flex flex-col items-center gap-0.5 transition-all",
            pathname === `/cocuk-modu/${childId}` ? "text-sky-600 scale-110" : "text-slate-400"
          )}
         >
           <Map className="w-6 h-6" />
           <span className="text-[9px] font-black uppercase">Harita</span>
         </button>

         <button 
          onClick={() => router.push(`/cocuk-modu/${childId}/hikayeler`)}
          className={cn(
            "flex-1 flex flex-col items-center gap-0.5 transition-all",
            pathname.includes('/hikayeler') ? "text-purple-600 scale-110" : "text-slate-400"
          )}
         >
           <BookOpen className="w-6 h-6" />
           <span className="text-[9px] font-black uppercase">Hikaye</span>
         </button>

         <button 
          onClick={() => router.push(`/cocuk-modu/${childId}/konusma`)}
          className={cn(
            "flex-1 flex flex-col items-center gap-0.5 transition-all",
            pathname.includes('/konusma') ? "text-green-600 scale-110" : "text-slate-400"
          )}
         >
           <MessageCircle className="w-6 h-6" />
           <span className="text-[9px] font-black uppercase">Konuşma</span>
         </button>

         <div className="w-px h-8 bg-slate-200 mx-1" />

         <ExitDialog>
            <button className="flex-1 flex flex-col items-center gap-0.5 text-red-500 hover:scale-110 transition-all">
              <LogOut className="w-6 h-6" />
              <span className="text-[9px] font-black uppercase">Çıkış</span>
            </button>
         </ExitDialog>
      </div>
    </div>
  );
}
