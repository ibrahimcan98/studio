'use client';
import { COURSES } from "@/data/courses";
import { CourseDetails } from "@/components/courses/course-details";
import { PricingSection } from "@/components/courses/pricing-section";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";

export default function KurslarPage() {
    return (
        <div className="bg-[#fbfaf6] text-[#243B53]">
            {COURSES.map((course, index) => (
                <section 
                    key={course.id} 
                    id={course.id} 
                    className={`py-16 md:py-24 ${index > 0 ? 'border-t-2 border-dashed' : ''} ${course.id === 'baslangic' ? 'bg-[#FFF8E7]' : ''}`}
                >
                    <CourseDetails course={course} />
                    
                    {course.id === 'baslangic' && (
                         <div className="container mt-16">
                            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="font-bold text-xl text-teal-800 mb-2">Paketlerle ilgili bilgi almak için tıkla</h3>
                                     <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-bold">
                                        <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
                                            <WhatsAppIcon className="w-5 h-5 mr-2 text-white fill-white" />
                                            WhatsApp'ta Sohbet Et
                                        </a>
                                    </Button>
                                </div>
                                <p className="text-teal-700">
                                    <span className="font-bold">İndirim fırsatını kaçırmayın!</span> Bizimle iletişime geçin, promosyon kodu ile indirim kazanın.
                                </p>
                            </div>
                        </div>
                    )}

                    <PricingSection course={course} />
                </section>
            ))}
        </div>
    );
}