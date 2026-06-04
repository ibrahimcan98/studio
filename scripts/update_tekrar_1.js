const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const tekrar1 = {
  ulkemiOgreniyorum: {
    title: "Tekrar Sandığı 1: İlk Keşifler",
    activities: [
      {
        type: "sorting",
        title: "Etkinlik 1: Eşleştirme",
        desc: "Kelimeleri açıklamalarıyla eşleştir.",
        items: [
          { label: "Selanik", category: "B. Atatürk’ün doğduğu şehir" },
          { label: "Ebru", category: "C. Suyun üzerinde yapılan sanat" },
          { label: "Marmara", category: "D. Türkiye’nin iç denizi" },
          { label: "Meclis", category: "A. 23 Nisan" }
        ],
        categories: [
          "A. 23 Nisan",
          "B. Atatürk’ün doğduğu şehir",
          "C. Suyun üzerinde yapılan sanat",
          "D. Türkiye’nin iç denizi"
        ]
      },
      {
        type: "true_false",
        title: "Etkinlik 2: Doğru Yanlış",
        desc: "Cümle doğruysa Doğru'yu, yanlışsa Yanlış'ı seç.",
        questions: [
          { q: "Türkiye bir yarımadadır.", correct: 0 },
          { q: "Atatürk Ankara’da doğmuştur.", correct: 1 },
          { q: "23 Nisan çocuklara armağan edilmiştir.", correct: 0 },
          { q: "Ebru sanatı taş üzerinde yapılır.", correct: 1 },
          { q: "Karadeniz Türkiye’nin kuzeyindedir.", correct: 0 }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 3: Boşluk Doldurma",
        desc: "Cümledeki boşluklara uygun kelimeyi seç.",
        sentences: [
          { text: "Türkiye, Asya ve Avrupa arasında bir {blank} gibidir.", answer: "köprü" },
          { text: "Atatürk {blank} şehrinde doğmuştur.", answer: "Selanik" },
          { text: "23 Nisan çocuklara armağan edilen bir {blank} günüdür.", answer: "bayram" },
          { text: "Ebru sanatında boyalar {blank} üzerine damlatılır.", answer: "su" }
        ],
        words: ["köprü", "Selanik", "bayram", "su"]
      }
    ]
  }
};

const newKeyData = `
  "tekrar-1": ` + JSON.stringify(tekrar1, null, 4).replace(/\\n/g, '\\n') + `,
`;

// Insert it before the end of the object. We can find the end or just prepend it before a known key.
// Or we can just append it right before the last closing brace.
const match = fileContent.lastIndexOf('};');
if (match !== -1) {
  const newContent = fileContent.slice(0, match) + newKeyData + fileContent.slice(match);
  fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
  console.log("Successfully added tekrar-1.");
} else {
  console.log("Could not find the end of the object.");
}
