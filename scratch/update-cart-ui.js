const fs = require('fs');

const path = "c:/Users/ibrah/studio/src/app/sepet/page.tsx";
let content = fs.readFileSync(path, 'utf8');

// 1. Add getItemDiscountPct to useCart destructuring
content = content.replace('discountAmount, finalTotal', 'discountAmount, getItemDiscountPct, finalTotal');

// 2. Modify cart item row to display the discounted price if applicable
const itemRowRegex = /<div className="flex flex-col items-end gap-2 ml-auto">\s*<p className="font-bold text-lg">\{symbol\}\{formatPrice\(item\.price \* item\.quantity\)\}<\/p>/gs;

const newItemRow = `<div className="flex flex-col items-end gap-1 ml-auto">
                                                    {getItemDiscountPct && getItemDiscountPct(item) > 0 ? (
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

content = content.replace(itemRowRegex, newItemRow);

fs.writeFileSync(path, content, 'utf8');
console.log("Done");
