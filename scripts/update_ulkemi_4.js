const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const ulkemiOgreniyorum4 = {
  title: "Ülkemi Öğreniyorum",
  activities: [
    {
      type: "info",
      title: "Renklerin ve Desenlerin Dili: Ebru, Çini ve Kil Sanatı",
      text: "Türkiye’de renkler, desenler ve el emeğiyle yapılan birçok geleneksel sanat vardır. Bu sanatlar sadece güzel görünmek için yapılmaz. Aynı zamanda insanların sabrını, dikkatini, zevkini ve kültürünü yansıtır.\n\nEbru sanatında özel boyalar suyun üzerine damlatılır. Sanatçı ince çubuklarla bu boyalara şekil verir. Bazen çiçek, bazen dalga, bazen de bambaşka desenler oluşur. Sonra kağıt suyun üzerine dikkatle bırakılır ve desen kağıda geçer. Her ebru deseni farklıdır. Bu yüzden ebru, suyun üzerinde oluşan renkli bir sürpriz gibidir.\n\nÇini sanatında tabak, vazo, kase veya duvar süslemeleri renkli desenlerle bezenir. Mavi ve beyaz renkler çinide çok sık görülür. Lale, karanfil, yaprak ve geometrik şekiller çini desenlerinde yer alabilir. Kil sanatı ise toprağın şekil almasıyla oluşur. Kil yoğrulur, elde veya çarkta şekillendirilir ve pişirilerek kap, vazo ya da süs eşyasına dönüşebilir. Ebru, çini ve kil sanatı bize el emeğinin kültürde ne kadar önemli olduğunu gösterir."
    },
    {
      type: "fill_in_blanks",
      title: "Etkinlik 1: Eşleştirme",
      desc: "Sanatı doğru açıklamayla eşleştir.",
      sentences: [
        { text: "Suyun üzerinde renklerle yapılan sanat -> {blank}", answer: "Ebru" },
        { text: "Seramik üzerine yapılan renkli süsleme -> {blank}", answer: "Çini" },
        { text: "Toprağın şekillendirilmesiyle yapılan sanat -> {blank}", answer: "Kil sanatı" },
        { text: "Yüzeyleri süsleyen şekiller -> {blank}", answer: "Desen" }
      ],
      words: ["Ebru", "Çini", "Kil sanatı", "Desen"]
    },
    {
      type: "multiple_choice",
      title: "Etkinlik 2: Görsel Kartı Seç",
      desc: "Açıklamaya uygun görseli seç.",
      questions: [
        {
          q: "Suyun üzerinde renkli boyalar var. Bu hangi sanat?",
          imageOptions: [
            { src: "/turkce-hazinem/4.ebru.png", label: "Ebru" },
            { src: "/turkce-hazinem/4.cini.png", label: "Çini" },
            { src: "/turkce-hazinem/4.kil.png", label: "Kil Sanatı" }
          ],
          correct: 0
        },
        {
          q: "Mavi beyaz desenli bir tabak var. Bu hangi sanat?",
          imageOptions: [
            { src: "/turkce-hazinem/4.ebru.png", label: "Ebru" },
            { src: "/turkce-hazinem/4.cini.png", label: "Çini" },
            { src: "/turkce-hazinem/4.kil.png", label: "Kil Sanatı" }
          ],
          correct: 1
        },
        {
          q: "Elde şekil verilen toprak görünüyor. Bu hangi sanat?",
          imageOptions: [
            { src: "/turkce-hazinem/4.ebru.png", label: "Ebru" },
            { src: "/turkce-hazinem/4.cini.png", label: "Çini" },
            { src: "/turkce-hazinem/4.kil.png", label: "Kil Sanatı" }
          ],
          correct: 2
        }
      ]
    }
  ]
};

const regex = /("4":\s*\{[\s\S]*?)ulkemiOgreniyorum:\s*\{[^}]*\}/;
const match = fileContent.match(regex);

if (match) {
  const replacement = match[1] + "ulkemiOgreniyorum: " + JSON.stringify(ulkemiOgreniyorum4, null, 4).replace(/\\n/g, '\\n');
  const newContent = fileContent.replace(regex, replacement);
  fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
  console.log("Successfully added ulkemiOgreniyorum for Chest 4.");
} else {
  console.log("Match not found!");
}
