
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, MapPin, Clock, ExternalLink, Activity, Monitor, Baby, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Helper to map paths to friendly Turkish names
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
  const [now, setNow] = useState(new Date());

  // Real-time listener for users who have been active
  const activeUsersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'users'),
      where('lastActiveAt', '!=', null),
      orderBy('lastActiveAt', 'desc'),
      limit(50)
    );
  }, [db]);

  const { data: users, isLoading } = useCollection(activeUsersQuery);

  // Update "now" every 30 seconds to keep "last seen" times fresh
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const liveUsers = useMemo(() => {
    if (!users) return [];
    
    // Filter users active in the last 5 minutes for "Live" status
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    
    return users.map(user => {
      const lastActive = user.lastActiveAt?.toDate();
      const isOnline = lastActive && lastActive > fiveMinutesAgo;
      
      return {
        ...user,
        isOnline,
        lastActive
      };
    });
  }, [users, now]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Canlı Yayın Hazırlanıyor...</p>
      </div>
    );
  }

  const onlineCount = liveUsers.filter(u => u.isOnline).length;

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
        <Badge className="bg-emerald-100 text-emerald-700 border-none font-black px-4 py-2 text-xs">
            {onlineCount} AKTİF KULLANICI
          </Badge>
      </div>

      <div className="grid gap-6">
        {liveUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveUsers.map((user) => (
              <Card key={user.id} className={cn(
                "border-none shadow-md transition-all hover:shadow-lg overflow-hidden relative group",
                user.isOnline ? "ring-2 ring-emerald-500/20" : "opacity-75 grayscale-[0.5]"
              )}>
                {user.isOnline && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                )}
                <CardHeader className="pb-3 flex flex-row items-center gap-4 space-y-0">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    {user.isOnline && (
                        <span className="absolute -bottom-1 -right-1 block h-4 w-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                    )}
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
                        <span>Son görülme: {user.lastActive ? formatDistanceToNow(user.lastActive, { addSuffix: true, locale: tr }) : 'Hiç'}</span>
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
                    {user.role === 'parent' ? (
                      <Link 
                        href={`/yonetici/kullanicilar?userId=${user.id}`}
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Detaya Git <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed">
                        Detay Yok <Clock className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-slate-200 bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <Activity className="w-12 h-12 text-slate-200" />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Henüz takip edilecek veri bulunmuyor</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
