"use client";
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs">
              Yurt dışındaki çocuklar için oyun tabanlı, eğlenceli ve etkili Türkçe öğrenimi platformu.
            </p>
          </div>
          <div className="md:justify-self-center">
            <h4 className="font-semibold text-lg mb-4">Hızlı Linkler</h4>
            <ul className="space-y-3">
              <li><Link href="/ebeveyn-portali" className="text-muted-foreground hover:text-foreground transition-colors">Ebeveyn Portalı</Link></li>
              <li><Link href="/ogretmen-giris" className="text-muted-foreground hover:text-foreground transition-colors">Öğretmen Portalı</Link></li>
              <li><Link href="/kurslar" className="text-muted-foreground hover:text-foreground transition-colors">Kurslar</Link></li>
            </ul>
          </div>
          <div className="md:justify-self-end">
            <h4 className="font-semibold text-lg mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="text-muted-foreground">
                <a href="mailto:iletisim@turkcocukakademisi.com" className="hover:text-foreground transition-colors">iletisim@turkcocukakademisi.com</a>
              </li>
              <li className="text-muted-foreground">
                <a href="tel:+905058029734" className="hover:text-foreground transition-colors">+90 505 802 97 34</a>
              </li>
            </ul>
            <div className="flex items-center justify-start gap-6 pt-4">
              <a 
                href="https://www.instagram.com/turkcocukakademisi/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#E4405F] transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=100088408140323" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#1877F2] transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Türk Çocuk Akademisi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
