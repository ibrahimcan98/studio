'use client';

import { useParams } from 'next/navigation';
import topicsData from '@/data/topics.json';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Word = {
    word: string;
    image: string;
    audio: string;
};

type Topic = {
    id: string;
    name: string;
    icon: string;
    words: number;
    unlocked: boolean;
    wordList: Word[];
};


export default function TopicPage() {
    const params = useParams();
    const { topicId } = params;
    const [topic, setTopic] = useState<Topic | null>(null);

    useEffect(() => {
        if(topicId) {
            const currentTopic = topicsData.find(t => t.id === topicId);
            if (currentTopic) {
                setTopic(currentTopic as Topic);
            }
        }
    }, [topicId]);


    if (!topic) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-amber-50">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-amber-50 min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center mb-8">{topic.name}</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {topic.wordList.map((word, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-white shadow-md">
                        <p className="text-lg font-semibold">{word.word}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
