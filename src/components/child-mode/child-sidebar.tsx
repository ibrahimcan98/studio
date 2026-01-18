'use client';

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Heart, Award, Crown, LogOut, Infinity as InfinityIcon, Sparkles } from "lucide-react";
import { ExitDialog } from "./exit-dialog";

type ChildSidebarProps = {
    childData: any;
    userData: any;
    childId: string;
}

export function ChildSidebar({ childData, userData, childId }: ChildSidebarProps) {
    const isPremium = userData?.isPremium || false;
    const lives = userData?.lives ?? 5;
    const badges = childData?.rozet || 0;
    const stickers = 5; // Placeholder for stickers

  return (
    <aside className="w-72 h-screen bg-blue-400/80 backdrop-blur-sm text-white flex flex-col items-center p-6 shadow-2xl z-20 border-r-4 border-white/50">
      <div className="flex flex-col items-center text-center mt-4">
        <div className="relative w-48 h-48 mb-3">
          <Image src="/ch1.png" alt={childData.firstName} layout="fill" objectFit="contain" />
        </div>
        <h2 className="text-2xl font-bold">{childData.firstName}</h2>
        {isPremium && (
            <div className="flex items-center gap-1 mt-2 text-yellow-300">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Premium</span>
            </div>
        )}
      </div>

      <div className="w-full space-y-4 mt-8 text-lg">
         <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
            <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-300" />
                <span className="font-bold">Sticker</span>
            </div>
            <span className="font-bold text-3xl">{stickers}</span>
        </div>

        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
            <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-400" />
                <span className="font-bold">Rozet</span>
            </div>
            <span className="font-bold text-3xl">{badges}</span>
        </div>

        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
            <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-400 fill-current" />
                <span className="font-bold">Can</span>
            </div>
            <span className="font-bold text-3xl">
                {isPremium ? <InfinityIcon className="w-8 h-8" /> : Math.max(0, lives)}
            </span>
        </div>
      </div>
      
      <div className="mt-auto w-full">
        <ExitDialog childId={childId}>
            <Button variant="outline" className="w-full bg-white/20 text-white hover:bg-white/30 hover:text-white border-white/30 h-14 text-lg">
                <LogOut className="mr-2"/>
                Çıkış Yap
            </Button>
        </ExitDialog>
      </div>
    </aside>
  );
}
