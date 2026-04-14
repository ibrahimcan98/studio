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
  title: {
    default: 'Türk Çocuk Akademisi | Yurt Dışındaki Çocuklar İçin Türkçe Eğitimi',
    template: '%s | Türk Çocuk Akademisi'
  },
  description: 'Yurt dışında yaşayan çocuklar için oyun tabanlı, eğlenceli ve interaktif Türkçe öğrenim platformu. Uzman eğitmenlerle online dersler ve modern eğitim materyalleri.',
  keywords: [
    'türkçe öğrenimi', 'yurt dışı türkçe kursu', 'çocuklar için türkçe', 'online türkçe dersi', 
    'türk çocuk akademisi', 'interaktif türkçe eğitimi', 'türkçe öğrenen çocuklar', 
    'avrupa türkçe kursu', 'almanya türkçe dersi', 'ingiltere türkçe dersi', 
    'amerika türkçe dersi', 'uzaktan türkçe eğitimi'
  ],
  authors: [{ name: 'Türk Çocuk Akademisi' }],
  creator: 'Türk Çocuk Akademisi',
  publisher: 'Türk Çocuk Akademisi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://turkcocukakademisi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Türk Çocuk Akademisi | Eğlenceli Türkçe Öğrenimi',
    description: 'Yurt dışındaki çocuklar için özel olarak tasarlanmış, oyun tabanlı online Türkçe eğitim platformu.',
    url: 'https://turkcocukakademisi.com',
    siteName: 'Türk Çocuk Akademisi',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/anasayfa.png',
        width: 1200,
        height: 630,
        alt: 'Türk Çocuk Akademisi - Çocuklar İçin Türkçe Eğitimi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Türk Çocuk Akademisi | Çocuklar İçin Türkçe Kursu',
    description: 'Yurt dışındaki çocuklar için oyunlarla Türkçe öğrenimi!',
    images: ['/anasayfa.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'bBK7lLnYTATVu73DD354P6RIbFXRXh0HEG_5CyKRj6o',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Türk Çocuk Akademisi",
              "url": "https://turkcocukakademisi.com",
              "logo": "https://turkcocukakademisi.com/logo.png",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=100088408140323",
                "https://www.instagram.com/turkcocukakademisi/"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+90-505-802-9734",
                "contactType": "customer service",
                "email": "iletisim@turkcocukakademisi.com"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Türk Çocuk Akademisi",
              "url": "https://turkcocukakademisi.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://turkcocukakademisi.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
