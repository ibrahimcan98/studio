
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user && user.email && allowedTeacherEmails.includes(user.email)) {
      router.push('/ogretmen-portali');
    }
  }, [user, loading, router]);
  
  const ensureTeacherProfile = async (user: User) => {
      if (!db || !user.email) return;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      const isSpecialTeacher = user.email === 'ibrahimcan@turkcocukakademisii.com';

      if (!userDoc.exists()) {
          // Create a new teacher profile if it doesn't exist
          await setDoc(userDocRef, {
              id: user.uid,
              email: user.email,
              firstName: isSpecialTeacher ? 'İbrahim' : user.displayName?.split(' ')[0] || user.email.split('@')[0],
              lastName: isSpecialTeacher ? 'Can' : user.displayName?.split(' ').slice(1).join(' ') || '',
              role: 'teacher',
              createdAt: serverTimestamp(),
          });
      } else {
          // If user exists but isn't a teacher or needs name update, update them
          const currentData = userDoc.data();
          if(currentData?.role !== 'teacher' || (isSpecialTeacher && (currentData?.firstName !== 'İbrahim' || currentData?.lastName !== 'Can'))) {
            await setDoc(userDocRef, { 
                role: 'teacher',
                firstName: isSpecialTeacher ? 'İbrahim' : currentData?.firstName,
                lastName: isSpecialTeacher ? 'Can' : currentData?.lastName,
            }, { merge: true });
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
        description: 'Bu e-posta adresi ile öğretmen portalına giriş yapma yetkiniz yok.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await ensureTeacherProfile(userCredential.user);
      toast({
        title: 'Başarılı!',
        description: 'Öğretmen portalına yönlendiriliyorsunuz...',
      });
      router.push('/ogretmen-portali');
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

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    
    setIsSubmitting(true);
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (user.email && allowedTeacherEmails.includes(user.email)) {
             await ensureTeacherProfile(user);
              toast({
                title: 'Başarılı!',
                description: 'Öğretmen portalına yönlendiriliyorsunuz...',
            });
            router.push('/ogretmen-portali');
        } else {
            // Sign out the user if their email is not allowed
            await auth.signOut();
            toast({
                variant: 'destructive',
                title: 'Giriş Reddedildi',
                description: 'Bu Google hesabı ile öğretmen portalına giriş yapma yetkiniz yok.',
            });
        }
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Hata',
            description: 'Google ile giriş yaparken bir sorun oluştu.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
    if (loading) {
     return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (user && user.email && allowedTeacherEmails.includes(user.email)) {
    return null;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white p-4 overflow-hidden">
        <div className="container relative z-10 w-full max-w-6xl flex items-center justify-center">
             <div className="w-full flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 w-full max-w-4xl">
                  <div className="flex justify-center md:justify-end">
                    <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-lg border-white/50">
                        <CardHeader className="text-center space-y-4">
                            <CardTitle className="text-3xl font-bold">Öğretmen Girişi</CardTitle>
                            <CardDescription>
                            Portala erişmek için lütfen giriş yapın.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Button onClick={handleGoogleSignIn} variant="outline" className="w-full font-semibold text-lg py-6" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308 106.9 280.7 96 248 96c-88.3 0-160 71.7-160 160s71.7 160 160 160c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>}
                                    Google ile Giriş Yap
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Veya e-posta ile devam et</span>
                                    </div>
                                </div>

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
