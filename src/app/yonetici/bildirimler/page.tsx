'use client';

import { NotificationSender } from '@/components/admin/notification-sender';
import { Megaphone, History, Send, Bell, Loader2, Smartphone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

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
    <Card className="rounded-3xl border-none shadow-lg bg-white overflow-hidden">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" /> Yakın Zamandaki Gönderimler
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {sortedLogs.length > 0 ? sortedLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50/50 transition-colors group">
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
  );
}
