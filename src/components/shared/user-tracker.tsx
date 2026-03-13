
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export function UserTracker() {
  const { user } = useUser();
  const db = useFirestore();
  const pathname = usePathname();
  const sessionStarted = useRef(false);

  useEffect(() => {
    if (!user || user.isAnonymous || !db) return;

    const userDocRef = doc(db, 'users', user.uid);

    const updateStatus = async (isOnline: boolean) => {
      try {
        const data: any = {
          isOnline,
          lastActiveAt: serverTimestamp(),
          currentPath: pathname || '/',
        };

        if (isOnline && !sessionStarted.current) {
          data.onlineSince = serverTimestamp();
          sessionStarted.current = true;
        }

        await updateDoc(userDocRef, data);
      } catch (error) {
        // Silent catch to prevent UI disruption during logout or background sync
        console.warn("Tracker update failed:", error);
      }
    };

    updateStatus(true);

    // Visibility change handler (tab switch or minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateStatus(true);
      }
    };

    // Before unload handler (tab close)
    const handleBeforeUnload = () => {
      // Browsers often limit async ops here, but we try.
      // Firebase's internal sync will handle this if possible.
      updateDoc(userDocRef, { isOnline: false, lastActiveAt: serverTimestamp() });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Try to set offline on unmount (though layout unmount is rare)
      updateStatus(false);
    };
  }, [user, db, pathname]);

  return null;
}
