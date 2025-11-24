import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import { Providers } from '@/components/layout/providers';
import { AIAssistant } from '@/components/ai-assistant';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Türk Çocuk Akademisi | Oyun Tabanlı Türkçe Öğrenimi',
  description: 'Yurt dışındaki çocuklar için oyun tabanlı, eğlenceli ve etkili Türkçe öğrenimi platformu.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
              {children}
            </main>
             <AIAssistant />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
