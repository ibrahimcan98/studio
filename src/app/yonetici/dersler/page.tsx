'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
    increment,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';
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
    BookOpen,
    MessageSquare,
    FileText,
    Upload,
    Link as LinkIcon,
    History,
    Folder,
    ChevronRight
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { format, addMinutes, isAfter, isSameDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getCourseByCode, COURSES } from '@/data/courses';
import { sendAdminLessonActionEmails, sendHomeworkAssignedEmail, sendMaterialAssignedEmail } from '@/lib/email-service';
import { Label } from "@/components/ui/label";

const getCourseDetailsFromPackageCode = (code: string) => {
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: 30 };
    const courseCodeMap: { [key: string]: string } = { 
        'B': 'baslangic', 
        'K': 'konusma', 
        'G': 'gelisim', 
        'A': 'akademik', 
        'GCSE': 'gcse' 
    };
    const courseKey = code.replace(/[0-9]/g, '');
    const courseId = courseCodeMap[courseKey];
    const course = COURSES.find((c: any) => c.id === courseId);
    
    if (!course) return { courseName: code, duration: 30 };
    
    let duration = 30;
    if (course.id === 'baslangic') duration = 20;
    if (course.id === 'konusma') duration = 30;
    if (course.id === 'gelisim' || course.id === 'akademik') duration = 45;
    if (course.id === 'gcse') duration = 50;
    
    return { courseName: course.title, duration };
}

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
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

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

    // Feedback States
    const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

    // Media Assign States
    const [lessonForMedia, setLessonForMedia] = useState<any>(null);
    const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
    const [currentMaterialFolderId, setCurrentMaterialFolderId] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'material' | 'homework'>('material');
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [homeworkTitle, setHomeworkTitle] = useState('');
    const [homeworkFile, setHomeworkFile] = useState<File | null>(null);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(0);

    const materialsQuery = useMemoFirebase(() => db ? query(collection(db, 'materials'), orderBy('createdAt', 'desc')) : null, [db]);
    const { data: materialsData } = useCollection(materialsQuery);

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

    const datesByMonth = useMemo(() => {
        const months: { [monthKey: string]: string[] } = {};
        Object.keys(groupedSlots).sort().forEach(dateKey => {
            const date = new Date(dateKey);
            const monthKey = format(date, 'MMMM yyyy', { locale: tr });
            if (!months[monthKey]) months[monthKey] = [];
            months[monthKey].push(dateKey);
        });
        return months;
    }, [groupedSlots]);

    const filteredLessons = useMemo(() => {
        if (!bookedLessons || !allChildren || !users) return [];
        
        // 1. First augment all slots with basic info
        const augmentedSlots = bookedLessons?.map(lesson => {
            // Resilient lookup for student
            const student = allChildren?.find(c => 
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
            // Group only if it's the same teacher, same student, same package AND slots are contiguous in time AND same booking time
            const isConsecutive = currentGroup && 
                currentGroup.teacherId === slot.teacherId &&
                currentGroup.childId === slot.childId &&
                currentGroup.packageCode === slot.packageCode &&
                (currentGroup.bookedAt?.seconds === slot.bookedAt?.seconds) &&
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
        
        // Final sanity filter: only show lessons with status 'booked' (though already filtered by query)
        // And ensure duration is at least 5 mins
        result = result.filter(l => l.status === 'booked' && l.duration >= 5);

        // Sort by Date (Descending for base, will be re-sorted by tab)
        return result.sort((a, b) => b.startDateTime.getTime() - a.startDateTime.getTime());
    }, [bookedLessons, allChildren, users, searchQuery, typeFilter]);

    const { upcomingLessons, completedLessons } = useMemo(() => {
        const upcoming = filteredLessons?.filter(l => currentTime < addMinutes(l.startDateTime, l.duration)) || [];
        const completed = filteredLessons?.filter(l => currentTime >= addMinutes(l.startDateTime, l.duration)) || [];
        
        // Sort Upcoming: soonest first
        upcoming.sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());
        // Sort Completed: latest first
        completed.sort((a, b) => b.startDateTime.getTime() - a.startDateTime.getTime());
        
        return { upcomingLessons: upcoming, completedLessons: completed };
    }, [filteredLessons, currentTime]);

    const groupedUpcomingByMonth = useMemo(() => {
        const groups: { [month: string]: any[] } = {};
        upcomingLessons.forEach(lesson => {
            const month = format(lesson.startDateTime, 'MMMM yyyy', { locale: tr });
            if (!groups[month]) groups[month] = [];
            groups[month].push(lesson);
        });
        return groups;
    }, [upcomingLessons]);

    const groupedCompletedByMonth = useMemo(() => {
        const groups: { [month: string]: any[] } = {};
        completedLessons.forEach(lesson => {
            const month = format(lesson.startDateTime, 'MMMM yyyy', { locale: tr });
            if (!groups[month]) groups[month] = [];
            groups[month].push(lesson);
        });
        return groups;
    }, [completedLessons]);

    const materialBreadcrumbs = useMemo(() => {
        const path: any[] = [];
        let currentId = currentMaterialFolderId;
        while (currentId) {
            const folder = materialsData?.find(m => m.id === currentId && m.type === 'folder');
            if (folder) {
                path.unshift(folder);
                currentId = folder.parentId || null;
            } else {
                break;
            }
        }
        return path;
    }, [currentMaterialFolderId, materialsData]);

    const currentLevelMaterials = useMemo(() => {
        if (!materialsData) return { folders: [], files: [] };
        const items = materialsData.filter(m => (m.parentId || null) === currentMaterialFolderId);
        return {
            folders: items.filter(m => m.type === 'folder'),
            files: items.filter(m => m.type !== 'folder')
        };
    }, [materialsData, currentMaterialFolderId]);

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

            // Refund logic
            if (lessonToCancel.bookedBy && lessonToCancel.childId) {
                const childRef = doc(db, 'users', lessonToCancel.bookedBy, 'children', lessonToCancel.childId);
                const userRef = doc(db, 'users', lessonToCancel.bookedBy);
                
                if (lessonToCancel.packageCode === 'FREE_TRIAL') {
                    // Refund Trial Lesson
                    batch.update(childRef, { hasUsedFreeTrial: false });
                    batch.update(userRef, { freeTrialsUsed: increment(-1) });
                } else {
                    // Refund Regular Lesson
                    batch.update(childRef, { remainingLessons: increment(1) });
                }
            }

            // Log the cancellation
            const activityRef = doc(collection(db, 'activity-log'));
            batch.set(activityRef, {
                event: '❌ Ders İptal Edildi (Admin)',
                icon: '❌',
                details: {
                    'Öğrenci': lessonToCancel.studentName,
                    'Veli': lessonToCancel.parentName,
                    'Ders': lessonToCancel.courseName,
                    'Zaman': format(lessonToCancel.startDateTime, 'dd.MM.yyyy HH:mm', { locale: tr }),
                    'İade': 'Yapıldı'
                },
                createdAt: Timestamp.now()
            });
            
            await batch.commit();

            // Notify via email (Admin action)
            try {
                const parent = users?.find(u => u.uid === lessonToCancel.bookedBy);
                const teacher = users?.find(u => u.uid === lessonToCancel.teacherId);
                
                await sendAdminLessonActionEmails('cancelled', {
                    studentName: lessonToCancel.studentName || '-',
                    teacherName: lessonToCancel.teacherName || '-',
                    teacherFirestoreEmail: teacher?.email || undefined,
                    parentEmail: parent?.email || undefined,
                    date: format(lessonToCancel.startDateTime, 'dd MMMM yyyy', { locale: tr }),
                    time: format(lessonToCancel.startDateTime, 'HH:mm', { locale: tr }),
                    parentDate: parent?.timezone ? formatInTimeZone(lessonToCancel.startDateTime, parent.timezone, 'dd MMMM yyyy', { locale: tr }) : undefined,
                    parentTime: parent?.timezone ? formatInTimeZone(lessonToCancel.startDateTime, parent.timezone, 'HH:mm', { locale: tr }) : undefined,
                    isTrial: lessonToCancel.isTrial,
                });
            } catch (err) {
                console.error("Admin cancel email error:", err);
            }

            toast({ title: 'Ders İptal Edildi', description: `${lessonToCancel.duration} dakikalık oturum başarıyla iptal edildi ve hak iadesi yapıldı.` });
            refetchLessons();
        } catch (e) {
            console.error("Error cancelling lesson:", e);
            toast({ variant: 'destructive', title: 'Hata', description: 'İptal işlemi başarısız oldu.' });
        } finally {
            setIsCancelling(false);
            setLessonToCancel(null);
        }
    };

    const handleRemoveMedia = async (lesson: any, mediaObj: any, type: 'material' | 'homework') => {
        if (!confirm(`${mediaObj.title} isimli materyali bu dersten kaldırmak istediğinize emin misiniz?`)) return;
        
        try {
            const batch = writeBatch(db);
            const slotRefs = lesson.slotIds.map((id: string) => doc(db, 'lesson-slots', id));
            
            const updateObj = type === 'material' 
                ? { materials: arrayRemove(mediaObj) }
                : { homeworks: arrayRemove(mediaObj) };

            slotRefs.forEach((ref: any) => {
                batch.update(ref, updateObj);
            });

            await batch.commit();
            toast({
                title: "Başarılı",
                description: "Materyal dersten kaldırıldı.",
            });
            refetchLessons();
        } catch (error) {
            console.error("Error removing media:", error);
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Materyal kaldırılırken bir hata oluştu.",
            });
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

    const [selectedPackageType, setSelectedPackageType] = useState<'regular' | 'trial'>('regular');

    const handleAssignLesson = async () => {
        if (!db || !selectedSlotId || !selectedChildId) return;
        setIsAssigning(true);
        try {
            const batch = writeBatch(db);
            const parentId = selectedParentId;
            const childInfo = allChildren.find(c => c.id === selectedChildId);
            
            // Determine package code based on selection
            const packageCode = selectedPackageType === 'trial' ? 'FREE_TRIAL' : (childInfo?.assignedPackage || 'K4');

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
                // Check if already used (inform admin but allow if they really want to? No, better stay safe or allow with warning)
                if (childInfo?.hasUsedFreeTrial) {
                     toast({ 
                        variant: 'destructive', 
                        title: 'Deneme Dersi Kullanılmış', 
                        description: 'Bu öğrenci zaten deneme dersi hakkını kullanmış.' 
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

            // Get Course Duration and calculate slots
            // (Duration + 5) / 5 because each slot is 5 mins and we include a 5 min buffer/block
            const details = getCourseDetailsFromPackageCode(packageCode);
            const numSlots = Math.ceil((details.duration + 5) / 5);

            // Find all required consecutive slots
            const startSlot = availableSlots.find(s => s.id === selectedSlotId);
            if (!startSlot) throw new Error("Başlangıç slotu bulunamadı.");

            const startTime = startSlot.startTime.toDate();
            const slotsToBook: any[] = [];

            // Fetch and check availability for all required slots
            for (let i = 0; i < numSlots; i++) {
                const slotTime = addMinutes(startTime, i * 5);
                const q = query(
                    collection(db, 'lesson-slots'), 
                    where('teacherId', '==', selectedTeacherId), 
                    where('startTime', '==', Timestamp.fromDate(slotTime))
                );
                const snap = await getDocs(q);
                
                if (snap.empty || snap.docs[0].data().status !== 'available') {
                    toast({ 
                        variant: 'destructive', 
                        title: 'Çakışma / Müsaitlik Sorunu', 
                        description: `Seçtiğiniz saatten itibaren ${details.duration} dakikalık ders için yeterli boşluk bulunmuyor. (${format(slotTime, 'HH:mm')} dolu veya kapalı)` 
                    });
                    setIsAssigning(false);
                    return;
                }
                slotsToBook.push(snap.docs[0]);
            }

            // Record assignment to Activity Log
            const activityRef = doc(collection(db, 'activity-log'));
            batch.set(activityRef, {
                event: packageCode === 'FREE_TRIAL' ? '👨‍💼 Manuel Deneme Dersi Atandı' : '👨‍💼 Manuel Ders Atandı',
                icon: packageCode === 'FREE_TRIAL' ? '🎯' : '👨‍💼',
                details: {
                    'Ders Türü': packageCode,
                    'Öğrenci': childInfo?.firstName || '-',
                    'Ders Zamanı': `${format(startTime, 'dd.MM.yyyy HH:mm', { locale: tr })} (${details.duration} dk)`
                },
                createdAt: Timestamp.now()
            });

            // Update all Slots in batch
            const now = Timestamp.now();
            slotsToBook.forEach(slotDoc => {
                batch.update(slotDoc.ref, {
                    status: 'booked',
                    bookedBy: parentId,
                    childId: selectedChildId,
                    packageCode: packageCode,
                    bookedAt: now,
                    assignedBy: 'admin'
                });
            });

            // Update Child and Parent (Credit/Trial management)
            if (childInfo?.parentId) {
                const childRef = doc(db, 'users', childInfo.parentId, 'children', selectedChildId);
                const userRef = doc(db, 'users', childInfo.parentId);

                if (packageCode === 'FREE_TRIAL') {
                    batch.update(childRef, { hasUsedFreeTrial: true });
                    batch.update(userRef, { freeTrialsUsed: increment(1) });
                } else {
                    batch.update(childRef, { remainingLessons: increment(-1) });
                }
            }

            await batch.commit();

            // Notify via Email (Non-blocking)
            const handleNotifications = async () => {
                try {
                    const parent = users?.find(u => u.uid === parentId);
                    const teacher = users?.find(u => u.uid === selectedTeacherId);
                    const childName = childInfo?.firstName || '-';
                    const details = getCourseDetailsFromPackageCode(packageCode);

                    await sendAdminLessonActionEmails('planned', {
                        studentName: childName,
                        teacherName: `${teacher?.firstName} ${teacher?.lastName || ''}`,
                        teacherFirestoreEmail: teacher?.email || undefined,
                        parentEmail: parent?.email || undefined,
                        courseName: details?.courseName || 'Akademik Ders',
                        duration: details?.duration || 45,
                        date: format(startTime, 'dd MMMM yyyy', { locale: tr }),
                        time: format(startTime, 'HH:mm', { locale: tr }),
                        parentDate: parent?.timezone ? formatInTimeZone(startTime, parent.timezone, 'dd MMMM yyyy', { locale: tr }) : undefined,
                        parentTime: parent?.timezone ? formatInTimeZone(startTime, parent.timezone, 'HH:mm', { locale: tr }) : undefined,
                        startTime: startTime.toISOString(),
                        isTrial: packageCode === 'FREE_TRIAL',
                    });
                } catch (err) {
                    console.error("Manual assignment notification error:", err);
                }
            };

            handleNotifications();

            toast({ title: 'Ders Atandı', description: `${details.duration} dakikalık ders başarıyla atandı ve bildirimler gönderildi.` });
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

    const studentPreviousMedia = useMemo(() => {
        if (!lessonForMedia || !filteredLessons) return [];
        
        const pastLessons = filteredLessons.filter((l: any) => 
            l.childId === lessonForMedia.childId && 
            l.id !== lessonForMedia.id &&
            ((l.materials && l.materials.length > 0) || (l.homeworks && l.homeworks.length > 0))
        );

        // Tarihe göre yeniden eskiye (descending) sırala
        pastLessons.sort((a: any, b: any) => b.startDateTime.getTime() - a.startDateTime.getTime());
        return pastLessons;
    }, [lessonForMedia, filteredLessons]);

    if (lessonsLoading || usersLoading || isLoadingChildren) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-medium text-slate-500 animate-pulse">Dersler yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-8 p-2 sm:p-8 pt-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">Ders Yönetimi</h1>
                    <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-1">Tüm randevuları izleyin ve yönetin.</p>
                </div>
                <Button className="rounded-xl font-bold gap-2 px-5 sm:px-6 h-11 shadow-lg w-full sm:w-auto text-xs sm:text-sm" onClick={() => setIsAssignDialogOpen(true)}>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Yeni Ders Ata
                </Button>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-11 sm:h-12 bg-white/50 backdrop-blur-sm border-none shadow-sm p-1 rounded-xl sm:rounded-2xl">
                    <TabsTrigger value="upcoming" className="rounded-lg sm:rounded-xl font-black text-[10px] sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> 
                        Yaklaşan ({upcomingLessons.length})
                    </TabsTrigger>
                    <TabsTrigger value="past" className="rounded-lg sm:rounded-xl font-black text-[10px] sm:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> 
                        Tamamlandı ({completedLessons.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                    <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                        <CardHeader className="border-b bg-slate-50/50 p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row justify-between gap-4">
                                <div className="relative flex-1 w-full lg:max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input 
                                        placeholder="Ara..." 
                                        className="pl-10 rounded-xl border-slate-200 bg-white h-10 text-xs sm:text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button 
                                        variant={typeFilter === 'all' ? 'default' : 'outline'} 
                                        onClick={() => setTypeFilter('all')}
                                        className="rounded-xl font-bold flex-1 sm:flex-none h-9 text-xs"
                                    >
                                        Hepsi
                                    </Button>
                                    <Button 
                                        variant={typeFilter === 'trial' ? 'default' : 'outline'} 
                                        onClick={() => setTypeFilter('trial')}
                                        className="rounded-xl font-bold flex-1 sm:flex-none h-9 text-xs"
                                    >
                                        Deneme
                                    </Button>
                                    <Button 
                                        variant={typeFilter === 'regular' ? 'default' : 'outline'} 
                                        onClick={() => setTypeFilter('regular')}
                                        className="rounded-xl font-bold flex-1 sm:flex-none h-9 text-xs"
                                    >
                                        Normal
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* MOBILE LIST */}
                            <div className="min-[1200px]:hidden divide-y divide-slate-100">
                                {upcomingLessons.length === 0 ? (
                                    <div className="p-10 text-center text-slate-400 italic text-xs uppercase tracking-widest font-bold">Yaklaşan ders bulunmuyor.</div>
                                ) : Object.entries(groupedUpcomingByMonth).map(([month, lessons]) => (
                                    <div key={month} className="space-y-0">
                                        <div className="bg-slate-50/80 px-4 py-2 border-y border-slate-100 sticky top-0 z-10 backdrop-blur-sm">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{month} ({lessons.length} Ders)</span>
                                        </div>
                                        <div className="divide-y divide-slate-100">
                                            {lessons.map((lesson, idx) => (
                                                <LessonCard 
                                                    key={lesson.id || idx} 
                                                    lesson={lesson} 
                                                    currentTime={currentTime} 
                                                    onCancel={() => setLessonToCancel(lesson)} 
                                                    onShowFeedback={(fb) => {
                                                        setSelectedFeedback(fb);
                                                        setIsFeedbackDialogOpen(true);
                                                    }}
                                                    onAssignMedia={() => {
                                                        setLessonForMedia(lesson);
                                                        setIsMediaDialogOpen(true);
                                                    }}
                                                    onRemoveMedia={handleRemoveMedia}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* DESKTOP TABLE */}
                            <div className="hidden min-[1200px]:block">
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
                                        {upcomingLessons.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-slate-400 font-medium italic">Yaklaşan ders bulunmuyor.</TableCell>
                                            </TableRow>
                                        ) : Object.entries(groupedUpcomingByMonth).map(([month, lessons]) => (
                                            <React.Fragment key={month}>
                                                <TableRow className="bg-slate-50/30 hover:bg-slate-50/30 border-y">
                                                    <TableCell colSpan={6} className="py-2 px-6">
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">{month} ({lessons.length} Ders)</span>
                                                    </TableCell>
                                                </TableRow>
                                                {lessons.map((lesson, idx) => (
                                                    <LessonRow 
                                                        key={lesson.id || idx} 
                                                        lesson={lesson} 
                                                        currentTime={currentTime} 
                                                        onCancel={() => setLessonToCancel(lesson)}
                                                        onShowFeedback={(fb) => {
                                                            setSelectedFeedback(fb);
                                                            setIsFeedbackDialogOpen(true);
                                                        }}
                                                        onAssignMedia={() => {
                                                            setLessonForMedia(lesson);
                                                            setIsMediaDialogOpen(true);
                                                        }}
                                                        onRemoveMedia={handleRemoveMedia}
                                                    />
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="past">
                    <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                        {/* Same Header for past as well */}
                        <CardHeader className="border-b bg-slate-50/50 p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row justify-between gap-4">
                                <div className="relative flex-1 w-full lg:max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input 
                                        placeholder="Ara..." 
                                        className="pl-10 rounded-xl border-slate-200 bg-white h-10 text-xs sm:text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                             {/* MOBILE LIST */}
                                    <div className="min-[1200px]:hidden divide-y divide-slate-100">
                                {completedLessons.length === 0 ? (
                                    <div className="p-10 text-center text-slate-400 italic text-xs uppercase tracking-widest font-bold">Tamamlanmış ders bulunmuyor.</div>
                                ) : Object.entries(groupedCompletedByMonth).map(([month, lessons]) => (
                                    <div key={month} className="space-y-0">
                                        <div className="bg-slate-50/80 px-4 py-2 border-y border-slate-100 sticky top-0 z-10 backdrop-blur-sm">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{month} ({lessons.length} Ders)</span>
                                        </div>
                                        <div className="divide-y divide-slate-100">
                                            {lessons.map((lesson, idx) => (
                                                <LessonCard 
                                                    key={lesson.id || idx} 
                                                    lesson={lesson} 
                                                    currentTime={currentTime} 
                                                    onCancel={() => setLessonToCancel(lesson)} 
                                                    onShowFeedback={(fb) => {
                                                        setSelectedFeedback(fb);
                                                        setIsFeedbackDialogOpen(true);
                                                    }}
                                                    onAssignMedia={() => {
                                                        setLessonForMedia(lesson);
                                                        setIsMediaDialogOpen(true);
                                                    }}
                                                    onRemoveMedia={handleRemoveMedia}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* DESKTOP TABLE */}
                            <div className="hidden min-[1200px]:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                                            <TableHead className="font-black text-slate-800 p-6">Ders Zamanı</TableHead>
                                            <TableHead className="font-black text-slate-800 p-6">Öğrenci / Veli</TableHead>
                                            <TableHead className="font-black text-slate-800 p-6">Öğretmen</TableHead>
                                            <TableHead className="font-black text-slate-800 p-6">Ders Türü</TableHead>
                                            <TableHead className="font-black text-slate-800 p-6">Geri Bildirim</TableHead>
                                            <TableHead className="p-6 text-right">İşlem</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {completedLessons.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-slate-400 font-medium italic">Tamamlanmış ders bulunmuyor.</TableCell>
                                            </TableRow>
                                        ) : Object.entries(groupedCompletedByMonth).map(([month, lessons]) => (
                                            <React.Fragment key={month}>
                                                <TableRow className="bg-slate-50/30 hover:bg-slate-50/30 border-y">
                                                    <TableCell colSpan={6} className="py-2 px-6">
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">{month} ({lessons.length} Ders)</span>
                                                    </TableCell>
                                                </TableRow>
                                                {lessons.map((lesson, idx) => (
                                                    <LessonRow 
                                                        key={lesson.id || idx} 
                                                        lesson={lesson} 
                                                        currentTime={currentTime} 
                                                        onCancel={() => setLessonToCancel(lesson)} 
                                                        onShowFeedback={(fb) => {
                                                            setSelectedFeedback(fb);
                                                            setIsFeedbackDialogOpen(true);
                                                        }}
                                                        onAssignMedia={() => {
                                                            setLessonForMedia(lesson);
                                                            setIsMediaDialogOpen(true);
                                                        }}
                                                        onRemoveMedia={handleRemoveMedia}
                                                    />
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

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
                    setSelectedPackageType('regular'); // Reset to default
                }
            }}>
                <DialogContent className="max-w-md w-[95vw] sm:w-full rounded-[32px] border-none shadow-2xl p-4 sm:p-8 max-h-[95vh] overflow-y-auto custom-scrollbar">
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
                                        <SelectContent className="rounded-2xl max-w-[90vw] sm:max-w-md">
                                            {users?.filter(u => u.role === 'parent').map((p, idx) => (
                                                <SelectItem key={p.uid || p.id || idx} value={p.uid || p.id} className="rounded-lg">
                                                    <div className="flex flex-col gap-0.5 overflow-hidden">
                                                        <span className="font-bold truncate">{p.firstName} {p.lastName}</span>
                                                        <span className="text-[10px] text-slate-400 truncate opacity-80">{p.email}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedParentId && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">2. Öğrenciyi Seçin</Label>
                                            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                                <SelectTrigger className="rounded-xl h-12 border-slate-200">
                                                    <SelectValue placeholder="Çocuk seç..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl max-w-[90vw]">
                                                    {allChildren.filter(c => c.parentId === selectedParentId).map((c, idx) => (
                                                        <SelectItem key={c.id || idx} value={c.id} className="rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold">{c.firstName}</span>
                                                                <span className="text-[10px] text-slate-400">({c.remainingLessons || 0} Kr | {c.hasUsedFreeTrial ? 'D. Dolu' : 'D. Boş'})</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {selectedChildId && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label className="font-bold text-slate-700">3. Ders Türü</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button 
                                                        variant={selectedPackageType === 'regular' ? 'default' : 'outline'}
                                                        className="rounded-xl font-bold h-11"
                                                        onClick={() => setSelectedPackageType('regular')}
                                                    >
                                                        Normal Ders
                                                    </Button>
                                                    <Button 
                                                        variant={selectedPackageType === 'trial' ? 'default' : 'outline'}
                                                        className="rounded-xl font-bold h-11"
                                                        onClick={() => setSelectedPackageType('trial')}
                                                        disabled={allChildren.find(c => c.id === selectedChildId)?.hasUsedFreeTrial}
                                                    >
                                                        Deneme Dersi
                                                    </Button>
                                                </div>
                                                {allChildren.find(c => c.id === selectedChildId)?.hasUsedFreeTrial && selectedPackageType === 'trial' && (
                                                    <p className="text-[10px] text-red-500 font-bold italic">Bu öğrenci deneme dersini zaten kullanmış.</p>
                                                )}
                                            </div>
                                        )}
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
                                                <div className="space-y-4 max-h-[200px] sm:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border rounded-2xl p-3 bg-slate-50/50">
                                                    {Object.entries(datesByMonth).map(([monthName, dates]) => (
                                                        <div key={monthName} className="space-y-2">
                                                            <Label className="font-black text-primary text-[9px] uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded inline-block">{monthName}</Label>
                                                            <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
                                                                {dates.map(dateKey => (
                                                                    <Button
                                                                        key={dateKey}
                                                                        variant={selectedDateKey === dateKey ? 'default' : 'outline'}
                                                                        onClick={() => {
                                                                            setSelectedDateKey(dateKey);
                                                                            setSelectedHour(null);
                                                                            setSelectedSlotId('');
                                                                        }}
                                                                        className="rounded-xl font-bold h-9 px-2 text-[11px] sm:text-xs"
                                                                        size="sm"
                                                                    >
                                                                        {format(new Date(dateKey), 'dd MMM', { locale: tr })}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
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

            {/* Feedback Content Dialog */}
            <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
                <DialogContent className="max-w-lg rounded-[32px] border-none shadow-2xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            Ders Geri Bildirimi
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            {selectedFeedback?.createdAt && format(selectedFeedback.createdAt.toDate ? selectedFeedback.createdAt.toDate() : new Date(selectedFeedback.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <p className="text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                                {selectedFeedback?.text || "Geri bildirim içeriği bulunamadı."}
                            </p>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button onClick={() => setIsFeedbackDialogOpen(false)} className="w-full rounded-xl h-12 font-bold">
                            Kapat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Media Assign Dialog */}
            <Dialog open={isMediaDialogOpen} onOpenChange={(open) => {
                setIsMediaDialogOpen(open);
                if (!open) {
                    setLessonForMedia(null);
                    setHomeworkFile(null);
                    setHomeworkTitle('');
                    setMediaProgress(0);
                    setSelectedMaterialId('');
                    setCurrentMaterialFolderId(null);
                }
            }}>
                <DialogContent className="max-w-md w-[95vw] sm:w-full rounded-[32px] border-none shadow-2xl p-4 sm:p-8 max-h-[90vh] flex flex-col overflow-hidden">
                    <DialogHeader className="shrink-0">
                        <DialogTitle className="text-2xl font-black text-slate-900">Materyal / Ödev Ata</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            <span className="font-bold text-slate-800">{lessonForMedia?.studentName}</span> isimli öğrencinin <span className="font-bold text-slate-800">{lessonForMedia?.startDateTime && format(lessonForMedia.startDateTime, 'dd MMM HH:mm', { locale: tr })}</span> dersi için.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2 space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                            <Button 
                                variant={mediaType === 'material' ? 'default' : 'ghost'} 
                                className={cn("flex-1 rounded-xl font-bold", mediaType === 'material' ? 'shadow-sm' : 'text-slate-500 hover:text-slate-700')}
                                onClick={() => setMediaType('material')}
                            >
                                <BookOpen className="w-4 h-4 mr-2" /> Materyal Ata
                            </Button>
                            <Button 
                                variant={mediaType === 'homework' ? 'default' : 'ghost'} 
                                className={cn("flex-1 rounded-xl font-bold", mediaType === 'homework' ? 'shadow-sm' : 'text-slate-500 hover:text-slate-700')}
                                onClick={() => setMediaType('homework')}
                            >
                                <FileText className="w-4 h-4 mr-2" /> Ödev Yükle
                            </Button>
                        </div>

                        {studentPreviousMedia.length > 0 && (
                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mt-2">
                                <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <History className="w-3.5 h-3.5" /> Öğrencinin Önceki Materyalleri
                                </h4>
                                <div className="space-y-3 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                                    {studentPreviousMedia.map((pastLesson: any) => (
                                        <div key={pastLesson.id} className="text-xs bg-white p-2.5 rounded-xl border border-blue-100/50 shadow-sm">
                                            <div className="font-semibold text-slate-700 mb-1 border-b pb-1 flex justify-between items-center">
                                                <span>{pastLesson.courseName}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{format(pastLesson.startDateTime, 'dd MMM yyyy', { locale: tr })}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 mt-1.5">
                                                {pastLesson.materials?.map((m: any, idx: number) => (
                                                    <a key={`m-${idx}`} href={m.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                                                        <BookOpen className="w-3 h-3 shrink-0" />
                                                        <span className="truncate">{m.title}</span>
                                                    </a>
                                                ))}
                                                {pastLesson.homeworks?.map((h: any, idx: number) => (
                                                    <a key={`h-${idx}`} href={h.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">
                                                        <FileText className="w-3 h-3 shrink-0" />
                                                        <span className="truncate">{h.title} (Ödev)</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {mediaType === 'material' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Materyal Seçin</Label>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col h-64">
                                        {/* Breadcrumbs */}
                                        <div className="flex items-center gap-2 p-3 bg-white border-b text-sm font-semibold overflow-x-auto hide-scrollbar shrink-0">
                                            <button 
                                                onClick={(e) => { e.preventDefault(); setCurrentMaterialFolderId(null); }}
                                                className={cn("flex items-center gap-1 transition-colors hover:text-slate-700", !currentMaterialFolderId ? "text-primary" : "text-slate-500")}
                                            >
                                                Ana Dizin
                                            </button>
                                            {materialBreadcrumbs.map((b, idx) => (
                                                <React.Fragment key={b.id}>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); setCurrentMaterialFolderId(b.id); }}
                                                        className={cn("truncate max-w-[120px] transition-colors hover:text-slate-700", idx === materialBreadcrumbs.length - 1 ? "text-primary" : "text-slate-500")}
                                                    >
                                                        {b.title}
                                                    </button>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        
                                        {/* Items */}
                                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                            {currentLevelMaterials.folders.length === 0 && currentLevelMaterials.files.length === 0 && (
                                                <div className="text-center text-slate-400 text-sm mt-10">Bu klasör boş.</div>
                                            )}
                                            {currentLevelMaterials.folders.map((f: any) => (
                                                <button
                                                    key={f.id}
                                                    onClick={(e) => { e.preventDefault(); setCurrentMaterialFolderId(f.id); }}
                                                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-200 transition-colors text-left group"
                                                >
                                                    <div className="bg-blue-100 p-1.5 rounded-md">
                                                        <Folder className="w-5 h-5 text-blue-500 fill-blue-100" />
                                                    </div>
                                                    <span className="font-semibold text-slate-700 truncate">{f.title}</span>
                                                </button>
                                            ))}
                                            {currentLevelMaterials.files.map((f: any) => (
                                                <button
                                                    key={f.id}
                                                    onClick={(e) => { e.preventDefault(); setSelectedMaterialId(f.id); }}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left",
                                                        selectedMaterialId === f.id ? "bg-primary/10 border border-primary/20" : "hover:bg-slate-200"
                                                    )}
                                                >
                                                    <div className="bg-emerald-100 p-1.5 rounded-md shrink-0">
                                                        <FileText className="w-5 h-5 text-emerald-600" />
                                                    </div>
                                                    <div className="flex flex-col truncate">
                                                        <span className={cn("font-semibold truncate", selectedMaterialId === f.id ? "text-primary" : "text-slate-700")}>{f.title}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{f.type === 'document' ? 'Döküman' : f.type}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mediaType === 'homework' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Ödev Başlığı</Label>
                                    <Input 
                                        placeholder="Örn: 1. Ünite Sonu Ödevi" 
                                        value={homeworkTitle} 
                                        onChange={(e) => setHomeworkTitle(e.target.value)}
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Dosya Seçin</Label>
                                    <Input 
                                        type="file" 
                                        onChange={(e) => setHomeworkFile(e.target.files?.[0] || null)}
                                        className="h-12 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="shrink-0 pt-2">
                        <Button variant="outline" onClick={() => setIsMediaDialogOpen(false)} className="rounded-xl h-12 font-bold w-full sm:w-auto">İptal</Button>
                        <Button 
                            className="rounded-xl h-12 font-bold w-full sm:w-auto bg-primary"
                            disabled={isUploadingMedia || (mediaType === 'material' ? !selectedMaterialId : (!homeworkTitle || !homeworkFile))}
                            onClick={async () => {
                                if (!db || !lessonForMedia || !lessonForMedia.slotIds) return;
                                setIsUploadingMedia(true);
                                try {
                                    const batch = writeBatch(db);
                                    const slotRefs = lessonForMedia.slotIds.map((id: string) => doc(db, 'lesson-slots', id));
                                    const parent = users?.find(u => u.id === lessonForMedia.bookedBy || u.uid === lessonForMedia.bookedBy || u._id === lessonForMedia.bookedBy);

                                    if (mediaType === 'material') {
                                        const material = materialsData?.find((m: any) => m.id === selectedMaterialId);
                                        if (!material) throw new Error("Materyal bulunamadı");
                                        
                                        const matObj = { id: material.id, title: material.title, url: material.url, type: material.type };
                                        
                                        slotRefs.forEach((ref: any) => {
                                            batch.update(ref, { materials: arrayUnion(matObj) });
                                        });
                                        
                                        await batch.commit();

                                        if (parent?.email) {
                                            await sendMaterialAssignedEmail({
                                                studentName: lessonForMedia.studentName,
                                                parentEmail: parent.email,
                                                materialTitle: material.title,
                                                materialUrl: material.url,
                                                courseName: lessonForMedia.courseName || 'Bilinmeyen Ders',
                                                lessonDate: parent.timezone ? formatInTimeZone(lessonForMedia.startDateTime, parent.timezone, 'dd MMMM yyyy, EEEE', { locale: tr }) : format(lessonForMedia.startDateTime, 'dd MMMM yyyy, EEEE', { locale: tr }),
                                                lessonTime: parent.timezone ? formatInTimeZone(lessonForMedia.startDateTime, parent.timezone, 'HH:mm', { locale: tr }) : format(lessonForMedia.startDateTime, 'HH:mm', { locale: tr })
                                            });
                                        }

                                        toast({ title: 'Başarılı', description: 'Materyal derse atandı ve veliye e-posta gönderildi.' });
                                    } else {
                                        if (!homeworkFile) return;
                                        const fileName = `${Date.now()}_${homeworkFile.name}`;
                                        const storageRef = ref(storage, `homeworks/${fileName}`);
                                        const uploadTask = uploadBytesResumable(storageRef, homeworkFile);

                                        await new Promise<void>((resolve, reject) => {
                                            uploadTask.on('state_changed',
                                                (snap) => setMediaProgress((snap.bytesTransferred / snap.totalBytes) * 100),
                                                reject,
                                                async () => {
                                                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                                                    const hwObj = { title: homeworkTitle, url, fileName, addedAt: Timestamp.now() };
                                                    
                                                    slotRefs.forEach((ref: any) => {
                                                        batch.update(ref, { homeworks: arrayUnion(hwObj) });
                                                    });
                                                    
                                                    await batch.commit();

                                                    if (parent?.email) {
                                                        await sendHomeworkAssignedEmail({
                                                            studentName: lessonForMedia.studentName,
                                                            parentEmail: parent.email,
                                                            homeworkTitle: homeworkTitle,
                                                            homeworkUrl: url,
                                                            courseName: lessonForMedia.courseName || 'Bilinmeyen Ders',
                                                            lessonDate: parent.timezone ? formatInTimeZone(lessonForMedia.startDateTime, parent.timezone, 'dd MMMM yyyy, EEEE', { locale: tr }) : format(lessonForMedia.startDateTime, 'dd MMMM yyyy, EEEE', { locale: tr }),
                                                            lessonTime: parent.timezone ? formatInTimeZone(lessonForMedia.startDateTime, parent.timezone, 'HH:mm', { locale: tr }) : format(lessonForMedia.startDateTime, 'HH:mm', { locale: tr })
                                                        });
                                                    }

                                                    toast({ title: 'Başarılı', description: 'Ödev yüklendi ve veliye e-posta gönderildi.' });
                                                    resolve();
                                                }
                                            );
                                        });
                                    }
                                    setIsMediaDialogOpen(false);
                                } catch (error) {
                                    console.error("Assignment error:", error);
                                    toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız oldu.' });
                                } finally {
                                    setIsUploadingMedia(false);
                                }
                            }}
                        >
                            {isUploadingMedia ? (
                                <><Loader2 className="animate-spin w-4 h-4 mr-2" /> İşleniyor ({Math.round(mediaProgress)}%)</>
                            ) : 'Ata ve Bildir'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function LessonRow({ lesson, currentTime, onCancel, onShowFeedback, onAssignMedia, onRemoveMedia }: { lesson: any, currentTime: Date, onCancel: () => void, onShowFeedback: (feedback: any) => void, onAssignMedia: () => void, onRemoveMedia: (lesson: any, media: any, type: 'material' | 'homework') => void }) {
    const endTime = addMinutes(lesson.startDateTime, lesson.duration);
    const isStarted = currentTime >= lesson.startDateTime;
    const isEnded = currentTime >= endTime;

    return (
        <TableRow className="group hover:bg-slate-50/50 transition-colors border-b">
            <TableCell className="p-6">
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{format(lesson.startDateTime, 'dd MMMM yyyy', { locale: tr })}</span>
                    <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> 
                        {format(lesson.startDateTime, 'HH:mm')} 
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-bold ml-1 uppercase">
                            {lesson.duration} Dakika
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
                <div className="flex flex-col items-start gap-2">
                    <Badge className={cn(
                        "rounded-lg font-bold px-3 py-1",
                        lesson.isTrial ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    )}>
                        {lesson.courseName}
                    </Badge>
                    {(lesson.materials?.length > 0 || lesson.homeworks?.length > 0) && (
                        <div className="flex flex-col gap-1 w-full max-w-[180px]">
                            {lesson.materials?.map((m: any, i: number) => (
                                <a key={`m-${i}`} href={m.url} target="_blank" rel="noopener noreferrer" className="group/link flex items-center gap-2 p-2 rounded-xl border border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-transparent hover:from-blue-50 hover:to-blue-50/50 transition-all duration-300 w-full hover:shadow-sm" title={m.title}>
                                    <div className="w-6 h-6 rounded-lg bg-white border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover/link:scale-110 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all duration-300 shadow-sm">
                                        <BookOpen className="w-3 h-3" />
                                    </div>
                                    <div className="flex flex-col truncate flex-1">
                                        <span className="truncate font-bold text-[10px] text-slate-700 group-hover/link:text-blue-700 transition-colors">{m.title}</span>
                                        <span className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">{m.type === 'document' ? 'PDF' : (m.type || 'MATERYAL')}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveMedia(lesson, m, 'material'); }}
                                        className="p-1 hover:bg-red-50 rounded-md transition-colors ml-auto text-slate-300 hover:text-red-500 opacity-0 group-hover/link:opacity-100 shrink-0"
                                        title="Kaldır"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </a>
                            ))}
                            {lesson.homeworks?.map((h: any, i: number) => (
                                <a key={`h-${i}`} href={h.url} target="_blank" rel="noopener noreferrer" className="group/link flex items-center gap-2 p-2 rounded-xl border border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 to-transparent hover:from-indigo-50 hover:to-indigo-50/50 transition-all duration-300 w-full hover:shadow-sm" title={h.title}>
                                    <div className="w-6 h-6 rounded-lg bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover/link:scale-110 group-hover/link:bg-indigo-600 group-hover/link:text-white transition-all duration-300 shadow-sm">
                                        <FileText className="w-3 h-3" />
                                    </div>
                                    <div className="flex flex-col truncate flex-1">
                                        <span className="truncate font-bold text-[10px] text-slate-700 group-hover/link:text-indigo-700 transition-colors">{h.title}</span>
                                        <span className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">ÖDEV</span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveMedia(lesson, h, 'homework'); }}
                                        className="p-1 hover:bg-red-50 rounded-md transition-colors ml-auto text-slate-300 hover:text-red-500 opacity-0 group-hover/link:opacity-100 shrink-0"
                                        title="Kaldır"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell className="p-6">
                {(() => {
                    if (isEnded) {
                        const feedback = lesson.feedback;
                        if (feedback) {
                            return (
                                <Badge 
                                    variant="outline" 
                                    className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 font-black px-3 py-1 uppercase text-[10px] tracking-widest cursor-pointer hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                                    onClick={() => onShowFeedback(feedback)}
                                >
                                    <MessageSquare className="w-3 h-3" />
                                    Geri Bildirim Yazıldı
                                </Badge>
                            );
                        }
                        return <Badge variant="outline" className="rounded-xl border-orange-200 bg-orange-50 text-orange-600 font-black px-3 py-1 uppercase text-[10px] tracking-widest">Geri Bildirim Yazılmadı</Badge>;
                    }
                    if (isStarted) return (
                        <Badge variant="outline" className="rounded-xl border-red-100 bg-red-50 text-red-600 font-black px-3 py-1 uppercase text-[10px] tracking-widest animate-pulse flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                             Ders Yapılıyor
                        </Badge>
                    );
                    return <Badge variant="outline" className="rounded-xl border-blue-100 bg-blue-50 text-blue-500 font-black px-3 py-1 uppercase text-[10px] tracking-widest">Ders Başlamadı</Badge>;
                })()}
            </TableCell>
            <TableCell className="p-6 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-xl font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                        onClick={onAssignMedia}
                    >
                        <BookOpen className="w-4 h-4 mr-1.5" />
                        Materyal Ata
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all group"
                        asChild
                    >
                        <a href={`/yonetici/kullanicilar?userId=${lesson.bookedBy}`}>
                            <UsersIcon className="w-4 h-4 mr-2" />
                            Veli Paneli
                        </a>
                    </Button>

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
                            {lesson.isLive && (
                                <DropdownMenuSeparator />
                            )}
                            <DropdownMenuItem 
                                className="rounded-xl font-bold text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 p-3 cursor-pointer"
                                onClick={onCancel}
                            >
                                <X className="w-4 h-4" /> Dersi İptal Et
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
}

function LessonCard({ lesson, currentTime, onCancel, onShowFeedback, onAssignMedia, onRemoveMedia }: { lesson: any, currentTime: Date, onCancel: () => void, onShowFeedback: (feedback: any) => void, onAssignMedia: () => void, onRemoveMedia: (lesson: any, media: any, type: 'material' | 'homework') => void }) {
    const endTime = addMinutes(lesson.startDateTime, lesson.duration);
    const isStarted = currentTime >= lesson.startDateTime;
    const isEnded = currentTime >= endTime;

    return (
        <div className="p-4 bg-white hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm">{format(lesson.startDateTime, 'dd MMMM yyyy', { locale: tr })}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-primary font-black text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {format(lesson.startDateTime, 'HH:mm')}
                        </span>
                        <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-tighter">
                            {lesson.duration} DK
                        </span>
                    </div>
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full shrink-0">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-56">
                        <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase mb-1">Ders İşlemleri</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer" asChild>
                            <a href={`/yonetici/kullanicilar?userId=${lesson.bookedBy}`}>
                                <UsersIcon className="w-3.5 h-3.5 mr-2" /> Veli Paneli
                            </a>
                        </DropdownMenuItem>
                        {lesson.isLive && (
                            <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-primary" onClick={() => window.open(lesson.liveLessonUrl)}>
                                <Video className="w-3.5 h-3.5 mr-2" /> Derse Git (Live)
                            </DropdownMenuItem>
                        )}
                        {lesson.isLive && (
                            <DropdownMenuSeparator />
                        )}
                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 text-red-500 focus:text-red-500 cursor-pointer" onClick={onCancel}>
                            <X className="w-3.5 h-3.5 mr-2" /> Dersi İptal Et
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ÖĞRENCİ</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] truncate">
                        <Baby className="w-3 h-3 text-primary shrink-0" /> {lesson.studentName}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ÖĞRETMEN</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] truncate">
                        <User className="w-3 h-3 text-slate-400 shrink-0" /> {teacherFirstName(lesson.teacherName)}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-50">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 rounded-xl font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all text-[11px]"
                    onClick={onAssignMedia}
                >
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    Materyal Ata
                </Button>
                <Badge className={cn(
                    "rounded-lg font-black text-[8px] uppercase tracking-widest px-2 py-0.5",
                    lesson.isTrial ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                )}>
                    {lesson.courseName}
                </Badge>
                
                {(() => {
                    if (isEnded) {
                        const feedback = lesson.feedback;
                        if (feedback) {
                            return (
                                <Badge 
                                    variant="outline" 
                                    className="rounded-lg border-emerald-100 bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 uppercase text-[8px] tracking-widest cursor-pointer"
                                    onClick={() => onShowFeedback(feedback)}
                                >
                                    FB OK
                                </Badge>
                            );
                        }
                        return <Badge variant="outline" className="rounded-lg border-orange-100 bg-orange-50 text-orange-600 font-black px-2 py-0.5 uppercase text-[8px] tracking-widest">FB YOK</Badge>;
                    }
                    if (isStarted) return (
                        <Badge variant="outline" className="rounded-lg border-red-100 bg-red-50 text-red-600 font-black px-2 py-0.5 uppercase text-[8px] tracking-widest animate-pulse">
                             CANLI
                        </Badge>
                    );
                    return <Badge variant="outline" className="rounded-lg border-blue-50 bg-blue-50 text-blue-500 font-black px-2 py-0.5 uppercase text-[8px] tracking-widest">YAKLAŞAN</Badge>;
                })()}
            </div>

            {(lesson.materials?.length > 0 || lesson.homeworks?.length > 0) && (
                <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-slate-50">
                    {lesson.materials?.map((m: any, i: number) => (
                        <a key={`m-${i}`} href={m.url} target="_blank" rel="noopener noreferrer" className="group/link flex items-center gap-2 p-2 rounded-xl border border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-transparent hover:from-blue-50 hover:to-blue-50/50 transition-all duration-300 w-full hover:shadow-sm" title={m.title}>
                            <div className="w-6 h-6 rounded-lg bg-white border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover/link:scale-110 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all duration-300 shadow-sm">
                                <BookOpen className="w-3 h-3" />
                            </div>
                            <div className="flex flex-col truncate flex-1">
                                <span className="truncate font-bold text-[10px] text-slate-700 group-hover/link:text-blue-700 transition-colors">{m.title}</span>
                                <span className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">{m.type === 'document' ? 'PDF' : (m.type || 'MATERYAL')}</span>
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveMedia(lesson, m, 'material'); }}
                                className="p-1 hover:bg-red-50 rounded-md transition-colors ml-auto text-slate-300 hover:text-red-500 opacity-0 group-hover/link:opacity-100 shrink-0"
                                title="Kaldır"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </a>
                    ))}
                    {lesson.homeworks?.map((h: any, i: number) => (
                        <a key={`h-${i}`} href={h.url} target="_blank" rel="noopener noreferrer" className="group/link flex items-center gap-2 p-2 rounded-xl border border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 to-transparent hover:from-indigo-50 hover:to-indigo-50/50 transition-all duration-300 w-full hover:shadow-sm" title={h.title}>
                            <div className="w-6 h-6 rounded-lg bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover/link:scale-110 group-hover/link:bg-indigo-600 group-hover/link:text-white transition-all duration-300 shadow-sm">
                                <FileText className="w-3 h-3" />
                            </div>
                            <div className="flex flex-col truncate flex-1">
                                <span className="truncate font-bold text-[10px] text-slate-700 group-hover/link:text-indigo-700 transition-colors">{h.title}</span>
                                <span className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">ÖDEV</span>
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveMedia(lesson, h, 'homework'); }}
                                className="p-1 hover:bg-red-50 rounded-md transition-colors ml-auto text-slate-300 hover:text-red-500 opacity-0 group-hover/link:opacity-100 shrink-0"
                                title="Kaldır"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

// Helper to keep teacher name short on cards
const teacherFirstName = (fullName: string) => {
    if (!fullName) return '-';
    const parts = fullName.split(' ');
    if (parts.length > 1) return `${parts[0]} ${parts[1][0]}.`;
    return fullName;
};

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
