const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const chestData = {
  10: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Eş Anlamlı Kelimeler",
        text: "Bazı kelimeler farklı yazılır ama aynı ya da çok yakın anlamı taşır. Bu kelimelere eş anlamlı kelimeler denir.\n\nÖrnek:\nHikaye ve öykü aynı anlama gelir.\nKelime ve sözcük aynı anlama gelir.\nCevap ve yanıt aynı anlama gelir.\n\nEş anlamlı kelimeler cümle içinde bazen birbirinin yerine kullanılabilir.\nÖrnek:\nÖğretmen bize güzel bir hikaye okudu.\nÖğretmen bize güzel bir öykü okudu.\nBu iki cümlede anlam değişmez."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Eşini Bul",
        sentences: [
          { text: "Hikaye -> {blank}", answer: "Öykü" },
          { text: "Kelime -> {blank}", answer: "Sözcük" },
          { text: "Cevap -> {blank}", answer: "Yanıt" },
          { text: "Doktor -> {blank}", answer: "Hekim" },
          { text: "Yıl -> {blank}", answer: "Sene" },
          { text: "Al -> {blank}", answer: "Kırmızı" },
          { text: "Ak -> {blank}", answer: "Beyaz" },
          { text: "Kara -> {blank}", answer: "Siyah" }
        ],
        words: ["Öykü", "Sözcük", "Yanıt", "Hekim", "Sene", "Kırmızı", "Beyaz", "Siyah"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Doğru Kelimeyi Seç",
        questions: [
          { q: "Öğretmen bize güzel bir öykü okudu. Öykü yerine hangisi gelebilir?", options: ["Hikaye", "Kapı"], correct: 0 },
          { q: "Sorunun yanıtını biliyorum. Yanıt yerine hangisi gelebilir?", options: ["Cevap", "Defter"], correct: 0 },
          { q: "Bu sene köye gideceğiz. Sene yerine hangisi gelebilir?", options: ["Yıl", "Saat"], correct: 0 },
          { q: "Hasta olunca hekime gittik. Hekim yerine hangisi gelebilir?", options: ["Doktor", "Öğrenci"], correct: 0 },
          { q: "Tahtaya üç sözcük yazdı. Sözcük yerine hangisi gelebilir?", options: ["Kelime", "Cümle sonu"], correct: 0 }
        ]
      }
    ]
  },
  11: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Eş Sesli Kelimeler",
        text: "Bazı kelimeler aynı yazılır ve aynı okunur ama farklı anlamlara gelebilir. Bu kelimelere eş sesli kelimeler denir.\n\nÖrnek:\nGül kelimesi iki farklı anlama gelebilir.\nBahçede kırmızı bir gül açtı.\nBu cümlede gül çiçektir.\nArkadaşına bakıp gül.\nBu cümlede gül, gülümsemek anlamındadır.\n\nBaşka örnekler:\nYüz: sayı olan 100, suda yüzmek ve yüzümüz!\nÇay: içecek ya da küçük akarsu.\nYaz: mevsim ya da yazı yazmak.\n\nEş sesli kelimenin anlamını cümleye bakarak anlarız."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Cümledeki Anlamı Seç",
        questions: [
          { q: "Bahçedeki gül çok güzel kokuyor.", options: ["Çiçek", "Gülmek"], correct: 0 },
          { q: "Tahtaya güzel yaz.", options: ["Mevsim", "Yazmak"], correct: 1 },
          { q: "Yaz çok sıcak geçti.", options: ["Mevsim", "Yazmak"], correct: 0 },
          { q: "Deredeki çay hızlı akıyor.", options: ["İçecek", "Küçük akarsu"], correct: 1 },
          { q: "Bardaktaki çay sıcaktı.", options: ["İçecek", "Küçük akarsu"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Eş Sesli mi Değil mi?",
        questions: [
          { q: "Gül", options: ["Eş sesli", "Eş sesli değil"], correct: 0 },
          { q: "Masa", options: ["Eş sesli", "Eş sesli değil"], correct: 1 },
          { q: "Yaz", options: ["Eş sesli", "Eş sesli değil"], correct: 0 },
          { q: "Defter", options: ["Eş sesli", "Eş sesli değil"], correct: 1 },
          { q: "Çay", options: ["Eş sesli", "Eş sesli değil"], correct: 0 }
        ]
      }
    ]
  },
  12: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Tekrar Sandığı 2",
        text: "Bu sandıkta noktalama, soru eki, zıt anlam, eş anlam ve eş sesli kelimeler tekrar edilir."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Noktalama Tamiri",
        sentences: [
          { text: "Elma () armut ve muz aldım() -> {blank}", answer: "Elma, armut ve muz aldım." },
          { text: "Bugün okula gittin mi() -> {blank}", answer: "Bugün okula gittin mi?" },
          { text: "Kedim süt içti() -> {blank}", answer: "Kedim süt içti." },
          { text: "Ali() Ece ve Can geldi() -> {blank}", answer: "Ali, Ece ve Can geldi." }
        ],
        words: ["Elma, armut ve muz aldım.", "Bugün okula gittin mi?", "Kedim süt içti.", "Ali, Ece ve Can geldi."]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Kelime Anlamı Seç",
        sentences: [
          { text: "Büyük kelimesinin zıttı nedir? -> {blank}", answer: "Küçük" },
          { text: "Hikaye kelimesinin eş anlamlısı nedir? -> {blank}", answer: "Öykü" },
          { text: "Sıcak kelimesinin zıttı nedir? -> {blank}", answer: "Soğuk" },
          { text: "Cevap kelimesinin eş anlamlısı nedir? -> {blank}", answer: "Yanıt" }
        ],
        words: ["Küçük", "Öykü", "Soğuk", "Yanıt"]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 3: Eş Sesli Olanı Seç",
        sentences: [
          { text: "Gül bahçede açtı. -> {blank}", answer: "Çiçek" },
          { text: "Bana bakıp gül. -> {blank}", answer: "Gülmek" },
          { text: "Yaz geldi. -> {blank}", answer: "Mevsim" },
          { text: "Defterine yaz. -> {blank}", answer: "Yazmak" }
        ],
        words: ["Çiçek", "Gülmek", "Mevsim", "Yazmak"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 4: Doğru Yazımı Seç",
        questions: [
          { q: "Hangi yazım doğru?", options: ["Gelirmisin?", "Gelir misin?"], correct: 1 },
          { q: "Hangi yazım doğru?", options: ["Kitabı okudun mu?", "Kitabı okudunmu?"], correct: 0 },
          { q: "Hangi yazım doğru?", options: ["Elma, armut ve muz aldım.", "Elma armut ve muz aldım,"], correct: 0 },
          { q: "Hangi yazım doğru?", options: ["2. sınıfa geçtim.", "2, sınıfa geçtim."], correct: 0 }
        ]
      }
    ]
  },
  13: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Adlar",
        text: "Çevremizdeki varlıkları, kişileri, yerleri, hayvanları, eşyaları ve duyguları anlatmak için adları kullanırız. Adlara isim de denir.\n\nÖrnek:\nAli bir kişi adıdır.\nKedi bir hayvan adıdır.\nİstanbul bir şehir adıdır.\nTürkiye bir ülke adıdır.\nKalem bir eşya adıdır.\nSevinç bir duygu adıdır.\n\nBazı adlar özel addır. Özel adlar tek bir kişiye, yere ya da hayvana verilen adlardır. Büyük harfle başlar.\nÖrnekler: Ali, Zeynep, İstanbul, Ankara, Türkiye, Pamuk, Karabaş.\n\nBazı adlar ise cins addır. Cins adlar aynı türden birçok varlığı anlatan ortak adlardır.\nÖrnek:\nPamuk özel addır çünkü bir kedinin adıdır.\nKedi cins addır çünkü bütün kediler için kullanılan ortak addır."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Hangi Ad Grubu?",
        questions: [
          { q: "Ali", options: ["Kişi adı", "Eşya adı", "Şehir adı"], correct: 0 },
          { q: "Kedi", options: ["Kişi adı", "Hayvan adı", "Ülke adı"], correct: 1 },
          { q: "İstanbul", options: ["Hayvan adı", "Şehir adı", "Duygu adı"], correct: 1 },
          { q: "Türkiye", options: ["Ülke adı", "Kişi adı", "Eşya adı"], correct: 0 },
          { q: "Kalem", options: ["Kişi adı", "Eşya adı", "Ülke adı"], correct: 1 },
          { q: "Sevinç", options: ["Şehir adı", "Hayvan adı", "Duygu adı"], correct: 2 },
          { q: "Pamuk", options: ["Kişi adı", "Hayvana verilen özel ad", "Eşya adı"], correct: 1 },
          { q: "Ankara", options: ["Şehir adı", "Ülke adı", "Kişi adı"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Özel Ad mı Cins Ad mı?",
        questions: [
          { q: "Zeynep", options: ["Özel ad", "Cins ad"], correct: 0 },
          { q: "Çocuk", options: ["Özel ad", "Cins ad"], correct: 1 },
          { q: "İzmir", options: ["Özel ad", "Cins ad"], correct: 0 },
          { q: "Şehir", options: ["Özel ad", "Cins ad"], correct: 1 },
          { q: "Türkiye", options: ["Özel ad", "Cins ad"], correct: 0 },
          { q: "Ülke", options: ["Özel ad", "Cins ad"], correct: 1 },
          { q: "Karabaş", options: ["Özel ad", "Cins ad"], correct: 0 },
          { q: "Köpek", options: ["Özel ad", "Cins ad"], correct: 1 },
          { q: "Defter", options: ["Özel ad", "Cins ad"], correct: 1 },
          { q: "Pamuk", options: ["Özel ad", "Cins ad"], correct: 0 }
        ]
      },
      {
        type: "sorting",
        title: "Etkinlik 3: Doğru Kutuyu Seç",
        desc: "Kelimeleri doğru kutulara yerleştir.",
        categories: ["Kişi adları", "Şehir adları", "Ülke adları", "Hayvan adları", "Özel hayvan adları", "Eşya adları"],
        items: [
          { label: "Ali", category: "Kişi adları" },
          { label: "Zeynep", category: "Kişi adları" },
          { label: "Kaan", category: "Kişi adları" },
          { label: "İstanbul", category: "Şehir adları" },
          { label: "Ankara", category: "Şehir adları" },
          { label: "İzmir", category: "Şehir adları" },
          { label: "Türkiye", category: "Ülke adları" },
          { label: "Almanya", category: "Ülke adları" },
          { label: "İrlanda", category: "Ülke adları" },
          { label: "kedi", category: "Hayvan adları" },
          { label: "köpek", category: "Hayvan adları" },
          { label: "kuş", category: "Hayvan adları" },
          { label: "Pamuk", category: "Özel hayvan adları" },
          { label: "Karabaş", category: "Özel hayvan adları" },
          { label: "Tekir", category: "Özel hayvan adları" },
          { label: "kalem", category: "Eşya adları" },
          { label: "masa", category: "Eşya adları" },
          { label: "defter", category: "Eşya adları" }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 4: Cümledeki Adları Bul",
        sentences: [
          { text: "Ali İstanbul’a gitti. -> {blank}", answer: "Ali: kişi adı, İstanbul: şehir adı" },
          { text: "Kedim Pamuk süt içti. -> {blank}", answer: "kedi: hayvan adı, Pamuk: hayvana verilen özel ad, süt: yiyecek içecek adı" },
          { text: "Türkiye güzel bir ülkedir. -> {blank}", answer: "Türkiye: ülke adı, ülke: cins ad" },
          { text: "Masada kalem ve defter var. -> {blank}", answer: "masa, kalem, defter: eşya adı" },
          { text: "Zeynep köpeği Karabaş ile parka gitti. -> {blank}", answer: "Zeynep: kişi adı, köpek: hayvan adı, Karabaş: hayvana verilen özel ad, park: yer adı" }
        ],
        words: [
          "Ali: kişi adı, İstanbul: şehir adı",
          "kedi: hayvan adı, Pamuk: hayvana verilen özel ad, süt: yiyecek içecek adı",
          "Türkiye: ülke adı, ülke: cins ad",
          "masa, kalem, defter: eşya adı",
          "Zeynep: kişi adı, köpek: hayvan adı, Karabaş: hayvana verilen özel ad, park: yer adı"
        ]
      }
    ]
  },
  14: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Tekil ve Çoğul Adlar",
        text: "Bir varlığı anlatan adlara tekil ad denir.\nÖrnek: kitap, kalem, çocuk, kuş.\n\nBirden fazla varlığı anlatan adlara çoğul ad denir. Çoğul yapmak için kelimelerin sonuna -ler ya da -lar getirilir.\nÖrnek: kitaplar, kalemler, çocuklar, kuşlar.\n\nHangi ekin geleceğini kelimenin sesine göre seçeriz. Bazı kelimeler ler alır, bazı kelimeler lar alır.\nÖrnek:\nkedi → kediler\naraba → arabalar\n\nNot: Eğer varlığın kaç tane olduğu belirtilmişse çoğul eki getirilmez.\nÖrnek:\nüç kediler YANLIŞ\nüç kedi DOĞRU"
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Çoğul Yap",
        sentences: [
          { text: "Kedi -> {blank}", answer: "Kediler" },
          { text: "Araba -> {blank}", answer: "Arabalar" },
          { text: "Defter -> {blank}", answer: "Defterler" },
          { text: "Çocuk -> {blank}", answer: "Çocuklar" },
          { text: "Kuş -> {blank}", answer: "Kuşlar" }
        ],
        words: ["Kediler", "Arabalar", "Defterler", "Çocuklar", "Kuşlar"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Tekil mi Çoğul mu?",
        questions: [
          { q: "Kalem", options: ["Tekil", "Çoğul"], correct: 0 },
          { q: "Kalemler", options: ["Tekil", "Çoğul"], correct: 1 },
          { q: "Ağaçlar", options: ["Tekil", "Çoğul"], correct: 1 },
          { q: "Ev", options: ["Tekil", "Çoğul"], correct: 0 },
          { q: "Oyuncaklar", options: ["Tekil", "Çoğul"], correct: 1 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Cümleyi Tamamla",
        questions: [
          { q: "Bahçede üç ............... vardı.", options: ["kediler", "kedi"], correct: 1 },
          { q: "Masada ............... vardı.", options: ["kalemler", "kalem"], correct: 0 },
          { q: "Sınıfta ............... vardı.", options: ["çocuklar", "çocuk"], correct: 0 },
          { q: "Ağaçta ............... vardı.", options: ["kuşlar", "kuş"], correct: 0 },
          { q: "Çantada ............... vardı.", options: ["defterler", "defter"], correct: 0 }
        ]
      }
    ]
  },
  15: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Ön Adlar-Sıfatlar",
        text: "Bazı kelimeler isimlerin önüne gelir ve onların nasıl olduğunu anlatır. Bu kelimelere ön ad (sıfat) denir.\n\nÖn adlar bize renk, şekil, boyut ya da başka özellikler söyleyebilir.\nÖrnekler:\nkırmızı çanta\nyuvarlak masa\nbüyük kutu\ntemiz oda\n\nBurada kırmızı, yuvarlak, büyük ve temiz kelimeleri ön addır. Çünkü kendilerinden sonra gelen ismin özelliğini anlatırlar.\n\nBir ön adı bulmak için isme “Nasıl?” sorusunu sorabiliriz.\nNasıl çanta? Kırmızı çanta.\nNasıl masa? Yuvarlak masa."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Ön Adı Bul",
        sentences: [
          { text: "Kırmızı çanta -> {blank}", answer: "Kırmızı" },
          { text: "Yuvarlak masa -> {blank}", answer: "Yuvarlak" },
          { text: "Temiz oda -> {blank}", answer: "Temiz" },
          { text: "Büyük kutu -> {blank}", answer: "Büyük" },
          { text: "Mavi kalem -> {blank}", answer: "Mavi" }
        ],
        words: ["Kırmızı", "Yuvarlak", "Temiz", "Büyük", "Mavi"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Uygun Ön Adı Seç",
        questions: [
          { q: "............... elma masada duruyor.", options: ["Kırmızı", "Koştu"], correct: 0 },
          { q: "............... masa sınıfın ortasında.", options: ["Yuvarlak", "Uyudu"], correct: 0 },
          { q: "............... oda çok güzel kokuyor.", options: ["Temiz", "Geldi"], correct: 0 },
          { q: "............... kutuyu rafa koydu.", options: ["Büyük", "İçti"], correct: 0 },
          { q: "............... kalemimi buldum.", options: ["Mavi", "Gitti"], correct: 0 }
        ]
      }
    ]
  },
  16: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Eylemler",
        text: "Cümlede yapılan işi, hareketi ya da durumu anlatan kelimelere eylem denir.\n\nÖrnek:\nAli koştu.\nBu cümlede koştu kelimesi eylemdir. Çünkü Ali’nin ne yaptığını anlatır.\n\nZeynep güldü.\nBurada güldü eylemdir.\n\nKedi uyuyor.\nBurada uyuyor eylemdir.\n\nBir kelimenin eylem olup olmadığını anlamak için ona “Ne yaptı?” ya da “Ne yapıyor?” sorularını sorabiliriz."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Eylemi Bul",
        sentences: [
          { text: "Ali koştu. -> {blank}", answer: "koştu" },
          { text: "Kedi uyuyor. -> {blank}", answer: "uyuyor" },
          { text: "Elif kitap okudu. -> {blank}", answer: "okudu" },
          { text: "Kuş uçuyor. -> {blank}", answer: "uçuyor" },
          { text: "Annem yemek yaptı. -> {blank}", answer: "yaptı" }
        ],
        words: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Hangisi Eylem?",
        questions: [
          { q: "Hangi kelime eylemdir?", options: ["Çanta", "Koştu", "Kalem"], correct: 1 },
          { q: "Hangi kelime eylemdir?", options: ["Yıkadı", "Sabun", "Masa"], correct: 0 },
          { q: "Hangi kelime eylemdir?", options: ["Kedi", "Uyudu", "Kapı"], correct: 1 },
          { q: "Hangi kelime eylemdir?", options: ["Okudu", "Defter", "Sarı"], correct: 0 },
          { q: "Hangi kelime eylemdir?", options: ["Çiçek", "Suladı", "Saksı"], correct: 1 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Cümleyi Eylemle Tamamla",
        questions: [
          { q: "Kerem ellerini sabunla ...............", options: ["yıkadı", "temiz"], correct: 0 },
          { q: "Kuş ağaca ...............", options: ["kondu", "dal"], correct: 0 },
          { q: "Eren çiçeği ...............", options: ["suladı", "sarı"], correct: 0 },
          { q: "Mert topu ...............", options: ["attı", "yuvarlak"], correct: 0 },
          { q: "Elif resim ...............", options: ["çizdi", "mavi"], correct: 0 }
        ]
      }
    ]
  },
  17: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Zamanı Anlıyorum",
        text: "Eylemler bize işin ne zaman yapıldığını da gösterebilir.\n\nGeçmiş zaman, işin daha önce yapıldığını anlatır.\nÖrnek:\nAli okula gitti.\n\nŞimdiki zaman, işin şimdi yapıldığını anlatır.\nÖrnek:\nAli okula gidiyor.\n\nGelecek zaman, işin daha sonra yapılacağını anlatır.\nÖrnek:\nAli okula gidecek.\n\nCümledeki eyleme bakarak zaman hakkında bilgi edinebiliriz."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Eylemi Bul",
        sentences: [
          { text: "Ali koştu. -> {blank}", answer: "koştu" },
          { text: "Kedi uyuyor. -> {blank}", answer: "uyuyor" },
          { text: "Elif kitap okudu. -> {blank}", answer: "okudu" },
          { text: "Kuş uçuyor. -> {blank}", answer: "uçuyor" },
          { text: "Annem yemek yaptı. -> {blank}", answer: "yaptı" }
        ],
        words: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Hangisi Eylem?",
        questions: [
          { q: "Hangi kelime eylemdir?", options: ["Çanta", "Koştu", "Kalem"], correct: 1 },
          { q: "Hangi kelime eylemdir?", options: ["Yıkadı", "Sabun", "Masa"], correct: 0 },
          { q: "Hangi kelime eylemdir?", options: ["Kedi", "Uyudu", "Kapı"], correct: 1 },
          { q: "Hangi kelime eylemdir?", options: ["Okudu", "Defter", "Sarı"], correct: 0 },
          { q: "Hangi kelime eylemdir?", options: ["Çiçek", "Suladı", "Saksı"], correct: 1 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Cümleyi Eylemle Tamamla",
        questions: [
          { q: "Kerem ellerini sabunla ...............", options: ["yıkadı", "temiz"], correct: 0 },
          { q: "Kuş ağaca ...............", options: ["kondu", "dal"], correct: 0 },
          { q: "Eren çiçeği ...............", options: ["suladı", "sarı"], correct: 0 },
          { q: "Mert topu ...............", options: ["attı", "yuvarlak"], correct: 0 },
          { q: "Elif resim ...............", options: ["çizdi", "mavi"], correct: 0 }
        ]
      }
    ]
  },
  18: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Tekrar Sandığı 3",
        text: "Bu sandıkta adlar, eylemler, sıfatlar ve zamanlar konularını pekiştiriyoruz!"
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Doğru Cümleyi Seç",
        questions: [
          { q: "Birden fazla kitap olduğunu anlatan cümle hangisidir?", options: ["Masada kitap var.", "Masada kitaplar var."], correct: 1 },
          { q: "Bir kalemin rengini anlatan cümle hangisidir?", options: ["Mavi kalem çantamda.", "Büyük kalem çantamda."], correct: 0 },
          { q: "İşin çoktan yapıldığını anlatan cümle hangisidir?", options: ["Dün okula gittim.", "Yarın okula gideceğim."], correct: 0 },
          { q: "İşin şu anda yapıldığını anlatan cümle hangisidir?", options: ["Elif kitap okudu.", "Elif kitap okuyor."], correct: 1 },
          { q: "İşin yarın yapılacağını anlatan cümle hangisidir?", options: ["Mert parka gidecek.", "Mert parka gitti."], correct: 0 }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 3: Zamanına Göre Eşleştir",
        sentences: [
          { text: "Dün resim yaptım. -> {blank}", answer: "Dün oldu" },
          { text: "Şimdi yemek yiyorum. -> {blank}", answer: "Şimdi oluyor" },
          { text: "Yarın sinemaya gideceğim. -> {blank}", answer: "Sonra olacak" },
          { text: "Kedi uyudu. -> {blank}", answer: "Dün oldu" },
          { text: "Ali koşuyor. -> {blank}", answer: "Şimdi oluyor" },
          { text: "Elif kitap okuyacak. -> {blank}", answer: "Sonra olacak" }
        ],
        words: ["Dün oldu", "Şimdi oluyor", "Sonra olacak"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 4: Cümleyi Tamamla",
        questions: [
          { q: "Kırmızı ............... masada duruyor.", options: ["kalem", "koştu"], correct: 0 },
          { q: "Ağaçta birçok ............... var.", options: ["kuşlar", "kuş"], correct: 0 },
          { q: "Şu an yağmur ...............", options: ["yağdı", "yağıyor"], correct: 1 },
          { q: "Yarın okula ...............", options: ["gideceğim", "gittim"], correct: 0 },
          { q: "Bahçede küçük bir ............... uyuyor.", options: ["kedi", "kediler"], correct: 0 }
        ]
      }
    ]
  },
  19: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Eklerle Yeni Kelimeler",
        text: "Bazı kelimelerin sonuna ekler getirerek yeni kelimeler yapabiliriz.\n\nÖrnek:\nkitap → kitaplık\nKitaplık, kitapların konulduğu yerdir.\n\nçiçek → çiçekçi\nÇiçekçi, çiçek satan kişidir.\n\nşeker → şekerli\nŞekerli, içinde şeker olan demektir.\n\nşeker → şekersiz\nŞekersiz, içinde şeker olmayan demektir.\n\nBu ekler kelimenin anlamını değiştirir ve yeni bir kelime oluşturur."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Yeni Kelimeyi Seç",
        questions: [
          { q: "Kitap kelimesine lık gelirse ne olur?", options: ["Kitaplık", "Kitapçı"], correct: 0 },
          { q: "Çiçek satan kişiye ne denir?", options: ["Çiçekçi", "Çiçeklik"], correct: 0 },
          { q: "İçinde şeker olan çay nasıldır?", options: ["Şekerli", "Şekersiz"], correct: 0 },
          { q: "İçinde tuz olmayan yemek nasıldır?", options: ["Tuzlu", "Tuzsuz"], correct: 1 },
          { q: "Su koyduğumuz kaba ne denir?", options: ["Suluk", "Sucu"], correct: 0 }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Anlamı Eşleştir",
        sentences: [
          { text: "Kalem konulan kutu -> {blank}", answer: "Kalemlik" },
          { text: "Kitap satan kişi -> {blank}", answer: "Kitapçı" },
          { text: "İçinde şeker olmayan -> {blank}", answer: "Şekersiz" },
          { text: "Tuz koyulan kap -> {blank}", answer: "Tuzluk" },
          { text: "Balık tutan ya da satan kişi -> {blank}", answer: "Balıkçı" }
        ],
        words: ["Kalemlik", "Kitapçı", "Şekersiz", "Tuzluk", "Balıkçı"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Ek Seç",
        questions: [
          { q: "Kitap satan kişi: kitap...............", options: ["çı", "lık"], correct: 0 },
          { q: "Kalem koyulan kutu: kalem...............", options: ["lik", "ci"], correct: 0 },
          { q: "Şekeri olmayan çay: şeker...............", options: ["siz", "li"], correct: 0 },
          { q: "Tuzu olan çorba: tuz...............", options: ["lu", "luk"], correct: 0 },
          { q: "Gözümüze taktığımız araç: göz...............", options: ["lük", "cü"], correct: 0 }
        ]
      }
    ]
  }
};

let newContent = fileContent;

for (let i = 10; i <= 19; i++) {
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
console.log('Successfully updated chests 10-19 dilimi ogreniyorum data!');
