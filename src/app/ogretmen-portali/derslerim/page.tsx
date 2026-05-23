'use client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, doc, writeBatch, getDoc, serverTimestamp, increment, arrayUnion, addDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Calendar, History, BookOpen, Baby, Edit, AlertCircle, Video, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { addMinutes, startOfDay, isBefore } from 'date-fns';
import { COURSES } from '@/data/courses';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
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
import { sendLessonCancelledEmails } from '@/lib/email-service';

const getCourseDetailsFromPackageCode = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: 30 };
    if (code.startsWith('GIFT')) return { courseName: 'Hediye Ders', duration: 30 };

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

function StudentName({ bookedBy, childId }: { bookedBy: string, childId: string }) {
    const db = useFirestore();
    const childDocRef = useMemoFirebase(() => {
        if (!db || !bookedBy || !childId) return null;
        return doc(db, 'users', bookedBy, 'children', childId);
    }, [db, bookedBy, childId]);
    const { data: childData } = useDoc(childDocRef);
    return <span>{childData?.firstName || '...'}</span>;
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
                    <span className="text-lg font-bold leading-tight">{lesson.courseName || packageDetails?.courseName || 'Ders'}</span>
                    <Badge variant={isPast ? "secondary" : "default"} className="shrink-0">{isPast ? 'Tamamlandı' : 'Sıradaki'}</Badge>
                </CardTitle>
                <CardDescription className="text-xs font-semibold">
                    {formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'dd MMMM yyyy, ', { locale: tr })}
                    {startTimeStr} - {endTimeStr}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs flex-grow pb-4">
                <div className="flex items-center gap-2">
                    {lesson.isGroupSession ? <Users className="w-3.5 h-3.5 text-purple-600" /> : <Baby className="w-3.5 h-3.5 text-primary" />}
                    <span><strong>{lesson.isGroupSession ? 'Sınıf' : 'Öğrenci'}:</strong> {lesson.isGroupSession ? 'Grup Dersi Sınıfı' : (childData?.firstName || 'Yükleniyor...')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    <span><strong>Paket:</strong> {lesson.packageCode === 'FREE_TRIAL' ? 'Deneme Dersi' : (lesson.courseName || packageDetails?.courseName)}</span>
                </div>
                {needsFeedback && (
                    <div className="bg-destructive/10 text-destructive text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 mt-2 uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3" />
                        Geri Bildirim Bekliyor
                    </div>
                )}

                {!isPast && !lesson.isGroupSession && (
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

                        {/* Teacher Cancellation Button (Only for 1-on-1) */}
                        {!lesson.isGroupSession && (
                            <TeacherCancellationModal lesson={lesson} childName={childData?.firstName || 'Öğrenci'} />
                        )}
                        {lesson.isGroupSession && (
                             <div className="text-center w-full mt-2">
                                <span className="text-[10px] text-purple-600 font-bold uppercase tracking-widest bg-purple-50 px-2 py-1 rounded-full">Grup Dersleri İptal Edilemez</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <Button onClick={onOpenProgressPanel} variant={needsFeedback ? "destructive" : "outline"} className='w-full font-bold' disabled={lesson.isGroupSession}>
                        <Edit className='w-4 h-4 mr-2' />
                        {lesson.isGroupSession ? "Grup Dersi Geri Bildirimi (Yakında)" : (needsFeedback ? "Geri Bildirim Ekle" : "İlerlemeyi Gör")}
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

    const getRefundPackageCode = (originalCode: string) => {
        if (originalCode === 'FREE_TRIAL') return 'FREE_TRIAL';
        // Remove numbers and add '1'
        const prefix = originalCode.replace(/[0-9]/g, '');
        return `${prefix}1`;
    };

    const handleTeacherCancel = async () => {
        if (!excuse.trim()) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen iptal mazeretinizi belirtin.' });
            return;
        }

        setIsCancelling(true);
        try {
            const parentDoc = await getDoc(doc(db!, 'users', lesson.bookedBy));
            const parentData = parentDoc.data();
            const parentEmail = parentData?.email;
            const parentTimezone = parentData?.timezone || 'Europe/Istanbul';

            const response = await fetch('/api/lessons/teacher-cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slots: lesson.slots.map((s: any) => ({ id: s.id })),
                    parentId: lesson.bookedBy,
                    childId: lesson.childId,
                    packageCode: lesson.packageCode,
                    teacherId: lesson.teacherId,
                    cancelReason: excuse,
                    studentName: childName,
                    startTime: formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'dd MMMM yyyy HH:mm', { locale: tr }),
                    parentEmail: parentEmail
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'İptal işlemi başarısız oldu.');
            }

            const data = await response.json();

            // ─── E-posta Bildirimleri (Merkezi Servis) ───────────────
            // Öğretmen adını ogretmen-portali'de user'dan alabilmek için
            // TeacherCancellationModal lesson.teacherId ile çalışıyor;
            // teacherFullName server'dan dönüyor (data.teacherFullName)
            sendLessonCancelledEmails({
                studentName: childName,
                teacherName: data.teacherFullName || 'Eğitmen',
                teacherFirestoreEmail: undefined, // Öğretmen kendi iptali yapıyor, kendine mail gitmez
                parentEmail: parentEmail || undefined,
                date: formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'dd MMMM yyyy', { locale: tr }),
                time: formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr }),
                parentDate: formatInTimeZone(lesson.startTime, parentTimezone, 'dd MMMM yyyy', { locale: tr }),
                parentTime: formatInTimeZone(lesson.startTime, parentTimezone, 'HH:mm', { locale: tr }),
                isTrial: lesson.packageCode === 'FREE_TRIAL',
                reason: excuse,
            }).catch(console.error);

            const toastDesc = data.refundTarget === 'parent_pool' 
                ? 'İade velinin atanmamış kurslarına (havuza) aktarıldı.' 
                : (data.refundTarget === 'free_trial' ? 'Ücretsiz deneme hakkı veliye iade edildi.' : 'Ders kredisi öğrenciye iade edildi.');

            toast({ title: 'Ders İptal Edildi', description: `Veliye mazeretiniz iletildi. ${toastDesc}` });
            setIsOpen(false);
        } catch (error: any) {
            console.error("Teacher cancel error:", error);
            toast({ variant: 'destructive', title: 'Hata', description: error.message || 'İptal işlemi başarısız oldu.' });
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
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid), where('status', 'in', ['booked', 'cancelled']));
    }, [user, db]);

    const { data: lessonSlots, isLoading: lessonsLoading } = useCollection(lessonsQuery);

    const teacherDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);
    const { data: teacherData, isLoading: teacherLoading } = useDoc(teacherDocRef);

    // Group Sessions
    const groupSessionsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'groupCourseSessions'), where('teacherId', '==', user.uid));
    }, [user, db]);
    const { data: groupSessions } = useCollection(groupSessionsQuery);

    const groupPackageIds = useMemo(() => {
        if (!groupSessions) return [];
        return [...new Set(groupSessions.map((s: any) => s.packageId))];
    }, [groupSessions]);

    const groupPackagesQuery = useMemoFirebase(() => {
        if (!db || groupPackageIds.length === 0) return null;
        return query(collection(db, 'groupCoursePackages'), where('__name__', 'in', groupPackageIds.slice(0, 10)));
    }, [db, groupPackageIds]);
    const { data: groupPackages } = useCollection(groupPackagesQuery);


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
            
            // We group primarily by date, child, teacher and package.
            // Proximity check (<= 5 mins) in the next step will handle actual session splitting.
            const sessionKey = `${sessionDate}-${slot.childId || 'nochild'}-${slot.teacherId || 'noteacher'}-${slot.packageCode || 'nopackage'}`;
            if (!sessions[sessionKey]) sessions[sessionKey] = [];
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
                    const lastSlot = currentLesson.slots[currentLesson.slots.length - 1];
                    const lastSlotTime = parseDate(lastSlot.startTime);
                    const currentSlotTime = parseDate(slot.startTime);
                    const timeDiff = (currentSlotTime.getTime() - lastSlotTime.getTime()) / (1000 * 60);

                    // Group only if it's the same booking and consecutive in time
                    const isSameBooking = lastSlot.bookedAt?.seconds === slot.bookedAt?.seconds;

                    if (timeDiff <= 5 && isSameBooking) {
                        currentLesson.slots.push(slot);
                    } else {
                        lessons.push(currentLesson);
                        currentLesson = { ...slot, slots: [slot] };
                    }
                }
            }
            if (currentLesson) lessons.push(currentLesson);

            return lessons.map(lesson => {
                const firstSlot = lesson.slots[0];
                const startTime = parseDate(firstSlot.startTime);
                // Calculate actual duration from number of slots (5 mins each)
                const duration = lesson.slots.length * 5;
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

    const allCombinedLessons = useMemo(() => {
        const combined = [...groupedLessons];

        // Add Group Sessions mapped to format
        if (groupSessions && groupPackages) {
            groupSessions.forEach((session: any) => {
                const pkg = groupPackages.find((p: any) => p.id === session.packageId);
                
                combined.push({
                    id: session.id,
                    startTime: session.startTime.toDate ? session.startTime.toDate() : new Date(session.startTime),
                    endTime: session.endTime.toDate ? session.endTime.toDate() : new Date(session.endTime),
                    teacherId: session.teacherId,
                    packageCode: `GRUP_DERS`,
                    courseName: pkg?.title || 'Türkçe Konuşma Kulübü Grup Dersi',
                    isLive: session.status === 'live',
                    liveLessonUrl: pkg?.googleMeetLink || null, // Group packages have a google meet link on the package!
                    status: session.status,
                    isGroupSession: true,
                    // mock values so the rest of the component works
                    childId: 'group',
                    bookedBy: 'group'
                });
            });
        }

        return combined.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }, [groupedLessons, groupSessions, groupPackages]);

    const { upcomingLessons, pastLessons, cancelledLessons, groupLessons } = useMemo(() => {
        const upcoming: any[] = [];
        const past: any[] = [];
        const cancelled: any[] = [];
        const group: any[] = [];
        const now = new Date();
        allCombinedLessons.forEach((lesson: any) => {
            // First check if it's explicitly cancelled (which means the whole lesson is cancelled)
            // We check the first slot's status since they share the same status
            if (lesson.slots && lesson.slots[0]?.status === 'cancelled') {
                cancelled.push(lesson);
            } else if (lesson.endTime < now) {
                past.push(lesson);
            } else if (lesson.isGroupSession) {
                group.push(lesson);
            } else {
                upcoming.push(lesson);
            }
        });
        return { upcomingLessons: upcoming, pastLessons: past, cancelledLessons: cancelled, groupLessons: group };
    }, [allCombinedLessons]);

    const groupedUpcomingByMonth = useMemo(() => {
        const groups: { [month: string]: any[] } = {};
        upcomingLessons.forEach(lesson => {
            const month = formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'MMMM yyyy', { locale: tr });
            if (!groups[month]) groups[month] = [];
            groups[month].push(lesson);
        });
        return groups;
    }, [upcomingLessons]);

    const groupedGroupLessonsByMonth = useMemo(() => {
        const groups: { [month: string]: any[] } = {};
        groupLessons.forEach(lesson => {
            const month = formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'MMMM yyyy', { locale: tr });
            if (!groups[month]) groups[month] = [];
            groups[month].push(lesson);
        });
        return groups;
    }, [groupLessons]);

    const groupedPastByMonth = useMemo(() => {
        const groups: { [month: string]: any[] } = {};
        pastLessons.forEach(lesson => {
            const month = formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'MMMM yyyy', { locale: tr });
            if (!groups[month]) groups[month] = [];
            groups[month].push(lesson);
        });
        return groups;
    }, [pastLessons]);

    const groupedCancelledByMonth = useMemo(() => {
        const groups: { [month: string]: any[] } = {};
        cancelledLessons.forEach(lesson => {
            const month = formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'MMMM yyyy', { locale: tr });
            if (!groups[month]) groups[month] = [];
            groups[month].push(lesson);
        });
        return groups;
    }, [cancelledLessons]);

    const handleJoinLesson = async (lesson: any) => {
        try {
            const msDiff = lesson.startTime.getTime() - new Date().getTime();
            const minutesDiff = msDiff / (1000 * 60);
            
            if (minutesDiff > 5) {
                toast({
                    variant: "destructive",
                    title: "Erken Giriş",
                    description: "Dersi başlatmak için derse en fazla 5 dakika kalmış olması gerekir.",
                });
                return;
            }

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

            if (lesson.isGroupSession) {
                // For group sessions, the google meet link is in the group course package
                const liveLessonUrl = lesson.liveLessonUrl || teacherData.googleMeetLink;
                const sessionRef = doc(db, 'groupCourseSessions', lesson.id);
                await updateDoc(sessionRef, {
                    status: 'live'
                });
                toast({
                    title: 'Grup Dersi Başlatıldı!',
                    description: 'Öğrencileriniz artık derse katılabilir. Google Meet linki açılıyor...',
                });
                window.open(liveLessonUrl, '_blank');
                setIsStartingLesson(false);
                return;
            }

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
            <Tabs 
                defaultValue="upcoming" 
                className="w-full"
                onValueChange={() => {
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);
                }}
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="upcoming"><Calendar className="mr-2 h-4 w-4" />Yaklaşan ({upcomingLessons.length})</TabsTrigger>
                    <TabsTrigger value="past"><History className="mr-2 h-4 w-4" />Geçmiş ({pastLessons.length})</TabsTrigger>
                    <TabsTrigger value="group" className="text-purple-600 data-[state=active]:text-purple-700"><Users className="mr-2 h-4 w-4" />Grup Dersleri ({groupLessons.length})</TabsTrigger>
                    <TabsTrigger value="cancelled" className="text-red-500 data-[state=active]:text-red-600"><AlertCircle className="mr-2 h-4 w-4" />İptal ({cancelledLessons.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="pt-4">
                    {upcomingLessons.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center text-muted-foreground">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Yaklaşan dersiniz bulunmuyor.</p>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(groupedUpcomingByMonth).map(([month, lessons]) => (
                                <div key={month} className="space-y-4">
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px bg-primary/20 flex-1" />
                                        {month}
                                        <div className="h-px bg-primary/20 flex-1" />
                                    </h3>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {lessons.map(lesson => (
                                            <LessonCard key={lesson.id} lesson={lesson} onOpenProgressPanel={() => { setSelectedLesson(lesson); setIsProgressPanelOpen(true); }} onJoinLesson={handleJoinLesson} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="past" className="pt-4">
                    {pastLessons.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center text-muted-foreground">
                                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Henüz tamamlanmış bir dersiniz yok.</p>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(groupedPastByMonth).map(([month, lessons]) => (
                                <div key={month} className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px bg-slate-200 flex-1" />
                                        {month}
                                        <div className="h-px bg-slate-200 flex-1" />
                                    </h3>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {lessons.map(lesson => (
                                            <LessonCard key={lesson.id} lesson={lesson} onOpenProgressPanel={() => { setSelectedLesson(lesson); setIsProgressPanelOpen(true); }} onJoinLesson={handleJoinLesson} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="cancelled" className="pt-4">
                    {cancelledLessons.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center text-muted-foreground">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">İptal edilen dersiniz bulunmuyor.</p>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(groupedCancelledByMonth).map(([month, lessons]) => (
                                <div key={month} className="space-y-4">
                                    <h3 className="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px bg-red-100 flex-1" />
                                        {month}
                                        <div className="h-px bg-red-100 flex-1" />
                                    </h3>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {lessons.map(lesson => {
                                            const firstSlot = lesson.slots[0];
                                            return (
                                                <Card key={lesson.id} className="opacity-75 border-red-50 hover:opacity-100 transition-opacity">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <Badge variant="destructive">İptal Edildi</Badge>
                                                            <span className="text-[10px] font-bold text-slate-400">
                                                                {formatInTimeZone(lesson.startTime, 'Europe/Istanbul', 'dd MMM, HH:mm', { locale: tr })}
                                                            </span>
                                                        </div>
                                                        <CardTitle className="text-base font-bold">{getCourseDetailsFromPackageCode(lesson.packageCode)?.courseName || 'Ders'}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2 pb-4">
                                                        {firstSlot.cancelReason && (
                                                            <div className="bg-red-50 p-2 rounded-lg mt-2">
                                                                <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">Mazeret:</p>
                                                                <p className="text-xs italic text-red-600">"{firstSlot.cancelReason}"</p>
                                                            </div>
                                                        )}
                                                        <div className="text-[10px] text-slate-400 mt-2 font-bold">
                                                            Öğrenci: <StudentName bookedBy={lesson.bookedBy} childId={lesson.childId} />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="group" className="pt-4">
                    {groupLessons.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Yaklaşan grup dersiniz bulunmuyor.</p>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(groupedGroupLessonsByMonth).map(([month, lessons]) => (
                                <div key={month} className="space-y-4">
                                    <h3 className="text-sm font-black text-purple-600 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px bg-purple-200 flex-1" />
                                        {month}
                                        <div className="h-px bg-purple-200 flex-1" />
                                    </h3>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {lessons.map(lesson => (
                                            <LessonCard key={lesson.id} lesson={lesson} onOpenProgressPanel={() => { setSelectedLesson(lesson); setIsProgressPanelOpen(true); }} onJoinLesson={handleJoinLesson} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <ProgressPanel 
                            child={selectedChildData} 
                            parentId={selectedLesson.bookedBy}
                            lessonId={selectedLesson.id} 
                            isEditable={true} 
                        />
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
