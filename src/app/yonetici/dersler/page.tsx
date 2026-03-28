'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    collectionGroup, 
    doc, 
    updateDoc, 
    writeBatch, 
    Timestamp,
    addDoc,
    orderBy,
    getDoc,
    increment
} from 'firebase/firestore';
import { 
    Loader2, 
    Search, 
    Filter, 
    Calendar, 
    User, 
    Clock, 
    MoreHorizontal, 
    X, 
    CheckCircle2, 
    MinusCircle, 
    Plus,
    Video,
    Baby,
    Users as UsersIcon,
    AlertTriangle,
    BookOpen
} from 'lucide-react';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getCourseByCode } from '@/data/courses';

// UI Components for the manual assignment flow
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export default function AdminDerslerPage() {
    const db = useFirestore();
    const { toast } = useToast();

    // Base Data Fetching
    const lessonsQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(
            collection(db, 'lesson-slots'),
            where('status', '==', 'booked')
        );
    }, [db]);

    const { data: bookedLessons, isLoading: lessonsLoading, refetch: refetchLessons } = useCollection(lessonsQuery);

    const usersQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'users'));
    }, [db]);

    const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

    const [allChildren, setAllChildren] = useState<any[]>([]);
    const [isLoadingChildren, setIsLoadingChildren] = useState(false);

    useEffect(() => {
        const fetchChildren = async () => {
            if (!db) return;
            setIsLoadingChildren(true);
            try {
                const snap = await getDocs(collectionGroup(db, 'children'));
                setAllChildren(snap.docs.map(d => ({ ...d.data(), id: d.id, parentId: d.ref.parent.parent?.id })));
            } catch (e) {
                console.error("Error fetching children:", e);
            } finally {
                setIsLoadingChildren(false);
            }
        };
        fetchChildren();
    }, [db]);

    // Local State
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'trial' | 'regular'>('all');
    
    // Cancellation State
    const [lessonToCancel, setLessonToCancel] = useState<any>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    // Assignment States
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [assignStep, setAssignStep] = useState(1);
    const [selectedParentId, setSelectedParentId] = useState('');
    const [selectedChildId, setSelectedChildId] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    // Tiered Selection States
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
    const [selectedHour, setSelectedHour] = useState<number | null>(null);

    const teachers = useMemo(() => {
        return users?.filter(u => u.role === 'teacher') || [];
    }, [users]);

    const groupedSlots = useMemo(() => {
        const groups: { [date: string]: { [hour: number]: any[] } } = {};
        availableSlots.forEach(slot => {
            const date = slot.startTime.toDate();
            const dateKey = format(date, 'yyyy-MM-dd');
            const hour = date.getHours();
            if (!groups[dateKey]) groups[dateKey] = {};
            if (!groups[dateKey][hour]) groups[dateKey][hour] = [];
            groups[dateKey][hour].push(slot);
        });
        return groups;
    }, [availableSlots]);

    const filteredLessons = useMemo(() => {
        if (!bookedLessons || !allChildren || !users) return [];
        
        // 1. First augment all slots with basic info
        const augmentedSlots = bookedLessons.map(lesson => {
            // Resilient lookup for student
            const student = allChildren.find(c => 
                c.id === lesson.childId || 
                c.uid === lesson.childId || 
                c._id === lesson.childId
            );
            
            // Resilient lookup for parent
            const parent = users?.find(u => 
                u.id === lesson.bookedBy || 
                u.uid === lesson.bookedBy || 
                u._id === lesson.bookedBy
            );
            
            // Resilient lookup for teacher
            const teacher = users?.find(u => 
                u.id === lesson.teacherId || 
                u.uid === lesson.teacherId || 
                u._id === lesson.teacherId
            );

            const course = getCourseByCode(lesson.packageCode);
            const startTime = lesson.startTime?.toDate ? lesson.startTime.toDate() : new Date(lesson.startTime);

            return {
                ...lesson,
                studentName: student ? `${student.firstName}` : `Bilinmiyor (${lesson.childId?.substring(0, 5)})`,
                parentName: parent ? `${parent.firstName} ${parent.lastName}` : `Bilinmiyor (${lesson.bookedBy?.substring(0, 5)})`,
                teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : `Bilinmiyor (${lesson.teacherId?.substring(0, 5)})`,
                courseName: lesson.packageCode === 'FREE_TRIAL' ? 'Ücretsiz Deneme Dersi' : (course?.title || lesson.packageCode || 'Bilinmiyor'),
                isTrial: lesson.packageCode === 'FREE_TRIAL',
                startDateTime: startTime
            };
        });

        // 2. Group consecutive slots
        // Sort by teacher, student, and time to find contiguous blocks
        const sortedSlots = [...augmentedSlots].sort((a, b) => {
            const tA = a.teacherId || '';
            const tB = b.teacherId || '';
            if (tA !== tB) return tA.localeCompare(tB);
            
            const cA = a.childId || '';
            const cB = b.childId || '';
            if (cA !== cB) return cA.localeCompare(cB);
            
            return a.startDateTime.getTime() - b.startDateTime.getTime();
        });

        const groups: any[] = [];
        let currentGroup: any = null;

        sortedSlots.forEach(slot => {
            const isConsecutive = currentGroup && 
                currentGroup.teacherId === slot.teacherId &&
                currentGroup.childId === slot.childId &&
                currentGroup.packageCode === slot.packageCode &&
                Math.abs(slot.startDateTime.getTime() - (currentGroup.startDateTime.getTime() + currentGroup.duration * 60000)) < 1000;

            if (isConsecutive) {
                currentGroup.duration += 5;
                currentGroup.slotIds.push(slot.id);
            } else {
                currentGroup = {
                    ...slot,
                    duration: 5,
                    slotIds: [slot.id]
                };
                groups.push(currentGroup);
            }
        });

        // 3. Apply Search and Filters to groups
        let result = groups;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(l => 
                l.studentName.toLowerCase().includes(query) || 
                l.teacherName.toLowerCase().includes(query) ||
                l.parentName.toLowerCase().includes(query)
            );
        }
        
        if (typeFilter === 'trial') result = result.filter(l => l.isTrial);
        if (typeFilter === 'regular') result = result.filter(l => !l.isTrial);

        // Sort by Date (Descending)
        return result.sort((a, b) => b.startDateTime.getTime() - a.startDateTime.getTime());
    }, [bookedLessons, allChildren, users, searchQuery, typeFilter]);

    // Handlers
    const handleCancelLesson = async () => {
        if (!db || !lessonToCancel || !lessonToCancel.slotIds) return;
        setIsCancelling(true);
        try {
            const batch = writeBatch(db);
            
            // Reset ALL Slots in the group
            lessonToCancel.slotIds.forEach((slotId: string) => {
                const slotRef = doc(db, 'lesson-slots', slotId);
                batch.update(slotRef, {
                    status: 'available',
                    bookedBy: null,
                    childId: null,
                    packageCode: null,
                    isLive: null,
                    liveLessonUrl: null,
                    whatsappReminderSent: null,
                    cancelledBy: 'admin',
                    cancelledAt: Timestamp.now()
                });
            });

            // Refund logic (refund 1 UNIT if not trial)
            if (lessonToCancel.packageCode !== 'FREE_TRIAL' && lessonToCancel.bookedBy && lessonToCancel.childId) {
                const childRef = doc(db, 'users', lessonToCancel.bookedBy, 'children', lessonToCancel.childId);
                const childSnap = await getDoc(childRef);
                if (childSnap.exists()) {
                    batch.update(childRef, { remainingLessons: increment(1) });
                }
            }
            
            await batch.commit();
            toast({ title: 'Ders İptal Edildi', description: `${lessonToCancel.duration} dakikalık oturum başarıyla iptal edildi.` });
            refetchLessons();
        } catch (e) {
            console.error("Error cancelling lesson:", e);
            toast({ variant: 'destructive', title: 'Hata', description: 'İptal işlemi başarısız oldu.' });
        } finally {
            setIsCancelling(false);
            setLessonToCancel(null);
        }
    };

    const fetchAvailableSlots = async (teacherId: string) => {
        if (!db) return;
        setIsLoadingSlots(true);
        // Reset selection when teacher changes
        setSelectedSlotId('');
        setSelectedDateKey(null);
        setSelectedHour(null);
        try {
            const q = query(
                collection(db, 'lesson-slots'),
                where('teacherId', '==', teacherId),
                where('status', '==', 'available'),
                where('startTime', '>=', Timestamp.now())
            );
            const snap = await getDocs(q);
            const slots = snap.docs.map(d => ({ ...d.data(), id: d.id }));
            setAvailableSlots(slots.sort((a: any, b: any) => 
                (a.startTime.seconds || 0) - (b.startTime.seconds || 0)
            ));
        } catch (e) {
            console.error("Error fetching slots:", e);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleAssignLesson = async () => {
        if (!db || !selectedSlotId || !selectedChildId) return;
        setIsAssigning(true);
        try {
            const batch = writeBatch(db);
            const slotRef = doc(db, 'lesson-slots', selectedSlotId);
            const parentId = selectedParentId;
            const childInfo = allChildren.find(c => c.id === selectedChildId);
            const packageCode = childInfo?.assignedPackage || 'K4'; // Default to a standard package if unknown

            // Check if student has remaining lessons (skip if FREE_TRIAL)
            if (packageCode === 'FREE_TRIAL') {
                const parent = users?.find(u => u.uid === parentId);
                if (parent?.isLegacy) {
                    toast({ 
                        variant: 'destructive', 
                        title: 'Deneme Dersi Yasak', 
                        description: 'Bu veli "Eski Üye" olarak işaretlendiği için deneme dersi atanamaz.' 
                    });
                    setIsAssigning(false);
                    return;
                }
            } else if ((childInfo?.remainingLessons || 0) <= 0) {
                toast({ 
                    variant: 'destructive', 
                    title: 'Bakiye Yetersiz', 
                    description: 'Öğrencinin kalan ders kredisi bulunmuyor. Lütfen önce paket tanımlayın.' 
                });
                setIsAssigning(false);
                return;
            }

            // Record assignment to Activity Log
            const activityRef = doc(collection(db, 'activity-log'));
            batch.set(activityRef, {
                event: '👨‍💼 Manuel Ders Atandı',
                icon: '👨‍💼',
                details: {
                    'Öğrenci': childInfo?.firstName || '-',
                    'Ders': packageCode,
                    'Veli ID': parentId
                },
                createdAt: Timestamp.now()
            });

            // Update Slot
            batch.update(slotRef, {
                status: 'booked',
                bookedBy: parentId,
                childId: selectedChildId,
                packageCode: packageCode,
                bookedAt: Timestamp.now(),
                assignedBy: 'admin'
            });

            // Update Child (Decrement lesson)
            if (packageCode !== 'FREE_TRIAL' && childInfo?.parentId) {
                const childRef = doc(db, 'users', childInfo.parentId, 'children', selectedChildId);
                const childSnap = await getDoc(childRef);
                if (childSnap.exists()) {
                    batch.update(childRef, { remainingLessons: increment(-1) });
                } else {
                    console.warn("Child document not found for update:", childRef.path);
                    // It's safer to just skip credit update if doc is missing than to crash the whole batch
                }
            }

            await batch.commit();
            toast({ title: 'Ders Atandı', description: 'Manuel ders atama işlemi başarılı.' });
            setIsAssignDialogOpen(false);
            setAssignStep(1);
            refetchLessons();
        } catch (e) {
            console.error("Error assigning lesson:", e);
            toast({ variant: 'destructive', title: 'Hata', description: 'Ders atanırken bir hata oluştu.' });
        } finally {
            setIsAssigning(false);
        }
    };

    if (lessonsLoading || usersLoading || isLoadingChildren) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-medium text-slate-500 animate-pulse">Dersler yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">Ders Yönetimi</h2>
                    <p className="text-slate-500 font-medium">Tüm randevuları izleyin ve yönetin.</p>
                </div>
                <Button className="rounded-xl font-bold gap-2 px-6 h-11 shadow-lg" onClick={() => setIsAssignDialogOpen(true)}>
                    <Plus className="w-5 h-5" /> Yeni Ders Ata
                </Button>
            </div>

            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b bg-slate-50/50 p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder="Öğrenci, öğretmen veya veli adı..." 
                                className="pl-10 rounded-xl border-slate-200 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant={typeFilter === 'all' ? 'default' : 'outline'} 
                                onClick={() => setTypeFilter('all')}
                                className="rounded-xl font-bold"
                            >
                                Hepsi
                            </Button>
                            <Button 
                                variant={typeFilter === 'trial' ? 'default' : 'outline'} 
                                onClick={() => setTypeFilter('trial')}
                                className="rounded-xl font-bold"
                            >
                                Deneme
                            </Button>
                            <Button 
                                variant={typeFilter === 'regular' ? 'default' : 'outline'} 
                                onClick={() => setTypeFilter('regular')}
                                className="rounded-xl font-bold"
                            >
                                Normal
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                                    <TableHead className="font-black text-slate-800 p-6">Ders Zamanı</TableHead>
                                    <TableHead className="font-black text-slate-800 p-6">Öğrenci / Veli</TableHead>
                                    <TableHead className="font-black text-slate-800 p-6">Öğretmen</TableHead>
                                    <TableHead className="font-black text-slate-800 p-6">Ders Türü</TableHead>
                                    <TableHead className="font-black text-slate-800 p-6">Durum</TableHead>
                                    <TableHead className="p-6 text-right">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLessons.length === 0 ? (
                                    <TableRow key="empty-state">
                                        <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                                            Kayıtlı ders bulunamadı.
                                        </TableCell>
                                    </TableRow>
                                ) : filteredLessons.map((lesson, idx) => (
                                    <TableRow key={lesson.id || idx} className="group hover:bg-slate-50/50 transition-colors border-b">
                                        <TableCell className="p-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{format(lesson.startDateTime, 'dd MMMM yyyy', { locale: tr })}</span>
                                                <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                                                    <Clock className="w-3.5 h-3.5" /> 
                                                    {format(lesson.startDateTime, 'HH:mm')} 
                                                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-bold ml-1">
                                                        {lesson.duration} DK
                                                    </span>
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 font-black text-slate-800">
                                                    <Baby className="w-4 h-4 text-primary" /> {lesson.studentName}
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium ml-6">{lesson.parentName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-6">
                                            <div className="flex items-center gap-2 font-bold text-slate-700">
                                                <User className="w-4 h-4 text-slate-400" /> {lesson.teacherName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-6">
                                            <Badge className={cn(
                                                "rounded-lg font-bold px-3 py-1",
                                                lesson.isTrial ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                            )}>
                                                {lesson.courseName}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-6">
                                            <Badge variant="outline" className="rounded-lg border-emerald-200 bg-emerald-50 text-emerald-700 font-bold px-3 py-1">
                                                Onaylı
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                                                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-200">
                                                    <DropdownMenuLabel className="font-black text-slate-800 text-[10px] uppercase tracking-widest px-3 py-2">Ders İşlemleri</DropdownMenuLabel>
                                                    {lesson.isLive && (
                                                         <DropdownMenuItem className="rounded-xl font-bold text-primary gap-2 p-3 cursor-pointer" onClick={() => window.open(lesson.liveLessonUrl)}>
                                                            <Video className="w-4 h-4" /> Derse Git (Live)
                                                         </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="rounded-xl font-bold text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 p-3 cursor-pointer"
                                                        onClick={() => setLessonToCancel(lesson)}
                                                    >
                                                        <X className="w-4 h-4" /> Dersi İptal Et
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Assignment Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={(open) => {
                setIsAssignDialogOpen(open);
                if (!open) {
                    setAssignStep(1);
                    setSelectedParentId('');
                    setSelectedChildId('');
                    setSelectedTeacherId('');
                    setSelectedSlotId('');
                    setSelectedDateKey(null);
                    setSelectedHour(null);
                }
            }}>
                <DialogContent className="max-w-md rounded-[32px] border-none shadow-2xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900">Manuel Ders Ata</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">Öğrenci ve öğretmen için ders saati belirleyin.</DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        {assignStep === 1 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">1. Veliyi Seçin</Label>
                                    <Select value={selectedParentId} onValueChange={(val) => {
                                        setSelectedParentId(val);
                                        setSelectedChildId('');
                                    }}>
                                        <SelectTrigger className="rounded-xl h-12 border-slate-200">
                                            <SelectValue placeholder="Veli ara..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            {users?.filter(u => u.role === 'parent').map((p, idx) => (
                                                <SelectItem key={p.uid || p.id || idx} value={p.uid || p.id} className="rounded-lg">
                                                    {p.firstName} {p.lastName} ({p.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedParentId && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Label className="font-bold text-slate-700">2. Öğrenciyi Seçin</Label>
                                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                            <SelectTrigger className="rounded-xl h-12 border-slate-200">
                                                <SelectValue placeholder="Çocuk seç..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                {allChildren.filter(c => c.parentId === selectedParentId).map((c, idx) => (
                                                    <SelectItem key={c.id || idx} value={c.id} className="rounded-lg">
                                                        {c.firstName} (Kalan: {c.remainingLessons || 0} ders)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        )}

                        {assignStep === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">3. Öğretmen Seçin</Label>
                                    <Select value={selectedTeacherId} onValueChange={(val) => {
                                        setSelectedTeacherId(val);
                                        fetchAvailableSlots(val);
                                    }}>
                                        <SelectTrigger className="rounded-xl h-12 border-slate-200">
                                            <SelectValue placeholder="Öğretmen seç..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            {teachers.map((t, idx) => (
                                                <SelectItem key={t.uid || t.id || idx} value={t.uid || t.id} className="rounded-lg">
                                                    {t.firstName} {t.lastName || ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedTeacherId && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {isLoadingSlots ? (
                                            <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                                        ) : availableSlots.length === 0 ? (
                                            <p className="text-sm text-red-500 font-medium p-4 bg-red-50 rounded-xl">Bu öğretmenin hiç müsait zamanı bulunmuyor.</p>
                                        ) : (
                                            <div className="space-y-6">
                                                {/* Day Selection */}
                                                <div className="space-y-3">
                                                    <Label className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">GÜN SEÇİN</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.keys(groupedSlots).map(dateKey => (
                                                            <Button
                                                                key={dateKey}
                                                                variant={selectedDateKey === dateKey ? 'default' : 'outline'}
                                                                onClick={() => {
                                                                    setSelectedDateKey(dateKey);
                                                                    setSelectedHour(null);
                                                                    setSelectedSlotId('');
                                                                }}
                                                                className="rounded-xl font-bold h-10 px-4"
                                                                size="sm"
                                                            >
                                                                {format(new Date(dateKey), 'dd MMM', { locale: tr })}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Hour Selection */}
                                                {selectedDateKey && (
                                                    <div className="space-y-3 animate-in fade-in slide-in-from-left-2">
                                                        <Label className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">SAAT SEÇİN</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {Object.keys(groupedSlots[selectedDateKey]).sort((a,b)=>parseInt(a)-parseInt(b)).map(hour => (
                                                                <Button
                                                                    key={hour}
                                                                    variant={selectedHour === parseInt(hour) ? 'default' : 'outline'}
                                                                    onClick={() => {
                                                                        setSelectedHour(parseInt(hour));
                                                                        setSelectedSlotId('');
                                                                    }}
                                                                    className="rounded-xl font-bold h-10 w-12 p-0"
                                                                    size="sm"
                                                                >
                                                                    {hour}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Minute Selection */}
                                                {selectedDateKey && selectedHour !== null && (
                                                    <div className="space-y-3 animate-in fade-in slide-in-from-left-2">
                                                        <Label className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">DAKİKA SEÇİN</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {groupedSlots[selectedDateKey][selectedHour].map(slot => {
                                                                const date = slot.startTime.toDate();
                                                                const minute = date.getMinutes();
                                                                const displayMinute = minute.toString().padStart(2, '0');
                                                                return (
                                                                    <Button
                                                                        key={slot.id}
                                                                        variant={selectedSlotId === slot.id ? 'default' : 'secondary'}
                                                                        onClick={() => setSelectedSlotId(slot.id)}
                                                                        className={cn(
                                                                            "rounded-xl font-bold h-10 px-4",
                                                                            selectedSlotId === slot.id ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                                        )}
                                                                        size="sm"
                                                                    >
                                                                        .{displayMinute}
                                                                    </Button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        {assignStep === 1 ? (
                            <Button 
                                key="step-1-btn"
                                disabled={!selectedChildId} 
                                onClick={() => setAssignStep(2)}
                                className="w-full rounded-xl h-12 font-bold"
                            >
                                Devam Et <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        ) : (
                            <div key="step-2-footer" className="flex gap-2 w-full">
                                <Button variant="outline" onClick={() => setAssignStep(1)} className="flex-1 rounded-xl h-12 font-bold">Geri</Button>
                                <Button 
                                    disabled={!selectedSlotId || isAssigning} 
                                    onClick={handleAssignLesson}
                                    className="flex-[2] rounded-xl h-12 font-bold bg-primary"
                                >
                                    {isAssigning ? <Loader2 className="animate-spin h-4 w-4" /> : 'Atamayı Tamamla'}
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel AlertDialog */}
            <AlertDialog open={!!lessonToCancel} onOpenChange={(open) => !open && setLessonToCancel(null)}>
                <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black text-slate-900">Dersi İptal Et?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 font-medium">
                            <span className="font-bold text-slate-900">{lessonToCancel?.studentName}</span> isimli öğrencinin <span className="font-bold text-slate-900">{lessonToCancel?.startDateTime && format(lessonToCancel.startDateTime, 'dd MMM HH:mm', { locale: tr })}</span> tarihindeki dersini iptal etmek istediğinizden emin misiniz?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 mt-4">
                        <AlertDialogCancel className="rounded-xl h-12 border-slate-200 font-bold">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleCancelLesson}
                            disabled={isCancelling}
                            className="rounded-xl h-12 bg-red-600 hover:bg-red-700 font-bold"
                        >
                            {isCancelling ? <Loader2 className="animate-spin h-4 w-4" /> : 'Evet, İptal Et'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// Simple ArrowRight component if not available
function ArrowRight({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
        </svg>
    )
}
