
'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Award, Crown, LogOut, Clock, Infinity as InfinityIcon } from "lucide-react";
import { ExitDialog } from "./exit-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { updateDocumentNonBlocking } from "@/firebase";
import { doc, serverTimestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase";


type ChildHeaderProps = {
    childName: string;
    lives: number | 'unlimited';
    badges: number;
    isPremium: boolean;
    childId: string;
    livesLastUpdatedAt: any; // Can be Firestore Timestamp or null
    onLivesUpdate: (newLives: number) => void;
}

const LIFE_REGEN_SECONDS = 2 * 60 * 60; // 2 hours in seconds
const MAX_LIVES = 5;

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export function ChildHeader({ childName, lives, badges, isPremium, childId, livesLastUpdatedAt, onLivesUpdate }: ChildHeaderProps) {
    const [countdown, setCountdown] = useState<string | null>(null);
    const db = useFirestore();

    useEffect(() => {
        let isMounted = true;

        const timer = setInterval(() => {
            if (!isMounted) return;

            const currentLives = typeof lives === 'number' ? lives : MAX_LIVES;

            if (isPremium || currentLives >= MAX_LIVES) {
                setCountdown(null);
                return;
            }

            if (!livesLastUpdatedAt?.toDate) {
                setCountdown(null);
                return;
            }

            const lastUpdatedDate = livesLastUpdatedAt.toDate();
            const now = new Date();
            
            const timePassedSinceUpdate = Math.floor((now.getTime() - lastUpdatedDate.getTime()) / 1000);
            
            // Calculate how many full life-cycles have passed
            const livesToRegenerate = Math.floor(timePassedSinceUpdate / LIFE_REGEN_SECONDS);

            if (livesToRegenerate > 0) {
                const newTotalLives = Math.min(MAX_LIVES, currentLives + livesToRegenerate);
                if (newTotalLives > currentLives) {
                    onLivesUpdate(newTotalLives);
                    // The component will re-render with new props, restarting the effect.
                    return; 
                }
            }

            // Calculate seconds remaining for the next life
            const secondsIntoCurrentCycle = timePassedSinceUpdate % LIFE_REGEN_SECONDS;
            const secondsRemaining = LIFE_REGEN_SECONDS - secondsIntoCurrentCycle;

            setCountdown(formatTime(secondsRemaining));

        }, 1000);

        // Cleanup function
        return () => {
            isMounted = false;
            clearInterval(timer);
        };

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
                                <div className="flex items-center gap-2">
                                     <span className="text-lg font-bold">{lives}</span>
                                     {countdown && lives < MAX_LIVES && (
                                        <div className="flex items-center gap-1 text-xs font-mono text-red-500 bg-white/50 px-1 rounded">
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
                             <p>
                                { (typeof lives === 'number' && lives < MAX_LIVES)
                                    ? `Sonraki can ${countdown} sonra`
                                    : "Canlar dolu!"
                                }
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Canlar 2 saatte bir yenilenir.</p>
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

    

    