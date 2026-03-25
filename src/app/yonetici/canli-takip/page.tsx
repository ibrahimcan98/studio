
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { 
  Activity, 
  MapPin, 
  Clock, 
  User as UserIcon, 
  ExternalLink,
  Search,
  Monitor,
  MousePointer2,
  RefreshCw,
  Loader2,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';

export default function CanliTakipPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'parent' | 'teacher'>('all');

  // Herhangi bir aktivite gösteren kullanıcıları çek, filtrelemeyi JS tarafında yapalım (index hatası almamak için)
  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
        collection(db, 'users'),
        orderBy('lastActiveAt', 'desc'),
        limit(50)
    );
  }, [db]);

  const { data: users, isLoading } = useCollection(usersQuery);

  const handleDisconnect = async (userId: string) => {
    if (!db || !window.confirm('Bu kullanıcının bağlantısını kesmek istediğinize emin misiniz?')) return;
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { 
            forceLogout: true,
            isOnline: false,
            status: '🛑 Bağlantı Kesildi'
        });
    } catch (error) {
        console.error('Disconnect error:', error);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => {
        // "Away olanları gösterme" -> Sadece isOnline: true olanları göster
        if (!user.isOnline) return false;
        
        const matchesSearch = 
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  if (isLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Activity className="h-10 w-10 text-emerald-500 animate-pulse" /> Canlı İzleme
          </h1>
          <p className="text-slate-500 font-medium mt-1">Platformdaki **aktif** kullanıcı aktiviteleri ve konumları.</p>
        </div>
        <div className="flex gap-3">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-1.5 font-bold uppercase tracking-wider">
                {filteredUsers.length} ÇEVRİMİÇİ
            </Badge>
            <button 
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                title="Yenile"
            >
                <RefreshCw className="h-5 w-5 text-slate-400" />
            </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
                placeholder="İsim veya e-posta ile ara..." 
                className="pl-10 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Button 
                variant={roleFilter === 'all' ? 'default' : 'outline'} 
                onClick={() => setRoleFilter('all')}
                className="flex-1 md:flex-none"
            >Hepsi</Button>
            <Button 
                variant={roleFilter === 'parent' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('parent')}
                className="flex-1 md:flex-none"
            >Veliler</Button>
            <Button 
                variant={roleFilter === 'teacher' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('teacher')}
                className="flex-1 md:flex-none"
            >Eğitmenler</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
            <Card key={user.id} className="border-none shadow-md overflow-hidden relative group transition-all hover:scale-[1.02] ring-2 ring-emerald-500/20">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border bg-emerald-50 border-emerald-100 text-emerald-600">
                                {user.firstName?.[0] || <UserIcon className="h-5 w-5" />}
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    {user.firstName} {user.lastName}
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase font-bold tracking-tight">
                                    {user.role === 'admin' ? 'YÖNETİCİ' : user.role === 'teacher' ? 'EĞİTMEN' : 'VELİ'}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            ONLINE
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                <MousePointer2 className="h-3 w-3 text-primary" />
                                <span className="text-slate-400">Durum:</span>
                                <span className="font-bold text-slate-900">{user.status || 'Geziniyor'}</span>
                            </div>
                        </div>
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-7 px-2 text-[10px] font-bold border-none shadow-none bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            onClick={() => handleDisconnect(user.id)}
                        >
                            <LogOut className="h-3 w-3 mr-1" /> Bağlantıyı Kes
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[11px] p-2 rounded-lg border border-dashed bg-blue-50/50 border-blue-200 text-blue-700 transition-colors">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate" title={user.currentPath}>{user.currentPath || '/'}</span>
                        <Link href={user.currentPath || '#'} target="_blank" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="h-3 w-3" />
                        </Link>
                    </div>
                    
                    <div className="pt-2 border-t flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                        <div className="flex items-center gap-1">
                            <Monitor className="h-3 w-3" />
                            Web Browser
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {user.lastActiveAt ? formatDistanceToNow(user.lastActiveAt.toDate(), { addSuffix: true, locale: tr }) : '-'}
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}

        {filteredUsers.length === 0 && (
            <div className="col-span-full py-20 text-center">
                <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
                    <Activity className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-lg font-bold text-slate-400">Şu an Kimse Online Değil</h3>
                <p className="text-sm text-slate-400">Siteyi kullanan aktif kullanıcı olduğunda burada görünecektir.</p>
            </div>
        )}
      </div>
    </div>
  );
}
