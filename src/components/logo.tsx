import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold text-xl", className)}>
      <Image src="/favicon.ico" alt="Türk Çocuk Akademisi Logo" width={65} height={65} className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] object-contain" />
      <span className="hidden md:inline-block whitespace-nowrap tracking-tight">TÜRK ÇOCUK AKADEMİSİ</span>
    </div>
  );
}
