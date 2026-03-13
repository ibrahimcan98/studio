'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function AdminTeachersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    hobbies: '',
    googleMeetLink: '',
    introVideoUrl: '',
  });

  const teachersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'teacher'));
  }, [db]);

  const { data: teachers, isLoading } = useCollection(teachersQuery);

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      bio: '',
      hobbies: '',
      googleMeetLink: '',
      introVideoUrl: '',
    });
  };

  const handleAddTeacher = async () => {
    if (!db || !formData.email || !formData.firstName) return;
    setIsSubmitting(true);

    try {
      // Taslak doküman kimliği e-posta slug'ı olarak belirlenir.
      // Öğretmen bu e-posta ile kayıt olduğunda sistem onu tanır.
      const teacherId = formData.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
      const teacherRef = doc(db, 'users', teacherId);
      
      await setDoc(teacherRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.toLowerCase(),
        role: 'teacher',
        bio: formData.bio,
        hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(Boolean),
        googleMeetLink: formData.googleMeetLink,
        introVideoUrl: formData.introVideoUrl,
        createdAt: serverTimestamp(),
        isProfileComplete: true,
      });

      toast({ 
        title: 'Öğretmen Yetkilendirildi', 
        description: `${formData.email} adresi sisteme "Öğretmen" olarak tanımlandı.` 
      });
      setIsAddOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Hata', description: 'Öğretmen eklenirken bir sorun oluştu.' });
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
      firstName: teacher.firstName || '',
      lastName: teacher.lastName || '',
      bio: teacher.bio || '',
      hobbies: (teacher.hobbies || []).join(', '),
      googleMeetLink: teacher.googleMeetLink || '',
      introVideoUrl: teacher.introVideoUrl || '',
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Öğretmen Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Platformdaki öğretmenleri yetkilendirin, düzenleyin veya tüm verilerini silin.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if(!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2" /> Yeni Öğretmen Yetkilendir
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[24px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Öğretmen Yetkilendir</DialogTitle>
              <DialogDescription>Yeni bir öğretmen için veritabanında "teacher" rolüyle bir taslak oluşturun.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label>E-posta Adresi (Giriş için gereklidir)</Label>
                <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ornek@turkcocukakademisii.com" />
              </div>
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
        <CardHeader className="bg-white border-b pb-6">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <Presentation className="w-5 h-5 text-primary" /> Aktif Öğretmen Listesi ({teachers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Veriler Yükleniyor...</p>
            </div>
          ) : (
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
                      {teacher.bio ? (
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
                          <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 text-red-500 focus:text-red-500 cursor-pointer" onClick={() => handleDeleteTeacher(teacher.id)}>
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Yetkiyi ve Verileri Kaldır
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {(!teachers || teachers.length === 0) && !isLoading && (
                    <TableRow>
                        <TableCell colSpan={5} className="py-20 text-center text-slate-400 font-bold italic text-sm">
                            Henüz yetkilendirilmiş bir öğretmen bulunmuyor.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
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
            <div className="space-y-2">
              <Label>Tanıtım Videosu URL'si</Label>
              <Input value={formData.introVideoUrl} onChange={e => setFormData({...formData, introVideoUrl: e.target.value})} />
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
    </div>
  );
}
