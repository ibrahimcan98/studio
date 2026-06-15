'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, updateDoc, collectionGroup, getDocs } from 'firebase/firestore';
import { Loader2, Crown, ChevronDown, ChevronUp, Search, TrendingUp, Users, AlertCircle, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUBSCRIPTION_TIERS, ChildCount, BillingPeriod } from '@/constants/subscriptions';
import { cn } from '@/lib/utils';

const UserRowWithChildren = ({ u, formatPeriod }: { u: any, formatPeriod: (p?: string) => string }) => {
    const db = useFirestore();
    const [isExpanded, setIsExpanded] = useState(false);

    const childrenQuery = useMemoFirebase(() => {
        if (!db || !u.id) return null;
        return query(collection(db, 'users', u.id, 'children'));
    }, [db, u.id]);

    const { data: children, isLoading } = useCollection(childrenQuery);

    const periodEnd = u.subscriptionPeriodEnd?.toDate ? u.subscriptionPeriodEnd.toDate() : (u.subscriptionPeriodEnd ? new Date(u.subscriptionPeriodEnd) : null);
    const isFree = u.subscriptionTier === 'free' || !u.subscriptionTier;
    const isManual = !u.stripeSubscriptionId && !isFree;
    const isCancelledAtPeriodEnd = !!u.subscriptionCancelledAtPeriodEnd;
    const isFullyCancelled = u.subscriptionTier === 'free' && !!u.subscriptionCancelledAt;

    const handleTogglePremiumAdmin = async (childId: string) => {
        if (!db || !u.id) return;
        const currentIds = u.subscriptionChildIds || [];
        let newIds = [...currentIds];
        if (newIds.includes(childId)) {
            newIds = newIds.filter(id => id !== childId);
        } else {
            newIds.push(childId);
        }
        try {
            const userRef = doc(db, 'users', u.id);
            const updates: any = { subscriptionChildIds: newIds };
            
            // Eğer kullanıcı ücretsizse ve bir çocuğa premium atanıyorsa, onu manuel olarak Maceracı yapalım
            if ((u.subscriptionTier === 'free' || !u.subscriptionTier) && newIds.length > 0) {
                updates.subscriptionTier = 'adventurer';
                updates.subscriptionChildLimit = Math.max(1, newIds.length);
            } else if (u.subscriptionTier === 'adventurer' && !u.stripeSubscriptionId && newIds.length === 0) {
                // Eğer manuel olarak Maceracı yapılmış bir üyenin tüm atamaları kaldırılıyorsa, tekrar ücretsiz yapalım
                updates.subscriptionTier = 'free';
            }
            
            await updateDoc(userRef, updates);
        } catch (error) {
            console.error('Atama hatasi:', error);
        }
    };

    return (
        <>
            <tr onClick={() => setIsExpanded(!isExpanded)} className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}>
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
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-black tracking-tighter">KAHRAMAN ({u.subscriptionChildLimit || 1} ÇOCUK)</Badge>
                    ) : u.subscriptionTier === 'adventurer' ? (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none font-black tracking-tighter">MACERACI ({u.subscriptionChildLimit || 1} ÇOCUK)</Badge>
                    ) : (
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-black tracking-tighter">ÜCRETSİZ</Badge>
                    )}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">
                    {isFree ? '-' : formatPeriod(u.subscriptionPeriod)}
                </td>
                <td className="px-6 py-4">
                    {isFullyCancelled ? (
                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">İptal Edildi</Badge>
                    ) : isCancelledAtPeriodEnd ? (
                        <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">İptal Edilecek</Badge>
                    ) : isManual ? (
                        <Badge variant="outline" className="text-slate-500 border-slate-200">Manuel Atama</Badge>
                    ) : isFree ? (
                        <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50">Ücretsiz</Badge>
                    ) : (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Aktif</Badge>
                    )}
                </td>
                <td className="px-6 py-4 font-medium">
                    {periodEnd ? format(periodEnd, 'dd MMMM yyyy', { locale: tr }) : (isFree ? <span className="text-slate-400 italic">-</span> : (isManual ? <span className="text-slate-400 italic">Süresiz (Manuel)</span> : <span className="text-slate-400 italic">Hesaplanıyor...</span>))}
                </td>
                <td className="px-6 py-4 text-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                    </Button>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-slate-50/50 border-b border-slate-100">
                    <td colSpan={6} className="px-6 py-4 pb-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {children?.map((child: any) => {
                                    const completedTopics = child.completedTopics || [];
                                    // Eski kullanıcıların verilerinde sadece alt aşamalar (örn: hayvanlar-quiz) olduğu için, 
                                    // kaç tane '-quiz' bitirildiyse o kadar ada tamamlanmış sayıyoruz.
                                    const island = completedTopics.filter((t: string) => t.endsWith('-quiz')).length + 1;
                                    const chest = Math.floor(completedTopics.filter((t: string) => t.startsWith('chest-')).length / 3) + 1;
                                    const stories = Object.keys(child.stats?.story || {}).length;
                                    const aiMinutes = Math.floor((child.stats?.ai?.dailyUsageSeconds || 0) / 60);

                                    return (
                                        <div key={child.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-slate-300 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="font-bold text-lg text-primary">{child.firstName?.[0] || child.name?.[0] || 'Ç'}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-800">{child.firstName || child.name || 'İsimsiz Çocuk'}</span>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleTogglePremiumAdmin(child.id);
                                                            }}
                                                            className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors hover:scale-105 active:scale-95 ${(u.subscriptionChildIds?.includes(child.id) || (!isFree && children && children.length <= (u.subscriptionChildLimit || 1))) ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                            title="Premium atamasını değiştir"
                                                        >
                                                            <Crown className="w-3 h-3" /> 
                                                            {(u.subscriptionChildIds?.includes(child.id) || (!isFree && children && children.length <= (u.subscriptionChildLimit || 1))) ? 'Premium' : 'Ata'}
                                                        </button>
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-medium">İlerleme Özeti</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                <div className="flex flex-col bg-sky-50/50 p-2.5 rounded-xl border border-sky-100/50">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-sky-600 mb-1">Macera Haritası</span>
                                                    <span className="font-black text-slate-700 text-sm">{island}. Ada</span>
                                                </div>
                                                <div className="flex flex-col bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 mb-1">Türkçe Hazinem</span>
                                                    <span className="font-black text-slate-700 text-sm">{chest}. Sandık</span>
                                                </div>
                                                <div className="flex flex-col bg-purple-50/50 p-2.5 rounded-xl border border-purple-100/50">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600 mb-1">Hikayeler</span>
                                                    <span className="font-black text-slate-700 text-sm">{stories} Tamamlandı</span>
                                                </div>
                                                <div className="flex flex-col bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 mb-1">Yapay Zeka</span>
                                                    <span className="font-black text-slate-700 text-sm">{aiMinutes} Dk Kullanıldı</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!children || children.length === 0) && (
                                    <div className="col-span-full text-sm text-slate-500 italic p-4 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                                        Bu velinin henüz kayıtlı bir çocuğu bulunmuyor.
                                    </div>
                                )}
                            </div>
                        )}
                    </td>
                </tr>
            )}
        </>
    );
};

