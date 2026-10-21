'use client';

import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { buildMonthlyDashboard } from '@/lib/monthly-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function MonthlyDashboardDetails({ slots, month }: { slots: any[]; month: Date }) {
  const db = useFirestore();
  const salesQuery = useMemoFirebase(() => db ? collection(db, 'transactions') : null, [db]);
  const teachersQuery = useMemoFirebase(() => db ? query(collection(db, 'users'), where('role', '==', 'teacher')) : null, [db]);
  const { data: sales, isLoading, error } = useCollection(salesQuery);
  const { data: teachers, isLoading: teachersLoading, error: teachersError } = useCollection(teachersQuery);
  const report = useMemo(() => buildMonthlyDashboard(slots, sales || [], month), [slots, sales, month]);
  const maxWeekly = Math.max(1, ...report.weeks.map(w => Math.max(w.paid, w.trial, w.sales)));
  const teacherName = (id: string) => {
    const teacher = teachers?.find(t => t.id === id);
    return teacher ? [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || 'İsimsiz öğretmen' : 'Öğretmen kaydı bulunamadı';
  };
  const salesUnavailable = isLoading || !!error;
  const saleValue = (value: number) => error ? 'Veri alınamadı' : isLoading ? 'Yükleniyor…' : value;
  return (
    <section className="space-y-5" aria-label="Seçili ayın ayrıntıları">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['İlk paket satışı', saleValue(report.first), 'Velinin kayıtlı ilk satın alma işlemi'],
          ['Tekrar paket satışı', saleValue(report.repeat), 'Daha önce satın alan velilerin işlemleri'],
          ['Denemeden pakete', salesUnavailable ? saleValue(0) : `${report.converted} / ${report.trialParents}`, 'Bu ay deneme yapıp ardından aynı ay paket alan veli'],
        ].map(([title, value, description]) => <Card key={title}><CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader><CardContent><p className="text-2xl font-black text-slate-900">{value}</p><p className="mt-2 text-xs text-slate-500">{description}</p></CardContent></Card>)}
      </div>
      <p className="text-xs text-slate-500">Satışlar kayıtlı satın alma geçmişine göre, veli hesabı bazında ayrılır. Ücretsiz eklemeler ve havuzdan aktarımlar sayılmaz. Eski satın almalar eksikse ilk / tekrar ayrımı etkilenir.{report.unknown > 0 && ` Veli bilgisi eksik ${report.unknown} satış bu ayrıma dahil edilmedi.`}</p>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="min-w-0 space-y-5">
        <Card><CardHeader><CardTitle className="text-lg">Satılan paketler</CardTitle><CardDescription>Seçili ayın paket adetleri</CardDescription></CardHeader><CardContent className="space-y-3">
          {salesUnavailable ? <p className="text-sm text-slate-500">{saleValue(0)}</p> : Object.keys(report.packages).length ? Object.entries(report.packages).sort((a,b) => b[1]-a[1]).map(([name,count]) => <div key={name} className="flex justify-between gap-4 border-b pb-2 text-sm"><span>{name}</span><strong>{count}</strong></div>) : <p className="text-sm text-slate-500">Bu ay paket satışı bulunmuyor.</p>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">Ders hareketleri</CardTitle><CardDescription>Beş dakikalık parçalar tek ders olarak birleştirilir.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Tamamlanan ücretli ders</span><strong>{report.completed.filter(l => l.packageCode !== 'FREE_TRIAL').length}</strong></div>
          <div className="flex justify-between"><span>Tamamlanan deneme</span><strong>{report.completed.filter(l => l.packageCode === 'FREE_TRIAL').length}</strong></div>
          <p className="border-t pt-3 text-xs text-slate-500">Tamamlanma, dersin bitiş saati veya tamamlandı durumuna göre hesaplanır; katılımı doğrulamaz. İptal geçmişi ve katılmama bilgisi düzenli tutulmadığı için bu sayılar gösterilemiyor.</p>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">Öğretmen bazında dersler</CardTitle><CardDescription>Seçili ayda tamamlanan dersler</CardDescription></CardHeader><CardContent>
          {teachersLoading || teachersError ? <p className="text-sm text-slate-500">{teachersError ? 'Öğretmen bilgileri alınamadı.' : 'Yükleniyor…'}</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="pb-3">Öğretmen</th><th>Ücretli</th><th>Deneme</th><th>Toplam</th></tr></thead><tbody>{Object.entries(report.teachers).sort((a,b) => b[1].paid+b[1].trial-a[1].paid-a[1].trial).map(([id,counts]) => <tr key={id} className="border-b"><td className="py-3 pr-3">{teacherName(id)}</td><td>{counts.paid}</td><td>{counts.trial}</td><td className="font-bold">{counts.paid+counts.trial}</td></tr>)}</tbody></table>{!report.completed.length && <p className="py-4 text-sm text-slate-500">Bu ay tamamlanan ders bulunmuyor.</p>}</div>}
        </CardContent></Card>
        </div>
        <Card className="min-w-0"><CardHeader><CardTitle className="text-lg">Haftalık hareket</CardTitle><CardDescription>Ayın 1–7, 8–14, 15–21, 22–28 ve kalan günleri</CardDescription></CardHeader><CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 text-xs text-slate-600"><span>🟦 Ücretli ders</span><span>🟩 Deneme</span><span>🟪 Satış işlemi</span></div>
          {report.weeks.map(week => <div key={week.label} className="space-y-1"><p className="text-xs font-semibold text-slate-600">{week.label}. günler</p>{([['Ücretli ders',week.paid,'bg-sky-500'],['Deneme',week.trial,'bg-emerald-500'],['Satış',week.sales,'bg-violet-500']] as const).map(([label,value,color]) => <div key={label} className="flex items-center gap-2" aria-label={`${week.label}: ${label} ${value}`}><span className="w-20 text-xs text-slate-500">{label}</span><div className="h-2 flex-1 rounded bg-slate-100"><div className={`h-2 rounded ${color}`} style={{width:`${value/maxWeekly*100}%`}} /></div><span className="w-7 text-right text-xs font-bold">{label === 'Satış' && salesUnavailable ? '—' : value}</span></div>)}</div>)}
          {salesUnavailable && <p className="text-xs text-slate-500">Satış verileri {error ? 'alınamadı' : 'yükleniyor'}.</p>}
        </CardContent></Card>
      </div>
    </section>
  );
}
