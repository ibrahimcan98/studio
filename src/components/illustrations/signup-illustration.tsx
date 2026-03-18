
'use client';

import { Compass, TrendingUp, Puzzle, Link2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignUpIllustration() {
  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-xl mx-auto p-4 font-sans">
      {/* Ana Başlık */}
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-black text-slate-800 text-center leading-[1.1] px-4"
      >
        Çocuğunuzun Türkçe Serüveni <br/>
        <span className="text-primary italic">Burada Başlıyor!</span>
      </motion.h2>

      <div className="relative w-full aspect-square max-w-[420px]">
        {/* Hareketli Yörüngeler */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[100%] h-[100%] border-2 border-dashed border-slate-200 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[72%] h-[72%] border border-dotted border-slate-200 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        </div>

        {/* Merkez: Kırmızı Kalpli Türk Bayrağı */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-32 h-32 rounded-full bg-white shadow-[0_20px_50px_rgba(239,68,68,0.3)] flex items-center justify-center p-4 border-4 border-red-50"
          >
            <div className="relative w-full h-full bg-red-600 rounded-full flex items-center justify-center overflow-hidden">
              <Heart className="absolute w-16 h-16 text-white/20 fill-white" />
              <span className="text-5xl relative z-10">🇹🇷</span>
            </div>
          </motion.div>
        </div>

        {/* 1. Üst: Pusula & Bayrak (Keşif & Kimlik) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-[24px] shadow-xl border-2 border-blue-50 flex items-center justify-center transition-all hover:scale-110 hover:-rotate-6">
            <div className="relative">
              <Compass className="w-9 h-9 text-blue-500" />
              <div className="absolute -top-2 -right-2 text-sm shadow-sm rounded-full bg-white px-0.5">🇹🇷</div>
            </div>
          </div>
          <div className="text-center bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-lg border border-blue-100 min-w-[150px]">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Köklerini Keşfet</p>
            <p className="text-[9px] font-bold text-primary uppercase">Kimliğini Bul</p>
          </div>
        </div>

        {/* 2. Sağ: Merdiven & Yükselen Ok (Gelişim & Başarı) */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 flex flex-row items-center gap-4">
          <div className="text-right bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-lg border border-orange-100 min-w-[150px]">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Gelişimi Takip Et</p>
            <p className="text-[9px] font-bold text-primary uppercase">Yüksel</p>
          </div>
          <div className="w-16 h-16 bg-white rounded-[24px] shadow-xl border-2 border-orange-50 flex items-center justify-center transition-all hover:scale-110 hover:rotate-6">
            <TrendingUp className="w-9 h-9 text-orange-500" />
          </div>
        </div>

        {/* 3. Sol: Yapboz Parçası (Bütünsel & Eğlenceli) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 flex flex-row items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-[24px] shadow-xl border-2 border-green-50 flex items-center justify-center transition-all hover:scale-110 hover:-rotate-6">
            <Puzzle className="w-9 h-9 text-green-500" />
          </div>
          <div className="text-left bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-lg border border-green-100 min-w-[150px]">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Eğlenerek Tamamla</p>
            <p className="text-[9px] font-bold text-primary uppercase">Bütünsel Eğitim</p>
          </div>
        </div>

        {/* 4. Alt: İki Bağlı Halka & Kalp (Bağ & Aidiyet) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-[24px] shadow-xl border-2 border-red-50 flex items-center justify-center transition-all hover:scale-110 hover:rotate-6">
            <div className="relative">
              <Link2 className="w-9 h-9 text-red-500" />
              <Heart className="w-5 h-5 text-red-500 fill-current absolute -bottom-1 -right-1" />
            </div>
          </div>
          <div className="text-center bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-lg border border-red-100 min-w-[150px]">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Türkiye ile Bağ Kur</p>
            <p className="text-[9px] font-bold text-primary uppercase">Kültürel Aidiyet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
