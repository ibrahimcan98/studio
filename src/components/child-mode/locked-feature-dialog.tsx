
'use client';

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Volume2 } from "lucide-react";
import { PatiAvatar } from "./pati-avatar";
import { motion } from "framer-motion";
import { useTTS } from "@/hooks/use-tts";
import { useEffect } from "react";

interface LockedFeatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LockedFeatureDialog({ isOpen, onClose }: LockedFeatureDialogProps) {
  const { speak, stop, isPlaying } = useTTS();
  const message = "Daha fazla oyun oynamak istersen annene veya babana Türk Çocuk Akademisi'nde çok daha fazla oyun oynamak istiyorum diyebilirsin!";

  useEffect(() => {
    if (isOpen) {
      // Hafif bir gecikme ile Pati'nin konuşmasını sağla
      const timer = setTimeout(() => {
        speak(message);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      stop();
    }
  }, [isOpen, speak, stop, message]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[50px] p-0 overflow-hidden border-none bg-transparent shadow-none z-[2000]">
        <DialogTitle className="sr-only">Kilitli Bölüm</DialogTitle>
        <div className="bg-white p-8 md:p-12 flex flex-col items-center text-center relative">
          {/* Süslemeler */}
          <div className="absolute top-4 left-4 text-pink-200"><Heart className="w-8 h-8 fill-current" /></div>
          <div className="absolute top-12 right-8 text-sky-200 rotate-12"><Sparkles className="w-10 h-10" /></div>
          
          <div className="relative w-40 h-40 mb-6 bg-sky-50 rounded-full p-4 border-4 border-white shadow-inner">
            <PatiAvatar emotion="happy" isSpeaking={isPlaying} />
          </div>

          <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase italic tracking-tighter leading-tight">
            Yeni Maceralar Seni Bekliyor! 🚀
          </h2>

          <div className="bg-slate-50 p-6 rounded-[35px] border-2 border-slate-100 mb-8">
            <p className="text-lg md:text-xl font-bold text-slate-600 leading-relaxed italic">
              "Daha fazla oyun oynamak istersen annene veya babana <span className="text-purple-600 font-black">Türk Çocuk Akademisi</span>'nde çok daha fazla oyun oynamak istiyorum diyebilirsin! ✨"
            </p>
          </div>

          <Button 
            onClick={onClose}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-8 rounded-[25px] text-xl shadow-xl transition-all active:scale-95 border-b-[6px] border-emerald-700 uppercase tracking-widest italic"
          >
            TAMAM PATİ! 👋
          </Button>

          <p className="mt-6 text-slate-400 font-black text-xs uppercase tracking-widest">Görüşmek Üzere Arkadaşım!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
