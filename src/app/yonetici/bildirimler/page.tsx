'use client';

import { NotificationSender } from '@/components/admin/notification-sender';
import { Megaphone, History, Send, Bell, Loader2, Smartphone, Mail, Link as LinkIcon, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function BildirimlerPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bildirim Paneli</h1>
          <p className="text-slate-500 font-medium mt-1">Türk Çocuk Akademisi sakinlerine duyuru ve bildirim gönderin.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-slate-700">Canlı Duyuru</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Sender Area */}
        <div className="xl:col-span-2 space-y-8">
          <NotificationSender />
        </div>

        {/* Sidebar / Stats / Hints */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-none shadow-lg bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Megaphone className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> İpucu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Gönderdiğiniz her bildirim veli paneline anlık olarak düşecek ve veli siteye girdiğinde karşısına bir onay penceresi olarak çıkacaktır.
              </p>
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold">1</div>
                  <span className="text-xs font-semibold">Hedef kitlenizi seçin.</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold">2</div>
                  <span className="text-xs font-semibold">Mesajınızı ve kanalınızı belirleyin.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold">3</div>
                  <span className="text-xs font-semibold">Yönlendirme linki ekleyerek aksiyonu artırın.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <NotificationHistory />
        </div>
      </div>
    </div>
  );
}

function NotificationHistory() {
  const db = useFirestore();
  const q = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'notifications-log'),
      where('createdAt', '!=', ''), // Dummy where to satisfy query needs if needed, but we'll sort in memo
    );
  }, [db]);

  const { data: logs, isLoading } = useCollection(q);

  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const sortedLogs = useMemo(() => {
    if (!logs) return [];
    return [...logs].sort((a, b) => {
      const aTime = a.createdAt?.toDate?.().getTime() || 0;
      const bTime = b.createdAt?.toDate?.().getTime() || 0;
      return bTime - aTime;
    }).slice(0, 10);
  }, [logs]);

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none shadow-lg bg-white">
        <CardContent className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-3xl border-none shadow-lg bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 bg-slate-50/30">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <History className="h-4 w-4 text-slate-400" /> Yakın Zamandaki Gönderimler
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {sortedLogs.length > 0 ? sortedLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedLog(log)}>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
                    <Megaphone className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{log.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 font-medium truncate italic shrink-0">
                        {log.createdAt?.toDate ? format(log.createdAt.toDate(), 'd MMMM HH:mm', { locale: tr }) : 'Yeni'}
                      </span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 h-4 py-0 border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        {log.target === 'all' ? 'HERKES' : log.target === 'parents' ? 'VELİLER' : log.target === 'teachers' ? 'ÖĞRETMENLER' : 'SEÇİLENLER'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      {log.channels?.includes('push') && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-blue-50 px-1.5 py-0.5 rounded-md">
                              <Smartphone className="h-2.5 w-2.5" /> {log.results?.push?.successCount || 0}
                          </div>
                      )}
                      {log.channels?.includes('email') && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
                              <Mail className="h-2.5 w-2.5" /> {log.results?.email?.successCount || 0}
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                <History className="h-12 w-12 text-slate-100 mb-3" />
                <p className="text-xs text-slate-400 font-bold">Henüz bildirim kaydı yok.</p>
                <p className="text-[10px] text-slate-300 mt-1">İlk bildiriminizi yukarıdan gönderin.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{selectedLog?.title}</DialogTitle>
            <DialogDescription className="font-medium">Bildirim Detayları ve Gönderim Raporu</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Mesaj İçeriği</p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedLog?.body}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 p-4 rounded-2xl">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">Hedef</p>
                    <Badge variant="secondary" className="font-bold">
                        {selectedLog?.target === 'all' ? 'Tüm Kullanıcılar' : selectedLog?.target === 'parents' ? 'Tüm Veliler' : selectedLog?.target === 'teachers' ? 'Tüm Öğretmenler' : 'Özel Liste'}
                    </Badge>
                </div>
                <div className="border border-slate-100 p-4 rounded-2xl">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">Gönderim Tarihi</p>
                    <p className="text-sm font-bold text-slate-700">
                        {selectedLog?.createdAt?.toDate ? format(selectedLog.createdAt.toDate(), 'd MMMM yyyy HH:mm', { locale: tr }) : '-'}
                    </p>
                </div>
            </div>

            {selectedLog?.expiresAt && (
                <div className="border border-orange-100 bg-orange-50/30 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-black uppercase text-orange-400 tracking-wider">Geçerlilik Süresi</p>
                        <p className="text-sm font-bold text-orange-700">
                            {selectedLog?.expiresAt?.toDate ? format(selectedLog.expiresAt.toDate(), 'd MMMM yyyy', { locale: tr }) : selectedLog.expiresAt} tarihine kadar aktif.
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Sonuçlar</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLog?.channels?.includes('push') && (
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Smartphone className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-bold text-blue-700">Anlık Bildirim</span>
                            </div>
                            <span className="text-lg font-black text-blue-800">{selectedLog.results?.push?.successCount || 0}</span>
                        </div>
                    )}
                    {selectedLog?.channels?.includes('email') && (
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-bold text-amber-700">E-posta</span>
                            </div>
                            <span className="text-lg font-black text-amber-800">{selectedLog.results?.email?.successCount || 0}</span>
                        </div>
                    )}
                </div>
            </div>
            
            {selectedLog?.redirectPath && (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <LinkIcon className="h-3 w-3" />
                    Yönlendirme: <span className="text-primary font-bold">{selectedLog.redirectPath}</span>
                </div>
            )}

            {selectedLog?.recipients && selectedLog.recipients.length > 0 && (
                <div className="space-y-3 pt-2">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                        <Users className="h-3 w-3" /> Alıcı Listesi ({selectedLog.recipients.length})
                    </p>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                        <div className="max-h-[200px] overflow-y-auto divide-y divide-slate-50">
                            {selectedLog.recipients.map((r: any, i: number) => (
                                <div key={r.id || i} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <span className="text-xs font-bold text-slate-700">{r.name || 'İsimsiz Kullanıcı'}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{r.email}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
