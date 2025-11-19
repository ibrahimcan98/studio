
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


type ChildHeaderProps = {
    childName: string;
    lives: number | 'unlimited';
    badges: number;
    isPremium: boolean;
    childId: string;
    livesLastUpdatedAt: any; // Can be Firestore Timestamp or null
    onLivesUpdate: (newLives: number, newTimestamp: any) => void;
}

const LIFE_REGEN_SECONDS = 5 * 60; // 5 minutes in seconds
const MAX_LIVES = 5;


export function ChildHeader({ childName, lives, badges, isPremium, childId, livesLastUpdatedAt, onLivesUpdate }: ChildHeaderProps) {
    
    useEffect(() => {
        let isMounted = true;

        const updateLives = () => {
            if (!isMounted || isPremium || typeof lives !== 'number' || lives >= MAX_LIVES || !livesLastUpdatedAt?.toDate) {
                return;
            }

            const lastUpdatedDate = livesLastUpdatedAt.toDate();
            let now = new Date();
            let timePassedSeconds = Math.floor((now.getTime() - lastUpdatedDate.getTime()) / 1000);
            
            let livesToRegen = Math.floor(timePassedSeconds / LIFE_REGEN_SECONDS);

            if (livesToRegen > 0) {
                const newLiveCount = Math.min(MAX_LIVES, lives + livesToRegen);
                 if (newLiveCount > lives) {
                    // Calculate the timestamp for the last life regenerated
                    const secondsForLivesGained = (newLiveCount - lives) * LIFE_REGEN_SECONDS;
                    const newTimestampDate = new Date(lastUpdatedDate.getTime() + secondsForLivesGained * 1000);

                    onLivesUpdate(newLiveCount, newTimestampDate);
                }
            }
        };
        
        updateLives();
        const interval = setInterval(updateLives, 60000); // Check every minute

        return () => {
            isMounted = false;
            clearInterval(interval);
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
                                <span className="text-lg font-bold">{Math.max(0, lives)}</span>
                            )}
                        </div>
                    </TooltipTrigger>
                    {!isPremium && lives !== 'unlimited' && (
                        <TooltipContent>
                             <p>
                                Canlar 5 dakikada bir yenilenir.
                            </p>
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

    