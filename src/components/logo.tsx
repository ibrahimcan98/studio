import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="/logo.png" 
        alt="Türk Çocuk Akademisi Logo" 
        width={40} 
        height={40} 
        className="h-10 w-auto"
      />
      <span className="text-xl font-bold tracking-tight">
        Türk Çocuk Akademisi
      </span>
    </div>
  );
}
