'use client';
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { CourseDetails } from "@/components/courses/course-details";
import { PricingSection } from "@/components/courses/pricing-section";
import { COURSES, Course } from "@/data/courses";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function KurslarPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const whatsappUrl = "https://wa.me/901234567890?text=Merhaba,%20ücretsiz%20deneme%20dersi%20hakkında%20bilgi%20almak%20istiyorum.";

    const getBackgroundColor = (id: string) => {
        switch (id) {
            case 'baslangic':
                return 'bg-[#FFF8E7]';
            case 'konusma':
                return 'bg-[#FFF0CC]';
            case 'gelisim':
                return 'bg-[#F0FAF8]';
            case 'akademik':
                return 'bg-[#D4EDE3]';
            default:
                return 'bg-blue-50/50';
        }
    }

    return (
        <div className="bg-[#fbfaf6] text-[#243B53]">
            {/* Courses Sections */}
            {COURSES.map(course => (
                 <section key={course.id} id={course.id} className={cn("py-16 md:py-24", getBackgroundColor(course.id))}>
                    <CourseDetails course={course} whatsappUrl={whatsappUrl} />
                    {isClient && <PricingSection course={course} whatsappUrl={whatsappUrl} />}
                </section>
            ))}

            {/* Final CTA */}
            <section className="py-20 md:py-28 bg-blue-50/50" style={{ backgroundColor: '#EAF8FA' }}>
                <div className="container text-center">
                     <Button asChild size="lg" className="bg-gradient-to-r from-secondary to-primary text-white text-lg font-bold h-14 px-10 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                           <WhatsAppIcon className="w-6 h-6 mr-3"/>
                            Ücretsiz deneme dersi için bize ulaşın!
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
