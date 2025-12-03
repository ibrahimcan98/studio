
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError, useDoc } from '@/firebase';
import { collection, query, where, addDoc, deleteDoc, Timestamp, doc } from 'firebase/firestore';
import { Loader2, CheckCircle, User, Baby, Info, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format, set, startOfDay, isSameDay, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatInTimeZone, toZonedTime, toDate } from 'date-fns-tz';
import { COURSES } from '@/data/courses';


const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

type SlotDetails = {
    id: string;
    status: 'available' | 'booked';
    teacherId: string;
    bookedBy?: string;
    childId?: string;
    startTime: Timestamp;
    packageCode?: string;
};

const getCourseDetailsFromPackageCode = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: '30 dakika' };
    
    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '')];
    const course = COURSES.find(c => c.id === courseId);
    return course ? { courseName: course.title, duration: course.details.duration } : null;
}


function LessonDetailsDialog({ slot, isOpen, onOpenChange }: { slot: SlotDetails | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const db = useFirestore();
    const turkeyTimeZone = 'Europe/Istanbul';

    const parentDocRef = useMemoFirebase(() => {
        if (!db || !slot?.bookedBy) return null;
        return doc(db, 'users', slot.bookedBy);
    }, [db, slot?.bookedBy]);

    const childDocRef = useMemoFirebase(() => {
        if (!db || !slot?.bookedBy || !slot?.childId) return null;
        return doc(db, 'users', slot.bookedBy, 'children', slot.childId);
    }, [db, slot?.bookedBy, slot?.childId]);

    const { data: parentData, isLoading: isParentLoading } = useDoc(parentDocRef);
    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);

    if (!slot) return null;
    
    const childAge = childData?.dateOfBirth ? differenceInYears(new Date(), new Date(childData.dateOfBirth)) : 'N/A';
    const packageDetails = getCourseDetailsFromPackageCode(slot.packageCode);

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ders Detayları</DialogTitle>
                    <DialogDescription>
                         {formatInTimeZone(slot.startTime.toDate(), turkeyTimeZone, 'dd MMMM yyyy, HH:mm', { locale: tr })} (Türkiye Saati)
                    </DialogDescription>
                </DialogHeader>
                {isParentLoading || isChildLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6 pt-4">
                        {packageDetails && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><BookOpen /> Ders Bilgileri</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-2">
                                     <p><strong>Paket:</strong> {packageDetails.courseName} ({slot.packageCode === 'FREE_TRIAL' ? 'Deneme' : slot.packageCode})</p>
                                     <p><strong>Süre:</strong> {packageDetails.duration}</p>
                                </CardContent>
                            </Card>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><User /> Veli Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>İsim:</strong> {parentData?.firstName} {parentData?.lastName}</p>
                                <p><strong>Email:</strong> {parentData?.email}</p>
                                <p><strong>Saat Dilimi:</strong> {parentData?.timezone}</p>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Baby /> Çocuk Bilgileri</CardTitle>
                            </CardHeader>
                             <CardContent className="text-sm space-y-2">
                                <p><strong>İsim:</strong> {childData?.firstName}</p>
                                <p><strong>Yaş:</strong> {childAge}</p>
                                <p><strong>Seviye:</strong> {childData?.level}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default function TakvimYonetimiPage() {
    const { user } = useUser();
    const db = useFirestore();
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({});
    const [selectedSlot, setSelectedSlot] = useState<SlotDetails | null>(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const turkeyTimeZone = 'Europe/Istanbul';

    const lessonSlotsQuery = useMemoFirebase(() => {
        if (!db || !user) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid));
    }, [db, user]);

    const { data: lessonSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsQuery);

    const activeDays = useMemo(() => {
        if (!lessonSlots) return [];
        return lessonSlots
            .filter(slot => slot.status === 'available')
            .map(slot => toZonedTime(slot.startTime.toDate(), turkeyTimeZone));
    }, [lessonSlots, turkeyTimeZone]);
    
    const slotsForSelectedDate = useMemo(() => {
        if (!lessonSlots || !selectedDate) return new Map<string, SlotDetails>();
        
        const slotsMap = new Map<string, SlotDetails>();
        
        lessonSlots.forEach(slot => {
            const zonedSlotDate = toZonedTime(slot.startTime.toDate(), turkeyTimeZone);
            if (isSameDay(zonedSlotDate, selectedDate)) {
                const time = format(zonedSlotDate, 'HH:mm');
                slotsMap.set(time, slot as SlotDetails);
            }
        });
        return slotsMap;
    }, [lessonSlots, selectedDate, turkeyTimeZone]);
    
    const handleTimeSlotClick = (time: string) => {
        const slot = slotsForSelectedDate.get(time);
        
        if (slot?.status === 'booked') {
            setSelectedSlot(slot);
            setIsDetailsDialogOpen(true);
            return;
        }

        if (!selectedDate || !user || !db) return;

        const [hours, minutes] = time.split(':').map(Number);
        
        const dateString = `${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`;
        const dateInTurkeyTz = toDate(dateString, { timeZone: turkeyTimeZone });
        const startTime = Timestamp.fromDate(dateInTurkeyTz);

        setIsSubmitting(prevState => ({ ...prevState, [time]: true }));
        
        if (slot) {
            // A slot exists, so we're deleting it (closing the slot)
            const slotDocRef = doc(db, 'lesson-slots', slot.id);
            deleteDoc(slotDocRef)
                .then(() => {
                    toast({ title: 'Kapatıldı', description: `${time} saati müsaitlikten kaldırıldı.` });
                })
                .catch(async (serverError) => {
                    const contextualError = new FirestorePermissionError({
                        operation: 'delete',
                        path: slotDocRef.path,
                    });
                    errorEmitter.emit('permission-error', contextualError);
                })
                .finally(() => {
                    setIsSubmitting(prevState => ({ ...prevState, [time]: false }));
                });

        } else {
             // No slot exists, so we're creating one (opening the slot)
             const newSlotData = {
                teacherId: user.uid,
                startTime: startTime,
                endTime: Timestamp.fromDate(new Date(startTime.toMillis() + 45 * 60 * 1000)),
                status: 'available',
                bookedBy: null,
                childId: null,
            };
            addDoc(collection(db, 'lesson-slots'), newSlotData)
                .then(() => {
                     toast({ title: 'Açıldı', description: `${time} saati müsait olarak eklendi.`, className: 'bg-green-500 text-white' });
                })
                .catch(async (serverError) => {
                    const contextualError = new FirestorePermissionError({
                        operation: 'create',
                        path: 'lesson-slots',
                        requestResourceData: newSlotData
                    });
                    errorEmitter.emit('permission-error', contextualError);
                })
                .finally(() => {
                    setIsSubmitting(prevState => ({ ...prevState, [time]: false }));
                });
        }
    };

    const getTeacherName = () => {
        if (user?.displayName) {
            return user.displayName.split(' ')[0];
        }
        if (user?.email) {
            const emailName = user.email.split('@')[0];
            return emailName.charAt(0).toUpperCase() + emailName.slice(1);
        }
        return 'Öğretmen';
    };


    if (areSlotsLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div>
                 <p className="text-muted-foreground mb-1">Hoş geldin, {getTeacherName()}!</p>
                <h2 className="text-3xl font-bold tracking-tight">Müsaitlik Takvimi (Türkiye Saati)</h2>
            </div>
            
            <Card className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={tr}
                            modifiers={{ active: activeDays }}
                            modifiersClassNames={{ active: 'bg-primary/20 text-primary-foreground rounded-full' }}
                            disabled={(date) => date < startOfDay(new Date())}
                            className="rounded-md border"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">
                            {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: tr }) : 'Bir tarih seçin'} için Saatler
                        </h3>
                        {selectedDate ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {timeSlots.map(time => {
                                    const slot = slotsForSelectedDate.get(time);
                                    const isBooked = slot?.status === 'booked';
                                    const isAvailable = slot?.status === 'available';
                                    const isClosed = !slot;

                                    let variant: "default" | "destructive" | "outline" = 'outline';
                                    
                                    if (isBooked) {
                                        variant = 'destructive';
                                    } else if (isAvailable) {
                                        variant = 'default';
                                    }

                                    return (
                                        <Button
                                            key={time}
                                            variant={variant}
                                            className="h-12 text-base relative"
                                            onClick={() => handleTimeSlotClick(time)}
                                            disabled={isSubmitting[time]}
                                        >
                                            {isSubmitting[time] ? <Loader2 className="animate-spin" /> : time}
                                            {isBooked && <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-white"/>}
                                        </Button>
                                    );
                                })}
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/50">
                                <p className="text-muted-foreground">Müsaitlik eklemek/kaldırmak için bir tarih seçin.</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2 mt-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-primary"></div> Müsait (Açık)</div>
                            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm border bg-background"></div> Kapalı</div>
                             <div className="flex items-center gap-2">
                                <div className="relative w-4 h-4 rounded-sm bg-destructive">
                                    <CheckCircle className="w-3 h-3 absolute top-0.5 right-0.5 text-white"/>
                                </div> 
                                Rezerve Edilmiş
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <LessonDetailsDialog slot={selectedSlot} isOpen={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />
        </div>
    );
}
