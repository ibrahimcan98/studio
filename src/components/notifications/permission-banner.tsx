'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, BellRing, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { db, doc } from '@/firebase';
import { cn } from '@/lib/utils';

export function PermissionBanner() {
  const { permission, requestPermission } = useNotifications();
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Fetch user role from Firestore
  const userDocRef = useMemoFirebase(() => (user && db) ? doc(db, 'users', user.uid) : null, [user, db]);
  const { data: userData } = useDoc(userDocRef);

  const isAdmin = userData?.role === 'admin';
  const isTeacher = userData?.role === 'teacher';

  const PRIMARY_ADMIN_EMAILS = [
    'iletisim@turkcocukakademisi.com',
    'tubakodak@turkcocukakademisii.com'
  ];
  const isPrimaryAdmin = user?.email && PRIMARY_ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    // Show only if:
    // 1. Permission is default (not granted/blocked)
    // 2. User is logged in
    if (permission === 'default' && user && userData) {
      
      // PERSISTENCE LOGIC:
      // If primary admin -> always show (ignore dismissal)
      if (isPrimaryAdmin) {
        const timer = setTimeout(() => setIsVisible(true), 1500); 
        return () => clearTimeout(timer);
      }

      // If others (Parent/Teacher) -> show every 24 hours if dismissed
      const lastDismissedAt = localStorage.getItem('notification-banner-dismissed-at');
      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (!lastDismissedAt || (now - parseInt(lastDismissedAt)) > twentyFourHours) {
        const timer = setTimeout(() => setIsVisible(true), 3000); 
        return () => clearTimeout(timer);
      }
    }
  }, [permission, user, userData, isPrimaryAdmin]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Store timestamp of dismissal
    localStorage.setItem('notification-banner-dismissed-at', new Date().getTime().toString());
  };

  const handleEnable = async () => {
    await requestPermission();
    setIsVisible(false);
  };

  if (!isVisible || isDismissed) return null;

  const content = {
    title: isAdmin 
      ? 'Yeni kayıtları kaçırmayın!' 
      : (isTeacher ? 'Derslerinizi unutmayın!' : 'Ders hatırlatıcılarını açın!'),
    body: isAdmin
      ? 'Yeni veli kayıtlarından ve ders iptallerinden anında haberdar olun.'
      : (isTeacher ? 'Derslerinize 10 dakika kala ve yeni rapor hatırlatmaları için bildirimleri açın.' : 'Ders saatinize 10 dakika kala size hatırlatma göndermemize izin verin.'),
    button: 'Bildirimleri Aç'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 inset-x-4 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 z-[100] lg:w-full max-w-lg mx-auto"
      >
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-[32px] p-6 flex flex-col sm:flex-row items-center gap-5 ring-1 ring-black/5">
          {/* Background Decorative Element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="bg-primary/10 p-3 rounded-2xl shrink-0">
            <BellRing className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="font-bold text-slate-900 text-lg flex items-center justify-center sm:justify-start gap-2">
              {content.title} <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {content.body}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              onClick={handleEnable}
              className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl px-6 h-12 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              {content.button}
            </Button>
            <button 
              onClick={handleDismiss}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
