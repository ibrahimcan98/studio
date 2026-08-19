const fs = require('fs');

const cartPath = 'c:/Users/ibrah/studio/src/context/cart-context.tsx';
let cartLines = fs.readFileSync(cartPath, 'utf8').split(/\r?\n/);

const newLogic = `    const getItemDiscountBreakdown = (item: CartItem) => {
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
        
        if (appliedCouponData && isCouponMatching(appliedCouponData)) {
            if (appliedCouponData.discountType === 'fixed_amount' && appliedCouponData.discountAmount) {
                manualDiscountPct = appliedCouponData.discountAmount / item.price;
            } else if (appliedCouponData.discountPct) {
                manualDiscountPct = appliedCouponData.discountPct;
            }
        }
        
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
    };

    const publicDiscountAmount = cartItems.reduce((total, item) => {
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

let startIndex = -1;
let endIndex = -1;
for (let i = 0; i < cartLines.length; i++) {
    if (cartLines[i].includes('const discountAmount = cartItems.reduce((total, item) => {')) {
        startIndex = i;
        break;
    }
}
if (startIndex !== -1) {
    for (let i = startIndex; i < cartLines.length; i++) {
        if (cartLines[i].includes('}, 0);')) {
            endIndex = i;
            break;
        }
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    cartLines.splice(startIndex, endIndex - startIndex + 1, newLogic);
    fs.writeFileSync(cartPath, cartLines.join('\n'), 'utf8');
    console.log('Successfully replaced discount block in cart-context.tsx');
} else {
    console.log('Failed to find discount block boundaries!');
    console.log(startIndex, endIndex);
}
