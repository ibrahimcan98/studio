import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PatiAvatarProps {
  emotion?: string;
  isSpeaking?: boolean;
}

/**
 * Dinamik Pati Avatar
 * public/ai altındaki gorselleri kullanır.
 */
export function PatiAvatar({ emotion = 'oturuyor', isSpeaking = false }: PatiAvatarProps) {
  // Gelen emotion'ı dosya isimleriyle eşleştir
  const getImagePath = () => {
    // Eğer konuşuyorsa öncelikli olarak konuşma görselini göster
    if (isSpeaking) return '/ai/konusuyor.png';
    
    const validEmotions = [
      'cesaretlendiriyor',
      'goz-kirpiyor',
      'konusuyor',
      'oturuyor',
      'tebrik-ediyor',
      'zipliyor'
    ];

    if (validEmotions.includes(emotion)) {
      return `/ai/${emotion}.png`;
    }

    // Default mapping
    switch (emotion) {
      case 'happy': return '/ai/zipliyor.png';
      case 'excited': return '/ai/tebrik-ediyor.png';
      case 'thinking': return '/ai/oturuyor.png';
      case 'surprised': return '/ai/cesaretlendiriyor.png';
      case 'cool': return '/ai/goz-kirpiyor.png';
      default: return '/ai/oturuyor.png';
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center group">
      {/* Arka Işıltı */}
      <div className={cn(
        "absolute w-[80%] h-[80%] rounded-full blur-3xl transition-all duration-700 opacity-40",
        isSpeaking ? "bg-green-300 scale-110" : "bg-orange-200"
      )} />

      <div className="relative w-full h-full animate-float">
        <Image
          src={getImagePath()}
          fill
          className="object-contain drop-shadow-2xl transition-all duration-500"
          alt="Pati AI"
          priority
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
