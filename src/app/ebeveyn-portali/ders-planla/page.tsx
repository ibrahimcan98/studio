'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, where, query, increment } from 'firebase/firestore';
import { Loader2, ArrowLeft, Info, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { isSameDay, toDate } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import timezones from '@/data/timezones.json';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { COURSES } from '@/data/courses';

const getCourseDetailsFromPackageCode = (code: string) => {
    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const lessons = parseInt(code.replace(/\D/g, ''), 10);
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '')];
    const course = COURSES.find(c => c.id === courseId);
    return course ? { courseName: course.title, lessons, duration: course.details.duration } : null;
}


export default function DersPlanlaPage() {
    const router = useRouter();
    const { user } = useUser();
    const db = useFirestore();
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isBooking, setIsBooking] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState<string>('');
    const [selectedPackage, setSelectedPackage] = useState<string>('');
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

    useEffect(() => {
        if (userData?.timezone) {
            setSelectedTimeZone(userData.timezone);
        } else if (typeof window !== 'undefined') {
            setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
    }, [userData]);

    const handleTimeZoneChange = async (tz: string) => {
        setSelectedTimeZone(tz);
        if (userDocRef) {
            try {
                await updateDoc(userDocRef, { timezone: tz });
                toast({
                    title: 'Saat Dilimi Güncellendi',
                    description: `Saat diliminiz ${tz} olarak ayarlandı.`,
                });
            } catch (error) {
                console.error('Failed to update timezone:', error);
                toast({
                    variant: 'destructive',
                    title: 'Hata',
                    description: 'Saat dilimi güncellenirken bir sorun oluştu.',
                });
            }
        }
    };

    const childrenRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return collection(db, 'users', user.uid, 'children');
    }, [db, user?.uid]);

    const { data: children, isLoading: areChildrenLoading } = useCollection(childrenRef);

    const lessonSlotsRef = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'lesson-slots'), where('status', '==', 'available'));
    }, [db]);

    const { data: availableSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsRef);

    const availableDays = useMemo(() => {
        if (!availableSlots || !selectedTimeZone) return [];
        return availableSlots.map(slot => toDate(slot.startTime.seconds * 1000, { timeZone: selectedTimeZone }));
    }, [availableSlots, selectedTimeZone]);
    
    const slotsForSelectedDate = useMemo(() => {
        if (!availableSlots || !selectedDate || !selectedTimeZone) return [];
        return availableSlots
            .filter(slot => {
                const zonedDate = toDate(slot.startTime.seconds * 1000, { timeZone: selectedTimeZone });
                return isSameDay(zonedDate, selectedDate);
            })
            .sort((a, b) => a.startTime.seconds - b.startTime.seconds);
    }, [availableSlots, selectedDate, selectedTimeZone]);
    
    const handleBookLesson = async (slotId: string) => {
        if (!user || !userDocRef || !userData) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Giriş yapmalısınız.' });
            return;
        }

        if (!selectedChildId) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen dersi alacak çocuğu seçin.' });
            return;
        }

        const hasFreeTrial = !userData.hasUsedFreeTrial;
        const hasRemainingLessons = (userData.remainingLessons || 0) > 0;

        if (!hasFreeTrial && !hasRemainingLessons) {
            toast({ variant: 'destructive', title: 'Ders Hakkı Kalmadı', description: 'Ders planlamak için lütfen yeni bir paket satın alın.' });
            return;
        }
        
        if (hasRemainingLessons && !hasFreeTrial && !selectedPackage) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen kullanmak istediğiniz ders paketini seçin.' });
            return;
        }

        setIsBooking(true);
        try {
            const slotDocRef = doc(db, 'lesson-slots', slotId);
            
            // Prepare updates
            const slotUpdate = {
                status: 'booked',
                bookedBy: user.uid,
                childId: selectedChildId,
                packageCode: hasFreeTrial ? 'FREE_TRIAL' : selectedPackage
            };
            
            let userUpdate = {};
            let successMessage = '';
            
            if (hasFreeTrial) {
                userUpdate = { hasUsedFreeTrial: true };
                successMessage = 'Ücretsiz deneme dersiniz başarıyla planlandı.';
            } else {
                userUpdate = { remainingLessons: increment(-1) };
                successMessage = 'Dersiniz başarıyla planlandı. Kalan ders sayınız güncellendi.';
            }

            // Perform updates
            await updateDoc(slotDocRef, slotUpdate);
            await updateDoc(userDocRef, userUpdate);

            toast({
                title: 'Ders Planlandı!',
                description: successMessage,
                className: 'bg-green-500 text-white'
            });
            router.push('/ebeveyn-portali');

        } catch (error) {
            console.error("Booking error:", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Ders planlanırken bir sorun oluştu.' });
        } finally {
            setIsBooking(false);
        }
    };
    
    const hasBookingRights = !userData?.hasUsedFreeTrial || (userData?.remainingLessons || 0) > 0;
    const enrolledPackages: string[] = userData?.enrolledPackages || [];

    if (isUserLoading || areSlotsLoading || areChildrenLoading || !selectedTimeZone) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                     <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => router.push('/ebeveyn-portali')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Ders Planla</h2>
                        <p className="text-muted-foreground">
                            Öğretmenimizin müsait olduğu zamanlardan birini seçin.
                        </p>
                    </div>
                </div>
            </div>

            <Card className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                         <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={tr}
                            modifiers={{
                                available: availableDays,
                            }}
                            modifiersClassNames={{
                                available: 'bg-primary/20 text-primary-foreground rounded-full',
                            }}
                            disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (date < today) return true;
                                return !availableDays.some(availableDay => isSameDay(date, availableDay));
                            }}
                            className="rounded-md border"
                        />
                         <div className="mt-6 w-full max-w-sm">
                            <Label htmlFor="timezone-select">Saat Diliminiz:</Label>
                             <Select value={selectedTimeZone} onValueChange={handleTimeZoneChange}>
                                <SelectTrigger id="timezone-select" className="mt-2">
                                    <SelectValue placeholder="Saat dilimi seçin..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {timezones.map(tz => (
                                        <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                         </div>
                    </div>
                    <div className="h-full">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="child-select">Dersi alacak çocuk:</Label>
                                    <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                        <SelectTrigger id="child-select" className="mt-2">
                                            <SelectValue placeholder="Çocuk Seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {children && children.map(child => (
                                                <SelectItem key={child.id} value={child.id}>{child.firstName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {enrolledPackages.length > 0 && userData?.hasUsedFreeTrial && (
                                    <div>
                                        <Label htmlFor="package-select">Kullanılacak paket:</Label>
                                        <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                                            <SelectTrigger id="package-select" className="mt-2">
                                                <SelectValue placeholder="Paket Seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {enrolledPackages.map((pkg, index) => {
                                                     const details = getCourseDetailsFromPackageCode(pkg);
                                                     return (
                                                        <SelectItem key={`${pkg}-${index}`} value={pkg}>
                                                            {pkg} - {details?.courseName} ({details?.duration})
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        
                            <h3 className="text-lg font-semibold text-center lg:text-left">
                                {selectedDate ? formatInTimeZone(selectedDate, selectedTimeZone, 'dd MMMM yyyy', { locale: tr }) : 'Bir tarih seçin'} için Müsait Saatler
                                {selectedDate && <span className="text-sm text-muted-foreground ml-2">({formatInTimeZone(toDate(selectedDate), selectedTimeZone, 'zzz')})</span>}
                            </h3>
                            {selectedDate && slotsForSelectedDate.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {slotsForSelectedDate.map(slot => (
                                        <Button
                                            key={slot.id}
                                            variant="outline"
                                            className="h-12 text-base"
                                            onClick={() => handleBookLesson(slot.id)}
                                            disabled={isBooking || !hasBookingRights}
                                        >
                                            {isBooking ? <Loader2 className="animate-spin" /> : formatInTimeZone(slot.startTime.toDate(), selectedTimeZone, 'HH:mm')}
                                        </Button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/50">
                                    <p className="text-muted-foreground">Bu tarih için müsait ders bulunmamaktadır.</p>
                                </div>
                            )}
                        </div>
                         <div className="mt-6 text-center">
                           {!userData?.hasUsedFreeTrial ? (
                                <Badge variant="default" className='bg-green-100 text-green-800'>
                                    <BookOpen className="w-3 h-3 mr-1"/>
                                    Ücretsiz deneme dersi hakkınız mevcut!
                                </Badge>
                            ) : (userData?.remainingLessons || 0) > 0 ? (
                                <Badge>Kalan Ders: {userData.remainingLessons}</Badge>
                            ) : (
                                <Badge variant="destructive">Hiç ders hakkınız kalmadı.</Badge>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
             <Alert className="mt-8">
                <Info className="h-4 w-4" />
                <AlertDescription>
                    Derse 24 saat kalana kadar ücretsiz iptal edebilirsiniz. 24 saatten az kalan dersler için 2 değişim hakkınız vardır.
                </AlertDescription>
            </Alert>
        </div>
    );
}
    