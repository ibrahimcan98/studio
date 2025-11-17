'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
import { Logo } from '@/components/logo';
import { LoginIllustration } from '@/components/illustrations/login-illustration';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Başarılı!',
        description: 'Giriş yaptınız. Yönlendiriliyorsunuz...',
      });
      router.push('/');
    } catch (error: any) {
      let errorMessage = 'Giriş yaparken bir hata oluştu. Lütfen tekrar deneyin.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz bir e-posta adresi girdiniz.';
      }

      toast({
        variant: 'destructive',
        title: 'Hata',
        description: errorMessage,
      });
      console.error('Firebase Auth Error:', error.code, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-50 via-amber-50 to-white p-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <div className="container relative z-10 grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div className="flex justify-center md:justify-end">
          <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-lg border-white/50">
            <CardHeader className="text-center space-y-4">
              <Logo className="justify-center" />
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-bold text-lg py-6 bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white shadow-lg"
                  disabled={loading}
                >
                  {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                Hesabın yok mu?{' '}
                <Link
                  href="#"
                  className="font-medium text-primary hover:underline"
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
  );
}
