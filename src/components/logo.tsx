import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold text-lg", className)}>
      <Image src="/logo.png" alt="Türk Çocuk Akademisi Logo" width={50} height={50} />
      <span className="hidden md:inline-block whitespace-nowrap">TÜRK ÇOCUK AKADEMİSİ</span>
    </div>
  );
}
