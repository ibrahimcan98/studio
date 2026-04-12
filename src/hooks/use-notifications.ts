'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, db } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useUser } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';

const VAPID_KEY = 'BPtJylOxCr_nJrgUkNaD4x8_bvMdFwUmjsXENIAgfw6EQiSFTvFFgpa8DbXSrSkF7AVBsdMCjLFQVacYVtk6IOc';

export function useNotifications() {
  const { user } = useUser();
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const saveTokenToFirestore = useCallback(async (newToken: string) => {
    if (!user || !db) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(newToken)
      });
      console.log('FCM Token saved to Firestore');
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }, [user]);

  const requestPermission = useCallback(async () => {
    if (!messaging) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Messaging servisi başlatılamadı.' });
      return;
    }

    try {
      console.log('Requesting permission...');
      
      // Check if Notification is available in the browser
      if (typeof window === 'undefined' || !('Notification' in window)) {
        toast({ 
            variant: 'destructive', 
            title: 'Desteklenmiyor', 
            description: 'Tarayıcınız anlık bildirimleri desteklemiyor. Lütfen tarayıcı ayarlarını kontrol edin veya uygulamayı ana ekrana ekleyip tekrar deneyin.' 
        });
        return;
      }

      // If already denied, guide the user
      if (Notification.permission === 'denied') {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          toast({ 
              variant: 'destructive', 
              title: 'İzin Reddedildi', 
              description: isIOS 
                ? 'Bildirim izni daha önce reddedilmiş. Etkinleştirmek için: Ayarlar > Bildirimler > Türk Çocuk Akademisi kısmından izin verin.' 
                : 'Bildirim izni tarayıcı ayarlarınızdan engellenmiş. Lütfen adres çubuğundaki kilit simgesine tıklayarak izin verin.' 
          });
          return;
      }

      const status = await Notification.requestPermission();
      setPermission(status);

      if (status === 'granted') {
        console.log('Permission granted. Fetching token...');
        const currentToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });

        if (currentToken) {
          console.log('Token received:', currentToken);
          setToken(currentToken);
          if (user) {
            await saveTokenToFirestore(currentToken);
            toast({ title: 'Başarılı', description: 'Bildirimler başarıyla aktif edildi!' });
          }
        } else {
          toast({ variant: 'destructive', title: 'Token Alınamadı', description: 'Cihaz kimliği oluşturulamadı.' });
        }
      } else if (status === 'denied') {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        toast({ 
            variant: 'destructive', 
            title: 'İzin Verilmedi', 
            description: isIOS 
                ? 'Bildirim izni verilmedi. Eğer uyarı çıkmadıysa, lütfen iPhone Ayarlarından bildirimleri kontrol edin.' 
                : 'Bildirim izni reddedildi.' 
        });
      }
    } catch (error: any) {
      console.error('An error occurred while retrieving token:', error);
      toast({ variant: 'destructive', title: 'FCM Hatası', description: error.message || 'Bilinmeyen bir hata oluştu.' });
    }
  }, [saveTokenToFirestore, user, toast]);

  // Listen for foreground messages
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      if (!messaging) return;
      
      try {
        unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground message received:', payload);
          toast({
            title: payload.notification?.title || 'Yeni Bildirim',
            description: payload.notification?.body || '',
          });
        });
      } catch (e) {
        console.warn('Failed to setup foreground message listener:', e);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [toast]); 

  // Automatically request/refresh token if user is logged in and permission is already granted
  useEffect(() => {
    if (user && permission === 'granted' && !token) {
      requestPermission();
    }
  }, [user, permission, token, requestPermission]);

  return {
    permission,
    token,
    requestPermission
  };
}
