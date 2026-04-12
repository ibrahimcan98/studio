'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot, doc, updateDoc, deleteDoc, limit } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCountryFromPhone, cn } from '@/lib/utils';
import { Loader2, Phone, Search, History, Clock, PhoneOff, UserCheck, CalendarClock, UserCog, User, MapPin, Hash, PhoneCall, Copy, MoreHorizontal, ShoppingBag, Baby, FileText, Tag as TagIcon, Mail, Calendar, Activity, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  
  // New States for Call Log Management
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<any | null>(null);
  const [isUpdatingLog, setIsUpdatingLog] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState<'list' | 'details'>('list');

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

  const handleDeleteCallLog = async () => {
    if (!db || !selectedParent || !logToDelete) return;
    setIsUpdatingLog(true);
    
    try {
        const logId = logToDelete.id;
        await deleteDoc(doc(db, 'users', selectedParent.id, 'call-logs', logId));
        
        // Fetch the newest log after deletion to update the parent document's lastCallStatus
        const logsQuery = query(
            collection(db, 'users', selectedParent.id, 'call-logs'), 
            orderBy('createdAt', 'desc'),
            limit(1)
        );
        const latestLogs = await getDocs(logsQuery);
        
        if (latestLogs.empty) {
            // No more logs, clear the status
            await updateDoc(doc(db, 'users', selectedParent.id), { lastCallStatus: null });
        } else {
            // Update with the new latest log
            const newLatest = latestLogs.docs[0].data();
            await updateDoc(doc(db, 'users', selectedParent.id), { 
                lastCallStatus: {
                    status: newLatest.status,
                    color: newLatest.color,
                    icon: newLatest.icon,
                    note: newLatest.note
                }
            });
        }

        toast({ title: 'Başarılı', description: 'Arama kaydı veritabanından silindi.' });
    } catch (e: any) {
        console.error("Error deleting call log:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'Silme işlemi başarısız: ' + e.message });
    } finally {
        setIsUpdatingLog(false);
        setIsDeleteDialogOpen(false);
        setLogToDelete(null);
    }
  };

  const handleUpdateCallLog = async () => {
    if (!db || !selectedParent || !editingLog) return;
    setIsUpdatingLog(true);
    
    try {
        await updateDoc(doc(db, 'users', selectedParent.id, 'call-logs', editingLog.id), {
            note: editingLog.note.trim()
        });

        // Also check if this was the last call and update the main doc if needed
        // Since callLogs is ordered by desc, the first one is the latest
        if (selectedParent.lastCallStatus && callLogs[0]?.id === editingLog.id) {
             await updateDoc(doc(db, 'users', selectedParent.id), { 
                "lastCallStatus.note": editingLog.note.trim()
            });
        }

        toast({ title: 'Başarılı', description: 'Not güncellendi.' });
        setIsEditOpen(false);
        setEditingLog(null);
    } catch (e: any) {
        console.error("Error updating call log:", e);
        toast({ variant: 'destructive', title: 'Hata', description: 'Güncelleme başarısız: ' + e.message });
    } finally {
        setIsUpdatingLog(false);
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
    <div className="flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-100px)] overflow-hidden font-sans">
        {/* RESPONSIVE HEADER */}
        <div className={cn(
            "flex items-center justify-between pb-4 sm:pb-6",
            activeMobileView === 'details' && "md:flex"
        )}>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                    {activeMobileView === 'details' && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="md:hidden shrink-0 h-9 w-9 bg-white shadow-sm border rounded-xl"
                            onClick={() => setActiveMobileView('list')}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 truncate">
                        {activeMobileView === 'details' && selectedParent ? `Arama: ${selectedParent.firstName}` : 'Telemarketing / Aramalar'}
                    </h1>
                </div>
                {activeMobileView === 'list' && (
                    <p className="hidden sm:block text-muted-foreground mt-1 text-sm font-medium">Velileri arayın, etiketleri görün ve arama geçmişini kaydedin.</p>
                )}
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 flex-1 min-h-0 bg-slate-50 p-1 sm:p-2 rounded-[24px] sm:rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden">
            
            {/* SOL PANEL (List) */}
            <div className={cn(
                "w-full md:w-80 lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden shrink-0 h-full transition-all",
                activeMobileView === 'details' && "hidden md:flex"
            )}>
                <div className="p-3 sm:p-4 border-b bg-slate-50/50">
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
                <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 relative scrollbar-thin">
                    {parentsLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-30"/></div>
                    ) : filteredParents.length > 0 ? (
                        filteredParents.map(parent => {
                            const country = getCountryFromPhone(parent.phoneNumber);
                            const isSelected = selectedParent?.id === parent.id;
                            return (
                                <button 
                                    key={parent.id} 
                                    onClick={() => {
                                        setSelectedParent(parent);
                                        setActiveMobileView('details');
                                    }}
                                    className={cn(
                                        "w-full text-left p-3 sm:p-4 rounded-xl transition-all border flex flex-col gap-2 relative group",
                                        isSelected 
                                            ? "bg-primary/5 border-primary/30 shadow-sm ring-1 ring-primary/10" 
                                            : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0 flex-1">
                                            <span className={cn("font-bold text-sm sm:text-base truncate block", isSelected ? "text-primary" : "text-slate-700")}>
                                                {parent.firstName} {parent.lastName}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[9px] bg-slate-100 text-slate-500 border-none font-mono tracking-tighter">
                                                    {parent.id.substring(0,8).toUpperCase()}
                                                </Badge>
                                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium truncate flex items-center gap-1">
                                                    <MapPin className="w-2.5 h-2.5" /> {country}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className={cn("w-4 h-4 text-slate-300 md:hidden transition-transform", isSelected && "text-primary translate-x-1")} />
                                    </div>
                                    
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1 whitespace-nowrap">
                                            <Phone className="w-3 h-3" /> {parent.phoneNumber || '-'}
                                        </span>
                                    </div>

                                    {parent.lastCallStatus && (
                                        <div className="mt-1 flex flex-col gap-1.5 border-t border-slate-100 pt-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className={cn("px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider shrink-0", parent.lastCallStatus.color)}>
                                                    {parent.lastCallStatus.status}
                                                </span>
                                                {parent.lastCallStatus.note && (
                                                    <span className="text-[10px] text-slate-400 truncate italic font-medium">"{parent.lastCallStatus.note}"</span>
                                                )}
                                            </div>
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
            <div className={cn(
                "flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full relative",
                activeMobileView === 'list' && "hidden md:flex"
            )}>
                {selectedParent ? (
                    <div className="flex flex-col h-full overflow-hidden">
                        {loadingExtras && (
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 bg-white/50 backdrop-blur-sm p-1 rounded-full border">
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-primary opacity-50"/>
                            </div>
                        )}
                        
                        {/* PROFILE HEADER (Responsive heights) */}
                        <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 text-white shrink-0 scrollbar-hide">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 w-full">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[24px] bg-primary flex items-center justify-center text-2xl sm:text-3xl font-black shadow-lg shadow-primary/20 shrink-0">
                                        {selectedParent.firstName?.[0] || 'V'}{selectedParent.lastName?.[0] || 'P'}
                                    </div>
                                    <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight truncate">{selectedParent.firstName} {selectedParent.lastName}</h2>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-slate-400 text-[11px] sm:text-sm font-medium">
                                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate max-w-[150px] sm:max-w-none">{selectedParent.email}</span></span>
                                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 shrink-0" /> {selectedParent.phoneNumber || '-'}</span>
                                            <button 
                                                className="hidden sm:flex items-center gap-1.5 py-1 px-2 border border-slate-700 bg-slate-800 rounded text-slate-300 hover:text-white transition-colors text-[10px] font-bold"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedParent.phoneNumber || '');
                                                    toast({title: 'Kopyalandı', description: 'Numara panoya kopyalandı.'});
                                                }}
                                            ><Copy className="w-3 h-3" /> Kopyala</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-3 shrink-0">
                                     <Badge className="bg-emerald-500 text-white border-none font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full uppercase tracking-widest text-[9px] sm:text-[10px]">
                                        {getCountryFromPhone(selectedParent.phoneNumber)}
                                    </Badge>
                                    <div className="flex flex-wrap gap-1 justify-center sm:justify-end max-w-[150px] sm:max-w-none">
                                        {tags.map(t => (
                                            <Badge key={t} className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase bg-white/10 text-slate-200 border-none">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CRM ACTIONS BAR (Mobile Optimized - Horizontal Scroll on small) */}
                        <div className="bg-slate-50 border-b p-3 sm:p-4 px-4 sm:px-6 shrink-0 shadow-sm z-10 overflow-hidden">
                            <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
                                <span className="hidden sm:flex text-xs font-black text-slate-500 uppercase tracking-widest items-center gap-2">
                                    <PhoneCall className="w-4 h-4 text-primary" /> Arama Sonucu
                                </span>
                                <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
                                    <Input 
                                        placeholder="Arama notu bırakın..." 
                                        className="h-9 sm:h-10 text-[11px] sm:text-xs bg-white rounded-xl flex-1 sm:min-w-[200px] font-medium"
                                        value={callNote}
                                        onChange={(e) => setCallNote(e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 xs:flex items-center gap-2 w-full sm:w-auto">
                                        <Button disabled={isSavingCall} onClick={() => handleCallAction('Açmadı', 'bg-red-50 text-red-600 border-red-200', 'PhoneOff')} variant="outline" className="h-9 sm:h-10 border-red-200 text-red-600 rounded-xl font-bold flex-1 sm:px-3 text-[10px] sm:text-xs px-1"><PhoneOff className="w-3.5 h-3.5 mr-1.5"/> Açmadı</Button>
                                        <Button disabled={isSavingCall} onClick={() => handleCallAction('Açtı', 'bg-emerald-50 text-emerald-600 border-emerald-200', 'UserCheck')} variant="outline" className="h-9 sm:h-10 border-emerald-200 text-emerald-600 rounded-xl font-bold flex-1 sm:px-3 text-[10px] sm:text-xs px-1"><UserCheck className="w-3.5 h-3.5 mr-1.5"/> Açtı</Button>
                                        <Button disabled={isSavingCall} onClick={() => handleCallAction('Müsait Değil', 'bg-amber-50 text-amber-600 border-amber-200', 'Clock')} variant="outline" className="h-9 sm:h-10 border-amber-200 text-amber-600 rounded-xl font-bold flex-1 sm:px-3 text-[10px] sm:text-xs px-1"><Clock className="w-3.5 h-3.5 mr-1.5"/> Müsait</Button>
                                        <Button disabled={isSavingCall} onClick={() => handleCallAction('Tekrar Ara', 'bg-blue-50 text-blue-600 border-blue-200', 'CalendarClock')} variant="outline" className="h-9 sm:h-10 border-blue-200 text-blue-600 rounded-xl font-bold flex-1 sm:px-3 text-[10px] sm:text-xs px-1"><CalendarClock className="w-3.5 h-3.5 mr-1.5"/> Tekrar</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TABS & CONTENT */}
                        <Tabs defaultValue="calls" className="flex-1 flex flex-col min-h-0 bg-white">
                            <div className="bg-slate-100 px-2 sm:px-6 shrink-0 border-b overflow-x-auto scrollbar-hide">
                                <TabsList className="bg-transparent gap-2 sm:gap-6 h-12 sm:h-14 p-0">
                                    <TabsTrigger value="calls" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-full border-none font-bold text-slate-500 px-3 sm:px-6 text-[11px] sm:text-sm whitespace-nowrap">Geçmiş ({callLogs.length})</TabsTrigger>
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-full border-none font-bold text-slate-500 px-3 sm:px-6 text-[11px] sm:text-sm whitespace-nowrap">Özet</TabsTrigger>
                                    <TabsTrigger value="children" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-full border-none font-bold text-slate-500 px-3 sm:px-6 text-[11px] sm:text-sm whitespace-nowrap">Çocuklar</TabsTrigger>
                                    <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 rounded-t-xl rounded-b-none h-full border-none font-bold text-slate-500 px-3 sm:px-6 text-[11px] sm:text-sm whitespace-nowrap">Dersler</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 scrollbar-thin">
                                
                                {/* TAB: OVERVIEW */}
                                <TabsContent value="overview" className="m-0 space-y-4 sm:space-y-6">
                                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                        <Card className="bg-white border-slate-100 shadow-sm p-4 sm:p-5 space-y-1 sm:space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kayıt Tarihi</p>
                                            <p className="text-base sm:text-lg font-bold text-slate-800">{selectedParent.createdAt ? format(selectedParent.createdAt.toDate?.() || new Date(selectedParent.createdAt), 'dd MMMM yyyy', { locale: tr }) : '-'}</p>
                                        </Card>
                                        <Card className="bg-white border-slate-100 shadow-sm p-4 sm:p-5 space-y-1 sm:space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kalan Ders</p>
                                            <p className="text-base sm:text-lg font-bold text-slate-800">
                                                {(parentChildren?.reduce((acc, c) => acc + (c.remainingLessons || 0), 0) || 0) + (selectedParent.remainingLessons || 0)}
                                            </p>
                                        </Card>
                                        <Card className="bg-white border-slate-100 shadow-sm p-4 sm:p-5 space-y-1 sm:space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Havuzdaki Paketler</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {selectedParent.enrolledPackages?.length > 0 ? selectedParent.enrolledPackages.map((p: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="bg-slate-100 border-slate-200 text-slate-600 font-bold text-[9px] sm:text-[10px] uppercase truncate max-w-full">{p}</Badge>
                                                )) : <span className="text-xs sm:text-sm font-medium text-slate-400 italic">Yok</span>}
                                            </div>
                                        </Card>
                                        <Card className="bg-white border-slate-100 shadow-sm p-4 sm:p-5 space-y-1 sm:space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Son Görüldü</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {selectedParent.lastActivityDate ? (
                                                    <>
                                                        <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
                                                        <p className="text-base sm:text-lg font-bold text-slate-800">
                                                            {format(selectedParent.lastActivityDate.toDate?.() || new Date(selectedParent.lastActivityDate), 'dd MMM yyyy', { locale: tr })}
                                                        </p>
                                                    </>
                                                ) : <span className="text-xs sm:text-sm font-medium text-slate-400 italic">Bilinmiyor</span>}
                                            </div>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* TAB: CHILDREN */}
                                <TabsContent value="children" className="m-0 space-y-4 sm:space-y-6">
                                    {parentChildren.length > 0 ? (
                                        <div className="grid gap-3 sm:gap-4">
                                            {parentChildren.map((child, i) => (
                                                <Card key={i} className="p-4 sm:p-6 border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0">👶</div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-slate-800 text-base sm:text-lg truncate">{child.firstName}</p>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{child.dateOfBirth ? `${differenceInDays(new Date(), new Date(child.dateOfBirth)) / 365 | 0} Yaş` : '-'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full sm:w-auto gap-4 items-center justify-between sm:justify-end">
                                                        <div className="text-right">
                                                            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase">Kredisi</p>
                                                            <p className="font-bold text-slate-800 text-sm sm:text-base">{child.remainingLessons || 0}</p>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="h-8 sm:h-9 text-[10px] sm:text-xs font-bold" onClick={() => {
                                                            setSelectedChildForProgress(child);
                                                            setIsChildProgressOpen(true);
                                                        }}>
                                                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                                                            İlerleme
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center space-y-3 bg-white rounded-2xl border border-dashed border-slate-200">
                                            <Baby className="w-10 h-10 mx-auto text-slate-200" />
                                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Henüz çocuk eklenmemiş</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* TAB: LESSONS */}
                                <TabsContent value="history" className="m-0 h-full">
                                    {parentSlots.length > 0 ? (
                                        <div className="divide-y border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-hidden">
                                            {parentSlots.sort((a,b) => (b.startTime.seconds || 0) - (a.startTime.seconds || 0)).map((slot, i) => (
                                                <div key={i} className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                        <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0", slot.packageCode === 'FREE_TRIAL' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600')}>
                                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-xs sm:text-sm text-slate-800 truncate">{slot.packageCode === 'FREE_TRIAL' ? 'Deneme Dersi' : `Paket Dersi (${slot.packageCode})`}</p>
                                                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{format(slot.startTime.toDate(), 'dd MMM yyyy, HH:mm', { locale: tr })}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="text-[8px] sm:text-[9px] font-bold uppercase tracking-tighter text-slate-400 border-slate-200 shrink-0 ml-2">
                                                        {isBefore(slot.startTime.toDate(), new Date()) ? 'Bitti' : 'Gelecek'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                                            <History className="w-8 h-8 text-slate-300 mb-3" />
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kayıt bulunamadı</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* TAB: CALLS */}
                                <TabsContent value="calls" className="m-0 h-full">
                                    {callLogs.length > 0 ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            {callLogs.map((log) => (
                                                <div key={log.id} className="flex items-start sm:items-center justify-between p-3 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors gap-3">
                                                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                                        <div className={cn("p-2 sm:p-2.5 rounded-xl border flex shrink-0", log.color)}>
                                                            {getStatusIcon(log.icon)}
                                                        </div>
                                                        <div className="flex flex-col items-start gap-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-[13px] sm:text-[14px] text-slate-800">{log.status}</span>
                                                                <span className="hidden sm:inline text-[10px] text-slate-400 font-medium truncate italic max-w-[150px]">Temsilci: {log.adminEmail}</span>
                                                            </div>
                                                            {log.note && (
                                                                <span className="text-[11px] sm:text-[12px] font-medium text-slate-600 bg-slate-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-100 line-clamp-2 md:line-clamp-none">
                                                                    {log.note}
                                                                </span>
                                                            )}
                                                            <span className="sm:hidden text-[9px] text-slate-400 italic">Temsilci: {log.adminEmail}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 shrink-0">
                                                        <div className="text-right hidden sm:block">
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase">{log.createdAt?.toDate().toLocaleDateString('tr-TR')}</p>
                                                            <p className="text-[9px] text-slate-400 italic font-medium">{log.createdAt?.toDate().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</p>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-48">
                                                                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase mb-1 px-2">İşlemler</DropdownMenuLabel>
                                                                <DropdownMenuItem 
                                                                    className="rounded-lg font-bold text-xs py-2.5 cursor-pointer flex items-center gap-2"
                                                                    onClick={() => {
                                                                        setEditingLog(log);
                                                                        setIsEditOpen(true);
                                                                    }}
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5 text-blue-500" /> Düzenle
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="rounded-lg font-bold text-xs py-2.5 text-red-500 focus:text-red-500 cursor-pointer flex items-center gap-2"
                                                                    onClick={() => {
                                                                        setLogToDelete(log);
                                                                        setIsDeleteDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" /> Sil
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                                            <PhoneCall className="w-8 h-8 text-slate-300 mb-3" />
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Arama kaydı bulunamadı.</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-slate-500">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <UserCog className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-700">Bir Veli Seçin</h3>
                        <p className="text-[11px] sm:text-sm font-medium text-slate-400 max-w-sm mt-2">Detayları, etiketleri ve arama geçmişini görüntülemek ve yeni çağrı kaydı girmek için listeden bir veli seçin.</p>
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

      {/* CALL LOG EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md rounded-[24px]">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold">Arama Notunu Düzenle</DialogTitle>
                <DialogDescription>Seçili arama kaydına ait notu güncelleyin.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Input 
                    value={editingLog?.note || ''} 
                    onChange={e => setEditingLog({...editingLog, note: e.target.value})}
                    placeholder="Yeni notunuzu girin..."
                    className="h-12 rounded-xl"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isUpdatingLog}>Vazgeç</Button>
                <Button onClick={handleUpdateCallLog} disabled={isUpdatingLog} className="font-bold">
                    {isUpdatingLog ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                    Güncelle
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CALL LOG DELETE CONFIRMATION */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[24px]">
            <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold text-red-600">Kaydı Sil?</AlertDialogTitle>
                <AlertDialogDescription>
                    Bu arama kaydı kalıcı olarak silinecek. Bu işlem geri alınamaz.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={isUpdatingLog}>Vazgeç</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={handleDeleteCallLog} 
                    disabled={isUpdatingLog}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                    {isUpdatingLog ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Evet, Sil
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
