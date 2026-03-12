
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Component that tracks user's current page and last activity time.
 * Placed in Root Layout or Providers.
 */
export function UserTracker() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    // We only track actual registered users (parents, teachers, admins)
    // Anonymous users are usually just using the assistant and don't need persistent tracking
    if (!user || user.isAnonymous || !db) return;

    const trackActivity = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        // We use updateDoc to avoid overwriting existing profile data
        await updateDoc(userRef, {
          lastActiveAt: serverTimestamp(),
          currentPath: pathname || '/',
        });
      } catch (error) {
        // Silently fail to not disrupt user experience
        console.warn("Tracking failed:", error);
      }
    };

    trackActivity();
  }, [pathname, user, db]);

  return null;
}
