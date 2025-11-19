
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

const allowedTeacherEmails = ['ibrahimcan@turkcocukakademisii.com', 'teacher@turkcocukakademisi.com'];

export default function OgretmenGirisPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user && user.email && allowedTeacherEmails.includes(user.email)) {
      router.push('/ogretmen-portali');
    }
  }, [user, loading, router]);


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

    
