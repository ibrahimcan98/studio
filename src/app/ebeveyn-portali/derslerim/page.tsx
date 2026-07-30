'use client';

import { Button } from '@/components/ui/button';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc, writeBatch, increment, getDocs, Timestamp, addDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Calendar, Clock, User, BookOpen, Baby, History, MessageSquare, Video, ClipboardList, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { addMinutes, startOfDay, format } from 'date-fns';
import { COURSES } from '@/data/courses';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProgressPanel } from '@/components/shared/progress-panel';
import { cn } from '@/lib/utils';
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { sendLessonCancelledEmails } from '@/lib/email-service';

const getCourseDetailsFromPackageCode = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: 30 };
    if (code.startsWith('GIFT')) return { courseName: 'Hediye Ders', duration: 30 };
    
    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '') as keyof typeof courseCodeMap];
    const course = COURSES.find(c => c.id === courseId);
    
    if (!course) return null;

    let duration = 30; // Default
    if (course.id === 'baslangic') duration = 20;
    if (course.id === 'konusma') duration = 30;
    if (course.id === 'gelisim' || course.id === 'akademik') duration = 45;

    return { courseName: course.title, duration };
};

// Teachers are now fetched dynamically from Firestore in the LessonCard component

function CancellationButtons({ lesson, timeZone }: { lesson: any, timeZone: string }) {
    const db = useFirestore();
    const router = useRouter();
    const { user } = useUser();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const now = new Date();
    // Ensure startTime is a Date object
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
        if (!db || !lesson.bookedBy || !user) return;
        setIsProcessing(true);
        try {
            const batch = writeBatch(db);
            const courseDetails = getCourseDetailsFromPackageCode(lesson.packageCode);
            const duration = courseDetails?.duration || 30;

            const slotsQuery = query(
                collection(db, 'lesson-slots'),
                where('teacherId', '==', lesson.teacherId),
                where('bookedBy', '==', lesson.bookedBy),
                where('startTime', '>=', Timestamp.fromDate(startTime)),
                where('startTime', '<', Timestamp.fromDate(new Date(startTime.getTime() + duration * 60000)))
            );
            
            const slotsSnap = await getDocs(slotsQuery);
            slotsSnap.docs.forEach(slotDoc => {
                batch.update(slotDoc.ref, {
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
            const parentDocRef = doc(db, 'users', lesson.bookedBy);

            if (lesson.packageCode !== 'FREE_TRIAL') {
                batch.update(childDocRef, { remainingLessons: increment(1) });
            } else {
                batch.update(childDocRef, { hasUsedFreeTrial: false });
                batch.update(parentDocRef, { freeTrialsUsed: increment(-1) });
            }

            await batch.commit();

            const lessonTimeFormatted = formatInTimeZone(startTime, 'Europe/Istanbul', 'dd.MM.yyyy HH:mm', { locale: tr });

            // Store in Activity Log (Frontend side for auth)
            addDoc(collection(db, 'activity-log'), {
                event: '❌ Ders İptal Edildi (Veli)',
                icon: '👨‍👩‍👧',
                details: {
                    'İptal Eden': 'Veli',
                    'Öğrenci': lesson.childName || lesson.childId || '-',
                    'Ders Saati': lessonTimeFormatted,
                    'Ders Türü': lesson.packageCode || '-',
                },
                createdAt: Timestamp.fromDate(new Date())
            }).catch(console.error);

            // ─── E-posta Bildirimleri (Merkezi Servis) ───────────────
            const teacherSnap2 = await getDocs(query(collection(db, 'users'), where('uid', '==', lesson.teacherId)));
            const teacherData = teacherSnap2.docs[0]?.data();
            const teacherFullName = teacherData?.firstName && teacherData?.lastName
                ? `${teacherData.firstName} ${teacherData.lastName}`
                : (teacherData?.firstName || 'Eğitmen');
            const isTrial = lesson.packageCode === 'FREE_TRIAL';

            sendLessonCancelledEmails({
                studentName: lesson.childName || 'Öğrenci',
                teacherName: teacherFullName,
                teacherFirestoreEmail: teacherData?.email,
                parentEmail: user.email || undefined,
                date: formatInTimeZone(startTime, 'Europe/Istanbul', 'dd MMMM yyyy', { locale: tr }),
                time: formatInTimeZone(startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr }),
                parentDate: formatInTimeZone(startTime, timeZone, 'dd MMMM yyyy', { locale: tr }),
                parentTime: formatInTimeZone(startTime, timeZone, 'HH:mm', { locale: tr }),
                isTrial,
            }).catch(console.error);
            toast({ title: 'Ders İptal Edildi', description: 'Ders krediniz iade edildi.', className: 'bg-green-500 text-white' });
        } catch (error) {
            console.error('Cancellation error:', error);
            toast({ variant: 'destructive', title: 'Hata', description: 'İptal işlemi başarısız oldu.' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReschedule = () => {
        router.push(`/ebeveyn-portali/ders-planla?rescheduleId=${lesson.id}`);
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
            {/* Cancellation Button always visible if >= 8h, but only active if >= 24h */}
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

            {/* Reschedule Button always visible if >= 8h */}
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

function LessonCard({ lesson, timeZone, onShowProgress }: { lesson: any, timeZone: string, onShowProgress: (lesson: any) => void }) {
    const db = useFirestore();
    const router = useRouter();

    const childDocRef = useMemoFirebase(() => {
        if (!db || !lesson.bookedBy || !lesson.childId) return null;
        return doc(db, 'users', lesson.bookedBy, 'children', lesson.childId);
    }, [db, lesson.bookedBy, lesson.childId]);

    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);
    
    const teacherDocRef = useMemoFirebase(() => {
        if (!db || !lesson.teacherId) return null;
        return doc(db, 'users', lesson.teacherId);
    }, [db, lesson.teacherId]);

    const { data: teacherData, isLoading: isTeacherLoading } = useDoc(teacherDocRef);

    if (isChildLoading || isTeacherLoading) {
        return <Card className="p-4 flex items-center justify-center min-h-[220px]"><Loader2 className="animate-spin text-primary" /></Card>;
    }

    const isPast = new Date() > lesson.endTime;
    const startTimeStr = formatInTimeZone(lesson.startTime, timeZone, 'HH:mm');
    const endTimeStr = formatInTimeZone(lesson.endTime, timeZone, 'HH:mm');
    const packageDetails = getCourseDetailsFromPackageCode(lesson.packageCode);

    const handleJoin = () => {
        if (lesson.liveLessonUrl) {
            router.push(lesson.liveLessonUrl);
        }
    };

    return (
        <Card className='flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span className="text-xl font-bold leading-tight">{packageDetails?.courseName || 'Ders'}</span>
                     <Badge variant={isPast ? "outline" : "default"} className={cn(
                        isPast ? "bg-slate-50" : (lesson.isLive ? "bg-red-500 animate-pulse text-white" : "bg-green-100 text-green-800"),
                        lesson.status === 'cancelled' && "bg-red-100 text-red-700 border-red-200 animate-none"
                     )}>
                        {lesson.status === 'cancelled' ? 'İptal Edildi' : (isPast ? 'Tamamlandı' : (lesson.isLive ? 'Canlı Yayında' : 'Yaklaşıyor'))}
                    </Badge>
                </CardTitle>
                <CardDescription className="font-medium text-slate-600">
                    {formatInTimeZone(lesson.startTime, timeZone, 'dd MMMM yyyy, ')}
                    {startTimeStr} - {endTimeStr}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-grow">
                <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-primary" />
                    <span><strong>Öğrenci:</strong> {childData?.firstName}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Öğretmen:</strong> {teacherData?.firstName} {teacherData?.lastName || ''}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Kurs:</strong> {lesson.packageCode === 'FREE_TRIAL' ? 'Ücretsiz Deneme' : packageDetails?.courseName}</span>
                </div>

                {lesson.status === 'cancelled' && lesson.cancelReason && (
                    <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Öğretmen Mazereti
                        </p>
                        <p className="text-xs text-red-800 italic font-medium leading-relaxed">
                            "{lesson.cancelReason}"
                        </p>
                    </div>
                )}

                {(lesson.materials?.length > 0 || lesson.homeworks?.length > 0) && (
                    <div className="mt-4 pt-3 border-t space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ders İçerikleri</span>
                        {lesson.materials?.map((m: any, i: number) => (
                            <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 p-2.5 rounded-xl transition-colors">
                                <BookOpen className="w-4 h-4 shrink-0" />
                                <span className="font-semibold text-sm truncate">{m.title}</span>
                            </a>
                        ))}
                        {lesson.homeworks?.map((hw: any, i: number) => (
                            <a key={i} href={hw.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 p-2.5 rounded-xl transition-colors">
                                <FileText className="w-4 h-4 shrink-0" />
                                <span className="font-semibold text-sm truncate">{hw.title} (Ödev)</span>
                            </a>
                        ))}
                    </div>
                )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-2 pt-2">
                {!isPast && (
                    <div className="flex flex-col w-full gap-2">
                        <Button 
                            onClick={handleJoin} 
                            disabled={!lesson.isLive && lesson.status !== 'scheduled'} 
                            className={cn("w-full h-11 font-bold", lesson.isLive || lesson.status === 'scheduled' ? "bg-red-600 hover:bg-red-700" : "")}
                        >
                            <Video className="w-4 h-4 mr-2" />
                            {lesson.isLive ? 'Derse Katıl' : 'Dersin Başlaması Bekleniyor'}
                        </Button>

                        {/* Cancellation / Rescheduling Buttons (only for 1-on-1) */}
                        {!lesson.isGroupSession && (
                            <div className="flex gap-2 w-full">
                               <CancellationButtons lesson={{ ...lesson, childName: childData?.firstName }} timeZone={timeZone} />
                            </div>
                        )}
                        {lesson.isGroupSession && (
                            <div className="text-center w-full">
                                <span className="text-[10px] text-purple-600 font-bold uppercase tracking-widest bg-purple-50 px-2 py-1 rounded-full">Grup Dersleri İptal Edilemez</span>
                            </div>
                        )}
                    </div>
                )}
                {isPast && (
                    <Button 
                        onClick={() => onShowProgress(lesson)}
                        variant="outline"
                        className={cn("w-full h-11 font-semibold", lesson.feedback ? "border-primary text-primary hover:bg-primary/5" : "border-slate-200 text-slate-400")}
                    >
                        {lesson.feedback ? (
                            <><ClipboardList className="w-4 h-4 mr-2" /> İlerleme Raporunu Gör</>
                        ) : (
                            <><Clock className="w-4 h-4 mr-2" /> {lesson.isGroupSession ? 'Geri Bildirim Bekleniyor' : 'Gelişim Raporu Bekleniyor'}</>
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export default function DerslerimPage() {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();

    const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
    const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false);
    const [timeZone, setTimeZone] = useState('');

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

    // Group Enrollments
    const groupEnrollmentsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'groupCourseEnrollments'), where('parentId', '==', user.uid));
    }, [user, db]);
    const { data: groupEnrollments } = useCollection(groupEnrollmentsQuery);

    const childrenQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return collection(db, 'users', user.uid, 'children');
    }, [user, db]);
    const { data: children } = useCollection(childrenQuery);

    const groupPackageIds = useMemo(() => {
        if (!groupEnrollments) return [];
        const ids = new Set<string>();
        groupEnrollments.forEach((e: any) => {
            ids.add(e.packageId);
            if (e.makeupLessons && Array.isArray(e.makeupLessons)) {
                e.makeupLessons.forEach((m: any) => {
                    if (m.makeupPackageId) ids.add(m.makeupPackageId);
                });
            }
        });
        return [...ids];
    }, [groupEnrollments]);

    const groupSessionsQuery = useMemoFirebase(() => {
        if (!db || groupPackageIds.length === 0) return null;
        return query(collection(db, 'groupCourseSessions'), where('packageId', 'in', groupPackageIds.slice(0, 10)));
    }, [db, groupPackageIds]);
    const { data: groupSessions } = useCollection(groupSessionsQuery);

    const groupPackagesQuery = useMemoFirebase(() => {
        if (!db || groupPackageIds.length === 0) return null;
        return query(collection(db, 'groupCoursePackages'), where('__name__', 'in', groupPackageIds.slice(0, 10)));
    }, [db, groupPackageIds]);
    const { data: groupPackages } = useCollection(groupPackagesQuery);

    const groupAnnouncementsQuery = useMemoFirebase(() => {
        if (!db || groupPackageIds.length === 0) return null;
        return query(collection(db, 'groupAnnouncements'), where('packageId', 'in', groupPackageIds.slice(0, 10)));
    }, [db, groupPackageIds]);
    const { data: groupAnnouncementsRaw } = useCollection(groupAnnouncementsQuery);

    const groupAnnouncements = useMemo(() => {
        if (!groupAnnouncementsRaw) return [];
        return [...groupAnnouncementsRaw].sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }, [groupAnnouncementsRaw]);


    const groupedLessons = useMemo(() => {
        if (!lessonSlots) return [];
        
        // 1. Sort all slots by time to find contiguous blocks
        const sortedSlots = [...lessonSlots].sort((a, b) => a.startTime.seconds - b.startTime.seconds);
        
        const sessions: any[][] = [];
        let currentSession: any[] = [];

        sortedSlots.forEach(slot => {
            const lastSlot = currentSession[currentSession.length - 1];
            
            // Group only if:
            // - Same child and teacher
            // - Same package code
            // - Slots are contiguous in time (difference of exactly 5 mins / 300s)
            // - Slots belong to the same booking (same bookedAt timestamp)
            const isConsecutive = lastSlot && 
                lastSlot.childId === slot.childId &&
                lastSlot.teacherId === slot.teacherId &&
                lastSlot.packageCode === slot.packageCode &&
                (lastSlot.bookedAt?.seconds === slot.bookedAt?.seconds) &&
                (slot.startTime.seconds - lastSlot.startTime.seconds === 300);

            if (isConsecutive) {
                currentSession.push(slot);
            } else {
                if (currentSession.length > 0) sessions.push(currentSession);
                currentSession = [slot];
            }
        });
        if (currentSession.length > 0) sessions.push(currentSession);

        return sessions.map(sessionSlots => {
            const firstSlot = sessionSlots[0];
            const startTime = firstSlot.startTime.toDate();
            
            // Calculate dynamic duration based on slots (each slot is 5 mins)
            const duration = sessionSlots.length * 5;
            const endTime = addMinutes(startTime, duration);
            
            const feedbackSlot = sessionSlots.find(s => s.feedback);
            const liveSlot = sessionSlots.find(s => s.isLive);

            return {
                id: firstSlot.id,
                startTime: startTime,
                endTime: endTime,
                childId: firstSlot.childId,
                teacherId: firstSlot.teacherId,
                bookedBy: firstSlot.bookedBy,
                packageCode: firstSlot.packageCode,
                rescheduleCount: firstSlot.rescheduleCount || 0,
                feedback: feedbackSlot ? feedbackSlot.feedback : null,
                isLive: liveSlot ? liveSlot.isLive : false,
                liveLessonUrl: liveSlot ? liveSlot.liveLessonUrl : null,
                status: firstSlot.status,
                cancelReason: firstSlot.cancelReason,
                bookedAt: firstSlot.bookedAt,
                materials: firstSlot.materials || [],
                homeworks: firstSlot.homeworks || []
            };
        });
    }, [lessonSlots]);

    const allCombinedLessons = useMemo(() => {
        const combined = [...groupedLessons];
        
        // Add Group Sessions mapped to format
        if (groupSessions && groupEnrollments && groupPackages) {
            groupSessions.forEach((session: any) => {
                const enrollmentsForThisSession = groupEnrollments.filter((e: any) => e.packageId === session.packageId);
                const pkg = groupPackages.find((p: any) => p.id === session.packageId);
                
                enrollmentsForThisSession.forEach((enrollment: any) => {
                    combined.push({
                        id: `${session.id}-${enrollment.studentId}`,
                        startTime: session.startTime.toDate ? session.startTime.toDate() : new Date(session.startTime),
                        endTime: session.endTime.toDate ? session.endTime.toDate() : new Date(session.endTime),
                        childId: enrollment.studentId,
                        teacherId: session.teacherId,
                        bookedBy: enrollment.parentId,
                        packageCode: `GRUP_DERS`,
                        courseName: pkg?.title || 'Türkçe Konuşma Kulübü Grup Dersi',
                        isLive: session.status === 'live',
                        liveLessonUrl: pkg?.googleMeetLink || null, // Group packages have a google meet link on the package!
                        status: session.status,
                        isGroupSession: true,
                        feedback: session.feedback || null
                    });
                });
            });
        }
        
        return combined.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }, [groupedLessons, groupSessions, groupEnrollments, groupPackages]);

    const { upcomingLessons, pastLessons } = useMemo(() => {
        const upcoming: any[] = [];
        const past: any[] = [];
        const now = new Date();
        allCombinedLessons.forEach((lesson: any) => {
            if (lesson.endTime < now) {
                past.push(lesson);
            } else if (!lesson.isGroupSession) {
                upcoming.push(lesson);
            } else {
                 // Include upcoming group sessions
                upcoming.push(lesson);
            }
        });
        return { upcomingLessons: upcoming, pastLessons: past };
    }, [allCombinedLessons]);

    const groupedUpcomingByMonth = useMemo(() => {
        const groups: { [month: string]: any[] } = {};
        upcomingLessons.forEach(lesson => {
            const month = formatInTimeZone(lesson.startTime, timeZone, 'MMMM yyyy', { locale: tr });
            if (!groups[month]) groups[month] = [];
            groups[month].push(lesson);
        });
        return groups;
    }, [upcomingLessons, timeZone]);

    const groupedPastByMonth = useMemo(() => {
        const groups: { [month: string]: any[] } = {};
        pastLessons.forEach(lesson => {
            const month = formatInTimeZone(lesson.startTime, timeZone, 'MMMM yyyy', { locale: tr });
            if (!groups[month]) groups[month] = [];
            groups[month].push(lesson);
        });
        return groups;
    }, [pastLessons, timeZone]);

    const handleShowProgress = (lesson: any) => {
        setSelectedLesson(lesson);
        setIsProgressPanelOpen(true);
    };

    const selectedChildDocRef = useMemoFirebase(() => {
        if (!db || !selectedLesson?.bookedBy || !selectedLesson?.childId) return null;
        return doc(db, 'users', selectedLesson.bookedBy, 'children', selectedLesson.childId);
    }, [db, selectedLesson]);

    const { data: selectedChildData, isLoading: isChildDataLoading } = useDoc(selectedChildDocRef);

    if (userLoading || lessonsLoading || isUserLoading || !timeZone) {
        return <div className="flex min-h-[calc(100vh-80px)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Derslerim</h2>
                    <p className="text-muted-foreground">Derslerinizi takip edin ve gelişim raporlarını inceleyin.</p>
                </div>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming"><Calendar className="mr-2 h-4 w-4" />Yaklaşan Dersler ({upcomingLessons.length})</TabsTrigger>
                    <TabsTrigger value="past"><History className="mr-2 h-4 w-4" />Geçmiş Dersler ({pastLessons.length})</TabsTrigger>
                    <TabsTrigger value="group"><Users className="mr-2 h-4 w-4" />Grup Dersleri</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    {upcomingLessons.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed text-muted-foreground mt-4">Henüz planlanmış bir dersiniz bulunmuyor.</div>
                    ) : (
                        <div className="space-y-8 mt-4">
                            {Object.entries(groupedUpcomingByMonth).map(([month, lessons]) => (
                                <div key={month} className="space-y-4">
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px bg-primary/20 flex-1" />
                                        {month}
                                        <div className="h-px bg-primary/20 flex-1" />
                                    </h3>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {lessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} timeZone={timeZone} onShowProgress={handleShowProgress} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="past">
                    {pastLessons.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed text-muted-foreground mt-4">Henüz tamamlanmış bir dersiniz bulunmuyor.</div>
                    ) : (
                        <div className="space-y-8 mt-4">
                            {Object.entries(groupedPastByMonth).map(([month, lessons]) => (
                                <div key={month} className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px bg-slate-200 flex-1" />
                                        {month}
                                        <div className="h-px bg-slate-200 flex-1" />
                                    </h3>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {lessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} timeZone={timeZone} onShowProgress={handleShowProgress} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="group">
                    {(!groupEnrollments || groupEnrollments.length === 0) ? (
                        <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed text-muted-foreground mt-4">Kayıtlı olduğunuz bir grup dersi bulunmuyor.</div>
                    ) : (
                        <div className="space-y-6 mt-4">
                            {groupEnrollments.map((enrollment: any) => {
                                const child = children?.find((c: any) => c.id === enrollment.studentId);
                                const pkg = groupPackages?.find((p: any) => p.id === enrollment.packageId);
                                
                                return (
                                    <div key={enrollment.id} className="p-6 border border-purple-200 rounded-[20px] bg-white shadow-sm flex flex-col md:flex-row gap-6 items-center">
                                        <div className='flex gap-4 items-center md:w-1/3'>
                                            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-xl border-2 border-purple-200">
                                                {child?.firstName?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-900">{child?.firstName || 'Bilinmeyen'}</h3>
                                                <p className="text-sm text-purple-600 font-bold uppercase tracking-wider text-[10px]">Öğrenci</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-purple-100 pt-4 md:pt-0 md:pl-6">
                                            <h4 className="font-black text-purple-900 text-lg mb-1">{pkg?.title || 'Yükleniyor...'}</h4>
                                            <p className="text-sm text-slate-500 mb-4">{pkg?.description}</p>
                                            
                                            <div className="space-y-3 mb-6">
                                                <h5 className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-2"><BookOpen className="w-3 h-3"/> Son Duyurular ve Materyaller</h5>
                                                {(() => {
                                                    const pkgAnnouncements = groupAnnouncements.filter((a: any) => a.packageId === pkg?.id);
                                                    if (pkgAnnouncements.length === 0) {
                                                        return <p className="text-xs italic text-slate-400 p-2 bg-slate-50 rounded-lg">Henüz bir duyuru veya materyal paylaşılmadı.</p>;
                                                    }
                                                    return pkgAnnouncements.slice(0, 3).map((ann: any) => (
                                                        <div key={ann.id} className="text-sm bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="font-bold text-purple-900">{ann.title}</span>
                                                                <span className="text-[10px] font-bold text-purple-400">
                                                                    {formatInTimeZone(ann.createdAt?.toDate() || new Date(), 'Europe/Istanbul', 'dd MMM', { locale: tr })}
                                                                </span>
                                                            </div>
                                                            <p className="text-slate-600 whitespace-pre-wrap">{ann.content}</p>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>

                                            {pkg?.googleMeetLink && (
                                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md font-bold" asChild>
                                                    <a href={pkg.googleMeetLink} target="_blank" rel="noopener noreferrer"><Video className="w-4 h-4 mr-2" /> Canlı Derse Katıl</a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <Dialog open={isProgressPanelOpen} onOpenChange={setIsProgressPanelOpen}>
                <DialogContent className={cn("max-w-5xl", selectedLesson?.isGroupSession ? "h-auto max-w-2xl" : "h-[90vh]")}>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold font-headline">
                            {selectedLesson?.isGroupSession 
                                ? 'Grup Dersi Geri Bildirimi'
                                : (isChildDataLoading || !selectedChildData ? 'Yükleniyor...' : `${selectedChildData.firstName} İlerleme Paneli`)}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedLesson?.isGroupSession 
                                ? 'Sınıfın genel ilerleme değerlendirmesi.' 
                                : 'Çocuğun gelişimini izleyin ve geri bildirimleri inceleyin.'}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLesson?.isGroupSession ? (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl min-h-[150px]">
                            <p className="whitespace-pre-wrap text-slate-700">{selectedLesson.feedback}</p>
                        </div>
                    ) : (isChildDataLoading || !selectedChildData || !selectedLesson) ? (
                        <div className="flex h-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
                    ) : (
                        <ProgressPanel 
                            child={selectedChildData} 
                            parentId={user?.uid || ''}
                            lessonId={selectedLesson.id} 
                            isEditable={false} 
                            authorRole="parent" 
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
