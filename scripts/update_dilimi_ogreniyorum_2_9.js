const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const chestData = {
  2: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Heceleri Tanıyorum",
        text: "Kelimeleri söylerken küçük parçalara ayırabiliriz. Bu parçalara hece denir.\n\nMesela “elma” kelimesini söylerken iki parça duyarız: el ma. Bu yüzden elma kelimesi 2 hecelidir.\n\n“Araba” kelimesini a ra ba diye üç parçaya ayırırız. Bu yüzden araba kelimesi 3 hecelidir.\n\nBir kelimenin kaç heceli olduğunu bulmak için sesli harfleri saymak bize yardımcı olur. Çünkü Türkçede her hecede genellikle bir sesli harf bulunur.\n\nÖrnekler:\nMasa: ma sa, 2 hece\nKelebek: ke le bek, 3 hece\nOkul: o kul, 2 hece"
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Kaç Hece?",
        desc: "Kelimenin kaç heceli olduğunu seç.",
        questions: [
          { q: "Masa", options: ["1", "2", "3"], correct: 1 },
          { q: "Park", options: ["1", "2", "3"], correct: 0 },
          { q: "Kelebek", options: ["2", "3", "4"], correct: 1 },
          { q: "Araba", options: ["2", "3", "4"], correct: 1 },
          { q: "Limon", options: ["1", "2", "3"], correct: 1 }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Hecelerine Ayır",
        desc: "Kelimeyi hecelerine ayırıp boşluklara doldur.",
        sentences: [
          { text: "Kalem: {blank}", answer: "ka lem" },
          { text: "Çanta: {blank}", answer: "çan ta" },
          { text: "Pencere: {blank}", answer: "pen ce re" },
          { text: "Oyuncak: {blank}", answer: "o yun cak" },
          { text: "Balık: {blank}", answer: "ba lık" }
        ],
        words: ["ka lem", "çan ta", "pen ce re", "o yun cak", "ba lık"]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 3: Hecelerden Kelime Yap",
        desc: "Heceleri doğru sıraya koy ve kelimeyi oluştur.",
        sentences: [
          { text: "ba, ra, a -> {blank}", answer: "araba" },
          { text: "çi, çek -> {blank}", answer: "çiçek" },
          { text: "le, bek, ke -> {blank}", answer: "kelebek" },
          { text: "ta, çan -> {blank}", answer: "çanta" },
          { text: "ce, pen, re -> {blank}", answer: "pencere" }
        ],
        words: ["araba", "çiçek", "kelebek", "çanta", "pencere"]
      }
    ]
  },
  3: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Kelime ve Cümle",
        text: "Harfler ve heceler birleşerek kelimeleri oluşturur. Kelimeler de bir araya gelerek cümleleri oluşturur.\n\nKelime, tek başına bir anlam taşıyan sözdür. Mesela okul, kedi, kitap, koşmak, güzel birer kelimedir.\n\nCümle ise bize tam bir düşünce anlatır. Bir cümleyi okuduğumuzda ne olduğunu anlayabiliriz.\n\nÖrnek:\n“Kedi süt içti.” Bu bir cümledir. Çünkü bize kimin ne yaptığını anlatır.\n\n“Kedi süt” tam bir cümle değildir. Çünkü ne olduğu tamamlanmamıştır.\n\nBir cümle büyük harfle başlar ve sonunda nokta, soru işareti ya da ünlem işareti bulunabilir."
      },
      {
        type: "true_false",
        title: "Etkinlik 1: Cümle mi Değil mi?",
        desc: "İfadeyi oku ve cümle olup olmadığını seç.",
        questions: [
          { q: "Bugün hava çok güzel.", correct: true },
          { q: "Yarın sabah erkenden", correct: false },
          { q: "Annem pasta yaptı.", correct: true },
          { q: "Parkta top", correct: false },
          { q: "Kuşlar uçuyor.", correct: true }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Cümleyi Tamamla",
        desc: "Eksik cümleyi uygun kelimeyle tamamla.",
        sentences: [
          { text: "Ali bahçede top {blank}.", answer: "oynadı" },
          { text: "Kedi süt {blank}.", answer: "içti" },
          { text: "Öğretmen sınıfa {blank}.", answer: "girdi" },
          { text: "Elif kitap {blank}.", answer: "okudu" },
          { text: "Kuş ağaca {blank}.", answer: "kondu" }
        ],
        words: ["oynadı", "içti", "girdi", "okudu", "kondu"]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 3: Kelime Sayısı",
        desc: "Cümlede kaç kelime olduğunu bul.",
        sentences: [
          { text: "Kedi süt içti. -> {blank} kelime", answer: "3" },
          { text: "Ali top oynadı. -> {blank} kelime", answer: "3" },
          { text: "Annem güzel yemek yaptı. -> {blank} kelime", answer: "4" },
          { text: "Bahçede küçük kuş gördüm. -> {blank} kelime", answer: "4" },
          { text: "Elif sabah erken uyandı. -> {blank} kelime", answer: "4" }
        ],
        words: ["3", "4"]
      }
    ]
  },
  4: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Büyük Harf Kullanımı",
        text: "Türkçede bazı kelimeler büyük harfle başlar. Cümleye başlarken ilk kelimenin ilk harfini büyük yazarız.\n\nÖrnek:\nBugün okula gittim.\n\nAyrıca özel adlar da büyük harfle başlar. İnsan adları, şehir adları, ülke adları, hayvanlara verilen özel adlar büyük harfle yazılır.\n\nÖrnekler:\nAyşe, İstanbul, Türkiye, Pamuk.\n\nSıradan nesne ve varlık adları cümlenin ortasında küçük harfle yazılır.\n\nÖrnek:\nMasanın üzerinde kalem var.\nBurada masa ve kalem özel ad değildir, bu yüzden küçük yazılır."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Büyük mü Küçük mü?",
        desc: "Boşluğa doğru harfi seç.",
        questions: [
          { q: "....li bugün okula geldi.", options: ["A", "a"], correct: 0 },
          { q: "Masada ....alem var.", options: ["K", "k"], correct: 1 },
          { q: "....ürkiye güzel bir ülkedir.", options: ["T", "t"], correct: 0 },
          { q: "Bahçede küçük ....edi var.", options: ["K", "k"], correct: 1 },
          { q: "....stanbul kalabalık bir şehirdir.", options: ["İ", "i"], correct: 0 }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Hatalı Yazımı Düzelt",
        desc: "Cümlede yanlış yazılan kelimeyi düzelt.",
        sentences: [
          { text: "ayşe kitap okuyor. -> {blank}", answer: "Ayşe kitap okuyor." },
          { text: "Ben izmir’e gittim. -> {blank}", answer: "Ben İzmir’e gittim." },
          { text: "Kedim pamuk uyuyor. -> {blank}", answer: "Kedim Pamuk uyuyor." },
          { text: "türkiye üç tarafı denizlerle çevrili bir ülkedir. -> {blank}", answer: "Türkiye üç tarafı denizlerle çevrili bir ülkedir." },
          { text: "Ali yeni bir kalem aldı. -> {blank}", answer: "Doğru yazılmıştır." }
        ],
        words: ["Ayşe kitap okuyor.", "Ben İzmir’e gittim.", "Kedim Pamuk uyuyor.", "Türkiye üç tarafı denizlerle çevrili bir ülkedir.", "Doğru yazılmıştır."]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Doğru Cümleyi Seç",
        questions: [
          { q: "Hangi cümle doğru yazılmıştır?", options: ["mehmet parka gitti.", "Mehmet parka gitti."], correct: 1 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Kardeşim Ankara’da yaşıyor.", "Kardeşim ankara’da yaşıyor."], correct: 0 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Kedim pamuk süt içti.", "Kedim Pamuk süt içti."], correct: 1 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Masada kitap duruyor.", "Masada Kitap duruyor."], correct: 0 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Bugün hava güneşli.", "bugün hava güneşli."], correct: 0 }
        ]
      }
    ]
  },
  5: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Alfabetik Sıralama",
        text: "Kelimeleri sözlükteki gibi sıraya dizerken alfabedeki harf sırasını kullanırız. Buna alfabetik sıralama denir.\n\nÖnce kelimelerin ilk harfine bakarız. Alfabede önce gelen harfle başlayan kelime önce yazılır.\n\nÖrnek:\nArmut, balık, defter\nA harfi B harfinden önce geldiği için armut önce gelir.\n\nEğer kelimelerin ilk harfi aynıysa ikinci harfe bakarız.\n\nÖrnek:\nBal, bebek, biber\nHepsi b harfiyle başlar. İkinci harflere bakarız: a, e, i. Alfabede a önce geldiği için bal ilk sırada olur."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: En Önce Hangisi Gelir?",
        questions: [
          { q: "Hangi kelime sözlükte en önce gelir?", options: ["Araba", "Balık", "Defter"], correct: 0 },
          { q: "Hangi kelime sözlükte en önce gelir?", options: ["Limon", "Elma", "Muz"], correct: 1 },
          { q: "Hangi kelime sözlükte en önce gelir?", options: ["Kalem", "Gözlük", "Lamba"], correct: 1 },
          { q: "Hangi kelime sözlükte en önce gelir?", options: ["Zeytin", "Fındık", "Portakal"], correct: 1 },
          { q: "Hangi kelime sözlükte en önce gelir?", options: ["Ömer", "Ali", "Can"], correct: 1 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Sıraya Diz",
        questions: [
          { q: "Mavi, Sarı, Yeşil kelimelerinin doğru sırası nasıldır?", options: ["Mavi, Sarı, Yeşil", "Yeşil, Sarı, Mavi"], correct: 0 },
          { q: "Masa, Ayı, Çilek kelimelerinin doğru sırası nasıldır?", options: ["Ayı, Çilek, Masa", "Masa, Çilek, Ayı"], correct: 0 },
          { q: "Defter, Çanta, Boya kelimelerinin doğru sırası nasıldır?", options: ["Boya, Çanta, Defter", "Çanta, Defter, Boya"], correct: 0 },
          { q: "Kuş, Kedi, Köpek kelimelerinin doğru sırası nasıldır?", options: ["Kedi, Köpek, Kuş", "Köpek, Kedi, Kuş"], correct: 0 },
          { q: "Gazete, Göz, Gül kelimelerinin doğru sırası nasıldır?", options: ["Gazete, Göz, Gül", "Göz, Gül, Gazete"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Aynı Harfle Başlayanlar",
        desc: "Kelimeleri alfabetik sıraya koy.",
        questions: [
          { q: "Bal, Bebek, Biber", options: ["Bal, Bebek, Biber", "Biber, Bebek, Bal"], correct: 0 },
          { q: "Karpuz, Kayısı, Kivi", options: ["Karpuz, Kayısı, Kivi", "Kayısı, Karpuz, Kivi"], correct: 0 },
          { q: "Masa, Mavi, Mor", options: ["Masa, Mavi, Mor", "Mavi, Masa, Mor"], correct: 0 },
          { q: "Deniz, Dere, Dağ", options: ["Dağ, Deniz, Dere", "Deniz, Dere, Dağ"], correct: 0 },
          { q: "Gül, Gazete, Göz", options: ["Gazete, Göz, Gül", "Gül, Göz, Gazete"], correct: 0 }
        ]
      }
    ]
  },
  6: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Tekrar Sandığı 1",
        text: "Bu sandıkta harf, hece, kelime, cümle, büyük harf ve alfabetik sıralama konuları tekrar edilir. Hazırsan başlayalım!"
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Hatalı Cümleyi Düzelt",
        sentences: [
          { text: "ayşe kitap okudu. -> {blank}", answer: "Ayşe kitap okudu." },
          { text: "kedim pamuk uyuyor. -> {blank}", answer: "Kedim Pamuk uyuyor." },
          { text: "ben ankara’ya gittim. -> {blank}", answer: "Ben Ankara’ya gittim." },
          { text: "masa üzerinde kalem var. -> {blank}", answer: "Masa üzerinde kalem var." }
        ],
        words: ["Ayşe kitap okudu.", "Kedim Pamuk uyuyor.", "Ben Ankara’ya gittim.", "Masa üzerinde kalem var."]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Heceleri Birleştir",
        sentences: [
          { text: "ka, lem -> {blank}", answer: "kalem" },
          { text: "o, kul -> {blank}", answer: "okul" },
          { text: "çan, ta -> {blank}", answer: "çanta" },
          { text: "a, ra, ba -> {blank}", answer: "araba" }
        ],
        words: ["kalem", "okul", "çanta", "araba"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 4: Alfabetik Sıra",
        questions: [
          { q: "Elma, Armut, Muz", options: ["Armut, Elma, Muz", "Muz, Elma, Armut"], correct: 0 },
          { q: "Kedi, Balık, Kuş", options: ["Balık, Kedi, Kuş", "Kuş, Kedi, Balık"], correct: 0 },
          { q: "Zeytin, Fındık, Portakal", options: ["Fındık, Portakal, Zeytin", "Portakal, Zeytin, Fındık"], correct: 0 },
          { q: "Can, Ali, Ece", options: ["Ali, Can, Ece", "Ece, Can, Ali"], correct: 0 }
        ]
      }
    ]
  },
  7: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Nokta ve Virgül",
        text: "Cümleleri doğru okumak ve yazmak için noktalama işaretlerini kullanırız.\n\nNokta, biten cümlenin sonuna konur.\nÖrnek:\nBugün okula gittim.\n\nNokta ayrıca sıra bildiren sayılardan sonra da kullanılır.\nÖrnek:\n3. sınıf, 1. sıra.\n\nVirgül ise cümle içinde art arda gelen benzer kelimeleri ayırmak için kullanılır.\nÖrnek:\nPazardan elma, armut ve muz aldım.\n\nVirgül bize cümle içinde kısa bir duraklama yeri gösterir."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: İşareti Seç",
        questions: [
          { q: "Bugün çok erken uyandım( )", options: [".", ","], correct: 0 },
          { q: "Çantamda kalem( ) silgi ve defter var.", options: [".", ","], correct: 1 },
          { q: "Bu yıl 3( ) sınıfa geçtim.", options: [".", ","], correct: 0 },
          { q: "Masada elma( ) armut ve muz vardı.", options: [".", ","], correct: 1 },
          { q: "Kedim sütünü içti( )", options: [".", ","], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Doğru Yazımı Seç",
        questions: [
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Elma, armut ve muz aldım.", "Elma armut ve muz aldım,"], correct: 0 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Bugün parka gittim.", "Bugün parka, gittim"], correct: 0 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["3, sınıfa geçtim.", "3. sınıfa geçtim."], correct: 1 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Ali, Ece ve Can geldi.", "Ali Ece ve Can geldi,"], correct: 0 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Kitabımı okudum.", "Kitabımı okudum,"], correct: 0 }
        ]
      }
    ]
  },
  8: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Soru İşareti ve “mi” Yazımı",
        text: "Bir cümlede soru soruyorsak cümlenin sonuna soru işareti koyarız. (?)\n\nÖrnek:\nBugün okula geldin mi?\n\nTürkçede mı, mi, mu, mü soru anlamı verir. Bu kelimeler her zaman ayrı yazılır.\n\nDoğru:\nGeliyor musun?\nYanlış:\nGeliyormusun?\n\nSoru sorarken hem soru ekini ayrı yazmalı hem de cümlenin sonuna soru işareti koymalıyız."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Doğru Yazımı Seç",
        questions: [
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Benimle gelir misin?", "Benimle gelirmisin?"], correct: 0 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Sütünü içtin mi?", "Sütünü içtinmi?"], correct: 0 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Ödevini yaptın mı?", "Ödevini yaptınmı?"], correct: 0 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Kediyi gördün mü?", "Kediyi gördünmü?"], correct: 0 },
          { q: "Hangi cümle doğru yazılmıştır?", options: ["Yeni çanta aldın mı?", "Yeni çanta aldınmı?"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Son İşareti Seç",
        questions: [
          { q: "Bugün okula geldin mi( )", options: [".", "?"], correct: 1 },
          { q: "Bugün okula geldim( )", options: [".", "?"], correct: 0 },
          { q: "Benimle oyun oynar mısın( )", options: [".", "?"], correct: 1 },
          { q: "Bahçede top oynadım( )", options: [".", "?"], correct: 0 },
          { q: "Bu kalem senin mi( )", options: [".", "?"], correct: 1 }
        ]
      }
    ]
  },
  9: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Zıt Anlamlı Kelimeler",
        text: "Bazı kelimeler birbirinin tam tersini anlatır. Bu kelimelere zıt anlamlı kelimeler denir.\n\nÖrnek:\nBüyük ve küçük birbirinin zıttıdır.\nSıcak ve soğuk birbirinin zıttıdır.\nUzun ve kısa birbirinin zıttıdır.\n\nZıt anlamlı kelimeleri öğrenmek, cümleleri daha iyi anlamamıza yardım eder.\n\nÖrnek cümle:\nBugün hava sıcak, dün hava soğuktu.\nBu cümlede sıcak ve soğuk zıt anlamlıdır."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Zıttını Bul",
        sentences: [
          { text: "Büyük -> {blank}", answer: "Küçük" },
          { text: "Sıcak -> {blank}", answer: "Soğuk" },
          { text: "Uzun -> {blank}", answer: "Kısa" },
          { text: "Açık -> {blank}", answer: "Kapalı" },
          { text: "Temiz -> {blank}", answer: "Kirli" },
          { text: "Güzel -> {blank}", answer: "Çirkin" },
          { text: "Uzak -> {blank}", answer: "Yakın" },
          { text: "Karanlık -> {blank}", answer: "Aydınlık" },
          { text: "Mutlu -> {blank}", answer: "Üzgün" }
        ],
        words: ["Küçük", "Soğuk", "Kısa", "Kapalı", "Kirli", "Çirkin", "Yakın", "Aydınlık", "Üzgün"]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Cümlede Zıttını Seç",
        sentences: [
          { text: "Çay çok sıcak, su ise çok {blank}.", answer: "soğuk" },
          { text: "Kutunun içi boş değil, {blank}.", answer: "dolu" },
          { text: "Uzun kalemin yanına {blank} kalem koydu.", answer: "kısa" },
          { text: "Kapı açık değil, {blank}.", answer: "kapalı" },
          { text: "Kirli çorapları çıkarıp {blank} çorap giydi.", answer: "temiz" }
        ],
        words: ["soğuk", "dolu", "kısa", "kapalı", "temiz"]
      }
    ]
  }
};

