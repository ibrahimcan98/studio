'use client';
import { COURSES } from "@/data/courses";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { CheckCircle, Info, BookOpen, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function KurslarPage() {
    const baslangicKursu = COURSES.find(c => c.id === 'baslangic');

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

                {baslangicKursu && (
                    <section id="baslangic-detay" className="mt-20 md:mt-28 py-16 md:py-24 rounded-3xl bg-[#FFF8E7]">
                        <div className="container max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4">Başlangıç Kursu</h2>
                                <div className="flex items-center justify-center gap-4 text-gray-500">
                                    <span>Süre: {baslangicKursu.details.duration}</span>
                                    <span>|</span>
                                    <span>Yaş grubu: {baslangicKursu.ageGroup}</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                                <div className="bg-white p-8 rounded-2xl shadow-md">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle className="text-green-500" /> KAZANIMLAR</h3>
                                    <ul className="space-y-3 text-gray-600">
                                        {baslangicKursu.details.gains.map((gain, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                <span>{gain}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gradient-to-br from-orange-300 to-amber-400 p-8 rounded-2xl shadow-md text-center text-white flex flex-col items-center justify-center h-full">
                                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-4">
                                        <WhatsAppIcon className="w-8 h-8 fill-white text-white"/>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Paketlerle ilgili bilgi almak için tıkla</h3>
                                    <Button asChild className="bg-white text-orange-500 hover:bg-gray-100 font-bold">
                                        <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">WhatsApp'ta Sohbet Et</a>
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-full px-6 py-3">
                                    <Info className="w-5 h-5"/>
                                    <p>İndirim fırsatını kaçırmayın! Bizimle iletişime geçin, promosyon kodu ile indirim kazanın.</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">Başlangıç Kursu - Paket Seçenekleri</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {baslangicKursu.pricing.packages.map((pkg) => {
                                        const perLessonPrice = baslangicKursu.pricing.perLesson[pkg.lessons as keyof typeof baslangicKursu.pricing.perLesson];
                                        return (
                                            <div key={pkg.lessons} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                                <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                                                    ders başına €{perLessonPrice.toFixed(2)}
                                                </Badge>
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                    <BookOpen className="w-8 h-8 text-gray-500"/>
                                                </div>
                                                <h4 className="font-bold text-gray-800">{baslangicKursu.title}</h4>
                                                <p className="text-sm text-gray-500">({baslangicKursu.details.duration})</p>
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
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
}
