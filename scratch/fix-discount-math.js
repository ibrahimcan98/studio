const fs = require('fs');
const path = 'c:/Users/ibrah/studio/src/context/cart-context.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /if \(lessonsCount === 12\) maxItemDiscountPct \+= 0\.10;\s*if \(lessonsCount === 24\) maxItemDiscountPct \+= 0\.15;/s;

const replacement = `let extraDiscount = 0;
        if (lessonsCount === 12) extraDiscount = 0.10;
        if (lessonsCount === 24) extraDiscount = 0.15;
        
        if (extraDiscount > 0) {
            maxItemDiscountPct = 1 - ((1 - maxItemDiscountPct) * (1 - extraDiscount));
        }`;

content = content.replace(regex, replacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully fixed compound discount');
