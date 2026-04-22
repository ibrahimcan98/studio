'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { messaging as messagingInstance, db, getSafeMessaging } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useUser } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';

const VAPID_KEY = 'BPtJylOxCr_nJrgUkNaD4x8_bvMdFwUmjsXENIAgfw6EQiSFTvFFgpa8DbXSrSkF7AVBsdMCjLFQVacYVtk6IOc';

export function useNotifications() {
  const { user } = useUser();
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    setIsInitializing(false);
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

  const requestPermission = useCallback(async (isManual: boolean = false) => {
    let messaging = messagingInstance;
    
    // If instance is not ready yet, try to get it safely (awaits isSupported)
    if (!messaging) {
        messaging = await getSafeMessaging();
    }

    if (!messaging) {
      const supported = await isSupported();
      if (!supported) {
          if (isManual) {
            toast({ 
                variant: 'destructive', 
                title: 'Desteklenmiyor', 
                description: 'Cihazınız veya tarayıcınız anlık bildirimleri desteklemiyor. (Instagram/Facebook uygulama içi tarayıcıları desteklememektedir)' 
            });
          }
          return;
      }
      
      if (isManual) {
        toast({ variant: 'destructive', title: 'Hata', description: 'Messaging servisi şu an başlatılamadı. Lütfen sayfayı yenileyip tekrar deneyin.' });
      }
      return;
    }

    try {
      console.log('Requesting permission...');
      
      // Check if Notification is available in the browser
      if (typeof window === 'undefined' || !('Notification' in window)) {
        if (isManual) {
            toast({ 
                variant: 'destructive', 
                title: 'Desteklenmiyor', 
                description: 'Tarayıcınız anlık bildirimleri desteklemiyor. Lütfen tarayıcı ayarlarını kontrol edin veya uygulamayı ana ekrana ekleyip tekrar deneyin.' 
            });
        }
        return;
      }

      // If already denied, guide the user
      if (Notification.permission === 'denied') {
          if (isManual) {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            toast({ 
                variant: 'destructive', 
                title: 'İzin Reddedildi', 
                description: isIOS 
                    ? 'Bildirim izni daha önce reddedilmiş. Etkinleştirmek için: Ayarlar > Bildirimler > Türk Çocuk Akademisi kısmından izin verin.' 
                    : 'Bildirim izni tarayıcı ayarlarınızdan engellenmiş. Lütfen adres çubuğundaki kilit simgesine tıklayarak izin verin.' 
            });
          }
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
            if (isManual) {
                toast({ title: 'Başarılı', description: 'Bildirimler başarıyla aktif edildi!' });
            }
          }
        } else {
          if (isManual) {
            toast({ variant: 'destructive', title: 'Token Alınamadı', description: 'Cihaz kimliği oluşturulamadı.' });
          }
        }
      } else if (status === 'denied' && isManual) {
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
      console.warn('FCM registration skipped or failed:', error.message);
      // Only show error toast if user explicitly clicked "Enable Notifications"
      if (isManual) {
        toast({ 
          variant: 'destructive', 
          title: 'Bildirim Servisi', 
          description: 'Şu an bildirimler aktif edilemedi. Lütfen daha sonra tekrar deneyin.' 
        });
      }
    }
  }, [saveTokenToFirestore, user, toast]);

  // Listen for foreground messages
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      const messaging = await getSafeMessaging();
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
    if (user && permission === 'granted' && !token && !isInitializing) {
      requestPermission(false);
    }
  }, [user, permission, token, requestPermission, isInitializing]);

  return {
    permission,
    token,
    requestPermission: () => requestPermission(true)
  };
}
