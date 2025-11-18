'use client';
import { Course } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import Link from 'next/link';

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

export const CourseDetails = ({ course, whatsappUrl }: { course: Course, whatsappUrl: string }) => {
    
    if (course.id === 'akademik') {
        return (
            <section id={course.id} className="py-10 md:py-16">
                 <div className="container">
                    <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
                    <p className="text-muted-foreground mb-1">{`Süre: ${course.details.duration} | Yaş Grubu: ${course.ageGroup}`}</p>
                    <p className="max-w-2xl text-muted-foreground mb-12">{course.shortDescription}</p>

                    <div className="space-y-12">
                        {course.academicSteps?.map(step => (
                            <div key={step.id} id={step.id} className="grid md:grid-cols-12 gap-8 items-start">
                                <div className="md:col-span-2">
                                     <div className={`p-4 rounded-2xl ${step.color} inline-block`}>
                                        <h4 className="font-bold text-lg text-gray-800">{step.title}</h4>
                                    </div>
                                </div>
                                <div className="md:col-span-7">
                                     <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h5 className="font-bold text-lg mb-4 text-primary">KAZANIMLAR</h5>
                                        <ul className="space-y-2 list-disc list-inside text-gray-700">
                                            {step.gains.map((gain, i) => (
                                                <li key={i}>{gain}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                     <SmoothScrollLink to="paketler" className="w-full">
                                        <Button variant="outline" className="w-full">Ücretleri Görüntüle</Button>
                                    </SmoothScrollLink>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section id={course.id} className="py-10 md:py-16 bg-gray-50/70">
            <div className="container grid md:grid-cols-3 gap-8 md:gap-12 items-center">
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
                    <p className="text-muted-foreground mb-6">{`Süre: ${course.details.duration} | Yaş Grubu: ${course.ageGroup}`}</p>
                    <div className={`${course.details.gainsColor} p-6 rounded-2xl`}>
                        <h4 className="font-bold text-xl mb-4">KAZANIMLAR</h4>
                        <ul className="space-y-3 list-disc list-inside">
                            {course.details.gains.map((gain, i) => (
                                <li key={i}>{gain}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="bg-green-100 text-green-800 p-6 rounded-2xl text-center shadow-sm">
                    <p className="font-bold text-lg mb-3">Paketlerle ilgili bilgi almak için tıkla</p>
                    <Button asChild className="bg-secondary text-white hover:bg-secondary/90">
                        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                           <WhatsAppIcon className="w-5 h-5 mr-2"/> WhatsApp
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};
