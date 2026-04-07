'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, where, query, increment, Timestamp, writeBatch, getDocs, getDoc, arrayRemove, addDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Info, BookOpen, User, Calendar as CalendarIcon, Package, Clock, Plus, Eye, PlayCircle, Sprout, Heart, ChevronLeft, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { toZonedTime, formatInTimeZone, format } from 'date-fns-tz';
import { isSameDay, addMinutes, addDays, addHours, startOfWeek, endOfWeek, eachDayOfInterval, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import timezones from '@/data/timezones.json';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { COURSES } from '@/data/courses';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AddChildForm } from '@/components/parent-portal/add-child-form';
import Link from 'next/link';

const getCourseDetailsFromPackageCode = (code: string) => {
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: 30 };
    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik', 'GCSE': 'gcse' };
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '')];
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return null;
    let duration = 30;
    if (course.id === 'baslangic') duration = 20;
    if (course.id === 'konusma') duration = 30;
    if (course.id === 'gelisim' || course.id === 'akademik') duration = 45;
    if (course.id === 'gcse') duration = 50;
    return { courseName: course.title, duration };
}

const MAX_FREE_TRIALS = 3;

// Teacher Preview Component
function TeacherPreviewDialog({ teacherId, isOpen, onOpenChange }: { teacherId: string, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const db = useFirestore();
    const teacherRef = useMemoFirebase(() => teacherId ? doc(db, 'users', teacherId) : null, [db, teacherId]);
    const { data: teacherData, isLoading } = useDoc(teacherRef);

    if (!teacherId) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[24px] border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-4 text-slate-900">
                        <Avatar className="h-14 w-14 ring-4 ring-primary/10">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{teacherData?.firstName?.[0]}</AvatarFallback>
                        </Avatar>
                        {teacherData?.firstName} {teacherData?.lastName}
                    </DialogTitle>
                    <DialogDescription className="text-base font-medium text-slate-500">Öğretmenimizin profili.</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : teacherData ? (
                    <div className="space-y-6 py-4">
                        {/* {teacherData.introVideoUrl && (
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-lg relative group">
                                <iframe
                                    src={teacherData.introVideoUrl.replace('watch?v=', 'embed/').replace('kapwing.com/e/', 'kapwing.com/w/')}
                                    className="w-full h-full border-none"
                                    allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )} */}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <User className="w-4 h-4 text-primary" /> Hakkında
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed italic font-medium">
                                    "{teacherData.bio || 'Henüz bir biyografi eklenmemiş.'}"
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Heart className="w-4 h-4 text-primary" /> Hobiler
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {teacherData.hobbies?.length > 0 ? (
                                        teacherData.hobbies.map((hobby: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 border-none font-semibold px-3 py-1 rounded-lg text-xs">
                                                {hobby}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs font-semibold text-slate-400">Belirtilmemiş</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center text-slate-400 font-bold">Öğretmen bilgileri bulunamadı.</div>
                )}

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="rounded-xl w-full sm:w-auto font-bold text-base py-5 shadow-lg">Kapat</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function DersPlanlaPage() {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isBooking, setIsBooking] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState<string>('');
    
    const [rescheduleId, setRescheduleId] = useState<string | null>(null);
    const [rescheduleSlotIds, setRescheduleSlotIds] = useState<string[]>([]);
    const [oldLessonData, setOldLessonData] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const childId = params.get('childId');
            if (childId) {
                setSelectedChildId(childId);
            }
            const resId = params.get('rescheduleId');
            const slotIdsParam = params.get('slotIds');
            if (resId) {
                setRescheduleId(resId);
                const ids = slotIdsParam ? slotIdsParam.split(',') : [resId];
                setRescheduleSlotIds(ids);
                fetchOldLesson(resId);
            }
        }
    }, []);

    const fetchOldLesson = async (id: string) => {
        if (!db || !id) return;
        try {
            // First, try to fetch as a direct document ID which is safer
            const directDocRef = doc(db, 'lesson-slots', id);
            const directSnap = await getDocs(query(collection(db, 'lesson-slots'), where('__name__', '==', id)));
            
            let lessonData = null;
            if (!directSnap.empty) {
                lessonData = directSnap.docs[0].data();
            }

            if (!lessonData) {
                // Fallback: Try to parse if it's a legacy consolidated ID
                const parts = id.split('-');
                if (parts.length >= 6) {
                    const childId = parts[parts.length - 2];
                    const teacherId = parts[parts.length - 1];
                    
                    if (childId && teacherId) {
                        const q = query(
                            collection(db, 'lesson-slots'),
                            where('childId', '==', childId),
                            where('teacherId', '==', teacherId),
                            where('status', '==', 'booked')
                        );
                        const snap = await getDocs(q);
                        // find matching by date...
                        const year = parts[0];
                        const month = parts[1];
                        const day = parts[2];
                        const matchingSlot = snap.docs.find(doc => {
                            const date = doc.data().startTime.toDate();
                            const dKey = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
                            return dKey.startsWith(`${year}-${month}-${day}`);
                        });
                        if (matchingSlot) lessonData = matchingSlot.data();
                    }
                }
            }

            if (lessonData) {
                setOldLessonData({
                    ...lessonData,
                    startTime: lessonData.startTime.toDate ? lessonData.startTime.toDate() : new Date(lessonData.startTime),
                    id: id
                });
                if (lessonData.packageCode) setSelectedPackage(lessonData.packageCode);
                if (lessonData.childId) setSelectedChildId(lessonData.childId);
                if (lessonData.teacherId) setSelectedTeacherId(lessonData.teacherId);
            }
        } catch (error) {
            console.error("fetchOldLesson error:", error);
        }
    };
    const [selectedPackage, setSelectedPackage] = useState<string>('');
    const [bookingMode, setBookingMode] = useState<'free' | 'paid'>('paid');
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ id: string, startTime: Timestamp, teacherId: string } | null>(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
    const [isTeacherPreviewOpen, setIsTeacherPreviewOpen] = useState(false);
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

    const userDocRef = useMemoFirebase(() => (user && db) ? doc(db, 'users', user.uid) : null, [user, db]);
    const { data: userData } = useDoc(userDocRef);

    const childrenRef = useMemoFirebase(() => (db && user) ? collection(db, 'users', user.uid, 'children') : null, [db, user]);
    const { data: children, isLoading: childrenLoading, refetch: refetchChildren } = useCollection(childrenRef);

    const teachersRef = useMemoFirebase(() => db ? query(collection(db, 'users'), where('role', '==', 'teacher')) : null, [db]);
    const { data: dynamicTeachers, isLoading: teachersLoading } = useCollection(teachersRef);

    const selectedChildData = useMemo(() => children?.find(c => c.id === selectedChildId), [children, selectedChildId]);

    useEffect(() => {
        if (userData?.timezone) setSelectedTimeZone(userData.timezone);
        else if (typeof window !== 'undefined') setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, [userData]);

    const isEligibleByAdditionOrder = useMemo(() => {
        if (!children || !selectedChildId) return false;
        // Sort by createdAt (oldest first). Handle missing createdAt by giving it a very old time.
        const sorted = [...children].sort((a, b) => {
            const timeA = a.createdAt?.toMillis?.() || 0;
            const timeB = b.createdAt?.toMillis?.() || 0;
            return timeA - timeB;
        });
        const firstThreeIds = sorted.slice(0, 3).map(c => c.id);
        return firstThreeIds.includes(selectedChildId);
    }, [children, selectedChildId]);

    const trialStatusMessage = useMemo(() => {
        if (!selectedChildData || !userData) return null;
        if (userData.isLegacy) return "Eski üye hesabında deneme dersi hakkı bulunmamaktadır.";
        if (selectedChildData.hasUsedFreeTrial) return "Bu öğrenci için deneme dersi hakkı daha önce kullanıldı.";
        if ((userData.freeTrialsUsed || 0) >= MAX_FREE_TRIALS) return "Bu hesap için toplam deneme dersi limitine (3) ulaşıldı.";
        if (!isEligibleByAdditionOrder) return "Deneme dersi hakkı sadece hesaba eklenen ilk 3 öğrenci için geçerlidir.";
        return null;
    }, [selectedChildData, userData, isEligibleByAdditionOrder]);

    useEffect(() => {
        // If we are in reschedule mode, we don't want to overwrite the package from the old lesson
        if (rescheduleId && oldLessonData) return;

        if (selectedChildData) {
            const canTakeFreeTrial = !selectedChildData.hasUsedFreeTrial && 
                                    (userData?.freeTrialsUsed || 0) < MAX_FREE_TRIALS &&
                                    !userData?.isLegacy &&
                                    isEligibleByAdditionOrder;

            if (canTakeFreeTrial) {
                setBookingMode('free');
                setSelectedPackage('FREE_TRIAL');
            }
            else if (selectedChildData.assignedPackage && selectedChildData.remainingLessons > 0) {
                setBookingMode('paid');
                setSelectedPackage(selectedChildData.assignedPackage);
            } else {
                setBookingMode('paid');
                setSelectedPackage(''); 
            }
        } else {
            setSelectedPackage('');
        }
    }, [selectedChildData, userData, rescheduleId, oldLessonData]);

    const lessonSlotsRef = useMemoFirebase(() => (db && selectedTeacherId) ? query(collection(db, 'lesson-slots'), where('teacherId', '==', selectedTeacherId)) : null, [db, selectedTeacherId]);
    const { data: allTeacherSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsRef);

    const weekDays = useMemo(() => {
        return eachDayOfInterval({
            start: currentWeekStart,
            end: addDays(currentWeekStart, 6)
        });
    }, [currentWeekStart]);

    const slotsByDayAndTime = useMemo(() => {
        const map: { [key: string]: any } = {};
        allTeacherSlots?.forEach(slot => {
            const date = toZonedTime(slot.startTime.seconds * 1000, selectedTimeZone);
            const dayKey = format(date, 'yyyy-MM-dd');
            const timeKey = format(date, 'HH:mm');
            if (!map[dayKey]) map[dayKey] = {};
            map[dayKey][timeKey] = slot;
        });
        return map;
    }, [allTeacherSlots, selectedTimeZone]);

    const timeSlots = useMemo(() => {
        const slots: string[] = [];
        for (let h = 0; h <= 23; h++) {
            for (let m = 0; m < 60; m += 5) {
                slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            }
        }
        return slots;
    }, []);

    const handleSlotClick = (day: Date, time: string) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const slot = slotsByDayAndTime[dayKey]?.[time];
        
        if (!slot || slot.status !== 'available' || slot.startTime.toDate() < addHours(new Date(), 12)) return;

        const courseDetails = getCourseDetailsFromPackageCode(selectedPackage);
        if (!courseDetails) return;
        const requiredSlots = Math.ceil((courseDetails.duration + 5) / 5);
        
        const startIndex = timeSlots.indexOf(time);
        let isConsecutive = true;
        for (let j = 0; j < requiredSlots; j++) {
            const checkTime = timeSlots[startIndex + j];
            if (!checkTime || slotsByDayAndTime[dayKey]?.[checkTime]?.status !== 'available') {
                isConsecutive = false;
                break;
            }
        }

        if (isConsecutive) {
            setSelectedDate(day);
            setSelectedSlot(slot);
            setIsConfirming(true);
        } else {
            toast({ variant: 'destructive', title: 'Uygun Değil', description: `Bu saatte ${courseDetails.duration} dakikalık ders için yeterli boşluk bulunmuyor.` });
        }
    };

    const handleBookLesson = async () => {
        if (!user || !db || !userDocRef || !selectedSlot || !selectedPackage) return;
        setIsBooking(true);
        const batch = writeBatch(db);
        const courseDetails = getCourseDetailsFromPackageCode(selectedPackage);
        if (!courseDetails) return;

        const numSlots = Math.ceil((courseDetails.duration + 5) / 5);
        const startTime = selectedSlot.startTime.toDate();

        try {
            // If rescheduling, free the old slots first
            if (rescheduleId && rescheduleSlotIds.length > 0) {
                for (const slotId of rescheduleSlotIds) {
                    const slotRef = doc(db, 'lesson-slots', slotId);
                    batch.update(slotRef, {
                        status: 'available',
                        bookedBy: null,
                        childId: null,
                        packageCode: null,
                        isLive: null,
                        liveLessonUrl: null,
                        whatsappReminderSent: null
                    });
                }
            }

            for (let i = 0; i < numSlots; i++) {
                const slotTime = addMinutes(startTime, i * 5);
                const q = query(collection(db, 'lesson-slots'), where('teacherId', '==', selectedSlot.teacherId), where('startTime', '==', Timestamp.fromDate(slotTime)));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    batch.update(snap.docs[0].ref, { 
                        status: 'booked', 
                        bookedBy: user.uid, 
                        childId: selectedChildId, 
                        packageCode: selectedPackage,
                        rescheduleCount: (oldLessonData?.rescheduleCount || 0) + (rescheduleId ? 1 : 0)
                    });
                }
            }

            const childDocRef = doc(db, 'users', user.uid, 'children', selectedChildId);
            if (rescheduleId) {
                // No credit change for rescheduling
            } else if (bookingMode === 'free') {
                batch.update(userDocRef, { freeTrialsUsed: increment(1) });
                batch.update(childDocRef, { hasUsedFreeTrial: true });
            } else {
                batch.update(childDocRef, { remainingLessons: increment(-1) });
            }

            await batch.commit();
            const childName = selectedChildData?.firstName || selectedChildId;
            const lessonTime = formatInTimeZone(startTime, 'Europe/Istanbul', 'dd.MM.yyyy HH:mm', { locale: tr });

            // Store in Activity Log (Frontend side for auth)
            addDoc(collection(db, 'activity-log'), {
                event: rescheduleId ? '🔄 Ders Değiştirildi' : '📅 Ders Planlandı',
                icon: rescheduleId ? '🔄' : '📅',
                details: {
                    'Öğrenci': childName,
                    'Ders Saati': lessonTime,
                    'Ders Türü': selectedPackage || '-',
                },
                createdAt: Timestamp.fromDate(new Date())
            }).catch(console.error);

            // Email Notification (Resend)
            const teacherDocRef = doc(db, 'users', selectedSlot.teacherId);
            const teacherSnap = await getDoc(teacherDocRef);
            const teacherData = teacherSnap.exists() ? teacherSnap.data() : null;
            const teacherEmail = teacherData?.email;

            if (teacherEmail || user.email) {
                const teacherFullName = (teacherData?.firstName && teacherData?.lastName) 
                    ? `${teacherData.firstName} ${teacherData.lastName}` 
                    : (teacherData?.firstName || 'Akademi Eğitmeni');

                const courseDetails = getCourseDetailsFromPackageCode(selectedPackage);

                const commonData = {
                    studentName: childName,
                    teacherName: teacherFullName,
                    courseName: courseDetails?.courseName || 'Akademik Ders',
                    duration: courseDetails?.duration || 45,
                };

                const parentEmailData = {
                    ...commonData,
                    date: formatInTimeZone(startTime, selectedTimeZone, 'dd MMMM yyyy', { locale: tr }),
                    time: formatInTimeZone(startTime, selectedTimeZone, 'HH:mm', { locale: tr }),
                    startTime: startTime.toISOString(),
                    role: 'parent' as const,
                };

                const teacherEmailData = {
                    ...commonData,
                    date: formatInTimeZone(startTime, 'Europe/Istanbul', 'dd MMMM yyyy', { locale: tr }),
                    time: formatInTimeZone(startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr }),
                    startTime: startTime.toISOString(),
                    role: 'teacher' as const,
                };

                // Send to Parent
                if (user.email) {
                    try {
                        const res = await fetch('/api/emails/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                to: user.email,
                                subject: rescheduleId ? 'Dersiniz Değiştirildi' : 'Yeni Dersiniz Planlandı',
                                templateName: 'lesson-planned',
                                data: parentEmailData
                            })
                        });
                        if (!res.ok) console.error('Parent email failed:', await res.text());
                    } catch (e) {
                        console.error('Parent email fetch error:', e);
                    }
                }

                // Send to Teacher
                if (teacherEmail) {
                    try {
                        const res = await fetch('/api/emails/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                to: teacherEmail,
                                subject: rescheduleId ? 'Bir Dersiniz Değiştirildi' : 'Yeni Bir Dersiniz Var',
                                templateName: 'lesson-planned',
                                data: teacherEmailData
                            })
                        });
                        if (!res.ok) console.error('Teacher email failed:', await res.text());
                    } catch (e) {
                        console.error('Teacher email fetch error:', e);
                    }
                }
            }

            // Admin notification (Push)
            fetch('/api/notify/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: rescheduleId ? '🔄 Ders Değiştirildi' : '📅 Ders Planlandı',
                    body: `${childName} için ${lessonTime} saatine ders ${rescheduleId ? 'taşındı' : 'planlandı'}.`,
                    link: '/yonetici/dersler'
                })
            }).catch(console.error);

            // Parent Low Balance Notification (Push)
            if (bookingMode === 'paid' && !rescheduleId && selectedChildData && (selectedChildData.remainingLessons - 1) === 2) {
                fetch('/api/notify/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.uid,
                        title: '🪫 Paketiniz Azalıyor!',
                        body: `${childName} için sadece 2 dersiniz kaldı. Devamlılık için yeni bir paket almayı unutmayın.`,
                        link: '/ebeveyn-portali/paket-al'
                    })
                }).catch(console.error);
            }

            // Legacy notify call (if still needed)
            fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: rescheduleId ? '🔄 Ders Değiştirildi' : '📅 Ders Planlandı',
                    details: {
                        'Öğrenci': childName,
                        'Ders Saati': lessonTime,
                        'Ders Türü': selectedPackage || '-',
                    }
                })
            }).catch(console.error);
            toast({ title: rescheduleId ? 'Ders Değiştirildi!' : 'Ders Planlandı!', description: 'İşlem başarıyla tamamlandı.', className: 'bg-green-500 text-white font-bold' });
            router.push('/ebeveyn-portali');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız oldu.' });
        } finally { setIsBooking(false); setIsConfirming(false); }
    };

    if (userLoading || !selectedTimeZone) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;

    const isPackageMissing = selectedChildId && !selectedPackage && !rescheduleId;

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen font-sans text-slate-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-5 w-full">
                    <Button variant="outline" size="icon" onClick={() => router.push('/ebeveyn-portali')} className="h-11 w-11 rounded-xl border-2 hover:bg-slate-100"><ArrowLeft className="h-5 w-5" /></Button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ders Planla</h2>
                            <p className="text-slate-500 text-sm md:text-base font-medium mt-0.5">Öğretmenlerimizin takviminden uygun bir zaman seçin.</p>
                        </div>

                        {/* Yerel Saat Dilimi (Header) */}
                        <div className="flex items-center gap-2.5 bg-white/60 p-2 md:p-3 rounded-2xl border border-slate-200/50 shadow-sm backdrop-blur-sm">
                            <Clock className="w-5 h-5 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Cihaz Saat Dilimi</span>
                                <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                                    <SelectTrigger className="w-auto h-6 bg-transparent border-none rounded-lg text-xs font-black shadow-none px-0 focus:ring-0 text-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {timezones.map(tz => <SelectItem key={tz.value} value={tz.value} className="text-xs font-semibold">{tz.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rescheduling Mode Banner */}
            {rescheduleId && oldLessonData && (
                <div className="max-w-6xl mx-auto">
                    <Alert className="bg-primary/5 border-primary/20 rounded-[32px] p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-2xl">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <AlertTitle className="text-xl font-bold text-primary mb-1">Ders Değiştirme Modu</AlertTitle>
                                <AlertDescription className="text-slate-600 font-medium italic">
                                    Şu an <strong>{format(oldLessonData.startTime, 'dd MMMM HH:mm', { locale: tr })}</strong> tarihindeki dersinizi değiştiriyorsunuz. 
                                    Lütfen aşağıdan yeni bir saat seçin. Değişiklik onaylandığında eski dersiniz iptal edilecektir.
                                </AlertDescription>
                            </div>
                        </div>
                    </Alert>
                </div>
            )}

            {/* Policy Info Box */}
            <div className="max-w-6xl mx-auto">
                <Card className="bg-slate-50 border-none shadow-none rounded-[32px] p-6">
                    <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <Info className="h-6 w-6 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">İptal & Değişim Politikası</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Dersinize 24 saatten fazla varsa **ücretsiz iptal** edebilirsiniz. 
                                8-24 saat arası sadece **1 kez değişim** hakkınız bulunur. 
                                8 saatten az kalan derslerde değişiklik yapılamaz.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-8 md:p-10 bg-white border-none shadow-xl rounded-[40px] max-w-6xl mx-auto">
                <div className="flex flex-col space-y-12">
                    {/* TOP SELECTORS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-10 border-b border-slate-50">
                        <div className="space-y-4">
                            <Label className="font-bold text-primary uppercase tracking-widest text-[10px] ml-1">1. Öğrenci Seçimi</Label>
                            {childrenLoading ? (
                                <div className="h-14 bg-slate-50 animate-pulse rounded-2xl" />
                            ) : children && children.length > 0 ? (
                                <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                    <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/30 focus:ring-primary/20 text-base font-semibold px-6 text-slate-800 hover:bg-white transition-all shadow-sm">
                                        <SelectValue placeholder="Çocuğunuzu seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        {children?.map(child => <SelectItem key={child.id} value={child.id} className="rounded-xl font-semibold text-sm py-3 mb-1 last:mb-0">{child.firstName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm text-slate-500 font-medium italic">Henüz bir çocuk eklememişsiniz.</p>
                                    {user && (
                                        <AddChildForm userId={user.uid} onChildAdded={refetchChildren}>
                                            <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 border-slate-200 hover:bg-primary/5 hover:text-primary hover:border-primary transition-all font-bold text-base">
                                                <Plus className="mr-2 h-5 w-5" /> Yeni Çocuk Ekle
                                            </Button>
                                        </AddChildForm>
                                    )}
                                </div>
                            )}
                        </div>

                        {!isPackageMissing && (
                            <div className="space-y-4">
                                <Label className="font-bold text-primary uppercase tracking-widest text-[10px] ml-1">2. Öğretmen Seçimi</Label>
                                <div className="flex gap-3">
                                    <Select value={selectedTeacherId} onValueChange={(v) => setSelectedTeacherId(v)}>
                                        <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/30 flex-1 focus:ring-primary/20 text-base font-semibold px-6 text-slate-800 disabled:opacity-50 hover:bg-white transition-all shadow-sm" disabled={teachersLoading}>
                                            <SelectValue placeholder={teachersLoading ? "Öğretmenler Yükleniyor..." : "Öğretmen seçin"} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl max-h-[300px]">
                                            {dynamicTeachers?.map(t => (
                                                <SelectItem 
                                                    key={t.id} 
                                                    value={t.id} 
                                                    disabled={t.isPassive}
                                                    className={cn("rounded-xl font-semibold text-sm py-3 mb-1 last:mb-0", t.isPassive && "opacity-60")}
                                                >
                                                    {t.firstName} {t.lastName} {t.isPassive && <span className="text-slate-400 font-normal ml-1">(Tüm Saatleri Dolu)</span>}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedTeacherId && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-14 w-14 rounded-2xl border-2 border-slate-100 hover:bg-primary/10 hover:text-primary transition-all shadow-sm bg-slate-50/30 hover:bg-white"
                                            onClick={() => setIsTeacherPreviewOpen(true)}
                                        >
                                            <Eye className="w-6 h-6" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FULL WIDTH CALENDAR */}
                    <div className="min-h-[400px]">
                        {isPackageMissing ? (
                            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 py-12">
                                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-800">Aktif Paket Bulunamadı</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                        {trialStatusMessage || `${selectedChildData?.firstName} için ders planlayabilmek için önce bir paket atamanız gerekmektedir.`}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row w-full max-w-md gap-4">
                                    <Button asChild className="h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/10 flex-1">
                                        <Link href="/ebeveyn-portali/paketlerim">
                                            Paket Ata <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="h-12 rounded-xl font-bold text-base border-2 flex-1">
                                        <Link href="/kurslar">
                                            Yeni Paket Satın Al
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : selectedTeacherId ? (
                            <div className="space-y-10">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                                                <CalendarIcon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest leading-none">Haftalık Müsaitlik</h3>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">Takvimden bir saat seçerek devam edin.</p>
                                            </div>
                                        </div>

                                        {/* Haftalık Tarih Kısmı (Müsaitlik Yanı) */}
                                        <div className="flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-xl border border-slate-200/30">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white" onClick={() => setCurrentWeekStart(d => addDays(d, -7))}><ChevronLeft className="w-4 h-4" /></Button>
                                            <span className="text-xs font-black text-slate-700 px-3 whitespace-nowrap min-w-[150px] text-center">
                                                {format(currentWeekStart, 'd MMMM', { locale: tr })} - {format(addDays(currentWeekStart, 6), 'd MMMM', { locale: tr })}
                                            </span>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white" onClick={() => setCurrentWeekStart(d => addDays(d, 7))}><ArrowRight className="w-4 h-4 cursor-pointer" /></Button>
                                        </div>
                                        {areSlotsLoading && <Loader2 className="w-4 h-4 animate-spin text-primary/40" />}
                                    </div>
                                    <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest px-6 py-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-2.5"><div className="w-3.5 h-3.5 bg-emerald-500 rounded-md"></div> Müsait</div>
                                        <div className="flex items-center gap-2.5"><div className="w-3.5 h-3.5 bg-red-400 rounded-md"></div> Dolu</div>
                                        <div className="flex items-center gap-2.5"><div className="w-3.5 h-3.5 bg-slate-200 rounded-md"></div> Kapalı</div>
                                    </div>
                                </div>

                                {/* SCROLL HINT BANNER */}
                                <div className="bg-primary/10 border-2 border-primary/20 text-primary px-4 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-md mt-4 animate-[pulse_3s_ease-in-out_infinite]">
                                    <div className="bg-primary/20 p-2 rounded-full">
                                        <ArrowRight className="w-5 h-5 rotate-90 animate-bounce" />
                                    </div>
                                    <span className="font-bold text-sm md:text-base tracking-wide flex-1 text-center sm:text-left">
                                        Müsait saatleri (yeşil alanları) görmek için lütfen tablonun içinde aşağıya doğru kaydırın
                                    </span>
                                </div>

                                {/* WEEKLY GRID */}
                                <div className="relative border border-slate-100 rounded-[32px] overflow-hidden bg-white shadow-2xl flex flex-col h-[600px] ring-1 ring-slate-200/50">
                                    {/* Header Row */}
                                    <div className="flex border-b border-slate-100 bg-slate-50/90 backdrop-blur sticky top-0 z-10 shadow-sm">
                                        <div className="w-16 shrink-0 border-r border-slate-100 flex items-center justify-center bg-slate-100/30">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                        </div>
                                        {weekDays.map((day, i) => (
                                            <div key={i} className={cn("flex-1 text-center py-5 border-r border-slate-100 last:border-r-0 transition-colors", isSameDay(day, new Date()) && "bg-primary/5")}>
                                                <p className="text-[11px] font-black text-slate-400 uppercase leading-none tracking-widest">{format(day, 'EEE', { locale: tr })}</p>
                                                <p className={cn("text-lg font-black mt-1.5", isSameDay(day, new Date()) ? "text-primary" : "text-slate-800")}>{format(day, 'd')}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Scrollable Time Grid */}
                                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth custom-scrollbar pr-1">
                                        <div className="flex min-h-full">
                                            {/* Time Labels Column */}
                                            <div className="w-16 shrink-0 border-r border-slate-100 bg-slate-50/40">
                                                {timeSlots.map((time, i) => {
                                                    const isFullHour = i % 12 === 0;
                                                    const isHalfHour = i % 12 === 6;
                                                    return (
                                                        <div key={time} className="h-7 flex items-center justify-center">
                                                            {(isFullHour || isHalfHour) && (
                                                                <span className="text-[10px] font-black text-slate-400 bg-white px-1.5 py-0.5 rounded-md shadow-sm ring-1 ring-slate-100">{time}</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Days Columns */}
                                            {weekDays.map((day) => {
                                                const dayKey = format(day, 'yyyy-MM-dd');
                                                const daySlots = slotsByDayAndTime[dayKey] || {};
                                                return (
                                                    <div key={dayKey} className="flex-1 border-r border-slate-100 last:border-r-0 relative group">
                                                        {timeSlots.map((time, i) => {
                                                            const slot = daySlots[time];
                                                            const isFullHour = i % 12 === 0;
                                                            
                                                            const timeDate = slot?.startTime.toDate();
                                                            const isPast = timeDate ? timeDate < addHours(new Date(), 12) : false;
                                                            let bgColor = "hover:bg-slate-50/50";
                                                            let isClickable = false;

                                                            if (slot?.status === 'available') {
                                                                if (isPast) {
                                                                    bgColor = "bg-slate-200/40 cursor-not-allowed border-slate-300/10";
                                                                } else {
                                                                    bgColor = "bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.15)]";
                                                                    isClickable = true;
                                                                }
                                                            } else if (slot?.status === 'booked') {
                                                                bgColor = "bg-red-400/80 cursor-not-allowed shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.15)]";
                                                            }

                                                            return (
                                                                <div
                                                                    key={time}
                                                                    onMouseEnter={() => setHoveredSlot(`${dayKey}-${time}`)}
                                                                    onMouseLeave={() => hoveredSlot === `${dayKey}-${time}` && setHoveredSlot(null)}
                                                                    onClick={() => isClickable && handleSlotClick(day, time)}
                                                                    className={cn(
                                                                        "h-7 transition-all relative border-b border-dashed border-slate-100",
                                                                        isFullHour && "border-b-slate-200 border-solid",
                                                                        bgColor
                                                                    )}
                                                                >
                                                                    {hoveredSlot === `${dayKey}-${time}` && isClickable && (
                                                                        <div className="absolute inset-0 flex items-center justify-center bg-white/25 pointer-events-none">
                                                                            <div className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xl z-20 transform scale-110 tracking-widest">{time}</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : !isPackageMissing && (
                            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8 py-16 bg-slate-50/50 rounded-[40px] border-4 border-dashed border-slate-100/50">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner ring-8 ring-slate-100/30">
                                    <User className="w-12 h-12 text-slate-300" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em]">Takvimi görüntülemek için<br/>Lütfen bir öğretmen seçin.</p>
                                    <div className="flex justify-center gap-1.5">
                                        {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-200/50" />)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Footer Area with Timezone indicator replaced by header select */}
            <div className="max-w-6xl mx-auto pt-8">
                <div className="bg-slate-50 rounded-[40px] p-8 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-100">
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Mutlu Dersler Dileriz! ☀️</p>
                </div>
            </div>

            {/* Modals */}
            <TeacherPreviewDialog
                teacherId={selectedTeacherId}
                isOpen={isTeacherPreviewOpen}
                onOpenChange={setIsTeacherPreviewOpen}
            />

            <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-10 max-w-lg">
                    <AlertDialogHeader className="items-center text-center space-y-5">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                            <CalendarIcon className="w-10 h-10 text-primary" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">DERSİ ONAYLA</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 font-semibold text-base leading-relaxed">
                            <span className="block mt-3 font-bold text-primary bg-primary/5 p-5 rounded-[20px] text-lg border-2 border-primary/10">
                                {selectedDate && format(selectedDate, 'dd MMMM yyyy, EEEE', { locale: tr })}
                                <br />
                                Saat: {selectedSlot && formatInTimeZone(selectedSlot.startTime.toDate(), selectedTimeZone, 'HH:mm')}
                            </span>
                            <span className="block mt-6 px-3 text-sm">Seçilen ders programı kaydedilecektir. Devam etmek istiyor musunuz?</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-3">
                        <AlertDialogCancel className="rounded-xl h-14 font-bold text-base border-2 border-slate-100 flex-1 hover:bg-slate-50">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBookLesson} disabled={isBooking} className="rounded-xl h-14 bg-primary font-bold text-base flex-1 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            {isBooking ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Dersi Planla"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
