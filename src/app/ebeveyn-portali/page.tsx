
'use client';

import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, Plus, ArrowRight, Star, Award, BookOpen, Users, Rocket, Settings, CreditCard, Clock, MonitorPlay, FileText, CheckCircle, MessageSquare, Calendar, History, Lightbulb, Bell, Megaphone, ArrowUpRight, X, Lock, Heart, AlertTriangle, Wallet, Gift, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AddChildForm } from '@/components/parent-portal/add-child-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { collection, doc, deleteDoc, updateDoc, query, where, getDocs, writeBatch, increment, arrayUnion } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ProgressPanel } from '@/components/shared/progress-panel';
import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, subHours } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';


const MAX_LIVES = 5;

function StatCard({ title, value, icon: Icon, unit, children, className }: { title: string, value: string | number, icon: React.ElementType, unit?: string, children?: React.ReactNode, className?: string }) {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {children ? (
          children
        ) : (
          <div className="text-2xl font-bold">
            {value} {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ChildCard({ child, isPremium, currentLives, onDelete, userId, onChildUpdated }: { child: any, isPremium: boolean, currentLives: number, onDelete: (id: string, assignedPackage: string | null, remainingLessons: number) => void, userId: string, onChildUpdated: () => void }) {
    const isProfileIncomplete = child.isProfileComplete === false;

    const IncompleteProfileWrapper = ({ children }: { children: React.ReactNode }) => {
        if (!isProfileIncomplete) return <>{children}</>;
        return (
            <AddChildForm userId={userId} onChildAdded={onChildUpdated} child={child} childId={child.id}>
                 {children}
            </AddChildForm>
        );
    };

    return (
        <IncompleteProfileWrapper>
            <Card className={cn("relative flex flex-col items-center text-center p-6 space-y-4 hover:shadow-lg transition-shadow group rounded-2xl cursor-pointer", isProfileIncomplete && "border-destructive border-2")}>
                {isProfileIncomplete && (
                    <div className="absolute top-2 right-2 text-destructive"><AlertTriangle className="w-5 h-5"/></div>
                )}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute top-2 left-2 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive" onClick={e => e.stopPropagation()}>
                            <X className="w-4 h-4"/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>"{child.firstName}" isimli çocuğu silmek istediğinizden emin misiniz?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(child.id, child.assignedPackage, child.remainingLessons)} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Avatar className="h-20 w-20 text-3xl">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">{child.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg">{child.firstName}</p>
                <div className='w-full space-y-3 pt-4'>
                    <div className='flex justify-between items-center text-sm'>
                        <span className='text-muted-foreground'>Seviye:</span>
                        <div className='flex items-center gap-1 font-bold bg-primary/10 text-primary px-2 py-1 rounded-md'>
                            <span>{child.cefrProfile?.speaking?.toUpperCase() || 'PreA1'}</span><GraduationCap className='w-4 h-4'/>
                        </div>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                        <span className='text-muted-foreground'>Kalan Can:</span>
                        <div className='flex items-center gap-1 font-bold bg-red-100 text-red-600 px-2 py-1 rounded-md'>
                            {isPremium ? <Lock className='w-4 h-4' /> : <span>{currentLives}/{MAX_LIVES}</span>}
                            <Heart className='w-4 h-4 fill-current'/>
                        </div>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                        <span className='text-muted-foreground'>Kalan Ders:</span>
                        <div className='flex items-center gap-1 font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-md'>
                            <span>{child.remainingLessons || 0}</span><BookOpen className='w-4 h-4'/>
                        </div>
                    </div>
                    {!isProfileIncomplete && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full mt-4" onClick={(e) => e.stopPropagation()}>
                                    <FileText className="mr-2 h-4 w-4" />İlerleme Paneli
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl h-[90vh]">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-bold font-headline">{child.firstName} İlerleme Paneli</DialogTitle>
                                </DialogHeader>
                                <ProgressPanel child={child} isEditable={false} />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </Card>
        </IncompleteProfileWrapper>
    );
}

export default function EbeveynPortaliPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => (db && user?.uid) ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);
  
  const childrenRef = useMemoFirebase(() => (db && user?.uid) ? collection(db, 'users', user.uid, 'children') : null, [db, user?.uid]);
  const { data: children, isLoading: childrenLoading, refetch: refetchChildren } = useCollection(childrenRef);

  const slotsQuery = useMemoFirebase(() => (db && user?.uid) ? query(collection(db, 'lesson-slots'), where('bookedBy', '==', user.uid)) : null, [db, user?.uid]);
  const { data: slots, isLoading: slotsLoading } = useCollection(slotsQuery);

  const notifications = useMemo(() => {
    if (!slots || !children) return [];
    const list: any[] = [];
    const now = new Date();
    const twentyFourHoursAgo = subHours(now, 24);
    
    // 1. Gelecek Dersler
    const upcomingLessons = slots
      .filter(s => isAfter(s.startTime.toDate(), now))
      .sort((a, b) => a.startTime.seconds - b.startTime.seconds);
    
    upcomingLessons.forEach((s, idx) => {
      list.push({ 
        id: `up-${s.id || Math.random()}`, 
        type: 'lesson', 
        icon: <Calendar className="h-4 w-4" />, 
        color: 'bg-blue-100 text-blue-600', 
        title: idx === 0 ? '⏰ Sıradaki Ders:' : '📅 Gelecek Ders:', 
        text: `${format(s.startTime.toDate(), 'EEEE HH:mm', { locale: tr })}'da.`, 
        fullText: `${format(s.startTime.toDate(), 'dd MMMM yyyy EEEE HH:mm', { locale: tr })} tarihinde dersiniz bulunuyor.`,
        path: '/ebeveyn-portali/dersler' 
      });
    });

    // 2. Yeni Tamamlanan Dersler (Son 24 saat)
    const justFinished = slots
      .filter(s => isBefore(s.startTime.toDate(), now) && isAfter(s.startTime.toDate(), twentyFourHoursAgo))
      .sort((a, b) => b.startTime.seconds - a.startTime.seconds);

    justFinished.forEach(s => {
        list.push({
            id: `done-${s.id}`,
            type: 'completed',
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: 'bg-emerald-100 text-emerald-600',
            title: '✅ Ders Tamamlandı:',
            text: `Bugünkü ders başarıyla işlendi.`,
            fullText: `Bugünkü dersiniz başarıyla tamamlandı. Öğretmeninizin notlarını yakında görebilirsiniz.`,
            path: '/ebeveyn-portali/dersler?tab=past'
        });
    });

    // 3. Öğretmen Geri Bildirimleri
    const feedbacks = slots
      .filter(s => s.feedback && isBefore(s.startTime.toDate(), now))
      .sort((a, b) => b.startTime.seconds - a.startTime.seconds);
    
    feedbacks.forEach((s, idx) => {
      list.push({ 
        id: `fb-${s.id || Math.random()}`, 
        type: 'pdr', 
        icon: <MessageSquare className="h-4 w-4" />, 
        color: 'bg-purple-100 text-purple-600', 
        title: '💬 Yeni Geri Bildirim:', 
        text: `"${s.feedback.text.substring(0, 50)}..."`, 
        fullText: s.feedback.text,
        path: '/ebeveyn-portali/dersler?tab=past' 
      });
    });

    // 4. Seviye Atlamaları / Değişiklikleri
    children.forEach(child => {
        if (child.cefrProfile?.speaking && child.cefrProfile.speaking !== 'preA1') {
            list.push({
                id: `level-${child.id}`,
                type: 'level',
                icon: <GraduationCap className="h-4 w-4" />,
                color: 'bg-yellow-100 text-yellow-700',
                title: '🎓 Seviye Güncellendi:',
                text: `${child.firstName} artık ${child.cefrProfile.speaking.toUpperCase()} seviyesinde!`,
                fullText: `${child.firstName} isimli öğrencimizin dil gelişimi takip edildi ve seviyesi ${child.cefrProfile.speaking.toUpperCase()} olarak güncellendi.`,
                path: '/ebeveyn-portali'
            });
        }
    });

    return list;
  }, [slots, children]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (notifications.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [notifications]);

  useEffect(() => {
    if (!userLoading && (!user || user.isAnonymous)) router.push('/login');
  }, [user, userLoading, router]);

  const handleDeleteChild = async (childId: string, assignedPackage: string | null, remainingLessons: number) => {
    if (!db || !user?.uid || !userDocRef) return;
    const childRef = doc(db, 'users', user.uid, 'children', childId);
    try {
        const batch = writeBatch(db);
        if (assignedPackage && remainingLessons > 0) {
            batch.update(userDocRef, { enrolledPackages: arrayUnion(assignedPackage), remainingLessons: increment(remainingLessons) });
        }
        batch.delete(childRef);
        await batch.commit();
        toast({ title: 'Çocuk Silindi', className: 'bg-green-500 text-white' });
    } catch (e) {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: childRef.path, operation: 'delete' }));
    }
  };

  if (userLoading || childrenLoading || userDataLoading || slotsLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  if (!user || user.isAnonymous) return null;

  const totalUnassignedLessons = userData?.remainingLessons || 0;
  const balance = userData?.walletBalanceEur || 0;
  const points = userData?.academyPoints || 0;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Hoş geldiniz, {user.displayName?.split(' ')[0]}! 👋</h2>
            <p className="text-muted-foreground font-medium">Türkçe serüveninizde bugün neler var?</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
        <StatCard title="Kalan Toplam Ders" value={totalUnassignedLessons} icon={BookOpen} unit="Ders" />
        <StatCard title="Cüzdan & Puan" value="" icon={Wallet}>
            <div className="space-y-1">
                <p className="text-xl font-black text-slate-900">{balance.toFixed(2)}€</p>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-yellow-600">
                    <span>{points} Puan</span>
                    <Link href="/ebeveyn-portali/puan-merkezi" className="text-primary hover:underline">Magaza &gt;</Link>
                </div>
            </div>
        </StatCard>
        <StatCard title="Toplam Çocuk" value={children?.length || 0} icon={Users} />
        
        <Dialog>
            <DialogTrigger asChild>
                <Card className="col-span-1 border-primary/20 shadow-lg bg-white overflow-hidden flex flex-col cursor-pointer group hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5 shrink-0">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Bell className="h-4 w-4 text-primary animate-pulse" /> Bildirimler 
                            {notifications.length > 0 && <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">{notifications.length}</Badge>}
                        </CardTitle>
                        <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent className="p-0 flex-1 relative bg-slate-50/30 overflow-hidden">
                        {notifications.length > 0 ? (
                            <div className="h-full flex flex-col justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="p-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn("mt-1 p-2 rounded-lg shrink-0", notifications[currentIndex].color)}>{notifications[currentIndex].icon}</div>
                                            <div className="space-y-1">
                                                <p className="text-xs leading-tight text-slate-800 font-bold">{notifications[currentIndex].title}</p>
                                                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{notifications[currentIndex].text}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                                    {notifications.map((_, i) => (
                                        <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === currentIndex ? "w-4 bg-primary" : "w-1 bg-slate-200")} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                <Bell className="h-8 w-8 text-slate-200 mb-2" />
                                <p className="text-xs text-slate-400 font-medium">Yeni bildirim yok.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Tüm Bildirimler</DialogTitle>
                    <DialogDescription>Aktif dersleriniz ve öğretmenlerinizden gelen notlar.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 py-4">
                    {notifications.length > 0 ? notifications.map((notif) => (
                        <div key={notif.id} className="p-4 rounded-xl border bg-card hover:bg-accent transition-colors cursor-pointer" onClick={() => router.push(notif.path)}>
                            <div className="flex items-start gap-4">
                                <div className={cn("p-2 rounded-lg", notif.color)}>{notif.icon}</div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold leading-none">{notif.title}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{notif.fullText || notif.text}</p>
                                    <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary" onClick={() => router.push(notif.path)}>
                                        Detayı Gör <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8">
                            <Bell className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-muted-foreground">Şu an gösterilecek bir bildirim bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Card className="p-6 bg-gradient-to-br from-green-100 to-teal-100 border-green-200 hover:shadow-lg transition-all cursor-pointer group" onClick={() => router.push('/ebeveyn-portali/ders-planla')}>
              <h3 className="text-xl font-black flex items-center gap-2 text-slate-800"><Rocket className="text-green-600 group-hover:scale-110 transition-transform"/> Ders Planla</h3>
              <p className="text-xs text-slate-600 mt-2 font-medium">Yeni dersler planlayın veya mevcutları yönetin.</p>
              <ArrowRight className="mt-4 text-green-600 group-hover:translate-x-2 transition-transform" />
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200 hover:shadow-lg transition-all cursor-pointer group" onClick={() => router.push('/ebeveyn-portali/dersler')}>
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-800"><Calendar className="text-blue-600 group-hover:scale-110 transition-transform"/> Derslerim</h3>
                <p className="text-xs text-slate-600 mt-2 font-medium">Yaklaşan derslerinizi ve takvimi görüntüleyin.</p>
                <ArrowRight className="mt-4 text-blue-600 group-hover:translate-x-2 transition-transform" />
            </Card>

             <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 hover:shadow-lg transition-all cursor-pointer group" onClick={() => router.push('/ebeveyn-portali/puan-merkezi')}>
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-800"><Gift className="text-purple-600 group-hover:scale-110 transition-transform"/> Puan Merkezi</h3>
                <p className="text-xs text-slate-600 mt-2 font-medium">Görevleri yapın, bedava ders kazanın.</p>
                <ArrowRight className="mt-4 text-purple-600 group-hover:translate-x-2 transition-transform" />
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200 hover:shadow-lg transition-all cursor-pointer group" onClick={() => router.push('/kurslar')}>
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-800"><CreditCard className="text-orange-600 group-hover:scale-110 transition-transform"/> Paket Al</h3>
                <p className="text-xs text-slate-600 mt-2 font-medium">İhtiyacınıza uygun yeni paketler seçin.</p>
                <ArrowRight className="mt-4 text-orange-600 group-hover:translate-x-2 transition-transform" />
            </Card>
        </div>

        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Çocuklarım</h3>
                <AddChildForm userId={user.uid} onChildAdded={refetchChildren}>
                    <Button className="rounded-xl font-black text-xs uppercase tracking-widest"><Plus className="mr-2 h-4 w-4" /> Çocuk Ekle</Button>
                </AddChildForm>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {children?.map(child => <ChildCard key={child.id} child={child} isPremium={userData.isPremium} currentLives={userData.lives} onDelete={handleDeleteChild} userId={user.uid} onChildUpdated={refetchChildren} />)}
                {children?.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">Henüz bir çocuk eklenmemiş.</div>}
            </div>
        </div>
    </div>
  );
}
