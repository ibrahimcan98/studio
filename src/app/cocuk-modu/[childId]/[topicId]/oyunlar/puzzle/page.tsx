
'use client'
import { useParams } from 'next/navigation';
import topicsData from '@/data/topics.json';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import PuzzleClient from './puzzle-client';

type Word = {
    word: string;
    image: string;
    audio: string;
};

export default function PuzzlePage() {
    const params = useParams();
    const { topicId } = params;
    const [imageToSolve, setImageToSolve] = useState<string | null>(null);

    const topic = useMemo(() => {
        return topicsData.find(t => t.id === topicId);
    }, [topicId]);

    useEffect(() => {
        if (topic && topic.wordList.length > 0) {
            // Select a random image from the topic's word list for the puzzle
            const randomIndex = Math.floor(Math.random() * topic.wordList.length);
            setImageToSolve(topic.wordList[randomIndex].image);
        }
    }, [topic]);

    if (!imageToSolve) {
        return (
            <div className="flex h-screen items-center justify-center bg-amber-50">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return <PuzzleClient imageUrl={imageToSolve} />;
}
