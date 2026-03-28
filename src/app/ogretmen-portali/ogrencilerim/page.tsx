
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
const LESSON_DURATION_MINUTES = 30;

// 5-minute buffer is excluded from duration
const getLessonPrice = (packageCode: string | undefined, userData: any): number => {
    // Admin must enter the wage/rate for the teacher in user profile (e.g., userData.wagePerLesson or userData.hourlyRate)
    // If no explicit rate is set for the teacher, do not increase earnings artificially.
    if (!userData || !userData.lessonWage) {
        return 0; 
    }
    // E.g. userData.lessonWage could be a flat rate, or an object based on package
    return Number(userData.lessonWage) || 0;
};


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

const StudentCard = ({ student, lessons, teacherData }: { student: any, lessons: any[], teacherData: any }) => {
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
    
    // Group contiguous 5-minute slots into 1 single lesson
    const uniqueStudentLessons = studentLessons.filter(slot => {
        const slotTime = slot.startTime.seconds;
        const hasPrev = studentLessons.some(o => o.startTime.seconds === slotTime - 300); // 5 mins in seconds
        return !hasPrev;
    });

    const totalLessons = uniqueStudentLessons.length;
    // Each lesson has a 5 min buffer slot at the end. We subtract it.
    const totalMinutes = (studentLessons.length - totalLessons) * 5;
    const totalEarned = uniqueStudentLessons.reduce((sum, lesson) => sum + getLessonPrice(lesson.packageCode, teacherData), 0);
    const lastLesson = uniqueStudentLessons.sort((a,b) => b.startTime.seconds - a.startTime.seconds)[0];

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
                                    <p className="font-semibold">{totalMinutes} Dakika</p>
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
    
    // Fetch Teacher Data to get actual rates (admin must input this)
    const teacherDocRef = useMemoFirebase(() => (user && db) ? doc(db, 'users', user.uid) : null, [user, db]);
    const { data: teacherData } = useDoc(teacherDocRef);
    
    const lessonsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid), where('status', '==', 'booked'));
    }, [user, db]);

    const { data: lessons, isLoading: lessonsLoading } = useCollection(lessonsQuery);

    const stats = useMemo(() => {
        if (!lessons) return { totalStudents: 0, totalLessons: 0, minutesTaught: 0, totalEarnings: 0, uniqueStudents: [] };
        
        const uniqueStudents = lessons.reduce((acc: any[], lesson) => {
            if (!acc.some(s => s.childId === lesson.childId)) {
                acc.push({ childId: lesson.childId, userId: lesson.bookedBy });
            }
            return acc;
        }, []);

        // Group contiguous 5-minute slots into 1 single lesson
        const uniqueLessons = lessons.filter(slot => {
            const slotTime = slot.startTime.seconds;
            const hasPrev = lessons.some(o => o.childId === slot.childId && o.startTime.seconds === slotTime - 300);
            return !hasPrev;
        });

        const actualTotalLessons = uniqueLessons.length;
        // Each lesson block includes a 5 min buffer at the end. Duration is: (Total Slots - Total Unique Lessons) * 5 mins
        const totalMinutesTaught = (lessons.length - actualTotalLessons) * 5;
        const totalEarnings = uniqueLessons.reduce((sum, lesson) => sum + getLessonPrice(lesson.packageCode, teacherData), 0);
        
        return {
            totalStudents: uniqueStudents.length,
            totalLessons: actualTotalLessons,
            minutesTaught: totalMinutesTaught,
            totalEarnings: totalEarnings,
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
                <StatCard title="Toplam Ders Sayısı" value={stats.totalLessons} icon={BookOpen} />
                <StatCard title="Toplam Ders Süresi" value={stats.minutesTaught} icon={Clock} unit="dakika" />
                <StatCard title="Toplam Kazanç" value={`€${stats.totalEarnings.toFixed(2)}`} icon={Euro} />
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
                            {stats.uniqueStudents.map((student, index) => (
                                <StudentCard key={`${student.childId}-${index}`} student={student} lessons={lessons || []} teacherData={teacherData} />
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

