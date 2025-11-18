'use client';

import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Plus, ArrowRight, Zap, Star, Award, BookOpen, Users, Crown, Rocket, BarChart, Calendar, History, Video, Package, Heart, Shield, X, Lock, InfinityIcon } from 'lucide-react';
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCollection, useFirestore, addDocumentNonBlocking, useMemoFirebase, deleteDocumentNonBlocking, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

function AddChildDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const db = useFirestore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !db) return;
    
    const childrenRef = collection(db, 'users', userId, 'children');
    
    // Convert age to a number.
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber)) {
        // Handle invalid age input
        console.error("Invalid age input");
        return;
    }

    addDocumentNonBlocking(childrenRef, {
      firstName: name,
      dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - ageNumber)).toISOString(),
      level: 'beginner', // default level
      userId: userId,
      rozet: 0,
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


function StatCard({ title, value, icon: Icon, unit }: { title: string, value: string | number, icon: React.ElementType, unit?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
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

export default function EbeveynPortaliPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  const isPremium = userData?.isPremium || false;

  const childrenRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'users', user.uid, 'children');
  }, [db, user?.uid]);

  const { data: children, isLoading: childrenLoading } = useCollection(childrenRef);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleDeleteChild = (childId: string) => {
      if (!db || !user?.uid) return;
      const childDocRef = doc(db, 'users', user.uid, 'children', childId);
      deleteDocumentNonBlocking(childDocRef);
  };


  if (loading || childrenLoading || isUserDataLoading) {
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

      {/* Premium Card */}
      {isPremium ? (
         <Card className="bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg border-none">
          <div className="p-6 flex items-center justify-between">
            <div className='space-y-2'>
              <h3 className="text-2xl font-bold flex items-center gap-2"><Crown /> Premium Üyelik Aktif</h3>
              <p className="text-white/80">Tüm premium özelliklerin tadını çıkarın!</p>
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
          <div className="space-y-4 flex flex-col">
            <div className="bg-white/90 text-primary-foreground rounded-lg p-4 text-center shadow-inner">
              <p className="text-4xl font-extrabold">14 €</p>
              <p className="text-sm text-muted-foreground -mt-1">/ ay</p>
            </div>
            <Button asChild variant="outline" className="w-full bg-white text-amber-600 hover:bg-white/90 font-bold">
                <Link href="/premium">
                    <Crown className="w-4 h-4 mr-2"/> Premium Satın Al
                </Link>
            </Button>
          </div>
        </div>
      </Card>
      )}


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Kalan Ders" value={isPremium ? 'Sınırsız' : 0} icon={BookOpen} />
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
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">Paketleri Gör <ArrowRight className="ml-2 h-4 w-4"/></Button>
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
                               <Card key={child.id} className="relative flex flex-col items-center text-center p-6 space-y-4 hover:shadow-lg transition-shadow group">
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
                                                <AlertDialogAction onClick={() => handleDeleteChild(child.id)} className="bg-destructive hover:bg-destructive/90">
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
                                       <div className='flex justify-between items-center text-sm'>
                                        <span className='text-muted-foreground'>Kalan Can:</span>
                                        <div className='flex items-center gap-1 font-bold bg-destructive/10 text-destructive px-2 py-1 rounded-md'>
                                          {isPremium ? <InfinityIcon className='w-4 h-4' /> : <span>3</span>}
                                           <Heart className='w-4 h-4 fill-current'/>
                                        </div>
                                      </div>
                                    </div>
                                    <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold mt-auto">
                                        Öğrenmeye Başla
                                    </Button>
                               </Card>
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
                <span className="font-semibold mt-2">İlerleme Raporları</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <div className="bg-muted p-3 rounded-lg">
                    <Calendar className="w-8 h-8"/>
                </div>
                <span className="font-semibold mt-2">Ders Takvimi</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <div className="bg-muted p-3 rounded-lg">
                    <History className="w-8 h-8"/>
                </div>
                <span className="font-semibold mt-2">Ders Geçmişi</span>
            </div>
        </div>
      </div>
    </div>
  );
}
