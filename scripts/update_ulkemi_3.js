const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const ulkemiOgreniyorum3 = {
  title: "Ülkemi Öğreniyorum",
  activities: [
    {
      type: "info",
      title: "23 Nisan: Çocukların Bayramı",
      text: "23 Nisan, Türkiye için çok özel bir gündür. Çünkü Türkiye Büyük Millet Meclisi 23 Nisan 1920’de açılmıştır. Meclis, halkın kendi geleceği hakkında söz sahibi olmasını temsil eder. Bu yüzden 23 Nisan sadece bir tarih değil, aynı zamanda milletin birlikte karar verme gücünü anlatan önemli bir gündür.\n\nAtatürk bu önemli günü çocuklara armağan etmiştir. Çünkü çocukların geleceğin büyükleri olduğuna inanıyordu. Ona göre çocuklar sadece bugünün küçükleri değil, yarının öğretmenleri, doktorları, sanatçıları, bilim insanları ve liderleridir.\n\n23 Nisan’da çocuklar törenler, şarkılar, gösteriler, şiirler ve farklı etkinliklerle bayramı kutlar. Bu bayram, çocukların değerli olduğunu ve fikirlerinin önemsendiğini gösterir. Türkiye’de çocuklara armağan edilmiş böyle özel bir bayramın olması, çocuklara verilen değerin güzel bir simgesidir."
    },
    {
      type: "image_selection",
      title: "Etkinlik 1: Görsel Kartı Seç",
      desc: "23 Nisan ile ilgili doğru görsel kartları seç.",
      images: [
        { src: "/turkce-hazinem/3.0.png", label: "Çocukların bayram kutlaması", isCorrect: true },
        { src: "/turkce-hazinem/3.4.png", label: "Türkiye Büyük Millet Meclisi", isCorrect: true },
        { src: "/turkce-hazinem/3.1.png", label: "Kardan adam", isCorrect: false },
        { src: "/turkce-hazinem/3.3.png", label: "Türk bayrağı", isCorrect: true },
        { src: "/turkce-hazinem/3.2.png", label: "Denizaltı", isCorrect: false }
      ]
    },
    {
      type: "fill_in_blanks",
      title: "Etkinlik 2: Boşluk Doldurma",
      sentences: [
        { text: "23 Nisan’da Türkiye Büyük Millet {blank} açılmıştır.", answer: "Meclisi" },
        { text: "Atatürk 23 Nisan’ı {blank} armağan etmiştir.", answer: "çocuklara" },
        { text: "23 Nisan, Ulusal Egemenlik ve {blank} Bayramı’dır.", answer: "Çocuk" },
        { text: "Meclis, halkın söz sahibi olmasını {blank} eder.", answer: "temsil" }
      ],
      words: ["Meclisi", "çocuklara", "Çocuk", "temsil"]
    },
    {
      type: "true_false",
      title: "Etkinlik 3: Doğru Yanlış",
      questions: [
        { q: "23 Nisan çocuklara armağan edilmiştir.", correct: true },
        { q: "Türkiye Büyük Millet Meclisi 23 Nisan 1920’de açılmıştır.", correct: true },
        { q: "23 Nisan sadece yetişkinlerin bayramıdır.", correct: false },
        { q: "Atatürk çocukların gelecekte önemli görevler alacağına inanıyordu.", correct: true },
        { q: "23 Nisan’da çocuklar çeşitli etkinliklerle bayramı kutlar.", correct: true }
      ]
    }
  ]
};

const regex = /("3":\s*\{[\s\S]*?)ulkemiOgreniyorum:\s*\{[^}]*\}/;
const match = fileContent.match(regex);

if (match) {
  const replacement = match[1] + "ulkemiOgreniyorum: " + JSON.stringify(ulkemiOgreniyorum3, null, 4).replace(/\\n/g, '\\n');
  const newContent = fileContent.replace(regex, replacement);
  fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
  console.log("Successfully added ulkemiOgreniyorum for Chest 3.");
} else {
  console.log("Match not found!");
}
