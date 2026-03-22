'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, updateDoc, serverTimestamp, increment, collection, addDoc, writeBatch } from 'firebase/firestore';
import {
    Wallet,
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
    Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MISSIONS_HOME = [
    { id: 'book-reading', title: 'Kitap Okuma Saati', points: 40, icon: <BookOpen className="w-5 h-5" />, desc: 'Çocuğunuzla Türkçe kitap okurken bir fotoğraf veya video paylaşın ve bizi etiketleyin!' },
    { id: 'game-time', title: 'Oyun Saati', points: 40, icon: <PartyPopper className="w-5 h-5" />, desc: 'Birlikte Türkçe bir oyun oynadığınız o eğlenceli anı paylaşın!' },
    { id: 'elders-call', title: 'Büyüklerle Gönül Köprüsü', points: 60, icon: <Users className="w-5 h-5" />, desc: 'Türkiye’deki aile üyeleriyle yapılan görüntülü aramadan bir kare paylaşın!' },
    { id: 'kitchen-fun', title: 'Mutfakta Bir Kare', points: 50, icon: <Utensils className="w-5 h-5" />, desc: 'Geleneksel bir lezzet hazırlarken mutfaktaki eğlencenizi paylaşın!' },
    { id: 'presentation', title: 'Mini Sunum Saati', points: 100, icon: <Music className="w-5 h-5" />, desc: 'Çocuğunuzun ilgi duyduğu bir konuyu Türkçe anlattığı kısa bir videoyu paylaşın!' },
    { id: 'lesson-note', title: 'Dersten Küçük Bir Not', points: 50, icon: <BookOpen className="w-5 h-5" />, desc: 'Derste öğrendiği kelimeleri not aldığı kağıdı veya ödevinden bir kare paylaşın!' },
    { id: 'talking-turkish', title: '"Türkçe Konuşuyorum!"', points: 60, icon: <MessageCircle className="w-5 h-5" />, desc: 'Çocuğunuzun günlük hayatta kendini Türkçe ifade ettiği doğal bir anı paylaşın!' },
    { id: 'creative-workshop', title: 'Yaratıcı Türkçe Atölyesi', points: 40, icon: <Camera className="w-5 h-5" />, desc: 'Türkçe yazdığı, çizdiği veya hazırladığı herhangi bir materyali paylaşın!' },
    { id: 'daily-song', title: 'Günün Şarkısı veya Tekerlemesi', points: 40, icon: <Music className="w-5 h-5" />, desc: 'Yeni öğrendiği bir Türkçe tekerlemeyi veya şarkıyı söylediği anı paylaşın!' },
    { id: 'culture-joy', title: 'Kültür ve Bayram Neşesi', points: 60, icon: <Gift className="w-5 h-5" />, desc: 'Bayramlarda veya kültürel hazırlık yaparken çekilmiş bir kare paylaşın!' },
];

const MISSIONS_SOCIAL = [
    { id: 'follow-us', title: 'Takip Et & Kazan', points: 30, icon: <Instagram className="w-5 h-5" />, desc: 'Instagram ve YouTube kanallarımıza abone olun, ekran görüntüsü iletin!' },
    { id: 'lesson-moment', title: 'Dersten Bir Kare', points: 50, icon: <Camera className="w-5 h-5" />, desc: 'Çocuğunuzun ders esnasındaki heyecanını yansıtan bir fotoğraf paylaşın!' },
    { id: 'tell-story', title: 'Hikayeni Anlat', points: 100, icon: <Share2 className="w-5 h-5" />, desc: 'Dersten kısa bir videoyu veya en sevdiğiniz anı Story\'de paylaşın!' },
    { id: 'feedback', title: 'Deneyimini Paylaş', points: 70, icon: <MessageCircle className="w-5 h-5" />, desc: 'Eğitim sürecimiz hakkındaki değerli görüşlerinizi WhatsApp üzerinden paylaşın!' },
];

export default function PuanMerkeziPage() {
    const { user } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [selectedMission, setSelectedMission] = useState<any>(null);
    const [isProofDialogOpen, setIsProofDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishingReview, setIsPublishingReview] = useState(false);
    const [isEditingCode, setIsEditingCode] = useState(false);
    const [newReferralCode, setNewReferralCode] = useState('');
    const [isChildSelectOpen, setIsChildSelectOpen] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState('');
    
    const userDocRef = useMemoFirebase(() => (db && user?.uid) ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
    const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);
    
    const childrenRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return collection(db, 'users', user.uid, 'children');
    }, [db, user?.uid]);
    const { data: children, isLoading: childrenLoading } = useCollection(childrenRef);

    const balance = userData?.walletBalanceEur || 0;
    const points = userData?.academyPoints || 0;
    const packages = userData?.totalPackagesPurchased || 0;
    const referralCode = userData?.referralCode || `TCA-${userData?.firstName?.toUpperCase() || 'VELI'}-2026`;

    const handleMissionAction = (mission: any) => {
        setSelectedMission(mission);
        setIsProofDialogOpen(true);
    };

    const handleSendProof = async () => {
        if (!user || !userDocRef || !selectedMission) return;
        setIsSaving(true);

        const message = `Merhaba! "${selectedMission.title}" görevini tamamladım. Kanıtım ektedir. (ID: ${user.uid})`;
        window.open(`https://wa.me/905058029734?text=${encodeURIComponent(message)}`, '_blank');

        try {
            await updateDoc(userDocRef, {
                [`taskStatus.${selectedMission.id}`]: 'pending'
            });

            await addDoc(collection(db, 'loyalty-requests'), {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName || 'İsimsiz Veli',
                taskId: selectedMission.id,
                taskTitle: selectedMission.title,
                points: selectedMission.points,
                status: 'pending',
                createdAt: serverTimestamp()
            });

            toast({ title: 'Kanıt Gönderildi!', description: 'Onaylandıktan sonra puanınız eklenecektir.' });
            setIsProofDialogOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralCode);
        toast({ title: 'Kod Kopyalandı!', description: 'Davet kodunuz panoya kaydedildi.' });
    };

    const shareReferralOnWhatsapp = () => {
        const message = `Selam! Çocuğum TCA (Turkish Culture Academy) ile harika Türkçe dersleri alıyor. Sen de denemek istersen bu kodla %5 indirimli kayıt olabilirsin: ${referralCode} Link: https://turkcocukakademisi.com`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleSaveReferralCode = async () => {
        if (!newReferralCode.trim() || !userDocRef) return;
        setIsSaving(true);
        try {
            await updateDoc(userDocRef, {
                referralCode: newReferralCode.trim().toUpperCase()
            });
            setIsEditingCode(false);
            toast({ title: 'Başarılı!', description: 'Davet kodunuz güncellendi.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Kod güncellenirken hata oluştu.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleClaimFreeLesson = async () => {
        if (!userDocRef || points < 500 || !selectedChildId) return;
        setIsSaving(true);
        try {
            const childDocRef = doc(db, 'users', user!.uid, 'children', selectedChildId);
            const batch = writeBatch(db);
            
            batch.update(userDocRef, {
                academyPoints: increment(-500)
            });
            batch.update(childDocRef, {
                remainingLessons: increment(1)
            });
            await batch.commit();

            toast({
                title: 'Tebrikler! 🎉',
                description: '1 Bedava Ders çocuğunuzun hesabına başarıyla tanımlandı.',
                className: 'bg-green-500 text-white'
            });
            setIsChildSelectOpen(false);
            setSelectedChildId('');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata', description: 'İşlem sırasında bir hata oluştu.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (userDataLoading || childrenLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-12 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen font-sans">
            {/* ÜST ALAN: CÜZDAN ÖZETİ */}
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
                                <div className="p-4 bg-white/10 rounded-3xl"><Wallet className="w-10 h-10 text-primary" /></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Mevcut Bakiyeniz</p>
                                    <p className="text-5xl font-black">{balance.toFixed(2)} <span className="text-xl opacity-50">EUR 💶</span></p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Akademi Puanınız</p>
                                        <p className="text-3xl font-black text-yellow-400">{points} / 500 <span className="text-sm opacity-50 uppercase tracking-widest ml-1">Puan 🌟</span></p>
                                    </div>
                                    <Badge className="bg-green-500/20 text-green-400 border-none font-black text-[10px] px-3 py-1">HEDİYE DERSE {Math.max(0, 500 - points)} KALDI</Badge>
                                </div>
                                <Progress value={Math.min(100, (points / 500) * 100)} className="h-4 bg-white/10" />
                                <p className="text-[10px] text-slate-400 font-bold italic text-center uppercase tracking-widest">"150 puan daha kazanın, 1 Bedava Ders kazanın!"</p>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 space-y-4">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-primary" />
                                <h4 className="font-black text-sm uppercase tracking-widest">Sadakat Ödülleri</h4>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                500 puana ulaştığınızda bu ekrandan <span className="text-white font-bold underline decoration-primary underline-offset-4">1 Bedava Ders</span> talep edebilirsiniz. Aşağıdaki menüden görevleri yaparak süreci hızlandırabilirsiniz!
                            </p>
                            {points >= 500 && (
                                <Button
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold"
                                    onClick={() => setIsChildSelectOpen(true)}
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="animate-spin mr-2" /> : "🎁 "}
                                    1 Bedava Ders Hediyemi Al
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ANA MENÜ AKIŞI */}
            <div className="max-w-6xl mx-auto space-y-20">

                {/* 1. SADAKAT YOLCULUĞU */}
                <section className="space-y-8">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center justify-center gap-3">
                            <Star className="w-6 h-6 text-primary fill-current" /> Sadakat Yolculuğu
                        </h3>
                        <p className="text-slate-500 text-sm font-medium italic">Kurs aldıkça ilerleyin, sürprizleri toplayın.</p>
                    </div>
                    <div className="max-w-2xl mx-auto space-y-3 py-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>İlerleme Durumu</span>
                            <span className="text-primary">{packages} Kurs / 20 Hedef</span>
                        </div>
                        <Progress value={Math.min(100, (packages / 20) * 100)} className="h-4 bg-slate-200" />
                        <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-1">
                            {packages >= 20 ? 'Tebrikler, Onur Üyesisiniz! 🎉' : `BİR SONRAKİ KİLİDE ${[1, 5, 10, 15, 20].find(t => t > packages)! - packages} KURS KALDI`}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            { step: 1, title: 'Hoş Geldiniz!', desc: 'İlk adımınızı attınız, mutluyuz!', reward: '10€ Bakiye', active: true, done: true },
                            { step: 5, title: '5. Kurs', desc: 'İstikrarlı bir başlangıç.', reward: '250 Puan', active: packages >= 5, done: packages >= 5 },
                            { step: 10, title: '10. Kurs', desc: 'Kocaman bir adım!', reward: '500 Puan (1 Hediye)', active: packages >= 10, done: packages >= 10 },
                            { step: 15, title: '15. Kurs', desc: 'Kültür Elçimiz.', reward: '350 Puan', active: packages >= 15, done: packages >= 15 },
                            { step: 20, title: 'Onur Üyesi', desc: 'Sonsuz güveniniz için sürpriz!', reward: '500 Puan (1 Hediye)', active: packages >= 20, done: packages >= 20, vıp: true },
                        ].map((item, idx) => (
                            <Card key={idx} className={cn(
                                "relative border-none shadow-xl rounded-[28px] overflow-hidden group transition-all duration-500 hover:-translate-y-2",
                                item.vıp && item.active ? "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white scale-105 shadow-orange-200" : "bg-white",
                                !item.active && "opacity-60 grayscale"
                            )}>
                                <CardHeader className="p-6 pb-2">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm", item.done ? "bg-green-500 text-white" : "bg-slate-100 text-slate-400")}>
                                            {item.done ? <CheckCircle2 className="w-6 h-6" /> : item.step}
                                        </div>
                                        {!item.active && <Lock className="w-5 h-5 text-slate-300" />}
                                    </div>
                                    <CardTitle className={cn("text-xs font-black uppercase tracking-wider", item.vıp && item.active ? "text-white" : "text-slate-800")}>{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0 space-y-4">
                                    <p className={cn("text-[10px] leading-relaxed font-semibold", item.vıp && item.active ? "text-white/90" : "text-slate-500")}>{item.desc}</p>
                                    <Badge className={cn("w-full justify-center text-[10px] font-black py-1.5 rounded-lg", item.vıp && item.active ? "bg-white text-orange-600" : "bg-primary/10 text-primary")}>
                                        {item.reward}
                                    </Badge>
                                    <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] text-center mt-2", item.done ? "text-green-500" : "text-slate-400")}>
                                        {item.done ? "TAMAMLANDI" : item.active ? "İLERLİYOR" : "KİLİTLİ"}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 2. EVDE TÜRKÇE KEYFİ */}
                <section className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl"><Utensils className="w-6 h-6 text-primary" /></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Evde Türkçe Keyfi</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">AYDA 1 KEZ • ETKİLEŞİM GÖREVLERİ</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="px-4 py-1.5 border-slate-300 font-bold text-[10px] uppercase text-slate-400">Sosyal Medya Etiketi Gerekir</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MISSIONS_HOME.map(mission => {
                            const status = userData?.taskStatus?.[mission.id];
                            return (
                                <Card key={mission.id} className="border-none shadow-md hover:shadow-2xl transition-all duration-300 rounded-3xl group overflow-hidden bg-white">
                                    <div className="flex items-center p-5 gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">{mission.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-sm text-slate-800 truncate">{mission.title}</h4>
                                                <Badge className="bg-yellow-400/20 text-yellow-700 text-[9px] font-black border-none">+{mission.points}🌟</Badge>
                                            </div>
                                            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{mission.desc}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={status === 'completed' ? 'secondary' : status === 'pending' ? 'outline' : 'default'}
                                            className="rounded-xl h-9 px-5 font-black text-[10px] uppercase tracking-widest shrink-0"
                                            disabled={!!status}
                                            onClick={() => handleMissionAction(mission)}
                                        >
                                            {status === 'completed' ? '✅ Tamamlandı' : status === 'pending' ? '⏳ Onayda' : 'Yaptım!'}
                                        </Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* 3. SOSYAL MEDYA & TANITIM */}
                <section className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-2xl"><Share2 className="w-6 h-6 text-blue-600" /></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Sosyal Medya & Tanıtım</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">DİJİTAL DÜNYADA BÜYÜYELİM</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MISSIONS_SOCIAL.map(mission => {
                            const status = userData?.taskStatus?.[mission.id];
                            return (
                                <Card key={mission.id} className="border-none shadow-md hover:shadow-2xl transition-all duration-300 rounded-3xl group overflow-hidden bg-white">
                                    <div className="flex items-center p-5 gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">{mission.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-sm text-slate-800 truncate">{mission.title}</h4>
                                                <Badge className="bg-yellow-400/20 text-yellow-700 text-[9px] font-black border-none">+{mission.points}🌟</Badge>
                                            </div>
                                            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{mission.desc}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={status === 'completed' ? 'secondary' : status === 'pending' ? 'outline' : 'default'}
                                            className="rounded-xl h-9 px-5 font-black text-[10px] uppercase tracking-widest shrink-0"
                                            disabled={!!status}
                                            onClick={() => handleMissionAction(mission)}
                                        >
                                            {status === 'completed' ? '✅ Tamamlandı' : status === 'pending' ? '⏳ Onayda' : 'Yaptım!'}
                                        </Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* 4. ARKADAŞINI DAVET ET (VIP) */}
                <section>
                    <Card className="bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 text-white border-none shadow-[0_20px_80px_rgba(79,70,229,0.3)] rounded-[40px] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full translate-y-24 -translate-x-24 blur-2xl" />

                        <div className="relative p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Badge className="bg-white/20 text-white border-none px-4 py-1 text-[10px] font-black tracking-widest uppercase">🤝 REFERANS SİSTEMİ</Badge>
                                        <h3 className="text-4xl font-black tracking-tight leading-tight">Arkadaşını Davet Et, <br />Birlikte Kazanın!</h3>
                                        <p className="text-white/70 font-medium leading-relaxed max-w-sm">
                                            Çocuğunuzun Türkçe yolculuğundaki mutluluğunu dostlarınızla paylaşmaya ne dersiniz? Hem size hem de arkadaşınıza özel büyük ödüllerimiz var.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-emerald-500/20 p-6 rounded-3xl border border-emerald-500/30 backdrop-blur-sm">
                                            <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-2">Sizin Ödülünüz</p>
                                            <p className="text-lg font-black leading-tight">30€ Bakiye <br /><span className="text-xs opacity-60">veya 1 Hediye Ders</span></p>
                                        </div>
                                        <div className="bg-yellow-500/20 p-6 rounded-3xl border border-yellow-500/30 backdrop-blur-sm">
                                            <p className="text-[10px] font-black text-yellow-300 uppercase tracking-widest mb-2">Arkadaşın Ödülü</p>
                                            <p className="text-lg font-black leading-tight">%5 İndirim <br /><span className="text-xs opacity-60">Kurs Alımında</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/10 border border-white/20 rounded-[32px] p-8 backdrop-blur-md">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4 text-center">ÖZEL DAVET KODUNUZ</p>
                                        {isEditingCode ? (
                                            <div className="flex gap-3">
                                                <input
                                                    value={newReferralCode}
                                                    onChange={(e) => setNewReferralCode(e.target.value)}
                                                    className="flex-1 bg-white text-slate-900 font-black text-xl flex items-center justify-center rounded-2xl h-16 px-4 uppercase tracking-wider shadow-inner outline-none"
                                                    placeholder="YENİ KOD"
                                                    maxLength={15}
                                                />
                                                <Button size="icon" onClick={handleSaveReferralCode} disabled={isSaving} className="h-16 w-16 bg-green-500 hover:bg-green-600 rounded-2xl transition-all active:scale-95 border border-green-400"><CheckCircle2 className="w-6 h-6" /></Button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <div className="flex-1 bg-white text-slate-900 font-black text-2xl flex items-center justify-center rounded-2xl h-16 uppercase tracking-wider shadow-inner">
                                                    {referralCode}
                                                </div>
                                                <Button size="icon" onClick={() => { setIsEditingCode(true); setNewReferralCode(referralCode); }} className="h-16 w-16 bg-white/20 hover:bg-white/30 rounded-2xl transition-all active:scale-95 border border-white/10"><Pencil className="w-6 h-6" /></Button>
                                                <Button size="icon" onClick={copyReferralCode} className="h-16 w-16 bg-white/20 hover:bg-white/30 rounded-2xl transition-all active:scale-95 border border-white/10"><Copy className="w-6 h-6" /></Button>
                                            </div>
                                        )}
                                    </div>
                                    <Button className="w-full h-16 bg-green-500 hover:bg-green-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-slate-900/40 transition-all hover:scale-[1.02] active:scale-95" onClick={shareReferralOnWhatsapp}>
                                        <MessageCircle className="mr-3 w-7 h-7" /> WHATSAPP'TA PAYLAŞ
                                    </Button>
                                    <p className="text-[9px] text-white/40 text-center uppercase tracking-widest font-bold">Arkadaşınız ilk kursunu aldığında ödülünüz otomatik tanımlanır.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>

            {/* PROOF DIALOG */}
            <Dialog open={isProofDialogOpen} onOpenChange={setIsProofDialogOpen}>
                <DialogContent className="rounded-[40px] p-10 max-w-md border-none shadow-2xl">
                    <DialogHeader className="items-center text-center space-y-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                            <Camera className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Harika Bir Haber! 🎉</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium leading-relaxed px-2">
                                "{selectedMission?.title}" görevini tamamladığınız için teşekkürler!
                                <br /><br />
                                Eğer sosyal medyada paylaştıysanız bize ekran görüntüsünü iletin; paylaşmadıysanız bizim paylaşmamız için görseli doğrudan iletin.
                                <br /><br />
                                <span className="text-[10px] font-black text-primary uppercase italic">Not: Yüz görünme zorunluluğu yoktur.</span>
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="mt-8 flex flex-col gap-3">
                        <Button className="w-full h-14 bg-green-500 hover:bg-green-600 font-black text-base rounded-2xl shadow-xl shadow-green-100" onClick={handleSendProof} disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <MessageCircle className="mr-2 w-5 h-5" />}
                            WHATSAPP İLE KANIT GÖNDER 🟢
                        </Button>
                        <Button variant="ghost" className="w-full h-12 text-slate-400 font-bold uppercase tracking-widest text-[10px]" onClick={() => setIsProofDialogOpen(false)}>Vazgeç</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isChildSelectOpen} onOpenChange={setIsChildSelectOpen}>
                <DialogContent className="rounded-2xl border-none shadow-xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900">Çocuğunuzu Seçin</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            Kazandığınız 1 bedava dersi kime hediye etmek istiyorsunuz?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-xl font-bold">
                                <SelectValue placeholder="Bir çocuk seçin" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-lg">
                                {children?.map((child: any) => (
                                    <SelectItem key={child.id} value={child.id} className="font-semibold py-3 text-slate-700">
                                        {child.firstName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl font-bold h-12 w-full sm:w-auto" onClick={() => setIsChildSelectOpen(false)}>İptal</Button>
                        <Button className="rounded-xl font-bold h-12 w-full sm:w-auto mt-2 sm:mt-0" onClick={handleClaimFreeLesson} disabled={!selectedChildId || isSaving}>
                            {isSaving ? <Loader2 className="animate-spin mr-2" /> : "Tamamla"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
