"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { PlaceHolderImages } from "@/lib/placeholder-images";

const reviews = [
  {
    name: "Ayşe K.",
    location: "Berlin, Almanya",
    review: "Kızım her dersi sabırsızlıkla bekliyor. Öğrenme süreci o kadar eğlenceli ki, farkında olmadan Türkçe konuşmaya başladı!",
    avatarId: "avatar-1",
  },
  {
    name: "Mehmet B.",
    location: "Amsterdam, Hollanda",
    review: "Çocuk modu gerçekten güvenli ve reklamsız. Gönül rahatlığıyla çocuğumun platformu kullanmasına izin veriyorum.",
    avatarId: "avatar-2",
  },
  {
    name: "Zeynep A.",
    location: "Londra, İngiltere",
    review: "Öğretmenler harika, çok yardımcı oluyorlar. Çocuğumun gelişimini aile panelinden takip etmek de büyük kolaylık.",
    avatarId: "avatar-3",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Ebeveynler Ne Diyor?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Binlerce mutlu aile bizimle Türkçe öğreniyor.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => {
            const avatarImage = PlaceHolderImages.find(img => img.id === review.avatarId);
            return (
              <Card key={review.name} className="p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <CardContent className="p-0 space-y-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}
                  </div>
                  <p className="text-foreground leading-relaxed">“{review.review}”</p>
                </CardContent>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                  {avatarImage && (
                    <Avatar>
                      <AvatarImage src={avatarImage.imageUrl} alt={review.name} data-ai-hint={avatarImage.imageHint} />
                      <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.location}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
