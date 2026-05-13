'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useCallback } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

/**
 * Utility to generate a unique event ID for deduplication
 */
export const generateEventId = () => {
  return 'event_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

/**
 * Client-side tracking function that sends events to both Browser Pixel and Conversions API
 */
export const trackPixelEvent = async (
  eventName: string,
  customData: Record<string, any> = {},
  userData: Record<string, any> = {}
) => {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId();

  // 1. Send to Browser Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', eventName, customData, { event_id: eventId });
  }

  // 2. Send to Conversions API (Server-side) via our proxy route
  try {
    await fetch('/api/analytics/pixel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventSourceUrl: window.location.href,
        userData,
        customData,
        eventId,
      }),
    });
  } catch (err) {
    console.error('CAPI Tracking Error:', err);
  }
};

export const FacebookPixel = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    // Track pageview on route change
    // We don't use trackPixelEvent here for PageView by default to avoid complexity with automatic tracking
    // but we add event_id for the initial PageView and subsequent ones if needed.
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const eventId = generateEventId();
      (window as any).fbq('track', 'PageView', {}, { event_id: eventId });
      
      // Also send CAPI PageView for full deduplication
      fetch('/api/analytics/pixel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'PageView',
          eventSourceUrl: window.location.href,
          eventId,
        }),
      }).catch(() => {});
    }
  }, [pathname, searchParams]);

  if (!FB_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};
