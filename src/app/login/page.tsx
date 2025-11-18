'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc } from 'firebase/firestore';

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
import { SignUpIllustration } from '@/components/illustrations/signup-illustration';
import { useAuth, useFirestore, setDocumentNonBlocking, initiateEmailSignIn } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

function LoginForm({
  onSignUpClick,
  loading,
}: {
  onSignUpClick: () => void;
  loading: boolean;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth) return;

    setIsSubmitting(true);
    initiateEmailSignIn(auth, email, password)
      .then(() => {
        toast({
          title: 'Başarılı!',
          description: 'Giriş yaptınız. Yönlendiriliyorsunuz...',
        });
        router.push('/');
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: 'E-posta veya şifre hatalı.',
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
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
            className="w-full font-bold text-lg py-6 bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white shadow-lg"
            disabled={loading || isSubmitting}
          >
            {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          Hesabın yok mu?{' '}
          <button
            onClick={onSignUpClick}
            className="font-medium text-primary hover:underline focus:outline-none"
          >
            Kayıt Ol
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function SignUpForm({
  onLoginClick,
  loading,
}: {
  onLoginClick: () => void;
  loading: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth || !db) return;

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const userDocRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userDocRef, {
        id: user.uid,
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        email: user.email,
        userType: 'parent',
      }, { merge: true });

      toast({
        title: 'Harika!',
        description: 'Hesabınız oluşturuldu. Yönlendiriliyorsunuz...',
      });
      router.push('/');
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


  return (
    <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-lg border-white/50">
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-3xl font-bold">Hesap Oluştur</CardTitle>
        <CardDescription>
          Aramıza katıl ve Türkçe öğrenmeye başla!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-6">
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
            className="w-full font-bold text-lg py-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
            disabled={loading || isSubmitting}
          >
            {isSubmitting ? 'Kayıt Olunuyor...' : 'Ücretsiz Kayıt Ol'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          Zaten bir hesabın var mı?{' '}
          <button
            onClick={onLoginClick}
            className="font-medium text-primary hover:underline"
          >
            Giriş Yap
          </button>
        </div>
      </CardContent>
    </Card>
  );
}


export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-gradient-to-br from-cyan-50 via-amber-50 to-white p-4 overflow-hidden">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      <div className="container relative z-10 w-full max-w-6xl">
        <div className={`transition-transform duration-700 ease-in-out ${isSignUp ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 absolute w-full">
            <div className="flex justify-center md:justify-end">
              <LoginForm loading={false} onSignUpClick={() => setIsSignUp(true)} />
            </div>
            <div className="hidden md:block">
              <LoginIllustration />
            </div>
          </div>
        </div>

        <div className={`transition-transform duration-700 ease-in-out absolute inset-0 ${isSignUp ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 w-full">
              <div className="hidden md:block">
                <SignUpIllustration />
              </div>
              <div className="flex justify-center md:justify-start">
                <SignUpForm loading={false} onLoginClick={() => setIsSignUp(false)} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
