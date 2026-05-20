'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, updateDoc, serverTimestamp, increment, collection, addDoc, writeBatch, getDoc, query, where, arrayUnion } from 'firebase/firestore';
import {
    Star,
    ChevronRight,
    Lock,
    CheckCircle2,
    ArrowLeft,
    Share2,
    Copy,
    MessageCircle,
    Gift,
    Camera,
    BookOpen,
    Utensils,
    Music,
    PartyPopper,
    Users,
    Instagram,
    Youtube,
    Loader2,
    Trophy,
    ArrowUpRight,
    Pencil,
    Heart,
    Map,
    Palette,
    Smile,
    MessageSquare,
    Sparkles,
    UserPlus,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, startOfDay, eachDayOfInterval, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

// 1. Kültür ve Aile Bağları
const MISSIONS_CULTURE = [
    { id: 'elders-call', title: 'Büyüklere Selam', points: 60, icon: <Users className="w-5 h-5" />, desc: "Türkiye'deki büyükanne/büyükbabasıyla Türkçe görüntülü konuşurken çekilmiş tatlı bir ekran görüntüsünü paylaşın!" },
    { id: 'traditional-game', title: 'Geleneksel Oyun Saati', points: 80, icon: <PartyPopper className="w-5 h-5" />, desc: 'Ailecek İsim-Şehir, Saklambaç veya Sessiz Sinema gibi geleneksel bir oyunu Türkçe oynarken @TurkCocukAkademisi etiketiyle paylaşın.' },
    { id: 'celebration-joy', title: 'Bayram/Kutlama Neşesi', points: 100, icon: <Gift className="w-5 h-5" />, desc: "Çocuğunuzun 23 Nisan'ı veya bayramı kutladığı coşkulu bir anı veya okuduğu bir şiiri bizimle paylaşın!" },
];

// 2. Eğlence ve Yaratıcılık
const MISSIONS_CREATIVE = [
    { id: 'tekerleme-challenge', title: 'Tekerleme Challenge', points: 70, icon: <Music className="w-5 h-5" />, desc: "Çocuğunuz en sevdiği Türkçe tekerlemeyi söylerken videosunu çekin ve hikayenizde bizi etiketleyin. Bakalım kimler takılmadan söyleyecek?" },
    { id: 'nature-explorer', title: 'Doğa Kaşifi', points: 50, icon: <Map className="w-5 h-5" />, desc: 'Dışarıda yürüyüş yaparken doğadaki nesnelerin (ağaç, kuş, bulut) Türkçe isimlerini saydığınız kısa bir videoyu paylaşın.' },
    { id: 'mini-artist', title: 'Minik Sanatkar', points: 60, icon: <Palette className="w-5 h-5" />, desc: 'Çocuğunuzun çizdiği bir resmi Türkçe olarak anlattığı o yaratıcı anı bizimle paylaşın!' },
    { id: 'book-reading', title: 'Kitap Okuma Saati', points: 40, icon: <BookOpen className="w-5 h-5" />, desc: 'Çocuğunuzla Türkçe kitap okurken o büyülü anı paylaşın ve bizi etiketleyin!' },
];

// 3. Dijital Büyüme ve Güven
const MISSIONS_GROWTH = [
    { id: 'parent-solidarity', title: 'Veli Dayanışması', points: 150, icon: <UserPlus className="w-5 h-5" />, desc: 'Okulunuzdaki veya mahallenizdeki bir Türk aileyi akademimizle tanıştırın, referansınızı paylaştığınız için bu puan sizin!' },
    { id: 'follow-us', title: 'Ailemize Katıl', points: 30, icon: <Instagram className="w-5 h-5" />, desc: 'Instagram hesabımızı takip edin, kocaman bir aile olalım!' },
    { id: 'whatsapp-group', title: 'WhatsApp Grubu Paylaşımı', points: 150, icon: <Users className="w-5 h-5" />, desc: 'Yaşadığınız şehrin Türk WhatsApp grubunda bizi ve referans kodunuzu paylaşın!' },
];

export default function PuanMerkeziPage() {
    const { user, loading: authLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [selectedMission, setSelectedMission] = useState<any>(null);
    const [isProofDialogOpen, setIsProofDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingCode, setIsEditingCode] = useState(false);
    const [newReferralCode, setNewReferralCode] = useState('');
    const [isChildSelectOpen, setIsChildSelectOpen] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState('');
    const [userNote, setUserNote] = useState('');
    const [requestedTime, setRequestedTime] = useState('');
    const [manualTeacherId, setManualTeacherId] = useState('');
    
    const userDocRef = useMemoFirebase(() => (db && user?.uid) ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
    const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);
    
    const childrenRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return collection(db, 'users', user.uid, 'children');
    }, [db, user?.uid]);
    const { data: children, isLoading: childrenLoading } = useCollection(childrenRef);

    const selectedChildData = useMemo(() => children?.find((c: any) => c.id === selectedChildId), [children, selectedChildId]);
    const assignedTeacherId = selectedChildData?.assignedTeacherId;
    const effectiveTeacherId = manualTeacherId || assignedTeacherId;

    const teacherSlotsQuery = useMemoFirebase(() => 
        (db && effectiveTeacherId) ? query(collection(db, 'lesson-slots'), where('teacherId', '==', effectiveTeacherId)) : null, 
    [db, effectiveTeacherId]);
    const { data: teacherSlots, isLoading: slotsLoading } = useCollection(teacherSlotsQuery);

    const teachersQuery = useMemoFirebase(() => 
        db ? query(collection(db, 'users'), where('role', '==', 'teacher')) : null, [db]);
    const { data: allTeachers } = useCollection(teachersQuery);

    const points = userData?.academyPoints || 0;
    const packages = userData?.totalPackagesPurchased || 0;
    const defaultReferralCode = useMemo(() => {
        if (!user) return 'TCA-VELI-2026';
        const namePart = userData?.firstName?.toUpperCase() || 'VELI';
        const uniquePart = user.uid.substring(0, 4).toUpperCase();
        return `TCA-${namePart}-${uniquePart}`;
    }, [user, userData?.firstName]);

    const referralCode = userData?.referralCode || defaultReferralCode;

    // Eğer kullanıcının referans kodu veritabanında yoksa otomatik olarak oluşturup kaydet
    useEffect(() => {
        if (userData && !userData.referralCode && userDocRef) {
            updateDoc(userDocRef, { referralCode: defaultReferralCode }).catch(console.error);
        }
    }, [userData, defaultReferralCode, userDocRef]);

    const isAdmin = user?.email === 'ibrahimcanonder_98@hotmail.com';

    const handleMissionAction = (mission: any) => {
        setSelectedMission(mission);
        setIsProofDialogOpen(true);
    };

    const handleSendProof = async () => {
        if (!user || !userDocRef || !selectedMission || !db) return;
        setIsSaving(true);
        const message = `Merhaba! "${selectedMission.title}" görevini tamamladım. \n\nNotum: ${userNote || 'Not eklenmedi.'} \n\nKanıtım ektedir. (ID: ${user.uid})`;
        window.open(`https://wa.me/905058029734?text=${encodeURIComponent(message)}`, '_blank');
        try {
            await updateDoc(userDocRef, { [`taskStatus.${selectedMission.id}`]: 'pending' });
            await addDoc(collection(db, 'loyalty-requests'), {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName || 'İsimsiz Veli',
                taskId: selectedMission.id,
                taskTitle: selectedMission.title,
                points: selectedMission.points,
                userNote: userNote,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            toast({ title: 'Harika!', description: 'Kanıtınız incelenmek üzere başarıyla gönderildi.' });
            setIsProofDialogOpen(false);
            setUserNote('');
        } catch (e) { console.error(e); } finally { setIsSaving(false); }
    };

    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralCode);
        toast({ title: 'Kod Kopyalandı!', description: 'Davet kodunuz panoya kaydedildi.' });
    };

    const shareReferralOnWhatsapp = () => {
        const message = `Selam! Çocuğum TCA (Turkish Culture Academy) ile harika Türkçe dersleri alıyor. Sen de %10 indirimle kayıt olmak istersen kodum: ${referralCode} Link: https://turkcocukakademisi.com ❤️🇹🇷`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleSaveReferralCode = async () => {
        if (!newReferralCode.trim() || !userDocRef) return;
        setIsSaving(true);
        try {
            await updateDoc(userDocRef, { referralCode: newReferralCode.trim().toUpperCase() });
            setIsEditingCode(false);
            toast({ title: 'Başarılı!', description: 'Davet kodunuz güncellendi.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Kod güncellenirken hata oluştu.' });
        } finally { setIsSaving(false); }
    };

    const handleClaimFreeLesson = async (childIdToUse?: string) => {
        const childId = childIdToUse || selectedChildId;
        if (!user || !userDocRef || points < 500 || !childId || !db) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Gerekli bilgiler eksik veya puanınız yetersiz.' });
            return;
        }
        
        setIsSaving(true);
        try {
            const childDocRef = doc(db, 'users', user.uid, 'children', childId);
            const childSnap = await getDoc(childDocRef);
            
            if (!childSnap.exists()) {
                throw new Error("Öğrenci bulunamadı.");
            }

            const childData = childSnap.data();
            const childName = childData?.firstName || 'Öğrenci';
            const childPackageName = childData?.assignedPackageName || 'Mevcut Kursu';
            
            const batch = writeBatch(db);
            
            // 1. Puan Düşür
            batch.update(userDocRef, { 
                academyPoints: increment(-500) 
            });
            
            // 2. Çocuğa Ders Ekle
            batch.update(childDocRef, {
                remainingLessons: increment(1)
            });

            // 2.5. Hediye listesine ekle (Paketlerim sayfasında gözükmesi için)
            batch.update(userDocRef, {
                referralGifts: arrayUnion({
                    id: Math.random().toString(36).substring(7),
                    from: '500 Puan',
                    date: new Date().toISOString(),
                    courseName: childPackageName,
                    assigned: true,
                    type: 'points'
                })
            });
            
            // 3. İşlemi Kaydet (Otomatik tamamlandı olarak)
            const requestRef = doc(collection(db, 'loyalty-requests'));
            batch.set(requestRef, {
                userId: user.uid,
                userEmail: user.email,
                userName: userData?.firstName + " " + userData?.lastName || 'Veli',
                childId: childId,
                childName: childName,
                type: 'gift_lesson_claim',
                pointsUsed: 500,
                description: `🎁 Puan ile Otomatik Hediye Ders (${childPackageName})`,
                status: 'completed',
                createdAt: serverTimestamp()
            });

            await batch.commit();

            toast({ 
                title: 'Tebrikler! 🎁', 
                description: `${childName} için 1 bedava ders hesabına eklendi!`, 
                className: 'bg-green-600 text-white font-bold' 
            });

            setIsChildSelectOpen(false);
            setSelectedChildId('');

        } catch (error: any) {
            console.error("Hediye ders talebi hatası:", error);
            toast({ 
                variant: 'destructive', 
                title: 'İşlem Başarısız', 
                description: error.message || 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.' 
            });
        } finally { 
            setIsSaving(false); 
        }
    };

    if (authLoading || userDataLoading || childrenLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (!isAdmin) {
        return (
            <div className="flex-1 space-y-12 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen font-sans relative">
                <div className="fixed inset-0 bg-slate-100/40 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="bg-white/80 p-12 rounded-[40px] shadow-2xl border border-slate-200/50 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center shadow-inner"><Lock className="w-10 h-10 text-slate-400" /></div>
                        <div className="text-center space-y-2">
                            <h1 className="text-5xl font-black text-slate-700 drop-shadow-sm tracking-tighter">YAKINDA AKTİF</h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-sm">Çok Yakında Sizlerle Olacak</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-12 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen font-sans relative">
            <div className="flex items-center gap-4 max-w-6xl mx-auto">
                <Button variant="outline" size="icon" onClick={() => router.push('/ebeveyn-portali')} className="h-10 w-10 rounded-xl border-2"><ArrowLeft className="h-5 w-5" /></Button>
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Puan Merkezi</h2>
                    <p className="text-slate-500 text-sm font-medium">Kazanın, biriktirin ve bedava derslerin tadını çıkarın.</p>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-2xl rounded-[32px] overflow-hidden max-w-6xl mx-auto">
                <CardContent className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/10 rounded-3xl"><Star className="w-10 h-10 text-yellow-400 fill-current" /></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Mevcut Akademi Puanınız</p>
                                    <p className="text-5xl font-black text-yellow-400">{points} <span className="text-xl opacity-50 uppercase tracking-widest ml-1">Stars 🌟</span></p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-300">İlerleme Durumu</p>
                                    <Badge className="bg-green-500/20 text-green-400 border-none font-black text-[10px] px-3 py-1 uppercase tracking-widest">HEDİYE DERSE {Math.max(0, 500 - points)} KALDI</Badge>
                                </div>
                                <Progress value={Math.min(100, (points / 500) * 100)} className="h-4 bg-white/10" />
                                <p className="text-[10px] text-slate-400 font-bold italic text-center uppercase tracking-widest">Paylaştıkça büyüyen büyük bir aileyiz! ❤️🇹🇷</p>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 space-y-4">
                            <div className="flex items-center gap-3"><Trophy className="w-6 h-6 text-primary" /><h4 className="font-black text-sm uppercase tracking-widest">Sadakat Ödülleri</h4></div>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium italic">500 puana ulaştığınızda bu ekrandan <span className="text-white font-bold underline decoration-primary underline-offset-4">1 Bedava Ders</span> talep edebilirsiniz. 🎉</p>
                            {points >= 500 && (
                                <Button 
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-2xl h-12" 
                                    onClick={() => {
                                        if (children && children.length > 1) {
                                            setIsChildSelectOpen(true);
                                        } else if (children && children.length === 1) {
                                            handleClaimFreeLesson(children[0].id);
                                        } else {
                                            toast({ variant: 'destructive', title: 'Hata', description: 'Öğrenci bilgisi yüklenemedi veya çocuk bulunamadı.' });
                                        }
                                    }} 
                                    disabled={isSaving}
                                >
                                    🎁 1 Bedava Ders Hediyemi Al
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="max-w-6xl mx-auto space-y-20">
                {/* 1. KÜLTÜR VE AİLE BAĞLARI */}
                <section className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6"><div className="flex items-center gap-4"><div className="p-3 bg-amber-100 rounded-2xl"><Users className="w-6 h-6 text-amber-600" /></div><div><h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Kültür ve Aile Bağları</h3><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">KÖKLERİMİZLE BAĞ KURUYORUZ</p></div></div><Badge variant="outline" className="px-4 py-1.5 border-amber-300 font-bold text-[10px] uppercase text-amber-600">En Çok Tercih Edilen</Badge></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MISSIONS_CULTURE.map(mission => {
                            const status = userData?.taskStatus?.[mission.id];
                            return (
                                <Card key={mission.id} className="border-none shadow-md hover:shadow-2xl transition-all duration-300 rounded-3xl group overflow-hidden bg-white">
                                    <div className="flex items-center p-5 gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all transform group-hover:rotate-6">{mission.icon}</div>
                                        <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><h4 className="font-bold text-sm text-slate-800 truncate">{mission.title}</h4><Badge className="bg-yellow-400/20 text-yellow-700 text-[9px] font-black border-none">+{mission.points}🌟</Badge></div><p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{mission.desc}</p></div>
                                        <Button size="sm" variant={status === 'completed' ? 'secondary' : status === 'pending' ? 'outline' : 'default'} className="rounded-xl h-9 px-5 font-black text-[10px] uppercase tracking-widest shrink-0" disabled={!!status} onClick={() => handleMissionAction(mission)}>{status === 'completed' ? '✅ Tamamlandı' : status === 'pending' ? '⏳ Onayda' : 'Yaptım!'}</Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* 2. EĞLENCE VE YARATICILIK */}
                <section className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6"><div className="flex items-center gap-4"><div className="p-3 bg-blue-100 rounded-2xl"><Palette className="w-6 h-6 text-blue-600" /></div><div><h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Eğlence ve Yaratıcılık</h3><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">ÇOCUKLARIMIZIN HAYAL GÜCÜ</p></div></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MISSIONS_CREATIVE.map(mission => {
                            const status = userData?.taskStatus?.[mission.id];
                            return (
                                <Card key={mission.id} className="border-none shadow-md hover:shadow-2xl transition-all duration-300 rounded-3xl group overflow-hidden bg-white">
                                    <div className="flex items-center p-5 gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">{mission.icon}</div>
                                        <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><h4 className="font-bold text-sm text-slate-800 truncate">{mission.title}</h4><Badge className="bg-yellow-400/20 text-yellow-700 text-[9px] font-black border-none">+{mission.points}🌟</Badge></div><p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{mission.desc}</p></div>
                                        <Button size="sm" variant={status === 'completed' ? 'secondary' : status === 'pending' ? 'outline' : 'default'} className="rounded-xl h-9 px-5 font-black text-[10px] uppercase tracking-widest shrink-0" disabled={!!status} onClick={() => handleMissionAction(mission)}>{status === 'completed' ? '✅ Tamamlandı' : status === 'pending' ? '⏳ Onayda' : 'Yaptım!'}</Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* 3. DİJİTAL BÜYÜME VE GÜVEN */}
                <section className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6"><div className="flex items-center gap-4"><div className="p-3 bg-emerald-100 rounded-2xl"><MessageSquare className="w-6 h-6 text-emerald-600" /></div><div><h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Dijital Büyüme ve Güven</h3><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">AKADEMİMİZİ BİRLİKTE BÜYÜTELİM</p></div></div><Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 font-black text-[10px] uppercase">Yüksek Puanlı</Badge></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MISSIONS_GROWTH.map(mission => {
                            const status = userData?.taskStatus?.[mission.id];
                            return (
                                <Card key={mission.id} className="border-none shadow-md hover:shadow-2xl transition-all duration-300 rounded-3xl group overflow-hidden bg-white border-l-4 border-emerald-500">
                                    <div className="flex items-center p-5 gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">{mission.icon}</div>
                                        <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><h4 className="font-bold text-sm text-slate-800 truncate">{mission.title}</h4><Badge className="bg-emerald-500/20 text-emerald-700 text-[9px] font-black border-none">+{mission.points}🌟</Badge></div><p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{mission.desc}</p></div>
                                        <Button size="sm" variant={status === 'completed' ? 'secondary' : status === 'pending' ? 'outline' : 'default'} className="rounded-xl h-9 px-5 font-black text-[10px] uppercase tracking-widest shrink-0" disabled={!!status} onClick={() => handleMissionAction(mission)}>{status === 'completed' ? '✅ Tamamlandı' : status === 'pending' ? '⏳ Onayda' : 'Yaptım!'}</Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* REFERANS VIP */}
                <section>
                    <Card className="bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 text-white border-none shadow-[0_20px_80px_rgba(79,70,229,0.3)] rounded-[32px] sm:rounded-[40px] overflow-hidden relative group">
                        <div className="relative p-6 sm:p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="space-y-3 sm:space-y-4">
                                        <Badge className="bg-white/20 text-white border-none px-4 py-1 text-[10px] font-black tracking-widest uppercase">🤝 REFERANS SİSTEMİ</Badge>
                                        <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight uppercase">Arkadaşını Davet Et, <br />Birlikte Kazanın!</h3>
                                        <p className="text-white/70 font-medium leading-relaxed max-w-sm italic text-sm sm:text-base">Büyük TCA ailemizi birlikte büyütelim! ❤️🇹🇷</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="bg-emerald-500/20 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-500/30 backdrop-blur-sm">
                                            <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1 sm:mb-2">Sizin Ödülünüz</p>
                                            <p className="text-base sm:text-lg font-black leading-tight">1 Hediye Ders <br /><span className="text-xs opacity-60">Tanımlanır</span></p>
                                        </div>
                                        <div className="bg-yellow-500/20 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-yellow-500/30 backdrop-blur-sm">
                                            <p className="text-[10px] font-black text-yellow-300 uppercase tracking-widest mb-1 sm:mb-2">Arkadaşın Ödülü</p>
                                            <p className="text-base sm:text-lg font-black leading-tight">%10 İndirim <br /><span className="text-xs opacity-60">Kurs Alımında</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-white/10 border border-white/20 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 backdrop-blur-md">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-3 sm:mb-4 text-center">ÖZEL DAVET KODUNUZ</p>
                                        <div className="flex gap-3">
                                            <div className="flex-1 bg-white text-slate-900 font-black text-base sm:text-2xl flex items-center justify-center rounded-xl sm:rounded-2xl h-14 sm:h-16 uppercase tracking-wider shadow-inner px-2">{referralCode}</div>
                                            <Button size="icon" onClick={copyReferralCode} className="h-14 w-14 sm:h-16 sm:w-16 bg-white/20 hover:bg-white/30 rounded-xl sm:rounded-2xl transition-all active:scale-95 border border-white/10 shrink-0"><Copy className="w-5 h-5 sm:w-6 sm:h-6" /></Button>
                                        </div>
                                    </div>
                                    <Button className="w-full h-14 sm:h-16 bg-green-500 hover:bg-green-600 text-white font-black text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-2xl shadow-slate-900/40 transition-all hover:scale-[1.02] active:scale-95" onClick={shareReferralOnWhatsapp}><MessageCircle className="mr-2 sm:mr-3 w-5 h-5 sm:w-7 sm:h-7" /> WHATSAPP'TA PAYLAŞ</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>

            {/* CHILD SELECTION DIALOG */}
            <Dialog open={isChildSelectOpen} onOpenChange={setIsChildSelectOpen}>
                <DialogContent className="rounded-[40px] p-0 overflow-hidden max-w-md border-none shadow-2xl bg-white">
                    <div className="bg-white p-8 pt-10 relative">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-50 to-transparent -z-10" />
                        
                        <DialogHeader className="items-center text-center space-y-4 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-[28px] flex items-center justify-center rotate-3 shadow-sm group-hover:rotate-6 transition-transform">
                                <Gift className="w-10 h-10 text-orange-500" />
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">Hediye Ders Al</DialogTitle>
                                <DialogDescription className="text-slate-500 font-medium text-sm leading-relaxed px-2">
                                    500 Puanınızı çocuğunuzun mevcut paketine uygun harika bir hediye dersine dönüştürmek üzeresiniz! 🎁✨
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Öğrenci Seçin</label>
                                <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                    <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-white font-semibold text-slate-700 shadow-sm focus:ring-amber-500 focus:border-amber-500 transition-all">
                                        <SelectValue placeholder="Bir öğrenci seçin..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                        {children?.map((child: any) => (
                                            <SelectItem key={child.id} value={child.id} className="font-semibold py-3 rounded-xl focus:bg-amber-50 focus:text-amber-700 cursor-pointer">
                                                {child.firstName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button 
                                className="w-full h-14 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 font-bold text-base rounded-2xl shadow-lg shadow-orange-200/50 text-white border-none transition-all active:scale-95 group" 
                                onClick={() => handleClaimFreeLesson()} 
                                disabled={isSaving || !selectedChildId}
                            >
                                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />} 
                                PUANLARI KULLAN VE TALEP ET
                            </Button>
                            <Button variant="ghost" className="w-full h-12 font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl text-sm" onClick={() => setIsChildSelectOpen(false)}>
                                Vazgeç
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* DIALOGS */}
            <Dialog open={isProofDialogOpen} onOpenChange={setIsProofDialogOpen}>
                <DialogContent className="rounded-[40px] p-10 max-w-md border-none shadow-2xl">
                    <DialogHeader className="items-center text-center space-y-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                            <Camera className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Harika Bir Haber! 🎉</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium leading-relaxed px-2">
                                Görev kanıtını WhatsApp ekibimize iletin, yıldızlarınız hemen yüklensin! 🚀
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Varsa Notunuz (İsteğe bağlı)</label>
                        <Textarea 
                            placeholder="Görevi nasıl yaptınız? Bize anlatın..." 
                            className="rounded-2xl border-slate-200 focus:border-primary min-h-[100px]"
                            value={userNote}
                            onChange={(e) => setUserNote(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="mt-4 flex flex-col gap-3">
                        <Button 
                            className="w-full h-14 bg-green-500 hover:bg-green-600 font-black text-base rounded-2xl shadow-xl shadow-green-100" 
                            onClick={handleSendProof} 
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <MessageCircle className="mr-2 w-5 h-5" />} 
                            KANITI GÖNDER 🚀✨
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
