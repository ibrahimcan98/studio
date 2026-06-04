const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const chest6 = {
  ulkemiOgreniyorum: {
    title: "Sandık 6: Atatürk’ün Okul Yılları: Öğrenmeyi Seven Bir Çocuk",
    activities: [
      {
        type: "info",
        title: "Atatürk’ün Okul Yılları",
        desc: "Okuyalım ve öğrenelim.",
        text: "Mustafa Kemal küçük yaşlardan itibaren öğrenmeye meraklıydı. Okul hayatına Selanik’te başladı. Önce Mahalle Mektebi’ne gitti. Daha sonra babasının isteğiyle, dönemine göre daha modern bir eğitim veren Şemsi Efendi Okulu’nda okudu.\\n\\nŞemsi Efendi Okulu, Mustafa’nın düşünme ve öğrenme becerilerinin gelişmesine katkı sağladı. Burada daha düzenli ve yenilikçi bir eğitim aldı. Mustafa sadece dersleri ezberleyen bir öğrenci değildi. Öğrenmeye merak duyar, başarılı olmak için çalışırdı.\\n\\nDaha sonra askeri okullara ilgi duydu. Disiplinli yaşamı, düzenli çalışmayı ve sorumluluk almayı bu okullarda daha da geliştirdi. Matematik dersinde çok başarılıydı. Matematik öğretmeni onun bilgili ve olgun tavrını fark ederek ona “Kemal” adını verdi. Böylece Mustafa, Mustafa Kemal olarak anılmaya başladı."
      },
      {
        type: "text_selection",
        title: "Etkinlik 1: Doğru Bilgi Kartlarını Seç",
        desc: "Mustafa Kemal’in okul yıllarıyla ilgili doğru bilgi kartlarını seç.",
        options: [
          { text: "Mustafa Kemal öğrenmeye meraklı bir öğrenciydi.", isCorrect: true },
          { text: "Şemsi Efendi Okulu, dönemine göre modern eğitim veren bir okuldu.", isCorrect: true },
          { text: "Mustafa Kemal’e “Kemal” adını matematik öğretmeni verdi.", isCorrect: true },
          { text: "Mustafa Kemal hiç okula gitmedi.", isCorrect: false },
          { text: "Mustafa Kemal askeri okullarda eğitim aldı.", isCorrect: true },
          { text: "“Kemal” adı ona resim öğretmeni tarafından verildi.", isCorrect: false }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Boşluk Doldurma",
        desc: "Cümlelerdeki boşluklara uygun kelimeleri seç.",
        sentences: [
          { text: "Mustafa Kemal öğrenmeyi seven bir {blank} idi.", answer: "çocuk" },
          { text: "Şemsi Efendi Okulu, dönemine göre daha {blank} bir okuldu.", answer: "modern" },
          { text: "Mustafa’ya “Kemal” adını {blank} öğretmeni verdi.", answer: "matematik" },
          { text: "Mustafa Kemal askeri okullarda eğitim {blank}.", answer: "aldı" }
        ],
        words: ["çocuk", "modern", "matematik", "aldı"]
      },
      {
        type: "true_false",
        title: "Etkinlik 3: Doğru Yanlış",
        desc: "Cümle doğruysa Doğru'yu, yanlışsa Yanlış'ı seç.",
        questions: [
          { q: "Mustafa Kemal öğrenmeye meraklıydı.", correct: 0 },
          { q: "Mustafa Kemal hiç okula gitmedi.", correct: 1 },
          { q: "Şemsi Efendi Okulu modern eğitim veren bir okuldu.", correct: 0 },
          { q: "Kemal adını matematik öğretmeni verdi.", correct: 0 },
          { q: "Mustafa Kemal askeri okullarda eğitim aldı.", correct: 0 }
        ]
      }
    ]
  }
};

const newKeyData = `
  "6": ` + JSON.stringify(chest6, null, 4).replace(/\\n/g, '\\n') + `,
`;

const match = fileContent.lastIndexOf('};');
if (match !== -1) {
  const newContent = fileContent.slice(0, match) + newKeyData + fileContent.slice(match);
  fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
  console.log("Successfully added chest 6.");
} else {
  console.log("Could not find the end of the object.");
}
