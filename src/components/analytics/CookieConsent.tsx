'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, Settings2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { readTrackingConsent, saveTrackingConsent } from '@/lib/tracking-consent';

export function CookieConsent() {
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  useEffect(() => {
    const savedConsent = readTrackingConsent();
    setAnalyticsEnabled(savedConsent?.analytics ?? false);
    setMarketingEnabled(savedConsent?.marketing ?? false);
    setIsOpen(!savedConsent);
    setIsReady(true);
  }, []);

  const choose = (enabled: boolean) => {
    saveTrackingConsent({ analytics: enabled, marketing: enabled });
    setIsOpen(false);
  };

  const savePreferences = () => {
    saveTrackingConsent({ analytics: analyticsEnabled, marketing: marketingEnabled });
    setIsOpen(false);
    setShowDetails(false);
  };

  const openPreferences = () => {
    const savedConsent = readTrackingConsent();
    setAnalyticsEnabled(savedConsent?.analytics ?? false);
    setMarketingEnabled(savedConsent?.marketing ?? false);
    setIsOpen(true);
  };

  if (!isReady) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 z-[10000] mx-auto max-w-4xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.4)] sm:bottom-5 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Çerez tercihlerini kapat"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col gap-5 pr-7 sm:flex-row sm:items-center sm:pr-0">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 sm:flex">
                <Cookie className="h-5 w-5" />
              </div>
              <div>
                <h2 id="cookie-consent-title" className="font-black text-slate-900">Çerez tercihleri</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Zorunlu teknolojiler siteyi çalıştırır. Onay verirseniz Google Analytics ve Meta ile ziyaretleri ve reklam performansını ölçeriz.
                  {' '}<Link href="/gizlilik-politikasi" className="font-bold text-teal-700 underline underline-offset-2">Ayrıntıları inceleyin</Link>.
                </p>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-1 gap-2 sm:min-w-[330px] sm:grid-cols-2">
              <Button variant="outline" className="h-11 rounded-xl border-slate-300 font-bold" onClick={() => choose(false)}>
                Sadece gerekli
              </Button>
              <Button className="h-11 rounded-xl bg-teal-600 font-bold text-white hover:bg-teal-700" onClick={() => choose(true)}>
                Tümünü kabul et
              </Button>
            </div>
          </div>

          {showDetails && (
            <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                <span>
                  <span className="block text-sm font-black text-slate-900">Analitik</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">Ziyaret ve sayfa performansını Google Analytics ile ölçer.</span>
                </span>
                <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} aria-label="Analitik çerezlerini aç veya kapat" />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                <span>
                  <span className="block text-sm font-black text-slate-900">Reklam ölçümü</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">Meta reklamlarının dönüşüm performansını ölçer.</span>
                </span>
                <Switch checked={marketingEnabled} onCheckedChange={setMarketingEnabled} aria-label="Reklam ölçüm çerezlerini aç veya kapat" />
              </label>
              <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setShowDetails(false)}>Vazgeç</Button>
                <Button className="rounded-xl bg-slate-900 font-bold text-white hover:bg-slate-800" onClick={savePreferences}>Tercihleri kaydet</Button>
              </div>
            </div>
          )}

          {!showDetails && (
            <button type="button" onClick={() => setShowDetails(true)} className="mt-4 text-xs font-bold text-slate-500 underline underline-offset-2 hover:text-slate-900">
              Tercihleri ayrı ayrı yönet
            </button>
          )}
        </div>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={openPreferences}
          className="fixed bottom-3 left-3 z-[9998] flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-[11px] font-bold text-slate-600 shadow-lg backdrop-blur transition-colors hover:bg-slate-50 hover:text-slate-900"
          aria-label="Çerez tercihlerini aç"
        >
          <Settings2 className="h-3.5 w-3.5" /> Çerezler
        </button>
      )}
    </>
  );
}
