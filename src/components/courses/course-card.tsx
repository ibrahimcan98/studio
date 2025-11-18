"use client"
import Image from "next/image";
import { Course } from "@/data/courses";
import { Button } from "@/components/ui/button";

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
        <div className="relative p-8 rounded-3xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.03]">
            <div className={`absolute inset-0 ${course.blobColor} opacity-20 rounded-full filter blur-3xl`}></div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex-grow">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">{course.title}</h2>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-white flex-shrink-0 shadow-sm">
                           <Image src="https://picsum.photos/seed/1/100/100" alt={course.title} width={64} height={64} className="rounded-2xl object-cover" data-ai-hint="child learning" />
                        </div>
                        <p className="text-gray-600 whitespace-pre-line text-sm">{course.shortDescription}</p>
                    </div>

                    {course.id === 'akademik' && (
                         <div className="grid grid-cols-2 gap-2 mt-4">
                            {course.academicSteps?.map(step => (
                                <SmoothScrollLink key={step.id} to={step.id}>
                                    <Button size="sm" variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-100">{step.title}</Button>
                                </SmoothScrollLink>
                            ))}
                        </div>
                    )}
                </div>
                {course.cta.text && (
                    <div className="mt-auto pt-4">
                        <SmoothScrollLink to={course.id} className={`inline-block text-sm font-semibold p-2 rounded-lg ${course.cta.color}`}>
                           {course.cta.text}
                        </SmoothScrollLink>
                    </div>
                )}
            </div>
        </div>
    );
};
