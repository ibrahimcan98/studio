
'use server'; // Convert this to a server component to fetch data on the server
import { useState } from 'react';
import { COURSES, Course } from "@/data/courses";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { CheckCircle, Info, BookOpen, ShoppingCart, ShieldCheck, Lock as LockIcon, Heart, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/footer";
import { getExchangeRates } from '@/ai/flows/exchange-rate-flow';
import { KurslarClientPage } from './kurslar-client';


export default async function KurslarPage() {
    
    // Fetch live exchange rates on the server
    const exchangeData = await getExchangeRates();
    const exchangeRates = exchangeData.rates;
    // Add EUR to the rates object as the base currency
    exchangeRates['EUR'] = 1;


    const baslangicKursu = COURSES.find(c => c.id === 'baslangic');
    const konusmaKursu = COURSES.find(c => c.id === 'konusma');
    const gelisimKursu = COURSES.find(c => c.id === 'gelisim');
    const akademikKursu = COURSES.find(c => c.id === 'akademik');


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
            
            <KurslarClientPage 
                exchangeRates={exchangeRates}
                baslangicKursu={baslangicKursu}
                konusmaKursu={konusmaKursu}
                gelisimKursu={gelisimKursu}
                akademikKursu={akademikKursu}
            />

            <Footer />
        </div>
    );
}

