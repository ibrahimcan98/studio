const fs = require('fs');
const path = 'c:/Users/ibrah/studio/src/app/sepet/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add to destructuring
content = content.replace('applyStandardDiscount, discountAmount, getItemDiscountPct', 'applyStandardDiscount, discountAmount, publicDiscountAmount, manualDiscountAmount, getItemDiscountPct');

// 2. Replace the summary section
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

content = content.replace(oldSummary, newSummary);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated sepet page to show breakdown');
