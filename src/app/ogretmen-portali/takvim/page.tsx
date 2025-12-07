
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, errorEmitter, FirestorePermissionError, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, Timestamp, writeBatch, getDocs, doc } from 'firebase/firestore';
import { Loader2, Square, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
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

const timeSlots = Array.from({ length: (20 - 9) * 12 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 5;
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
     if (slots.size === 0) {
        return (
            <div className="relative border rounded-lg p-2 bg-background max-h-[400px] overflow-y-auto"
                onMouseDown={(e) => {
                    // Find the approximate time slot based on click position
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const totalHeight = e.currentTarget.scrollHeight;
                    const timeIndex = Math.floor((y / totalHeight) * timeSlots.length);
                    const time = timeSlots[timeIndex];
                    if (time) onMouseDown(time);
                }}
            >
                {timeSlots.map((time) => {
                    const minutes = parseInt(time.split(':')[1]);
                    const isFullHour = minutes === 0;
                    const isQuarterHour = [15, 30, 45].includes(minutes);

                    let dynamicStatus;
                     if (isDragging && dragSelection.has(time)) {
                        dynamicStatus = dragMode;
                    }

                    return (
                        <div
                            key={time}
                            className={cn("flex items-center h-6")}
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
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
    const [dragEndSlot, setDragEndSlot] = useState<string | null>(null);
    const [dragMode, setDragMode] = useState<'available' | 'closed' | null>(null);
    
    const [calendarKey, setCalendarKey] = useState(Date.now());


    const lessonSlotsQuery = useMemoFirebase(() => {
        if (!db || !user) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid));
    }, [db, user]);

    const { data: lessonSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsQuery);


    const slotsForSelectedDate = useMemo(() => {
        if (!lessonSlots) return new Map<string, SlotDetails>();
        const slotsMap = new Map<string, SlotDetails>();
        lessonSlots.forEach(slot => {
            const zonedSlotDate = toZonedTime(slot.startTime.toDate(), turkeyTimeZone);
            if (isSameDay(zonedSlotDate, selectedDate)) {
                const time = formatInTimeZone(zonedSlotDate, turkeyTimeZone, 'HH:mm');
                slotsMap.set(time, slot as SlotDetails);
            }
        });
        return slotsMap;
    }, [lessonSlots, selectedDate]);
    
    const availableDays = useMemo(() => {
        if (!lessonSlots) return [];
        return lessonSlots
            .filter(slot => slot.status === 'available')
            .map(slot => toZonedTime(slot.startTime.toDate(), turkeyTimeZone));
    }, [lessonSlots]);


    const handleSlotClick = (time: string) => {
        const slot = slotsForSelectedDate.get(time);
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

    const handleMouseUp = async () => {
        if (!isDragging || !dragMode || !user || !db || !selectedDate) {
            resetDragState();
            return;
        }

        const slotsToUpdate = dragSelection;
        resetDragState();

        if (slotsToUpdate.size === 0) return;
        const batch = writeBatch(db);

        slotsToUpdate.forEach(time => {
            const existingSlot = slotsForSelectedDate.get(time);
            if (dragMode === 'available' && !existingSlot) {
                const slotDate = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`);

                const newSlotRef = doc(collection(db, 'lesson-slots'));
                batch.set(newSlotRef, {
                    teacherId: user.uid,
                    startTime: Timestamp.fromDate(slotDate),
                    status: 'available',
                });
            } else if (dragMode === 'closed' && existingSlot && existingSlot.status === 'available') {
                batch.delete(doc(db, 'lesson-slots', existingSlot.id));
            }
        });

        try {
            await batch.commit();
        } catch (serverError) {
            errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'write', path: 'lesson-slots' }));
        }
    };
    
    const resetDragState = () => {
        setIsDragging(false);
        setDragStartSlot(null);
        setDragEndSlot(null);
        setDragMode(null);
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging, dragStartSlot, dragEndSlot, selectedDate]);


    if (userLoading || areSlotsLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
    
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
             <div>
                <h2 className="text-3xl font-bold tracking-tight">Müsaitlik Takvimi (Türkiye Saati)</h2>
                 <p className="text-muted-foreground">Belirli bir gün için müsaitlik durumunuzu düzenleyin.</p>
            </div>
            
            <Card className="p-4 sm:p-6 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="flex justify-center lg:col-span-1">
                        <Calendar
                            key={calendarKey}
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
                            {format(selectedDate, 'dd MMMM yyyy', { locale: tr })} için Saatler
                        </h3>
                            <TimeGrid 
                            slots={slotsForSelectedDate}
                            onMouseDown={(time) => {
                                const slot = slotsForSelectedDate.get(time);
                                if (slot?.status === 'booked') return;
                                setIsDragging(true);
                                setDragStartSlot(time);
                                setDragEndSlot(time);
                                setDragMode(slot?.status === 'available' ? 'closed' : 'available');
                            }}
                            onMouseEnter={(time) => isDragging && setDragEndSlot(time)}
                            onSlotClick={handleSlotClick}
                            isDragging={isDragging}
                            dragSelection={dragSelection}
                            dragMode={dragMode}
                        />
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><Square className="w-4 h-4 bg-primary/80 rounded-sm"/> Müsait</div>
                            <div className="flex items-center gap-2"><Square className="w-4 h-4 border bg-background rounded-sm"/> Kapalı</div>
                            <div className="flex items-center gap-2"><Square className="w-4 h-4 bg-destructive/80 rounded-sm"/> Rezerve</div>
                        </div>
                    </div>
                </div>
            </Card>
            
            <LessonDetailsDialog slot={selectedSlot} isOpen={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />
        </div>
    );
}

