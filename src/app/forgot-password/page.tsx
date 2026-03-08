'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !email) return;

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast({
        title: 'E-posta Gönderildi',
        description: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
      });
    } catch (error: any) {
      let errorMessage = 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Lütfen geçerli bir e-posta adresi girin.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-50 via-amber-50 to-white p-4 overflow-hidden font-sans">
      <div className="container relative z-10 w-full max-w-md">
        <Card className="w-full shadow-2xl bg-white/80 backdrop-blur-lg border-white/50">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold">Şifremi Unuttum</CardTitle>
            <CardDescription>
              Hesabınıza ait e-posta adresini girin, size bir şifre sıfırlama bağlantısı gönderelim.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSent ? (
              <div className="text-center py-6 space-y-4">
                <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-gray-800">Bağlantı Gönderildi!</p>
                  <p className="text-sm text-muted-foreground px-4">
                    <strong>{email}</strong> adresine bir e-posta gönderdik. Lütfen gelen kutunuzu ve spam klasörünü kontrol edin.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresiniz</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      required
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full font-bold text-lg py-6" disabled={isLoading || !email}>
                  {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
                  {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t pt-6 bg-slate-50/50 rounded-b-lg">
            <Button variant="ghost" asChild className="w-full text-primary hover:bg-primary/5">
              <Link href="/login" className="flex items-center justify-center gap-2 font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Giriş Sayfasına Dön
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
