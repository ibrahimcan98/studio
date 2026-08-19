const fs = require('fs');

const sepetPath = 'c:/Users/ibrah/studio/src/app/sepet/page.tsx';
let sepetContent = fs.readFileSync(sepetPath, 'utf8');

const oldSummaryRegex = /\{discountAmount > 0 && \([\s\S]*?<div className="flex justify-between text-green-600 font-bold">[\s\S]*?<span>Tamamlanan İndirim<\/span>[\s\S]*?<span>-\{symbol\}\{formatPrice\(discountAmount\)\}<\/span>[\s\S]*?<\/div>\s*\)\}/;

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

if (oldSummaryRegex.test(sepetContent)) {
    sepetContent = sepetContent.replace(oldSummaryRegex, newSummary);
    fs.writeFileSync(sepetPath, sepetContent, 'utf8');
    console.log('Successfully replaced summary breakdown in sepet/page.tsx');
} else {
    console.log('Failed to find old summary block in sepet/page.tsx');
}
