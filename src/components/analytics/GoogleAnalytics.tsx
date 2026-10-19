'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  isPublicTrackingPath,
  readTrackingConsent,
  TRACKING_CONSENT_EVENT,
  TrackingConsent,
} from '@/lib/tracking-consent';

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasConsent, setHasConsent] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updateConsent = (event?: Event) => {
      const consent = event instanceof CustomEvent
        ? (event.detail as TrackingConsent)
        : readTrackingConsent();
      setHasConsent(consent?.analytics === true);
    };

    updateConsent();
    window.addEventListener(TRACKING_CONSENT_EVENT, updateConsent);
    return () => window.removeEventListener(TRACKING_CONSENT_EVENT, updateConsent);
  }, []);

  useEffect(() => {
    if (!isReady || !hasConsent || !GOOGLE_ANALYTICS_ID || !isPublicTrackingPath(pathname)) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    (window as any).gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
    });
  }, [hasConsent, isReady, pathname, searchParams]);

  if (!GOOGLE_ANALYTICS_ID || !hasConsent || !isPublicTrackingPath(pathname)) return null;

  return (
    <Script
      id="google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
      strategy="afterInteractive"
      onReady={() => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag = function gtag(...args: any[]) {
          (window as any).dataLayer.push(args);
        };
        (window as any).gtag('js', new Date());
        (window as any).gtag('config', GOOGLE_ANALYTICS_ID, {
          send_page_view: false,
          anonymize_ip: true,
        });
        setIsReady(true);
      }}
    />
  );
}
