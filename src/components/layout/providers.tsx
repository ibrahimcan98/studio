'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CartProvider } from '@/context/cart-context';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const INTERCOM_APP_ID = "omihlk0y";

// A component to safely load Intercom and identify users
function IntercomScriptLoader() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !db || user.isAnonymous) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData } = useDoc(userDocRef);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const ic = (window as any).Intercom;
    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', (window as any).intercomSettings);
    } else {
      const d = document;
      const i: any = function() { i.c(arguments); };
      i.q = [];
      i.c = function(args: any) { i.q.push(args); };
      (window as any).Intercom = i;
      const l = function() {
        const s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://widget.intercom.io/widget/' + INTERCOM_APP_ID;
        // Safety check for parent element
        const x = d.getElementsByTagName('script')[0];
        if (x && x.parentNode) {
          x.parentNode.insertBefore(s, x);
        } else {
          d.head.appendChild(s);
        }
      };
      if (d.readyState === 'complete') {
        l();
      } else {
        window.addEventListener('load', l, false);
      }
    }

    (window as any).Intercom?.('boot', {
      app_id: INTERCOM_APP_ID,
      api_base: "https://api-iam.intercom.io",
    });

    return () => {
      if ((window as any).Intercom) {
        (window as any).Intercom('shutdown');
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !(window as any).Intercom || userLoading) return;

    const intercomSettings: any = {
      api_base: "https://api-iam.intercom.io",
    };

    if (user && !user.isAnonymous) {
      intercomSettings.name = userData?.firstName ? `${userData.firstName} ${userData.lastName}` : user.displayName;
      intercomSettings.email = user.email;
      intercomSettings.user_id = user.uid;
      if (user.metadata.creationTime) {
        intercomSettings.created_at = Math.floor(new Date(user.metadata.creationTime).getTime() / 1000);
      }
    }

    (window as any).Intercom('update', intercomSettings);
  }, [user, userData, userLoading, mounted]);

  return null;
}


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <CartProvider>
        {children}
        <IntercomScriptLoader />
      </CartProvider>
    </FirebaseClientProvider>
  );
}
