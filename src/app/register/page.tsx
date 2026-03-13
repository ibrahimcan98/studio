'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignUpIllustration } from '@/components/illustrations/signup-illustration';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const adminEmail = 'admin@hotmail.com';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user && !user.isAnonymous && isMounted) {
      router.push('/ebeveyn-portali');
    }
  }, [user, loading, router, isMounted]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth || !db) return;

    setIsSubmitting(true);
    try {
      // Önce e-posta tabanlı bir taslak (öğretmen yetkisi) var mı kontrol et
      const slugId = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
      const slugRef = doc(db, 'users', slugId);
      const slugDoc = await getDoc(slugRef);
      const isPreAuthorizedTeacher = slugDoc.exists() && slugDoc.data().role === 'teacher';

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: name });
      
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/email-onay`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(newUser, actionCodeSettings);

      const userDocRef = doc(db, 'users', newUser.uid);
      
      // Admin kontrolü
      const isAdmin = email.toLowerCase() === adminEmail.toLowerCase();
      const role = isAdmin ? 'admin' : (isPreAuthorizedTeacher ? 'teacher' : 'parent');
      
      let targetPath = '/ebeveyn-portali';
      if (role === 'admin') targetPath = '/yonetici';
      else if (role === 'teacher') targetPath = '/ogretmen-portali/takvim';

      const userData: any = {
        id: newUser.uid,
        shortId: newUser.uid.substring(0, 8).toUpperCase(),
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        email: newUser.email?.toLowerCase(),
        phoneNumber: `${areaCode}${phoneNumber}`,
        role: role,
        lives: 5,
        livesLastUpdatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      // Eğer öğretmen yetkisi varsa, taslaktaki ek bilgileri (bio, video vb.) devral
      if (isPreAuthorizedTeacher) {
          const teacherDraft = slugDoc.data();
          Object.assign(userData, {
              bio: teacherDraft.bio || '',
              hobbies: teacherDraft.hobbies || [],
              googleMeetLink: teacherDraft.googleMeetLink || '',
              introVideoUrl: teacherDraft.introVideoUrl || '',
              isProfileComplete: true
          });
      }

      await setDoc(userDocRef, userData, { merge: true });

      toast({
        title: role === 'teacher' ? 'Hoş Geldiniz Öğretmenim!' : 'Kayıt Başarılı!',
        description: 'Hesabınız oluşturuldu. Portala yönlendiriliyorsunuz. Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.',
        duration: 8000,
      });

      router.push(targetPath);

    } catch (error: any) {
      let errorMessage = 'Kayıt olurken bir hata oluştu.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanımda.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Lütfen geçerli bir e-posta adresi girin.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Şifreniz en az 6 karakter olmalıdır.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
     <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-50 via-amber-50 to-white p-4 overflow-hidden">
      <div className="container relative z-10 w-full max-w-6xl flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full flex justify-center">
           <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 w-full max-w-4xl">
              <div className="hidden md:block">
                <SignUpIllustration />
              </div>
              <div className="flex justify-center md:justify-start">
                 <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-lg border-white/50">
                  <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-3xl font-bold">Hesap Oluştur</CardTitle>
                    <CardDescription>
                      Aramıza katıl ve Türkçe öğrenmeye başla!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">İsim Soyisim</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Adınız Soyadınız"
                          required
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={loading || isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-signup">Email</Label>
                        <Input
                          id="email-signup"
                          type="email"
                          placeholder="ornek@email.com"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading || isSubmitting}
                        />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="phone-signup">Telefon Numarası</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Input
                            id="area-code"
                            type="tel"
                            placeholder="Örn: +90"
                            required
                            autoComplete="tel-country-code"
                            value={areaCode}
                            onChange={(e) => setAreaCode(e.target.value)}
                            disabled={loading || isSubmitting}
                            className="col-span-1"
                            />
                            <Input
                            id="phone-signup"
                            type="tel"
                            placeholder="555 123 4567"
                            required
                            autoComplete="tel-national"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={loading || isSubmitting}
                            className="col-span-2"
                            />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-signup">Şifre</Label>
                        <Input
                          id="password-signup"
                          type="password"
                          required
                          placeholder="••••••••"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading || isSubmitting}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full font-bold text-lg py-6"
                        disabled={loading || isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : null}
                        {isSubmitting ? 'Kayıt Olunuyor...' : 'Ücretsiz Kayıt Ol'}
                      </Button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                      Zaten bir hesabın var mı?{' '}
                      <Link
                        href="/login"
                        className="font-medium text-primary hover:underline"
                      >
                        Giriş Yap
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
