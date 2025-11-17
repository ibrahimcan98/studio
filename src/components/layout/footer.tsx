import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Türk Çocuk Akademisi" width={40} height={40} />
              <span className="font-bold text-xl">Türk Çocuk Akademisi</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Yurt dışındaki çocuklar için oyun tabanlı, eğlenceli ve etkili Türkçe öğrenimi platformu.
            </p>
          </div>
          <div className="md:justify-self-center">
            <h4 className="font-semibold text-lg mb-4">Hızlı Linkler</h4>
            <ul className="space-y-3">
              <li><Link href="#parents" className="text-muted-foreground hover:text-foreground transition-colors">Ebeveyn Portalı</Link></li>
              <li><Link href="#teachers" className="text-muted-foreground hover:text-foreground transition-colors">Öğretmen Portalı</Link></li>
              <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Paketler</Link></li>
            </ul>
          </div>
          <div className="md:justify-self-end">
            <h4 className="font-semibold text-lg mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="text-muted-foreground">info@turkcocukakademisi.com</li>
              <li className="text-muted-foreground">+90 XXX XXX XX XX</li>
            </ul>
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
