
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, updateDoc, where, query, increment, Timestamp, writeBatch, getDocs, getDoc, arrayRemove, addDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Info, BookOpen, User, Calendar as CalendarIcon, Package, Clock, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { toZonedTime, formatInTimeZone, format } from 'date-fns-tz';
import { isSameDay, toDate, addMinutes, isBefore, addDays, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import timezones from '@/data/timezones.json';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { COURSES } from '@/data/courses';
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';


const getCourseDetailsFromPackageCode = (code: string) => {
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', lessons: 1, duration: 30 };

    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '')];
    const course = COURSES.find(c => c.id === courseId);
    
    if (!course) return null;

    let duration = 30; // Default
    if (course.id === 'baslangic') duration = 20;
    if (course.id === 'konusma') duration = 30;
    if (course.id === 'gelisim' || course.id === 'akademik') duration = 45;

    return { courseName: course.title, duration };
}


const MAX_FREE_TRIALS = 3;


function TeacherProfileDialog({ teacherId }: { teacherId: string }) {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const [isOpen, setIsOpen] = useState(false);

    const teacherDocRef = useMemoFirebase(() => {
        // Only fetch if the dialog is open and the user is authenticated
        if (!db || !teacherId || !isOpen || !user) return null;
        return doc(db, 'users', teacherId);
    }, [db, teacherId, isOpen, user]);

    const { data: teacherData, isLoading } = useDoc(teacherDocRef);
    
    const getEmbedUrl = (url: string) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1].split('&')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('kapwing.com/e/')) {
            return url;
        }
        return null;
    }

    const embedUrl = getEmbedUrl(teacherData?.introVideoUrl || '');

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-auto px-2 py-1 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Profili Görüntüle
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    {isLoading || userLoading ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <DialogTitle>Yükleniyor...</DialogTitle>
                        </div>
                    ) : teacherData ? (
                         <div className="flex flex-col items-center text-center gap-4 pt-8">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={teacherData.profileImageUrl} />
                                <AvatarFallback className="text-3xl">{teacherData.firstName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                               <DialogTitle className="text-2xl">{teacherData.firstName}</DialogTitle>
                               <DialogDescription>Uzman Türkçe Öğretmeni</DialogDescription>
                            </div>
                        </div>
                    ) : (
                         <div className="flex items-center gap-4">
                            <DialogTitle>Profil Bulunamadı</DialogTitle>
                        </div>
                    )}
                </DialogHeader>
                {!isLoading && !userLoading && teacherData && (
                    <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto">
                        {teacherData.bio && (
                            <div>
                                <h4 className="font-semibold mb-2">Hakkında</h4>
                                <p className="text-sm text-muted-foreground">{teacherData.bio}</p>
                            </div>
                        )}
                        {teacherData.hobbies && teacherData.hobbies.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Hobiler</h4>
                                <div className="flex flex-wrap gap-2">
                                    {teacherData.hobbies.map((hobby: string) => <Badge key={hobby} variant="secondary">{hobby}</Badge>)}
                                </div>
                            </div>
                        )}
                        {embedUrl && (
                             <div>
                                <h4 className="font-semibold mb-2">Tanıtım Videosu</h4>
                                <div className="aspect-video rounded-lg overflow-hidden">
                                     <iframe
                                        className="w-full h-full"
                                        src={embedUrl}
                                        title="Embedded video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

function QuickAddChildDialog({ userId, onChildAdded }: { userId: string, onChildAdded: () => void }) {
    const [open, setOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [dob, setDob] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const db = useFirestore();
    const { toast } = useToast();

    const handleQuickAdd = async () => {
        if (!db || !userId || !firstName || !dob) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen tüm alanları doldurun.' });
            return;
        }

        const age = differenceInYears(new Date(), new Date(dob));
        if (age < 2 || age > 18) {
            toast({ variant: 'destructive', title: 'Geçersiz Yaş', description: 'Çocuğun yaşı 2 ile 18 arasında olmalıdır.' });
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(collection(db, 'users', userId, 'children'), {
                userId: userId,
                firstName: firstName,
                dateOfBirth: format(new Date(dob), "yyyy-MM-dd"),
                rozet: 0,
                completedTopics: [],
                remainingLessons: 0,
                assignedPackage: null,
                assignedPackageName: null,
                hasUsedFreeTrial: false,
                isProfileComplete: false, // Mark as incomplete
            });

            toast({ title: 'Başarılı!', description: `${firstName} eklendi. Şimdi deneme dersini planlayabilirsiniz.` });
            onChildAdded();
            setOpen(false);
            setFirstName('');
            setDob('');
        } catch (error) {
            console.error('Quick add child error:', error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Çocuk eklenirken bir sorun oluştu.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Çocuk Ekle
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hızlı Çocuk Ekle</DialogTitle>
                    <DialogDescription>Deneme dersi planlamak için çocuğunuzun temel bilgilerini girin.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="quick-add-name">İsim</Label>
                        <Input id="quick-add-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Çocuğun adı" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="quick-add-dob">Doğum Tarihi</Label>
                        <Input id="quick-add-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                    <Button onClick={handleQuickAdd} disabled={isSaving}>
                        {isSaving && <Loader2 className="animate-spin mr-2" />}
                        Ekle ve Devam Et
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
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
    const [bookingMode, setBookingMode] = useState<'free' | 'paid'>('paid');
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ id: string, startTime: Timestamp, teacherId: string } | null>(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');


    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

    const childrenRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return collection(db, 'users', user.uid, 'children');
    }, [db, user?.uid]);

    const { data: children, isLoading: areChildrenLoading, refetch: refetchChildren } = useCollection(childrenRef);

    const teachersQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'users'), where('role', '==', 'teacher'));
    }, [db]);

    const { data: teachers, isLoading: areTeachersLoading } = useCollection(teachersQuery);


    const selectedChildData = useMemo(() => children?.find(c => c.id === selectedChildId), [children, selectedChildId]);
    
    useEffect(() => {
        const newlyAddedChildId = localStorage.getItem('newlyAddedChildId');
        if (newlyAddedChildId && children?.some(c => c.id === newlyAddedChildId)) {
            setSelectedChildId(newlyAddedChildId);
            localStorage.removeItem('newlyAddedChildId'); // Clean up after use
        }
    }, [children]);


    useEffect(() => {
        if (userData?.timezone) {
            setSelectedTimeZone(userData.timezone);
        } else if (typeof window !== 'undefined') {
            setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
    }, [userData]);

    // Logic to determine available booking modes for the selected child
    useEffect(() => {
        if (selectedChildData) {
            const hasPackage = selectedChildData.assignedPackage && selectedChildData.remainingLessons > 0;
            const canTakeFreeTrial = !selectedChildData.hasUsedFreeTrial && (userData?.freeTrialsUsed || 0) < MAX_FREE_TRIALS;

            if (canTakeFreeTrial) {
                setBookingMode('free');
                 setSelectedPackage('FREE_TRIAL');
            } else if (hasPackage) {
                setBookingMode('paid');
                setSelectedPackage(selectedChildData.assignedPackage);
            } else {
                setBookingMode('paid'); // Default, but will be disabled
                setSelectedPackage('');
            }
        } else {
            setBookingMode('paid');
            setSelectedPackage('');
        }
    }, [selectedChildData, userData]);


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

    const lessonSlotsRef = useMemoFirebase(() => {
        if (!db || !selectedTeacherId) return null;
        // Simplified query to avoid composite index. Filtering by status will happen client-side.
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', selectedTeacherId));
    }, [db, selectedTeacherId]);

    const { data: allTeacherSlots, isLoading: areSlotsLoading } = useCollection(lessonSlotsRef);

    const availableSlots = useMemo(() => {
        if (!allTeacherSlots) return [];
        // Client-side filtering for status and time
        return allTeacherSlots.filter(slot => slot.status === 'available' && slot.startTime.toDate() > new Date());
    }, [allTeacherSlots]);


    const availableDays = useMemo(() => {
        if (!availableSlots || !selectedTimeZone) return [];
        return availableSlots
            .map(slot => toZonedTime(slot.startTime.seconds * 1000, selectedTimeZone));
    }, [availableSlots, selectedTimeZone]);
    
    const slotsForSelectedDate = useMemo(() => {
        if (!availableSlots || !selectedDate || !selectedTimeZone || !selectedPackage) return [];

        const courseDetails = getCourseDetailsFromPackageCode(selectedPackage);
        if (!courseDetails) return [];
        
        const lessonDuration = courseDetails.duration;
        const requiredConsecutiveSlots = Math.ceil((lessonDuration + 5) / 5); // Add 5 min break
        const now = new Date();

        const fiveMinSlots = availableSlots
            .filter(slot => {
                const zonedDate = toZonedTime(slot.startTime.seconds * 1000, selectedTimeZone);
                return isSameDay(zonedDate, selectedDate);
            })
            .map(slot => ({
                ...slot,
                startTimeObj: slot.startTime.toDate()
            }))
            .sort((a, b) => a.startTimeObj.getTime() - b.startTimeObj.getTime());
            
        const validStartTimes: any[] = [];
        
        for (let i = 0; i <= fiveMinSlots.length - requiredConsecutiveSlots; i++) {
            const potentialStartTime = fiveMinSlots[i];
            
            if (validStartTimes.some(s => s.startTimeObj >= potentialStartTime.startTimeObj)) {
                continue;
            }

            let isConsecutive = true;
            for (let j = 1; j < requiredConsecutiveSlots; j++) {
                const expectedNextTime = addMinutes(fiveMinSlots[i + j - 1].startTimeObj, 5);
                if (fiveMinSlots[i + j].startTimeObj.getTime() !== expectedNextTime.getTime()) {
                    isConsecutive = false;
                    break;
                }
            }

            if (isConsecutive) {
                validStartTimes.push(potentialStartTime);
            }
        }
        
        return validStartTimes;

    }, [availableSlots, selectedDate, selectedTimeZone, selectedPackage]);
    
    const handleSlotClick = (slot: { id: string, startTime: Timestamp, teacherId: string }) => {
         if (!user || !userData) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Giriş yapmalısınız.' });
            return;
        }

        if (!selectedChildId) {
            toast({ variant: 'destructive', title: 'Eksik Bilgi', description: 'Lütfen dersi alacak çocuğu seçin.' });
            return;
        }

        const hasPackage = selectedChildData?.assignedPackage && selectedChildData?.remainingLessons > 0;
        const canTakeFreeTrial = !selectedChildData?.hasUsedFreeTrial && (userData.freeTrialsUsed || 0) < MAX_FREE_TRIALS;

        if (bookingMode === 'free' && !canTakeFreeTrial) {
             toast({ variant: 'destructive', title: 'Deneme Hakkı Yok', description: 'Bu çocuk için ücretsiz deneme dersi hakkı bulunmuyor veya aile limiti aşıldı.' });
             return;
        }

        if (bookingMode === 'paid' && !hasPackage) {
            toast({ variant: 'destructive', title: 'Ders Hakkı Kalmadı', description: 'Bu çocuk için atanmış ders paketi bulunmuyor veya ders hakkı kalmadı.' });
            return;
        }

        setSelectedSlot(slot);
        setIsConfirming(true);
    };
    
    const handleBookLesson = async () => {
        if (!user || !db || !userDocRef || !userData || !selectedSlot || !selectedChildData || !selectedPackage) return;
    
        setIsBooking(true);
        const batch = writeBatch(db);

        const courseDetails = getCourseDetailsFromPackageCode(selectedPackage);
        if (!courseDetails) {
             toast({ variant: 'destructive', title: 'Hata', description: 'Kurs detayları bulunamadı.' });
             setIsBooking(false);
             return;
        }

        const lessonDuration = courseDetails.duration;
        const totalDuration = lessonDuration + 5; // including break
        const numSlotsToBook = Math.ceil(totalDuration / 5);
        const startTime = selectedSlot.startTime.toDate();
        
        try {
            const slotRefsToUpdate: string[] = [];
             for (let i = 0; i < numSlotsToBook; i++) {
                const slotTime = addMinutes(startTime, i * 5);
                const q = query(collection(db, 'lesson-slots'), 
                                where('teacherId', '==', selectedSlot.teacherId), 
                                where('startTime', '==', Timestamp.fromDate(slotTime)));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docId = querySnapshot.docs[0].id;
                    slotRefsToUpdate.push(docId);
                    const slotDocRef = doc(db, 'lesson-slots', docId);
                    batch.update(slotDocRef, { 
                        status: 'booked',
                        bookedBy: user.uid,
                        childId: selectedChildId,
                        packageCode: bookingMode === 'free' ? 'FREE_TRIAL' : selectedPackage
                    });
                } else {
                     throw new Error(`Saat ${format(slotTime, 'HH:mm')} için slot bulunamadı. Lütfen tekrar deneyin.`);
                }
            }

            if (slotRefsToUpdate.length !== numSlotsToBook) {
                throw new Error("Ders için yeterli ardışık zaman dilimi bulunamadı. Lütfen başka bir saat seçin.");
            }
            
            // Update user/child lesson counts
            const childDocRef = doc(db, 'users', user.uid, 'children', selectedChildId);
            let successMessage = '';
    
            if (bookingMode === 'free') {
                batch.update(userDocRef, { freeTrialsUsed: increment(1) });
                batch.update(childDocRef, { hasUsedFreeTrial: true });
                successMessage = 'Ücretsiz deneme dersiniz başarıyla planlandı.';
            } else { // 'paid'
                batch.update(childDocRef, { remainingLessons: increment(-1) });
                successMessage = 'Dersiniz başarıyla planlandı. Çocuğunuzun kalan ders sayısı güncellendi.';
            }
        
            await batch.commit();
    
            const updatedChildSnap = await getDoc(childDocRef);
            if (bookingMode === 'paid' && updatedChildSnap.exists() && updatedChildSnap.data().remainingLessons === 0) {
                const finishedPackage = updatedChildSnap.data().assignedPackage;
                
                const secondBatch = writeBatch(db);
                secondBatch.update(childDocRef, {
                    assignedPackage: null,
                    assignedPackageName: null,
                    remainingLessons: 0,
                    finishedPackage: finishedPackage
                });
                secondBatch.update(userDocRef, {
                    enrolledPackages: arrayRemove(finishedPackage),
                });
                await secondBatch.commit();

                toast({
                    title: 'Paket Tamamlandı!',
                    description: `Çocuğunuz ${finishedPackage} paketindeki tüm dersleri tamamladı.`,
                });
            } else {
                 toast({
                    title: 'Ders Planlandı!',
                    description: successMessage,
                    className: 'bg-green-500 text-white'
                });
            }
           
            router.push('/ebeveyn-portali/dersler');

        } catch(error) {
             const errorMessage = (error instanceof Error) ? error.message : 'Ders planlanırken bir hata oluştu.';
             toast({ variant: 'destructive', title: 'Hata', description: errorMessage });
             console.error(error);
        } finally {
            setIsBooking(false);
            setIsConfirming(false);
            setSelectedSlot(null);
        }
    };
    
    const canTakeFreeTrial = !selectedChildData?.hasUsedFreeTrial && (userData?.freeTrialsUsed || 0) < MAX_FREE_TRIALS;
    const hasPackage = selectedChildData?.assignedPackage && selectedChildData?.remainingLessons > 0;
    const canBook = selectedChildId && selectedTeacherId && ( (bookingMode === 'free' && canTakeFreeTrial) || (bookingMode === 'paid' && hasPackage) );
    
    if (isUserLoading || areChildrenLoading || !selectedTimeZone || areTeachersLoading) {
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
                            Öğretmenlerimizin müsait olduğu zamanlardan birini seçin.
                        </p>
                    </div>
                </div>
            </div>

            <Card className="p-4 sm:p-6">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                     <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="space-y-2">
                             <Label htmlFor="child-select" className="font-semibold text-lg">1. Adım: Öğrenci ve Ders Türü</Label>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                        <SelectTrigger id="child-select" >
                                            <SelectValue placeholder="Çocuk Seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {children && children.map(child => (
                                                <SelectItem key={child.id} value={child.id}>{child.firstName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                     {user && children && children.length === 0 && (
                                        <QuickAddChildDialog userId={user.uid} onChildAdded={refetchChildren} />
                                    )}
                                </div>
                                {selectedChildId && (
                                     <div>
                                        <Select value={bookingMode} onValueChange={(value) => {
                                            setBookingMode(value as 'free' | 'paid');
                                            if (value === 'free') {
                                                setSelectedPackage('FREE_TRIAL');
                                            } else if (selectedChildData?.assignedPackage) {
                                                setSelectedPackage(selectedChildData.assignedPackage);
                                            }
                                        }}>
                                            <SelectTrigger id="package-select">
                                                <SelectValue placeholder="Ders Türü Seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {canTakeFreeTrial && <SelectItem value="free">Ücretsiz Deneme Dersi (30 dk)</SelectItem>}
                                                {hasPackage && <SelectItem value="paid">{getCourseDetailsFromPackageCode(selectedChildData.assignedPackage)?.courseName} ({getCourseDetailsFromPackageCode(selectedChildData.assignedPackage)?.duration} dk)</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                     </div>
                                )}
                            </div>
                            <div className="mt-2 text-center sm:text-left">
                                {!selectedChildId ? (
                                    <Badge variant="outline">Lütfen bir çocuk seçin.</Badge>
                                ) : bookingMode === 'free' && canTakeFreeTrial ? (
                                    <Badge variant="default" className='bg-green-100 text-green-800'>
                                        <BookOpen className="w-3 h-3 mr-1"/>
                                        Bu çocuk için deneme dersi hakkı mevcut.
                                    </Badge>
                                ) : bookingMode === 'paid' && hasPackage ? (
                                    <Badge>Kalan Ders: {selectedChildData?.remainingLessons}</Badge>
                                ) : (
                                    <Badge variant="destructive">Bu çocuk için seçilen türde ders hakkı yok.</Badge>
                                )}
                            </div>
                        </div>

                         {/* Step 2 */}
                        <div className="space-y-2">
                            <Label htmlFor="teacher-select" className="font-semibold text-lg">2. Adım: Öğretmen Seçimi</Label>
                             <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId} disabled={!selectedChildId}>
                                <SelectTrigger id="teacher-select">
                                    <SelectValue placeholder="Öğretmen Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers && teachers.map(teacher => (
                                        <SelectItem key={teacher.id} value={teacher.id}>
                                            <div className="flex items-center justify-between w-full">
                                                <span>{teacher.firstName}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedTeacherId && <TeacherProfileDialog teacherId={selectedTeacherId} />}
                        </div>
                        
                         {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <Label className="font-semibold text-lg mb-2 self-start">3. Adım: Takvim</Label>
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
                                    if (!selectedTeacherId) return true;
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (date < today) return true;
                                    if (date > addDays(today, 30)) return true; // Disable dates more than 30 days in the future
                                    return !availableDays.some(availableDay => isSameDay(date, availableDay));
                                }}
                                className="rounded-md border"
                            />
                        </div>
                    </div>
                     <div className="h-full">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-center lg:text-left mb-2">
                                     4. Adım: Müsait Saatler
                                </h3>
                                 <p className="text-sm text-muted-foreground text-center lg:text-left mb-4">
                                     {selectedDate ? formatInTimeZone(selectedDate, selectedTimeZone, 'dd MMMM yyyy', { locale: tr }) : 'Bir tarih seçin'}
                                     {selectedDate && <span className="text-xs text-muted-foreground ml-2">({selectedTimeZone})</span>}
                                 </p>
                            </div>
                           
                            {areSlotsLoading ? (
                                 <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/50">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : selectedDate && slotsForSelectedDate.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {slotsForSelectedDate.map(slot => (
                                        <Button
                                            key={slot.id}
                                            variant="outline"
                                            className="h-12 text-base"
                                            onClick={() => handleSlotClick(slot)}
                                            disabled={isBooking || !canBook}
                                        >
                                            {formatInTimeZone(slot.startTime.toDate(), selectedTimeZone, 'HH:mm')}
                                        </Button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-muted/50">
                                    <p className="text-muted-foreground text-center px-4">
                                        {selectedTeacherId ? "Bu tarih için seçtiğiniz derse uygun müsaitlik bulunmamaktadır." : "Lütfen bir öğretmen seçin."}
                                    </p>
                                </div>
                            )}
                             <div className="mt-6 w-full max-w-sm mx-auto lg:mx-0">
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
                    </div>
                </div>
            </Card>
             <Alert className="mt-8">
                <Info className="h-4 w-4" />
                <AlertDescription>
                    Derse 24 saat kalana kadar ücretsiz iptal edebilirsiniz. 24 saatten az kalan dersler icin 2 degisim hakkiniz vardir
                </AlertDescription>
            </Alert>

            <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ders Planını Onayla</AlertDialogTitle>
                        <AlertDialogDescription>
                            Lütfen aşağıdaki bilgileri kontrol edin ve dersi planlamak için onaylayın.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {selectedSlot && (
                         <div className="space-y-4 my-4 text-sm">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Çocuk:</strong> {selectedChildData?.firstName}</p>
                            </div>
                             <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Öğretmen:</strong> {teachers?.find(t => t.id === selectedSlot.teacherId)?.firstName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Tarih:</strong> {formatInTimeZone(selectedSlot.startTime.toDate(), selectedTimeZone, 'dd MMMM yyyy', { locale: tr })}</p>
                            </div>
                             <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Saat:</strong> {formatInTimeZone(selectedSlot.startTime.toDate(), selectedTimeZone, 'HH:mm')} ({selectedTimeZone})</p>
                            </div>
                             <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-muted-foreground"/>
                                <p><strong>Ders Türü:</strong> {bookingMode === 'free' ? 'Ücretsiz Deneme Dersi' : `${getCourseDetailsFromPackageCode(selectedPackage)?.courseName} (${getCourseDetailsFromPackageCode(selectedPackage)?.duration} dk)`}</p>
                            </div>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedSlot(null)}>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBookLesson} disabled={isBooking}>
                            {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Onayla ve Planla
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
