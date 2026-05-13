'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import Image from 'next/image';
import { Sparkles, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BadgeUnlockModalProps {
  badge: {
    name: string;
    description: string;
    icon: string;
  } | null;
  onClose: () => void;
}

export function BadgeUnlockModal({ badge, onClose }: BadgeUnlockModalProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (badge) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-blue-900/40 backdrop-blur-md"
        />

        {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 100 }}
          className="relative bg-white rounded-[50px] p-8 md:p-12 shadow-2xl max-w-sm w-full text-center border-b-[12px] border-slate-200"
        >
          {/* Parıltı Efekti */}
          <div className="absolute inset-0 overflow-hidden rounded-[50px] pointer-events-none">
            <div className="absolute -inset-[100%] animate-[spin_10s_linear_infinite] opacity-20 bg-[conic-gradient(from_0deg,transparent,white,transparent,white,transparent)]" />
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-amber-400 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-2">Yeni Rozet Kazandın!</h2>
            <h1 className="text-4xl font-black text-slate-800 mb-6 uppercase italic tracking-tighter">
              {badge.name}
            </h1>

            <div className="relative w-48 h-48 mx-auto mb-8 drop-shadow-[0_20px_40px_rgba(168,85,247,0.2)]">
              <motion.div
                className="relative w-full h-full"
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Image src={badge.icon} fill alt={badge.name} className="object-contain" priority />
              </motion.div>
            </div>

            <p className="text-slate-500 font-bold mb-10 leading-relaxed px-4">
              {badge.description}
            </p>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[25px] text-xl shadow-xl transition-all active:scale-95 border-b-[6px] border-blue-800 flex items-center justify-center gap-3 group"
            >
              HARİKASIN! <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
