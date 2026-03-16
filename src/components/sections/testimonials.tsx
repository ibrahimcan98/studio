
"use client";
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const reviews = [
  {
    name: "FERİT",
    location: "FRANSA",
    review: "Eşim yabancı olduğu için evde hangi dili konuşacağımız konusunda hep bir ikilem yaşadık. Yıllar geçti ve kızımız 7 yaşına geldi. Ben daha yoğun çalıştığım için annesinin dili olan Fransızcayı daha çok duyuyor ve konuşuyor. Bu sebeple Türkçesi gerilemeye başlamıştı. Bir araştırma yaptım ve Türk Çocuk Akademisi ile yollarımız kesişti. Sıcakkanlı öğretmenimiz, kızımızın eğlenerek katıldığı dersler, derslere ilgili hazırlanan oyunlar, bizi arayıp genel gidişatla ilgili bilgilendiren psikolojik danışmanımız bize iyi ki dedirten sebeplerden yalnızca birkaçı. Çok teşekkür ediyoruz. Sevgiler.",
  },
  {
    name: "ÖZGE",
    location: "İNGİLTERE",
    review: "Kızım İngiltere'de doğup büyüdü ve biz hayatın telaşesinden ana dili konuşma konusunu biraz geri plana attık. Son zamanlarda Türkçe konuşmayı direkt reddettiği ve inat ettiği bir noktaya gelmiştik. Arayışta olduğum bir süreçte arkadaşımın tavsiyesiyle Türk Çocuk Akademisi'nden ücretsiz deneme dersi aldım. Rehberlik servisi beni aradı ve görüştük, sorunlarımızı dinledi ve bizi yönlendirdi. Kızım deneme dersinde çekingendi. Ancak üzerine gittik ve ilk birkaç derse katılımını sağladık. Şu an kızım derslere hevesle katılıyor. Türkçe oyunlar oynuyor. Hem dili gelişti hem de ilgisi arttı. Çok doğru bir karar aldığımızı düşünüyoruz ve teşekkür ediyoruz.",
  },
  {
    name: "DENİZ",
    location: "İSVİÇRE",
    review: "12 yaşındaki oğlumun okuma yazma becerilerinin gelişmesi ve daha kaliteli cümleler kurabilmesi için çok çaba sarf ettik. Ben de bir öğretmenim ancak terzi kendi söküğünü dikemiyormuş. Oğlum derslere keyifle katılıyor ve hızlı bir şekilde gelişiyor. Müfredatları harika, eğitim teknolojilerini çok etkin kullanıyorlar. Geri bildirimler gönderiliyor. Çok kaliteli bir eğitim alıyoruz. Kendilerini bu ihtiyacı giderdikleri için tebrik ediyorum ve emekleri için teşekkür ediyorum.",
  },
  {
    name: "K.",
    location: "ALMANYA",
    review: "Oğlum 6 yaşında ve Almanya'da doğup büyüdü. Özellikle okula başladıktan sonra biz evde hep Türkçe konuşmamıza rağmen kendisi bize hep Almanca cevap vermeye başlamıştı. Türkçeyi bir türlü sevdirememiştik. Instagram'da Türk Çocuk Akademisi'ni gördüm ve bir denem dersi planladık. Oğlum ilk derste o kadar eğlendi ki ders biter bitmez tekrar ne zaman yapacağımızı sordu. O günden beri yaklaşık 4 aydır düzenli ders alıyoruz ve artık oğlum büyük bir hevesle Türkçe konuşuyor. Türk Çocuk Akademisi'ne ve öğretmenlerimize minnettarız.",
  },
  {
    name: "SEDA",
    location: "FRANSA",
    review: "Oğlum 3 yaşında ve ne yazık ki babasının dili olan Fransızcayı konuşarak büyüdü. Türkçe konuşmamanın bu şekilde bir dezavantaj olacağını düşünemedik. Yaşı küçük olduğu için ve sıfır Türkçe bildiği için derslere başlarken çekincelerim vardı. Ama dersteki oyunlar, materyaller o kadar ilgi çekici ki çocuğun Türkçe bilmesine gerek kalmıyor. Zaten ortak dil olan oyun ile çocuğu kazanıyorlar. Derslere başlayalı 6 ay oldu, her hafta düzenli devam ediyoruz. Artık oğlumun kelime hazinesi çok gelişti, kendini ifade edebiliyor. Bazen Türkçe oyun oynadığını fark ediyorum. Ne kadar teşekkür etsem az.",
  },
  {
    name: "SÜLEYMAN",
    location: "İNGİLTERE",
    review: "Bir arkadaşımın tavsiyesiyle Türk Çocuk Akademisi ile tanıştık. 12 yaşındaki oğlum için dersler almaya başladık. Okulu çok yoğun olmasına rağmen derslere keyifle katılıyor. İleri düzeyde Türkçesini geliştirdi ve artık farklı konularda Türkçe olarak konuşuyor, okuyor. Çok teşekkür ederiz.",
  },
  {
    name: "BİR VELİ",
    location: "AVRUPA",
    review: "İki kızım için 2023 yılının başından beri düzenli dersler alıyoruz. Tüm aile üyelerimiz her telefonla konuşmamızda Türkçelerinin ne kadar geliştiğiyle ilgili olumlu yorumlarda bulunuyor. Öğretmenlerimiz çok sevimli ve içten, psikolojik danışmanımız Ebru hanım çok bilgilendirici ve ilgili, dersler çok keyifli. Çok teşekkür ediyoruz.",
  },
];

export default function Testimonials() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-b from-white to-amber-50/30 overflow-hidden">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px]">Ebeveyn Deneyimleri</Badge>
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight text-slate-900">Ebeveynler Ne Diyor?</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Dünyanın dört bir yanındaki binlerce mutlu aile bizimle Türkçe öğreniyor.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-12">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="pl-4 basis-full">
                  <Card className="h-full border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[40px] overflow-hidden group transition-all duration-500">
                    <CardContent className="p-8 md:p-12 flex flex-col h-full items-center text-center">
                      <Quote className="w-12 h-12 text-primary/10 mb-6" />
                      
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      <p className="text-slate-700 leading-relaxed text-lg md:text-xl font-medium mb-10 italic">
                        “{review.review}”
                      </p>
                      
                      <div className="flex flex-col items-center gap-4 pt-8 border-t border-slate-100 w-full max-w-xs">
                        <Avatar className="h-16 w-16 ring-4 ring-primary/5">
                          <AvatarFallback className="bg-primary/10 text-primary font-black text-xl uppercase">
                            {review.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-slate-900 text-sm uppercase tracking-wider">{review.name}</p>
                          <p className="text-[11px] font-bold text-primary uppercase tracking-widest mt-1">{review.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-16 h-12 w-12 rounded-full border-2 border-slate-100 bg-white shadow-xl text-slate-400 hover:text-primary hover:border-primary transition-all" />
              <CarouselNext className="-right-16 h-12 w-12 rounded-full border-2 border-slate-100 bg-white shadow-xl text-slate-400 hover:text-primary hover:border-primary transition-all" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-16 text-center">
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Siz de aramıza katılın, çocuğunuzun değişimine tanık olun</p>
        </div>
      </div>
    </section>
  );
}
