
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, Calendar, History, User, BookOpen, Baby, MessageSquare, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { COURSES } from '@/data/courses';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ProgressPanel } from '@/components/shared/progress-panel';

const getCourseDetailsFromPackageCode = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: '30 dakika' };
    
    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '')];
    const course = COURSES.find(c => c.id === courseId);
    return course ? { courseName: course.title, duration: course.details.duration } : null;
}

function FeedbackDialog({ lesson, child, isOpen, onOpenChange, onFeedbackSaved }: { lesson: any, child: any, isOpen: boolean, onOpenChange: (open: boolean) => void, onFeedbackSaved: () => void }) {
    const [feedback, setFeedback] = useState(lesson.feedback?.text || '');
    const [isSaving, setIsSaving] = useState(false);
    const db = useFirestore();
    const { toast } = useToast();

    const handleSave = async () => {
        if (!feedback) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Geri bildirim boş olamaz.' });
            return;
        }
        setIsSaving(true);
        const lessonDocRef = doc(db, 'lesson-slots', lesson.id);
        try {
            await updateDoc(lessonDocRef, {
                feedback: {
                    text: feedback,
                    createdAt: serverTimestamp()
                }
            });
            toast({ title: 'Başarılı!', description: 'Geri bildirim kaydedildi.', className: 'bg-green-500 text-white' });
            onFeedbackSaved();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Geri bildirim kaydedilemedi.' });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <div className='flex flex-col'>
                    <DialogHeader>
                        <DialogTitle>Ders Geri Bildirimi Ekle</DialogTitle>
                        <DialogDescription>
                            Öğrencinin ders performansı ve gelişimi hakkında notlarınızı ekleyin. Bu notlar veli tarafından görülecektir.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2 flex-1 flex flex-col">
                        <Label htmlFor="feedback-text">Geri Bildirim</Label>
                        <Textarea
                            id="feedback-text"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Örn: Ayşe bugün renkleri çok iyi öğrendi, özellikle kırmızı rengini hemen tanıdı..."
                            rows={8}
                            className="flex-1"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">İptal</Button>
                        </DialogClose>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin mr-2"/> : null}
                            Kaydet
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function LessonCard({ lesson, onOpenFeedback }: { lesson: any, onOpenFeedback: () => void }) {
    const db = useFirestore();

    const childDocRef = useMemoFirebase(() => {
        if (!db || !lesson.bookedBy || !lesson.childId) return null;
        return doc(db, 'users', lesson.bookedBy, 'children', lesson.childId);
    }, [db, lesson.bookedBy, lesson.childId]);

    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);

    if (isChildLoading) {
        return <Card className="p-4 flex items-center justify-center min-h-[200px]"><Loader2 className="animate-spin text-primary" /></Card>;
    }

    const packageDetails = getCourseDetailsFromPackageCode(lesson.packageCode);
    const lessonDate = lesson.startTime.toDate();
    const isPast = new Date() > lessonDate;

    return (
        <Card className='flex flex-col'>
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span className="text-lg">{packageDetails?.courseName || 'Ders'}</span>
                    <Badge variant={isPast ? "outline" : "default"}>{isPast ? 'Tamamlandı' : 'Yaklaşıyor'}</Badge>
                </CardTitle>
                <CardDescription>
                    {formatInTimeZone(lessonDate, 'Europe/Istanbul', 'dd MMMM yyyy, HH:mm', { locale: tr })} (TSİ)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-grow">
                <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Öğrenci:</strong> {childData?.firstName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span><strong>Paket:</strong> {lesson.packageCode === 'FREE_TRIAL' ? 'Ücretsiz Deneme' : lesson.packageCode}</span>
                </div>
            </CardContent>
            {isPast && (
                <>
                    <Separator />
                    <CardFooter className="flex-col items-start gap-3 pt-4">
                        {lesson.feedback ? (
                            <>
                                <h4 className="font-semibold flex items-center gap-2 text-base"><MessageSquare className='w-5 h-5 text-primary'/> Kaydedilen Geri Bildirim:</h4>
                                <p className='text-sm text-muted-foreground italic'>"{lesson.feedback.text}"</p>
                                <Button variant="outline" size="sm" className="mt-2" onClick={onOpenFeedback}><Edit className='w-4 h-4 mr-2'/> Düzenle</Button>
                            </>
                        ) : (
                            <Button onClick={onOpenFeedback}><Edit className='w-4 h-4 mr-2'/> Geri Bildirim Ekle</Button>
                        )}
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

export default function OgretmenDerslerimPage() {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

    const lessonsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', user.uid), where('status', '==', 'booked'));
    }, [user, db]);

    const { data: lessons, isLoading: lessonsLoading, refetch } = useCollection(lessonsQuery);

    const childDocRef = useMemoFirebase(() => {
        if (!db || !selectedLesson?.bookedBy || !selectedLesson?.childId) return null;
        return doc(db, 'users', selectedLesson.bookedBy, 'children', selectedLesson.childId);
    }, [db, selectedLesson]);

    const { data: selectedChildData } = useDoc(childDocRef);

    const { upcomingLessons, pastLessons } = useMemo(() => {
        if (!lessons) return { upcomingLessons: [], pastLessons: [] };
        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];
        lessons.forEach(lesson => {
            if (lesson.startTime.toDate() > now) upcoming.push(lesson);
            else past.push(lesson);
        });
        upcoming.sort((a, b) => a.startTime.seconds - b.startTime.seconds);
        past.sort((a, b) => b.startTime.seconds - a.startTime.seconds);
        return { upcomingLessons: upcoming, pastLessons: past };
    }, [lessons]);

    const handleOpenFeedbackDialog = (lesson: any) => {
        setSelectedLesson(lesson);
        setIsFeedbackDialogOpen(true);
    };

    if (userLoading || lessonsLoading) {
        return <div className="flex min-h-[calc(100vh-145px)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Derslerim</h2>
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming"><Calendar className="mr-2 h-4 w-4" />Yaklaşan Dersler ({upcomingLessons.length})</TabsTrigger>
                    <TabsTrigger value="past"><History className="mr-2 h-4 w-4" />Geçmiş Dersler ({pastLessons.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <Card>
                        <CardHeader><CardTitle>Yaklaşan Dersler</CardTitle></CardHeader>
                        <CardContent>
                            {upcomingLessons.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {upcomingLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} onOpenFeedback={() => handleOpenFeedbackDialog(lesson)} />)}
                                </div>
                            ) : <p className="text-muted-foreground">Yaklaşan dersiniz bulunmuyor.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="past">
                    <Card>
                        <CardHeader><CardTitle>Geçmiş Dersler</CardTitle></CardHeader>
                        <CardContent>
                             {pastLessons.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {pastLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} onOpenFeedback={() => handleOpenFeedbackDialog(lesson)} />)}
                                </div>
                            ) : <p className="text-muted-foreground">Henüz tamamlanmış bir dersiniz yok.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            {selectedLesson && (
                <FeedbackDialog 
                    lesson={selectedLesson}
                    child={selectedChildData}
                    isOpen={isFeedbackDialogOpen}
                    onOpenChange={setIsFeedbackDialogOpen}
                    onFeedbackSaved={refetch}
                />
            )}
        </div>
    );
}
