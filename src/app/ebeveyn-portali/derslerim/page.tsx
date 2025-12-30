
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Calendar, Clock, User, BookOpen, Baby, History, MessageSquare, Video, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { addMinutes, startOfDay } from 'date-fns';
import { COURSES } from '@/data/courses';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProgressPanel } from '@/components/shared/progress-panel';

const getCourseDetailsFromPackageCode = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: 30 };
    
    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '')];
    const course = COURSES.find(c => c.id === courseId);
    
    if (!course) return null;

    let duration = 30; // Default
    if (course.id === 'baslangic') duration = 20;
    if (course.id === 'konusma') duration = 30;
    if (course.id === 'gelisim' || course.id === 'akademik') duration = 45;

    return { courseName: course.title, duration };
};

const teachers = [
    { id: 'O2mQCONyczVkAXcgAMBSPpeIfJw2', firstName: 'Tuba', lastName: 'Kodak' },
];


function LessonCard({ lesson, timeZone, onShowProgress }: { lesson: any, timeZone: string, onShowProgress: (lesson: any) => void }) {
    const db = useFirestore();
    const router = useRouter();

    const childDocRef = useMemoFirebase(() => {
        if (!db || !lesson.bookedBy || !lesson.childId) return null;
        return doc(db, 'users', lesson.bookedBy, 'children', lesson.childId);
    }, [db, lesson.bookedBy, lesson.childId]);

    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);
    
    const teacher = useMemo(() => teachers.find(t => t.id === lesson.teacherId), [lesson.teacherId]);

    if (isChildLoading) {
        return <Card className="p-4 flex items-center justify-center min-h-[220px]"><Loader2 className="animate-spin text-primary" /></Card>;
    }

    const isPast = new Date() > lesson.endTime;
    const startTimeStr = formatInTimeZone(lesson.startTime, timeZone, 'HH:mm');
    const endTimeStr = formatInTimeZone(lesson.endTime, timeZone, 'HH:mm');
    const packageDetails = getCourseDetailsFromPackageCode(lesson.packageCode);

    const handleJoin = () => {
        if (lesson.liveLessonUrl) {
            router.push(lesson.liveLessonUrl);
        }
    };

    return (
        <Card className='flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span className="text-xl font-bold leading-tight">{packageDetails?.courseName || 'Ders'}</span>
                     <Badge variant={isPast ? "outline" : "default"} className={isPast ? "bg-slate-50" : (lesson.isLive ? "bg-red-500 animate-pulse text-white" : "bg-green-100 text-green-800")}>
                        {isPast ? 'Tamamlandı' : (lesson.isLive ? 'Canlı Yayında' : 'Yaklaşıyor')}
                    </Badge>
                </CardTitle>
                <CardDescription className="font-medium text-slate-600">
                    {formatInTimeZone(lesson.startTime, timeZone, 'dd MMMM yyyy, ')}
                    {startTimeStr} - {endTimeStr}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-grow">
                <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-primary" />
                    <span><strong>Öğrenci:</strong> {childData?.firstName}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Öğretmen:</strong> {teacher?.firstName} {teacher?.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Paket:</strong> {lesson.packageCode === 'FREE_TRIAL' ? 'Ücretsiz Deneme' : packageDetails?.courseName}</span>
                </div>
            </CardContent>
            
            <CardFooter className="pt-2">
                {!isPast ? (
                    <Button 
                        onClick={handleJoin} 
                        disabled={!lesson.isLive} 
                        className={cn("w-full h-11 font-bold", lesson.isLive ? "bg-red-600 hover:bg-red-700" : "")}
                    >
                        <Video className="w-4 h-4 mr-2" />
                        {lesson.isLive ? 'Derse Katıl' : 'Dersin Başlaması Bekleniyor'}
                    </Button>
                ) : (
                    <Button 
                        onClick={() => onShowProgress(lesson)}
                        variant="outline"
                        className="w-full h-11 font-semibold border-primary/20 text-primary hover:bg-primary/5"
                    >
                        <ClipboardList className="w-4 h-4 mr-2" />
                        İlerleme Raporunu Gör
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}


export default function DerslerimPage() {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();

    const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
    const [isProgressOpen, setIsProgressOpen] = useState(false);

    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

    const timeZone = useMemo(() => {
        if (userData?.timezone) return userData.timezone;
        if (typeof window !== 'undefined') return Intl.DateTimeFormat().resolvedOptions().timeZone;
        return 'Europe/Istanbul';
    }, [userData]);


    const bookedLessonsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'lesson-slots'), where('bookedBy', '==', user.uid));
    }, [user, db]);

    const { data: lessonSlots, isLoading: lessonsLoading } = useCollection(bookedLessonsQuery);

    const groupedLessons = useMemo(() => {
        if (!lessonSlots) return [];
        const sessions: { [key: string]: any[] } = {};
        lessonSlots.forEach(slot => {
            const startTime = slot.startTime.toDate();
            const sessionDate = formatInTimeZone(startTime, 'UTC', 'yyyy-MM-dd-HH-mm');
            const sessionKey = `${sessionDate}-${slot.childId}-${slot.teacherId}`;
            if (!sessions[sessionKey]) sessions[sessionKey] = [];
            sessions[sessionKey].push(slot);
        });
        return Object.values(sessions).map(sessionSlots => {
            sessionSlots.sort((a, b) => a.startTime.seconds - b.startTime.seconds);
            const firstSlot = sessionSlots[0];
            const startTime = firstSlot.startTime.toDate();
            const packageDetails = getCourseDetailsFromPackageCode(firstSlot.packageCode);
            const duration = packageDetails ? packageDetails.duration : 30;
            const endTime = addMinutes(startTime, duration);
            const feedbackSlot = sessionSlots.find(s => s.feedback);
            const liveSlot = sessionSlots.find(s => s.isLive);

            return {
                id: firstSlot.id,
                startTime: startTime,
                endTime: endTime,
                childId: firstSlot.childId,
                teacherId: firstSlot.teacherId,
                bookedBy: firstSlot.bookedBy,
                packageCode: firstSlot.packageCode,
                feedback: feedbackSlot ? feedbackSlot.feedback : null,
                isLive: liveSlot ? liveSlot.isLive : false,
                liveLessonUrl: liveSlot ? liveSlot.liveLessonUrl : null
            };
        });
    }, [lessonSlots]);
    
    const { upcomingLessons, pastLessons } = useMemo(() => {
        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];
        groupedLessons.forEach(lesson => {
            if (lesson.endTime > now) upcoming.push(lesson);
            else past.push(lesson);
        });
        upcoming.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        past.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
        return { upcomingLessons: upcoming, pastLessons: past };
    }, [groupedLessons]);

    const handleShowProgress = (lesson: any) => {
        setSelectedLesson(lesson);
        setIsProgressOpen(true);
    };

    const selectedChildDocRef = useMemoFirebase(() => {
        if (!db || !selectedLesson?.bookedBy || !selectedLesson?.childId) return null;
        return doc(db, 'users', selectedLesson.bookedBy, 'children', selectedLesson.childId);
    }, [db, selectedLesson]);

    const { data: selectedChildData, isLoading: isChildDataLoading } = useDoc(selectedChildDocRef);

    if (userLoading || lessonsLoading || isUserLoading) {
        return <div className="flex min-h-[calc(100vh-80px)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Derslerim</h2>
                    <p className="text-muted-foreground">Derslerinizi takip edin ve gelişim raporlarını inceleyin.</p>
                </div>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming"><Calendar className="mr-2 h-4 w-4" />Yaklaşan Dersler ({upcomingLessons.length})</TabsTrigger>
                    <TabsTrigger value="past"><History className="mr-2 h-4 w-4" />Geçmiş Dersler ({pastLessons.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                        {upcomingLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} timeZone={timeZone} onShowProgress={handleShowProgress} />)}
                        {upcomingLessons.length === 0 && <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed text-muted-foreground">Henüz planlanmış bir dersiniz bulunmuyor.</div>}
                    </div>
                </TabsContent>
                <TabsContent value="past">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                        {pastLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} timeZone={timeZone} onShowProgress={handleShowProgress} />)}
                        {pastLessons.length === 0 && <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed text-muted-foreground">Henüz tamamlanmış bir dersiniz bulunmuyor.</div>}
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={isProgressOpen} onOpenChange={setIsProgressOpen}>
                <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b">
                        <DialogTitle className="text-2xl font-bold font-headline">
                            {isChildDataLoading || !selectedChildData ? 'Yükleniyor...' : `${selectedChildData.firstName} - Ders İlerleme Raporu`}
                        </DialogTitle>
                        <DialogDescription>
                            Öğretmenin bu ders için hazırladığı detaylı analiz ve geri bildirimler.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                        {isChildDataLoading || !selectedChildData || !selectedLesson ? (
                            <div className="flex h-64 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
                        ) : (
                            <ProgressPanel child={selectedChildData} lessonId={selectedLesson.id} isEditable={false} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
