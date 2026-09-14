'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { Activity, BarChart3, Eye, Loader2, MousePointerClick, Search, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

function toDate(value: any): Date | null {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function formatDate(value: any) {
  const date = toDate(value);
  return date ? format(date, 'd MMM yyyy HH:mm', { locale: tr }) : '-';
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

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <Card className="border-none shadow-md bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <Icon className={cn('h-5 w-5', color)} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-slate-900">{value}</div>
      </CardContent>
    </Card>
  );
}

function RankingCard({ title, items, emptyText }: { title: string; items: { label: string; count: number }[]; emptyText: string }) {
  const max = items[0]?.count || 1;

  return (
    <Card className="border-none shadow-md bg-white overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="text-base font-black text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="p-6 text-sm font-medium text-slate-400">{emptyText}</div>
        ) : (
          <div className="divide-y">
            {items.slice(0, 8).map((item) => (
              <div key={item.label} className="p-4">
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="truncate font-bold text-slate-700" title={item.label}>{item.label}</span>
                  <Badge variant="outline" className="shrink-0 bg-slate-50 font-black">{item.count}</Badge>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalitikPage() {
  const db = useFirestore();
  const [eventFilter, setEventFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventLimit, setEventLimit] = useState(500);

  const analyticsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'analytics-events'), orderBy('createdAt', 'desc'), limit(eventLimit));
  }, [db, eventLimit]);

  const { data: events, isLoading } = useCollection(analyticsQuery);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const q = searchQuery.toLowerCase();

    return events.filter((event: any) => {
      const matchesEvent = eventFilter === 'all' || event.eventName === eventFilter;
      const text = `${event.eventName || ''} ${event.path || ''} ${event.customData?.label || ''} ${event.customData?.href || ''}`.toLowerCase();
      return matchesEvent && (!q || text.includes(q));
    });
  }, [events, eventFilter, searchQuery]);

  const eventTypes = useMemo(() => {
    if (!events) return [];
    return Array.from(new Set(events.map((event: any) => event.eventName).filter(Boolean))).sort();
  }, [events]);

  const pageViews = filteredEvents.filter((event: any) => event.eventName === 'PageView');
  const clicks = filteredEvents.filter((event: any) => event.eventName === 'Click');
  const uniquePaths = new Set(filteredEvents.map((event: any) => event.path).filter(Boolean)).size;
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
    <div className="space-y-8 font-sans pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black tracking-tight text-slate-900">
            <BarChart3 className="h-10 w-10 text-primary" /> Analitik
          </h1>
          <p className="mt-1 font-medium text-slate-500">Sayfa görüntüleme, tıklama ve dönüşüm event geçmişi.</p>
        </div>
        <Badge variant="outline" className="w-fit bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
          Son {eventLimit} kayıt
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 min-[1100px]:grid-cols-4">
        <StatCard title="Toplam Event" value={filteredEvents.length} icon={Activity} color="text-indigo-500" />
        <StatCard title="Sayfa Görüntüleme" value={pageViews.length} icon={Eye} color="text-blue-500" />
        <StatCard title="Tıklama" value={clicks.length} icon={MousePointerClick} color="text-emerald-500" />
        <StatCard title="Farklı Sayfa" value={uniquePaths} icon={TrendingUp} color="text-amber-500" />
      </div>

      <Card className="border-none bg-white shadow-md">
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Sayfa, event veya tıklama metni ara..."
              className="pl-10"
            />
          </div>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Event tipi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Eventler</SelectItem>
              {eventTypes.map((type: string) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(eventLimit)} onValueChange={(value) => setEventLimit(Number(value))}>
            <SelectTrigger className="w-full md:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="1000">1000</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-6 min-[1100px]:grid-cols-2">
        <RankingCard title="En Çok Görüntülenen Sayfalar" items={topPages} emptyText="Henüz sayfa görüntüleme kaydı yok." />
        <RankingCard title="En Çok Tıklanan Alanlar" items={topClicks} emptyText="Henüz tıklama kaydı yok." />
      </div>

      <Card className="border-none bg-white shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-base font-black text-slate-800">Son Hareketler</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zaman</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Sayfa</TableHead>
                <TableHead>Tıklama</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.slice(0, 80).map((event: any) => (
                <TableRow key={event.id}>
                  <TableCell className="whitespace-nowrap text-xs font-bold text-slate-500">{formatDate(event.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold">{event.eventName || '-'}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[320px] truncate font-medium text-slate-700" title={event.path}>{event.path || '-'}</TableCell>
                  <TableCell className="max-w-[320px] truncate text-slate-500" title={event.customData?.label || event.customData?.href}>
                    {event.customData?.label || event.customData?.href || '-'}
                  </TableCell>
                </TableRow>
              ))}
              {filteredEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center font-medium text-slate-400">
                    Bu filtrelerle eşleşen analitik kaydı yok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
