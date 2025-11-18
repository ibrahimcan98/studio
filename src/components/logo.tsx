import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold text-lg", className)}>
      <Image src="/logo.png" alt="Türk Çocuk Akademisi Logo" width={55} height={55} className="h-14" />
    </div>
  );
}
