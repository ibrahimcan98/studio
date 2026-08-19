const fs = require('fs');

// --- 1. Fix cart-context.tsx ---
const cartPath = 'c:/Users/ibrah/studio/src/context/cart-context.tsx';
let cartContent = fs.readFileSync(cartPath, 'utf8');

// Update Interface
if (!cartContent.includes('publicDiscountAmount: number;')) {
    cartContent = cartContent.replace(
        'discountAmount: number;\n    finalTotal: number;', 
        'discountAmount: number;\n    publicDiscountAmount: number;\n    manualDiscountAmount: number;\n    finalTotal: number;'
    );
}

if (!cartContent.includes('getItemDiscountBreakdown:')) {
    cartContent = cartContent.replace(
        'getItemDiscountPct: (item: CartItem) => number;\n', 
        'getItemDiscountPct: (item: CartItem) => number;\n    getItemDiscountBreakdown: (item: CartItem) => { publicPct: number, manualPct: number };\n'
    );
}

// Update Logic
const oldGetItemPctRegex = /const getItemDiscountPct = \(item: CartItem\) => \{[\s\S]*?return maxItemDiscountPct;\n    \};/s;

const newGetItemLogic = `const getItemDiscountBreakdown = (item: CartItem) => {
        let manualDiscountPct = 0;
        let publicDiscountPct = 0;
        
        const [courseId] = item.id.split('-');
        const lessonsCount = parseInt(item.description.split(' ')[0]) || 0;

        const isCouponMatching = (c: any) => {
            const c_ids = Array.isArray(c.applicableCourseIds) ? c.applicableCourseIds : (c.applicableCourseId ? [c.applicableCourseId] : []);
            const courseMatches = c_ids.length === 0 || c_ids.includes(courseId);
            
            const c_pkgs = Array.isArray(c.applicablePackages) 
                ? c.applicablePackages.map((p: any) => Number(p)) 
                : (c.applicablePackage ? [Number(c.applicablePackage)] : []);
            
            const packageMatches = c_pkgs.length === 0 || c_pkgs.includes(Number(lessonsCount));

            return courseMatches && packageMatches;
        };
        
        // 1. Check Standard Coupon (Manually entered)
        if (appliedCouponData && isCouponMatching(appliedCouponData)) {
            if (appliedCouponData.discountType === 'fixed_amount' && appliedCouponData.discountAmount) {
                manualDiscountPct = appliedCouponData.discountAmount / item.price;
            } else if (appliedCouponData.discountPct) {
                manualDiscountPct = appliedCouponData.discountPct;
            }
        }
        
        // 2. Check Automatic Public Coupons
        if (publicCoupons && publicCoupons.length > 0) {
            const matchingPublicCoupons = publicCoupons.filter((c: any) => isCouponMatching(c));
            
            if (matchingPublicCoupons.length > 0) {
                publicDiscountPct = Math.max(...matchingPublicCoupons.map((c: any) => {
                    if (c.discountType === 'fixed_amount' && c.discountAmount) {
                        return c.discountAmount / item.price;
                    }
                    return c.discountPct || 0;
                }));
            }
        }
        
        return { publicPct: publicDiscountPct, manualPct: manualDiscountPct };
    };

    const getItemDiscountPct = (item: CartItem) => {
        const bd = getItemDiscountBreakdown(item);
        // Katlamalı indirim (Compound Discount)
        return 1 - ((1 - bd.publicPct) * (1 - bd.manualPct));
    };`;

cartContent = cartContent.replace(oldGetItemPctRegex, newGetItemLogic);

