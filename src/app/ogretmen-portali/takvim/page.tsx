
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, addDoc, deleteDoc, Timestamp, doc } from 'firebase/firestore';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format as formatInTimeZone, toDate } from 'date-fns-tz';
import { set, startOfDay, format, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';

const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const turkeyTimeZone = 'Europe/Istanbul';

export default function TakvimYonetimiPage() {
    const router = useRouter();
    const { user } = useUser();
    const db = useFirestore();
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({});

    const lessonSlotsQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'lesson-slots'));
    }, [db]);

    const { data: lessonSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsQuery);

    const activeDays = useMemo(() => {
        if (!lessonSlots || !user) return [];
        return lessonSlots
            .filter(slot => slot.teacherId === user.uid && slot.status === 'available')
            .map(slot => toDate(slot.startTime.seconds * 1000, { timeZone: turkeyTimeZone }));
    }, [lessonSlots, user]);
    
    const slotsForSelectedDate = useMemo(() => {
        if (!lessonSlots || !selectedDate) return new Map();
        
        const slotsMap = new Map();
        
        lessonSlots.forEach(slot => {
            const slotDate = toDate(slot.startTime.seconds * 1000, { timeZone: turkeyTimeZone });
            if (isSameDay(slotDate, selectedDate)) {
                const time = format(slotDate, 'HH:mm');
                slotsMap.set(time, { id: slot.id, status: slot.status, teacherId: slot.teacherId });
            }
        });
        return slotsMap;
    }, [lessonSlots, selectedDate]);
    
    const handleTimeSlotClick = (time: string) => {
        if (!selectedDate || !user || !db) return;

        const [hours, minutes] = time.split(':').map(Number);
        const slotDateTime = set(startOfDay(selectedDate), { hours, minutes });
        const startTime = Timestamp.fromDate(slotDateTime);

        setIsSubmitting(prevState => ({ ...prevState, [time]: true }));

        const existingSlot = slotsForSelectedDate.get(time);
        
        if (existingSlot) {
            if (existingSlot.status === 'booked') {
                toast({ variant: 'destructive', title: 'Hata', description: 'Bu ders aralığı bir öğrenci tarafından rezerve edildiği için kaldırılamaz.' });
                setIsSubmitting(prevState => ({ ...prevState, [time]: false }));
                return;
            }
             if (existingSlot.teacherId !== user.uid) {
                toast({ variant: 'destructive', title: 'Hata', description: 'Bu aralık başka bir öğretmene ait.' });
                setIsSubmitting(prevState => ({ ...prevState, [time]: false }));
                return;
            }
            
            const slotDocRef = doc(db, 'lesson-slots', existingSlot.id);
            deleteDoc(slotDocRef)
                .then(() => {
                    toast({ title: 'Kapatıldı', description: `${time} saati müsaitlikten kaldırıldı.` });
                })
                .catch(() => {
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
             const newSlotData = {
                teacherId: user.uid,
                startTime: startTime,
                endTime: Timestamp.fromDate(new Date(startTime.toMillis() + 45 * 60 * 1000)),
                status: 'available',
                bookedBy: null,
            };
            addDoc(collection(db, 'lesson-slots'), newSlotData)
                .then(() => {
                     toast({ title: 'Açıldı', description: `${time} saati müsait olarak eklendi.`, className: 'bg-green-500 text-white' });
                })
                .catch(() => {
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


    if (areSlotsLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Müsaitlik Takvimi</h2>
                </div>
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
                                    const isBookedByStudent = slot?.status === 'booked';
                                    const isAvailableForMe = slot?.status === 'available' && slot.teacherId === user?.uid;
                                    const isClosed = !slot; // No slot document means it's "closed" or "off"

                                    let variant: "default" | "destructive" | "outline" = 'outline';
                                    let disabled = false;
                                    let content: React.ReactNode = time;

                                    if (isSubmitting[time]) {
                                        disabled = true;
                                        content = <Loader2 className="animate-spin" />;
                                    } else if (isBookedByStudent) {
                                        variant = 'destructive';
                                        disabled = true;
                                    } else if (isAvailableForMe) {
                                        variant = 'default';
                                    } else if (isClosed) {
                                        variant = 'outline';
                                    } else { // Available but belongs to another teacher
                                        variant = 'destructive';
                                        disabled = true;
                                    }
                                    
                                    return (
                                        <Button
                                            key={time}
                                            variant={variant}
                                            className="h-12 text-base relative"
                                            onClick={() => handleTimeSlotClick(time)}
                                            disabled={disabled}
                                        >
                                            {content}
                                            {isBookedByStudent && <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-white"/>}
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
        </div>
    );
}
