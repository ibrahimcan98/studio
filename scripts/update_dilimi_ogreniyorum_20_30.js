const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const chestData = {
  20: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Kim Yaptı, Ne Yaptı?",
        text: "Cümlede yapılan işi anlatan bölüme yüklem denir. Bu işi yapan kişiyi ya da varlığı bulmak için “Kim?” ya da “Ne?” diye sorabiliriz.\n\nÖrnek:\nAli top oynadı.\nNe yaptı? Oynadı.\nKim oynadı? Ali.\n\nBurada “oynadı” yüklemdir. “Ali” ise işi yapan kişidir.\n\nBaşka örnek:\nKuş uçtu.\nNe yaptı? Uçtu.\nNe uçtu? Kuş.\n\nBu konu cümlede kimin ne yaptığını anlamamıza yardım eder."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Kim Yaptı?",
        sentences: [
          { text: "Ali koştu. Kim koştu? -> {blank}", answer: "Ali" },
          { text: "Elif kitap okudu. Kim okudu? -> {blank}", answer: "Elif" },
          { text: "Kuş uçtu. Ne uçtu? -> {blank}", answer: "Kuş" },
          { text: "Kedi uyudu. Ne uyudu? -> {blank}", answer: "Kedi" },
          { text: "Öğretmen anlattı. Kim anlattı? -> {blank}", answer: "Öğretmen" }
        ],
        words: ["Ali", "Elif", "Kuş", "Kedi", "Öğretmen"]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Ne Yaptı?",
        sentences: [
          { text: "Ali koştu. Ne yaptı? -> {blank}", answer: "Koştu" },
          { text: "Elif kitap okudu. Ne yaptı? -> {blank}", answer: "Okudu" },
          { text: "Kuş uçtu. Ne yaptı? -> {blank}", answer: "Uçtu" },
          { text: "Kedi uyudu. Ne yaptı? -> {blank}", answer: "Uyudu" },
          { text: "Annem yemek yaptı. Ne yaptı? -> {blank}", answer: "Yaptı" }
        ],
        words: ["Koştu", "Okudu", "Uçtu", "Uyudu", "Yaptı"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Cümleyi Tamamla",
        questions: [
          { q: "............... kitap okudu.", options: ["Elif", "Kırmızı"], correct: 0 },
          { q: "Kuş ...............", options: ["uçtu", "mavi"], correct: 0 },
          { q: "Öğretmen ...............", options: ["anlattı", "masa"], correct: 0 },
          { q: "............... süt içti.", options: ["Kedi", "Güzel"], correct: 0 },
          { q: "Ali top ...............", options: ["oynadı", "kısa"], correct: 0 }
        ]
      }
    ]
  },
  21: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Ne Zaman, Nerede, Nasıl, Neden?",
        text: "Bir cümleyi daha iyi anlamak için bazı sorular sorarız. Bu sorular bize olayın zamanını, yerini, yapılış biçimini ve sebebini gösterir.\n\nNe zaman? sorusu olayın zamanını bulmamıza yardım eder.\nÖrnek: Ali sabah okula gitti. (Ne zaman gitti? Sabah.)\n\nNerede? sorusu olayın yerini bulmamıza yardım eder.\nÖrnek: Elif bahçede oyun oynadı. (Nerede oynadı? Bahçede.)\n\nNasıl? sorusu bir işin nasıl yapıldığını anlatır.\nÖrnek: Mert dikkatlice kitabını okudu. (Nasıl okudu? Dikkatlice.)\n\nNeden? sorusu bir olayın sebebini bulmamıza yardım eder.\nÖrnek: Zeynep hasta olduğu için okula gitmedi. (Neden okula gitmedi? Hasta olduğu için.)"
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Sorunun Cevabını Seç",
        questions: [
          { q: "Ali sabah okula gitti. Ne zaman gitti?", options: ["Sabah", "Okula"], correct: 0 },
          { q: "Elif bahçede oyun oynadı. Nerede oynadı?", options: ["Bahçede", "Oyun"], correct: 0 },
          { q: "Mert dikkatlice kitabını okudu. Nasıl okudu?", options: ["Dikkatlice", "Kitabını"], correct: 0 },
          { q: "Zeynep hasta olduğu için okula gitmedi. Neden okula gitmedi?", options: ["Hasta olduğu için", "Okula"], correct: 0 },
          { q: "Kerem akşam dişlerini fırçaladı. Ne zaman fırçaladı?", options: ["Akşam", "Dişlerini"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Doğru Soruyu Seç",
        questions: [
          { q: "Cevap: Parkta", options: ["Nerede?", "Ne zaman?"], correct: 0 },
          { q: "Cevap: Dün", options: ["Nasıl?", "Ne zaman?"], correct: 1 },
          { q: "Cevap: Yavaşça", options: ["Nasıl?", "Neden?"], correct: 0 },
          { q: "Cevap: Yağmur yağdığı için", options: ["Nerede?", "Neden?"], correct: 1 },
          { q: "Cevap: Okulda", options: ["Nerede?", "Nasıl?"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Cümleyi Doğru Tamamla",
        questions: [
          { q: "Ne zaman? Ali ............... parka gitti.", options: ["sabah", "dikkatlice"], correct: 0 },
          { q: "Nerede? Elif ............... kitap okudu.", options: ["kütüphanede", "yavaşça"], correct: 0 },
          { q: "Nasıl? Mert kapıyı ............... kapattı.", options: ["sessizce", "dün"], correct: 0 },
          { q: "Neden? Ayşe ............... dışarı çıkmadı.", options: ["yağmur yağdığı için", "bahçede"], correct: 0 },
          { q: "Ne zaman? Kedi ............... uyudu.", options: ["gece", "hızlıca"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 4: Soruyu Cümleyle Eşleştir",
        questions: [
          { q: "Çocuklar sınıfta resim yaptı.", options: ["Nerede?", "Neden?"], correct: 0 },
          { q: "Dün annemle markete gittim.", options: ["Ne zaman?", "Nasıl?"], correct: 0 },
          { q: "Kuş yavaşça dala kondu.", options: ["Nasıl?", "Nerede?"], correct: 0 },
          { q: "Hasta olduğu için dinlendi.", options: ["Neden?", "Ne zaman?"], correct: 0 },
          { q: "Sabah kahvaltı yaptım.", options: ["Ne zaman?", "Nerede?"], correct: 0 }
        ]
      }
    ]
  },
  22: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Gerçek ve Mecaz Anlam",
        text: "Bir kelime bazen gerçek anlamıyla kullanılır, bazen de farklı bir anlam kazanır.\n\nGerçek anlam, kelimenin ilk ve bilinen anlamıdır.\nÖrnek:\nBardaktaki su soğuktu.\nBurada soğuk, gerçekten düşük sıcaklık anlamındadır.\n\nMecaz anlamda ise kelime gerçek anlamından uzaklaşır.\nÖrnek:\nBana soğuk davrandı.\nBurada soğuk, düşük sıcaklık değil; ilgisiz ve mesafeli davranmak anlamındadır."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Gerçek mi Mecaz mı?",
        questions: [
          { q: "Çay çok sıcak.", options: ["Gerçek anlam", "Mecaz anlam"], correct: 0 },
          { q: "Sıcak bir gülümsemesi vardı.", options: ["Gerçek anlam", "Mecaz anlam"], correct: 1 },
          { q: "Elim soğuk suya değdi.", options: ["Gerçek anlam", "Mecaz anlam"], correct: 0 },
          { q: "Bana soğuk davrandı.", options: ["Gerçek anlam", "Mecaz anlam"], correct: 1 },
          { q: "Ağır çantayı taşıdı.", options: ["Gerçek anlam", "Mecaz anlam"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Anlamı Seç",
        questions: [
          { q: "“Sıcak karşıladı” ne demektir?", options: ["Samimi davrandı", "Ateş yaktı"], correct: 0 },
          { q: "“Soğuk davrandı” ne demektir?", options: ["İlgisiz davrandı", "Üşüdü"], correct: 0 },
          { q: "“Ağır söz söyledi” ne demektir?", options: ["Kırıcı söz söyledi", "Taş taşıdı"], correct: 0 },
          { q: "“Tatlı bir çocuk” ne demektir?", options: ["Sevimli çocuk", "Şekerden yapılmış çocuk"], correct: 0 },
          { q: "“Karanlık düşünceler” ne demektir?", options: ["Üzücü ya da kötü düşünceler", "Lambası olmayan oda"], correct: 0 }
        ]
      },
      {
        type: "sorting",
        title: "Etkinlik 3: Cümleleri Eşleştir",
        desc: "Cümleleri anlam türüne göre doğru kutuya sürükle.",
        categories: ["Gerçek anlam", "Mecaz anlam"],
        items: [
          { label: "Soğuk su içtim.", category: "Gerçek anlam" },
          { label: "Ağır kutuyu kaldırdı.", category: "Gerçek anlam" },
          { label: "Tatlı yedim.", category: "Gerçek anlam" },
          { label: "Soğuk bir cevap verdi.", category: "Mecaz anlam" },
          { label: "Tatlı bir sesle konuştu.", category: "Mecaz anlam" }
        ]
      }
    ]
  },
  23: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Deyimler",
        text: "Deyimler, gerçek anlamından farklı bir anlam taşıyan kalıplaşmış sözlerdir. Deyimleri kelime kelime düşünürsek bazen anlamını bulamayız. Cümlede ne anlatmak istediğine bakmamız gerekir.\n\nÖrnek:\nKulak misafiri olmak (Bir konuşmayı istemeden duymak)\nEtekleri zil çalmak (Çok sevinmek)\nAğzı kulaklarına varmak (Çok mutlu olmak)\n\nDeyimler konuşmayı daha renkli hale getirir."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Deyimin Anlamını Bul",
        sentences: [
          { text: "Kulak misafiri olmak -> {blank}", answer: "Bir konuşmayı istemeden duymak" },
          { text: "Etekleri zil çalmak -> {blank}", answer: "Çok sevinmek" },
          { text: "Ağzı kulaklarına varmak -> {blank}", answer: "Çok mutlu olmak" },
          { text: "Gözü gibi bakmak -> {blank}", answer: "Çok dikkatli korumak" },
          { text: "Eli ayağına dolaşmak -> {blank}", answer: "Heyecandan ne yapacağını şaşırmak" }
        ],
        words: [
          "Bir konuşmayı istemeden duymak",
          "Çok sevinmek",
          "Çok mutlu olmak",
          "Çok dikkatli korumak",
          "Heyecandan ne yapacağını şaşırmak"
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Cümledeki Deyimi Seç",
        sentences: [
          { text: "Hediyeyi görünce etekleri zil çaldı. -> Deyim: {blank}", answer: "etekleri zil çalmak" },
          { text: "Yeni bisikletine gözü gibi bakıyor. -> Deyim: {blank}", answer: "gözü gibi bakmak" },
          { text: "Öğretmenin konuşmasına kulak misafiri oldum. -> Deyim: {blank}", answer: "kulak misafiri olmak" },
          { text: "Sahnede eli ayağına dolaştı. -> Deyim: {blank}", answer: "eli ayağına dolaşmak" },
          { text: "Haberi alınca ağzı kulaklarına vardı. -> Deyim: {blank}", answer: "ağzı kulaklarına varmak" }
        ],
        words: [
          "etekleri zil çalmak",
          "gözü gibi bakmak",
          "kulak misafiri olmak",
          "eli ayağına dolaşmak",
          "ağzı kulaklarına varmak"
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Doğru Anlamı Seç",
        questions: [
          { q: "“Gözü gibi bakmak” ne demektir?", options: ["Çok dikkatli korumak", "Gözle bakmak"], correct: 0 },
          { q: "“Eli ayağına dolaşmak” ne demektir?", options: ["Heyecanlanıp karışmak", "Koşmak"], correct: 0 },
          { q: "“Ağzı kulaklarına varmak” ne demektir?", options: ["Çok mutlu olmak", "Konuşmamak"], correct: 0 },
          { q: "“Kulak misafiri olmak” ne demektir?", options: ["İstemeden duymak", "Misafirliğe gitmek"], correct: 0 },
          { q: "“Etekleri zil çalmak” ne demektir?", options: ["Çok sevinmek", "Zil takmak"], correct: 0 }
        ]
      }
    ]
  },
  24: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Tekrar Sandığı 4",
        text: "Bu sandıkta eklerle yeni kelime yapma, cümlede kim ne yaptı, gerçek ve mecaz anlam, deyimler tekrar edilir."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Eklerle Kelime Yap",
        sentences: [
          { text: "Kitap koyulan yer -> {blank}", answer: "Kitaplık" },
          { text: "Çiçek satan kişi -> {blank}", answer: "Çiçekçi" },
          { text: "Şekeri olmayan çay -> {blank}", answer: "Şekersiz çay" },
          { text: "Tuz koyulan kap -> {blank}", answer: "Tuzluk" }
        ],
        words: ["Kitaplık", "Çiçekçi", "Şekersiz çay", "Tuzluk"]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 2: Kim Ne Yaptı?",
        sentences: [
          { text: "Ali top oynadı. (Kim?) -> {blank}", answer: "Ali" },
          { text: "Ali top oynadı. (Ne yaptı?) -> {blank}", answer: "oynadı" },
          { text: "Kedi süt içti. (Kim ya da ne?) -> {blank}", answer: "Kedi" },
          { text: "Kedi süt içti. (Ne yaptı?) -> {blank}", answer: "içti" },
          { text: "Öğretmen ders anlattı. (Kim?) -> {blank}", answer: "Öğretmen" },
          { text: "Kuş uçtu. (Ne yaptı?) -> {blank}", answer: "uçtu" }
        ],
        words: ["Ali", "oynadı", "Kedi", "içti", "Öğretmen", "uçtu"]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Gerçek mi Mecaz mı?",
        questions: [
          { q: "Sıcak çay içtim.", options: ["Gerçek", "Mecaz"], correct: 0 },
          { q: "Sıcak karşıladı.", options: ["Gerçek", "Mecaz"], correct: 1 },
          { q: "Ağır çanta taşıdı.", options: ["Gerçek", "Mecaz"], correct: 0 },
          { q: "Ağır söz söyledi.", options: ["Gerçek", "Mecaz"], correct: 1 }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 4: Deyimin Anlamı",
        sentences: [
          { text: "Etekleri zil çalmak -> {blank}", answer: "Çok sevinmek" },
          { text: "Kulak misafiri olmak -> {blank}", answer: "Bir konuşmayı istemeden duymak" },
          { text: "Gözü gibi bakmak -> {blank}", answer: "Çok dikkatli korumak" },
          { text: "Eli ayağına dolaşmak -> {blank}", answer: "Heyecandan ne yapacağını şaşırmak" }
        ],
        words: [
          "Çok sevinmek",
          "Bir konuşmayı istemeden duymak",
          "Çok dikkatli korumak",
          "Heyecandan ne yapacağını şaşırmak"
        ]
      }
    ]
  },
  25: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Atasözleri",
        text: "Atasözleri, geçmişten günümüze gelen kısa ve anlamlı öğütlerdir. İnsanların deneyimlerinden doğmuştur. \n\nDamlaya damlaya göl olur: Küçük şeyler zamanla büyüyebilir.\nAğaç yaşken eğilir: Alışkanlıklar küçük yaşta daha kolay kazanılır.\nBir elin nesi var, iki elin sesi var: Birlikte çalışınca işler daha kolay olur.\nSakla samanı, gelir zamanı: Bugün gereksiz gibi görünen bir şey, ileride işe yarayabilir.\nAk akçe kara gün içindir: İnsan zor zamanlar için birikim yapmalıdır.\nÜzüm üzüme baka baka kararır: İnsanlar çevresindekilerden etkilenebilir.\nİşleyen demir pas tutmaz: Çalışan, kendini geliştiren kişi güçlü kalır.\nTatlı dil yılanı deliğinden çıkarır: Nazik konuşmak sorunları çözer."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Atasözünü Tamamla",
        questions: [
          { q: "Damlaya damlaya ............... olur.", options: ["göl", "dağ"], correct: 0 },
          { q: "Ağaç yaşken ...............", options: ["eğilir", "uçar"], correct: 0 },
          { q: "Bir elin nesi var, iki elin ............... var.", options: ["sesi", "rengi"], correct: 0 },
          { q: "Sakla samanı, gelir ...............", options: ["zamanı", "oyunu"], correct: 0 },
          { q: "Ak akçe kara gün ...............", options: ["içindir", "dışındadır"], correct: 0 },
          { q: "Üzüm üzüme baka baka ...............", options: ["kararır", "konuşur"], correct: 0 },
          { q: "İşleyen demir pas ...............", options: ["tutmaz", "toplar"], correct: 0 },
          { q: "Tatlı dil yılanı deliğinden ...............", options: ["çıkarır", "saklar"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Anlamını Seç",
        questions: [
          { q: "Damlaya damlaya göl olur.", options: ["Küçük birikimler zamanla büyür.", "Göller her zaman küçülür."], correct: 0 },
          { q: "Ağaç yaşken eğilir.", options: ["Alışkanlıklar küçük yaşta daha kolay kazanılır.", "Ağaçlar sadece yazın büyür."], correct: 0 },
          { q: "Bir elin nesi var, iki elin sesi var.", options: ["Birlikte çalışmak daha etkilidir.", "Tek başına çalışmak her zaman daha iyidir."], correct: 0 },
          { q: "Sakla samanı, gelir zamanı.", options: ["Gereksiz görünen şeyler bir gün işe yarayabilir.", "Her şeyi hemen atmak gerekir."], correct: 0 },
          { q: "Ak akçe kara gün içindir.", options: ["Zor zamanlar için birikim yapmak gerekir.", "Para hiç önemli değildir."], correct: 0 },
          { q: "Üzüm üzüme baka baka kararır.", options: ["İnsanlar çevresindeki kişilerden etkilenebilir.", "Üzüm sadece karanlıkta yetişir."], correct: 0 },
          { q: "İşleyen demir pas tutmaz.", options: ["Çalışan ve kendini geliştiren kişi güçlü kalır.", "Hiç çalışmayan kişi daha çok gelişir."], correct: 0 },
          { q: "Tatlı dil yılanı deliğinden çıkarır.", options: ["Nazik konuşmak sorunları çözmeye yardım eder.", "Kaba konuşmak daha etkilidir."], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Duruma Uygun Atasözünü Seç",
        questions: [
          { q: "Bir çocuk her gün biraz para biriktiriyor. Zamanla kumbarası doluyor.", options: ["Damlaya damlaya göl olur.", "Tatlı dil yılanı deliğinden çıkarır."], correct: 0 },
          { q: "Bir sınıf panoyu birlikte hazırlayınca iş daha hızlı bitiyor.", options: ["Bir elin nesi var, iki elin sesi var.", "Ak akçe kara gün içindir."], correct: 0 },
          { q: "Küçük yaşta kitap okuma alışkanlığı kazanan çocuk, büyüdükçe daha iyi okuyor.", options: ["Ağaç yaşken eğilir.", "Sakla samanı, gelir zamanı."], correct: 0 },
          { q: "Bir aile zor günler için para biriktiriyor.", options: ["Ak akçe kara gün içindir.", "İşleyen demir pas tutmaz."], correct: 0 },
          { q: "Her gün piyano çalışan çocuk zamanla daha iyi çalıyor.", options: ["İşleyen demir pas tutmaz.", "Sakla samanı, gelir zamanı."], correct: 0 }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 4: Atasözü ile Anlamı Eşleştir",
        sentences: [
          { text: "Küçük birikimler zamanla büyür. -> {blank}", answer: "Damlaya damlaya göl olur." },
          { text: "Alışkanlıklar küçük yaşta daha kolay kazanılır. -> {blank}", answer: "Ağaç yaşken eğilir." },
          { text: "Birlikte çalışmak işleri kolaylaştırır. -> {blank}", answer: "Bir elin nesi var, iki elin sesi var." },
          { text: "Bugün gereksiz görünen şey ileride işe yarayabilir. -> {blank}", answer: "Sakla samanı, gelir zamanı." },
          { text: "Zor zamanlar için birikim yapmak gerekir. -> {blank}", answer: "Ak akçe kara gün içindir." },
          { text: "İnsan çevresindeki kişilerden etkilenebilir. -> {blank}", answer: "Üzüm üzüme baka baka kararır." },
          { text: "Çalışan kişi gelişir. -> {blank}", answer: "İşleyen demir pas tutmaz." },
          { text: "Nazik konuşmak sorunları çözmeye yardım eder. -> {blank}", answer: "Tatlı dil yılanı deliğinden çıkarır." }
        ],
        words: [
          "Damlaya damlaya göl olur.",
          "Ağaç yaşken eğilir.",
          "Bir elin nesi var, iki elin sesi var.",
          "Sakla samanı, gelir zamanı.",
          "Ak akçe kara gün içindir.",
          "Üzüm üzüme baka baka kararır.",
          "İşleyen demir pas tutmaz.",
          "Tatlı dil yılanı deliğinden çıkarır."
        ]
      }
    ]
  },
  26: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Konu ve Ana Fikir",
        text: "Bir metinde anlatılan şeye konu denir. Konu bize “Bu metin ne hakkında?” sorusunun cevabını verir.\n\nAna fikir ise metnin bize vermek istediği asıl düşüncedir. Ana fikri bulmak için “Bu metinden ne öğreniyoruz?” diye sorabiliriz.\n\nÖrnek metin:\nElif her gün kitap okurdu. Yeni kelimeler öğrendikçe daha iyi konuşmaya başladı. Okuduklarını arkadaşlarına da anlattı.\n\nKonu: Kitap okumak\nAna fikir: Kitap okumak dilimizi ve anlatımımızı geliştirir."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Konuyu Bul",
        questions: [
          { q: "Metin ağaçların canlılara yuva olduğunu anlatıyor.", options: ["Ağaçlar", "Oyuncaklar", "Trafik kuralları"], correct: 0 },
          { q: "Metin kitap okumanın faydalarını anlatıyor.", options: ["Spor yapmak", "Kitap okumak", "Yemek yapmak"], correct: 1 },
          { q: "Metin çöpleri geri dönüşüme atmayı anlatıyor.", options: ["Geri dönüşüm", "Müzik dinlemek", "Tatil planı"], correct: 0 },
          { q: "Metin yeni gelen bir arkadaşla empati kurmayı anlatıyor.", options: ["Alışveriş", "Empati", "Hava durumu"], correct: 1 },
          { q: "Metin güneş enerjisiyle çalışan bir oyuncağı anlatıyor.", options: ["Güneş enerjisi", "Hayvan sevgisi", "Masal kahramanları"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Ana Fikri Seç",
        questions: [
          { q: "Bir çocuk çöpleri yerden alıp geri dönüşüm kutusuna atıyor.", options: ["Çevremizi temiz tutmalıyız.", "Çöpler yerde kalmalıdır."], correct: 0 },
          { q: "Bir çocuk oyuncaklarını topluyor ve odası düzenleniyor.", options: ["Eşyaları yerine koymak yaşamı kolaylaştırır.", "Oyuncaklar kaybolmalıdır."], correct: 0 },
          { q: "Bir çocuk yeni arkadaşına resim yaparak yaklaşır.", options: ["Küçük bir iyilik arkadaşlığı başlatabilir.", "Yeni arkadaşlarla konuşmamalıyız."], correct: 0 },
          { q: "Bir çocuk korktuğu gölgenin ne olduğunu araştırır.", options: ["Korktuğumuz şeyi anlamaya çalışmak bizi rahatlatabilir.", "Her gölge tehlikelidir."], correct: 0 },
          { q: "Bir çocuk bilgi kartını sandığa koyar.", options: ["Öğrendiğimiz bilgileri paylaşmak değerlidir.", "Bilgi saklanmalıdır."], correct: 0 }
        ]
      }
    ]
  },
  27: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Paragrafı Düzenliyorum",
        text: "Bir paragraf, aynı konu etrafında bir araya gelen cümlelerden oluşur. Paragraftaki cümleler karışık olmamalıdır. Önce olay ya da düşünce başlar, sonra gelişir, en sonunda tamamlanır.\n\nÖrnek:\nÖnce: Ali bahçeye çıktı.\nSonra: Yerde boş bir kutu gördü.\nSon olarak: Kutuyu çöp kutusuna attı.\n\nParagrafı düzenlerken “Önce ne oldu? Sonra ne oldu? En sonunda ne oldu?” diye düşünürüz."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Olayları Sıraya Koy",
        questions: [
          { q: "Doğru sıralama hangisidir?\n1. Dişlerini fırçaladı. 2. Elif uyandı. 3. Okul çantasını hazırladı. 4. Kahvaltı yaptı.", options: ["2, 1, 4, 3", "1, 2, 3, 4"], correct: 0 },
          { q: "Doğru sıralama hangisidir?\n1. Topunu aldı. 2. Mert parka gitti. 3. Arkadaşıyla karşılaştı. 4. Birlikte oyun oynadılar. 5. Topu arkadaşına attı.", options: ["2, 3, 1, 5, 4", "1, 2, 3, 4, 5"], correct: 0 },
          { q: "Doğru sıralama hangisidir?\n1. Zeynep bahçeye çıktı. 2. Bahçeyi temiz bıraktı. 3. Sulama kabını aldı. 4. Çiçekleri suladı.", options: ["1, 3, 4, 2", "3, 4, 1, 2"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Paragrafı Tamamla",
        questions: [
          { q: "Elif sabah erkenden uyandı. Kahvaltısını yaptı. Sonra ...............", options: ["okula gitti.", "dün geldi."], correct: 0 },
          { q: "Mert oyuncaklarını yere döktü. Oyun oynadı. Sonra ...............", options: ["oyuncaklarını topladı.", "sabah oldu."], correct: 0 },
          { q: "Nil kapıda ıslak bir kedi gördü. Ona kutu hazırladı. Sonra ...............", options: ["kediyi güvenli yere aldı.", "kalemini açtı."], correct: 0 },
          { q: "Pelin cüzdan buldu. Öğretmenine götürdü. Sonra ...............", options: ["cüzdanın sahibi bulundu.", "uçurtma aldı."], correct: 0 },
          { q: "Efe bilgi kartı yazdı. Sandığa bıraktı. Sonra ...............", options: ["arkadaşlarının kartlarını okudu.", "toprağı kazdı."], correct: 0 }
        ]
      }
    ]
  },
  28: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Anlamlı Cümle Kuruyorum",
        text: "Cümle kurarken kelimeleri doğru sıraya koymalıyız. Kelimeler yanlış sıradaysa cümle anlaşılmaz olabilir.\n\nÖrnek:\nYanlış: Okudu Elif kitap.\nDoğru: Elif kitap okudu.\n\nCümlede genellikle işi yapan kişi ya da varlık önce gelir. Sonra ne yaptığı anlatılır.\nAyrıca cümle büyük harfle başlar ve uygun noktalama işaretiyle biter."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Kelimeleri Sıraya Koy",
        questions: [
          { q: "kitap, Elif, okudu", options: ["Elif kitap okudu.", "Okudu Elif kitap."], correct: 0 },
          { q: "oynadı, Ali, top", options: ["Ali top oynadı.", "Top Ali oynadı."], correct: 0 },
          { q: "uyudu, kedi, koltukta", options: ["Kedi koltukta uyudu.", "Koltukta uyudu kedi."], correct: 0 },
          { q: "yaptı, annem, yemek", options: ["Annem yemek yaptı.", "Yemek annem yaptı."], correct: 0 },
          { q: "uçtu, kuş, gökyüzünde", options: ["Kuş gökyüzünde uçtu.", "Gökyüzünde uçtu kuş."], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Boşluğu Doldur",
        questions: [
          { q: "............... elma masada duruyor.", options: ["Kırmızı", "Uyuyan", "Koşan"], correct: 0 },
          { q: "............... kutu yerdeydi.", options: ["Büyük", "Okuyan", "Uçan"], correct: 0 },
          { q: "............... kuş ağaca kondu.", options: ["Küçük", "Tatlı", "Sulu"], correct: 0 },
          { q: "............... kalem çantamda.", options: ["Mavi", "Hızlı", "Aç"], correct: 0 },
          { q: "............... oda düzenliydi.", options: ["Temiz", "Ekşi", "Uykulu"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Hatalı Cümleyi Düzelt",
        questions: [
          { q: "ali kitap okudu.", options: ["Ali kitap okudu.", "ali kitap okudu?", "Kitap Ali okudu."], correct: 0 },
          { q: "Elif okudu kitap.", options: ["Okudu kitap Elif.", "Elif kitap okudu.", "Kitap okudu Elif."], correct: 1 },
          { q: "Bu kalem senin mi.", options: ["Bu kalem senin mi!", "Bu kalem senin mi?", "Bu kalem senin mi,"], correct: 1 },
          { q: "Masada elma armut ve muz var.", options: ["Masada elma, armut ve muz var.", "Masada elma armut ve muz var?"], correct: 0 },
          { q: "Kedim pamuk uyuyor.", options: ["Kedim pamuk uyuyor.", "Kedim Pamuk uyuyor.", "kedim Pamuk uyuyor."], correct: 1 }
        ]
      }
    ]
  },
  29: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Tekrar Sandığı 5",
        text: "Bu sandıkta atasözleri, konu, ana fikir, paragraf sıralama ve anlamlı cümle kurma konuları tekrar edilir."
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 1: Atasözünü Anlamıyla Eşleştir",
        sentences: [
          { text: "Küçük şeyler zamanla büyür. -> {blank}", answer: "Damlaya damlaya göl olur." },
          { text: "Birlikte çalışmak daha etkilidir. -> {blank}", answer: "Bir elin nesi var, iki elin sesi var." },
          { text: "Alışkanlıklar küçük yaşta kolay kazanılır. -> {blank}", answer: "Ağaç yaşken eğilir." },
          { text: "Gereksiz şeyler ileride işe yarayabilir. -> {blank}", answer: "Sakla samanı, gelir zamanı." }
        ],
        words: [
          "Damlaya damlaya göl olur.",
          "Bir elin nesi var, iki elin sesi var.",
          "Ağaç yaşken eğilir.",
          "Sakla samanı, gelir zamanı."
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Konu mu Ana Fikir mi?",
        questions: [
          { q: "Kitap okumak", options: ["Konu", "Ana fikir"], correct: 0 },
          { q: "Kitap okumak kelime bilgimizi geliştirir.", options: ["Konu", "Ana fikir"], correct: 1 },
          { q: "Çevre temizliği", options: ["Konu", "Ana fikir"], correct: 0 },
          { q: "Çevremizi temiz tutmalıyız.", options: ["Konu", "Ana fikir"], correct: 1 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Paragrafı Sırala",
        questions: [
          { q: "1. Sonra kitabını çantasına koydu.\n2. Elif uyandı.\n3. Kahvaltısını yaptı.\nDoğru sıra nedir?", options: ["2, 3, 1", "1, 2, 3"], correct: 0 }
        ]
      }
    ]
  },
  30: {
    title: "Dilimi Öğreniyorum",
    activities: [
      {
        type: "info",
        title: "Konu Anlatımı: Büyük Dil Görevi",
        text: "Artık harfleri, heceleri, kelimeleri ve cümleleri tanıyorsun. Büyük harf kullanmayı, noktalama işaretlerini, soru ekini, kelime anlamlarını, atasözlerini ve ana fikri öğrendin.\n\nDil bilgisi sadece kuralları ezberlemek değildir. Daha doğru okumak, daha açık yazmak ve kendini daha iyi anlatmak için kullanılır.\n\nBir cümleyi okurken şunlara dikkat edebiliriz:\n- Cümle büyük harfle başlamış mı?\n- Özel adlar doğru yazılmış mı?\n- Nokta, virgül ya da soru işareti doğru yerde mi?\n- Kelimeler anlamlı sırada mı?\n- Cümle ne anlatıyor?\n\nBu sandıkta öğrendiklerini seçenekler ve eşleştirmelerle tekrar edeceksin."
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 1: Doğru Yazımı Seç",
        questions: [
          { q: "Doğru yazılmış cümleyi seç:", options: ["ali elma, armut ve muz aldı.", "Ali elma, armut ve muz aldı."], correct: 1 },
          { q: "Doğru yazılmış cümleyi seç:", options: ["Bu kitap senin mi?", "Bu kitap seninmi?"], correct: 0 },
          { q: "Doğru yazılmış cümleyi seç:", options: ["Kedim Pamuk süt içti.", "Kedim pamuk süt içti."], correct: 0 },
          { q: "Doğru yazılmış cümleyi seç:", options: ["Elif kitap okudu.", "Elif okudu kitap."], correct: 0 },
          { q: "Doğru yazılmış cümleyi seç:", options: ["Ben 3. sınıfa geçtim.", "Ben 3 sınıfa geçtim."], correct: 0 },
          { q: "Doğru yazılmış cümleyi seç:", options: ["Masada kalem, silgi ve defter var.", "Masada kalem silgi ve defter var."], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 2: Boşluğu Doğru Tamamla",
        questions: [
          { q: "Büyük kelimesinin zıttı ............... kelimesidir.", options: ["küçük", "uzun"], correct: 0 },
          { q: "Hikaye kelimesinin eş anlamlısı ............... kelimesidir.", options: ["öykü", "soru"], correct: 0 },
          { q: "Damlaya damlaya ............... olur.", options: ["göl", "taş"], correct: 0 },
          { q: "Bir elin nesi var, iki elin ............... var.", options: ["sesi", "rengi"], correct: 0 },
          { q: "Cümle soru soruyorsa sonuna ............... konur.", options: ["soru işareti", "virgül"], correct: 0 },
          { q: "Liste yaparken kelimelerin arasına ............... koyabiliriz.", options: ["virgül", "soru işareti"], correct: 0 }
        ]
      },
      {
        type: "multiple_choice",
        title: "Etkinlik 3: Anlamı Seç",
        questions: [
          { q: "Yaz geldi. Buradaki “yaz” ne anlama gelir?", options: ["Mevsim", "Yazı yazmak"], correct: 0 },
          { q: "Defterine yaz. Buradaki “yaz” ne anlama gelir?", options: ["Mevsim", "Yazı yazmak"], correct: 1 },
          { q: "Bahçedeki gül çok güzel kokuyor. Buradaki “gül” ne anlama gelir?", options: ["Çiçek", "Gülmek"], correct: 0 },
          { q: "Bana bakıp gül. Buradaki “gül” ne anlama gelir?", options: ["Çiçek", "Gülmek"], correct: 1 },
          { q: "Sıcak çay içtim. Buradaki “sıcak” nasıl kullanılmıştır?", options: ["Gerçek anlam", "Mecaz anlam"], correct: 0 },
          { q: "Beni sıcak karşıladı. Buradaki “sıcak” nasıl kullanılmıştır?", options: ["Gerçek anlam", "Mecaz anlam"], correct: 1 }
        ]
      },
      {
        type: "fill_in_blanks",
        title: "Etkinlik 4: Eşleştirme",
        sentences: [
          { text: "Küçük birikimler zamanla büyür. -> {blank}", answer: "Damlaya damlaya göl olur." },
          { text: "Alışkanlıklar küçük yaşta daha kolay kazanılır. -> {blank}", answer: "Ağaç yaşken eğilir." },
          { text: "Nazik konuşmak sorunları çözmeye yardım eder. -> {blank}", answer: "Tatlı dil yılanı deliğinden çıkarır." },
          { text: "Zıt anlamlı kelime çifti -> {blank}", answer: "Büyük ve küçük" },
          { text: "Eş anlamlı kelime çifti -> {blank}", answer: "Hikaye ve öykü" },
          { text: "Soru cümlesinin sonuna gelen işaret -> {blank}", answer: "Soru işareti" }
        ],
        words: [
          "Damlaya damlaya göl olur.",
          "Ağaç yaşken eğilir.",
          "Tatlı dil yılanı deliğinden çıkarır.",
          "Büyük ve küçük",
          "Hikaye ve öykü",
          "Soru işareti"
        ]
      }
    ]
  }
};

let newContent = fileContent;

for (let i = 20; i <= 30; i++) {
  const d = chestData[i];
  
  if (!d) continue; // safety check
  
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
console.log('Successfully updated chests 20-30 dilimi ogreniyorum data!');
