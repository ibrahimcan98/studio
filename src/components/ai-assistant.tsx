'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Loader2, MessageSquareText, ArrowLeft, Headphones, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { assistantFlow, AssistantInput } from '@/ai/flows/assistant-flow';
import { assistantData } from '@/data/ai-assistant-data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, setDoc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { LiveChatForm } from './chat/live-chat-form';
import { WhatsappSupportForm } from './chat/whatsapp-support-form';

type Message = {
    role: 'user' | 'assistant' | 'admin' | 'ai';
    content: string;
    createdAt?: any;
};

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'ai' | 'live' | 'whatsapp' | 'form-live' | 'form-whatsapp'>('ai');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const db = useFirestore();
    const { user } = useUser();
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

    useEffect(() => {
        const savedId = typeof window !== 'undefined' ? localStorage.getItem('tca_conversation_id') : null;
        if (savedId) setCurrentConversationId(savedId);
    }, []);

    // Basitleştirilmiş mesaj sorgusu (Permissions hatasını önlemek için filtreleri azalttık)
    const messagesQuery = useMemoFirebase(() => {
        if (!db || !currentConversationId || mode !== 'live') return null;
        return query(
            collection(db, 'messages'),
            where('conversationId', '==', currentConversationId)
        );
    }, [db, currentConversationId, mode]);

    const { data: rawLiveMessages } = useCollection(messagesQuery);

    // Mesajları client-side'da sıralıyoruz
    const liveMessages = useMemo(() => {
        if (!rawLiveMessages) return [];
        return [...rawLiveMessages].sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeA - timeB;
        });
    }, [rawLiveMessages]);

    useEffect(() => {
        const shouldBeHidden = pathname.startsWith('/ogretmen-portali') || 
                               pathname.startsWith('/cocuk-modu') ||
                               pathname.startsWith('/live-lesson') ||
                               pathname.startsWith('/yonetici');
        if (shouldBeHidden) setIsOpen(false);
    }, [pathname]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (isOpen && messages.length === 0 && mode === 'ai') {
            setMessages([{ role: 'assistant', content: assistantData.greeting }]);
        }
    }, [isOpen, messages.length, mode]);

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, liveMessages, isOpen, scrollToBottom]);

    const handleSend = async (customInput?: string) => {
        const textToSend = customInput || input;
        if (textToSend.trim() === '' || isLoading) return;

        if (mode === 'ai') {
            const userMessage: Message = { role: 'user', content: textToSend };
            setMessages(prev => [...prev, userMessage]);
            if (!customInput) setInput('');
            setIsLoading(true);

            try {
                const assistantInput: AssistantInput = {
                    history: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
                    question: textToSend,
                };
                const result = await assistantFlow(assistantInput);
                setMessages(prev => [...prev, { role: 'assistant', content: result.answer }]);
            } catch (error) {
                setMessages(prev => [...prev, { role: 'assistant', content: "Üzgünüm, bir sorun oluştu." }]);
            } finally {
                setIsLoading(false);
            }
        } else if (mode === 'live' && currentConversationId && db) {
            if (!customInput) setInput('');
            
            const msgRef = doc(collection(db, 'messages'));
            setDoc(msgRef, {
                conversationId: currentConversationId,
                text: textToSend,
                senderType: 'anonymous',
                createdAt: serverTimestamp()
            });

            const convRef = doc(db, 'conversations', currentConversationId);
            updateDoc(convRef, {
                lastMessageAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
    };

    const startLiveChat = async (formData: any) => {
        if (!db) return;

        const convRef = doc(collection(db, 'conversations'));
        const convData = {
            status: 'open',
            channel: 'website',
            needsHuman: true,
            topic: formData.topic,
            assignedTeam: formData.topic === 'kurslar' ? 'Eğitim' : 'Teknik/Satış',
            createdBy: {
                type: 'anonymous',
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastMessageAt: serverTimestamp()
        };

        setDoc(convRef, convData);
        
        const msgRef = doc(collection(db, 'messages'));
        setDoc(msgRef, {
            conversationId: convRef.id,
            text: `Destek talebi başlatıldı. Konu: ${formData.topic}. Mesaj: ${formData.message}`,
            senderType: 'anonymous',
            createdAt: serverTimestamp()
        });

        setCurrentConversationId(convRef.id);
        localStorage.setItem('tca_conversation_id', convRef.id);
        setMode('live');
    };

    const handleWhatsappSubmit = async (formData: any) => {
        if (!db) return;

        const ticketId = Math.random().toString(36).substring(7).toUpperCase();
        const convRef = doc(collection(db, 'conversations'));
        setDoc(convRef, {
            status: 'open',
            channel: 'whatsapp',
            topic: formData.topic,
            assignedTeam: 'Teknik/Satış',
            createdBy: {
                type: 'anonymous',
                name: formData.name,
                email: formData.email || null,
                phone: formData.phone
            },
            createdAt: serverTimestamp(),
            ticketId
        });

        const message = `Merhaba, ben ${formData.name}. Telefon: ${formData.phone}. Konu: ${formData.topic}. Destek No: ${ticketId}`;
        window.open(`https://wa.me/905058029734?text=${encodeURIComponent(message)}`, '_blank');
        setIsOpen(false);
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring' }}>
                    <Button
                        size="icon"
                        className="rounded-full w-16 h-16 bg-gradient-to-br from-primary to-accent text-white shadow-2xl border-4 border-white"
                        onClick={() => setIsOpen(true)}
                    >
                        <MessageSquareText className="w-8 h-8" />
                    </Button>
                </motion.div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 sm:bottom-24 sm:right-6 z-[100] w-[calc(100%-3rem)] max-w-sm"
                    >
                        <Card className="flex flex-col h-[70vh] max-h-[700px] shadow-2xl rounded-2xl overflow-hidden border-none bg-white">
                            <CardHeader className="flex flex-row items-center justify-between bg-primary p-4 text-white">
                                <div className="flex items-center gap-3">
                                    {mode !== 'ai' && (
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white p-0 mr-1" onClick={() => setMode('ai')}>
                                            <ArrowLeft className="w-5 h-5" />
                                        </Button>
                                    )}
                                    <Avatar className="h-10 w-10 border-2 border-white/20">
                                        <AvatarImage src="/logo.png" />
                                        <AvatarFallback>TCA</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-sm">
                                            {mode === 'ai' ? 'TCA Asistan' : mode === 'live' ? 'Canlı Destek' : 'Bize Yazın'}
                                        </p>
                                        <span className="text-[10px] opacity-80 uppercase font-bold tracking-wider">Çevrimiçi</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10">
                                    <X className="w-5 h-5" />
                                </Button>
                            </CardHeader>
                            
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                                {mode === 'ai' && messages.map((msg, i) => (
                                    <div key={i} className={cn("flex items-start gap-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                                        {msg.role !== 'user' && <Bot className="w-6 h-6 mt-1 text-primary" />}
                                        <div className={cn("max-w-[85%] rounded-2xl p-3 text-sm shadow-sm", msg.role === 'user' ? "bg-primary text-white rounded-br-none" : "bg-white border text-slate-700 rounded-bl-none")}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {mode === 'live' && liveMessages.map((msg, i) => (
                                    <div key={i} className={cn("flex items-start gap-2", msg.senderType === 'anonymous' ? 'justify-end' : 'justify-start')}>
                                        {['admin', 'ai'].includes(msg.senderType) && <Headphones className="w-6 h-6 mt-1 text-primary" />}
                                        <div className={cn("max-w-[85%] rounded-2xl p-3 text-sm shadow-sm", msg.senderType === 'anonymous' ? "bg-primary text-white rounded-br-none" : "bg-white border text-slate-700 rounded-bl-none")}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {mode === 'form-live' && <LiveChatForm onSubmit={startLiveChat} />}
                                {mode === 'form-whatsapp' && <WhatsappSupportForm onSubmit={handleWhatsappSubmit} />}

                                {isLoading && <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />}
                                <div ref={messagesEndRef} />
                            </CardContent>

                            <CardFooter className="flex flex-col p-4 border-t bg-white gap-3">
                                {mode === 'ai' && !isLoading && (
                                    <div className="grid grid-cols-2 gap-2 w-full">
                                        <Button variant="outline" size="sm" className="text-[10px] h-8 font-bold border-blue-200 text-blue-600" onClick={() => setMode('form-live')}>
                                            <Headphones className="w-3 h-3 mr-1" /> Canli Destek
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-[10px] h-8 font-bold border-green-200 text-green-600" onClick={() => setMode('form-whatsapp')}>
                                            <MessageCircle className="w-3 h-3 mr-1" /> WhatsApp
                                        </Button>
                                    </div>
                                )}
                                
                                {['ai', 'live'].includes(mode) && (
                                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Mesajınızı yazın..."
                                            className="flex-1 h-10 text-sm rounded-xl"
                                            disabled={isLoading}
                                        />
                                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-xl h-10 w-10">
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
