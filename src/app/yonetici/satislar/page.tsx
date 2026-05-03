
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
    Calendar as CalendarIcon, 
    ArrowUpRight, 
    User, 
    Package, 
    TrendingUp,
    Euro,
    ChevronDown,
    Filter,
    CalendarDays
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfMonth, startOfQuarter, startOfYear, isAfter, isBefore, endOfDay, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export default function SalesPage() {
  const db = useFirestore();
  const [filter, setFilter] = useState<'monthly' | 'quarterly' | 'yearly' | 'custom'>('monthly');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const transactionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(1000));
  }, [db]);

  const { data: transactions, isLoading } = useCollection(transactionsQuery);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    // Sadece tamamlanmış (veya legacy, status alanı olmayan eski kayıtlar) olanları tutun, bekleyenleri filtreleyin.
    // KRİTİK: Tuba Hanım'ın özel satışlarını GENEL listeden gizliyoruz.
    const completedTransactions = transactions.filter((t: any) => 
        t.status !== 'pending' && 
        t.isSpecial !== 'tuba' && 
        t.metadata?.isSpecial !== 'tuba'
    );
    
    const now = new Date();
    
    if (filter === 'custom') {
        if (!dateRange?.from) return completedTransactions;
        const fromDate = startOfDay(dateRange.from);
        const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        
        return completedTransactions.filter((t: any) => {
            const date = t.createdAt.toDate();
            return isAfter(date, fromDate) && isBefore(date, toDate);
        });
    }

    let startDate: Date;
    if (filter === 'monthly') startDate = startOfMonth(now);
    else if (filter === 'quarterly') startDate = startOfQuarter(now);
    else startDate = startOfYear(now);

    return completedTransactions.filter((t: any) => isAfter(t.createdAt.toDate(), startDate));
  }, [transactions, filter, dateRange]);

  const { realSales, adminAssignments } = useMemo(() => {
    const real = filteredTransactions.filter((t: any) => (t.amountGbp || 0) > 0);
    const admin = filteredTransactions.filter((t: any) => (t.amountGbp || 0) === 0);
    return { realSales: real, adminAssignments: admin };
  }, [filteredTransactions]);

  const stats = useMemo(() => {
    const total = realSales.reduce((acc, curr) => acc + (curr.amountGbp || 0), 0);
    const count = realSales.length;
    const avg = count > 0 ? total / count : 0;

    return { total, count, avg };
  }, [realSales]);

  const renderTransactionList = (data: any[]) => (
    <>
      <div className="md:hidden divide-y">
        {data.length > 0 ? (
          data.map((t) => (
            <div key={t.id} className="p-4 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm leading-tight">{t.userName || 'Bilinmeyen Veli'}</span>
                    <span className="text-[9px] text-slate-400 leading-none mt-0.5">{t.userEmail || 'E-posta yok'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">£{(t.amountGbp || 0).toFixed(2)}</div>
                  <Badge className={cn(
                    "text-[8px] px-1.5 py-0 border-none font-black uppercase tracking-tighter",
                    t.type === 'premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  )}>
                    {t.type === 'premium' ? 'PREMIUM' : 'DERS PAKETİ'}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    {t.items?.map((item: any, idx: number) => (
                      <span key={idx} className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                        <Package className="w-3 h-3 text-slate-300" />
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                    {t.assignedLessons && (
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1.5">
                            <ArrowUpRight className="w-3 h-3" />
                            {t.assignedLessons} Derslik Paket
                        </span>
                    )}
                    {t.totalLessonsToAdd && !t.assignedLessons && (
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1.5">
                            <ArrowUpRight className="w-3 h-3" />
                            {t.totalLessonsToAdd} Ders
                        </span>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                    <CalendarIcon className="w-2.5 h-2.5" />
                    {format(t.createdAt.toDate(), 'dd MMM, HH:mm', { locale: tr })}
                  </span>
                </div>
              </div>
              {t.description && (
                  <p className="mt-2 text-[9px] text-slate-400 italic font-medium leading-relaxed px-1 border-l-2 border-slate-200 pl-2">
                      {t.description}
                  </p>
              )}
            </div>
          ))
        ) : (
            <div className="p-10 text-center text-slate-400 italic text-sm">Gösterilecek kayıt bulunamadı.</div>
        )}
      </div>

      <div className="hidden md:block">
        <Table>
            <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold text-slate-500 py-5 pl-8">Veli / Müşteri</TableHead>
                <TableHead className="font-bold text-slate-500">İşlem Türü</TableHead>
                <TableHead className="font-bold text-slate-500">İçerik</TableHead>
                <TableHead className="font-bold text-slate-500">Tarih</TableHead>
                <TableHead className="font-bold text-slate-900 text-right pr-8">Tutar (GBP)</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {data.length > 0 ? (
                data.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50/30 transition-colors border-slate-100">
                    <TableCell className="py-5 pl-8">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                                <User className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700 text-sm leading-tight">{t.userName || 'Bilinmeyen Veli'}</span>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">{t.userEmail || 'E-posta yok'}</span>
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
                            {t.assignedLessons && (
                                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    {t.assignedLessons} Derslik Paket
                                </span>
                            )}
                            {t.totalLessonsToAdd && !t.assignedLessons && (
                                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    {t.totalLessonsToAdd} Ders
                                </span>
                            )}
                            {!t.items && !t.assignedLessons && !t.totalLessonsToAdd && t.type === 'premium' && (
                                <span className="text-xs font-semibold text-slate-600">1 Aylık Abonelik</span>
                            )}
                            {t.description && (
                                <span className="text-[10px] text-slate-400 italic max-w-[200px] truncate block" title={t.description}>
                                    {t.description}
                                </span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <CalendarIcon className="w-3.5 h-3.5 text-slate-300" />
                            {format(t.createdAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: tr })}
                        </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                        <div className="text-base font-black text-slate-900">
                            £{(t.amountGbp || 0).toFixed(2)}
                        </div>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic text-sm">
                    Bu bölümde henüz bir kayıt bulunmuyor.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
      </div>
    </>
  );

  if (isLoading) {
    return (
        <div className="flex flex-col justify-center items-center h-96 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tahsilatlar Yükleniyor...</p>
        </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8 p-2 sm:p-8 pt-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900">Satış Paneli</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Platformdaki tüm Sterlin bazlı tahsilatlar ve paket alımları.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
                        <SelectItem value="custom" className="text-xs font-bold py-2.5">Özel Aralık</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filter === 'custom' && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "h-12 justify-start text-left font-bold text-xs rounded-2xl border-none shadow-sm bg-white px-4",
                                !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "dd MMM", { locale: tr })} -{" "}
                                        {format(dateRange.to, "dd MMM yyyy", { locale: tr })}
                                    </>
                                ) : (
                                    format(dateRange.from, "dd MMM yyyy", { locale: tr })
                                )
                            ) : (
                                <span>Tarih Seçin</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="end">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            locale={tr}
                        />
                    </PopoverContent>
                </Popover>
            )}
        </div>
      </div>

      <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="border-none shadow-md bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-6">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toplam Tahsilat</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">£{stats.total.toFixed(2)}</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-emerald-500 mt-0.5 sm:mt-1 uppercase">Sterlin Bazında Net Ciro</div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-6">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">İşlem Sayısı</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.count}</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-indigo-500 mt-0.5 sm:mt-1 uppercase">Toplam Satış Adedi</div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-6">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ortalama İşlem</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">£{stats.avg.toFixed(2)}</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-amber-500 mt-0.5 sm:mt-1 uppercase">Sepet Ortalaması</div>
            </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[24px]">
        <Tabs defaultValue="sales" className="w-full">
            <CardHeader className="bg-white border-b pb-0 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-slate-800">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Tahsilat Detayları
                </CardTitle>
                <TabsList className="bg-slate-100 rounded-xl p-1 w-full sm:w-auto">
                    <TabsTrigger value="sales" className="rounded-lg text-[10px] sm:text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary">Gerçek Satışlar ({realSales.length})</TabsTrigger>
                    <TabsTrigger value="admin" className="rounded-lg text-[10px] sm:text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary">Admin Atamaları ({adminAssignments.length})</TabsTrigger>
                </TabsList>
            </div>
            </CardHeader>
            <CardContent className="p-0">
                <TabsContent value="sales" className="m-0">
                    {renderTransactionList(realSales)}
                </TabsContent>
                <TabsContent value="admin" className="m-0">
                    {renderTransactionList(adminAssignments)}
                </TabsContent>
            </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
