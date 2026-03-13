'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, useFirestore, doc, updateDoc, serverTimestamp } from '@/firebase';
import { getAuth } from 'firebase/auth';

/**
 * Kullanıcının aktif sayfasını, son hareket zamanını ve online durumunu takip eden bileşen.
 * Yetki hatalarını ve oturum kapanma durumlarını sessizce yönetir.
 */
export function UserTracker() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    // Sadece giriş yapmış gerçek kullanıcıları takip et
    if (!user || user.isAnonymous || !db) return;

    const userRef = doc(db, 'users', user.uid);

    const trackActivity = async (isOnlineStatus: boolean) => {
      // Oturum kapanmışsa Firestore'a erişmeye çalışma
      const auth = getAuth();
      if (!auth.currentUser) return;

      try {
        await updateDoc(userRef, {
          lastActiveAt: serverTimestamp(),
          currentPath: pathname || '/',
          isOnline: isOnlineStatus
        });
      } catch (error) {
        // Tracker hataları kullanıcı deneyimini bozmamalı, sessizce geç
      }
    };

    trackActivity(true);

    const handleUnload = () => {
      // Tarayıcı kapanırken durumu false yapmaya çalış
      const auth = getAuth();
      if (auth.currentUser) {
        // updateDoc doğrudan çağrılır, emitter tetiklenmez
        updateDoc(userRef, { isOnline: false }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      // Temizlik anında hala oturum varsa offline yap
      const auth = getAuth();
      if (auth.currentUser) {
        updateDoc(userRef, { isOnline: false }).catch(() => {});
      }
    };
  }, [pathname, user, db]);

  return null;
}