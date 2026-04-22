
'use client';

import { useEffect } from 'react';
import * as Sentry from "@sentry/nextjs";
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw, Home, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
    console.error('Sistem Hatası:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/50 p-6 text-center font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-xl"
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 text-red-500 shadow-xl shadow-red-100">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500" 
            />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Hay Aksı! <br /><span className="text-red-600">Bir Hata Oluştu</span>
        </h1>
        
        <p className="mb-4 text-lg font-medium text-slate-500">
          Uygulama düzgün çalışırken beklenmedik bir sorunla karşılaştı. 
          Teknik ekibimize (Sentry üzerinden) durum bildirildi.
        </p>

        {error.digest && (
          <div className="mb-10 inline-block rounded-xl bg-slate-100 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-slate-400">
            HATA KODU: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => reset()}
            className="h-14 w-full sm:w-auto rounded-2xl bg-primary px-8 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Tekrar Dene
          </Button>
          
          <Button 
            className="h-14 w-full sm:w-auto rounded-2xl bg-slate-900 px-8 text-sm font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
            onClick={() => window.location.href = '/'}
          >
            <Home className="mr-2 h-4 w-4" /> Ana Sayfa
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
            <MessageCircle className="h-4 w-4" />
            Sorun devam ederse lütfen bizimle iletişime geçin.
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-10">
        <div className="absolute -left-1/4 top-0 h-1/2 w-1/2 rounded-full bg-red-200 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-1/2 w-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>
    </div>
  );
}
