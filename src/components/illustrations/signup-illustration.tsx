'use client';

import { Compass, TrendingUp, Puzzle, Link2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function SignUpIllustration() {
  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-2xl mx-auto p-4 font-sans">
      {/* Ana Başlık */}
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-black text-slate-800 text-center leading-[1.1] px-4"
      >
        Çocuğunuzun Türkçe Serüveni <br/>
        <span className="text-primary italic">Burada Başlıyor!</span>
      </motion.h2>

      <div className="relative w-full aspect-square max-w-[500px]">
        {/* Hareketli Yörüngeler */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[100%] h-[100%] border-2 border-dashed border-slate-200 rounded-full animate-[spin_60s_linear_infinite] opacity-50" />
          <div className="absolute w-[75%] h-[75%] border border-dotted border-slate-200 rounded-full animate-[spin_40s_linear_infinite_reverse] opacity-50" />
        </div>

        {/* MERKEZ: TÜRK BAYRAĞI (Boyutu küçültüldü ve sağa kaydırıldı) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-1/2 z-30">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-[0_20px_60px_rgba(239,68,68,0.4)] flex items-center justify-center p-1 border-4 border-white overflow-hidden"
          >
            <div className="relative w-full h-full rounded-full overflow-hidden bg-red-600">
               <Image 
                  src="/turkbayragi.png" 
                  alt="Türk Bayrağı"
                  fill
                  className="object-contain p-2"
                  priority
                />
            </div>
          </motion.div>
        </div>

        {/* 1. ÜST: PUSULA & BAYRAK (Yörünge Üstünde) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 flex flex-col items-center gap-2 z-20">
          <div className="w-16 h-16 bg-white rounded-[24px] shadow-xl border-2 border-blue-50 flex items-center justify-center transition-all hover:scale-110">
            <div className="relative">
              <Compass className="w-9 h-9 text-blue-500" />
              <div className="absolute -top-3 -right-3 shadow-sm rounded-sm bg-white overflow-hidden w-6 h-4 border border-slate-100 flex items-center justify-center">
                <Image src="/turkbayragi.png" alt="Bayrak" width={16} height={10} className="object-cover" />
              </div>
            </div>
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Köklerini Keşfet</p>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Kimliğini Bul</p>
          </div>
        </div>

        {/* 2. SAĞ: YÜKSELEN OK (Yörünge Üstünde) */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 flex flex-col items-center gap-2 z-20">
          <div className="w-16 h-16 bg-white rounded-full shadow-xl border-2 border-orange-50 flex items-center justify-center transition-all hover:scale-110">
            <TrendingUp className="w-9 h-9 text-orange-500" />
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Gelişimi Takip Et</p>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Yüksel</p>
          </div>
        </div>

        {/* 3. SOL: YAPBOZ PARÇASI (Yörünge Üstünde) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 flex flex-col items-center gap-2 z-20">
          <div className="w-16 h-16 bg-white rounded-full shadow-xl border-2 border-green-50 flex items-center justify-center transition-all hover:scale-110">
            <Puzzle className="w-9 h-9 text-green-500" />
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-green-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Eğlenerek Tamamla</p>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Bütünsel Eğitim</p>
          </div>
        </div>

        {/* 4. ALT: HALKA & KALP (Yörünge Üstünde) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 flex flex-col items-center gap-2 z-20">
          <div className="w-16 h-16 bg-white rounded-full shadow-xl border-2 border-red-50 flex items-center justify-center transition-all hover:scale-110">
            <div className="relative">
              <Link2 className="w-9 h-9 text-red-500" />
              <Heart className="w-5 h-5 text-red-500 fill-current absolute -bottom-1 -right-1" />
            </div>
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-red-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Türkiye ile Bağ Kur</p>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Kültürel Aidiyet</p>
          </div>
        </div>
      </div>
    </div>
  );
}