import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gamepad2, Video, Users, BookText, Package, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Gamepad2 className="w-8 h-8 text-primary" />,
    title: "Oyunlaştırılmış Öğrenme",
    description: "Harita tabanlı yolculuk, XP puanları ve rozetlerle öğrenme.",
  },
  {
    icon: <Video className="w-8 h-8 text-primary" />,
    title: "Canlı Dersler",
    description: "Uzman öğretmenlerle birebir veya grup dersleri, deneme dersi ücretsiz.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Aile Paneli",
    description: "Çocuğun ilerlemesini ve raporları izleyebilme.",
  },
  {
    icon: <BookText className="w-8 h-8 text-primary" />,
    title: "Öğretmen Geri Bildirimi",
    description: "Her dersten sonra kişisel notlar ve ödev.",
  },
  {
    icon: <Package className="w-8 h-8 text-primary" />,
    title: "Esnek Paketler",
    description: "4, 8 veya 12 derslik seçenekler.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Güvenli & Reklamsız",
    description: "COPPA uyumlu, tamamen güvenli bir ortam.",
  },
];

export default function WhyUs() {
  return (
    <section id="features" className="container py-20 md:py-28">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Neden Türk Çocuk Akademisi?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Modern pedagoji ve oyunlaştırma ile çocuğunuz Türkçe’yi sevecek.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6 text-center flex flex-col items-center hover:shadow-lg hover:-translate-y-2 transition-all">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              {feature.icon}
            </div>
            <CardHeader className="p-0">
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardDescription className="mt-2 text-base">
              {feature.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}
