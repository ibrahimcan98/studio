'use client';
import { Course } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import Link from 'next/link';
import { CheckCircle, Clock, User, MessageSquare, BookOpen } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

export const CourseDetails = ({ course, whatsappUrl }: { course: Course, whatsappUrl: string }) => {
    
    return (
        <div className="container">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h2>
                <div className="flex justify-center items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5"/>
                        <span>Süre: {course.details.duration}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <User className="w-5 h-5"/>
                        <span>Yaş grubu: {course.ageGroup}</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                <Card className="p-8 rounded-2xl bg-white shadow-lg">
                    <h4 className="font-bold text-xl mb-6 flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600"/>
                        </div>
                        KAZANIMLAR
                    </h4>
                    <ul className="space-y-4 list-inside text-gray-700">
                        {course.details.gains.map((gain, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"/>
                                <span>{gain}</span>
                            </li>
                        ))}
                    </ul>
                </Card>

                <div className={cn(
                    "p-8 rounded-2xl text-center shadow-lg flex flex-col items-center justify-center min-h-[300px]",
                    "bg-gradient-to-br from-amber-400 to-orange-400 text-white"
                )}>
                    <MessageSquare className="w-12 h-12 mb-4 opacity-80"/>
                    <p className="font-bold text-2xl mb-4">Paketlerle ilgili bilgi almak için tıkla</p>
                    <Button asChild className="bg-white text-orange-600 hover:bg-white/90 font-bold">
                        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                           <WhatsAppIcon className="w-5 h-5 mr-2 text-green-600"/> WhatsApp'ta Sohbet Et
                        </Link>
                    </Button>
                </div>
            </div>

            {course.id === 'akademik' && course.academicSteps && (
                 <div className="mt-16">
                    <h3 className="text-3xl font-bold mb-8 text-center">Akademik Adımlar</h3>
                     <div className="space-y-12">
                        {course.academicSteps?.map(step => (
                            <div key={step.id} id={step.id} className="grid md:grid-cols-12 gap-8 items-start">
                                <div className="md:col-span-3">
                                     <div className={`p-4 rounded-2xl ${step.color} inline-block`}>
                                        <h4 className="font-bold text-lg text-gray-800">{step.title}</h4>
                                    </div>
                                </div>
                                <div className="md:col-span-9">
                                     <div className="bg-gray-50 p-6 rounded-2xl">
                                        <h5 className="font-bold text-lg mb-4 text-primary">KAZANIMLAR</h5>
                                        <ul className="space-y-2 list-disc list-inside text-gray-700">
                                            {step.gains.map((gain, i) => (
                                                <li key={i}>{gain}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
