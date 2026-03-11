'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, where, query, increment, Timestamp, writeBatch, getDocs, getDoc, arrayRemove, addDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Info, BookOpen, User, Calendar as CalendarIcon, Package, Clock, Plus, Eye, PlayCircle, Sprout, Heart, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { AddChildForm } from '@/components/parent-portal/add-child-form';

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
                    <DialogDescription className="text-base font-medium text-slate-500">Öğretmenimizin profili ve tanıtım videosu.</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : teacherData ? (
                    <div className="space-y-6 py-4">
                        {teacherData.introVideoUrl && (
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-lg relative group">
                                <iframe 
                                    src={teacherData.introVideoUrl.replace('watch?v=', 'embed/').replace('kapwing.com/e/', 'kapwing.com/w/')}
                                    className="w-full h-full border-none"
                                    allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}

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
    const [selectedPackage, setSelectedPackage] = useState<string>('');
    const [bookingMode, setBookingMode] = useState<'free' | 'paid'>('paid');
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ id: string, startTime: Timestamp, teacherId: string } | null>(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
    const [isTeacherPreviewOpen, setIsTeacherPreviewOpen] = useState(false);
    const [expandedHour, setExpandedHour] = useState<string | null>(null);

    const userDocRef = useMemoFirebase(() => (user && db) ? doc(db, 'users', user.uid) : null, [user, db]);
    const { data: userData } = useDoc(userDocRef);

    const childrenRef = useMemoFirebase(() => (db && user) ? collection(db, 'users', user.uid, 'children') : null, [db, user]);
    const { data: children, isLoading: childrenLoading, refetch: refetchChildren } = useCollection(childrenRef);

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

    const groupedSlotsByHour = useMemo(() => {
        const groups: { [key: string]: any[] } = {};
        slotsForSelectedDate.forEach(slot => {
            const hour = formatInTimeZone(slot.startTime.toDate(), selectedTimeZone, 'HH:00');
            if (!groups[hour]) groups[hour] = [];
            groups[hour].push(slot);
        });
        return groups;
    }, [slotsForSelectedDate, selectedTimeZone]);

    const availableHours = useMemo(() => Object.keys(groupedSlotsByHour).sort(), [groupedSlotsByHour]);

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
            toast({ title: 'Ders Planlandı!', description: 'Dersiniz başarıyla takvime eklendi.', className: 'bg-green-500 text-white font-bold' });
            router.push('/ebeveyn-portali/derslerim');
        } catch(error) {
             toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız oldu.' });
        } finally { setIsBooking(false); setIsConfirming(false); }
    };

    if (userLoading || !selectedTimeZone) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen font-sans text-slate-900">
            <div className="flex items-center gap-5 max-w-6xl mx-auto">
                <Button variant="outline" size="icon" onClick={() => router.push('/ebeveyn-portali')} className="h-11 w-11 rounded-xl border-2 hover:bg-slate-100"><ArrowLeft className="h-5 w-5" /></Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ders Planla</h2>
                    <p className="text-slate-500 text-base font-medium mt-0.5">Öğretmenlerimizin takviminden uygun bir zaman seçin.</p>
                </div>
            </div>

            <Card className="p-8 bg-white border-none shadow-xl rounded-[32px] max-w-6xl mx-auto">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div className="space-y-3">
                             <Label className="font-semibold text-primary uppercase tracking-wider text-[11px]">1. Öğrenci Seçimi</Label>
                             {childrenLoading ? (
                                 <div className="h-14 bg-slate-50 animate-pulse rounded-xl" />
                             ) : children && children.length > 0 ? (
                                 <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                    <SelectTrigger className="h-14 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:ring-primary/20 text-base font-semibold px-5 text-slate-800">
                                        <SelectValue placeholder="Çocuğunuzu seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {children?.map(child => <SelectItem key={child.id} value={child.id} className="rounded-lg font-semibold text-sm py-2.5">{child.firstName}</SelectItem>)}
                                    </SelectContent>
                                 </Select>
                             ) : (
                                 <div className="flex flex-col gap-3">
                                    <p className="text-sm text-slate-500 font-medium italic">Henüz bir çocuk eklememişsiniz.</p>
                                    {user && (
                                        <AddChildForm userId={user.uid} onChildAdded={refetchChildren}>
                                            <Button variant="outline" className="w-full h-14 rounded-xl border-dashed border-2 border-slate-200 hover:bg-primary/5 hover:text-primary hover:border-primary transition-all font-bold text-base">
                                                <Plus className="mr-2 h-5 w-5" /> Yeni Çocuk Ekle
                                            </Button>
                                        </AddChildForm>
                                    )}
                                 </div>
                             )}
                        </div>

                        <div className="space-y-3">
                            <Label className="font-semibold text-primary uppercase tracking-wider text-[11px]">2. Öğretmen Seçimi</Label>
                            <div className="flex gap-2.5">
                                <Select value={selectedTeacherId} onValueChange={(v) => { setSelectedTeacherId(v); setExpandedHour(null); }}>
                                    <SelectTrigger className="h-14 rounded-xl border-2 border-slate-100 bg-slate-50/50 flex-1 focus:ring-primary/20 text-base font-semibold px-5 text-slate-800 disabled:opacity-50">
                                        <SelectValue placeholder="Öğretmen seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {teachers.map(t => <SelectItem key={t.id} value={t.id} className="rounded-lg font-semibold text-sm py-2.5">{t.firstName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {selectedTeacherId && (
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-14 w-14 rounded-xl border-2 border-slate-100 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                                        onClick={() => setIsTeacherPreviewOpen(true)}
                                    >
                                        <Eye className="w-6 h-6" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-3 flex flex-col">
                            <Label className="font-semibold text-primary uppercase tracking-wider text-[11px] mb-1">3. Tarih Seçimi</Label>
                            <Calendar mode="single" selected={selectedDate} onSelect={(d) => { setSelectedDate(d); setExpandedHour(null); }} locale={tr} 
                                className="rounded-[24px] border-2 border-slate-50 shadow-md self-center bg-slate-50/30 p-6"
                                modifiers={{ available: availableDays }}
                                modifiersClassNames={{ available: 'bg-primary/10 text-primary font-bold rounded-full scale-105' }}
                                disabled={(date) => date < new Date() || !availableDays.some(d => isSameDay(date, d))}
                            />
                        </div>
                    </div>

                     <div className="space-y-8 lg:border-l-2 lg:pl-12 border-slate-50 min-h-[400px]">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                                    {expandedHour ? (
                                        <button onClick={() => setExpandedHour(null)} className="flex items-center gap-2 text-primary hover:underline group">
                                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            Saatlere Geri Dön
                                        </button>
                                    ) : "4. Müsait Saatler"}
                                </h3>
                                {selectedTeacherId && (
                                    <Badge variant="secondary" className="bg-primary text-white border-none rounded-lg px-4 py-1.5 text-xs font-bold shadow-sm">
                                        {format(selectedDate || new Date(), 'dd MMMM', { locale: tr })}
                                    </Badge>
                                )}
                            </div>
                            {areSlotsLoading ? (
                                <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary/30" /></div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {!expandedHour ? (
                                        // HOUR GRID
                                        availableHours.map(hour => (
                                            <Button 
                                                key={hour} 
                                                variant="outline" 
                                                className="h-14 rounded-xl border-2 border-slate-100 font-bold text-lg text-slate-700 hover:bg-primary/5 hover:border-primary transition-all shadow-sm" 
                                                onClick={() => setExpandedHour(hour)}
                                            >
                                                {hour}
                                            </Button>
                                        ))
                                    ) : (
                                        // MINUTE GRID (DETAILED SLOTS)
                                        groupedSlotsByHour[expandedHour]?.map(slot => (
                                            <Button 
                                                key={slot.id} 
                                                variant="outline" 
                                                className="h-12 rounded-xl border-2 border-primary/20 bg-primary/5 font-bold text-base text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm" 
                                                onClick={() => { setSelectedSlot(slot); setIsConfirming(true); }}
                                            >
                                                {formatInTimeZone(slot.startTime.toDate(), selectedTimeZone, 'HH:mm')}
                                            </Button>
                                        ))
                                    )}
                                    {availableHours.length === 0 && (
                                        <div className="col-span-full py-16 text-center bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-100">
                                            <CalendarIcon className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider px-8">Seçilen gün için müsait saat bulunamadı.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                         <div className="pt-8 border-t-2 border-slate-50">
                            <div className="bg-slate-50 rounded-[20px] p-5 flex items-center justify-between shadow-inner">
                                <div className="flex items-center gap-3.5">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm"><Clock className="w-5 h-5 text-primary" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Yerel Saat Dilimi</p>
                                        <p className="text-sm font-bold text-slate-700">{selectedTimeZone.split('/').pop()?.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                                    <SelectTrigger className="w-auto h-9 bg-white border-2 border-slate-100 rounded-lg text-xs font-bold shadow-sm px-4 focus:ring-0">Değiştir</SelectTrigger>
                                    <SelectContent className="rounded-xl">{timezones.map(tz => <SelectItem key={tz.value} value={tz.value} className="text-xs font-semibold">{tz.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                 </div>
            </Card>

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