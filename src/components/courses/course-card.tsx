"use client"
import { Course } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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


export const CourseCard = ({ course }: { course: Course }) => {
    
    return (
        <div className={cn(
            "relative p-8 rounded-3xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.03] flex flex-col",
            course.cta.backgroundColor
        )}>
            
            <div className="relative z-10 flex flex-col h-full">
                 <div className="flex justify-between items-start mb-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center", course.cta.iconBgColor)}>
                        <BookOpen className={cn("w-7 h-7", course.cta.iconTextColor)} />
                    </div>
                     <Badge className={cn("text-xs font-bold", course.cta.badgeColor, course.cta.badgeTextColor)}>{course.details.duration}</Badge>
                </div>

                <div className="flex-grow">
                    <h2 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">{course.title}</h2>
                    <p className="text-sm text-gray-500 mb-4">{course.ageGroup}</p>
                    <p className="text-gray-600 whitespace-pre-line text-sm">{course.shortDescription}</p>

                    {course.id === 'akademik' && (
                         <div className="flex flex-wrap gap-2 mt-6">
                            {course.academicSteps?.map(step => (
                                <Button key={step.id} size="sm" variant="outline" className="justify-center border-gray-300 bg-white/50 hover:bg-gray-100 text-xs sm:text-sm text-gray-700">
                                    {step.title}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="mt-auto pt-6">
                    <a href="#" className={cn("text-sm font-semibold hover:underline", course.cta.linkTextColor)}>
                       Detaylı bilgi için tıkla &gt;
                    </a>
                </div>
            </div>
        </div>
    );
};
