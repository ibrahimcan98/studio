'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp, writeBatch, getDocs, doc } from 'firebase/firestore';
import { Loader2, Square, Save, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getDay, addDays, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
  const dateStr = formatInTimeZone(date, turkeyTimeZone, 'yyyy-MM-dd');
  const fullStr = `${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+03:00`;
  return new Date(fullStr);
};

const timeSlots = Array.from({ length: 24 * 12 }, (_, i) => {
    const totalMinutes = i * 5;
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
        <div className="relative border rounded-2xl p-4 bg-slate-50/50 max-h-[500px] overflow-y-auto custom-scrollbar shadow-inner">
            {timeSlots.map((time) => {
                const slotData = slots.get(time);
                const minutes = parseInt(time.split(':')[1]);
                const isFullHour = minutes === 0;
                const isQuarterHour = [15, 30, 45].includes(minutes);

                let dynamicStatus: 'available' | 'booked' | 'closed' | undefined = slotData?.status;
                if (isDragging && dragSelection.has(time) && slotData?.status !== 'booked') {
                    dynamicStatus = dragMode ?? slotData?.status;
                }

                return (
                    <div
                        key={time}
                        className={cn("flex items-center h-7")}
                        onMouseDown={() => onMouseDown(time)}
                        onMouseEnter={() => onMouseEnter(time)}
                    >
                        <div className="text-[10px] text-slate-400 w-14 text-right pr-4 shrink-0 font-bold">
                            {isFullHour && <span className="text-slate-800 font-black">{time}</span>}
                            {isQuarterHour && !isFullHour && <span className="text-slate-400 font-bold">{time}</span>}
                        </div>
                        <div
                            className={cn(
                                "flex-1 h-full border-l transition-all duration-75 relative group",
                                isFullHour ? "border-t border-t-slate-300" : "border-t border-t-slate-100",
                                dynamicStatus === 'booked' ? 'bg-red-500/80 cursor-not-allowed border-none' :
                                    dynamicStatus === 'available' ? 'bg-emerald-500/80 cursor-pointer border-none shadow-sm' :
                                        'hover:bg-slate-200/50 cursor-pointer'
                            )}
                            onClick={() => onSlotClick(time)}
                        >
                            {dynamicStatus === 'booked' && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-black text-white uppercase tracking-tighter">REZERVE</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export function TeacherCalendarDialog({ 
  isOpen, 
  onOpenChange, 
  teacher 
}: { 
  isOpen: boolean, 
  onOpenChange: (o: boolean) => void, 
  teacher: any 
}) {
    const db = useFirestore();
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [stagedSlots, setStagedSlots] = useState<Map<string, SlotDetails>>(new Map());

    const [isDragging, setIsDragging] = useState(false);
    const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
    const [dragEndSlot, setDragEndSlot] = useState<string | null>(null);
    const [dragMode, setDragMode] = useState<'available' | 'closed' | null>(null);
    
    const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
    const [isApplyingChanges, setIsApplyingChanges] = useState(false);

    const [rangeStart, setRangeStart] = useState('09:00');
    const [rangeEnd, setRangeEnd] = useState('12:00');

    const lessonSlotsQuery = useMemoFirebase(() => {
        if (!db || !teacher) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', teacher.id));
    }, [db, teacher]);

    const { data: lessonSlots, isLoading: areSlotsLoading, refetch } = useCollection(lessonSlotsQuery);

    const selectedDateStr = useMemo(() => formatInTimeZone(selectedDate, turkeyTimeZone, 'yyyy-MM-dd'), [selectedDate]);

    const originalSlotsForSelectedDate = useMemo(() => {
        if (!lessonSlots) return new Map<string, SlotDetails>();
        const slotsMap = new Map<string, SlotDetails>();
        lessonSlots.forEach(slot => {
            const slotDateStr = formatInTimeZone(slot.startTime.toDate(), turkeyTimeZone, 'yyyy-MM-dd');
            if (slotDateStr === selectedDateStr) {
                const time = formatInTimeZone(slot.startTime.toDate(), turkeyTimeZone, 'HH:mm');
                slotsMap.set(time, slot as SlotDetails);
            }
        });
        return slotsMap;
    }, [lessonSlots, selectedDateStr]);
    
    useEffect(() => {
        setStagedSlots(new Map(originalSlotsForSelectedDate));
    }, [originalSlotsForSelectedDate, isOpen]); // Also reset when dialog opens


    const availableDays = useMemo(() => {
        if (!lessonSlots) return [];
        return lessonSlots
            .filter(slot => slot.status === 'available')
            .map(slot => toZonedTime(slot.startTime.toDate(), turkeyTimeZone));
    }, [lessonSlots]);

    const handleSlotClick = (time: string) => {
        const slot = stagedSlots.get(time);
        if (slot?.status === 'booked') {
            toast({ title: 'Dolu Ders', description: 'Bu saat bir veli tarafından rezerve edilmiş. Lütfen Dersler panelinden yönetin.', variant: 'default' });
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

    const handleMouseUp = useCallback(() => {
        if (!isDragging || !dragMode || !teacher || !selectedDate) {
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
                        teacherId: teacher.id,
                        startTime: Timestamp.fromDate(dateInTurkey)
                     });
                } else if (dragMode === 'closed' && existingSlot) {
                    newStaged.delete(time);
                }
            });
            return newStaged;
        });

        resetDragState();
    }, [isDragging, dragMode, teacher, selectedDate, dragSelection]);

    const handleAddTimeRange = () => {
        if (!teacher || !selectedDate) return;
        const startIndex = timeSlots.indexOf(rangeStart);
        const endIndex = timeSlots.indexOf(rangeEnd);
        if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Geçersiz saat aralığı.' });
            return;
        }

        setStagedSlots(prev => {
            const next = new Map(prev);
            for (let i = startIndex; i < endIndex; i++) {
                const time = timeSlots[i];
                if (next.get(time)?.status === 'booked') continue;
                
                const dateInTurkey = createDateInTurkeyTimeZone(selectedDate, time);
                next.set(time, {
                    id: `new-${time}`,
                    status: 'available',
                    teacherId: teacher.id,
                    startTime: Timestamp.fromDate(dateInTurkey)
                });
            }
            return next;
        });

        toast({ title: 'Aralık Eklendi', description: `${rangeStart} - ${rangeEnd} arası müsait olarak işaretlendi.` });
    };

    const handleApplyChanges = async () => {
        if (!db || !teacher || !selectedDate) return;
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

        const ops: { type: 'delete' | 'set', ref: any, data?: any }[] = [];

        slotsToDelete.forEach(slot => {
            ops.push({ type: 'delete', ref: doc(db, 'lesson-slots', slot.id) });
        });

        slotsToAdd.forEach(slot => {
            const newSlotRef = doc(collection(db, 'lesson-slots'));
            ops.push({
                type: 'set',
                ref: newSlotRef,
                data: {
                    teacherId: teacher.id,
                    startTime: slot.startTime,
                    status: 'available',
                }
            });
        });

        try {
            const chunkSize = 400;
            for (let i = 0; i < ops.length; i += chunkSize) {
                const chunk = ops.slice(i, i + chunkSize);
                const batch = writeBatch(db);
                chunk.forEach(op => {
                    if (op.type === 'delete') batch.delete(op.ref);
                    else batch.set(op.ref, op.data);
                });
                await batch.commit();
            }
            await refetch();
            toast({
                title: 'Kaydedildi',
                description: 'Öğretmen programı admin tarafından başarıyla güncellendi.',
                className: 'bg-green-500 text-white'
            });
        } catch (error) {
            console.error("Error applying changes as admin:", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Değişiklikler kaydedilirken bir hata oluştu.' });
        } finally {
            setIsApplyingChanges(false);
        }
    };


    const handleApplyTemplateToFutureDays = async () => {
        if (!db || !teacher || !selectedDate) return;
        setIsApplyingTemplate(true);

        const dayOfWeekToApply = getDay(selectedDate);
        const templateTimes = Array.from(stagedSlots.keys()).filter(time => stagedSlots.get(time)?.status === 'available');

        const q = query(
            collection(db, 'lesson-slots'),
            where('teacherId', '==', teacher.id),
            where('status', '==', 'available'),
            where('startTime', '>', startOfDay(new Date()))
        );

        try {
            const querySnapshot = await getDocs(q);
            const ops: { type: 'delete' | 'set', ref: any, data?: any }[] = [];

            querySnapshot.forEach(docSnap => {
                const slotData = docSnap.data();
                const slotDate = toZonedTime(slotData.startTime.toDate(), turkeyTimeZone);
                if (getDay(slotDate) === dayOfWeekToApply) {
                    ops.push({ type: 'delete', ref: docSnap.ref });
                }
            });

            for (let i = 0; i < 12; i++) {
                let futureDate = addDays(selectedDate, i * 7);
                if(startOfDay(futureDate) < startOfDay(new Date())) continue;

                templateTimes.forEach(time => {
                    const slotDateTimeInTurkey = createDateInTurkeyTimeZone(futureDate, time);
                    const newSlotRef = doc(collection(db, 'lesson-slots'));
                    ops.push({ 
                        type: 'set', 
                        ref: newSlotRef, 
                        data: {
                            teacherId: teacher.id,
                            startTime: Timestamp.fromDate(slotDateTimeInTurkey),
                            status: 'available',
                        }
                    });
                });
            }

            const chunkSize = 400;
            for (let i = 0; i < ops.length; i += chunkSize) {
                const chunk = ops.slice(i, i + chunkSize);
                const batch = writeBatch(db);
                chunk.forEach(op => {
                    if (op.type === 'delete') batch.delete(op.ref);
                    else batch.set(op.ref, op.data);
                });
                await batch.commit();
            }

            await refetch();
            toast({
                title: 'Şablon Uygulandı',
                description: `Admin: Program gelecekteki 12 haftaya kopyalandı.`,
                className: 'bg-green-500 text-white'
            });

        } catch (error) {
            console.error('Error applying template by admin: ', error);
             toast({ variant: 'destructive', title: 'Hata', description: 'Şablon uygulanırken bir sorun oluştu.' });
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


    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border-none shadow-2xl p-0 font-sans" onMouseUp={handleMouseUp}>
          <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
               <DialogHeader className="relative z-10">
                   <div className="flex items-center gap-4">
                       <Avatar className="h-16 w-16 border-4 border-white/20">
                           <AvatarFallback className="bg-white/20 text-white font-black text-xl uppercase">
                               {teacher?.firstName?.[0]}{teacher?.lastName?.[0]}
                           </AvatarFallback>
                       </Avatar>
                       <div className="flex flex-col">
                           <DialogTitle className="text-3xl font-black text-white">{teacher?.firstName} {teacher?.lastName}</DialogTitle>
                           <DialogDescription className="text-emerald-100 font-bold opacity-90 drop-shadow-sm">Takvim ve Müsaitlik Yönetimi (Admin)</DialogDescription>
                       </div>
                   </div>
               </DialogHeader>
          </div>

          <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Calendar & Controls */}
                  <div className="lg:col-span-5 space-y-6">
                      <Card className="p-4 border-none shadow-md bg-slate-50/50 rounded-[28px]">
                          <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && setSelectedDate(date)}
                              locale={tr}
                              modifiers={{ available: availableDays }}
                              modifiersClassNames={{ available: 'bg-emerald-100 text-emerald-700 font-black rounded-full' }}
                              className="rounded-xl mx-auto"
                          />
                      </Card>

                      <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Toplu Aralık Ekle</h4>
                          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                              <Select value={rangeStart} onValueChange={setRangeStart}>
                                  <SelectTrigger className="h-9 rounded-xl border-none font-bold text-xs bg-slate-50 hover:bg-slate-100 transition-colors">
                                      <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px] rounded-xl border-none shadow-2xl">
                                      {timeSlots.filter((_,i) => i % 6 === 0).map(t => <SelectItem key={t} value={t} className="text-xs font-bold">{t}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                              <span className="text-slate-200 font-bold">-</span>
                              <Select value={rangeEnd} onValueChange={setRangeEnd}>
                                  <SelectTrigger className="h-9 rounded-xl border-none font-bold text-xs bg-slate-50 hover:bg-slate-100 transition-colors">
                                      <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px] rounded-xl border-none shadow-2xl">
                                      {timeSlots.filter((_,i) => i % 6 === 0).map(t => <SelectItem key={t} value={t} className="text-xs font-bold">{t}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                              <Button size="sm" onClick={handleAddTimeRange} className="h-9 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">EKLE</Button>
                          </div>
                      </div>

                      <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl space-y-3">
                          <div className="flex items-center gap-2">
                             <AlertCircle className="w-4 h-4 text-blue-500" />
                             <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest">Yardımcı Bilgi</span>
                          </div>
                          <p className="text-xs text-blue-600/80 leading-relaxed font-medium">
                            Takvim üzerindeki hücrelere **tıklayarak** veya **sürükleyerek** müsaitlik durumunu degiştirebilirsiniz. Değişiklikler "Değişiklikleri Uygula" butonuna basana kadar kaydedilmez.
                          </p>
                      </div>
                  </div>

                  {/* Right Column: Time Grid */}
                  <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-black text-slate-800 tracking-tight">
                              {formatInTimeZone(selectedDate, turkeyTimeZone, 'dd MMMM yyyy, EEEE', { locale: tr })}
                          </h3>
                          <div className="flex gap-4">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500/80 rounded-sm shadow-sm"/> <span className="text-[10px] font-bold text-slate-500">MÜSAİT</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 border bg-white rounded-sm shadow-sm"/> <span className="text-[10px] font-bold text-slate-500">KAPALI</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500/80 rounded-sm shadow-sm"/> <span className="text-[10px] font-bold text-slate-500">DOLU</span></div>
                          </div>
                      </div>

                      {areSlotsLoading ? (
                          <div className="flex justify-center items-center h-[500px] bg-slate-50 rounded-2xl border-2 border-dashed">
                              <Loader2 className="h-8 w-8 animate-spin text-emerald-500 opacity-20" />
                          </div>
                      ) : (
                          <TimeGrid 
                              slots={stagedSlots}
                              onMouseDown={handleMouseDown}
                              onMouseEnter={(time) => isDragging && setDragEndSlot(time)}
                              onSlotClick={handleSlotClick}
                              isDragging={isDragging}
                              dragSelection={dragSelection}
                              dragMode={dragMode}
                          />
                      )}
                  </div>
              </div>
          </div>

          <DialogFooter className="p-8 bg-slate-50 rounded-b-[32px] flex flex-col sm:flex-row gap-3">
              <Button onClick={() => onOpenChange(false)} variant="outline" className="h-12 px-6 rounded-xl font-bold border-2">Kapat</Button>
              <div className="flex-1 flex gap-3">
                  <Button onClick={handleApplyTemplateToFutureDays} disabled={isApplyingTemplate} variant="secondary" className="flex-1 h-12 rounded-xl font-bold gap-2">
                      {isApplyingTemplate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                      Şablonu 12 Haftaya Uygula
                  </Button>
                  <Button onClick={handleApplyChanges} disabled={isApplyingChanges} className="flex-1 h-12 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 gap-2">
                      {isApplyingChanges ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      DEĞİŞİKLİKLERİ UYGULA
                  </Button>
              </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
