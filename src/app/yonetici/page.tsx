
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, collectionGroup } from 'firebase/firestore';
import { 
  TrendingUp, 
  Globe2, 
  Activity,
  DollarSign,
  CalendarCheck,
  Loader2,
  Clock,
  Baby
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, getCountryFromPhone } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { writeBatch, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

function GrowthCard({ title, value, subValue, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-md bg-white overflow-hidden relative group">
      <div className={cn("absolute top-0 left-0 w-1 h-full", color)} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", color.replace('bg-', 'text-'))} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-slate-900">{value}</div>
        <div className="text-[10px] font-medium text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-500 font-bold">{subValue}</span> bu ay
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isClearing, setIsClearing] = useState(false);

  const parentsQuery = useMemoFirebase(() => db ? query(collection(db, 'users'), where('role', '==', 'parent')) : null, [db]);
  const slotsQuery = useMemoFirebase(() => db ? query(collection(db, 'lesson-slots'), where('status', '==', 'booked')) : null, [db]);
  const childrenQuery = useMemoFirebase(() => db ? query(collectionGroup(db, 'children')) : null, [db]);
  const activityLogQuery = useMemoFirebase(() => db ? query(collection(db, 'activity-log'), orderBy('createdAt', 'desc'), limit(30)) : null, [db]);

  const { data: parents, isLoading: parentsLoading } = useCollection(parentsQuery);
  const { data: slots, isLoading: slotsLoading } = useCollection(slotsQuery);
  const { data: children, isLoading: childrenLoading } = useCollection(childrenQuery);
  const { data: activityLog, isLoading: activityLoading } = useCollection(activityLogQuery);

  const metrics = useMemo(() => {
    if (!parents || !slots || !children) return null;

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    // Filter slots for the selected month
    const monthSlots = slots.filter(slot => {
        const slotTime = slot.startTime?.toDate ? slot.startTime.toDate() : new Date(slot.startTime);
        return isWithinInterval(slotTime, { start: monthStart, end: monthEnd });
    });

    const sessions: { [key: string]: any[] } = {};
    monthSlots.forEach(slot => {
        const date = slot.startTime?.toDate().toDateString();
        const key = `${slot.childId}_${slot.teacherId}_${date}_${slot.packageCode}`;
        if (!sessions[key]) sessions[key] = [];
        sessions[key].push(slot);
    });

    const groupedLessons: any[] = [];
    Object.values(sessions).forEach(sessionSlots => {
        sessionSlots.sort((a, b) => a.startTime.seconds - b.startTime.seconds);
        let currentLesson: any = null;
        sessionSlots.forEach(slot => {
            if (!currentLesson || (slot.startTime.seconds - currentLesson.lastSlotSeconds > 300)) {
                currentLesson = { ...slot, slotCount: 1, lastSlotSeconds: slot.startTime.seconds };
                groupedLessons.push(currentLesson);
            } else {
                currentLesson.slotCount += 1;
                currentLesson.lastSlotSeconds = slot.startTime.seconds;
            }
        });
    });

    const totalPaidLessons = groupedLessons.filter(l => l.packageCode !== 'FREE_TRIAL').length;
    const totalFreeTrials = groupedLessons.filter(l => l.packageCode === 'FREE_TRIAL').length;
    
    // Total active students newly registered in this month
    const newStudents = children.filter(c => {
        if (!c.createdAt) return false;
        const cTime = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
        return isWithinInterval(cTime, { start: monthStart, end: monthEnd });
    }).length;

    const trialUserIds = new Set(groupedLessons.filter(l => l.packageCode === 'FREE_TRIAL').map(l => l.bookedBy));
    const paidUserIds = new Set(groupedLessons.filter(l => l.packageCode !== 'FREE_TRIAL').map(l => l.bookedBy));
    const convertedUsers = Array.from(trialUserIds).filter(id => paidUserIds.has(id)).length;
    const conversionRate = trialUserIds.size > 0 ? ((convertedUsers / trialUserIds.size) * 100).toFixed(1) : 0;

    const countries: any = {};
    parents.forEach(p => {
        const pTime = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt?.seconds * 1000 || 0);
        if (isWithinInterval(pTime, { start: monthStart, end: monthEnd })) {
            const country = p.manualCountry || getCountryFromPhone(p.phoneNumber);
            countries[country] = (countries[country] || 0) + 1;
        }
    });

    return { activeStudents: newStudents, totalPaidLessons, totalFreeTrials, conversionRate, countries };
  }, [parents, slots, children, selectedDate]);

  const handleClearLogs = async () => {
    if (!db || !activityLog || activityLog.length === 0) return;
    setIsClearing(true);
    try {
        const batch = writeBatch(db);
        activityLog.forEach((log: any) => {
            const ref = doc(db, 'activity-log', log.id);
            batch.delete(ref);
        });
        await batch.commit();
        toast({ title: 'Akış temizlendi!', duration: 3000, className: 'bg-green-500 text-white' });
    } catch (e) {
        console.error("Error clearing logs", e);
        toast({ variant: 'destructive', title: 'Hata oluştu' });
    } finally {
        setIsClearing(false);
    }
  };

  if (parentsLoading || slotsLoading || childrenLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        </div>
    );
  }

  return (
    <div className="space-y-10 font-sans pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Merkezi Kontrol</h1>
          <p className="text-slate-500 font-medium mt-1">Growth, Operasyon ve Satış Verileri</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border p-1 shadow-sm">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="w-32 text-center text-xs font-bold uppercase tracking-widest text-slate-700">
                {selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GrowthCard title="Yeni Öğrenci" value={metrics?.activeStudents || 0} subValue="Bu ay eklenen" icon={Baby} color="bg-indigo-500" />
        <GrowthCard title="Gerçekleşen Satış" value={metrics?.totalPaidLessons || 0} subValue="Ders İşlendi" icon={DollarSign} color="bg-emerald-500" />
        <GrowthCard title="Dönüşüm Oranı" value={`%${metrics?.conversionRate || 0}`} subValue="Trial → Paket" icon={TrendingUp} color="bg-amber-500" />
        <GrowthCard title="Gerçekleşen Deneme" value={metrics?.totalFreeTrials || 0} subValue="Ders İşlendi" icon={CalendarCheck} color="bg-blue-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-none shadow-md overflow-hidden">
          <CardHeader className="bg-white border-b pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-primary" /> Ülke Dağılımı (Veliler)
            </CardTitle>
            <CardDescription>Telefon alan kodlarına göre analiz.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              {Object.entries(metrics?.countries || {})
                .sort((a: any, b: any) => b[1] - a[1])
                .map(([name, count]: any, index) => (
                <div key={name} className={cn(
                    "flex items-center justify-between p-4 border-b last:border-0 hover:bg-slate-50 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {index + 1}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{name}</span>
                  </div>
                  <Badge variant="secondary" className="font-black text-slate-900 bg-slate-100">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-md overflow-hidden flex flex-col">
           <CardHeader className="flex flex-row items-center justify-between bg-white border-b pb-4">
            <div>
              <CardTitle className="text-lg font-bold">🔔 Operasyonel Akış</CardTitle>
              <CardDescription>Gerçek zamanlı sistem olayları — ders, iptal, kayıt, satış.</CardDescription>
            </div>
            <div className="flex gap-2 items-center">
                <Button variant="outline" size="sm" className="h-8 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleClearLogs} disabled={isClearing || !activityLog || activityLog.length === 0}>
                    {isClearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Temizle
                </Button>
                <Activity className="h-5 w-5 text-slate-300 ml-2" />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="max-h-[400px] overflow-y-auto">
                {activityLoading && (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary/30 w-6 h-6" /></div>
                )}
                {!activityLoading && (!activityLog || activityLog.length === 0) && (
                    <p className="text-xs text-slate-400 italic text-center py-20">Henüz aktivite bulunmuyor.</p>
                )}
                {activityLog?.map((log: any) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 border-b last:border-0 hover:bg-slate-50 transition-colors">
                        <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full border flex-shrink-0">
                            {log.icon || '🔔'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900">{log.event}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                                {Object.entries(log.details || {}).map(([k, v]: any) => (
                                    <p key={k} className="text-[11px] text-slate-500">
                                        <span className="font-semibold text-slate-600">{k}:</span> {v}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 justify-end uppercase whitespace-nowrap">
                                <Clock className="w-3 h-3" />
                                {log.createdAt?.toDate().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
