

'use client';

import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, Plus, ArrowRight, Zap, Star, Award, BookOpen, Users, Crown, Rocket, BarChart, Calendar, History, Video, Package, Heart, Shield, X, Lock, Infinity as InfinityIcon, Settings, Target, CreditCard, Clock, ChevronDown, MonitorPlay, FileText, CheckCircle, MessageCircle, TrendingUp, TrendingDown, Book, BrainCircuit, Globe, Smile, Meh, Frown, Languages, Milestone, Cloudy, GraduationCap, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AddChildForm } from '@/components/parent-portal/add-child-form';
import { Progress } from '@/components/ui/progress';

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
import { PieChart, Pie, Cell, ResponsiveContainer, PolarGrid, PolarAngleAxis, Radar, RadarChart } from 'recharts';


import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { collection, doc, deleteDoc, updateDoc, getDoc, query, where, getDocs, writeBatch, increment, arrayUnion } from 'firebase/firestore';
import { format, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { SetPinDialog } from '@/components/child-mode/set-pin-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MAX_LIVES = 5;

const difficultiesMap: { [key: string]: string } = {
    "kelime": "Kelime",
    "cumle": "Cümle",
    "anlama": "Anlama",
    "okuma": "Okuma",
    "yazma": "Yazma",
    "ifade": "Kendini ifade",
    "motivasyon": "Motivasyon",
    "ingilizce-karistirma": "İngilizce karıştırma"
};


const COLORS = ['#4FC3F7', '#FF8A65', '#E0E0E0'];

const cefrData = {
    listening: { level: 'A1', score: 2 },
    speaking: { level: 'PreA1', score: 1 },
    reading: { level: 'Ölçülmedi', score: 0 },
    writing: { level: '—', score: 0 },
};


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

function ChildCard({ child, isPremium, currentLives, onDelete }: { child: any, isPremium: boolean, currentLives: number, onDelete: (id: string, assignedPackage: string | null, remainingLessons: number) => void }) {
    const { toast } = useToast();
    
    const displayLives = Math.max(0, currentLives);
    const hasActivePackage = child.assignedPackage && child.remainingLessons > 0;
    const dateOfBirth = child.dateOfBirth ? new Date(child.dateOfBirth) : null;
    const age = dateOfBirth ? differenceInYears(new Date(), dateOfBirth) : 'N/A';
    
    const homeLanguagePieData = useMemo(() => {
        const turkishPercentage = child.homeLanguageTurkishPercentage || 0;
        return [
            { name: 'Türkçe', value: turkishPercentage },
            { name: 'Diğer Diller', value: 100 - turkishPercentage }
        ];
    }, [child.homeLanguageTurkishPercentage]);

    const exposureMap: { [key: string]: { dots: string; label: string } } = {
        low: { dots: "●○○", label: "Düşük" },
        medium: { dots: "●●○", label: "Orta" },
        high: { dots: "●●●", label: "Yüksek" },
    };
    const exposureInfo = exposureMap[child.turkishExposureIntensity] || exposureMap.low;


    return (
        <Card className="relative flex flex-col items-center text-center p-6 space-y-4 hover:shadow-lg transition-shadow group rounded-2xl">
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
                <p className="text-sm text-muted-foreground">{age} yaş</p>
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
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full mt-4">
                            <FileText className="mr-2 h-4 w-4" />
                            İlerleme Paneli
                        </Button>
                    </DialogTrigger>
                     <DialogContent className="max-w-4xl h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold font-headline">{child.firstName} İlerleme Paneli</DialogTitle>
                             <DialogDescription>
                                Çocuğunuzun Türkçe öğrenme yolculuğuna dair kapsamlı analiz ve raporlar.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 h-full overflow-y-auto pr-4 font-body">
                           
                            <Card className="col-span-1 rounded-2xl bg-[#E3F2FD] border-blue-200">
                                <CardHeader className="flex-row items-center gap-3 space-y-0">
                                    <UserIcon className="w-6 h-6 text-blue-500" />
                                    <CardTitle className="text-lg text-blue-900">Profil Kartı</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center text-center">
                                    <Avatar className="w-24 h-24 text-4xl mb-3">
                                        <AvatarFallback className="bg-blue-200 text-blue-700 font-bold">{child.firstName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-bold text-xl text-gray-800">{child.firstName}</p>
                                    <p className="text-sm text-gray-600">ID: {child.id.substring(0,6).toUpperCase()}</p>
                                    <p className="text-sm mt-2 text-gray-500">{age} yaş • {child.countryOfResidence.split(',')[0]} • Okul Dili: {child.schoolLanguage}</p>
                                </CardContent>
                            </Card>

                            <Card className="col-span-1 rounded-2xl bg-[#FFF3E0] border-orange-200">
                                <CardHeader className="flex-row items-center gap-3 space-y-0">
                                    <Globe className="w-6 h-6 text-orange-500" />
                                    <CardTitle className="text-lg text-orange-900">Dil Ortamı</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div>
                                        <h4 className="text-sm font-semibold mb-2 text-gray-700">Evde Dil Kullanımı</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie data={homeLanguagePieData} cx="50%" cy="50%" innerRadius={12} outerRadius={20} dataKey="value" paddingAngle={3}>
                                                            {homeLanguagePieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="text-xs space-y-1">
                                                {homeLanguagePieData.map((entry, index) => (
                                                     <p key={index} className="flex items-center">
                                                        <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                                                        %{entry.value} {entry.name}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold mb-1 text-gray-700">Türkçe Maruziyet Yoğunluğu</h4>
                                        <div className="flex items-center gap-2 text-sm"><span className="text-lg font-mono text-orange-500">{exposureInfo.dots}</span> <span className='text-gray-600'>{exposureInfo.label}</span></div>
                                    </div>
                                     <div className="pt-2">
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-gray-700"><UserIcon className="w-4 h-4"/>Veli Bildirimi – Zorlanma Alanları</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {child.turkishDifficulties?.length > 0 ? child.turkishDifficulties.map((d: string) => <Badge key={d} variant="secondary" className="bg-green-100 text-green-800 border border-green-200">{difficultiesMap[d] || d}</Badge>) : <p className="text-xs text-muted-foreground">Belirtilmedi.</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                             <Card className="col-span-1 rounded-2xl bg-[#E8F5E9] border-green-200">
                                <CardHeader className="flex-row items-center gap-3 space-y-0">
                                    <GraduationCap className="w-6 h-6 text-green-500" />
                                    <CardTitle className="text-lg text-green-900">CEFR Profili</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {Object.entries(cefrData).map(([skill, data]) => (
                                        <motion.div whileHover={{ x: 3 }} key={skill}>
                                            <div className="flex items-center gap-x-3">
                                                <span className="capitalize text-sm font-medium text-gray-700 w-20">{skill}</span>
                                                <span className="font-bold text-sm text-gray-600 w-16">{data.level}</span>
                                                <div className="flex gap-1 items-center flex-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className={`w-4 h-4 rounded-sm ${i < data.score ? 'bg-primary' : 'bg-green-200'}`}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="col-span-1 rounded-2xl bg-[#FFFDE7] border-yellow-200">
                                <CardHeader className="flex-row items-center gap-3 space-y-0">
                                    <BrainCircuit className="w-6 h-6 text-yellow-600" />
                                    <CardTitle className="text-lg text-yellow-900">Dil Davranışı</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 pt-4">
                                     <div>
                                        <h4 className="text-sm font-semibold text-gray-700">Konuşma İnisiyatifi</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="text-3xl font-mono text-primary">(◐)</div>
                                            <span className="font-bold text-lg">40%</span>
                                        </div>
                                    </div>
                                     <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Tutum</h4>
                                        <div className="flex gap-4">
                                            <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center gap-1 cursor-pointer">
                                                <Smile className="w-7 h-7 text-green-500" />
                                                <span className="text-xs font-bold text-green-600">Olumlu</span>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center gap-1 cursor-pointer opacity-40">
                                                <Meh className="w-7 h-7 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-500">Nötr</span>
                                            </motion.div>
                                             <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center gap-1 cursor-pointer opacity-40">
                                                <Frown className="w-7 h-7 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-500">Çekingen</span>
                                            </motion.div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700">Dil Karıştırma</h4>
                                            <p className="flex items-center gap-2 font-semibold text-gray-600">Ara sıra</p>
                                        </div>
                                        <TrendingDown className="w-7 h-7 text-red-500" />
                                    </div>
                                </CardContent>
                            </Card>

                             <Card className="col-span-1 md:col-span-2 rounded-2xl bg-[#F3E5F5] border-purple-200">
                                <CardHeader className="flex-row items-center gap-3 space-y-0">
                                    <Star className="w-6 h-6 text-purple-500" />
                                    <CardTitle className="text-lg text-purple-900">Öğrenme Profil Özeti</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/>Güçlü Alanlar</h4>
                                        <div className="flex flex-col gap-2">
                                            <Badge className="bg-green-100 text-green-800 border-green-200 text-sm font-normal w-fit">Dinleme</Badge>
                                            <Badge className="bg-green-100 text-green-800 border-green-200 text-sm font-normal w-fit">Tutum</Badge>
                                            <Badge className="bg-green-100 text-green-800 border-green-200 text-sm font-normal w-fit">Motivasyon</Badge>
                                        </div>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><Cloudy className="w-5 h-5 text-orange-500"/>Gelişime Açık Alanlar</h4>
                                        <div className="flex flex-col gap-2">
                                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-sm font-normal w-fit">Konuşma akıcılığı</Badge>
                                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-sm font-normal w-fit">Okuryazarlık</Badge>
                                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-sm font-normal w-fit">Türkçe maruziyet</Badge>
                                        </div>
                                    </div>
                                     <div className="sm:col-span-2 mt-2">
                                        <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><Target className="w-5 h-5 text-red-500"/>Önerilen Kurs</h4>
                                         <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                            <Badge className="bg-red-100 text-red-800 border-red-200 text-base font-semibold p-2 px-3">
                                                 <Star className="w-4 h-4 mr-2 fill-current"/>
                                                 Konuşma Kursu
                                            </Badge>
                                         </motion.div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl bg-gray-50 border-gray-200">
                                <CardHeader className="flex-row items-center gap-3 space-y-0">
                                    <Milestone className="w-6 h-6 text-gray-500" />
                                    <CardTitle className="text-lg text-gray-800">Geçmiş Değerlendirmeler</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-sm"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div><span>12. Hafta Ara Değerlendirme</span> <span className='text-xs text-muted-foreground ml-auto'>12.06.2024</span></li>
                                        <li className="flex items-center gap-3 text-sm"><div className="w-2.5 h-2.5 rounded-full bg-primary/50"></div><span>6. Hafta Ara Değerlendirme</span> <span className='text-xs text-muted-foreground ml-auto'>01.05.2024</span></li>
                                        <li className="flex items-center gap-3 text-sm"><div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div><span>İlk Deneme Dersi</span> <span className='text-xs text-muted-foreground ml-auto'>15.03.2024</span></li>
                                    </ul>
                                </CardContent>
                            </Card>

                        </div>
                    </DialogContent>
                </Dialog>
            </div>
       </Card>
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
                path: childDocRef.path,
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
  const premiumStartDate = userData?.premiumStartDate?.toDate ? userData.premiumStartDate.toDate() : (userData?.premiumStartDate ? new Date(userData.premiumStartDate) : null);
  
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
        <StatCard title="Kalan Toplam Ders" value={totalRemainingLessons} icon={BookOpen} />
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
                        <CardTitle className="text-green-900">{userData?.freeTrialsUsed > 0 ? 'Ders Planlayın' : 'Ücretsiz Deneme Dersi'}</CardTitle>
                        <CardDescription className="text-green-700">Öğretmenimizle tanışın ve platformumuzu deneyimleyin.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!(userData?.freeTrialsUsed > 0) && <p className="mb-4 text-muted-foreground">İlk canlı dersiniz ücretsiz!</p>}
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/ebeveyn-portali/ders-planla">
                    Hemen Planla <ArrowRight className="ml-2 h-4 w-4"/>
                  </Link>
                </Button>
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
                        <CardDescription className="text-amber-700">4, 8, 12 veya 24 derslik paketler</CardDescription>
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
                 {user && <AddChildForm userId={user.uid} onChildAdded={refetchChildren} />}
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
