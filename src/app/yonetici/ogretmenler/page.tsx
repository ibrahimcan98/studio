'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useMemo } from 'react';
import { collection, query, where, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';
import { startOfMonth, endOfMonth, format, addMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Plus, 
  MoreHorizontal, 
  User, 
  Mail, 
  Video, 
  Trash2, 
  Presentation,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { TeacherCalendarDialog } from './calendar-dialog';

export default function AdminTeachersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [selectedTeacherForStats, setSelectedTeacherForStats] = useState<any>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedTeacherForCalendar, setSelectedTeacherForCalendar] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isPassive: false,
    firstName: '',
    lastName: '',
    bio: '',
    hobbies: '',
    googleMeetLink: '',
    introVideoUrl: '',
    lessonRates: {
        baslangic: 0,
        konusma: 0,
        akademik: 0,
        gelisim: 0,
        gcse: 0,
        FREE_TRIAL: 0
    },
  });

  const teachersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'teacher'));
  }, [db]);

  const { data: teachers, isLoading } = useCollection(teachersQuery);

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      isPassive: false,
      firstName: '',
      lastName: '',
      bio: '',
      hobbies: '',
      googleMeetLink: '',
      introVideoUrl: '',
      lessonRates: {
          baslangic: 0,
          konusma: 0,
          akademik: 0,
          gelisim: 0,
          gcse: 0,
          FREE_TRIAL: 0
      },
    });
  };

  const handleAddTeacher = async () => {
    if (!db || !formData.firstName) {
       toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen isim alanını doldurunuz.' });
       return;
    }
    if (!formData.isPassive && (!formData.email || !formData.password)) {
       toast({ variant: 'destructive', title: 'Hata', description: 'Aktif bir öğretmen için lütfen e-posta ve şifre girin.' });
       return;
    }
    
    setIsSubmitting(true);

    try {
      let teacherRef;
      let newUid;

      if (formData.isPassive) {
        teacherRef = doc(collection(db, 'users'));
        newUid = teacherRef.id;
      } else {
        let secondaryApp;
        try {
          secondaryApp = getApp('Secondary');
        } catch {
          secondaryApp = initializeApp(firebaseConfig, 'Secondary');
        }
        const secondaryAuth = getAuth(secondaryApp);
        
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email.toLowerCase(), formData.password);
        newUid = userCredential.user.uid;
        await signOut(secondaryAuth);
        
        teacherRef = doc(db, 'users', newUid);
      }
      
      await setDoc(teacherRef, {
        id: newUid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email ? formData.email.toLowerCase() : '',
        role: 'teacher',
        isPassive: formData.isPassive,
        bio: formData.bio,
        hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(Boolean),
        googleMeetLink: formData.googleMeetLink,
        introVideoUrl: formData.introVideoUrl,
        lessonRates: formData.lessonRates,
        createdAt: serverTimestamp(),
        isProfileComplete: true,
      });

      toast({ 
        title: 'Öğretmen Yetkilendirildi', 
        description: formData.isPassive ? `${formData.firstName} sisteme Pasif (Dolu) Öğretmen olarak eklendi.` : `${formData.email} adresi sisteme Öğretmen olarak tanımlandı ve hesabı oluşturuldu.` 
      });
      setIsAddOpen(false);
      resetForm();
    } catch (error: any) {
      console.error(error);
      let message = 'Öğretmen eklenirken bir sorun oluştu.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Bu e-posta adresi zaten başka bir hesapta (veli veya öğretmen) tanımlı.';
          break;
        case 'auth/network-request-failed':
          message = 'İnternet bağlantınızı kontrol edin. Firebase sunucularına ulaşılamıyor.';
          break;
        case 'auth/invalid-email':
          message = 'Lütfen geçerli bir e-posta adresi girin.';
          break;
        case 'auth/weak-password':
          message = 'Şifre çok zayıf. En az 6 karakter giriniz.';
          break;
      }
      
      toast({ variant: 'destructive', title: 'Hata', description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTeacher = async () => {
    if (!db || !selectedTeacher) return;
    setIsSubmitting(true);

    try {
      const teacherRef = doc(db, 'users', selectedTeacher.id);
      await updateDoc(teacherRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(Boolean),
        googleMeetLink: formData.googleMeetLink,
        introVideoUrl: formData.introVideoUrl,
        lessonRates: formData.lessonRates,
        updatedAt: serverTimestamp(),
      });

      toast({ title: 'Başarılı', description: 'Öğretmen profili güncellendi.' });
      setIsEditOpen(false);
      setSelectedTeacher(null);
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Hata', description: 'Profil güncellenirken bir hata oluştu.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!db || !confirm('BU İŞLEM GERİ ALINAMAZ!\n\nSeçili öğretmenin yetkisini kaldırmak ve TÜM bilgilerini (biyografi, ders linkleri vb.) veritabanından kalıcı olarak silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'users', id));
      toast({ 
        title: 'Yetki Kaldırıldı', 
        description: 'Öğretmen ve tüm verileri backend sisteminden kalıcı olarak silindi.',
        className: 'bg-red-500 text-white font-bold'
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Öğretmen verileri silinemedi.' });
    }
  };

  const openEdit = (teacher: any) => {
    setSelectedTeacher(teacher);
    setFormData({
      email: teacher.email || '',
      password: '',
      isPassive: teacher.isPassive || false,
      firstName: teacher.firstName || '',
      lastName: teacher.lastName || '',
      bio: teacher.bio || '',
      hobbies: (teacher.hobbies || []).join(', '),
      googleMeetLink: teacher.googleMeetLink || '',
      introVideoUrl: teacher.introVideoUrl || '',
      lessonRates: teacher.lessonRates || {
        baslangic: 0,
        konusma: 0,
        akademik: 0,
        gelisim: 0,
        gcse: 0,
        FREE_TRIAL: 0
      },
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-8 p-2 sm:p-8 pt-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">Öğretmen Yönetimi</h1>
          <p className="text-[11px] sm:text-sm text-muted-foreground mt-1 max-w-[500px]">Platformdaki öğretmenleri yetkilendirin, düzenleyin veya tüm verilerini silin.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if(!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-11 sm:h-12 px-5 sm:px-6 font-bold shadow-lg shadow-primary/20 w-full sm:w-auto text-xs sm:text-sm">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Yeni Öğretmen Yetkilendir
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[24px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Öğretmen Yetkilendir</DialogTitle>
              <DialogDescription>Yeni bir öğretmen için veritabanında "teacher" rolüyle bir taslak oluşturun.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center space-x-4 col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
                <Switch id="passive-mode" checked={formData.isPassive} onCheckedChange={(c) => setFormData({...formData, isPassive: c})} />
                <div className="space-y-0.5">
                  <Label htmlFor="passive-mode" className="text-base font-bold text-slate-800 cursor-pointer">Pasif (Dolu Görünen) Öğretmen</Label>
                  <p className="text-xs text-slate-500 font-medium">Bu öğretmen sisteme giriş yapamaz, velilere saatleri dolu olarak görünür.</p>
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>E-posta Adresi (Gerekirse)</Label>
                <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ornek@turkcocukakademisi.com" />
              </div>
              {!formData.isPassive && (
                <div className="space-y-2 col-span-2">
                  <Label>Şifre (İleride giriş yapacağı şifre)</Label>
                  <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="En az 6 karakter" />
                </div>
              )}
              <div className="space-y-2">
                <Label>İsim</Label>
                <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Ad" />
              </div>
              <div className="space-y-2">
                <Label>Soyisim</Label>
                <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Soyad" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Google Meet Linki</Label>
                <Input value={formData.googleMeetLink} onChange={e => setFormData({...formData, googleMeetLink: e.target.value})} placeholder="https://meet.google.com/..." />
              </div>
              {/* <div className="space-y-2 col-span-2">
                <Label>Tanıtım Videosu Linki</Label>
                <Input value={formData.introVideoUrl} onChange={e => setFormData({...formData, introVideoUrl: e.target.value})} placeholder="https://youtube.com/..." />
              </div> */}
              <div className="col-span-2 space-y-3 pt-4 border-t border-slate-100">
                <Label className="text-base font-black text-slate-800 tracking-tight">Kurs Başına Kazanç (€, Ders Başı)</Label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                   <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">Başlangıç</Label><Input type="number" min="0" value={formData.lessonRates.baslangic || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, baslangic: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-10" /></div>
                   <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">Konuşma</Label><Input type="number" min="0" value={formData.lessonRates.konusma || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, konusma: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-10" /></div>
                   <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">Akademik</Label><Input type="number" min="0" value={formData.lessonRates.akademik || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, akademik: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-10" /></div>
                   <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">Gelişim</Label><Input type="number" min="0" value={formData.lessonRates.gelisim || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, gelisim: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-10" /></div>
                   <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">GCSE</Label><Input type="number" min="0" value={formData.lessonRates.gcse || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, gcse: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-10" /></div>
                   <div className="space-y-1.5"><Label className="text-xs font-bold text-blue-600">Deneme Dersi</Label><Input type="number" min="0" className="border-blue-200 font-bold text-slate-700 h-10 bg-blue-50/50" value={formData.lessonRates.FREE_TRIAL || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, FREE_TRIAL: Number(e.target.value)}})} placeholder="€" /></div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-xl" onClick={() => setIsAddOpen(false)}>İptal</Button>
              <Button className="rounded-xl font-bold" onClick={handleAddTeacher} disabled={isSubmitting || !formData.email || !formData.firstName}>
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Yetkiyi Tanımla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[24px]">
        <CardHeader className="bg-white border-b pb-4 sm:pb-6 px-4 sm:px-8">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-slate-800">
            <Presentation className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Aktif Öğretmen Listesi ({teachers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Veriler Yükleniyor...</p>
            </div>
          ) : (
            <>
                {/* MOBILE LIST VIEW */}
                <div className="md:hidden divide-y divide-slate-100">
                    {teachers?.map((teacher) => (
                        <div key={teacher.id} className="p-4 bg-white hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                                            {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-slate-700 text-sm truncate">{teacher.firstName} {teacher.lastName}</span>
                                        <span className="text-[9px] text-slate-400 font-medium truncate">{teacher.email}</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full shrink-0">
                                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-56">
                                        <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase mb-1">Yönetim</DropdownMenuLabel>
                                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer" onClick={() => openEdit(teacher)}>
                                            Profili Düzenle
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-emerald-600 focus:text-emerald-700" onClick={() => { setSelectedTeacherForCalendar(teacher); setIsCalendarOpen(true); }}>
                                            <CalendarIcon className="w-3.5 h-3.5 mr-2" /> Takvim Yönetimi
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-indigo-600 focus:text-indigo-700" onClick={() => { setSelectedTeacherForStats(teacher); setIsStatsOpen(true); }}>
                                            <Presentation className="w-3.5 h-3.5 mr-2" /> İstatistikler & Geçmiş
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 text-red-500 focus:text-red-500 cursor-pointer" onClick={() => handleDeleteTeacher(teacher.id)}>
                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Yetkiyi Kaldır
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-50">
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 font-black text-[8px] uppercase tracking-widest px-1.5 py-0">TEACHER</Badge>
                                {teacher.isPassive ? (
                                    <Badge className="bg-slate-100 text-slate-500 border-slate-200 font-black text-[8px] uppercase tracking-widest px-1.5 py-0">PASİF</Badge>
                                ) : teacher.bio ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[8px] uppercase tracking-widest px-1.5 py-0">AKTİF</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-orange-500 border-orange-200 font-black text-[8px] uppercase tracking-widest px-1.5 py-0">TASLAK</Badge>
                                )}
                                {teacher.googleMeetLink && (
                                    <a href={teacher.googleMeetLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 font-bold text-[9px] ml-auto hover:underline uppercase tracking-tight">
                                        <ExternalLink className="w-2.5 h-2.5" /> Google Meet
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                    {(!teachers || teachers.length === 0) && (
                        <div className="py-20 text-center text-slate-400 font-bold italic text-[11px] uppercase tracking-wider">
                            Henüz kayıtlı öğretmen yok.
                        </div>
                    )}
                </div>

                {/* DESKTOP TABLE VIEW */}
                <div className="hidden md:block">
                    <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="font-bold text-slate-500 py-5 pl-8">Öğretmen Bilgisi</TableHead>
                        <TableHead className="font-bold text-slate-500">Google Meet</TableHead>
                        <TableHead className="font-bold text-slate-500">Profil Durumu</TableHead>
                        <TableHead className="font-bold text-slate-500">Rol</TableHead>
                        <TableHead className="w-[80px] text-right pr-8"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teachers?.map((teacher) => (
                        <TableRow key={teacher.id} className="hover:bg-slate-50/30 transition-colors border-slate-100">
                            <TableCell className="py-5 pl-8">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                    {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                                </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                <span className="font-bold text-slate-700 truncate">{teacher.firstName} {teacher.lastName}</span>
                                <span className="text-[10px] text-slate-400 font-medium lowercase truncate">{teacher.email}</span>
                                <span className="text-[9px] font-mono text-slate-300 uppercase select-all">ID: {teacher.id.substring(0,8)}</span>
                                </div>
                            </div>
                            </TableCell>
                            <TableCell>
                            {teacher.googleMeetLink ? (
                                <a href={teacher.googleMeetLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 font-bold text-xs hover:underline">
                                <ExternalLink className="w-3.5 h-3.5" /> Linke Git
                                </a>
                            ) : (
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">YOK</span>
                            )}
                            </TableCell>
                            <TableCell>
                            {teacher.isPassive ? (
                                <Badge className="bg-slate-100 text-slate-500 border-slate-200 font-black text-[9px] uppercase tracking-widest">PASİF (DOLU)</Badge>
                            ) : teacher.bio ? (
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[9px] uppercase tracking-widest">AKTİF</Badge>
                            ) : (
                                <Badge variant="outline" className="text-orange-500 border-orange-200 font-black text-[9px] uppercase tracking-widest">TASLAK</Badge>
                            )}
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 font-black text-[9px] uppercase tracking-widest">TEACHER</Badge>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-56">
                                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase mb-1">Yönetim</DropdownMenuLabel>
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer" onClick={() => openEdit(teacher)}>
                                    Profili Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-emerald-600 focus:text-emerald-700" onClick={() => { setSelectedTeacherForCalendar(teacher); setIsCalendarOpen(true); }}>
                                    <CalendarIcon className="w-3.5 h-3.5 mr-2" /> Takvim Yönetimi (Müsaitlik)
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-indigo-600 focus:text-indigo-700" onClick={() => { setSelectedTeacherForStats(teacher); setIsStatsOpen(true); }}>
                                    <Presentation className="w-3.5 h-3.5 mr-2" /> İstatistikler & Geçmiş
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 text-red-500 focus:text-red-500 cursor-pointer" onClick={() => handleDeleteTeacher(teacher.id)}>
                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Yetkiyi ve Verileri Kaldır
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border-none shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Öğretmen Profilini Düzenle</DialogTitle>
            <DialogDescription>Admin olarak yaptığınız bu değişiklikler öğretmenin portalında anında senkronize olur.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-6">
            <div className="space-y-2">
              <Label>İsim</Label>
              <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Soyisim</Label>
              <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Hakkında (Biyografi)</Label>
              <Textarea rows={5} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Öğretmenimizin deneyimleri..." />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Hobiler (Virgülle ayırın)</Label>
              <Input value={formData.hobbies} onChange={e => setFormData({...formData, hobbies: e.target.value})} placeholder="Kitap okumak, seyahat, tenis..." />
            </div>
            <div className="space-y-2">
              <Label>Google Meet Linki</Label>
              <Input value={formData.googleMeetLink} onChange={e => setFormData({...formData, googleMeetLink: e.target.value})} />
            </div>
            {/* <div className="space-y-2">
              <Label>Tanıtım Videosu URL'si</Label>
              <Input value={formData.introVideoUrl} onChange={e => setFormData({...formData, introVideoUrl: e.target.value})} />
            </div> */}
            <div className="col-span-2 space-y-3 pt-6 border-t border-slate-100">
              <Label className="text-base font-black text-slate-800 tracking-tight">Kurs Başına Kazanç (€, Ders Başı)</Label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                 <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">Başlangıç</Label><Input type="number" min="0" value={formData.lessonRates.baslangic || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, baslangic: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-11" /></div>
                 <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">Konuşma</Label><Input type="number" min="0" value={formData.lessonRates.konusma || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, konusma: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-11" /></div>
                 <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">Akademik</Label><Input type="number" min="0" value={formData.lessonRates.akademik || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, akademik: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-11" /></div>
                 <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">Gelişim</Label><Input type="number" min="0" value={formData.lessonRates.gelisim || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, gelisim: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-11" /></div>
                 <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-500">GCSE</Label><Input type="number" min="0" value={formData.lessonRates.gcse || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, gcse: Number(e.target.value)}})} placeholder="€" className="font-bold text-slate-700 h-11" /></div>
                 <div className="space-y-1.5"><Label className="text-xs font-bold text-blue-600">Deneme Dersi</Label><Input type="number" min="0" className="border-blue-200 font-bold text-slate-700 h-11 bg-blue-50/50" value={formData.lessonRates.FREE_TRIAL || ''} onChange={e => setFormData({...formData, lessonRates: {...formData.lessonRates, FREE_TRIAL: Number(e.target.value)}})} placeholder="€" /></div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" className="rounded-xl border-2 font-bold h-12 px-6" onClick={() => setIsEditOpen(false)}>Vazgeç</Button>
            <Button className="rounded-xl h-12 px-8 font-bold" onClick={handleEditTeacher} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Değişiklikleri Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* STATS DIALOG */}
      <TeacherStatsDialog 
        isOpen={isStatsOpen} 
        onOpenChange={setIsStatsOpen} 
        teacher={selectedTeacherForStats} 
      />

      {/* CALENDAR DIALOG */}
      <TeacherCalendarDialog
        isOpen={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        teacher={selectedTeacherForCalendar}
      />
    </div>
  );
}

function TeacherStatsDialog({ isOpen, onOpenChange, teacher }: { isOpen: boolean, onOpenChange: (o: boolean) => void, teacher: any }) {
  const db = useFirestore();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const statsQuery = useMemoFirebase(() => {
    if (!db || !teacher) return null;
    return query(collection(db, 'lesson-slots'), where('teacherId', '==', teacher.id));
  }, [db, teacher]);

  const { data: slots, isLoading } = useCollection(statsQuery);

  const stats = useMemo(() => {
    if (!slots || !teacher) return { completedCount: 0, studentCount: 0, cancellations: [], breakdown: {}, totalMonthlyEarnings: 0, totalMonthlyCount: 0 };
    
    const now = new Date();
    const startOfViewMonth = startOfMonth(selectedMonth);
    const endOfViewMonth = endOfMonth(selectedMonth);

    const getCourseKey = (code?: string) => {
        if (!code) return 'OTHER';
        if (code === 'FREE_TRIAL') return 'FREE_TRIAL';
        const prefix = code.replace(/[0-9]/g, '');
        const map: any = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik', 'GCSE': 'gcse' };
        return map[prefix] || 'OTHER';
    };

    // 1. Filter and Sort Slots
    const relevantSlots = slots
        .filter(s => s.status === 'booked' || s.status === 'completed' || s.status === 'cancelled')
        .sort((a, b) => a.startTime.seconds - b.startTime.seconds);

    // 2. Group Consecutive Slots into Sessions
    const sessions: any[] = [];
    let currentSession: any = null;

    relevantSlots.forEach(slot => {
        const startTime = slot.startTime.toDate();
        const endTime = slot.endTime?.toDate?.() || addMinutes(startTime, 5);
        
        const isConsecutive = currentSession && 
            currentSession.teacherId === slot.teacherId &&
            currentSession.childId === slot.childId &&
            currentSession.packageCode === slot.packageCode &&
            currentSession.status === slot.status &&
            // Check if this slot starts exactly when the previous one ended (or very close)
            Math.abs(startTime.getTime() - currentSession.lastEndTime.getTime()) < 2000;

        if (isConsecutive) {
            currentSession.lastEndTime = endTime;
            currentSession.slotIds.push(slot.id);
        } else {
            currentSession = {
                ...slot,
                firstStartTime: startTime,
                lastEndTime: endTime,
                slotIds: [slot.id]
            };
            sessions.push(currentSession);
        }
    });

    // 3. Finalize Stats based on Sessions
    const completedSessions = sessions.filter(s => {
        const isPast = s.lastEndTime < now;
        return s.status === 'completed' || (s.status === 'booked' && isPast);
    });
    
    const cancelledSessions = sessions.filter(s => s.status === 'cancelled' && s.cancelledBy === 'teacher');
    const students = new Set(sessions.filter(s => s.status === 'booked' || s.status === 'completed').map(s => s.childId).filter(Boolean));

    const breakdown: any = {};
    let totalMonthlyEarnings = 0;
    let totalMonthlyCount = 0;

    completedSessions.forEach(session => {
        const key = getCourseKey(session.packageCode);
        if (!breakdown[key]) {
            breakdown[key] = { lifetime: 0, monthly: 0, rate: teacher.lessonRates?.[key] || teacher.lessonRate || 0 };
        }
        
        breakdown[key].lifetime++;

        const lessonDate = session.firstStartTime;
        if (lessonDate >= startOfViewMonth && lessonDate <= endOfViewMonth) {
            breakdown[key].monthly++;
            totalMonthlyCount++;
            totalMonthlyEarnings += breakdown[key].rate;
        }
    });

    return {
      completedCount: completedSessions.length,
      studentCount: students.size,
      cancellations: cancelledSessions.sort((a, b) => b.startTime.seconds - a.startTime.seconds),
      breakdown,
      totalMonthlyEarnings,
      totalMonthlyCount
    };
  }, [slots, teacher, selectedMonth]);

  const courseNames: any = {
      baslangic: 'Başlangıç Kursu',
      konusma: 'Konuşma Kursu',
      gelisim: 'Gelişim Kursu',
      akademik: 'Akademik Kurs',
      gcse: 'GCSE Türkçe',
      FREE_TRIAL: 'Deneme Dersi',
      OTHER: 'Diğer'
  };

  const months = useMemo(() => {
      const result = [];
      const now = new Date();
      for (let i = 0; i < 12; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          result.push(date);
      }
      return result;
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border-none shadow-2xl p-0 font-sans">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
            <DialogHeader className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-4 border-white/10 shadow-2xl">
                            <AvatarFallback className="bg-indigo-600 text-white font-black text-2xl">
                                {teacher?.firstName?.[0]}{teacher?.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-3xl font-black text-white">{teacher?.firstName} {teacher?.lastName}</DialogTitle>
                            <DialogDescription className="text-slate-400 font-medium">Performans Analizi ve Hak Edişler</DialogDescription>
                        </div>
                    </div>
                    
                    {/* Month Selector */}
                    <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10 flex items-center gap-1">
                        <Select 
                            value={format(selectedMonth, 'yyyy-MM')} 
                            onValueChange={(val) => setSelectedMonth(new Date(val + '-01'))}
                        >
                            <SelectTrigger className="w-[180px] bg-transparent border-none text-white font-bold h-10 focus:ring-0">
                                <CalendarIcon className="w-4 h-4 mr-2 text-indigo-400" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                {months.map((m) => (
                                    <SelectItem key={format(m, 'yyyy-MM')} value={format(m, 'yyyy-MM')} className="font-bold text-slate-700">
                                        {format(m, 'MMMM yyyy', { locale: tr })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </DialogHeader>
        </div>

        <div className="p-4 sm:p-8 space-y-8 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-6 rounded-[24px] border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Toplam Ders</p>
                    <p className="text-4xl font-black text-indigo-900 tracking-tighter">{isLoading ? '...' : stats.completedCount}</p>
                    <p className="text-[10px] font-bold text-indigo-300 mt-1 uppercase tracking-tight">Ömür Boyu Tamamlanan</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{format(selectedMonth, 'MMMM', { locale: tr })} Kazancı</p>
                    <p className="text-4xl font-black text-emerald-700 tracking-tighter">€{isLoading ? '...' : stats.totalMonthlyEarnings.toLocaleString('tr-TR')}</p>
                    <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-tight">{stats.totalMonthlyCount} Tamamlanan Ders</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-[24px] border border-blue-100">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Öğrenci Havuzu</p>
                    <p className="text-4xl font-black text-blue-800 tracking-tighter">{isLoading ? '...' : stats.studentCount}</p>
                    <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-tight">Toplam Farklı Öğrenci</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <Presentation className="w-4 h-4 text-indigo-500" /> {format(selectedMonth, 'MMMM yyyy', { locale: tr })} Hak Ediş Detayları
                    </h3>
                    <Badge variant="outline" className="text-slate-400 font-bold border-slate-200">
                        {stats.totalMonthlyCount} Ders
                    </Badge>
                </div>
                <div className="border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-black text-[10px] uppercase text-slate-400 py-4 pl-6">Kurs Türü</TableHead>
                                <TableHead className="font-black text-[10px] uppercase text-slate-400 text-center">Birim Ücret</TableHead>
                                <TableHead className="font-black text-[10px] uppercase text-slate-400 text-center">Ders Adedi</TableHead>
                                <TableHead className="font-black text-[10px] uppercase text-slate-400 text-right pr-6">Toplam Kazanç</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(stats.breakdown).length > 0 ? Object.entries(stats.breakdown).map(([key, data]: [string, any]) => (
                                <TableRow key={key} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-bold text-slate-700 py-4 pl-6 text-sm">{courseNames[key] || key}</TableCell>
                                    <TableCell className="text-center font-bold text-slate-500 text-sm">€{data.rate}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-black text-[10px]">{data.monthly}</Badge>
                                            <span className="text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-tighter">Bu Ay</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 font-black text-slate-800 text-sm">€{(data.monthly * data.rate).toLocaleString('tr-TR')}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-12 text-center text-slate-400 font-bold italic text-xs uppercase tracking-widest">Seçili ayda ders verisi bulunamadı.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" /> Mazeretli İptaller (Tüm Zamanlar)
                </h3>
                <div className="grid grid-cols-1 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {stats.cancellations.length > 0 ? stats.cancellations.map((c: any, i: number) => (
                        <div key={i} className="p-4 bg-red-50/20 rounded-2xl border border-red-100/50 flex justify-between items-center group hover:bg-red-50 transition-colors">
                            <div>
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-0.5">
                                    {c.startTime.toDate().toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs font-bold text-slate-700 italic">"{c.cancelReason || 'Mazeret belirtilmedi.'}"</p>
                            </div>
                            <Badge className="bg-red-500 text-white font-black text-[8px] uppercase tracking-tighter">İPTAL</Badge>
                        </div>
                    )) : (
                        <div className="py-8 bg-slate-50/50 rounded-[20px] border border-dashed text-center text-slate-400 font-bold italic text-[10px] uppercase tracking-wider">İptal edilen ders bulunmuyor.</div>
                    )}
                </div>
            </div>
        </div>
        
        <DialogFooter className="p-6 bg-slate-50 rounded-b-[32px] border-t">
            <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all">
                Raporu Kapat
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
