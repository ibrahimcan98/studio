'use client';

import React, { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  where, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Receipt, 
  Users, 
  CreditCard, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear, 
  addMonths, 
  subMonths, 
  parseISO,
  isWithinInterval,
  addMinutes
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Expense categories
export const EXPENSE_CATEGORIES: { [key: string]: { label: string; color: string } } = {
  reklam: { label: 'Reklam & Pazarlama', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  ogretmen: { label: 'Öğretmen Maaşı / Ödemesi', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  yazilim: { label: 'Yazılım & Barındırma', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  operasyon: { label: 'Ofis & Operasyon', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  vergi: { label: 'Vergi & Yasal', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  diger: { label: 'Diğer Giderler', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

// Course Code Mapper for Teacher Lesson Rates
const getCourseKey = (code?: string): string => {
  if (!code) return 'OTHER';
  if (code === 'FREE_TRIAL') return 'FREE_TRIAL';
  const prefix = code.replace(/[0-9]/g, '');
  const map: { [key: string]: string } = { 
    'B': 'baslangic', 
    'K': 'konusma', 
    'G': 'gelisim', 
    'A': 'akademik', 
    'GCSE': 'gcse' 
  };
  return map[prefix] || 'OTHER';
};

export default function AdminFinansPage() {
  const db = useFirestore();
  const { toast } = useToast();

  // Period State: 'monthly' | 'quarterly' | 'yearly' | 'since_april'
  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly' | 'yearly' | 'since_april'>('monthly');
  
  // Selected Month (defaults to current date, minimum April 2026)
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => {
    const now = new Date();
    const april2026 = new Date(2026, 3, 1); // April 2026
    return now < april2026 ? april2026 : startOfMonth(now);
  });

  // Selected Quarter for quarterly view
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q3-2026');

  // Expense modal state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    currency: 'EUR',
    category: 'ogretmen',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  // 1. Fetch Transactions (Gelir)
  const transactionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
  }, [db]);
  const { data: rawTransactions, isLoading: transactionsLoading } = useCollection(transactionsQuery);

  // 2. Fetch Teachers (Öğretmenler)
  const teachersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'teacher'));
  }, [db]);
  const { data: rawTeachers, isLoading: teachersLoading } = useCollection(teachersQuery);

  // 3. Fetch Lesson Slots (Öğretmen Dersleri)
  const slotsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'lesson-slots'),
      where('status', 'in', ['booked', 'completed'])
    );
  }, [db]);
  const { data: rawSlots, isLoading: slotsLoading } = useCollection(slotsQuery);

  // 4. Fetch Expenses (Giderler)
  const expensesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'expenses'), orderBy('date', 'desc'));
  }, [db]);
  const { data: rawExpenses, isLoading: expensesLoading } = useCollection(expensesQuery);

  // Teachers Map by ID for quick rate lookup
  const teachersMap = useMemo(() => {
    const map = new Map<string, any>();
    if (rawTeachers) {
      rawTeachers.forEach((t: any) => map.set(t.id, t));
    }
    return map;
  }, [rawTeachers]);

  // Group Contiguous 5-min Slots into Completed Lessons/Sessions
  const completedSessions = useMemo(() => {
    if (!rawSlots) return [];
    const now = new Date();

    const sortedSlots = [...rawSlots].sort((a, b) => a.startTime?.seconds - b.startTime?.seconds);
    const sessions: any[] = [];
    let currentSession: any = null;

    sortedSlots.forEach((slot: any) => {
      const startTime = slot.startTime?.toDate();
      if (!startTime) return;
      const endTime = slot.endTime?.toDate?.() || addMinutes(startTime, 5);

      const isConsecutive = currentSession &&
        currentSession.teacherId === slot.teacherId &&
        currentSession.childId === slot.childId &&
        currentSession.packageCode === slot.packageCode &&
        currentSession.status === slot.status &&
        (currentSession.bookedAt?.seconds === slot.bookedAt?.seconds) &&
        Math.abs(startTime.getTime() - currentSession.lastEndTime.getTime()) < 2000;

      if (isConsecutive) {
        currentSession.lastEndTime = endTime;
        currentSession.slotIds.push(slot.id);
      } else {
        currentSession = {
          ...slot,
          firstStartTime: startTime,
          lastEndTime: endTime,
          slotIds: [slot.id]
        };
        sessions.push(currentSession);
      }
    });

    // Keep completed sessions (either marked 'completed' or past booked session)
    return sessions.filter((s: any) => {
      const isPast = s.lastEndTime < now;
      return s.status === 'completed' || (s.status === 'booked' && isPast);
    });
  }, [rawSlots]);

  // Determine Active Date Interval based on Filter
  const activeInterval = useMemo(() => {
    const april1_2026 = new Date(2026, 3, 1, 0, 0, 0); // 1 Nisan 2026

    if (periodType === 'monthly') {
      return {
        start: startOfMonth(selectedMonth),
        end: endOfMonth(selectedMonth),
        label: format(selectedMonth, 'MMMM yyyy', { locale: tr })
      };
    }

    if (periodType === 'quarterly') {
      const [q, yearStr] = selectedQuarter.split('-');
      const year = parseInt(yearStr, 10) || 2026;
      let startMonth = 0;
      if (q === 'Q1') startMonth = 0;
      else if (q === 'Q2') startMonth = 3;
      else if (q === 'Q3') startMonth = 6;
      else if (q === 'Q4') startMonth = 9;

      const qStart = new Date(year, startMonth, 1, 0, 0, 0);
      return {
        start: qStart,
        end: endOfQuarter(qStart),
        label: `${q} ${year} (${format(qStart, 'MMMM', { locale: tr })} - ${format(endOfQuarter(qStart), 'MMMM', { locale: tr })})`
      };
    }

    if (periodType === 'yearly') {
      const yDate = new Date(2026, 0, 1);
      return {
        start: startOfYear(yDate),
        end: endOfYear(yDate),
        label: '2026 Yılı Toplamı'
      };
    }

    // since_april (1 Nisan 2026'dan bugüne)
    return {
      start: april1_2026,
      end: new Date(2026, 11, 31, 23, 59, 59),
      label: "Nisan 2026'dan İtibaren (Kümülatif)"
    };
  }, [periodType, selectedMonth, selectedQuarter]);

  // Filtered Transactions in Active Interval (Gelir)
  const currentRevenueList = useMemo(() => {
    if (!rawTransactions) return [];
    return rawTransactions.filter((t: any) => {
      if (t.status === 'pending') return false;
      const date = t.createdAt?.toDate?.();
      if (!date) return false;
      return date >= activeInterval.start && date <= activeInterval.end;
    });
  }, [rawTransactions, activeInterval]);

  const totalRevenue = useMemo(() => {
    return currentRevenueList.reduce((sum: number, t: any) => sum + (t.amountGbp || 0), 0);
  }, [currentRevenueList]);

  // Filtered Completed Sessions in Active Interval (Öğretmen Hak Edişleri)
  const currentSessionsList = useMemo(() => {
    return completedSessions.filter((s: any) => {
      const date = s.firstStartTime;
      return date >= activeInterval.start && date <= activeInterval.end;
    });
  }, [completedSessions, activeInterval]);

  // Teacher payout calculation for active interval
  const teacherPayoutsBreakdown = useMemo(() => {
    const teacherStats: { [teacherId: string]: { teacherName: string; lessonCount: number; totalPayout: number } } = {};

    currentSessionsList.forEach((s: any) => {
      const teacher = teachersMap.get(s.teacherId);
      const teacherName = teacher ? `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || teacher.email : 'Bilinmeyen Öğretmen';
      const courseKey = getCourseKey(s.packageCode);
      const rate = teacher?.lessonRates?.[courseKey] ?? teacher?.lessonRate ?? 0;

      if (!teacherStats[s.teacherId]) {
        teacherStats[s.teacherId] = {
          teacherName,
          lessonCount: 0,
          totalPayout: 0
        };
      }

      teacherStats[s.teacherId].lessonCount += 1;
      teacherStats[s.teacherId].totalPayout += rate;
    });

    return Object.entries(teacherStats).map(([teacherId, data]) => ({
      teacherId,
      ...data
    })).sort((a, b) => b.totalPayout - a.totalPayout);
  }, [currentSessionsList, teachersMap]);

  const totalTeacherPayout = useMemo(() => {
    return teacherPayoutsBreakdown.reduce((sum, t) => sum + t.totalPayout, 0);
  }, [teacherPayoutsBreakdown]);

  // Filtered Expenses in Active Interval (Genel Giderler)
  const currentExpensesList = useMemo(() => {
    if (!rawExpenses) return [];
    return rawExpenses.filter((e: any) => {
      let date: Date | null = null;
      if (e.date?.toDate) date = e.date.toDate();
      else if (typeof e.date === 'string') date = parseISO(e.date);
      else if (e.createdAt?.toDate) date = e.createdAt.toDate();

      if (!date) return false;
      return date >= activeInterval.start && date <= activeInterval.end;
    });
  }, [rawExpenses, activeInterval]);

  const totalGeneralExpenses = useMemo(() => {
    return currentExpensesList.reduce((sum: number, e: any) => sum + (e.amountGbp || e.amount || 0), 0);
  }, [currentExpensesList]);

  // Total Expenses (Öğretmenler + Genel Giderler)
  const totalAllExpenses = totalTeacherPayout + totalGeneralExpenses;

  // Net Profit / Loss
  const netProfit = totalRevenue - totalAllExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Monthly Table Breakdown (Nisan 2026'dan itibaren aylar)
  const monthlyTimeline = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Start from April 2026 (month 3) up to the current month in 2026 (minimum September 2026)
    const endMonth = currentYear === 2026 ? Math.max(currentMonth, 8) : 11;
    const months: Date[] = [];
    for (let m = 3; m <= endMonth; m++) {
      months.push(new Date(2026, m, 1));
    }

    return months.map(mDate => {
      const mStart = startOfMonth(mDate);
      const mEnd = endOfMonth(mDate);

      // Revenue for this month
      const rev = (rawTransactions || []).filter((t: any) => {
        if (t.status === 'pending') return false;
        const d = t.createdAt?.toDate?.();
        return d && d >= mStart && d <= mEnd;
      }).reduce((sum: number, t: any) => sum + (t.amountGbp || 0), 0);

      // Teacher payout for this month
      const teachPayout = completedSessions.filter((s: any) => {
        const d = s.firstStartTime;
        return d && d >= mStart && d <= mEnd;
      }).reduce((sum: number, s: any) => {
        const teacher = teachersMap.get(s.teacherId);
        const courseKey = getCourseKey(s.packageCode);
        const rate = teacher?.lessonRates?.[courseKey] ?? teacher?.lessonRate ?? 0;
        return sum + rate;
      }, 0);

      // General expenses for this month
      const genExp = (rawExpenses || []).filter((e: any) => {
        let d: Date | null = null;
        if (e.date?.toDate) d = e.date.toDate();
        else if (typeof e.date === 'string') d = parseISO(e.date);
        else if (e.createdAt?.toDate) d = e.createdAt.toDate();
        return d && d >= mStart && d <= mEnd;
      }).reduce((sum: number, e: any) => sum + (e.amountGbp || e.amount || 0), 0);

      const totalExp = teachPayout + genExp;
      const profit = rev - totalExp;
      const margin = rev > 0 ? (profit / rev) * 100 : 0;

      return {
        monthDate: mDate,
        monthName: format(mDate, 'MMMM yyyy', { locale: tr }),
        revenue: rev,
        teacherPayout: teachPayout,
        generalExpenses: genExp,
        totalExpenses: totalExp,
        netProfit: profit,
        margin: margin
      };
    });
  }, [rawTransactions, completedSessions, rawExpenses, teachersMap]);

  // Handle Add Expense
  const handleSaveExpense = async () => {
    if (!db) return;
    const amountNum = parseFloat(expenseForm.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ variant: 'destructive', title: 'Hatalı Tutar', description: 'Lütfen geçerli bir gider tutarı giriniz.' });
      return;
    }
    if (!expenseForm.title.trim()) {
      toast({ variant: 'destructive', title: 'Eksik Başlık', description: 'Lütfen bir gider başlığı giriniz.' });
      return;
    }

    setIsSubmittingExpense(true);
    try {
      const expenseDate = new Date(expenseForm.date);
      let calculatedGbp = amountNum;
      if (expenseForm.currency === 'EUR') {
        calculatedGbp = Number((amountNum / 1.18).toFixed(2));
      } else if (expenseForm.currency === 'USD') {
        calculatedGbp = Number((amountNum / 1.27).toFixed(2));
      } else if (expenseForm.currency === 'TRY') {
        calculatedGbp = Number((amountNum / 47.0).toFixed(2));
      }

      await addDoc(collection(db, 'expenses'), {
        title: expenseForm.title.trim(),
        amount: amountNum,
        amountGbp: calculatedGbp,
        currency: expenseForm.currency,
        category: expenseForm.category,
        date: Timestamp.fromDate(expenseDate),
        month: format(expenseDate, 'yyyy-MM'),
        year: expenseDate.getFullYear(),
        notes: expenseForm.notes.trim(),
        createdAt: serverTimestamp()
      });

      toast({
        title: 'Gider Kaydedildi!',
        description: `"${expenseForm.title}" başarıyla giderlere eklendi.`,
        className: 'bg-emerald-600 text-white font-bold'
      });

      setExpenseForm({
        title: '',
        amount: '',
        currency: 'EUR',
        category: 'ogretmen',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
      });
      setIsAddExpenseOpen(false);
    } catch (err: any) {
      console.error('Error adding expense:', err);
      toast({ variant: 'destructive', title: 'Hata', description: err.message || 'Gider kaydedilemedi.' });
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  // Handle Delete Expense
  const handleDeleteExpense = async (id: string, title: string) => {
    if (!db) return;
    if (!window.confirm(`"${title}" gider kaydını silmek istediğinize emin misiniz?`)) return;

    try {
      await deleteDoc(doc(db, 'expenses', id));
      toast({
        title: 'Gider Silindi',
        description: `"${title}" başarıyla silindi.`,
        className: 'bg-slate-800 text-white'
      });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Gider silinemedi.' });
    }
  };

  const isLoading = transactionsLoading || teachersLoading || slotsLoading || expensesLoading;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kâr & Finans Yönetimi</h1>
              <p className="text-sm font-medium text-slate-500">
                Nisan 2026'dan itibaren gelir, öğretmen maaşları / hak edişleri, giderler ve net kâr analizi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsAddExpenseOpen(true)}
            className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 h-11 px-5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Gider Ekle
          </Button>
        </div>
      </div>

      {/* FILTER & PERIOD SELECTOR */}
      <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-400 mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Görünüm:
            </span>
            <Button
              variant={periodType === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodType('monthly')}
              className={cn("rounded-xl font-bold text-xs h-9", periodType === 'monthly' && "bg-slate-900 text-white")}
            >
              📅 Aylık
            </Button>
            <Button
              variant={periodType === 'quarterly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodType('quarterly')}
              className={cn("rounded-xl font-bold text-xs h-9", periodType === 'quarterly' && "bg-slate-900 text-white")}
            >
              📊 Çeyreklik (Q)
            </Button>
            <Button
              variant={periodType === 'yearly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodType('yearly')}
              className={cn("rounded-xl font-bold text-xs h-9", periodType === 'yearly' && "bg-slate-900 text-white")}
            >
              📈 Yıllık (2026)
            </Button>
            <Button
              variant={periodType === 'since_april' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodType('since_april')}
              className={cn("rounded-xl font-bold text-xs h-9", periodType === 'since_april' && "bg-slate-900 text-white")}
            >
              🗓️ Nisan'dan Beri Toplam
            </Button>
          </div>

          {/* DYNAMIC SELECTOR BASED ON PERIOD */}
          <div className="flex items-center gap-2">
            {periodType === 'monthly' && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl"
                  onClick={() => setSelectedMonth(prev => subMonths(prev, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Select 
                  value={format(selectedMonth, 'yyyy-MM')} 
                  onValueChange={(val) => setSelectedMonth(parseISO(`${val}-01`))}
                >
                  <SelectTrigger className="w-[180px] h-9 rounded-xl font-bold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026-04">Nisan 2026</SelectItem>
                    <SelectItem value="2026-05">Mayıs 2026</SelectItem>
                    <SelectItem value="2026-06">Haziran 2026</SelectItem>
                    <SelectItem value="2026-07">Temmuz 2026</SelectItem>
                    <SelectItem value="2026-08">Ağustos 2026</SelectItem>
                    <SelectItem value="2026-09">Eylül 2026</SelectItem>
                    <SelectItem value="2026-10">Ekim 2026</SelectItem>
                    <SelectItem value="2026-11">Kasım 2026</SelectItem>
                    <SelectItem value="2026-12">Aralık 2026</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl"
                  onClick={() => setSelectedMonth(prev => addMonths(prev, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {periodType === 'quarterly' && (
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger className="w-[220px] h-9 rounded-xl font-bold text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q2-2026">Q2 2026 (Nisan - Haziran)</SelectItem>
                  <SelectItem value="Q3-2026">Q3 2026 (Temmuz - Eylül)</SelectItem>
                  <SelectItem value="Q4-2026">Q4 2026 (Ekim - Aralık)</SelectItem>
                  <SelectItem value="Q1-2026">Q1 2026 (Ocak - Mart)</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Badge variant="outline" className="h-9 px-3 font-black text-slate-700 bg-slate-50 border-slate-200">
              {activeInterval.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* TOPLAM GELİR */}
        <Card className="rounded-3xl border-slate-200/80 shadow-sm bg-gradient-to-br from-white to-blue-50/40 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Toplam Gelir (Ciro)</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `£${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1">
              {currentRevenueList.length} tamamlanmış sipariş
            </p>
          </div>
        </Card>

        {/* ÖĞRETMEN HAK EDİŞLERİ */}
        <Card className="rounded-3xl border-slate-200/80 shadow-sm bg-gradient-to-br from-white to-purple-50/40 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Öğretmen Hak Edişleri</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-purple-900">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `£${totalTeacherPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1">
              {currentSessionsList.length} tamamlanan ders seansı
            </p>
          </div>
        </Card>

        {/* GENEL GİDERLER */}
        <Card className="rounded-3xl border-slate-200/80 shadow-sm bg-gradient-to-br from-white to-amber-50/40 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Diğer Genel Giderler</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `£${totalGeneralExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1">
              {currentExpensesList.length} kayıtlı gider kalemi
            </p>
          </div>
        </Card>

        {/* NET KÂR / ZARAR */}
        <Card className={cn(
          "rounded-3xl border-2 shadow-md p-6 flex flex-col justify-between",
          netProfit >= 0 ? "border-emerald-300 bg-emerald-50/40" : "border-rose-300 bg-rose-50/40"
        )}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              {netProfit >= 0 ? 'Net Kâr' : 'Net Zarar'}
            </span>
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center font-black",
              netProfit >= 0 ? "bg-emerald-200 text-emerald-800" : "bg-rose-200 text-rose-800"
            )}>
              {netProfit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            <div className={cn("text-3xl font-black", netProfit >= 0 ? "text-emerald-700" : "text-rose-700")}>
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `${netProfit >= 0 ? '+' : ''}£${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn(
                "text-[10px] font-black border-none px-2 py-0.5",
                netProfit >= 0 ? "bg-emerald-200 text-emerald-800" : "bg-rose-200 text-rose-800"
              )}>
                %{profitMargin.toFixed(1)} Marj
              </Badge>
              <span className="text-[10px] font-bold text-slate-500">
                Toplam Gider: £{totalAllExpenses.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* DETAILED CONTENT TABS */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1">
          <TabsTrigger value="timeline" className="rounded-xl font-bold text-xs px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            📈 Aylık Kâr Dökümü (Nisan'dan Beri)
          </TabsTrigger>
          <TabsTrigger value="teachers" className="rounded-xl font-bold text-xs px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            👩‍🏫 Öğretmen Hak Edişleri ({teacherPayoutsBreakdown.length})
          </TabsTrigger>
          <TabsTrigger value="expenses" className="rounded-xl font-bold text-xs px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            🧾 Gider Listesi ({currentExpensesList.length})
          </TabsTrigger>
          <TabsTrigger value="sales" className="rounded-xl font-bold text-xs px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            💰 Satış Detayları ({currentRevenueList.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: MONTHLY TIMELINE TABLE (NİSAN 2026'DAN BERİ) */}
        <TabsContent value="timeline">
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 p-6">
              <CardTitle className="text-xl font-bold text-slate-900">2026 Aylık Kâr & Zarar Tablosu</CardTitle>
              <CardDescription>
                Nisan 2026 başlangıç alınarak aylık bazda gelir, öğretmen ödemeleri, operasyonel giderler ve net kâr analizi.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700 py-4 pl-6">Ay</TableHead>
                    <TableHead className="font-bold text-slate-700">Gelir (Ciro)</TableHead>
                    <TableHead className="font-bold text-slate-700">Öğretmen Gideri</TableHead>
                    <TableHead className="font-bold text-slate-700">Diğer Giderler</TableHead>
                    <TableHead className="font-bold text-slate-700">Toplam Gider</TableHead>
                    <TableHead className="font-bold text-slate-700">Net Kâr / Zarar</TableHead>
                    <TableHead className="font-bold text-slate-700">Kâr Marjı</TableHead>
                    <TableHead className="font-bold text-slate-700 pr-6 text-right">Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyTimeline.map((item, idx) => {
                    const isPositive = item.netProfit >= 0;
                    return (
                      <TableRow key={idx} className="hover:bg-slate-50/70 border-b border-slate-100 transition-colors">
                        <TableCell className="font-bold text-slate-800 py-4 pl-6">
                          {item.monthName}
                        </TableCell>
                        <TableCell className="font-bold text-blue-700">
                          £{item.revenue.toFixed(2)}
                        </TableCell>
                        <TableCell className="font-medium text-purple-700">
                          £{item.teacherPayout.toFixed(2)}
                        </TableCell>
                        <TableCell className="font-medium text-amber-700">
                          £{item.generalExpenses.toFixed(2)}
                        </TableCell>
                        <TableCell className="font-bold text-slate-700">
                          £{item.totalExpenses.toFixed(2)}
                        </TableCell>
                        <TableCell className={cn("font-black text-base", isPositive ? "text-emerald-600" : "text-rose-600")}>
                          {isPositive ? '+' : ''}£{item.netProfit.toFixed(2)}
                        </TableCell>
                        <TableCell className="font-bold text-slate-600">
                          %{item.margin.toFixed(1)}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Badge className={cn(
                            "font-black text-[10px] px-2.5 py-1 uppercase border-none",
                            isPositive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          )}>
                            {isPositive ? 'KÂR' : 'ZARAR'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: TEACHERS BREAKDOWN */}
        <TabsContent value="teachers">
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Öğretmen Hak Edişleri</CardTitle>
                <CardDescription>
                  Seçili dönemde ({activeInterval.label}) tamamlanan derslerin öğretmen bazlı hak ediş dökümü.
                </CardDescription>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block uppercase">Dönem Toplamı</span>
                <span className="text-2xl font-black text-purple-700">£{totalTeacherPayout.toFixed(2)}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700 py-4 pl-6">Öğretmen</TableHead>
                    <TableHead className="font-bold text-slate-700">Tamamlanan Ders Sayısı</TableHead>
                    <TableHead className="font-bold text-slate-700">Ort. Ders Başı Ücret</TableHead>
                    <TableHead className="font-bold text-slate-700 pr-6 text-right">Toplam Hak Ediş</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherPayoutsBreakdown.length > 0 ? (
                    teacherPayoutsBreakdown.map((t) => {
                      const avgRate = t.lessonCount > 0 ? t.totalPayout / t.lessonCount : 0;
                      return (
                        <TableRow key={t.teacherId} className="hover:bg-slate-50/70 border-b border-slate-100">
                          <TableCell className="font-bold text-slate-800 py-4 pl-6">
                            {t.teacherName}
                          </TableCell>
                          <TableCell className="font-medium text-slate-600">
                            {t.lessonCount} Ders
                          </TableCell>
                          <TableCell className="font-medium text-slate-500">
                            £{avgRate.toFixed(2)} / ders
                          </TableCell>
                          <TableCell className="font-black text-purple-700 text-right pr-6">
                            £{t.totalPayout.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-slate-400 font-medium">
                        Bu dönem için tamamlanmış öğretmen dersi bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: EXPENSES LIST */}
        <TabsContent value="expenses">
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Operasyonel & Genel Giderler</CardTitle>
                <CardDescription>
                  Seçili dönemde ({activeInterval.label}) kayıtlı şirket giderleri.
                </CardDescription>
              </div>
              <Button 
                onClick={() => setIsAddExpenseOpen(true)}
                size="sm"
                className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Gider Ekle
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700 py-4 pl-6">Tarih</TableHead>
                    <TableHead className="font-bold text-slate-700">Gider Başlığı</TableHead>
                    <TableHead className="font-bold text-slate-700">Kategori</TableHead>
                    <TableHead className="font-bold text-slate-700">Notlar</TableHead>
                    <TableHead className="font-bold text-slate-700">Tutar</TableHead>
                    <TableHead className="font-bold text-slate-700 pr-6 text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentExpensesList.length > 0 ? (
                    currentExpensesList.map((exp: any) => {
                      let dateStr = '-';
                      if (exp.date?.toDate) dateStr = format(exp.date.toDate(), 'dd MMM yyyy', { locale: tr });
                      else if (typeof exp.date === 'string') dateStr = format(parseISO(exp.date), 'dd MMM yyyy', { locale: tr });

                      const catInfo = EXPENSE_CATEGORIES[exp.category] || EXPENSE_CATEGORIES.diger;

                      return (
                        <TableRow key={exp.id} className="hover:bg-slate-50/70 border-b border-slate-100">
                          <TableCell className="font-bold text-slate-600 py-4 pl-6 text-xs whitespace-nowrap">
                            {dateStr}
                          </TableCell>
                          <TableCell className="font-bold text-slate-800">
                            {exp.title}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-[10px] font-bold border", catInfo.color)}>
                              {catInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-400 max-w-[200px] truncate">
                            {exp.notes || '-'}
                          </TableCell>
                          <TableCell className="font-black">
                            {exp.currency === 'EUR' ? (
                              <div>
                                <span className="text-slate-900 font-black">€{exp.amount ? Number(exp.amount).toFixed(2) : (exp.amountGbp ? (exp.amountGbp * 1.18).toFixed(2) : '0.00')}</span>
                                <span className="text-[11px] text-slate-400 font-bold block">(£{(exp.amountGbp || 0).toFixed(2)})</span>
                              </div>
                            ) : exp.currency === 'USD' ? (
                              <div>
                                <span className="text-slate-900 font-black">${exp.amount ? Number(exp.amount).toFixed(2) : '0.00'}</span>
                                <span className="text-[11px] text-slate-400 font-bold block">(£{(exp.amountGbp || 0).toFixed(2)})</span>
                              </div>
                            ) : exp.currency === 'TRY' ? (
                              <div>
                                <span className="text-slate-900 font-black">₺{exp.amount ? Number(exp.amount).toFixed(2) : '0.00'}</span>
                                <span className="text-[11px] text-slate-400 font-bold block">(£{(exp.amountGbp || 0).toFixed(2)})</span>
                              </div>
                            ) : (
                              <div className="text-slate-900 font-black">
                                £{(exp.amountGbp || exp.amount || 0).toFixed(2)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteExpense(exp.id, exp.title)}
                              className="text-slate-400 hover:text-rose-600 h-8 w-8 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                        Bu dönem için kayıtlı gider bulunamadı. "Yeni Gider Ekle" butonunu kullanarak ekleyebilirsiniz.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: REVENUE BREAKDOWN */}
        <TabsContent value="sales">
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Satışlar ve Gelir Kayıtları</CardTitle>
                <CardDescription>
                  Seçili dönemde ({activeInterval.label}) gerçekleşen tamamlanmış siparişler.
                </CardDescription>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block uppercase">Dönem Cirosu</span>
                <span className="text-2xl font-black text-blue-700">£{totalRevenue.toFixed(2)}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700 py-4 pl-6">Tarih</TableHead>
                    <TableHead className="font-bold text-slate-700">Veli / Müşteri</TableHead>
                    <TableHead className="font-bold text-slate-700">İçerik / Paket</TableHead>
                    <TableHead className="font-bold text-slate-700">Tür</TableHead>
                    <TableHead className="font-bold text-slate-700 pr-6 text-right">Tutar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRevenueList.length > 0 ? (
                    currentRevenueList.map((tx: any) => {
                      const date = tx.createdAt?.toDate?.();
                      const dateStr = date ? format(date, 'dd MMM yyyy, HH:mm', { locale: tr }) : '-';

                      return (
                        <TableRow key={tx.id} className="hover:bg-slate-50/70 border-b border-slate-100">
                          <TableCell className="font-bold text-slate-500 py-4 pl-6 text-xs whitespace-nowrap">
                            {dateStr}
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-slate-800 text-sm">{tx.userName || 'Veli'}</div>
                            <div className="text-[10px] text-slate-400">{tx.userEmail || ''}</div>
                          </TableCell>
                          <TableCell className="text-xs font-medium text-slate-600">
                            {tx.items?.map((item: any, i: number) => (
                              <span key={i} className="block">{item.quantity}x {item.name}</span>
                            ))}
                            {tx.totalLessonsToAdd && (
                              <span className="text-primary font-bold">{tx.totalLessonsToAdd} Ders</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "text-[9px] font-black uppercase border-none",
                              tx.type === 'premium' ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                            )}>
                              {tx.type === 'premium' ? 'Üyelik' : 'Ders Paketi'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-black text-slate-900 text-right pr-6">
                            £{(tx.amountGbp || 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                        Bu dönem için satış kaydı bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ADD EXPENSE DIALOG */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="max-w-lg rounded-[28px] border-none shadow-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">Yeni Gider Ekle</DialogTitle>
            <DialogDescription>
              İşletme gideri, öğretmen ek ödemesi veya reklam harcamasını sisteme kaydedin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Gider Başlığı *</Label>
              <Input 
                value={expenseForm.title} 
                onChange={e => setExpenseForm({...expenseForm, title: e.target.value})}
                placeholder="Örn: Meta Reklam Harcaması, Öğretmen Maaşı - Ayşe H."
                className="h-11 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Tutar *</Label>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={expenseForm.amount} 
                  onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                  placeholder="0.00"
                  className="h-11 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Para Birimi *</Label>
                <Select 
                  value={expenseForm.currency} 
                  onValueChange={val => setExpenseForm({...expenseForm, currency: val})}
                >
                  <SelectTrigger className="h-11 rounded-xl font-bold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">Sterlin (£)</SelectItem>
                    <SelectItem value="TRY">Türk Lirası (₺)</SelectItem>
                    <SelectItem value="USD">Dolar ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Tarih *</Label>
                <Input 
                  type="date" 
                  value={expenseForm.date} 
                  onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
                  className="h-11 rounded-xl font-medium text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Kategori *</Label>
              <Select 
                value={expenseForm.category} 
                onValueChange={val => setExpenseForm({...expenseForm, category: val})}
              >
                <SelectTrigger className="h-11 rounded-xl font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => (
                    <SelectItem key={key} value={key} className="font-medium">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Açıklama / Notlar (Opsiyonel)</Label>
              <Textarea 
                rows={3}
                value={expenseForm.notes} 
                onChange={e => setExpenseForm({...expenseForm, notes: e.target.value})}
                placeholder="Fatura numarası veya giderle ilgili ek bilgi..."
                className="rounded-xl font-medium resize-none text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsAddExpenseOpen(false)}
              className="rounded-xl font-bold h-11 px-5"
            >
              Vazgeç
            </Button>
            <Button 
              onClick={handleSaveExpense}
              disabled={isSubmittingExpense}
              className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 shadow-md shadow-emerald-600/20"
            >
              {isSubmittingExpense ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Gideri Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
