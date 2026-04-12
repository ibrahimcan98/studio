
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, getDoc, collectionGroup, doc, updateDoc, writeBatch, setDoc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCountryFromPhone } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
    Loader2, 
    User, 
    MapPin, 
    Calendar, 
    Tag as TagIcon, 
    MoreHorizontal, 
    ShoppingBag, 
    Baby, 
    History, 
    Package, 
    X,
    CheckCircle2,
    Mail,
    Phone,
    FileText,
    Search,
    Tags,
    Copy,
    Activity,
    Plus,
    ArrowRight,
    Filter,
    Clock
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, differenceInDays, isBefore, differenceInYears, addMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ProgressPanel } from '@/components/shared/progress-panel';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isAfter, isSameDay } from 'date-fns';

interface ParentData {
    id: string;
    shortId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    createdAt?: any;
    remainingLessons: number;
    enrolledPackages: string[];
    computedTags: string[];
    manualTags: string[];
    hiddenTags: string[];
    lastPurchaseDate?: Date;
    countryName: string;
    manualCountry?: string;
    tags?: string[];
    isLegacy?: boolean;
    lastActivityDate?: Date;
    lastActivityType?: 'register' | 'purchase' | 'lesson' | 'login';
}

const tagStyles: { [key: string]: string } = {
    registered: 'bg-slate-100 text-slate-600',
    trial: 'bg-blue-100 text-blue-700',
    trialdone: 'bg-indigo-100 text-indigo-700',
    active: 'bg-emerald-100 text-emerald-700 font-bold',
    'package finished': 'bg-orange-100 text-orange-700',
    churn: 'bg-red-100 text-red-700',
    bk: 'bg-yellow-100 text-yellow-800',
    kk: 'bg-teal-100 text-teal-800',
    ak: 'bg-purple-100 text-purple-800',
    gk: 'bg-cyan-100 text-cyan-800',
    gcse: 'bg-blue-600 text-white',
    positive: 'bg-pink-100 text-pink-700',
    problem: 'bg-black text-white',
    discountlover: 'bg-amber-100 text-amber-900',
    'eski uye': 'bg-orange-600 text-white font-bold',
};

const SUGGESTED_TAGS = [
    'ak', 'kk', 'bk', 'gk', 'positive', 'problem', 'discountlover', 'zam öncesi'
];

