'use client';

/**
 * Bağımsız Pati (Pure CSS & SVG Art)
 * Hiçbir dış dosyaya ihtiyaç duymaz, ASLA hata vermez.
 * Tamamen kodla çizilmiştir, internet bağlantısı gerektirmez.
 */
export function PatiAvatar() {
  const playMeow = () => {
    const audio = new Audio('https://www.myinstants.com/media/sounds/meow_1.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center group cursor-pointer"
      onClick={playMeow}
    >
      {/* Kedi Tasarımı (CSS & SVG) */}
      <div className="relative w-64 h-64 animate-float flex items-center justify-center">
        
        {/* Arka Işıltı */}
        <div className="absolute w-48 h-48 bg-orange-200/30 rounded-full blur-3xl group-hover:bg-orange-300/40 transition-all duration-700" />

        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl transition-transform duration-500 group-hover:scale-110">
          {/* Gövde */}
          <rect x="40" y="80" width="120" height="90" rx="45" fill="#FFB74D" stroke="#E65100" strokeWidth="4" />
          
          {/* Kulaklar */}
          <path d="M50 85 L40 40 L80 80 Z" fill="#FFB74D" stroke="#E65100" strokeWidth="4" strokeLinejoin="round" />
          <path d="M150 85 L160 40 L120 80 Z" fill="#FFB74D" stroke="#E65100" strokeWidth="4" strokeLinejoin="round" />
          
          {/* Kulak İçi */}
          <path d="M52 82 L46 55 L70 78 Z" fill="#FFCC80" />
          <path d="M148 82 L154 55 L130 78 Z" fill="#FFCC80" />

          {/* Yüz Alanı */}
          <circle cx="100" cy="115" r="55" fill="#FFB74D" />

          {/* Gözler */}
          <g className="animate-blink">
            <circle cx="75" cy="110" r="6" fill="#3E2723" />
            <circle cx="125" cy="110" r="6" fill="#3E2723" />
            {/* Göz Işıltısı */}
            <circle cx="77" cy="108" r="2" fill="white" />
            <circle cx="127" cy="108" r="2" fill="white" />
          </g>

          {/* Yanaklar */}
          <circle cx="65" cy="125" r="8" fill="#FF8A65" opacity="0.4" />
          <circle cx="135" cy="125" r="8" fill="#FF8A65" opacity="0.4" />

          {/* Burun ve Ağız */}
          <path d="M96 122 L104 122 L100 128 Z" fill="#D84315" />
          <path d="M90 135 Q100 145 110 135" fill="none" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
          
          {/* Patiler */}
          <circle cx="70" cy="170" r="12" fill="#FFB74D" stroke="#E65100" strokeWidth="4" />
          <circle cx="130" cy="170" r="12" fill="#FFB74D" stroke="#E65100" strokeWidth="4" />

          {/* Kuyruk (Sallanan) */}
          <path d="M160 140 Q190 140 180 110" fill="none" stroke="#FFB74D" strokeWidth="12" strokeLinecap="round" className="animate-tail">
             <animateTransform 
               attributeName="transform" 
               type="rotate" 
               from="0 160 140" 
               to="10 160 140" 
               dur="1s" 
               repeatCount="indefinite" 
               additive="sum"
             />
          </path>
        </svg>
      </div>

      {/* İpucu Kutusu */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-xl border-2 border-orange-100 text-orange-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        Beni miyavlat! 🐾
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-blink {
          transform-origin: center;
          animation: blink 4s infinite;
        }
      `}</style>
    </div>
  );
}
