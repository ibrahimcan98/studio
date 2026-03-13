'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Loader2, 
    Activity, 
    Monitor, 
    Clock, 
    Send, 
    User, 
    MessageCircle, 
    X,
    Clipboard,
    Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const pathMap: { [key: string]: string } = {
  '/': 'Ana Sayfa',
  '/kurslar': 'Kursları İnceliyor',
  '/sepet': 'Sepette Ödeme Bekliyor',
  '/ebeveyn-portali': 'Ebeveyn Paneli',
  '/ebeveyn-portali/ders-planla': 'Ders Planlıyor',
  '/ebeveyn-portali/paketlerim': 'Paket Yönetimi',
  '/ebeveyn-portali/ayarlar': 'Profil Ayarları',
  '/premium': 'Premium Sayfası',
  '/login': 'Giriş Sayfası',
  '/register': 'Kayıt Sayfası',
};

const getFriendlyPath = (path: string) => {
  if (!path) return 'Bilinmiyor';
  if (path.startsWith('/cocuk-modu')) return '🧒 Çocuk Modu - Oyun Oynuyor';
  if (path.startsWith('/ogretmen-portali')) return '👩‍🏫 Öğretmen Paneli';
  return pathMap[path] || path;
};

export default function LiveTrackingPage() {
  const db = useFirestore();
  const { user: adminUser } = useUser();
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());
  
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeUsersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'users'),
      where('isOnline', '==', true),
      orderBy('lastActiveAt', 'desc'),
      limit(50)
    );
  }, [db]);

  const { data: liveUsers, isLoading } = useCollection(activeUsersQuery);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (user: any) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Kopyalandı", description: "Kullanıcı ID'si panoya kopyalandı." });
  };

  const handleSendMessage = async () => {
    if (!db || !selectedUser || !messageText.trim() || !adminUser) return;
    
    setIsSending(true);
    try {
        const convRef = doc(collection(db, 'conversations'));
        // We create or reuse a conversation. For simplicity in tracking, we create a new human-required one.
        const convData = {
            status: 'open',
            channel: 'website',
            needsHuman: true,
            topic: 'Yönetici Mesajı',
            assignedTeam: 'Yönetim',
            createdBy: {
                type: 'parent',
                uid: selectedUser.id,
                name: `${selectedUser.firstName} ${selectedUser.lastName}`,
                email: selectedUser.email
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastMessageAt: serverTimestamp(),
            lastMessage: messageText
        };

        await setDoc(convRef, convData);
        
        const msgRef = doc(collection(db, 'messages'));
        await setDoc(msgRef, {
            conversationId: convRef.id,
            text: messageText,
            senderType: 'admin',
            senderUid: adminUser.uid,
            createdAt: serverTimestamp()
        });

        toast({ title: "Mesaj Gönderildi", description: "Veli tarafına mesaj başarıyla iletildi.", className: "bg-green-500 text-white" });
        setMessageText('');
        setIsDetailOpen(false);
    } catch (e) {
        console.error("Message send error:", e);
        toast({ variant: "destructive", title: "Hata", description: "Mesaj gönderilemedi." });
    } finally {
        setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Canlı Yayın Hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="relative">
                <Activity className="w-8 h-8 text-primary" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
            </div>
            Canlı Takip
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Şu anda platformda gezinen veli ve öğretmenleri anlık izleyin.
          </p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700 border-none font-black px-4 py-2 text-xs uppercase tracking-wider">
            {liveUsers?.length || 0} Aktif Kullanıcı
        </Badge>
      </div>

      <div className="grid gap-6">
        {liveUsers && liveUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveUsers.map((user) => (
              <Card 
                key={user.id} 
                onClick={() => handleCardClick(user)}
                className="border-none shadow-md transition-all hover:shadow-xl hover:scale-[1.02] overflow-hidden relative group cursor-pointer ring-1 ring-slate-100"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                <CardHeader className="pb-3 flex flex-row items-center gap-4 space-y-0">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm uppercase">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <span className="absolute -bottom-1 -right-1 block h-4 w-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{user.firstName} {user.lastName}</h3>
                    <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-tighter">
                        {user.role === 'teacher' ? 'Öğretmen' : 'Veli'} • {user.email}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Monitor className="w-3.5 h-3.5 text-primary" />
                        <span className="truncate">{getFriendlyPath(user.currentPath)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>Son aktivite: {user.lastActiveAt ? formatDistanceToNow(user.lastActiveAt.toDate(), { addSuffix: true, locale: tr }) : 'Az önce'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex gap-1">
                        {user.isPremium && <Badge className="bg-yellow-400 text-yellow-900 border-none text-[8px] font-black h-4">PREMIUM</Badge>}
                        {user.role === 'parent' && (
                            <Badge variant="outline" className="text-[8px] font-black h-4 border-blue-100 text-blue-600">
                                {user.remainingLessons || 0} DERS
                            </Badge>
                        )}
                    </div>
                    <span className="text-[9px] font-bold text-primary group-hover:underline flex items-center gap-1">
                        Detay ve Mesaj <Send className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-slate-200 bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-slate-200 animate-spin" />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Kullanıcılar bekleniyor...</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* USER DETAIL & MESSAGE DIALOG */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md rounded-[24px] border-none shadow-2xl p-0 overflow-hidden">
            {selectedUser && (
                <>
                    <div className="bg-slate-900 p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-black">
                                    {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">{selectedUser.firstName} {selectedUser.lastName}</h2>
                                    <p className="text-slate-400 text-sm font-medium">{selectedUser.email}</p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setIsDetailOpen(false)}
                                className="text-slate-400 hover:text-white p-0"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                        
                        <div className="mt-6 flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                            <code className="text-[10px] font-mono text-primary flex-1 select-all truncate">
                                ID: {selectedUser.id}
                            </code>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-400 hover:text-primary"
                                onClick={() => handleCopyId(selectedUser.id)}
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Clipboard className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Konum</p>
                                <p className="text-sm font-bold text-slate-700 truncate">{getFriendlyPath(selectedUser.currentPath)}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Durum</p>
                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px]">ÇEVRİMİÇİ</Badge>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MessageCircle className="w-3.5 h-3.5 text-primary" /> Anlık Mesaj Gönder
                            </Label>
                            <div className="relative">
                                <Input 
                                    placeholder="Velinin asistan panelinde görünecek..." 
                                    className="h-14 rounded-2xl border-2 border-slate-100 focus-visible:ring-primary/20 pr-12"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    disabled={isSending}
                                />
                                <Button 
                                    size="icon" 
                                    className="absolute right-2 top-2 h-10 w-10 rounded-xl shadow-lg"
                                    onClick={handleSendMessage}
                                    disabled={!messageText.trim() || isSending}
                                >
                                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </Button>
                            </div>
                            <p className="text-[10px] text-slate-400 italic text-center">
                                Bu mesaj doğrudan velinin asistan ekranına "Yönetici" ismiyle düşer.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
