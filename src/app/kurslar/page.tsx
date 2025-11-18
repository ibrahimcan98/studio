'use client';
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { CourseDetails } from "@/components/courses/course-details";
import { PricingSection } from "@/components/courses/pricing-section";
import { COURSES, Course } from "@/data/courses";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function KurslarPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const whatsappUrl = "https://wa.me/901234567890?text=Merhaba,%20ücretsiz%20deneme%20dersi%20hakkında%20bilgi%20almak%20istiyorum.";

    return (
        <div className="bg-[#fbfaf6] text-[#243B53]">
            {/* Courses Sections */}
            {COURSES.map(course => (
                 <section key={course.id} id={course.id} className="py-16 md:py-24">
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
