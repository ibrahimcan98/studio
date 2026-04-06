'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Ticket, CheckCircle2, XCircle, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function IndirimlerPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [code, setCode] = useState('');
  const [discountPct, setDiscountPct] = useState('20');
  const [isPublicDisplay, setIsPublicDisplay] = useState(false);
  const [applicableCourseIds, setApplicableCourseIds] = useState<string[]>([]);
  const [applicablePackages, setApplicablePackages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const COURSES_LIST = [
    { id: 'baslangic', label: 'Başlangıç' },
    { id: 'konusma', label: 'Konuşma' },
    { id: 'akademik', label: 'Akademik' },
    { id: 'gelisim', label: 'Gelişim' },
    { id: 'gcse', label: 'GCSE' }
  ];

  const PACKAGES_LIST = [4, 8, 12, 24];

  const couponsQuery = useMemoFirebase(() => 
    db ? query(collection(db, 'coupons'), orderBy('createdAt', 'desc')) : null, [db]);
    
  const { data: coupons, isLoading } = useCollection(couponsQuery);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !code || !discountPct) return;
    
    const uppercaseCode = code.toUpperCase().trim();
    const pct = parseFloat(discountPct);
    
    if (pct <= 0 || pct > 100) {
        toast({ variant: 'destructive', title: 'Hata', description: 'İndirim yüzdesi 1 ile 100 arasında olmalıdır.' });
        return;
    }

    setIsProcessing(true);
    try {
        await setDoc(doc(db, 'coupons', uppercaseCode), {
            code: uppercaseCode,
            discountPct: pct / 100, // Convert to decimal e.g., 20 -> 0.20
            isActive: true,
            isPublicDisplay,
            applicableCourseIds: applicableCourseIds.length > 0 ? applicableCourseIds : null,
            applicablePackages: applicablePackages.length > 0 ? applicablePackages : null,
            createdAt: serverTimestamp()
        });
        toast({ title: 'Başarılı', description: 'İndirim kodu oluşturuldu.' });
        setCode('');
        setDiscountPct('20');
        setIsPublicDisplay(false);
        setApplicableCourseIds([]);
        setApplicablePackages([]);
    } catch (error) {
        console.error("Coupon creation error:", error);
        toast({ variant: 'destructive', title: 'Hata', description: 'İndirim kodu oluşturulamadı.' });
    } finally {
        setIsProcessing(false);
    }
  };

  const toggleCourse = (id: string) => {
    setApplicableCourseIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const togglePackage = (pkg: number) => {
    setApplicablePackages(prev => 
        prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg]
    );
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    if (!db) return;
    try {
        await updateDoc(doc(db, 'coupons', id), {
            isActive: !currentStatus
        });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Hata', description: 'Durum güncellenemadı.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (!confirm(`"${id}" kodunu silmek istediğinize emin misiniz?`)) return;
    try {
        await deleteDoc(doc(db, 'coupons', id));
        toast({ title: 'Silindi', description: 'İndirim kodu silindi.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Hata', description: 'İndirim kodu silinemedi.' });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
             <Ticket className="w-8 h-8 text-primary" /> İndirim Kodları
          </h2>
          <p className="text-slate-500">Kullanıcıların sepetlerinde kullanabileceği dinamik indirim kodlarını yönetin.</p>
        </div>
      </div>

      <Card className="border-2 border-primary/10 shadow-sm">
        <CardHeader>
           <CardTitle>Yeni Kod Oluştur</CardTitle>
           <CardDescription>Müşterilere verilecek yeni bir indirim kuponu tanımlayın.</CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={handleCreateCoupon} className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="space-y-2 flex-1">
                     <Label htmlFor="code">Kupon Kodu</Label>
                     <Input id="code" placeholder="Örn: YAZINDİRİMİ" value={code} onChange={e => setCode(e.target.value.toUpperCase())} required />
                  </div>
                  <div className="space-y-2 flex-1">
                     <Label htmlFor="pct">İndirim Yüzdesi (%)</Label>
                     <Input id="pct" type="number" min="1" max="100" placeholder="Örn: 20" value={discountPct} onChange={e => setDiscountPct(e.target.value)} required />
                  </div>
                  <Button type="submit" disabled={isProcessing} className="font-bold sm:w-auto w-full h-10 px-8">
                     {isProcessing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                     Kodu Oluştur
                  </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <Label className="text-sm font-bold text-slate-700">Geçerli Kurslar (Seçilmezse tümü için geçerlidir)</Label>
                     <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 min-h-[60px]">
                        {COURSES_LIST.map(course => (
                            <Badge 
                                key={course.id}
                                variant={applicableCourseIds.includes(course.id) ? "default" : "outline"}
                                className={cn(
                                    "cursor-pointer py-1.5 px-4 rounded-full transition-all border-2",
                                    applicableCourseIds.includes(course.id) 
                                        ? "bg-primary border-primary text-white shadow-md" 
                                        : "bg-white border-slate-200 text-slate-500 hover:border-primary/30"
                                )}
                                onClick={() => toggleCourse(course.id)}
                            >
                                {course.label}
                            </Badge>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-3">
                     <Label className="text-sm font-bold text-slate-700">Geçerli Paketler (Seçilmezse tümü için geçerlidir)</Label>
                     <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 min-h-[60px]">
                        {PACKAGES_LIST.map(pkg => (
                            <Badge 
                                key={pkg}
                                variant={applicablePackages.includes(pkg) ? "default" : "outline"}
                                className={cn(
                                    "cursor-pointer py-1.5 px-4 rounded-full transition-all border-2",
                                    applicablePackages.includes(pkg) 
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                                        : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"
                                )}
                                onClick={() => togglePackage(pkg)}
                            >
                                {pkg} Derslik
                            </Badge>
                        ))}
                     </div>
                  </div>
              </div>
              <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                 <Switch id="public-display" checked={isPublicDisplay} onCheckedChange={setIsPublicDisplay} />
                 <div className="space-y-0.5 max-w-lg">
                    <Label htmlFor="public-display" className="font-bold text-slate-800 cursor-pointer">Site Geneli Kampanya (Vitrin)</Label>
                    <p className="text-xs text-slate-500 font-medium">Bu kodu Kurslar sayfasında tüm müşterilere göster ve sepete otomatik uygula.</p>
                 </div>
              </div>
           </form>
        </CardContent>
      </Card>

      <Card>
         <CardHeader>
             <CardTitle>Aktif ve Kayıtlı Kodlar</CardTitle>
         </CardHeader>
         <CardContent>
            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
            ) : coupons?.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">Sistemde hiç indirim kodu bulunmuyor.</div>
            ) : (
                <div className="border rounded-xl divide-y">
                    {coupons?.map(coupon => (
                        <div key={coupon.id} className={`flex flex-col sm:flex-row items-center justify-between p-4 transition-colors ${!coupon.isActive ? 'bg-slate-50 opacity-60' : 'bg-white'}`}>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="bg-primary/10 p-3 rounded-lg"><Ticket className="w-6 h-6 text-primary" /></div>
                                <div>
                                     <h3 className="text-lg font-black font-mono tracking-wider">{coupon.code}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                       <Badge variant={coupon.isActive ? "default" : "secondary"}>
                                           {coupon.isActive ? 'Aktif' : 'Pasif'}
                                       </Badge>
                                       {coupon.isPublicDisplay && (
                                           <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">VİTRİN KAMPANYASI</Badge>
                                       )}
                                       <span className="text-sm font-bold text-green-600">%{(coupon.discountPct * 100).toFixed(0)} İndirim</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(() => {
                                            const c_ids = coupon.applicableCourseIds || (coupon.applicableCourseId ? [coupon.applicableCourseId] : []);
                                            if (c_ids.length > 0) {
                                                return c_ids.map((id: string) => (
                                                    <Badge key={id} variant="outline" className="text-[10px] border-blue-200 text-blue-700 bg-blue-50">
                                                        Sadece: {COURSES_LIST.find(c => c.id === id)?.label || id}
                                                    </Badge>
                                                ));
                                            }
                                            return <Badge variant="outline" className="text-[10px] text-slate-400">Tüm Kurslar</Badge>;
                                        })()}
                                        {(() => {
                                            const c_pkgs = coupon.applicablePackages || (coupon.applicablePackage ? [Number(coupon.applicablePackage)] : []);
                                            if (c_pkgs.length > 0) {
                                                return c_pkgs.map((pkg: number) => (
                                                    <Badge key={pkg} variant="outline" className="text-[10px] border-purple-200 text-purple-700 bg-purple-50">
                                                        Sadece: {pkg} Derslik
                                                    </Badge>
                                                ));
                                            }
                                            return <Badge variant="outline" className="text-[10px] text-slate-400">Tüm Paketler</Badge>;
                                        })()}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                                <div className="flex items-center gap-2">
                                    <Switch checked={coupon.isActive} onCheckedChange={() => handleToggleActive(coupon.id, coupon.isActive)} />
                                    <span className="text-xs text-slate-500">{coupon.isActive ? 'Durdur' : 'Başlat'}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(coupon.id)}>
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
         </CardContent>
      </Card>
    </div>
  );
}
