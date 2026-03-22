
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, User, Sprout, Video, Link as LinkIcon, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  firstName: z.string().min(1, 'İsim alanı boş bırakılamaz.'),
  bio: z.string().optional(),
  hobbies: z.string().optional(),
  introVideoUrl: z.string().url('Geçerli bir URL giriniz.').optional().or(z.literal('')),
  googleMeetLink: z.string().url('Geçerli bir Google Meet URL\'si giriniz.').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function TeacherProfilePage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  const isProfileLocked = userData?.isProfileComplete === true;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      bio: '',
      hobbies: '',
      introVideoUrl: '',
      googleMeetLink: '',
    }
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || '',
        bio: userData.bio || '',
        hobbies: (userData.hobbies || []).join(', '),
        introVideoUrl: userData.introVideoUrl || '',
        googleMeetLink: userData.googleMeetLink || '',
      });
    }
  }, [userData, form]);


  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !userDocRef || isProfileLocked) return;

    const displayName = data.firstName.trim();
    if(user.displayName !== displayName) {
      await updateProfile(user, { displayName });
    }

    const hobbiesArray = data.hobbies ? data.hobbies.split(',').map(h => h.trim()).filter(Boolean) : [];

    try {
      await updateDoc(userDocRef, {
        firstName: data.firstName,
        bio: data.bio,
        hobbies: hobbiesArray,
        introVideoUrl: data.introVideoUrl,
        googleMeetLink: data.googleMeetLink,
        isProfileComplete: true, // Lock the profile after the first save
      });

      toast({ title: 'Başarılı!', description: 'Profiliniz başarıyla güncellendi ve kilitlendi.' });
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

  const introVideoUrl = form.watch('introVideoUrl');

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profilimi Düzenle</h2>
        <p className="text-muted-foreground">Profil bilgilerinizi ve velilerin göreceği detayları yönetin.</p>
      </div>

       {isProfileLocked && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertTitle>Profil Kilitli</AlertTitle>
          <AlertDescription>
            Profil bilgileriniz bir kez kaydedildikten sonra değiştirilemez. Değişiklik yapmak için lütfen yönetici ile iletişime geçin.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User/> Kişisel Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="firstName">İsim</Label>
                        <Input id="firstName" {...form.register('firstName')} disabled={isProfileLocked} />
                        {form.formState.errors.firstName && <p className="text-destructive text-sm mt-1">{form.formState.errors.firstName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="bio">Hakkımda (Özgeçmiş)</Label>
                        <Textarea id="bio" rows={6} {...form.register('bio')} placeholder="Kısaca kendinizi, deneyimlerinizi ve öğretme felsefenizi anlatın..." disabled={isProfileLocked} />
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
                        <Input id="hobbies" {...form.register('hobbies')} placeholder="Kitap okumak, seyahat etmek, yüzmek..." disabled={isProfileLocked} />
                        <p className="text-xs text-muted-foreground mt-1">Hobilerinizi virgülle ayırarak yazın.</p>
                    </div>
                    <div className="pt-2">
                        <Label className="text-base font-bold text-slate-800">Kurs Başına Kazanç (€, Ders Başı)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                           <div className="space-y-1"><Label className="text-xs text-slate-500 font-medium">Başlangıç</Label><Input value={userData?.lessonRates?.baslangic !== undefined ? `${userData.lessonRates.baslangic} €` : '-'} disabled className="bg-slate-50 font-bold" /></div>
                           <div className="space-y-1"><Label className="text-xs text-slate-500 font-medium">Konuşma</Label><Input value={userData?.lessonRates?.konusma !== undefined ? `${userData.lessonRates.konusma} €` : '-'} disabled className="bg-slate-50 font-bold" /></div>
                           <div className="space-y-1"><Label className="text-xs text-slate-500 font-medium">Akademik</Label><Input value={userData?.lessonRates?.akademik !== undefined ? `${userData.lessonRates.akademik} €` : '-'} disabled className="bg-slate-50 font-bold" /></div>
                           <div className="space-y-1"><Label className="text-xs text-slate-500 font-medium">Gelişim</Label><Input value={userData?.lessonRates?.gelisim !== undefined ? `${userData.lessonRates.gelisim} €` : '-'} disabled className="bg-slate-50 font-bold" /></div>
                           <div className="space-y-1"><Label className="text-xs text-slate-500 font-medium">GCSE</Label><Input value={userData?.lessonRates?.gcse !== undefined ? `${userData.lessonRates.gcse} €` : '-'} disabled className="bg-slate-50 font-bold" /></div>
                           <div className="space-y-1"><Label className="text-xs text-blue-600 font-medium">Deneme Dersi</Label><Input value={userData?.lessonRates?.FREE_TRIAL !== undefined ? `${userData.lessonRates.FREE_TRIAL} €` : '-'} disabled className="bg-blue-50/50 text-blue-800 font-bold border-blue-100" /></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Bu ücretler yönetici tarafından güncellenir, değiştirilemez.</p>
                    </div>
                     <div>
                        <Label htmlFor="googleMeetLink">Google Meet Linki</Label>
                        <Input id="googleMeetLink" {...form.register('googleMeetLink')} placeholder="https://meet.google.com/xxx-xxxx-xxx" disabled={isProfileLocked} />
                        {form.formState.errors.googleMeetLink && <p className="text-destructive text-sm mt-1">{form.formState.errors.googleMeetLink.message}</p>}
                        <p className="text-xs text-muted-foreground mt-1">Bu link tüm dersleriniz için kullanılacaktır.</p>
                    </div>
                    <div>
                        <Label htmlFor="introVideoUrl">Tanıtım Videosu URL'si</Label>
                        <Input id="introVideoUrl" {...form.register('introVideoUrl')} placeholder="https://youtube.com/watch?v=..." disabled={isProfileLocked} />
                        {form.formState.errors.introVideoUrl && <p className="text-destructive text-sm mt-1">{form.formState.errors.introVideoUrl.message}</p>}
                    </div>
                     {introVideoUrl && (
                        <div>
                            <h4 className="font-semibold mb-2 text-sm">Video Önizlemesi</h4>
                             <Button asChild variant="outline" disabled={isProfileLocked}>
                                <Link href={introVideoUrl} target="_blank" rel="noopener noreferrer">
                                    <Video className="w-4 h-4 mr-2" />
                                    Videoyu Yeni Sekmede Aç
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting || isProfileLocked}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2"/>}
            {isProfileLocked ? 'Profil Kaydedildi' : 'Değişiklikleri Kaydet'}
          </Button>
        </div>
      </form>
    </div>
  );
}
