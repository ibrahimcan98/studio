'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Award, Crown, LogOut, Infinity as InfinityIcon, Star, Sparkles } from "lucide-react";
import { ExitDialog } from "./exit-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type ChildSidebarProps = {
    childData: any;
    userData: any;
    childId: string;
}

const MAX_LIVES = 5;

export function ChildSidebar({ childData, userData, childId }: ChildSidebarProps) {
    const isPremium = userData?.isPremium || false;
    const lives = userData?.lives ?? 5;
    const badges = childData?.rozet || 0;
    const stickers = 5; // Placeholder for stickers

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-400 to-blue-600 text-white flex flex-col items-center p-4 shadow-2xl z-20">
      <div className="flex flex-col items-center text-center mt-4">
        <Avatar className="h-24 w-24 text-4xl border-4 border-white/50 mb-3">
          <AvatarFallback className="bg-white/20 text-white font-bold">
            {childData.firstName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{childData.firstName}</h2>
        {isPremium && (
            <Badge className="mt-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90">
                <Crown className="mr-1 h-3 w-3" />
                Premium
            </Badge>
        )}
      </div>

      <div className="w-full space-y-6 mt-10 text-lg">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Heart className="w-7 h-7 text-red-400 fill-current" />
                            <span className="font-bold">Can</span>
                        </div>
                        <span className="font-bold text-2xl">
                           {isPremium ? <InfinityIcon className="w-7 h-7" /> : Math.max(0, lives)}
                        </span>
                    </div>
                </TooltipTrigger>
                {!isPremium && <TooltipContent>Canlar 1 saat 30 dakikada bir yenilenir.</TooltipContent>}
            </Tooltip>
        </TooltipProvider>

         <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
            <div className="flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-yellow-300" />
                <span className="font-bold">Sticker</span>
            </div>
            <span className="font-bold text-2xl">{stickers}</span>
        </div>

        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
            <div className="flex items-center gap-2">
                <Award className="w-7 h-7 text-amber-400" />
                <span className="font-bold">Rozet</span>
            </div>
            <span className="font-bold text-2xl">{badges}</span>
        </div>
      </div>
      
      <div className="mt-auto w-full">
        <ExitDialog childId={childId}>
            <Button variant="outline" className="w-full bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/20">
                <LogOut className="mr-2"/>
                Çıkış Yap
            </Button>
        </ExitDialog>
      </div>
    </aside>
  );
}
