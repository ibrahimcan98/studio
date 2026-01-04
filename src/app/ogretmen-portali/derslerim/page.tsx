
'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, doc, writeBatch, getDoc } from 'firebase/firestore';
import { Loader2, Calendar, History, BookOpen, Baby, Edit, AlertCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { addMinutes, startOfDay, isBefore } from 'date-fns';
import { COURSES } from '@/data/courses';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { ProgressPanel } from '@/components/shared/progress-panel';
import { cn } from '@/lib/utils';

const getCourseDetailsFromPackageCode = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: 30 };
    
    const courseCodeMap: { [key: string]: string } = { 
        'B': 'baslangic', 
        'K': 'konusma', 
        'G': 'gelisim', 
        'A': 'akademik',
        'GCSE': 'gcse'
    };
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '') as keyof typeof courseCodeMap];
    const course = COURSES.find(c => c.id === courseId);
    
    if (!course) return null;

    let duration = 30;
    if (course.id === 'baslangic') duration = 20;
    if (course.id === 'konusma') duration = 30;
    if (course.id === 'gelisim' || course.id === 'akademik') duration = 45;
    if (course.id === 'gcse') duration = 50;

    return { courseName: course.title, duration };
}

function LessonCard({ lesson, onOpenProgressPanel, onJoinLesson }: { lesson: any, onOpenProgressPanel: () => void, onJoinLesson: (lesson: any) => void }) {
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
    const isPast = new Date() >= lesson.endTime;
    const needsFeedback = isPast && !lesson.feedback;

    const startTimeStr = formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });
    const endTimeStr = formatInTimeZone(lesson.endTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });

    return (
        <Card className={cn('flex flex-col h-full', needsFeedback && 'border-destructive ring-1 ring-destructive')}>
            <CardHeader>
                <CardTitle className="flex justify-between items-start gap-2">
                    <span className="text-lg font-bold leading-tight">{packageDetails?.courseName || 'Ders'}</span>
                    <Badge variant={isPast ? "secondary" : "default"} className="shrink-0">{isPast ? 'Tamamlandı' : 'Sıradaki'}</Badge>
                </CardTitle>
                <CardDescription className="font-medium">
                    {formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'dd MMMM yyyy, ', { locale: tr })}
                    {startTimeStr} - {endTimeStr}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-grow">
                <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-primary" />
                    <span><strong>Öğrenci:</strong> {childData?.firstName || 'Yükleniyor...'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Paket:</strong> {lesson.packageCode === 'FREE_TRIAL' ? 'Deneme Dersi' : packageDetails?.courseName}</span>
                </div>
                {needsFeedback && (
                     <div className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded flex items-center gap-1 mt-2">
                        <AlertCircle className="w-3 h-3" />
                        GERİ BİLDİRİM BEKLİYOR
                    </div>
                )}
            </CardContent>
             <CardFooter className="flex flex-col items-start gap-2 pt-4">
                {!isPast ? (
                    <Button onClick={() => onJoinLesson(lesson)} className='w-full'>
                         <Video className='w-4 h-4 mr-2'/>
                        {lesson.isLive ? 'Derse Gir' : 'Dersi Başlat'}
                    </Button>
                ) : (
                    <Button onClick={onOpenProgressPanel} variant={needsFeedback ? "destructive" : "outline"} className='w-full'>
                        <Edit className='w-4 h-4 mr-2'/> 
                        {needsFeedback ? "Geri Bildirim Ekle" : "İlerlemeyi Gör"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

function OgretmenDerslerimPageContent() {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
    const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false);
    const [isStartingLesson, setIsStartingLesson] = useState(false);

    const lessonsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid), where('status', '==', 'booked'));
    }, [user, db]);

    const { data: lessonSlots, isLoading: lessonsLoading } = useCollection(lessonsQuery);

    const teacherDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);
    const { data: teacherData, isLoading: teacherLoading } = useDoc(teacherDocRef);


    const childDocRef = useMemoFirebase(() => {
        if (!db || !selectedLesson?.bookedBy || !selectedLesson?.childId) return null;
        return doc(db, 'users', selectedLesson.bookedBy, 'children', selectedLesson.childId);
    }, [db, selectedLesson]);

    const { data: selectedChildData, isLoading: isChildDataLoading } = useDoc(childDocRef);

    const groupedLessons = useMemo(() => {
        if (!lessonSlots) return [];
        const sessions: { [key: string]: any[] } = {};
        lessonSlots.forEach(slot => {
            const startTime = slot.startTime.toDate();
            const sessionDate = startOfDay(startTime).toISOString();
            const sessionKey = `${sessionDate}-${slot.childId}-${slot.teacherId}-${slot.packageCode}`;
            if (!sessions[sessionKey]) sessions[sessionKey] = [];
            sessions[sessionKey].push(slot);
        });
        
        return Object.values(sessions).flatMap(sessionSlots => {
            if (sessionSlots.length === 0) return [];
            sessionSlots.sort((a, b) => a.startTime.seconds - b.startTime.seconds);
            const lessons: any[] = [];
            let currentLesson: any = null;
            for (const slot of sessionSlots) {
                if (!currentLesson) {
                    currentLesson = { ...slot, slots: [slot] };
                } else {
                    const lastSlotTime = currentLesson.slots[currentLesson.slots.length - 1].startTime.toDate();
                    const currentSlotTime = slot.startTime.toDate();
                    const timeDiff = (currentSlotTime.getTime() - lastSlotTime.getTime()) / (1000 * 60);
                    if (timeDiff <= 5) currentLesson.slots.push(slot);
                    else {
                        lessons.push(currentLesson);
                        currentLesson = { ...slot, slots: [slot] };
                    }
                }
            }
            if (currentLesson) lessons.push(currentLesson);
            
            return lessons.map(lesson => {
                const firstSlot = lesson.slots[0];
                const startTime = firstSlot.startTime.toDate();
                const packageDetails = getCourseDetailsFromPackageCode(firstSlot.packageCode);
                const duration = packageDetails ? packageDetails.duration : 30;
                const endTime = addMinutes(startTime, duration);
                const liveInfoSlot = lesson.slots.find((s: any) => s.isLive);
                const feedbackSlot = lesson.slots.find((s: any) => s.feedback);
                return {
                    id: firstSlot.id,
                    startTime: startTime,
                    endTime: endTime,
                    childId: firstSlot.childId,
                    teacherId: firstSlot.teacherId,
                    bookedBy: firstSlot.bookedBy,
                    packageCode: firstSlot.packageCode,
                    feedback: feedbackSlot ? feedbackSlot.feedback : null,
                    slots: lesson.slots,
                    isLive: liveInfoSlot ? liveInfoSlot.isLive : false,
                    liveLessonUrl: liveInfoSlot ? liveInfoSlot.liveLessonUrl : null,
                };
            });
        });
    }, [lessonSlots]);

    const { upcomingLessons, pastLessons } = useMemo(() => {
        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];
        groupedLessons.forEach(lesson => {
            if (isBefore(now, lesson.endTime)) { // Use isBefore for better date comparison
                upcoming.push(lesson);
            } else {
                past.push(lesson);
            }
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

    const handleJoinLesson = async (lesson: any) => {
        try {
            if (!teacherData?.googleMeetLink) {
                 toast({
                    variant: 'destructive',
                    title: 'Google Meet Linki Eksik',
                    description: 'Lütfen profil sayfanızdan Google Meet linkinizi ekleyin.',
                });
                router.push('/ogretmen-portali/profil');
                return;
            }

            if (lesson.isLive && lesson.liveLessonUrl) {
                window.open(lesson.liveLessonUrl, '_blank');
                return;
            }
            
            if (!db || isStartingLesson) return;
            setIsStartingLesson(true);

            const liveLessonUrl = teacherData.googleMeetLink;
            const batch = writeBatch(db);

            lesson.slots.forEach((slot: any) => {
                const slotRef = doc(db, 'lesson-slots', slot.id);
                batch.update(slotRef, {
                    isLive: true,
                    liveLessonUrl: liveLessonUrl
                });
            });

            await batch.commit();
            toast({
                title: 'Ders Başlatıldı!',
                description: 'Öğrenciniz artık derse katılabilir. Google Meet linki açılıyor...',
            });
            window.open(liveLessonUrl, '_blank');
        } catch (error) {
            console.error("Ders başlatma hatası:", error);
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Ders başlatılamadı. Lütfen tekrar deneyin.',
            });
        } finally {
            setIsStartingLesson(false);
        }
    };

    if (userLoading || lessonsLoading || teacherLoading) {
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
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                        {upcomingLessons.map(lesson => (
                            <LessonCard key={lesson.id} lesson={lesson} onOpenProgressPanel={() => { setSelectedLesson(lesson); setIsProgressPanelOpen(true); }} onJoinLesson={handleJoinLesson} />
                        ))}
                    </div>
                    {upcomingLessons.length === 0 && <p className="text-muted-foreground mt-4 text-center py-8">Yaklaşan dersiniz bulunmuyor.</p>}
                </TabsContent>
                <TabsContent value="past">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                        {pastLessons.map(lesson => (
                            <LessonCard key={lesson.id} lesson={lesson} onOpenProgressPanel={() => { setSelectedLesson(lesson); setIsProgressPanelOpen(true); }} onJoinLesson={handleJoinLesson} />
                        ))}
                    </div>
                    {pastLessons.length === 0 && <p className="text-muted-foreground mt-4 text-center py-8">Henüz tamamlanmış bir dersiniz yok.</p>}
                </TabsContent>
            </Tabs>

             <Dialog open={isProgressPanelOpen} onOpenChange={setIsProgressPanelOpen}>
                <DialogContent className="max-w-5xl h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold font-headline">
                            {isChildDataLoading || !selectedChildData ? 'Yükleniyor...' : `${selectedChildData.firstName} İlerleme Paneli`}
                        </DialogTitle>
                        <DialogDescription>Çocuğun ilerlemesini izleyin ve geri bildirim verin.</DialogDescription>
                    </DialogHeader>
                    {isChildDataLoading || !selectedChildData || !selectedLesson ? (
                         <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
                    ) : (
                        <ProgressPanel child={selectedChildData} lessonId={selectedLesson.id} isEditable={true} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function OgretmenDerslerimPage() {
    return (
        <Suspense fallback={<div className="flex min-h-[calc(100vh-145px)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
            <OgretmenDerslerimPageContent />
        </Suspense>
    );
}
