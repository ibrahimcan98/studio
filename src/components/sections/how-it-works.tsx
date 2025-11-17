import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, CalendarClock, Map } from 'lucide-react';

const steps = [
  {
    step: "1️⃣",
    title: "Kayıt Ol ve Çocuğunu Ekle",
    icon: <UserPlus className="w-10 h-10 text-primary" />
  },
  {
    step: "2️⃣",
    title: "Ücretsiz Deneme Dersini Planla",
    icon: <CalendarClock className="w-10 h-10 text-primary" />
  },
  {
    step: "3️⃣",
    title: "Haritada İlerle, Rozet Kazan",
    icon: <Map className="w-10 h-10 text-primary" />
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/40">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Nasıl Çalışır?</h2>
          <p className="text-lg text-muted-foreground">
            3 basit adımda başlayın.
          </p>
        </div>
        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-1/2 left-0 w-full transform -translate-y-1/2">
            <svg width="100%" height="2" preserveAspectRatio="none">
              <line x1="0" y1="1" x2="100%" y2="1" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="8, 8"/>
            </svg>
          </div>
          {steps.map((item, index) => (
            <Card key={index} className="p-8 text-center relative bg-background shadow-md">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl bg-background px-2">
                {item.step}
              </div>
              <div className="mt-8 mb-4 inline-block">
                {item.icon}
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
