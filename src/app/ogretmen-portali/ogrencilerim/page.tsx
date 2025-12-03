
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc, getDocs } from 'firebase/firestore';
import { Loader2, Users, BookOpen, Clock, Euro, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';

// Constants
const LESSON_PRICE_EURO = 10;
const LESSON_DURATION_MINUTES = 30;

function StatCard({ title, value, icon: Icon, unit }: { title: string, value: string | number, icon: React.ElementType, unit?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

const StudentRow = ({ student, lessons }: { student: any, lessons: any[] }) => {
    const db = useFirestore();
    const childDocRef = useMemoFirebase(() => {
        if (!db || !student.userId || !student.childId) return null;
        return doc(db, 'users', student.userId, 'children', student.childId);
    }, [db, student.userId, student.childId]);
    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);

    if (isChildLoading) {
        return (
            <TableRow>
                <TableCell colSpan={8} className="text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
            </TableRow>
        );
    }
    
    const studentLessons = lessons.filter(l => l.childId === student.childId);
    const totalLessons = studentLessons.length;
    const totalHours = (totalLessons * LESSON_DURATION_MINUTES) / 60;
    const totalEarned = totalLessons * LESSON_PRICE_EURO;
    const lastLesson = studentLessons.sort((a,b) => b.startTime.seconds - a.startTime.seconds)[0];

    return (
        <TableRow>
            <TableCell className="font-medium">{childData?.firstName}</TableCell>
            <TableCell>{childData?.level || 'N/A'}</TableCell>
            <TableCell>{childData?.assignedPackageName || 'N/A'}</TableCell>
            <TableCell>
                {lastLesson ? format(lastLesson.startTime.toDate(), 'dd MMM yyyy', { locale: tr }) : 'N/A'}
            </TableCell>
            <TableCell>{totalLessons}</TableCell>
            <TableCell>{totalHours.toFixed(1)}</TableCell>
            <TableCell>€{totalEarned.toFixed(2)}</TableCell>
            <TableCell>
                <Button variant="outline" size="sm" disabled>Detaylar</Button>
            </TableCell>
        </TableRow>
    );
};


export default function OgrencilerimPage() {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    
    const lessonsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid), where('status', '==', 'booked'));
    }, [user, db]);

    const { data: lessons, isLoading: lessonsLoading } = useCollection(lessonsQuery);

    const stats = useMemo(() => {
        if (!lessons) return { totalStudents: 0, lessonsThisMonth: 0, hoursTaught: 0, earningsThisMonth: 0, uniqueStudents: [] };
        
        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        
        const uniqueStudents = lessons.reduce((acc: any[], lesson) => {
            if (!acc.some(s => s.childId === lesson.childId)) {
                acc.push({ childId: lesson.childId, userId: lesson.bookedBy });
            }
            return acc;
        }, []);

        const lessonsThisMonth = lessons.filter(l => isWithinInterval(l.startTime.toDate(), { start: monthStart, end: monthEnd }));

        const totalHoursTaught = (lessons.length * LESSON_DURATION_MINUTES) / 60;
        const earningsThisMonth = lessonsThisMonth.length * LESSON_PRICE_EURO;
        
        return {
            totalStudents: uniqueStudents.length,
            lessonsThisMonth: lessonsThisMonth.length,
            hoursTaught: totalHoursTaught,
            earningsThisMonth,
            uniqueStudents,
        };

    }, [lessons]);

    if (userLoading || lessonsLoading) {
        return <div className="flex min-h-[calc(100vh-145px)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Öğrenci Panelim</h2>
                    <p className="text-muted-foreground">Öğrencilerinizi, derslerinizi ve kazançlarınızı yönetin.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Toplam Öğrenci" value={stats.totalStudents} icon={Users} />
                <StatCard title="Bu Ayki Dersler" value={stats.lessonsThisMonth} icon={BookOpen} />
                <StatCard title="Toplam Ders Saati" value={stats.hoursTaught.toFixed(1)} icon={Clock} unit="saat" />
                <StatCard title="Bu Ayki Kazanç" value={`€${stats.earningsThisMonth.toFixed(2)}`} icon={Euro} />
            </div>

            <div className="grid grid-cols-1 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Öğrencilerim</CardTitle>
                        <CardDescription>Tüm öğrencilerinizin bir listesi ve temel istatistikleri.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Öğrenci</TableHead>
                                    <TableHead>Seviye</TableHead>
                                    <TableHead>Kurs</TableHead>
                                    <TableHead>Son Ders</TableHead>
                                    <TableHead>Toplam Ders</TableHead>
                                    <TableHead>Toplam Saat</TableHead>
                                    <TableHead>Toplam Kazanç</TableHead>
                                    <TableHead>İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.uniqueStudents.length > 0 ? (
                                    stats.uniqueStudents.map(student => (
                                        <StudentRow key={student.childId} student={student} lessons={lessons || []}/>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            Henüz öğrenciniz bulunmuyor.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

