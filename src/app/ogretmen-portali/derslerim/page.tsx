'use client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, doc, writeBatch, getDoc, serverTimestamp, increment } from 'firebase/firestore';
import { Loader2, Calendar, History, BookOpen, Baby, Edit, AlertCircle, Video, MessageCircle } from 'lucide-react';
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
import { LessonQuickChat } from '@/components/shared/lesson-quick-chat';
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

    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 10000);
        return () => clearInterval(timer);
    }, []);

    if (isChildLoading) {
        return <Card className="p-4 flex items-center justify-center min-h-[200px]"><Loader2 className="animate-spin text-primary" /></Card>;
    }

    const packageDetails = getCourseDetailsFromPackageCode(lesson.packageCode);
    const isPast = currentTime >= lesson.endTime;
    const isJoinable = lesson.isLive || currentTime >= new Date(lesson.startTime.getTime() - 5 * 60 * 1000);
    const needsFeedback = isPast && !lesson.feedback;

    const startTimeStr = formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });
    const endTimeStr = formatInTimeZone(lesson.endTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });

    return (
        <Card className={cn('flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-shadow', needsFeedback && 'border-destructive ring-1 ring-destructive')}>
            <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-start gap-2">
                    <span className="text-lg font-bold leading-tight">{packageDetails?.courseName || 'Ders'}</span>
                    <Badge variant={isPast ? "secondary" : "default"} className="shrink-0">{isPast ? 'Tamamlandı' : 'Sıradaki'}</Badge>
                </CardTitle>
                <CardDescription className="text-xs font-semibold">
                    {formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'dd MMMM yyyy, ', { locale: tr })}
                    {startTimeStr} - {endTimeStr}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs flex-grow pb-4">
                <div className="flex items-center gap-2">
                    <Baby className="w-3.5 h-3.5 text-primary" />
                    <span><strong>Öğrenci:</strong> {childData?.firstName || 'Yükleniyor...'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    <span><strong>Paket:</strong> {lesson.packageCode === 'FREE_TRIAL' ? 'Deneme Dersi' : packageDetails?.courseName}</span>
                </div>
                {needsFeedback && (
                    <div className="bg-destructive/10 text-destructive text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 mt-2 uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3" />
                        Geri Bildirim Bekliyor
                    </div>
                )}

                {!isPast && (
                    <div className="mt-4 pt-4 border-t">
                        <LessonQuickChat
                            lessonId={lesson.id}
                            teacherId={lesson.teacherId}
                            parentId={lesson.bookedBy}
                            userRole="teacher"
                        />
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-4 bg-slate-50/50">
                {!isPast ? (
                    <div className="w-full space-y-2">
                        <Button
                            onClick={() => onJoinLesson(lesson)}
                            className='w-full font-bold'
                            disabled={!isJoinable}
                            title={!isJoinable ? "Derse başlamak için ders saatine en fazla 5 dakika kalmış olmalıdır." : undefined}
                        >
                            <Video className='w-4 h-4 mr-2' />
                            {lesson.isLive ? 'Derse Gir' : 'Dersi Başlat'}
                        </Button>

                        {/* Teacher Cancellation Button */}
                        <TeacherCancellationModal lesson={lesson} childName={childData?.firstName || 'Öğrenci'} />
                    </div>
                ) : (
                    <Button onClick={onOpenProgressPanel} variant={needsFeedback ? "destructive" : "outline"} className='w-full font-bold'>
                        <Edit className='w-4 h-4 mr-2' />
                        {needsFeedback ? "Geri Bildirim Ekle" : "İlerlemeyi Gör"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

function TeacherCancellationModal({ lesson, childName }: { lesson: any, childName: string }) {
    const db = useFirestore();
    const { toast } = useToast();
    const [isCancelling, setIsCancelling] = useState(false);
    const [excuse, setExcuse] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleTeacherCancel = async () => {
        if (!excuse.trim()) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen iptal mazeretinizi belirtin.' });
            return;
        }

        setIsCancelling(true);
        try {
            const batch = writeBatch(db!);

            // 1. Mark slots as cancelled and save the excuse
            lesson.slots.forEach((slot: any) => {
                const slotRef = doc(db!, 'lesson-slots', slot.id);
                batch.update(slotRef, {
                    status: 'cancelled',
                    cancelledBy: 'teacher',
                    cancelReason: excuse,
                    updatedAt: serverTimestamp()
                });
            });

            // 2. Return credit to parent (including FREE_TRIAL)
            const childRef = doc(db!, 'users', lesson.bookedBy, 'children', lesson.childId);
            batch.update(childRef, {
                remainingLessons: increment(1)
            });

            await batch.commit();

            // 3. Email Notification to Parent
            const teacherSnap = await getDoc(doc(db!, 'users', lesson.teacherId)); // Use lesson.teacherId directly
            const teacherData = teacherSnap.exists() ? teacherSnap.data() : null;
            const parentDoc = await getDoc(doc(db!, 'users', lesson.bookedBy));
            const parentEmail = parentDoc.data()?.email;

            if (parentEmail) {
                const teacherFullName = (teacherData?.firstName && teacherData?.lastName) 
                    ? `${teacherData.firstName} ${teacherData.lastName}` 
                    : 'Eğitmen';

                fetch('/api/emails/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: parentEmail,
                        subject: 'Ders İptal Edildi (Öğretmen Mesajı İçerir)',
                        templateName: 'lesson-cancelled',
                        data: {
                            studentName: childName,
                            teacherName: teacherFullName,
                            date: formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'dd MMMM yyyy', { locale: tr }),
                            time: formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr }),
                            reason: excuse // Passing the excuse to the email template
                        }
                    })
                }).catch(console.error);
            }

            toast({ title: 'Ders İptal Edildi', description: 'Veliye mazeretiniz iletildi ve kredi iade edildi.' });
            setIsOpen(false);
        } catch (error) {
            console.error("Teacher cancel error:", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'İptal işlemi başarısız oldu.' });
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
                    Dersi İptal Et (Mazeretli)
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Ders İptali</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 font-medium pt-2">
                        {childName} ile olan bu dersi iptal etmek istediğinizden emin misiniz?
                        Veliye iletilecek geçerli bir mazeret girmelisiniz. Ders kredisi veliye iade edilecektir.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-6 space-y-3">
                    <Label className="font-bold text-slate-700 ml-1">İptal Mazeretiniz (Veli Görüntüleyecek)</Label>
                    <Textarea
                        placeholder="Örn: Teknik bir arıza nedeniyle dersi iptal etmek durumundayım..."
                        className="rounded-2xl border-slate-100 bg-slate-50 focus:bg-white min-h-[120px]"
                        value={excuse}
                        onChange={(e) => setExcuse(e.target.value)}
                    />
                </div>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="rounded-xl border-none bg-slate-100 hover:bg-slate-200 font-bold" disabled={isCancelling}>Vazgeç</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => { e.preventDefault(); handleTeacherCancel(); }}
                        className="rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white shadow-lg shadow-red-600/20"
                        disabled={isCancelling || !excuse.trim()}
                    >
                        {isCancelling ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                        İptal Et ve Bildir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
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
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <h2 className="text-3xl font-bold tracking-tight">Derslerim</h2>
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming"><Calendar className="mr-2 h-4 w-4" />Yaklaşan Dersler ({upcomingLessons.length})</TabsTrigger>
                    <TabsTrigger value="past"><History className="mr-2 h-4 w-4" />Geçmiş Dersler ({pastLessons.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="pt-4">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {upcomingLessons.map(lesson => (
                            <LessonCard key={lesson.id} lesson={lesson} onOpenProgressPanel={() => { setSelectedLesson(lesson); setIsProgressPanelOpen(true); }} onJoinLesson={handleJoinLesson} />
                        ))}
                    </div>
                    {upcomingLessons.length === 0 && (
                        <Card className="p-12">
                            <div className="text-center text-muted-foreground">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Yaklaşan dersiniz bulunmuyor.</p>
                            </div>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="past" className="pt-4">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {pastLessons.map(lesson => (
                            <LessonCard key={lesson.id} lesson={lesson} onOpenProgressPanel={() => { setSelectedLesson(lesson); setIsProgressPanelOpen(true); }} onJoinLesson={handleJoinLesson} />
                        ))}
                    </div>
                    {pastLessons.length === 0 && (
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