// Update Discount Amounts
const oldAmountsRegex = /const discountAmount = cartItems\.reduce\(\(total, item\) => \{[\s\S]*?return total \+ itemDiscount;\n    \}, 0\);/s;
const newAmountsLogic = `const publicDiscountAmount = cartItems.reduce((total, item) => {
        const bd = getItemDiscountBreakdown(item);
        return total + (item.price * item.quantity * bd.publicPct);
    }, 0);

    const manualDiscountAmount = cartItems.reduce((total, item) => {
        const bd = getItemDiscountBreakdown(item);
        const priceAfterPublic = item.price * (1 - bd.publicPct);
        return total + (priceAfterPublic * item.quantity * bd.manualPct);
    }, 0);

    const discountAmount = cartItems.reduce((total, item) => {
        let itemDiscount = 0;
        const maxItemDiscountPct = getItemDiscountPct(item);
        itemDiscount += (item.price * item.quantity * maxItemDiscountPct);
        if (referralDiscountPct > 0) {
            itemDiscount += (item.price * item.quantity * referralDiscountPct);
        }
        itemDiscount = Math.min(itemDiscount, item.price * item.quantity);
        return total + itemDiscount;
    }, 0);`;

cartContent = cartContent.replace(oldAmountsRegex, newAmountsLogic);

// Export context values
cartContent = cartContent.replace(
    'discountAmount, finalTotal, appliedCoupon, appliedCouponData, removeCoupon,',
    'discountAmount, publicDiscountAmount, manualDiscountAmount, getItemDiscountBreakdown, finalTotal, appliedCoupon, appliedCouponData, removeCoupon,'
);

fs.writeFileSync(cartPath, cartContent, 'utf8');
console.log('cart-context.tsx fixed');

// --- 2. Fix sepet/page.tsx ---
const sepetPath = 'c:/Users/ibrah/studio/src/app/sepet/page.tsx';
let sepetContent = fs.readFileSync(sepetPath, 'utf8');

sepetContent = sepetContent.replace(
    'applyStandardDiscount, discountAmount, finalTotal, appliedCoupon, appliedCouponData, referrerId,',
    'applyStandardDiscount, discountAmount, publicDiscountAmount, manualDiscountAmount, getItemDiscountPct, finalTotal, appliedCoupon, appliedCouponData, referrerId,'
);

// Fix Cart Item Price Display
const oldPriceDisplay = `<p className="font-bold text-lg">{symbol}{formatPrice(item.price * item.quantity)}</p>`;
const newPriceDisplay = `{getItemDiscountPct && getItemDiscountPct(item) > 0 ? (
                                                        <>
                                                            <p className="font-bold text-sm text-red-500 line-through opacity-60">
                                                                {symbol}{formatPrice(item.price * item.quantity)}
                                                            </p>
                                                            <p className="font-black text-xl text-green-600">
                                                                {symbol}{formatPrice(item.price * item.quantity * (1 - getItemDiscountPct(item)))}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="font-bold text-lg">
                                                            {symbol}{formatPrice(item.price * item.quantity)}
                                                        </p>
                                                    )}`;

sepetContent = sepetContent.replace(oldPriceDisplay, newPriceDisplay);

// Fix Order Summary Breakdown
const oldSummary = `{discountAmount > 0 && (
                                            <div className="flex justify-between text-green-600 font-bold">
                                                <span>Tamamlanan İndirim</span>
                                                <span>-{symbol}{formatPrice(discountAmount)}</span>
                                            </div>
                                        )}`;

const newSummary = `{publicDiscountAmount > 0 && (
                                            <div className="flex justify-between text-green-600 font-bold text-sm">
                                                <span>Site İndirimi</span>
                                                <span>-{symbol}{formatPrice(publicDiscountAmount)}</span>
                                            </div>
                                        )}
                                        {manualDiscountAmount > 0 && (
                                            <div className="flex justify-between text-green-600 font-bold text-sm bg-green-50 p-1.5 rounded -mx-1.5 px-1.5">
                                                <span>Kupon İndirimi</span>
                                                <span>-{symbol}{formatPrice(manualDiscountAmount)}</span>
                                            </div>
                                        )}
                                        {discountAmount > (publicDiscountAmount + manualDiscountAmount) + 0.01 && (
                                            <div className="flex justify-between text-green-600 font-bold text-sm">
                                                <span>Ek İndirimler</span>
                                                <span>-{symbol}{formatPrice(discountAmount - (publicDiscountAmount + manualDiscountAmount))}</span>
                                            </div>
                                        )}`;

sepetContent = sepetContent.replace(oldSummary, newSummary);

fs.writeFileSync(sepetPath, sepetContent, 'utf8');
console.log('sepet/page.tsx fixed');
