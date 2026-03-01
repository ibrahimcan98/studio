'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, serverTimestamp, setDoc, limit, where } from 'firebase/firestore';
import { 
    Search, 
    MessageSquare, 
    Send, 
    CheckCircle2, 
    User, 
    Phone, 
    Mail, 
    Tag as TagIcon,
    Monitor,
    MessageCircle,
    Headphones,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function InboxPage() {
    const db = useFirestore();
    const { user } = useUser();
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [replyText, setInputText] = useState('');

    // Conversations List
    const convQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'conversations'), orderBy('lastMessageAt', 'desc'), limit(50));
    }, [db]);

    const { data: conversations, isLoading: isConvLoading } = useCollection(convQuery);

    const selectedConv = useMemo(() => 
        conversations?.find(c => c.id === selectedConvId), 
    [conversations, selectedConvId]);

    // Messages List
    const msgQuery = useMemoFirebase(() => {
        if (!db || !selectedConvId) return null;
        return query(
            collection(db, 'messages'), 
            where('conversationId', '==', selectedConvId),
            orderBy('createdAt', 'asc')
        );
    }, [db, selectedConvId]);

    const { data: messages } = useCollection(msgQuery);

    const handleSendReply = () => {
        if (!db || !selectedConvId || !replyText.trim() || !user || !selectedConv) return;
        
        const msgRef = doc(collection(db, 'messages'));
        const msgData = {
            conversationId: selectedConvId,
            text: replyText,
            senderType: 'admin',
            senderUid: user.uid,
            createdAt: serverTimestamp()
        };

        setDoc(msgRef, msgData);

        const convRef = doc(db, 'conversations', selectedConvId);
        updateDoc(convRef, {
            lastMessageAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'pending'
        });

        setInputText('');
    };

    const toggleStatus = (status: string) => {
        if (!db || !selectedConvId) return;
        const convRef = doc(db, 'conversations', selectedConvId);
        updateDoc(convRef, { status });
    };

    if (isConvLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="flex h-[calc(100vh-160px)] gap-4 font-sans">
            {/* Sidebar List */}
            <Card className="w-80 flex flex-col overflow-hidden border-none shadow-md">
                <div className="p-4 border-b bg-white">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Ara..." className="pl-9 h-9 text-sm rounded-xl" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="divide-y">
                        {conversations?.map(conv => (
                            <div 
                                key={conv.id}
                                onClick={() => setSelectedConvId(conv.id)}
                                className={cn(
                                    "p-4 cursor-pointer hover:bg-slate-50 transition-colors relative",
                                    selectedConvId === conv.id ? "bg-primary/5 border-l-4 border-primary" : ""
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-xs truncate max-w-[120px]">
                                        {conv.createdBy?.name || 'Anonim'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {conv.lastMessageAt ? format(conv.lastMessageAt.toDate(), 'HH:mm') : ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    {conv.channel === 'whatsapp' ? 
                                        <MessageCircle className="w-3 h-3 text-green-500" /> : 
                                        <Monitor className="w-3 h-3 text-blue-500" />
                                    }
                                    <Badge variant="outline" className="text-[9px] px-1 h-4">{conv.topic}</Badge>
                                </div>
                                {conv.needsHuman && (
                                    <Badge className="bg-red-100 text-red-600 text-[8px] h-4 mb-1">CANLI DESTEK</Badge>
                                )}
                                <p className="text-[10px] text-muted-foreground line-clamp-1">{conv.lastMessage}</p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-md bg-white">
                {selectedConv ? (
                    <>
                        <div className="p-4 border-b flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3">
                                <Avatar><AvatarFallback>{selectedConv.createdBy.name?.[0] || '?'}</AvatarFallback></Avatar>
                                <div>
                                    <h2 className="font-bold text-sm">{selectedConv.createdBy.name}</h2>
                                    <p className="text-[10px] text-muted-foreground">{selectedConv.createdBy.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => toggleStatus('closed')}>
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Kapat
                                </Button>
                            </div>
                        </div>
                        
                        <ScrollArea className="flex-1 p-6 bg-slate-50/30">
                            <div className="space-y-6">
                                {messages?.map((msg, i) => (
                                    <div key={i} className={cn("flex flex-col", msg.senderType === 'admin' ? 'items-end' : 'items-start')}>
                                        <div className={cn(
                                            "max-w-[70%] p-3 rounded-2xl text-sm shadow-sm",
                                            msg.senderType === 'admin' ? "bg-primary text-white rounded-tr-none" : "bg-white border rounded-tl-none"
                                        )}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[9px] text-muted-foreground mt-1 px-1">
                                            {msg.createdAt ? format(msg.createdAt.toDate(), 'HH:mm') : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-white">
                            <form 
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendReply();
                                }}
                            >
                                <Input 
                                    placeholder="Yanıtınızı yazın..." 
                                    value={replyText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="flex-1 h-10 text-sm rounded-xl"
                                />
                                <Button type="submit" size="icon" className="rounded-xl h-10 w-10">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                        <MessageSquare className="w-12 h-12 opacity-20" />
                        <p className="text-sm">Bir konuşma seçerek yanıtlamaya başlayın.</p>
                    </div>
                )}
            </Card>

            {/* Right Panel: Details */}
            {selectedConv && (
                <Card className="w-72 border-none shadow-md bg-white p-6 overflow-y-auto">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6">Müşteri Profili</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">İsim</p>
                                <p className="text-sm font-semibold">{selectedConv.createdBy.name}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">E-posta</p>
                                <p className="text-sm break-all">{selectedConv.createdBy.email || 'Yok'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Telefon</p>
                                <p className="text-sm">{selectedConv.createdBy.phone || 'Yok'}</p>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                <Headphones className="w-3 h-3" /> Destek Ekibi
                            </p>
                            <Badge className="bg-indigo-100 text-indigo-600 hover:bg-indigo-100">{selectedConv.assignedTeam}</Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                <TagIcon className="w-3 h-3" /> Etiketler
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {selectedConv.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                                ))}
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] border border-dashed text-slate-400">+</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}