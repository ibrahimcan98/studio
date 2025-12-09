
'use client';
import { useState, useMemo } from 'react';
import { COURSES, Course } from "@/data/courses";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { CheckCircle, Info, BookOpen, ShoppingCart, ShieldCheck, Lock as LockIcon, Heart, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/footer";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";


const exchangeRates: { [key: string]: number } = {
    EUR: 1,
    GBP: 0.85,
    USD: 1.08,
    AED: 3.96,
    AUD: 1.63,
    CAD: 1.48,
    CHF: 0.97,
    IDR: 17650,
    MYR: 5.09,
    NOK: 11.55,
    TRY: 35.50,
};

const currencySymbols: { [key: string]: string } = {
    EUR: '€',
    GBP: '£',
    USD: '$',
    AED: 'AED',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    IDR: 'Rp',
    MYR: 'RM',
    NOK: 'kr',
    TRY: '₺',
};

const currencies = Object.keys(exchangeRates);

export default function KurslarPage() {
    const { toast } = useToast();
    const { addToCart } = useCart();
    const [selectedCurrency, setSelectedCurrency] = useState('EUR');

    const convertPrice = (priceInEur: number) => {
        const rate = exchangeRates[selectedCurrency] || 1;
        return priceInEur * rate;
    };
    
    const baslangicKursu = COURSES.find(c => c.id === 'baslangic');
    const konusmaKursu = COURSES.find(c => c.id === 'konusma');
    const gelisimKursu = COURSES.find(c => c.id === 'gelisim');
    const akademikKursu = COURSES.find(c => c.id === 'akademik');

    const handleAddToCart = (course: any, pkg: any) => {
        addToCart({
            id: `${course.id}-${pkg.lessons}`,
            name: course.title,
            description: `${pkg.lessons} derslik paket`,
            price: pkg.price,
            quantity: 1,
            image: `/images/topics/family.png` // Placeholder image
        });
        toast({
            title: "Sepete Eklendi",
            description: `${course.title} (${pkg.lessons} ders) sepetinize eklendi.`,
        });
    };

    const PriceDisplay = ({ price }: { price: number }) => {
        const convertedPrice = convertPrice(price);
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className="text-3xl font-bold text-gray-900 my-4 cursor-help">
                            {currencySymbols[selectedCurrency] || selectedCurrency}{convertedPrice.toFixed(2)}
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="space-y-1 text-xs">
                             {currencies.filter(c => c !== selectedCurrency).slice(0, 5).map(currency => (
                                <div key={currency} className="flex justify-between gap-2">
                                    <span>{currencySymbols[currency] || currency}:</span>
                                    <span>{(price * exchangeRates[currency]).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    return (
        <div className="bg-white min-h-screen text-[#243B53]">
            <header className="py-16 md:py-24 text-center">
                 <h1 className="text-5xl md:text-6xl font-bold mb-6">KURSLAR</h1>
                 <Button asChild variant="outline" className="bg-white rounded-full py-6 px-8 shadow-lg hover:shadow-xl transition-shadow border-gray-200">
                    <a href="https://wa.me/+905058029734" target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="w-6 h-6 mr-3 text-green-500 fill-green-500" />
                        <span className="font-semibold">İndirimsiz almayın! Bizimle iletişime geçin, promosyon kodu ile indirim kazanın.</span>
                    </a>
                </Button>
            </header>
            <main className="container pb-24">
                <div className="max-w-xs mx-auto mb-16">
                     <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <label htmlFor="currency-select" className="text-sm font-medium text-muted-foreground">Para Birimi:</label>
                    </div>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger id="currency-select" className="mt-1">
                            <SelectValue placeholder="Para Birimi Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map(currency => (
                                <SelectItem key={currency} value={currency}>
                                    {currency} ({currencySymbols[currency]})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>


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
                                        <a href="https://wa.me/+905058029734" target="_blank" rel="noopener noreferrer">WhatsApp'ta Sohbet Et</a>
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
                                                    ders başına {currencySymbols[selectedCurrency]}{(convertPrice(perLessonPrice)).toFixed(2)}
                                                </Badge>
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                    <BookOpen className="w-8 h-8 text-gray-500"/>
                                                </div>
                                                <h4 className="font-bold text-gray-800">{baslangicKursu.title}</h4>
                                                <p className="text-sm text-gray-500">({baslangicKursu.details.duration})</p>
                                                <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                                <PriceDisplay price={pkg.price} />
                                                <Button className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAddToCart(baslangicKursu, pkg)}>
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

                {konusmaKursu && (
                    <section id="konusma-detay" className="mt-16 py-16 md:py-24 rounded-3xl bg-[#FFF0CC]">
                        <div className="container max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4">Konuşma Kursu</h2>
                                <div className="flex items-center justify-center gap-4 text-gray-500">
                                    <span>Süre: {konusmaKursu.details.duration}</span>
                                    <span>|</span>
                                    <span>Yaş grubu: {konusmaKursu.ageGroup}</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                                <div className="bg-white p-8 rounded-2xl shadow-md">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle className="text-green-500" /> KAZANIMLAR</h3>
                                    <ul className="space-y-3 text-gray-600">
                                        {konusmaKursu.details.gains.map((gain, index) => (
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
                                        <a href="https://wa.me/+905058029734" target="_blank" rel="noopener noreferrer">WhatsApp'ta Sohbet Et</a>
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
                                <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">Konuşma Kursu - Paket Seçenekleri</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {konusmaKursu.pricing.packages.map((pkg) => {
                                        const perLessonPrice = konusmaKursu.pricing.perLesson[pkg.lessons as keyof typeof konusmaKursu.pricing.perLesson];
                                        return (
                                            <div key={pkg.lessons} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                                <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                                                    ders başına {currencySymbols[selectedCurrency]}{(convertPrice(perLessonPrice)).toFixed(2)}
                                                </Badge>
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                    <BookOpen className="w-8 h-8 text-gray-500"/>
                                                </div>
                                                <h4 className="font-bold text-gray-800">{konusmaKursu.title}</h4>
                                                <p className="text-sm text-gray-500">({konusmaKursu.details.duration})</p>
                                                <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                                <PriceDisplay price={pkg.price} />
                                                <Button className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAddToCart(konusmaKursu, pkg)}>
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

                 {gelisimKursu && (
                    <section id="gelisim-detay" className="mt-16 py-16 md:py-24 rounded-3xl bg-[#F0FAF8]">
                        <div className="container max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4">Gelişim Kursu</h2>
                                <div className="flex items-center justify-center gap-4 text-gray-500">
                                    <span>Süre: {gelisimKursu.details.duration}</span>
                                    <span>|</span>
                                    <span>Yaş grubu: {gelisimKursu.ageGroup}</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                                <div className="bg-white p-8 rounded-2xl shadow-md">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle className="text-green-500" /> KAZANIMLAR</h3>
                                    <ul className="space-y-3 text-gray-600">
                                        {gelisimKursu.details.gains.map((gain, index) => (
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
                                        <a href="https://wa.me/+905058029734" target="_blank" rel="noopener noreferrer">WhatsApp'ta Sohbet Et</a>
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
                                <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">Gelişim Kursu - Paket Seçenekleri</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {gelisimKursu.pricing.packages.map((pkg) => {
                                        const perLessonPrice = gelisimKursu.pricing.perLesson[pkg.lessons as keyof typeof gelisimKursu.pricing.perLesson];
                                        return (
                                            <div key={pkg.lessons} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                                <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                                                     ders başına {currencySymbols[selectedCurrency]}{(convertPrice(perLessonPrice)).toFixed(2)}
                                                </Badge>
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                    <BookOpen className="w-8 h-8 text-gray-500"/>
                                                </div>
                                                <h4 className="font-bold text-gray-800">{gelisimKursu.title}</h4>
                                                <p className="text-sm text-gray-500">({gelisimKursu.details.duration})</p>
                                                <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                                <PriceDisplay price={pkg.price} />
                                                <Button className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAddToCart(gelisimKursu, pkg)}>
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

                 {akademikKursu && (
                    <section id="akademik-detay" className="mt-16 py-16 md:py-24 rounded-3xl bg-[#D4EDE3]">
                        <div className="container max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4">Akademik Kurs</h2>
                                <div className="flex items-center justify-center gap-4 text-gray-500 mb-4">
                                    <span>Süre: {akademikKursu.details.duration}</span>
                                    <span>|</span>
                                    <span>Yaş grubu: {akademikKursu.ageGroup}</span>
                                </div>
                                <p className="text-gray-600 max-w-3xl mx-auto">Okuma yazma bilen her öğrencinin alabileceği Akademik Kurs, 4 adımdan oluşur.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-16">
                                {akademikKursu.academicSteps?.map((step, index) => (
                                    <div key={step.id} className="bg-white p-8 rounded-2xl shadow-md h-full flex flex-col">
                                        <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                                            <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full">{index + 1}</span>
                                            {step.title}
                                        </h3>
                                        <h4 className="font-semibold text-md mb-3 text-gray-700">KAZANIMLAR</h4>
                                        <ul className="space-y-3 text-gray-600 flex-1">
                                            {step.gains.map((gain, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                    <span>{gain}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-full px-6 py-3">
                                    <Info className="w-5 h-5"/>
                                    <p>İndirim fırsatını kaçırmayın! Bizimle iletişime geçin, promosyon kodu ile indirim kazanın.</p>
                                </div>
                            </div>

                            <div id="akademik-paketler">
                                <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">Akademik Kurs - Paket Seçenekleri</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {akademikKursu.pricing.packages.map((pkg) => {
                                        const perLessonPrice = akademikKursu.pricing.perLesson[pkg.lessons as keyof typeof akademikKursu.pricing.perLesson];
                                        return (
                                            <div key={pkg.lessons} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                                <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                                                     ders başına {currencySymbols[selectedCurrency]}{(convertPrice(perLessonPrice)).toFixed(2)}
                                                </Badge>
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                    <BookOpen className="w-8 h-8 text-gray-500"/>
                                                </div>
                                                <h4 className="font-bold text-gray-800">{akademikKursu.title}</h4>
                                                <p className="text-sm text-gray-500">({akademikKursu.details.duration})</p>
                                                <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                                <PriceDisplay price={pkg.price} />
                                                <Button className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAddToCart(akademikKursu, pkg)}>
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

                <section className="py-20 md:py-28 text-center">
                    <div className="container max-w-4xl mx-auto">
                        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 mb-8">
                             <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full text-lg font-bold px-8 py-6 h-auto">
                                <a href="https://wa.me/+905058029734" target="_blank" rel="noopener noreferrer">
                                    <WhatsAppIcon className="w-6 h-6 mr-3 fill-white" />
                                    İndirimsiz almayın! Bizimle iletişime geçin, promosyon kodu ile indirim kazanın.
                                </a>
                            </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-600">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                <span>Güvenli Ödeme</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LockIcon className="w-5 h-5 text-green-500" />
                                <span>Reklamsız</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-green-500" />
                                <span>Ebeveyn Onaylı</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
