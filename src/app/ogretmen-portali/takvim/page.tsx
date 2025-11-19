
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
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
        // Fetch all slots to correctly manage the calendar display for all teachers and parents
        return query(collection(db, 'lesson-slots'));
    }, [db]);

    const { data: lessonSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsQuery);

    const activeDays = useMemo(() => {
        if (!lessonSlots || !user) return [];
        // A day is active if the current teacher has at least one available or booked slot
        return lessonSlots
            .filter(slot => slot.teacherId === user.uid)
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
    
    const handleTimeSlotClick = async (time: string) => {
        if (!selectedDate || !user) return;

        const [hours, minutes] = time.split(':').map(Number);
        
        // This date is created in the local timezone, but represents the intended day.
        const localDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        // `set` will also use local timezone, which is fine as long as we convert to timestamp correctly.
        const slotDateTime = set(localDate, { hours, minutes, seconds: 0, milliseconds: 0 });

        setIsSubmitting(prevState => ({ ...prevState, [time]: true }));

        const existingSlot = slotsForSelectedDate.get(time);

        try {
             if (existingSlot) {
                if (existingSlot.teacherId !== user.uid) {
                     toast({ variant: 'destructive', title: 'Hata', description: 'Bu ders aralığı başka bir öğretmen tarafından yönetiliyor.' });
                     return;
                }
                if (existingSlot.status === 'booked') {
                    toast({ variant: 'destructive', title: 'Hata', description: 'Bu ders aralığı bir öğrenci tarafından rezerve edildiği için kaldırılamaz.' });
                    return;
                }
                const slotDocRef = doc(db, 'lesson-slots', existingSlot.id);
                await deleteDoc(slotDocRef);
                toast({ title: 'Kapatıldı', description: `${time} saati müsaitlikten kaldırıldı.` });
            } else {
                // Slot doesn't exist, so create it (open the slot)
                await addDoc(collection(db, 'lesson-slots'), {
                    teacherId: user.uid,
                    startTime: Timestamp.fromDate(slotDateTime),
                    endTime: Timestamp.fromDate(new Date(slotDateTime.getTime() + 45 * 60 * 1000)),
                    status: 'available',
                    bookedBy: null,
                });
                toast({ title: 'Açıldı', description: `${time} saati müsait olarak eklendi.`, className: 'bg-green-500 text-white' });
            }
        } catch (error) {
            console.error("Error managing time slot:", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'İşlem sırasında bir sorun oluştu.' });
        } finally {
            setIsSubmitting(prevState => ({ ...prevState, [time]: false }));
        }
    };

    if (areSlotsLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" onClick={() => router.back()} className="-ml-4 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Geri Dön
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Müsaitlik Takvimi</h2>
                    <p className="text-muted-foreground">
                        Ders vermek istediğiniz günleri ve saatleri seçin. Tüm saatler Türkiye saatine göredir.
                    </p>
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
                                    const isBookedByOther = slot && slot.teacherId !== user?.uid;
                                    const isBookedByStudent = slot?.status === 'booked';
                                    const isAvailableForMe = slot?.status === 'available' && slot.teacherId === user?.uid;

                                    return (
                                        <Button
                                            key={time}
                                            variant={isBookedByStudent || isBookedByOther ? 'destructive' : isAvailableForMe ? 'default' : 'outline'}
                                            className="h-12 text-base relative"
                                            onClick={() => handleTimeSlotClick(time)}
                                            disabled={isSubmitting[time] || isBookedByStudent || isBookedByOther}
                                        >
                                            {isSubmitting[time] && <Loader2 className="animate-spin absolute" />}
                                            <span className={isSubmitting[time] ? 'opacity-0' : ''}>{time}</span>
                                             {(isBookedByStudent || isBookedByOther) && <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-white"/>}
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
                            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-destructive"></div> Dolu (Rezerve Edilmiş veya Başkasına Ait)</div>
                            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm border bg-background"></div> Kapalı</div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
