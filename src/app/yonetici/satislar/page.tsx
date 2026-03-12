
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { useState, useMemo } from 'react';
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
    CreditCard, 
    Calendar, 
    ArrowUpRight, 
    User, 
    Package, 
    TrendingUp,
    Euro,
    ChevronDown,
    Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { format, startOfMonth, startOfQuarter, startOfYear, isAfter } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function SalesPage() {
  const db = useFirestore();
  const [filter, setFilter] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const transactionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(500));
  }, [db]);

  const { data: transactions, isLoading } = useCollection(transactionsQuery);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    const now = new Date();
    let startDate: Date;

    if (filter === 'monthly') startDate = startOfMonth(now);
    else if (filter === 'quarterly') startDate = startOfQuarter(now);
    else startDate = startOfYear(now);

    return transactions.filter(t => isAfter(t.createdAt.toDate(), startDate));
  }, [transactions, filter]);

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((acc, curr) => acc + (curr.amountEur || 0), 0);
    const count = filteredTransactions.length;
    const avg = count > 0 ? total / count : 0;

    return { total, count, avg };
  }, [filteredTransactions]);

  if (isLoading) {
    return (
        <div className="flex flex-col justify-center items-center h-96 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tahsilatlar Yükleniyor...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Satış Paneli</h1>
            <p className="text-muted-foreground mt-1">Platformdaki tüm Euro bazlı tahsilatlar ve paket alımları.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border">
            <div className="flex items-center gap-2 px-3 border-r pr-4 mr-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zaman Aralığı</span>
            </div>
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                <SelectTrigger className="w-[140px] h-9 rounded-xl border-none font-bold text-xs focus:ring-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="monthly" className="text-xs font-bold py-2.5">Bu Ay</SelectItem>
                    <SelectItem value="quarterly" className="text-xs font-bold py-2.5">Bu Çeyrek</SelectItem>
                    <SelectItem value="yearly" className="text-xs font-bold py-2.5">Bu Yıl</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-md bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toplam Tahsilat</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">€{stats.total.toFixed(2)}</div>
                <div className="text-[10px] font-bold text-emerald-500 mt-1 uppercase">Euro Bazında Net Ciro</div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">İşlem Sayısı</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">{stats.count}</div>
                <div className="text-[10px] font-bold text-indigo-500 mt-1 uppercase">Toplam Satış Adedi</div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ortalama İşlem</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">€{stats.avg.toFixed(2)}</div>
                <div className="text-[10px] font-bold text-amber-500 mt-1 uppercase">Sepet Ortalaması</div>
            </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[24px]">
        <CardHeader className="bg-white border-b pb-6">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <ArrowUpRight className="w-5 h-5 text-primary" /> Son Tahsilatlar ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold text-slate-500 py-5 pl-8">Veli / Müşteri</TableHead>
                <TableHead className="font-bold text-slate-500">İşlem Türü</TableHead>
                <TableHead className="font-bold text-slate-500">İçerik</TableHead>
                <TableHead className="font-bold text-slate-500">Tarih</TableHead>
                <TableHead className="font-bold text-slate-900 text-right pr-8">Tutar (EUR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-slate-50/30 transition-colors border-slate-100">
                    <TableCell className="py-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                            <User className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-sm">{t.userName || 'Bilinmeyen Veli'}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{t.userEmail}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <Badge className={cn(
                            "text-[9px] px-2 py-0.5 border-none font-black uppercase tracking-tighter",
                            t.type === 'premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        )}>
                            {t.type === 'premium' ? 'PREMIUM ÜYELİK' : 'DERS PAKETİ'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-0.5">
                            {t.items?.map((item: any, idx: number) => (
                                <span key={idx} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                    <Package className="w-3 h-3 text-slate-300" />
                                    {item.quantity}x {item.name}
                                </span>
                            ))}
                            {t.type === 'premium' && <span className="text-xs font-semibold text-slate-600">1 Aylık Abonelik</span>}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                            {format(t.createdAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: tr })}
                        </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                        <div className="text-base font-black text-slate-900">
                            €{t.amountEur?.toFixed(2)}
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic text-sm">
                    Bu zaman aralığında henüz bir tahsilat kaydı bulunmuyor.
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
