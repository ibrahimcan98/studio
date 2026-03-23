
'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Calendar, Clock, User, BookOpen, Baby, History, MessageSquare, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { addMinutes, startOfDay, isBefore } from 'date-fns';
import { COURSES } from '@/data/courses';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ProgressPanel } from '@/components/shared/progress-panel';
import { LessonQuickChat } from '@/components/shared/lesson-quick-chat';

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

    let duration = 30; // Default
    if (course.id === 'baslangic') duration = 20;
    if (course.id === 'konusma') duration = 30;
    if (course.id === 'gelisim' || course.id === 'akademik') duration = 45;
    if (course.id === 'gcse') duration = 50;

    return { courseName: course.title, duration };
};

// Static teacher list to ensure names are always available
const teachers = [
    { id: 'O2mQCONyczVkAXcgAMBSPpeIfJw2', firstName: 'Tuba', lastName: 'Kodak' },
];


function LessonCard({ lesson, timeZone, onShowProgress }: { lesson: any, timeZone: string, onShowProgress: () => void }) {
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const childDocRef = useMemoFirebase(() => {
        if (!db || !lesson.bookedBy || !lesson.childId) return null;
        return doc(db, 'users', lesson.bookedBy, 'children', lesson.childId);
    }, [db, lesson.bookedBy, lesson.childId]);

    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);
    
    const teacher = useMemo(() => teachers.find(t => t.id === lesson.teacherId), [lesson.teacherId]);

    const handleJoinLesson = () => {
        if (lesson.isLive && lesson.liveLessonUrl) {
            window.open(lesson.liveLessonUrl, '_blank');
        } else {
             toast({
                variant: "destructive",
                title: "Ders Henüz Başlamadı",
                description: "Öğretmeniniz dersi başlattığında bu buton sizi derse yönlendirecektir.",
            });
        }
    };


    if (isChildLoading) {
        return (
            <Card className="p-4 flex items-center justify-center min-h-[220px]">
                <Loader2 className="animate-spin text-primary" />
            </Card>
        );
    }

    const isPast = isBefore(lesson.endTime, new Date());
    const startTimeStr = formatInTimeZone(lesson.startTime, timeZone, 'HH:mm', { locale: tr });
    const endTimeStr = formatInTimeZone(lesson.endTime, timeZone, 'HH:mm', { locale: tr });
    const packageDetails = getCourseDetailsFromPackageCode(lesson.packageCode);
    const canJoin = lesson.isLive && !isPast;


    return (
        <Card className='flex flex-col h-full bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
            <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-start gap-2">
                    <span className="text-lg font-bold leading-tight">
                        {formatInTimeZone(lesson.startTime, timeZone, 'dd MMMM yyyy', { locale: tr })} | {startTimeStr} - {endTimeStr}
                    </span>
                     <Badge variant={isPast ? "outline" : "default"} className={cn(isPast ? "" : "bg-green-100 text-green-800 shrink-0", lesson.isLive && !isPast && "bg-red-500 text-white animate-pulse")}>
                        {isPast ? 'Tamamlandı' : (lesson.isLive ? 'Canlı Yayında' : 'Yaklaşıyor')}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs flex-grow pb-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Baby className="w-3.5 h-3.5 text-primary" />
                    <span><strong className="text-slate-700">Öğrenci:</strong> {childData?.firstName}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span><strong className="text-slate-700">Öğretmen:</strong> {teacher?.firstName} {teacher?.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span><strong className="text-slate-700">Kurs:</strong> {lesson.packageCode === 'FREE_TRIAL' ? 'Ücretsiz Deneme' : packageDetails?.courseName}</span>
                </div>

                {!isPast && (
                    <div className="mt-4 pt-4 border-t">
                        <LessonQuickChat 
                            lessonId={lesson.id}
                            teacherId={lesson.teacherId}
                            parentId={lesson.bookedBy}
                            userRole="parent"
                        />
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-3 pt-4 bg-slate-50/50 mt-auto">
                 {!isPast && (
                    <Button onClick={handleJoinLesson} disabled={!canJoin} className={cn("w-full font-bold", canJoin && "bg-red-600 hover:bg-red-700")}>
                        <Video className="w-4 h-4 mr-2" />
                        {canJoin ? 'Derse Katıl' : 'Ders Zamanı Gelmedi'}
                    </Button>
                )}
                {isPast && lesson.feedback && (
                    <Button variant="outline" className="w-full font-bold" onClick={onShowProgress}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Geri Bildirimi Gör
                    </Button>
                )}
                {isPast && !lesson.feedback && (
                    <Button variant="outline" className="w-full font-bold opacity-70" disabled>
                        <Clock className="w-4 h-4 mr-2" />
                        Gelişim Raporu Bekleniyor
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

function DerslerimPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
    const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false);
    const [timeZone, setTimeZone] = useState('');


    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'past') {
            setActiveTab('past');
        } else {
            setActiveTab('upcoming');
        }
    }, [searchParams]);

    const { user, loading: userLoading } = useUser();
    const db = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

    useEffect(() => {
        if (userData?.timezone) {
            setTimeZone(userData.timezone);
        } else {
            setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
    }, [userData]);


    const bookedLessonsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'lesson-slots'), where('bookedBy', '==', user.uid));
    }, [user, db]);

    const { data: lessonSlots, isLoading: lessonsLoading } = useCollection(bookedLessonsQuery);
    
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

            if (!sessions[sessionKey]) {
                sessions[sessionKey] = [];
            }
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

                    if (timeDiff <= 5) { // If slots are 5 minutes apart or less, group them
                        currentLesson.slots.push(slot);
                    } else {
                        lessons.push(currentLesson);
                        currentLesson = { ...slot, slots: [slot] };
                    }
                }
            }
            if (currentLesson) {
                lessons.push(currentLesson);
            }
            
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
                    isLive: liveInfoSlot ? liveInfoSlot.isLive : false,
                    liveLessonUrl: liveInfoSlot ? liveInfoSlot.liveLessonUrl : null
                };
            });
        });

    }, [lessonSlots]);
    
    
    const { upcomingLessons, pastLessons } = useMemo(() => {
        if (!groupedLessons) return { upcomingLessons: [], pastLessons: [] };
        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];

        groupedLessons.forEach(lesson => {
            if (isBefore(now, lesson.endTime)) {
                upcoming.push(lesson);
            } else {
                past.push(lesson);
            }
        });

        upcoming.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        past.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

        return { upcomingLessons: upcoming, pastLessons: past };
    }, [groupedLessons]);

    if (userLoading || lessonsLoading || isUserLoading || !timeZone) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    const handleShowProgress = (lesson: any) => {
        setSelectedLesson(lesson);
        setIsProgressPanelOpen(true);
    };

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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                <TabsContent value="upcoming" className="pt-4">
                    {upcomingLessons.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {upcomingLessons.map(lesson => (
                                <LessonCard key={lesson.id} lesson={lesson} timeZone={timeZone} onShowProgress={() => handleShowProgress(lesson)} />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12">
                            <div className="text-center text-muted-foreground">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Yaklaşan bir dersiniz bulunmuyor.</p>
                                <Button className="mt-4 font-bold" onClick={() => router.push('/ebeveyn-portali/ders-planla')}>
                                    Hemen Ders Planla
                                </Button>
                            </div>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="past" className="pt-4">
                     {pastLessons.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {pastLessons.map(lesson => (
                                <LessonCard key={lesson.id} lesson={lesson} timeZone={timeZone} onShowProgress={() => handleShowProgress(lesson)} />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12">
                             <div className="text-center text-muted-foreground">
                                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Henüz tamamlanmış bir dersiniz yok.</p>
                            </div>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
             <Dialog open={isProgressPanelOpen} onOpenChange={setIsProgressPanelOpen}>
                <DialogContent className="max-w-5xl h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold font-headline">
                             {isChildDataLoading || !selectedChildData ? 'Yükleniyor...' : `${selectedChildData.firstName} İlerleme Paneli`}
                        </DialogTitle>
                         <DialogDescription>
                            {isChildDataLoading || !selectedChildData ? 'Öğrenci verileri yükleniyor...' : `Bu ders için öğretmen geri bildirimini ve öğrencinin genel gelişimini görün.`}
                        </DialogDescription>
                    </DialogHeader>
                     {isChildDataLoading || !selectedChildData || !selectedLesson ? (
                         <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
                    ) : (
                        <ProgressPanel child={selectedChildData} lessonId={selectedLesson.id} isEditable={false} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export const dynamic = 'force-dynamic';

export default function DerslerimPage() {
    return (
        <Suspense fallback={<div className="flex min-h-[calc(100vh-80px)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
            <DerslerimPageContent />
        </Suspense>
    );
}
