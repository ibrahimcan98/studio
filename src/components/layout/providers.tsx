'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CartProvider } from '@/context/cart-context';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';

// A component to safely load Intercom and identify users
function IntercomScriptLoader() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !db || user.isAnonymous) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  const INTERCOM_APP_ID = "omihlk0y"; 

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Intercom snippet
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + INTERCOM_APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if((w as any).attachEvent){(w as any).attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();

    (window as any).Intercom('boot', {
      app_id: INTERCOM_APP_ID,
    });

    return () => {
      if ((window as any).Intercom) {
        (window as any).Intercom('shutdown');
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).Intercom || userLoading || userDataLoading) return;

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
  }, [user, userData, userLoading, userDataLoading]);

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
