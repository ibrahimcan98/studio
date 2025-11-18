'use client'
import { useParams } from 'next/navigation';
import topicsData from '@/data/topics.json';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import GameClient from './game-client';

type Word = {
    word: string;
    image: string;
    audio: string;
};

// Function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function SesliSecmePage() {
    const params = useParams();
    const { topicId } = params;
    const [wordList, setWordList] = useState<Word[] | null>(null);

    const topic = useMemo(() => {
        return topicsData.find(t => t.id === topicId);
    }, [topicId]);

    useEffect(() => {
        if (topic) {
            const allWordsFromOtherTopics = topicsData
                .filter(t => t.id !== topicId)
                .flatMap(t => t.wordList);

            const generateQuestions = () => {
                return topic.wordList.map(correctWord => {
                    // Get 3 random incorrect words from other topics
                    const incorrectOptions = shuffleArray(allWordsFromOtherTopics)
                        .filter(w => w.word !== correctWord.word)
                        .slice(0, 3);
                    
                    const options = shuffleArray([...incorrectOptions, correctWord]);
                    
                    return {
                        question: `${correctWord.word} nerede?`,
                        audio: correctWord.audio,
                        options,
                        correctAnswer: correctWord,
                    };
                });
            };

            const questions = generateQuestions();
             // @ts-ignore
            setWordList(questions);
        }
    }, [topic, topicId]);

    if (!wordList) {
        return (
            <div className="flex h-screen items-center justify-center bg-amber-50">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return <GameClient questions={wordList} />;
}
