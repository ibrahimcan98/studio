'use client';
import { COURSES } from "@/data/courses";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";

export default function KurslarPage() {
    return (
        <div className="bg-[#f0fafa] min-h-screen text-[#243B53]">
            <header className="py-16 md:py-24 text-center">
                 <h1 className="text-5xl md:text-6xl font-bold mb-6">KURSLAR</h1>
                 <Button asChild variant="outline" className="bg-white rounded-full py-6 px-8 shadow-lg hover:shadow-xl transition-shadow border-gray-200">
                    <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="w-6 h-6 mr-3 text-green-500 fill-green-500" />
                        <span className="font-semibold">WhatsApp üzerinden ücretsiz deneme dersi planlayalım!</span>
                    </a>
                </Button>
            </header>
            <main className="container pb-24">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {COURSES.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </main>
        </div>
    );
}
