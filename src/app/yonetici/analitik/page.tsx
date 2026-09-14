'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { BarChart3, Eye, Loader2, MousePointerClick, Search } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function toDate(value: any): Date | null {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function formatDate(value: any) {
  const date = toDate(value);
  return date ? format(date, 'd MMM HH:mm', { locale: tr }) : '-';
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const key = getKey(item);
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
      </div>
      <Icon className="h-5 w-5 text-slate-400" />
    </div>
  );
}

function SimpleList({ title, items, emptyText }: { title: string; items: { label: string; count: number }[]; emptyText: string }) {
  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-black text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <p className="py-6 text-sm font-medium text-slate-400">{emptyText}</p>
        ) : (
          items.slice(0, 6).map((item, index) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg border bg-slate-50/60 px-3 py-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-xs font-black text-slate-400">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700" title={item.label}>{item.label}</span>
              <Badge variant="outline" className="bg-white font-black">{item.count}</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalitikPage() {
  const db = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');
  const [eventLimit, setEventLimit] = useState(250);
  const [showDetails, setShowDetails] = useState(false);

  const analyticsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'analytics-events'), orderBy('createdAt', 'desc'), limit(eventLimit));
  }, [db, eventLimit]);

  const { data: events, isLoading } = useCollection(analyticsQuery);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const q = searchQuery.toLowerCase();
    const publicEvents = events.filter((event: any) => !String(event.path || '').startsWith('/yonetici'));
    if (!q) return publicEvents;

    return publicEvents.filter((event: any) => {
      const text = `${event.eventName || ''} ${event.path || ''} ${event.customData?.label || ''}`.toLowerCase();
      return text.includes(q);
    });
  }, [events, searchQuery]);

  const pageViews = filteredEvents.filter((event: any) => event.eventName === 'PageView');
  const clicks = filteredEvents.filter((event: any) => event.eventName === 'Click');
  const topPages = countBy(pageViews, (event: any) => event.path || '/');
  const topClicks = countBy(clicks, (event: any) => event.customData?.label || event.customData?.href || 'Tıklama');

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans pb-20">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-slate-900">
            <BarChart3 className="h-8 w-8 text-primary" /> Analitik
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Sitede en çok nereler geziliyor ve hangi alanlara tıklanıyor?</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
            Son {eventLimit} kayıt
          </Badge>
          <Select value={String(eventLimit)} onValueChange={(value) => setEventLimit(Number(value))}>
            <SelectTrigger className="h-9 w-28 bg-white">
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

      <div className="grid gap-3 md:grid-cols-3">
        <MiniStat label="Toplam" value={filteredEvents.length} icon={BarChart3} />
        <MiniStat label="Sayfa Görüntüleme" value={pageViews.length} icon={Eye} />
        <MiniStat label="Tıklama" value={clicks.length} icon={MousePointerClick} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Sayfa veya tıklama ara..."
          className="h-11 bg-white pl-10"
        />
      </div>

      <div className="grid gap-4 min-[1100px]:grid-cols-2">
        <SimpleList title="En Çok Gezilen Sayfalar" items={topPages} emptyText="Henüz sayfa görüntüleme kaydı yok." />
        <SimpleList title="En Çok Tıklanan Alanlar" items={topClicks} emptyText="Henüz tıklama kaydı yok." />
      </div>

      <Card className="border-none bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-black text-slate-800">Son Hareketler</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowDetails((value) => !value)} className="h-8 text-xs font-bold">
            {showDetails ? 'Gizle' : 'Göster'}
          </Button>
        </CardHeader>
        {showDetails && (
          <CardContent className="space-y-2">
            {filteredEvents.slice(0, 30).map((event: any) => (
              <div key={event.id} className="grid gap-2 rounded-lg border px-3 py-2 text-sm md:grid-cols-[120px_110px_1fr_1fr]">
                <span className="font-bold text-slate-500">{formatDate(event.createdAt)}</span>
                <span className="font-black text-slate-700">{event.eventName || '-'}</span>
                <span className="truncate text-slate-600" title={event.path}>{event.path || '-'}</span>
                <span className="truncate text-slate-400" title={event.customData?.label || event.customData?.href}>
                  {event.customData?.label || event.customData?.href || '-'}
                </span>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <p className="py-8 text-center text-sm font-medium text-slate-400">Bu aramayla eşleşen kayıt yok.</p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
