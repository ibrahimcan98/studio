const fs = require('fs');
const path = 'c:/Users/ibrah/studio/src/context/cart-context.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add to CartContextType interface
if (!content.includes('getItemDiscountPct: (item: CartItem) => number;')) {
    content = content.replace('appliedCoupon: string | null;', 'getItemDiscountPct: (item: CartItem) => number;\n    appliedCoupon: string | null;');
}

// Add to CartContext.Provider value
if (!content.includes('getItemDiscountPct, finalTotal')) {
    content = content.replace('discountAmount, finalTotal,', 'discountAmount, getItemDiscountPct, finalTotal,');
}

// Replace discountAmount logic
const discountAmountRegex = /const discountAmount = cartItems\.reduce\(\(total, item\) => \{[\s\S]*?return total \+ itemDiscount;\s*\}, 0\);/;

const newDiscountLogic = `const getItemDiscountPct = (item: CartItem) => {
        let maxItemDiscountPct = 0;
        
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
        
        if (appliedCouponData && isCouponMatching(appliedCouponData)) {
            if (appliedCouponData.discountType === 'fixed_amount' && appliedCouponData.discountAmount) {
                const effectivePct = appliedCouponData.discountAmount / item.price;
                maxItemDiscountPct = Math.max(maxItemDiscountPct, effectivePct);
            } else if (appliedCouponData.discountPct) {
                maxItemDiscountPct = Math.max(maxItemDiscountPct, appliedCouponData.discountPct);
            }
        }
        
        if (publicCoupons && publicCoupons.length > 0) {
            const matchingPublicCoupons = publicCoupons.filter((c: any) => isCouponMatching(c));
            
            if (matchingPublicCoupons.length > 0) {
                const bestPublicPct = Math.max(...matchingPublicCoupons.map((c: any) => {
                    if (c.discountType === 'fixed_amount' && c.discountAmount) {
                        return c.discountAmount / item.price;
                    }
                    return c.discountPct || 0;
                }));
                maxItemDiscountPct = Math.max(maxItemDiscountPct, bestPublicPct);
            }
        }
        
        if (lessonsCount === 12) maxItemDiscountPct += 0.10;
        if (lessonsCount === 24) maxItemDiscountPct += 0.15;
        
        return maxItemDiscountPct;
    };

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

content = content.replace(discountAmountRegex, newDiscountLogic);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully refactored cart-context.tsx');
