const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const ulkemiOgreniyorum5 = {
  title: "Ülkemi Öğreniyorum",
  activities: [
    {
      type: "info",
      title: "Türkiye’nin Denizleri",
      image: "/turkce-hazinem/5.harita.png",
      text: "Türkiye’nin çevresinde dört önemli deniz vardır. Kuzeyde Karadeniz, güneyde Akdeniz, batıda Ege Denizi bulunur. Marmara Denizi ise Türkiye’nin içinde yer alan özel bir iç denizdir. Bu denizlerin her birinin kendine özgü bir yeri ve özelliği vardır.\n\nKaradeniz, Türkiye’nin kuzeyindedir. Yağışlı havası, güçlü dalgaları ve yeşil kıyılarıyla bilinir. Akdeniz, Türkiye’nin güneyindedir. Sıcak kıyıları, güneşli havası, portakal ve limon bahçeleriyle tanınır. Ege Denizi, Türkiye’nin batısındadır. Girintili çıkıntılı kıyıları, koyları ve sahil şehirleriyle dikkat çeker.\n\nMarmara Denizi ise Türkiye’nin iç denizidir. İstanbul ve Çanakkale Boğazlarıyla bağlantılıdır. Denizler ülkemize sadece güzellik katmaz. Balıkçılık, gemi ulaşımı, turizm ve deniz canlılarının yaşamı için de çok önemlidir. Denizleri öğrenmek, Türkiye haritasını daha iyi tanımamıza yardım eder."
    },
    {
      type: "image_hotspots",
      title: "Etkinlik 1: Haritada Doğru Yere Sürükle",
      desc: "Deniz isimlerini Türkiye haritasında doğru yönlere tıkla ve yerleştir.",
      bgImage: "/turkce-hazinem/5.harita-bos.png",
      labels: ["Karadeniz", "Akdeniz", "Ege Denizi", "Marmara Denizi"],
      hotspots: [
        { id: "karadeniz", x: 60, y: 15, correctLabel: "Karadeniz" }, // North
        { id: "akdeniz", x: 45, y: 85, correctLabel: "Akdeniz" },    // South
        { id: "ege", x: 10, y: 60, correctLabel: "Ege Denizi" },    // West
        { id: "marmara", x: 20, y: 25, correctLabel: "Marmara Denizi" } // North-West
      ]
    },
    {
      type: "true_false",
      title: "Etkinlik 2: Doğru Yanlış",
      desc: "Cümle doğruysa Doğru'yu, yanlışsa Yanlış'ı seç.",
      questions: [
        { q: "Karadeniz Türkiye’nin kuzeyindedir.", correct: 0 },
        { q: "Akdeniz Türkiye’nin batısındadır.", correct: 1 },
        { q: "Ege Denizi Türkiye’nin batısındadır.", correct: 0 },
        { q: "Marmara Denizi Türkiye’nin iç denizidir.", correct: 0 },
        { q: "Türkiye’nin çevresinde dört önemli deniz vardır.", correct: 0 }
      ]
    },
    {
      type: "fill_in_blanks",
      title: "Etkinlik 3: Boşluk Doldurma",
      desc: "Cümledeki boşluklara uygun kelimeyi seç.",
      sentences: [
        { text: "Karadeniz Türkiye’nin {blank} yer alır.", answer: "kuzeyinde" },
        { text: "Akdeniz Türkiye’nin {blank} yer alır.", answer: "güneyinde" },
        { text: "Ege Denizi Türkiye’nin {blank} yer alır.", answer: "batısında" },
        { text: "Marmara Denizi Türkiye’nin {blank} denizidir.", answer: "iç" }
      ],
      words: ["kuzeyinde", "güneyinde", "batısında", "iç"]
    }
  ]
};

const regex = /("5":\s*\{[\s\S]*?)ulkemiOgreniyorum:\s*\{[^}]*\}/;
const match = fileContent.match(regex);

if (match) {
  const replacement = match[1] + "ulkemiOgreniyorum: " + JSON.stringify(ulkemiOgreniyorum5, null, 4).replace(/\\n/g, '\\n');
  const newContent = fileContent.replace(regex, replacement);
  fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
  console.log("Successfully added ulkemiOgreniyorum for Chest 5.");
} else {
  console.log("Match not found!");
}
