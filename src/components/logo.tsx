import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="https://i.ibb.co/6yVpWfQ/turk-cocuk-akademisi-logo.png" 
        alt="Türk Çocuk Akademisi Logo" 
        width={50} 
        height={50} 
        className="w-auto"
      />
    </div>
  );
}
