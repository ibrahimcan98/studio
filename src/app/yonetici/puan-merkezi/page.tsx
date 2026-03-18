'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, increment, addDoc, serverTimestamp, getDoc, writeBatch } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, XCircle, Trophy, User, History, Plus, Minus, Search, Clock, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function PuanMerkeziPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

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

      // Kullanıcı puanını artır
      batch.update(doc(db, 'users', request.userId), {
        academyPoints: increment(request.points)
      });

      // Geçmişe ekle
      batch.add(collection(db, 'users', request.userId, 'point-history'), {
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
      await updateDoc(doc(db, 'loyalty-requests', request.id), {
        status: 'rejected',
        processedAt: serverTimestamp()
      });
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
      batch.add(collection(db, 'users', userId, 'point-history'), {
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
        <TabsList className="bg-white border p-1 rounded-xl h-auto gap-2">
          <TabsTrigger value="requests" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Onay Bekleyenler</TabsTrigger>
          <TabsTrigger value="manual" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Puan Ekle / Sil</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Tüm Geçmiş</TabsTrigger>
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
                    <h3 className="text-lg font-bold text-slate-800">{req.userEmail}</h3>
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
                                  <p className="font-bold text-slate-800">{parent.displayName || 'İsimsiz Veli'}</p>
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

import { where } from 'firebase/firestore';
import { ArrowUpRight } from 'lucide-react';
