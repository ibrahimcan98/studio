import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Providers } from '@/components/layout/providers';
import { LayoutContent } from '@/components/layout/layout-content';
import { Metadata } from 'next';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'Türk Çocuk Akademisi',
  description: 'Yurt dışındaki çocuklar için oyun tabanlı, eğlenceli ve etkili Türkçe öğrenimi platformu.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <LayoutContent>
            {children}
          </LayoutContent>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