let newContent = fileContent;

for (let i = 2; i <= 9; i++) {
  const d = chestData[i];
  
  // Find "i": { ... dilimiOgreniyorum: { ... }, ulkemiOgreniyorum
  const regex = new RegExp('"' + i + '": \\{\\s*okuyorumAnliyorum: \\{[\\s\\S]*?\\},\\s*dilimiOgreniyorum: \\{[\\s\\S]*?\\},\\s*ulkemiOgreniyorum');
  
  const match = newContent.match(regex);
  if (match) {
    const okuyorumAnliyorumMatch = new RegExp('"' + i + '": \\{\\s*okuyorumAnliyorum: \\{([\\s\\S]*?)\\},\\s*dilimiOgreniyorum').exec(newContent);
    if (okuyorumAnliyorumMatch) {
      const okuyorumStr = okuyorumAnliyorumMatch[1];
      const replacement = '"' + i + '": {\n    okuyorumAnliyorum: {' + okuyorumStr + '},\n    dilimiOgreniyorum: ' + JSON.stringify(d, null, 6).replace(/\\n/g, '\\n    ') + ',\n    ulkemiOgreniyorum';
      newContent = newContent.replace(regex, replacement);
    }
  }
}

fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
console.log('Successfully updated chests 2-9 dilimi ogreniyorum data!');
