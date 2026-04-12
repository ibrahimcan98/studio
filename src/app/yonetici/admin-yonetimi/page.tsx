'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
    { id: 'canli-takip', label: 'Canlı İzle' },
    { id: 'inbox', label: 'Mesajlar (Inbox)' },
    { id: 'satislar', label: 'Satışlar' },
    { id: 'ogretmenler', label: 'Öğretmen Yönetimi' },
    { id: 'dersler', label: 'Ders Planlama' },
    { id: 'kullanicilar', label: 'Veliler' },
    { id: 'ogrenciler', label: 'Öğrenciler' },
    { id: 'aramalar', label: 'Aramalar' },
    { id: 'indirimler', label: 'İndirim Kuponları' },
    { id: 'puan-merkezi', label: 'Puan Merkezi' },
    { id: 'admin-yonetimi', label: 'Admin Yönetimi' },
];

export default function AdminManagementPage() {
    const { user } = useUser();
    const db = useFirestore();
    const { toast } = useToast();
    
    // Form States
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['dashboard']); // dashboard is always allowed
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Edit States
    const [editingAdmin, setEditingAdmin] = useState<any>(null);
    const [editPermissions, setEditPermissions] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    // Data Fetching
    const adminsQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'users'), where('role', '==', 'admin'));
    }, [db]);
    const { data: admins, isLoading } = useCollection(adminsQuery);

    // Ultra Super Admin Check
    const isUltraAdmin = user?.email === 'tubakodak@turkcocukakademisi.com' || user?.email === 'ibrahim-can-98@hotmail.com';

    if (!isUltraAdmin && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-6 px-4 font-sans">
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-xl shadow-red-100/50">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Erişim Engellendi</h2>
                    <p className="text-slate-500 font-medium max-w-sm">Bu sayfa sadece en üst düzey yetkili kullanıcılar tarafından görüntülenebilir.</p>
                </div>
                <Button variant="outline" className="rounded-xl px-8" onClick={() => window.history.back()}>Geri Dön</Button>
            </div>
        );
    }

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail || !newPassword) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newEmail,
                    password: newPassword,
                    permissions: selectedPermissions
                })
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Başarılı",
                    description: "Yeni admin başarıyla oluşturuldu.",
                    className: "bg-green-50 border-green-200 text-green-800"
                });
                setNewEmail('');
                setNewPassword('');
                setSelectedPermissions(['dashboard']);
            } else {
                throw new Error(data.error || 'Bir hata oluştu');
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateAdmin = async () => {
        if (!editingAdmin || !db) return;
        setIsUpdating(true);
        try {
            await updateDoc(doc(db, 'users', editingAdmin.id), {
                permissions: editPermissions
            });
            toast({
                title: "Başarılı",
                description: "Admin yetkileri güncellendi.",
                className: "bg-green-50 border-green-200 text-green-800"
            });
            setEditingAdmin(null);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: error.message
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const togglePermission = (id: string, isEdit: boolean = false) => {
        if (isEdit) {
            setEditPermissions(prev => 
                prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
            );
        } else {
            setSelectedPermissions(prev => 
                prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
            );
        }
    };

    const handleDeleteAdmin = async (adminId: string) => {
        if (!confirm('Bu admini silmek istediğinize emin misiniz? Auth kaydı duracak ancak panele girişi engellenecektir.')) return;
        
        try {
            await updateDoc(doc(db!, 'users', adminId), { 
                role: 'user', // Revoke admin role
                isActive: false 
            });
            toast({ title: "Başarılı", description: "Admin yetkisi alındı." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Hata", description: error.message });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Lütfen bekleyin...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 p-2 sm:p-8 pt-6 font-sans max-w-[1600px] mx-auto">
            {/* Header - Responsive */}
            <div className="flex flex-col gap-2 px-1 sm:px-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 bg-clip-text text-transparent">
                    Admin Yönetimi
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">Ekip arkadaşlarınızın yetkilerini belirleyin ve yönetin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Add New Admin Form Card */}
                <Card className="lg:col-span-1 border-none shadow-2xl shadow-slate-200/60 rounded-[28px] sm:rounded-[40px] bg-white ring-1 ring-slate-100 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-6 sm:p-8 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-black text-slate-800">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <UserPlus className="h-5 w-5 text-primary" />
                            </div>
                            Yeni Admin Ekle
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm font-medium pt-1">Yeni bir hesap oluşturun ve panel yetkilerini seçin.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8 space-y-6">
                        <form onSubmit={handleCreateAdmin} className="space-y-6 sm:space-y-8">
                            <div className="space-y-4 sm:space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5" /> E-posta Adresi
                                    </label>
                                    <Input 
                                        type="email" 
                                        placeholder="admin@turkcocukakademisi.com" 
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                                        <Lock className="h-3.5 w-3.5" /> Şifre
                                    </label>
                                    <Input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2 border-b border-slate-50 pb-3">
                                    <Settings2 className="h-4 w-4 text-primary/60" /> Erişim Yetkileri
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
                                    {AVAILABLE_PERMISSIONS.map((perm) => (
                                        <div key={perm.id} className="flex items-center space-x-3 p-2.5 sm:p-3 hover:bg-slate-50 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-slate-100" onClick={() => togglePermission(perm.id)}>
                                            <Checkbox 
                                                id={perm.id} 
                                                checked={selectedPermissions.includes(perm.id)}
                                                onCheckedChange={() => togglePermission(perm.id)}
                                                className="h-5 w-5 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <label 
                                                htmlFor={perm.id}
                                                className="text-xs sm:text-sm font-bold leading-none cursor-pointer flex-1 group-hover:text-primary transition-colors text-slate-600"
                                            >
                                                {perm.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl text-[13px] sm:text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    'Admin Hesabını Oluştur'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Admins List Card */}
                <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/60 rounded-[28px] sm:rounded-[40px] bg-white ring-1 ring-slate-100 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-6 sm:p-8 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-black text-slate-800">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            Kayıtlı Adminler
                            <Badge className="ml-1 bg-slate-200 text-slate-500 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-lg border-none shadow-none">
                                {admins?.length || 0}
                            </Badge>
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm font-medium pt-1">Sistemdeki tüm yetkili hesaplar ve erişim seviyeleri.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8">
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            {admins?.map((admin: any) => (
                                <div 
                                    key={admin.id} 
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 rounded-2xl sm:rounded-[32px] bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-primary font-black text-xl sm:text-2xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                            {admin.email?.[0].toUpperCase()}
                                        </div>
                                        <div className="space-y-1.5 min-w-0 pr-10 sm:pr-0">
                                            <div className="font-black text-slate-900 flex items-center gap-2 text-sm sm:text-base truncate">
                                                {admin.email}
                                                {(!admin.permissions || admin.permissions.length === 0) && (
                                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 text-[9px] py-0 border-none font-black tracking-tighter shrink-0">SÜPER ADMIN</Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {admin.permissions?.length > 0 ? (
                                                    <>
                                                        {admin.permissions.slice(0, 4).map((p: string) => (
                                                            <Badge key={p} variant="secondary" className="text-[9px] py-0 h-5 px-2 border-none text-slate-500 font-bold bg-white/80 shadow-sm">
                                                                {AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                                                            </Badge>
                                                        ))}
                                                        {admin.permissions.length > 4 && (
                                                            <Badge variant="secondary" className="text-[9px] py-0 h-5 px-2 border-none text-primary font-black bg-primary/5">
                                                                +{admin.permissions.length - 4} DAHA
                                                            </Badge>
                                                        )}
                                                    </>
                                                ) : <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tüm sekmeler açık</span>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actions - Responsive */}
                                    <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-0 w-full sm:w-auto justify-end sm:justify-start">
                                        {/* Desktop Action Buttons */}
                                        <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-10 w-10 text-primary hover:bg-primary/10 rounded-xl bg-white/50 border border-slate-100"
                                                onClick={() => {
                                                    setEditingAdmin(admin);
                                                    setEditPermissions(admin.permissions || []);
                                                }}
                                            >
                                                <Settings2 className="h-4.5 w-4.5" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-10 w-10 text-red-500 hover:bg-red-50 rounded-xl bg-white/50 border border-slate-100"
                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                disabled={admin.email === user?.email}
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
                                            </Button>
                                        </div>

                                        {/* Mobile Action Dropdown */}
                                        <div className="sm:hidden absolute top-4 right-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-100/50">
                                                        <MoreHorizontal className="w-5 h-5 text-slate-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48 font-sans">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">İşlemler</DropdownMenuLabel>
                                                    <DropdownMenuItem 
                                                        onClick={() => {
                                                            setEditingAdmin(admin);
                                                            setEditPermissions(admin.permissions || []);
                                                        }}
                                                        className="rounded-xl font-bold text-xs py-3 px-3 gap-3"
                                                    >
                                                        <Settings2 className="w-4 h-4 text-primary" /> Yetkileri Düzenle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDeleteAdmin(admin.id)}
                                                        disabled={admin.email === user?.email}
                                                        className="rounded-xl font-bold text-xs py-3 px-3 gap-3 text-red-500 focus:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Admini Sil
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Admin Permissions Dialog - Responsive */}
            <Dialog open={!!editingAdmin} onOpenChange={(open) => !open && setEditingAdmin(null)}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[32px] sm:rounded-[40px] border-none shadow-2xl font-sans">
                    <DialogHeader className="p-6 sm:p-10 bg-slate-900 text-white">
                        <DialogTitle className="text-xl sm:text-2xl font-black flex items-center gap-4">
                            <Settings2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" /> Yetkileri Düzenle
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-xs sm:text-sm pt-2">
                            {editingAdmin?.email} kullanıcısının panel üzerindeki erişim seviyesini güncelleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 sm:p-10 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 py-2 sm:py-4 max-h-[400px] overflow-y-auto px-1 custom-scrollbar">
                            {AVAILABLE_PERMISSIONS.map((perm) => (
                                <div 
                                    key={perm.id} 
                                    className={cn(
                                        "flex items-center space-x-3 p-3.5 sm:p-4 rounded-2xl transition-all group border-2 cursor-pointer outline-none",
                                        editPermissions.includes(perm.id) 
                                            ? "bg-primary/5 border-primary/20 text-primary" 
                                            : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-100"
                                    )}
                                    onClick={() => togglePermission(perm.id, true)}
                                >
                                    <Checkbox 
                                        id={`edit-${perm.id}`} 
                                        checked={editPermissions.includes(perm.id)}
                                        onCheckedChange={() => togglePermission(perm.id, true)}
                                        className="h-5 w-5 rounded-md border-2"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <label 
                                        htmlFor={`edit-${perm.id}`}
                                        className="text-xs sm:text-sm font-black leading-none cursor-pointer flex-1 group-hover:scale-[1.02] transition-transform"
                                    >
                                        {perm.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="pt-8 flex flex-col sm:flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-12 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-widest border-2" onClick={() => setEditingAdmin(null)}>İptal</Button>
                            <Button 
                                onClick={handleUpdateAdmin} 
                                disabled={isUpdating}
                                className="flex-1 h-12 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-widest bg-primary shadow-lg shadow-primary/20"
                            >
                                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Güncellemeyi Kaydet'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
