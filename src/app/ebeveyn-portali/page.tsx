'use client';

import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { 
  Loader2, 
  Plus, 
  ArrowRight, 
  Star, 
  Award, 
  BookOpen, 
  Users, 
  Rocket, 
  Settings, 
  CreditCard, 
  Clock, 
  MonitorPlay, 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  Calendar, 
  History, 
  Lightbulb, 
  Bell, 
  Megaphone, 
  ArrowUpRight, 
  X, 
  Lock, 
  Heart, 
  AlertTriangle, 
  Wallet, 
  Gift, 
  GraduationCap,
  CheckCircle2,
  Package
} from 'lucide-react';
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
import { format, isAfter, isBefore, isToday, isTomorrow, subHours } from 'date-fns';
import { tr } from 'date-fns/locale';
import { COURSES } from '@/data/courses';


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
    const router = useRouter();

    const currentCourse = COURSES.find(c => c.id === child.assignedPackage);
    const recommendedCourseId = child.recommendedCourseId;
    const recommendedCourse = COURSES.find(c => c.id === recommendedCourseId);

    const content = (
        <Card className={cn("relative flex flex-col items-center p-8 hover:shadow-lg transition-shadow group rounded-3xl border-slate-200 h-full bg-white", isProfileIncomplete && "border-destructive border-2")}>
            {isProfileIncomplete && (
                <div className="absolute top-4 right-4 text-destructive"><AlertTriangle className="w-5 h-5"/></div>
            )}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-2 left-2 h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive" onClick={e => e.stopPropagation()}>
                        <X className="w-5 h-5"/>
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
            
            <div className="flex flex-col items-center gap-4">
                <Avatar className="h-[90px] w-[90px] border-0">
                    <AvatarFallback className="bg-[#E0F2F1] text-[#00897B] font-black text-4xl uppercase tracking-tighter">{child.firstName?.charAt(0) || 'C'}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h3 className="font-bold text-xl text-slate-800">{child.firstName || 'Cocuk'}</h3>
                    <Badge variant="outline" className="mt-1 bg-primary/5 text-primary border-primary/20 text-[10px] font-black">
                        {child.cefrProfile?.speaking?.toUpperCase() || 'PRE-A1'} SEVİYESİ
                    </Badge>
                </div>
            </div>

            <div className='w-full space-y-4 pt-6'>
                <div className='flex justify-between items-center'>
                    <span className='text-slate-500 font-medium text-[15px]'>Rozetler:</span>
                    <div className='flex items-center gap-1.5 font-bold bg-[#E0F2F1] text-[#00897B] px-3 py-1 rounded-full text-[14px] min-w-[50px] justify-center'>
                        <span>{(child.badges || []).length}</span><Award className='w-4 h-4'/>
                    </div>
                </div>
                
                <div className='flex justify-between items-center'>
                    <span className='text-slate-500 font-medium text-[15px]'>Kalan Can:</span>
                    <div className='flex items-center gap-1.5 font-bold bg-[#FFEBEE] text-[#E53935] px-3 py-1 rounded-full text-[14px] min-w-[50px] justify-center'>
                        <span>{isPremium ? MAX_LIVES : currentLives}/{MAX_LIVES}</span>
                        <Heart className={cn('w-4 h-4', isPremium ? 'fill-[#E53935]' : 'fill-[#E53935]')}/>
                    </div>
                </div>

                <div className='flex justify-between items-center relative'>
                    <span className='text-slate-500 font-medium text-[15px]'>Kalan Ders:</span>
                    <div className='flex items-center gap-1.5 font-bold bg-[#E8EAF6] text-[#3F51B5] px-3 py-1 rounded-full text-[14px] min-w-[50px] justify-center relative'>
                        <span>{child.remainingLessons || 0}</span><BookOpen className='w-4 h-4'/>
                        
                        {child.showPlusOne && (
                            <div className="absolute -right-8 -top-4 text-green-600 font-black animate-bounce animation-duration-1000 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100 shadow-sm z-50">
                                <span className="text-sm">+1</span>
                                <Plus className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex justify-between items-center'>
                    <span className='text-slate-500 font-medium text-[15px]'>Kurs:</span>
                    {currentCourse ? (
                        <span className="font-bold text-white bg-[#4CAF50] px-3 py-1 rounded-full text-[13px]">
                            {currentCourse.title.split('(')[0].trim()}
                        </span>
                    ) : (
                        <span className="font-bold text-white bg-[#4CAF50] px-3 py-1 rounded-full text-[13px]">
                            Başlangıç Kursu
                        </span>
                    )}
                </div>

                {recommendedCourse && (
                    <div className="pt-2">
                        <p className="text-[14px] font-medium text-slate-500 flex items-center gap-1.5 mb-2">
                            <Lightbulb className="w-4 h-4 text-slate-400" /> Öğretmen Önerisi:
                        </p>
                        <button 
                            className="w-full flex items-center justify-between border border-[#4CAF50] bg-[#F1F8F1] text-[#2E7D32] rounded-xl px-4 py-3 hover:bg-[#E8F5E9] transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/kurslar?id=${recommendedCourse.id}`);
                            }}
                        >
                            <span className="font-semibold text-[15px]">{recommendedCourse.title}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
                
                {!isProfileIncomplete && (
                    <div className="pt-3 flex items-center justify-center gap-3">
                        {child.assignedPackage && child.remainingLessons > 0 ? (
                            <Button asChild className="h-10 px-5 text-[13px] font-bold rounded-xl shadow-sm bg-[#4CAF50] text-white hover:bg-[#388E3C] w-auto" variant="default" onClick={(e) => e.stopPropagation()}>
                                <Link href={`/ebeveyn-portali/ders-planla?childId=${child.id}`}>
                                    <Calendar className="w-4 h-4 mr-1.5" /> Planla
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild className="h-10 px-5 text-[13px] font-bold rounded-xl shadow-sm bg-orange-500 hover:bg-orange-600 text-white w-auto" variant="default" onClick={(e) => e.stopPropagation()}>
                                <Link href="/ebeveyn-portali/paketlerim">
                                    <Package className="w-4 h-4 mr-1.5" /> Ata
                                </Link>
                            </Button>
                        )}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-10 px-5 text-slate-700 font-bold text-[13px] rounded-xl gap-1.5 border-slate-200 bg-white hover:bg-slate-50 w-auto" onClick={(e) => e.stopPropagation()}>
                                    <FileText className="h-4 w-4" /> Rapor
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl h-[90vh]">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-bold font-headline">{child.firstName} İlerleme Paneli</DialogTitle>
                                </DialogHeader>
                                <ProgressPanel child={child} isEditable={false} />
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </Card>
    );

    if (isProfileIncomplete) {
        return (
            <AddChildForm userId={userId} onChildAdded={onChildUpdated} child={child} childId={child.id}>
                {content}
            </AddChildForm>
        );
    }

    return content;
}

export default function EbeveynPortaliPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
        <EbeveynPortaliContent />
    </Suspense>
  );
}

function EbeveynPortaliContent() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const userDocRef = useMemoFirebase(() => (db && user?.uid) ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);
  
  const childrenRef = useMemoFirebase(() => (db && user?.uid) ? collection(db, 'users', user.uid, 'children') : null, [db, user?.uid]);
  const { data: children, isLoading: childrenLoading, refetch: refetchChildren } = useCollection(childrenRef);

  const slotsQuery = useMemoFirebase(() => (db && user?.uid) ? query(collection(db, 'lesson-slots'), where('bookedBy', '==', user.uid)) : null, [db, user?.uid]);
  const { data: slots, isLoading: slotsLoading } = useCollection(slotsQuery);

  const [refundChildId, setRefundChildId] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('cancelled') === 'true') {
        const id = searchParams.get('childId');
        setRefundChildId(id);
        const timer = setTimeout(() => {
            setRefundChildId(null);
            // Optional: clean URL
            router.replace('/ebeveyn-portali');
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  const childrenWithEffect = useMemo(() => {
      if (!children) return [];
      return children.map(c => ({
          ...c,
          showPlusOne: c.id === refundChildId
      }));
  }, [children, refundChildId]);

  const notifications = useMemo(() => {
    if (!slots || !childrenWithEffect) return [];
    const list: any[] = [];
    const now = new Date();
    
    // 1. Sıradaki Ders (Gelecek)
    const nextLesson = slots
      .filter(s => {
          const startTime = s.startTime.toDate ? s.startTime.toDate() : new Date(s.startTime);
          return isAfter(startTime, now);
      })
      .sort((a, b) => {
          const aTime = a.startTime.seconds || new Date(a.startTime).getTime() / 1000;
          const bTime = b.startTime.seconds || new Date(b.startTime).getTime() / 1000;
          return aTime - bTime;
      })[0];
    
    if (nextLesson) {
      const date = nextLesson.startTime.toDate ? nextLesson.startTime.toDate() : new Date(nextLesson.startTime);
      let datePrefix = '';
      if (isToday(date)) datePrefix = 'Bugün ';
      else if (isTomorrow(date)) datePrefix = 'Yarın ';
      else datePrefix = format(date, 'dd MMM ', { locale: tr });

      list.push({ 
        id: `next-${nextLesson.id || Math.random()}`, 
        type: 'lesson', 
        icon: <Calendar className="h-4 w-4" />, 
        color: 'bg-blue-100 text-blue-600', 
        title: '⏰ Sıradaki Ders:', 
        text: `${datePrefix}${format(date, 'HH:mm')}`, 
        fullText: `${format(date, 'dd MMMM yyyy EEEE HH:mm', { locale: tr })} tarihinde dersiniz bulunuyor.`,
        path: '/ebeveyn-portali/dersler' 
      });
    }

    // 2. Yeni Tamamlanan Ders (Geçmiş 24 saat)
    const lastCompleted = slots
      .filter(s => {
          const startTime = s.startTime.toDate ? s.startTime.toDate() : new Date(s.startTime);
          return isBefore(startTime, now) && isAfter(startTime, subHours(now, 24));
      })
      .sort((a, b) => {
          const aTime = a.startTime.seconds || new Date(a.startTime).getTime() / 1000;
          const bTime = b.startTime.seconds || new Date(b.startTime).getTime() / 1000;
          return bTime - aTime;
      })[0];
    
    if (lastCompleted) {
        const date = lastCompleted.startTime.toDate ? lastCompleted.startTime.toDate() : new Date(lastCompleted.startTime);
        list.push({
            id: `done-${lastCompleted.id}`,
            type: 'done',
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: 'bg-emerald-100 text-emerald-600',
            title: '✅ Ders Tamamlandı:',
            text: `${format(date, 'dd MMMM', { locale: tr })} dersi başarıyla işlendi.`,
            fullText: 'Çocuğunuzun bugünkü performansı sisteme kaydedildi.',
            path: '/ebeveyn-portali/dersler?tab=past'
        });
    }

    // 3. Seviye Bilgisi
    childrenWithEffect.forEach(child => {
        if (child.cefrProfile?.speaking) {
            list.push({
                id: `level-${child.id}`,
                type: 'level',
                icon: <GraduationCap className="h-4 w-4" />,
                color: 'bg-amber-100 text-amber-600',
                title: `🎓 ${child.firstName} Seviyesi:`,
                text: `Güncel seviye: ${child.cefrProfile.speaking.toUpperCase()}`,
                fullText: `${child.firstName} akademik olarak ${child.cefrProfile.speaking.toUpperCase()} seviyesinde ilerliyor.`,
                path: '/ebeveyn-portali'
            });
        }
    });

    return list;
  }, [slots, childrenWithEffect]);

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

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="flex-1 w-full text-left">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">Hoş geldiniz, {user.displayName?.split(' ')[0]}! 👋</h2>
            <p className="text-muted-foreground font-medium mt-2 text-lg">Türkçe serüveninizde bugün neler var?</p>
        </div>

        <div className="w-full lg:w-1/4 shrink-0">
            <Dialog>
                <DialogTrigger asChild>
                    <Card className="border-primary/20 shadow-sm bg-white overflow-hidden flex flex-col cursor-pointer group hover:border-primary transition-colors min-h-[100px] justify-center text-left">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 shrink-0">
                            <div className="flex-1 w-full min-w-0 pr-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-primary animate-pulse shrink-0" /> Bildirimler 
                                    {notifications.length > 1 && <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1 shrink-0">+{notifications.length - 1}</Badge>}
                                </CardTitle>
                                <div className="mt-3">
                                    {notifications.length > 0 ? (
                                        <div className="flex items-start gap-2 max-w-full">
                                            <div className={cn("p-1.5 rounded-lg shrink-0 mt-0.5", notifications[0].color)}>
                                                {notifications[0].icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold truncate text-slate-800">{notifications[0].title}</p>
                                                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 whitespace-normal">{notifications[0].text}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 font-medium">Yeni bildirim yok.</p>
                                    )}
                                </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                    </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Bildirim Detayları</DialogTitle>
                        <DialogDescription>Aktif bildirimleriniz ve öğretmen notlarınız.</DialogDescription>
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
                                        <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary" onClick={(e) => { e.stopPropagation(); router.push(notif.path); }}>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Card className="p-6 bg-gradient-to-br from-green-100 to-teal-100 border-green-200 hover:shadow-lg transition-all cursor-pointer group rounded-2xl" onClick={() => router.push('/ebeveyn-portali/paketlerim')}>
              <h3 className="text-xl font-black flex items-center gap-2 text-slate-800"><Package className="text-green-600 group-hover:scale-110 transition-transform"/> Kurslarım</h3>
              <p className="text-xs text-slate-600 mt-2 font-medium">Satın alma geçmişiniz ve havuzunuz.</p>
              <ArrowRight className="mt-4 text-green-600 group-hover:translate-x-2 transition-transform" />
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200 hover:shadow-lg transition-all cursor-pointer group" onClick={() => router.push('/ebeveyn-portali/dersler')}>
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-800"><Calendar className="text-blue-600 group-hover:scale-110 transition-transform"/> Derslerim</h3>
                <p className="text-xs text-slate-600 mt-2 font-medium">Yaklaşan derslerinizi ve takvimi görüntüleyin.</p>
                <ArrowRight className="mt-4 text-blue-600 group-hover:translate-x-2 transition-transform" />
            </Card>

             <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 hover:shadow-lg transition-all cursor-not-allowed group relative overflow-hidden" onClick={() => toast({ title: 'Yakında Aktif!', description: 'Puan Merkezi yakında sizlerle olacak.' })}>
                <div className="absolute inset-0 bg-slate-200/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <span className="text-2xl font-black text-slate-700 drop-shadow-md tracking-[0.2em]">YAKINDA</span>
                </div>
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-800"><Gift className="text-purple-600 group-hover:scale-110 transition-transform"/> Puan Merkezi</h3>
                <p className="text-xs text-slate-600 mt-2 font-medium">Görevleri yapın, bedava ders kazanın.</p>
                <ArrowRight className="mt-4 text-purple-600 group-hover:translate-x-2 transition-transform" />
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200 hover:shadow-lg transition-all cursor-pointer group" onClick={() => router.push('/kurslar')}>
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-800"><CreditCard className="text-orange-600 group-hover:scale-110 transition-transform"/> Kurs Al</h3>
                <p className="text-xs text-slate-600 mt-2 font-medium">İhtiyacınıza uygun yeni kurslar seçin.</p>
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
                {childrenWithEffect?.map(child => (
                    <ChildCard 
                        key={child.id} 
                        child={child} 
                        isPremium={userData?.isPremium} 
                        currentLives={userData?.currentLives || 0} 
                        onDelete={handleDeleteChild} 
                        userId={user.uid} 
                        onChildUpdated={refetchChildren} 
                    />
                ))}
                {childrenWithEffect?.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">Henüz bir çocuk eklenmemiş.</div>}
            </div>
        </div>
    </div>
  );
}
