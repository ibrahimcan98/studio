'use client';

import { useUser, auth as clientAuth } from '@/firebase';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db as firestoreDb } from '@/firebase';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const { user, loading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    } else if (!loading && user?.emailVerified) {
      router.replace('/ebeveyn-portali');
    }
  }, [user, loading, router]);

  // Real-time Firestore Sync (Detect verification from other tabs)
  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(doc(firestoreDb, 'users', user.uid), (doc) => {
      if (doc.exists() && doc.data()?.emailVerified === true) {
        toast({
          title: 'Doğrulandı!',
          description: 'E-posta adresiniz diğer sekmede doğrulandı. Yönlendiriliyorsunuz...',
          className: 'bg-emerald-500 text-white',
        });
        setTimeout(() => router.replace('/ebeveyn-portali'), 1500);
      }
    });

    return () => unsub();
  }, [user?.uid, router]);

  // Check for 'code' in URL and auto-fill
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl && codeFromUrl.length === 6 && /^\d+$/.test(codeFromUrl)) {
      const newOtp = codeFromUrl.split('');
      setOtp(newOtp);
      // Auto verify if code is in URL
      setTimeout(() => {
        const verifyBtn = document.getElementById('verify-button');
        verifyBtn?.click();
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If user types/pastes multiple chars in one go (not via onPaste)
      const digits = value.split('').filter(c => /^\d$/.test(c));
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + digits.length, 5);
      document.getElementById(`otp-${nextIdx}`)?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or the verify button
    const lastIdx = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastIdx}`)?.focus();
    
    // Auto verify if 6 digits pasted
    if (pastedData.length === 6) {
      // Small delay to ensure state update
      setTimeout(() => {
        const verifyBtn = document.getElementById('verify-button');
        verifyBtn?.click();
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!user?.email || !user?.uid) return;
    setIsSending(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, userId: user.uid }),
      });

      if (!response.ok) throw new Error('OTP gönderilemedi.');

      setCountdown(15);
      toast({
        title: 'Kod Gönderildi',
        description: '6 haneli doğrulama kodu e-posta adresinize gönderildi.',
        className: 'bg-green-500 text-white',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: err.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6 || !user?.uid) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, otp: fullOtp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Doğrulama başarısız.');

      // Refresh client-side auth state
      if (clientAuth.currentUser) {
        await clientAuth.currentUser.reload();
      }

      toast({
        title: 'Başarılı!',
        description: 'E-posta adresiniz doğrulandı. Portala yönlendiriliyorsunuz...',
        className: 'bg-emerald-500 text-white',
      });

      setTimeout(() => router.replace('/ebeveyn-portali'), 2000);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Doğrulama Hatası',
        description: err.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
        <CardHeader className="text-center pt-10">
          <div className="mx-auto bg-orange-100 p-4 rounded-full w-fit mb-4">
            <ShieldCheck className="h-10 w-10 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">E-posta Doğrulaması</CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            Güvenliğiniz için <strong>{user.email}</strong> adresine gönderdiğimiz 6 haneli kodu giriniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pb-10">
          <div className="flex justify-between gap-2 max-w-[300px] mx-auto" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <Input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 focus:border-orange-500 focus:ring-orange-500 rounded-xl transition-all"
                maxLength={6} // Allow pasting long strings which we handle in onChange/onPaste
              />
            ))}
          </div>

          <div className="space-y-4">
            <Button 
              id="verify-button"
              onClick={handleVerify} 
              disabled={isVerifying || otp.join('').length < 6}
              className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-lg"
            >
              {isVerifying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Kodu Doğrula'}
            </Button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-slate-500 font-medium">
                  Yeni kod için {countdown} saniye bekleyin
                </p>
              ) : (
                <button 
                  onClick={handleSendOtp}
                  disabled={isSending}
                  className="text-orange-600 font-bold text-sm hover:underline flex items-center justify-center mx-auto"
                >
                  {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  Yeni Kod Gönder
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-2 italic">
              E-posta gelmediyse lütfen <strong className="text-slate-500 underline">SPAM</strong> klasörünü kontrol edin.
            </p>
          </div>
          
          <button 
            onClick={() => { clientAuth.signOut(); router.replace('/login'); }}
            className="flex items-center justify-center w-full text-slate-400 text-xs hover:text-slate-600 transition-colors pt-4"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Farklı bir hesapla giriş yap
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
