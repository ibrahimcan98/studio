'use client';

import { useMemo, useState } from 'react';
import { collection, doc, query, where } from 'firebase/firestore';
import { endOfMonth, format, isAfter, startOfMonth, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CircleDollarSign,
  Loader2,
  ReceiptText,
} from 'lucide-react';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  buildCompletedTeacherSessions,
  getTeacherCourseRate,
  TEACHER_COURSES,
  TeacherCourseKey,
} from '@/lib/teacher-earnings';

const money = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function TeacherEarningsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date()));

  const teacherRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: teacher, isLoading: teacherLoading } = useDoc(teacherRef);

  const slotsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'lesson-slots'),
      where('teacherId', '==', user.uid),
      where('status', 'in', ['booked', 'completed'])
    );
  }, [db, user]);
  const { data: rawSlots, isLoading: slotsLoading } = useCollection(slotsQuery);

  const completedSessions = useMemo(
    () => buildCompletedTeacherSessions(rawSlots),
    [rawSlots]
  );

  const monthlySessions = useMemo(() => {
    const firstDay = startOfMonth(selectedMonth);
    const lastDay = endOfMonth(selectedMonth);
    return completedSessions.filter(
      session => session.firstStartTime >= firstDay && session.firstStartTime <= lastDay
    );
  }, [completedSessions, selectedMonth]);

  const breakdown = useMemo(() => {
    const counts = new Map<TeacherCourseKey, number>();
    monthlySessions.forEach(session => {
      counts.set(session.courseKey, (counts.get(session.courseKey) || 0) + 1);
    });

    return TEACHER_COURSES.map(course => {
      const lessonCount = counts.get(course.key) || 0;
      const unitRate = getTeacherCourseRate(teacher, course.key);
      return { ...course, lessonCount, unitRate, total: lessonCount * unitRate };
    });
  }, [monthlySessions, teacher]);

  const totalEarnings = breakdown.reduce((total, row) => total + row.total, 0);
  const averageEarnings = monthlySessions.length ? totalEarnings / monthlySessions.length : 0;
  const currentMonth = startOfMonth(new Date());
  const nextMonthIsFuture = isAfter(startOfMonth(subMonths(selectedMonth, -1)), currentMonth);

  if (teacherLoading || slotsLoading) {
    return (
      <div className="flex min-h-[calc(100vh-145px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
            <ReceiptText className="h-4 w-4" />
            ÖĞRETMEN HAK EDİŞLERİ
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Kazanç Detayım</h1>
          <p className="mt-2 text-sm text-slate-500">
            Tamamlanan derslerinizi kurs türüne ve aya göre inceleyin.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border bg-white p-2 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Önceki ay"
            onClick={() => setSelectedMonth(month => subMonths(month, 1))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-40 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seçili dönem</p>
            <p className="font-black capitalize text-slate-800">
              {format(selectedMonth, 'MMMM yyyy', { locale: tr })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sonraki ay"
            disabled={nextMonthIsFuture}
            onClick={() => setSelectedMonth(month => subMonths(month, -1))}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
              <CircleDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Toplam kazanç</p>
              <p className="text-3xl font-black text-slate-900">{money.format(totalEarnings)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tamamlanan ders</p>
              <p className="text-3xl font-black text-slate-900">{monthlySessions.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ders başı ortalama</p>
              <p className="text-3xl font-black text-slate-900">{money.format(averageEarnings)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/70 px-4 py-5 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg font-black capitalize text-slate-800">
              {format(selectedMonth, 'MMMM yyyy', { locale: tr })} hak ediş detayları
            </CardTitle>
            <Badge variant="outline" className="rounded-full bg-white px-3 py-1 text-slate-600">
              {monthlySessions.length} Ders
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="pl-6 text-xs font-black uppercase tracking-wider">Kurs türü</TableHead>
                <TableHead className="text-center text-xs font-black uppercase tracking-wider">Birim ücret</TableHead>
                <TableHead className="text-center text-xs font-black uppercase tracking-wider">Ders adedi</TableHead>
                <TableHead className="pr-6 text-right text-xs font-black uppercase tracking-wider">Toplam kazanç</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breakdown.map(row => (
                <TableRow key={row.key} className="h-20">
                  <TableCell className="pl-6 font-bold text-slate-700">{row.label}</TableCell>
                  <TableCell className="text-center font-semibold text-slate-500">{money.format(row.unitRate)}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-indigo-50 px-3 py-2 font-black text-indigo-600 ring-1 ring-indigo-100">
                      {row.lessonCount}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 text-right text-lg font-black text-slate-900">{money.format(row.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6 overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-white px-4 py-5 md:px-6">
          <CardTitle className="text-lg font-black text-slate-800">Ders Bazlı Detay</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {monthlySessions.length ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="pl-6">Tarih</TableHead>
                  <TableHead>Kurs</TableHead>
                  <TableHead className="pr-6 text-right">Hak ediş</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...monthlySessions].reverse().map(session => {
                  const course = TEACHER_COURSES.find(item => item.key === session.courseKey);
                  return (
                    <TableRow key={session.id}>
                      <TableCell className="pl-6 font-semibold text-slate-700">
                        {format(session.firstStartTime, 'dd MMMM yyyy, HH:mm', { locale: tr })}
                      </TableCell>
                      <TableCell className="text-slate-600">{course?.label || 'Diğer'}</TableCell>
                      <TableCell className="pr-6 text-right font-black text-emerald-700">
                        {money.format(getTeacherCourseRate(teacher, session.courseKey))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <BookOpenCheck className="mb-3 h-10 w-10 text-slate-300" />
              <p className="font-bold text-slate-700">Bu ay tamamlanmış ders bulunmuyor.</p>
              <p className="mt-1 text-sm text-slate-400">Dersler tamamlandıkça hak edişler burada görünecek.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-slate-400">
        Hak edişler tamamlanan dersler ve profilinizde tanımlı ders ücretleri üzerinden hesaplanır.
      </p>
    </div>
  );
}
