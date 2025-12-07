
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where, addDoc, Timestamp, writeBatch, getDocs, doc } from 'firebase/firestore';
import { Loader2, Calendar, Clock, Square, CheckSquare, Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, getDay, startOfWeek, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toDate, toZonedTime } from 'date-fns-tz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from '@/lib/utils';
import { LessonDetailsDialog } from './lesson-details-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';


type SlotDetails = {
    id: string;
    status: 'available' | 'booked';
    teacherId: string;
    bookedBy?: string;
    childId?: string;
    startTime: Timestamp;
    packageCode?: string;
};

const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
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
    
    // State for weekly template
    const [weekTemplate, setWeekTemplate] = useState<Map<number, Set<string>>>(new Map(Array.from({length: 7}, (_, i) => [i, new Set()])));
    const [currentDragDay, setCurrentDragDay] = useState<number | null>(null);
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [confirmTemplateSave, setConfirmTemplateSave] = useState(false);


    const lessonSlotsQuery = useMemoFirebase(() => {
        if (!db || !user) return null;
        // Simplified query to avoid composite index requirement
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid));
    }, [db, user]);

    const { data: lessonSlots, isLoading: areSlotsLoading, refetch } = useCollection(lessonSlotsQuery);

    const slotsForSelectedDate = useMemo(() => {
        if (!lessonSlots) return new Map<string, SlotDetails>();
        const slotsMap = new Map<string, SlotDetails>();
        lessonSlots.forEach(slot => {
            const zonedSlotDate = toDate(slot.startTime.toDate(), { timeZone: turkeyTimeZone });
            if (isSameDay(zonedSlotDate, selectedDate)) {
                const time = format(zonedSlotDate, 'HH:mm');
                slotsMap.set(time, slot as SlotDetails);
            }
        });
        return slotsMap;
    }, [lessonSlots, selectedDate]);

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
                const slotDate = toDate(`${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`, { timeZone: turkeyTimeZone });
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

        const batch = writeBatch(db);

        // 1. Delete all future available slots for this teacher
        const q = query(collection(db, 'lesson-slots'), 
            where('teacherId', '==', user.uid),
            where('status', '==', 'available'),
            where('startTime', '>=', Timestamp.fromDate(new Date()))
        );
        const slotsToDeleteSnap = await getDocs(q);
        slotsToDeleteSnap.forEach(doc => batch.delete(doc.ref));

        // 2. Create new slots based on the template for the next year
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const date = addDays(today, i);
            const dayOfWeek = getDay(date); // Sunday is 0, Monday is 1
            const templateDaySlots = weekTemplate.get(dayOfWeek);
            
            templateDaySlots?.forEach(time => {
                const slotDate = toDate(`${format(date, 'yyyy-MM-dd')}T${time}:00`, { timeZone: turkeyTimeZone });
                const newSlotRef = doc(collection(db, 'lesson-slots'));
                batch.set(newSlotRef, {
                    teacherId: user.uid,
                    startTime: Timestamp.fromDate(slotDate),
                    status: 'available',
                });
            });
        }

        try {
            await batch.commit();
            toast({ title: "Başarılı!", description: "Haftalık şablonunuz kaydedildi ve gelecek bir yıl için takviminiz güncellendi.", className: "bg-green-500 text-white" });
            refetch(); // Refetch all slots to update the view
        } catch(e) {
            console.error("Failed to save template", e);
            toast({ variant: 'destructive', title: "Hata!", description: "Şablon kaydedilirken bir hata oluştu." });
        } finally {
            setIsSavingTemplate(false);
            setConfirmTemplateSave(false);
        }
    };


    if (userLoading || areSlotsLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
    
    const weekDates = Array.from({length: 7}, (_, i) => addDays(startOfWeek(selectedDate, {weekStartsOn: 1}), i));

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
                               <input type="date" value={format(selectedDate, 'yyyy-MM-dd')} onChange={(e) => setSelectedDate(new Date(e.target.value))} className='p-2 border rounded-md'/>
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
                            {weekDates.map((date) => {
                                const dayIndex = getDay(date);
                                const dayName = format(date, 'EEEE', { locale: tr });
                                const daySlots = weekTemplate.get(dayIndex) || new Set();
                                const slotsMap = new Map<string, any>();
                                daySlots.forEach(time => slotsMap.set(time, {status: 'available'}));
                                
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
