"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COURSES, Course } from "@/data/courses";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import Link from 'next/link';

const PriceCard = ({ pkg, perLesson, courseTitle, duration, whatsappUrl }: { pkg: { lessons: number; price: number; }, perLesson: number, courseTitle: string, duration: string, whatsappUrl: string }) => {
    
    const formatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'EUR' });

    return (
        <Card className="flex flex-col rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="relative h-32 bg-gray-100 flex items-center justify-center">
                 <p className="text-4xl font-bold text-primary">{courseTitle.split(' ')[0]}</p>
                 <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                    ders başına {formatter.format(perLesson)}
                </Badge>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                 <h3 className="font-bold text-lg">{courseTitle} ({duration})</h3>
                <p className="text-sm text-muted-foreground">{pkg.lessons} derslik paket</p>
                <p className="text-3xl font-extrabold my-4">{formatter.format(pkg.price)}</p>
                <Button asChild variant="outline" className="mt-auto w-full">
                    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">Detaylı Bilgi</Link>
                </Button>
            </div>
        </Card>
    );
};

export const PricingSection = ({ whatsappUrl }: { whatsappUrl: string }) => {
    
    return (
        <section id="paketler" className="py-20 md:py-28">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-12">
                     <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-md text-gray-600 hover:text-primary transition-colors bg-yellow-100/70 px-4 py-2 rounded-full mb-4">
                        <WhatsAppIcon className="w-5 h-5 text-green-600" />
                        <span>İndirim fırsatını kaçırmayın! Bizimle iletişime geçin, promosyon kodu ile indirim kazanın.</span>
                    </Link>
                </div>

                {COURSES.map(course => (
                    <div key={course.id} className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{course.title} Paketleri</h2>
                        <Carousel
                          opts={{
                            align: "start",
                            loop: false,
                          }}
                          className="w-full"
                        >
                          <CarouselContent className="-ml-4">
                            {course.pricing.packages.map((pkg, index) => (
                              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                                <div className="p-1 h-full">
                                   <PriceCard 
                                      pkg={pkg} 
                                      perLesson={course.pricing.perLesson[pkg.lessons as keyof typeof course.pricing.perLesson]}
                                      courseTitle={course.title}
                                      duration={course.details.duration}
                                      whatsappUrl={whatsappUrl}
                                    />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="hidden sm:flex" />
                          <CarouselNext className="hidden sm:flex" />
                        </Carousel>
                    </div>
                ))}
            </div>
        </section>
    );
};
