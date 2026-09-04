'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Star, Map, BookOpen, MessageCircle, Trophy, LayoutGrid, Edit2, LogOut, CheckCircle, User as UserIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ExitDialog } from "./exit-dialog";

interface ChildSidebarProps {
  childId: string;
  childData: any;
}

const ISLAND_BADGES = [
  { id: 'ilk-adim', name: 'İlk Adım', description: 'İlk adayı başarıyla tamamladığında verilir.', icon: '/rozetler/ada/ilk-adim.png', requirement: 1 },
  { id: 'ada-gezgini', name: 'Ada Gezgini', description: '5 farklı adayı bitirene verilir.', icon: '/rozetler/ada/ada-gezgini.png', requirement: 5 },
  { id: 'takim-takim', name: 'Takım Takım', description: 'İlk 10 adayı bitirenler için.', icon: '/rozetler/ada/takim-takim.png', requirement: 10 },
  { id: 'kesif-ustasi', name: 'Keşif Ustası', description: '20 adayı tamamlayan kaşiflere.', icon: '/rozetler/ada/kesif-ustasi.png', requirement: 20 },
  { id: 'harita-fatihi', name: 'Harita Fatihi', description: 'Tüm 36 adayı bitirenlere verilen en prestijli rozet.', icon: '/rozetler/ada/harita-fatihi.png', requirement: 36 },
];

const AI_BADGES = [
  { id: 'soru-makinesi', name: 'Soru Makinesi', description: 'AI’ya 10 adet "Neden?" veya "Nasıl?" sorusu sorana verilir.', icon: '/rozetler/ai/soru-makinesi.png', requirement: 10 },
  { id: 'nezaket-elcisi', name: 'Nezaket Elçisi', description: 'AI ile konuşurken "Lütfen", "Teşekkür ederim" gibi kelimeleri kullananlara.', icon: '/rozetler/ai/nezaket-elcisi.png', requirement: 1 },
  { id: 'geveze', name: 'Geveze', description: 'AI ile toplamda 1 saatten fazla vakit geçirene verilir.', icon: '/rozetler/ai/geveze.png', requirement: 60 },
  { id: 'kelime-avcisi', name: 'Kelime Avcısı', description: 'AI ile konuşurken 5 yeni ve zor kelime öğrenip kullananlara.', icon: '/rozetler/ai/kelime-avcisi.png', requirement: 5 },
  { id: 'en-iyi-dost', name: 'En İyi Dost', description: 'AI ile her gün üst üste 7 gün boyunca sohbet edene verilir.', icon: '/rozetler/ai/en-iyi-dost.png', requirement: 7 },
];

const STORY_BADGES = [
  { id: 'ilk-sayfa', name: 'İlk Sayfa', description: 'İlk hikayeyi sonuna kadar okuyana verilir.', icon: '/rozetler/hikaye/ilk-sayfa.png', requirement: 1 },
  { id: 'okuma-merdiveni', name: 'Okuma Merdiveni', description: '4 hikayeyi sonuna kadar okuyana verilir.', icon: '/rozetler/hikaye/okuma-merdiveni.png', requirement: 4 },
  { id: 'kutuphane-krali', name: 'Kütüphane Kralı', description: '10 hikayeyi sonuna kadar okuyana verilir.', icon: '/rozetler/hikaye/kutuphane-krali.png', requirement: 10 },
  { id: 'dikkatli-gozler', name: 'Dikkatli Gözler', description: 'Hikaye sonundaki soruların hepsini doğru bilene verilir.', icon: '/rozetler/hikaye/dikkatli-gozler.png', requirement: 1 },
];

const SOCIAL_BADGES = [
  { id: 'sabah-yildizi', name: 'Sabah Yıldızı', description: 'Sabah erkenden sisteme girip çalışana verilir.', icon: '/rozetler/sosyal/sabah-yildizi.png', requirement: 1 },
  { id: 'gece-kusu', name: 'Gece Kuşu', description: 'Akşam vakti sisteme girip çalışana verilir.', icon: '/rozetler/sosyal/gece-kusu.png', requirement: 1 },
  { id: 'azimli-kaplumbaga', name: 'Azimli Kaplumbağa', description: 'Zorlandığı bir görevi 3. denemede başaranlara.', icon: '/rozetler/sosyal/azimli-kaplumbaga.png', requirement: 3 },
  { id: 'duzenli-calisan', name: 'Düzenli Çalışkan', description: '5 gün üst üste sisteme giriş yapana verilir.', icon: '/rozetler/sosyal/duzenli-calisan.png', requirement: 5 },
];

const TURKCE_HAZINEM_BADGES = [
  { id: 'ilk-hazine', name: 'İlk Hazine', description: 'İlk Türkçe Hazinem sandığını başarıyla açana verilir.', icon: '/rozetler/hazine/ilk-hazine.png', requirement: 1, type: 'all' },
  { id: 'okuma-sevdalisi', name: 'Okuma Sevdalısı', description: '10 Türkçe Hazinem "Okuyorum Anlıyorum" görevini tamamlayana.', icon: '/rozetler/hazine/okuma-sevdalisi.png', requirement: 10, type: 'story' },
  { id: 'dil-ustasi', name: 'Dil Ustası', description: '10 Türkçe Hazinem "Dilimi Öğreniyorum" görevini tamamlayana.', icon: '/rozetler/hazine/dil-ustasi.png', requirement: 10, type: 'lang' },
  { id: 'turkiye-sevdalisi', name: 'Türkiye Sevdalısı', description: '10 Türkçe Hazinem "Ülkemi Öğreniyorum" görevini tamamlayana.', icon: '/rozetler/hazine/turkiye-sevdalisi.png', requirement: 10, type: 'country' },
  { id: 'kelime-uzmani', name: 'Kelime Uzmanı', description: '10 tam Türkçe Hazinem sandığı bitirene verilir.', icon: '/rozetler/hazine/kelime-uzmani.png', requirement: 10, type: 'all' },
  { id: 'kultur-elcisi', name: 'Kültür Elçisi', description: '20 tam Türkçe Hazinem sandığı bitiren kaşiflere.', icon: '/rozetler/hazine/kultur-elcisi.png', requirement: 20, type: 'all' },
  { id: 'hazine-avcisi', name: 'Hazine Avcısı', description: 'Tüm 30 Türkçe Hazinem sandığını tamamlayan büyük kaşiflere!', icon: '/rozetler/hazine/hazine-avcisi.png', requirement: 30, type: 'all' },
];

