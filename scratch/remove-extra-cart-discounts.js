const fs = require('fs');

// 1. Remove from kurslar-client.tsx
const clientPath = 'c:/Users/ibrah/studio/src/app/kurslar/kurslar-client.tsx';
let clientContent = fs.readFileSync(clientPath, 'utf8');

// Replace exactly these lines:
// {packageLessons === 12 && <div className="text-sm text-orange-500 font-bold mt-1">Sepette ek %10 (Sepet fiyatı: {selectedCurrencyDetails?.symbol || selectedCurrency}{(discountedConvertedPrice * 0.90).toFixed(2)})</div>}
// {packageLessons === 24 && <div className="text-sm text-orange-500 font-bold mt-1">Sepette ek %15 (Sepet fiyatı: {selectedCurrencyDetails?.symbol || selectedCurrency}{(discountedConvertedPrice * 0.85).toFixed(2)})</div>}

const regexClient1 = /.*Sepette ek %10.*?\n/g;
const regexClient2 = /.*Sepette ek %15.*?\n/g;
clientContent = clientContent.replace(regexClient1, '');
clientContent = clientContent.replace(regexClient2, '');

fs.writeFileSync(clientPath, clientContent, 'utf8');
console.log('Fixed kurslar-client.tsx');

// 2. Remove from cart-context.tsx
const contextPath = 'c:/Users/ibrah/studio/src/context/cart-context.tsx';
let contextContent = fs.readFileSync(contextPath, 'utf8');

const regexContext = /let extraDiscount = 0;\s*if \(lessonsCount === 12\) extraDiscount = 0\.10;\s*if \(lessonsCount === 24\) extraDiscount = 0\.15;\s*if \(extraDiscount > 0\) \{\s*maxItemDiscountPct = 1 - \(\(1 - maxItemDiscountPct\) \* \(1 - extraDiscount\)\);\s*\}/s;
contextContent = contextContent.replace(regexContext, '');

fs.writeFileSync(contextPath, contextContent, 'utf8');
console.log('Fixed cart-context.tsx');
