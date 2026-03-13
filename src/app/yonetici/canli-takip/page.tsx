
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { 
    Users, 
    Monitor, 
    Clock, 
    MapPin, 
    Loader2, 
    Circle, 
    ShieldCheck, 
    Baby,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { differenceInMinutes } from 'date-fns';

export default function CanliTakipPage() {
    const db = useFirestore();
    const [now, setNow] = useState(new Date());

    // Saniyede bir "online süresi"ni güncellemek için
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 10000);
        return () => clearInterval(interval);
    }, []);

    const liveUsersQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(
            collection(db, 'users'), 
            where('isOnline', '==', true),
            limit(50)
        );
    }, [db]);

    const { data: users, isLoading } = useCollection(liveUsersQuery);

    const getOnlineDuration = (since: any) => {
        if (!since) return 'Yeni';
        const date = since.toDate ? since.toDate() : new Date(since);
        const diff = differenceInMinutes(now, date);
        if (diff < 1) return 'Az önce';
        return `${diff} dk`;
    };

    const getPageName = (path: string) => {
        if (!path) return 'Ana Sayfa';
        if (path === '/') return 'Ana Sayfa';
        if (path.includes('/ebeveyn-portali')) return 'Ebeveyn Portalı';
        if (path.includes('/ogretmen-portali')) return 'Öğretmen Portalı';
        if (path.includes('/cocuk-modu')) return 'Çocuk Modu 👧';
        if (path.includes('/sepet')) return 'Sepet 🛒';
        if (path.includes('/kurslar')) return 'Kurslar';
        return path;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aktif Kullanıcılar Aranıyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 font-sans pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Canlı Takip</h1>
                    <p className="text-slate-500 font-medium mt-1">Sitedeki kayıtlı kullanıcıların anlık hareketleri.</p>
                </div>
                <Badge className="bg-emerald-500 text-white font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px] animate-pulse">
                    {users?.length || 0} AKTİF
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <Card key={user.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white overflow-hidden group">
                            <CardHeader className="pb-4 bg-slate-50/50">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-bold text-slate-800">{user.firstName} {user.lastName}</CardTitle>
                                            <p className="text-[10px] text-slate-400 font-mono uppercase">ID: {user.id.substring(0, 8)}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className={cn(
                                        "text-[9px] font-black uppercase tracking-tighter px-2",
                                        user.role === 'teacher' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                        {user.role === 'teacher' ? 'Öğretmen' : 'Veli'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        <span>Konum:</span>
                                    </div>
                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-bold max-w-[150px] truncate">
                                        {getPageName(user.currentPath)}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                                        <span>Online Süresi:</span>
                                    </div>
                                    <span className="font-bold text-slate-700">{getOnlineDuration(user.onlineSince)}</span>
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Canlı</span>
                                    </div>
                                    <div className="text-[9px] text-slate-300 italic">
                                        Son işlem: {user.lastActiveAt ? new Date(user.lastActiveAt.toDate()).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                        <Users className="w-12 h-12 mx-auto text-slate-200" />
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Şu an sitede kayıtlı aktif kullanıcı yok.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
