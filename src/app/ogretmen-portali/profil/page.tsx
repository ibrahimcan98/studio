
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, User, Image as ImageIcon, Film, Sprout, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
  firstName: z.string().min(1, 'İsim alanı boş bırakılamaz.'),
  lastName: z.string().min(1, 'Soyisim alanı boş bırakılamaz.'),
  bio: z.string().optional(),
  hobbies: z.string().optional(),
  introVideoUrl: z.string().url('Geçerli bir URL giriniz.').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function TeacherProfilePage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      hobbies: '',
      introVideoUrl: '',
    }
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        bio: userData.bio || '',
        hobbies: (userData.hobbies || []).join(', '),
        introVideoUrl: userData.introVideoUrl || '',
      });
      if(userData.profileImageUrl) {
        setPreviewUrl(userData.profileImageUrl);
      }
    }
  }, [userData, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImage || !user) return null;

    setIsUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `teacher-profiles/${user.uid}/${profileImage.name}`);
      const snapshot = await uploadBytes(storageRef, profileImage);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({ variant: 'destructive', title: 'Hata', description: 'Profil fotoğrafı yüklenemedi.' });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !userDocRef) return;

    let newProfileImageUrl: string | null = null;
    if (profileImage) {
      newProfileImageUrl = await uploadProfileImage();
    }
    
    const displayName = `${data.firstName} ${data.lastName}`.trim();
    if(user.displayName !== displayName) {
      await updateProfile(user, { displayName });
    }

    const hobbiesArray = data.hobbies ? data.hobbies.split(',').map(h => h.trim()).filter(Boolean) : [];

    try {
      await updateDoc(userDocRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        hobbies: hobbiesArray,
        introVideoUrl: data.introVideoUrl,
        ...(newProfileImageUrl && { profileImageUrl: newProfileImageUrl }),
      });

      toast({ title: 'Başarılı!', description: 'Profiliniz başarıyla güncellendi.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Hata', description: 'Profil güncellenirken bir hata oluştu.' });
    }
  };

  if (authLoading || userDataLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profilimi Düzenle</h2>
        <p className="text-muted-foreground">Profil bilgilerinizi ve velilerin göreceği detayları yönetin.</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ImageIcon /> Profil Fotoğrafı</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Avatar className="h-40 w-40">
                        <AvatarImage src={previewUrl || userData?.profileImageUrl} />
                        <AvatarFallback className="text-5xl">{userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="animate-spin mr-2"/> : <Pen className="mr-2 h-4 w-4"/>}
                        Fotoğrafı Değiştir
                    </Button>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 flex flex-col gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User/> Kişisel Bilgiler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">İsim</Label>
                                <Input id="firstName" {...form.register('firstName')} />
                                {form.formState.errors.firstName && <p className="text-destructive text-sm mt-1">{form.formState.errors.firstName.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="lastName">Soyisim</Label>
                                <Input id="lastName" {...form.register('lastName')} />
                                {form.formState.errors.lastName && <p className="text-destructive text-sm mt-1">{form.formState.errors.lastName.message}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="bio">Hakkımda (Özgeçmiş)</Label>
                            <Textarea id="bio" rows={6} {...form.register('bio')} placeholder="Kısaca kendinizi, deneyimlerinizi ve öğretme felsefenizi anlatın..." />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sprout /> Ek Bilgiler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="hobbies">Hobiler</Label>
                            <Input id="hobbies" {...form.register('hobbies')} placeholder="Kitap okumak, seyahat etmek, yüzmek..." />
                            <p className="text-xs text-muted-foreground mt-1">Hobilerinizi virgülle ayırarak yazın.</p>
                        </div>
                        <div>
                            <Label htmlFor="introVideoUrl">Tanıtım Videosu URL'si</Label>
                            <Input id="introVideoUrl" {...form.register('introVideoUrl')} placeholder="https://youtube.com/watch?v=..." />
                            {form.formState.errors.introVideoUrl && <p className="text-destructive text-sm mt-1">{form.formState.errors.introVideoUrl.message}</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
            {(form.formState.isSubmitting || isUploading) && <Loader2 className="animate-spin mr-2"/>}
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}

    