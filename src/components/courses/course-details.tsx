"use client"
import { Course } from "@/data/courses";
import { CheckCircle } from "lucide-react";

export const CourseDetails = ({ course }: { course: Course }) => {

    const getGainsColor = (id: string) => {
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
                return 'bg-gray-100';
        }
    }

    return (
        <div className="container grid lg:grid-cols-2 gap-12 items-start">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{course.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span>Süre: {course.details.duration}</span>
                    <span>|</span>
                    <span>Yaş grubu: {course.ageGroup}</span>
                </div>
            </div>
            <div className={`p-8 rounded-2xl ${getGainsColor(course.id)}`}>
                <h3 className="font-bold text-lg mb-4 text-gray-700">KAZANIMLAR</h3>
                <ul className="space-y-3">
                    {course.details.gains.map((gain, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-600">{gain}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}