
'use client'

import { useMemo } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, differenceInYears } from 'firebase/firestore';
import { Loader2, User, Baby, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { COURSES } from '@/data/courses';

type SlotDetails = {
    id: string;
    status: 'available' | 'booked';
    teacherId: string;
    bookedBy?: string;
    childId?: string;
    startTime: any; // Assuming Timestamp
    packageCode?: string;
};

const getCourseDetailsFromPackageCode = (code?: string) => {
    if (!code) return null;
    if (code === 'FREE_TRIAL') return { courseName: 'Ücretsiz Deneme Dersi', duration: '30 dakika' };
    
    const courseCodeMap: { [key: string]: string } = { 'B': 'baslangic', 'K': 'konusma', 'G': 'gelisim', 'A': 'akademik' };
    const courseId = courseCodeMap[code.replace(/[0-9]/g, '')];
    const course = COURSES.find(c => c.id === courseId);
    return course ? { courseName: course.title, duration: course.details.duration } : null;
}


export function LessonDetailsDialog({ slot, isOpen, onOpenChange }: { slot: SlotDetails | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const db = useFirestore();
    const turkeyTimeZone = 'Europe/Istanbul';

    const parentDocRef = useMemoFirebase(() => {
        if (!db || !slot?.bookedBy) return null;
        return doc(db, 'users', slot.bookedBy);
    }, [db, slot?.bookedBy]);

    const childDocRef = useMemoFirebase(() => {
        if (!db || !slot?.bookedBy || !slot?.childId) return null;
        return doc(db, 'users', slot.bookedBy, 'children', slot.childId);
    }, [db, slot?.bookedBy, slot?.childId]);

    const { data: parentData, isLoading: isParentLoading } = useDoc(parentDocRef);
    const { data: childData, isLoading: isChildLoading } = useDoc(childDocRef);

    if (!slot) return null;
    
    const childAge = childData?.dateOfBirth ? differenceInYears(new Date(), new Date(childData.dateOfBirth)) : 'N/A';
    const packageDetails = getCourseDetailsFromPackageCode(slot.packageCode);

    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ders Detayları</DialogTitle>
                    <DialogDescription>
                         {formatInTimeZone(slot.startTime.toDate(), turkeyTimeZone, 'dd MMMM yyyy, HH:mm', { locale: tr })} (Türkiye Saati)
                    </DialogDescription>
                </DialogHeader>
                {isParentLoading || isChildLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6 pt-4">
                        {packageDetails && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><BookOpen /> Ders Bilgileri</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-2">
                                     <p><strong>Paket:</strong> {packageDetails.courseName} ({slot.packageCode === 'FREE_TRIAL' ? 'Deneme' : slot.packageCode})</p>
                                     <p><strong>Süre:</strong> {packageDetails.duration}</p>
                                </CardContent>
                            </Card>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><User /> Veli Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>İsim:</strong> {parentData?.firstName} {parentData?.lastName}</p>
                                <p><strong>Email:</strong> {parentData?.email}</p>
                                <p><strong>Saat Dilimi:</strong> {parentData?.timezone}</p>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Baby /> Çocuk Bilgileri</CardTitle>
                            </CardHeader>
                             <CardContent className="text-sm space-y-2">
                                <p><strong>İsim:</strong> {childData?.firstName}</p>
                                <p><strong>Yaş:</strong> {childAge}</p>
                                <p><strong>Seviye:</strong> {childData?.level}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
