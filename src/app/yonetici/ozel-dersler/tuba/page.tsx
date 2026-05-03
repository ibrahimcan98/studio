'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    Star, 
    User, 
    CreditCard, 
    Package, 
    TrendingUp,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function TubaSpecialAdminPage() {
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user && user.email !== 'tubakodak@turkcocukakademisii.com') {
      router.replace('/yonetici');
    }
  }, [user, authLoading, router]);

  // SADECE Tuba'ya özel işlemleri çekiyoruz
  const transactionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
        collection(db, 'transactions'), 
        where('isSpecial', '==', 'tuba'), 
        orderBy('createdAt', 'desc')
    );
  }, [db]);

  const { data: transactions, isLoading } = useCollection(transactionsQuery);

  const stats = useMemo(() => {
    if (!transactions) return { total: 0, count: 0 };
    const total = transactions.reduce((acc, curr) => acc + (curr.amountGbp || 0), 0);
    return { total, count: transactions.length };
  }, [transactions]);

  if (isLoading) {
    return (
        <div className="flex flex-col justify-center items-center h-96 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-rose-500 opacity-20" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">VIP Veriler Yükleniyor...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 p-8 pt-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Tuba'nın VIP Paneli</h1>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Özel ders programına ait tüm alımlar ve öğrenci listesi.</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Toplam VIP Ciro</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black">£{stats.total.toFixed(2)}</div>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">Özel Program Geliri</p>
            </CardContent>
        </Card>
        
        <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toplam Kayıt</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black text-slate-900">{stats.count}</div>
                <p className="text-[10px] text-emerald-500 mt-2 font-bold uppercase tracking-tight">Aktif VIP Öğrenci</p>
            </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden rounded-[32px] bg-white">
        <CardHeader className="border-b bg-slate-50/50 px-8 py-6">
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-rose-500" /> VIP İŞLEM LİSTESİ
                </CardTitle>
                <Badge className="bg-rose-500 text-white border-none font-black px-3 py-1">SADECE SİZE ÖZEL</Badge>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="font-bold text-slate-500 py-5 pl-8 text-[10px] uppercase tracking-widest">Öğrenci / Veli</TableHead>
                        <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">Paket Detayı</TableHead>
                        <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest text-center">Tarih</TableHead>
                        <TableHead className="font-bold text-slate-900 text-right pr-8 text-[10px] uppercase tracking-widest">Tutar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions?.length > 0 ? (
                        transactions.map((t) => (
                            <TableRow key={t.id} className="hover:bg-rose-50/20 transition-colors border-slate-50">
                                <TableCell className="py-6 pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 text-sm leading-tight uppercase tracking-tight">{t.userName}</span>
                                            <span className="text-[10px] text-slate-400 font-bold mt-0.5 lowercase">{t.userEmail}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {t.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Package className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-xs font-black text-slate-600">{item.name}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <ArrowUpRight className="w-3 h-3 text-rose-400" />
                                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">Özel Eğitim</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500">
                                        <Calendar className="w-3 h-3" />
                                        {format(t.createdAt.toDate(), 'dd MMMM yyyy', { locale: tr })}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="text-lg font-black text-slate-900">
                                        £{(t.amountGbp || 0).toFixed(2)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-64 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-20">
                                    <Star className="w-12 h-12" />
                                    <p className="text-sm font-bold uppercase tracking-widest">Henüz VIP işlem bulunmuyor</p>
                                </div>
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
