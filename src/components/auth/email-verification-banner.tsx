'use client';

import { useUser, auth } from '@/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import { AlertCircle, Mail, Loader2, RefreshCw } from 'lucide-react';
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

  // Yalnızca giriş yapmış, emaili onaylanmamış ve çocuk modunda olmayanlara göster.
  const isCocukModu = pathname?.startsWith('/cocuk-modu');
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  
  if (!user || user.emailVerified || isVerifiedLocally || isCocukModu || isAuthPage) return null;

  const handleSendVerification = async () => {
    if (!auth.currentUser) return;
    setIsSending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast({
        title: 'Doğrulama E-postası Gönderildi',
        description: 'Lütfen gelen kutunuzu (ve gerekiyorsa spam klasörünü) kontrol edin.',
        className: 'bg-green-500 text-white',
      });
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/too-many-requests') {
        toast({
          variant: 'destructive',
          title: 'Çok Fazla İstek',
          description: 'Kısa süre içinde çok fazla e-posta istediniz. Lütfen daha sonra tekrar deneyin.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: 'E-posta gönderilirken bir sorun oluştu.',
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

  return (
    <div className="w-full bg-orange-100/90 border-b border-orange-200 px-4 py-3 shadow-sm relative z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-orange-900">
          <div className="bg-orange-500/20 p-2.5 rounded-full shrink-0">
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-black">E-posta adresiniz henüz onaylanmadı.</p>
            <p className="text-[11px] sm:text-xs font-semibold opacity-80 mt-0.5">
              Hesabınızın güvenliği ve bildirimleri sorunsuz alabilmek için lütfen adresinizi doğrulayın.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleSendVerification} 
            disabled={isSending}
            variant="default"
            className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs h-9 rounded-xl shadow-md shadow-orange-600/20"
          >
            {isSending ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Mail className="w-3.5 h-3.5 mr-2" />}
            Onay Linki Gönder
          </Button>
          <Button 
            onClick={handleCheckVerification} 
            disabled={isChecking}
            variant="outline"
            className="flex-1 sm:flex-none bg-white hover:bg-orange-50 text-orange-700 border-orange-300 font-bold text-xs h-9 rounded-xl"
            title="Onayladıktan sonra buraya tıklayın"
          >
            {isChecking ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-2" />}
            Doğruladım
          </Button>
        </div>
      </div>
    </div>
  );
}
