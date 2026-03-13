'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Bu sayfa tamamen kaldırılmıştır. 
 * Erişim durumunda doğrudan dashboard'a yönlendirilir.
 */
export default function CanliTakipPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/yonetici');
  }, [router]);

  return null;
}
