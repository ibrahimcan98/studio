import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="https://i.ibb.co/mR5pwn6/logo.png" 
        alt="Türk Çocuk Akademisi Logo" 
        width={140} 
        height={35} 
        className="w-auto"
      />
    </div>
  );
}
