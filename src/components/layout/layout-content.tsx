'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import { AIAssistant } from '@/components/ai-assistant';
import { PresenceManager } from '@/components/presence-manager';
import { useNotifications } from '@/hooks/use-notifications';
import { useEffect } from 'react';

import { PermissionBanner } from '@/components/notifications/permission-banner';
import { EmailVerificationModal } from '@/components/auth/email-verification-modal';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCocukModu = pathname?.startsWith('/cocuk-modu');
  const isLiveLesson = pathname?.includes('/live-lesson/');
  const isSpecialLayout = pathname?.startsWith('/ogretmen-portali') || pathname?.startsWith('/yonetici');
  
  // Initialize notifications
  const { permission, requestPermission } = useNotifications();

  const showHeader = !isCocukModu && !isLiveLesson && !isSpecialLayout;
  const showAIAssistant = !isCocukModu && !isLiveLesson && !isSpecialLayout;

  return (
    <div className="flex min-h-screen flex-col w-full max-w-[100vw] overflow-x-hidden bg-background relative">
      <PresenceManager />
      {showHeader && <Header />}
      
      <main className="flex-1 w-full relative">
        <EmailVerificationModal />
        {children}
      </main>
      
      <PermissionBanner />
      {showAIAssistant && <AIAssistant />}
    </div>
  );
}
