
'use client';

import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Package, ArrowLeft, BookOpen, User, Plus, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { COURSES, Course } from '@/data/courses';
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
} from "@/components/ui/alert-dialog"

const getCourseByCode = (code: string): Course | undefined => {
    const courseMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const courseId = courseMap[code.replace(/[0-9]/g, '')];
    return COURSES.find(c => c.id === courseId);
};

export default function PaketlerimPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const db = useFirestore();
    const { toast } = useToast();

    // State for assigning a package
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedPackageToAssign, setSelectedPackageToAssign] = useState<string>('');
    const [childToAssign, setChildToAssign] = useState<string>('');
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

    // State for unassigning a package
    const [isUnassigning, setIsUnassigning] = useState(false);
    const [packageToUnassign, setPackageToUnassign] = useState<{ childId: string, packageCode: string, lessons: number } | null>(null);

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

    useEffect(() => {
        if (!userLoading && !user) {
            router.push('/login');
        }
    }, [user, userLoading, router]);

    const handleAssignPackage = async () => {
        if (!db || !user || !userDocRef || !userData || !selectedPackageToAssign || !childToAssign) return;

        const childRef = doc(db, 'users', user.uid, 'children', childToAssign);
        const lessons = parseInt(selectedPackageToAssign.replace(/\D/g, ''), 10);
        const course = getCourseByCode(selectedPackageToAssign.replace(/[0-9]/g, ''));
        if (!course) return;

        setIsAssigning(true);

        const batch = writeBatch(db);

        // Update child document
        batch.update(childRef, {
            assignedPackage: selectedPackageToAssign,
            assignedPackageName: course.title,
            remainingLessons: lessons
        });

        // Remove package from user's unassigned list
        const updatedEnrolledPackages = userData.enrolledPackages.filter((p: string) => p !== selectedPackageToAssign);
        const updatedRemainingLessons = userData.remainingLessons - lessons;

        batch.update(userDocRef, {
            enrolledPackages: updatedEnrolledPackages,
            remainingLessons: updatedRemainingLessons
        });
        
        try {
            await batch.commit();
            toast({
                title: 'Paket Atandı!',
                description: `${course.title} (${lessons} ders) paketi başarıyla atandı.`,
                className: 'bg-green-500 text-white'
            });
        } catch (error) {
            console.error("Package assignment error: ", error);
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Paket atanırken bir sorun oluştu.'
            });
        } finally {
            setIsAssigning(false);
            setIsAssignDialogOpen(false);
            setSelectedPackageToAssign('');
            setChildToAssign('');
        }
    };
    
    const handleUnassignPackage = async () => {
        if (!db || !user || !userDocRef || !userData || !packageToUnassign) return;

        setIsUnassigning(true);

        const { childId, packageCode, lessons } = packageToUnassign;
        const childRef = doc(db, 'users', user.uid, 'children', childId);
        
        const batch = writeBatch(db);
        
        // Remove package from child
        batch.update(childRef, {
            assignedPackage: null,
            assignedPackageName: null,
            remainingLessons: 0
        });

        // Add package and lessons back to the user's pool
        const newEnrolledPackages = [...(userData.enrolledPackages || []), packageCode];
        const newRemainingLessons = (userData.remainingLessons || 0) + lessons;

        batch.update(userDocRef, {
            enrolledPackages: newEnrolledPackages,
            remainingLessons: newRemainingLessons
        });

        try {
            await batch.commit();
            toast({
                title: 'Paket Kaldırıldı',
                description: `Paket, çocuğun üzerinden kaldırılıp havuza geri eklendi.`,
            });
        } catch (error) {
            console.error("Package unassignment error: ", error);
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Paket kaldırılırken bir sorun oluştu.'
            });
        } finally {
            setIsUnassigning(false);
            setPackageToUnassign(null);
        }
    };
    
    const unassignedPackages = userData?.enrolledPackages || [];
    const childrenWithoutPackages = children?.filter(c => !c.assignedPackage) || [];

    if (userLoading || userDataLoading || childrenLoading) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    const childToUnassignData = children?.find(c => c.id === packageToUnassign?.childId);

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20">
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                     <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => router.push('/ebeveyn-portali')} >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Paket Yönetimi</h2>
                        <p className="text-muted-foreground">
                            Satın aldığınız ders paketlerini çocuklarınıza atayın.
                        </p>
                    </div>
                </div>
            </div>

            {/* Unassigned Packages */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Package /> Atanmamış Paketler</CardTitle>
                    <CardDescription>Bu paketleri bir çocuğunuza atayarak ders planlamaya başlayın.</CardDescription>
                </CardHeader>
                <CardContent>
                    {unassignedPackages.length > 0 ? (
                        <div className='flex flex-wrap gap-4'>
                            {unassignedPackages.map((pkg: string, index: number) => {
                                const course = getCourseByCode(pkg.replace(/[0-9]/g, ''));
                                const lessons = parseInt(pkg.replace(/\D/g, ''), 10);
                                return (
                                    <Badge key={index} variant='secondary' className='p-2 text-base'>
                                        {course?.title} ({lessons} ders)
                                    </Badge>
                                )
                            })}
                        </div>
                    ) : (
                        <p className='text-muted-foreground'>Atanmamış paketiniz bulunmuyor.</p>
                    )}
                    {unassignedPackages.length > 0 && childrenWithoutPackages.length > 0 && (
                        <Button className='mt-6' onClick={() => setIsAssignDialogOpen(true)}>
                            <Plus className='mr-2 h-4 w-4' /> Paket Ata
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Assigned Packages */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><User /> Çocuklarım ve Paketleri</CardTitle>
                </CardHeader>
                <CardContent>
                    {children && children.length > 0 ? (
                        <div className="space-y-6">
                            {children.map((child: any) => (
                                <div key={child.id} className="p-4 border rounded-lg bg-background flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className='mb-4 sm:mb-0'>
                                        <p className="font-bold text-lg">{child.firstName}</p>
                                        {child.assignedPackage ? (
                                            <>
                                                <p className="text-muted-foreground">{child.assignedPackageName}</p>
                                                <Badge className='mt-2'>{child.remainingLessons} ders kaldı</Badge>
                                            </>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Henüz atanmış bir paketi yok.</p>
                                        )}
                                    </div>
                                    {child.assignedPackage && (
                                        <Button 
                                            variant='outline' 
                                            onClick={() => setPackageToUnassign({ childId: child.id, packageCode: child.assignedPackage, lessons: child.remainingLessons })}
                                        >
                                            Paketi Değiştir <ChevronsRight className='ml-2 h-4 w-4' />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-10">
                            <p className="text-muted-foreground mb-4">Henüz bir çocuk eklemediniz.</p>
                             <Button asChild>
                                <Link href="/ebeveyn-portali">Ebeveyn Portalı'na Dön</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assign Package Dialog */}
            <AlertDialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Paket Ata</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bir paket seçin ve hangi çocuğunuza atamak istediğinizi belirtin.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='space-y-4 py-4'>
                        <div>
                             <label htmlFor="package-assign-select" className='text-sm font-medium'>Atanacak Paket</label>
                             <Select value={selectedPackageToAssign} onValueChange={setSelectedPackageToAssign}>
                                <SelectTrigger id="package-assign-select" className="mt-2">
                                    <SelectValue placeholder="Paket Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unassignedPackages.map((pkg: string, index: number) => {
                                        const course = getCourseByCode(pkg.replace(/[0-9]/g, ''));
                                        const lessons = parseInt(pkg.replace(/\D/g, ''), 10);
                                        return (
                                             <SelectItem key={index} value={pkg}>{course?.title} ({lessons} ders)</SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="child-assign-select" className='text-sm font-medium'>Atanacak Çocuk</label>
                             <Select value={childToAssign} onValueChange={setChildToAssign}>
                                <SelectTrigger id="child-assign-select" className="mt-2">
                                    <SelectValue placeholder="Çocuk Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {childrenWithoutPackages.map((child: any) => (
                                         <SelectItem key={child.id} value={child.id}>{child.firstName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAssignPackage} disabled={isAssigning || !selectedPackageToAssign || !childToAssign}>
                            {isAssigning && <Loader2 className='animate-spin mr-2 h-4 w-4' />}
                            Ata
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Unassign Package Dialog */}
             <AlertDialog open={!!packageToUnassign} onOpenChange={(open) => !open && setPackageToUnassign(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Paketi Kaldır</AlertDialogTitle>
                        <AlertDialogDescription>
                            {packageToUnassign && childToUnassignData && (
                                <>
                                    <b>{packageToUnassign.packageCode}</b> paketini <b>{childToUnassignData.firstName}</b> üzerinden kaldırmak istediğinizden emin misiniz? 
                                    Paket, kalan <b>{packageToUnassign.lessons}</b> ders ile birlikte atanmamış paketler havuzuna geri dönecektir.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPackageToUnassign(null)}>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnassignPackage} disabled={isUnassigning} className="bg-destructive hover:bg-destructive/90">
                            {isUnassigning && <Loader2 className='animate-spin mr-2 h-4 w-4' />}
                            Evet, Kaldır
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
