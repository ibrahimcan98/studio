'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const CLICK_TRACK_THROTTLE_MS = 500;

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
  
  // Try to get test code from URL first, then fall back to sessionStorage
  const searchParams = new URLSearchParams(window.location.search);
  let testEventCode = searchParams.get('test_event_code');
  
  if (testEventCode) {
    sessionStorage.setItem('fb_test_event_code', testEventCode);
  } else {
    testEventCode = sessionStorage.getItem('fb_test_event_code');
  }

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
        testEventCode: testEventCode || undefined,
      }),
    });
  } catch (err) {
    console.error('CAPI Tracking Error:', err);
  }
};

const trackSiteEvent = async (
  eventName: string,
  customData: Record<string, any> = {},
  eventId = generateEventId()
) => {
  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/analytics/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventSourceUrl: window.location.href,
        customData,
        eventId,
      }),
    });
  } catch (err) {
    console.error('Site Analytics Error:', err);
  }
};

export const FacebookPixel = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTestCode, setActiveTestCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedCode = sessionStorage.getItem('fb_test_event_code');
        setActiveTestCode(savedCode);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track pageview on route change
    const eventId = generateEventId();
      
    // Handle test code persistence
    let testEventCode = searchParams.get('test_event_code');
    if (testEventCode) {
      sessionStorage.setItem('fb_test_event_code', testEventCode);
      setActiveTestCode(testEventCode);
    } else {
      testEventCode = sessionStorage.getItem('fb_test_event_code');
      setActiveTestCode(testEventCode);
    }

    if (FB_PIXEL_ID && (window as any).fbq) {
      (window as any).fbq('track', 'PageView', {}, { event_id: eventId });
    }

    trackSiteEvent('PageView', {}, eventId);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastTrackedAt = 0;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest('a, button, [role="button"]') as HTMLElement | null;
      if (!clickable) return;

      const now = Date.now();
      if (now - lastTrackedAt < CLICK_TRACK_THROTTLE_MS) return;
      lastTrackedAt = now;

      const link = clickable.closest('a') as HTMLAnchorElement | null;
      const label = (clickable.getAttribute('aria-label') || clickable.textContent || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120);
      const href = link?.href || clickable.getAttribute('data-href') || '';

      trackSiteEvent('Click', {
        label: label || clickable.tagName.toLowerCase(),
        tagName: clickable.tagName.toLowerCase(),
        href,
        path: window.location.pathname,
      });
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);



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
      {/* Test Mode Indicator (Only visible if test code is active) */}
      {activeTestCode && (
        <div className="fixed bottom-4 left-4 z-[9999] pointer-events-none">
          <div className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-400/50 backdrop-blur-sm bg-opacity-90">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Meta Test Modu Aktif: {activeTestCode}
          </div>
        </div>
      )}

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
