
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError, useDoc } from '@/firebase';
import { collection, query, where, addDoc, deleteDoc, Timestamp, doc, writeBatch } from 'firebase/firestore';
import { Loader2, CheckCircle, User, Baby, Info, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format, set, startOfDay, isSameDay, differenceInYears, addMinutes, getHours, getMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { COURSES } from '@/data/courses';
import { cn } from '@/lib/utils';


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
    const [selectedSlot, setSelectedSlot] = useState<SlotDetails | null>(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    
    // State for drag-to-select functionality
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
    const [dragEndSlot, setDragEndSlot] = useState<string | null>(null);
    const [dragMode, setDragMode] = useState<'available' | 'closed' | null>(null);

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
    
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let h = 9; h < 21; h++) {
            for (let m = 0; m < 60; m += 5) {
                slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            }
        }
        return slots;
    }, []);
    
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
    
    const handleSlotClick = (time: string) => {
        const slot = slotsForSelectedDate.get(time);
        
        if (slot?.status === 'booked') {
            setSelectedSlot(slot);
            setIsDetailsDialogOpen(true);
            return;
        }
    };
    
     const getSlotsToUpdate = () => {
        if (!dragStartSlot || !dragEndSlot) return [];
        const startIndex = timeSlots.indexOf(dragStartSlot);
        const endIndex = timeSlots.indexOf(dragEndSlot);
        if (startIndex === -1 || endIndex === -1) return [];

        const [start, end] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
        return timeSlots.slice(start, end + 1);
    };

    const handleMouseDown = (time: string) => {
        const slot = slotsForSelectedDate.get(time);
        if (slot?.status === 'booked') return;
        
        setIsDragging(true);
        setDragStartSlot(time);
        setDragEndSlot(time);
        setDragMode(slot?.status === 'available' ? 'closed' : 'available');
    };

    const handleMouseEnter = (time: string) => {
        if (isDragging) {
            setDragEndSlot(time);
        }
    };

    const handleMouseUp = async () => {
        if (!isDragging || !dragMode || !user || !db || !selectedDate) {
            resetDragState();
            return;
        }

        const slotsToUpdate = getSlotsToUpdate();
        resetDragState(); // Reset UI state immediately for responsiveness
        
        if (slotsToUpdate.length === 0) return;

        const batch = writeBatch(db);

        if (dragMode === 'available') {
            slotsToUpdate.forEach(time => {
                const existingSlot = slotsForSelectedDate.get(time);
                if (!existingSlot) { // Only add if it doesn't exist
                    const slotDate = toDate(`${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`, { timeZone: turkeyTimeZone });
                    const newSlotRef = doc(collection(db, 'lesson-slots'));
                    batch.set(newSlotRef, {
                        teacherId: user.uid,
                        startTime: Timestamp.fromDate(slotDate),
                        endTime: Timestamp.fromDate(addMinutes(slotDate, 5)),
                        status: 'available',
                    });
                }
            });
        } else { // 'closed' mode
            slotsToUpdate.forEach(time => {
                const existingSlot = slotsForSelectedDate.get(time);
                if (existingSlot && existingSlot.status === 'available') {
                    const slotDocRef = doc(db, 'lesson-slots', existingSlot.id);
                    batch.delete(slotDocRef);
                }
            });
        }
        
        try {
            await batch.commit();
        } catch (serverError) {
             const permissionError = new FirestorePermissionError({
                operation: 'write',
                path: 'lesson-slots',
            });
            errorEmitter.emit('permission-error', permissionError);
        }
    };
    
    const resetDragState = () => {
        setIsDragging(false);
        setDragStartSlot(null);
        setDragEndSlot(null);
        setDragMode(null);
    };

    useEffect(() => {
        // Add mouseup listener to the window to catch mouse releases outside the component
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStartSlot, dragEndSlot]); // Re-create listener if state changes
    

    const getTeacherName = () => {
        if (user?.displayName) { return user.displayName.split(' ')[0]; }
        if (user?.email) { const emailName = user.email.split('@')[0]; return emailName.charAt(0).toUpperCase() + emailName.slice(1); }
        return 'Öğretmen';
    };

    if (areSlotsLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    const slotsInSelection = getSlotsToUpdate();
    
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div>
                 <p className="text-muted-foreground mb-1">Hoş geldin, {getTeacherName()}!</p>
                <h2 className="text-3xl font-bold tracking-tight">Müsaitlik Takvimi (Türkiye Saati)</h2>
            </div>
            
            <Card className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="flex justify-center lg:col-span-1">
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
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">
                            {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: tr }) : 'Bir tarih seçin'} için Saatler
                        </h3>
                        {selectedDate ? (
                            <div className="relative border rounded-lg p-2 bg-background max-h-[400px] overflow-y-auto" onMouseLeave={resetDragState}>
                                {timeSlots.map((time) => {
                                     const slotData = slotsForSelectedDate.get(time);
                                     const minutes = parseInt(time.split(':')[1]);
                                     const isFullHour = minutes === 0;
                                     const isQuarterHour = [15, 30, 45].includes(minutes);
                                     
                                     let dynamicStatus = slotData?.status;
                                     if(isDragging && slotsInSelection.includes(time) && slotData?.status !== 'booked') {
                                         dynamicStatus = dragMode ?? slotData?.status;
                                     }

                                    return (
                                        <div 
                                            key={time}
                                            className={cn("flex items-center h-6")}
                                            onMouseDown={() => handleMouseDown(time)}
                                            onMouseEnter={() => handleMouseEnter(time)}
                                        >
                                            <div className="text-xs text-muted-foreground w-16 text-right pr-2 shrink-0">
                                                {isFullHour && <span className="font-semibold">{time}</span>}
                                                {isQuarterHour && <span className="text-gray-400">{time}</span>}
                                            </div>
                                            <div 
                                                className={cn(
                                                    "flex-1 h-full border-l",
                                                    isFullHour ? "border-t-2 border-t-gray-300" : "border-t border-t-gray-200",
                                                    dynamicStatus === 'booked' ? 'bg-destructive/80 cursor-not-allowed' :
                                                    dynamicStatus === 'available' ? 'bg-primary/80 cursor-pointer' :
                                                    'hover:bg-muted cursor-pointer'
                                                )}
                                                onClick={() => handleSlotClick(time)}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/50">
                                <p className="text-muted-foreground">Müsaitlik eklemek/kaldırmak için bir tarih seçin.</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2 mt-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-primary/80"></div> Müsait (Açık)</div>
                            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm border bg-background"></div> Kapalı</div>
                             <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-destructive/80"></div> Rezerve Edilmiş
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <LessonDetailsDialog slot={selectedSlot} isOpen={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />
        </div>
    );
}
