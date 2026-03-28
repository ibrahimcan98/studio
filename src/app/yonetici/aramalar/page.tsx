'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCountryFromPhone, cn } from '@/lib/utils';
import { Loader2, Phone, Search, History, Clock, PhoneOff, UserCheck, CalendarClock, UserCog, User, MapPin, Hash, PhoneCall, Copy, MoreHorizontal, ShoppingBag, Baby, FileText, Tag as TagIcon, Mail, Calendar, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProgressPanel } from '@/components/shared/progress-panel';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, isBefore, isAfter, format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ParentData {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    createdAt?: any;
    [key: string]: any;
}

export default function AramalarPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState<ParentData | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [parentChildren, setParentChildren] = useState<any[]>([]);
  const [parentSlots, setParentSlots] = useState<any[]>([]);
  const [callNote, setCallNote] = useState('');
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [isSavingCall, setIsSavingCall] = useState(false);
  const [isChildProgressOpen, setIsChildProgressOpen] = useState(false);
  const [selectedChildForProgress, setSelectedChildForProgress] = useState<any>(null);

  const parentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), where('role', '==', 'parent'));
  }, [db]);

  const { data: parents, isLoading: parentsLoading } = useCollection(parentsQuery);

  const filteredParents = useMemo(() => {
    if (!parents) return [];
    let list = [...parents];

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(p => 
            p.firstName?.toLowerCase().includes(q) ||
            p.lastName?.toLowerCase().includes(q) ||
            p.email?.toLowerCase().includes(q) ||
            p.phoneNumber?.includes(q) ||
            p.id.toLowerCase().includes(q)
        );
    }

    // Sort by recent registration
    list.sort((a,b) => {
        const aT = a.createdAt?.seconds || 0;
        const bT = b.createdAt?.seconds || 0;
        return bT - aT;
    });

    return list;
  }, [parents, searchQuery]);

  // Load extras when a parent is selected
  useEffect(() => {
    if (!db || !selectedParent) return;

    setLoadingExtras(true);
    let unsubCallLogs: any = null;

    const fetchDetails = async () => {
        try {
            // Fetch Tags
            const newTags = new Set<string>(['registered']);
            const childSnap = await getDocs(collection(db, 'users', selectedParent.id, 'children'));
            const children = childSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
            setParentChildren(children);
            
            const slotSnap = await getDocs(query(collection(db, 'lesson-slots'), where('bookedBy', '==', selectedParent.id)));
            const slots = slotSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
            setParentSlots(slots);

            const hasTrial = slots.some(s => s.packageCode === 'FREE_TRIAL');
            if (hasTrial) newTags.add('trial');
            
            const hasFinishedTrial = slots.some(s => s.packageCode === 'FREE_TRIAL' && isBefore(s.startTime.toDate(), new Date()));
            if (hasFinishedTrial) newTags.add('trialdone');

            const hasActivePackage = children.some(c => c.assignedPackage && c.remainingLessons > 0) || (selectedParent.enrolledPackages?.length > 0);
            if (hasActivePackage) newTags.add('active');

            const packageFinished = children.some(c => c.finishedPackage && !c.assignedPackage);
            if (packageFinished) newTags.add('package finished');

            if (!hasActivePackage && selectedParent.createdAt) {
                const regDate = selectedParent.createdAt.toDate();
                if (differenceInDays(new Date(), regDate) > 30) {
                    newTags.add('churn');
                }
            }

            setTags(Array.from(newTags));

            // Subscribe to Call Logs
            const logsQuery = query(collection(db, 'users', selectedParent.id, 'call-logs'), orderBy('createdAt', 'desc'));
            unsubCallLogs = onSnapshot(logsQuery, (snap) => {
                setCallLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                setLoadingExtras(false);
            });

        } catch (e) {
            console.error("Error fetching parent details:", e);
            setLoadingExtras(false);
        }
    };

    fetchDetails();

    return () => {
        if (unsubCallLogs) unsubCallLogs();
    };
  }, [selectedParent?.id, db]);

  const handleCallAction = async (statusLabel: string, colorClass: string, iconName: string) => {
    if (!db || !selectedParent || !user) return;
    setIsSavingCall(true);
    
    try {
        const callData = {
            status: statusLabel,
            color: colorClass,
            icon: iconName,
            note: callNote.trim(),
            createdAt: serverTimestamp(),
            adminId: user.uid,
            adminEmail: user.email,
        };

        // Save Call Log Subcollection
        await addDoc(collection(db, 'users', selectedParent.id, 'call-logs'), callData);
        
        // Update User Doc with latest status so it shows in the list
        await updateDoc(doc(db, 'users', selectedParent.id), { lastCallStatus: callData });

        toast({ title: 'Başarılı', description: 'Arama kaydı veritabanına eklendi.' });
        setCallNote(''); // clear note input after success
    } catch (e) {
        console.error("Error saving call log:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'Arama kaydedilirken hata oluştu.' });
    } finally {
        setIsSavingCall(false);
    }
  };

  const getStatusIcon = (iconName: string) => {
      switch(iconName) {
          case 'PhoneOff': return <PhoneOff className="w-4 h-4" />;
          case 'UserCheck': return <UserCheck className="w-4 h-4" />;
          case 'Clock': return <Clock className="w-4 h-4" />;
          case 'CalendarClock': return <CalendarClock className="w-4 h-4" />;
          default: return <PhoneCall className="w-4 h-4" />;
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden font-sans">
        <div className="flex items-center justify-between pb-4">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Telemarketing / Aramalar</h1>
                <p className="text-muted-foreground mt-1 text-sm font-medium">Velileri arayın, etiketleri görün ve arama geçmişini kaydedin.</p>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 bg-slate-50 p-2 rounded-3xl border border-slate-200/60 shadow-inner">
            
            {/* SOL PANEL (List) */}
            <div className="w-full md:w-1/3 max-w-sm flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden shrink-0 h-full">
                <div className="p-4 border-b bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input 
                            placeholder="İsim, Tel, veya ID ile Ara..." 
                            className="pl-9 h-11 bg-white border-slate-200 rounded-xl focus:ring-primary/20 transition-all font-medium text-[13px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 relative">
                    {parentsLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-30"/></div>
                    ) : filteredParents.length > 0 ? (
                        filteredParents.map(parent => {
                            const country = getCountryFromPhone(parent.phoneNumber);
                            const isSelected = selectedParent?.id === parent.id;
                            return (
                                <button 
                                    key={parent.id} 
                                    onClick={() => setSelectedParent(parent)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-xl transition-all border flex flex-col gap-2",
                                        isSelected 
                                            ? "bg-primary/5 border-primary/30 shadow-sm ring-1 ring-primary/10" 
                                            : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={cn("font-bold text-sm", isSelected ? "text-primary" : "text-slate-700")}>
                                            {parent.firstName} {parent.lastName}
                                        </span>
                                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md font-medium font-mono">
                                            {parent.id.substring(0,6).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                            <Hash className="w-3 h-3" /> {parent.phoneNumber || '-'}
                                        </span>
                                        <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1 truncate max-w-[100px]">
                                            <MapPin className="w-3 h-3" /> {country}
                                        </span>
                                    </div>
                                    {parent.lastCallStatus && (
                                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium border-t border-slate-100 pt-1.5 overflow-hidden">
                                            <span className={cn("px-1.5 py-0.5 rounded font-black max-w-[90px] truncate shrink-0", parent.lastCallStatus.color)}>
                                                {parent.lastCallStatus.status}
                                            </span>
                                            {parent.lastCallStatus.note && (
                                                <span className="text-slate-400 truncate opacity-80">{parent.lastCallStatus.note}</span>
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="text-center p-8 text-slate-400 font-medium text-sm">Sonuç bulunamadı.</div>
                    )}
                </div>
            </div>

            {/* SAĞ PANEL (Details & Actions) */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
                {selectedParent ? (
                    <div className="flex flex-col h-full relative">
                        {loadingExtras && <div className="absolute top-4 right-4"><Loader2 className="w-5 h-5 animate-spin text-primary opacity-50"/></div>}
                        
                        {/* DARK PROFILE HEADER */}
                        <div className="p-8 bg-slate-900 text-white shrink-0">
                            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-[24px] bg-primary flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20 shrink-0">
                                        {selectedParent.firstName?.[0] || 'V'}{selectedParent.lastName?.[0] || 'P'}
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-black tracking-tight">{selectedParent.firstName} {selectedParent.lastName}</h2>
                                        <div className="flex items-center flex-wrap gap-4 text-slate-400 text-sm font-medium">
                                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedParent.email}</span>
                                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selectedParent.phoneNumber || '-'}</span>
                                            <span className="text-[10px] font-mono opacity-50 bg-white/10 px-2 py-0.5 rounded ml-2 select-all uppercase">ID: {selectedParent.id.substring(0, 8).toUpperCase()}</span>
                                            <button 
                                                className="ml-2 py-1 px-2 border border-slate-700 bg-slate-800 rounded text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedParent.phoneNumber || '');
                                                    toast({title: 'Kopyalandı', description: 'Numara panoya kopyalandı.'});
                                                }}
                                            ><Copy className="w-3 h-3" /> Numarayı Kopyala</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3 shrink-0">
                                     <Badge className="bg-emerald-500 text-white border-none font-bold px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                                        {getCountryFromPhone(selectedParent.phoneNumber)}
                                    </Badge>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {tags.map(t => (
                                            <Badge key={t} className="px-2 py-0.5 text-[9px] font-black uppercase bg-white/10 text-slate-200 border-none">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CRM ACTIONS BAR (Pinned below header) */}
                        <div className="bg-slate-50 border-b p-4 px-6 flex flex-col xl:flex-row items-center justify-between gap-4 shrink-0 shadow-sm z-10">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <PhoneCall className="w-4 h-4 text-primary" /> Anlık Arama Sonucu Durum Girişi
                            </span>
                            <div className="flex items-center gap-2 w-full xl:w-auto">
                                <Input 
                                    placeholder="Veli için arama notu bırakın..." 
                                    className="h-10 text-xs bg-white rounded-xl min-w-[250px] font-medium"
                                    value={callNote}
                                    onChange={(e) => setCallNote(e.target.value)}
                                />
                                <Button disabled={isSavingCall} onClick={() => handleCallAction('Açmadı', 'bg-red-50 text-red-600 border-red-200', 'PhoneOff')} variant="outline" className="h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm rounded-xl font-bold px-4 text-xs"><PhoneOff className="w-4 h-4 mr-2"/> Açmadı</Button>
                                <Button disabled={isSavingCall} onClick={() => handleCallAction('Açtı', 'bg-emerald-50 text-emerald-600 border-emerald-200', 'UserCheck')} variant="outline" className="h-10 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm rounded-xl font-bold px-4 text-xs"><UserCheck className="w-4 h-4 mr-2"/> Açtı</Button>
                                <Button disabled={isSavingCall} onClick={() => handleCallAction('Müsait Değil', 'bg-amber-50 text-amber-600 border-amber-200', 'Clock')} variant="outline" className="h-10 border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700 shadow-sm rounded-xl font-bold px-4 text-xs"><Clock className="w-4 h-4 mr-2"/> Müsait Değil</Button>
                                <Button disabled={isSavingCall} onClick={() => handleCallAction('Daha Sonra Ara', 'bg-blue-50 text-blue-600 border-blue-200', 'CalendarClock')} variant="outline" className="h-10 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm rounded-xl font-bold px-4 text-xs"><CalendarClock className="w-4 h-4 mr-2"/> Tekrar Ara</Button>
                            </div>
                        </div>

                        {/* TABS & CONTENT */}
                        <Tabs defaultValue="calls" className="flex-1 flex flex-col min-h-0 bg-white">
                            <div className="bg-slate-100 px-6 shrink-0 border-b">
                                <TabsList className="bg-transparent gap-8 h-12 p-0">
                                    <TabsTrigger value="calls" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-12 border-none font-bold text-slate-500 px-6">Arama Geçmişi ({callLogs.length})</TabsTrigger>
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-12 border-none font-bold text-slate-500 px-6">Özet</TabsTrigger>
                                    <TabsTrigger value="children" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-12 border-none font-bold text-slate-500 px-6">Çocuklar</TabsTrigger>
                                    <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-12 border-none font-bold text-slate-500 px-6">Ders Geçmişi</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                                
                                {/* TAB: OVERVIEW */}
                                <TabsContent value="overview" className="m-0 space-y-8">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                        <Card className="bg-white border border-slate-100 shadow-sm p-6 space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kayıt Tarihi</p>
                                            <p className="text-xl font-bold text-slate-800">{selectedParent.createdAt ? format(selectedParent.createdAt.toDate?.() || new Date(selectedParent.createdAt), 'dd MMMM yyyy', { locale: tr }) : '-'}</p>
                                        </Card>
                                        <Card className="bg-white border border-slate-100 shadow-sm p-6 space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kalan Toplam Ders</p>
                                            <p className="text-xl font-bold text-slate-800">
                                                {(parentChildren?.reduce((acc, c) => acc + (c.remainingLessons || 0), 0) || 0) + (selectedParent.remainingLessons || 0)}
                                            </p>
                                        </Card>
                                        <Card className="bg-white border border-slate-100 shadow-sm p-6 space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Havuzdaki Paketler</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {selectedParent.enrolledPackages?.length > 0 ? selectedParent.enrolledPackages.map((p: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="bg-slate-100 border-slate-200 text-slate-600 font-bold text-[10px] uppercase">{p}</Badge>
                                                )) : <span className="text-sm font-medium text-slate-400">Yok</span>}
                                            </div>
                                        </Card>
                                        <Card className="bg-white border border-slate-100 shadow-sm p-6 space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Son Görüldü</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {selectedParent.lastActivityDate ? (
                                                    <>
                                                        <Activity className="w-4 h-4 text-primary" />
                                                        <p className="text-xl font-bold text-slate-800">
                                                            {format(selectedParent.lastActivityDate.toDate?.() || new Date(selectedParent.lastActivityDate), 'dd MMMM yyyy', { locale: tr })}
                                                        </p>
                                                    </>
                                                ) : <span className="text-sm font-medium text-slate-400">Bilinmiyor</span>}
                                            </div>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* TAB: CHILDREN */}
                                <TabsContent value="children" className="m-0 space-y-6">
                                    {parentChildren.length > 0 ? (
                                        <div className="grid gap-4">
                                            {parentChildren.map((child, i) => (
                                                <Card key={i} className="p-6 border-slate-100 shadow-sm flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">👶</div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-lg">{child.firstName}</p>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-xs text-slate-500 font-medium">{child.dateOfBirth ? `${differenceInDays(new Date(), new Date(child.dateOfBirth)) / 365 | 0} Yaş` : '-'}</p>
                                                                {child.id && <span className="text-[9px] font-mono text-slate-300 bg-slate-50 px-1 rounded select-all uppercase">ID: {child.id.substring(0, 8).toUpperCase()}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-6 items-center">
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase">Kalan Ders</p>
                                                            <p className="font-bold text-slate-800">{child.remainingLessons || 0}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase">Paket</p>
                                                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black">{typeof child.assignedPackage === 'string' ? child.assignedPackage.substring(0,20) : 'YOK'}</Badge>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={() => {
                                                            setSelectedChildForProgress(child);
                                                            setIsChildProgressOpen(true);
                                                        }}>
                                                            <FileText className="w-3 h-3 mr-1.5" />
                                                            Detaylı İlerleme
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center space-y-4 bg-white rounded-2xl border border-dashed border-slate-200">
                                            <Baby className="w-12 h-12 mx-auto text-slate-200" />
                                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Henüz çocuk eklenmemiş</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* TAB: LESSONS */}
                                <TabsContent value="history" className="m-0 h-full">
                                    {parentSlots.length > 0 ? (
                                        <div className="divide-y border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                                            {parentSlots.sort((a,b) => b.startTime.seconds - a.startTime.seconds).map((slot, i) => (
                                                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", slot.packageCode === 'FREE_TRIAL' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600')}>
                                                            <Calendar className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-slate-800">{slot.packageCode === 'FREE_TRIAL' ? 'Deneme Dersi' : `Paket Dersi (${slot.packageCode})`}</p>
                                                            <p className="text-xs text-slate-500 font-medium">{format(slot.startTime.toDate(), 'dd MMMM yyyy, HH:mm', { locale: tr })}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-slate-200">
                                                        {isBefore(slot.startTime.toDate(), new Date()) ? 'Tamamlandı' : 'Yaklaşan'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 h-48">
                                            <History className="w-8 h-8 text-slate-300 mb-3" />
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ders kaydı bulunamadı</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* TAB: CALLS */}
                                <TabsContent value="calls" className="m-0 h-full">
                                    {callLogs.length > 0 ? (
                                        <div className="space-y-3">
                                            {callLogs.map((log) => (
                                                <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("p-2.5 rounded-xl border flex shrink-0", log.color)}>
                                                            {getStatusIcon(log.icon)}
                                                        </div>
                                                        <div className="flex flex-col items-start gap-1">
                                                            <span className="font-bold text-[14px] text-slate-800">{log.status}</span>
                                                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5"><User className="w-3 h-3"/> Temsilci: {log.adminEmail}</span>
                                                            {log.note && (
                                                                <span className="text-[12px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 mt-1 rounded-lg border border-slate-100 break-words max-w-lg shadow-inner">
                                                                    Not: {log.note}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-1 shrink-0">
                                                        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-1 uppercase tracking-widest border-slate-200">
                                                            {log.createdAt?.toDate().toLocaleDateString('tr-TR')} {log.createdAt?.toDate().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 h-48">
                                            <PhoneCall className="w-8 h-8 text-slate-300 mb-3" />
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Arama kaydı bulunamadı.</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-slate-500">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <UserCog className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-700">Veli Seçin</h3>
                        <p className="text-sm font-medium text-slate-400 max-w-sm mt-2">Detayları, etiketleri ve arama geçmişini görüntülemek, ayrıca yeni çağrı kaydı girmek için sol menüden bir veli seçin.</p>
                    </div>
                )}
            </div>
        </div>

      {/* CHILD PROGRESS DIALOG */}
      <Dialog open={isChildProgressOpen} onOpenChange={setIsChildProgressOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col rounded-[32px] border-none shadow-2xl">
            <DialogHeader className="p-6 border-b bg-slate-900 text-white shrink-0">
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                    <Baby className="w-6 h-6 text-primary" />
                    {selectedChildForProgress?.firstName} - İlerleme Detayları
                </DialogTitle>
                <DialogDescription className="text-slate-400 font-medium">
                    Çocuğun tüm akademik gelişimi, CEFR seviyesi ve öğretmen değerlendirmeleri.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 relative">
                {selectedChildForProgress && (
                    <ProgressPanel 
                        child={selectedChildForProgress} 
                        isEditable={true} 
                        authorRole="admin"
                    />
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
