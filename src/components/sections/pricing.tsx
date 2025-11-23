import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const packages = [
  {
    name: "Başlangıç Kursu",
    price: "€99",
    lessons: 4,
    popular: false,
    id: 'baslangic-detay'
  },
  {
    name: "Konuşma Kursu",
    price: "€198",
    lessons: 12,
    popular: true,
    id: 'konusma-detay'
  },
  {
    name: "Gelişim Kursu",
    price: "€210.50",
    lessons: 8,
    popular: false,
    id: 'gelisim-detay'
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/40">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Kurslar</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            İhtiyacınıza uygun paketi seçin, istediğiniz zaman başlayın.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {packages.map((pkg) => (
            <Card key={pkg.name} className={`flex flex-col h-full transition-all ${pkg.popular ? 'border-primary border-2 shadow-lg transform lg:-translate-y-4' : 'hover:shadow-md'}`}>
              <CardHeader className="items-center text-center">
                {pkg.popular && <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">En Popüler</Badge>}
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-extrabold">{pkg.price}</span>
                </div>
                <CardDescription>{pkg.lessons} Derslik Paket</CardDescription>
              </CardHeader>
              <CardContent className="flex-1"></CardContent>
              <CardFooter>
                 <Button className="w-full font-bold" variant={pkg.popular ? 'default' : 'outline'} asChild>
                    <Link href={`/kurslar#${pkg.id}`}>Detaylı Gör</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-center text-muted-foreground text-sm mt-8">
          Stripe test modunda güvenli ödeme
        </p>
      </div>
    </section>
  );
}
