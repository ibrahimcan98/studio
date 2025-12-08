

'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Loader2, Calendar, History, User, BookOpen, Baby, MessageSquare, Edit, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
import { addMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';
import { COURSES } from '@/data/courses';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { ProgressPanel } from '@/components/shared/progress-panel';
import { cn } from '@/lib/utils';

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
}

function LessonCard({ lesson, onOpenProgressPanel }: { lesson: any, onOpenProgressPanel: () => void }) {
    const db = useFirestore();

    const childDocRef = useMemoFirebase(() => {
        if (!db || !lesson.bookedBy || !lesson.childId) return null;
        return doc(db, 'users', lesson.bookedBy, 'children', lesson.childId);
    }, [db, lesson.bookedBy, lesson.childId]);

    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);

    if (isChildLoading) {
        return <Card className="p-4 flex items-center justify-center min-h-[200px]"><Loader2 className="animate-spin text-primary" /></Card>;
    }

    const packageDetails = getCourseDetailsFromPackageCode(lesson.packageCode);
    const isPast = new Date() > lesson.endTime;
    const needsFeedback = isPast && !lesson.feedback;

    const startTimeStr = formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });
    const endTimeStr = formatInTimeZone(lesson.endTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });

    return (
        <Card className={cn('flex flex-col', needsFeedback && 'border-destructive')}>
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span className="text-lg">{packageDetails?.courseName || 'Ders'}</span>
                    <Badge variant={isPast ? "outline" : "default"}>{isPast ? 'Tamamlandı' : 'Yaklaşıyor'}</Badge>
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
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Paket:</strong> {lesson.packageCode === 'FREE_TRIAL' ? 'Ücretsiz Deneme' : lesson.packageCode}</span>
                </div>
                {needsFeedback && (
                     <Badge variant="destructive" className="mt-2">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Geri Bildirim Bekliyor
                    </Badge>
                )}
            </CardContent>
            {isPast && (
                <>
                    <Separator />
                    <CardFooter className="flex-col items-start gap-3 pt-4">
                        <Button onClick={onOpenProgressPanel}>
                            <Edit className='w-4 h-4 mr-2'/> 
                            {needsFeedback ? "Geri Bildirim Ekle" : "İlerleme Panelini Görüntüle"}
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

export default function OgretmenDerslerimPage() {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
    const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false);

    const lessonsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid), where('status', '==', 'booked'));
    }, [user, db]);

    const { data: lessonSlots, isLoading: lessonsLoading } = useCollection(lessonsQuery);

    const childDocRef = useMemoFirebase(() => {
        if (!db || !selectedLesson?.bookedBy || !selectedLesson?.childId) return null;
        return doc(db, 'users', selectedLesson.bookedBy, 'children', selectedLesson.childId);
    }, [db, selectedLesson]);

    const { data: selectedChildData, isLoading: isChildDataLoading } = useDoc(childDocRef);

    const groupedLessons = useMemo(() => {
        if (!lessonSlots) return [];
        
        const sortedSlots = [...lessonSlots].sort((a, b) => a.startTime.seconds - b.startTime.seconds);
        
        const lessonsMap: { [key: string]: any } = {};

        sortedSlots.forEach(slot => {
            const key = `${slot.childId}-${formatInTimeZone(slot.startTime.toDate(), 'Europe/Istanbul', 'yyyy-MM-dd')}`;
            
            if (!lessonsMap[key]) {
                 lessonsMap[key] = [slot];
            } else {
                const lastSlot = lessonsMap[key][lessonsMap[key].length - 1];
                const expectedNextTime = addMinutes(lastSlot.startTime.toDate(), 5);
                if (slot.startTime.toDate().getTime() === expectedNextTime.getTime()) {
                    lessonsMap[key].push(slot);
                } else {
                     lessonsMap[`${key}-${slot.id}`] = [slot];
                }
            }
        });
        
        return Object.values(lessonsMap).map(group => {
            const firstSlot = group[0];
            const calculatedEndTime = addMinutes(firstSlot.startTime.toDate(), group.length * 5);

            // Find feedback from the last slot in the group, as it's the most likely place for it.
            const feedback = group[group.length - 1]?.feedback || null;

            return {
                ...firstSlot,
                id: firstSlot.id, 
                startTime: firstSlot.startTime.toDate(),
                endTime: calculatedEndTime,
                slots: group,
                feedback: feedback, // Add aggregated feedback to the lesson object
            };
        });
    }, [lessonSlots]);


    const { upcomingLessons, pastLessons } = useMemo(() => {
        if (!groupedLessons) return { upcomingLessons: [], pastLessons: [] };
        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];
        groupedLessons.forEach(lesson => {
            if (lesson.endTime > now) upcoming.push(lesson);
            else past.push(lesson);
        });
        upcoming.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        past.sort((a, b) => {
            const aNeedsFeedback = !a.feedback;
            const bNeedsFeedback = !b.feedback;
            if (aNeedsFeedback && !bNeedsFeedback) return -1;
            if (!aNeedsFeedback && bNeedsFeedback) return 1;
            return b.startTime.getTime() - a.startTime.getTime();
        });
        return { upcomingLessons: upcoming, pastLessons: past };
    }, [groupedLessons]);

    const handleOpenProgressPanel = (lesson: any) => {
        setSelectedLesson(lesson);
        setIsProgressPanelOpen(true);
    };

    if (userLoading || lessonsLoading) {
        return <div className="flex min-h-[calc(100vh-145px)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Derslerim</h2>
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming"><Calendar className="mr-2 h-4 w-4" />Yaklaşan Dersler ({upcomingLessons.length})</TabsTrigger>
                    <TabsTrigger value="past"><History className="mr-2 h-4 w-4" />Geçmiş Dersler ({pastLessons.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <Card>
                        <CardHeader><CardTitle>Yaklaşan Dersler</CardTitle></CardHeader>
                        <CardContent>
                            {upcomingLessons.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {upcomingLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} onOpenProgressPanel={() => handleOpenProgressPanel(lesson)} />)}
                                </div>
                            ) : <p className="text-muted-foreground">Yaklaşan dersiniz bulunmuyor.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="past">
                    <Card>
                        <CardHeader><CardTitle>Geçmiş Dersler</CardTitle></CardHeader>
                        <CardContent>
                             {pastLessons.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {pastLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} onOpenProgressPanel={() => handleOpenProgressPanel(lesson)} />)}
                                </div>
                            ) : <p className="text-muted-foreground">Henüz tamamlanmış bir dersiniz yok.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
             <Dialog open={isProgressPanelOpen} onOpenChange={setIsProgressPanelOpen}>
                <DialogContent className="max-w-5xl h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold font-headline">
                            {isChildDataLoading || !selectedChildData ? 'Yükleniyor...' : `${selectedChildData.firstName} İlerleme Paneli`}
                        </DialogTitle>
                        <DialogDescription>
                            {isChildDataLoading || !selectedChildData ? 'Öğrenci verileri yükleniyor...' : 'Çocuğunuzun Türkçe öğrenme yolculuğuna dair kapsamlı analiz ve raporlar.'}
                        </DialogDescription>
                    </DialogHeader>
                    {isChildDataLoading || !selectedChildData || !selectedLesson ? (
                         <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        </div>
                    ) : (
                        <ProgressPanel child={selectedChildData} lessonId={selectedLesson.id} isEditable={true} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}




