
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, updateDoc, where, query, increment, Timestamp, writeBatch, getDoc, arrayRemove } from 'firebase/firestore';
import { Loader2, ArrowLeft, Info, BookOpen, User, Calendar as CalendarIcon, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { isSameDay, toDate, addMinutes, isBefore } from 'date-fns';
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

const getCourseDetailsFromPackageCode = (code: string) => {
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', lessons: 1, duration: 30 };

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


const MAX_FREE_TRIALS = 3;

// Static teacher list to avoid permission issues
const teachers = [
    { id: 'MpzNp3vXBnQiSnjN21fVyWxl1m33', firstName: 'Tuba', lastName: 'Kodak' },
    { id: 'xlIxFqIdb9einW0BgpIFUM0RrXa2', firstName: 'İbrahim', lastName: 'Can' },
];


export default function DersPlanlaPage() {
    const router = useRouter();
    const { user } = useUser();
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


    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

    const childrenRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return collection(db, 'users', user.uid, 'children');
    }, [db, user?.uid]);

    const { data: children, isLoading: areChildrenLoading } = useCollection(childrenRef);

    const selectedChildData = useMemo(() => children?.find(c => c.id === selectedChildId), [children, selectedChildId]);
    
    useEffect(() => {
        if (userData?.timezone) {
            setSelectedTimeZone(userData.timezone);
        } else if (typeof window !== 'undefined') {
            setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
    }, [userData]);

    // Logic to determine available booking modes for the selected child
    useEffect(() => {
        if (selectedChildData) {
            const hasPackage = selectedChildData.assignedPackage && selectedChildData.remainingLessons > 0;
            const canTakeFreeTrial = !selectedChildData.hasUsedFreeTrial && (userData?.freeTrialsUsed || 0) < MAX_FREE_TRIALS;

            if (canTakeFreeTrial) {
                setBookingMode('free');
                 setSelectedPackage('FREE_TRIAL');
            } else if (hasPackage) {
                setBookingMode('paid');
                setSelectedPackage(selectedChildData.assignedPackage);
            } else {
                setBookingMode('paid'); // Default, but will be disabled
                setSelectedPackage('');
            }
        } else {
            setBookingMode('paid');
            setSelectedPackage('');
        }
    }, [selectedChildData, userData]);


    const handleTimeZoneChange = async (tz: string) => {
        setSelectedTimeZone(tz);
        if (userDocRef) {
            try {
                await updateDoc(userDocRef, { timezone: tz });
                toast({
                    title: 'Saat Dilimi Güncellendi',
                    description: `Saat diliminiz ${tz} olarak ayarlandı.`,
                });
            } catch (error) {
                console.error('Failed to update timezone:', error);
                toast({
                    variant: 'destructive',
                    title: 'Hata',
                    description: 'Saat dilimi güncellenirken bir sorun oluştu.',
                });
            }
        }
    };

    const lessonSlotsRef = useMemoFirebase(() => {
        if (!db || !selectedTeacherId) return null;
        return query(collection(db, 'lesson-slots'), where('status', '==', 'available'), where('teacherId', '==', selectedTeacherId));
    }, [db, selectedTeacherId]);

    const { data: availableSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsRef);

    const availableDays = useMemo(() => {
        if (!availableSlots || !selectedTimeZone) return [];
        return availableSlots.map(slot => toZonedTime(slot.startTime.seconds * 1000, selectedTimeZone));
    }, [availableSlots, selectedTimeZone]);
    
    const slotsForSelectedDate = useMemo(() => {
        if (!availableSlots || !selectedDate || !selectedTimeZone || !selectedPackage) return [];

        const courseDetails = getCourseDetailsFromPackageCode(selectedPackage);
        if (!courseDetails) return [];
        
        const lessonDuration = courseDetails.duration;
        const requiredConsecutiveSlots = Math.ceil((lessonDuration + 5) / 5); // Add 5 min break

        const fiveMinSlots = availableSlots
            .filter(slot => {
                const zonedDate = toZonedTime(slot.startTime.seconds * 1000, selectedTimeZone);
                return isSameDay(zonedDate, selectedDate);
            })
            .map(slot => ({
                ...slot,
                startTimeObj: slot.startTime.toDate()
            }))
            .sort((a, b) => a.startTimeObj.getTime() - b.startTimeObj.getTime());
            
        const validStartTimes: any[] = [];
        
        for (let i = 0; i <= fiveMinSlots.length - requiredConsecutiveSlots; i++) {
            const potentialStartTime = fiveMinSlots[i];
            
            // Check if this slot is already part of a found valid slot to avoid duplicates
            if (validStartTimes.some(s => s.startTimeObj >= potentialStartTime.startTimeObj)) {
                continue;
            }

            let isConsecutive = true;
            for (let j = 1; j < requiredConsecutiveSlots; j++) {
                const expectedNextTime = addMinutes(fiveMinSlots[i + j - 1].startTimeObj, 5);
                if (fiveMinSlots[i + j].startTimeObj.getTime() !== expectedNextTime.getTime()) {
                    isConsecutive = false;
                    break;
                }
            }

            if (isConsecutive) {
                validStartTimes.push(potentialStartTime);
            }
        }
        
        return validStartTimes;

    }, [availableSlots, selectedDate, selectedTimeZone, selectedPackage]);
    
    const handleSlotClick = (slot: { id: string, startTime: Timestamp, teacherId: string }) => {
         if (!user || !userData) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Giriş yapmalısınız.' });
            return;
        }

        if (!selectedChildId) {
            toast({ variant: 'destructive', title: 'Eksik Bilgi', description: 'Lütfen dersi alacak çocuğu seçin.' });
            return;
        }

        const hasPackage = selectedChildData?.assignedPackage && selectedChildData?.remainingLessons > 0;
        const canTakeFreeTrial = !selectedChildData?.hasUsedFreeTrial && (userData.freeTrialsUsed || 0) < MAX_FREE_TRIALS;

        if (bookingMode === 'free' && !canTakeFreeTrial) {
             toast({ variant: 'destructive', title: 'Deneme Hakkı Yok', description: 'Bu çocuk için ücretsiz deneme dersi hakkı bulunmuyor veya aile limiti aşıldı.' });
             return;
        }

        if (bookingMode === 'paid' && !hasPackage) {
            toast({ variant: 'destructive', title: 'Ders Hakkı Kalmadı', description: 'Bu çocuk için atanmış ders paketi bulunmuyor veya ders hakkı kalmadı.' });
            return;
        }

        setSelectedSlot(slot);
        setIsConfirming(true);
    };
    
    const handleBookLesson = async () => {
        if (!user || !db || !userDocRef || !userData || !selectedSlot || !selectedChildData || !selectedPackage) return;
    
        setIsBooking(true);
        const batch = writeBatch(db);

        const courseDetails = getCourseDetailsFromPackageCode(selectedPackage);
        if (!courseDetails) {
             toast({ variant: 'destructive', title: 'Hata', description: 'Kurs detayları bulunamadı.' });
             setIsBooking(false);
             return;
        }

        const lessonDuration = courseDetails.duration;
        const totalDuration = lessonDuration + 5; // including break
        const numSlotsToBook = Math.ceil(totalDuration / 5);
        const startTime = selectedSlot.startTime.toDate();
        
        try {
            const slotRefsToUpdate: string[] = [];
             for (let i = 0; i < numSlotsToBook; i++) {
                const slotTime = addMinutes(startTime, i * 5);
                const q = query(collection(db, 'lesson-slots'), 
                                where('teacherId', '==', selectedSlot.teacherId), 
                                where('startTime', '==', Timestamp.fromDate(slotTime)));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docId = querySnapshot.docs[0].id;
                    slotRefsToUpdate.push(docId);
                    const slotDocRef = doc(db, 'lesson-slots', docId);
                    batch.update(slotDocRef, { 
                        status: 'booked',
                        bookedBy: user.uid,
                        childId: selectedChildId,
                        packageCode: bookingMode === 'free' ? 'FREE_TRIAL' : selectedPackage
                    });
                } else {
                     throw new Error(`Saat ${format(slotTime, 'HH:mm')} için slot bulunamadı. Lütfen tekrar deneyin.`);
                }
            }

            if (slotRefsToUpdate.length !== numSlotsToBook) {
                throw new Error("Ders için yeterli ardışık zaman dilimi bulunamadı. Lütfen başka bir saat seçin.");
            }
            
            // Update user/child lesson counts
            const childDocRef = doc(db, 'users', user.uid, 'children', selectedChildId);
            let successMessage = '';
    
            if (bookingMode === 'free') {
                batch.update(userDocRef, { freeTrialsUsed: increment(1) });
                batch.update(childDocRef, { hasUsedFreeTrial: true });
                successMessage = 'Ücretsiz deneme dersiniz başarıyla planlandı.';
            } else { // 'paid'
                batch.update(childDocRef, { remainingLessons: increment(-1) });
                successMessage = 'Dersiniz başarıyla planlandı. Çocuğunuzun kalan ders sayısı güncellendi.';
            }
        
            await batch.commit();
    
            const updatedChildSnap = await getDoc(childDocRef);
            if (bookingMode === 'paid' && updatedChildSnap.exists() && updatedChildSnap.data().remainingLessons === 0) {
                const finishedPackage = updatedChildSnap.data().assignedPackage;
                
                const secondBatch = writeBatch(db);
                secondBatch.update(childDocRef, {
                    assignedPackage: null,
                    assignedPackageName: null,
                    remainingLessons: 0,
                    finishedPackage: finishedPackage
                });
                secondBatch.update(userDocRef, {
                    enrolledPackages: arrayRemove(finishedPackage),
                });
                await secondBatch.commit();

                toast({
                    title: 'Paket Tamamlandı!',
                    description: `Çocuğunuz ${finishedPackage} paketindeki tüm dersleri tamamladı.`,
                });
            } else {
                 toast({
                    title: 'Ders Planlandı!',
                    description: successMessage,
                    className: 'bg-green-500 text-white'
                });
            }
           
            router.push('/ebeveyn-portali/paketlerim');

        } catch(error) {
             const errorMessage = (error instanceof Error) ? error.message : 'Ders planlanırken bir hata oluştu.';
             toast({ variant: 'destructive', title: 'Hata', description: errorMessage });
             console.error(error);
        } finally {
            setIsBooking(false);
            setIsConfirming(false);
            setSelectedSlot(null);
        }
    };
    
    const canTakeFreeTrial = !selectedChildData?.hasUsedFreeTrial && (userData?.freeTrialsUsed || 0) < MAX_FREE_TRIALS;
    const hasPackage = selectedChildData?.assignedPackage && selectedChildData?.remainingLessons > 0;
    const canBook = selectedChildId && selectedTeacherId && ( (bookingMode === 'free' && canTakeFreeTrial) || (bookingMode === 'paid' && hasPackage) );
    
    if (isUserLoading || areChildrenLoading || !selectedTimeZone) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                     <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => router.push('/ebeveyn-portali')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Ders Planla</h2>
                        <p className="text-muted-foreground">
                            Öğretmenlerimizin müsait olduğu zamanlardan birini seçin.
                        </p>
                    </div>
                </div>
            </div>

            <Card className="p-4 sm:p-6">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                     <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="space-y-2">
                             <Label htmlFor="child-select" className="font-semibold text-lg">1. Adım: Öğrenci ve Ders Türü</Label>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                        <SelectTrigger id="child-select" >
                                            <SelectValue placeholder="Çocuk Seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {children && children.map(child => (
                                                <SelectItem key={child.id} value={child.id}>{child.firstName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {selectedChildId && (
                                     <div>
                                        <Select value={bookingMode} onValueChange={(value) => setBookingMode(value as 'free' | 'paid')}>
                                            <SelectTrigger id="package-select">
                                                <SelectValue placeholder="Ders Türü Seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {canTakeFreeTrial && <SelectItem value="free">Ücretsiz Deneme Dersi (30 dk)</SelectItem>}
                                                {hasPackage && <SelectItem value="paid">{getCourseDetailsFromPackageCode(selectedChildData.assignedPackage)?.courseName} ({getCourseDetailsFromPackageCode(selectedChildData.assignedPackage)?.duration} dk)</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                     </div>
                                )}
                            </div>
                            <div className="mt-2 text-center sm:text-left">
                                {!selectedChildId ? (
                                    <Badge variant="outline">Lütfen bir çocuk seçin.</Badge>
                                ) : bookingMode === 'free' && canTakeFreeTrial ? (
                                    <Badge variant="default" className='bg-green-100 text-green-800'>
                                        <BookOpen className="w-3 h-3 mr-1"/>
                                        Bu çocuk için deneme dersi hakkı mevcut.
                                    </Badge>
                                ) : bookingMode === 'paid' && hasPackage ? (
                                    <Badge>Kalan Ders: {selectedChildData?.remainingLessons}</Badge>
                                ) : (
                                    <Badge variant="destructive">Bu çocuk için seçilen türde ders hakkı yok.</Badge>
                                )}
                            </div>
                        </div>

                         {/* Step 2 */}
                        <div className="space-y-2">
                            <Label htmlFor="teacher-select" className="font-semibold text-lg">2. Adım: Öğretmen Seçimi</Label>
                             <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId} disabled={!selectedChildId}>
                                <SelectTrigger id="teacher-select">
                                    <SelectValue placeholder="Öğretmen Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers.map(teacher => (
                                        <SelectItem key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                         {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <Label className="font-semibold text-lg mb-2 self-start">3. Adım: Takvim</Label>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                locale={tr}
                                modifiers={{
                                    available: availableDays,
                                }}
                                modifiersClassNames={{
                                    available: 'bg-primary/20 text-primary-foreground rounded-full',
                                }}
                                disabled={(date) => {
                                    if (!selectedTeacherId) return true;
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (date < today) return true;
                                    return !availableDays.some(availableDay => isSameDay(date, availableDay));
                                }}
                                className="rounded-md border"
                            />
                        </div>
                    </div>
                     <div className="h-full">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-center lg:text-left mb-2">
                                     4. Adım: Müsait Saatler
                                </h3>
                                 <p className="text-sm text-muted-foreground text-center lg:text-left mb-4">
                                     {selectedDate ? formatInTimeZone(selectedDate, selectedTimeZone, 'dd MMMM yyyy', { locale: tr }) : 'Bir tarih seçin'}
                                     {selectedDate && <span className="text-xs text-muted-foreground ml-2">({selectedTimeZone})</span>}
                                 </p>
                            </div>
                           
                            {areSlotsLoading ? (
                                 <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/50">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : selectedDate && slotsForSelectedDate.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {slotsForSelectedDate.map(slot => (
                                        <Button
                                            key={slot.id}
                                            variant="outline"
                                            className="h-12 text-base"
                                            onClick={() => handleSlotClick(slot)}
                                            disabled={isBooking || !canBook}
                                        >
                                            {formatInTimeZone(slot.startTime.toDate(), selectedTimeZone, 'HH:mm')}
                                        </Button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/50">
                                    <p className="text-muted-foreground text-center px-4">
                                        {selectedTeacherId ? "Bu tarih için seçtiğiniz derse uygun müsaitlik bulunmamaktadır." : "Lütfen bir öğretmen seçin."}
                                    </p>
                                </div>
                            )}
                             <div className="mt-6 w-full max-w-sm mx-auto lg:mx-0">
                                <Label htmlFor="timezone-select">Saat Diliminiz:</Label>
                                <Select value={selectedTimeZone} onValueChange={handleTimeZoneChange}>
                                    <SelectTrigger id="timezone-select" className="mt-2">
                                        <SelectValue placeholder="Saat dilimi seçin..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timezones.map(tz => (
                                            <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
             <Alert className="mt-8">
                <Info className="h-4 w-4" />
                <AlertDescription>
                    Derse 24 saat kalana kadar ücretsiz iptal edebilirsiniz. 24 saatten az kalan dersler icin 2 degisim hakkiniz vardir
                </AlertDescription>
            </Alert>

            <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ders Planını Onayla</AlertDialogTitle>
                        <AlertDialogDescription>
                            Lütfen aşağıdaki bilgileri kontrol edin ve dersi planlamak için onaylayın.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {selectedSlot && (
                         <div className="space-y-4 my-4 text-sm">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Çocuk:</strong> {selectedChildData?.firstName}</p>
                            </div>
                             <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Öğretmen:</strong> {teachers.find(t => t.id === selectedSlot.teacherId)?.firstName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Tarih:</strong> {formatInTimeZone(selectedSlot.startTime.toDate(), selectedTimeZone, 'dd MMMM yyyy', { locale: tr })}</p>
                            </div>
                             <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Saat:</strong> {formatInTimeZone(selectedSlot.startTime.toDate(), selectedTimeZone, 'HH:mm')} ({selectedTimeZone})</p>
                            </div>
                             <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Ders Türü:</strong> {bookingMode === 'free' ? 'Ücretsiz Deneme Dersi' : `${getCourseDetailsFromPackageCode(selectedPackage)?.courseName} (${getCourseDetailsFromPackageCode(selectedPackage)?.duration} dk)`}</p>
                            </div>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedSlot(null)}>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBookLesson} disabled={isBooking}>
                            {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Onayla ve Planla
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

