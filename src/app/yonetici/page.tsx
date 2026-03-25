
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
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

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

    const sessions: { [key: string]: any[] } = {};
    slots.forEach(slot => {
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
    
    const trialUserIds = new Set(groupedLessons.filter(l => l.packageCode === 'FREE_TRIAL').map(l => l.bookedBy));
    const paidUserIds = new Set(groupedLessons.filter(l => l.packageCode !== 'FREE_TRIAL').map(l => l.bookedBy));
    const convertedUsers = Array.from(trialUserIds).filter(id => paidUserIds.has(id)).length;
    const conversionRate = trialUserIds.size > 0 ? ((convertedUsers / trialUserIds.size) * 100).toFixed(1) : 0;

    const countries: any = {};
    parents.forEach(p => {
        const phone = (p.phoneNumber || "").replace(/\s/g, "");
        let country = "Diğer";
        if (phone.startsWith("+90")) country = "Türkiye";
        else if (phone.startsWith("+49")) country = "Almanya";
        else if (phone.startsWith("+44")) country = "İngiltere";
        else if (phone.startsWith("+41")) country = "İsviçre";
        else if (phone.startsWith("+33")) country = "Fransa";
        else if (phone.startsWith("+31")) country = "Hollanda";
        else if (phone.startsWith("+32")) country = "Belçika";
        else if (phone.startsWith("+43")) country = "Avusturya";
        else if (phone.startsWith("+1")) country = "ABD/Kanada";
        else if (phone.startsWith("+353")) country = "İrlanda";
        else if (phone.startsWith("+46")) country = "İsveç";
        else if (phone.startsWith("+45")) country = "Danimarka";
        else if (phone.startsWith("+47")) country = "Norveç";
        else if (phone.startsWith("+61")) country = "Avustralya";
        else if (phone.startsWith("+994")) country = "Azerbaycan";
        else if (phone.startsWith("+971")) country = "B.A.E";
        else if (phone.startsWith("+966")) country = "Suudi Arabistan";
        else if (phone.startsWith("+39")) country = "İtalya";
        countries[country] = (countries[country] || 0) + 1;
    });

    return { activeStudents: children.length, totalPaidLessons, totalFreeTrials, conversionRate, countries };
  }, [parents, slots, children]);

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
        <Badge variant="outline" className="bg-white px-4 py-1 border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
            {new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GrowthCard title="Kayıtlı Öğrenci" value={metrics?.activeStudents || 0} subValue="+2" icon={Baby} color="bg-indigo-500" />
        <GrowthCard title="Toplam Satış" value={metrics?.totalPaidLessons || 0} subValue="Ders" icon={DollarSign} color="bg-emerald-500" />
        <GrowthCard title="Dönüşüm Oranı" value={`%${metrics?.conversionRate || 0}`} subValue="Trial → Paket" icon={TrendingUp} color="bg-amber-500" />
        <GrowthCard title="Deneme Dersi" value={metrics?.totalFreeTrials || 0} subValue="Randevu" icon={CalendarCheck} color="bg-blue-500" />
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

        <Card className="lg:col-span-2 border-none shadow-md overflow-hidden">
           <CardHeader className="flex flex-row items-center justify-between bg-white border-b pb-4">
            <div>
              <CardTitle className="text-lg font-bold">🔔 Operasyonel Akış</CardTitle>
              <CardDescription>Gerçek zamanlı sistem olayları — ders, iptal, kayıt, satış.</CardDescription>
            </div>
            <Activity className="h-5 w-5 text-slate-300" />
          </CardHeader>
          <CardContent className="p-0">
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
