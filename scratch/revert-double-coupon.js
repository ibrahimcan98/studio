const fs = require('fs');

// 1. Revert cart-context.tsx
const cartPath = 'c:/Users/ibrah/studio/src/context/cart-context.tsx';
let cartContent = fs.readFileSync(cartPath, 'utf8');

cartContent = cartContent.replace('publicDiscountAmount: number;\n    manualDiscountAmount: number;', '');
cartContent = cartContent.replace('getItemDiscountBreakdown: (item: CartItem) => { publicPct: number, manualPct: number };\n', '');
cartContent = cartContent.replace('discountAmount, publicDiscountAmount, manualDiscountAmount, getItemDiscountPct, getItemDiscountBreakdown, finalTotal', 'discountAmount, getItemDiscountPct, finalTotal');

const breakdownRegex = /const getItemDiscountBreakdown = \(item: CartItem\) => \{[\s\S]*?return \{ publicPct: publicDiscountPct, manualPct: manualDiscountPct \};\n    \};\n\n    const getItemDiscountPct = \(item: CartItem\) => \{[\s\S]*?return 1 - \(\(1 - bd\.publicPct\) \* \(1 - bd\.manualPct\)\);\n    \};/s;

const originalGetItemPct = `const getItemDiscountPct = (item: CartItem) => {
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
        
        return maxItemDiscountPct;
    };`;

cartContent = cartContent.replace(breakdownRegex, originalGetItemPct);

const discountAmountsRegex = /const publicDiscountAmount = cartItems\.reduce\(\(total, item\) => \{[\s\S]*?const discountAmount = cartItems\.reduce\(\(total, item\) => \{/s;
cartContent = cartContent.replace(discountAmountsRegex, `const discountAmount = cartItems.reduce((total, item) => {`);

fs.writeFileSync(cartPath, cartContent, 'utf8');
console.log('cart-context.tsx reverted');

// 2. Revert sepet/page.tsx
const sepetPath = 'c:/Users/ibrah/studio/src/app/sepet/page.tsx';
let sepetContent = fs.readFileSync(sepetPath, 'utf8');

sepetContent = sepetContent.replace('applyStandardDiscount, discountAmount, publicDiscountAmount, manualDiscountAmount, getItemDiscountPct', 'applyStandardDiscount, discountAmount, getItemDiscountPct');

const sepetBreakdownRegex = /\{publicDiscountAmount > 0 && \([\s\S]*?Ek İndirimler[\s\S]*?<\/div>\s*\)\}/s;

const originalSepetSummary = `{discountAmount > 0 && (
                                            <div className="flex justify-between text-green-600 font-bold">
                                                <span>Tamamlanan İndirim</span>
                                                <span>-{symbol}{formatPrice(discountAmount)}</span>
                                            </div>
                                        )}`;

sepetContent = sepetContent.replace(sepetBreakdownRegex, originalSepetSummary);

fs.writeFileSync(sepetPath, sepetContent, 'utf8');
console.log('sepet/page.tsx reverted');
