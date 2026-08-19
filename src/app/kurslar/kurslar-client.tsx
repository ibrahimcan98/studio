'use client';
import { useEffect } from 'react';
import { COURSES, Course } from "@/data/courses";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { CheckCircle, Info, BookOpen, ShoppingCart, ShieldCheck, Lock as LockIcon, Heart, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart, currencyDetails } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useFirestore, useCollection, useMemoFirebase, useUser, doc, useDoc } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { trackPixelEvent } from '@/components/analytics/FacebookPixel';
import { isGroupClassesEnabled } from '@/lib/feature-flags';


type KurslarClientPageProps = {
    exchangeRates: { [key: string]: number };
};

// Tüm kurslar için tek bir kitap görseli kullanıyoruz
const BOOK_IMAGE = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&h=200&auto=format&fit=crop";

export function KurslarClientPage({ 
    exchangeRates: initialRates,
}: KurslarClientPageProps) {

    const router = useRouter();
    const { toast } = useToast();
    const { addToCart, selectedCurrency, setSelectedCurrency, exchangeRates } = useCart();
    
    const db = useFirestore();
    const { user } = useUser();
    
    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);
    const { data: userData } = useDoc(userDocRef);

    const showGroupClasses = isGroupClassesEnabled(user?.email, userData?.role);

    const globalCouponsQuery = useMemoFirebase(() => 
        db ? query(collection(db, 'coupons'), where('isPublicDisplay', '==', true), where('isActive', '==', true)) : null
    , [db]);
    const { data: globalCoupons } = useCollection(globalCouponsQuery);
    
    useEffect(() => {
        trackPixelEvent('ViewContent', {
            content_name: 'Kurslar Sayfası',
            content_category: 'Education'
        });
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const courseId = params.get('id');
            if (courseId) {
                // Wait slightly for DOM to be fully ready
                setTimeout(() => {
                    const targetElement = document.getElementById(`${courseId}-detay`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            }
        }
    }, []);

    // Use context rates if loaded, otherwise fallback to server initial rates
    const currentRates = Object.keys(exchangeRates).length > 1 ? exchangeRates : initialRates;
    const currencies = Object.keys(currentRates).filter(code => currencyDetails[code]);

    const convertPrice = (priceInGbp: number) => {
        const rate = currentRates[selectedCurrency] || 1;
        return priceInGbp * rate;
    };

    const handleAddToCart = (course: any, pkg: any) => {
        addToCart({
            id: `${course.id}-${pkg.lessons}`,
            name: course.title,
            description: `${pkg.lessons} derslik paket`,
            price: pkg.price,
            quantity: 1,
            image: BOOK_IMAGE
        });

        // Meta Tracking
        trackPixelEvent('AddToCart', {
            content_name: course.title,
            content_ids: [`${course.id}-${pkg.lessons}`],
            content_type: 'product',
            value: pkg.price,
            currency: selectedCurrency
        });

        toast({

            title: "✅ Sepete Eklendi!",
            description: `${course.title} (${pkg.lessons} ders) sepetinize eklendi.`,
            className: "bg-green-600 text-white border-none shadow-2xl",
            action: (
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white text-green-600 hover:bg-slate-100 font-bold border-none"
                    onClick={() => router.push('/sepet')}
                >
                    Sepete Git
                </Button>
            ),
        });
    };

    const PriceDisplay = ({ price, courseId, packageLessons }: { price: number, courseId: string, packageLessons: number }) => {
        let discountPct = 0;
        
        const isCouponMatching = (c: any) => {
            // Course Check: If array exists and has length, check includes. Otherwise check legacy.
            const c_ids = Array.isArray(c.applicableCourseIds) ? c.applicableCourseIds : (c.applicableCourseId ? [c.applicableCourseId] : []);
            const courseMatches = c_ids.length === 0 || c_ids.includes(courseId);
            
            // Package Check: Force everything to Number for safe comparison
            const c_pkgs = Array.isArray(c.applicablePackages) 
                ? c.applicablePackages.map((p: any) => Number(p)) 
                : (c.applicablePackage ? [Number(c.applicablePackage)] : []);
            
            const packageMatches = c_pkgs.length === 0 || c_pkgs.includes(Number(packageLessons));

            return courseMatches && packageMatches;
        };

        if (globalCoupons && globalCoupons.length > 0) {
            const matchingCoupons = globalCoupons.filter((coupon: any) => isCouponMatching(coupon));
            
            if (matchingCoupons.length > 0) {
                discountPct = Math.max(...matchingCoupons.map((c: any) => {
                    if (c.discountType === 'fixed_amount' && c.discountAmount) {
                        return c.discountAmount / price;
                    }
                    return c.discountPct || 0;
                }));
            }
        }
        
        const originalConvertedPrice = convertPrice(price);
        const finalGbp = price * (1 - discountPct);
        const discountedConvertedPrice = convertPrice(finalGbp);
        
        const selectedCurrencyDetails = currencyDetails[selectedCurrency];
        
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex flex-col items-center my-4 cursor-help">
                            {discountPct > 0 ? (
                                <>
                                    <span className="text-xl line-through text-red-500 font-bold opacity-60 mb-0.5">
                                        {selectedCurrencyDetails?.symbol || selectedCurrency}{originalConvertedPrice.toFixed(2)}
                                    </span>
                                    <span className="text-3xl font-black text-green-600">
                                        {selectedCurrencyDetails?.symbol || selectedCurrency}{discountedConvertedPrice.toFixed(2)}
                                    </span>
                                    <div className="absolute -top-3 -left-3 z-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white px-3 py-1.5 rounded-xl rounded-tl-none shadow-[0_4px_10px_rgba(249,115,22,0.4)] transform -rotate-3 border border-white/40">
                                        <span className="text-sm font-black whitespace-nowrap drop-shadow-md">%{(discountPct * 100).toFixed(0)} PAKET AVANTAJI</span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-3xl font-bold text-gray-900">
                                    {selectedCurrencyDetails?.symbol || selectedCurrency}{originalConvertedPrice.toFixed(2)}
                                </p>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="space-y-1 text-xs">
                             {currencies.filter(c => c !== selectedCurrency && currencyDetails[c]).slice(0, 5).map(currency => (
                                <div key={currency} className="flex justify-between gap-2">
                                    <span>{currencyDetails[currency]?.flag} {currency}:</span>
                                    <span>{currencyDetails[currency]?.symbol}{(finalGbp * currentRates[currency]).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    const PerLessonPrice = ({ perLessonPriceInGbp, courseId, packageLessons }: { perLessonPriceInGbp: number, courseId: string, packageLessons: number }) => {
        let discountPct = 0;

        const isCouponMatching = (c: any) => {
            // Course Check: If array exists and has length, check includes. Otherwise check legacy.
            const c_ids = Array.isArray(c.applicableCourseIds) ? c.applicableCourseIds : (c.applicableCourseId ? [c.applicableCourseId] : []);
            const courseMatches = c_ids.length === 0 || c_ids.includes(courseId);
            
            // Package Check: Force everything to Number for safe comparison
            const c_pkgs = Array.isArray(c.applicablePackages) 
                ? c.applicablePackages.map((p: any) => Number(p)) 
                : (c.applicablePackage ? [Number(c.applicablePackage)] : []);
            
            const packageMatches = c_pkgs.length === 0 || c_pkgs.includes(Number(packageLessons));

            return courseMatches && packageMatches;
        };
        
        if (globalCoupons && globalCoupons.length > 0) {
            const matchingCoupons = globalCoupons.filter((coupon: any) => isCouponMatching(coupon));
            
            if (matchingCoupons.length > 0) {
                discountPct = Math.max(...matchingCoupons.map((c: any) => {
                    if (c.discountType === 'fixed_amount' && c.discountAmount) {
                        const estimatedPrice = perLessonPriceInGbp * packageLessons;
                        return c.discountAmount / estimatedPrice;
                    }
                    return c.discountPct || 0;
                }));
            }
        }
        
        const originalPrice = convertPrice(perLessonPriceInGbp);
        const discountedPrice = convertPrice(perLessonPriceInGbp * (1 - discountPct));
        const symbol = currencyDetails[selectedCurrency]?.symbol || '';
        
        return (
            <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800 flex items-center gap-1.5 px-3 py-1">
                <span className="text-xs opacity-80">ders başına</span>
                {discountPct > 0 ? (
                    <div className="flex items-center gap-1.5">
                        <span className="line-through opacity-50 text-[10px]">{symbol}{originalPrice.toFixed(2)}</span>
                        <span className="font-bold">{symbol}{discountedPrice.toFixed(2)}</span>
                    </div>
                ) : (
                    <span className="font-bold">{symbol}{originalPrice.toFixed(2)}</span>
                )}
            </Badge>
        );
    };

    const baslangicKursu = COURSES.find(c => c.id === 'baslangic');
    const konusmaKursu = COURSES.find(c => c.id === 'konusma');
    const akademikKursu = COURSES.find(c => c.id === 'akademik');
    const gelisimKursu = COURSES.find(c => c.id === 'gelisim');
    const gcseKursu = COURSES.find(c => c.id === 'gcse');
    const grupKursu = COURSES.find(c => c.id === 'grup');

    const visibleCourses = COURSES.filter(c => c.id !== 'grup' || showGroupClasses);

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
                {visibleCourses.map((course) => (
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
                                    const perLessonPrice = baslangicKursu.pricing.perLesson?.[String(pkg.lessons) as keyof typeof baslangicKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="relative border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                <BookOpen className="w-8 h-8 text-gray-500"/>
                                            </div>
                                            
                                            <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                            <PriceDisplay price={pkg.price} courseId={baslangicKursu!.id} packageLessons={pkg.lessons} />
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
                                    const perLessonPrice = konusmaKursu.pricing.perLesson?.[String(pkg.lessons) as keyof typeof konusmaKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="relative border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                <BookOpen className="w-8 h-8 text-gray-500"/>
                                            </div>
                                            
                                            <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                            <PriceDisplay price={pkg.price} courseId={konusmaKursu.id} packageLessons={pkg.lessons} />
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
                                    const perLessonPrice = akademikKursu.pricing.perLesson?.[String(pkg.lessons) as keyof typeof akademikKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="relative border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                <BookOpen className="w-8 h-8 text-gray-500"/>
                                            </div>
                                            
                                            <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                            <PriceDisplay price={pkg.price} courseId={akademikKursu!.id} packageLessons={pkg.lessons} />
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
                                    const perLessonPrice = gelisimKursu.pricing.perLesson?.[String(pkg.lessons) as keyof typeof gelisimKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="relative border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                <BookOpen className="w-8 h-8 text-gray-500"/>
                                            </div>
                                            
                                            <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                            <PriceDisplay price={pkg.price} courseId={gelisimKursu!.id} packageLessons={pkg.lessons} />
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
                                    const perLessonPrice = gcseKursu.pricing.perLesson?.[String(pkg.lessons) as keyof typeof gcseKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="relative border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center bg-white shadow-sm hover:shadow-lg transition-shadow w-full max-w-xs">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100 mb-4">
                                                <BookOpen className="w-8 h-8 text-gray-500"/>
                                            </div>
                                            
                                            <p className="text-gray-600 mt-2">{pkg.lessons} derslik paket</p>
                                            <PriceDisplay price={pkg.price} courseId={gcseKursu.id} packageLessons={pkg.lessons} />
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

            {showGroupClasses && grupKursu && (
                <section id="grup-detay" className="mt-16 py-16 md:py-24 rounded-3xl bg-purple-50 border-4 border-purple-200">
                    <div className="container max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">{grupKursu.title}</h2>
                            <div className="flex items-center justify-center gap-4 text-purple-700/70">
                                <span>Süre: {grupKursu.details.duration}</span>
                                <span>|</span>
                                <span>Yaş grubu: {grupKursu.ageGroup}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-8 items-center mb-16">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-purple-100">
                                <h3 className="font-bold text-lg mb-2">{grupKursu.details.longDescription}</h3>
                                <p className="font-semibold text-md mb-4 text-gray-700 mt-6">Bu derste çocuklar:</p>
                                <ul className="space-y-3 text-gray-600">
                                    {grupKursu.details.gains.map((gain, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                                            <span>{gain}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-900">{grupKursu.title} - Katılım Paketi</h3>
                            <div className="flex justify-center">
                                {grupKursu.pricing.packages.map((pkg) => {
                                    const perLessonPrice = grupKursu.pricing.perLesson?.[String(pkg.lessons) as keyof typeof grupKursu.pricing.perLesson];
                                    if (!perLessonPrice) return null;
                                    return (
                                        <div key={pkg.lessons} className="relative border-2 border-purple-200 rounded-2xl p-8 flex flex-col items-center text-center bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all w-full max-w-xs">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-purple-100 mb-4">
                                                <BookOpen className="w-8 h-8 text-purple-600"/>
                                            </div>
                                            
                                            <p className="text-purple-600 mt-2 font-bold">{pkg.lessons} haftalık grup paketi</p>
                                            <PriceDisplay price={pkg.price} courseId={grupKursu.id} packageLessons={pkg.lessons} />
                                            <Button className="w-full mt-auto bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200" onClick={() => handleAddToCart(grupKursu, pkg)}>
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
                            <a 
                                href="https://wa.me/+905058029734" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2"
                                onClick={() => trackPixelEvent('Contact', { type: 'whatsapp', position: 'kurslar_footer' })}
                            >
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
