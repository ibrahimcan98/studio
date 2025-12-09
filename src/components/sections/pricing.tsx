"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { COURSES } from "@/data/courses";

export default function Pricing() {
  const coursesToShow = COURSES.filter(course => course.id !== 'akademik');

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
          {coursesToShow.map((course) => {
            const fourLessonPackage = course.pricing.packages.find(p => p.lessons === 4);
            if (!fourLessonPackage) return null;

            return (
              <Card key={course.id} className="flex flex-col h-full transition-all hover:shadow-md">
                <CardHeader className="items-center text-center">
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-extrabold">€{fourLessonPackage.price.toFixed(2)}</span>
                  </div>
                  <CardDescription>{fourLessonPackage.lessons} Derslik Paket</CardDescription>
                </CardHeader>
                <CardContent className="flex-1"></CardContent>
                <CardFooter>
                  <Button className="w-full font-bold" variant={'outline'} asChild>
                    <Link href={`/kurslar#${course.id}-detay`}>Detaylı Gör</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <p className="text-center text-muted-foreground text-sm mt-8">
          Stripe test modunda güvenli ödeme
        </p>
      </div>
    </section>
  );
}
