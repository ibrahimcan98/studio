
'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
    Loader2, 
    History,
    Search,
    Filter,
    Clock,
    User,
    Activity,
    Bell,
    Calendar,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ShieldAlert } from 'lucide-react';

export default function DenetimKaydiPage() {
    const { user, loading: authLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [selectedAdmin, setSelectedAdmin] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [logLimit, setLogLimit] = useState(100);

    const isUltraAdmin = user?.email === 'tubakodak@turkcocukakademisii.com';

    useEffect(() => {
        if (!authLoading && !isUltraAdmin) {
            router.replace('/yonetici');
        }
    }, [authLoading, isUltraAdmin, router]);

    // Activity Logs Query
    const activityQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(
            collection(db, 'activity-log'),
            orderBy('createdAt', 'desc'),
            limit(logLimit)
        );
    }, [db, logLimit]);

    const { data: rawLogs, isLoading } = useCollection(activityQuery);

    const uniqueEvents = useMemo(() => {
        if (!rawLogs) return [];
        const events = new Set(rawLogs.map(log => log.event).filter(Boolean));
        return Array.from(events).sort();
    }, [rawLogs]);

    const uniqueAdmins = useMemo(() => {
        if (!rawLogs) return [];
        const admins = new Set(rawLogs.map(log => log.adminEmail).filter(Boolean));
        return Array.from(admins).sort();
    }, [rawLogs]);

    const filteredLogs = useMemo(() => {
        if (!rawLogs) return [];
        let filtered = [...rawLogs];
        
        const q = searchQuery.toLowerCase();
        if (q) {
            filtered = filtered.filter(log => 
                log.event?.toLowerCase().includes(q) || 
                JSON.stringify(log.details || {}).toLowerCase().includes(q)
            );
        }

        if (selectedEvent !== 'all') {
            filtered = filtered.filter(log => log.event === selectedEvent);
        }

        if (selectedAdmin !== 'all') {
            filtered = filtered.filter(log => log.adminEmail === selectedAdmin);
        }

        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            filtered = filtered.filter(log => {
                const logDate = log.createdAt instanceof Timestamp ? log.createdAt.toDate() : new Date(log.createdAt);
                return logDate >= fromDate;
            });
        }

        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(log => {
                const logDate = log.createdAt instanceof Timestamp ? log.createdAt.toDate() : new Date(log.createdAt);
                return logDate <= toDate;
            });
        }

        return filtered;
    }, [rawLogs, searchQuery, selectedEvent, selectedAdmin, dateFrom, dateTo]);

    const formatLogDate = (timestamp: any) => {
        if (!timestamp) return '---';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return format(date, 'd MMMM yyyy HH:mm', { locale: tr });
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        {authLoading ? 'Yetki Kontrol Ediliyor...' : 'Kayıtlar Yükleniyor...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!isUltraAdmin) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                    <div className="bg-red-100 p-4 rounded-full"><ShieldAlert className="h-10 w-10 text-red-600" /></div>
                    <h2 className="text-2xl font-bold">Yetkisiz Erişim</h2>
                    <p className="text-muted-foreground">Bu sayfayı görüntülemek için Süper Admin yetkisine sahip olmanız gerekmektedir.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 sm:p-8 pt-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3 underline decoration-primary/30 decoration-8 underline-offset-[-2px]">
                        <History className="w-8 h-8 text-primary" /> DENETİM KAYDI
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Sistem üzerindeki tüm kritik hareketlerin kronolojik dökümü.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white border-slate-200 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        SON {logLimit} KAYIT
                    </Badge>
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm rounded-[32px] overflow-hidden">
                <CardHeader className="pb-6">
                    <div className="flex flex-col gap-6">
                        {/* Arama ve Limit */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Detaylarda ara..."
                                    className="pl-11 h-12 bg-white border-slate-200 rounded-2xl font-medium focus:ring-primary/20 transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Kayıt Sayısı:</span>
                                    <Select value={String(logLimit)} onValueChange={(v) => setLogLimit(Number(v))}>
                                        <SelectTrigger className="w-24 h-10 rounded-xl border-slate-200 bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="100">100</SelectItem>
                                            <SelectItem value="250">250</SelectItem>
                                            <SelectItem value="500">500</SelectItem>
                                            <SelectItem value="1000">1000</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Detaylı Filtreler */}
                        <div className="flex flex-wrap gap-4 items-end bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                            <div className="space-y-2 flex-1 min-w-[200px]">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Olay Tipi</label>
                                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                                        <SelectValue placeholder="Tüm Olaylar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tüm Olaylar</SelectItem>
                                        {uniqueEvents.map(event => (
                                            <SelectItem key={event} value={event}>{event}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 flex-1 min-w-[200px]">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Yönetici</label>
                                <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
                                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                                        <SelectValue placeholder="Tüm Yöneticiler" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tüm Yöneticiler</SelectItem>
                                        {uniqueAdmins.map(admin => (
                                            <SelectItem key={admin} value={admin}>{admin}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 flex-none">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Başlangıç</label>
                                <Input 
                                    type="date" 
                                    className="h-11 rounded-xl border-slate-200 bg-white" 
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 flex-none">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bitiş</label>
                                <Input 
                                    type="date" 
                                    className="h-11 rounded-xl border-slate-200 bg-white" 
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>

                            <Button 
                                variant="ghost" 
                                className="h-11 px-4 text-slate-400 hover:text-red-500 font-bold"
                                onClick={() => {
                                    setSelectedEvent('all');
                                    setSelectedAdmin('all');
                                    setDateFrom('');
                                    setDateTo('');
                                    setSearchQuery('');
                                }}
                            >
                                Sıfırla
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="w-[80px] text-[10px] font-black uppercase tracking-widest px-8">İkon</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Olay</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Detaylar</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Tarih</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-64 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-40">
                                                <Activity className="w-12 h-12 mb-2" />
                                                <p className="font-bold text-slate-500">Henüz bir kayıt bulunamadı.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <LogItem key={log.id} log={log} formatDate={formatLogDate} />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center pb-12">
                <Button 
                    variant="ghost" 
                    className="text-slate-400 hover:text-primary font-black text-[10px] uppercase tracking-widest gap-2 transition-all"
                    onClick={() => setLogLimit(prev => prev + 100)}
                >
                    <ChevronDown className="w-4 h-4" /> Daha Fazla Yükle
                </Button>
            </div>
        </div>
    );
}

function LogItem({ log, formatDate }: { log: any, formatDate: (t: any) => string }) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-100">
            <TableCell className="px-8 py-6">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {log.icon || '📝'}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm leading-tight">{log.event}</span>
                    {log.adminEmail && (
                        <div className="flex items-center gap-1.5 mt-1">
                            <User className="w-3 h-3 text-primary/50" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{log.adminEmail}</span>
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell className="max-w-md">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-1">
                            {Object.entries(log.details || {}).slice(0, isOpen ? undefined : 2).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase min-w-[80px]">{key}:</span>
                                    <span className="text-xs font-semibold text-slate-600 truncate">{String(value)}</span>
                                </div>
                            ))}
                            {!isOpen && Object.keys(log.details || {}).length > 2 && (
                                <span className="text-[10px] font-bold text-primary/60 italic">+{Object.keys(log.details || {}).length - 2} detay daha...</span>
                            )}
                        </div>
                        {Object.keys(log.details || {}).length > 2 && (
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-200/50">
                                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                            </CollapsibleTrigger>
                        )}
                    </div>
                    <CollapsibleContent className="space-y-1 pt-1">
                        {/* More details are rendered if isOpen is true by the slice above, 
                            but we could put them here too if structure was different */}
                    </CollapsibleContent>
                </Collapsible>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px] font-bold">{formatDate(log.createdAt)}</span>
                </div>
            </TableCell>
        </TableRow>
    );
}
