"use client"
import { Course } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Tag } from "lucide-react";

export const PricingSection = ({ course }: { course: Course }) => {
    return (
        <div className="container mt-12">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-800">{course.title} - Paket Seçenekleri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {course.pricing.packages.map((pkg) => {
                    const perLessonPrice = course.pricing.perLesson[pkg.lessons as keyof typeof course.pricing.perLesson];
                    return (
                        <div key={pkg.lessons} className="border rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
                                <Tag className="w-3 h-3 mr-1.5" />
                                ders başına €{perLessonPrice.toFixed(2)}
                            </Badge>
                             <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                 <span className="text-3xl">📚</span>
                            </div>
                            <h4 className="font-bold text-gray-800">{course.title}</h4>
                            <p className="text-sm text-gray-500">({course.details.duration})</p>
                            <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                            <p className="text-3xl font-bold text-gray-900 my-4">€{pkg.price.toFixed(2)}</p>
                            <Button className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Sepete Ekle
                            </Button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}