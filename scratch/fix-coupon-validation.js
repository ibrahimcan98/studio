const fs = require('fs');

const sepetPath = 'c:/Users/ibrah/studio/src/app/sepet/page.tsx';
let sepetContent = fs.readFileSync(sepetPath, 'utf8');

const oldLogicRegex = /if \(couponSnap\.exists\(\) && couponSnap\.data\(\)\.isActive\) \{[\s\S]*?const data = couponSnap\.data\(\);[\s\S]*?applyStandardDiscount\(\{ \.\.\.data, code: couponSnap\.id \}\);[\s\S]*?let discountDisplay = '';/s;

const newLogic = `if (couponSnap.exists() && couponSnap.data().isActive) {
                 const data = couponSnap.data();
                 
                 // Check if coupon is applicable to any item in cart
                 const isApplicable = cartItems.some(item => {
                     const [courseId] = item.id.split('-');
                     const lessonsCount = parseInt(item.description.split(' ')[0]) || 0;
                     
                     const c_ids = Array.isArray(data.applicableCourseIds) ? data.applicableCourseIds : (data.applicableCourseId ? [data.applicableCourseId] : []);
                     const courseMatches = c_ids.length === 0 || c_ids.includes(courseId);
                     
                     const c_pkgs = Array.isArray(data.applicablePackages) 
                         ? data.applicablePackages.map((p: any) => Number(p)) 
                         : (data.applicablePackage ? [Number(data.applicablePackage)] : []);
                     
                     const packageMatches = c_pkgs.length === 0 || c_pkgs.includes(Number(lessonsCount));
         
                     return courseMatches && packageMatches;
                 });
                 
                 if (!isApplicable) {
                     toast({
                         variant: 'destructive',
                         title: 'Kupon Geçersiz',
                         description: 'Bu indirim kodu sepetinizdeki ders veya paketler için geçerli değil.',
                     });
                     setCoupon('');
                     return;
                 }
                 
                 applyStandardDiscount({ ...data, code: couponSnap.id });
                 setCoupon('');
                 
                 let discountDisplay = '';`;

if (oldLogicRegex.test(sepetContent)) {
    sepetContent = sepetContent.replace(oldLogicRegex, newLogic);
    fs.writeFileSync(sepetPath, sepetContent, 'utf8');
    console.log('Successfully updated handleApplyNormalCoupon in sepet/page.tsx');
} else {
    console.log('Failed to match oldLogicRegex in sepet/page.tsx');
}
