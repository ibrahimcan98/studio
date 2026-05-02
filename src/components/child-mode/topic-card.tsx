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
  onClick: () => void;
}

export function TopicCard({ topic, number, onClick }: TopicCardProps) {
  // Renk temaları (CSS 3D silindir için üst ve alt renkler - Fallback olarak)
  const colorThemes = {
    green: { top: 'bg-gradient-to-br from-emerald-300 to-emerald-500', bottom: 'bg-emerald-700', border: 'border-emerald-200' },
    orange: { top: 'bg-gradient-to-br from-orange-300 to-orange-500', bottom: 'bg-orange-700', border: 'border-orange-200' },
    purple: { top: 'bg-gradient-to-br from-purple-300 to-purple-500', bottom: 'bg-purple-700', border: 'border-purple-200' },
    blue: { top: 'bg-gradient-to-br from-blue-300 to-blue-500', bottom: 'bg-blue-700', border: 'border-blue-200' },
  };

  const theme = colorThemes[topic.color as keyof typeof colorThemes] || colorThemes.blue;

  return (
    <div 
      className="relative cursor-pointer group flex flex-col items-center select-none"
      onClick={onClick}
    >
      {/* Yumuşak zemin gölgesi */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/15 rounded-[100%] blur-xl group-hover:scale-90 transition-transform duration-300" />
      
      {/* 3D Platform Konteyneri */}
      <div className="relative w-48 h-48">
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
        <div className="absolute inset-0 flex items-center justify-center">
            {topic.imageUrl ? (
                <div className="absolute inset-[-60px] z-20 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] translate-y-[-10px]">
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
      </div>

      {/* Modern İsim Etiketi */}
      <div className="mt-4 bg-white/95 backdrop-blur-md pl-2 pr-6 py-2 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.1)] border-2 border-white/50 relative z-20 group-hover:-translate-y-2 transition-transform duration-300 flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md border-2 border-white/50", theme.top)}>
          {number}
        </div>
        <span className="text-[13px] font-black text-slate-700 uppercase tracking-widest">{topic.name}</span>
      </div>
    </div>
  );
}
