const fs = require('fs');
const path = 'c:/Users/ibrah/studio/src/context/cart-context.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update interface
if (!content.includes('publicDiscountAmount: number;')) {
    content = content.replace('discountAmount: number;', 'discountAmount: number;\n    publicDiscountAmount: number;\n    manualDiscountAmount: number;');
}

if (!content.includes('getItemDiscountBreakdown')) {
    content = content.replace('getItemDiscountPct: (item: CartItem) => number;', 'getItemDiscountPct: (item: CartItem) => number;\n    getItemDiscountBreakdown: (item: CartItem) => { publicPct: number, manualPct: number };');
}

// 2. Add getItemDiscountBreakdown and recalculate amounts
const regex = /const getItemDiscountPct = \(item: CartItem\) => \{[\s\S]*?return 1 - \(\(1 - publicDiscountPct\) \* \(1 - manualDiscountPct\)\);\n    \};/s;
const newGetItemLogic = `const getItemDiscountBreakdown = (item: CartItem) => {
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
        
        let manualDiscountPct = 0;
        if (appliedCouponData && isCouponMatching(appliedCouponData)) {
            if (appliedCouponData.discountType === 'fixed_amount' && appliedCouponData.discountAmount) {
                manualDiscountPct = appliedCouponData.discountAmount / item.price;
            } else if (appliedCouponData.discountPct) {
                manualDiscountPct = appliedCouponData.discountPct;
            }
        }
        
        let publicDiscountPct = 0;
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
        return 1 - ((1 - bd.publicPct) * (1 - bd.manualPct));
    };`;

content = content.replace(regex, newGetItemLogic);

// 3. Update discountAmount logic
const discountAmountRegex = /const discountAmount = cartItems\.reduce\(\(total, item\) => \{[\s\S]*?return total \+ itemDiscount;\n    \}, 0\);/s;
const newDiscountAmountLogic = `const publicDiscountAmount = cartItems.reduce((total, item) => {
        const bd = getItemDiscountBreakdown(item);
        return total + (item.price * item.quantity * bd.publicPct);
    }, 0);

    const manualDiscountAmount = cartItems.reduce((total, item) => {
        const bd = getItemDiscountBreakdown(item);
        const priceAfterPublic = item.price * (1 - bd.publicPct);
        return total + (priceAfterPublic * item.quantity * bd.manualPct);
    }, 0);

    const referralDiscountAmount = cartItems.reduce((total, item) => {
        return total + (referralDiscountPct > 0 ? (item.price * item.quantity * referralDiscountPct) : 0);
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

content = content.replace(discountAmountRegex, newDiscountAmountLogic);

// 4. Update Provider value
if (!content.includes('publicDiscountAmount,')) {
    content = content.replace('discountAmount, getItemDiscountPct, finalTotal', 'discountAmount, publicDiscountAmount, manualDiscountAmount, getItemDiscountPct, getItemDiscountBreakdown, finalTotal');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully refactored cart-context.tsx for breakdown');
