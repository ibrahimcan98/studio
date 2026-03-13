'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, useFirestore, doc, updateDoc, serverTimestamp } from '@/firebase';

/**
 * Component that tracks user's current page, last activity time, and online status.
 */
export function UserTracker() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (!user || user.isAnonymous || !db) return;

    const userRef = doc(db, 'users', user.uid);

    const trackActivity = async () => {
      try {
        await updateDoc(userRef, {
          lastActiveAt: serverTimestamp(),
          currentPath: pathname || '/',
          isOnline: true
        });
      } catch (error) {
        // Silently fail tracking updates
      }
    };

    trackActivity();

    // Clean up online status on tab close / browser close
    const handleUnload = () => {
      // Note: updateDoc might be canceled by browser on close, but we try anyway
      updateDoc(userRef, { isOnline: false });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [pathname, user, db]);

  return null;
}
