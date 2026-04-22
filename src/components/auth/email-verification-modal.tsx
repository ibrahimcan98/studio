'use client';

import { useUser, auth } from '@/firebase';
import { useState, useEffect } from 'react';
import { Mail, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EmailVerificationModal() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isVerifiedLocally, setIsVerifiedLocally] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Yalnızca giriş yapmış, emaili onaylanmamış ve çocuk modunda olmayanlara göster.
  const isCocukModu = pathname?.startsWith('/cocuk-modu');
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  
  const shouldShow = user && !user.emailVerified && !isVerifiedLocally && !isCocukModu && !isAuthPage;

  useEffect(() => {
    if (shouldShow && !sessionStorage.getItem('emailVerificationDismissed')) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [shouldShow]);

  if (!shouldShow) return null;

  const handleSendVerification = async () => {
    if (!user?.email) return;
    setIsSending(true);
    try {
      // Firebase auth sendEmailVerification yerine, kendi Resend API endpointimizi kullanıyoruz
      // Böylece doğru link ile ve bizim tasarımımızla mail gidiyor
      const response = await fetch('/api/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, type: 'verification' }),
      });

      if (!response.ok) {
        throw new Error('Mail gönderilemedi.');
      }

      toast({
        title: 'Doğrulama E-postası Gönderildi',
        description: 'Lütfen gelen kutunuzu (ve gerekiyorsa spam klasörünü) kontrol edin.',
        className: 'bg-green-500 text-white',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'E-posta gönderilirken bir sorun oluştu. Daha sonra tekrar deneyin.',
      });
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
        setIsOpen(false);
        // Firestore'da da güncelle
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
      } else {
        toast({
          variant: 'default',
          title: 'Henüz Onaylanmamış',
          description: 'Sistem e-posta adresinizi henüz onaylı olarak görmüyor. Lütfen size gönderilen linke tıkladığınızdan emin olun.',
          className: 'bg-amber-500 text-white border-amber-600',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setIsOpen(val);
    if (!val) {
      sessionStorage.setItem('emailVerificationDismissed', 'true');
      window.dispatchEvent(new Event('emailVerificationDismissed'));
    }
  };

  // The modal is dismissible by the user setting open to false
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-orange-50 to-white border-orange-200 shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
        <DialogHeader className="flex flex-col items-center text-center pt-4">
          <div className="bg-orange-100 p-4 rounded-full mb-2">
            <AlertTriangle className="h-10 w-10 text-orange-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-orange-900">
            E-posta Onayı Gerekli
          </DialogTitle>
          <DialogDescription className="text-slate-600 font-medium text-sm pt-2">
            Hesabınızın güvenliği ve ders bildirimlerinizi kesintisiz alabilmeniz için lütfen e-posta adresinizi doğrulayın.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <Button 
            onClick={handleSendVerification} 
            disabled={isSending}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 rounded-xl text-base shadow-md"
          >
            {isSending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Mail className="w-5 h-5 mr-2" />}
            Bana Onay Linki Gönder
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Linke tıkladıysanız</span>
            </div>
          </div>

          <Button 
            onClick={handleCheckVerification} 
            disabled={isChecking}
            variant="outline"
            className="w-full bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-bold h-12 rounded-xl"
          >
            {isChecking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            E-postamı Doğruladım
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
