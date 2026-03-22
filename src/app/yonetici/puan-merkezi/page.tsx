'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useDoc, useMemoFirebase, errorEmitter } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, increment, addDoc, serverTimestamp, getDoc, getDocs, writeBatch, deleteField, where, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, XCircle, Trophy, User, History, Plus, Minus, Search, Clock, Gift, RefreshCw, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function PuanMerkeziPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  // Settings for reset timer
  const settingsDocRef = useMemoFirebase(() => db ? doc(db, 'settings', 'points-center') : null, [db]);
  const { data: settingsData } = useDoc(settingsDocRef);
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number } | null>(null);

  useEffect(() => {
    if (!settingsData?.lastResetAt) {
      setTimeLeft(null);
      return;
    }
    const interval = setInterval(() => {
      // Handle both Timestamp object directly and standard JS dates, though Firestore usually returns object with toDate() or seconds
      const resetTime = settingsData.lastResetAt.toDate ? settingsData.lastResetAt.toDate().getTime() : new Date(settingsData.lastResetAt).getTime();
      const targetTime = resetTime + (30 * 24 * 60 * 60 * 1000); // 30 days
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [settingsData]);

  const handleResetTasks = async () => {
    if (!db || resetting) return;
    if (!confirm('Sadece "Evde Türkçe Keyfi" görevleri sıfırlanacak. Bu işlemi onaylıyor musunuz?')) return;
    
    setResetting(true);
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'parent'));
      const snapshot = await getDocs(q);
      
      const MISSIONS_HOME_IDS = [
        'book-reading', 'game-time', 'elders-call', 'kitchen-fun', 'presentation',
        'lesson-note', 'talking-turkish', 'creative-workshop', 'daily-song', 'culture-joy'
      ];

      const batch = writeBatch(db);
      snapshot.forEach(userDoc => {
        const updateObj: any = {};
        MISSIONS_HOME_IDS.forEach(id => {
          updateObj[`taskStatus.${id}`] = deleteField();
        });
        batch.update(userDoc.ref, updateObj);
      });

      // Update the settings doc
      batch.set(doc(db, 'settings', 'points-center'), {
        lastResetAt: serverTimestamp()
      }, { merge: true });

      await batch.commit();

      toast({ title: 'Görevler Sıfırlandı!', description: 'Tüm veliler için Evde Türkçe Keyfi görevleri tekrar açıldı.' });
    } catch (error) {
      toast({ title: 'Hata', description: 'Görevler sıfırlanırken hata oluştu.', variant: 'destructive' });
      console.error(error);
    } finally {
      setResetting(false);
    }
  };

  // Puan Talepleri (Onay bekleyenler)
  const requestsQuery = useMemoFirebase(() => 
    db ? query(collection(db, 'loyalty-requests'), orderBy('createdAt', 'desc')) : null, [db]);
  const { data: requests, isLoading: requestsLoading } = useCollection(requestsQuery);

  // Veliler (Puan ekleme/çıkarma için)
  const usersQuery = useMemoFirebase(() => 
    db ? query(collection(db, 'users'), where('role', '==', 'parent')) : null, [db]);
  // Not: Basitlik adına tüm velileri çekiyoruz, gerçek projede search ile çekilmeli
  const { data: parents, isLoading: parentsLoading } = useCollection(usersQuery);

  const filteredParents = parents?.filter(p => 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (request: any) => {
    if (!db) return;
    setProcessingId(request.id);
    try {
      const batch = writeBatch(db);
      
      // Talebi güncelle
      batch.update(doc(db, 'loyalty-requests', request.id), {
        status: 'approved',
        processedAt: serverTimestamp(),
      });

      // Kullanıcı puanını artır ve durumu kaydet
      batch.update(doc(db, 'users', request.userId), {
        academyPoints: increment(request.points),
        [`taskStatus.${request.taskId}`]: 'completed'
      });

      // Geçmişe ekle
      const historyRef = doc(collection(db, 'users', request.userId, 'point-history'));
      batch.set(historyRef, {
        amount: request.points,
        type: 'earn',
        reason: `Onaylanan Görev: ${request.taskTitle}`,
        createdAt: serverTimestamp()
      });

      await batch.commit();
      toast({ title: 'Talep Onaylandı', description: `${request.points} puan eklendi.` });
    } catch (error) {
      toast({ title: 'Hata', description: 'İşlem sırasında bir hata oluştu.', variant: 'destructive' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (request: any) => {
    if (!db) return;
    setProcessingId(request.id);
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'loyalty-requests', request.id), {
        status: 'rejected',
        processedAt: serverTimestamp()
      });
      batch.update(doc(db, 'users', request.userId), {
        [`taskStatus.${request.taskId}`]: deleteField()
      });
      await batch.commit();
      toast({ title: 'Talep Reddedildi' });
    } catch (error) {
      toast({ title: 'Hata', description: 'İşlem sırasında bir hata oluştu.', variant: 'destructive' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleManualPoints = async (userId: string, amount: number, reason: string) => {
    if (!db || !amount) return;
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'users', userId), {
        academyPoints: increment(amount)
      });
      const historyRef = doc(collection(db, 'users', userId, 'point-history'));
      batch.set(historyRef, {
        amount: amount,
        type: amount > 0 ? 'admin_add' : 'admin_remove',
        reason: reason || 'Yönetici müdahalesi',
        createdAt: serverTimestamp()
      });
      await batch.commit();
      toast({ title: 'Puan Güncellendi', description: `Kullanıcıya ${amount} puan yansıtıldı.` });
    } catch (error) {
      toast({ title: 'Hata', description: 'Puan güncellenemedi.' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Puan Merkezi Yönetimi</h2>
          <p className="text-slate-500">Sadakat yolculuğu taleplerini yönetin ve puan bakiyelerini düzenleyin.</p>
        </div>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="bg-white border p-1 rounded-xl h-auto gap-2 flex-wrap">
          <TabsTrigger value="requests" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Onay Bekleyenler</TabsTrigger>
          <TabsTrigger value="approved" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Onaylananlar</TabsTrigger>
          <TabsTrigger value="manual" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Puan Ekle / Sil</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Tüm Geçmiş</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Görev Ayarları</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <div className="grid gap-4">
            {requestsLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : 
             requests?.filter(r => r.status === 'pending').length === 0 ? (
               <Card className="border-dashed py-20 text-center text-slate-400">Onay bekleyen talep bulunmuyor.</Card>
             ) : requests?.filter(r => r.status === 'pending').map((req) => (
              <Card key={req.id} className="overflow-hidden border-2 hover:border-primary/20 transition-all">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                  <div className="bg-yellow-100 p-4 rounded-2xl shrink-0"><Clock className="h-8 w-8 text-yellow-600" /></div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-bold">{req.taskTitle}</Badge>
                        <span className="text-xs text-slate-400">{format(req.createdAt.toDate(), 'dd MMM HH:mm', { locale: tr })}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                        {req.userName || req.userEmail}
                    </h3>
                    <p className="text-sm font-mono text-slate-500 mb-1">ID: {req.userId}</p>
                    <p className="text-sm text-slate-600 italic">"{req.userNote || 'Not eklenmemiş.'}"</p>
                    {req.evidenceUrl && (
                        <a href={req.evidenceUrl} target="_blank" className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 mt-2">
                            Kanıtı Görüntüle <ArrowUpRight className="h-3 w-3" />
                        </a>
                    )}
                  </div>
                  <div className="text-center md:text-right space-y-3 shrink-0">
                    <div className="text-2xl font-black text-primary">+{req.points} PUAN</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 font-bold" 
                        onClick={() => handleReject(req)} disabled={processingId === req.id}>
                        {processingId === req.id ? <Loader2 className="animate-spin h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />} Reddet
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 font-bold"
                        onClick={() => handleApprove(req)} disabled={processingId === req.id}>
                        {processingId === req.id ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />} Onayla
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid gap-4">
             {requestsLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : 
             requests?.filter(r => r.status === 'approved').length === 0 ? (
               <Card className="border-dashed py-20 text-center text-slate-400">Onaylanmış talep bulunmuyor.</Card>
             ) : requests?.filter(r => r.status === 'approved').map((req) => (
              <Card key={req.id} className="overflow-hidden border-2 hover:border-green-500/20 transition-all">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                  <div className="bg-green-100 p-4 rounded-2xl shrink-0"><CheckCircle2 className="h-8 w-8 text-green-600" /></div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-bold border-green-200 text-green-700 bg-green-50">{req.taskTitle}</Badge>
                        <span className="text-xs text-slate-400">{req.processedAt ? format(req.processedAt.toDate(), 'dd MMM HH:mm', { locale: tr }) : format(req.createdAt.toDate(), 'dd MMM', { locale: tr })}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                        {req.userName || req.userEmail}
                    </h3>
                    <p className="text-sm font-mono text-slate-500 mb-1">ID: {req.userId}</p>
                    {req.evidenceUrl && (
                        <a href={req.evidenceUrl} target="_blank" className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 mt-2">
                            Kanıtı Görüntüle <ArrowUpRight className="h-3 w-3" />
                        </a>
                    )}
                  </div>
                  <div className="text-center md:text-right space-y-3 shrink-0">
                    <div className="text-2xl font-black text-green-600">+{req.points} PUAN</div>
                    <Badge className="bg-green-100 text-green-700 border-none font-bold uppercase tracking-widest text-[10px]">Onaylandı</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manual">
           <Card>
              <CardHeader>
                  <CardTitle>Velileri Bul</CardTitle>
                  <CardDescription>Puanını düzenlemek istediğiniz veliyi arayın.</CardDescription>
                  <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input placeholder="İsim veya e-posta ile ara..." className="pl-10 rounded-xl" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
              </CardHeader>
              <CardContent className="space-y-4">
                  {filteredParents?.slice(0, 10).map(parent => (
                      <div key={parent.id} className="flex items-center justify-between p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{parent.displayName?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <p className="font-bold text-slate-800">
                                      {parent.displayName || 'İsimsiz Veli'} 
                                      <span className="text-xs font-mono text-slate-400 ml-2">ID: {parent.id}</span>
                                  </p>
                                  <p className="text-xs text-slate-500">{parent.email}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-6">
                              <div className="text-right">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Mevcut Puan</p>
                                  <p className="text-lg font-black text-primary">{parent.academyPoints || 0}</p>
                              </div>
                              <PointActionDialog user={parent} onConfirm={handleManualPoints} />
                          </div>
                      </div>
                  ))}
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="history">
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {requests?.filter(r => r.status !== 'pending').map(req => (
                            <div key={req.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {req.status === 'approved' ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{req.userEmail}</p>
                                        <p className="text-xs text-slate-500">{req.taskTitle} - {format(req.createdAt.toDate(), 'dd/MM/yyyy', { locale: tr })}</p>
                                    </div>
                                </div>
                                <div className={cn("font-bold text-sm", req.status === 'approved' ? "text-green-600" : "text-red-600")}>
                                    {req.status === 'approved' ? `+${req.points}` : 'Reddedildi'}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="settings">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Evde Türkçe Keyfi Görevleri</CardTitle>
                    <CardDescription>Evde Türkçe görevleri ayda bir kez yapılabilir. Süre dolduğunda aşağıdaki butona basarak tüm ebeveynler için bu görevlerin yapılmış olma durumunu sıfırlayabilirsiniz.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Clock className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sıradaki Sıfırlamaya Kalan Süre</p>
                                {timeLeft ? (
                                    <div className="text-3xl font-black text-slate-800 flex items-baseline gap-2 mt-1">
                                        {timeLeft.days} <span className="text-sm font-bold text-slate-500">Gün</span>
                                        {timeLeft.hours} <span className="text-sm font-bold text-slate-500">Saat</span>
                                        {timeLeft.minutes} <span className="text-sm font-bold text-slate-500">Dk</span>
                                    </div>
                                ) : (
                                    <p className="text-lg font-bold text-slate-800 mt-1">Henüz sıfırlama yapılmamış</p>
                                )}
                            </div>
                        </div>
                        <Button 
                            size="lg" 
                            className="w-full md:w-auto font-bold h-14 bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-200"
                            onClick={handleResetTasks}
                            disabled={resetting}
                        >
                            {resetting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <RefreshCw className="w-5 h-5 mr-2" />}
                            GÖREVLERİ SIFIRLA
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PointActionDialog({ user, onConfirm }: { user: any, onConfirm: (id: string, amount: number, reason: string) => void }) {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="font-bold rounded-lg border-primary/20 text-primary hover:bg-primary/5">Düzenle</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user.displayName} - Puan Düzenle</DialogTitle>
                    <DialogDescription>Pozitif rakam puan ekler, negatif rakam puan siler.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Miktar</label>
                        <Input type="number" placeholder="Örn: 50 veya -25" value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Neden (İsteğe bağlı)</label>
                        <Textarea placeholder="Neden puan ekliyor/siliyorsunuz?" value={reason} onChange={e => setReason(e.target.value)} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button className="flex-1 font-bold" onClick={() => {
                        onConfirm(user.id, parseInt(amount), reason);
                        setIsOpen(false);
                    }}>İşlemi Tamamla</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
