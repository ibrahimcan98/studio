
'use client';

import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Plus, ArrowRight, Zap, Star, Award, BookOpen, Users, Crown, Rocket, BarChart, Calendar, History, Video, Package, Heart, Shield, X, Lock, Infinity as InfinityIcon, Settings, Target, CreditCard, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { collection, doc, addDoc, deleteDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { SetPinDialog } from '@/components/child-mode/set-pin-dialog';
import { useToast } from '@/hooks/use-toast';


const LIFE_REGEN_SECONDS = 90 * 60; // 1 hour and 30 minutes in seconds
const MAX_LIVES = 5;

function LivesTooltipContent({ userDocRef }: { userDocRef: any }) {
    const { data: userData } = useDoc(userDocRef);
    const lives = userData?.lives;
    const livesLastUpdatedAt = userData?.livesLastUpdatedAt;
    const isPremium = userData?.isPremium || false;

    useEffect(() => {
        if (!userDocRef || isPremium || typeof lives !== 'number' || lives >= MAX_LIVES || !livesLastUpdatedAt?.toDate) {
            return;
        }

        const interval = setInterval(async () => {
            const userSnap = await getDoc(userDocRef);
            const latestUserData = userSnap.data();
            
            if (!latestUserData) return;

            const currentLives = latestUserData.lives;
            const lastUpdatedTimestamp = latestUserData.livesLastUpdatedAt;

            if (currentLives >= MAX_LIVES || !lastUpdatedTimestamp?.toDate) {
                return;
            }

            const lastUpdated = lastUpdatedTimestamp.toDate();
            const now = new Date();
            const diffSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
            
            const livesToRegen = Math.floor(diffSeconds / LIFE_REGEN_SECONDS);

            if (livesToRegen > 0) {
                const newLiveCount = Math.min(MAX_LIVES, currentLives + livesToRegen);
                
                if (newLiveCount > currentLives) {
                     const secondsForLivesGained = (newLiveCount - currentLives) * LIFE_REGEN_SECONDS;
                     const newTimestampDate = new Date(lastUpdated.getTime() + secondsForLivesGained * 1000);

                    await updateDoc(userDocRef, {
                        lives: newLiveCount,
                        livesLastUpdatedAt: newTimestampDate
                    });
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [lives, isPremium, livesLastUpdatedAt, userDocRef]);


    return (
        <TooltipContent>
            <p>Canlar 1 saat 30 dakikada bir yenilenir.</p>
        </TooltipContent>
    );
}


function AddChildDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const db = useFirestore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !db) return;
    
    const childrenRef = collection(db, 'users', userId, 'children');
    
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber)) {
        console.error("Invalid age input");
        return;
    }

    await addDoc(childrenRef, {
      firstName: name,
      dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - ageNumber)).toISOString(),
      level: 'beginner',
      userId: userId,
      rozet: 0,
      completedTopics: [],
    });
    
    setName('');
    setAge('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Çocuk Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Çocuk Ekle</DialogTitle>
          <DialogDescription>
            Çocuğunuzun bilgilerini girerek öğrenme yolculuğuna ekleyin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                İsim
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Çocuğunuzun adı"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Yaş
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="col-span-3"
                placeholder="Örn: 5"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Çocuğu Ekle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


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

function ChildCard({ child, userDocRef, isPremium, currentLives, onDelete }: { child: any, userDocRef: any, isPremium: boolean, currentLives: number, onDelete: (id: string) => void }) {
    const { toast } = useToast();

    const handleStartLearning = (e: React.MouseEvent) => {
        if (!isPremium && currentLives <= 0) {
            e.preventDefault(); // Prevent Dialog from opening
            toast({
                variant: "destructive",
                title: "Can Kalmadı!",
                description: "Lütfen canların dolmasını bekleyiniz.",
            });
        }
    };
    
    const displayLives = Math.max(0, currentLives);

    return (
        <Card className="relative flex flex-col items-center text-center p-6 space-y-4 hover:shadow-lg transition-shadow group">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-2 left-2 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive">
                        <X className="w-4 h-4"/>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                           "{child.firstName}" isimli çocuğu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(child.id)} className="bg-destructive hover:bg-destructive/90">
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
                <p className="text-sm text-muted-foreground">{new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()} yaş</p>
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
                    {!isPremium && <LivesTooltipContent userDocRef={userDocRef} />}
                </Tooltip>
               </TooltipProvider>
            </div>
            <div onClickCapture={handleStartLearning} className="w-full mt-auto">
                 <SetPinDialog childId={child.id}>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
                      Öğrenmeye Başla
                  </Button>
                </SetPinDialog>
            </div>
       </Card>
    );
}

export default function EbeveynPortaliPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);
  
  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);
  const isPremium = userData?.isPremium || false;
  const currentLives = userData?.lives ?? 5;
  
  const childrenRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'users', user.uid, 'children');
  }, [db, user?.uid]);

  const { data: children, isLoading: childrenLoading } = useCollection(childrenRef);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleDeleteChild = async (childId: string) => {
      if (!db || !user?.uid) return;
      const childDocRef = doc(db, 'users', user.uid, 'children', childId);
      await deleteDoc(childDocRef);
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
  const premiumStartDate = userData?.premiumStartDate?.toDate ? userData.premiumStartDate.toDate() : (userData?.premiumStartDate ? new Date(userData.premiumStartDate) : null);
  const enrolledPackages: string[] = userData?.enrolledPackages || [];
  const remainingLessons = userData?.remainingLessons ?? 0;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Hoş geldiniz, {user.displayName?.split(' ')[0] || 'Ebeveyn'}! 👋</h2>
            <p className="text-muted-foreground">
             👉 Çocuğunuzun Türkçe öğrenme yolculuğunu buradan takip edebilirsiniz.
            </p>
        </div>
      </div>

      {isPremium ? (
        <Card className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg border-none">
          <div className="grid md:grid-cols-3 items-center p-6 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8" />
                <div>
                  <h3 className="text-2xl font-bold">Premium Üye</h3>
                   <Badge className="bg-white/30 text-white hover:bg-white/40 mt-1">Aktif</Badge>
                </div>
              </div>
              <ul className="space-y-2 text-white/90">
                <li className="flex items-center gap-2">
                  <Zap className="w-5 h-5"/> Sınırsız can aktif
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-5 h-5"/> <Lock className="w-4 h-4 inline-block mr-1"/> Tüm kategorilere erişim
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-5 h-5"/> <Rocket className="w-4 h-4 inline-block mr-1"/> Özel rozetler ve ödüller
                </li>
                {premiumStartDate && (
                  <li className="flex items-center gap-2">
                    <Calendar className="w-5 h-5"/> Başlangıç: {format(premiumStartDate, 'dd MMMM yyyy', { locale: tr })}
                  </li>
                )}
              </ul>
            </div>
            <div className="space-y-4 flex flex-col items-center md:items-end">
                <Card className="bg-white/90 text-gray-800 rounded-lg p-4 text-center shadow-inner w-48">
                    <p className="text-sm text-muted-foreground">Aylık Ücret</p>
                    <p className="text-4xl font-extrabold text-orange-600">14 €</p>
                    <p className="text-xs text-muted-foreground -mt-1">/ ay</p>
                </Card>
                <Button asChild variant="outline" className="w-48 bg-white/20 text-white hover:bg-white/30 border-white/50 font-bold">
                    <Link href="/ebeveyn-portali/uyelik">Üyeliği Yönet</Link>
                </Button>
            </div>
          </div>
        </Card>
      ) : (
      <Card className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg border-none">
        <div className="grid md:grid-cols-3 items-center p-6 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">Premium Üyelik</h3>
                <p className="text-white/80">Sınırsız can, tüm kategoriler ve daha fazlası!</p>
              </div>
            </div>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-center gap-2">
                <Zap className="w-5 h-5"/> Sınırsız can - hiç bekleme!
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-5 h-5"/> <Lock className="w-4 h-4 inline-block mr-1"/> Tüm kategorilere erişim
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-5 h-5"/> Özel rozetler ve ödüller
              </li>
            </ul>
          </div>
          <div className="space-y-4 flex flex-col items-center md:items-end">
            <Card className="bg-white/90 text-gray-800 rounded-lg p-4 text-center shadow-inner w-48">
              <p className="text-sm text-muted-foreground">Aylık Ücret</p>
              <p className="text-4xl font-extrabold text-orange-600">14 €</p>
              <p className="text-xs text-muted-foreground -mt-1">/ ay</p>
            </Card>
            <Button asChild variant="outline" className="w-48 bg-white text-amber-600 hover:bg-white/90 font-bold">
                <Link href="/premium">
                    <Crown className="w-4 h-4 mr-2"/> Premium Satın Al
                </Link>
            </Button>
          </div>
        </div>
      </Card>
      )}


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Kalan Ders" value={remainingLessons} icon={BookOpen}>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-muted-foreground">Paket</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {enrolledPackages.length > 0 ? (
                      enrolledPackages.map((pkg, index) => <Badge key={`${pkg}-${index}`} variant="secondary">{pkg}</Badge>)
                  ) : (
                      <span className="text-sm font-medium text-muted-foreground">-</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Kalan</p>
                <p className="text-2xl font-bold">{remainingLessons}</p>
              </div>
            </div>
        </StatCard>
        <StatCard title="Toplam Çocuk" value={childCount} icon={Users} />
        <StatCard title="Toplam Rozet" value={totalRozet} icon={Star} />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Üye</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isPremium ? <PremiumBadge /> : <Badge variant="destructive">Değil</Badge>}
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <Video className="w-6 h-6 text-green-700"/>
                    </div>
                    <div>
                        <CardTitle className="text-green-900">Ücretsiz Deneme Dersi</CardTitle>
                        <CardDescription className="text-green-700">İlk canlı dersiniz ücretsiz!</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">Öğretmenimizle tanışın ve platformumuzu deneyimleyin.</p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">Hemen Planla <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </CardContent>
        </Card>
         <Card className="bg-amber-50 border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                        <Package className="w-6 h-6 text-amber-700"/>
                    </div>
                    <div>
                        <CardTitle className="text-amber-900">Ders Paketi Satın Al</CardTitle>
                        <CardDescription className="text-amber-700">4, 8 veya 12 derslik paketler</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">Esnek paketlerle Türkçe öğrenmeye devam edin.</p>
                <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white"><Link href="/kurslar">Kurslari Gor <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
            </CardContent>
        </Card>
      </div>

        {/* Children Section */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold">Çocuklarım</h3>
                    <p className="text-muted-foreground">Çocuklarınızı ekleyin ve ilerlemelerini takip edin.</p>
                </div>
                {user && <AddChildDialog userId={user.uid} />}
            </div>
            <Card>
                <CardContent className="p-6">
                    {children && children.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {children.map(child => (
                               <ChildCard 
                                    key={child.id}
                                    child={child}
                                    userDocRef={userDocRef}
                                    isPremium={isPremium}
                                    currentLives={currentLives}
                                    onDelete={handleDeleteChild}
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


       {/* Upcoming Features Section */}
      <div className="text-center p-8 bg-background rounded-lg border">
        <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
            <Rocket className="w-5 h-5 text-primary"/> Yakında Eklenecek Özellikler
        </h3>
        <Separator className="my-4 w-1/4 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6 text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
                <div className="bg-muted p-3 rounded-lg">
                    <BarChart className="w-8 h-8"/>
                </div>
                <span className="font-semibold mt-2 text-center">İlerleme Raporları</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <div className="bg-muted p-3 rounded-lg">
                    <Calendar className="w-8 h-8"/>
                </div>
                <span className="font-semibold mt-2 text-center">Ders Takvimi</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <div className="bg-muted p-3 rounded-lg">
                    <History className="w-8 h-8"/>
                </div>
                <span className="font-semibold mt-2 text-center">Ders Geçmişi</span>
            </div>
        </div>
      </div>
    </div>
  );
}

