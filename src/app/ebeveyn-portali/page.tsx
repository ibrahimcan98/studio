

'use client';

import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, Plus, ArrowRight, Zap, Star, Award, BookOpen, Users, Crown, Rocket, Settings, Target, CreditCard, Clock, ChevronDown, MonitorPlay, FileText, CheckCircle, MessageCircle, TrendingUp, TrendingDown, Book, BrainCircuit, Globe, Smile, Meh, Frown, Languages, Milestone, Cloudy, GraduationCap, User as UserIcon, X, Lock, Infinity as InfinityIcon, Heart, Package, AlertTriangle } from 'lucide-react';
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
import { collection, doc, deleteDoc, updateDoc, getDoc, query, where, getDocs, writeBatch, increment, arrayUnion } from 'firebase/firestore';
import { SetPinDialog } from '@/components/child-mode/set-pin-dialog';
import { useToast } from '@/hooks/use-toast';
import { ProgressPanel } from '@/components/shared/progress-panel';
import { cn } from '@/lib/utils';


const MAX_LIVES = 5;
const MAX_FREE_TRIALS = 3;

function StatCard({ title, value, icon: Icon, unit, children }: { title: string, value: string | number, icon: React.ElementType, unit?: string, children?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
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

function PremiumBadge() {
  return (
    <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
      <Crown className="mr-1 h-3 w-3" />
      Aktif
    </Badge>
  );
}

function ChildCard({ child, isPremium, currentLives, onDelete, userId, onChildUpdated }: { child: any, isPremium: boolean, currentLives: number, onDelete: (id: string, assignedPackage: string | null, remainingLessons: number) => void, userId: string, onChildUpdated: () => void }) {
    const { toast } = useToast();
    const router = useRouter();
    
    const displayLives = Math.max(0, currentLives);
    const hasActivePackage = child.assignedPackage && child.remainingLessons > 0;
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
            <Card 
                className={cn(
                    "relative flex flex-col items-center text-center p-6 space-y-4 hover:shadow-lg transition-shadow group rounded-2xl cursor-pointer",
                    isProfileIncomplete && "border-destructive border-2"
                )}
            >
                {isProfileIncomplete && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="absolute top-2 right-2 text-destructive cursor-help">
                                    <AlertTriangle className="w-5 h-5"/>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Bu profil eksik. Düzenlemek için karta tıklayın.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
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
                            <AlertDialogDescription>
                            "{child.firstName}" isimli çocuğu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve çocuğa ait planlanmış tüm dersler iptal edilecektir.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(child.id, child.assignedPackage, child.remainingLessons)} className="bg-destructive hover:bg-destructive/90">
                                Sil
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Avatar className="h-20 w-20 text-3xl">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">{child.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold text-lg">{child.firstName}</p>
                </div>
                <div className='w-full space-y-3 pt-4'>
                <div className='flex justify-between items-center text-sm'>
                    <span className='text-muted-foreground'>Rozetler:</span>
                    <div className='flex items-center gap-1 font-bold bg-primary/10 text-primary px-2 py-1 rounded-md'>
                    <span>{child.rozet || 0}</span>
                    <Award className='w-4 h-4'/>
                    </div>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='flex justify-between items-center text-sm cursor-help'>
                                <span className='text-muted-foreground'>Kalan Can:</span>
                                <div className='flex items-center gap-1 font-bold bg-red-100 text-red-600 px-2 py-1 rounded-md'>
                                {isPremium ? <InfinityIcon className='w-4 h-4' /> : <span>{displayLives}/{MAX_LIVES}</span>}
                                <Heart className='w-4 h-4 fill-current'/>
                                </div>
                            </div>
                        </TooltipTrigger>
                        {!isPremium && <TooltipContent>Canlar 1 saat 30 dakikada bir yenilenir.</TooltipContent>}
                    </Tooltip>
                </TooltipProvider>
                    <div className='flex justify-between items-center text-sm'>
                        <span className='text-muted-foreground'>Kalan Ders:</span>
                        <div className='flex items-center gap-1 font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-md'>
                            <span>{child.remainingLessons || 0}</span>
                            <BookOpen className='w-4 h-4'/>
                        </div>
                    </div>
                    {hasActivePackage ? (
                        <div className='flex justify-between items-center text-sm'>
                            <span className='text-muted-foreground'>Paket:</span>
                            <Badge variant="secondary">{child.assignedPackageName}</Badge>
                        </div>
                    ) : (
                        <div className='flex justify-between items-center text-sm'>
                            <span className='text-muted-foreground'>Paket:</span>
                            <span className='text-xs text-muted-foreground italic'>Atanmamış</span>
                        </div>
                    )}
                    {!isProfileIncomplete && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full mt-4" onClick={(e) => e.stopPropagation()}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    İlerleme Paneli
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl h-[90vh]">
                            <DialogHeader>
                                    <DialogTitle className="text-3xl font-bold font-headline">{child.firstName} İlerleme Paneli</DialogTitle>
                                    <DialogDescription>Çocuğunuzun Türkçe öğrenme yolculuğuna dair kapsamlı analiz ve raporlar.</DialogDescription>
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

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  
  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);
  
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);


  const isPremium = userData?.isPremium || false;
  const currentLives = userData?.lives ?? 5;
  const hasUsedFreeTrial = (userData?.freeTrialsUsed || 0) > 0;
  
  const childrenRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'users', user.uid, 'children');
  }, [db, user?.uid]);

  const { data: children, isLoading: childrenLoading, refetch: refetchChildren } = useCollection(childrenRef);

 const handleDeleteChild = async (childId: string, assignedPackage: string | null, remainingLessons: number) => {
    if (!db || !user?.uid || !userDocRef) return;

    const childDocRef = doc(db, 'users', user.uid, 'children', childId);
    const lessonSlotsRef = collection(db, 'lesson-slots');
    const q = query(lessonSlotsRef, where("childId", "==", childId), where("status", "==", "booked"));

    try {
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);

        snapshot.forEach(lessonDoc => {
            batch.update(lessonDoc.ref, {
                status: 'available',
                bookedBy: null,
                childId: null,
                packageCode: null
            });
        });

        if (assignedPackage && remainingLessons > 0) {
            batch.update(userDocRef, {
                enrolledPackages: arrayUnion(assignedPackage),
                remainingLessons: increment(remainingLessons)
            });
            toast({ title: 'Paket İade Edildi', description: `Silinen çocuğa ait ${assignedPackage} paketi (${remainingLessons} ders) havuza iade edildi.` });
        }

        batch.delete(childDocRef);

        await batch.commit();

        toast({
            title: 'Çocuk Silindi',
            description: 'Çocuk profili ve ilişkili tüm planlanmış dersler başarıyla silindi/iptal edildi.',
            className: 'bg-green-500 text-white'
        });

    } catch (serverError) {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: childDocRef.path, // We assume the batch fails on deleting the child
                operation: 'delete'
            })
        );
    }
};

  
  if (userLoading || childrenLoading || userDataLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const childCount = children ? children.length : 0;
  const totalRozet = children ? children.reduce((acc, child) => acc + (child.rozet || 0), 0) : 0;
  
  // Calculate total lessons from both the user's unassigned pool and assigned to children
  const assignedLessons = children ? children.reduce((acc, child) => acc + (child.remainingLessons || 0), 0) : 0;
  const unassignedLessons = userData?.remainingLessons || 0;
  const totalRemainingLessons = assignedLessons + unassignedLessons;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Hoş geldiniz, {user.displayName?.split(' ')[0] || 'Ebeveyn'}! 👋</h2>
            <p className="text-muted-foreground">
             👉 Çocuğunuzun Türkçe öğrenme yolculuğunu buradan takip edebilirsiniz.
            </p>
        </div>
         <div className="flex items-center gap-4">
            {children && children.length > 0 && (
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
                            <MonitorPlay className="mr-2 h-4 w-4" /> Çocuk Moduna Geç
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Hangi Çocuk Oynayacak?</DialogTitle>
                            <DialogDescription>
                                Lütfen oynamak için bir çocuk seçin.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                             {children.map(child => (
                                <SetPinDialog key={child.id} childId={child.id}>
                                    <Card className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:bg-muted transition-colors">
                                        <Avatar className="h-16 w-16 text-2xl">
                                            <AvatarFallback className="bg-primary/20 text-primary font-bold">{child.firstName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold">{child.firstName}</span>
                                    </Card>
                                </SetPinDialog>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Kalan Toplam Ders" value={totalRemainingLessons} icon={BookOpen} />
        <StatCard title="Toplam Çocuk" value={childCount} icon={Users} />
        <StatCard title="Toplam Rozet" value={totalRozet} icon={Star} />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Üye</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isPremium ? (
                <PremiumBadge />
              ) : (
                 <Button asChild variant="outline" className="w-full bg-gradient-to-r from-yellow-300 to-orange-400 text-white border-none font-bold">
                    <Link href="/premium">
                        <Crown className="mr-2 h-4 w-4" />
                        Premium'a Yükseltin
                    </Link>
                </Button>
              )}
            </CardContent>
        </Card>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card className="flex flex-col justify-between p-6 bg-gradient-to-br from-green-100 to-teal-100 border-green-200 hover:shadow-lg transition-shadow">
              {hasUsedFreeTrial ? (
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2"><Rocket className="text-green-600"/> Ders Planla</h3>
                  <p className="text-muted-foreground mt-2">Yeni dersler planlayın veya mevcut derslerinizi yönetin.</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2"><Rocket className="text-green-600"/> Ücretsiz Deneme Dersi</h3>
                  <p className="text-muted-foreground mt-2">Platformumuzu ve öğretmenlerimizi tanımak için ücretsiz bir ders planlayın.</p>
                </div>
              )}
              <Button asChild className="mt-4 w-fit bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/ebeveyn-portali/ders-planla">
                    {hasUsedFreeTrial ? "Dersleri Yönet" : "Hemen Planla"}
                  </Link>
              </Button>
            </Card>

            <Card className="flex flex-col justify-between p-6 bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200 hover:shadow-lg transition-shadow">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2"><Package className="text-orange-600"/> Ders Paketi Satın Al</h3>
                    <p className="text-muted-foreground mt-2">Çocuğunuzun ihtiyacına uygun ders paketlerinden birini seçin.</p>
                </div>
                <Button asChild className="mt-4 w-fit bg-orange-500 hover:bg-orange-600 text-white">
                    <Link href="/kurslar">Paketleri İncele</Link>
                </Button>
            </Card>
        </div>


        {/* Children Section */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold">Çocuklarım</h3>
                    <p className="text-muted-foreground">Çocuklarınızı ekleyin ve ilerlemelerini takip edin.</p>
                </div>
                 {user && (
                    <AddChildForm userId={user.uid} onChildAdded={refetchChildren}>
                        <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
                            <Plus className="mr-2 h-4 w-4" /> Çocuk Ekle
                        </Button>
                    </AddChildForm>
                )}
            </div>
            <Card>
                <CardContent className="p-6">
                    {children && children.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {children.map(child => (
                               <ChildCard 
                                    key={child.id}
                                    child={child}
                                    isPremium={isPremium}
                                    currentLives={currentLives}
                                    onDelete={handleDeleteChild}
                                    userId={user.uid}
                                    onChildUpdated={refetchChildren}
                               />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">Henüz bir çocuk eklemediniz.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

    