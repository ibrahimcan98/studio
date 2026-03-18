
'use client';

import { Compass, TrendingUp, Puzzle, Link2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
          <div className="absolute w-[75%] h-[72%] border border-dotted border-slate-200 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        </div>

        {/* Merkez: Türk Bayrağı (Z-30 en üstte) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-32 h-32 rounded-full bg-white shadow-[0_20px_50px_rgba(239,68,68,0.3)] flex items-center justify-center p-1 border-4 border-white overflow-hidden"
          >
            <div className="relative w-full h-full rounded-full overflow-hidden">
               <Image 
                  src="/turkbayragi.png" 
                  alt="Türk Bayrağı"
                  fill
                  className="object-cover scale-125"
                />
            </div>
          </motion.div>
        </div>

        {/* 1. Üst: Pusula & Bayrak (Keşif & Kimlik) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 flex flex-col items-center gap-2 z-20">
          <div className="w-14 h-14 bg-white rounded-[20px] shadow-xl border-2 border-blue-50 flex items-center justify-center transition-all hover:scale-110 hover:-rotate-6">
            <div className="relative">
              <Compass className="w-8 h-8 text-blue-500" />
              <div className="absolute -top-3 -right-3 text-sm shadow-sm rounded-full bg-white px-0.5 overflow-hidden w-6 h-4 border border-slate-100 flex items-center justify-center">
                <Image src="/turkbayragi.png" alt="Bayrak" width={16} height={10} className="object-cover" />
              </div>
            </div>
          </div>
          <div className="text-center bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-lg border border-blue-100 min-w-[140px]">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Köklerini Keşfet</p>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Kimliğini Bul</p>
          </div>
        </div>

        {/* 2. Sağ: Yükselen Ok (Gelişim & Başarı) */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-10 flex flex-row items-center z-10">
          <div className="text-right bg-white/95 backdrop-blur-md pl-4 pr-10 py-1.5 rounded-2xl shadow-lg border border-orange-100 min-w-[160px] -mr-6">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Gelişimi Takip Et</p>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Yüksel</p>
          </div>
          <div className="w-14 h-14 bg-white rounded-[20px] shadow-xl border-2 border-orange-50 flex items-center justify-center transition-all hover:scale-110 hover:rotate-6 shrink-0 relative z-20">
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        {/* 3. Sol: Yapboz Parçası (Bütünsel & Eğlenceli) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-10 flex flex-row items-center z-10">
          <div className="w-14 h-14 bg-white rounded-[20px] shadow-xl border-2 border-green-50 flex items-center justify-center transition-all hover:scale-110 hover:-rotate-6 shrink-0 relative z-20">
            <Puzzle className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-left bg-white/95 backdrop-blur-md pr-4 pl-10 py-1.5 rounded-2xl shadow-lg border border-green-100 min-w-[160px] -ml-6">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Eğlenerek Tamamla</p>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Bütünsel Eğitim</p>
          </div>
        </div>

        {/* 4. Alt: Halka & Kalp (Bağ & Aidiyet) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 flex flex-col items-center gap-2 z-20">
          <div className="w-14 h-14 bg-white rounded-[20px] shadow-xl border-2 border-red-50 flex items-center justify-center transition-all hover:scale-110 hover:rotate-6">
            <div className="relative">
              <Link2 className="w-8 h-8 text-red-500" />
              <Heart className="w-4 h-4 text-red-500 fill-current absolute -bottom-1 -right-1" />
            </div>
          </div>
          <div className="text-center bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-lg border border-red-100 min-w-[140px]">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Türkiye ile Bağ Kur</p>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Kültürel Aidiyet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
