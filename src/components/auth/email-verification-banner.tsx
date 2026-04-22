'use client';

import { useUser, auth } from '@/firebase';
import { useState, useEffect } from 'react';
import { Mail, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function EmailVerificationBanner() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isVerifiedLocally, setIsVerifiedLocally] = useState(false);
  const pathname = usePathname();

  const isCocukModu = pathname?.startsWith('/cocuk-modu');
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  
  const shouldShow = user && !user.emailVerified && !isVerifiedLocally && !isCocukModu && !isAuthPage;

  if (!shouldShow) return null;

  const handleSendVerification = async () => {
    if (!user?.email || !auth.currentUser) return;
    setIsSending(true);
    try {
      const response = await fetch('/api/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, type: 'verification' }),
      });

      if (!response.ok) {
        throw new Error('API failed');
      }

      toast({
        title: 'Doğrulama E-postası Gönderildi',
        description: 'Lütfen gelen kutunuzu (ve gerekiyorsa spam klasörünü) kontrol edin.',
        className: 'bg-green-500 text-white',
      });
    } catch (error: any) {
      console.warn("Resend API failed, falling back to Firebase:", error);
      try {
        const { sendEmailVerification } = await import('firebase/auth');
        await sendEmailVerification(auth.currentUser, {
           url: `${window.location.origin}/auth/email-onay`
        });
        toast({
          title: 'Doğrulama E-postası Gönderildi',
          description: 'Lütfen gelen kutunuzu (ve gerekiyorsa spam klasörünü) kontrol edin.',
          className: 'bg-green-500 text-white',
        });
      } catch (fbError) {
        console.error("Firebase fallback failed:", fbError);
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: 'E-posta gönderilirken bir sorun oluştu. Daha sonra tekrar deneyin.',
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!auth.currentUser) return;
    setIsChecking(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setIsVerifiedLocally(true);
        if (user?.id) {
          try {
            const { doc, updateDoc } = await import('firebase/firestore');
            const { db } = await import('@/firebase');
            await updateDoc(doc(db, 'users', user.id), { emailVerified: true });
          } catch (err) {
            console.error("Firestore update error:", err);
          }
        }
        toast({
          title: 'Teşekkürler!',
          description: 'E-posta adresiniz başarıyla onaylandı.',
          className: 'bg-emerald-500 text-white',
        });
        window.dispatchEvent(new Event('emailVerificationDismissed'));
      } else {
        toast({
          variant: 'default',
          title: 'Henüz Onaylanmamış',
          description: 'Lütfen size gönderilen linke tıkladığınızdan emin olun.',
          className: 'bg-amber-500 text-white border-amber-600',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 p-3 sm:p-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-white/20 p-2 rounded-full shrink-0">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-tight">E-posta Onayı Gerekli</h3>
            <p className="text-xs sm:text-sm text-orange-50 font-medium mt-1">
              Hesabınızın güvenliği ve bildirimler için adresinizi doğrulayın.
              <span className="block sm:inline sm:ml-1 font-bold text-white bg-orange-600/30 px-2 py-0.5 rounded-md mt-1 sm:mt-0 w-fit">
                (E-posta gelmediyse Spam klasörüne bakmayı unutmayın)
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 w-full sm:w-auto shrink-0">
          <Button 
            onClick={handleSendVerification} 
            disabled={isSending}
            variant="secondary"
            className="flex-1 sm:flex-none bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-sm"
            size="sm"
          >
            {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
            Link Gönder
          </Button>
          
          <Button 
            onClick={handleCheckVerification} 
            disabled={isChecking}
            variant="outline"
            className="flex-1 sm:flex-none border-white/40 text-orange-600 hover:bg-white/10 hover:text-orange-600 font-bold bg-white"
            size="sm"
          >
            {isChecking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Onayladım
          </Button>
        </div>
      </div>
    </div>
  );
}
