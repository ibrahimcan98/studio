
'use client';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, collectionGroup } from 'firebase/firestore';
import Link from 'next/link';
import { MonthlyDashboardDetails } from '@/components/admin/monthly-dashboard-details';
import { buildCompletedTeacherSessions } from '@/lib/teacher-earnings';
import { 
  TrendingUp, 
  Globe2, 
  Activity,
  DollarSign,
  CalendarCheck,
  Loader2,
  Clock,
  Baby,
  ChevronLeft, 
  ChevronRight, 
  Trash2,
  Bell,
  PhoneCall,
  CalendarDays
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, getCountryFromPhone, sortLogDetails } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { writeBatch, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type GrowthCardProps = {
  title: string;
  value: string | number;
  subValue: string;
  icon: React.ElementType;
  accent: string;
  iconStyle: string;
  glowStyle: string;
};

function GrowthCard({ title, value, subValue, icon: Icon, accent, iconStyle, glowStyle }: GrowthCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className={cn("absolute inset-x-0 top-0 h-1", accent)} />
      <div className={cn("pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full blur-2xl opacity-50 transition-opacity group-hover:opacity-80", glowStyle)} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{title}</p>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
          </div>
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset", iconStyle)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
          <span className={cn("h-1.5 w-1.5 rounded-full", accent)} />
          <p className="text-[11px] font-semibold text-slate-500">
            {subValue} <span className="font-medium text-slate-400">· seçili ay</span>
          </p>
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
  const slotsQuery = useMemoFirebase(() => db ? query(collection(db, 'lesson-slots'), where('status', 'in', ['booked', 'completed'])) : null, [db]);
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

    const groupedLessons = buildCompletedTeacherSessions(monthSlots).map(lesson => ({
      ...lesson,
      bookedBy: monthSlots.find(slot => slot.id === lesson.id)?.bookedBy,
    }));
    const totalPaidLessons = groupedLessons.filter(l => l.packageCode !== 'FREE_TRIAL').length;
    const totalFreeTrials = groupedLessons.filter(l => l.packageCode === 'FREE_TRIAL').length;
    // Total active students newly registered in this month
    const newStudents = children.filter(c => {
        if (!c.createdAt) return false;
        const cTime = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
        return isWithinInterval(cTime, { start: monthStart, end: monthEnd });
    }).length;

    const countries: any = {};
    parents.forEach(p => {
        const country = p.manualCountry || getCountryFromPhone(p.phoneNumber);
        countries[country] = (countries[country] || 0) + 1;
    });

    return { activeStudents: newStudents, totalPaidLessons, totalFreeTrials, countries };
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
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-indigo-50/70 p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-sky-100/50 blur-3xl" />

        <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Yönetim özeti</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Merkezi Kontrol</h1>
            <p className="mt-1.5 text-sm font-medium text-slate-500">Öğrenci, ders ve dönüşüm performansının aylık görünümü</p>
          </div>

          <div className="flex w-full items-center rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-sm backdrop-blur md:w-auto">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Önceki ay"
              className="h-9 w-9 shrink-0 rounded-xl text-slate-500 hover:bg-slate-100"
              onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-3 md:min-w-40">
              <CalendarDays className="h-4 w-4 shrink-0 text-indigo-500" />
              <div className="text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">Rapor dönemi</p>
                <p className="whitespace-nowrap text-xs font-black uppercase tracking-wider text-slate-700">
                  {selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sonraki ay"
              className="h-9 w-9 shrink-0 rounded-xl text-slate-500 hover:bg-slate-100"
              onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-2 min-[1180px]:grid-cols-4">
          <GrowthCard
            title="Yeni Öğrenci"
            value={metrics?.activeStudents || 0}
            subValue="Yeni kayıt"
            icon={Baby}
            accent="bg-indigo-500"
            iconStyle="bg-indigo-50 text-indigo-600 ring-indigo-100"
            glowStyle="bg-indigo-200"
          />
          <GrowthCard
            title="Ücretli Ders"
            value={metrics?.totalPaidLessons || 0}
            subValue="Tamamlanan ders"
            icon={DollarSign}
            accent="bg-emerald-500"
            iconStyle="bg-emerald-50 text-emerald-600 ring-emerald-100"
            glowStyle="bg-emerald-200"
          />
          <GrowthCard
            title="Toplam Ders"
            value={(metrics?.totalPaidLessons || 0) + (metrics?.totalFreeTrials || 0)}
            subValue="Ücretli ders ve deneme"
            icon={TrendingUp}
            accent="bg-amber-500"
            iconStyle="bg-amber-50 text-amber-600 ring-amber-100"
            glowStyle="bg-amber-200"
          />
          <GrowthCard
            title="Deneme Dersi"
            value={metrics?.totalFreeTrials || 0}
            subValue="Tamamlanan deneme"
            icon={CalendarCheck}
            accent="bg-sky-500"
            iconStyle="bg-sky-50 text-sky-600 ring-sky-100"
            glowStyle="bg-sky-200"
          />
        </div>
      </section>

      <MonthlyDashboardDetails slots={slots || []} month={selectedDate} />

      <div className="grid gap-6 min-[992px]:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                  <Activity className="h-5 w-5" /> Hızlı Erişim
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
               <Button variant="outline" className="w-full justify-start rounded-xl font-bold gap-2" asChild>
                  <Link href="/yonetici/bildirimler">
                    <Bell className="h-4 w-4" /> Bildirim Paneli
                  </Link>
               </Button>
               <Button variant="outline" className="w-full justify-start rounded-xl font-bold gap-2" asChild>
                  <Link href="/yonetici/aramalar">
                    <PhoneCall className="h-4 w-4" /> Aramalar & CRM
                  </Link>
               </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-white border-b pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Globe2 className="h-5 w-5 text-primary" /> Ülke Dağılımı (Veliler)
              </CardTitle>
              <CardDescription>Telefon alan kodlarına göre analiz.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-y-auto">
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
        </div>

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
                                {sortLogDetails(Object.entries(log.details || {})).map(([k, v]: any) => (
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
