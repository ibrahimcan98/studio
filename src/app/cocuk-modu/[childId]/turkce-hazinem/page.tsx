"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import {
  Loader2,
  Trophy,
  Coins,
  Gem,
  Compass,
  BookOpen,
  Brain,
  MapPin,
  X,
  Lock,
} from "lucide-react";
import { ChildSidebar } from "@/components/child-mode/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CHESTS_CONTENT, CHEST_DATA } from "@/data/turkce-hazinem-data";
import { motion, AnimatePresence } from "framer-motion";

// Yüzen elementler için bileşen
const FloatingElement = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn(
      "absolute opacity-20 animate-float-slow pointer-events-none z-0",
      className,
    )}
    style={style}
  >
    {children}
  </div>
);



export default function TurkceHazinemPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser, loading: authLoading } = useUser();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedChest, setSelectedChest] = useState<
    (typeof CHEST_DATA)[0] | null
  >(null);
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const [lockedPopupType, setLockedPopupType] = useState<
    "paywall" | "progress"
  >("paywall");

  // Firestore'dan parent (user) verilerini al (Paket bilgisi için)
  const userDocRef = useMemo(() => {
    if (!db || !authUser?.uid) return null;
    return doc(db, "users", authUser.uid);
  }, [db, authUser?.uid]);
  const { data: userData, isLoading: userLoading } = useDoc(userDocRef);

  // Firestore'dan çocuk verilerini al
  const childDocRef = useMemo(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, "users", authUser.uid, "children", childId);
  }, [db, authUser?.uid, childId]);
  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

  useEffect(() => {
    setIsMounted(true);
    const scrollPos = sessionStorage.getItem('chestScrollPos');
    if (scrollPos) {
      setTimeout(() => {
        const container = document.getElementById('chest-scroll-container');
        if (container) {
          container.scrollTop = parseInt(scrollPos, 10);
        }
      }, 100);
    }
  }, []);

  // Sandıkların pozisyonlarını hesapla (Eski konumlarına geri getirildi: 200px mesafe, %25 - %65)
  const chests = useMemo(() => {
    type ChestItem = {
      id: string | number;
      title: string;
      category: string;
      questions: number;
      isReview: boolean;
      isLocked: boolean;
      lockedReason: "none" | "paywall" | "progress";
    };
    const list: ChestItem[] = [];
    const isChildAssigned = userData?.subscriptionChildIds?.includes(childId as string);
    const subscriptionTier = (userData?.subscriptionTier !== 'free' && isChildAssigned) 
        ? (userData?.subscriptionTier as string) 
        : 'free';
    const completedTopics = childData?.completedTopics || [];
    let chestCount = 0;

    const isChestCompleted = (cId: string | number) => {
      const content = CHESTS_CONTENT[String(cId)];
      if (!content) return false;
      if (content.okuyorumAnliyorum && !completedTopics.includes(`chest-${cId}-1`))
        return false;
      if (content.dilimiOgreniyorum && !completedTopics.includes(`chest-${cId}-2`))
        return false;
      if (content.ulkemiOgreniyorum && !completedTopics.includes(`chest-${cId}-3`))
        return false;
      return true;
    };

    let previousChestCompleted = true; // The first chest is always unlocked structurally

    for (let i = 0; i < CHEST_DATA.length; i++) {
      const chestId = CHEST_DATA[i].id;
      const isHomework = Array.isArray(childData?.activeHomeworkTopics) ? childData.activeHomeworkTopics.includes(chestId) : childData?.activeHomeworkTopic === chestId;
      const isPaywallLocked = subscriptionTier === "free" && chestCount >= 1 && !isHomework;

      let lockedReason: "none" | "paywall" | "progress" = "none";
      if (isPaywallLocked) lockedReason = 'paywall';
      else if (!previousChestCompleted && !isHomework) lockedReason = 'progress';

      list.push({
        ...CHEST_DATA[i],
        isReview: false,
        isLocked: lockedReason !== 'none',
        lockedReason,
        isCompleted: isChestCompleted(chestId),
      });
      chestCount++;

      previousChestCompleted = isChestCompleted(chestId);

      // Her 5 sandıkta bir tekrar sandığı ekle
      if ((i + 1) % 5 === 0) {
        const tekrarId = `tekrar-${(i + 1) / 5}`;
        const isTekrarHomework = Array.isArray(childData?.activeHomeworkTopics) ? childData.activeHomeworkTopics.includes(tekrarId) : childData?.activeHomeworkTopic === tekrarId;
        const isTekrarPaywallLocked = subscriptionTier === "free" && !isTekrarHomework;

        let tekrarLockedReason: "none" | "paywall" | "progress" = "none";
        if (isTekrarPaywallLocked) tekrarLockedReason = 'paywall';
        else if (!previousChestCompleted && !isTekrarHomework) tekrarLockedReason = 'progress';

        list.push({
          id: tekrarId,
          title: `Genel Tekrar Sandığı ${(i + 1) / 5}`,
          category: "Genel Tekrar",
          questions: 10,
          isReview: true,
          isLocked: tekrarLockedReason !== 'none',
          lockedReason: tekrarLockedReason,
          isCompleted: isChestCompleted(tekrarId),
        });

        previousChestCompleted = isChestCompleted(tekrarId);
      }
    }

    return list.map((chest, i) => ({
      ...chest,
      top: `${350 + i * 200}px`,
      left: i % 2 === 0 ? "65%" : "25%",
    }));
  }, [userData?.subscriptionTier, userData?.subscriptionChildIds, childId]);

  // Yol çizimi için SVG path oluşturma
  const pathD = useMemo(() => {
    let d = "M 65% 350px"; // İlk sandık 350px'te
    for (let i = 1; i < chests.length; i++) {
      const prev = chests[i - 1];
      const curr = chests[i];
      const prevTop = parseInt(prev.top);
      const currTop = parseInt(curr.top);
      const midTop = (prevTop + currTop) / 2;
      d += ` Q 45% ${midTop}px ${curr.left} ${curr.top}`;
    }
    return d;
  }, [chests]);

  const mobilePathD = useMemo(() => {
    let d = "M 75% 350px"; // İlk sandık 350px'te
    for (let i = 1; i < chests.length; i++) {
      const prevTop = parseInt(chests[i - 1].top);
      const currTop = parseInt(chests[i].top);
      const currLeft = chests[i].left === "65%" ? "75%" : "25%";
      const midTop = (prevTop + currTop) / 2;
      d += ` Q 50% ${midTop}px ${currLeft} ${currTop}`;
    }
    return d;
  }, [chests]);

  if (!isMounted || authLoading || childLoading || userLoading) {
    return (
      <div className='h-screen w-full flex items-center justify-center bg-[#fef3c7]'>
        <Loader2 className='w-12 h-12 animate-spin text-amber-700' />
      </div>
    );
  }

  if (!childData) {
    return (
      <div className='h-screen w-full flex items-center justify-center bg-[#fef3c7]'>
        <p className='text-amber-900 font-bold'>Çocuk verisi bulunamadı.</p>
      </div>
    );
  }

  const totalHeight = 350 + (chests.length - 1) * 200 + 400; // Son sandık + marjin

  return (
    <div className='flex h-screen overflow-hidden font-sans relative'>
      {/* Sol Panel (Sidebar) */}
      <ChildSidebar childId={childId} childData={childData} />

      {/* SABİT ARKA PLAN (Gradient + Eskitilmiş Kağıt Dokusu) */}
      <div className='fixed inset-0 bg-gradient-to-b from-[#bae6fd] via-[#fef08a] to-[#fcd34d] z-0' />
      <div
        className="fixed inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] z-1"
        style={{ backgroundSize: "500px" }}
      />
      <div className="fixed inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/denim.png')] mix-blend-multiply z-2" />

      {/* Yüzen Efektler */}
      <div className='absolute inset-0 z-5 overflow-hidden pointer-events-none'>
        <FloatingElement
          className='top-[5%] left-[10%] text-amber-600/20'
          style={{ animationDelay: "0s" }}
        >
          <Coins className='w-16 h-16' />
        </FloatingElement>
        <FloatingElement
          className='top-[15%] right-[15%] text-amber-600/20'
          style={{ animationDelay: "2s" }}
        >
          <Gem className='w-12 h-12' />
        </FloatingElement>
        <FloatingElement
          className='top-[30%] left-[20%] text-amber-600/15'
          style={{ animationDelay: "4s" }}
        >
          <Compass className='w-20 h-20' />
        </FloatingElement>
      </div>

      {/* Ana İçerik Alanı */}
      <div 
        id="chest-scroll-container"
        className='flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10'
        onScroll={(e) => {
          sessionStorage.setItem('chestScrollPos', e.currentTarget.scrollTop.toString());
        }}
      >
        <div className='relative' style={{ minHeight: `${totalHeight}px` }}>
          <div className='w-full flex justify-center pt-12 flex-shrink-0'>
            <div className='text-center bg-white/90 p-6 rounded-[30px] shadow-lg border-4 border-amber-300 backdrop-blur-sm max-w-xl'>
              <div className='inline-flex items-center gap-3 bg-amber-100/80 px-6 py-2 rounded-full border-2 border-amber-300 shadow-md mb-4'>
                <Trophy className='w-6 h-6 text-amber-600' />
                <span className='text-amber-800 font-black uppercase tracking-widest text-sm'>
                  Büyük Yaş Grubu
                </span>
              </div>
              <h1 className='text-5xl font-black text-amber-900 mb-2 uppercase italic tracking-tighter drop-shadow-md'>
                Türkçe Hazinem
              </h1>
              <p className='text-lg text-amber-800 font-medium italic'>
                Kelimelerin ve bilgilerin gizemli dünyasını keşfet! 🗺️✨
              </p>
            </div>
          </div>

          {/* Masaüstü SVG Yolu */}
          <svg
            className='hidden md:block absolute inset-0 w-full h-full pointer-events-none'
            style={{ zIndex: 5 }}
          >
            <path
              d={pathD}
              stroke='rgba(180, 83, 9, 0.5)'
              strokeWidth='6'
              fill='transparent'
              strokeDasharray='12 12'
              strokeLinecap='round'
            />
          </svg>

          {/* Mobil SVG Yolu */}
          <svg
            className='block md:hidden absolute inset-0 w-full h-full pointer-events-none'
            style={{ zIndex: 5 }}
          >
            <path
              d={mobilePathD}
              stroke='rgba(180, 83, 9, 0.5)'
              strokeWidth='6'
              fill='transparent'
              strokeDasharray='12 12'
              strokeLinecap='round'
            />
          </svg>

          {/* Hazine Sandıkları */}
          {chests.map((chest, index) => (
            <div
              key={chest.id}
              className={cn(
                "absolute island-container flex flex-col items-center",
                !chest.isLocked && "animate-float",
              )}
              style={
                {
                  top: chest.top,
                  "--desktop-left": chest.left,
                  "--mobile-left": chest.left === "65%" ? "75%" : "25%",
                  animationDelay: `${index * 0.2}s`,
                  zIndex: 10,
                } as any
              }
            >
              <div
                className={cn(
                  "relative transition-all flex flex-col items-center justify-center gap-2 group w-[260px] h-[260px]",
                  chest.isLocked
                    ? "opacity-75 cursor-not-allowed filter grayscale"
                    : "cursor-pointer hover:scale-110 active:scale-95",
                )}
                onClick={() => {
                  if (!chest.isLocked) {
                    router.push(
                      `/cocuk-modu/${childId}/turkce-hazinem/${chest.id}`,
                    );
                  } else {
                    setLockedPopupType(
                      chest.lockedReason as "paywall" | "progress",
                    );
                    setShowLockedPopup(true);
                  }
                }}
              >
                {/* Sandık Numarası */}
                <div
                  className={cn(
                    "hidden md:flex absolute top-2 left-2 text-white w-8 h-8 rounded-full items-center justify-center font-black text-sm border-2 shadow-md z-20",
                    chest.isReview
                      ? "bg-purple-600 border-purple-300 w-auto px-2 h-8"
                      : "bg-amber-800 border-amber-200",
                  )}
                >
                  {chest.isReview ? "⭐" : chest.id}
                </div>

                {/* Premium Sembolü */}
                {chest.lockedReason === "paywall" && (
                  <div className='absolute -top-2 -right-2 z-30 bg-white rounded-full p-2 border-2 border-amber-400 shadow-lg animate-bounce'>
                    <Gem className='w-8 h-8 text-amber-500 drop-shadow-md' />
                  </div>
                )}

                {/* İlerleme Kilit Sembolü */}
                {chest.lockedReason === "progress" && (
                  <div className='absolute -top-2 -right-2 z-30 bg-slate-100 rounded-full p-2 border-2 border-slate-300 shadow-md'>
                    <Lock className='w-6 h-6 text-slate-500 drop-shadow-sm' />
                  </div>
                )}

                {/* Sandık Görseli */}
                <div className='relative w-56 h-56 flex items-center justify-center'>
                  <Image
                    src={
                      chest.isLocked
                        ? "/turkce-hazinem/sandik-kapali.png"
                        : "/turkce-hazinem/sandik-acik.png"
                    }
                    fill
                    className={cn(
                      "object-contain",
                      chest.isReview &&
                        "scale-110 hue-rotate-15 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]",
                    )}
                    alt={chest.title}
                  />
                </div>

                {/* Sandık Başlığı */}
                <div className='absolute -bottom-6 flex flex-col items-center gap-1 w-[300px] z-10'>
                  <div className="relative inline-flex flex-col items-center">
                    <span
                      className={cn(
                        "text-xs font-black uppercase tracking-wide text-center bg-white/95 px-5 py-1.5 rounded-full border-2 shadow-md",
                        chest.isLocked
                          ? "text-amber-600 border-amber-300"
                          : chest.isReview
                            ? "text-purple-900 border-purple-400 bg-purple-50"
                            : "text-amber-900 border-amber-300",
                      )}
                    >
                      {chest.isReview ? chest.title : `Sandık ${chest.id}`}
                    </span>
                    {(chest as any).isCompleted && (
                      <span className="absolute -bottom-3 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest shadow-sm border-2 border-white whitespace-nowrap z-20">
                        TAMAMLANDI
                      </span>
                    )}
                  </div>
                </div>

                {/* Parıltı Efekti (Açıksa) */}
                {!chest.isLocked && (
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full blur-xl group-hover:scale-150 transition-all duration-500 -z-10",
                      chest.isReview ? "bg-purple-400/30" : "bg-yellow-300/20",
                    )}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kilitli Sandık Uyarı Modalı */}
      <AnimatePresence>
        {showLockedPopup && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 bg-amber-900/40 backdrop-blur-sm'
              onClick={() => setShowLockedPopup(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className='bg-[#fffbeb] relative z-10 w-full max-w-md rounded-[32px] border-4 border-amber-300 p-8 shadow-2xl text-center flex flex-col items-center'
            >
              <button
                onClick={() => setShowLockedPopup(false)}
                className='absolute right-4 top-4 text-amber-700 hover:bg-amber-100 p-2 rounded-full transition-colors'
              >
                <X className='w-6 h-6' />
              </button>

              <div className='w-24 h-24 mb-6 relative'>
                <Image
                  src='/turkce-hazinem/sandik-kapali.png'
                  fill
                  className='object-contain'
                  alt='Kilitli'
                />
              </div>

              <h2 className='text-2xl font-black text-amber-900 mb-3 uppercase tracking-wide'>
                Sandık Kilitli! 🔒
              </h2>
              {lockedPopupType === "paywall" ? (
                <div className='space-y-4 w-full'>
                  <p className='text-lg text-amber-800 font-medium leading-relaxed'>
                    Bu harika maceraya devam etmek ve daha fazla şey öğrenmek
                    ister misin? 🌟
                  </p>
                  <p className='text-xl text-amber-900 font-bold leading-relaxed bg-amber-100 p-4 rounded-xl border border-amber-300'>
                    Anne veya babana <br />{" "}
                    <span className='text-purple-700'>
                      "Ben Türk Çocuk Akademisi'ni çok sevdim!"
                    </span>{" "}
                    <br /> diyebilirsin! 🥰
                  </p>
                </div>
              ) : (
                <p className='text-lg text-amber-800 font-medium leading-relaxed'>
                  Bu sandığı açabilmek için{" "}
                  <b className='text-amber-900'>önceki sandığı</b> tamamlaman
                  gerekiyor! Maceraya kaldığın yerden devam et! 🗺️
                </p>
              )}

              <div className='mt-8'>
                <button
                  onClick={() => setShowLockedPopup(false)}
                  className='bg-amber-500 hover:bg-amber-600 text-white font-black py-4 px-8 rounded-2xl shadow-[0_8px_0_0_#b45309] hover:translate-y-1 hover:shadow-[0_4px_0_0_#b45309] transition-all text-xl'
                >
                  Tamam! Anladım 👍
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .island-container {
          left: var(--desktop-left);
          transform: translateX(-50%);
          transition: left 0.5s ease-in-out;
        }
        @media (max-width: 768px) {
          .island-container {
            left: var(--mobile-left) !important;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(-50%) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) translateX(-50%) rotate(1deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) translateX(10px) rotate(5deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
