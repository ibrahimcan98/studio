
"use client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Gamepad2, 
  Brain, 
  Globe, 
  HeartPulse, 
  GraduationCap, 
  CalendarClock, 
  LayoutDashboard, 
  FileText, 
  Package 
} from "lucide-react";

const features = [
  {
    icon: <Gamepad2 className="w-8 h-8 text-primary" />,
    title: "Canlı ve Oyun Odaklı Dersler",
    description: "Tamamen birebir ve interaktif. Çocuğunuzun ilgisini canlı tutan, oyunlaştırılmış bir kurguyla işlenen eğlenceli canlı ders deneyimi.",
  },
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "Bilimsel Temelli Özel Müfredat",
    description: "Pedagojik standartlara uyumlu, 4 farklı gelişimsel evreye göre yapılandırılmış; sadece dil değil, beceri ve mantık odaklı özgün eğitim planı.",
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Kültürel Dersler",
    description: "Milli bayramlar, Atatürk değerleri, Türk coğrafyası ve geleneklerimizle çocuğunuzun kökleriyle olan bağını güçlendiren özel içerikler.",
  },
  {
    icon: <HeartPulse className="w-8 h-8 text-primary" />,
    title: "7/24 Rehberlik ve PDR Desteği",
    description: "Çocuğunuzun gelişim sürecinde mesaj veya arama yoluyla dilediğiniz an ulaşabileceğiniz, ailelere özel profesyonel psikolojik danışmanlık hizmeti.",
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-primary" />,
    title: "Nitelikli Eğitmen Kadrosu",
    description: "Tamamı Eğitim Fakültesi mezunu, formasyon sahibi ve en az 3 yıl deneyimli profesyonel uzman kadro.",
  },
  {
    icon: <CalendarClock className="w-8 h-8 text-primary" />,
    title: "Esnek Planlama & Panel",
    description: "Derslerinizi dilediğiniz gün ve saate göre özgürce planlayın. İptal ve ders değişikliği işlemlerinizi üyelik politikamız çerçevesinde gerçekleştirin.",
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
    title: "İnteraktif Aile Paneli",
    description: "Çocuğunuzun tüm eğitim sürecini tek bir yerden yönetin. Ders programını görüntüleyebilir, yeni dersler planlayabilir ve ödeme geçmişini takip edebilirsiniz.",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Şeffaf Öğretmen Geri Bildirimi",
    description: "Her dersin sonunda öğretmeninizden detaylı gelişim raporu alın. Çocuğunuzun o günkü performansını ve pedagojik ilerlemesini anlık takip edin.",
  },
  {
    icon: <Package className="w-8 h-8 text-primary" />,
    title: "Avantajlı ve Esnek Paketler",
    description: "4, 8, 12 veya 24 derslik paketlerle ihtiyacınıza en uygun eğitimi seçin. Paket hacmi büyüdükçe artan indirim oranlarından faydalanın.",
  },
];

export default function WhyUs() {
  return (
    <section id="features" className="container py-20 md:py-28">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Neden Türk Çocuk Akademisi?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Modern pedagoji ve oyunlaştırma ile çocuğunuz Türkçe’yi sevecek.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6 text-center flex flex-col items-center hover:shadow-lg hover:-translate-y-2 transition-all border-none bg-slate-50/50 shadow-sm">
            <div className="bg-white p-4 rounded-2xl mb-4 shadow-sm">
              {feature.icon}
            </div>
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold text-slate-800">{feature.title}</CardTitle>
            </CardHeader>
            <CardDescription className="mt-3 text-sm leading-relaxed text-slate-600">
              {feature.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}
