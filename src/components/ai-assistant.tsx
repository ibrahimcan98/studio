
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Loader2, Sparkles, MessageCircle, MessageSquareText, ArrowLeft, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { assistantFlow, AssistantInput } from '@/ai/flows/assistant-flow';
import { assistantData } from '@/data/ai-assistant-data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, doc, updateDoc, limit } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
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
    const { user, loading: userLoading } = useUser();
    const auth = useAuth();
    const db = useFirestore();
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

    // Ensure anonymous login for chat security if not logged in
    useEffect(() => {
        if (!userLoading && !user && auth) {
            signInAnonymously(auth).catch(err => console.error("Silent anonymous auth failed", err));
        }
    }, [user, userLoading, auth]);

    // Track conversation via localStorage for continuity
    useEffect(() => {
        const savedId = localStorage.getItem('tca_conversation_id');
        if (savedId) setCurrentConversationId(savedId);
    }, []);

    // Listen to real-time messages if in live chat
    const messagesQuery = useMemoFirebase(() => {
        if (!db || !currentConversationId || mode !== 'live') return null;
        return query(
            collection(db, 'messages'),
            where('conversationId', '==', currentConversationId),
            orderBy('createdAt', 'asc')
        );
    }, [db, currentConversationId, mode]);

    const { data: liveMessages } = useCollection(messagesQuery);

    useEffect(() => {
        const shouldBeHidden = pathname.startsWith('/ogretmen-portali') || 
                               pathname.startsWith('/cocuk-modu') ||
                               pathname.startsWith('/live-lesson');
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

            const needsHuman = /canlı destek|insan|bağlan|yardım|operator/i.test(textToSend.toLowerCase());
            
            try {
                const assistantInput: AssistantInput = {
                    history: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
                    question: textToSend,
                };
                const result = await assistantFlow(assistantInput);
                
                setMessages(prev => [...prev, { role: 'assistant', content: result.answer }]);
                
                if (needsHuman) {
                    setMessages(prev => [...prev, { role: 'assistant', content: "Size daha detaylı yardımcı olabilmem için bir ekip arkadaşıma bağlamak ister misiniz?" }]);
                }
            } catch (error) {
                setMessages(prev => [...prev, { role: 'assistant', content: "Üzgünüm, bir sorun oluştu." }]);
            } finally {
                setIsLoading(false);
            }
        } else if (mode === 'live' && currentConversationId) {
            if (!customInput) setInput('');
            await addDoc(collection(db, 'messages'), {
                conversationId: currentConversationId,
                text: textToSend,
                senderType: (user && !user.isAnonymous) ? 'parent' : 'anonymous',
                senderUid: user?.uid || null,
                createdAt: serverTimestamp()
            });
            await updateDoc(doc(db, 'conversations', currentConversationId), {
                lastMessageAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
    };

    const startLiveChat = async (formData: any) => {
        const convRef = await addDoc(collection(db, 'conversations'), {
            status: 'open',
            channel: 'website',
            needsHuman: true,
            topic: formData.topic,
            assignedTeam: formData.topic === 'kurslar' ? 'Eğitim' : 'Teknik/Satış',
            createdBy: {
                type: (user && !user.isAnonymous) ? 'parent' : 'anonymous',
                uid: user?.uid || null,
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastMessageAt: serverTimestamp(),
            pageUrl: window.location.href,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        
        const firstMsg = `Destek talebi başlatıldı. Konu: ${formData.topic}. Mesaj: ${formData.message}`;
        await addDoc(collection(db, 'messages'), {
            conversationId: convRef.id,
            text: firstMsg,
            senderType: (user && !user.isAnonymous) ? 'parent' : 'anonymous',
            senderUid: user?.uid || null,
            createdAt: serverTimestamp()
        });

        setCurrentConversationId(convRef.id);
        localStorage.setItem('tca_conversation_id', convRef.id);
        setMode('live');
    };

    const handleWhatsappSubmit = async (formData: any) => {
        const ticketId = Math.random().toString(36).substring(7).toUpperCase();
        await addDoc(collection(db, 'conversations'), {
            status: 'open',
            channel: 'whatsapp',
            topic: formData.topic,
            assignedTeam: 'Teknik/Satış',
            createdBy: {
                type: (user && !user.isAnonymous) ? 'parent' : 'anonymous',
                uid: user?.uid || null,
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

                                {mode === 'live' && liveMessages?.map((msg, i) => (
                                    <div key={i} className={cn("flex items-start gap-2", ['parent', 'anonymous'].includes(msg.senderType) ? 'justify-end' : 'justify-start')}>
                                        {['admin', 'ai'].includes(msg.senderType) && <Headphones className="w-6 h-6 mt-1 text-primary" />}
                                        <div className={cn("max-w-[85%] rounded-2xl p-3 text-sm shadow-sm", ['parent', 'anonymous'].includes(msg.senderType) ? "bg-primary text-white rounded-br-none" : "bg-white border text-slate-700 rounded-bl-none")}>
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
