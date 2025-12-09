'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, collection, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, User, Image as ImageIcon, Video, BookOpen, Users, Heart, Save, Upload, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

function StatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
    return (
        <Card className="text-center">
            <CardHeader className="pb-2">
                <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold">{value}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{title}</p>
            </CardContent>
        </Card>
    )
}

export default function OgretmenProfilimPage() {
    const { user: authUser, loading: authLoading } = useUser();
    const db = useFirestore();
    const storage = getStorage();
    const { toast } = useToast();

    const userDocRef = useMemoFirebase(() => {
        if (!authUser) return null;
        return doc(db, 'users', authUser.uid);
    }, [authUser, db]);

    const { data: userData, isLoading: userDataLoading, refetch: refetchUserData } = useDoc(userDocRef);

    const lessonsQuery = useMemoFirebase(() => {
        if (!authUser) return null;
        return query(collection(db, 'lesson-slots'), where('teacherId', '==', authUser.uid), where('status', '==', 'booked'));
    }, [authUser, db]);
    const { data: lessons, isLoading: lessonsLoading } = useCollection(lessonsQuery);
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Editable fields state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [introVideoFile, setIntroVideoFile] = useState<File | null>(null);

    const profileImageInputRef = useRef<HTMLInputElement>(null);
    const introVideoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (userData) {
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setBio(userData.bio || '');
            setHobbies(Array.isArray(userData.hobbies) ? userData.hobbies.join(', ') : '');
        }
    }, [userData]);
    
    const uniqueStudents = useMemo(() => {
        if (!lessons) return 0;
        const studentIds = new Set(lessons.map(l => l.childId));
        return studentIds.size;
    }, [lessons]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImageFile(e.target.files[0]);
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIntroVideoFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (!userDocRef || !authUser) return;
        setIsSaving(true);
    
        try {
            const dataToUpdate: any = {
                firstName,
                lastName,
                bio,
                hobbies: hobbies.split(',').map(h => h.trim()).filter(Boolean),
            };

            if (profileImageFile) {
                const imageRef = ref(storage, `teacher-profiles/${authUser.uid}/profile.jpg`);
                await uploadBytes(imageRef, profileImageFile);
                dataToUpdate.profileImageUrl = await getDownloadURL(imageRef);
            }

            if (introVideoFile) {
                const videoRef = ref(storage, `teacher-profiles/${authUser.uid}/intro.mp4`);
                await uploadBytes(videoRef, introVideoFile);
                dataToUpdate.introVideoUrl = await getDownloadURL(videoRef);
            }

            await updateDoc(userDocRef, dataToUpdate);
            
            toast({
                title: 'Başarılı!',
                description: 'Profil bilgileriniz güncellendi.',
            });
            setIsEditing(false);
            setProfileImageFile(null);
            setIntroVideoFile(null);
            refetchUserData();

        } catch (error) {
            console.error("Profile update error: ", error);
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Profil güncellenirken bir hata oluştu.',
            });
        } finally {
            setIsSaving(false);
        }
    };


    if (authLoading || userDataLoading || lessonsLoading) {
        return (
            <div className="flex h-[calc(100vh-145px)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profilim</h2>
                    <p className="text-muted-foreground">Kişisel bilgilerinizi, istatistiklerinizi ve medyanızı yönetin.</p>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing && (
                         <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Kaydet
                        </Button>
                    )}
                     <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        {isEditing ? "Vazgeç" : "Profili Düzenle"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="lg:col-span-1 flex flex-col items-center p-6 text-center shadow-lg">
                    <div className='relative'>
                         <Avatar className="w-32 h-32 text-4xl mb-4 border-4 border-primary/20">
                            <AvatarImage src={profileImageFile ? URL.createObjectURL(profileImageFile) : userData?.profileImageUrl} alt={userData?.firstName} />
                            <AvatarFallback className="bg-muted">{userData?.firstName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {isEditing && (
                            <>
                                <input type="file" ref={profileImageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
                                <Button size="icon" variant="outline" className="absolute bottom-4 right-0 rounded-full" onClick={() => profileImageInputRef.current?.click()}>
                                    <Upload className="w-4 h-4"/>
                                </Button>
                            </>
                        )}
                    </div>
                    {isEditing ? (
                         <div className='w-full space-y-2'>
                            <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="İsim" className='text-center text-xl font-bold'/>
                            <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Soyisim" className='text-center text-xl font-bold'/>
                        </div>
                    ): (
                        <h2 className="text-2xl font-bold">{userData?.firstName} {userData?.lastName}</h2>
                    )}
                    
                    <Badge variant="secondary" className="mt-2">Öğretmen</Badge>

                    <Separator className="my-6" />

                     {isEditing ? (
                        <div className="w-full space-y-4">
                            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Kendinizi tanıtan kısa bir yazı..." className="min-h-[100px] text-sm"/>
                            <Input value={hobbies} onChange={e => setHobbies(e.target.value)} placeholder="Hobiler (virgülle ayırın)"/>
                        </div>
                    ) : (
                        <>
                            <p className="text-muted-foreground text-sm">{userData?.bio || "Henüz bir bio eklenmemiş."}</p>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {(userData?.hobbies || []).map((hobby: string) => <Badge key={hobby} variant="outline">{hobby}</Badge>)}
                            </div>
                        </>
                    )}
                </Card>

                {/* Stats and Media */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                       <StatCard title="Verilen Ders" value={lessons?.length || 0} icon={BookOpen} />
                       <StatCard title="Toplam Öğrenci" value={uniqueStudents} icon={Users} />
                       <StatCard title="Favori Konu" value="Hayvanlar" icon={Heart} />
                    </div>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Tanıtım Videom</CardTitle>
                            <CardDescription>Kendinizi ve öğretim tarzınızı tanıtan kısa bir video yükleyin.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {userData?.introVideoUrl || introVideoFile ? (
                                 <video 
                                    key={introVideoFile ? URL.createObjectURL(introVideoFile) : userData?.introVideoUrl} 
                                    controls 
                                    className="w-full rounded-lg aspect-video"
                                >
                                    <source src={introVideoFile ? URL.createObjectURL(introVideoFile) : userData?.introVideoUrl} type="video/mp4" />
                                    Tarayıcınız video etiketini desteklemiyor.
                                </video>
                            ): (
                                <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                                    <p className="text-muted-foreground">Henüz video yüklenmedi.</p>
                                </div>
                            )}
                             {isEditing && (
                                <div className="mt-4">
                                     <input type="file" ref={introVideoInputRef} onChange={handleVideoUpload} accept="video/mp4" className="hidden"/>
                                    <Button variant="outline" onClick={() => introVideoInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4"/>
                                        {userData?.introVideoUrl ? "Videoyu Değiştir" : "Video Yükle"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
