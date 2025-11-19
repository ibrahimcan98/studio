
'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Award, Crown, LogOut, Clock } from "lucide-react";
import { ExitDialog } from "./exit-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ChildHeaderProps = {
    childName: string;
    lives: number | 'unlimited';
    badges: number;
    isPremium: boolean;
    childId: string;
    livesLastUpdatedAt: any; // Can be Firestore Timestamp or null
    onLivesUpdate: (newLives: number) => void;
}

const LIFE_REGEN_HOURS = 2;
const MAX_LIVES = 5;

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export function ChildHeader({ childName, lives, badges, isPremium, childId, livesLastUpdatedAt, onLivesUpdate }: ChildHeaderProps) {
  const [countdown, setCountdown] = useState<string | null>(null);

   useEffect(() => {
    const currentLives = typeof lives === 'number' ? lives : 0;
    if (isPremium || lives === 'unlimited' || currentLives >= MAX_LIVES || !livesLastUpdatedAt?.toDate) {
        setCountdown(null);
        return;
    }
    
    let isMounted = true;

    const checkAndRegenerateLives = () => {
        if (!isMounted) return;
        const currentLivesVal = typeof lives === 'number' ? lives : 0;
        if (currentLivesVal >= MAX_LIVES) return;

        const lastUpdated = livesLastUpdatedAt.toDate();
        const now = new Date();
        const hoursPassed = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        const livesToRegen = Math.floor(hoursPassed / LIFE_REGEN_HOURS);

        if (livesToRegen > 0) {
            const newLives = Math.min(MAX_LIVES, currentLivesVal + livesToRegen);
            if (newLives > currentLivesVal) {
                onLivesUpdate(newLives);
            }
        }
    };
    
    checkAndRegenerateLives();

    const interval = setInterval(() => {
        if (!isMounted) return;
        const currentLivesVal = typeof lives === 'number' ? lives : 0;
        if (isPremium || currentLivesVal >= MAX_LIVES || !livesLastUpdatedAt?.toDate) {
            setCountdown(null);
            return;
        }

        const lastUpdated = livesLastUpdatedAt.toDate();
        const hoursSinceUpdate = (new Date().getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        const regeneratedLives = Math.floor(hoursSinceUpdate / LIFE_REGEN_HOURS);
        
        if(currentLivesVal + regeneratedLives >= MAX_LIVES){
             checkAndRegenerateLives();
             setCountdown(null);
             return;
        }
        
        const nextRegenTime = new Date(lastUpdated.getTime() + (regeneratedLives + 1) * LIFE_REGEN_HOURS * 60 * 60 * 1000);

        const now = new Date();
        const secondsRemaining = Math.max(0, (nextRegenTime.getTime() - now.getTime()) / 1000);

        if (secondsRemaining === 0) {
            checkAndRegenerateLives();
        } else {
            setCountdown(formatTime(secondsRemaining));
        }

    }, 1000);
    
    return () => {
        isMounted = false;
        clearInterval(interval);
    }

   }, [lives, isPremium, livesLastUpdatedAt, onLivesUpdate]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 text-xl">
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {childName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-lg">{childName}</h1>
            <p className="text-sm text-muted-foreground">Konuları seç</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 font-semibold text-destructive bg-red-100 px-3 py-1.5 rounded-lg">
                            <Heart className="w-5 h-5 fill-current" />
                            {lives === 'unlimited' ? (
                                <InfinityIcon className="w-5 h-5" />
                            ) : (
                                <div className="flex flex-col items-center leading-none">
                                     <span>{lives}/{MAX_LIVES}</span>
                                     {countdown && (
                                        <div className="flex items-center gap-1 text-xs font-mono text-red-500">
                                            <Clock className="w-3 h-3"/>
                                            {countdown}
                                        </div>
                                     )}
                                </div>
                            )}
                        </div>
                    </TooltipTrigger>
                    {!isPremium && lives !== 'unlimited' && (
                        <TooltipContent>
                            <p>Canlar 2 saatte bir yenilenir.</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>


          <div className="flex items-center gap-2 font-semibold text-yellow-500">
            <Award className="w-5 h-5 fill-current" />
            <span>{badges}</span>
          </div>
          {isPremium ? (
             <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 hidden sm:flex">
                <Crown className="mr-1 h-3 w-3" />
                Premium
            </Badge>
          ) : (
            <Button size="sm" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 hidden sm:inline-flex">Premium</Button>
          )}
          <ExitDialog childId={childId}>
            <Button variant="outline" size="icon">
                <LogOut className="w-4 h-4"/>
            </Button>
          </ExitDialog>
        </div>
      </div>
    </header>
  );
}

    