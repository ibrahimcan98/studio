import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold", className)} suppressHydrationWarning>
      <Image src="/logo.png" alt="Türk Çocuk Akademisi Logo" width={55} height={55} className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] object-contain shrink-0" />
      <div className="flex flex-col leading-tight tracking-tight">
        <span className="text-[13px] md:text-[14px] font-black whitespace-nowrap text-slate-900 leading-none">TÜRK ÇOCUK</span>
        <span className="text-[11px] md:text-[12px] font-bold whitespace-nowrap text-slate-500 leading-none">AKADEMİSİ</span>
      </div>
    </div>
  );
}
