'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, collectionGroup } from 'firebase/firestore';
import { 
  Users, 
  GraduationCap, 
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

  // Veri Sorguları
  const parentsQuery = useMemoFirebase(() => db ? query(collection(db, 'users'), where('role', '==', 'parent')) : null, [db]);
  const lessonsQuery = useMemoFirebase(() => db ? query(collection(db, 'lesson-slots'), where('status', '==', 'booked')) : null, [db]);
  const childrenQuery = useMemoFirebase(() => db ? query(collectionGroup(db, 'children')) : null, [db]);

  const { data: parents, isLoading: parentsLoading } = useCollection(parentsQuery);
  const { data: lessons, isLoading: lessonsLoading } = useCollection(lessonsQuery);
  const { data: children, isLoading: childrenLoading } = useCollection(childrenQuery);

  // Growth Metrikleri Hesaplama
  const metrics = useMemo(() => {
    if (!parents || !lessons || !children) return null;

    const totalPaidLessons = lessons.filter(l => l.packageCode !== 'FREE_TRIAL').length;
    const totalFreeTrials = lessons.filter(l => l.packageCode === 'FREE_TRIAL').length;
    
    // Dönüşüm Oranı Hesaplama (Trial yapan velilerin kactanesi paid paket almış?)
    const trialUserIds = new Set(lessons.filter(l => l.packageCode === 'FREE_TRIAL').map(l => l.bookedBy));
    const paidUserIds = new Set(lessons.filter(l => l.packageCode !== 'FREE_TRIAL').map(l => l.bookedBy));
    const convertedUsers = Array.from(trialUserIds).filter(id => paidUserIds.has(id)).length;
    const conversionRate = trialUserIds.size > 0 ? ((convertedUsers / trialUserIds.size) * 100).toFixed(1) : 0;

    // Ülke Dağılımı (Telefon koduna göre)
    const countries: any = {};
    parents.forEach(p => {
        const phone = p.phoneNumber || "";
        let country = "Diğer";
        if (phone.startsWith("+90")) country = "Türkiye";
        else if (phone.startsWith("+44")) country = "İngiltere";
        else if (phone.startsWith("+41")) country = "İsviçre";
        else if (phone.startsWith("+49")) country = "Almanya";
        else if (phone.startsWith("+353")) country = "İrlanda";
        else if (phone.startsWith("+31")) country = "Hollanda";
        else if (phone.startsWith("+1")) country = "ABD/Kanada";
        
        countries[country] = (countries[country] || 0) + 1;
    });

    // Operasyonel Akış (Son Aktiviteler)
    const recentActivities = [...lessons]
        .sort((a, b) => (b.startTime?.seconds || 0) - (a.startTime?.seconds || 0))
        .slice(0, 5);

    return { 
        activeStudents: children.length, 
        totalPaidLessons, 
        totalFreeTrials, 
        conversionRate, 
        countries,
        recentActivities 
    };
  }, [parents, lessons, children]);

  if (parentsLoading || lessonsLoading || childrenLoading) {
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
        <GrowthCard 
            title="Kayıtlı Öğrenci" 
            value={metrics?.activeStudents || 0} 
            subValue="+2" 
            icon={Baby} 
            color="bg-indigo-500" 
        />
        <GrowthCard 
            title="Toplam Satış" 
            value={metrics?.totalPaidLessons || 0} 
            subValue="Ders" 
            icon={DollarSign} 
            color="bg-emerald-500" 
        />
        <GrowthCard 
            title="Dönüşüm Oranı" 
            value={`%${metrics?.conversionRate || 0}`} 
            subValue="Trial → Paket" 
            icon={TrendingUp} 
            color="bg-amber-500" 
        />
        <GrowthCard 
            title="Deneme Dersi" 
            value={metrics?.totalFreeTrials || 0} 
            subValue="Randevu" 
            icon={CalendarCheck} 
            color="bg-blue-500" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-primary" /> Ülke Dağılımı (Veliler)
            </CardTitle>
            <CardDescription>Telefon koduna göre analiz.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics?.countries || {}).sort((a: any, b: any) => b[1] - a[1]).map(([name, count]: any) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                    <span className="text-sm font-semibold text-slate-700">{name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-md">
           <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Operasyonel Akış</CardTitle>
              <CardDescription>Son planlanan dersler ve aktiviteler.</CardDescription>
            </div>
            <Activity className="h-5 w-5 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {metrics?.recentActivities.map((lesson: any) => (
                    <div key={lesson.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors">
                        <div className={cn(
                            "p-2 rounded-full",
                            lesson.packageCode === 'FREE_TRIAL' ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                        )}>
                            {lesson.packageCode === 'FREE_TRIAL' ? <CalendarCheck className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900">
                                {lesson.packageCode === 'FREE_TRIAL' ? "Yeni Deneme Dersi" : "Paket Dersi Planlandı"}
                            </p>
                            <p className="text-[11px] text-slate-500">
                                ID: {lesson.id.substring(0,8)} • Paket: {lesson.packageCode}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 justify-end uppercase">
                                <Clock className="w-3 h-3" /> 
                                {lesson.startTime?.toDate().toLocaleDateString('tr-TR')}
                            </p>
                        </div>
                    </div>
                ))}
                {metrics?.recentActivities.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-10">Henüz aktivite bulunmuyor.</p>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}