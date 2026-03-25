'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import { AIAssistant } from '@/components/ai-assistant';
import { PresenceManager } from '@/components/presence-manager';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCocukModu = pathname?.startsWith('/cocuk-modu');
  const isLiveLesson = pathname?.includes('/live-lesson/');
  const isSpecialLayout = pathname?.startsWith('/ogretmen-portali') || pathname?.startsWith('/yonetici');

  const showHeader = !isCocukModu && !isLiveLesson && !isSpecialLayout;
  const showAIAssistant = !isCocukModu && !isLiveLesson && !isSpecialLayout;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PresenceManager />
      {showHeader && <Header />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showAIAssistant && <AIAssistant />}
    </div>
  );
}
