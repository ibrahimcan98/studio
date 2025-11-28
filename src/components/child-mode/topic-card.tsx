
'use client';

import { Card } from "@/components/ui/card";
import { Lock, Crown } from "lucide-react";

type Topic = {
    id: string;
    name: string;
    icon: string;
    words: number;
    unlocked: boolean;
    isPremium?: boolean;
};

type TopicCardProps = {
    topic: Topic;
    isPremium: boolean;
    isLocked: boolean;
    onClick: () => void;
    onComplete: () => void;
};

export function TopicCard({ topic, isPremium, isLocked, onClick }: TopicCardProps) {
    const isEffectivelyLocked = isLocked || (topic.isPremium && !isPremium);

    const handleClick = () => {
        if (!isEffectivelyLocked) {
            onClick();
        }
    };

  return (
    <Card 
        className={`relative rounded-2xl transition-all hover:shadow-lg ${isEffectivelyLocked ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:-translate-y-1 cursor-pointer'}`}
        onClick={handleClick}
    >
        {topic.isPremium && (
            <div className="absolute -top-3 -right-3 bg-yellow-400 p-1.5 rounded-full shadow-md z-10">
                <Crown className="w-5 h-5 text-yellow-900"/>
            </div>
        )}

      <div className={`h-24 rounded-t-2xl flex items-center justify-center ${isEffectivelyLocked ? 'bg-gray-300' : 'bg-gray-100'}`}>
        {isEffectivelyLocked ? <Lock className="w-8 h-8 text-gray-400"/> : <span className="text-4xl">{topic.icon}</span>}
      </div>
      <div className="p-4">
        <h3 className={`font-bold text-lg ${isEffectivelyLocked ? 'text-gray-500' : 'text-gray-800'}`}>{topic.name}</h3>
        <p className={`text-sm ${isEffectivelyLocked ? 'text-gray-400' : 'text-muted-foreground'}`}>{topic.words} kelime</p>
      </div>
    </Card>
  );
}
