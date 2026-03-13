'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, useFirestore, doc, updateDoc, serverTimestamp } from '@/firebase';
import { getAuth } from 'firebase/auth';

/**
 * Kullanıcının aktif sayfasını, son hareket zamanını ve online durumunu takip eden bileşen.
 * Yetki hatalarını ve oturum kapanma durumlarını sessiz yönetir.
 */
export function UserTracker() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (!user || user.isAnonymous || !db) return;

    const userRef = doc(db, 'users', user.uid);

    const trackActivity = async (isOnlineStatus: boolean) => {
      // Oturum kapanmışsa veya kullanıcı yoksa işlem yapma
      const auth = getAuth();
      if (!auth.currentUser && isOnlineStatus) return;

      try {
        await updateDoc(userRef, {
          lastActiveAt: serverTimestamp(),
          currentPath: pathname || '/',
          isOnline: isOnlineStatus
        });
      } catch (error) {
        // Tracker hataları kullanıcı deneyimini bozmamalıdır
      }
    };

    trackActivity(true);

    const handleUnload = () => {
      // Tarayıcı kapanırken durumu false yapmaya çalış
      // updateDoc yerine doğrudan çağrı, emitter'ı tetiklememesi için sessizce yapılır
      const auth = getAuth();
      if (auth.currentUser) {
        updateDoc(userRef, { isOnline: false }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      handleUnload();
    };
  }, [pathname, user, db]);

  return null;
}