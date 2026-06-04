'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, orderBy, doc, updateDoc, deleteDoc, getDoc, getDocs, writeBatch } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Users, Video, Calendar as CalendarIcon, Trash2, Clock, Megaphone, Send, Settings, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

function PendingAssignmentRow({ parent, db, packages, children }: { parent: any, db: any, packages: any[], children: any[] }) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedCreditPkg, setSelectedCreditPkg] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const handleAssign = async () => {
    if (!selectedChild || !selectedPackageId || !selectedCreditPkg) return;
    setIsAssigning(true);
    try {
      const batch = writeBatch(db);
      
      const creditsToDeduct = packages.find(p => p.id === selectedPackageId)?.capacity ? 4 : 4; // assuming 4 weeks by default, or better parse from selectedCreditPkg
      const lessonsInPackage = parseInt(selectedCreditPkg.replace(/\D/g, ''), 10) || 4;

      if (lessonsInPackage < 1) {
        toast({ variant: 'destructive', title: 'Hata', description: 'Yetersiz kredi.' });
        return;
      }

      // Create enrollment
      const enrollmentRef = doc(collection(db, 'groupCourseEnrollments'));
      batch.set(enrollmentRef, {
          packageId: selectedPackageId,
          studentId: selectedChild,
          parentId: parent.id,
          paymentStatus: 'paid',
          enrolledAt: serverTimestamp()
      });

      // Increment enrolled count
      const groupPackageRef = doc(db, 'groupCoursePackages', selectedPackageId);
      batch.update(groupPackageRef, {
          enrolledCount: increment(1)
      });

      // Update Parent enrolledPackages
      // For simplicity, we just deduct 4 or the whole package if it's <= 4.
      // Wait, let's just deduct 4 credits. Or deduct the whole package string and put remainder.
      const deductionAmount = 4; // usually a group package is 4 lessons
      const remainingLessons = lessonsInPackage - deductionAmount;
      const updatedPackages = [...(parent.enrolledPackages || [])];
      const indexToRemove = updatedPackages.indexOf(selectedCreditPkg);
      
      if (indexToRemove !== -1) {
          if (remainingLessons > 0) {
              updatedPackages[indexToRemove] = `${remainingLessons}GRUP`;
          } else {
              updatedPackages.splice(indexToRemove, 1);
          }
      }
      
      batch.update(doc(db, 'users', parent.id), {
          enrolledPackages: updatedPackages
      });

      await batch.commit();
      toast({ title: 'Başarılı', description: 'Öğrenci gruba atandı.' });
      setIsAssignDialogOpen(false);
      // We don't have a direct way to update parent state in this row without reloading, 
      // but the UI will refresh if we used a listener. Since we fetched manually, we might need to rely on a manual refresh or just let it be.
      window.location.reload(); 
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    } finally {
      setIsAssigning(false);
    }
  };

  const totalGroupLessons = parent.groupPackages.reduce((acc: number, pkg: string) => {
      const normalizedPkg = /^\d+$/.test(pkg) ? `${pkg}GRUP` : pkg;
      return acc + (parseInt(normalizedPkg.replace(/\D/g, ''), 10) || 0);
  }, 0);

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm mb-3">
      <div>
        <p className="font-bold text-slate-800">{parent.firstName} {parent.lastName}</p>
        <p className="text-sm text-slate-500">{parent.email} • <span className="font-bold text-purple-600">{totalGroupLessons} Grup Kredisi</span></p>
      </div>
      <div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">Ata</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gruba Ata</DialogTitle>
              <DialogDescription>
                {parent.firstName} adlı velinin kredisini kullanarak çocuğunu gruba ekleyin. (Her işlem 4 kredi düşer)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Hangi Kredi Paketi Kullanılacak?</Label>
                <Select value={selectedCreditPkg} onValueChange={setSelectedCreditPkg}>
                  <SelectTrigger><SelectValue placeholder="Kredi paketi seçin..."/></SelectTrigger>
                  <SelectContent>
                    {parent.groupPackages.map((pkg: string, i: number) => (
                      <SelectItem key={i} value={pkg}>{pkg} (Kredi)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hangi Çocuk?</Label>
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger><SelectValue placeholder="Çocuk seçin..."/></SelectTrigger>
                  <SelectContent>
                    {children.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.firstName} ({c.age} Yaş)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hangi Grup Paketi?</Label>
                <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                  <SelectTrigger><SelectValue placeholder="Grup seçin..."/></SelectTrigger>
                  <SelectContent>
                    {packages.filter(p => p.status !== 'completed').map(pkg => (
                      <SelectItem key={pkg.id} value={pkg.id}>{pkg.title} ({pkg.enrolledCount || 0}/{pkg.capacity})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>İptal</Button>
              <Button onClick={handleAssign} disabled={isAssigning || !selectedChild || !selectedPackageId || !selectedCreditPkg} className="bg-purple-600 text-white hover:bg-purple-700">
                {isAssigning ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                Kaydet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function PendingAssignmentsTab({ db, packages }: { db: any, packages: any[] }) {
  const [users, setUsers] = useState<any[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const fetchPending = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const pendingUsers: any[] = [];
        const cMap: Record<string, any[]> = {};
        
        for (const docSnap of usersSnap.docs) {
          const data = docSnap.data();
          if (data.role === 'teacher' || data.role === 'admin') continue;
          
          const groupPackages = (data.enrolledPackages || []).filter((pkg: string) => {
            const normalizedPkg = /^\d+$/.test(pkg) ? `${pkg}GRUP` : pkg;
            return normalizedPkg.toLowerCase().includes('grup');
          });
          
          if (groupPackages.length > 0) {
             pendingUsers.push({ id: docSnap.id, ...data, groupPackages });
             const childrenSnap = await getDocs(collection(db, 'users', docSnap.id, 'children'));
             cMap[docSnap.id] = childrenSnap.docs.map(c => ({ id: c.id, ...c.data() }));
          }
        }
        setUsers(pendingUsers);
        setChildrenMap(cMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [db]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600"/></div>;

  if (users.length === 0) return (
    <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200">
      <p className="text-slate-500 font-medium">Atama bekleyen grup kredisi olan veli bulunmuyor.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {users.map(u => (
        <PendingAssignmentRow key={u.id} parent={u} db={db} packages={packages} children={childrenMap[u.id] || []} />
      ))}
    </div>
  );
}

function StudentRow({ enrollment, db, packages, currentPackageId }: { enrollment: any, db: any, packages: any[], currentPackageId: string }) {
  const [parentName, setParentName] = useState('...');
  const [studentName, setStudentName] = useState('...');
  const [loading, setLoading] = useState(true);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [targetPackageId, setTargetPackageId] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferMode, setTransferMode] = useState<'full' | 'makeup'>('full');
  
  // For Makeup Mode
  const [currentSessions, setCurrentSessions] = useState<any[]>([]);
  const [targetSessions, setTargetSessions] = useState<any[]>([]);
  const [selectedOriginalSessionId, setSelectedOriginalSessionId] = useState('');
  const [selectedMakeupSessionId, setSelectedMakeupSessionId] = useState('');

  const { toast } = useToast();

  const availablePackages = packages.filter(p => p.id !== currentPackageId && p.status !== 'completed');

  useEffect(() => {
    if (isTransferModalOpen) {
      getDocs(query(collection(db, 'groupCourseSessions'), where('packageId', '==', currentPackageId), orderBy('startTime', 'asc')))
        .then(snap => setCurrentSessions(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
        .catch(console.error);
    }
  }, [isTransferModalOpen, currentPackageId, db]);

  useEffect(() => {
    if (transferMode === 'makeup' && targetPackageId && targetPackageId !== 'none') {
      getDocs(query(collection(db, 'groupCourseSessions'), where('packageId', '==', targetPackageId), orderBy('startTime', 'asc')))
        .then(snap => setTargetSessions(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
        .catch(console.error);
    } else {
      setTargetSessions([]);
      setSelectedMakeupSessionId('');
    }
  }, [targetPackageId, transferMode, db]);

  const handleTransfer = async () => {
    if (!targetPackageId || targetPackageId === 'none') return;
    setIsTransferring(true);
    try {
      const targetPkg = packages.find(p => p.id === targetPackageId);
      if (!targetPkg) throw new Error("Paket bulunamadı.");

      const batch = writeBatch(db);
      const enrolRef = doc(db, 'groupCourseEnrollments', enrollment.id);

      if (transferMode === 'full') {
        batch.update(enrolRef, { packageId: targetPackageId, updatedAt: serverTimestamp() });
  
        const newPkgRef = doc(db, 'groupCoursePackages', targetPackageId);
        batch.update(newPkgRef, { enrolledCount: (targetPkg.enrolledCount || 0) + 1 });
  
        const oldPkg = packages.find(p => p.id === currentPackageId);
        if (oldPkg) {
           const oldPkgRef = doc(db, 'groupCoursePackages', currentPackageId);
           batch.update(oldPkgRef, { enrolledCount: Math.max(0, (oldPkg.enrolledCount || 0) - 1) });
        }
      } else {
        if (!selectedOriginalSessionId || !selectedMakeupSessionId) throw new Error("Lütfen tüm alanları doldurun.");
        
        const currentMakeupLessons = enrollment.makeupLessons || [];
        const newMakeup = {
            originalSessionId: selectedOriginalSessionId,
            makeupPackageId: targetPackageId,
            makeupSessionId: selectedMakeupSessionId,
            assignedAt: new Date()
        };
        
        batch.update(enrolRef, { 
            makeupLessons: [...currentMakeupLessons, newMakeup],
            updatedAt: serverTimestamp() 
        });
      }

      await batch.commit();

      toast({ title: "Başarılı", description: transferMode === 'full' ? "Öğrenci yeni gruba aktarıldı." : "Telafi dersi başarıyla atandı." });
      setIsTransferModalOpen(false);
      setTransferMode('full');
      setTargetPackageId('');
      setSelectedOriginalSessionId('');
      setSelectedMakeupSessionId('');
    } catch (e: any) {
      console.error(e);
      toast({ title: "Hata", description: "Grup değiştirilirken bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsTransferring(false);
    }
  };

  useEffect(() => {
    if (!db || !enrollment.parentId || !enrollment.studentId) return;
    Promise.all([
      getDoc(doc(db, 'users', enrollment.parentId)),
      getDoc(doc(db, 'users', enrollment.parentId, 'children', enrollment.studentId))
    ]).then(([parentSnap, studentSnap]) => {
       if (parentSnap.exists()) {
           const p = parentSnap.data();
           setParentName([p.firstName, p.lastName].filter(Boolean).join(' '));
       }
       if (studentSnap.exists()) {
           const d = studentSnap.data();
           setStudentName([d.firstName, d.lastName].filter(Boolean).join(' '));
       }
       setLoading(false);
    });
  }, [db, enrollment.parentId, enrollment.studentId]);

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl border-2 border-indigo-100 shadow-inner">
           {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : studentName.charAt(0)}
        </div>
        <div>
           <p className="font-bold text-slate-800">{studentName}</p>
           <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5"><Users className="w-3 h-3"/> Veli: {parentName}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold px-3 py-1">Kayıtlı</Badge>
        
        <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
           <DialogTrigger asChild>
             <Button variant="ghost" size="sm" className="h-6 text-[10px] text-blue-600 font-bold hover:bg-blue-50 px-2">Grup Değiştir</Button>
           </DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>İşlemler (Aktar / Telafi)</DialogTitle>
               <DialogDescription>
                 {studentName} adlı öğrenci için işlem seçin.
               </DialogDescription>
             </DialogHeader>
             <Tabs value={transferMode} onValueChange={(v: any) => setTransferMode(v)} className="w-full">
               <TabsList className="grid w-full grid-cols-2 mb-4">
                 <TabsTrigger value="full">Tüm Paketi Aktar</TabsTrigger>
                 <TabsTrigger value="makeup">Telafi Dersi Ata</TabsTrigger>
               </TabsList>

               <TabsContent value="full" className="space-y-4">
                 <div className="space-y-2">
                   <p className="text-sm font-medium">Hedef Paket</p>
                   <Select value={targetPackageId} onValueChange={setTargetPackageId}>
                     <SelectTrigger>
                       <SelectValue placeholder="Aktarılacak grubu seçin..." />
                     </SelectTrigger>
                     <SelectContent>
                       {availablePackages.length > 0 ? availablePackages.map(pkg => (
                         <SelectItem key={pkg.id} value={pkg.id}>{pkg.title} ({pkg.enrolledCount || 0}/{pkg.capacity})</SelectItem>
                       )) : (
                         <SelectItem value="none" disabled>Başka aktif grup bulunamadı.</SelectItem>
                       )}
                     </SelectContent>
                   </Select>
                 </div>
               </TabsContent>

               <TabsContent value="makeup" className="space-y-4">
                 <div className="space-y-2">
                   <p className="text-sm font-medium">Kaçırılan Ders (Mevcut Grup)</p>
                   <Select value={selectedOriginalSessionId} onValueChange={setSelectedOriginalSessionId}>
                     <SelectTrigger><SelectValue placeholder="Ders seçin..." /></SelectTrigger>
                     <SelectContent>
                       {currentSessions.map((s, i) => (
                         <SelectItem key={s.id} value={s.id}>
                           {i + 1}. Ders - {s.startTime?.toDate ? format(s.startTime.toDate(), 'dd MMM yyyy, HH:mm') : ''}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 
                 <div className="space-y-2">
                   <p className="text-sm font-medium">Telafi Grubu (Hedef Paket)</p>
                   <Select value={targetPackageId} onValueChange={setTargetPackageId}>
                     <SelectTrigger><SelectValue placeholder="Hedef grubu seçin..." /></SelectTrigger>
                     <SelectContent>
                       {availablePackages.map(pkg => (
                         <SelectItem key={pkg.id} value={pkg.id}>{pkg.title} ({pkg.enrolledCount || 0}/{pkg.capacity})</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 {targetPackageId && targetPackageId !== 'none' && (
                   <div className="space-y-2">
                     <p className="text-sm font-medium">Telafi Dersi (Hedef Gruptan)</p>
                     <Select value={selectedMakeupSessionId} onValueChange={setSelectedMakeupSessionId}>
                       <SelectTrigger><SelectValue placeholder="Telafi oturumunu seçin..." /></SelectTrigger>
                       <SelectContent>
                         {targetSessions.length > 0 ? targetSessions.map((s, i) => (
                           <SelectItem key={s.id} value={s.id}>
                             {i + 1}. Ders - {s.startTime?.toDate ? format(s.startTime.toDate(), 'dd MMM yyyy, HH:mm') : ''}
                           </SelectItem>
                         )) : (
                           <SelectItem value="none" disabled>Bu grupta oturum bulunamadı.</SelectItem>
                         )}
                       </SelectContent>
                     </Select>
                   </div>
                 )}
               </TabsContent>
             </Tabs>
             
             <DialogFooter className="mt-4">
               <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>İptal</Button>
               <Button 
                  onClick={handleTransfer} 
                  disabled={
                    transferMode === 'full' 
                      ? (!targetPackageId || targetPackageId === 'none' || isTransferring)
                      : (!targetPackageId || targetPackageId === 'none' || !selectedOriginalSessionId || !selectedMakeupSessionId || isTransferring)
                  } 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
               >
                 {isTransferring && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                 {transferMode === 'full' ? 'Aktar' : 'Telafiyi Ata'}
               </Button>
             </DialogFooter>
           </DialogContent>
        </Dialog>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{enrollment.enrolledAt?.toDate ? format(enrollment.enrolledAt.toDate(), 'dd MMM yyyy') : ''}</p>
      </div>
    </div>
  );
}

export function GrupPaketleriClient() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('4 haftalık konuşma pratiği grubu');
  const [capacity, setCapacity] = useState('10');
  const [teacherId, setTeacherId] = useState('');
  const [googleMeetLink, setGoogleMeetLink] = useState('');

  // Fetch Packages
  const packagesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'groupCoursePackages'), orderBy('createdAt', 'desc'));
  }, [db]);
  const { data: packages, isLoading: packagesLoading } = useCollection(packagesRef);

  // Fetch Teachers
  const teachersRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'teacher'));
  }, [db]);
  const { data: teachers } = useCollection(teachersRef);

  // Session Management State
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState('');
  const [isFourWeekSession, setIsFourWeekSession] = useState(true);
  const [isAddingSession, setIsAddingSession] = useState(false);

  // Fetch Sessions for selected package
  const sessionsRef = useMemoFirebase(() => {
    if (!db || !selectedPackage) return null;
    return query(collection(db, 'groupCourseSessions'), where('packageId', '==', selectedPackage.id), orderBy('startTime', 'asc'));
  }, [db, selectedPackage]);
  const { data: sessions, isLoading: sessionsLoading } = useCollection(sessionsRef);

  // Fetch Announcements for selected package
  const announcementsRef = useMemoFirebase(() => {
    if (!db || !selectedPackage) return null;
    return query(collection(db, 'groupAnnouncements'), where('packageId', '==', selectedPackage.id), orderBy('createdAt', 'desc'));
  }, [db, selectedPackage]);
  const { data: announcements, isLoading: announcementsLoading } = useCollection(announcementsRef);

  // Fetch Enrollments for selected package
  const enrollmentsRef = useMemoFirebase(() => {
    if (!db || !selectedPackage) return null;
    return query(collection(db, 'groupCourseEnrollments'), where('packageId', '==', selectedPackage.id));
  }, [db, selectedPackage]);
  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection(enrollmentsRef);

  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);

  // Edit Package State
  const [editTitle, setEditTitle] = useState('');
  const [editMeetLink, setEditMeetLink] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const [isUpdatingPackage, setIsUpdatingPackage] = useState(false);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    if (!title || !teacherId || !capacity) {
      toast({ variant: 'destructive', title: 'Eksik Bilgi', description: 'Lütfen zorunlu alanları doldurun.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'groupCoursePackages'), {
        title,
        description,
        capacity: parseInt(capacity),
        teacherId,
        enrolledCount: 0,
        googleMeetLink,
        status: 'published',
        createdAt: serverTimestamp()
      });
      toast({ title: 'Başarılı', description: 'Grup paketi oluşturuldu.' });
      setIsAddModalOpen(false);
      setTitle('');
      setGoogleMeetLink('');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!db) return;
    if (!confirm('Bu paketi silmek istediğinize emin misiniz? Sistemdeki kayıtlı velilerin hesaplarına paket kredisi iade edilecektir.')) return;
    
    try {
      setIsUpdatingPackage(true);
      const batch = writeBatch(db);

      // 1. Fetch sessions to count credits and delete them
      const sessionsQuery = query(collection(db, 'groupCourseSessions'), where('packageId', '==', id));
      const sessionsSnap = await getDocs(sessionsQuery);
      const creditsToRefund = sessionsSnap.docs.length > 0 ? sessionsSnap.docs.length : 1;
      sessionsSnap.docs.forEach(docSnap => batch.delete(docSnap.ref));

      // 2. Fetch announcements to delete them
      const announcementsQuery = query(collection(db, 'groupCourseAnnouncements'), where('packageId', '==', id));
      const announcementsSnap = await getDocs(announcementsQuery);
      announcementsSnap.docs.forEach(docSnap => batch.delete(docSnap.ref));

      // 3. Fetch enrollments to count how many children each parent enrolled
      const enrollmentsQuery = query(collection(db, 'groupCourseEnrollments'), where('packageId', '==', id));
      const enrollmentsSnap = await getDocs(enrollmentsQuery);
      
      const parentRefundCounts: Record<string, number> = {};
      enrollmentsSnap.docs.forEach(docSnap => {
          const data = docSnap.data();
          if (data.parentId) {
              parentRefundCounts[data.parentId] = (parentRefundCounts[data.parentId] || 0) + 1;
          }
          batch.delete(docSnap.ref);
      });

      // 4. Read parent docs and refund credits
      for (const [parentId, count] of Object.entries(parentRefundCounts)) {
          const parentRef = doc(db, 'users', parentId);
          const parentSnap = await getDoc(parentRef);
          if (parentSnap.exists()) {
              const parentData = parentSnap.data();
              const updatedPackages = [...(parentData.enrolledPackages || [])];
              const totalCreditsToRefund = creditsToRefund * count;
              
              let foundExisting = false;
              for (let i = 0; i < updatedPackages.length; i++) {
                  const pkg = updatedPackages[i];
                  const normalizedPkg = /^\d+$/.test(pkg) ? `${pkg}GRUP` : pkg;
                  if (normalizedPkg.toUpperCase().includes('GRUP')) {
                      // Extract number from start (e.g. "2GRUP" -> 2)
                      const currentCredits = parseInt(normalizedPkg.replace(/\D/g, ''), 10) || 0;
                      updatedPackages[i] = `${currentCredits + totalCreditsToRefund}GRUP`;
                      foundExisting = true;
                      break;
                  }
              }

              if (!foundExisting) {
                  updatedPackages.push(`${totalCreditsToRefund}GRUP`);
              }

              batch.update(parentRef, { enrolledPackages: updatedPackages });
          }
      }

      // 5. Delete the package itself
      batch.delete(doc(db, 'groupCoursePackages', id));

      await batch.commit();
      toast({ title: 'Başarılı', description: 'Paket silindi ve velilere iadeleri yapıldı.' });
      setIsSheetOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    } finally {
      setIsUpdatingPackage(false);
    }
  };

  const handleOpenDetails = (pkg: any) => {
    setSelectedPackage(pkg);
    setEditTitle(pkg.title);
    setEditMeetLink(pkg.googleMeetLink || '');
    setEditCapacity(pkg.capacity.toString());
    setIsSheetOpen(true);
  };

  const handleUpdatePackage = async () => {
    if (!db || !selectedPackage) return;
    setIsUpdatingPackage(true);
    try {
      await updateDoc(doc(db, 'groupCoursePackages', selectedPackage.id), {
        title: editTitle,
        googleMeetLink: editMeetLink,
        capacity: parseInt(editCapacity)
      });
      setSelectedPackage({ ...selectedPackage, title: editTitle, googleMeetLink: editMeetLink, capacity: parseInt(editCapacity) });
      toast({ title: 'Başarılı', description: 'Paket bilgileri güncellendi.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    } finally {
      setIsUpdatingPackage(false);
    }
  };

  const handleAddSession = async () => {
    if (!db || !selectedPackage || !sessionStartTime) return;
    
    setIsAddingSession(true);
    try {
      const batch = writeBatch(db);
      const weeksToCreate = isFourWeekSession ? 4 : 1;

      for (let i = 0; i < weeksToCreate; i++) {
        const startDate = new Date(sessionStartTime);
        startDate.setDate(startDate.getDate() + (i * 7)); // Add i weeks
        const endDate = new Date(startDate.getTime() + 45 * 60000); // 45 min duration

        const sessionRef = doc(collection(db, 'groupCourseSessions'));
        batch.set(sessionRef, {
          packageId: selectedPackage.id,
          teacherId: selectedPackage.teacherId,
          startTime: startDate,
          endTime: endDate,
          status: 'scheduled',
          createdAt: serverTimestamp()
        });
      }

      await batch.commit();
      toast({ title: 'Başarılı', description: isFourWeekSession ? '4 haftalık oturum eklendi.' : 'Oturum eklendi.' });
      setSessionStartTime('');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    } finally {
      setIsAddingSession(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'groupCourseSessions', id));
      toast({ title: 'Başarılı', description: 'Oturum silindi.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    }
  };

  const handleAddAnnouncement = async () => {
    if (!db || !selectedPackage) return;
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen başlık ve içerik girin.' });
      return;
    }

    setIsAddingAnnouncement(true);
    try {
      await addDoc(collection(db, 'groupAnnouncements'), {
        packageId: selectedPackage.id,
        teacherId: selectedPackage.teacherId, 
        title: announcementTitle,
        content: announcementContent,
        createdAt: serverTimestamp()
      });
      toast({ title: 'Başarılı', description: 'Duyuru eklendi.' });
      setAnnouncementTitle('');
      setAnnouncementContent('');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    } finally {
      setIsAddingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'groupAnnouncements', id));
      toast({ title: 'Başarılı', description: 'Duyuru silindi.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    }
  };

  const getTeacherName = (id: string) => {
    const teacher = teachers?.find((t: any) => t.id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Bilinmeyen Öğretmen';
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner">
                <BookOpen className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Grup Paketleri</h1>
                <p className="text-slate-500 font-medium mt-1">4 haftalık grup dersi paketlerini modern panodan yönetin.</p>
            </div>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 rounded-xl px-6 font-bold text-base transition-all hover:scale-105 active:scale-95">
              <Plus className="w-5 h-5 mr-2" />
              Yeni Paket Oluştur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[32px] p-8 border-none shadow-2xl">
            <DialogHeader className="mb-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6" />
              </div>
              <DialogTitle className="text-2xl font-bold">Yeni Grup Paketi</DialogTitle>
              <DialogDescription className="text-base">
                Yeni bir 4 haftalık kurs paketi oluşturun.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePackage} className="space-y-5 py-2">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Paket Adı <span className="text-red-500">*</span></Label>
                <Input className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="Örn: Nisan Ayı 7-8 Yaş Konuşma Kulübü" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Kısa Açıklama</Label>
                <Textarea className="rounded-xl bg-slate-50 border-slate-200" placeholder="Paket açıklaması..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Öğretmen <span className="text-red-500">*</span></Label>
                  <Select value={teacherId} onValueChange={setTeacherId} required>
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Öğretmen Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers?.map((teacher: any) => (
                        <SelectItem key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Kapasite <span className="text-red-500">*</span></Label>
                  <Input className="h-12 rounded-xl bg-slate-50 border-slate-200" type="number" min="1" max="20" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Google Meet Linki</Label>
                <Input className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="https://meet.google.com/xxx-xxxx-xxx" value={googleMeetLink} onChange={(e) => setGoogleMeetLink(e.target.value)} />
              </div>
              <DialogFooter className="mt-8">
                <Button type="button" variant="ghost" className="h-12 rounded-xl font-bold" onClick={() => setIsAddModalOpen(false)}>İptal</Button>
                <Button type="submit" disabled={isSubmitting} className="h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold px-8">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Oluştur
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* DASHBOARD CARDS */}
      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-slate-100 rounded-2xl p-1">
          <TabsTrigger value="packages" className="rounded-xl font-bold h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm">Grup Paketleri</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl font-bold h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm">Atama Bekleyenler</TabsTrigger>
        </TabsList>
        <TabsContent value="packages">
          <div>
              {packagesLoading ? (
                <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-purple-600" /></div>
              ) : !packages || packages.length === 0 ? (
                <div className="text-center p-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200 shadow-sm">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                     <GraduationCap className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Henüz Grup Paketi Yok</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">Sistemde oluşturulmuş herhangi bir grup sınıfı bulunmuyor. Yeni bir tane oluşturarak başlayın.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg: any) => {
                        const fillPercentage = Math.min((pkg.enrolledCount / pkg.capacity) * 100, 100);
                        return (
                            <Card key={pkg.id} className="rounded-[32px] border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white group cursor-pointer" onClick={() => handleOpenDetails(pkg)}>
                                <div className="h-28 bg-gradient-to-r from-purple-500 to-indigo-500 relative p-6">
                                    <Badge variant="secondary" className="absolute top-4 right-4 bg-white/20 text-white backdrop-blur-md border-none font-bold">
                                        {pkg.status === 'published' ? 'Yayında' : 'Taslak'}
                                    </Badge>
                                    <div className="absolute -bottom-6 left-6 w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-100 text-xl font-black text-indigo-600">
                                        {getTeacherName(pkg.teacherId).charAt(0)}
                                    </div>
                                </div>
                                <CardContent className="pt-10 pb-6 px-6 space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-purple-600 transition-colors">{pkg.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium mt-1">{getTeacherName(pkg.teacherId)}</p>
                                    </div>
                                    
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Kontenjan</span>
                                            <span className="text-sm font-bold text-slate-700">{pkg.enrolledCount} / {pkg.capacity} Öğrenci</span>
                                        </div>
                                        <Progress value={fillPercentage} className="h-2.5 bg-slate-200" indicatorClassName={fillPercentage >= 100 ? "bg-red-500" : "bg-purple-500"} />
                                    </div>

                                    <Button variant="ghost" className="w-full justify-between hover:bg-purple-50 hover:text-purple-700 text-slate-600 font-bold group-hover:bg-purple-50 group-hover:text-purple-700 rounded-xl h-12">
                                        Yönet & Detaylar <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
              )}
          </div>
        </TabsContent>
        <TabsContent value="pending">
            <PendingAssignmentsTab db={db} packages={packages || []} />
        </TabsContent>
      </Tabs>

      {/* DETAILED SHEET (SLIDE OVER) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[700px] w-full p-0 bg-slate-50 border-l-0 overflow-y-auto">
            <SheetHeader className="sr-only">
                <SheetTitle>Paket Detayları</SheetTitle>
                <SheetDescription>Grup paketinin detaylarını görüntüleyin ve yönetin.</SheetDescription>
            </SheetHeader>
            {selectedPackage && (
                <div className="min-h-full flex flex-col">
                    {/* Header Header */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 text-white relative shadow-md">
                        <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                            {selectedPackage.enrolledCount} / {selectedPackage.capacity} Dolu
                        </div>
                        <h2 className="text-3xl font-black mb-2 pr-16 leading-tight">{selectedPackage.title}</h2>
                        <div className="flex flex-wrap items-center gap-4 text-purple-100 font-medium text-sm">
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg"><Users className="w-4 h-4"/> {getTeacherName(selectedPackage.teacherId)}</span>
                            {selectedPackage.googleMeetLink && (
                                <a href={selectedPackage.googleMeetLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/40 transition-colors px-3 py-1.5 rounded-lg text-blue-100 border border-blue-400/30">
                                    <Video className="w-4 h-4"/> Meet Bağlantısı
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <div className="flex-1 p-6">
                        <Tabs defaultValue="students" className="w-full">
                            <TabsList className="w-full bg-white border border-slate-200 rounded-2xl p-1.5 h-auto grid grid-cols-4 gap-1.5 mb-8 shadow-sm">
                                <TabsTrigger value="students" className="rounded-xl py-3 font-bold text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none"><Users className="w-4 h-4 mr-2 hidden sm:block"/> Öğrenciler</TabsTrigger>
                                <TabsTrigger value="sessions" className="rounded-xl py-3 font-bold text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none"><CalendarIcon className="w-4 h-4 mr-2 hidden sm:block"/> Oturumlar</TabsTrigger>
                                <TabsTrigger value="announcements" className="rounded-xl py-3 font-bold text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none"><Megaphone className="w-4 h-4 mr-2 hidden sm:block"/> Duyurular</TabsTrigger>
                                <TabsTrigger value="settings" className="rounded-xl py-3 font-bold text-xs sm:text-sm data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none"><Settings className="w-4 h-4 mr-2 hidden sm:block"/> Ayarlar</TabsTrigger>
                            </TabsList>

                            {/* STUDENTS TAB */}
                            <TabsContent value="students" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Kayıtlı Öğrenciler</h3>
                                        <p className="text-sm text-slate-500 font-medium">Bu gruba aktif olarak kayıtlı olan öğrenciler.</p>
                                    </div>
                                    <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-black text-lg">
                                        {enrollments?.length || 0}
                                    </div>
                                </div>

                                {enrollmentsLoading ? (
                                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600"/></div>
                                ) : !enrollments || enrollments.length === 0 ? (
                                    <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200">
                                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                                        <p className="text-slate-500 font-medium">Bu sınıfa henüz öğrenci kaydı yapılmamış.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {enrollments.map((enrol: any) => (
                                            <StudentRow key={enrol.id} enrollment={enrol} db={db} packages={packages || []} currentPackageId={selectedPackage.id} />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            {/* SESSIONS TAB */}
                            <TabsContent value="sessions" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col gap-3 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Input type="datetime-local" className="flex-1 h-12 rounded-xl bg-slate-50 border-slate-200 font-medium" value={sessionStartTime} onChange={(e) => setSessionStartTime(e.target.value)} />
                                        <Button onClick={handleAddSession} disabled={!sessionStartTime || isAddingSession} className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-600/20">
                                            {isAddingSession ? <Loader2 className="w-5 h-5 animate-spin"/> : <Plus className="w-5 h-5 mr-2" />}
                                            Planla
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="fourWeekSession" checked={isFourWeekSession} onChange={(e) => setIsFourWeekSession(e.target.checked)} className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" />
                                        <label htmlFor="fourWeekSession" className="text-sm font-semibold text-slate-700">Otomatik 4 haftalık oturum oluştur (Aynı gün ve saatte)</label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-800 text-lg">Oturum Takvimi ({sessions?.length || 0})</h3>
                                    {sessionsLoading ? (
                                        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600"/></div>
                                    ) : !sessions || sessions.length === 0 ? (
                                        <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200">
                                            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                                            <p className="text-slate-500 font-medium">Henüz oturum planlanmamış.</p>
                                        </div>
                                    ) : (
                                        <div className="relative border-l-2 border-purple-100 ml-4 space-y-6 py-2">
                                            {sessions.map((session: any, index: number) => {
                                                const isPast = session.startTime?.toDate && session.startTime.toDate() < new Date();
                                                return (
                                                    <div key={session.id} className="relative pl-8">
                                                        <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white ${isPast ? 'bg-slate-300' : 'bg-purple-500 shadow-[0_0_0_3px_rgba(168,85,247,0.2)]'}`}></div>
                                                        <div className={`p-4 rounded-2xl border shadow-sm transition-all ${isPast ? 'bg-slate-50/50 border-slate-100 opacity-70' : 'bg-white border-purple-100 hover:shadow-md'}`}>
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <Badge variant="outline" className={`font-bold uppercase tracking-widest text-[9px] ${isPast ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>Oturum {index + 1}</Badge>
                                                                    </div>
                                                                    <div className={`font-black text-base ${isPast ? 'text-slate-600' : 'text-slate-800'}`}>
                                                                        {session.startTime?.toDate ? format(session.startTime.toDate(), 'd MMMM yyyy, EEEE', { locale: tr }) : 'Geçersiz Tarih'}
                                                                    </div>
                                                                    <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                                        {session.startTime?.toDate ? format(session.startTime.toDate(), 'HH:mm') : ''} - {session.endTime?.toDate ? format(session.endTime.toDate(), 'HH:mm') : ''}
                                                                    </div>
                                                                </div>
                                                                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => handleDeleteSession(session.id)}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* ANNOUNCEMENTS TAB */}
                            <TabsContent value="announcements" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Megaphone className="w-5 h-5 text-purple-600" /> Yeni Duyuru Gönder</h3>
                                    <Input 
                                        placeholder="Duyuru Başlığı" 
                                        value={announcementTitle}
                                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                                        className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold text-slate-800"
                                    />
                                    <Textarea 
                                        placeholder="Velilere ve öğrencilere iletilecek mesajınızı buraya yazın..."
                                        value={announcementContent}
                                        onChange={(e) => setAnnouncementContent(e.target.value)}
                                        className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200 font-medium p-4 resize-none"
                                    />
                                    <Button 
                                        onClick={handleAddAnnouncement} 
                                        disabled={isAddingAnnouncement || !announcementTitle || !announcementContent}
                                        className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold shadow-lg shadow-purple-600/20"
                                    >
                                        {isAddingAnnouncement ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                                        Duyuruyu Gönder
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-800 text-lg">Gönderilen Duyurular ({announcements?.length || 0})</h3>
                                    {announcementsLoading ? (
                                        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600"/></div>
                                    ) : !announcements || announcements.length === 0 ? (
                                        <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200">
                                            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                                            <p className="text-slate-500 font-medium">Bu gruba henüz bir duyuru gönderilmemiş.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {announcements.map((ann: any) => (
                                                <div key={ann.id} className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-2xl p-5 shadow-sm relative group overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" 
                                                        onClick={() => handleDeleteAnnouncement(ann.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <h4 className="font-black text-purple-900 text-base mb-2 pr-10">{ann.title}</h4>
                                                    <p className="text-slate-600 text-sm whitespace-pre-wrap font-medium leading-relaxed">{ann.content}</p>
                                                    <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-purple-100/50">
                                                        <Clock className="w-3.5 h-3.5 text-purple-400"/>
                                                        <span className="text-xs font-bold text-purple-500/80">
                                                            {ann.createdAt?.toDate ? formatInTimeZone(ann.createdAt.toDate(), 'Europe/Istanbul', 'dd MMMM HH:mm', { locale: tr }) : 'Yeni'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* SETTINGS TAB */}
                            <TabsContent value="settings" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-purple-600" /> Paket Bilgilerini Güncelle</h3>
                                    
                                    <div className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">Paket Adı</Label>
                                            <Input className="h-12 rounded-xl bg-slate-50 border-slate-200" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">Kontenjan (Öğrenci Sayısı)</Label>
                                            <Input type="number" min="1" max="50" className="h-12 rounded-xl bg-slate-50 border-slate-200" value={editCapacity} onChange={e => setEditCapacity(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">Google Meet Linki</Label>
                                            <Input className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="https://meet.google.com/..." value={editMeetLink} onChange={e => setEditMeetLink(e.target.value)} />
                                            <p className="text-xs text-slate-500 font-medium">Bu paketteki tüm dersler için geçerli olacak canlı ders linki.</p>
                                        </div>
                                        
                                        <Button 
                                            onClick={handleUpdatePackage} 
                                            disabled={isUpdatingPackage || !editTitle || !editCapacity}
                                            className="w-full h-12 mt-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-md"
                                        >
                                            {isUpdatingPackage ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                                            Bilgileri Kaydet
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                    <h3 className="text-lg font-black text-red-800 mb-2 flex items-center gap-2"><Trash2 className="w-5 h-5"/> Tehlikeli Bölge</h3>
                                    <p className="text-red-600/80 text-sm font-medium mb-6">Bu işlemi geri alamazsınız. Paket silindiğinde tüm oturumlar ve duyurular da erişilemez hale gelir.</p>
                                    <Button onClick={() => handleDeletePackage(selectedPackage.id)} variant="destructive" className="bg-red-600 hover:bg-red-700 font-bold h-12 px-6 rounded-xl shadow-lg shadow-red-600/20">
                                        Paketi Tamamen Sil
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
