'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
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
import { Loader2, Baby, User, Calendar, BookOpen, GraduationCap, MapPin, Search, Filter, X, ChevronDown, ShoppingBag, Copy, Plus, Package, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StudentWithParent {
    id: string;
    parentId: string;
    parentName: string;
    parentEmail: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    countryOfResidence?: string;
    assignedPackage?: string;
    assignedPackageName?: string;
    remainingLessons?: number;
    cefrProfile?: {
        speaking?: string;
    };
    badges?: any[];
    [key: string]: any;
}

export default function AdminStudentsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentWithParent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');

  // Add Package States
  const [selectedStudentForPackage, setSelectedStudentForPackage] = useState<StudentWithParent | null>(null);
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [parentPackages, setParentPackages] = useState<string[]>([]);
  const [parentRemainingLessons, setParentRemainingLessons] = useState(0);
  const [selectedPackageFromPool, setSelectedPackageFromPool] = useState('');
  const [amountToAssign, setAmountToAssign] = useState(0);
  const [isAddingPackage, setIsAddingPackage] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!db) return;
      setIsLoading(true);
      try {
        const childrenQuery = query(collectionGroup(db, 'children'));
        const querySnapshot = await getDocs(childrenQuery);
        
        const studentData = await Promise.all(querySnapshot.docs.map(async (childDoc) => {
            const data = childDoc.data();
            const userId = childDoc.ref.parent.parent?.id;
            
            let parentInfo = { name: 'Bilinmiyor', email: '-' };
            if (userId) {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    parentInfo = {
                        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
                        email: userData.email
                    };
                }
            }

            return {
                id: childDoc.id,
                parentId: userId || '',
                ...data,
                parentName: parentInfo.name,
                parentEmail: parentInfo.email
            };
        }));

        setStudents(studentData.sort((a, b) => ((a as any).firstName || "").localeCompare((b as any).firstName || "")));
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [db]);

  // Fetch Parent Pool when dialog opens
  useEffect(() => {
    const fetchParentPool = async () => {
        if (!selectedStudentForPackage || !db || !isAddPackageOpen) return;
        try {
            const parentRef = doc(db, 'users', selectedStudentForPackage.parentId);
            const parentSnap = await getDoc(parentRef);
            if (parentSnap.exists()) {
                const data = parentSnap.data();
                const packages = data.enrolledPackages || [];
                setParentPackages(packages);
                setParentRemainingLessons(data.remainingLessons || 0);
                
                if (packages.length > 0) {
                    const firstPkg = packages[0];
                    setSelectedPackageFromPool(firstPkg);
                    setAmountToAssign(parseInt(firstPkg.replace(/\D/g, ''), 10) || 0);
                }
            }
        } catch (e) {
            console.error("Error fetching parent pool:", e);
        }
    };
    fetchParentPool();
  }, [selectedStudentForPackage, isAddPackageOpen, db]);

  const getAge = (dob: string) => {
    if (!dob) return 0;
    try {
        return differenceInYears(new Date(), parseISO(dob));
    } catch {
        return 0;
    }
  };

  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(s => 
            s.firstName?.toLowerCase().includes(q) || 
            s.parentName?.toLowerCase().includes(q) || 
            s.parentEmail?.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q)
        );
    }

    if (levelFilter !== 'all') {
        result = result.filter(s => s.cefrProfile?.speaking?.toLowerCase() === levelFilter.toLowerCase());
    }

    if (packageFilter !== 'all') {
        if (packageFilter === 'active') {
            result = result.filter(s => s.assignedPackage && (s.remainingLessons ?? 0) > 0);
        } else if (packageFilter === 'none') {
            result = result.filter(s => !s.assignedPackage || (s.remainingLessons ?? 0) <= 0);
        } else if (packageFilter === 'expiring') {
            result = result.filter(s => s.assignedPackage && (s.remainingLessons ?? 0) > 0 && (s.remainingLessons ?? 0) <= 3);
        }
    }

    if (minAge) {
        result = result.filter(s => getAge(s.dateOfBirth ?? '') >= parseInt(minAge));
    }
    if (maxAge) {
        result = result.filter(s => getAge(s.dateOfBirth ?? '') <= parseInt(maxAge));
    }

    return result;
  }, [students, searchQuery, levelFilter, packageFilter, minAge, maxAge]);

  const handleAddPackageToChild = async () => {
    if (!selectedStudentForPackage || !db || !selectedPackageFromPool || amountToAssign <= 0) {
        toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen geçerli bir paket ve ders sayısı seçin.' });
        return;
    }
    
    setIsAddingPackage(true);
    try {
        const { writeBatch, collection } = await import('firebase/firestore');
        const batch = writeBatch(db);
        
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
        const assignedPackageCode = `${prefix}${amountToAssign}`;

        const childRef = doc(db, 'users', selectedStudentForPackage.parentId, 'children', selectedStudentForPackage.id);
        batch.update(childRef, {
            remainingLessons: (selectedStudentForPackage.remainingLessons || 0) + amountToAssign,
            assignedPackage: assignedPackageCode,
            assignedPackageName: courseName,
            updatedAt: new Date()
        });

        const parentRef = doc(db, 'users', selectedStudentForPackage.parentId);
        const updatedPackages = [...parentPackages];
        const packageIndex = updatedPackages.indexOf(selectedPackageFromPool);
        
        if (packageIndex !== -1) {
            updatedPackages.splice(packageIndex, 1);
            const remainder = lessonsInPackage - amountToAssign;
            if (remainder > 0) {
                updatedPackages.push(`${prefix}${remainder}`);
            }
        }

        batch.update(parentRef, {
            enrolledPackages: updatedPackages,
            remainingLessons: (parentRemainingLessons - amountToAssign)
        });

        const txRef = doc(collection(db, 'transactions'));
        batch.set(txRef, {
            userId: selectedStudentForPackage.parentId,
            userName: selectedStudentForPackage.parentName,
            userEmail: selectedStudentForPackage.parentEmail,
            childId: selectedStudentForPackage.id,
            childName: selectedStudentForPackage.firstName,
            status: 'completed',
            amountGbp: 0,
            description: `🔄 Manuel Paket Tanımlama (Yönetici) [Öğrenci: ${selectedStudentForPackage.firstName}]`,
            items: [{
                name: courseName,
                quantity: 1,
                price: 0
            }],
            sourcePackage: selectedPackageFromPool,
            assignedLessons: amountToAssign,
            createdAt: new Date(),
        });

        const activityRef = doc(collection(db, 'activity-log'));
        batch.set(activityRef, {
            event: '🔄 Havuzdan Paket Atama',
            icon: '👶',
            details: {
                'Öğrenci': selectedStudentForPackage.firstName,
                'Veli': selectedStudentForPackage.parentName,
                'Transfer Edilen': `${amountToAssign} Ders`,
                'Kaynak Paket': selectedPackageFromPool
            },
            createdAt: new Date(),
        });

        await batch.commit();
        toast({ title: 'Paket Başarıyla Aktarıldı', className: 'bg-green-500 text-white' });
        setIsAddPackageOpen(false);
        
        setStudents(prev => prev.map(s => 
            s.id === selectedStudentForPackage.id 
                ? { ...s, remainingLessons: (s.remainingLessons || 0) + amountToAssign, assignedPackage: assignedPackageCode, assignedPackageName: courseName } 
                : s
        ));

    } catch (e) {
        console.error("Error transferring package to child:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız oldu.' });
    } finally {
        setIsAddingPackage(false);
    }
  };

  const handleDeleteStudent = async (student: StudentWithParent) => {
    if (!db || !student.parentId || !student.id) {
        toast({ variant: 'destructive', title: 'Hata', description: 'Öğrenci veya veli bilgisi eksik.' });
        return;
    }

    if (!confirm(`${student.firstName} isimli öğrenciyi ve tüm verilerini kalıcı olarak silmek istediğinize emin misiniz?`)) return;

    try {
        const studentRef = doc(db, 'users', student.parentId, 'children', student.id);
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(studentRef);
        setStudents(prev => prev.filter(s => s.id !== student.id));
        toast({ title: 'Silindi', description: 'Öğrenci başarıyla silindi.' });
    } catch (error) {
        console.error("Delete error:", error);
        toast({ variant: 'destructive', title: 'Hata', description: 'Öğrenci silinemedi.' });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 p-2 sm:p-8 pt-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">Öğrenci Yönetimi</h1>
            <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-1">Tüm kayıtlı öğrencileri ve paket durumlarını yönetin.</p>
        </div>
      </div>

      {/* FILTER BAR - Responsive */}
      <div className="bg-white/70 backdrop-blur-md p-3 sm:p-5 rounded-[20px] sm:rounded-[32px] shadow-xl shadow-slate-200/50 border border-white space-y-3 sm:space-y-5">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                  placeholder="Öğrenci, Veli veya ID Ara..." 
                  className="pl-11 h-11 sm:h-12 rounded-xl sm:rounded-2xl border-slate-200/60 shadow-inner bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-medium text-[13px] sm:text-sm" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>

          <div className="grid grid-cols-2 xs:flex flex-wrap items-center gap-2 sm:gap-3">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="flex-1 xs:w-[130px] h-11 sm:h-12 rounded-xl sm:rounded-2xl border-slate-200/60 font-bold bg-white text-[11px] sm:text-xs">
                      <SelectValue placeholder="Seviye" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="all" className="font-bold text-xs">Tüm Seviyeler</SelectItem>
                      {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => (
                          <SelectItem key={level} value={level.toLowerCase()} className="font-bold uppercase text-xs">{level}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>

              <Select value={packageFilter} onValueChange={setPackageFilter}>
                  <SelectTrigger className="flex-1 xs:w-[150px] h-11 sm:h-12 rounded-xl sm:rounded-2xl border-slate-200/60 font-bold bg-white text-[11px] sm:text-xs">
                      <SelectValue placeholder="Paket Durumu" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="all" className="font-bold text-xs">Hepsi</SelectItem>
                      <SelectItem value="active" className="font-bold text-xs text-blue-600">Aktifler</SelectItem>
                      <SelectItem value="expiring" className="font-bold text-xs text-amber-600">Bitenler (≤3)</SelectItem>
                      <SelectItem value="none" className="font-bold text-xs text-red-600">Bakiyesi 0</SelectItem>
                  </SelectContent>
              </Select>

              <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 xs:w-auto h-11 sm:h-12 rounded-xl sm:rounded-2xl border-slate-200/60 font-bold gap-2 px-3 sm:px-4 text-[11px] sm:text-xs bg-white">
                          <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                          Yaş: {minAge || 'M'} - {maxAge || 'M'}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-6 rounded-[28px] shadow-2xl border-none space-y-5 bg-white/95 backdrop-blur-sm">
                      <div className="space-y-4">
                          <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1 border-l-2 border-primary">Yaş Aralığı</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                  <Label className="text-[10px] text-slate-400 uppercase font-black px-1">En Az</Label>
                                  <Input type="number" placeholder="Min" value={minAge} onChange={e => setMinAge(e.target.value)} className="h-10 text-xs rounded-xl bg-slate-50 border-slate-100" />
                              </div>
                              <div className="space-y-1.5">
                                  <Label className="text-[10px] text-slate-400 uppercase font-black px-1">En Çok</Label>
                                  <Input type="number" placeholder="Max" value={maxAge} onChange={e => setMaxAge(e.target.value)} className="h-10 text-xs rounded-xl bg-slate-50 border-slate-100" />
                              </div>
                          </div>
                      </div>
                      <Button variant="secondary" className="w-full rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest" onClick={() => { setMinAge(''); setMaxAge(''); }}>Sıfırla</Button>
                  </PopoverContent>
              </Popover>

              {(searchQuery || levelFilter !== 'all' || packageFilter !== 'all' || minAge || maxAge) && (
                  <Button variant="ghost" className="h-11 sm:h-12 rounded-xl sm:rounded-2xl font-black text-red-500 gap-2 hover:bg-red-50 hover:text-red-600 transition-all text-[11px] sm:text-xs" onClick={() => {
                      setSearchQuery(''); setLevelFilter('all'); setPackageFilter('all'); setMinAge(''); setMaxAge('');
                  }}>
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Temizle
                  </Button>
              )}
          </div>
        </div>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden rounded-[28px] sm:rounded-[40px] bg-white/80 backdrop-blur-md">
        <CardHeader className="bg-white/50 border-b border-slate-100 p-5 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2">
                <CardTitle className="text-xl sm:text-2xl font-black flex items-center gap-3 text-slate-800">
                    <Baby className="w-6 h-6 sm:w-7 sm:h-7 text-primary" /> Kayıtlı Öğrenciler 
                    <Badge variant="secondary" className="rounded-lg font-black bg-slate-100 text-slate-500 text-[10px] sm:text-xs">
                        {filteredStudents.length}
                    </Badge>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm font-medium">
                    Velilerin oluşturduğu tüm çocuk profilleri ve akademik seviyeleri.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 sm:h-96 gap-4">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary opacity-20" />
              <p className="text-xs sm:text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Öğrenciler yükleniyor...</p>
            </div>
          ) : (
            <div className="min-h-[400px]">
                {/* CARD VIEW - Mobile (xs, sm) */}
                <div className="md:hidden divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div key={student.id} className="p-4 sm:p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-sm sm:text-base shadow-lg shadow-primary/20">
                                            {student.firstName?.substring(0,2).toUpperCase() || '??'}
                                        </div>
                                        <div className="space-y-0.5 sm:space-y-1 min-w-0">
                                            <h3 className="font-black text-slate-900 text-base sm:text-lg truncate">{student.firstName || 'İsimsiz'}</h3>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="text-[9px] sm:text-[10px] bg-slate-100 text-slate-400 border-none font-mono">
                                                    #{student.id.substring(0, 6).toUpperCase()}
                                                </Badge>
                                                <span className="text-[10px] sm:text-xs text-slate-500 font-bold flex items-center gap-1">
                                                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {student.countryOfResidence?.split(',')[0]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-100/50">
                                                <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48">
                                            <DropdownMenuItem onClick={() => { setSelectedStudentForPackage(student); setIsAddPackageOpen(true); }} className="rounded-xl font-bold text-xs py-2.5 gap-2">
                                                <Plus className="w-4 h-4 text-blue-500" /> Paket Tanımla
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteStudent(student)} className="rounded-xl font-bold text-xs py-2.5 gap-2 text-red-500 focus:text-red-500">
                                                <X className="w-4 h-4" /> Öğrenciyi Sil
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kayıtlı Veli</p>
                                        <p className="text-[11px] sm:text-xs font-bold text-slate-700 truncate">{student.parentName}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{student.parentEmail}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Paket Durumu</p>
                                        {student.assignedPackage ? (
                                            <>
                                                <p className="text-[11px] sm:text-xs font-black text-blue-600 uppercase truncate">
                                                    {student.assignedPackageName || student.assignedPackage}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">{student.remainingLessons} DERS KALDI</p>
                                            </>
                                        ) : (
                                            <p className="text-[11px] sm:text-xs font-bold text-slate-400 italic">Paket Tanımlanmamış</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">CEFR:</span>
                                        {student.cefrProfile?.speaking ? (
                                            <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] h-5 px-2">
                                                {student.cefrProfile.speaking.toUpperCase()}
                                            </Badge>
                                        ) : <span className="text-[10px] text-slate-300 italic">Girilmemiş</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 font-black text-[9px] sm:text-[10px] px-2 py-0.5">
                                            {(student.badges || []).length} ROZET
                                        </Badge>
                                        <span className="text-[10px] sm:text-xs font-black text-slate-700">{getAge(student.dateOfBirth ?? '')} YASINDA</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center text-slate-400 italic font-bold text-xs uppercase tracking-widest">Öğrenci bulunamadı.</div>
                    )}
                </div>

                {/* TABLE VIEW - Desktop (md, lg, xl) */}
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/30">
                            <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="font-black text-slate-500 py-6 pl-10 text-[11px] uppercase tracking-widest">Öğrenci</TableHead>
                            <TableHead className="font-black text-slate-500 text-[11px] uppercase tracking-widest">Yaş / Ülke</TableHead>
                            <TableHead className="font-black text-slate-500 text-[11px] uppercase tracking-widest items-center gap-1.5 flex py-6">Veli Bilgisi</TableHead>
                            <TableHead className="font-black text-slate-500 text-[11px] uppercase tracking-widest">Paket Durumu</TableHead>
                            <TableHead className="font-black text-slate-500 text-[11px] uppercase tracking-widest">Seviye</TableHead>
                            <TableHead className="font-black text-slate-500 text-[11px] uppercase tracking-widest">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                                <TableCell className="py-6 pl-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary font-black text-sm shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                            {student.firstName?.substring(0,2).toUpperCase() || '??'}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-black text-slate-800 tracking-tight text-sm truncate">{student.firstName || 'İsimsiz'}</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-tighter">ID: {student.id.substring(0, 8).toUpperCase()}</span>
                                                <button 
                                                    onClick={() => { 
                                                        navigator.clipboard.writeText(student.id); 
                                                        toast({ title: 'Kopyalandı', description: 'Öğrenci ID kopyalandı.' }); 
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-primary"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-black text-slate-700">{getAge(student.dateOfBirth ?? '') || '-'} Yaşında</span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold uppercase tracking-wider">
                                            <MapPin className="w-2.5 h-3 text-slate-300" />
                                            {student.countryOfResidence?.split(',')[0]}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col min-w-0 pr-4">
                                        <span className="text-[13px] font-bold text-slate-800 truncate">{student.parentName}</span>
                                        <span className="text-[10px] text-slate-400 font-bold lowercase truncate max-w-[180px]">{student.parentEmail}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {student.assignedPackage ? (
                                        <div className="flex flex-col gap-1.5">
                                            <Badge variant="secondary" className="w-fit text-[9px] bg-blue-50 text-blue-700 border-blue-100 font-black uppercase tracking-tighter">
                                                {student.assignedPackageName || student.assignedPackage}
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                    (student.remainingLessons || 0) <= 3 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {student.remainingLessons} DERS
                                                </span>
                                                <button 
                                                    onClick={() => { setSelectedStudentForPackage(student); setIsAddPackageOpen(true); }}
                                                    className="text-[9px] font-black text-blue-600 hover:text-blue-800 underline uppercase tracking-widest"
                                                >
                                                    Yükle
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button 
                                            variant="outline" 
                                            className="h-8 text-[9px] font-black uppercase tracking-widest border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl px-4 transition-all shadow-sm"
                                            onClick={() => { setSelectedStudentForPackage(student); setIsAddPackageOpen(true); }}
                                        >
                                            <Package className="w-3.5 h-3.5 mr-2" /> Paket Ata
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1.5">
                                        {student.cefrProfile?.speaking ? (
                                            <Badge className="w-fit text-[10px] h-6 px-3 bg-slate-900 text-white border-none font-black shadow-lg shadow-slate-200">
                                                {student.cefrProfile.speaking.toUpperCase()}
                                            </Badge>
                                        ) : <span className="text-[11px] text-slate-300 font-bold italic tracking-tight">Girilmemiş</span>}
                                        <Badge variant="outline" className="w-fit bg-amber-50 text-amber-700 border-amber-200 font-black text-[9px] uppercase">
                                            {(student.badges || []).length} ROZET
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="pr-10">
                                    <div className="flex justify-end items-center gap-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 text-slate-400 transition-colors"
                                            onClick={() => { setSelectedStudentForPackage(student); setIsAddPackageOpen(true); }}
                                            title="Paket Ekle"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
                                            onClick={() => handleDeleteStudent(student)}
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-slate-400 italic font-black text-xs uppercase tracking-widest">
                                    Arama kriterlerinize uygun öğrenci bulunamadı.
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ADD PACKAGE DIALOG */}
      <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="p-8 bg-blue-600 text-white">
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                    <Package className="w-6 h-6" /> Havuzdan Paket Ata
                </DialogTitle>
                <DialogDescription className="text-blue-100 font-medium">
                    {selectedStudentForPackage?.parentName} isimli velinin havuzundaki dersleri {selectedStudentForPackage?.firstName} için tanımlayın.
                </DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6 bg-white">
                {parentPackages.length > 0 ? (
                    <>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Havuzdaki Mevcut Paketler</Label>
                            <Select value={selectedPackageFromPool} onValueChange={(val) => {
                                setSelectedPackageFromPool(val);
                                setAmountToAssign(parseInt(val.replace(/\D/g, ''), 10) || 0);
                            }}>
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold">
                                    <SelectValue placeholder="Paket Seçin" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    {parentPackages.map((pkg, idx) => {
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
                                    value={amountToAssign}
                                    onChange={(e) => setAmountToAssign(Math.min(parseInt(selectedPackageFromPool.replace(/\D/g, ''), 10), parseInt(e.target.value) || 0))}
                                />
                                <div className="flex gap-2">
                                    {[4, 8, 12, 24].map(n => {
                                        const max = parseInt(selectedPackageFromPool.replace(/\D/g, ''), 10) || 0;
                                        return (
                                            <Button 
                                                key={n} 
                                                variant={amountToAssign === n ? 'default' : 'outline'} 
                                                className="w-10 h-10 p-0 rounded-lg text-xs font-bold shrink-0"
                                                onClick={() => setAmountToAssign(Math.min(max, n))}
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
                            <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2" onClick={() => setIsAddPackageOpen(false)}>Vazgeç</Button>
                            <Button className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" onClick={handleAddPackageToChild} disabled={isAddingPackage}>
                                {isAddingPackage ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                Paketi Aktar
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="py-8 text-center space-y-4">
                        <Package className="w-12 h-12 mx-auto text-slate-200" />
                        <div className="space-y-1">
                            <p className="font-bold text-slate-800">Havuz Boş</p>
                            <p className="text-sm text-slate-500">Bu velinin henüz atanmamış dersi bulunmuyor. Önce veli profilinden ders eklemelisiniz.</p>
                        </div>
                        <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsAddPackageOpen(false)}>Tamam</Button>
                    </div>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
