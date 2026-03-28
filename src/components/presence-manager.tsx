'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useFirestore, doc, updateDoc, Timestamp, serverTimestamp, useDoc, useMemoFirebase } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

export function PresenceManager() {
    const { user } = useUser();
    const db = useFirestore();
    const pathname = usePathname();
    const router = useRouter();

    // Listen to user's OWN document for forceLogout command
    // Fixed: useMemoFirebase to stabilize the reference and prevent infinite loops
    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user?.uid, db]);

    const { data: userData } = useDoc(userDocRef);

    useEffect(() => {
        if (userData?.forceLogout && user) {
            const logout = async () => {
                const auth = getAuth();
                try {
                    // Force set to false before signing out to be safe
                    if (userDocRef) {
                        await updateDoc(userDocRef, { forceLogout: false, isOnline: false });
                    }
                    await signOut(auth);
                    router.replace('/login');
                } catch (err) {
                    console.error('Force logout error:', err);
                }
            };
            logout();
        }
    }, [userData?.forceLogout, user, userDocRef, router]);

    const getStatusFromPath = (path: string) => {
        if (path.includes('/sepet')) return '🛒 Sepette';
        if (path.includes('/odeme')) return '💳 Ödeme Yapıyor';
        if (path.includes('/ders-planla')) return '📅 Ders Planlıyor';
        if (path.includes('/derslerim')) return '📚 Derslerine Bakıyor';
        if (path.includes('/profil')) return '👤 Profil Ayarlarında';
        if (path.includes('/ogretmen-portali')) return '👨‍🏫 Öğretmen Panelinde';
        if (path.includes('/yonetici')) return '⚡ Yönetici Panelinde';
        return '👀 Geziyor';
    };

    const updatePresence = useCallback(async (isOnline: boolean) => {
        if (!user || !db) return;

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                isOnline,
                currentPath: pathname,
                status: getStatusFromPath(pathname),
                lastActiveAt: serverTimestamp(),
            });
        } catch (error: any) {
            if (error.code === 'not-found') {
                // The user document was deleted (e.g. by an admin)
                // We should sign them out so they aren't stuck in a zombie state
                const auth = getAuth();
                signOut(auth).catch(() => {});
            } else {
                console.error('Presence update error:', error);
            }
        }
    }, [user, db, pathname]);

    useEffect(() => {
        if (!user) return;

        // Start presence
        updatePresence(true);

        // Heartbeat (Every 1 minute)
        const interval = setInterval(() => {
            updatePresence(true);
        }, 60000);

        // Offline on close
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                // We keep it as online but update timestamp, 
                // or we could set offline. Usually heartbeat is better.
            } else {
                updatePresence(true);
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            // On unmount (e.g., logout or close)
            updatePresence(false);
        };
    }, [user, updatePresence]);

    return null; // Invisible component
}
