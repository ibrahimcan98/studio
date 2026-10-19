export const TRACKING_CONSENT_KEY = 'tca_tracking_consent_v1';
export const TRACKING_CONSENT_EVENT = 'tca-consent-updated';

export type TrackingConsent = {
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export function readTrackingConsent(): TrackingConsent | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(TRACKING_CONSENT_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<TrackingConsent>;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null;

    return {
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveTrackingConsent(preferences: Pick<TrackingConsent, 'analytics' | 'marketing'>) {
  if (typeof window === 'undefined') return;

  const consent: TrackingConsent = {
    ...preferences,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(TRACKING_CONSENT_KEY, JSON.stringify(consent));

  if (!preferences.analytics || !preferences.marketing) {
    const cookieNames = [
      ...(!preferences.analytics ? ['_ga'] : []),
      ...(!preferences.marketing ? ['_fbp', '_fbc'] : []),
    ];
    const host = window.location.hostname;

    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0]?.trim();
      if (!name || (!cookieNames.includes(name) && !(name.startsWith('_ga_') && !preferences.analytics))) return;

      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      if (host && host !== 'localhost') {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${host}; SameSite=Lax`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host}; SameSite=Lax`;
      }
    });
  }

  window.dispatchEvent(new CustomEvent<TrackingConsent>(TRACKING_CONSENT_EVENT, { detail: consent }));
}

export function hasTrackingConsent(type: 'analytics' | 'marketing') {
  return readTrackingConsent()?.[type] === true;
}

export function isPublicTrackingPath(pathname: string) {
  const excludedPrefixes = ['/yonetici', '/ogretmen-portali', '/ebeveyn-portali', '/cocuk-modu'];
  return !excludedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
