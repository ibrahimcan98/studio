'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, addDoc, getDocs, orderBy } from 'firebase/firestore';
import { Loader2, Users, Megaphone, Plus, FileText, Send, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useMemo, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';

function TeacherGroupClassesContent() {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const { toast } = useToast();

    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

    // Fetch Teacher's Group Packages
    const groupPackagesQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'groupCoursePackages'), where('teacherId', '==', user.uid));
    }, [user, db]);
    const { data: groupPackages, isLoading: packagesLoading } = useCollection(groupPackagesQuery);

    const groupSessionsQuery = useMemoFirebase(() => {
        if (!user || !db || !groupPackages || groupPackages.length === 0) return null;
        const ids = groupPackages.map((p: any) => p.id).slice(0, 10);
        return query(collection(db, 'groupCourseSessions'), where('packageId', 'in', ids));
    }, [user, db, groupPackages]);
    const { data: groupSessions } = useCollection(groupSessionsQuery);

    // Selected Package
    const selectedPackage = useMemo(() => {
        if (!groupPackages || !selectedPackageId) return null;
        return groupPackages.find((p: any) => p.id === selectedPackageId);
    }, [groupPackages, selectedPackageId]);

    // Fetch Enrollments for selected package
    const enrollmentsQuery = useMemoFirebase(() => {
        if (!selectedPackageId || !db) return null;
        return query(collection(db, 'groupCourseEnrollments'), where('packageId', '==', selectedPackageId));
    }, [selectedPackageId, db]);
    const { data: enrollments, isLoading: enrollmentsLoading } = useCollection(enrollmentsQuery);

    // To display student names, we'll just fetch all children documents in a separate pass
    const [studentData, setStudentData] = useState<any>({});
    
    // Quick load student names
    useMemo(() => {
        if (!enrollments || !db) return;
        enrollments.forEach(async (enr: any) => {
            if (studentData[enr.studentId]) return;
            const childDocQuery = query(collection(db, `users/${enr.parentId}/children`));
            const childDocs = await getDocs(childDocQuery);
            const matchingChild = childDocs.docs.find(d => d.id === enr.studentId);
            if (matchingChild) {
                setStudentData((prev: any) => ({ ...prev, [enr.studentId]: matchingChild.data() }));
            }
        });
    }, [enrollments, db]);

    // Fetch Announcements
    const announcementsQuery = useMemoFirebase(() => {
        if (!selectedPackageId || !db) return null;
        return query(collection(db, 'groupAnnouncements'), where('packageId', '==', selectedPackageId), orderBy('createdAt', 'desc'));
    }, [selectedPackageId, db]);
    const { data: announcements, isLoading: announcementsLoading } = useCollection(announcementsQuery);

    if (userLoading || packagesLoading) {
        return <div className="flex min-h-[calc(100vh-145px)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <h2 className="text-3xl font-bold tracking-tight">Grup Sınıflarım</h2>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Sınıflarınız</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(!groupPackages || groupPackages.length === 0) && (
                                <p className="text-sm text-muted-foreground italic">Size atanmış bir grup sınıfı bulunamadı.</p>
                            )}
                            {groupPackages?.map((pkg: any) => {
                                const packageSessions = groupSessions?.filter((s: any) => s.packageId === pkg.id).sort((a: any, b: any) => (a.startTime?.seconds || 0) - (b.startTime?.seconds || 0));
                                const firstSession = packageSessions?.[0];
                                return (
                                <button
                                    key={pkg.id}
                                    onClick={() => setSelectedPackageId(pkg.id)}
                                    className={`w-full text-left p-4 rounded-xl transition-all border ${
                                        selectedPackageId === pkg.id 
                                            ? 'border-purple-500 bg-purple-50 shadow-sm ring-1 ring-purple-500' 
                                            : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-bold ${selectedPackageId === pkg.id ? 'text-purple-900' : 'text-slate-900'}`}>
                                            {pkg.title}
                                        </h3>
                                        <Badge variant={pkg.status === 'published' ? 'default' : 'secondary'} className={pkg.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                            {pkg.status === 'published' ? 'Aktif' : 'Taslak'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {pkg.enrolledCount}/{pkg.capacity}</span>
                                        {firstSession?.startTime && (
                                            <span className="flex items-center gap-1 text-slate-400">
                                                <Calendar className="w-3 h-3" /> {formatInTimeZone(firstSession.startTime.toDate(), Intl.DateTimeFormat().resolvedOptions().timeZone, "d MMMM HH:mm", { locale: tr })}
                                            </span>
                                        )}
                                    </div>
                                </button>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {!selectedPackageId ? (
                        <Card className="border-none shadow-md bg-white p-12 text-center text-slate-500">
                            <Users className="w-16 h-16 mx-auto mb-4 opacity-20 text-purple-600" />
                            <p className="text-lg font-medium">Detayları görmek için sol taraftan bir sınıf seçin.</p>
                        </Card>
                    ) : (
                        <>
                            {/* Yoklama / Öğrenci Listesi */}
                            <Card className="border-none shadow-md">
                                <CardHeader className="bg-slate-50 border-b pb-4">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Users className="text-primary w-5 h-5" /> Sınıf Listesi ({enrollments?.length || 0})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {enrollmentsLoading ? <Loader2 className="animate-spin w-6 h-6 text-primary mx-auto" /> : (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {enrollments?.length === 0 && <p className="text-sm text-slate-500 col-span-2">Bu sınıfa henüz kayıtlı öğrenci yok.</p>}
                                            {enrollments?.map((enr: any) => {
                                                const childInfo = studentData[enr.studentId];
                                                return (
                                                    <div key={enr.id} className="flex items-center gap-3 p-3 border rounded-xl bg-white shadow-sm">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {childInfo?.firstName?.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{childInfo?.firstName || 'Yükleniyor...'}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kayıt: {formatInTimeZone(enr.enrolledAt?.toDate() || new Date(), 'Europe/Istanbul', 'dd MMM', { locale: tr })}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Duyuru / Materyal Panosu */}
                            <Card className="border-none shadow-md overflow-hidden">
                                <CardHeader className="bg-purple-600 text-white pb-6">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Megaphone className="w-5 h-5" /> Duyurular ve Materyaller
                                    </CardTitle>
                                    <CardDescription className="text-purple-100">
                                        Bu gruba özel duyuru, ders notu veya materyal bağlantısı paylaşın. Veliler kendi portallarından görebilecek.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 bg-slate-50">
                                    {/* Geçmiş Duyurular */}
                                    <div className="space-y-4">
                                        <h3 className="font-black text-slate-800 tracking-tight text-lg mb-4">Geçmiş Duyurular</h3>
                                        {announcementsLoading ? <Loader2 className="animate-spin w-6 h-6 text-primary mx-auto" /> : (
                                            <>
                                                {(!announcements || announcements.length === 0) && (
                                                    <p className="text-sm text-slate-500 italic text-center p-4">Henüz duyuru paylaşılmadı.</p>
                                                )}
                                                {announcements?.map((ann: any) => (
                                                    <div key={ann.id} className="bg-white border-l-4 border-l-purple-500 rounded-r-xl p-5 shadow-sm">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-purple-900 text-lg">{ann.title}</h4>
                                                            <span className="text-xs font-bold text-slate-400">
                                                                {formatInTimeZone(ann.createdAt?.toDate() || new Date(), 'Europe/Istanbul', 'dd MMM HH:mm', { locale: tr })}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{ann.content}</p>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TeacherGroupClassesPage() {
    return (
        <Suspense fallback={<div className="flex min-h-[calc(100vh-145px)] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
            <TeacherGroupClassesContent />
        </Suspense>
    );
}
