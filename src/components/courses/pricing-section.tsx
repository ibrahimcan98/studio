'use client';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/data/courses";
import Link from 'next/link';
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { BookOpen, ShoppingCart } from "lucide-react";

const PriceCard = ({ pkg, perLesson, courseTitle, duration, whatsappUrl }: { pkg: { lessons: number; price: number; }, perLesson: number, courseTitle: string, duration: string, whatsappUrl: string }) => {
    
    const formatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'EUR' });

    return (
        <Card className="flex flex-col rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1 bg-white h-full">
            <div className="relative h-32 bg-teal-50 flex items-center justify-center rounded-t-2xl">
                 <BookOpen className="w-16 h-16 text-teal-200"/>
                 <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                    ders başına {formatter.format(perLesson)}
                </Badge>
            </div>
            <div className="p-6 flex flex-col flex-grow text-center">
                 <h3 className="font-bold text-xl">{courseTitle}</h3>
                 <p className="text-sm text-muted-foreground mb-2">({duration})</p>
                <p className="text-muted-foreground">{pkg.lessons} derslik paket</p>
                <p className="text-4xl font-extrabold my-4 text-primary">{formatter.format(pkg.price)}</p>
                <Button asChild className="mt-auto w-full bg-primary hover:bg-primary/90">
                     <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <ShoppingCart className="w-4 h-4 mr-2"/>
                        Sepete Ekle
                    </Link>
                </Button>
            </div>
        </Card>
    );
};

export const PricingSection = ({ course, whatsappUrl }: { course: Course, whatsappUrl: string }) => {
    
    return (
        <div className="container pt-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-md text-gray-600 hover:text-primary transition-colors bg-yellow-100/70 px-4 py-2 rounded-full mb-6 ring-1 ring-yellow-200">
                    <WhatsAppIcon className="w-5 h-5 text-green-600" />
                    <span>İndirim fırsatını kaçırmayın! Bizimle iletişime geçin, promosyon kodu ile indirim kazanın.</span>
                </Link>
                <h2 className="text-3xl md:text-4xl font-bold">{course.title} - Paket Seçenekleri</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                {course.pricing.packages.map((pkg, index) => (
                    <div key={index} className="h-full">
                        <PriceCard 
                            pkg={pkg} 
                            perLesson={course.pricing.perLesson[pkg.lessons as keyof typeof course.pricing.perLesson]}
                            courseTitle={course.title}
                            duration={course.details.duration}
                            whatsappUrl={whatsappUrl}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
