'use client';

import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

type Topic = {
    name: string;
    icon: string;
    words: number;
    unlocked: boolean;
};

type TopicCardProps = {
    topic: Topic;
    isPremium: boolean;
};

export function TopicCard({ topic, isPremium }: TopicCardProps) {
    const isLocked = !topic.unlocked && !isPremium;

  return (
    <Card className={`rounded-2xl transition-all hover:shadow-lg ${isLocked ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:-translate-y-1 cursor-pointer'}`}>
      <div className={`h-24 rounded-t-2xl flex items-center justify-center ${isLocked ? 'bg-gray-300' : 'bg-gray-100'}`}>
        <span className="text-4xl">{topic.icon}</span>
      </div>
      <div className="p-4">
        <h3 className={`font-bold text-lg ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>{topic.name}</h3>
        <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-muted-foreground'}`}>{topic.words} kelime</p>
      </div>
    </Card>
  );
}
