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
    const isUltraAdmin = user?.email === 'tubakodak@turkcocukakademisii.com';

    if (!isUltraAdmin && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
                <div className="bg-red-100 p-4 rounded-full"><AlertCircle className="h-10 w-10 text-red-600" /></div>
                <h2 className="text-2xl font-bold">Erişim Engellendi</h2>
                <p className="text-muted-foreground">Bu sayfa sadece Ultra Süper Admin yetkisine sahip kullanıcılar içindir.</p>
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
            <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    Admin Yönetimi
                </h1>
                <p className="text-muted-foreground">Ekip arkadaşlarınızı yönetin ve yetkilerini belirleyin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Admin Form */}
                <Card className="lg:col-span-1 border-none shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-200/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Yeni Admin Ekle
                        </CardTitle>
                        <CardDescription>Yeni bir hesap oluşturun ve yetkilerini seçin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateAdmin} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-slate-400" /> E-posta
                                    </label>
                                    <Input 
                                        type="email" 
                                        placeholder="admin@turkcocukakademisi.com" 
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="rounded-xl border-slate-200 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-slate-400" /> Şifre
                                    </label>
                                    <Input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="rounded-xl border-slate-200 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold block pb-1 border-b border-slate-100 flex items-center gap-2">
                                    <Settings2 className="h-4 w-4 text-slate-400" /> Sekme Yetkileri
                                </label>
                                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {AVAILABLE_PERMISSIONS.map((perm) => (
                                        <div key={perm.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                            <Checkbox 
                                                id={perm.id} 
                                                checked={selectedPermissions.includes(perm.id)}
                                                onCheckedChange={() => togglePermission(perm.id)}
                                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <label 
                                                htmlFor={perm.id}
                                                className="text-sm font-medium leading-none cursor-pointer flex-1 group-hover:text-primary transition-colors"
                                            >
                                                {perm.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" 
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

                {/* Admins List */}
                <Card className="lg:col-span-2 border-none shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-200/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Mevcut Adminler
                        </CardTitle>
                        <CardDescription>Sistemdeki tüm yetkili hesaplar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {admins?.map((admin: any) => (
                                <div 
                                    key={admin.id} 
                                    className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100/50 hover:border-primary/20 hover:bg-white hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform">
                                            {admin.email?.[0].toUpperCase()}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 flex items-center gap-2">
                                                {admin.email}
                                                {(!admin.permissions || admin.permissions.length === 0) && (
                                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] py-0 border-none font-black tracking-tighter">TAM YETKİ</Badge>
                                                )}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {admin.permissions?.map((p: string) => (
                                                    <Badge key={p} variant="outline" className="text-[10px] py-0 border-slate-200 text-slate-500 font-medium bg-white">
                                                        {AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-primary hover:bg-primary/10 rounded-lg"
                                            onClick={() => {
                                                setEditingAdmin(admin);
                                                setEditPermissions(admin.permissions || []);
                                            }}
                                        >
                                            <Settings2 className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
                                            onClick={() => handleDeleteAdmin(admin.id)}
                                            disabled={admin.email === user?.email}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Admin Permissions Dialog */}
            <Dialog open={!!editingAdmin} onOpenChange={(open) => !open && setEditingAdmin(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Yetkileri Düzenle</DialogTitle>
                        <DialogDescription>
                            {editingAdmin?.email} kullanıcısının erişebileceği sekmeleri seçin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto px-1">
                        {AVAILABLE_PERMISSIONS.map((perm) => (
                            <div key={perm.id} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-all group border border-transparent hover:border-slate-100">
                                <Checkbox 
                                    id={`edit-${perm.id}`} 
                                    checked={editPermissions.includes(perm.id)}
                                    onCheckedChange={() => togglePermission(perm.id, true)}
                                />
                                <label 
                                    htmlFor={`edit-${perm.id}`}
                                    className="text-sm font-semibold leading-none cursor-pointer flex-1"
                                >
                                    {perm.label}
                                </label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingAdmin(null)}>İptal</Button>
                        <Button 
                            onClick={handleUpdateAdmin} 
                            disabled={isUpdating}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Değişiklikleri Kaydet'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
