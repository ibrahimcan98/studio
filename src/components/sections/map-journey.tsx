'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock, Cat, Palette, Home, Users, Utensils, MapPin, Sparkles } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

const topics = [
  { name: "Hayvanlar", icon: <Cat className="w-6 h-6"/>, unlocked: true },
  { name: "Renkler", icon: <Palette className="w-6 h-6"/>, unlocked: true },
  { name: "Ev", icon: <Home className="w-6 h-6"/>, unlocked: true },
  { name: "Aile", icon: <Users className="w-6 h-6"/>, unlocked: false },
  { name: "Yemekler", icon: <Utensils className="w-6 h-6"/>, unlocked: false },
  { name: "Türkiye", icon: <MapPin className="w-6 h-6"/>, unlocked: false },
];

export default function MapJourney() {
  const { user } = useUser();
  const router = useRouter();

  const handleChildModeClick = () => {
    if (user) {
      router.push('/ebeveyn-portali');
    } else {
      router.push('/login');
    }
  };

  return (
    <section id="map-journey" className="py-20 md:py-28">
      <div className="container grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Renkli Harita Yolculuğu</h2>
          <p className="text-lg text-muted-foreground">
            Her konu eğlenceli bir macera! Çocuğunuz haritada ilerlerken Türkçe öğrenecek.
          </p>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span>Her konuda 1 ücretsiz ders</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span>Tamamla → +10 XP kazan</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span>Hikâye ve şarkılar ilerledikçe açılır</span>
            </li>
          </ul>
          <Button size="lg" className="font-bold" onClick={handleChildModeClick}>
            <Sparkles className="mr-2 h-5 w-5"/>
            Çocuk Modunu Gör
          </Button>
        </div>
        <div className="flex justify-center items-center">
          <Card className="p-6 relative bg-gray-50 rounded-2xl shadow-inner overflow-hidden w-full max-w-md">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M50 40 C 150 120, 50 220, 150 300 S 250 380, 350 450" stroke="hsl(var(--primary))" fill="transparent" strokeWidth="4" strokeDasharray="10 10"/>
              </svg>
            </div>
            <div className="relative space-y-4">
              <h3 className="font-bold text-center text-xl mb-6">Öğrenme Macerası</h3>
              {topics.map((topic) => (
                <Card key={topic.name} className={`flex items-center justify-between p-4 rounded-xl shadow-md transition-all hover:scale-105 ${topic.unlocked ? 'bg-white' : 'bg-muted'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${topic.unlocked ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                      {topic.icon}
                    </div>
                    <span className={`font-semibold ${!topic.unlocked && 'text-muted-foreground'}`}>{topic.name}</span>
                  </div>
                  {topic.unlocked ? (
                    <div className="text-green-500"><CheckCircle2 className="w-6 h-6" /></div>
                  ) : (
                    <div className="text-muted-foreground"><Lock className="w-6 h-6" /></div>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}