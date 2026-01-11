
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-child');
  const router = useRouter();

  const handleCtaClick = () => {
    router.push('/register');
  };

  return (
    <section className="relative w-full bg-amber-50/50 overflow-x-clip">
      <div className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter font-headline">
            Oyun Tabanlı Türkçe Öğrenimi
          </h1>
          <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-muted-foreground">
            Duolingo tarzı harita, canlı dersler ve aile paneliyle güvenli, eğlenceli ve etkili.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="font-bold text-base md:text-lg h-12 md:h-14" onClick={handleCtaClick}>Ücretsiz Deneme Dersini Hemen Planla</Button>
          </div>
        </div>
        <div className="relative flex justify-center h-full min-h-[400px] lg:min-h-[600px]">
          <div className="relative w-[300px] h-[400px] lg:w-[450px] lg:h-[600px]">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="rounded-3xl object-cover shadow-2xl transform rotate-3"
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <Card className="absolute -top-6 -left-10 transform -rotate-12 bg-accent/90 backdrop-blur-sm p-3 shadow-lg">
              <p className="text-2xl font-bold text-accent-foreground">+50 XP</p>
            </Card>
            <Card className="absolute -bottom-6 -right-8 transform rotate-12 bg-secondary/90 backdrop-blur-sm p-4 shadow-lg flex items-center gap-2">
              <PartyPopper className="text-secondary-foreground" />
              <p className="font-bold text-secondary-foreground">Konu tamamlandı!</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
