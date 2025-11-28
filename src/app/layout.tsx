import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import { Providers } from '@/components/layout/providers';
import { AIAssistant } from '@/components/ai-assistant';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});

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
      <body className={`${poppins.className} antialiased`}>
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
