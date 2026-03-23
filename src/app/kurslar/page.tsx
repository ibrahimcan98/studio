
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/footer";
import { getExchangeRates } from '@/ai/flows/exchange-rate-flow';
import { KurslarClientPage } from './kurslar-client';


export const dynamic = 'force-dynamic';

export default async function KurslarPage() {
    
    // Fetch live exchange rates on the server
    const exchangeData = await getExchangeRates();
    const exchangeRates = exchangeData.rates;
    // Add EUR to the rates object as the base currency
    exchangeRates['EUR'] = 1;

    return (
        <div className="bg-white min-h-screen text-[#243B53]">
            <header className="py-16 md:py-24 text-center px-4">
                 <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">KURSLAR</h1>
                 <Button asChild variant="outline" className="bg-white rounded-full py-4 px-6 shadow-lg hover:shadow-xl transition-shadow border-gray-200 h-auto text-sm">
                    <a href="https://wa.me/+905058029734" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                        <WhatsAppIcon className="w-6 h-6 text-green-500 fill-green-500" />
                        <span className="font-semibold text-center">İndirim kodu almak için bize yazın!</span>
                    </a>
                </Button>
            </header>
            
            <KurslarClientPage 
                exchangeRates={exchangeRates}
            />

            <Footer />
        </div>
    );
}