export default function UyeliklerPage() {
    const db = useFirestore();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelling' | 'cancelled' | 'free'>('all');
    const [sortBy, setSortBy] = useState<'default' | 'newest' | 'oldest' | 'email' | 'level'>('default');
    const [childrenMaxLevels, setChildrenMaxLevels] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!db) return;
        getDocs(collectionGroup(db, 'children')).then(snap => {
            const levels: Record<string, number> = {};
            snap.forEach(doc => {
                const parentId = doc.ref.parent.parent?.id;
                if (!parentId) return;
                const data = doc.data();
                const completedTopics = data.completedTopics?.length || 0;
                levels[parentId] = Math.max(levels[parentId] || 0, completedTopics);
            });
            setChildrenMaxLevels(levels);
        }).catch(err => console.error("Çocukları çekerken hata:", err));
    }, [db]);

    const uyelerQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'users'));
    }, [db]);

    const { data: allUsers, isLoading } = useCollection(uyelerQuery);

    const stats = useMemo(() => {
        if (!allUsers) return { active: 0, cancelling: 0, cancelled: 0, free: 0, mrr: 0 };
        let active = 0, cancelling = 0, cancelled = 0, free = 0, mrr = 0;
        
        allUsers.forEach((u: any) => {
            if (u.role === 'teacher' || u.role === 'admin') return;

            const isFullyCancelled = u.subscriptionTier === 'free' && !!u.subscriptionCancelledAt;
            const isCancelling = !!u.subscriptionCancelledAtPeriodEnd;
            const isFree = (u.subscriptionTier === 'free' || !u.subscriptionTier) && !u.stripeSubscriptionId && !isFullyCancelled;
            const isActive = (u.subscriptionTier === 'adventurer' || u.subscriptionTier === 'hero' || u.stripeSubscriptionId) && !isCancelling && !isFullyCancelled;
            
            if (isFullyCancelled) cancelled++;
            else if (isCancelling) cancelling++;
            else if (isActive) active++;
            else if (isFree) free++;
            
            if (isActive || isCancelling) {
                const tierId = u.subscriptionTier as 'adventurer' | 'hero';
                const tier = SUBSCRIPTION_TIERS[tierId];
                if (tier && tier.prices) {
                    const limit = (u.subscriptionChildLimit || 1) as ChildCount;
                    const period = (u.subscriptionPeriod || 'monthly') as BillingPeriod;
                    const priceStr = tier.prices[limit]?.[period]?.monthlyEquivalent;
                    if (priceStr) {
                        const val = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
                        if (!isNaN(val)) mrr += val;
                    }
                }
            }
        });
        
        return { active, cancelling, cancelled, free, mrr };
    }, [allUsers]);

    const relevantUsers = useMemoFirebase(() => {
        if (!allUsers) return [];
        
        let filtered = allUsers.filter((u: any) => {
            if (u.role === 'teacher' || u.role === 'admin') return false;
            return true;
        });

        if (statusFilter !== 'all') {
            filtered = filtered.filter((u: any) => {
                const isFullyCancelled = u.subscriptionTier === 'free' && !!u.subscriptionCancelledAt;
                const isCancelling = !!u.subscriptionCancelledAtPeriodEnd;
                const isFree = (u.subscriptionTier === 'free' || !u.subscriptionTier) && !u.stripeSubscriptionId && !isFullyCancelled;
                const isActive = (u.subscriptionTier === 'adventurer' || u.subscriptionTier === 'hero' || u.stripeSubscriptionId) && !isCancelling && !isFullyCancelled;

                if (statusFilter === 'cancelled') return isFullyCancelled;
                if (statusFilter === 'cancelling') return isCancelling;
                if (statusFilter === 'active') return isActive;
                if (statusFilter === 'free') return isFree;
                return true;
            });
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter((u: any) => 
                u.email?.toLowerCase().includes(q) || 
                u.firstName?.toLowerCase().includes(q) || 
                u.lastName?.toLowerCase().includes(q) ||
                u.stripeSubscriptionId?.toLowerCase().includes(q) ||
                u.id?.toLowerCase().includes(q)
            );
        }

        return filtered.sort((a, b) => {
            if (sortBy === 'level') {
                const levelA = childrenMaxLevels[a.id] || 0;
                const levelB = childrenMaxLevels[b.id] || 0;
                // Eğer seviyeler eşitse, default sıralama (score) kullansın
                if (levelA !== levelB) {
                    return levelB - levelA;
                }
            }
            if (sortBy === 'newest' || sortBy === 'oldest') {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
                return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
            }
            if (sortBy === 'email') {
                const emailA = (a.email || '').toLowerCase();
                const emailB = (b.email || '').toLowerCase();
                return emailA.localeCompare(emailB);
            }
            const getScore = (u: any) => {
                if (u.subscriptionTier === 'free' && !!u.subscriptionCancelledAt) return 3;
                if (!!u.subscriptionCancelledAtPeriodEnd) return 2;
                return 1;
            };
            return getScore(a) - getScore(b);
        });
    }, [allUsers, searchQuery, statusFilter, sortBy, childrenMaxLevels]);

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-4">
                <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-3xl overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center opacity-50"><TrendingUp className="w-8 h-8 text-emerald-200" /></div>
                    <CardHeader className="p-5 pb-4 relative z-10">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Aylık Tahmini Gelir (MRR)</CardDescription>
                        <CardTitle className="text-2xl font-black text-emerald-600">£{stats.mrr.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-3xl overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center opacity-50"><Users className="w-8 h-8 text-blue-200" /></div>
                    <CardHeader className="p-5 pb-4 relative z-10">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Aktif Üyeler</CardDescription>
                        <CardTitle className="text-2xl font-black text-blue-600">{stats.active}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-3xl overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center opacity-50"><AlertCircle className="w-8 h-8 text-orange-200" /></div>
                    <CardHeader className="p-5 pb-4 relative z-10">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px] text-slate-500">İptal Edilecek</CardDescription>
                        <CardTitle className="text-2xl font-black text-orange-500">{stats.cancelling}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border-none shadow-md shadow-slate-200/50 rounded-3xl overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-50 rounded-full flex items-center justify-center opacity-50"><Ban className="w-8 h-8 text-red-200" /></div>
                    <CardHeader className="p-5 pb-4 relative z-10">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px] text-slate-500">İptal Edildi</CardDescription>
                        <CardTitle className="text-2xl font-black text-red-500">{stats.cancelled}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[28px] sm:rounded-[40px] bg-white ring-1 ring-slate-100 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-6 sm:p-8 border-b border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-black text-slate-800">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Crown className="h-6 w-6 text-primary" />
                                </div>
                                Kullanıcı Üyelikleri
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm font-medium pt-1">Listelenen toplam {relevantUsers.length} kullanıcı kaydı bulunuyor.</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xl justify-end">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="E-posta, İsim vb..." 
                                    className="pl-9 bg-white border-slate-200 focus-visible:ring-primary/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                                    <SelectTrigger className="bg-white border-slate-200 text-slate-700 w-full focus:ring-primary/20">
                                        <SelectValue placeholder="Sıralama Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Duruma Göre (Varsayılan)</SelectItem>
                                        <SelectItem value="level">Ada Seviyesi (En İleri)</SelectItem>
                                        <SelectItem value="newest">Yeniden Eskiye (Tarih)</SelectItem>
                                        <SelectItem value="oldest">Eskiden Yeniye (Tarih)</SelectItem>
                                        <SelectItem value="email">E-postaya Göre (A-Z)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    
                    {/* Filtre Butonları */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        <Button size="sm" onClick={() => setStatusFilter('all')} className={cn("rounded-xl", statusFilter === 'all' ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-sm")} variant="ghost">Tümü</Button>
                        <Button size="sm" onClick={() => setStatusFilter('active')} className={cn("rounded-xl", statusFilter === 'active' ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 shadow-sm")} variant="ghost">Aktif</Button>
                        <Button size="sm" onClick={() => setStatusFilter('free')} className={cn("rounded-xl", statusFilter === 'free' ? "bg-slate-600 text-white hover:bg-slate-700 shadow-md shadow-slate-600/20" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm")} variant="ghost">Ücretsiz</Button>
                        <Button size="sm" onClick={() => setStatusFilter('cancelling')} className={cn("rounded-xl", statusFilter === 'cancelling' ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20" : "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-100 shadow-sm")} variant="ghost">İptal Edilecek</Button>
                        <Button size="sm" onClick={() => setStatusFilter('cancelled')} className={cn("rounded-xl", statusFilter === 'cancelled' ? "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20" : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-100 shadow-sm")} variant="ghost">İptal Edildi</Button>
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
                                    <th className="px-6 py-4 font-black text-center w-16">Detaylar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {relevantUsers.map((u: any) => (
                                    <UserRowWithChildren key={u.id} u={u} formatPeriod={formatPeriod} />
                                ))}
                                {relevantUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                                            {searchQuery ? 'Aramanızla eşleşen sonuç bulunamadı.' : 'Henüz aktif bir abonelik bulunmuyor.'}
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
