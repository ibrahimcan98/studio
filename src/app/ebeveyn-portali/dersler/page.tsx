
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Calendar, Clock, User, BookOpen, Baby, History, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { addMinutes, isSameDay } from 'date-fns';
import { COURSES } from '@/data/courses';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const getCourseDetailsFromPackageCode = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: 30 };
    
    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '')];
    const course = COURSES.find(c => c.id === courseId);
    
    if (!course) return null;

    let duration = 30; // Default
    if (course.id === 'baslangic') duration = 20;
    if (course.id === 'konusma') duration = 30;
    if (course.id === 'gelisim' || course.id === 'akademik') duration = 45;

    return { courseName: course.title, duration };
};


function LessonCard({ lesson }: { lesson: any }) {
    const db = useFirestore();

    const childDocRef = useMemoFirebase(() => {
        if (!db || !lesson.bookedBy || !lesson.childId) return null;
        return doc(db, 'users', lesson.bookedBy, 'children', lesson.childId);
    }, [db, lesson.bookedBy, lesson.childId]);

    const teacherDocRef = useMemoFirebase(() => {
        if (!db || !lesson.teacherId) return null;
        return doc(db, 'users', lesson.teacherId);
    }, [db, lesson.teacherId]);

    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);
    const { data: teacherData, isLoading: isTeacherLoading } = useDoc(teacherDocRef);

    if (isChildLoading || isTeacherLoading) {
        return (
            <Card className="p-4 flex items-center justify-center min-h-[220px]">
                <Loader2 className="animate-spin text-primary" />
            </Card>
        );
    }

    const isPast = new Date() > lesson.endTime;
    const startTimeStr = formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });
    const endTimeStr = formatInTimeZone(lesson.endTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });
    const packageDetails = getCourseDetailsFromPackageCode(lesson.packageCode);

    return (
        <Card className='flex flex-col bg-white'>
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span className="text-xl font-bold">{packageDetails?.courseName || 'Ders'}</span>
                     <Badge variant={isPast ? "outline" : "default"} className={isPast ? "" : "bg-green-100 text-green-800"}>
                        {isPast ? 'Tamamlandı' : 'Yaklaşıyor'}
                    </Badge>
                </CardTitle>
                <CardDescription>
                    {formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'dd MMMM yyyy, ', { locale: tr })}
                    {startTimeStr} - {endTimeStr} (TSİ)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-grow">
                <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Öğrenci:</strong> {childData?.firstName}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Öğretmen:</strong> {teacherData?.firstName} {teacherData?.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Paket:</strong> {lesson.packageCode === 'FREE_TRIAL' ? 'Ücretsiz Deneme' : packageDetails?.courseName}</span>
                </div>
            </CardContent>
            {isPast && lesson.feedback && (
                <>
                <Separator />
                <CardFooter className="flex-col items-start gap-2 pt-4">
                    <h4 className="font-semibold flex items-center gap-2 text-base"><MessageSquare className='w-5 h-5 text-primary'/> Öğretmen Geri Bildirimi:</h4>
                    <p className='text-sm text-muted-foreground'>{lesson.feedback.text}</p>
                </CardFooter>
                </>
            )}
        </Card>
    );
}


export default function DerslerimPage() {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();

    const bookedLessonsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'lesson-slots'), where('bookedBy', '==', user.uid));
    }, [user, db]);

    const { data: lessonSlots, isLoading: lessonsLoading } = useCollection(bookedLessonsQuery);

    const groupedLessons = useMemo(() => {
        if (!lessonSlots) return [];
        
        const sortedSlots = [...lessonSlots].sort((a, b) => a.startTime.seconds - b.startTime.seconds);
        
        const lessonsMap: { [key: string]: any } = {};

        sortedSlots.forEach(slot => {
            const key = `${slot.childId}-${slot.teacherId}-${formatInTimeZone(slot.startTime.toDate(), 'Europe/Istanbul', 'yyyy-MM-dd')}`;
            
            if (!lessonsMap[key]) {
                 lessonsMap[key] = [slot];
            } else {
                const lastSlot = lessonsMap[key][lessonsMap[key].length - 1];
                const expectedNextTime = addMinutes(lastSlot.startTime.toDate(), 5);
                if (slot.startTime.toDate().getTime() === expectedNextTime.getTime()) {
                    lessonsMap[key].push(slot);
                } else {
                     lessonsMap[`${key}-${slot.id}`] = [slot]; // Start a new group for the same day
                }
            }
        });
        
        return Object.values(lessonsMap).map(group => {
            const firstSlot = group[0];
            const packageDetails = getCourseDetailsFromPackageCode(firstSlot.packageCode);
            const duration = packageDetails?.duration || 30; // Default to 30 mins
            const calculatedEndTime = addMinutes(firstSlot.startTime.toDate(), duration);

            return {
                ...firstSlot,
                id: firstSlot.id,
                startTime: firstSlot.startTime.toDate(),
                endTime: calculatedEndTime,
                slots: group,
            };
        });

    }, [lessonSlots]);

    const { upcomingLessons, pastLessons } = useMemo(() => {
        if (!groupedLessons) return { upcomingLessons: [], pastLessons: [] };
        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];

        groupedLessons.forEach(lesson => {
            if (lesson.endTime > now) {
                upcoming.push(lesson);
            } else {
                past.push(lesson);
            }
        });

        // Sort both lists
        upcoming.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        past.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

        return { upcomingLessons: upcoming, pastLessons: past };
    }, [groupedLessons]);

    if (userLoading || lessonsLoading) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Derslerim</h2>
                    <p className="text-muted-foreground">Yaklaşan ve geçmiş derslerinizi görüntüleyin.</p>
                </div>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming">
                        <Calendar className="mr-2 h-4 w-4" />
                        Yaklaşan Dersler ({upcomingLessons.length})
                    </TabsTrigger>
                    <TabsTrigger value="past">
                        <History className="mr-2 h-4 w-4" />
                        Geçmiş Dersler ({pastLessons.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <Card>
                        <CardHeader>
                            <CardTitle>Yaklaşan Dersler</CardTitle>
                            <CardDescription>Planlanmış ve henüz gerçekleşmemiş dersleriniz.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcomingLessons.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {upcomingLessons.map(lesson => (
                                        <LessonCard key={lesson.id} lesson={lesson} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <p>Yaklaşan bir dersiniz bulunmuyor.</p>
                                    <Button variant="link" className="mt-2" onClick={() => router.push('/ebeveyn-portali/ders-planla')}>
                                        Hemen Ders Planla
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="past">
                    <Card>
                         <CardHeader>
                            <CardTitle>Geçmiş Dersler</CardTitle>
                            <CardDescription>Tamamlanmış olan tüm dersleriniz.</CardDescription>
                        </CardHeader>
                         <CardContent className="space-y-4">
                             {pastLessons.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {pastLessons.map(lesson => (
                                        <LessonCard key={lesson.id} lesson={lesson} />
                                    ))}
                                </div>
                            ) : (
                                 <div className="text-center py-10 text-muted-foreground">
                                    <p>Henüz tamamlanmış bir dersiniz yok.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
