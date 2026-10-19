'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const lastTrackedPath = useRef<string | null>(null);

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
    if (!hasConsent || !GOOGLE_ANALYTICS_ID || !isPublicTrackingPath(pathname)) return;

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    // The initial view is sent by gtag('config'). Only send subsequent SPA navigations here.
    if (lastTrackedPath.current === null) {
      lastTrackedPath.current = pagePath;
      return;
    }

    if (lastTrackedPath.current === pagePath) return;
    lastTrackedPath.current = pagePath;

    (window as any).gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
    });
  }, [hasConsent, pathname, searchParams]);

  if (!GOOGLE_ANALYTICS_ID || !hasConsent || !isPublicTrackingPath(pathname)) return null;

  return (
    <>
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}', {
              anonymize_ip: true
            });
          `,
        }}
      />
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
