
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
  
  // Determine if the header should be displayed based on the route
  const showHeader = !pathname.startsWith('/ogretmen-portali') && 
                     !pathname.startsWith('/cocuk-modu') &&
                     !pathname.startsWith('/yonetici');

  return (
    <html lang="tr">
      <body className={`${poppins.className} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-background">
            {showHeader && <Header />}
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
