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

export default function IndirimlerPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [code, setCode] = useState('');
  const [discountPct, setDiscountPct] = useState('20');
  const [isPublicDisplay, setIsPublicDisplay] = useState(false);
  const [applicableCourseId, setApplicableCourseId] = useState('all');
  const [applicablePackage, setApplicablePackage] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);

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
            applicableCourseId: applicableCourseId === 'all' ? null : applicableCourseId,
            applicablePackage: applicablePackage === 'all' ? null : parseInt(applicablePackage),
            createdAt: serverTimestamp()
        });
        toast({ title: 'Başarılı', description: 'İndirim kodu oluşturuldu.' });
        setCode('');
        setDiscountPct('20');
        setIsPublicDisplay(false);
        setApplicableCourseId('all');
        setApplicablePackage('all');
    } catch (error) {
        console.error("Coupon creation error:", error);
        toast({ variant: 'destructive', title: 'Hata', description: 'İndirim kodu oluşturulamadı.' });
    } finally {
        setIsProcessing(false);
    }
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
              <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="space-y-2 flex-1">
                     <Label>Geçerli Kurs</Label>
                     <Select value={applicableCourseId} onValueChange={setApplicableCourseId}>
                        <SelectTrigger>
                           <SelectValue placeholder="Tüm Kurslar" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">Tüm Kurslar</SelectItem>
                           <SelectItem value="baslangic">Başlangıç Kursu</SelectItem>
                           <SelectItem value="konusma">Konuşma Kursu</SelectItem>
                           <SelectItem value="akademik">Akademik Kurs</SelectItem>
                           <SelectItem value="gelisim">Gelişim Kursu</SelectItem>
                           <SelectItem value="gcse">GCSE Kursu</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2 flex-1">
                     <Label>Geçerli Paket</Label>
                     <Select value={applicablePackage} onValueChange={setApplicablePackage}>
                        <SelectTrigger>
                           <SelectValue placeholder="Tüm Paketler" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">Tüm Paketler</SelectItem>
                           <SelectItem value="4">4 Derslik Paket</SelectItem>
                           <SelectItem value="8">8 Derslik Paket</SelectItem>
                           <SelectItem value="12">12 Derslik Paket</SelectItem>
                           <SelectItem value="24">24 Derslik Paket</SelectItem>
                        </SelectContent>
                     </Select>
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
                                        {coupon.applicableCourseId ? (
                                            <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700 bg-blue-50">
                                                Sadece: {
                                                    coupon.applicableCourseId === 'baslangic' ? 'Başlangıç' :
                                                    coupon.applicableCourseId === 'konusma' ? 'Konuşma' :
                                                    coupon.applicableCourseId === 'akademik' ? 'Akademik' :
                                                    coupon.applicableCourseId === 'gelisim' ? 'Gelişim' :
                                                    coupon.applicableCourseId === 'gcse' ? 'GCSE' : coupon.applicableCourseId
                                                }
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] text-slate-400">Tüm Kurslar</Badge>
                                        )}
                                        {coupon.applicablePackage ? (
                                            <Badge variant="outline" className="text-[10px] border-purple-200 text-purple-700 bg-purple-50">
                                                Sadece: {coupon.applicablePackage} Derslik
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] text-slate-400">Tüm Paketler</Badge>
                                        )}
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
