
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, where, query } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format as formatInTimeZone, toDate } from 'date-fns-tz';
import { isSameDay, format } from 'date-fns';
import { tr } from 'date-fns/locale';

const turkeyTimeZone = 'Europe/Istanbul';

export default function DersPlanlaPage() {
    const router = useRouter();
    const { user } = useUser();
    const db = useFirestore();
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isBooking, setIsBooking] = useState(false);

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

    const lessonSlotsRef = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'lesson-slots'), where('status', '==', 'available'));
    }, [db]);

    const { data: availableSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsRef);

    const availableDays = useMemo(() => {
        if (!availableSlots) return [];
        return availableSlots.map(slot => toDate(slot.startTime.seconds * 1000, { timeZone: turkeyTimeZone }));
    }, [availableSlots]);

    const slotsForSelectedDate = useMemo(() => {
        if (!availableSlots || !selectedDate) return [];
        return availableSlots
            .filter(slot => isSameDay(toDate(slot.startTime.seconds * 1000, { timeZone: turkeyTimeZone }), selectedDate))
            .sort((a, b) => a.startTime.seconds - b.startTime.seconds);
    }, [availableSlots, selectedDate]);
    
    const handleBookLesson = async (slotId: string) => {
        if (!user || !userDocRef) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Giriş yapmalısınız.' });
            return;
        }

        if(userData?.hasUsedFreeTrial) {
             toast({ variant: 'destructive', title: 'Hakkınız Kalmadı', description: 'Ücretsiz deneme dersi hakkınızı zaten kullandınız.' });
             return;
        }

        setIsBooking(true);
        try {
            const slotDocRef = doc(db, 'lesson-slots', slotId);
            await updateDoc(slotDocRef, {
                status: 'booked',
                bookedBy: user.uid
            });
            await updateDoc(userDocRef, {
                hasUsedFreeTrial: true
            });
            toast({
                title: 'Ders Planlandı!',
                description: 'Ücretsiz deneme dersiniz başarıyla planlandı.',
                className: 'bg-green-500 text-white'
            });
            router.push('/ebeveyn-portali');
        } catch (error) {
            console.error("Booking error:", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Ders planlanırken bir sorun oluştu.' });
        } finally {
            setIsBooking(false);
        }
    };


    if (isUserLoading || areSlotsLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" onClick={() => router.back()} className="-ml-4 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Geri Dön
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Ders Planla</h2>
                    <p className="text-muted-foreground">
                        Öğretmenimizin müsait olduğu zamanlardan birini seçin (Türkiye saatine göre).
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
                            modifiers={{
                                available: availableDays,
                            }}
                            modifiersClassNames={{
                                available: 'bg-primary/20 text-primary-foreground rounded-full',
                            }}
                            disabled={(date) => {
                                // Disable all past dates
                                if (date < new Date(new Date().setDate(new Date().getDate() - 1))) return true;
                                // Check if the date is not in the available days list
                                return !availableDays.some(availableDay => isSameDay(date, availableDay));
                            }}
                            className="rounded-md border"
                        />
                    </div>
                    <div className="h-full">
                        <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">
                            {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: tr }) : 'Bir tarih seçin'} için Müsait Saatler
                        </h3>
                        {selectedDate && slotsForSelectedDate.length > 0 ? (
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {slotsForSelectedDate.map(slot => (
                                    <Button
                                        key={slot.id}
                                        variant="outline"
                                        className="h-12 text-base"
                                        onClick={() => handleBookLesson(slot.id)}
                                        disabled={isBooking}
                                    >
                                        {isBooking ? <Loader2 className="animate-spin" /> : format(toDate(slot.startTime.seconds * 1000, { timeZone: turkeyTimeZone }), 'HH:mm')}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/50">
                                <p className="text-muted-foreground">Bu tarih için müsait ders bulunmamaktadır.</p>
                            </div>
                        )}
                         <div className="mt-6 text-center">
                            {userData?.hasUsedFreeTrial && (
                                <Badge variant="destructive">Ücretsiz deneme dersi hakkınızı kullandınız.</Badge>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
