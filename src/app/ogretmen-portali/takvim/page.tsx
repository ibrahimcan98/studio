
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, errorEmitter, FirestorePermissionError, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, Timestamp, writeBatch, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Loader2, Square, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { isSameDay, getDay, addDays, startOfDay, parse, format as formatDateFn } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toZonedTime, format, formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { LessonDetailsDialog } from './lesson-details-dialog';
import { Calendar } from '@/components/ui/calendar';


type SlotDetails = {
    id: string;
    status: 'available' | 'booked';
    teacherId: string;
    bookedBy?: string;
    childId?: string;
    startTime: Timestamp;
    packageCode?: string;
};

const turkeyTimeZone = 'Europe/Istanbul';

// Helper function to create a date object correctly in the target timezone.
const createDateInTurkeyTimeZone = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  
  // Get date components in UTC to avoid local timezone influence
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth(); // 0-11
  const day = date.getUTCDate();

  // Create a UTC timestamp by directly providing the components.
  // This represents the "wall clock" time in UTC.
  const utcTimestamp = Date.UTC(year, month, day, hours, minutes);

  // Turkey is UTC+3. To make our UTC time represent 09:00 in Turkey,
  // we need to subtract 3 hours from the UTC time we created.
  // E.g., 09:00 UTC is 12:00 in Turkey. We want 06:00 UTC to be 09:00 in Turkey.
  const turkeyUtcOffset = 3 * 60 * 60 * 1000;
  
  return new Date(utcTimestamp - turkeyUtcOffset);
};


const timeSlots = Array.from({ length: (24 - 8) * 12 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 5;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});

function TimeGrid({
    slots,
    onMouseDown,
    onMouseEnter,
    onSlotClick,
    isDragging,
    dragSelection,
    dragMode,
}: {
    slots: Map<string, SlotDetails>;
    onMouseDown: (time: string) => void;
    onMouseEnter: (time: string) => void;
    onSlotClick: (time: string) => void;
    isDragging: boolean;
    dragSelection: Set<string>;
    dragMode: 'available' | 'closed' | null;
}) {
    return (
        <div className="relative border rounded-lg p-2 bg-background max-h-[400px] overflow-y-auto">
            {timeSlots.map((time) => {
                const slotData = slots.get(time);
                const minutes = parseInt(time.split(':')[1]);
                const isFullHour = minutes === 0;
                const isQuarterHour = [15, 30, 45].includes(minutes);

                let dynamicStatus = slotData?.status;
                if (isDragging && dragSelection.has(time) && slotData?.status !== 'booked') {
                    dynamicStatus = dragMode ?? slotData?.status;
                }

                return (
                    <div
                        key={time}
                        className={cn("flex items-center h-6")}
                        onMouseDown={() => onMouseDown(time)}
                        onMouseEnter={() => onMouseEnter(time)}
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
                            onClick={() => onSlotClick(time)}
                        />
                    </div>
                )
            })}
        </div>
    );
}

