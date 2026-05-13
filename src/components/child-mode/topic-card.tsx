import { cn } from "@/lib/utils";
import Image from "next/image";

interface TopicCardProps {
  topic: {
    id: string;
    name: string;
    icon: string;
    color: string;
    imageUrl?: string;
  };
  number: number;
  isLocked?: boolean;
  isPremiumLocked?: boolean;
  onClick: () => void;
}

export function TopicCard({ topic, number, isLocked, isPremiumLocked, onClick }: TopicCardProps) {
  // Renk temaları (CSS 3D silindir için üst ve alt renkler - Fallback olarak)
  const colorThemes = {
    green: { top: 'bg-gradient-to-br from-emerald-300 to-emerald-500', bottom: 'bg-emerald-700', border: 'border-emerald-200' },
    orange: { top: 'bg-gradient-to-br from-orange-300 to-orange-500', bottom: 'bg-orange-700', border: 'border-orange-200' },
    purple: { top: 'bg-gradient-to-br from-purple-300 to-purple-500', bottom: 'bg-purple-700', border: 'border-purple-200' },
    blue: { top: 'bg-gradient-to-br from-blue-300 to-blue-500', bottom: 'bg-blue-700', border: 'border-blue-200' },
  };

  const theme = colorThemes[topic.color as keyof typeof colorThemes] || colorThemes.blue;
  const anyLocked = isLocked || isPremiumLocked;

  return (
    <div 
      className={cn(
        "relative group flex flex-col items-center select-none transition-all duration-500",
        anyLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Yumuşak zemin gölgesi */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/15 rounded-[100%] blur-xl group-hover:scale-90 transition-transform duration-300" />
      
      {/* 3D Platform Konteyneri */}
      <div className="relative w-32 h-32 md:w-48 md:h-48">
        {/* Alt Katman ve Üst Katman sadece görsel YOKSA gösterilir */}
        {!topic.imageUrl && (
          <>
            <div className={cn("absolute inset-0 rounded-[40px] rotate-45 translate-y-4", theme.bottom)} />
            <div className={cn(
              "absolute inset-0 rounded-[40px] rotate-45 border-4 flex items-center justify-center transition-all duration-200 group-hover:translate-y-2 group-active:translate-y-4 shadow-inner",
              theme.top,
              theme.border
            )}>
              <div className="transform -rotate-45 text-6xl drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                <span className="text-6xl">{topic.icon}</span>
              </div>
            </div>
          </>
        )}

        {/* İkon veya Şeffaf Görsel */}
        <div className={cn("absolute inset-0 flex items-center justify-center transition-all duration-500", anyLocked && "grayscale brightness-75")}>
            {topic.imageUrl ? (
                <div className={cn(
                  "absolute inset-[-40px] md:inset-[-60px] z-20 transition-transform duration-300 drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] translate-y-[-5px] md:translate-y-[-10px]",
                  !anyLocked && "group-hover:scale-110"
                )}>
                    <img 
                        src={topic.imageUrl} 
                        className="w-full h-full object-contain" 
                        style={{ mixBlendMode: 'multiply' }}
                        alt={topic.name} 
                    />
                </div>
            ) : (
                /* Emoji ikon sadece görsel yoksa platformun içinde gösterilir (yukarıda yapıldı) */
                null
            )}
        </div>

        {/* Kilit İkonu */}
        {anyLocked && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className={cn(
              "w-16 h-16 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl animate-pulse",
              isPremiumLocked ? "bg-amber-500/80" : "bg-slate-900/60"
            )}>
              {isPremiumLocked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modern İsim Etiketi */}
      <div className={cn(
        "mt-4 bg-white/95 backdrop-blur-md pl-2 pr-6 py-2 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.1)] border-2 border-white/50 relative z-20 transition-transform duration-300 flex items-center gap-3",
        !anyLocked && "group-hover:-translate-y-2"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md border-2 border-white/50", 
          anyLocked ? "bg-slate-400" : theme.top
        )}>
          {number}
        </div>
        <span className={cn(
          "text-[13px] font-black uppercase tracking-widest",
          anyLocked ? "text-slate-400" : "text-slate-700"
        )}>
          {topic.name}
        </span>
      </div>
    </div>

  );
}
