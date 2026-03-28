
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, collectionGroup, doc, updateDoc, writeBatch, setDoc, deleteDoc } from 'firebase/firestore';
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
    Filter
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
import { format, differenceInDays, isBefore, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ProgressPanel } from '@/components/shared/progress-panel';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    lastPurchaseDate?: Date;
    countryName: string;
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
    'positive', 'problem', 'discountlover', 'zam öncesi'
];

function UsersPageContent() {
  const db = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');

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
  const [selectedCourseId, setSelectedCourseId] = useState('konusma');
  const [lessonCount, setLessonCount] = useState(4);
  const [isAddingLessons, setIsAddingLessons] = useState(false);
  
  // Sorting State
  const [sortType, setSortType] = useState<'registration_desc' | 'activity_desc'>('registration_desc');

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

        const hasActivePackage = parentChildren.some(c => c.assignedPackage && c.remainingLessons > 0) || (parent.enrolledPackages?.length > 0);
        if (hasActivePackage) tags.add('active');

        const packageFinished = parentChildren.some(c => c.finishedPackage && !c.assignedPackage);
        if (packageFinished) tags.add('package finished');

        if (!hasActivePackage && parent.createdAt) {
            const regDate = parent.createdAt.toDate();
            if (differenceInDays(new Date(), regDate) > 30) {
                tags.add('churn');
            }
        }

        const allPackageCodes = [
            ...(parent.enrolledPackages || []),
            ...parentChildren.map(c => c.assignedPackage),
            ...parentChildren.map(c => c.finishedPackage)
        ].filter(Boolean);

        allPackageCodes.forEach(code => {
            if (code.includes('B')) tags.add('bk');
            if (code.includes('K')) tags.add('kk');
            if (code.includes('A')) tags.add('ak');
            if (code.includes('G')) tags.add('gk');
            if (code.includes('GCSE')) tags.add('gcse');
        });

        const manualTags = parent.tags || [];
        manualTags.forEach((t: string) => tags.add(t));
        if (parent.isLegacy) tags.add('eski uye');

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
            countryName: getCountryFromPhone(parent.phoneNumber),
            computedTags: Array.from(tags),
            manualTags: manualTags,
            lastPurchaseDate,
            lastActivityDate,
            lastActivityType
        } as ParentData;
    });
  }, [parents, allChildren, allSlots, loadingExtras]);

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
        } else if (sortType === 'activity_desc') {
            const timeA = a.lastActivityDate?.getTime() || 0;
            const timeB = b.lastActivityDate?.getTime() || 0;
            return timeB - timeA;
        }
        return 0;
    });
    
    return result;
  }, [processedParents, searchQuery, selectedTags, regStartDate, regEndDate, purchaseStartDate, purchaseEndDate]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedUserIds(filteredParents.map(p => p.id));
    else setSelectedUserIds([]);
  };

  const handleBulkUpdateTags = async () => {
    // ...existing handleBulkUpdateTags...
  };

  const handleAddLessons = async () => {
    if (!selectedParentForLessons || !db || !lessonCount) return;
    setIsAddingLessons(true);
    try {
        const parentRef = doc(db, 'users', selectedParentForLessons.id);
        const batch = writeBatch(db);
        
        // Map course to prefix
        const prefixes: { [key: string]: string } = {
            'baslangic': 'B',
            'konusma': 'K',
            'akademik': 'A',
            'gelisim': 'G',
            'gcse': 'GCSE'
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

        batch.update(parentRef, {
            remainingLessons: (selectedParentForLessons.remainingLessons || 0) + lessonCount,
            enrolledPackages: [...(selectedParentForLessons.enrolledPackages || []), packageCode]
        });

        const txRef = doc(collection(db, 'transactions'));
        batch.set(txRef, {
            userId: selectedParentForLessons.id,
            status: 'completed',
            amountGbp: 0,
            description: '🎁 Manuel Tanımlanan Dersler / Hediye',
            items: [{
                name: courseName,
                quantity: 1,
                price: 0
            }],
            newPackages: [packageCode],
            totalLessonsToAdd: lessonCount,
            createdAt: new Date(),
        });

        const activityRef = doc(collection(db, 'activity-log'));
        batch.set(activityRef, {
            event: '🎁 Manuel Ders Ekleme',
            icon: '🎁',
            details: {
                'Veli': `${selectedParentForLessons.firstName} ${selectedParentForLessons.lastName}`,
                'Kurs': courseName,
                'Ders Sayısı': lessonCount.toString(),
                'Neden': 'Admin Manuel Tanımlama'
            },
            createdAt: new Date(),
        });

        await batch.commit();
        toast({ title: 'Dersler Başarıyla Eklendi', className: 'bg-green-500 text-white' });
        setIsAddLessonsOpen(false);
        refetchParents();
    } catch (e) {
        console.error("Error adding manual lessons:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'Dersler tanımlanamadı.' });
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
    if (!tag || bulkTagsToAdd.includes(tag)) return;
    setBulkTagsToAdd(prev => [...prev, tag]);
    setNewBulkTagInput('');
  };

  const removeBulkTag = (tag: string) => {
    setBulkTagsToAdd(prev => prev.filter(t => t !== tag));
  };

  // Deep Link Handling: Auto-open detail if userId is provided
  useEffect(() => {
    if (userIdParam && processedParents.length > 0 && !isDetailOpen) {
        const parent = processedParents.find(p => p.id === userIdParam);
        if (parent) {
            setSelectedParent(parent);
            setIsDetailOpen(true);
        }
    }
  }, [userIdParam, processedParents, isDetailOpen]);

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

  const addTag = (tag: string) => {
    if (!tag || selectedParent?.manualTags.includes(tag)) return;
    setSelectedParent(prev => prev ? { ...prev, manualTags: [...prev.manualTags, tag] } : null);
    setNewTagInput('');
  };

  const removeTag = (tag: string) => {
    setSelectedParent(prev => prev ? { ...prev, manualTags: prev.manualTags.filter(t => t !== tag) } : null);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Veli Yönetimi</h1>
            <p className="text-muted-foreground mt-1">Kayıtlı veliler, satın alma geçmişleri ve otomatik etiketler.</p>
        </div>
        {selectedUserIds.length > 0 && (
            <Button onClick={() => setIsBulkTagOpen(true)} className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-sm px-6">
                <Tags className="w-4 h-4 mr-2" /> Toplu Etiket ({selectedUserIds.length})
            </Button>
        )}
      </div>

      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                  placeholder="İsim, Şifre veya E-posta Ara..." 
                  className="pl-10 h-11 rounded-xl border-slate-200 shadow-none font-medium bg-slate-50/50 focus:bg-white transition-colors" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50/50 px-3 h-11 rounded-xl border border-slate-200">
            <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
            <select 
                className="text-xs font-bold bg-transparent border-none focus:ring-0 text-slate-600 outline-none cursor-pointer pr-8"
                value={sortType}
                onChange={(e) => setSortType(e.target.value as any)}
            >
                <option value="registration_desc">Kayıt: En Yeni</option>
                <option value="activity_desc">Etkinlik: En Yeni</option>
            </select>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold gap-2 px-4 shrink-0">
                <TagIcon className="w-4 h-4" />
                Etiket Filtre ({selectedTags.length})
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

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold gap-2 px-4 shrink-0">
                <Filter className="w-4 h-4" />
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

      <Card className="border-none shadow-xl overflow-hidden rounded-[24px]">
        <CardHeader className="bg-white border-b pb-6">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <User className="w-5 h-5 text-primary" /> Veliler ({filteredParents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {parentsLoading || loadingExtras ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Veriler Analiz Ediliyor...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[40px] pl-6">
                      <Checkbox 
                          checked={selectedUserIds.length > 0 && selectedUserIds.length === filteredParents.length}
                          onCheckedChange={handleSelectAll}
                      />
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 py-5">Veli Bilgisi</TableHead>
                  <TableHead className="font-bold text-slate-500">Ülke</TableHead>
                  <TableHead className="font-bold text-slate-500">Kayıt Tarihi</TableHead>
                  <TableHead className="font-bold text-slate-500">Son Etkinlik</TableHead>
                  <TableHead className="font-bold text-slate-500">Etiketler</TableHead>
                  <TableHead className="w-[80px] text-right pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent) => (
                  <TableRow key={parent.id} className={cn("hover:bg-slate-50/30 transition-colors border-slate-100", selectedUserIds.includes(parent.id) && "bg-slate-50")}>
                    <TableCell className="pl-6">
                        <Checkbox 
                            checked={selectedUserIds.includes(parent.id)}
                            onCheckedChange={(checked) => {
                                if (checked) setSelectedUserIds(prev => [...prev, parent.id]);
                                else setSelectedUserIds(prev => prev.filter(id => id !== parent.id));
                            }}
                        />
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                            {parent.firstName?.[0]}{parent.lastName?.[0]}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-700 truncate">{parent.firstName} {parent.lastName}</span>
                            <span className="text-[10px] text-slate-400 font-medium lowercase truncate">{parent.email}</span>
                            <div className="flex items-center gap-1 group/id">
                                <span className="text-[9px] font-mono text-slate-300 select-all uppercase">ID: {parent.shortId || parent.id.substring(0, 8).toUpperCase()}</span>
                                <button 
                                    onClick={(e) => { 
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(parent.id); 
                                        toast({ title: 'Kopyalandı', description: 'Veli ID kopyalandı.' }); 
                                    }}
                                    className="opacity-0 group-hover/id:opacity-100 transition-opacity text-slate-300 hover:text-primary"
                                    title="ID Kopyala"
                                >
                                    <Copy className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-sm">
                            <MapPin className="w-3.5 h-3.5 text-slate-300" />
                            {parent.countryName}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                            {parent.createdAt ? format(parent.createdAt.toDate(), 'dd MMM yyyy', { locale: tr }) : '-'}
                        </div>
                    </TableCell>
                    <TableCell>
                        {parent.lastActivityDate ? (
                            <div className={cn(
                                "flex items-center gap-1.5 font-bold text-sm",
                                parent.lastActivityType === 'purchase' ? 'text-emerald-600' : 
                                parent.lastActivityType === 'lesson' ? 'text-blue-600' : 
                                parent.lastActivityType === 'login' ? 'text-purple-600' : 'text-slate-500'
                            )}>
                                {parent.lastActivityType === 'purchase' ? <ShoppingBag className="w-3.5 h-3.5" /> : 
                                 parent.lastActivityType === 'lesson' ? <Calendar className="w-3.5 h-3.5" /> : 
                                 parent.lastActivityType === 'login' ? <Activity className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                {format(parent.lastActivityDate, 'dd MMM yyyy', { locale: tr })}
                            </div>
                        ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">-</span>
                        )}
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                            {parent.computedTags.map((tag) => (
                                <Badge key={tag} variant="secondary" className={cn("text-[9px] px-2 py-0.5 border-none font-bold uppercase tracking-tighter", tagStyles[tag] || 'bg-slate-100 text-slate-500')}>
                                    {tag}
                                </Badge>
                            ))}
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
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer" onClick={() => { setSelectedParent(parent); setIsDetailOpen(true); }}>
                                    Profil Detayı
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer" onClick={() => { setSelectedParent(parent); setIsTagsOpen(true); }}>
                                    Etiketleri Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-blue-600 focus:text-blue-600" onClick={() => { setSelectedParentForLessons(parent); setIsAddLessonsOpen(true); setSelectedCourseId('konusma'); setLessonCount(4); }}>
                                    Ders Ekle
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className={cn(
                                        "rounded-lg font-bold text-xs py-2.5 cursor-pointer",
                                        parent.isLegacy ? "text-slate-600" : "text-orange-600 focus:text-orange-600"
                                    )} 
                                    onClick={() => handleToggleLegacy(parent)}
                                >
                                    {parent.isLegacy ? 'Eski Üye Durumunu Kaldır' : 'Eski Üye Olarak İşaretle'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="rounded-lg font-bold text-xs py-2.5 text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                                    onClick={() => handleDeleteParent(parent)}
                                >
                                    Veliyi Sil
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                    <div className="p-8 bg-slate-900 text-white shrink-0">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[24px] bg-primary flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20">
                                    {selectedParent.firstName?.[0]}{selectedParent.lastName?.[0]}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black tracking-tight">{selectedParent.firstName} {selectedParent.lastName}</h2>
                                    <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedParent.email}</span>
                                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selectedParent.phoneNumber}</span>
                                        <span className="text-[10px] font-mono opacity-50 bg-white/10 px-2 py-0.5 rounded ml-2 select-all uppercase">ID: {selectedParent.shortId || selectedParent.id.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                            <Badge className="bg-emerald-500 text-white border-none font-bold px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                                {selectedParent.countryName}
                            </Badge>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                        <div className="bg-slate-900/95 px-8">
                            <TabsList className="bg-transparent gap-8 h-12 p-0">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-12 border-none font-bold text-slate-400 px-6">Özet</TabsTrigger>
                                <TabsTrigger value="children" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-12 border-none font-bold text-slate-400 px-6">Çocuklar</TabsTrigger>
                                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-12 border-none font-bold text-slate-400 px-6">Ders Geçmişi</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-white">
                            <TabsContent value="overview" className="mt-0 space-y-8">
                                <div className="grid grid-cols-3 gap-6">
                                    <Card className="bg-slate-50 border-none p-6 space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kayıt Tarihi</p>
                                        <p className="text-xl font-bold text-slate-800">{selectedParent.createdAt ? format(selectedParent.createdAt.toDate(), 'dd MMMM yyyy', { locale: tr }) : '-'}</p>
                                    </Card>
                                    <Card className="bg-slate-50 border-none p-6 space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kalan Toplam Ders</p>
                                        <p className="text-xl font-bold text-slate-800">
                                            {(allChildren.filter(c => c.parentId === selectedParent.id).reduce((acc, c) => acc + (c.remainingLessons || 0), 0)) + (selectedParent.remainingLessons || 0)}
                                        </p>
                                    </Card>
                                    <Card className="bg-slate-50 border-none p-6 space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Havuzdaki Paketler</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedParent.enrolledPackages?.length > 0 ? selectedParent.enrolledPackages.map((p: string, i: number) => (
                                                <Badge key={i} variant="secondary" className="bg-white border-slate-200 text-slate-600 font-bold text-[10px] uppercase">{p}</Badge>
                                            )) : <span className="text-sm font-medium text-slate-400">Yok</span>}
                                        </div>
                                    </Card>
                                    <Card className="bg-slate-50 border-none p-6 space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Son Etkinlik</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {selectedParent.lastActivityDate ? (
                                                <>
                                                    {selectedParent.lastActivityType === 'purchase' ? <ShoppingBag className="w-4 h-4 text-emerald-500" /> : 
                                                     selectedParent.lastActivityType === 'lesson' ? <Calendar className="w-4 h-4 text-blue-500" /> : <User className="w-4 h-4 text-slate-400" />}
                                                    <p className="text-xl font-bold text-slate-800">
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
                                        {selectedParent.computedTags.map(tag => (
                                            <Badge key={tag} className={cn("px-3 py-1 border-none font-bold uppercase tracking-tighter text-[10px]", tagStyles[tag] || 'bg-slate-100 text-slate-500')}>
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="children" className="mt-0 space-y-6">
                                {allChildren.filter(c => c.parentId === selectedParent.id).length > 0 ? (
                                    <div className="grid gap-4">
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
                                    {allSlots.filter(s => s.bookedBy === selectedParent.id).length > 0 ? (
                                        <div className="divide-y border rounded-2xl overflow-hidden">
                                            {allSlots.filter(s => s.bookedBy === selectedParent.id).sort((a,b) => b.startTime.seconds - a.startTime.seconds).map((slot, i) => (
                                                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", slot.packageCode === 'FREE_TRIAL' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600')}>
                                                            <History className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-slate-800">{slot.packageCode === 'FREE_TRIAL' ? 'Deneme Dersi' : `Paket Dersi (${slot.packageCode})`}</p>
                                                            <p className="text-xs text-slate-500 font-medium">{format(slot.startTime.toDate(), 'dd MMM yyyy, HH:mm', { locale: tr })}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-slate-200">Tamamlandı</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center space-y-4">
                                            <History className="w-12 h-12 mx-auto text-slate-200" />
                                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Ders kaydı bulunamadı</p>
                                        </div>
                                    )}
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
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mevcut Manuel Etiketler</Label>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        {selectedParent?.manualTags.length === 0 && (
                            <span className="text-xs text-slate-400 italic">Henüz etiket eklenmemiş.</span>
                        )}
                        {selectedParent?.manualTags.map(tag => (
                            <Badge key={tag} className="bg-primary text-white font-bold gap-1 pl-3 pr-1 py-1 rounded-full group">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="p-0.5 hover:bg-white/20 rounded-full transition-colors">
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

      {/* BULK TAGS DIALOG */}
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
      <Dialog open={isAddLessonsOpen} onOpenChange={setIsAddLessonsOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="p-8 bg-blue-600 text-white">
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                    <Package className="w-6 h-6" /> Manuel Ders Ekle
                </DialogTitle>
                <DialogDescription className="text-blue-100 font-medium">
                    {selectedParentForLessons?.firstName} isimli velinin hesabına manuel ders tanımlayın.
                </DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6 bg-white">
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
            </div>
        </DialogContent>
      </Dialog>

      {/* CHILD PROGRESS DIALOG */}
      <Dialog open={isChildProgressOpen} onOpenChange={setIsChildProgressOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="p-6 border-b bg-slate-900 text-white">
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                    <Baby className="w-6 h-6 text-primary" />
                    {selectedChildForProgress?.firstName} - İlerleme Detayları
                </DialogTitle>
                <DialogDescription className="text-slate-400 font-medium">
                    Çocuğun tüm akademik gelişimi, CEFR seviyesi ve öğretmen değerlendirmeleri.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
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

export const dynamic = 'force-dynamic';

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" /></div>}>
      <UsersPageContent />
    </Suspense>
  );
}
