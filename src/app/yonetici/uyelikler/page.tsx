'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Loader2, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function UyeliklerPage() {
    const db = useFirestore();

    const uyelerQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(
            collection(db, 'users'),
            where('subscriptionTier', 'in', ['adventurer', 'hero'])
        );
    }, [db]);

    const { data: users, isLoading } = useCollection(uyelerQuery);

    if (isLoading) {
        return (
            <div className="flex h-[500px] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    const formatPeriod = (period?: string) => {
        if (!period) return 'Aylık';
        switch (period) {
            case 'monthly': return '1 Aylık';
            case 'quarterly': return '3 Aylık';
            case 'biannual': return '6 Aylık';
            case 'annual': return '12 Aylık (Yıllık)';
            default: return 'Aylık';
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8 p-2 sm:p-8 pt-6 font-sans max-w-[1600px] mx-auto">
            <div className="flex flex-col gap-2 px-1 sm:px-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 bg-clip-text text-transparent">
                    Aktif Üyelikler
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">Platformu premium paketlerle kullanan tüm velilerin listesi.</p>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[28px] sm:rounded-[40px] bg-white ring-1 ring-slate-100 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-6 sm:p-8 border-b border-slate-100 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-black text-slate-800">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Crown className="h-6 w-6 text-primary" />
                            </div>
                            Premium Üyeler
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm font-medium pt-1">Toplam {users?.length || 0} aktif abonelik bulunuyor.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-black">Kullanıcı (E-posta)</th>
                                    <th className="px-6 py-4 font-black">Paket</th>
                                    <th className="px-6 py-4 font-black">Süre</th>
                                    <th className="px-6 py-4 font-black">Durum</th>
                                    <th className="px-6 py-4 font-black">Sonraki Yenileme</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users?.map((u: any) => {
                                    const periodEnd = u.subscriptionPeriodEnd?.toDate ? u.subscriptionPeriodEnd.toDate() : (u.subscriptionPeriodEnd ? new Date(u.subscriptionPeriodEnd) : null);
                                    const isManual = !u.stripeSubscriptionId;
                                    const isCancelled = !!u.subscriptionCancelledAt;
                                    
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                                                    {u.email?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>{u.email}</span>
                                                    {u.stripeSubscriptionId && <span className="text-[10px] text-slate-400 font-normal font-mono">{u.stripeSubscriptionId}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.subscriptionTier === 'hero' ? (
                                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-black tracking-tighter">KAHRAMAN</Badge>
                                                ) : (
                                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none font-black tracking-tighter">MACERACI</Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-700">
                                                {formatPeriod(u.subscriptionPeriod)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isManual ? (
                                                    <Badge variant="outline" className="text-slate-500 border-slate-200">Manuel Atama</Badge>
                                                ) : isCancelled ? (
                                                    <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">İptal Edildi</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Aktif</Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {periodEnd ? format(periodEnd, 'dd MMMM yyyy', { locale: tr }) : (isManual ? <span className="text-slate-400 italic">Süresiz (Manuel)</span> : <span className="text-slate-400 italic">Hesaplanıyor...</span>)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                                            Henüz aktif bir abonelik bulunmuyor.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
