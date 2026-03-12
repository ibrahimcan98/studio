
'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CartProvider } from '@/context/cart-context';
import Script from 'next/script';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { UserTracker } from '@/components/shared/user-tracker';

// A component to safely load Intercom and identify users
function IntercomScriptLoader() {
  const { user, loading } = useUser();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData } = useDoc(userDocRef);

  // NOTE: Replace 'omihlk0y' with your actual Intercom App ID if different
  const INTERCOM_APP_ID = "omihlk0y"; 

  const intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: INTERCOM_APP_ID,
    ...(user && {
      name: userData?.firstName ? `${userData.firstName} ${userData.lastName}` : user.displayName,
      email: user.email,
      user_id: user.uid,
      created_at: user.metadata.creationTime ? Math.floor(new Date(user.metadata.creationTime).getTime() / 1000) : undefined,
    })
  };
  
  if (loading) {
    return null; 
  }

  return (
     <Script id="intercom-script" strategy="afterInteractive">
        {`
          window.intercomSettings = ${JSON.stringify(intercomSettings)};
          (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${INTERCOM_APP_ID}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
        `}
      </Script>
  );
}


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <CartProvider>
        <UserTracker />
        {children}
        <IntercomScriptLoader />
      </CartProvider>
    </FirebaseClientProvider>
  );
}
