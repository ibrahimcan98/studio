
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, where, query, increment, Timestamp, writeBatch, getDocs, getDoc, arrayRemove, addDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Info, BookOpen, User, Calendar as CalendarIcon, Package, Clock, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { toZonedTime, formatInTimeZone, format } from 'date-fns-tz';
import { isSameDay, addMinutes, addDays, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import timezones from '@/data/timezones.json';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const teachers = [
    { id: 'O2mQCONyczVkAXcgAMBSPpeIfJw2', firstName: 'Tuba' },
];

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

export default function DersPlanlaPage() {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isBooking, setIsBooking] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState<string>('');
    const [selectedPackage, setSelectedPackage] = useState<string>('');
    const [bookingMode, setBookingMode] = useState<'free' | 'paid'>('paid');
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ id: string, startTime: Timestamp, teacherId: string } | null>(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

    // FIX: Properly memoized queries
    const userDocRef = useMemoFirebase(() => (user && db) ? doc(db, 'users', user.uid) : null, [user, db]);
    const { data: userData } = useDoc(userDocRef);

    const childrenRef = useMemoFirebase(() => (db && user) ? collection(db, 'users', user.uid, 'children') : null, [db, user]);
    const { data: children, refetch: refetchChildren } = useCollection(childrenRef);

    const selectedChildData = useMemo(() => children?.find(c => c.id === selectedChildId), [children, selectedChildId]);
    
    useEffect(() => {
        if (userData?.timezone) setSelectedTimeZone(userData.timezone);
        else if (typeof window !== 'undefined') setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, [userData]);

    useEffect(() => {
        if (selectedChildData) {
            const canTakeFreeTrial = !selectedChildData.hasUsedFreeTrial && (userData?.freeTrialsUsed || 0) < MAX_FREE_TRIALS;
            if (canTakeFreeTrial) { setBookingMode('free'); setSelectedPackage('FREE_TRIAL'); }
            else if (selectedChildData.assignedPackage) { setBookingMode('paid'); setSelectedPackage(selectedChildData.assignedPackage); }
        }
    }, [selectedChildData, userData]);

    const lessonSlotsRef = useMemoFirebase(() => (db && selectedTeacherId) ? query(collection(db, 'lesson-slots'), where('teacherId', '==', selectedTeacherId)) : null, [db, selectedTeacherId]);
    const { data: allTeacherSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsRef);

    const availableSlots = useMemo(() => allTeacherSlots?.filter(slot => slot.status === 'available' && slot.startTime.toDate() > new Date()) || [], [allTeacherSlots]);
    const availableDays = useMemo(() => availableSlots.map(slot => toZonedTime(slot.startTime.seconds * 1000, selectedTimeZone)), [availableSlots, selectedTimeZone]);
    
    const slotsForSelectedDate = useMemo(() => {
        if (!availableSlots || !selectedDate || !selectedTimeZone || !selectedPackage) return [];
        const courseDetails = getCourseDetailsFromPackageCode(selectedPackage);
        if (!courseDetails) return [];
        const requiredConsecutiveSlots = Math.ceil((courseDetails.duration + 5) / 5);
        
        const daySlots = availableSlots
            .filter(slot => isSameDay(toZonedTime(slot.startTime.seconds * 1000, selectedTimeZone), selectedDate))
            .sort((a, b) => a.startTime.seconds - b.startTime.seconds);
            
        const validStarts: any[] = [];
        for (let i = 0; i <= daySlots.length - requiredConsecutiveSlots; i++) {
            let isConsecutive = true;
            for (let j = 1; j < requiredConsecutiveSlots; j++) {
                if (daySlots[i + j].startTime.seconds - daySlots[i + j - 1].startTime.seconds !== 300) { isConsecutive = false; break; }
            }
            if (isConsecutive) validStarts.push(daySlots[i]);
        }
        return validStarts;
    }, [availableSlots, selectedDate, selectedTimeZone, selectedPackage]);

    const handleBookLesson = async () => {
        if (!user || !db || !userDocRef || !selectedSlot || !selectedPackage) return;
        setIsBooking(true);
        const batch = writeBatch(db);
        const courseDetails = getCourseDetailsFromPackageCode(selectedPackage);
        if (!courseDetails) return;

        const numSlots = Math.ceil((courseDetails.duration + 5) / 5);
        const startTime = selectedSlot.startTime.toDate();
        
        try {
            for (let i = 0; i < numSlots; i++) {
                const slotTime = addMinutes(startTime, i * 5);
                const q = query(collection(db, 'lesson-slots'), where('teacherId', '==', selectedSlot.teacherId), where('startTime', '==', Timestamp.fromDate(slotTime)));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    batch.update(snap.docs[0].ref, { status: 'booked', bookedBy: user.uid, childId: selectedChildId, packageCode: selectedPackage });
                }
            }
            
            const childDocRef = doc(db, 'users', user.uid, 'children', selectedChildId);
            if (bookingMode === 'free') {
                batch.update(userDocRef, { freeTrialsUsed: increment(1) });
                batch.update(childDocRef, { hasUsedFreeTrial: true });
            } else {
                batch.update(childDocRef, { remainingLessons: increment(-1) });
            }
        
            await batch.commit();
            toast({ title: 'Ders Planlandı!', description: 'Dersiniz başarıyla takvime eklendi.', className: 'bg-green-500 text-white' });
            router.push('/ebeveyn-portali/derslerim');
        } catch(error) {
             toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız oldu.' });
        } finally { setIsBooking(false); setIsConfirming(false); }
    };

    if (userLoading || !selectedTimeZone) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen font-sans">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.push('/ebeveyn-portali')}><ArrowLeft className="h-5 w-5" /></Button>
                <div><h2 className="text-3xl font-bold tracking-tight text-slate-900">Ders Planla</h2><p className="text-muted-foreground text-sm">Öğretmenlerimizin takviminden uygun bir zaman seçin.</p></div>
            </div>

            <Card className="p-8 bg-white border-none shadow-sm rounded-3xl">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div className="space-y-3">
                             <Label className="font-bold text-slate-800">1. Öğrenci Seçimi</Label>
                             <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Çocuğunuzu seçin" /></SelectTrigger>
                                <SelectContent>{children?.map(child => <SelectItem key={child.id} value={child.id}>{child.firstName}</SelectItem>)}</SelectContent>
                             </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="font-bold text-slate-800">2. Öğretmen Seçimi</Label>
                            <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId} disabled={!selectedChildId}>
                                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Öğretmen seçin" /></SelectTrigger>
                                <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.firstName}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-3 flex flex-col">
                            <Label className="font-bold text-slate-800">3. Tarih Seçimi</Label>
                            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={tr} className="rounded-2xl border-slate-100 shadow-sm self-center"
                                modifiers={{ available: availableDays }}
                                modifiersClassNames={{ available: 'bg-primary/10 text-primary font-bold rounded-full' }}
                                disabled={(date) => date < new Date() || !availableDays.some(d => isSameDay(date, d))}
                            />
                        </div>
                    </div>
                     <div className="space-y-8">
                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 text-lg">4. Müsait Saatler</h3>
                            {areSlotsLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : (
                                <div className="grid grid-cols-3 gap-3">
                                    {slotsForSelectedDate.map(slot => (
                                        <Button key={slot.id} variant="outline" className="h-12 rounded-xl border-slate-100 hover:bg-primary/5 hover:border-primary" onClick={() => { setSelectedSlot(slot); setIsConfirming(true); }}>
                                            {formatInTimeZone(slot.startTime.toDate(), selectedTimeZone, 'HH:mm')}
                                        </Button>
                                    ))}
                                    {slotsForSelectedDate.length === 0 && <p className="col-span-full text-slate-400 text-sm italic">Uygun saat bulunamadı.</p>}
                                </div>
                            )}
                        </div>
                         <div className="pt-6 border-t">
                            <Label className="text-xs text-slate-400 uppercase font-bold tracking-widest">Saat Dilimi</Label>
                            <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                                <SelectTrigger className="mt-2 h-10 bg-slate-50 border-none rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>{timezones.map(tz => <SelectItem key={tz.value} value={tz.value} className="text-xs">{tz.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8">
                    <AlertDialogHeader><AlertDialogTitle className="text-2xl font-black">Dersi Onayla</AlertDialogTitle><AlertDialogDescription>Seçilen ders programı kaydedilecektir.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter className="mt-6"><AlertDialogCancel className="rounded-xl">Vazgeç</AlertDialogCancel><AlertDialogAction onClick={handleBookLesson} disabled={isBooking} className="rounded-xl bg-primary font-bold">{isBooking ? "Kaydediliyor..." : "Dersi Planla"}</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