function UsersPageContent() {
  const db = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const [allChildren, setAllChildren] = useState<any[]>([]);
  const [allSlots, setAllSlots] = useState<any[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(true);
  
  const [selectedParent, setSelectedParent] = useState<ParentData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isSavingTags, setIsSavingTags] = useState(false);

  // Child Progress States
  const [selectedChildForProgress, setSelectedChildForProgress] = useState<any | null>(null);
  const [isChildProgressOpen, setIsChildProgressOpen] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [regStartDate, setRegStartDate] = useState('');
  const [regEndDate, setRegEndDate] = useState('');
  const [purchaseStartDate, setPurchaseStartDate] = useState('');
  const [purchaseEndDate, setPurchaseEndDate] = useState('');
  const [activityStartDate, setActivityStartDate] = useState('');
  const [activityEndDate, setActivityEndDate] = useState('');
  
  // Bulk Tags States
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isBulkTagOpen, setIsBulkTagOpen] = useState(false);
  const [bulkTagsToAdd, setBulkTagsToAdd] = useState<string[]>([]);
  const [newBulkTagInput, setNewBulkTagInput] = useState('');
  
  // Add Lessons States
  const [isAddLessonsOpen, setIsAddLessonsOpen] = useState(false);
  const [selectedParentForLessons, setSelectedParentForLessons] = useState<ParentData | null>(null);
  const [selectedChildForPackage, setSelectedChildForPackage] = useState<any | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState('konusma');
  const [lessonCount, setLessonCount] = useState(4);
  const [selectedPackageFromPool, setSelectedPackageFromPool] = useState('');
  const [isAddingLessons, setIsAddingLessons] = useState(false);
  
  // Sorting State
  const [sortType, setSortType] = useState<'registration_desc' | 'lessons_desc' | 'lessons_asc'>('registration_desc');

  // Custom Confirm States
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);
  const [tagToRemove, setTagToRemove] = useState('');
  const [parentForRemoval, setParentForRemoval] = useState<ParentData | null>(null);

  const parentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'parent'));
  }, [db]);

  const { data: parents, isLoading: parentsLoading, refetch: refetchParents } = useCollection(parentsQuery);

  const fetchData = async () => {
    if (!db) return;
    setLoadingExtras(true);
    try {
        const childSnap = await getDocs(query(collectionGroup(db, 'children')));
        setAllChildren(childSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, parentId: doc.ref.parent.parent?.id })));

        const slotSnap = await getDocs(query(collection(db, 'lesson-slots'), where('status', '==', 'booked')));
        setAllSlots(slotSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (e) {
        console.error("Error fetching admin extras:", e);
    } finally {
        setLoadingExtras(false);
    }
  };

  useEffect(() => { fetchData(); }, [db]);
    
  const getCourseDetailsFromPackageCode = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: 30 };
    
    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const prefix = code.replace(/[0-9]/g, '');
    const courseId = courseCodeMap[prefix as keyof typeof courseCodeMap];
    
    let duration = 30; // Default
    if (courseId === 'baslangic') duration = 20;
    if (courseId === 'konusma') duration = 30;
    if (courseId === 'gelisim' || courseId === 'akademik') duration = 45;

    return { duration };
  };

  useEffect(() => {
    const fetchFreshParent = async () => {
        if (!isAddLessonsOpen || !selectedParentForLessons || !db) return;
        try {
            const parentRef = doc(db, 'users', selectedParentForLessons.id);
            const snap = await getDoc(parentRef);
            if (snap.exists()) {
                setSelectedParentForLessons({ ...snap.data(), id: snap.id } as ParentData);
            }
        } catch (e) {
            console.error("Error fetching fresh parent:", e);
        }
    };
    fetchFreshParent();
  }, [isAddLessonsOpen, db]);





  const processedParents = useMemo(() => {
    if (!parents || loadingExtras) return [];

    return parents.map(parent => {
        const tags = new Set<string>(['registered']);
        const parentChildren = allChildren.filter(c => c.parentId === parent.id);
        const parentSlots = allSlots.filter(s => s.bookedBy === parent.id);
        
        const hasTrial = parentSlots.some(s => s.packageCode === 'FREE_TRIAL');
        if (hasTrial) tags.add('trial');
        
        const hasFinishedTrial = parentSlots.some(s => s.packageCode === 'FREE_TRIAL' && isBefore(s.startTime.toDate(), new Date()));
        if (hasFinishedTrial) tags.add('trialdone');

        const totalRemainingLessons = (parentChildren.reduce((acc, c) => acc + (c.remainingLessons || 0), 0)) + (parent.remainingLessons || 0);

        const allPackageCodes = [
            ...(parent.enrolledPackages || []),
            ...parentChildren.map(c => c.assignedPackage),
            ...parentChildren.map(c => c.finishedPackage)
        ].filter(Boolean);

        const hasActivePackage = parentChildren.some(c => c.assignedPackage && (c.remainingLessons || 0) > 0) || ((parent.enrolledPackages || []).length > 0);
        if (hasActivePackage) tags.add('active');

        const hasHistory = allPackageCodes.length > 0;
        const packageFinishedField = parentChildren.some(c => c.finishedPackage && !c.assignedPackage);
        
        if (totalRemainingLessons === 0 && (hasHistory || packageFinishedField)) {
            tags.add('package finished');
        }

        if (!hasActivePackage && parent.createdAt) {
            const regDate = parent.createdAt.toDate();
            if (differenceInDays(new Date(), regDate) > 30) {
                tags.add('churn');
            }
        }


        allPackageCodes.forEach(code => {
            if (code.includes('B')) tags.add('bk');
            if (code.includes('K')) tags.add('kk');
            if (code.includes('A')) tags.add('ak');
            if (code.includes('G')) tags.add('gk');
            if (code.includes('GCSE')) tags.add('gcse');
        });

        const manualTags = (parent.tags || []).map((t: string) => t.toLowerCase());
        const hiddenTags = (parent.hiddenTags || []).map((t: string) => t.toLowerCase());

        manualTags.forEach((t: string) => {
            if (!hiddenTags.includes(t)) tags.add(t);
        });

        if (parent.isLegacy && !hiddenTags.includes('eski uye')) tags.add('eski uye');

        const lastPurchaseDate = parentSlots
            .filter(s => s.packageCode !== 'FREE_TRIAL')
            .sort((a,b) => b.startTime.seconds - a.startTime.seconds)[0]?.startTime?.toDate();

        const lastLessonDate = parentSlots.length > 0 
            ? parentSlots.sort((a,b) => b.startTime.seconds - a.startTime.seconds)[0].startTime.toDate()
            : null;

        const regDate = parent.createdAt?.toDate() || null;
        
        let lastActivityDate = regDate;
        let lastActivityType: 'register' | 'purchase' | 'lesson' | 'login' = 'register';

        if (parent.lastActiveAt) {
            const activeDate = parent.lastActiveAt.toDate();
            if (!lastActivityDate || isAfter(activeDate, lastActivityDate)) {
                lastActivityDate = activeDate;
                lastActivityType = 'login';
            }
        }

        if (lastLessonDate && (!lastActivityDate || isAfter(lastLessonDate, lastActivityDate))) {
            lastActivityDate = lastLessonDate;
            lastActivityType = 'lesson';
        }
        
        if (lastPurchaseDate && (!lastActivityDate || isAfter(lastPurchaseDate, lastActivityDate))) {
            lastActivityDate = lastPurchaseDate;
            lastActivityType = 'purchase';
        }

        return {
            ...parent,
            countryName: parent.manualCountry || getCountryFromPhone(parent.phoneNumber),
            computedTags: Array.from(tags).map(t => t.toLowerCase()).filter(t => !hiddenTags.includes(t)),
            manualTags: manualTags,
            hiddenTags: hiddenTags,
            lastPurchaseDate,
            lastActivityDate,
            lastActivityType,
            lastLessonDate,
            totalRemainingLessons
        } as ParentData;
    });
  }, [parents, allChildren, allSlots, loadingExtras]);

  useEffect(() => {
    if (userIdParam && processedParents && processedParents.length > 0) {
        const parent = processedParents.find(p => p.id === userIdParam);
        if (parent) {
            setSelectedParent(parent);
            setIsDetailOpen(true);
        }
    }
  }, [userIdParam, processedParents]);

  const allAvailableTags = useMemo(() => {
    const tags = new Set<string>();
    Object.keys(tagStyles).forEach(t => tags.add(t));
    processedParents.forEach(p => {
        p.computedTags.forEach(t => tags.add(t));
        p.manualTags.forEach(t => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [processedParents]);

  const filteredParents = useMemo(() => {
    if (!processedParents) return [];
    let result = processedParents;
    
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(p => 
            p.firstName?.toLowerCase().includes(q) || 
            p.lastName?.toLowerCase().includes(q) || 
            p.email?.toLowerCase().includes(q) ||
            p.phoneNumber?.includes(q) ||
            p.id.toLowerCase().includes(q)
        );
    }
    
    if (selectedTags.length > 0) {
        result = result.filter(p => 
            selectedTags.every(tag => p.computedTags.includes(tag) || p.manualTags.includes(tag))
        );
    }

    if (regStartDate) {
        const start = new Date(regStartDate);
        result = result.filter(p => p.createdAt && (isAfter(p.createdAt.toDate(), start) || isSameDay(p.createdAt.toDate(), start)));
    }
    if (regEndDate) {
        const end = new Date(regEndDate);
        result = result.filter(p => p.createdAt && (isBefore(p.createdAt.toDate(), end) || isSameDay(p.createdAt.toDate(), end)));
    }

    if (purchaseStartDate) {
        const start = new Date(purchaseStartDate);
        result = result.filter(p => p.lastPurchaseDate && (isAfter(p.lastPurchaseDate, start) || isSameDay(p.lastPurchaseDate, start)));
    }
    if (purchaseEndDate) {
        const end = new Date(purchaseEndDate);
        result = result.filter(p => p.lastPurchaseDate && (isBefore(p.lastPurchaseDate, end) || isSameDay(p.lastPurchaseDate, end)));
    }

    if (activityEndDate) {
        const end = new Date(activityEndDate);
        result = result.filter(p => p.lastActivityDate && (isBefore(p.lastActivityDate, end) || isSameDay(p.lastActivityDate, end)));
    }
    
    // Applying Sorting
    result = [...result].sort((a, b) => {
        if (sortType === 'registration_desc') {
            const timeA = a.createdAt?.toMillis?.() || 0;
            const timeB = b.createdAt?.toMillis?.() || 0;
            return timeB - timeA;
        } else if (sortType === 'lessons_desc') {
            return (b.totalRemainingLessons || 0) - (a.totalRemainingLessons || 0);
        } else if (sortType === 'lessons_asc') {
            return (a.totalRemainingLessons || 0) - (b.totalRemainingLessons || 0);
        }
        return 0;
    });
    
    return result;
  }, [processedParents, searchQuery, selectedTags, regStartDate, regEndDate, purchaseStartDate, purchaseEndDate, activityEndDate, sortType]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedUserIds(filteredParents.map(p => p.id));
    else setSelectedUserIds([]);
  };

  const handleBulkUpdateTags = async () => {
    // Toplu etiket güncelleme mantığı buraya...
  };

  const handleAddLessons = async () => {
    if (!selectedParentForLessons || !db || !lessonCount) return;
    setIsAddingLessons(true);
    try {
        const parentRef = doc(db, 'users', selectedParentForLessons.id);
        const batch = writeBatch(db);
        
        if (selectedChildForPackage) {
            // CASE: TRANSFER FROM POOL TO CHILD
            if (!selectedPackageFromPool) {
                toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen havuzdan bir paket seçin.' });
                setIsAddingLessons(false);
                return;
            }

            const lessonsInPackage = parseInt(selectedPackageFromPool.replace(/\D/g, ''), 10);
            const prefix = selectedPackageFromPool.replace(/[0-9]/g, '');

            const courseNames: { [key: string]: string } = {
                'B': 'Başlangıç Kursu (Pre A1)',
                'K': 'Konuşma Kursu (A1)',
                'A': 'Akademik Kurs (A2)',
                'G': 'Gelişim Kursu (B1)',
                'GCSE': 'GCSE Türkçe Kursu'
            };
            const courseName = courseNames[prefix] || 'Standart Kurs';
            const assignedPackageCode = `${prefix}${lessonCount}`;

            // 1. Update Child Document
            const childRef = doc(db, 'users', selectedParentForLessons.id, 'children', selectedChildForPackage.id);
            batch.update(childRef, {
                remainingLessons: (selectedChildForPackage.remainingLessons || 0) + lessonCount,
                assignedPackage: assignedPackageCode,
                assignedPackageName: courseName,
                updatedAt: new Date()
            });

            // 2. Update Parent Document (Pool)
            const updatedPackages = [...(selectedParentForLessons.enrolledPackages || [])];
            const packageIndex = updatedPackages.indexOf(selectedPackageFromPool);
            
            if (packageIndex !== -1) {
                updatedPackages.splice(packageIndex, 1);
                const remainder = lessonsInPackage - lessonCount;
                if (remainder > 0) {
                    updatedPackages.push(`${prefix}${remainder}`);
                }
            }

            batch.update(parentRef, {
                enrolledPackages: updatedPackages,
                remainingLessons: (selectedParentForLessons.remainingLessons - lessonCount)
            });

            // 3. Transactions & Activity
            const txRef = doc(collection(db, 'transactions'));
            batch.set(txRef, {
                userId: selectedParentForLessons.id,
                childId: selectedChildForPackage.id,
                childName: selectedChildForPackage.firstName,
                status: 'completed',
                amountGbp: 0,
                description: `🔄 [${selectedChildForPackage.firstName}] İçin Havuzdan Paket Atama`,
                items: [{ name: courseName, quantity: 1, price: 0 }],
                sourcePackage: selectedPackageFromPool,
                assignedLessons: lessonCount,
                createdAt: new Date(),
            });

            const activityRef = doc(collection(db, 'activity-log'));
            batch.set(activityRef, {
                event: '🔄 Havuzdan Paket Atama',
                icon: '👶',
                details: {
                    'Öğrenci': selectedChildForPackage.firstName,
                    'Veli': `${selectedParentForLessons.firstName} ${selectedParentForLessons.lastName}`,
                    'Transfer Edilen': `${lessonCount} Ders`,
                    'Kaynak Paket': selectedPackageFromPool
                },
                createdAt: new Date(),
            });

        } else {
            // CASE: MANUAL ADD (Check for single child auto-assignment)
            const parentChildren = allChildren.filter(c => c.parentId === selectedParentForLessons.id);
            const isSingleChild = parentChildren.length === 1;

            const prefixes: { [key: string]: string } = {
                'baslangic': 'B', 'konusma': 'K', 'akademik': 'A', 'gelisim': 'G', 'gcse': 'GCSE'
            };
            const courseNames: { [key: string]: string } = {
                'baslangic': 'Başlangıç Kursu (Pre A1)',
                'konusma': 'Konuşma Kursu (A1)',
                'akademik': 'Akademik Kurs (A2)',
                'gelisim': 'Gelişim Kursu (B1)',
                'gcse': 'GCSE Türkçe Kursu'
            };
            const prefix = prefixes[selectedCourseId] || 'B';
            const courseName = courseNames[selectedCourseId] || 'Hediye Kurs';
            const packageCode = `${prefix}${lessonCount}`;

            if (isSingleChild) {
                const child = parentChildren[0];
                const childRef = doc(db, 'users', selectedParentForLessons.id, 'children', child.id);
                
                batch.update(childRef, {
                    remainingLessons: (child.remainingLessons || 0) + lessonCount,
                    assignedPackage: packageCode,
                    assignedPackageName: courseName,
                    updatedAt: new Date()
                });

                batch.update(parentRef, {
                    remainingLessons: (selectedParentForLessons.remainingLessons || 0) + lessonCount,
                });

                // TX for child
                const txRef = doc(collection(db, 'transactions'));
                batch.set(txRef, {
                    userId: selectedParentForLessons.id,
                    childId: child.id,
                    childName: child.firstName,
                    status: 'completed',
                    amountGbp: 0,
                    description: `🎁 [${child.firstName}] İçin Otomatik Paket Atama (Manuel Ekleme)`,
                    items: [{ name: courseName, quantity: 1, price: 0 }],
                    assignedLessons: lessonCount,
                    createdAt: new Date(),
                });
            } else {
                batch.update(parentRef, {
                    remainingLessons: (selectedParentForLessons.remainingLessons || 0) + lessonCount,
                    enrolledPackages: [...(selectedParentForLessons.enrolledPackages || []), packageCode]
                });
            }

            // Log activity
            const activityRef = doc(collection(db, 'activity-log'));
            batch.set(activityRef, {
                event: isSingleChild ? '🎁 Öğrenciye Manuel Ders Ekleme' : '🎁 Veliye Manuel Ders Ekleme',
                icon: '🎫',
                details: {
                    'Veli': `${selectedParentForLessons.firstName} ${selectedParentForLessons.lastName}`,
                    'Hedef': isSingleChild ? parentChildren[0].firstName : 'Havuz',
                    'Paket': packageCode,
                    'Tip': 'Yönetici Tanımlı'
                },
                createdAt: new Date(),
            });
        }

        await batch.commit();
        toast({ title: selectedChildForPackage ? 'Transfer Başarılı' : 'Dersler Eklendi', className: 'bg-green-500 text-white' });
        setIsAddLessonsOpen(false);
        fetchData();
        refetchParents();

    } catch (e) {
        console.error("Error updating lessons:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız oldu.' });
    } finally {
        setIsAddingLessons(false);
    }
  };

  const handleToggleLegacy = async (parent: ParentData) => {
    if (!db) return;
    const newStatus = !parent.isLegacy;
    try {
        const parentRef = doc(db, 'users', parent.id);
        await setDoc(parentRef, { isLegacy: newStatus }, { merge: true });
        toast({ 
            title: newStatus ? 'Eski Üye Yapıldı' : 'Eski Üye Durumu Kaldırıldı', 
            className: newStatus ? 'bg-orange-600 text-white' : 'bg-slate-800 text-white' 
        });
        refetchParents();
    } catch (e) {
        console.error("Error toggling legacy status:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız oldu.' });
    }
  };

  const handleDeleteParent = async (parent: ParentData) => {
    if (!db) return;
    if (!window.confirm(`${parent.firstName} ${parent.lastName} isimli veliyi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;

    try {
        const parentRef = doc(db, 'users', parent.id);
        await deleteDoc(parentRef);
        toast({ 
            title: 'Veli Silindi', 
            description: `${parent.firstName} ${parent.lastName} sistemden başarıyla silindi.`,
            className: 'bg-red-600 text-white border-red-700' 
        });
        refetchParents();
    } catch (e) {
        console.error("Error deleting parent:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'Silme işlemi başarısız oldu.' });
    }
  };

  const addBulkTag = (tag: string) => {
    const normalizedTag = tag?.toLowerCase();
    if (!normalizedTag || bulkTagsToAdd.includes(normalizedTag)) return;
    setBulkTagsToAdd(prev => [...prev, normalizedTag]);
    setNewBulkTagInput('');
  };

  const removeBulkTag = (tag: string) => {
    setBulkTagsToAdd(prev => prev.filter(t => t !== tag.toLowerCase()));
  };

  // Bulk Tags Update logic would go here...

  const handleUpdateCountry = async (parent: ParentData, newCountry: string) => {
    if (!db) return;
    try {
        const parentRef = doc(db, 'users', parent.id);
        await updateDoc(parentRef, { manualCountry: newCountry });
        toast({ title: 'Ülke Güncellendi', className: 'bg-green-500 text-white' });
        refetchParents();
    } catch (e) {
        console.error("Error updating country:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'Ülke kaydedilemedi.' });
    }
  };

  const handleUpdateTags = async () => {
    if (!selectedParent || !db) return;
    setIsSavingTags(true);
    try {
        const parentRef = doc(db, 'users', selectedParent.id);
        await updateDoc(parentRef, { tags: selectedParent.manualTags });
        toast({ title: 'Etiketler Güncellendi', className: 'bg-green-500 text-white' });
        setIsTagsOpen(false);
        refetchParents();
    } catch (e) {
        console.error("Error updating tags:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'Etiketler kaydedilemedi.' });
    } finally {
        setIsSavingTags(false);
    }
  };

  const handleQuickRemoveTag = (parent: ParentData, tag: string) => {
    setTagToRemove(tag);
    setParentForRemoval(parent);
    setIsConfirmRemoveOpen(true);
  };

  const confirmRemoval = async () => {
    if (!db || !parentForRemoval || !tagToRemove) return;
    const normalizedTag = tagToRemove.toLowerCase();
    
    try {
        const parentRef = doc(db, 'users', parentForRemoval.id);
        const newManualTags = (parentForRemoval.manualTags || []).filter(t => t.toLowerCase() !== normalizedTag);
        const newHiddenTags = Array.from(new Set([...(parentForRemoval.hiddenTags || []), normalizedTag]));
        
        const updates: any = { 
            tags: newManualTags,
            hiddenTags: newHiddenTags
        };

        if (normalizedTag === 'eski uye') {
            updates.isLegacy = false;
        }

        await updateDoc(parentRef, updates);
        toast({ title: 'Etiket Gizlendi', className: 'bg-slate-800 text-white' });
        setIsConfirmRemoveOpen(false);
        setTagToRemove('');
        setParentForRemoval(null);
        refetchParents();
    } catch (e) {
        console.error("Error removing tag:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'Etiket kaldırılamadı.' });
    }
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag?.toLowerCase();
    if (!normalizedTag || selectedParent?.manualTags.includes(normalizedTag)) return;
    setSelectedParent(prev => prev ? { 
        ...prev, 
        manualTags: [...prev.manualTags, normalizedTag],
        computedTags: prev.computedTags.includes(normalizedTag) ? prev.computedTags : [...prev.computedTags, normalizedTag]
    } : null);
    setNewTagInput('');
  };

  const removeTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase();
    setSelectedParent(prev => prev ? { 
        ...prev, 
        manualTags: prev.manualTags.filter(t => t.toLowerCase() !== normalizedTag),
        computedTags: prev.computedTags.filter(t => t.toLowerCase() !== normalizedTag)
    } : null);
  };

  return (
    <div className="space-y-4 sm:space-y-8 p-2 sm:p-8 pt-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">Veli Yönetimi</h1>
            <p className="text-[11px] sm:text-sm text-muted-foreground mt-1 max-w-[500px]">Kayıtlı veliler, satın alma geçmişleri ve otomatik etiketler.</p>
        </div>
        {selectedUserIds.length > 0 && (
            <Button onClick={() => setIsBulkTagOpen(true)} className="h-10 sm:h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-sm px-4 sm:px-6 w-full sm:w-auto text-xs sm:text-sm">
                <Tags className="w-4 h-4 mr-2" /> Toplu Etiket ({selectedUserIds.length})
            </Button>
        )}
      </div>

      <div className="bg-white p-2 sm:p-4 rounded-[20px] sm:rounded-[24px] shadow-sm border border-slate-100 space-y-2 sm:space-y-4">
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                  placeholder="İsim, Şifre veya E-posta Ara..." 
                  className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200 shadow-none font-medium bg-slate-50/50 focus:bg-white transition-colors text-xs sm:text-sm" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          
          <div className="grid grid-cols-2 lg:flex gap-2">
            <div className="flex items-center gap-2 bg-slate-50/50 px-3 h-10 sm:h-11 rounded-xl border border-slate-200 w-full lg:w-auto">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 rotate-90" />
              <select 
                  className="text-[10px] sm:text-xs font-bold bg-transparent border-none focus:ring-0 text-slate-600 outline-none cursor-pointer pr-4 sm:pr-8 w-full"
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as any)}
              >
                  <option value="registration_desc">Kayıt: En Yeni</option>
                  <option value="lessons_desc">Ders: En Çok</option>
                  <option value="lessons_asc">Ders: En Az</option>
              </select>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 sm:h-11 rounded-xl border-slate-200 font-bold gap-2 px-3 sm:px-4 text-[10px] sm:text-xs w-full lg:w-auto">
                  <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Etiket ({selectedTags.length})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 rounded-2xl shadow-2xl border-none">
                <div className="p-2 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Etiketleri Seç</span>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold py-0" onClick={() => setSelectedTags([])}>Temizle</Button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 pt-1">
                    {allAvailableTags.map(tag => (
                      <div key={tag} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => {
                          setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
                      }}>
                        <Checkbox checked={selectedTags.includes(tag)} />
                        <Badge variant="secondary" className={cn("text-[9px] px-2 py-0.5 border-none font-bold uppercase tracking-tighter", tagStyles[tag] || 'bg-slate-100 text-slate-500')}>
                            {tag}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 sm:h-11 rounded-xl border-slate-200 font-bold gap-2 px-3 sm:px-4 shrink-0 text-[10px] sm:text-xs w-full lg:w-auto">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Gelişmiş Filtreler
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-6 rounded-[24px] shadow-2xl border-none space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">Kayıt Tarihi Aralığı</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[9px] text-slate-400 uppercase font-black">Başlangıç</Label>
                            <Input type="date" value={regStartDate} onChange={e => setRegStartDate(e.target.value)} className="h-9 text-xs rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] text-slate-400 uppercase font-black">Bitiş</Label>
                            <Input type="date" value={regEndDate} onChange={e => setRegEndDate(e.target.value)} className="h-9 text-xs rounded-lg" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">Son Satın Alma Aralığı</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[9px] text-slate-400 uppercase font-black">Başlangıç</Label>
                            <Input type="date" value={purchaseStartDate} onChange={e => setPurchaseStartDate(e.target.value)} className="h-9 text-xs rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] text-slate-400 uppercase font-black">Bitiş</Label>
                            <Input type="date" value={purchaseEndDate} onChange={e => setPurchaseEndDate(e.target.value)} className="h-9 text-xs rounded-lg" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">Etkinlik Tarihi Aralığı</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[9px] text-slate-400 uppercase font-black">Başlangıç</Label>
                            <Input type="date" value={activityStartDate} onChange={e => setActivityStartDate(e.target.value)} className="h-9 text-xs rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] text-slate-400 uppercase font-black">Bitiş</Label>
                            <Input type="date" value={activityEndDate} onChange={e => setActivityEndDate(e.target.value)} className="h-9 text-xs rounded-lg" />
                        </div>
                    </div>
                </div>

                <Button 
                    variant="secondary" 
                    className="w-full rounded-xl h-10 font-bold text-xs" 
                    onClick={() => {
                        setRegStartDate(''); setRegEndDate('');
                        setPurchaseStartDate(''); setPurchaseEndDate('');
                        setActivityStartDate(''); setActivityEndDate('');
                        setSelectedTags([]);
                    }}
                > Tüm Filtreleri Sıfırla </Button>
            </PopoverContent>
          </Popover>
        </div>

        {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Aktif Filtreler:</span>
                {selectedTags.map(tag => (
                    <Badge key={tag} className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold gap-1 pl-2 pr-1 py-0.5 rounded-full">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))} />
                    </Badge>
                ))}
            </div>
        )}
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[20px] sm:rounded-[24px]">
        <CardHeader className="bg-white border-b px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base lg:text-lg flex items-center gap-2 text-slate-800">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Veliler ({filteredParents.length})
            </CardTitle>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">Hepsini Seç</span>
                <Checkbox 
                    checked={selectedUserIds.length === filteredParents.length && filteredParents.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    className="rounded-md border-slate-300 h-5 w-5"
                />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
            {parentsLoading || loadingExtras ? (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Veriler Analiz Ediliyor...</p>
                </div>
            ) : (
                <>
                    {/* MOBILE CARDS VIEW */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {filteredParents.map((parent) => (
                            <ParentCard 
                                key={parent.id} 
                                parent={parent} 
                                isSelected={selectedUserIds.includes(parent.id)}
                                onSelect={(checked) => {
                                    setSelectedUserIds(prev => checked ? [...prev, parent.id] : prev.filter(id => id !== parent.id));
                                }}
                                onDetail={() => { setSelectedParent(parent); setIsDetailOpen(true); }}
                                onAddLessons={() => { setSelectedParentForLessons(parent); setIsAddLessonsOpen(true); }}
                                onManageTags={() => { setSelectedParent(parent); setIsTagsOpen(true); }}
                                onToggleLegacy={() => handleToggleLegacy(parent)}
                                onDelete={() => handleDeleteParent(parent)}
                                onQuickRemoveTag={(tag) => handleQuickRemoveTag(parent, tag)}
                            />
                        ))}
                    </div>

                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="w-[50px] pl-8"></TableHead>
                                    <TableHead className="font-bold text-slate-500 py-5">Veli Bilgisi</TableHead>
                                    <TableHead className="font-bold text-slate-500">Ülke</TableHead>
                                    <TableHead className="font-bold text-slate-500">Kayıt Tarihi</TableHead>
                                    <TableHead className="font-bold text-slate-500">Kalan Ders</TableHead>
                                    <TableHead className="font-bold text-slate-500">Etiketler</TableHead>
                                    <TableHead className="w-[80px] text-right pr-8"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredParents.map((parent) => (
                                    <ParentRow 
                                        key={parent.id} 
                                        parent={parent} 
                                        isSelected={selectedUserIds.includes(parent.id)}
                                        onSelect={(checked) => {
                                            setSelectedUserIds(prev => checked ? [...prev, parent.id] : prev.filter(id => id !== parent.id));
                                        }}
                                        onDetail={() => { setSelectedParent(parent); setIsDetailOpen(true); }}
                                        onAddLessons={() => { setSelectedParentForLessons(parent); setIsAddLessonsOpen(true); }}
                                        onManageTags={() => { setSelectedParent(parent); setIsTagsOpen(true); }}
                                        onToggleLegacy={() => handleToggleLegacy(parent)}
                                        onDelete={() => handleDeleteParent(parent)}
                                        onQuickRemoveTag={(tag) => handleQuickRemoveTag(parent, tag)}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </CardContent>
      </Card>

      {/* DETAIL DIALOG */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="sr-only">
                <DialogTitle>Veli Profil Detayı - {selectedParent?.firstName} {selectedParent?.lastName}</DialogTitle>
                <DialogDescription>Seçili velinin iletişim bilgileri, çocukları ve ders geçmişini içeren detaylı görünüm.</DialogDescription>
            </DialogHeader>
            {selectedParent && (
                <div className="flex flex-col h-full">
                    <div className="p-4 sm:p-8 bg-slate-900 text-white shrink-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-[18px] sm:rounded-[24px] bg-primary flex items-center justify-center text-xl sm:text-3xl font-black shadow-lg shadow-primary/20">
                                    {selectedParent.firstName?.[0]}{selectedParent.lastName?.[0]}
                                </div>
                                <div className="space-y-0.5 sm:space-y-1">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">{selectedParent.firstName} {selectedParent.lastName}</h2>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-slate-400 text-[10px] sm:text-sm font-medium">
                                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {selectedParent.email}</span>
                                        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {selectedParent.phoneNumber}</span>
                                    </div>
                                    <span className="inline-block sm:hidden text-[8px] font-mono opacity-50 bg-white/10 px-1.5 py-0.5 rounded leading-none uppercase">ID: {selectedParent.shortId || selectedParent.id.substring(0, 8).toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
                                <span className="hidden sm:inline-block text-[10px] font-mono opacity-50 bg-white/10 px-2 py-0.5 rounded uppercase mr-2 select-all">ID: {selectedParent.shortId || selectedParent.id.substring(0, 8).toUpperCase()}</span>
                                <Badge className="bg-emerald-500 text-white border-none font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-widest text-[8px] sm:text-[10px]">
                                    {selectedParent.countryName}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                        <div className="bg-slate-900/95 px-4 sm:px-8">
                            <TabsList className="bg-transparent gap-4 sm:gap-8 h-10 sm:h-12 p-0 w-full justify-start overflow-x-auto no-scrollbar">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-lg sm:rounded-t-xl rounded-b-none h-10 sm:h-12 border-none font-bold text-slate-400 px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap">Özet</TabsTrigger>
                                <TabsTrigger value="children" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-lg sm:rounded-t-xl rounded-b-none h-10 sm:h-12 border-none font-bold text-slate-400 px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap">Çocuklar</TabsTrigger>
                                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-lg sm:rounded-t-xl rounded-b-none h-10 sm:h-12 border-none font-bold text-slate-400 px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap">Dersler</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
                            <TabsContent value="overview" className="mt-0 space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                    <Card className="bg-slate-50 border-none p-4 sm:p-6 space-y-1 sm:space-y-2">
                                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Kayıt Tarihi</p>
                                        <p className="text-lg sm:text-xl font-bold text-slate-800">{selectedParent.createdAt ? format(selectedParent.createdAt.toDate(), 'dd MMMM yyyy', { locale: tr }) : '-'}</p>
                                    </Card>
                                    <Card className="bg-slate-50 border-none p-4 sm:p-6 space-y-1 sm:space-y-2">
                                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Kalan Toplam Ders</p>
                                        <p className="text-lg sm:text-xl font-bold text-slate-800">
                                            {(allChildren.filter(c => c.parentId === selectedParent.id).reduce((acc, c) => acc + (c.remainingLessons || 0), 0)) + (selectedParent.remainingLessons || 0)}
                                        </p>
                                    </Card>
                                    <Card className="bg-slate-50 border-none p-4 sm:p-6 space-y-1 sm:space-y-2">
                                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Havuzdaki Paketler</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedParent.enrolledPackages?.length > 0 ? selectedParent.enrolledPackages.map((p: string, i: number) => (
                                                <Badge key={i} variant="secondary" className="bg-white border-slate-200 text-slate-600 font-bold text-[8px] sm:text-[10px] uppercase">{p}</Badge>
                                            )) : <span className="text-xs sm:text-sm font-medium text-slate-400">Yok</span>}
                                        </div>
                                    </Card>
                                    <Card className="bg-slate-50 border-none p-4 sm:p-6 space-y-1 sm:space-y-2">
                                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Son Etkinlik</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {selectedParent.lastActivityDate ? (
                                                <>
                                                    {selectedParent.lastActivityType === 'purchase' ? <ShoppingBag className="w-4 h-4 text-emerald-500" /> : 
                                                     selectedParent.lastActivityType === 'lesson' ? <Calendar className="w-4 h-4 text-blue-500" /> : <User className="w-4 h-4 text-slate-400" />}
                                                    <p className="text-lg sm:text-xl font-bold text-slate-800">
                                                        {format(selectedParent.lastActivityDate, 'dd MMMM yyyy', { locale: tr })}
                                                    </p>
                                                </>
                                            ) : <span className="text-sm font-medium text-slate-400">-</span>}
                                        </div>
                                    </Card>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                        <TagIcon className="w-4 h-4 text-primary" /> Aktif Etiketler
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedParent.computedTags?.map(tag => (
                                            <Badge key={tag} className={cn("px-3 py-1 border-none font-bold uppercase tracking-tighter text-[10px]", tagStyles[tag] || 'bg-slate-100 text-slate-500')}>
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="children" className="mt-0 space-y-6">
                                {allChildren.filter(c => c.parentId === selectedParent.id).length > 0 ? (
                                    <div className="grid gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 py-1">
                                        {allChildren.filter(c => c.parentId === selectedParent.id).map(child => (
                                            <Card key={child.id} className="p-6 border-slate-100 shadow-sm flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">👶</div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-lg">{child.firstName}</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs text-slate-500 font-medium">{child.dateOfBirth ? `${differenceInYears(new Date(), new Date(child.dateOfBirth))} Yaş` : '-'}</p>
                                                            <span className="text-[9px] font-mono text-slate-300 bg-slate-50 px-1 rounded select-all uppercase">ID: {child.id.substring(0, 8).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 items-center">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase">Kalan Ders</p>
                                                        <p className="font-bold text-slate-800">{child.remainingLessons || 0}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase">Seviye</p>
                                                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black">{child.level?.toUpperCase() || 'YOK'}</Badge>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={() => {
                                                        setSelectedChildForProgress(child);
                                                        setIsChildProgressOpen(true);
                                                    }}>
                                                        <FileText className="w-3 h-3 mr-1" />
                                                        Detaylı İlerleme
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => {
                                                        setSelectedParentForLessons(selectedParent);
                                                        setSelectedChildForPackage(child);
                                                        setIsAddLessonsOpen(true);
                                                    }}>
                                                        <Plus className="w-3 h-3 mr-1" />
                                                        Paket Ata
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center space-y-4">
                                        <Baby className="w-12 h-12 mx-auto text-slate-200" />
                                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Henüz çocuk eklenmemiş</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="history" className="mt-0">
                                <div className="space-y-4">
                                    {(() => {
                                        const parentSlots = allSlots.filter(s => s.bookedBy === selectedParent.id);
                                        if (parentSlots.length === 0) return (
                                            <div className="py-20 text-center space-y-4">
                                                <History className="w-12 h-12 mx-auto text-slate-200" />
                                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Ders kaydı bulunamadı</p>
                                            </div>
                                        );

                                        // Grouping Logic
                                        const sessions: { [key: string]: any[] } = {};
                                        parentSlots.forEach(slot => {
                                            const st = slot.startTime.toDate();
                                            const dateKey = format(st, 'yyyy-MM-dd');
                                            // Group by date, child, teacher and package (within the same day)
                                            const sessionKey = `${dateKey}-${slot.childId}-${slot.teacherId}`;
                                            if (!sessions[sessionKey]) sessions[sessionKey] = [];
                                            sessions[sessionKey].push(slot);
                                        });

                                        const groupedSessions = Object.values(sessions).map(sessionSlots => {
                                            sessionSlots.sort((a,b) => a.startTime.seconds - b.startTime.seconds);
                                            const first = sessionSlots[0];
                                            const st = first.startTime.toDate();
                                            const details = getCourseDetailsFromPackageCode(first.packageCode);
                                            const duration = details?.duration || 30;
                                            const et = addMinutes(st, duration);

                                            return {
                                                id: first.id,
                                                startTime: st,
                                                endTime: et,
                                                packageCode: first.packageCode,
                                                childId: first.childId,
                                                status: first.status
                                            };
                                        }).sort((a,b) => b.startTime.getTime() - a.startTime.getTime());

                                        return (
                                            <div className="divide-y border rounded-2xl overflow-y-auto max-h-[60vh] custom-scrollbar bg-white shadow-inner">
                                                {groupedSessions.map((session, i) => (
                                                    <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-sm", session.packageCode === 'FREE_TRIAL' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500')}>
                                                                <History className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-black text-slate-800">{session.packageCode === 'FREE_TRIAL' ? 'Deneme Dersi' : `Paket Dersi (${session.packageCode})`}</p>
                                                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter h-4 border-slate-200 text-slate-400">
                                                                        {allChildren.find(c => c.id === session.childId)?.firstName || 'Öğrenci'}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-3 mt-0.5">
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                                        <Calendar className="w-3.5 h-3.5 opacity-40" />
                                                                        {format(session.startTime, 'dd MMM yyyy', { locale: tr })}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                                        <Clock className="w-3.5 h-3.5 opacity-40" />
                                                                        {format(session.startTime, 'HH:mm')} - {format(session.endTime, 'HH:mm')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {(() => {
                                                            const isStarted = currentTime >= session.startTime;
                                                            const isEnded = currentTime >= session.endTime;
                                                            
                                                            if (isEnded) return <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50/50 border-emerald-100 px-3 py-1 rounded-full">Tamamlandı</Badge>;
                                                            if (isStarted) return (
                                                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border-red-100 px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5 shadow-sm shadow-red-100">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                                                                    Ders Yapılıyor
                                                                </Badge>
                                                            );
                                                            return <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 border-blue-100 px-3 py-1 rounded-full">Ders Başlamadı</Badge>;
                                                        })()}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            )}
        </DialogContent>
      </Dialog>

      {/* TAGS DIALOG */}
      <Dialog open={isTagsOpen} onOpenChange={setIsTagsOpen}>
        <DialogContent className="max-w-md rounded-[24px] p-8">
            <DialogHeader>
                <DialogTitle className="text-2xl font-black">Etiketleri Düzenle</DialogTitle>
                <DialogDescription className="font-medium">
                    {selectedParent?.firstName} için manuel etiketleri yönetin.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-8 py-6">
                <div className="space-y-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Önerilen Etiketler</Label>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => addTag(tag)}
                                disabled={selectedParent?.manualTags.includes(tag)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                    selectedParent?.manualTags.includes(tag) 
                                        ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                                        : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                                )}
                            >
                                + {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mevcut Etiketler</Label>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        {selectedParent?.computedTags.length === 0 && (
                            <span className="text-xs text-slate-400 italic">Henüz etiket eklenmemiş.</span>
                        )}
                        {selectedParent?.computedTags?.map(tag => {
                            return (
                                <Badge key={tag} className={cn("relative group font-bold pl-3 py-1 rounded-full overflow-visible transition-all", selectedParent.manualTags?.includes(tag) ? "bg-primary text-white pr-3" : "bg-slate-200 text-slate-500 pr-3 border-none shadow-none")}>
                                    {tag}
                                    <button 
                                        onClick={() => handleQuickRemoveTag(selectedParent, tag)} 
                                        className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-white text-slate-400 border border-slate-200 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-600 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yeni Etiket Ekle</Label>
                    <div className="flex gap-2">
                        <input 
                            placeholder="Örn: vip-müşteri" 
                            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={newTagInput}
                            onChange={e => setNewTagInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTag(newTagInput)}
                        />
                        <Button className="rounded-xl h-11 px-6 font-bold" onClick={() => addTag(newTagInput)}>Ekle</Button>
                    </div>
                </div>
            </div>
            <DialogFooter className="gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2" onClick={() => setIsTagsOpen(false)}>Vazgeç</Button>
                <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleUpdateTags} disabled={isSavingTags}>
                    {isSavingTags ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Kaydet
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE TAG CONFIRMATION */}
      <Dialog open={isConfirmRemoveOpen} onOpenChange={setIsConfirmRemoveOpen}>
        <DialogContent className="max-w-[400px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-red-50 p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-8 h-8 text-red-600" />
                </div>
                <div className="space-y-2">
                    <DialogTitle className="text-xl font-black text-red-900 uppercase tracking-tight">Etiketi Gizle?</DialogTitle>
                    <DialogDescription className="text-red-700 font-medium">
                        <span className="font-black bg-red-200 px-2 py-0.5 rounded text-red-800">'{tagToRemove.toUpperCase()}'</span> etiketini bu veli için tamamen gizlemek istediğinize emin misiniz?
                    </DialogDescription>
                </div>
            </div>
            <div className="p-6 bg-white flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2" onClick={() => setIsConfirmRemoveOpen(false)}>Vazgeç</Button>
                <Button className="flex-1 h-12 rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 text-white" onClick={confirmRemoval}>Evet, Gizle</Button>
            </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isBulkTagOpen} onOpenChange={setIsBulkTagOpen}>
        <DialogContent className="max-w-md rounded-[24px] p-8">
            <DialogHeader>
                <DialogTitle className="text-2xl font-black">Toplu Etiket Ekle</DialogTitle>
                <DialogDescription className="font-medium">
                    Seçili {selectedUserIds.length} veliye yeni etiketleri ekleyin.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-8 py-6">
                <div className="space-y-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Önerilen Etiketler</Label>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => addBulkTag(tag)}
                                disabled={bulkTagsToAdd.includes(tag)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                    bulkTagsToAdd.includes(tag) 
                                        ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" 
                                        : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                                )}
                            >
                                + {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eklenecek Etiketler</Label>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        {bulkTagsToAdd.length === 0 && (
                            <span className="text-xs text-slate-400 italic">Henüz etiket eklenmemiş.</span>
                        )}
                        {bulkTagsToAdd.map(tag => (
                            <Badge key={tag} className="bg-primary text-white font-bold gap-1 pl-3 pr-1 py-1 rounded-full group">
                                {tag}
                                <button onClick={() => removeBulkTag(tag)} className="p-0.5 hover:bg-white/20 rounded-full transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yeni Etiket Ekle</Label>
                    <div className="flex gap-2">
                        <input 
                            placeholder="Örn: kampanya-mart" 
                            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={newBulkTagInput}
                            onChange={e => setNewBulkTagInput(e.target.value)}
                            onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addBulkTag(newBulkTagInput); } }}
                        />
                        <Button className="rounded-xl h-11 px-6 font-bold" onClick={() => addBulkTag(newBulkTagInput)}>Ekle</Button>
                    </div>
                </div>
            </div>
            <DialogFooter className="gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2" onClick={() => setIsBulkTagOpen(false)}>Vazgeç</Button>
                <Button className="flex-1 h-12 rounded-xl font-bold" onClick={handleBulkUpdateTags} disabled={isSavingTags}>
                    {isSavingTags ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Toplu Kaydet
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD LESSONS DIALOG */}
      <Dialog open={isAddLessonsOpen} onOpenChange={(open) => {
          setIsAddLessonsOpen(open);
          if (!open) {
              setSelectedChildForPackage(null);
              setSelectedPackageFromPool('');
          }
      }}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="p-8 bg-blue-600 text-white">
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                    <Package className="w-6 h-6" /> {selectedChildForPackage ? 'Havuzdan Paket Ata' : 'Manuel Ders Ekle'}
                </DialogTitle>
                <DialogDescription className="text-blue-100 font-medium">
                    {selectedChildForPackage 
                        ? `${selectedChildForPackage.firstName} için veli havuzundan ders seçin.` 
                        : `${selectedParentForLessons?.firstName} isimli velinin hesabına (havuzuna) ders tanımlayın.`}
                </DialogDescription>
            </DialogHeader>

            <div className="p-8 space-y-6 bg-white">
                {selectedChildForPackage ? (
                    /* CASE: ASSIGNING EXISTING TO CHILD */
                    (selectedParentForLessons?.enrolledPackages && selectedParentForLessons.enrolledPackages.length > 0) ? (
                        <>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Havuzdaki Paketler</Label>
                                <Select value={selectedPackageFromPool} onValueChange={(val) => {
                                    setSelectedPackageFromPool(val);
                                    setLessonCount(parseInt(val.replace(/\D/g, ''), 10) || 0);
                                }}>
                                    <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold">
                                        <SelectValue placeholder="Paket Seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                        {selectedParentForLessons?.enrolledPackages?.map((pkg: string, idx: number) => {
                                            const prefix = pkg.replace(/[0-9]/g, '');
                                            const lessons = parseInt(pkg.replace(/\D/g, ''), 10);
                                            const courseNames: { [key: string]: string } = {
                                                'B': 'Başlangıç (Pre A1)',
                                                'K': 'Konuşma (A1)',
                                                'A': 'Akademik (A2)',
                                                'G': 'Gelişim (B1)',
                                                'GCSE': 'GCSE Türkçe'
                                            };
                                            return (
                                                <SelectItem key={`${pkg}-${idx}`} value={pkg} className="font-bold">
                                                    {courseNames[prefix] || 'Kurs'} ({lessons} Ders)
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atanacak Ders Sayısı</Label>
                                    <span className="text-[10px] font-bold text-primary">Maks: {parseInt(selectedPackageFromPool.replace(/\D/g, ''), 10) || 0}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Input 
                                        type="number" 
                                        className="h-12 rounded-xl border-slate-200 font-bold text-lg text-center"
                                        value={lessonCount}
                                        onChange={(e) => setLessonCount(Math.min(parseInt(selectedPackageFromPool.replace(/\D/g, ''), 10), parseInt(e.target.value) || 0))}
                                    />
                                    <div className="flex gap-2">
                                        {[4, 8, 12, 24].map(n => {
                                            const max = parseInt(selectedPackageFromPool.replace(/\D/g, ''), 10) || 0;
                                            return (
                                                <Button 
                                                    key={n} 
                                                    variant={lessonCount === n ? 'default' : 'outline'} 
                                                    className="w-10 h-10 p-0 rounded-lg text-xs font-bold shrink-0"
                                                    onClick={() => setLessonCount(Math.min(max, n))}
                                                    disabled={n > max}
                                                >
                                                    {n}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2" onClick={() => setIsAddLessonsOpen(false)}>Vazgeç</Button>
                                <Button className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" onClick={handleAddLessons} disabled={isAddingLessons || !selectedPackageFromPool}>
                                    {isAddingLessons ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                    Paketi Aktar
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="py-8 text-center space-y-4">
                            <Package className="w-12 h-12 mx-auto text-slate-200" />
                            <div className="space-y-1">
                                <p className="font-bold text-slate-800">Havuz Boş</p>
                                <p className="text-sm text-slate-500">Bu velinin henüz atanmamış dersi bulunmuyor. Önce ders eklemelisiniz.</p>
                            </div>
                            <Button variant="outline" className="rounded-xl font-bold w-full" onClick={() => setIsAddLessonsOpen(false)}>Tamam</Button>
                        </div>
                    )
                ) : (
                    /* CASE: ADDING NEW LESSONS TO PARENT POOL */
                    <>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Kurs Seçimi</Label>
                            <select 
                                className="w-full h-12 rounded-xl border border-slate-200 px-4 font-bold text-slate-700 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                            >
                                <option value="baslangic">Başlangıç Kursu (Pre-A1)</option>
                                <option value="konusma">Konuşma Kursu (A1)</option>
                                <option value="akademik">Akademik Kurs (A2)</option>
                                <option value="gelisim">Gelişim Kursu (B1)</option>
                                <option value="gcse">GCSE Türkçe Kursu</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Ders Sayısı</Label>
                            <div className="flex items-center gap-4">
                                <Input 
                                    type="number" 
                                    className="h-12 rounded-xl border-slate-200 font-bold text-lg text-center"
                                    value={lessonCount}
                                    onChange={(e) => setLessonCount(parseInt(e.target.value) || 0)}
                                />
                                <div className="flex gap-2">
                                    {[4, 8, 12, 24].map(n => (
                                        <Button 
                                            key={n} 
                                            variant={lessonCount === n ? 'default' : 'outline'} 
                                            className="w-10 h-10 p-0 rounded-lg text-xs font-bold shrink-0"
                                            onClick={() => setLessonCount(n)}
                                        >
                                            {n}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2" onClick={() => setIsAddLessonsOpen(false)}>Vazgeç</Button>
                            <Button className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700" onClick={handleAddLessons} disabled={isAddingLessons}>
                                {isAddingLessons ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                Dersleri Tanımla
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </DialogContent>
      </Dialog>

      {/* CHILD PROGRESS DIALOG */}
      <Dialog open={isChildProgressOpen} onOpenChange={setIsChildProgressOpen}>
        <DialogContent className="max-w-5xl h-[95vh] sm:h-[90vh] p-0 overflow-hidden sm:rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="p-4 sm:p-6 border-b bg-slate-900 text-white">
                <DialogTitle className="text-lg sm:text-2xl font-black flex items-center gap-3">
                    <Baby className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    {selectedChildForProgress?.firstName} - İlerleme
                </DialogTitle>
                <DialogDescription className="text-slate-400 font-medium text-[10px] sm:text-sm">
                    Çocuğun tüm akademik gelişimi ve seviye takibi.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50/50 custom-scrollbar">
                {selectedChildForProgress && (
                    <ProgressPanel 
                        child={selectedChildForProgress} 
                        isEditable={true} 
                        authorRole="admin"
                    />
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ParentRow({ parent, isSelected, onSelect, onDetail, onAddLessons, onManageTags, onToggleLegacy, onDelete, onQuickRemoveTag }: any) {
    return (
        <TableRow className={cn("hover:bg-slate-50/30 transition-colors border-slate-100", isSelected && "bg-slate-50")}>
            <TableCell className="pl-8">
                <Checkbox checked={isSelected} onCheckedChange={onSelect} />
            </TableCell>
            <TableCell className="py-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                        {parent.firstName?.[0]}{parent.lastName?.[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-700 truncate">{parent.firstName} {parent.lastName}</span>
                        <span className="text-[10px] text-slate-400 font-medium lowercase truncate">{parent.email}</span>
                        <span className="text-[9px] font-mono text-slate-300 uppercase tracking-tighter">ID: {parent.shortId || parent.id.substring(0, 8).toUpperCase()}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="font-semibold text-slate-600 text-sm whitespace-nowrap">{parent.countryName}</TableCell>
            <TableCell className="text-slate-500 text-xs">
                {parent.createdAt ? format(parent.createdAt.toDate(), 'dd MMM yyyy', { locale: tr }) : '-'}
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <div className={cn(
                        "inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-black",
                        parent.totalRemainingLessons > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"
                    )}>
                        {parent.totalRemainingLessons || 0} Ders
                    </div>
                    {parent.totalRemainingLessons === 0 && parent.lastLessonDate && (
                        <span className="text-[10px] text-slate-400 font-bold ml-1">
                            Son: {format(parent.lastLessonDate, 'dd MMM', { locale: tr })}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {parent.computedTags?.slice(0, 5).map((tag: any) => (
                        <Badge key={tag} variant="secondary" className={cn("text-[8px] px-1.5 py-0 border-none font-bold uppercase tracking-tighter", tagStyles[tag] || 'bg-slate-100 text-slate-500')}>
                            {tag}
                        </Badge>
                    ))}
                    {parent.computedTags?.length > 5 && <span className="text-[9px] text-slate-300 font-black">+{parent.computedTags.length - 5}</span>}
                </div>
            </TableCell>
            <TableCell className="text-right pr-8">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-48">
                        <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase mb-1">İşlemler</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer" onClick={onDetail}>
                            <User className="w-3.5 h-3.5 mr-2 opacity-50" /> Profil Detayı
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-blue-600" onClick={onAddLessons}>
                            <Plus className="w-3.5 h-3.5 mr-2" /> Ders Ekle
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-emerald-600" onClick={onManageTags}>
                            <Tags className="w-3.5 h-3.5 mr-2" /> Etiketleri Yönet
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-orange-600" onClick={onToggleLegacy}>
                            <ArrowRight className="w-3.5 h-3.5 mr-2 rotate-[-45deg]" /> {parent.isLegacy ? 'Eski Üye Durumunu Kaldır' : 'Eski Üye Yap'}
                        </DropdownMenuItem>
                        <div className="my-1 border-t border-slate-100" />
                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-red-500 hover:bg-red-50" onClick={onDelete}>
                            <X className="w-3.5 h-3.5 mr-2" /> Veliyi Sil
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

function ParentCard({ parent, isSelected, onSelect, onDetail, onAddLessons, onManageTags, onToggleLegacy, onDelete, onQuickRemoveTag }: any) {
    return (
        <div className={cn("p-4 bg-white transition-colors flex gap-3", isSelected && "bg-blue-50/30")}>
            <div className="pt-1">
                <Checkbox checked={isSelected} onCheckedChange={onSelect} className="rounded-md" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px] shrink-0">
                                {parent.firstName?.[0]}{parent.lastName?.[0]}
                            </div>
                            <span className="font-bold text-slate-900 text-sm truncate leading-none">{parent.firstName} {parent.lastName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium truncate mt-1">{parent.email}</span>
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-48">
                            <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase mb-1">İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer" onClick={onDetail}>Profil Detayı</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer" onClick={onAddLessons}>Paket İşlemleri</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-emerald-600" onClick={onManageTags}>Etiketleri Yönet</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-orange-600" onClick={onToggleLegacy}>
                                {parent.isLegacy ? 'Normal Üye Yap' : 'Eski Üye Yap'}
                            </DropdownMenuItem>
                            <div className="my-1 border-t border-slate-100" />
                            <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 text-red-500 cursor-pointer" onClick={onDelete}>
                                <X className="w-3.5 h-3.5 mr-2" /> Veliyi Sil
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                    <Badge variant="outline" className="text-[9px] border-slate-100 text-slate-400 font-bold tracking-tighter uppercase px-1.5 py-0 h-4">
                        {parent.countryName}
                    </Badge>
                    {parent.computedTags?.slice(0, 5).map((tag: any) => (
                        <Badge key={tag} className={cn("text-[8px] px-1.5 py-0 border-none font-black uppercase tracking-tighter h-4", tagStyles[tag] || 'bg-slate-100 text-slate-400')}>
                            {tag}
                        </Badge>
                    ))}
                    {parent.computedTags?.length > 5 && <span className="text-[9px] text-slate-300 font-black">+{parent.computedTags.length - 5}</span>}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-50 mt-1">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Kayıt</span>
                        <span className="text-[10px] font-bold text-slate-500">{parent.createdAt ? format(parent.createdAt.toDate(), 'dd.MM.yy') : '-'}</span>
                    </div>
                    <div className="flex flex-col text-right items-end gap-0.5">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Kalan Ders</span>
                        <div className="flex flex-col items-end leading-none">
                            <span className={cn("text-[10px] font-black", parent.totalRemainingLessons > 0 ? "text-emerald-600" : "text-slate-400")}>
                                {parent.totalRemainingLessons || 0} Ders
                            </span>
                            {parent.totalRemainingLessons === 0 && parent.lastLessonDate && (
                                <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                                    Son: {format(parent.lastLessonDate, 'dd MMM', { locale: tr })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const dynamic = 'force-dynamic';

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" /></div>}>
      <UsersPageContent />
    </Suspense>
  );
}
