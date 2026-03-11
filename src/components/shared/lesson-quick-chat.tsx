
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { MessageSquare, Send, Loader2, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const QUICK_MESSAGES = [
    "Merhaba, 5 dakika gecikeceğim.",
    "Merhaba, 10 dakika gecikeceğim.",
    "İnternetimde kısa bir sorun var, hemen bağlanacağım.",
    "Teknik bir sorun yaşıyorum, birazdan derse katılacağım.",
    "Dersimize şimdi başlayabiliriz.",
    "Bağlantınızı kontrol edebilir misiniz?",
    "Henüz bağlantı göremiyorum.",
    "Birazdan tekrar deneyebilir misiniz?",
    "Sesinizi duyamıyorum.",
    "Kameranız kapalı görünüyor."
];

interface LessonQuickChatProps {
    lessonId: string;
    teacherId: string;
    parentId: string;
    userRole: 'parent' | 'teacher';
}

export function LessonQuickChat({ lessonId, teacherId, parentId, userRole }: LessonQuickChatProps) {
    const { user } = useUser();
    const db = useFirestore();
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const chatQuery = useMemoFirebase(() => {
        if (!db || !lessonId) return null;
        return query(
            collection(db, 'lesson-slots', lessonId, 'chats'),
            orderBy('createdAt', 'asc'),
            limit(50)
        );
    }, [db, lessonId]);

    const { data: messages, isLoading } = useCollection(chatQuery);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!db || !user || isSending) return;

        setIsSending(true);
        try {
            await addDoc(collection(db, 'lesson-slots', lessonId, 'chats'), {
                lessonId,
                senderId: user.uid,
                senderRole: userRole,
                text,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Message send error:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100">
            <div className="p-3 bg-white border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-slate-700">Hızlı İletişim</span>
                </div>
                {isLoading && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
            </div>

            <ScrollArea className="flex-1 p-3 h-[200px]">
                <div className="space-y-3">
                    {messages && messages.length > 0 ? (
                        messages.map((msg) => {
                            const isMe = msg.senderId === user?.uid;
                            return (
                                <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                    <div className={cn(
                                        "max-w-[85%] p-2.5 rounded-2xl text-xs shadow-sm",
                                        isMe ? "bg-primary text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                                    )}>
                                        {msg.text}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 px-1">
                                        <span className="text-[9px] text-slate-400">
                                            {msg.createdAt ? format(msg.createdAt.toDate(), 'HH:mm') : ''}
                                        </span>
                                        {!isMe && (
                                            <span className="text-[9px] font-bold text-primary uppercase">
                                                {msg.senderRole === 'teacher' ? 'Öğretmen' : 'Veli'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="h-32 flex flex-col items-center justify-center text-center px-4">
                            <Clock className="w-8 h-8 text-slate-200 mb-2" />
                            <p className="text-[10px] text-slate-400 font-medium">Henüz mesaj yok. Aşağıdaki butonlarla hızlıca bilgi verebilirsiniz.</p>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-2 bg-white border-t">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-2 px-1">Mesaj Gönder</p>
                <div className="grid grid-cols-1 gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {QUICK_MESSAGES.map((msg, idx) => (
                        <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="justify-start text-left h-auto py-2 px-3 text-[10px] bg-slate-50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-medium whitespace-normal leading-tight"
                            onClick={() => handleSendMessage(msg)}
                            disabled={isSending}
                        >
                            {msg}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
