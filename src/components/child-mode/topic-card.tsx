'use client';

import { Lock, Crown, CheckCircle2 } from "lucide-react";
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type Topic = {
    id: string;
    name: string;
    icon: string;
    isPremium?: boolean;
};

type TopicCardProps = {
    topic: Topic;
    isPremium: boolean;
    isLocked: boolean;
    isCompleted: boolean;
    onClick: () => void;
};

export function TopicCard({ topic, isPremium, isLocked, isCompleted, onClick }: TopicCardProps) {
    const isEffectivelyLocked = isLocked || (topic.isPremium && !isPremium);

    const handleClick = () => {
        if (!isEffectivelyLocked) {
            onClick();
        }
    };

    let content;
    let cardClasses = "bg-white/80 backdrop-blur-sm border-2 border-white/90";
    let tooltipContent = topic.name;

    if(isEffectivelyLocked) {
        content = <Lock className="w-8 h-8 text-gray-500" />;
        cardClasses = "bg-gray-300/80 border-gray-400/50 cursor-not-allowed";
        tooltipContent = topic.isPremium && !isPremium ? `${topic.name} (Premium Gerekli)` : `${topic.name} (Kilitli)`;
    } else if (isCompleted) {
        content = <CheckCircle2 className="w-10 h-10 text-green-500" />;
        cardClasses = "bg-green-100/90 border-2 border-green-300/90";
    } else {
        content = <span className="text-5xl">{topic.icon}</span>;
    }


  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    onClick={handleClick}
                    className={cn(
                        "w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110",
                        cardClasses,
                        !isEffectivelyLocked && "cursor-pointer"
                    )}
                >
                     {topic.isPremium && !isCompleted && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 p-1.5 rounded-full shadow-md z-10">
                            <Crown className="w-4 h-4 text-yellow-900"/>
                        </div>
                    )}
                    {content}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipContent}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
