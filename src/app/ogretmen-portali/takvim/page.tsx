
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError, useDoc } from '@/firebase';
import { collection, query, where, addDoc, deleteDoc, Timestamp, doc } from 'firebase/firestore';
import { Loader2, CheckCircle, User, Baby, Info } from 'lucide-react';
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
import { formatInTimeZone } from 'date-fns-tz';


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
};

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
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><User /> Veli Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>İsim:</strong> {parentData?.firstName} {parentData?.lastName}</p>
                                <p><strong>Email:</strong> {parentData?.email}</p>
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
                         <div className="text-center">
                            <Badge variant="secondary">Ücretsiz Deneme Dersi</Badge>
                        </div>
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
    const [timeZone, setTimeZone] = useState('');

    useEffect(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    const lessonSlotsQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'lesson-slots'));
    }, [db]);

    const { data: lessonSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsQuery);

    const activeDays = useMemo(() => {
        if (!lessonSlots || !user) return [];
        return lessonSlots
            .filter(slot => slot.teacherId === user.uid && slot.status === 'available')
            .map(slot => slot.startTime.toDate());
    }, [lessonSlots, user]);
    
    const slotsForSelectedDate = useMemo(() => {
        if (!lessonSlots || !selectedDate) return new Map<string, SlotDetails>();
        
        const slotsMap = new Map<string, SlotDetails>();
        
        lessonSlots.forEach(slot => {
            const slotDate = slot.startTime.toDate();
            if (isSameDay(slotDate, selectedDate)) {
                const time = format(slotDate, 'HH:mm');
                slotsMap.set(time, slot as SlotDetails);
            }
        });
        return slotsMap;
    }, [lessonSlots, selectedDate]);
    
    const handleTimeSlotClick = (time: string) => {
        const slot = slotsForSelectedDate.get(time);
        
        if (slot?.status === 'booked') {
            setSelectedSlot(slot);
            setIsDetailsDialogOpen(true);
            return;
        }

        if (!selectedDate || !user || !db) return;

        const [hours, minutes] = time.split(':').map(Number);
        const slotDateTime = set(startOfDay(selectedDate), { hours, minutes });
        const startTime = Timestamp.fromDate(slotDateTime);

        setIsSubmitting(prevState => ({ ...prevState, [time]: true }));
        
        if (slot) {
            if (slot.teacherId !== user.uid) {
                toast({ variant: 'destructive', title: 'Hata', description: 'Bu aralık başka bir öğretmene ait.' });
                setIsSubmitting(prevState => ({ ...prevState, [time]: false }));
                return;
            }
            
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
                <h2 className="text-3xl font-bold tracking-tight">Müsaitlik Takvimi</h2>
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
                                            disabled={disabled && !isBookedByStudent}
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
            <LessonDetailsDialog slot={selectedSlot} isOpen={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />
        </div>
    );
}
