
'use client';

import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Plus, ArrowRight, Zap, Star, Award, BookOpen, Users, Crown, Rocket, BarChart, Calendar, History, Video, Package, Heart, Shield, X, Lock, Infinity as InfinityIcon, Settings, Target, CreditCard, Clock, ChevronDown, MonitorPlay, FileText } from 'lucide-react';
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
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { collection, doc, deleteDoc, updateDoc, getDoc, query, where, getDocs, writeBatch, increment, arrayUnion } from 'firebase/firestore';
import { format, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { SetPinDialog } from '@/components/child-mode/set-pin-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MAX_LIVES = 5;

const schoolLiteracyStatusMap: { [key: string]: string } = {
    "not-yet": "Henüz öğrenmedi",
    "in-progress": "Devam ediyor",
    "fluent": "Öğrendi, akıcı"
};

const turkishLiteracyLevelMap: { [key: string]: string } = {
    "none": "Hiç yok",
    "word-sentence": "Kelime/cümle",
    "reads-short-writes": "Kısa metin",
    "fluent": "Akıcı"
};

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

// Mock data for charts
const pieData = [{ name: 'İngilizce', value: 70 }, { name: 'Türkçe', value: 25 }, { name: 'Diğer', value: 5 }];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const cefrData = {
    listening: { level: 'A1', score: 2 },
    speaking: { level: 'PreA1', score: 1 },
    reading: { level: 'Ölçülmedi', score: 0 },
    writing: { level: '—', score: 0 },
};

const radarData = [
  { subject: 'Kelime', A: 80, fullMark: 100 },
  { subject: 'Dilbilgisi', A: 60, fullMark: 100 },
  { subject: 'Akıcılık', A: 70, fullMark: 100 },
  { subject: 'Anlama', A: 85, fullMark: 100 },
  { subject: 'Telaffuz', A: 75, fullMark: 100 },
];


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
    const schoolLiteracy = schoolLiteracyStatusMap[child.schoolLiteracyStatus] || 'Belirtilmemiş';
    const turkishLiteracy = turkishLiteracyLevelMap[child.turkishLiteracyLevel] || 'Belirtilmemiş';


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
                            <DialogTitle>{child.firstName} İlerleme Paneli</DialogTitle>
                             <DialogDescription>
                                Çocuğunuzun Türkçe öğrenme yolculuğuna dair kapsamlı analiz ve raporlar.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 h-full overflow-y-auto pr-4">
                           {/* Card 1: Profile */}
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle className="text-base">Profil Kartı</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center text-center">
                                    <div className="relative w-32 h-32">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 * (1 - 0.75)} transform="rotate(-90 50 50)" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Avatar className="w-24 h-24 text-4xl">
                                                <AvatarFallback className="bg-primary/20 text-primary font-bold">{child.firstName?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                    <p className="font-bold text-lg mt-4">{child.firstName} K.</p>
                                    <p className="text-sm text-muted-foreground">ID: IE-023</p>
                                    <p className="text-sm mt-2">{age} yaş • {child.countryOfResidence.split(',')[0]} • Okul Dili: {child.schoolLanguage}</p>
                                </CardContent>
                            </Card>

                             {/* Card 2: Language Environment */}
                            <Card className="col-span-1">
                                <CardHeader><CardTitle className="text-base">Dil Ortamı</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                     <div>
                                        <h4 className="text-sm font-semibold mb-2">Ebeveyn Dilleri</h4>
                                        <p className="text-sm text-muted-foreground">{child.parentTongues}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2">Evde Dil Kullanımı</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={10} outerRadius={20} dataKey="value" paddingAngle={2}>
                                                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="text-xs space-y-1">
                                                <p className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#0088FE] mr-2"></span>%70 İngilizce</p>
                                                <p className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#00C49F] mr-2"></span>%25 Türkçe</p>
                                                <p className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#FFBB28] mr-2"></span>%5 Diğer</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold mb-1">Türkçe Maruziyet Yoğunluğu</h4>
                                        <div className="flex items-center gap-2 text-sm"><span className="text-lg">●○○</span> (Düşük)</div>
                                    </div>
                                     <div>
                                        <h4 className="text-sm font-semibold mb-2">Zorlanma Alanları</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {child.turkishDifficulties?.map((d: string) => <Badge key={d} variant="secondary">{difficultiesMap[d] || d}</Badge>)}
                                        </div>
                                    </div>
                                     <div>
                                        <h4 className="text-sm font-semibold mb-1">Okuryazarlık ({turkishLiteracy})</h4>
                                        <div className="flex items-center gap-2"><span className="text-lg">○ ● ○</span> <span className="text-sm text-muted-foreground">Kelime düzeyi</span></div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 3: CEFR Profile */}
                             <Card className="col-span-1">
                                <CardHeader><CardTitle className="text-base">CEFR Profili</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                    {Object.entries(cefrData).map(([skill, data]) => (
                                        <div key={skill} className="flex justify-between items-center">
                                            <span className="capitalize text-sm font-medium">{skill}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm w-12 text-right">{data.level}</span>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className={`w-4 h-4 rounded-sm ${i < data.score ? 'bg-primary' : 'bg-muted'}`}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Card 4: Language Behavior */}
                            <Card className="col-span-1">
                                <CardHeader><CardTitle className="text-base">Dil Davranışı</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                     <div>
                                        <h4 className="text-sm font-semibold">Konuşma İnisiyatifi</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="text-2xl font-mono text-primary">(◐)</div>
                                            <span className="font-bold">40%</span>
                                        </div>
                                    </div>
                                     <div>
                                        <h4 className="text-sm font-semibold">Tutum</h4>
                                        <p className="text-2xl">🙂🙂😐</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold">Dil Karıştırma</h4>
                                        <p className="flex items-center gap-2">Ara sıra <ArrowRight className="w-4 h-4 text-red-500 transform rotate-45" /></p>
                                    </div>
                                     <div>
                                        <h4 className="text-sm font-semibold">Odak</h4>
                                        <Badge variant="outline" className="border-green-500 text-green-700">İyi</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                             {/* Card 5: System Analysis */}
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-1.218-1.57L12 12.118 4.044 5.242a1 1 0 0-1.218 1.57L10.782 13 2.826 19.958a1 1 0 1 0 1.218 1.57L12 14.882l7.956 6.874a1 1 0 0 0 1.218-1.57L13.218 13z"></path></svg>
                                        Sistem Analizi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <p><strong>Dil Gelişim Evresi:</strong> Evre 2</p>
                                    <p className="flex items-center gap-2"><strong>⭐ Önerilen Kurs:</strong> Konuşma Kursu</p>
                                    <div>
                                        <h5 className="font-semibold text-xs text-muted-foreground">Neden?</h5>
                                        <ul className="list-disc pl-4 text-xs text-muted-foreground">
                                            <li>Konuşma PreA1→A1</li>
                                            <li>Okuma yok → Akademik uygun değil</li>
                                            <li>Maruziyet düşük</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                             {/* Card 6: Interim Assessment */}
                            <Card className="col-span-1">
                                <CardHeader><CardTitle className="text-base">Ara Değerlendirme</CardTitle></CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                     <div className="space-y-2">
                                        <p>Dinleme: A1 <span className="font-mono">▢▣▢▢▢</span> → A1+ <span className="font-mono">▣▣▢▢▢</span></p>
                                        <p>Konuşma: PreA1 <span className="font-mono">▣▢▢▢▢</span> → A1 <span className="font-mono">▣▣▢▢▢</span></p>
                                        <p>Okuma: — <span className="font-mono">▢▢▢▢▢</span> → Kelime <span className="font-mono">▣▢▢▢▢</span></p>
                                    </div>
                                    <Separator/>
                                    <p>Karıştırma: Ara sıra → Nadiren <ArrowRight className="inline w-3 h-3 text-red-500 transform rotate-45" /></p>
                                    <p>Odak: İyi → Çok iyi <ArrowRight className="inline w-3 h-3 text-green-500 transform -rotate-45" /></p>
                                    <Separator/>
                                     <div>
                                        <h5 className="font-semibold text-xs text-muted-foreground">📝 Öğretmen Notu:</h5>
                                        <p className="text-xs italic text-muted-foreground">Kelimeler arttı, motivasyon yüksek.</p>
                                    </div>
                                </CardContent>
                            </Card>

                             {/* Card 7: Past Assessments */}
                            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                                <CardHeader><CardTitle className="text-base">Geçmiş Değerlendirmeler</CardTitle></CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-primary"></span> 12. Hafta Ara Değerlendirme</li>
                                        <li className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-primary"></span> 6. Hafta Ara Değerlendirme</li>
                                        <li className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-primary"></span> İlk Deneme Dersi</li>
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
      
      const batch = writeBatch(db);

      // 1. Find and update booked lesson slots for this child
      const lessonSlotsRef = collection(db, 'lesson-slots');
      const q = query(lessonSlotsRef, where("childId", "==", childId), where("status", "==", "booked"));
      
      try {
          const snapshot = await getDocs(q);
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
               toast({ title: 'Paket İade Edildi', description: `Silinen çocuğa ait ${assignedPackage} paketi (${remainingLessons} ders) havuza iade edildi.`});
          }

          // Delete the child document
          const childDocRef = doc(db, 'users', user.uid, 'children', childId);
          batch.delete(childDocRef);
          
          await batch.commit();

          toast({
              title: 'Çocuk Silindi',
              description: 'Çocuk profili ve ilişkili tüm planlanmış dersler başarıyla silindi/iptal edildi.',
              className: 'bg-green-500 text-white'
          });

      } catch (error) {
          console.error("Error deleting child and their lessons: ", error);
          toast({
              variant: "destructive",
              title: "Hata",
              description: "Çocuk silinirken bir sorun oluştu."
          });
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

    