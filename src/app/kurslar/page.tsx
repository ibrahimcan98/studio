
'use server'; // Convert this to a server component to fetch data on the server
import { COURSES } from "@/data/courses";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
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
            <header className="py-16 md:py-24 text-center px-4">
                 <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">KURSLAR</h1>
                 <Button asChild variant="outline" className="bg-white rounded-full py-4 sm:py-6 px-4 sm:px-8 shadow-lg hover:shadow-xl transition-shadow border-gray-200 h-auto text-sm sm:text-base">
                    <a href="https://wa.me/+905058029734" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-3">
                        <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 fill-green-500" />
                        <span className="font-semibold text-center">İndirimsiz almayın! Bizimle iletişime geçin, promosyon kodu ile indirim kazanın.</span>
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
