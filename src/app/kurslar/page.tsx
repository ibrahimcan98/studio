'use client';
import { CourseCard } from "@/components/courses/course-card";
import { COURSES } from "@/data/courses";

export default function KurslarPage() {
    return (
        <div className="bg-[#fbfaf6] text-[#243B53] py-16 md:py-24">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {COURSES.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}
