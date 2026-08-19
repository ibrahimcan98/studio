const fs = require('fs');

const path = "c:/Users/ibrah/studio/src/app/yonetici/indirimler/page.tsx";
let content = fs.readFileSync(path, 'utf8');

// 1. Remove state declaration
content = content.replace(/const \[badgeText, setBadgeText\] = useState\('PAKET AVANTAJI'\);\r?\n\s*/g, '');

// 2. Remove from payload in handleCreateCoupon
content = content.replace(/badgeText: badgeText\.trim\(\) \|\| 'PAKET AVANTAJI',\r?\n\s*/g, '');

// 3. Remove state reset
content = content.replace(/setBadgeText\('PAKET AVANTAJI'\);\r?\n\s*/g, '');

// 4. Remove from UI
const uiRegex = /\{isPublicDisplay && \(\s*<div className="pl-14 space-y-2 max-w-sm">\s*<Label htmlFor="badgeText">Vitrin Rozet Yazısı<\/Label>\s*<Input id="badgeText" value=\{badgeText\} onChange=\{e => setBadgeText\(e\.target\.value\.toUpperCase\(\)\)\} placeholder="Örn: YAZ FIRSATI" \/>\s*<p className="text-\[11px\] text-slate-500">Vitrin kartlarında görünecek metin \(Başına otomatik % indirim oranı eklenir\)\. Varsayılan: PAKET AVANTAJI<\/p>\s*<\/div>\s*\)\}/;

content = content.replace(uiRegex, '');

fs.writeFileSync(path, content, 'utf8');
console.log("Removed badgeText");
