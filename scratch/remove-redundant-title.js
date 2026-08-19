const fs = require('fs');

const file = 'c:/Users/ibrah/studio/src/app/kurslar/kurslar-client.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<h4 className="font-bold text-gray-800">.*?<\/h4>\s*<p className="text-sm text-gray-500">\(.*?\)<\/p>/g, '');

fs.writeFileSync(file, c);
console.log('Done');
