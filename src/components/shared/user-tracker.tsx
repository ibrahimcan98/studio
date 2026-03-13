'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, useFirestore, doc, updateDoc, serverTimestamp } from '@/firebase';

/**
 * Kullanıcının aktif sayfasını, son hareket zamanını ve online durumunu takip eden bileşen.
 * Background hatalarını sessiz yönetir.
 */
export function UserTracker() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (!user || user.isAnonymous || !db) return;

    const userRef = doc(db, 'users', user.uid);

    const trackActivity = async (isOnlineStatus: boolean) => {
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
      // Tarayıcı kapanırken online durumunu false yapmaya çalış
      updateDoc(userRef, { isOnline: false }).catch(() => {});
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      handleUnload(); // Bileşen unmount olduğunda da temizle
    };
  }, [pathname, user, db]);

  return null;
}