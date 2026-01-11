'use client';

import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import { Providers } from '@/components/layout/providers';
import { AIAssistant } from '@/components/ai-assistant';
import { usePathname } from 'next/navigation';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isLiveLesson = pathname?.includes('/live-lesson/');
  const isSpecialLayout = pathname?.startsWith('/ogretmen-portali') || pathname?.startsWith('/yonetici');

  const showHeader = !isLiveLesson && !isSpecialLayout;
  const showAIAssistant = !isLiveLesson && !isSpecialLayout;


  return (
    <html lang="tr">
      <body className={`${poppins.className} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-background">
            {showHeader && <Header />}
            
            <main className="flex-1">
              {children}
            </main>
            
            {showAIAssistant && <AIAssistant />}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