export function ChildSidebar({ childId, childData }: ChildSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const xp = useMemo(() => {
    if (childData?.xp !== undefined) return childData.xp;
    return (childData?.completedTopics?.length || 0) * 33;
  }, [childData?.xp, childData?.completedTopics]);

  const level = useMemo(() => {
    return Math.floor(xp / 100) + 1;
  }, [xp]);

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

  const getRankInfo = (lvl: number) => {
    if (lvl <= 5) return {
      id: 1, title: "🌱 Filiz Kaşif", color: "text-emerald-700", bg: "bg-emerald-100/80", border: "border-emerald-200",
      theme: "from-emerald-400 to-green-500", badge: "from-emerald-500 to-green-600", xpText: "text-emerald-600", panel: "bg-[#F0FDF4]", avatarTop: "top-[16%]"
    };
    if (lvl <= 12) return {
      id: 2, title: "🐾 Pati Dostu", color: "text-amber-700", bg: "bg-amber-100/80", border: "border-amber-200",
      theme: "from-amber-400 to-orange-500", badge: "from-amber-500 to-orange-600", xpText: "text-amber-600", panel: "bg-[#FFFBEB]", avatarTop: "top-[16%]"
    };
    if (lvl <= 20) return {
      id: 3, title: "🏹 Orman Rehberi", color: "text-green-900", bg: "bg-green-100/80", border: "border-green-300",
      theme: "from-green-700 via-[#5D4037] to-green-900", badge: "from-green-800 to-[#3E2723]", xpText: "text-green-800", panel: "bg-[#F1F8E9]", avatarTop: "top-[16%]"
    };
    if (lvl <= 28) return {
      id: 4, title: "🛡️ Cesur Gezgin", color: "text-slate-700", bg: "bg-slate-100/80", border: "border-slate-300",
      theme: "from-slate-400 to-slate-600", badge: "from-slate-500 to-slate-700", xpText: "text-slate-600", panel: "bg-[#F8FAFC]", avatarTop: "top-[16%]"
    };
    if (lvl <= 35) return {
      id: 5, title: "💎 Bilge Muhafız", color: "text-indigo-800", bg: "bg-indigo-100/80", border: "border-indigo-200",
      theme: "from-blue-600 via-indigo-700 to-amber-400", badge: "from-indigo-700 to-amber-500", xpText: "text-indigo-700", panel: "bg-[#E8EAF6]", avatarTop: "top-[16%]"
    };
    if (lvl <= 45) return {
      id: 6, title: "👑 Efsanevi Kahraman", color: "text-rose-700", bg: "bg-rose-100/80", border: "border-rose-200",
      theme: "from-rose-400 via-purple-500 to-indigo-600", badge: "from-rose-500 via-indigo-500 to-purple-600", xpText: "text-rose-600", panel: "bg-[#FFF1F2]", avatarTop: "top-[22%]"
    };
    if (lvl <= 55) return {
      id: 6, title: "🦅 Gökyüzü Hakimi", color: "text-sky-700", bg: "bg-sky-100/80", border: "border-sky-200",
      theme: "from-sky-400 to-blue-600", badge: "from-sky-500 to-blue-700", xpText: "text-sky-600", panel: "bg-[#F0F9FF]", avatarTop: "top-[22%]"
    };
    if (lvl <= 65) return {
      id: 6, title: "🌌 Galaksi Gezgini", color: "text-fuchsia-800", bg: "bg-fuchsia-100/80", border: "border-fuchsia-200",
      theme: "from-fuchsia-500 to-purple-700", badge: "from-fuchsia-600 to-purple-800", xpText: "text-fuchsia-700", panel: "bg-[#FDF4FF]", avatarTop: "top-[22%]"
    };
    if (lvl <= 80) return {
      id: 6, title: "⚡ Zaman Ustası", color: "text-yellow-700", bg: "bg-yellow-100/80", border: "border-yellow-300",
      theme: "from-yellow-400 to-amber-600", badge: "from-yellow-500 to-amber-700", xpText: "text-yellow-700", panel: "bg-[#FEFCE8]", avatarTop: "top-[22%]"
    };
    if (lvl <= 100) return {
      id: 6, title: "🔮 Rüya Büyücüsü", color: "text-violet-800", bg: "bg-violet-100/80", border: "border-violet-200",
      theme: "from-violet-500 to-fuchsia-600", badge: "from-violet-600 to-fuchsia-700", xpText: "text-violet-700", panel: "bg-[#F5F3FF]", avatarTop: "top-[22%]"
    };
    return {
      id: 6, title: "🌟 Sonsuz Işık", color: "text-amber-800", bg: "bg-amber-100/80", border: "border-amber-300",
      theme: "from-amber-400 via-orange-500 to-rose-600", badge: "from-amber-500 via-orange-600 to-rose-700", xpText: "text-amber-700", panel: "bg-[#FFFBEB]", avatarTop: "top-[22%]"
    };
  };

  const rank = getRankInfo(level);

  return (
    <>
      {/* MASAÜSTÜ SIDEBAR (Sol Panel) */}
      <div className="hidden lg:flex w-[260px] lg:w-[280px] p-4 flex-col gap-4 flex-shrink-0 z-20 h-screen sticky top-0 bg-transparent overflow-y-auto custom-scrollbar">
        {/* Büyülü Profil Kartı - Sadece Masaüstünde Görünür */}
        <div className="hidden lg:block relative w-full aspect-[4/5] mb-4 group overflow-hidden flex-shrink-0">
          {/* Tematik Arka Plan Panel */}
          <div className={cn("absolute inset-0 rounded-[40px] shadow-inner transition-colors duration-1000", rank.panel)} />

          {/* Dinamik Çerçeve Görseli */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Image
              src={`/cerceveler/${rank.id}.png`}
              fill
              className="object-fill"
              alt="Frame"
            />
          </div>

          {/* Profil İçeriği - Mutlak Konumlandırma */}
          <div className="absolute inset-0 z-20 flex flex-col items-center">

            {/* Avatar Bölümü - Çerçevenin Üst Dairesine Tam Oturtma */}
            <div className={cn("absolute w-full flex justify-center", rank.avatarTop)}>
              <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <div className="relative w-32 h-32 bg-white rounded-full border-0 border-white/40 shadow-xl overflow-hidden">
                      <Image
                        src={childData.avatarUrl || "/images/child-mode/avatar_fox.png"}
                        fill
                        className="object-contain scale-110 group-hover:scale-125 transition-all duration-500"
                        alt="Avatar"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Edit2 className="text-white w-8 h-8" />
                      </div>
                    </div>
                    {/* Dinamik Seviye Rozeti */}
                    <div className={cn("absolute bottom-0 right-0 bg-gradient-to-r text-white w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border-4 border-white shadow-lg transition-all", rank.badge)}>
                      {level}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-[40px] p-8 border-none bg-white">
                  <DialogTitle className="text-3xl font-black text-blue-600 mb-2 text-center uppercase">Karakterini Seç!</DialogTitle>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-6 max-h-[50vh] overflow-y-auto p-4">
                    {stickers.map((url: any, i) => (
                      <div key={i} onClick={() => handleSelectAvatar(url)} className="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-slate-100 p-3 hover:scale-110 transition-transform cursor-pointer">
                        <Image src={url} width={120} height={120} alt="Sticker" className="object-contain" />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Ünvan ve İlerleme - Alt Kısım */}
            <div className="absolute bottom-[11%] w-full px-6 flex flex-col items-center space-y-0.5">
              {/* Ünvan */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className={cn("inline-flex px-3 py-0.5 rounded-full border transition-all cursor-help hover:scale-105", rank.bg, rank.border)}>
                    <span className={cn("text-[10px] font-black uppercase italic", rank.color)}>
                      {rank.title}
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-[40px] p-8 border-none bg-white">
                  <DialogTitle className="text-2xl font-black text-center mb-6 uppercase italic">Yolculuk Haritası</DialogTitle>
                  <div className="space-y-2">
                    {[
                      { l: "1-5", t: "🌱 Filiz Kaşif", d: "Maceraya yeni başlayanlar" },
                      { l: "6-12", t: "🐾 Pati Dostu", d: "Pati ile arkadaş olanlar" },
                      { l: "13-20", t: "🏹 Orman Rehberi", d: "Yolları keşfeden rehberler" },
                      { l: "21-28", t: "🛡️ Cesur Gezgin", d: "Zorlukları aşan gezginler" },
                      { l: "29-35", t: "💎 Bilge Muhafız", d: "Bilginin koruyucuları" },
                      { l: "36-45", t: "👑 Efsanevi Kahraman", d: "Maceranın efsanesi!" },
                      { l: "46-55", t: "🦅 Gökyüzü Hakimi", d: "Yükseklerin fatihi" },
                      { l: "56-65", t: "🌌 Galaksi Gezgini", d: "Yıldızların arasında" },
                      { l: "66-80", t: "⚡ Zaman Ustası", d: "Geçmişin ve geleceğin hakimi" },
                      { l: "81-100", t: "🔮 Rüya Büyücüsü", d: "Düşlerin sırrını çözenler" },
                      { l: "101+", t: "🌟 Sonsuz Işık", d: "Evrenin aydınlığı" },
                    ].map((r, i) => (
                      <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl border-2", level >= parseInt(r.l.split('-')[0]) ? "bg-amber-50 border-amber-200" : "opacity-30 grayscale")}>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-400">SEVİYE {r.l}</p>
                          <h4 className="font-black text-slate-700">{r.t}</h4>
                        </div>
                        {level >= parseInt(r.l.split('-')[0]) ? <CheckCircle className="text-green-500 w-5 h-5" /> : <Star className="text-slate-300 w-5 h-5" />}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Dinamik İlerleme Çubuğu */}
              <div className="w-full space-y-1">
                <div className="flex justify-between items-center px-1">
                  <span className={cn("text-[9px] font-black uppercase tracking-widest", rank.xpText)}>TP: {xp}</span>
                  <span className={cn("text-[9px] font-black bg-white/80 px-1.5 rounded-full border", rank.xpText, rank.border)}>
                    {xp % 100}/100
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/50 rounded-full overflow-hidden border-2 border-white shadow-inner relative">
                  <div
                    className={cn("h-full bg-gradient-to-r bg-[length:200%_auto] animate-shimmer transition-all duration-1000", rank.theme)}
                    style={{ width: `${xp % 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rozet Koleksiyonu - Sadece Masaüstünde Görünür */}
        <div className="hidden lg:block bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-[30px] p-4 border-2 border-white shadow-[0_8px_20px_rgba(0,0,0,0.05)] relative overflow-hidden group flex-shrink-0">
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
              <DialogContent className="max-w-3xl rounded-[40px] p-8 md:p-12 border-none bg-gradient-to-br from-blue-50 via-white to-indigo-100 shadow-2xl overflow-y-auto max-h-[90vh]">
                <DialogTitle className="text-3xl md:text-5xl font-black text-blue-600 mb-2 italic text-center uppercase tracking-tighter">Rozet Koleksiyonun</DialogTitle>
                <DialogDescription className="text-slate-500 font-bold text-center mb-10 text-lg">Başarılarınla parlayan madalyaların!</DialogDescription>

                <div className="space-y-12">
                  {/* 1. Kategori: Ada ve Keşif */}
                  <div>
                    <div className="flex items-center gap-3 mb-6 px-4">
                      <div className="bg-amber-400 p-2 rounded-xl shadow-md rotate-3">
                        <Map className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-2xl font-black text-amber-600 italic uppercase tracking-tight">🏝️ ADA VE KEŞİF</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                      {ISLAND_BADGES.map((badge) => {
                        const completedCount = childData?.completedTopics?.length || 0;
                        const isUnlocked = completedCount >= badge.requirement;

                        return (
                          <div
                            key={badge.id}
                            className={cn(
                              "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                              !isUnlocked && "grayscale opacity-30"
                            )}
                          >
                            <div className="relative w-full h-full mb-3">
                              <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-black text-blue-600 uppercase italic tracking-tighter mb-1">{badge.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                            </div>
                            {!isUnlocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px]">
                                <div className="bg-blue-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Kategori: AI ve İletişim */}
                  <div>
                    <div className="flex items-center gap-3 mb-6 px-4">
                      <div className="bg-green-400 p-2 rounded-xl shadow-md -rotate-3">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-2xl font-black text-green-600 italic uppercase tracking-tight">🤖 AI VE İLETİŞİM</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                      {AI_BADGES.map((badge) => {
                        const aiStats = childData?.stats?.ai || {};

                        let isUnlocked = false;
                        if (badge.id === 'soru-makinesi') isUnlocked = (aiStats.whyHowQuestions || 0) >= badge.requirement;
                        if (badge.id === 'nezaket-elcisi') isUnlocked = (aiStats.politeWordsCount || 0) >= 5; // Örn: 5 nezaket kelimesi
                        if (badge.id === 'geveze') isUnlocked = (aiStats.totalChats || 0) >= 50; // Örn: 50 sohbet
                        if (badge.id === 'kelime-avcisi') isUnlocked = (aiStats.uniqueWords?.length || 0) >= badge.requirement;
                        if (badge.id === 'en-iyi-dost') isUnlocked = (aiStats.consecutiveDays || 0) >= badge.requirement;

                        return (
                          <div
                            key={badge.id}
                            className={cn(
                              "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                              !isUnlocked && "grayscale opacity-30"
                            )}
                          >
                            <div className="relative w-full h-full mb-3">
                              <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-black text-green-600 uppercase italic tracking-tighter mb-1">{badge.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                            </div>
                            {!isUnlocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px]">
                                <div className="bg-green-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Kategori: Okuma ve Hikaye */}
                  <div>
                    <div className="flex items-center gap-3 mb-6 px-4">
                      <div className="bg-purple-400 p-2 rounded-xl shadow-md rotate-3">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-2xl font-black text-purple-600 italic uppercase tracking-tight">📚 OKUMA VE HİKAYE</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                      {STORY_BADGES.map((badge) => {
                        const completedStories = childData?.completedStories || [];
                        let isUnlocked = false;

                        if (badge.id === 'ilk-sayfa') isUnlocked = completedStories.length >= 1;
                        if (badge.id === 'okuma-merdiveni') isUnlocked = completedStories.length >= 4;
                        if (badge.id === 'kutuphane-krali') isUnlocked = completedStories.length >= 10;
                        if (badge.id === 'dikkatli-gozler') isUnlocked = (childData?.stats?.story?.perfectScores || 0) >= 1;

                        return (
                          <div
                            key={badge.id}
                            className={cn(
                              "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                              !isUnlocked && "grayscale opacity-30"
                            )}
                          >
                            <div className="relative w-full h-full mb-3">
                              <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-black text-purple-600 uppercase italic tracking-tighter mb-1">{badge.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                            </div>
                            {!isUnlocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px]">
                                <div className="bg-purple-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Kategori: Türkçe Hazinem */}
                  <div>
                    <div className="flex items-center gap-3 mb-6 px-4">
                      <div className="bg-rose-400 p-2 rounded-xl shadow-md rotate-3">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-2xl font-black text-rose-600 italic uppercase tracking-tight">🏆 TÜRKÇE HAZİNEM</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                      {TURKCE_HAZINEM_BADGES.map((badge) => {
                        let isUnlocked = false;
                        if (badge.type === 'all') {
                          isUnlocked = (childData?.completedTopics || []).filter((t: string) => t.startsWith('chest-') && t.endsWith('-3')).length >= badge.requirement;
                        } else if (badge.type === 'story') {
                          isUnlocked = (childData?.completedTopics || []).filter((t: string) => t.startsWith('chest-') && t.endsWith('-1')).length >= badge.requirement;
                        } else if (badge.type === 'lang') {
                          isUnlocked = (childData?.completedTopics || []).filter((t: string) => t.startsWith('chest-') && t.endsWith('-2')).length >= badge.requirement;
                        } else if (badge.type === 'country') {
                          isUnlocked = (childData?.completedTopics || []).filter((t: string) => t.startsWith('chest-') && t.endsWith('-3')).length >= badge.requirement;
                        }

                        return (
                          <div
                            key={badge.id}
                            className={cn(
                              "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                              !isUnlocked && "grayscale opacity-30"
                            )}
                          >
                            <div className="relative w-full h-full mb-3 flex items-center justify-center">
                              <div className="absolute inset-0 bg-rose-100 rounded-full shadow-inner opacity-50 scale-75" />
                              <Image src={badge.icon} fill alt={badge.name} className="object-contain z-10 drop-shadow-md" />
                            </div>
                            <div className="text-center z-10">
                              <p className="text-xs font-black text-rose-600 uppercase italic tracking-tighter mb-1">{badge.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                            </div>
                            {!isUnlocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px] z-20">
                                <div className="bg-rose-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Kategori: Sosyal ve Davranış */}
                  <div>
                    <div className="flex items-center gap-3 mb-6 px-4">
                      <div className="bg-amber-400 p-2 rounded-xl shadow-md -rotate-3">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-2xl font-black text-amber-600 italic uppercase tracking-tight">🌟 SOSYAL VE DAVRANIŞ</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                      {SOCIAL_BADGES.map((badge) => {
                        const earnedBadges = childData?.earnedBadges || [];
                        let isUnlocked = earnedBadges.includes(badge.id);

                        // Manuel check if not in earnedBadges yet
                        if (!isUnlocked) {
                          const loginStats = childData?.stats?.login || {};
                          if (badge.id === 'duzenli-calisan') isUnlocked = (loginStats.consecutiveDays || 0) >= 5;
                          if (badge.id === 'sabah-yildizi') isUnlocked = (loginStats.earlyBirdCount || 0) >= 1;
                          if (badge.id === 'gece-kusu') isUnlocked = (loginStats.nightOwlCount || 0) >= 1;
                          if (badge.id === 'azimli-kaplumbaga') isUnlocked = (childData?.stats?.perseverance?.retrySuccessCount || 0) >= 3;
                        }

                        return (
                          <div
                            key={badge.id}
                            className={cn(
                              "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                              !isUnlocked && "grayscale opacity-30"
                            )}
                          >
                            <div className="relative w-full h-full mb-3">
                              <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-black text-amber-600 uppercase italic tracking-tighter mb-1">{badge.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                            </div>
                            {!isUnlocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px]">
                                <div className="bg-amber-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-3 gap-2.5 relative z-10">
              {ISLAND_BADGES.map((badge) => {
                const completedCount = childData?.completedTopics?.length || 0;
                const isUnlocked = completedCount >= badge.requirement;

                return (
                  <Dialog key={badge.id}>
                    <DialogTrigger asChild>
                      <div className={cn(
                        "aspect-square bg-white/40 rounded-2xl flex items-center justify-center border-2 border-white/80 shadow-sm relative group/badge overflow-hidden cursor-pointer transition-all hover:scale-105",
                        !isUnlocked && "grayscale opacity-40 hover:opacity-60"
                      )}>
                        <Image
                          src={badge.icon}
                          width={40}
                          height={40}
                          alt={badge.name}
                          className="object-contain w-3/4 h-3/4"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm rounded-[40px] p-0 overflow-hidden border-none bg-white shadow-2xl">
                      <DialogTitle className="sr-only">{badge.name}</DialogTitle>
                      <div className="p-8 flex flex-col items-center text-center">
                        <div className={cn(
                          "relative w-32 h-32 mb-6 drop-shadow-xl",
                          !isUnlocked && "grayscale opacity-30"
                        )}>
                          <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                        </div>
                        <h4 className="text-2xl font-black text-blue-600 mb-2 uppercase italic tracking-tight">{badge.name}</h4>
                        <p className="text-slate-500 font-bold leading-relaxed">{badge.description}</p>
                        {!isUnlocked && (
                          <div className="mt-6 bg-blue-50 px-4 py-2 rounded-2xl border-2 border-blue-100">
                            <p className="text-blue-600 font-black text-xs uppercase italic">
                              KİLİDİ AÇMAK İÇİN {badge.requirement} ADA BİTİR! 🏝️
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          </div>
        </div>

        {/* Etiket Albümü - Sadece Masaüstünde Görünür */}
        <div className="hidden lg:block bg-[#FFF9C4]/30 rounded-[30px] p-4 border-2 border-dashed border-[#FBC02D]/40 relative overflow-hidden flex-shrink-0">
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
                <div className="grid grid-cols-3 md:grid-cols-4 gap-6 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                  {stickers.length > 0 ? (
                    stickers.map((url: any, i) => (
                      <Dialog key={i}>
                        <DialogTrigger asChild>
                          <div className="aspect-square bg-white rounded-3xl flex items-center justify-center border-4 border-purple-100 shadow-sm p-4 hover:scale-110 hover:rotate-3 transition-transform cursor-pointer group">
                            <Image src={url} width={150} height={150} alt="Sticker" className="object-contain w-full h-full drop-shadow-md group-hover:drop-shadow-xl" />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm rounded-[40px] p-0 overflow-hidden border-none bg-transparent shadow-none">
                          <DialogTitle className="sr-only">Etiket Görüntüle</DialogTitle>
                          <div className="bg-white p-10 flex flex-col items-center">
                            <div className="relative w-48 h-48 drop-shadow-[0_20px_40px_rgba(168,85,247,0.4)] animate-in zoom-in duration-500">
                              <Image src={url} fill alt="Sticker Big" className="object-contain" />
                            </div>
                            <div className="mt-8 bg-slate-50 px-6 py-2 rounded-full border-2 border-slate-100 shadow-sm">
                              <p className="text-slate-600 font-black text-lg whitespace-nowrap">HARİKA BİR ÇIKARTMA! ✨</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                    <div className="bg-white p-10 flex flex-col items-center">
                      <div className="relative w-48 h-48 drop-shadow-[0_20px_40px_rgba(168,85,247,0.4)] animate-in zoom-in duration-500">
                        <Image src={stickerUrl} fill alt="Sticker Big" className="object-contain" />
                      </div>
                      <div className="mt-8 bg-slate-50 px-6 py-2 rounded-full border-2 border-slate-100 shadow-sm">
                        <p className="text-slate-600 font-black text-lg whitespace-nowrap">HARİKA BİR ÇIKARTMA! ✨</p>
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

          <div className="relative w-full">
            <Button
              variant="outline"
              onClick={() => router.push(`/cocuk-modu/${childId}/turkce-hazinem`)}
              className={cn(
                "w-full justify-start gap-3 h-12 rounded-[20px] border-[3px] font-black text-sm transition-transform hover:scale-105 shadow-md",
                pathname.includes('/turkce-hazinem')
                  ? "border-amber-400 bg-amber-100/90 text-amber-700 hover:bg-amber-200"
                  : "border-white/60 bg-white/40 text-slate-600 hover:bg-white/60 backdrop-blur-sm"
              )}
            >
              <div className="bg-white p-1.5 rounded-xl shadow-sm">
                <Trophy className={cn("w-5 h-5", pathname.includes('/turkce-hazinem') ? "text-amber-500" : "text-slate-400")} />
              </div>
              Türkçe Hazinem
            </Button>
            {(Array.isArray(childData?.activeHomeworkTopics) ? childData.activeHomeworkTopics.some((t: string) => t.startsWith('chest-') || t.startsWith('tekrar-')) : typeof childData?.activeHomeworkTopic === 'string' && (childData.activeHomeworkTopic.startsWith('chest-') || childData.activeHomeworkTopic.startsWith('tekrar-'))) ? (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-bounce border-2 border-white z-10 pointer-events-none">
                🌟 ÖDEV
              </div>
            ) : null}
          </div>

          <div className="relative w-full">
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
            {(Array.isArray(childData?.activeHomeworkTopics) ? childData.activeHomeworkTopics.some((t: string) => ['sari-top', 'bir-iki-uc-basardim', 'kaptan-kahvaltisi', 'gokusagi-partisi'].includes(t)) : ['sari-top', 'bir-iki-uc-basardim', 'kaptan-kahvaltisi', 'gokusagi-partisi'].includes(childData?.activeHomeworkTopic || '')) && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-bounce border-2 border-white z-10 pointer-events-none">
                🌟 ÖDEV
              </div>
            )}
          </div>

          <div className="relative w-full">
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
              Pati ile Konuş
            </Button>
          </div>
        </div>
      </div>

      {/* 2. MOBİL ALT NAVİGASYON BAR (5'li Sistem: Harita, Hikaye, Konuşma, Profil, Çıkış) */}
      <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg h-18 bg-white/95 backdrop-blur-2xl rounded-[35px] border-2 border-white shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-[100] px-3 items-center justify-between py-2", pathname.includes('/konusma') ? "hidden" : "flex lg:hidden")}>
        <button
          onClick={() => router.push(`/cocuk-modu/${childId}`)}
          className={cn(
            "flex-1 flex flex-col items-center gap-1 transition-all",
            pathname === `/cocuk-modu/${childId}` ? "text-sky-600 scale-110" : "text-slate-400"
          )}
        >
          <div className={cn("p-2 rounded-2xl", pathname === `/cocuk-modu/${childId}` ? "bg-sky-50" : "bg-transparent")}>
            <Map className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase">Harita</span>
        </button>

        <button
          onClick={() => router.push(`/cocuk-modu/${childId}/turkce-hazinem`)}
          className={cn(
            "relative flex-1 flex flex-col items-center gap-1 transition-all",
            pathname.includes('/turkce-hazinem') ? "text-amber-600 scale-110" : "text-slate-400"
          )}
        >
          <div className={cn("p-2 rounded-2xl", pathname.includes('/turkce-hazinem') ? "bg-amber-50" : "bg-transparent")}>
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase">Hazinem</span>
          {(Array.isArray(childData?.activeHomeworkTopics) ? childData.activeHomeworkTopics.some((t: string) => t.startsWith('chest-') || t.startsWith('tekrar-')) : typeof childData?.activeHomeworkTopic === 'string' && (childData.activeHomeworkTopic.startsWith('chest-') || childData.activeHomeworkTopic.startsWith('tekrar-'))) ? (
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md animate-bounce border border-white z-10 pointer-events-none">
              ÖDEV
            </div>
          ) : null}
        </button>

        <button
          onClick={() => router.push(`/cocuk-modu/${childId}/hikayeler`)}
          className={cn(
            "relative flex-1 flex flex-col items-center gap-1 transition-all",
            pathname.includes('/hikayeler') ? "text-purple-600 scale-110" : "text-slate-400"
          )}
        >
          <div className={cn("p-2 rounded-2xl", pathname.includes('/hikayeler') ? "bg-purple-50" : "bg-transparent")}>
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase">Hikaye</span>
          {['sari-top', 'bir-iki-uc-basardim', 'kaptan-kahvaltisi', 'gokusagi-partisi'].includes(childData?.activeHomeworkTopic || '') && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md animate-bounce border border-white z-10 pointer-events-none">
              ÖDEV
            </div>
          )}
        </button>

        <button
          onClick={() => router.push(`/cocuk-modu/${childId}/konusma`)}
          className={cn(
            "relative flex-1 flex flex-col items-center gap-1 transition-all",
            pathname.includes('/konusma') ? "text-green-600 scale-110" : "text-slate-400"
          )}
        >
          <div className={cn("p-2 rounded-2xl", pathname.includes('/konusma') ? "bg-green-50" : "bg-transparent")}>
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase">Konuşma</span>
        </button>

        {/* MOBİL PROFİL BUTONU (Sheet Tetikleyici) */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="flex-1 flex flex-col items-center gap-1 text-amber-500 hover:scale-110 transition-all">
              <div className="p-2 rounded-2xl bg-amber-50">
                <UserIcon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase">Profil</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[92vh] rounded-t-[50px] p-0 border-none bg-sky-50 overflow-y-auto">
            <div className="p-6 pb-20">
              <div className="w-16 h-1.5 bg-slate-300/50 rounded-full mx-auto mb-8" />
              <SheetTitle className="sr-only">Profilim</SheetTitle>
              <SheetDescription className="sr-only">Başarıların ve ilerlemen burada yer alır.</SheetDescription>

              <div className="flex flex-col gap-6">
                {/* Masaüstündeki Kartların Benzeri Ama Mobil Uyumlu */}
                <div className="relative w-full aspect-[4/5] mx-auto max-w-[320px]">
                  <div className={cn("absolute inset-0 rounded-[50px] shadow-2xl transition-colors duration-1000", rank.panel)} />
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <Image src={`/cerceveler/${rank.id}.png`} fill className="object-fill" alt="Frame" />
                  </div>
                  <div className="absolute inset-0 z-20 flex flex-col items-center">
                    <div className={cn("absolute w-full flex justify-center mt-2", rank.avatarTop)}>
                      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                        <DialogTrigger asChild>
                          <div className="relative group cursor-pointer">
                            <div className="relative w-36 h-36 bg-white rounded-full border-0 border-white/40 shadow-xl overflow-hidden">
                              <Image src={childData.avatarUrl || "/images/child-mode/avatar_fox.png"} fill className="object-contain scale-110 group-hover:scale-125 transition-all duration-500" alt="Avatar" />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Edit2 className="text-white w-8 h-8" />
                              </div>
                            </div>
                            <div className={cn("absolute bottom-0 right-[15%] bg-gradient-to-r text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-lg z-50", rank.badge)}>
                              {level}
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-[40px] p-8 border-none bg-white z-[1100]">
                          <DialogTitle className="text-2xl font-black text-blue-600 mb-2 text-center uppercase">Karakterini Seç!</DialogTitle>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-6 max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
                            {stickers.map((url: any, i) => (
                              <div key={i} onClick={() => handleSelectAvatar(url)} className="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-slate-100 p-3 hover:scale-110 transition-transform cursor-pointer">
                                <Image src={url} width={120} height={120} alt="Sticker" className="object-contain" />
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="absolute bottom-[12%] w-full px-8 flex flex-col items-center space-y-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className={cn("inline-flex px-4 py-1 rounded-full border shadow-sm cursor-help hover:scale-105 transition-all", rank.bg, rank.border)}>
                            <span className={cn("text-xs font-black uppercase italic", rank.color)}>{rank.title}</span>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-[40px] p-8 border-none bg-white z-[1100]">
                          <DialogTitle className="text-2xl font-black text-center mb-6 uppercase italic">Yolculuk Haritası</DialogTitle>
                          <div className="space-y-2">
                            {[
                              { l: "1-5", t: "🌱 Filiz Kaşif", d: "Maceraya yeni başlayanlar" },
                              { l: "6-12", t: "🐾 Pati Dostu", d: "Pati ile arkadaş olanlar" },
                              { l: "13-20", t: "🏹 Orman Rehberi", d: "Yolları keşfeden rehberler" },
                              { l: "21-28", t: "🛡️ Cesur Gezgin", d: "Zorlukları aşan gezginler" },
                              { l: "29-35", t: "💎 Bilge Muhafız", d: "Bilginin koruyucuları" },
                              { l: "36-45", t: "👑 Efsanevi Kahraman", d: "Maceranın efsanesi!" },
                              { l: "46-55", t: "🦅 Gökyüzü Hakimi", d: "Yükseklerin fatihi" },
                              { l: "56-65", t: "🌌 Galaksi Gezgini", d: "Yıldızların arasında" },
                              { l: "66-80", t: "⚡ Zaman Ustası", d: "Geçmişin ve geleceğin hakimi" },
                              { l: "81-100", t: "🔮 Rüya Büyücüsü", d: "Düşlerin sırrını çözenler" },
                              { l: "101+", t: "🌟 Sonsuz Işık", d: "Evrenin aydınlığı" },
                            ].map((r, i) => (
                              <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl border-2", level >= parseInt(r.l.split('-')[0]) ? "bg-amber-50 border-amber-200" : "opacity-30 grayscale")}>
                                <div className="flex-1">
                                  <p className="text-[10px] font-black text-slate-400">SEVİYE {r.l}</p>
                                  <h4 className="font-black text-slate-700">{r.t}</h4>
                                </div>
                                {level >= parseInt(r.l.split('-')[0]) ? <CheckCircle className="text-green-500 w-5 h-5" /> : <Star className="text-slate-300 w-5 h-5" />}
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <div className="w-full space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", rank.xpText)}>Puan: {xp}</span>
                          <span className={cn("text-[10px] font-black bg-white/80 px-2 py-0.5 rounded-full border", rank.xpText, rank.border)}>{xp % 100}/100</span>
                        </div>
                        <div className="w-full h-3.5 bg-white/50 rounded-full overflow-hidden border-2 border-white shadow-inner relative">
                          <div className={cn("h-full bg-gradient-to-r transition-all duration-1000", rank.theme)} style={{ width: `${xp % 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rozetler ve Etiketler */}
                <div className="bg-white/80 backdrop-blur-md rounded-[40px] p-6 shadow-xl border-4 border-white">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-blue-600 italic uppercase tracking-tighter flex items-center gap-2">
                      <Trophy className="w-6 h-6" /> Rozet Koleksiyonu
                    </h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase hover:bg-blue-200 transition-colors">HEPSİ 🚀</button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl rounded-[40px] p-8 md:p-12 border-none bg-gradient-to-br from-blue-50 via-white to-indigo-100 shadow-2xl overflow-y-auto max-h-[90vh] z-[1000]">
                        <DialogTitle className="text-3xl md:text-5xl font-black text-blue-600 mb-2 italic text-center uppercase tracking-tighter">Rozet Koleksiyonun</DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold text-center mb-10 text-lg">Başarılarınla parlayan madalyaların!</DialogDescription>

                        <div className="space-y-12">
                          {/* 1. Kategori: Ada ve Keşif */}
                          <div>
                            <div className="flex items-center gap-3 mb-6 px-4">
                              <div className="bg-amber-400 p-2 rounded-xl shadow-md rotate-3">
                                <Map className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="text-2xl font-black text-amber-600 italic uppercase tracking-tight">🏝️ ADA VE KEŞİF</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              {ISLAND_BADGES.map((badge) => {
                                const completedCount = childData?.completedTopics?.length || 0;
                                const isUnlocked = completedCount >= badge.requirement;

                                return (
                                  <div
                                    key={badge.id}
                                    className={cn(
                                      "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                                      !isUnlocked && "grayscale opacity-30"
                                    )}
                                  >
                                    <div className="relative w-full h-full p-2">
                                      <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                                    </div>
                                    <div className="text-center mt-1">
                                      <p className="text-[10px] font-black text-blue-600 uppercase italic tracking-tighter mb-0.5">{badge.name}</p>
                                      <p className="text-[8px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                                    </div>
                                    {!isUnlocked && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px]">
                                        <div className="bg-blue-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. Kategori: AI ve İletişim */}
                          <div>
                            <div className="flex items-center gap-3 mb-6 px-4">
                              <div className="bg-green-400 p-2 rounded-xl shadow-md -rotate-3">
                                <MessageCircle className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="text-2xl font-black text-green-600 italic uppercase tracking-tight">🤖 AI VE İLETİŞİM</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              {AI_BADGES.map((badge) => {
                                const aiStats = childData?.stats?.ai || {};

                                let isUnlocked = false;
                                if (badge.id === 'soru-makinesi') isUnlocked = (aiStats.whyHowQuestions || 0) >= badge.requirement;
                                if (badge.id === 'nezaket-elcisi') isUnlocked = (aiStats.politeWordsCount || 0) >= 5;
                                if (badge.id === 'geveze') isUnlocked = (aiStats.totalChats || 0) >= 50;
                                if (badge.id === 'kelime-avcisi') isUnlocked = (aiStats.uniqueWords?.length || 0) >= badge.requirement;
                                if (badge.id === 'en-iyi-dost') isUnlocked = (aiStats.consecutiveDays || 0) >= badge.requirement;

                                return (
                                  <div
                                    key={badge.id}
                                    className={cn(
                                      "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                                      !isUnlocked && "grayscale opacity-30"
                                    )}
                                  >
                                    <div className="relative w-full h-full mb-3">
                                      <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs font-black text-green-600 uppercase italic tracking-tighter mb-1">{badge.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                                    </div>
                                    {!isUnlocked && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px]">
                                        <div className="bg-green-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3. Kategori: Okuma ve Hikaye */}
                          <div>
                            <div className="flex items-center gap-3 mb-6 px-4">
                              <div className="bg-purple-400 p-2 rounded-xl shadow-md rotate-3">
                                <BookOpen className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="text-2xl font-black text-purple-600 italic uppercase tracking-tight">📚 OKUMA VE HİKAYE</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              {STORY_BADGES.map((badge) => {
                                const completedStories = childData?.completedStories || [];
                                let isUnlocked = false;

                                if (badge.id === 'ilk-sayfa') isUnlocked = completedStories.length >= 1;
                                if (badge.id === 'okuma-merdiveni') isUnlocked = completedStories.length >= 4;
                                if (badge.id === 'kutuphane-krali') isUnlocked = completedStories.length >= 10;
                                if (badge.id === 'dikkatli-gozler') isUnlocked = (childData?.stats?.story?.perfectScores || 0) >= 1;

                                return (
                                  <div
                                    key={badge.id}
                                    className={cn(
                                      "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                                      !isUnlocked && "grayscale opacity-30"
                                    )}
                                  >
                                    <div className="relative w-full h-full mb-3">
                                      <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs font-black text-purple-600 uppercase italic tracking-tighter mb-1">{badge.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                                    </div>
                                    {!isUnlocked && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px]">
                                        <div className="bg-purple-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 4. Kategori: Türkçe Hazinem */}
                          <div>
                            <div className="flex items-center gap-3 mb-6 px-4">
                              <div className="bg-rose-400 p-2 rounded-xl shadow-md rotate-3">
                                <Trophy className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="text-2xl font-black text-rose-600 italic uppercase tracking-tight">🏆 TÜRKÇE HAZİNEM</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              {TURKCE_HAZINEM_BADGES.map((badge) => {
                                let isUnlocked = false;
                                if (badge.type === 'all') {
                                  isUnlocked = (childData?.completedTopics || []).filter((t: string) => t.startsWith('chest-') && t.endsWith('-3')).length >= badge.requirement;
                                } else if (badge.type === 'story') {
                                  isUnlocked = (childData?.completedTopics || []).filter((t: string) => t.startsWith('chest-') && t.endsWith('-1')).length >= badge.requirement;
                                } else if (badge.type === 'lang') {
                                  isUnlocked = (childData?.completedTopics || []).filter((t: string) => t.startsWith('chest-') && t.endsWith('-2')).length >= badge.requirement;
                                } else if (badge.type === 'country') {
                                  isUnlocked = (childData?.completedTopics || []).filter((t: string) => t.startsWith('chest-') && t.endsWith('-3')).length >= badge.requirement;
                                }

                                return (
                                  <div
                                    key={badge.id}
                                    className={cn(
                                      "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                                      !isUnlocked && "grayscale opacity-30"
                                    )}
                                  >
                                    <div className="relative w-full h-full mb-3 flex items-center justify-center">
                                      <div className="absolute inset-0 bg-rose-100 rounded-full shadow-inner opacity-50 scale-75" />
                                      <Image src={badge.icon} fill alt={badge.name} className="object-contain z-10 drop-shadow-md" />
                                    </div>
                                    <div className="text-center z-10">
                                      <p className="text-xs font-black text-rose-600 uppercase italic tracking-tighter mb-1">{badge.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                                    </div>
                                    {!isUnlocked && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px] z-20">
                                        <div className="bg-rose-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 5. Kategori: Sosyal ve Davranış */}
                          <div>
                            <div className="flex items-center gap-3 mb-6 px-4">
                              <div className="bg-amber-400 p-2 rounded-xl shadow-md -rotate-3">
                                <Star className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="text-2xl font-black text-amber-600 italic uppercase tracking-tight">🌟 SOSYAL VE DAVRANIŞ</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              {SOCIAL_BADGES.map((badge) => {
                                const earnedBadges = childData?.earnedBadges || [];
                                let isUnlocked = earnedBadges.includes(badge.id);

                                if (!isUnlocked) {
                                  const loginStats = childData?.stats?.login || {};
                                  if (badge.id === 'duzenli-calisan') isUnlocked = (loginStats.consecutiveDays || 0) >= 5;
                                  if (badge.id === 'sabah-yildizi') isUnlocked = (loginStats.earlyBirdCount || 0) >= 1;
                                  if (badge.id === 'gece-kusu') isUnlocked = (loginStats.nightOwlCount || 0) >= 1;
                                  if (badge.id === 'azimli-kaplumbaga') isUnlocked = (childData?.stats?.perseverance?.retrySuccessCount || 0) >= 3;
                                }

                                return (
                                  <div
                                    key={badge.id}
                                    className={cn(
                                      "aspect-square bg-white/80 rounded-[35px] flex flex-col items-center justify-center border-4 border-white shadow-lg transition-all group relative p-6",
                                      !isUnlocked && "grayscale opacity-30"
                                    )}
                                  >
                                    <div className="relative w-full h-full mb-3">
                                      <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs font-black text-amber-600 uppercase italic tracking-tighter mb-1">{badge.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 leading-tight px-1">{badge.description}</p>
                                    </div>
                                    {!isUnlocked && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-[35px]">
                                        <div className="bg-amber-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">KİLİTLİ 🔒</div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {ISLAND_BADGES.slice(0, 8).map(badge => {
                      const isUnlocked = (childData?.completedTopics?.length || 0) >= badge.requirement;
                      return (
                        <Dialog key={badge.id}>
                          <DialogTrigger asChild>
                            <div className={cn("aspect-square bg-white rounded-2xl flex items-center justify-center border-2 border-slate-100 shadow-sm relative overflow-hidden cursor-pointer active:scale-95 p-2", !isUnlocked && "grayscale opacity-30")}>
                              <Image src={badge.icon} fill alt={badge.name} className="object-contain p-2.5" />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="rounded-[40px] border-none bg-white p-10 max-w-[400px] z-[1100]">
                            <div className="flex flex-col items-center text-center">
                              <div className={cn("w-32 h-32 relative mb-6", !isUnlocked && "grayscale opacity-30")}>
                                <Image src={badge.icon} fill alt={badge.name} className="object-contain" />
                              </div>
                              <DialogTitle className="text-3xl font-black text-blue-600 uppercase italic mb-2 tracking-tighter">{badge.name}</DialogTitle>
                              <DialogDescription className="text-slate-500 font-bold mb-6">{badge.description}</DialogDescription>
                              {!isUnlocked && (
                                <div className="bg-slate-100 px-6 py-3 rounded-2xl border-2 border-slate-200">
                                  <p className="text-xs font-black text-slate-400 uppercase">Bu rozeti kazanmak için daha fazla ada keşfetmelisin! 🚀</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#FFF9C4]/50 backdrop-blur-md rounded-[40px] p-6 shadow-xl border-4 border-white border-dashed">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-purple-600 italic uppercase tracking-tighter flex items-center gap-2">
                      <Star className="w-6 h-6 fill-current" /> Etiket Defteri
                    </h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="bg-purple-100 text-purple-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase hover:bg-purple-200 transition-colors">HEPSİ ✨</button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl rounded-[40px] p-8 border-none bg-gradient-to-br from-purple-50 to-white shadow-2xl overflow-y-auto max-h-[90vh] z-[1000]">
                        <DialogTitle className="text-3xl font-black text-purple-600 mb-6 italic text-center uppercase tracking-tighter">ETİKET DEFTERİN</DialogTitle>
                        <div className="grid grid-cols-3 gap-4">
                          {stickers.map((url: any, i) => (
                            <Dialog key={i}>
                              <DialogTrigger asChild>
                                <div className="aspect-square bg-white rounded-3xl flex items-center justify-center border-4 border-purple-50 shadow-sm hover:scale-105 transition-transform cursor-pointer relative overflow-hidden p-4">
                                  <Image src={url} fill alt="Sticker" className="object-contain p-4" />
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-sm rounded-[40px] p-0 overflow-hidden border-none bg-transparent shadow-none z-[1100]">
                                <DialogTitle className="sr-only">Etiket Görüntüle</DialogTitle>
                                <div className="bg-white p-10 flex flex-col items-center">
                                  <div className="relative w-48 h-48 drop-shadow-[0_20px_40px_rgba(168,85,247,0.4)] animate-in zoom-in duration-500">
                                    <Image src={url} fill alt="Sticker Big" className="object-contain" />
                                  </div>
                                  <div className="mt-8 bg-slate-50 px-6 py-2 rounded-full border-2 border-slate-100 shadow-sm">
                                    <p className="text-slate-600 font-black text-lg whitespace-nowrap">HARİKA BİR ÇIKARTMA! ✨</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {stickers.slice(0, 8).map((url: any, i) => (
                      <Dialog key={i}>
                        <DialogTrigger asChild>
                          <div className="aspect-square bg-white rounded-2xl flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer relative overflow-hidden p-2">
                            <Image src={url} fill alt="Sticker" className="object-contain p-2" />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm rounded-[40px] p-0 overflow-hidden border-none bg-transparent shadow-none z-[1100]">
                          <DialogTitle className="sr-only">Etiket Görüntüle</DialogTitle>
                          <div className="bg-white p-10 flex flex-col items-center">
                            <div className="relative w-48 h-48 drop-shadow-[0_20px_40px_rgba(168,85,247,0.4)] animate-in zoom-in duration-500">
                              <Image src={url} fill alt="Sticker Big" className="object-contain" />
                            </div>
                            <div className="mt-8 bg-slate-50 px-6 py-2 rounded-full border-2 border-slate-100 shadow-sm">
                              <p className="text-slate-600 font-black text-lg whitespace-nowrap">HARİKA BİR ÇIKARTMA! ✨</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                    {stickers.length === 0 && <p className="col-span-full text-center py-4 text-purple-400 font-bold italic">Henüz hiç etiketin yok! 🚀</p>}
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="w-px h-8 bg-slate-200 mx-1" />

        <ExitDialog childId={childId}>
          <button className="flex-1 flex flex-col items-center gap-1 text-red-500 hover:scale-110 transition-all">
            <div className="p-2 rounded-2xl bg-red-50">
              <LogOut className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase">Çıkış</span>
          </button>
        </ExitDialog>
      </div>
    </>
  );
}
