'use client';

import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { Loader2, Package, ArrowLeft, User, Plus, ShoppingCart, History, Calendar, PlayCircle, CreditCard, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { collection, doc, writeBatch, getDoc, updateDoc, increment, arrayRemove, arrayUnion, query, where } from 'firebase/firestore';
import { COURSES, Course, getCourseByCode } from '@/data/courses';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
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
import { useCart } from '@/context/cart-context';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const BOOK_IMAGE = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&h=200&auto=format&fit=crop";



function PaketlerimPageContent() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const db = useFirestore();
    const { toast } = useToast();
    const { addToCart } = useCart();

    const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedPackageToAssign, setSelectedPackageToAssign] = useState<string>('');
    const [childToAssign, setChildToAssign] = useState<string>('');
    const [amountToAssign, setAmountToAssign] = useState<number>(0);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

    const userDocRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return doc(db, 'users', user.uid);
    }, [db, user?.uid]);

    const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

    const childrenRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return collection(db, 'users', user.uid, 'children');
    }, [db, user?.uid]);
    const { data: children, isLoading: childrenLoading } = useCollection(childrenRef);

    const userTransactionsQuery = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return query(collection(db, 'transactions'), where('userId', '==', user.uid));
    }, [db, user?.uid]);

    const { data: transactionsRaw, isLoading: transactionsLoading } = useCollection(userTransactionsQuery);
    
    // Sort transactions locally to avoid needing a complex composite index
    const transactions = useMemo(() => {
        if (!transactionsRaw) return [];
        return [...transactionsRaw]
            // Sadece tamamlanmış (completed) veya eksi kayıtları göster:
            .filter((t: any) => t.status !== 'pending') 
            .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }, [transactionsRaw]);

    useEffect(() => {
        if (!userLoading && !user) {
            router.push('/login');
        }
    }, [user, userLoading, router]);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const isSuccess = searchParams.get('success') === 'true';

        if (!sessionId || !isSuccess || !user || !db || !userDocRef) return;

        let isMounted = true;
        
        const verifyPayment = async () => {
            setIsVerifyingPayment(true);
            try {
                const res = await fetch('/api/verify_payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId })
                });

                const data = await res.json();
                
                if (data.success) {
                    toast({ 
                        title: 'Ödeme Alındı!', 
                        description: 'Ödemeniz başarıyla alındı. Kurslarınız birkaç saniye içinde hesabınıza tanımlanacaktır.', 
                        className: 'bg-green-500 text-white font-bold' 
                    });
                }
            } catch (error) {
                console.error("Verification error:", error);
            } finally {
                if (isMounted) setIsVerifyingPayment(false);
                router.replace('/ebeveyn-portali/paketlerim');
            }
        };

        verifyPayment();
        return () => { isMounted = false; };
    }, [searchParams, user, db, userDocRef, router, toast]);

    const handleAssignPackage = async () => {
        if (!db || !user || !userDocRef || !userData || !selectedPackageToAssign || !childToAssign || amountToAssign <= 0) return;
    
        const childDocRef = doc(db, 'users', user.uid, 'children', childToAssign);
        const childSnap = await getDoc(childDocRef);
    
        const lessonsInPackage = parseInt(selectedPackageToAssign.replace(/\D/g, ''), 10);
        const prefix = selectedPackageToAssign.replace(/[0-9]/g, '');

        if (childSnap.exists() && childSnap.data()?.assignedPackage && (childSnap.data()?.remainingLessons || 0) > 0) {
            const currentPackage = childSnap.data().assignedPackage;
            const currentPrefix = currentPackage.replace(/[0-9]/g, '');
            if (currentPrefix !== prefix) {
                toast({
                    variant: 'destructive',
                    title: 'Atama Hatası',
                    description: `Bu çocuğun zaten ${childSnap.data().assignedPackageName} kursu var. Farklı türde bir kurs atayamazsınız.`,
                });
                return;
            }
        }
    
        if (isNaN(lessonsInPackage) || lessonsInPackage <= 0) {
            toast({ variant: 'destructive', title: 'Geçersiz Kurs', description: 'Seçilen kursun ders sayısı geçersiz.' });
            return;
        }

        const course = getCourseByCode(selectedPackageToAssign);
        if (!course) {
             toast({ variant: 'destructive', title: 'Atama Hatası', description: 'Kurs bilgisi geçersiz.' });
            return;
        };

        setIsAssigning(true);

        const batch = writeBatch(db);
        const remainder = lessonsInPackage - amountToAssign;
        
        // Update Child
        batch.update(childDocRef, {
            assignedPackage: `${prefix}${amountToAssign}`, // We might want to keep the origin code or just a prefix
            assignedPackageName: course.title,
            remainingLessons: increment(amountToAssign),
            finishedPackage: null,
        });

        // Update Parent
        const updatedPackages = [...(userData.enrolledPackages || [])];
        const indexToRemove = updatedPackages.indexOf(selectedPackageToAssign);
        if (indexToRemove !== -1) {
            updatedPackages.splice(indexToRemove, 1);
            if (remainder > 0) {
                updatedPackages.push(`${prefix}${remainder}`);
            }
        }

        batch.update(userDocRef, {
            enrolledPackages: updatedPackages,
            remainingLessons: increment(-amountToAssign)
        });
        
        try {
            await batch.commit();
            toast({
                title: 'Kurs Atandı!',
                description: `${course.title} kursundan ${amountToAssign} ders başarıyla atandı.`,
                className: 'bg-green-500 text-white'
            });
        } catch (error) {
            console.error("Package assignment error: ", error);
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Kurs atanırken bir sorun oluştu.'
            });
        } finally {
            setIsAssigning(false);
            setIsAssignDialogOpen(false);
            setSelectedPackageToAssign('');
            setChildToAssign('');
            setAmountToAssign(0);
        }
    };
    
    const handleBuyAgain = (packageCode: string) => {
        const course = getCourseByCode(packageCode);
        const lessons = parseInt(packageCode.replace(/\D/g, ''), 10);
        
        if (!course || !lessons) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Kurs bilgisi bulunamadı.' });
            return;
        }

        const pkg = course.pricing.packages.find(p => p.lessons === lessons);
        if (!pkg) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Fiyat bilgisi bulunamadı.' });
            return;
        }

        addToCart({
            id: `${course.id}-${pkg.lessons}`,
            name: course.title,
            description: `${pkg.lessons} derslik kurs`,
            price: pkg.price,
            quantity: 1,
            image: BOOK_IMAGE
        });

        toast({
            title: "Sepete Eklendi",
            description: `${course.title} (${pkg.lessons} ders) sepetinize eklendi.`,
        });
    };
    
    const unassignedPackages = userData?.enrolledPackages || [];
    const childrenWithoutPackages = children?.filter(c => !c.assignedPackage || (c.remainingLessons || 0) <= 0) || [];
    const totalUnassignedLessons = userData?.remainingLessons || 0;

    if (userLoading || userDataLoading || childrenLoading || transactionsLoading || isVerifyingPayment) {
        return (
            <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center space-y-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                {isVerifyingPayment && <p className="text-lg font-bold text-slate-800 animate-pulse">Ödemeniz doğrulanıyor ve kurslarınız yükleniyor, lütfen bekleyin...</p>}
            </div>
        );
    }
    
    const lessonsInSelectedPackage = selectedPackageToAssign 
        ? parseInt(selectedPackageToAssign.replace(/\D/g, ''), 10) || 0
        : 0;

    return (
        <div className="flex-1 w-full max-w-full space-y-4 sm:space-y-8 p-2 sm:p-6 lg:p-8 pt-6 bg-slate-50 min-h-screen">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-10 w-10 bg-white border-slate-200" onClick={() => router.push('/ebeveyn-portali')} >
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900">Kurslarım</h2>
                        <p className="text-slate-500 font-medium text-sm sm:text-base">
                            Satın aldığınız kursları yönetin ve çocuklarınıza atayın.
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    
                    {/* SOL KOLON: ÇOCUKLAR VE PAKETLER */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* ÇOCUKLARIM VE AKTİF KURSLARI */}
                        <Card className="border-none shadow-xl bg-white rounded-[24px] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b pb-6 px-3 sm:px-6 md:px-8 pt-8">
                                <CardTitle className='flex items-center gap-3 text-2xl'><User className="text-primary w-6 h-6" /> Çocuklarım ve Kursları</CardTitle>
                                <CardDescription className="text-sm font-medium mt-1">
                                    Çocuklarınızın aktif ders durumlarını buradan izleyebilirsiniz.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 md:p-8">
                                {children && children.length > 0 ? (
                                    <div className="grid gap-6">
                                        {children.map((child: any) => {
                                            const initialLessonsForActivePackage = child.assignedPackage ? parseInt(child.assignedPackage.replace(/\D/g, ''), 10) : 0;
                                            const progressPercent = initialLessonsForActivePackage > 0 ? ((initialLessonsForActivePackage - child.remainingLessons) / initialLessonsForActivePackage) * 100 : 0;

                                            return (
                                            <div key={child.id} className="p-6 border border-slate-100 rounded-[20px] bg-white hover:border-slate-300 transition-all shadow-sm group">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                                    <div className='flex gap-4 items-center'>
                                                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl">
                                                            {child.firstName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-xl text-slate-900">{child.firstName}</h3>
                                                            <p className="text-sm text-slate-500 font-medium">{child.age} Yaş</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 w-full lg:w-auto px-0 lg:px-8 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 border-slate-100">
                                                        {child.assignedPackage && child.remainingLessons > 0 ? (
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-2 sm:gap-0">
                                                                    <div>
                                                                        <p className="text-secondary font-bold text-sm uppercase tracking-wide">Aktif Kurs</p>
                                                                        <p className="font-black text-slate-800 break-words line-clamp-2">{child.assignedPackageName}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-2xl font-black text-primary">{child.remainingLessons}</span>
                                                                        <span className="text-slate-500 font-bold ml-1">Kredi</span>
                                                                    </div>
                                                                </div>
                                                                <Progress value={progressPercent} className="h-2 bg-slate-100" />
                                                                <p className="text-xs font-bold text-slate-400 text-left sm:text-right">{initialLessonsForActivePackage} dersten {child.remainingLessons} ders kaldı</p>
                                                                <div className="pt-2">
                                                                    <Button asChild className="w-full font-bold shadow-md rounded-xl" variant="default">
                                                                        <Link href="/ebeveyn-portali/ders-planla">
                                                                            <Calendar className="w-4 h-4 mr-2" /> Ders Planla
                                                                        </Link>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : child.finishedPackage ? (
                                                            <div className='space-y-3 bg-slate-50 p-4 rounded-xl'>
                                                                 <p className="font-bold text-slate-600">Kurs Tükendi</p>
                                                                 <p className="text-sm text-slate-500 font-medium">{getCourseByCode(child.finishedPackage)?.title} kursundaki tüm dersler bitti.</p>
                                                                 <Button size="sm" onClick={() => handleBuyAgain(child.finishedPackage)} className="w-full font-bold">
                                                                    <ShoppingCart className='w-4 h-4 mr-2'/> Yeni Kurs Al
                                                                 </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex flex-col items-start gap-2">
                                                                <p className="text-amber-800 font-bold">Kurs Atanmamış</p>
                                                                <p className="text-amber-700 text-sm">Çocuğunuzun derslere başlayabilmesi için havuzunuzdan kurs atayın.</p>
                                                                {unassignedPackages.length > 0 ? (
                                                                    <Button size="sm" onClick={() => {
                                                                        setChildToAssign(child.id);
                                                                        if (unassignedPackages.length > 0) {
                                                                            const pkg = unassignedPackages[0];
                                                                            setSelectedPackageToAssign(pkg);
                                                                            setAmountToAssign(parseInt(pkg.replace(/\D/g, ''), 10) || 0);
                                                                        }
                                                                        setIsAssignDialogOpen(true);
                                                                    }} className="bg-amber-500 hover:bg-amber-600 text-white font-bold w-full mt-1">
                                                                        Havuzdan Kurs Ata
                                                                    </Button>
                                                                ) : (
                                                                    <Button size="sm" variant="outline" asChild className="w-full mt-1 font-bold">
                                                                        <Link href="/kurslar">Kurs Satın Al <ChevronRight className="w-3 h-3 ml-1" /></Link>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )})}
                                    </div>
                                ) : (
                                     <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm">
                                            <User className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-2">Henüz çocuk eklemediniz</h3>
                                        <p className="text-slate-500 font-medium mb-6">Kurs atayabilmek için ebeveyn portalından çocuk kaydı oluşturun.</p>
                                         <Button asChild className="font-bold rounded-xl shadow-md">
                                            <Link href="/ebeveyn-portali"><Plus className="w-4 h-4 mr-2" /> Çocuk Ekle</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* SATIN ALMA GEÇMİŞİ */}
                        <Card className="border-none shadow-xl bg-white rounded-[24px] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b pb-6 px-8 pt-8">
                                <CardTitle className='flex items-center gap-3 text-xl'><History className="text-primary w-5 h-5" /> Satın Alma Geçmişi</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {transactions.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-100 bg-slate-50">
                                                    <th className="text-left font-bold text-slate-500 text-[10px] sm:text-xs py-4 px-1.5 sm:px-4 md:px-6">Tarih</th>
                                                    <th className="text-left font-bold text-slate-500 text-[10px] sm:text-xs py-4 px-1.5 sm:px-4 md:px-6">Kurs / İçerik</th>
                                                    <th className="text-right font-bold text-slate-500 text-[10px] sm:text-xs py-4 px-1.5 sm:px-4 md:px-6">Tutar</th>
                                                    <th className="text-right font-bold text-slate-500 text-[10px] sm:text-xs py-4 px-1.5 sm:px-4 md:px-6">Durum</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((tx: any) => (
                                                    <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-4 px-1.5 sm:px-4 md:px-6 text-[10px] sm:text-sm font-medium text-slate-600">
                                                            {tx.createdAt ? format(tx.createdAt.toDate(), 'dd MMM yyyy', { locale: tr }) : '-'}
                                                        </td>
                                                        <td className="py-4 px-1.5 sm:px-4 md:px-6">
                                                            <div className="flex flex-col gap-1">
                                                                {tx.items?.map((item: any, i: number) => (
                                                                    <span key={i} className="text-[10px] sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 leading-tight">
                                                                        <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                                                                        {item.quantity}x {item.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-1.5 sm:px-4 md:px-6 text-right font-black text-slate-800 text-[10px] sm:text-sm whitespace-nowrap">
                                                            {tx.amountGbp !== undefined ? `£${tx.amountGbp.toFixed(2)}` : (tx.amountEur !== undefined ? `€${tx.amountEur.toFixed(2)}` : (tx.amount ? `${tx.amount} €` : '0.00 £'))}
                                                        </td>
                                                        <td className="py-4 px-1.5 sm:px-4 md:px-6 text-right">
                                                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold uppercase tracking-tight sm:tracking-wider text-[9px] sm:text-[10px] px-1 sm:px-2">Başarılı</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 px-6">
                                        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold">Henüz tamamlanmış bir satın alma işleminiz bulunmuyor.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>


                    {/* SAĞ KOLON: HAVUZ VE YÖNETİM */}
                    <div className="space-y-8">
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-[24px] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b pb-4 px-6 pt-6">
                                <CardTitle className='flex items-center gap-2 text-slate-800 text-lg'><Package className="w-5 h-5 text-indigo-500"/> Atanmamış Kurslar</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6 flex justify-between items-center">
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Kredi Havuzu</p>
                                    <p className="text-2xl font-black text-indigo-600">{totalUnassignedLessons} <span className="text-sm font-bold text-slate-400">Ders</span></p>
                                </div>

                                {unassignedPackages.length > 0 ? (
                                    <div className='flex flex-col gap-2'>
                                        {unassignedPackages.map((pkg: string, index: number) => {
                                            const course = getCourseByCode(pkg);
                                            const lessons = parseInt(pkg.replace(/\D/g, ''), 10);
                                            return (
                                                <div key={`${pkg}-${index}`} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <PlayCircle className="w-4 h-4 text-indigo-400" />
                                                        <span className="font-bold text-slate-700 text-sm">{course ? `${course.title}` : `Bilinmeyen`}</span>
                                                    </div>
                                                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">{lessons} Ders</Badge>
                                                </div>
                                            )
                                        })}

                                        {childrenWithoutPackages.length > 0 && (
                                            <Button className="w-full mt-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl h-12 shadow-sm" onClick={() => {
                                                 if (unassignedPackages.length > 0) {
                                                     const pkg = unassignedPackages[0];
                                                     setSelectedPackageToAssign(pkg);
                                                     setAmountToAssign(parseInt(pkg.replace(/\D/g, ''), 10) || 0);
                                                 }
                                                 setIsAssignDialogOpen(true);
                                             }}>
                                                <Plus className='mr-2 h-5 w-5' /> Şimdi Kurs Ata
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className='text-slate-500 font-medium text-sm mb-4'>Şu anda atama bekleyen yeni bir kursunuz bulunmuyor.</p>
                                        <Button asChild className="w-full font-bold rounded-xl shadow-sm border-slate-200 text-slate-700" variant="outline">
                                            <Link href="/kurslar">Yeni Kredi Satın Al</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <AlertDialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                    <AlertDialogContent className="rounded-[24px] border-none shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-black text-slate-900">Çocuğa Kurs Ata</AlertDialogTitle>
                            <AlertDialogDescription className="text-base text-slate-500 font-medium">
                               Havuzunuzdaki bir kursu seçerek uygun olan çocuğunuzun hesabına tanımlayın.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className='space-y-6 py-4'>
                            <div>
                                 <label htmlFor="package-assign-select" className='text-sm font-bold text-slate-700 uppercase tracking-widest'>Atanacak Kurs</label>
                                 <Select value={selectedPackageToAssign} onValueChange={(val) => {
                                      setSelectedPackageToAssign(val);
                                      setAmountToAssign(parseInt(val.replace(/\D/g, ''), 10) || 0);
                                  }}>
                                    <SelectTrigger id="package-assign-select" className="mt-2 h-14 rounded-xl border-slate-200 bg-slate-50 font-semibold focus:ring-primary focus:border-primary">
                                        <SelectValue placeholder="Kurs Seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                        {unassignedPackages.map((pkg: string, index: number) => {
                                            const course = getCourseByCode(pkg);
                                            const lessons = parseInt(pkg.replace(/\D/g, ''), 10);
                                            return (
                                                 <SelectItem key={`${pkg}-${index}`} value={pkg} className="py-3 font-semibold text-slate-700">{course?.title} ({lessons} ders)</SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="child-assign-select" className='text-sm font-bold text-slate-700 uppercase tracking-widest'>Atanacak Çocuk</label>
                                 <Select value={childToAssign} onValueChange={setChildToAssign}>
                                    <SelectTrigger id="child-assign-select" className="mt-2 h-14 rounded-xl border-slate-200 bg-slate-50 font-semibold focus:ring-primary focus:border-primary">
                                        <SelectValue placeholder="Çocuk Seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                        {childrenWithoutPackages.map((child: any) => (
                                             <SelectItem key={child.id} value={child.id} className="py-3 font-semibold text-slate-700">{child.firstName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                             {selectedPackageToAssign && (
                                <div className='space-y-3 pt-2'>
                                    <div className="flex justify-between items-center">
                                        <label className='text-sm font-bold text-slate-700 uppercase tracking-widest'>Atanacak Ders Sayısı</label>
                                        <Badge variant="outline" className="font-black text-primary border-primary/20">{amountToAssign} / {lessonsInSelectedPackage}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            type="button"
                                            className="h-10 w-10 shrink-0 bg-white"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAmountToAssign(Math.max(1, amountToAssign - 1)); }}
                                            disabled={amountToAssign <= 1}
                                        >
                                            -
                                        </Button>
                                        <div className="flex-1 text-center font-black text-2xl text-slate-800">
                                            {amountToAssign}
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            type="button"
                                            className="h-10 w-10 shrink-0 bg-white"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAmountToAssign(Math.min(lessonsInSelectedPackage, amountToAssign + 1)); }}
                                            disabled={amountToAssign >= lessonsInSelectedPackage}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <p className='text-[10px] text-slate-400 font-medium italic'>* Paketi çocuklarınız arasında paylaştırabilirsiniz.</p>
                                </div>
                             )}

                             {selectedPackageToAssign && (
                                <div className="font-bold p-4 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-between border border-emerald-100">
                                    <span>Atanacak Toplam Kredi:</span>
                                    <Badge className="bg-emerald-500 text-white border-none py-1">{amountToAssign} Ders</Badge>
                                </div>
                             )}
                        </div>
                        <AlertDialogFooter className="pt-2">
                            <AlertDialogCancel className="h-12 rounded-xl font-bold border-slate-200 w-full sm:w-auto">İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleAssignPackage} disabled={isAssigning || !selectedPackageToAssign || !childToAssign} className="h-12 w-full sm:w-auto rounded-xl font-bold bg-primary text-white shadow-md">
                                {isAssigning && <Loader2 className='animate-spin mr-2 h-5 w-5' />}
                                Kursu Tanımla
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
        </div>
    );
}

export const dynamic = 'force-dynamic';

export default function PaketlerimPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <PaketlerimPageContent />
        </Suspense>
    );
}
