'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { assistantFlow, AssistantInput } from '@/ai/flows/assistant-flow';
import { assistantData } from '@/data/ai-assistant-data';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if(isOpen && messages.length === 0) {
            // Add initial greeting when chat opens for the first time
            setMessages([{ role: 'assistant', content: assistantData.greeting }]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, scrollToBottom]);


    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        scrollToBottom();
        
        try {
            const assistantInput: AssistantInput = {
                history: messages.map(m => ({ role: m.role, content: m.content })),
                question: input,
            };
            const result = await assistantFlow(assistantInput);
            
            const assistantMessage: Message = { role: 'assistant', content: result.answer };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error("AI Assistant Error:", error);
            const errorMessage: Message = { role: 'assistant', content: "Üzgünüm, bir sorun oluştu. Lütfen daha sonra tekrar deneyin." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
             setTimeout(scrollToBottom, 100);
        }
    };
    
    return (
        <>
            {/* Chat Bubble */}
            <div className="fixed bottom-6 right-6 z-50">
                 <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 120 }}
                >
                    <Button
                        size="icon"
                        className="rounded-full w-16 h-16 bg-gradient-to-br from-primary to-accent text-white shadow-2xl"
                        onClick={() => setIsOpen(true)}
                    >
                        <Sparkles className="w-8 h-8" />
                    </Button>
                </motion.div>
            </div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed bottom-6 right-6 sm:bottom-24 sm:right-6 z-[100] w-[calc(100%-3rem)] max-w-sm"
                    >
                        <Card className="flex flex-col h-[70vh] max-h-[700px] shadow-2xl rounded-2xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4 border-b">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={assistantData.avatarUrl} alt="AI Assistant" />
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{assistantData.name}</p>
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">Çevrimiçi</Badge>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                                {messages.map((message, index) => (
                                     <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 * index }}
                                        className={cn(
                                            "flex items-start gap-3",
                                            message.role === 'user' ? 'justify-end' : 'justify-start'
                                        )}
                                    >
                                        {message.role === 'assistant' && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={assistantData.avatarUrl} />
                                                <AvatarFallback>AI</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "max-w-xs rounded-2xl p-3 text-sm",
                                            message.role === 'user'
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted rounded-bl-none"
                                        )}>
                                            <p>{message.content}</p>
                                        </div>
                                         {message.role === 'user' && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback><User className='w-4 h-4'/></AvatarFallback>
                                            </Avatar>
                                        )}
                                    </motion.div>
                                ))}
                                 {isLoading && (
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={assistantData.avatarUrl} />
                                            <AvatarFallback>AI</AvatarFallback>
                                        </Avatar>
                                        <div className="p-3 bg-muted rounded-2xl rounded-bl-none">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </CardContent>
                            <CardFooter className="p-4 border-t bg-muted/50">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex w-full items-center gap-2"
                                >
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Bir soru sorun..."
                                        className="flex-1"
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading || input.trim() === ''}>
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
