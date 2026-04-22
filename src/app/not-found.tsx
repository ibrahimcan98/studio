
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Logo } from '@/components/logo';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/50 p-6 text-center font-sans">
      <div className="absolute top-10 flex w-full justify-center opacity-40">
        <Logo />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg"
      >
        {/* Floating Background Circles */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />

        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-[40px] bg-white shadow-2xl shadow-primary/10">
              <Search className="h-16 w-16 text-primary/30" />
            </div>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-white shadow-lg"
            >
              404
            </motion.div>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-800 sm:text-5xl">
          Aradığınız Sayfa <br /><span className="text-primary italic">Bulunamadı</span>
        </h1>
        
        <p className="mb-10 text-lg font-medium text-slate-500 leading-relaxed">
          Görünüşe göre bu sayfa ya taşınmış, ya silinmiş ya da hiç var olmamış. 
          Endişelenmeyin, akademimize geri dönmek sadece bir tık uzağınızda!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            className="h-14 w-full sm:w-auto rounded-2xl bg-slate-900 px-8 text-sm font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="h-14 w-full sm:w-auto rounded-2xl border-2 border-slate-200 bg-white px-8 text-sm font-black uppercase tracking-widest transition-all hover:bg-slate-50 hover:scale-105 active:scale-95"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Ana Sayfa
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 opacity-20">
            <div className="h-2 rounded-full bg-primary w-full" />
            <div className="h-2 rounded-full bg-secondary w-full" />
            <div className="h-2 rounded-full bg-accent w-full" />
        </div>
      </motion.div>

      {/* Decorative Ornaments */}
      <div className="pointer-events-none fixed left-10 top-1/4 select-none opacity-20 mix-blend-multiply">
        <div className="h-32 w-32 rounded-full border-[20px] border-primary" />
      </div>
      <div className="pointer-events-none fixed right-20 bottom-1/4 select-none opacity-20 mix-blend-multiply">
        <div className="h-24 w-24 rotate-45 border-[15px] border-secondary" />
      </div>
    </div>
  );
}
