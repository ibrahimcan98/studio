
'use client'; // Add this directive to make the whole file a Client Component

import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import { Providers } from '@/components/layout/providers';
import { AIAssistant } from '@/components/ai-assistant';
import Script from 'next/script';
import { useUser } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, getFirestore } from 'firebase/firestore';
import { useMemo } from 'react';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});


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
