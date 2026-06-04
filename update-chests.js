const fs = require('fs');
const file = 'c:/Users/ibrah/studio/src/data/turkce-hazinem-data.ts';
let data = fs.readFileSync(file, 'utf8');

// Replace Chest 28 dilimiOgreniyorum
data = data.replace(/("28":\s*\{[\s\S]*?)(dilimiOgreniyorum:\s*\{[\s\S]*?\},)(\n\s*ulkemiOgreniyorum)/g, function(match, p1, p2, p3) {
  return p1 + `dilimiOgreniyorum: {
      title: "Sandık 28: Anlamlı Cümle Kuruyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Anlamlı Cümle Kuruyorum",
          text: "Cümle kurarken kelimeleri doğru sıraya koymalıyız. Kelimeler yanlış sıradaysa cümle anlaşılmaz olabilir.\\n\\nÖrnek:\\nYanlış: Okudu Elif kitap.\\nDoğru: Elif kitap okudu.\\n\\nCümlede genellikle işi yapan kişi ya da varlık önce gelir. Sonra ne yaptığı anlatılır.\\nKelimeleri sıraya koyarken cümlenin anlamlı olup olmadığına dikkat ederiz.\\nAyrıca cümle büyük harfle başlar ve uygun noktalama işaretiyle biter."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Kelimeleri Sıraya Koy",
          desc: "Kelimeleri sıralayarak anlamlı bir cümle oluştur.",
          sentences: [
            { text: "kitap, Elif, okudu -> {blank}", answer: "Elif kitap okudu." },
            { text: "oynadı, Ali, top -> {blank}", answer: "Ali top oynadı." },
            { text: "uyudu, kedi, koltukta -> {blank}", answer: "Kedi koltukta uyudu." },
            { text: "yaptı, annem, yemek -> {blank}", answer: "Annem yemek yaptı." },
            { text: "uçtu, kuş, gökyüzünde -> {blank}", answer: "Kuş gökyüzünde uçtu." }
          ],
          words: [
            "Elif kitap okudu.",
            "Ali top oynadı.",
            "Kedi koltukta uyudu.",
            "Annem yemek yaptı.",
            "Kuş gökyüzünde uçtu."
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Boşluğu Doldur",
          desc: "Cümleyi güzelleştirmek için boşluğa uygun ön adı seç.",
          questions: [
            { q: "______ elma masada duruyor.", options: ["Kırmızı", "Uyuyan", "Koşan"], correct: 0 },
            { q: "______ kutu yerdeydi.", options: ["Büyük", "Okuyan", "Uçan"], correct: 0 },
            { q: "______ kuş ağaca kondu.", options: ["Küçük", "Tatlı", "Sulu"], correct: 0 },
            { q: "______ kalem çantamda.", options: ["Mavi", "Hızlı", "Aç"], correct: 0 },
            { q: "______ oda düzenliydi.", options: ["Temiz", "Ekşi", "Uykulu"], correct: 0 }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 3: Hatalı Cümleyi Düzelt",
          desc: "Hatalı cümlenin doğru hâlini seç.",
          questions: [
            { q: "ali kitap okudu.", options: ["Ali kitap okudu.", "ali kitap okudu?", "Kitap Ali okudu."], correct: 0 },
            { q: "Elif okudu kitap.", options: ["Okudu kitap Elif.", "Elif kitap okudu.", "Kitap okudu Elif."], correct: 1 },
            { q: "Bu kalem senin mi.", options: ["Bu kalem senin mi!", "Bu kalem senin mi?", "Bu kalem senin mi,"], correct: 1 },
            { q: "Masada elma armut ve muz var.", options: ["Masada elma, armut ve muz var.", "Masada elma armut ve muz var?", "Masada Elma Armut ve Muz var."], correct: 0 },
            { q: "Kedim pamuk uyuyor.", options: ["Kedim pamuk uyuyor.", "Kedim Pamuk uyuyor.", "kedim Pamuk uyuyor."], correct: 1 }
          ]
        }
      ]
    },` + p3;
});

// Replace Chest 29 dilimiOgreniyorum
data = data.replace(/("29":\s*\{[\s\S]*?)(dilimiOgreniyorum:\s*\{[\s\S]*?\},)(\n\s*ulkemiOgreniyorum)/g, function(match, p1, p2, p3) {
  return p1 + `dilimiOgreniyorum: {
      title: "Sandık 29: BAŞLIK BULMA",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik: Metne Uygun Başlığı Seç",
          desc: "Kısa metni oku ve en uygun başlığı seç.",
          questions: [
            { q: "Zeynep her akşam birkaç sayfa kitap okur. Yeni kelimeler öğrenir ve okuduklarını annesine anlatır.", options: ["Kayıp Oyuncak", "Kitap Okumanın Faydası", "Yağmurlu Gün"], correct: 1 },
            { q: "Mert yere düşen plastik şişeyi aldı. Geri dönüşüm kutusuna attı. Bahçenin temiz kalmasına yardım etti.", options: ["Bahçede Temizlik", "Yeni Bisiklet", "Kırmızı Elma"], correct: 0 },
            { q: "Elif sınıfa yeni gelen arkadaşının yalnız kaldığını fark etti. Yanına gidip onunla oyun oynadı.", options: ["Uçan Balon", "Deniz Kıyısı", "Yeni Arkadaşa Yardım"], correct: 2 },
            { q: "Ali her gün biraz para biriktirdi. Bir süre sonra istediği kitabı alacak kadar parası oldu.", options: ["Sınıf Gezisi", "Birikim Yapmak", "Kayıp Kalem"], correct: 1 },
            { q: "Nil yağmurda ıslanan kediye kuru bir kutu hazırladı. Kutunun içine temiz bir bez koydu.", options: ["Islak Kediye Yardım", "Okulda Yarış", "Bahçedeki Ağaç"], correct: 0 },
            { q: "Çocuklar sınıf panosunu birlikte hazırladı. Biri resimleri kesti, biri yazıları yapıştırdı. İş kısa sürede bitti.", options: ["Sessiz Oda", "Tatil Hazırlığı", "Birlikte Çalışmak"], correct: 2 },
            { q: "Efe güneş panelinin oyuncak arabayı çalıştırdığını gördü. Güneş ışığının enerjiye dönüşebildiğini öğrendi.", options: ["Kış Uykusu", "Güneş Enerjisi", "Renkli Kalemler"], correct: 1 },
            { q: "Pelin korktuğu gölgenin aslında sandalyedeki hırka olduğunu fark etti. Korkusunun nedenini anlayınca rahatladı.", options: ["Karanlıktaki Gölge", "Lezzetli Yemek", "Parktaki Kuşlar"], correct: 0 }
          ]
        }
      ]
    },` + p3;
});

// Replace Chest 30 dilimiOgreniyorum
data = data.replace(/("30":\s*\{[\s\S]*?)(dilimiOgreniyorum:\s*\{[\s\S]*?\},)(\n\s*ulkemiOgreniyorum)/g, function(match, p1, p2, p3) {
  return p1 + `dilimiOgreniyorum: {
      title: "SANDIK 30 SIRALAMA",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik: Olayları Doğru Sıraya Koy",
          desc: "Karışık verilen olayları okuyup doğru sıralamayı seç.",
          questions: [
            { 
              q: "1. Sonra kitabını çantasına koydu.\\n2. Elif ödevini bitirdi.\\n3. En sonunda annesine gösterdi.\\n\\nDoğru sıralama hangisidir?", 
              options: ["2, 1, 3", "1, 2, 3", "3, 2, 1"], 
              correct: 0 
            },
            {
              q: "1. Ali ellerini yıkadı.\\n2. Sonra yemeğe oturdu.\\n3. Önce bahçede oyun oynadı.\\n\\nDoğru sıralama hangisidir?",
              options: ["3, 1, 2", "1, 2, 3", "2, 3, 1"],
              correct: 0
            },
            {
              q: "1. En sonunda kitabı yerine koydu.\\n2. Mert kitabı raftan aldı.\\n3. Sonra sessizce okumaya başladı.\\n\\nDoğru sıralama hangisidir?",
              options: ["2, 3, 1", "1, 2, 3", "3, 2, 1"],
              correct: 0
            },
            {
              q: "1. Zeynep kalemlerini çantasına koydu.\\n2. Önce ödevini tamamladı.\\n3. Sonra okul çantasını hazırladı.\\n\\nDoğru sıralama hangisidir?",
              options: ["2, 1, 3", "1, 2, 3", "3, 1, 2"],
              correct: 0
            },
            {
              q: "1. Kedi sütünü içti.\\n2. Nil kaseye süt koydu.\\n3. Sonra kaseyi kapının yanına bıraktı.\\n\\nDoğru sıralama hangisidir?",
              options: ["2, 3, 1", "1, 2, 3", "3, 2, 1"],
              correct: 0
            },
            {
              q: "1. En sonunda çöpleri geri dönüşüme attılar.\\n2. Çocuklar çöpleri topladı.\\n3. Önce piknik yaptılar.\\n\\nDoğru sıralama hangisidir?",
              options: ["3, 2, 1", "1, 2, 3", "2, 1, 3"],
              correct: 0
            },
            {
              q: "1. Emre uçurtmasını aldı.\\n2. Rüzgar çıkınca uçurtmasını uçurdu.\\n3. Sonra sahile gitti.\\n\\nDoğru sıralama hangisidir?",
              options: ["1, 3, 2", "3, 1, 2", "2, 3, 1"],
              correct: 0
            },
            {
              q: "1. Pelin ışığı açtı.\\n2. Duvarda büyük bir gölge gördü.\\n3. Gölgenin hırkadan oluştuğunu fark etti.\\n\\nDoğru sıralama hangisidir?",
              options: ["2, 1, 3", "1, 2, 3", "3, 1, 2"],
              correct: 0
            }
          ]
        }
      ]
    },` + p3;
});

fs.writeFileSync(file, data);
console.log('Update successful');
