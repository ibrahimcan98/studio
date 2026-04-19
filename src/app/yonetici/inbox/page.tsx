'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, doc, updateDoc, serverTimestamp, setDoc, limit, where } from 'firebase/firestore';
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
    Loader2,
    Archive,
    Baby,
    GraduationCap,
    ArrowLeft,
    X
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
    const [showArchived, setShowArchived] = useState(false);
    const [activeMobileView, setActiveMobileView] = useState<'list' | 'chat' | 'profile'>('list');

    // Conversations List
    const convQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'conversations'), limit(100));
    }, [db]);

    const { data: rawConversations, isLoading: isConvLoading } = useCollection(convQuery);

    const conversations = useMemo(() => {
        if (!rawConversations) return [];
        
        // Filtreleme: Kapalı olanları varsayılan olarak gösterme
        let filtered = rawConversations;
        if (!showArchived) {
            filtered = rawConversations.filter(c => c.status !== 'closed');
        }

        return [...filtered].sort((a, b) => {
            const timeA = a.lastMessageAt?.seconds || 0;
            const timeB = b.lastMessageAt?.seconds || 0;
            return timeB - timeA;
        });
    }, [rawConversations, showArchived]);

    const selectedConv = useMemo(() => 
        rawConversations?.find(c => c.id === selectedConvId), 
    [rawConversations, selectedConvId]);

    // Messages List
    const msgQuery = useMemoFirebase(() => {
        if (!db || !selectedConvId) return null;
        return query(
            collection(db, 'messages'), 
            where('conversationId', '==', selectedConvId)
        );
    }, [db, selectedConvId]);

    const { data: rawMessages } = useCollection(msgQuery);

    const messages = useMemo(() => {
        if (!rawMessages) return [];
        return [...rawMessages].sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeA - timeB;
        });
    }, [rawMessages]);

    // Live Parent Data
    const parentUserRef = useMemoFirebase(() => 
        (db && selectedConv?.createdBy?.uid) ? doc(db, 'users', selectedConv.createdBy.uid) : null,
    [db, selectedConv?.createdBy?.uid]);
    const { data: parentProfile } = useDoc(parentUserRef);

    // Parent's Children
    const childrenQuery = useMemoFirebase(() => 
        (db && selectedConv?.createdBy?.uid) ? collection(db, 'users', selectedConv.createdBy.uid, 'children') : null,
    [db, selectedConv?.createdBy?.uid]);
    const { data: children } = useCollection(childrenQuery);

    const handleSendReply = () => {
        if (!db || !selectedConvId || !replyText.trim() || !user || !selectedConv) return;
        
        const msgRef = doc(collection(db, 'messages'));
        setDoc(msgRef, {
            conversationId: selectedConvId,
            text: replyText,
            senderType: 'admin',
            senderUid: user.uid,
            createdAt: serverTimestamp()
        });

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
        
        // Durumu güncelle ve seçimi temizle
        updateDoc(convRef, { status });
        setSelectedConvId(null);
        setActiveMobileView('list');
    };

    const handleSelectConversation = (id: string) => {
        setSelectedConvId(id);
        setActiveMobileView('chat');
    };

    if (isConvLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="flex h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] gap-2 sm:gap-4 font-sans max-w-full overflow-hidden">
            {/* Sidebar List */}
            <Card className={cn(
                "w-full md:w-80 flex flex-col overflow-hidden border-none shadow-md",
                activeMobileView !== 'list' ? 'hidden md:flex' : 'flex'
            )}>
                <div className="p-4 border-b bg-white space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm">Mesajlar</h3>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn("h-7 px-2 text-[10px] gap-1", showArchived && "bg-slate-100 text-primary")}
                            onClick={() => setShowArchived(!showArchived)}
                        >
                            <Archive className="w-3 h-3" />
                            {showArchived ? 'Arşivi Gizle' : 'Arşivi Göster'}
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Ara..." className="pl-9 h-9 text-sm rounded-xl" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="divide-y">
                        {conversations.length > 0 ? (
                            conversations.map(conv => (
                                <div 
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv.id)}
                                    className={cn(
                                        "p-4 cursor-pointer hover:bg-slate-50 transition-colors relative",
                                        selectedConvId === conv.id ? "bg-primary/5 border-l-4 border-primary" : "",
                                        conv.status === 'closed' && "opacity-60 bg-slate-50/50"
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
                                        {conv.status === 'closed' && <Badge className="text-[8px] h-4 bg-slate-200 text-slate-600">KAPALI</Badge>}
                                    </div>
                                    {conv.needsHuman && conv.status !== 'closed' && (
                                        <Badge className="bg-red-100 text-red-600 text-[8px] h-4 mb-1">CANLI DESTEK</Badge>
                                    )}
                                    <p className="text-[10px] text-muted-foreground line-clamp-1">{conv.lastMessage || 'Mesaj yok'}</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-muted-foreground text-xs italic">
                                Aktif konuşma bulunmuyor.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Area */}
            <Card className={cn(
                "flex-1 flex flex-col overflow-hidden border-none shadow-md bg-white min-w-0 transition-all",
                activeMobileView === 'list' ? 'hidden md:flex' : 
                activeMobileView === 'profile' ? 'hidden lg:flex' : 'flex'
            )}>
                {selectedConv ? (
                    <>
                        <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="md:hidden h-9 w-9 -ml-1 bg-slate-50 rounded-xl"
                                    onClick={() => setActiveMobileView('list')}
                                >
                                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                                </Button>
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10"><AvatarFallback>{selectedConv.createdBy?.name?.[0] || '?'}</AvatarFallback></Avatar>
                                <div>
                                    <h2 className="font-bold text-[13px] sm:text-sm truncate max-w-[120px] sm:max-w-none">{selectedConv.createdBy?.name || 'Anonim'}</h2>
                                    <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate max-w-[120px] sm:max-w-none">{selectedConv.createdBy?.email || 'E-posta yok'}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => setActiveMobileView(activeMobileView === 'profile' ? 'chat' : 'profile')}
                                >
                                    <User className={cn("w-4 h-4", activeMobileView === 'profile' && "text-primary")} />
                                </Button>
                                <div className="hidden sm:flex self-center">
                                    {selectedConv.status !== 'closed' ? (
                                        <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => toggleStatus('closed')}>
                                            <CheckCircle2 className="w-3 h-3 sm:mr-1" /> <span className="hidden sm:inline">Kapat</span>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-8" onClick={() => toggleStatus('open')}>
                                            Aç
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <ScrollArea className="flex-1 p-6 bg-slate-50/30">
                            <div className="space-y-6">
                                {messages.length > 0 ? (
                                    messages.map((msg, i) => (
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
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-20"><MessageSquare className="mx-auto w-10 h-10 mb-2"/>Henüz mesaj yok.</div>
                                )}
                            </div>
                        </ScrollArea>

                        {selectedConv.status !== 'closed' && (
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
                        )}
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
                <Card className={cn(
                    "w-full lg:w-80 border-none shadow-xl bg-white overflow-y-auto transition-all duration-300",
                    activeMobileView === 'profile' ? 'flex flex-col absolute lg:relative inset-0 z-[60] lg:z-10' : 'hidden'
                )}>
                    <div className="sticky top-0 bg-white z-[70] p-4 sm:p-6 pb-2 sm:pb-3 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                onClick={() => setActiveMobileView('chat')}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-500">Müşteri Profili</h3>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 bg-slate-50 hover:bg-slate-100 rounded-xl"
                            onClick={() => setActiveMobileView('chat')}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    
                    <div className="p-4 sm:p-6 space-y-8 pt-6">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">İsim</p>
                                <p className="text-sm font-semibold">{selectedConv.createdBy?.name || 'Belirtilmedi'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">E-posta</p>
                                <p className="text-sm break-all">{selectedConv.createdBy?.email || 'Yok'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Telefon</p>
                                <p className="text-sm">{selectedConv.createdBy?.phone || 'Yok'}</p>
                            </div>
                        </div>
                        <Separator />
                        
                        {children && children.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                    <Baby className="w-3 h-3" /> Öğrenciler
                                </p>
                                <div className="space-y-2">
                                    {children.map((child: any) => (
                                        <div key={child.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <div className="bg-primary/10 p-1 rounded">
                                                <GraduationCap className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-xs font-medium text-slate-700">{child.firstName} {child.lastName || ''}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                <Headphones className="w-3 h-3" /> Destek Ekibi
                            </p>
                            <Badge className="bg-indigo-100 text-indigo-600 hover:bg-indigo-100">{selectedConv.assignedTeam || 'Genel'}</Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                <TagIcon className="w-3 h-3" /> Etiketler
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {(parentProfile?.tags || selectedConv.tags)?.map((tag: string) => (
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
