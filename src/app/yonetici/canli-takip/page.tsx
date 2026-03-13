'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Activity, Monitor, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

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
  if (path.startsWith('/cocuk-modu')) return '🧒 Çocuk Modu';
  if (path.startsWith('/ogretmen-portali')) return '👩‍🏫 Öğretmen Paneli';
  return pathMap[path] || path;
};

export default function LiveTrackingPage() {
  const db = useFirestore();

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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sistem İzleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            Canlı Takip
          </h1>
          <p className="text-slate-500 font-medium mt-1">Platformdaki aktif kullanıcıların anlık özeti.</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700 border-none font-black px-4 py-2 text-xs uppercase tracking-wider">
            {liveUsers?.length || 0} Aktif
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveUsers?.map((user) => (
          <Card 
            key={user.id} 
            className="border-none shadow-md ring-1 ring-slate-100 overflow-hidden relative bg-white"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <CardHeader className="pb-3 flex flex-row items-center gap-4 space-y-0">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 truncate">{user.firstName} {user.lastName}</h3>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                  {user.role === 'teacher' ? '👩‍🏫 Öğretmen' : '👨‍👩- Veli'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Monitor className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{getFriendlyPath(user.currentPath)}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Son hareket: {user.lastActiveAt ? formatDistanceToNow(user.lastActiveAt.toDate(), { addSuffix: true, locale: tr }) : 'Az önce'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {liveUsers?.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-slate-400 font-bold uppercase text-xs tracking-widest">Şu an aktif kullanıcı bulunmuyor.</div>
        )}
      </div>
    </div>
  );
}