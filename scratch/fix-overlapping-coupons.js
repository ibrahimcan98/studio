const fs = require('fs');
const path = 'c:/Users/ibrah/studio/src/context/cart-context.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /const getItemDiscountPct = \(item: CartItem\) => \{[\s\S]*?return maxItemDiscountPct;\n    \};/s;

const newLogic = `const getItemDiscountPct = (item: CartItem) => {
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
        
        // Sepetteki indirimli fiyat üzerinden bir daha indirim yapmak için (Compound Discount)
        return 1 - ((1 - publicDiscountPct) * (1 - manualDiscountPct));
    };`;

content = content.replace(regex, newLogic);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully fixed overlapping coupons logic');
