
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
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';


type ChildHeaderProps = {
    childName: string;
    childId: string;
}

const LIFE_REGEN_SECONDS = 90 * 60; // 1 hour and 30 minutes
const MAX_LIVES = 5;


export function ChildHeader({ childName, childId }: ChildHeaderProps) {
    const { user: authUser } = useUser();
    const db = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid) return null;
        return doc(db, 'users', authUser.uid);
    }, [db, authUser?.uid]);

    const { data: userData } = useDoc(userDocRef);
    const isPremium = userData?.isPremium || false;
    const lives = userData?.lives ?? 5;
    const livesLastUpdatedAt = userData?.livesLastUpdatedAt;

    const childDocRef = useMemoFirebase(() => {
        if (!db || !authUser?.uid || !childId) return null;
        return doc(db, 'users', authUser.uid, 'children', childId as string);
    }, [db, authUser?.uid, childId]);

    const { data: childData } = useDoc(childDocRef);
    const badges = childData?.rozet || 0;

    useEffect(() => {
        if (!userDocRef || isPremium || typeof lives !== 'number' || lives >= MAX_LIVES || !livesLastUpdatedAt?.toDate) {
            return;
        }

        const interval = setInterval(async () => {
            const userSnap = await getDoc(userDocRef);
            const latestUserData = userSnap.data();
            
            if (!latestUserData) return;

            const currentLives = latestUserData.lives;
            const lastUpdatedTimestamp = latestUserData.livesLastUpdatedAt;

            if (currentLives >= MAX_LIVES || !lastUpdatedTimestamp?.toDate) {
                return;
            }

            const lastUpdated = lastUpdatedTimestamp.toDate();
            const now = new Date();
            const diffSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
            
            const livesToRegen = Math.floor(diffSeconds / LIFE_REGEN_SECONDS);

            if (livesToRegen > 0) {
                const newLiveCount = Math.min(MAX_LIVES, currentLives + livesToRegen);
                
                if (newLiveCount > currentLives) {
                    const secondsForLivesGained = (newLiveCount - currentLives) * LIFE_REGEN_SECONDS;
                    const newTimestampDate = new Date(lastUpdated.getTime() + secondsForLivesGained * 1000);

                    await updateDoc(userDocRef, {
                        lives: newLiveCount,
                        livesLastUpdatedAt: newTimestampDate
                    });
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [lives, isPremium, livesLastUpdatedAt, userDocRef]);


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
                            {lives === 'unlimited' || isPremium ? (
                                <InfinityIcon className="w-5 h-5" />
                            ) : (
                                <span className="text-lg font-bold">{Math.max(0, lives)}</span>
                            )}
                        </div>
                    </TooltipTrigger>
                    {!isPremium && lives !== 'unlimited' && (
                        <TooltipContent>
                             <p>
                                Canlar 1 saat 30 dakikada bir yenilenir.
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

    