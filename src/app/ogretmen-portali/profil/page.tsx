
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, User, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
  firstName: z.string().min(1, 'İsim alanı boş bırakılamaz.'),
  bio: z.string().optional(),
  hobbies: z.string().optional(),
  introVideoUrl: z.string().url('Geçerli bir URL giriniz.').optional().or(z.literal('')),
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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      bio: '',
      hobbies: '',
      introVideoUrl: '',
    }
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || '',
        bio: userData.bio || '',
        hobbies: (userData.hobbies || []).join(', '),
        introVideoUrl: userData.introVideoUrl || '',
      });
    }
  }, [userData, form]);


  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !userDocRef) return;

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User/> Kişisel Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="firstName">İsim</Label>
                        <Input id="firstName" {...form.register('firstName')} />
                        {form.formState.errors.firstName && <p className="text-destructive text-sm mt-1">{form.formState.errors.firstName.message}</p>}
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

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2"/>}
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
