
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Loader2, Sparkles, MessageCircle, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { assistantFlow, AssistantInput } from '@/ai/flows/assistant-flow';
import { assistantData } from '@/data/ai-assistant-data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

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
    const pathname = usePathname();
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const shouldBeHidden = pathname.startsWith('/ogretmen-portali') || 
                               pathname.startsWith('/cocuk-modu') ||
                               pathname.startsWith('/live-lesson');
        setIsHidden(shouldBeHidden);
        if (shouldBeHidden) {
            setIsOpen(false);
        }
    }, [pathname]);


    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if(isOpen && messages.length === 0) {
            setMessages([{ role: 'assistant', content: assistantData.greeting }]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, scrollToBottom]);


    const handleSend = async (customInput?: string) => {
        const textToSend = customInput || input;
        if (textToSend.trim() === '' || isLoading) return;

        const userMessage: Message = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMessage]);
        if (!customInput) setInput('');
        setIsLoading(true);
        scrollToBottom();
        
        try {
            const assistantInput: AssistantInput = {
                history: messages.map(m => ({ role: m.role, content: m.content })),
                question: textToSend,
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

    const toggleIntercom = () => {
        if (typeof window !== 'undefined' && (window as any).Intercom) {
            (window as any).Intercom('show');
            setIsOpen(false);
        } else {
            alert("Canlı destek sistemi şu an aktif değil.");
        }
    };
    
    if (isHidden) {
        return null;
    }

    // Always show suggestions if assistant just spoke and it's not loading
    const lastMessageWasAssistant = messages.length > 0 && messages[messages.length - 1].role === 'assistant';
    const showSuggestions = lastMessageWasAssistant && !isLoading;

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
                        className="rounded-full w-16 h-16 bg-gradient-to-br from-primary to-accent text-white shadow-2xl border-4 border-white"
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
                        <Card className="flex flex-col h-[70vh] max-h-[700px] shadow-2xl rounded-2xl overflow-hidden border-none">
                            <CardHeader className="flex flex-row items-center justify-between bg-primary p-4 text-white">
                                <div className="flex items-center gap-3">
                                    <Avatar className="border-2 border-white/20">
                                        <AvatarImage src={assistantData.avatarUrl} alt="AI Assistant" />
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{assistantData.name}</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Çevrimiçi</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10">
                                    <X className="w-5 h-5" />
                                </Button>
                            </CardHeader>
                            
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
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
                                            <Avatar className="w-8 h-8 shrink-0">
                                                <AvatarImage src={assistantData.avatarUrl} />
                                                <AvatarFallback>AI</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "max-w-[80%] rounded-2xl p-3 text-sm shadow-sm",
                                            message.role === 'user'
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                                        )}>
                                            <p className="leading-relaxed">{message.content}</p>
                                        </div>
                                         {message.role === 'user' && (
                                            <Avatar className="w-8 h-8 shrink-0">
                                                <AvatarFallback className="bg-slate-200 text-slate-500"><User className='w-4 h-4'/></AvatarFallback>
                                            </Avatar>
                                        )}
                                    </motion.div>
                                ))}

                                {showSuggestions && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-2 ml-11"
                                    >
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Devam etmek ister misiniz?</p>
                                        <div className="flex flex-col gap-2">
                                            {assistantData.suggestedQuestions.map((q, i) => (
                                                <Button 
                                                    key={i} 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="justify-start text-left h-auto py-2.5 px-3 rounded-xl border-slate-200 hover:border-primary hover:text-primary transition-all text-xs bg-white shadow-sm"
                                                    onClick={() => handleSend(q)}
                                                >
                                                    {q}
                                                </Button>
                                            ))}
                                            
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 mt-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="justify-start text-left h-auto py-2 px-3 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 transition-all text-[10px] bg-white font-bold"
                                                    onClick={toggleIntercom}
                                                >
                                                    <MessageSquareText className="w-3.5 h-3.5 mr-1.5" />
                                                    Siteden Destek
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="justify-start text-left h-auto py-2 px-3 rounded-xl border-green-200 text-green-600 hover:bg-green-50 transition-all text-[10px] bg-white font-bold"
                                                    asChild
                                                >
                                                    <a href={assistantData.liveSupportUrl} target="_blank" rel="noopener noreferrer">
                                                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                                                        WhatsApp
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                 {isLoading && (
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={assistantData.avatarUrl} />
                                            <AvatarFallback>AI</AvatarFallback>
                                        </Avatar>
                                        <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-bl-none shadow-sm">
                                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </CardContent>

                            <CardFooter className="p-4 border-t bg-white">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex w-full items-center gap-2"
                                >
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Bir soru sorun..."
                                        className="flex-1 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-primary h-11 rounded-xl"
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                    <Button 
                                        type="submit" 
                                        size="icon" 
                                        disabled={isLoading || input.trim() === ''}
                                        className="rounded-xl h-11 w-11 shrink-0 shadow-lg shadow-primary/20"
                                    >
                                        <Send className="w-4 h-4" />
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
