'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { useAuth, useUser, useFirestore } from '@/firebase';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { TeacherIllustration } from '@/components/illustrations/teacher-illustration';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const allowedTeacherEmails = ['ibrahimcan@turkcocukakademisii.com'];

export default function OgretmenGirisPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading) {
      if (user && user.email && allowedTeacherEmails.includes(user.email)) {
        router.replace('/ogretmen-portali');
      } else {
        setIsPageLoading(false);
      }
    }
  }, [user, userLoading, router]);

  const ensureTeacherProfile = async (user: User) => {
    if (!db || !user.email) return;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    const isSpecialTeacher = user.email === 'ibrahimcan@turkcocukakademisii.com';

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        firstName: isSpecialTeacher ? 'İbrahim' : '',
        lastName: isSpecialTeacher ? 'Can' : '',
        role: 'teacher',
        createdAt: serverTimestamp(),
      });
    } else {
      const currentData = userDoc.data();
      if (
        currentData?.role !== 'teacher' ||
        (isSpecialTeacher &&
          (currentData?.firstName !== 'İbrahim' || currentData?.lastName !== 'Can'))
      ) {
        await setDoc(
          userDocRef,
          {
            role: 'teacher',
            firstName: isSpecialTeacher ? 'İbrahim' : currentData?.firstName,
            lastName: isSpecialTeacher ? 'Can' : currentData?.lastName,
          },
          { merge: true }
        );
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth) return;

    if (!allowedTeacherEmails.includes(email)) {
      toast({
        variant: 'destructive',
        title: 'Giriş Reddedildi',
        description:
          'Bu e-posta adresi ile öğretmen portalına giriş yapma yetkiniz yok.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await ensureTeacherProfile(userCredential.user);
      toast({
        title: 'Başarılı!',
        description: 'Öğretmen portalına yönlendiriliyorsunuz...',
      });
      // The useEffect will handle the redirection
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'E-posta veya şifre hatalı.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white p-4 overflow-hidden">
      <div className="container relative z-10 w-full max-w-6xl flex items-center justify-center">
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 w-full max-w-4xl">
            <div className="flex justify-center md:justify-end">
              <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-lg border-white/50">
                <CardHeader className="text-center space-y-4">
                  <CardTitle className="text-3xl font-bold">
                    Öğretmen Girişi
                  </CardTitle>
                  <CardDescription>
                    Portala erişmek için lütfen giriş yapın.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full font-bold text-lg py-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="hidden md:block">
              <TeacherIllustration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
