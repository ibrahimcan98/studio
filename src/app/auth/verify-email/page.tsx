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
  const [countdown, setCountdown] = useState(45); // Başlangıçta 45 saniye bekleme süresi
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  useEffect(() => {
    if (isChangingEmail) return; // Kullanıcı bilerek çıkış yapıp kayıt sayfasına dönüyorsa engelle
    if (!loading && !user) {
      router.replace('/login');
    } else if (!loading && user?.emailVerified) {
      router.replace('/ebeveyn-portali');
    }
  }, [user, loading, router, isChangingEmail]);

  // Real-time Firestore Sync (Detect verification from other tabs)
  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(doc(firestoreDb, 'users', user.uid), (doc) => {
      if (doc.exists() && doc.data()?.emailVerified === true) {
        toast({
          title: 'Başarılı!',
          description: 'E-posta adresiniz doğrulandı. Yönlendiriliyorsunuz...',
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
    setErrorMsg(''); // Yeni bir şey yazıldığında hatayı temizle
    if (value.length > 1) {
      // If user types/pastes multiple chars in one go
      const digits = value.split('').filter(c => /^\d$/.test(c)).slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      
      const nextIdx = Math.min(index + digits.length, 5);
      document.getElementById(`otp-${nextIdx}`)?.focus();
      
      // Auto submit if full
      if (newOtp.join('').length === 6) {
        setTimeout(() => document.getElementById('verify-button')?.click(), 100);
      }
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
    
    // Auto submit if 6th digit entered
    if (value && index === 5 && newOtp.join('').length === 6) {
      setTimeout(() => document.getElementById('verify-button')?.click(), 100);
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
    setErrorMsg('');

    // Focus last filled input or the verify button
    const lastIdx = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastIdx}`)?.focus();
    
    // Auto verify if 6 digits pasted
    if (pastedData.length === 6) {
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
    setErrorMsg('');
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, userId: user.uid }),
      });

      if (!response.ok) throw new Error('OTP gönderilemedi.');

      setCountdown(45); // Yeni kodu gönderdikten sonra 45 sn bekle
      toast({
        title: 'Kod Gönderildi',
        description: 'Yeni doğrulama kodu gönderildi.',
        className: 'bg-emerald-500 text-white',
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
    setErrorMsg('');
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, otp: fullOtp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Doğrulama başarısız.');
      }

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
      // Sadece input altına göstermek için error state'i setliyoruz. Toast'a gerek yok.
      setErrorMsg('Kod hatalı veya süresi dolmuş. Lütfen tekrar deneyin.');
      setOtp(['', '', '', '', '', '']); // Hatalı girildiğinde kutuları temizle
      document.getElementById('otp-0')?.focus(); // İlk kutuya odaklan
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
        <div className="h-2 bg-primary" />
        <CardHeader className="text-center pt-8">
          <div className="mx-auto bg-orange-100 p-4 rounded-full w-fit mb-4">
            <ShieldCheck className="h-10 w-10 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">E-postanızı doğrulayın</CardTitle>
          <CardDescription className="text-slate-600 mt-2 text-sm leading-relaxed">
            <strong>{user.email}</strong> adresine gönderdiğimiz 6 haneli doğrulama kodunu girin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-10">
          <div>
            <div className="flex justify-between gap-2 max-w-[320px] mx-auto" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all ${
                    errorMsg ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-primary focus:ring-primary'
                  }`}
                  maxLength={6}
                />
              ))}
            </div>
            {errorMsg && (
              <p className="text-red-500 text-sm text-center font-medium mt-3 animate-in fade-in slide-in-from-top-1">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Button 
              id="verify-button"
              onClick={handleVerify} 
              disabled={isVerifying || otp.join('').length < 6}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Doğrulanıyor...
                </>
              ) : 'Doğrula ve Devam Et'}
            </Button>

            <div className="text-center pt-2">
              {countdown > 0 ? (
                <p className="text-sm text-slate-500 font-medium">
                  Yeni kodu {countdown} saniye sonra gönderebilirsiniz.
                </p>
              ) : (
                <button 
                  onClick={handleSendOtp}
                  disabled={isSending}
                  className="text-primary font-bold text-sm hover:underline flex items-center justify-center mx-auto"
                >
                  {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Yeni Kod Gönder
                </button>
              )}
            </div>

            <p className="text-sm text-slate-500 text-center mt-2 px-4 leading-relaxed">
              E-posta gelmediyse spam veya gereksiz klasörünü kontrol edin. Gönderim birkaç dakika sürebilir.
            </p>
          </div>
          
          <button 
            onClick={async () => { 
              setIsChangingEmail(true);
              await clientAuth.signOut(); 
              router.replace('/register'); 
            }}
            className="flex items-center justify-center w-full text-slate-500 text-sm font-medium hover:text-slate-800 transition-colors mt-6 pt-4 border-t"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            E-posta adresini değiştir
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
