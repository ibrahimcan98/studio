'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RemovedLiveTrackingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/yonetici');
  }, [router]);

  return null;
}
