'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthActionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (mode === 'verifyEmail' && oobCode) {
      // Create the target URL with original parameters
      const params = new URLSearchParams();
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
      router.push(`/auth/email-onay?${params.toString()}`);
    }
  }, [searchParams, router]);

  return null;
}

export function AuthActionRedirect() {
  return (
    <Suspense fallback={null}>
      <AuthActionHandler />
    </Suspense>
  );
}
