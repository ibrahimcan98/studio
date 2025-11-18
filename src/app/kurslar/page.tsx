'use client';
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { CourseCard } from "@/components/courses/course-card";
import { CourseDetails } from "@/components/courses/course-details";
import { PricingSection } from "@/components/courses/pricing-section";
import { COURSES, Course } from "@/data/courses";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Link from "next/link";

const SmoothScrollLink = ({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById(to);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    return (
        <a href={`#${to}`} onClick={handleClick} className={className}>
            {children}
        </a>
    );
};

export default function KurslarPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const whatsappUrl = "https://wa.me/901234567890?text=Merhaba,%20ücretsiz%20deneme%20dersi%20hakkında%20bilgi%20almak%20istiyorum.";

    return (
        <div className="bg-white text-[#243B53]">
            {/* Hero */}
            <section className="relative text-center py-20 md:py-28 overflow-hidden bg-blue-50" style={{ backgroundColor: '#EAF8FA' }}>
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-200/50 rounded-full filter blur-3xl opacity-70"></div>
                    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-teal-200/50 rounded-full filter blur-3xl opacity-70"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200/30 rounded-full filter blur-3xl opacity-60"></div>
                </div>
                <div className="container relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">KURSLAR</h1>
                    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-lg text-gray-700 hover:text-primary transition-colors">
                        <WhatsAppIcon className="w-6 h-6" />
                        <span>WhatsApp üzerinden ücretsiz deneme dersi planlayalım!</span>
                    </Link>
                </div>
            </section>

            {/* Courses Grid */}
            <section id="kurslar-grid" className="py-20 md:py-28">
                <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {COURSES.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </section>
            
            {/* Course Details Sections */}
            {COURSES.map(course => (
                 <CourseDetails key={`${course.id}-details`} course={course} whatsappUrl={whatsappUrl} />
            ))}

            {/* Pricing Section */}
            {isClient && <PricingSection whatsappUrl={whatsappUrl} />}

            {/* Final CTA */}
            <section className="py-20 md:py-28 bg-blue-50" style={{ backgroundColor: '#EAF8FA' }}>
                <div className="container text-center">
                     <Button asChild size="lg" className="bg-gradient-to-r from-secondary to-primary text-white text-lg font-bold h-14 px-10 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                           <WhatsAppIcon className="w-6 h-6 mr-3"/>
                            WhatsApp üzerinden ücretsiz deneme dersi planlayalım!
                        </Link>
                    </Button>
                    <div className="flex justify-center items-center gap-6 mt-8">
                        <Badge variant="outline" className="text-muted-foreground border-gray-300">Güvenli Ödeme</Badge>
                        <Badge variant="outline" className="text-muted-foreground border-gray-300">Reklamsız</Badge>
                        <Badge variant="outline" className="text-muted-foreground border-gray-300">Ebeveyn Onaylı</Badge>
                    </div>
                </div>
            </section>

             {/* Sticky Bottom Bar for Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
                <div className="container flex justify-around items-center h-16">
                     <SmoothScrollLink to="kurslar-grid" className="text-sm font-medium text-gray-600 hover:text-primary">Kurslar</SmoothScrollLink>
                     <SmoothScrollLink to="paketler" className="text-sm font-medium text-gray-600 hover:text-primary">Paketler</SmoothScrollLink>
                     <Button asChild size="sm" className="bg-secondary text-white rounded-full">
                        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">Deneme</Link>
                     </Button>
                </div>
            </div>
        </div>
    );
}
