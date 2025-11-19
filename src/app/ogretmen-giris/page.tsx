
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { TeacherIllustration } from '@/components/illustrations/teacher-illustration';

export default function OgretmenGirisPage() {
  const [email, setEmail] = useState('ibrahimcan@turkcocukakademisi.com');
  const [password, setPassword] = useState('ibocan_9898');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user && user.email?.endsWith('@turkcocukakademisi.com')) {
      router.push('/ogretmen-portali');
    }
  }, [user, loading, router]);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth) return;

    if (!email.endsWith('@turkcocukakademisi.com')) {
      toast({
        variant: 'destructive',
        title: 'Geçersiz E-posta',
        description: 'Sadece @turkcocukakademisi.com uzantılı e-posta adresleri ile giriş yapılabilir.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
  
    if (loading) {
     return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (user && user.email?.endsWith('@turkcocukakademisi.com')) {
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
                            <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                id="email"
                                type="email"
                                placeholder="ornek@turkcocukakademisi.com"
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
                                placeholder="••••••••"
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
