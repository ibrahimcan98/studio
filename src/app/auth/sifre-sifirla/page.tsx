'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SifreSifirlaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!oobCode || mode !== 'resetPassword') {
      setError('Geçersiz veya eksik şifre sıfırlama kodu.');
      setVerifying(false);
      setLoading(false);
      return;
    }

    // Verify the reset code and get the user's email
    verifyPasswordResetCode(auth, oobCode)
      .then((userEmail) => {
        setEmail(userEmail);
        setVerifying(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Password reset code error:', err);
        setError('Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.');
        setVerifying(false);
        setLoading(false);
      });
  }, [oobCode, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Hata',
        description: 'Şifreler birbiriyle eşleşmiyor.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Hata',
        description: 'Şifre en az 6 karakter olmalıdır.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (oobCode) {
        await confirmPasswordReset(auth, oobCode, newPassword);
        setSuccess(true);
        toast({
          title: 'Başarılı',
          description: 'Şifreniz başarıyla güncellendi.',
        });
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast({
        title: 'Hata',
        description: 'Şifre güncellenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-medium">Bağlantı doğrulanıyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-md border-red-100 shadow-xl shadow-red-500/5">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Başarısız</CardTitle>
            <CardDescription className="text-red-600 font-medium pt-2">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login')} className="w-full h-12 rounded-xl" variant="outline">
              Giriş Sayfasına Dön
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="w-full max-w-md border-green-100 shadow-2xl shadow-green-500/10 overflow-hidden">
          <div className="h-2 bg-green-500 w-full" />
          <CardHeader className="text-center pt-8">
            <div className="mx-auto bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-slate-900">Şifre Güncellendi!</CardTitle>
            <CardDescription className="text-slate-600 text-lg pt-2 italic">
              Yeni şifrenizle giriş yapmaya hazırsınız.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-10 pt-4 px-8">
            <Button 
                onClick={() => router.push('/login')} 
                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/20 text-lg"
            >
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden rounded-[32px] bg-white">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="pt-10 px-8">
          <div className="flex justify-center mb-6">
             <div className="p-4 bg-primary/5 rounded-3xl">
                <Lock className="h-8 w-8 text-primary" />
             </div>
          </div>
          <CardTitle className="text-3xl font-extrabold text-center text-slate-900 letter tracking-tight">
            Şifreni Yenile
          </CardTitle>
          <CardDescription className="text-center text-slate-500 text-base font-medium mt-2">
            <span className="text-primary font-semibold">{email}</span> hesabı için yeni bir şifre oluşturun.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold ml-1">Yeni Şifre</Label>
              <div className="relative group">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 karakter"
                  className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-primary transition-all pr-12 text-base font-medium"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={submitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-bold ml-1">Şifre Tekrarı</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Şifreyi onaylayın"
                className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-primary transition-all text-base font-medium"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !newPassword || !confirmPassword}
              className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Şifre Güncelleniyor
                </>
              ) : (
                'Şifreyi Güncelle'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SifreSifirlaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4 font-sans">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-300/20 rounded-full blur-[120px]" />
      </div>

      <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
        <SifreSifirlaContent />
      </Suspense>
    </div>
  );
}
