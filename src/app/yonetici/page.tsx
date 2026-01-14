
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Globe2, 
  PieChart, 
  CalendarCheck, 
  Activity,
  DollarSign,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

// Growth Stat Card Component
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

  // Queries
  const parentsQuery = useMemoFirebase(() => db ? query(collection(db, 'users'), where('role', '==', 'parent')) : null, [db]);
  const salesQuery = useMemoFirebase(() => db ? query(collection(db, 'sales')) : null, [db]);
  const trialsQuery = useMemoFirebase(() => db ? query(collection(db, 'trials')) : null, [db]);
  const studentsQuery = useMemoFirebase(() => db ? query(collection(db, 'lesson-slots'), where('status', '==', 'booked')) : null, [db]);

  const { data: parents, isLoading: parentsLoading } = useCollection(parentsQuery);
  const { data: sales, isLoading: salesLoading } = useCollection(salesQuery);
  const { data: trials, isLoading: trialsLoading } = useCollection(trialsQuery);
  const { data: lessons, isLoading: lessonsLoading } = useCollection(studentsQuery);

  // Growth Metrics Calculation
  const metrics = useMemo(() => {
    if (!parents || !sales || !trials) return null;

    const activeStudents = lessons?.length || 0;
    const activeParents = parents.filter(p => p.status === 'active').length;
    const monthlyTrials = trials.filter(t => {
        const d = t.trial_date?.toDate();
        return d && d.getMonth() === new Date().getMonth();
    }).length;

    const totalRevenue = sales.reduce((acc, s) => acc + (s.price || 0), 0);
    const conversionRate = trials.length > 0 ? ((sales.filter(s => s.sale_type === 'first_sale').length / trials.length) * 100).toFixed(1) : 0;

    // Country Distribution
    const countries: any = {};
    parents.forEach(p => {
        if (p.country) countries[p.country] = (countries[p.country] || 0) + 1;
    });

    return { activeStudents, activeParents, monthlyTrials, totalRevenue, conversionRate, countries };
  }, [parents, sales, trials, lessons]);

  if (parentsLoading || salesLoading || trialsLoading) {
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
        <Badge variant="outline" className="bg-white px-4 py-1 border-slate-200 text-slate-600 font-bold">
            {new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </Badge>
      </div>

      {/* Ana Metrikler */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GrowthCard 
            title="Aktif Öğrenci" 
            value={metrics?.activeStudents || 0} 
            subValue="+4" 
            icon={GraduationCap} 
            color="bg-indigo-500" 
        />
        <GrowthCard 
            title="Toplam Ciro" 
            value={`${metrics?.totalRevenue.toLocaleString()} ₺`} 
            subValue="%12 Artış" 
            icon={DollarSign} 
            color="bg-emerald-500" 
        />
        <GrowthCard 
            title="Dönüşüm Oranı" 
            value={`%${metrics?.conversionRate || 0}`} 
            subValue="Trial → Sale" 
            icon={Activity} 
            color="bg-amber-500" 
        />
        <GrowthCard 
            title="Bu Ayki Trial" 
            value={metrics?.monthlyTrials || 0} 
            subValue="Planlanan" 
            icon={CalendarCheck} 
            color="bg-blue-500" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ülke Dağılımı */}
        <Card className="lg:col-span-1 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-primary" /> Ülke Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics?.countries || {}).map(([code, count]: any) => (
                <div key={code} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px] font-bold uppercase">{code}</div>
                    <span className="text-sm font-semibold text-slate-700">{code === 'UK' ? 'Birleşik Krallık' : code === 'IE' ? 'İrlanda' : code}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{count}</span>
                </div>
              ))}
              {Object.keys(metrics?.countries || {}).length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-10">Henüz ülke verisi yok.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Son Aktiviteler */}
        <Card className="lg:col-span-2 border-none shadow-md">
           <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Operasyonel Akış</CardTitle>
              <CardDescription>Son satışlar ve planlanan trial'lar.</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                {/* Placeholder for real activity feed */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-2 bg-emerald-100 rounded-full"><TrendingUp className="h-4 w-4 text-emerald-600" /></div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Yeni Satış: 12 Derslik Paket</p>
                        <p className="text-xs text-slate-500">Veli: İbrahim Onder • Öğrenci: Ali</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-slate-400">Şimdi</span>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-2 bg-blue-100 rounded-full"><CalendarCheck className="h-4 w-4 text-blue-600" /></div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Trial Planlandı: Başlangıç Kursu</p>
                        <p className="text-xs text-slate-500">Veli: Ayşe Yılmaz • Tarih: 30 Aralık 2025</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-slate-400">2 dk önce</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
