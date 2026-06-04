const fs = require('fs');
let content = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

// Add image? to Activity
content = content.replace('text?: string;', 'text?: string;\n  image?: string;');

// Fix text spacing in Harfleri Tanıyorum
content = content.replace('Kelimeler de bir araya gelerek cümle kurar.\\nTürk alfabesinde', 'Kelimeler de bir araya gelerek cümle kurar.\\n\\nTürk alfabesinde');
content = content.replace('bazıları sessiz harftir.\\nSesli harfler', 'bazıları sessiz harftir.\\n\\nSesli harfler');
content = content.replace('a, e, ı, i, o, ö, u, ü.\\nBu harfleri', 'a, e, ı, i, o, ö, u, ü.\\n\\nBu harfleri');
content = content.replace('bir ses çıkarırız.\\nHarfleri tanımak', 'bir ses çıkarırız.\\n\\nHarfleri tanımak');

// Fix text spacing and add image in Türkiye Nerede?
content = content.replace(
  'olduğunu görürüz.\\nTürkiye\\'nin kuzeyinde',
  'olduğunu görürüz.\\n\\nTürkiye\\'nin kuzeyinde'
);

content = content.replace(
  'bir yarımadadır.\\nTürkiye\\'nin bu konumu',
  'bir yarımadadır.\\n\\nTürkiye\\'nin bu konumu'
);

// Add image: '/turkce-hazinem/1.png' to Türkiye Nerede info activity
content = content.replace(
  'title: "Konu Anlatımı",\n          text: "Türkiye, dünya',
  'title: "Konu Anlatımı",\n          image: "/turkce-hazinem/1.png",\n          text: "Türkiye, dünya'
);

fs.writeFileSync('src/data/turkce-hazinem-data.ts', content, 'utf8');
console.log('Done!');
