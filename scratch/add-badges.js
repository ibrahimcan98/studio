const fs = require('fs');
const path = 'c:/Users/ibrah/studio/src/app/kurslar/kurslar-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add relative to card classes
content = content.replace(/className="border border-gray-200 rounded-2xl/g, 'className="relative border border-gray-200 rounded-2xl');
content = content.replace(/className="border-2 border-purple-200 rounded-2xl/g, 'className="relative border-2 border-purple-200 rounded-2xl');

// 2. Add badge to PriceDisplay
const priceDisplayRegex = /<span className="text-3xl font-black text-green-600">\s*\{selectedCurrencyDetails\?\.symbol \|\| selectedCurrency\}\{discountedConvertedPrice\.toFixed\(2\)\}\s*<\/span>/s;

const newPriceDisplay = `<span className="text-3xl font-black text-green-600">
                                        {selectedCurrencyDetails?.symbol || selectedCurrency}{discountedConvertedPrice.toFixed(2)}
                                    </span>
                                    <div className="absolute -top-3 -left-3 z-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white px-3 py-1.5 rounded-xl rounded-tl-none shadow-[0_4px_10px_rgba(249,115,22,0.4)] transform -rotate-3 border border-white/40">
                                        <span className="text-sm font-black whitespace-nowrap drop-shadow-md">%{(discountPct * 100).toFixed(0)} PAKET AVANTAJI</span>
                                    </div>`;

if (!content.includes('PAKET AVANTAJI</span>')) {
    content = content.replace(priceDisplayRegex, newPriceDisplay);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed kurslar-client.tsx badges');