export default function TakvimYonetimiPage() {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<SlotDetails | null>(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    
    const [stagedSlots, setStagedSlots] = useState<Map<string, SlotDetails>>(new Map());

    const [isDragging, setIsDragging] = useState(false);
    const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
    const [dragEndSlot, setDragEndSlot] = useState<string | null>(null);
    const [dragMode, setDragMode] = useState<'available' | 'closed' | null>(null);
    
    const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
    const [isApplyingChanges, setIsApplyingChanges] = useState(false);


    const lessonSlotsQuery = useMemoFirebase(() => {
        if (!db || !user) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid));
    }, [db, user]);

    const { data: lessonSlots, isLoading: areSlotsLoading, refetch } = useCollection(lessonSlotsQuery);

    const originalSlotsForSelectedDate = useMemo(() => {
        if (!lessonSlots) return new Map<string, SlotDetails>();
        const slotsMap = new Map<string, SlotDetails>();
        lessonSlots.forEach(slot => {
            const zonedSlotDate = toZonedTime(slot.startTime.toDate(), turkeyTimeZone);
            if (isSameDay(zonedSlotDate, selectedDate)) {
                const time = format(zonedSlotDate, 'HH:mm');
                slotsMap.set(time, slot as SlotDetails);
            }
        });
        return slotsMap;
    }, [lessonSlots, selectedDate]);
    
    useEffect(() => {
        setStagedSlots(new Map(originalSlotsForSelectedDate));
    }, [originalSlotsForSelectedDate]);


    const availableDays = useMemo(() => {
        if (!lessonSlots) return [];
        return lessonSlots
            .filter(slot => slot.status === 'available')
            .map(slot => toZonedTime(slot.startTime.toDate(), turkeyTimeZone));
    }, [lessonSlots]);


    const handleSlotClick = (time: string) => {
        const slot = stagedSlots.get(time);
        if (slot?.status === 'booked') {
            setSelectedSlot(slot);
            setIsDetailsDialogOpen(true);
        }
    };
    
    const getSlotsInDragRange = (start: string, end: string) => {
        const selection = new Set<string>();
        const startIndex = timeSlots.indexOf(start);
        const endIndex = timeSlots.indexOf(end);
        if (startIndex === -1 || endIndex === -1) return selection;
        
        const [minIdx, maxIdx] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
        for (let i = minIdx; i <= maxIdx; i++) {
            selection.add(timeSlots[i]);
        }
        return selection;
    };
    
    const dragSelection = useMemo(() => {
        if (!isDragging || !dragStartSlot || !dragEndSlot) return new Set<string>();
        return getSlotsInDragRange(dragStartSlot, dragEndSlot);
    }, [isDragging, dragStartSlot, dragEndSlot]);

    const handleMouseDown = (time: string) => {
        const slot = stagedSlots.get(time);
        if (slot?.status === 'booked') return;
        setIsDragging(true);
        setDragStartSlot(time);
        setDragEndSlot(time);
        setDragMode(slot?.status === 'available' ? 'closed' : 'available');
    };

    const handleMouseUp = () => {
        if (!isDragging || !dragMode || !user || !selectedDate) {
            resetDragState();
            return;
        }

        const slotsToUpdate = dragSelection;
        
        setStagedSlots(prevStaged => {
            const newStaged = new Map(prevStaged);
            slotsToUpdate.forEach(time => {
                const existingSlot = newStaged.get(time);
                if (existingSlot?.status === 'booked') return; 

                if (dragMode === 'available' && !existingSlot) {
                     const dateInTurkey = createDateInTurkeyTimeZone(selectedDate, time);
                     newStaged.set(time, {
                        id: `new-${time}`, 
                        status: 'available',
                        teacherId: user.uid,
                        startTime: Timestamp.fromDate(dateInTurkey)
                     });
                } else if (dragMode === 'closed' && existingSlot) {
                    newStaged.delete(time);
                }
            });
            return newStaged;
        });

        resetDragState();
    };

    const handleApplyChanges = async () => {
        if (!db || !user || !selectedDate) return;
        setIsApplyingChanges(true);

        const originalAvailable = Array.from(originalSlotsForSelectedDate.values()).filter(s => s.status === 'available');
        const stagedAvailable = Array.from(stagedSlots.values()).filter(s => s.status === 'available');

        const slotsToDelete = originalAvailable.filter(orig => !stagedAvailable.some(staged => staged.id === orig.id));
        const slotsToAdd = stagedAvailable.filter(staged => staged.id.startsWith('new-'));

        if (slotsToDelete.length === 0 && slotsToAdd.length === 0) {
            toast({ title: 'Değişiklik Yok', description: 'Kaydedilecek yeni bir değişiklik yapmadınız.'});
            setIsApplyingChanges(false);
            return;
        }

        const batch = writeBatch(db);

        slotsToDelete.forEach(slot => {
            batch.delete(doc(db, 'lesson-slots', slot.id));
        });

        slotsToAdd.forEach(slot => {
            const newSlotRef = doc(collection(db, 'lesson-slots'));
            // Use the already correctly-zoned startTime from the staged slot
            batch.set(newSlotRef, {
                teacherId: user.uid,
                startTime: slot.startTime,
                status: 'available',
            });
        });

        try {
            await batch.commit();
            await refetch();
            toast({
                title: 'Kaydedildi',
                description: 'Günlük programınız başarıyla güncellendi.',
                className: 'bg-green-500 text-white'
            });
        } catch (error) {
            console.error("Error applying daily changes:", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Değişiklikler kaydedilirken bir hata oluştu.' });
        } finally {
            setIsApplyingChanges(false);
        }
    };


    const handleApplyTemplateToFutureDays = async () => {
        if (!db || !user || !selectedDate) return;
        setIsApplyingTemplate(true);

        const dayOfWeekToApply = getDay(selectedDate);
        
        const templateTimes = Array.from(stagedSlots.keys()).filter(time => stagedSlots.get(time)?.status === 'available');

        const q = query(
            collection(db, 'lesson-slots'),
            where('teacherId', '==', user.uid),
            where('status', '==', 'available'),
            where('startTime', '>', startOfDay(new Date()))
        );

        const batch = writeBatch(db);

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(docSnap => {
                const slotData = docSnap.data();
                const slotDate = toZonedTime(slotData.startTime.toDate(), turkeyTimeZone);
                if (getDay(slotDate) === dayOfWeekToApply) {
                    batch.delete(docSnap.ref);
                }
            });

            for (let i = 0; i < 52; i++) {
                let futureDate = addDays(selectedDate, i * 7);
                if(startOfDay(futureDate) < startOfDay(new Date())) continue;

                templateTimes.forEach(time => {
                    const slotDateTimeInTurkey = createDateInTurkeyTimeZone(futureDate, time);
                    const newSlotRef = doc(collection(db, 'lesson-slots'));
                    batch.set(newSlotRef, {
                        teacherId: user.uid,
                        startTime: Timestamp.fromDate(slotDateTimeInTurkey),
                        status: 'available',
                    });
                });
            }

            await batch.commit();
            await refetch();
            toast({
                title: 'Şablon Uygulandı',
                description: `Seçili saatler, gelecekteki tüm ${formatInTimeZone(selectedDate, turkeyTimeZone, 'EEEE', {locale: tr})} günlerine uygulandı.`,
                className: 'bg-green-500 text-white'
            });

        } catch (error) {
            console.error('Error applying template: ', error);
             toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Şablon uygulanırken bir sorun oluştu.',
            });
        } finally {
            setIsApplyingTemplate(false);
        }
    };
    
    const resetDragState = () => {
        setIsDragging(false);
        setDragStartSlot(null);
        setDragEndSlot(null);
        setDragMode(null);
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                handleMouseUp();
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDragging, handleMouseUp]);


    if (userLoading || areSlotsLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
    
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen" onMouseUp={handleMouseUp}>
             <div>
                <h2 className="text-3xl font-bold tracking-tight">Müsaitlik Takvimi</h2>
                 <p className="text-muted-foreground">Bir gün seçip, o gün için müsaitlik durumunuzu sürükleyerek düzenleyin.</p>
            </div>
            
            <Card className="p-4 sm:p-6 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="flex justify-center lg:col-span-1">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            locale={tr}
                            modifiers={{
                                available: availableDays,
                            }}
                            modifiersClassNames={{
                                available: 'bg-primary/20 text-primary-foreground rounded-full',
                            }}
                            className="rounded-md border"
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">
                            {formatInTimeZone(selectedDate, turkeyTimeZone, 'dd MMMM yyyy, EEEE', { locale: tr })}
                        </h3>
                            <TimeGrid 
                            slots={stagedSlots}
                            onMouseDown={handleMouseDown}
                            onMouseEnter={(time) => isDragging && setDragEndSlot(time)}
                            onSlotClick={handleSlotClick}
                            isDragging={isDragging}
                            dragSelection={dragSelection}
                            dragMode={dragMode}
                        />
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><Square className="w-4 h-4 bg-primary/80 rounded-sm"/> Müsait</div>
                                <div className="flex items-center gap-2"><Square className="w-4 h-4 border bg-background rounded-sm"/> Kapalı</div>
                                <div className="flex items-center gap-2"><Square className="w-4 h-4 bg-destructive/80 rounded-sm"/> Rezerve</div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Button onClick={handleApplyChanges} disabled={isApplyingChanges}>
                                    {isApplyingChanges ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Değişiklikleri Uygula
                                </Button>
                                <Button onClick={handleApplyTemplateToFutureDays} disabled={isApplyingTemplate}>
                                    {isApplyingTemplate ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Tüm {formatInTimeZone(selectedDate, turkeyTimeZone, 'EEEE', { locale: tr })} günlerine uygula
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            
            <LessonDetailsDialog slot={selectedSlot} isOpen={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />
        </div>
    );
}
