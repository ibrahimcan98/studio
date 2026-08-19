const fs = require('fs');

const path = "c:/Users/ibrah/studio/src/context/cart-context.tsx";
let content = fs.readFileSync(path, 'utf8');

// 1. Add getItemDiscountPct to CartContextType
content = content.replace('appliedCoupon: string | null;', 'getItemDiscountPct: (item: CartItem) => number;\n    appliedCoupon: string | null;');

// 2. Replace discountAmount calculation logic
const originalDiscountAmountBlock = `    const discountAmount = cartItems.reduce((total, item) => {
        let itemDiscount = 0;
        let maxItemDiscountPct = 0;
        
        const [courseId] = item.id.split('-');
        const lessonsCount = parseInt(item.description.split(' ')[0]) || 0;

        // Helper to check if a coupon matches an item
        const isCouponMatching = (c: any) => {
            // Course Check: If array exists and has length, check includes. Otherwise check legacy.
            const c_ids = Array.isArray(c.applicableCourseIds) ? c.applicableCourseIds : (c.applicableCourseId ? [c.applicableCourseId] : []);
            const courseMatches = c_ids.length === 0 || c_ids.includes(courseId);
            
            // Package Check: Force everything to Number for safe comparison
            const c_pkgs = Array.isArray(c.applicablePackages) 
                ? c.applicablePackages.map((p: any) => Number(p)) 
                : (c.applicablePackage ? [Number(c.applicablePackage)] : []);
            
            const packageMatches = c_pkgs.length === 0 || c_pkgs.includes(Number(lessonsCount));

            return courseMatches && packageMatches;
        };
        
        // 1. Check Standard Coupon (Manually entered)
        if (appliedCouponData && isCouponMatching(appliedCouponData)) {
            if (appliedCouponData.discountType === 'fixed_amount' && appliedCouponData.discountAmount) {
                const effectivePct = appliedCouponData.discountAmount / item.price;
                maxItemDiscountPct = Math.max(maxItemDiscountPct, effectivePct);
            } else if (appliedCouponData.discountPct) {
                maxItemDiscountPct = Math.max(maxItemDiscountPct, appliedCouponData.discountPct);
            }
        }
        
        // 2. Check Automatic Public Coupons
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
        
        // Sepette Ek Paket İndirimleri (12 derslik için %10, 24 derslik için %15)
        if (lessonsCount === 12) maxItemDiscountPct += 0.10;
        if (lessonsCount === 24) maxItemDiscountPct += 0.15;
        
        // Apply the best found discount for this item
        itemDiscount += (item.price * item.quantity * maxItemDiscountPct);
        
        // 3. Check Referral Discount (Referral is additive if applicable, but usually kept separate)
        if (referralDiscountPct > 0) {
            itemDiscount += (item.price * item.quantity * referralDiscountPct);
        }
        
        // İndirim, ürünün kendi fiyatını aşamaz (Negatif fiyatı engellemek için)
        itemDiscount = Math.min(itemDiscount, item.price * item.quantity);
        
        return total + itemDiscount;
    }, 0);`;

const newDiscountAmountBlock = `    const getItemDiscountPct = (item: CartItem) => {
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

content = content.replace(originalDiscountAmountBlock, newDiscountAmountBlock);

// 3. Add getItemDiscountPct to CartContext.Provider value
content = content.replace('cartTotal, applyStandardDiscount, discountAmount,', 'cartTotal, applyStandardDiscount, discountAmount, getItemDiscountPct,');

fs.writeFileSync(path, content, 'utf8');
console.log("Done");
