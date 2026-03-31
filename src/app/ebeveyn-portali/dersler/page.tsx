'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc, writeBatch, increment, getDocs, Timestamp, addDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Calendar, Clock, User, BookOpen, Baby, History, MessageSquare, Video, ClipboardList, AlertCircle } from 'lucide-react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

function CancellationButtons({ lesson, timeZone }: { lesson: any, timeZone: string }) {
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const now = new Date();
    const startTime = useMemo(() => {
        if (!lesson.startTime) return new Date();
        if (lesson.startTime instanceof Date) return lesson.startTime;
        if (lesson.startTime.toDate) return lesson.startTime.toDate();
        return new Date(lesson.startTime);
    }, [lesson.startTime]);

    const msDiff = startTime.getTime() - now.getTime();
    const hoursDiff = msDiff / (1000 * 60 * 60);

    const canCancel = hoursDiff >= 24;
    const canReschedule = hoursDiff >= 8;
    const rescheduleCount = lesson.rescheduleCount || 0;
    const hasReschedulingRight = rescheduleCount < 1;

        const handleCancel = async () => {
            if (!db || !lesson.bookedBy || !lesson.slots || lesson.slots.length === 0) return;
            setIsProcessing(true);
            try {
                const batch = writeBatch(db);

                // Instead of a query that needs an index, use the slots we already have
                lesson.slots.forEach((slot: any) => {
                    const slotRef = doc(db, 'lesson-slots', slot.id);
                    batch.update(slotRef, {
                        status: 'available',
                        bookedBy: null,
                        childId: null,
                        packageCode: null,
                        isLive: null,
                        liveLessonUrl: null,
                        whatsappReminderSent: null
                    });
                });

                const childDocRef = doc(db, 'users', lesson.bookedBy, 'children', lesson.childId);
                if (lesson.packageCode !== 'FREE_TRIAL') {
                    batch.update(childDocRef, { remainingLessons: increment(1) });
                }

                await batch.commit();

                // Store in Activity Log
                addDoc(collection(db, 'activity-log'), {
                    event: '❌ Ders İptal Edildi',
                    icon: '❌',
                    details: {
                        'Öğrenci': lesson.childName || '-',
                        'Ders Saati': startTime.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
                        'Ders Türü': lesson.packageCode || '-',
                    },
                    createdAt: Timestamp.fromDate(new Date())
                }).catch(console.error);

                toast({ title: 'Ders İptal Edildi', description: 'Ders krediniz iade edildi.', className: 'bg-green-500 text-white' });
                router.push(`/ebeveyn-portali?cancelled=true&childId=${lesson.childId}`);
            } catch (error) {
                console.error('Cancellation error:', error);
                toast({ variant: 'destructive', title: 'Hata', description: 'İptal işlemi başarısız oldu.' });
            } finally {
                setIsProcessing(false);
            }
        };

    const handleReschedule = () => {
        const slotIds = lesson.slots ? lesson.slots.map((s: any) => s.id).join(',') : lesson.id;
        router.push(`/ebeveyn-portali/ders-planla?rescheduleId=${lesson.id}&slotIds=${slotIds}`);
    };

    if (hoursDiff < 8) {
        return (
            <div className="w-full p-2 bg-slate-50 rounded-lg border border-dashed text-[10px] text-center font-bold text-slate-400 uppercase tracking-wider">
                Derse 8 saatten az kaldığı için işlem yapılamaz.
            </div>
        );
    }

    return (
        <div className="flex gap-2 w-full mt-2">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button 
                        variant="outline" 
                        disabled={!canCancel}
                        className={cn(
                            "flex-1 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold h-9 text-xs",
                            !canCancel && "opacity-50 cursor-not-allowed border-slate-100 text-slate-400"
                        )}
                    >
                        İptal Et
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Dersinizi İptal Etmek İstiyor Musunuz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Derse 24 saatten fazla süre olduğu için bu işlem **ücretsizdir**. 
                            İptal ettiğinizde 1 ders hakkınız hesabınıza iade edilecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleCancel}
                            disabled={isProcessing}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                        >
                            {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : 'Evet, İptal Et'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Button 
                variant="outline" 
                onClick={handleReschedule}
                disabled={!hasReschedulingRight}
                className="flex-1 border-primary/20 text-primary hover:bg-primary/5 font-bold h-9 text-xs"
            >
                {hasReschedulingRight ? 'Dersi Değiştir' : 'Değiştirme Hakkı Doldu'}
            </Button>
        </div>
    );
}

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
                    <div className="w-full space-y-3">
                        <Button onClick={handleJoinLesson} disabled={!canJoin} className={cn("w-full font-bold h-11", canJoin && "bg-red-600 hover:bg-red-700")}>
                            <Video className="w-4 h-4 mr-2" />
                            {canJoin ? 'Derse Katıl' : 'Ders Zamanı Gelmedi'}
                        </Button>
                        <CancellationButtons lesson={{ ...lesson, childName: childData?.firstName }} timeZone={timeZone} />
                    </div>
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
        if (!user || !user.uid || !db) return null;
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

        const parseDate = (val: any) => {
            if (!val) return new Date();
            if (val.toDate) return val.toDate();
            if (val instanceof Date) return val;
            const d = new Date(val);
            return isNaN(d.getTime()) ? new Date() : d;
        };

        const sessions: { [key: string]: any[] } = {};

        // Only process booked or cancelled lessons
        const relevantSlots = lessonSlots.filter(s => s.status && s.status !== 'available');

        relevantSlots.forEach(slot => {
            const startTime = parseDate(slot.startTime);
            const sessionDate = startOfDay(startTime).toISOString();
            const sessionKey = `${sessionDate}-${slot.childId || 'nochild'}-${slot.teacherId || 'noteacher'}-${slot.packageCode || 'nopackage'}`;

            if (!sessions[sessionKey]) {
                sessions[sessionKey] = [];
            }
            sessions[sessionKey].push(slot);
        });
        
        return Object.values(sessions).flatMap(sessionSlots => {
            if (sessionSlots.length === 0) return [];

            sessionSlots.sort((a, b) => {
                const timeA = parseDate(a.startTime).getTime();
                const timeB = parseDate(b.startTime).getTime();
                return timeA - timeB;
            });

            const lessons: any[] = [];
            let currentLesson: any = null;

            for (const slot of sessionSlots) {
                if (!currentLesson) {
                    currentLesson = { ...slot, slots: [slot] };
                } else {
                    const lastSlotTime = parseDate(currentLesson.slots[currentLesson.slots.length - 1].startTime);
                    const currentSlotTime = parseDate(slot.startTime);
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
                const startTime = parseDate(firstSlot.startTime);
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
                    liveLessonUrl: liveInfoSlot ? liveInfoSlot.liveLessonUrl : null,
                    rescheduleCount: firstSlot.rescheduleCount || 0,
                    slots: lesson.slots
                };
            });
        });

    }, [lessonSlots]);
    
    
    const { upcomingLessons, pastLessons, cancelledLessons } = useMemo(() => {
        if (!groupedLessons) return { upcomingLessons: [], pastLessons: [], cancelledLessons: [] };
        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];
        const cancelled: any[] = [];

        groupedLessons.forEach(lesson => {
            const isCancelled = lesson.slots.some((s: any) => s.status === 'cancelled');

            if (isCancelled) {
                cancelled.push(lesson);
            } else if (isBefore(now, lesson.endTime)) {
                upcoming.push(lesson);
            } else {
                past.push(lesson);
            }
        });

        upcoming.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        past.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
        cancelled.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

        return { upcomingLessons: upcoming, pastLessons: past, cancelledLessons: cancelled };
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
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Derslerim</h2>
                    <p className="text-muted-foreground font-medium">Yaklaşan ve geçmiş derslerinizi görüntüleyin.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming" className="font-bold">
                        <Calendar className="mr-2 h-4 w-4" />
                        Yaklaşan ({upcomingLessons.length})
                    </TabsTrigger>
                    <TabsTrigger value="past" className="font-bold">
                        <History className="mr-2 h-4 w-4" />
                        Geçmiş ({pastLessons.length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="font-bold text-red-500 data-[state=active]:text-red-600">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        İptal Edilenler ({cancelledLessons.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="pt-4">
                    {upcomingLessons.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {upcomingLessons.map(lesson => (
                                <LessonCard key={lesson.id} lesson={lesson} timeZone={timeZone} onShowProgress={() => handleShowProgress(lesson)} />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 border-dashed border-2 bg-transparent">
                            <div className="text-center text-muted-foreground">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20 text-primary" />
                                <p className="text-lg font-bold text-slate-600">Yaklaşan bir dersiniz bulunmuyor.</p>
                                <Button className="mt-6 font-black rounded-xl px-8" onClick={() => router.push('/ebeveyn-portali/ders-planla')}>
                                    HEMEN DERS PLANLA
                                </Button>
                            </div>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="past" className="pt-4">
                     {pastLessons.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {pastLessons.map(lesson => (
                                <LessonCard key={lesson.id} lesson={lesson} timeZone={timeZone} onShowProgress={() => handleShowProgress(lesson)} />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 border-dashed border-2 bg-transparent">
                             <div className="text-center text-muted-foreground">
                                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-bold text-slate-600">Henüz tamamlanmış bir dersiniz yok.</p>
                            </div>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="cancelled" className="pt-4">
                    {cancelledLessons.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {cancelledLessons.map(lesson => {
                                const firstSlot = lesson.slots[0];
                                return (
                                    <div key={lesson.id} className="relative group">
                                        <LessonCard lesson={lesson} timeZone={timeZone} onShowProgress={() => {}} />
                                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 pointer-events-none">
                                             <Badge variant="destructive" className="shadow-sm">İptal Edildi</Badge>
                                        </div>
                                        {firstSlot.cancelReason && (
                                            <div className="absolute inset-x-4 bottom-2 bg-red-50/90 backdrop-blur-sm p-3 rounded-xl border border-red-100 shadow-sm transition-all group-hover:bottom-4">
                                                <p className="text-[10px] font-black text-red-800 uppercase tracking-widest leading-none mb-1">Öğretmen Mazereti:</p>
                                                <p className="text-xs italic text-red-700 font-medium line-clamp-2">"${firstSlot.cancelReason}"</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <Card className="p-12 border-dashed border-2 bg-transparent text-center">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20 text-red-500" />
                            <p className="text-lg font-bold text-slate-600">İptal edilen bir dersiniz bulunmuyor.</p>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
             <Dialog open={isProgressPanelOpen} onOpenChange={setIsProgressPanelOpen}>
                <DialogContent className="max-w-5xl h-[90vh] rounded-3xl overflow-hidden p-0">
                    <div className="p-6 pb-0">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black font-headline text-slate-800">
                                {isChildDataLoading || !selectedChildData ? 'Yükleniyor...' : `${selectedChildData.firstName} İlerleme Paneli`}
                            </DialogTitle>
                            <DialogDescription className="font-medium text-slate-500">
                                {isChildDataLoading || !selectedChildData ? 'Öğrenci verileri yükleniyor...' : `Bu ders için öğretmen geri bildirimini ve öğrencinin genel gelişimini görün.`}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {isChildDataLoading || !selectedChildData || !selectedLesson ? (
                            <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
                        ) : (
                            <ProgressPanel child={selectedChildData} lessonId={selectedLesson.id} isEditable={false} />
                        )}
                    </div>
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
