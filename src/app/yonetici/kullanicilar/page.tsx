'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, collectionGroup, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    Plus, 
    X,
    CheckCircle2,
    Info,
    Mail,
    Phone
} from 'lucide-react';
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

interface ParentData extends any {
    id: string;
    computedTags: string[];
    manualTags: string[];
    lastPurchaseDate?: Date;
    countryName: string;
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
};

const SUGGESTED_TAGS = [
    'positive', 'problem', 'discountlover', 'zam öncesi'
];

export default function UsersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [allChildren, setAllChildren] = useState<any[]>([]);
  const [allSlots, setAllSlots] = useState<any[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(true);
  
  // Modal States
  const [selectedParent, setSelectedParent] = useState<ParentData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isSavingTags, setIsSavingTags] = useState(false);

  // 1. Fetch Parents
  const parentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'parent'));
  }, [db]);

  const { data: parents, isLoading: parentsLoading, refetch: refetchParents } = useCollection(parentsQuery);

  // 2. Fetch all children and slots for tag computation
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

  const getCountryFromPhone = (phone: string) => {
    const cleanPhone = (phone || "").replace(/\s/g, "");
    if (cleanPhone.startsWith("+90")) return "Türkiye";
    if (cleanPhone.startsWith("+49")) return "Almanya";
    if (cleanPhone.startsWith("+44")) return "İngiltere";
    if (cleanPhone.startsWith("+41")) return "İsviçre";
    if (cleanPhone.startsWith("+33")) return "Fransa";
    if (cleanPhone.startsWith("+31")) return "Hollanda";
    if (cleanPhone.startsWith("+32")) return "Belçika";
    if (cleanPhone.startsWith("+43")) return "Avusturya";
    if (cleanPhone.startsWith("+1")) return "ABD/Kanada";
    return "Diğer";
  };

  const processedParents = useMemo(() => {
    if (!parents || loadingExtras) return [];

    return parents.map(parent => {
        const tags = new Set<string>(['registered']);
        const parentChildren = allChildren.filter(c => c.parentId === parent.id);
        const parentSlots = allSlots.filter(s => s.bookedBy === parent.id);
        
        // Trial logic
        const hasTrial = parentSlots.some(s => s.packageCode === 'FREE_TRIAL');
        if (hasTrial) tags.add('trial');
        
        const hasFinishedTrial = parentSlots.some(s => s.packageCode === 'FREE_TRIAL' && isBefore(s.startTime.toDate(), new Date()));
        if (hasFinishedTrial) tags.add('trialdone');

        // Active/Package logic
        const hasActivePackage = parentChildren.some(c => c.assignedPackage && c.remainingLessons > 0) || (parent.enrolledPackages?.length > 0);
        if (hasActivePackage) tags.add('active');

        const packageFinished = parentChildren.some(c => c.finishedPackage && !c.assignedPackage);
        if (packageFinished) tags.add('package finished');

        // Churn logic (No active package and registration > 1 month)
        if (!hasActivePackage && parent.createdAt) {
            const regDate = parent.createdAt.toDate();
            if (differenceInDays(new Date(), regDate) > 30) {
                tags.add('churn');
            }
        }

        // Course Specific Tags
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

        // Add manual tags if they exist in DB
        const manualTags = parent.tags || [];
        manualTags.forEach((t: string) => tags.add(t));

        return {
            ...parent,
            countryName: getCountryFromPhone(parent.phoneNumber),
            computedTags: Array.from(tags),
            manualTags: manualTags,
            lastPurchaseDate: parentSlots
                .filter(s => s.packageCode !== 'FREE_TRIAL')
                .sort((a,b) => b.startTime.seconds - a.startTime.seconds)[0]?.startTime?.toDate()
        } as ParentData;
    });
  }, [parents, allChildren, allSlots, loadingExtras]);

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
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Veli Yönetimi</h1>
            <p className="text-muted-foreground mt-1">Kayıtlı veliler, satın alma geçmişleri ve otomatik etiketler.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[24px]">
        <CardHeader className="bg-white border-b pb-6">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <User className="w-5 h-5 text-primary" /> Veliler ({processedParents.length})
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
                  <TableHead className="font-bold text-slate-500 py-5 pl-8">Veli Bilgisi</TableHead>
                  <TableHead className="font-bold text-slate-500">Ülke</TableHead>
                  <TableHead className="font-bold text-slate-500">Kayıt Tarihi</TableHead>
                  <TableHead className="font-bold text-slate-500">Son Satın Alım</TableHead>
                  <TableHead className="font-bold text-slate-500">Etiketler</TableHead>
                  <TableHead className="w-[80px] text-right pr-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedParents.map((parent) => (
                  <TableRow key={parent.id} className="hover:bg-slate-50/30 transition-colors border-slate-100">
                    <TableCell className="py-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                            {parent.firstName?.[0]}{parent.lastName?.[0]}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-700 truncate">{parent.firstName} {parent.lastName}</span>
                            <span className="text-[10px] text-slate-400 font-medium lowercase truncate">{parent.email}</span>
                            <span className="text-[9px] text-slate-300 font-mono select-all">ID: {parent.shortId || parent.id.substring(0, 8).toUpperCase()}</span>
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
                        {parent.lastPurchaseDate ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                                <ShoppingBag className="w-3.5 h-3.5" />
                                {format(parent.lastPurchaseDate, 'dd MMM yyyy', { locale: tr })}
                            </div>
                        ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">HİÇ ALMADI</span>
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
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 text-red-500 focus:text-red-500 cursor-pointer">
                                    Kullanıcıyı Yasakla
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
                                        <span className="text-[10px] font-mono opacity-50 bg-white/10 px-2 py-0.5 rounded ml-2 select-all">ID: {selectedParent.shortId || selectedParent.id.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                            <Badge className="bg-emerald-500 text-white border-none font-bold px-4 py-1.5 rounded-full">
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
                                                <Badge key={i} variant="secondary" className="bg-white border-slate-200 text-slate-600 font-bold text-[10px]">{p}</Badge>
                                            )) : <span className="text-sm font-medium text-slate-400">Yok</span>}
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
                                                        <p className="text-xs text-slate-500 font-medium">{child.dateOfBirth ? `${differenceInYears(new Date(), new Date(child.dateOfBirth))} Yaş` : '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-8 items-center">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase">Kalan Ders</p>
                                                        <p className="font-bold text-slate-800">{child.remainingLessons || 0}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase">Seviye</p>
                                                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black">{child.level?.toUpperCase() || 'YOK'}</Badge>
                                                    </div>
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
                                                            {slot.packageCode === 'FREE_TRIAL' ? <Info className="w-5 h-5" /> : <Package className="w-5 h-5" />}
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
                        <Input 
                            placeholder="Örn: vip-müşteri" 
                            className="rounded-xl h-11 font-bold"
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
    </div>
  );
}
