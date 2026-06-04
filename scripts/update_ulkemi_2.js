const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const ulkemiOgreniyorum2 = {
  title: "Ülkemi Öğreniyorum",
  activities: [
    {
      type: "info",
      title: "Atatürk’ün Çocukluğu: Selanik’ten Başlayan Hikaye",
      image: "/turkce-hazinem/2.png",
      text: "Mustafa Kemal Atatürk, Selanik’te doğdu. Selanik o dönemde Osmanlı Devleti’nin önemli ve hareketli şehirlerinden biriydi. Limanı, çarşıları, okulları ve farklı kültürlerden insanlarıyla canlı bir şehir hayatı vardı. Böyle bir şehirde büyümek, Mustafa’nın dünyayı daha geniş bir gözle tanımasına yardım etti.\n\nMustafa’nın annesi Zübeyde Hanım, babası Ali Rıza Efendi’ydi. Kız kardeşinin adı Makbule’ydi. Ailesi onun çocukluk hayatında önemli bir yere sahipti. Babasını küçük yaşta kaybetmesi onun için zor bir durumdu. Bu yüzden hayatın erken dönemlerinde sorumluluk, dayanıklılık ve güçlü kalma gibi duygularla tanıştı.\n\nMustafa çocukken meraklı, dikkatli ve soru sormayı seven bir çocuktu. Çevresinde olanları izler, öğrenmeye çalışırdı. Babası vefat edince dayısının çiftliğine taşındılar. Çiftlikte geçirdiği dönemlerde doğayı tanıdı, hayvanları ve tarlaları gözlemledi. Bu yıllar onun karakterinin şekillenmesine katkı sağladı. Atatürk’ün hikayesi, Selanik’te doğan meraklı bir çocuğun zamanla ülkesine yön veren bir lidere dönüşmesini anlatır."
    },
    {
      type: "fill_in_blanks",
      title: "Etkinlik 1: Eşleştirme",
      desc: "Kişileri doğru bilgilerle eşleştir.",
      sentences: [
        { text: "Mustafa’nın doğduğu şehir -> {blank}", answer: "Selanik" },
        { text: "Mustafa’nın annesi -> {blank}", answer: "Zübeyde Hanım" },
        { text: "Mustafa’nın babası -> {blank}", answer: "Ali Rıza Efendi" },
        { text: "Mustafa’nın kız kardeşi -> {blank}", answer: "Makbule" },
        { text: "Atatürk’ün çocukluk adı -> {blank}", answer: "Mustafa Kemal" }
      ],
      words: ["Selanik", "Zübeyde Hanım", "Ali Rıza Efendi", "Makbule", "Mustafa Kemal"]
    },
    {
      type: "true_false",
      title: "Etkinlik 2: Doğru Yanlış",
      questions: [
        { q: "Mustafa Kemal Selanik’te doğmuştur.", correct: true },
        { q: "Mustafa’nın annesinin adı Makbule’dir.", correct: false },
        { q: "Selanik hareketli ve farklı kültürlerin yaşadığı bir şehirdi.", correct: true },
        { q: "Mustafa Kemal çocukken hiç meraklı değildi.", correct: false },
        { q: "Ali Rıza Efendi, Mustafa’nın babasıdır.", correct: true }
      ]
    }
  ]
};

// Replace empty ulkemiOgreniyorum block for chest 2
// Assuming the current state has: "ulkemiOgreniyorum": {} or similar.
// Wait, the regex `ulkemiOgreniyorum: {}` was matched exactly by my earlier scripts.

const regex = /("2":\s*\{[\s\S]*?)ulkemiOgreniyorum:\s*\{[^}]*\}/;
const match = fileContent.match(regex);

if (match) {
  const replacement = match[1] + "ulkemiOgreniyorum: " + JSON.stringify(ulkemiOgreniyorum2, null, 4).replace(/\\n/g, '\\n');
  const newContent = fileContent.replace(regex, replacement);
  fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
  console.log("Successfully added ulkemiOgreniyorum for Chest 2.");
} else {
  console.log("Match not found!");
}
