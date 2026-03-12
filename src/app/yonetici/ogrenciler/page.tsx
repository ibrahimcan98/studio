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
import { Loader2, Baby, User, Calendar, BookOpen, GraduationCap, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';

interface StudentWithParent extends any {
    id: string;
    parentName?: string;
    parentEmail?: string;
}

export default function AdminStudentsPage() {
  const db = useFirestore();
  const [students, setStudents] = useState<StudentWithParent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
                ...data,
                parentName: parentInfo.name,
                parentEmail: parentInfo.email
            };
        }));

        // Alfabetik sırala
        setStudents(studentData.sort((a, b) => (a.firstName || "").localeCompare(b.firstName || "")));
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [db]);

  const getAge = (dob: string) => {
    if (!dob) return '-';
    try {
        return differenceInYears(new Date(), parseISO(dob));
    } catch {
        return '-';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Öğrenci Yönetimi</h1>
            <p className="text-muted-foreground mt-1">Platformdaki tüm kayıtlı çocukların gelişim ve paket durumları.</p>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
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
                <TableRow>
                  <TableHead className="font-bold text-slate-500">Öğrenci</TableHead>
                  <TableHead className="font-bold text-slate-500">Yaş / Ülke</TableHead>
                  <TableHead className="font-bold text-slate-500">Veli Bilgisi</TableHead>
                  <TableHead className="font-bold text-slate-500">Paket Durumu</TableHead>
                  <TableHead className="font-bold text-slate-500">Akademik Seviye</TableHead>
                  <TableHead className="font-bold text-slate-500 text-right">Rozet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                {student.firstName?.substring(0,2).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-700">{student.firstName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{getAge(student.dateOfBirth)} Yaş</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-2.5 h-3 text-slate-300" />
                                {student.countryOfResidence?.split(',')[0] || 'Belirtilmedi'}
                            </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-600 flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" /> {student.parentName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium lowercase">{student.parentEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.assignedPackage ? (
                            <div className="flex flex-col gap-1">
                                <Badge variant="secondary" className="w-fit text-[10px] bg-blue-50 text-blue-700 border-blue-100 font-bold">
                                    {student.assignedPackageName || student.assignedPackage}
                                </Badge>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                    {student.remainingLessons} DERS KALDI
                                </span>
                            </div>
                        ) : (
                            <Badge variant="outline" className="text-[9px] text-slate-300 border-slate-200">Paket Atanmamış</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" /> CEFR
                            </span>
                            <div className="flex gap-1">
                                {student.cefrProfile ? (
                                    <Badge className="text-[9px] h-4 px-1.5 bg-emerald-500 text-white border-none font-black">
                                        {student.cefrProfile.speaking?.toUpperCase()}
                                    </Badge>
                                ) : <span className="text-[10px] text-slate-300 font-medium italic">Değerlendirilmedi</span>}
                            </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-black text-[10px]">
                            {(student.badges || []).length} ROZET
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic text-sm">
                      Sistemde henüz öğrenci kaydı bulunmuyor.
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