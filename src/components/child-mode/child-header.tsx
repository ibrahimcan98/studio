'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Award, Crown, LogOut } from "lucide-react";
import { ExitDialog } from "./exit-dialog";

type ChildHeaderProps = {
    childName: string;
    lives: number | 'unlimited';
    badges: number;
    isPremium: boolean;
    childId: string;
}

export function ChildHeader({ childName, lives, badges, isPremium, childId }: ChildHeaderProps) {
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
          <div className="flex items-center gap-2 font-semibold text-destructive">
            <Heart className="w-5 h-5 fill-current" />
            <span>{lives === 'unlimited' ? 'Sınırsız' : lives}</span>
          </div>
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
