const fs = require('fs');
const file = 'c:/Users/ibrah/studio/src/data/turkce-hazinem-data.ts';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(/("15":\s*\{[\s\S]*?)(ulkemiOgreniyorum:\s*\{[\s\S]*?\},)(\n\s*"16":)/g, function(match, p1, p2, p3) {
  return p1 + `ulkemiOgreniyorum: {
      title: "Sandık 15: Türkiye’nin Sofrası: Lezzetler ve Misafirlik",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı",
          image: "/turkce-hazinem/15.bilgi.png",
          text: "Türkiye’de yemek sadece karın doyurmak değildir. Sofra, insanların bir araya geldiği, sohbet ettiği ve paylaşmayı öğrendiği özel bir yerdir. Aile yemekleri, bayram sofraları ve misafirlikler kültürümüzde önemli yer tutar.\\n\\nBazı yiyecekler günlük hayatın parçasıdır. Simit ve çay birçok insan için tanıdık bir ikilidir. Mantı küçük hamur parçalarının iç malzemeyle hazırlanmasıyla yapılır ve genellikle yoğurtla servis edilir. Dolma, sebzelerin ya da yaprakların iç harçla doldurulmasıyla hazırlanır. Baklava ise bayramlarda ve özel günlerde sıkça görülen tatlılardan biridir.\\n\\nTürk kahvesi de kültürümüzde özel bir yere sahiptir. Küçük fincanlarda sunulur ve yanında lokum ya da su verilebilir. Misafir geldiğinde ona bir şey ikram etmek, sevgi ve saygı göstermenin yollarından biridir. Bu yüzden sofra kültürü bize paylaşmayı, birlikte olmayı ve misafirperverliği öğretir."
        },
        {
          type: "image_selection",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Yiyeceği veya içeceği doğru görselle eşleştir.",
          questions: [
            { q: "Simit", options: ["/turkce-hazinem/15.simit.png", "/turkce-hazinem/15.cay.png", "/turkce-hazinem/15.baklava.png"], correct: 0 },
            { q: "Çay", options: ["/turkce-hazinem/15.baklava.png", "/turkce-hazinem/15.cay.png", "/turkce-hazinem/15.kahve.png"], correct: 1 },
            { q: "Baklava", options: ["/turkce-hazinem/15.simit.png", "/turkce-hazinem/15.dolma.png", "/turkce-hazinem/15.baklava.png"], correct: 2 },
            { q: "Türk kahvesi", options: ["/turkce-hazinem/15.kahve.png", "/turkce-hazinem/15.cay.png", "/turkce-hazinem/15.bilgi.png"], correct: 0 },
            { q: "Dolma", options: ["/turkce-hazinem/15.dolma.png", "/turkce-hazinem/15.baklava.png", "/turkce-hazinem/15.simit.png"], correct: 0 }
          ]
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          questions: [
            { q: "Türk kültüründe misafire ikram etmek önemlidir.", correct: true },
            { q: "Simit ve çay günlük hayatta sık görülebilir.", correct: true },
            { q: "Baklava geleneksel tatlılardan biridir.", correct: true },
            { q: "Türk kahvesi büyük çorba kaselerinde içilir.", correct: false },
            { q: "Sofra kültürü paylaşmayı anlatır.", correct: true }
          ]
        }
      ]
    },` + p3;
});

fs.writeFileSync(file, data);
