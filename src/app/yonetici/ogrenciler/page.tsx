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
import { Loader2, Baby, User, Calendar, BookOpen, GraduationCap, MapPin, Search, Filter, X, ChevronDown, ShoppingBag, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StudentWithParent {
    id: string;
    parentId: string; // Added to enable deletion
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

  useEffect(() => {
    const fetchStudents = async () => {
      if (!db) return;
      setIsLoading(true);
      try {
        // Tüm çocukları ana koleksiyon bağımsız olarak çek (Collection Group)
        const childrenQuery = query(collectionGroup(db, 'children'));
        const querySnapshot = await getDocs(childrenQuery);
        
        const studentData = await Promise.all(querySnapshot.docs.map(async (childDoc) => {
            const data = childDoc.data();
            // Parent ID'yi doküman yolundan çek (users/userId/children/childId)
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
                parentId: userId || '', // Store parentId for deletion
                ...data,
                parentName: parentInfo.name,
                parentEmail: parentInfo.email
            };
        }));

        // Alfabetik sırala
        setStudents(studentData.sort((a, b) => ((a as any).firstName || "").localeCompare((b as any).firstName || "")));
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [db]);

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
        
        // UI'dan da kaldır
        setStudents(prev => prev.filter(s => s.id !== student.id));
        
        toast({ title: 'Silindi', description: 'Öğrenci başarıyla silindi.' });
    } catch (error) {
        console.error("Delete error:", error);
        toast({ variant: 'destructive', title: 'Hata', description: 'Öğrenci silinemedi.' });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Öğrenci Yönetimi</h1>
            <p className="text-muted-foreground mt-1">Platformdaki tüm kayıtlı çocukların gelişim ve paket durumları.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                  placeholder="Öğrenci veya Veli Ara..." 
                  className="pl-10 h-11 rounded-xl border-slate-200 shadow-none font-medium bg-slate-50/50 focus:bg-white transition-colors" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>

          <div className="flex flex-wrap gap-3">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[140px] h-11 rounded-xl border-slate-200 font-bold bg-white">
                      <SelectValue placeholder="Seviye" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all" className="font-bold">Tüm Seviyeler</SelectItem>
                      {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => (
                          <SelectItem key={level} value={level.toLowerCase()} className="font-bold uppercase">{level}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>

              <Select value={packageFilter} onValueChange={setPackageFilter}>
                  <SelectTrigger className="w-[160px] h-11 rounded-xl border-slate-200 font-bold bg-white">
                      <SelectValue placeholder="Paket Durumu" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all" className="font-bold">Tüm Paketler</SelectItem>
                      <SelectItem value="active" className="font-bold">Aktif Paketli</SelectItem>
                      <SelectItem value="none" className="font-bold">Paketsiz / Biten</SelectItem>
                  </SelectContent>
              </Select>

              <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold gap-2 px-4">
                          <Filter className="w-4 h-4" />
                          Yaş: {minAge || 'Min'} - {maxAge || 'Max'}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-6 rounded-[24px] shadow-2xl border-none space-y-4">
                      <div className="space-y-4">
                          <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">Yaş Aralığı</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                  <Label className="text-[9px] text-slate-400 uppercase font-black">En Az</Label>
                                  <Input type="number" placeholder="Min" value={minAge} onChange={e => setMinAge(e.target.value)} className="h-9 text-xs rounded-lg" />
                              </div>
                              <div className="space-y-1">
                                  <Label className="text-[9px] text-slate-400 uppercase font-black">En Çok</Label>
                                  <Input type="number" placeholder="Max" value={maxAge} onChange={e => setMaxAge(e.target.value)} className="h-9 text-xs rounded-lg" />
                              </div>
                          </div>
                      </div>
                      <Button 
                          variant="secondary" 
                          className="w-full rounded-xl h-10 font-bold text-xs" 
                          onClick={() => { setMinAge(''); setMaxAge(''); }}
                      > Sıfırla </Button>
                  </PopoverContent>
              </Popover>

              {(searchQuery || levelFilter !== 'all' || packageFilter !== 'all' || minAge || maxAge) && (
                  <Button variant="ghost" className="h-11 rounded-xl font-bold text-red-500 gap-2 hover:bg-red-50" onClick={() => {
                      setSearchQuery(''); setLevelFilter('all'); setPackageFilter('all'); setMinAge(''); setMaxAge('');
                  }}>
                      <X className="w-4 h-4" /> Tümünü Temizle
                  </Button>
              )}
          </div>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[24px]">
        <CardHeader className="bg-white border-b">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <Baby className="w-5 h-5 text-primary" /> Kayıtlı Öğrenciler ({students.length})
          </CardTitle>
          <CardDescription>
            Velilerin oluşturduğu tüm çocuk profilleri ve akademik seviyeleri.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-bold text-slate-500 py-5 pl-8">Öğrenci</TableHead>
                  <TableHead className="font-bold text-slate-500">Yaş / Ülke</TableHead>
                  <TableHead className="font-bold text-slate-500">Veli Bilgisi</TableHead>
                  <TableHead className="font-bold text-slate-500">Paket Durumu</TableHead>
                  <TableHead className="font-bold text-slate-500">Akademik Seviye</TableHead>
                  <TableHead className="font-bold text-slate-500">Rozet</TableHead>
                  <TableHead className="font-bold text-slate-500 text-right pr-8">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50/30 transition-colors border-slate-100">
                      <TableCell className="py-5 pl-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                                {student.firstName?.substring(0,2).toUpperCase() || '??'}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-slate-700 truncate">{student.firstName || 'İsimsiz'}</span>
                                <div className="flex items-center gap-1 group/id">
                                    <span className="text-[9px] font-mono text-slate-300 select-all uppercase">ID: {student.id.substring(0, 8).toUpperCase()}</span>
                                    <button 
                                        onClick={() => { 
                                            navigator.clipboard.writeText(student.id); 
                                            toast({ title: 'Kopyalandı', description: 'Öğrenci ID kopyalandı.' }); 
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
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-600">{getAge(student.dateOfBirth ?? '') || '-'} Yaş</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                <MapPin className="w-2.5 h-3 text-slate-300" />
                                {student.countryOfResidence?.split(',')[0] || 'Belirtilmedi'}
                            </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-600 flex items-center gap-1 truncate">
                                <User className="w-3 h-3 text-slate-400" /> {student.parentName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium lowercase truncate">{student.parentEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.assignedPackage ? (
                            <div className="flex flex-col gap-1">
                                <Badge variant="secondary" className="w-fit text-[10px] bg-blue-50 text-blue-700 border-blue-100 font-bold uppercase tracking-tighter">
                                    {student.assignedPackageName || student.assignedPackage}
                                </Badge>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {student.remainingLessons} DERS KALDI
                                </span>
                            </div>
                        ) : (
                            <Badge variant="outline" className="text-[9px] text-slate-300 border-slate-200 font-bold uppercase tracking-tighter">Paket Atanmamış</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" /> CEFR
                            </span>
                            <div className="flex gap-1">
                                {student.cefrProfile?.speaking ? (
                                    <Badge className="text-[9px] h-4 px-1.5 bg-emerald-500 text-white border-none font-black">
                                        {student.cefrProfile.speaking.toUpperCase()}
                                    </Badge>
                                ) : <span className="text-[10px] text-slate-300 font-medium italic">Değerlendirilmedi</span>}
                            </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px] uppercase tracking-widest">
                            {(student.badges || []).length} ROZET
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteStudent(student)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic text-sm">
                      Arama kriterlerinize uygun öğrenci bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
