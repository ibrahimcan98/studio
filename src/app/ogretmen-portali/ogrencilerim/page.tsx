
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc, getDocs } from 'firebase/firestore';
import { Loader2, Users, BookOpen, Clock, Euro, ArrowRight, ChevronDown, User as UserIcon, Calendar, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ProgressPanel } from '@/components/shared/progress-panel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"


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

const StudentCard = ({ student, lessons }: { student: any, lessons: any[] }) => {
    const db = useFirestore();
    const childDocRef = useMemoFirebase(() => {
        if (!db || !student.userId || !student.childId) return null;
        return doc(db, 'users', student.userId, 'children', student.childId);
    }, [db, student.userId, student.childId]);
    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);
    const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false);

    if (isChildLoading) {
        return (
            <Card className="p-4 flex items-center justify-center min-h-[120px]">
                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            </Card>
        );
    }
    
    const studentLessons = lessons.filter(l => l.childId === student.childId);
    const totalLessons = studentLessons.length;
    const totalHours = (totalLessons * LESSON_DURATION_MINUTES) / 60;
    const totalEarned = totalLessons * LESSON_PRICE_EURO;
    const lastLesson = studentLessons.sort((a,b) => b.startTime.seconds - a.startTime.seconds)[0];

    return (
         <>
            <Dialog>
                <DialogTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                        <div className='flex items-center p-4'>
                            <Avatar className="h-12 w-12 mr-4">
                                <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                                    {childData?.firstName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-bold text-lg">{childData?.firstName}</p>
                                <p className="text-sm text-muted-foreground">{childData?.level || 'N/A'}</p>
                            </div>
                            <Badge variant="secondary" className="mr-4">{totalLessons} Ders</Badge>
                        </div>
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-4">
                             <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl">
                                    {childData?.firstName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                               <p className="text-2xl font-bold">{childData?.firstName}</p>
                               <p className="text-base font-normal text-muted-foreground">{childData?.level || 'N/A'}</p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <Separator />
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">{childData?.assignedPackageName || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">Kurs</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">{lastLesson ? format(lastLesson.startTime.toDate(), 'dd MMM yyyy', { locale: tr }) : 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">Son Ders</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">{totalHours.toFixed(1)} Saat</p>
                                    <p className="text-xs text-muted-foreground">Toplam Süre</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-2">
                                <Euro className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">€{totalEarned.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">Toplam Kazanç</p>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <Button className='w-full' onClick={() => setIsProgressPanelOpen(true)}>
                            <Edit className='w-4 h-4 mr-2'/> İlerleme Panelini Görüntüle
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

             <Dialog open={isProgressPanelOpen} onOpenChange={setIsProgressPanelOpen}>
                <DialogContent className="max-w-5xl h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold font-headline">
                            {isChildLoading || !childData ? 'Yükleniyor...' : `${childData.firstName} İlerleme Paneli`}
                        </DialogTitle>
                        <DialogDescription>
                            {isChildLoading || !childData ? 'Öğrenci verileri yükleniyor...' : 'Çocuğun Türkçe öğrenme yolculuğuna dair kapsamlı analiz ve raporlar.'}
                        </DialogDescription>
                    </DialogHeader>
                    {isChildLoading || !childData ? (
                         <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        </div>
                    ) : (
                        <ProgressPanel child={childData} isEditable={true} />
                    )}
                </DialogContent>
            </Dialog>
        </>
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

            <Card>
                <CardHeader>
                    <CardTitle>Öğrencilerim</CardTitle>
                    <CardDescription>Tüm öğrencilerinizin bir listesi ve temel istatistikleri.</CardDescription>
                </CardHeader>
                <CardContent>
                    {lessonsLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : stats.uniqueStudents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.uniqueStudents.map(student => (
                                <StudentCard key={student.childId} student={student} lessons={lessons || []}/>
                            ))}
                        </div>
                    ) : (
                        <div className="h-24 text-center flex items-center justify-center text-muted-foreground">
                            Henüz öğrenciniz bulunmuyor.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

