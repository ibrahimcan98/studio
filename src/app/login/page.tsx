
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
import { LoginIllustration } from '@/components/illustrations/login-illustration';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const allowedTeacherEmails = ['ibrahimcan@turkcocukakademisii.com', 'teacher@turkcocukakademisi.com', 'tubakodak@turkcocukakademisii.com'];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();

   useEffect(() => {
    if (!loading && user && db) {
        const checkUserRoleAndRedirect = async () => {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'teacher') {
                    router.push('/ogretmen-portali');
                } else if (userData.role === 'admin') {
                    router.push('/yonetici');
                }
                else {
                    router.push('/ebeveyn-portali');
                }
            } else {
                // Default to parent portal if no doc found
                router.push('/ebeveyn-portali');
            }
        };
        checkUserRoleAndRedirect();
    }
  }, [user, loading, router, db]);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth || !db) return;

    if (allowedTeacherEmails.includes(email)) {
        toast({
            variant: 'destructive',
            title: 'Giriş Reddedildi',
            description: 'Öğretmen girişi için lütfen öğretmen portalını kullanın.',
        });
        return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check user role from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let targetPath = '/ebeveyn-portali';
      if (userDoc.exists()) {
          const userData = userDoc.data();
           if (userData.role === 'teacher') {
                await auth.signOut(); // Sign out the teacher immediately
                toast({
                    variant: 'destructive',
                    title: 'Giriş Reddedildi',
                    description: 'Öğretmen girişi için lütfen öğretmen portalını kullanın.',
                });
                setIsSubmitting(false);
                return;
           } else if (userData.role === 'admin') {
                targetPath = '/yonetici';
           }
      }

      toast({
        title: 'Başarılı!',
        description: 'Giriş yaptınız. Yönlendiriliyorsunuz...',
      });
      router.push(targetPath);
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

  if (loading || user) {
     return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-50 via-amber-50 to-white p-4 overflow-hidden">
      <div className="container relative z-10 w-full max-w-6xl flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 w-full max-w-4xl">
              <div className="flex justify-center md:justify-end">
                <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-lg border-white/50">
                  <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-3xl font-bold">Giriş Yap</CardTitle>
                    <CardDescription>
                      Hesabınıza giriş yaparak öğrenmeye devam edin.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
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
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          placeholder="••••••••"
                          autoComplete="current-password"
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
                        {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                      </Button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                      Hesabın yok mu?{' '}
                      <Link
                        href="/register"
                        className="font-medium text-primary hover:underline focus:outline-none"
                      >
                        Kayıt Ol
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="hidden md:block">
                <LoginIllustration />
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
