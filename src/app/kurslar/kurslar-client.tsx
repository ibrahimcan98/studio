

'use client';
import { useState } from 'react';
import { COURSES, Course } from "@/data/courses";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { CheckCircle, Info, BookOpen, ShoppingCart, ShieldCheck, Lock as LockIcon, Heart, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const currencyDetails: { [key: string]: { name: string; symbol: string; flag: string; } } = {
    EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
    GBP: { name: 'İngiliz Sterlini', symbol: '£', flag: '🇬🇧' },
    USD: { name: 'ABD Doları', symbol: '$', flag: '🇺🇸' },
    AED: { name: 'BAE Dirhemi', symbol: 'AED', flag: '🇦🇪' },
    AUD: { name: 'Avustralya Doları', symbol: 'A$', flag: '🇦🇺' },
    CAD: { name: 'Kanada Doları', symbol: 'C$', flag: '🇨🇦' },
    CHF: { name: 'İsviçre Frankı', symbol: 'CHF', flag: '🇨🇭' },
    IDR: { name: 'Endonezya Rupisi', symbol: 'Rp', flag: '🇮🇩' },
    MYR: { name: 'Malezya Ringgiti', symbol: 'RM', flag: '🇲🇾' },
    NOK: { name: 'Norveç Kronu', symbol: 'kr', flag: '🇳🇴' },
    TRY: { name: 'Türk Lirası', symbol: '₺', flag: '🇹🇷' },
};


type KurslarClientPageProps = {
    exchangeRates: { [key: string]: number };
};

export function KurslarClientPage({ 
    exchangeRates,
}: KurslarClientPageProps) {

    const { toast } = useToast();
    const { addToCart } = useCart();
    const [selectedCurrency, setSelectedCurrency] = useState('EUR');
    const currencies = Object.keys(exchangeRates).filter(code => currencyDetails[code]);


    const convertPrice = (priceInEur: number) => {
        const rate = exchangeRates[selectedCurrency] || 1;
        return priceInEur * rate;
    };

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
        const selectedCurrencyDetails = currencyDetails[selectedCurrency];
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className="text-3xl font-bold text-gray-900 my-4 cursor-help">
                            {selectedCurrencyDetails?.symbol || selectedCurrency}{convertedPrice.toFixed(2)}
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="space-y-1 text-xs">
                             {currencies.filter(c => c !== selectedCurrency && currencyDetails[c]).slice(0, 5).map(currency => (
                                <div key={currency} className="flex justify-between gap-2">
                                    <span>{currencyDetails[currency]?.flag} {currency}:</span>
                                    <span>{currencyDetails[currency]?.symbol}{(price * exchangeRates[currency]).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    const baslangicKursu = COURSES.find(c => c.id === 'baslangic');
    const konusmaKursu = COURSES.find(c => c.id === 'konusma');
    const akademikKursu = COURSES.find(c => c.id === 'akademik');
    const gelisimKursu = COURSES.find(c => c.id === 'gelisim');
    const gcseKursu = COURSES.find(c => c.id === 'gcse');


    return (
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
                        {currencies.map(currency => {
                            const details = currencyDetails[currency];
                            if (!details) return null;
                            return (
                                <SelectItem key={currency} value={currency}>
                                    <span className="mr-2">{details.flag}</span>
                                    <span>{currency} ({details.name})</span>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </div>


             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {COURSES.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>

             <div className="max-w-4xl mx-auto text-center my-16">
                <div className="inline-flex items-start gap-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl px-6 py-4">
                    <Info className="w-5 h-5 mt-1 flex-shrink-0"/>
                    <p className="text-sm text-left">
                        Yurt dışında yaşayan çocukların dil gelişimi ve Türkçeye yönelik hazırbulunuşluk düzeyleri ülkeden ülkeye ve çocuktan çocuğa farklılık gösterebilir. Bu nedenle kurslarda yaş değil, çocuğun dil seviyesi esas alınır. Ücretsiz deneme dersi sonrasında öğretmenimiz tarafından yapılan değerlendirmeye göre en uygun kurs ve aşama belirlenir.
                    </p>
                </div>
            </div>

            {baslangicKursu && (
                <section id="baslangic-detay" className="mt-20 md:mt-28 py-16 md:py-24 rounded-3xl bg-[#FFF8E7]">
                    <div className="container max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{baslangicKursu.title}</h2>
                            <div className="flex items-center justify-center gap-4 text-gray-500">
                                <span>Süre: {baslangicKursu.details.duration}</span>
                                <span>|</span>
                                <span>Yaş grubu: {baslangicKursu.ageGroup}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-8 items-center mb-16">
                            <div className="bg-white p-8 rounded-2xl shadow-md">
                                <h3 className="font-bold text-lg mb-2">{baslangicKursu.details.longDescription}</h3>
                                <p className="font-semibold text-md mb-4 text-gray-700">Bu kursu tamamlayan çocuklar:</p>
                                <ul className="space-y-3 text-gray-600">
                                    {baslangicKursu.details.gains.map((gain, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <span>{gain}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">{baslangicKursu.title} - Paket Seçenekleri</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {baslangicKursu.pricing.packages.map((pkg) => {
                                    const perLessonPrice = baslangicKursu.pricing.perLesson?.[pkg.lessons as keyof typeof baslangicKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                            <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                                                ders başına {currencyDetails[selectedCurrency]?.symbol}{(convertPrice(perLessonPrice)).toFixed(2)}
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
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{konusmaKursu.title}</h2>
                            <div className="flex items-center justify-center gap-4 text-gray-500">
                                <span>Süre: {konusmaKursu.details.duration}</span>
                                <span>|</span>
                                <span>Yaş grubu: {konusmaKursu.ageGroup}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-8 items-center mb-16">
                            <div className="bg-white p-8 rounded-2xl shadow-md">
                                <h3 className="font-bold text-lg mb-2">{konusmaKursu.details.longDescription}</h3>
                                <p className="font-semibold text-md mb-4 text-gray-700">Bu kursu tamamlayan çocuklar:</p>
                                <ul className="space-y-3 text-gray-600">
                                    {konusmaKursu.details.gains.map((gain, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <span>{gain}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">{konusmaKursu.title} - Paket Seçenekleri</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {konusmaKursu.pricing.packages.map((pkg) => {
                                    const perLessonPrice = konusmaKursu.pricing.perLesson?.[pkg.lessons as keyof typeof konusmaKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                            <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                                                ders başına {currencyDetails[selectedCurrency]?.symbol}{(convertPrice(perLessonPrice)).toFixed(2)}
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
            
            {akademikKursu && (
                 <section id="akademik-detay" className="mt-16 py-16 md:py-24 rounded-3xl bg-[#D4EDE3]">
                    <div className="container max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{akademikKursu.title}</h2>
                            <div className="flex items-center justify-center gap-4 text-gray-500 mb-4">
                                <span>Süre: {akademikKursu.details.duration}</span>
                                <span>|</span>
                                <span>Yaş grubu: {akademikKursu.ageGroup}</span>
                            </div>
                             <p className="text-gray-600 max-w-3xl mx-auto">{akademikKursu.details.longDescription}</p>
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
                        
                        <div id="akademik-paketler">
                            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">{akademikKursu.title} - Paket Seçenekleri</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {akademikKursu.pricing.packages.map((pkg) => {
                                    const perLessonPrice = akademikKursu.pricing.perLesson?.[pkg.lessons as keyof typeof akademikKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                            <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                                                 ders başına {currencyDetails[selectedCurrency]?.symbol}{(convertPrice(perLessonPrice)).toFixed(2)}
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

            {gelisimKursu && (
                <section id="gelisim-detay" className="mt-16 py-16 md:py-24 rounded-3xl bg-[#F0FAF8]">
                    <div className="container max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{gelisimKursu.title}</h2>
                            <div className="flex items-center justify-center gap-4 text-gray-500">
                                <span>Süre: {gelisimKursu.details.duration}</span>
                                <span>|</span>
                                <span>Yaş grubu: {gelisimKursu.ageGroup}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-8 items-center mb-16">
                            <div className="bg-white p-8 rounded-2xl shadow-md">
                                <h3 className="font-bold text-lg mb-2">{gelisimKursu.details.longDescription}</h3>
                                <p className="font-semibold text-md mb-4 text-gray-700">Bu kursu tamamlayan çocuklar:</p>
                                <ul className="space-y-3 text-gray-600">
                                    {gelisimKursu.details.gains.map((gain, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <span>{gain}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">{gelisimKursu.title} - Paket Seçenekleri</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {gelisimKursu.pricing.packages.map((pkg) => {
                                    const perLessonPrice = gelisimKursu.pricing.perLesson?.[pkg.lessons as keyof typeof gelisimKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                            <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                                                 ders başına {currencyDetails[selectedCurrency]?.symbol}{(convertPrice(perLessonPrice)).toFixed(2)}
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

            {gcseKursu && (
                <section id="gcse-detay" className="mt-16 py-16 md:py-24 rounded-3xl bg-blue-50">
                    <div className="container max-w-6xl mx-auto">
                         <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{gcseKursu.title}</h2>
                             <div className="flex items-center justify-center gap-4 text-gray-500 mb-4">
                                <span>Süre: {gcseKursu.details.duration}</span>
                                <span>|</span>
                                <span>Yaş grubu: {gcseKursu.ageGroup}</span>
                            </div>
                             <p className="text-gray-600 max-w-3xl mx-auto">{gcseKursu.details.longDescription}</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-md mb-16">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle className="text-green-500" /> KAZANIMLAR</h3>
                            <ul className="space-y-3 text-gray-600 columns-1 md:columns-2">
                                {gcseKursu.details.gains.map((gain, index) => (
                                    <li key={index} className="flex items-start gap-3 break-inside-avoid">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>{gain}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">{gcseKursu.title} - Paket Seçeneği</h3>
                            <div className="flex justify-center">
                                {gcseKursu.pricing.packages.map((pkg) => {
                                    const perLessonPrice = gcseKursu.pricing.perLesson?.[pkg.lessons as keyof typeof gcseKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow w-full max-w-xs">
                                            <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                                                 ders başına {currencyDetails[selectedCurrency]?.symbol}{(convertPrice(perLessonPrice)).toFixed(2)}
                                            </Badge>
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                <BookOpen className="w-8 h-8 text-gray-500"/>
                                            </div>
                                            <h4 className="font-bold text-gray-800">{gcseKursu.title}</h4>
                                            <p className="text-sm text-gray-500">({gcseKursu.details.duration})</p>
                                            <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                            <PriceDisplay price={pkg.price} />
                                            <Button className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAddToCart(gcseKursu, pkg)}>
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
                    <div className="p-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 mb-8 inline-block">
                         <Button asChild size="lg" className="bg-white text-gray-800 hover:bg-gray-100 rounded-full text-base sm:text-lg font-bold px-6 h-auto py-3 sm:py-4">
                            <a href="https://wa.me/+905058029734" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <WhatsAppIcon className="w-6 h-6 text-[#25D366] fill-[#25D366]" />
                                <span className="text-center">İndirim kodu için bize yazın!</span>
                            </a>
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-x-8 gap-y-4 text-gray-600">
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
    );
}
