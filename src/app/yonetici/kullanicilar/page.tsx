'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, collectionGroup } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
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
import { Loader2, User, MapPin, Calendar, Tag as TagIcon, MoreHorizontal, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format, differenceInDays, isBefore } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ParentData extends any {
    id: string;
    computedTags: string[];
    lastPurchaseDate?: Date;
    countryName: string;
}

export default function UsersPage() {
  const db = useFirestore();
  const [allChildren, setAllChildren] = useState<any[]>([]);
  const [allSlots, setAllSlots] = useState<any[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(true);

  // 1. Fetch Parents
  const parentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'parent'));
  }, [db]);

  const { data: parents, isLoading: parentsLoading } = useCollection(parentsQuery);

  // 2. Fetch all children and slots for tag computation
  useEffect(() => {
    const fetchData = async () => {
        if (!db) return;
        setLoadingExtras(true);
        try {
            const childSnap = await getDocs(query(collectionGroup(db, 'children')));
            setAllChildren(childSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, parentId: doc.ref.parent.parent?.id })));

            const slotSnap = await getDocs(query(collection(db, 'lesson-slots'), where('status', '==', 'booked')));
            setAllSlots(slotSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        } catch (e) {
            console.error("Error fetching admin extras:", e);
        } finally {
            setLoadingExtras(false);
        }
    };
    fetchData();
  }, [db]);

  const getCountryFromPhone = (phone: string) => {
    const cleanPhone = (phone || "").replace(/\s/g, "");
    if (cleanPhone.startsWith("+90")) return "Türkiye";
    if (cleanPhone.startsWith("+49")) return "Almanya";
    if (cleanPhone.startsWith("+44")) return "İngiltere";
    if (cleanPhone.startsWith("+41")) return "İsviçre";
    if (cleanPhone.startsWith("+33")) return "Fransa";
    if (cleanPhone.startsWith("+31")) return "Hollanda";
    if (cleanPhone.startsWith("+32")) return "Belçika";
    if (cleanPhone.startsWith("+43")) return "Avusturya";
    if (cleanPhone.startsWith("+1")) return "ABD/Kanada";
    return "Bilinmiyor";
  };

  const processedParents = useMemo(() => {
    if (!parents || loadingExtras) return [];

    return parents.map(parent => {
        const tags = new Set<string>(['registered']);
        const parentChildren = allChildren.filter(c => c.parentId === parent.id);
        const parentSlots = allSlots.filter(s => s.bookedBy === parent.id);
        
        // Trial logic
        const hasTrial = parentSlots.some(s => s.packageCode === 'FREE_TRIAL');
        if (hasTrial) tags.add('trial');
        
        const hasFinishedTrial = parentSlots.some(s => s.packageCode === 'FREE_TRIAL' && isBefore(s.startTime.toDate(), new Date()));
        if (hasFinishedTrial) tags.add('trialdone');

        // Active/Package logic
        const hasActivePackage = parentChildren.some(c => c.assignedPackage && c.remainingLessons > 0) || (parent.enrolledPackages?.length > 0);
        if (hasActivePackage) tags.add('active');

        const packageFinished = parentChildren.some(c => c.finishedPackage && !c.assignedPackage);
        if (packageFinished) tags.add('package finished');

        // Churn logic (No active package and registration > 1 month)
        if (!hasActivePackage && parent.createdAt) {
            const regDate = parent.createdAt.toDate();
            if (differenceInDays(new Date(), regDate) > 30) {
                tags.add('churn');
            }
        }

        // Course Specific Tags
        const allPackageCodes = [
            ...(parent.enrolledPackages || []),
            ...parentChildren.map(c => c.assignedPackage),
            ...parentChildren.map(c => c.finishedPackage)
        ].filter(Boolean);

        allPackageCodes.forEach(code => {
            if (code.includes('B')) tags.add('bk');
            if (code.includes('K')) tags.add('kk');
            if (code.includes('A')) tags.add('ak');
            if (code.includes('G')) tags.add('gk');
            if (code.includes('GCSE')) tags.add('gcse');
        });

        // Add manual tags if they exist in DB
        (parent.tags || []).forEach((t: string) => tags.add(t));

        return {
            ...parent,
            countryName: getCountryFromPhone(parent.phoneNumber),
            computedTags: Array.from(tags),
            lastPurchaseDate: parentSlots
                .filter(s => s.packageCode !== 'FREE_TRIAL')
                .sort((a,b) => b.startTime.seconds - a.startTime.seconds)[0]?.startTime?.toDate()
        } as ParentData;
    });
  }, [parents, allChildren, allSlots, loadingExtras]);

  const tagStyles: { [key: string]: string } = {
    registered: 'bg-slate-100 text-slate-600',
    trial: 'bg-blue-100 text-blue-700',
    trialdone: 'bg-indigo-100 text-indigo-700',
    active: 'bg-emerald-100 text-emerald-700 font-bold',
    'package finished': 'bg-orange-100 text-orange-700',
    churn: 'bg-red-100 text-red-700',
    bk: 'bg-yellow-100 text-yellow-800',
    kk: 'bg-teal-100 text-teal-800',
    ak: 'bg-purple-100 text-purple-800',
    gk: 'bg-cyan-100 text-cyan-800',
    gcse: 'bg-blue-600 text-white',
    positive: 'bg-pink-100 text-pink-700',
    problem: 'bg-black text-white',
    discountlover: 'bg-amber-100 text-amber-900',
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Veli Yönetimi</h1>
            <p className="text-muted-foreground mt-1">Kayıtlı veliler, satın alma geçmişleri ve otomatik etiketler.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[24px]">
        <CardHeader className="bg-white border-b pb-6">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <User className="w-5 h-5 text-primary" /> Veliler ({processedParents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {parentsLoading || loadingExtras ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Veriler Analiz Ediliyor...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-bold text-slate-500 py-5 pl-8">Veli Bilgisi</TableHead>
                  <TableHead className="font-bold text-slate-500">Ülke</TableHead>
                  <TableHead className="font-bold text-slate-500">Kayıt Tarihi</TableHead>
                  <TableHead className="font-bold text-slate-500">Son Satın Alım</TableHead>
                  <TableHead className="font-bold text-slate-500">Etiketler</TableHead>
                  <TableHead className="w-[80px] text-right pr-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedParents.map((parent) => (
                  <TableRow key={parent.id} className="hover:bg-slate-50/30 transition-colors border-slate-100">
                    <TableCell className="py-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                            {parent.firstName?.[0]}{parent.lastName?.[0]}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-700 truncate">{parent.firstName} {parent.lastName}</span>
                            <span className="text-[10px] text-slate-400 font-medium lowercase truncate">{parent.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-sm">
                            <MapPin className="w-3.5 h-3.5 text-slate-300" />
                            {parent.countryName}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                            {parent.createdAt ? format(parent.createdAt.toDate(), 'dd MMM yyyy', { locale: tr }) : '-'}
                        </div>
                    </TableCell>
                    <TableCell>
                        {parent.lastPurchaseDate ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                                <ShoppingBag className="w-3.5 h-3.5" />
                                {format(parent.lastPurchaseDate, 'dd MMM yyyy', { locale: tr })}
                            </div>
                        ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">HİÇ ALMADI</span>
                        )}
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                            {parent.computedTags.map((tag) => (
                                <Badge key={tag} variant="secondary" className={cn("text-[9px] px-2 py-0.5 border-none font-bold uppercase tracking-tighter", tagStyles[tag] || 'bg-slate-100 text-slate-500')}>
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                </Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-48">
                                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase mb-1">İşlemler</DropdownMenuLabel>
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5">
                                    Profil Detayı
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5">
                                    Etiketleri Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg font-bold text-xs py-2.5 text-red-500 focus:text-red-500">
                                    Kullanıcıyı Yasakla
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
