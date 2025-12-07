

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, errorEmitter, FirestorePermissionError, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, Timestamp, writeBatch, getDocs, doc } from 'firebase/firestore';
import { Loader2, Calendar as CalendarIcon, Clock, Square, CheckSquare, Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, getDay, startOfWeek, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from '@/lib/utils';
import { LessonDetailsDialog } from './lesson-details-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
     if (slots.size === 0 && !isDragging) {
        return (
            <div 
                className="relative border-2 border-dashed rounded-lg p-2 bg-background min-h-[400px] flex items-center justify-center text-center text-muted-foreground cursor-cell"
                onMouseDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const slotHeight = e.currentTarget.scrollHeight / timeSlots.length;
                    const timeIndex = Math.floor(y / slotHeight);
                    const time = timeSlots[Math.max(0, Math.min(timeSlots.length - 1, timeIndex))];
                    onMouseDown(time);
                }}
                onMouseEnter={(e) => {
                     if (isDragging) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = e.clientY - rect.top;
                        const slotHeight = e.currentTarget.scrollHeight / timeSlots.length;
                        const timeIndex = Math.floor(y / slotHeight);
                        const time = timeSlots[Math.max(0, Math.min(timeSlots.length - 1, timeIndex))];
                        onMouseEnter(time);
                     }
                }}
            >
                <div>
                    Bu gün için ayarlanmış müsait zaman aralığı yok.
                    <br/>
                    Sürükleyerek yeni aralık ekleyebilirsiniz.
                </div>
            </div>
        )
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
    const [activeTab, setActiveTab] = useState('daily');
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
    const [dragEndSlot, setDragEndSlot] = useState<string | null>(null);
    const [dragMode, setDragMode] = useState<'available' | 'closed' | null>(null);
    
    const [weekTemplate, setWeekTemplate] = useState<Map<number, Set<string>>>(() => {
        const map = new Map<number, Set<string>>();
        for (let i = 0; i < 7; i++) {
            map.set(i, new Set());
        }
        return map;
    });
    const [currentDragDay, setCurrentDragDay] = useState<number | null>(null);
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [confirmTemplateSave, setConfirmTemplateSave] = useState(false);
    const [calendarKey, setCalendarKey] = useState(Date.now());
    const [isTemplateLoaded, setIsTemplateLoaded] = useState(false);


    const lessonSlotsQuery = useMemoFirebase(() => {
        if (!db || !user) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid));
    }, [db, user]);

    const { data: lessonSlots, isLoading: areSlotsLoading, refetch } = useCollection(lessonSlotsQuery);

     useEffect(() => {
        // This effect runs only once when the component mounts and lessonSlots are loaded.
        // It sets the initial state of the weekly template from the database.
        // After this initial load, the weekTemplate state is only managed by user interactions.
        if (lessonSlots && !isTemplateLoaded) {
            const newTemplate = new Map<number, Set<string>>();
             for (let i = 0; i < 7; i++) {
                newTemplate.set(i, new Set());
            }

            lessonSlots.forEach(slot => {
                 if (slot.status === 'available') {
                    const zonedTime = toZonedTime(slot.startTime.toDate(), turkeyTimeZone);
                    const day = getDay(zonedTime); // Sunday = 0, Monday = 1, etc.
                    const time = format(zonedTime, 'HH:mm');
                    
                    const daySlots = newTemplate.get(day) || new Set();
                    daySlots.add(time);
                    newTemplate.set(day, daySlots);
                }
            });
             setWeekTemplate(newTemplate);
             setIsTemplateLoaded(true); // Mark as loaded to prevent this effect from running again
        }
    }, [lessonSlots, isTemplateLoaded]);


    const slotsForSelectedDate = useMemo(() => {
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
        if (!isDragging || !dragMode || !user || !db || activeTab !== 'daily' || !selectedDate) {
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
                const dateString = format(selectedDate, 'yyyy-MM-dd');
                const slotDateTimeString = `${dateString}T${time}:00`;
                const slotDate = toZonedTime(slotDateTimeString, turkeyTimeZone);
                
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
    
     const handleWeeklyMouseUp = () => {
        if (!isDragging || !dragMode || !user || !db || activeTab !== 'weekly' || currentDragDay === null) {
            resetDragState();
            return;
        }
        
        const slotsToUpdate = dragSelection;
        resetDragState();

        if (slotsToUpdate.size === 0) return;

        setWeekTemplate(prev => {
            const newTemplate = new Map(prev);
            const daySlots = new Set(newTemplate.get(currentDragDay!) || []);
            slotsToUpdate.forEach(time => {
                if (dragMode === 'available') {
                    daySlots.add(time);
                } else {
                    daySlots.delete(time);
                }
            });
            newTemplate.set(currentDragDay!, daySlots);
            return newTemplate;
        });
    };

    const resetDragState = () => {
        setIsDragging(false);
        setDragStartSlot(null);
        setDragEndSlot(null);
        setDragMode(null);
        setCurrentDragDay(null);
    };

    useEffect(() => {
        const finalMouseUp = activeTab === 'daily' ? handleMouseUp : handleWeeklyMouseUp;
        window.addEventListener('mouseup', finalMouseUp);
        return () => window.removeEventListener('mouseup', finalMouseUp);
    }, [isDragging, dragStartSlot, dragEndSlot, activeTab, selectedDate]);
    
    const handleSaveTemplate = async () => {
        if (!user || !db) return;

        setIsSavingTemplate(true);
        toast({ title: "Şablon Kaydediliyor...", description: "Bu işlem biraz zaman alabilir. Lütfen bekleyin." });

        try {
            const q = query(
                collection(db, 'lesson-slots'),
                where('teacherId', '==', user.uid),
                where('status', '==', 'available'),
                where('startTime', '>=', Timestamp.fromDate(new Date()))
            );
            const slotsToDeleteSnap = await getDocs(q);
            const slotsToDeleteRefs = slotsToDeleteSnap.docs.map(d => d.ref);

            const slotsToAdd: any[] = [];
            const today = new Date();
            for (let i = 0; i < 90; i++) { 
                const date = addDays(today, i);
                const dayOfWeek = getDay(date);
                const templateDaySlots = weekTemplate.get(dayOfWeek);
                templateDaySlots?.forEach(time => {
                    const slotDate = toZonedTime(`${format(date, 'yyyy-MM-dd')}T${time}:00`, turkeyTimeZone);
                    slotsToAdd.push({
                        teacherId: user.uid,
                        startTime: Timestamp.fromDate(slotDate),
                        status: 'available',
                    });
                });
            }

            for (let i = 0; i < slotsToDeleteRefs.length; i += 500) {
                const batch = writeBatch(db);
                const chunk = slotsToDeleteRefs.slice(i, i + 500);
                chunk.forEach(ref => batch.delete(ref));
                await batch.commit();
            }

            for (let i = 0; i < slotsToAdd.length; i += 500) {
                const batch = writeBatch(db);
                const chunk = slotsToAdd.slice(i, i + 500);
                chunk.forEach(slotData => {
                    const newSlotRef = doc(collection(db, 'lesson-slots'));
                    batch.set(newSlotRef, slotData);
                });
                await batch.commit();
            }

            toast({ title: "Başarılı!", description: "Haftalık şablonunuz kaydedildi ve gelecek 90 gün için takviminiz güncellendi.", className: "bg-green-500 text-white" });
            await refetch();
            setCalendarKey(Date.now());
            // No need to set isTemplateLoaded to false, keep the UI state
        } catch (e) {
            console.error("Failed to save template", e);
            toast({ variant: 'destructive', title: "Hata!", description: "Şablon kaydedilirken bir hata oluştu." });
        } finally {
            setIsSavingTemplate(false);
            setConfirmTemplateSave(false);
        }
    };


    if (userLoading || areSlotsLoading || !isTemplateLoaded) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
    
    const weekDates = Array.from({length: 7}, (_, i) => addDays(startOfWeek(new Date(), {weekStartsOn: 1}), i));

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
             <div>
                <h2 className="text-3xl font-bold tracking-tight">Müsaitlik Takvimi (Türkiye Saati)</h2>
                 <p className="text-muted-foreground">Haftalık çalışma şablonunuzu oluşturun veya belirli bir gün için değişiklik yapın.</p>
            </div>
            
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="daily">Günlük</TabsTrigger>
                    <TabsTrigger value="weekly">Haftalık Şablon</TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
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
                </TabsContent>

                <TabsContent value="weekly">
                     <Card className="p-4 sm:p-6 mt-4">
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold">Haftalık Çalışma Şablonu</h3>
                                <p className="text-sm text-muted-foreground">Her hafta tekrarlanacak standart çalışma saatlerinizi belirleyin.</p>
                            </div>
                            <div className='flex flex-col items-start gap-2'>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="confirm-save" checked={confirmTemplateSave} onCheckedChange={(checked) => setConfirmTemplateSave(checked as boolean)} disabled={isSavingTemplate}/>
                                    <Label htmlFor="confirm-save" className='text-xs text-destructive'>Gelecekteki tüm müsaitliklerimi sil ve bu şablonu uygula.</Label>
                                </div>
                                <Button onClick={handleSaveTemplate} disabled={isSavingTemplate || !confirmTemplateSave}>
                                    {isSavingTemplate ? <Loader2 className='animate-spin mr-2'/> : <CheckSquare className='mr-2'/>}
                                    Şablonu Kaydet
                                </Button>
                            </div>
                        </div>
                        <div className='space-y-4'>
                           {[...Array(7)].map((_, i) => {
                                const dayIndex = (i + 1) % 7; // Monday=1, ..., Sunday=0
                                const dayName = format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i), 'EEEE', { locale: tr });
                                const daySlots = weekTemplate.get(dayIndex) || new Set();
                                const slotsMap = new Map<string, any>();
                                daySlots.forEach(time => slotsMap.set(time, { status: 'available' }));

                                return (
                                    <div key={dayIndex} className="grid grid-cols-[100px_1fr] gap-4 items-start">
                                        <h4 className="font-semibold text-right pt-2">{dayName}</h4>
                                        <div onMouseLeave={resetDragState}>
                                            <TimeGrid 
                                                slots={slotsMap}
                                                onMouseDown={(time) => {
                                                    setIsDragging(true);
                                                    setCurrentDragDay(dayIndex);
                                                    setDragStartSlot(time);
                                                    setDragEndSlot(time);
                                                    setDragMode(daySlots.has(time) ? 'closed' : 'available');
                                                }}
                                                onMouseEnter={(time) => isDragging && setDragEndSlot(time)}
                                                onSlotClick={() => {}}
                                                isDragging={isDragging && currentDragDay === dayIndex}
                                                dragSelection={currentDragDay === dayIndex ? dragSelection : new Set()}
                                                dragMode={dragMode}
                                            />
                                        </div>
                                    </div>
                                )
                           })}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <LessonDetailsDialog slot={selectedSlot} isOpen={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />
        </div>
    );
}

    

    