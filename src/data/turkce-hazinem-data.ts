export interface Question {
  id?: string | number;
  q: string;
  options?: string[];
  imageOptions?: { src: string; label?: string }[];
  correct: number | string | boolean;
}

export interface Activity {
  type:
    | "info"
    | "multiple_choice"
    | "sorting"
    | "fill_in_blanks"
    | "true_false"
    | "image_selection"
    | "image_hotspots"
    | "text_selection";
  title: string;
  desc?: string;
  text?: string;
  image?: string;
  questions?: Question[];
  categories?: string[];
  items?: { label: string; category: string }[];
  sentences?: { text: string; answer: string; options?: string[] }[];
  words?: string[];
  infoImages?: { src: string; label?: string }[];
  images?: { src: string; label?: string; isCorrect: boolean }[];
  options?: { text: string; isCorrect: boolean }[] | string[];
  bgImage?: string;
  labels?: string[];
  hotspots?: { id: string; x: number; y: number; correctLabel: string }[];
}

export interface ReadingComprehensionData {
  title: string;
  theme: string;
  text: string;
  questions: Question[];
}

export interface LanguageLearningData {
  title: string;
  activities: Activity[];
}

export interface CountryLearningData {
  title: string;
  activities: Activity[];
}

export interface ChestContent {
  okuyorumAnliyorum?: ReadingComprehensionData;
  dilimiOgreniyorum?: LanguageLearningData;
  ulkemiOgreniyorum?: CountryLearningData;
}

export const CHESTS_CONTENT: Record<string, ChestContent> = {
  "1": {
    okuyorumAnliyorum: {
      title: "Kırmızı Kulübe",
      theme: "Yardımlaşma - Kısa hikaye",
      text: "Ali ve Ömer öğleden sonra bahçede oynuyordu. Büyük ağacın dalında eski bir kuş yuvası gördüler. Yuvanın bazı tahtaları gevşemişti. Ali evden kırmızı boya getirdi. Ömer de iki fırça aldı. İki arkadaş yuvayı dikkatlice boyadı. Sonra içine biraz yem koydular. Akşam olunca bir kuş gelip yeni yuvasına kondu.",
      questions: [
        {
          q: "Ali ve Ömer nerede oynuyordu?",
          options: ["Bahçede", "Sınıfta", "Markette"],
          correct: 0,
        },
        {
          q: "Çocuklar ağacın dalında ne gördü?",
          options: ["Uçurtma", "Eski bir kuş yuvası", "Top"],
          correct: 1,
        },
        {
          q: "Ali evden ne getirdi?",
          options: ["Kırmızı boya", "Sarı ip", "Mavi kutu"],
          correct: 0,
        },
        {
          q: "Ömer ne aldı?",
          options: ["İki fırça", "Bir defter", "Bir tabak"],
          correct: 0,
        },
        {
          q: "Çocuklar yuvanın içine ne koydu?",
          options: ["Yem", "Oyuncak", "Taş"],
          correct: 0,
        },
        {
          q: "Bu hikayenin ana fikri nedir?",
          options: [
            "Yardımlaşarak güzel işler yapılabilir.",
            "Kuş yuvaları her zaman kırmızı olur.",
            "Ağaçlara çıkmak gerekir.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Harfleri Tanıyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı",
          text: "Türkçede konuşurken çıkardığımız sesleri yazıda göstermek için harfleri kullanırız. Harfler birleşir, heceler oluşur. Heceler birleşir, kelimeler oluşur. Kelimeler de bir araya gelerek cümle kurar.\n\nTürk alfabesinde 29 harf vardır. Bu harflerin bazıları sesli, bazıları sessiz harftir.\n\nSesli harfler şunlardır: a, e, ı, i, o, ö, u, ü.\n\nBu harfleri söylerken sesimiz daha rahat çıkar. Sessiz harfleri söylerken ise genellikle yanında bir sesli harf duyarız. Mesela b harfini söylerken “be”, k harfini söylerken “ke” gibi bir ses çıkarırız.\n\nHarfleri tanımak, doğru okumak ve doğru yazmak için ilk adımdır.",
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Sesli Harfi Seç",
          desc: "Verilen harflerden sesli olanı seç.",
          questions: [
            {
              q: "Aşağıdakilerden hangisi sesli harftir?",
              options: ["a", "k", "m"],
              correct: 0,
            },
            {
              q: "Aşağıdakilerden hangisi sesli harftir?",
              options: ["t", "e", "s"],
              correct: 1,
            },
            {
              q: "Aşağıdakilerden hangisi sesli harftir?",
              options: ["l", "r", "o"],
              correct: 2,
            },
            {
              q: "Aşağıdakilerden hangisi sesli harftir?",
              options: ["b", "ü", "n"],
              correct: 1,
            },
            {
              q: "Aşağıdakilerden hangisi sesli harftir?",
              options: ["ı", "d", "y"],
              correct: 0,
            },
          ],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Sessiz Harfi Seç",
          desc: "Verilen harflerden sessiz olanı seç.",
          questions: [
            {
              q: "Aşağıdakilerden hangisi sessiz harftir?",
              options: ["a", "m", "e"],
              correct: 1,
            },
            {
              q: "Aşağıdakilerden hangisi sessiz harftir?",
              options: ["o", "u", "k"],
              correct: 2,
            },
            {
              q: "Aşağıdakilerden hangisi sessiz harftir?",
              options: ["s", "i", "ö"],
              correct: 0,
            },
            {
              q: "Aşağıdakilerden hangisi sessiz harftir?",
              options: ["ü", "t", "e"],
              correct: 1,
            },
            {
              q: "Aşağıdakilerden hangisi sessiz harftir?",
              options: ["ı", "p", "a"],
              correct: 1,
            },
          ],
        },
        {
          type: "sorting",
          title: "Etkinlik 3: Harf Kutusuna Yerleştir",
          desc: "Harfleri doğru kutuya yerleştir.",
          categories: ["Sesli", "Sessiz"],
          items: [
            { label: "a", category: "Sesli" },
            { label: "k", category: "Sessiz" },
            { label: "e", category: "Sesli" },
            { label: "m", category: "Sessiz" },
            { label: "ö", category: "Sesli" },
            { label: "t", category: "Sessiz" },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Türkiye Nerede?",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı",
          image: "/turkce-hazinem/1.png",
          text: "Türkiye, dünya haritasında çok özel bir yerde bulunur. Ülkemizin büyük bölümü Asya kıtasında, küçük bir bölümü ise Avrupa kıtasındadır. Bu yüzden Türkiye için sık sık 'iki kıtayı birbirine bağlayan ülke' denir. Türkiye'ye baktığımızda hem Asya'ya hem Avrupa'ya yakın olduğunu görürüz.\n\nTürkiye'nin kuzeyinde Karadeniz, batısında Ege Denizi, güneyinde Akdeniz bulunur. Ayrıca Marmara Denizi de Türkiye'nin içinde yer alan özel bir iç denizdir. Üç tarafı denizlerle çevrili, bir tarafı karaya bağlı olan yerlere yarımada denir. Türkiye de bu özelliğiyle bir yarımadadır.\n\nTürkiye'nin bu konumu tarih boyunca çok önemli olmuştur. Farklı insanlar, kültürler, ticaret yolları ve şehirler bu topraklarda buluşmuştur. Bu yüzden Türkiye'yi öğrenmeye başlarken önce onun haritadaki yerini tanımak çok önemlidir. Çünkü ülkemizin denizlerini, bölgelerini, şehirlerini ve kültürünü daha iyi anlamanın ilk adımı budur.",
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Boşluk Doldurma",
          desc: "Cümleleri doğru kelimelerle tamamla.",
          sentences: [
            {
              text: "Türkiye’nin büyük bölümü {blank} kıtasındadır.",
              answer: "Asya",
            },
            {
              text: "Türkiye’nin küçük bir bölümü {blank} kıtasındadır.",
              answer: "Avrupa",
            },
            {
              text: "Üç tarafı denizlerle çevrili kara parçalarına {blank} denir.",
              answer: "yarımada",
            },
            {
              text: "Türkiye, Asya ve Avrupa arasında bir {blank} gibidir.",
              answer: "köprü",
            },
          ],
          words: ["Asya", "Avrupa", "yarımada", "köprü"],
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          desc: "Verilen cümleler doğru mu yanlış mı belirle.",
          questions: [
            {
              q: "Türkiye’nin üç tarafı denizlerle çevrilidir.",
              correct: true,
            },
            { q: "Türkiye sadece Avrupa kıtasındadır.", correct: false },
            { q: "Türkiye bir yarımadadır.", correct: true },
            { q: "Türkiye Asya ve Avrupa arasında yer alır.", correct: true },
            { q: "Türkiye’nin çevresinde hiç deniz yoktur.", correct: false },
          ],
        },
      ],
    },
  },
  "2": {
    okuyorumAnliyorum: {
      title: "Paylaşılan Elma",
      theme: "Paylaşma - Kısa hikaye",
      text: "Murat okul çıkışında parkta bir banka oturdu. Çantasından kırmızı bir elma çıkardı. Tam elmayı yiyecekken yanına bir çocuk geldi. Çocuk elmaya baktı ama bir şey söylemedi. Murat onun aç olabileceğini düşündü. Elmayı ikiye böldü. Yarısını çocuğa uzattı. İki çocuk elmayı birlikte yedi.",
      questions: [
        {
          q: "Murat nereye oturdu?",
          options: ["Parktaki banka", "Sınıftaki sıraya", "Otobüse"],
          correct: 0,
        },
        {
          q: "Murat çantasından ne çıkardı?",
          options: ["Elma", "Muz", "Kek"],
          correct: 0,
        },
        {
          q: "Yanına gelen çocuk neye baktı?",
          options: ["Elmaya", "Çantaya", "Ayakkabıya"],
          correct: 0,
        },
        {
          q: "Murat elmayı ne yaptı?",
          options: ["Sakladı", "İkiye böldü", "Çöpe attı"],
          correct: 1,
        },
        {
          q: "Murat neden elmayı paylaştı?",
          options: [
            "Çocuğun aç olabileceğini düşündü.",
            "Elmayı sevmedi.",
            "Elma yere düştü.",
          ],
          correct: 0,
        },
        {
          q: "Bu metinde Murat’ın hangi özelliği görülür?",
          options: ["Paylaşmayı bilmesi", "Aceleci olması", "Kızgın olması"],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Dilimi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Heceleri Tanıyorum",
          text: "Kelimeleri söylerken küçük parçalara ayırabiliriz. Bu parçalara hece denir.\n    \n    Mesela “elma” kelimesini söylerken iki parça duyarız: el ma. Bu yüzden elma kelimesi 2 hecelidir.\n    \n    “Araba” kelimesini a ra ba diye üç parçaya ayırırız. Bu yüzden araba kelimesi 3 hecelidir.\n    \n    Bir kelimenin kaç heceli olduğunu bulmak için sesli harfleri saymak bize yardımcı olur. Çünkü Türkçede her hecede genellikle bir sesli harf bulunur.\n    \n    Örnekler:\n    Masa: ma sa, 2 hece\n    Kelebek: ke le bek, 3 hece\n    Okul: o kul, 2 hece",
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Kaç Hece?",
          desc: "Kelimenin kaç heceli olduğunu seç.",
          questions: [
            {
              q: "Masa",
              options: ["1", "2", "3"],
              correct: 1,
            },
            {
              q: "Park",
              options: ["1", "2", "3"],
              correct: 0,
            },
            {
              q: "Kelebek",
              options: ["2", "3", "4"],
              correct: 1,
            },
            {
              q: "Araba",
              options: ["2", "3", "4"],
              correct: 1,
            },
            {
              q: "Limon",
              options: ["1", "2", "3"],
              correct: 1,
            },
          ],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Hecelerine Ayır",
          desc: "Kelimeyi hecelerine ayırıp boşluklara doldur.",
          sentences: [
            {
              text: "Kalem: {blank}",
              answer: "ka lem",
              options: ["kal em", "ka lem", "k alem", "k a lem", "kale m"],
            },
            {
              text: "Çanta: {blank}",
              answer: "çan ta",
              options: ["çan ta", "ça nta", "çant a", "ç anta", "ç an ta"],
            },
            {
              text: "Pencere: {blank}",
              answer: "pen ce re",
              options: [
                "pen ce re",
                "pe nce re",
                "penc ere",
                "p ence re",
                "pen c ere",
              ],
            },
            {
              text: "Oyuncak: {blank}",
              answer: "o yun cak",
              options: [
                "oy un cak",
                "o yun cak",
                "o yu ncak",
                "oyun cak",
                "oy unc ak",
              ],
            },
            {
              text: "Balık: {blank}",
              answer: "ba lık",
              options: ["bal ık", "b alık", "ba lık", "balık", "b al ık"],
            },
          ],
          words: ["ka lem", "çan ta", "pen ce re", "o yun cak", "ba lık"],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 3: Hecelerden Kelime Yap",
          desc: "Heceleri doğru sıraya koy ve kelimeyi oluştur.",
          sentences: [
            {
              text: "ba, ra, a -> {blank}",
              answer: "araba",
            },
            {
              text: "çi, çek -> {blank}",
              answer: "çiçek",
            },
            {
              text: "le, bek, ke -> {blank}",
              answer: "kelebek",
            },
            {
              text: "ta, çan -> {blank}",
              answer: "çanta",
            },
            {
              text: "ce, pen, re -> {blank}",
              answer: "pencere",
            },
          ],
          words: ["araba", "çiçek", "kelebek", "çanta", "pencere"],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Ülkemi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Atatürk’ün Çocukluğu: Selanik’ten Başlayan Hikaye",
          image: "/turkce-hazinem/2.png",
          text: "Mustafa Kemal Atatürk, Selanik’te doğdu. Selanik o dönemde Osmanlı Devleti’nin önemli ve hareketli şehirlerinden biriydi. Limanı, çarşıları, okulları ve farklı kültürlerden insanlarıyla canlı bir şehir hayatı vardı. Böyle bir şehirde büyümek, Mustafa’nın dünyayı daha geniş bir gözle tanımasına yardım etti.\n\nMustafa’nın annesi Zübeyde Hanım, babası Ali Rıza Efendi’ydi. Kız kardeşinin adı Makbule’ydi. Ailesi onun çocukluk hayatında önemli bir yere sahipti. Babasını küçük yaşta kaybetmesi onun için zor bir durumdu. Bu yüzden hayatın erken dönemlerinde sorumluluk, dayanıklılık ve güçlü kalma gibi duygularla tanıştı.\n\nMustafa çocukken meraklı, dikkatli ve soru sormayı seven bir çocuktu. Çevresinde olanları izler, öğrenmeye çalışırdı. Babası vefat edince dayısının çiftliğine taşındılar. Çiftlikte geçirdiği dönemlerde doğayı tanıdı, hayvanları ve tarlaları gözlemledi. Bu yıllar onun karakterinin şekillenmesine katkı sağladı. Atatürk’ün hikayesi, Selanik’te doğan meraklı bir çocuğun zamanla ülkesine yön veren bir lidere dönüşmesini anlatır.",
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Kişileri doğru bilgilerle eşleştir.",
          sentences: [
            {
              text: "Mustafa’nın doğduğu şehir -> {blank}",
              answer: "Selanik",
            },
            {
              text: "Mustafa’nın annesi -> {blank}",
              answer: "Zübeyde Hanım",
            },
            {
              text: "Mustafa’nın babası -> {blank}",
              answer: "Ali Rıza Efendi",
            },
            {
              text: "Mustafa’nın kız kardeşi -> {blank}",
              answer: "Makbule",
            },
            {
              text: "Atatürk’ün çocukluk adı -> {blank}",
              answer: "Mustafa Kemal",
            },
          ],
          words: [
            "Selanik",
            "Zübeyde Hanım",
            "Ali Rıza Efendi",
            "Makbule",
            "Mustafa Kemal",
          ],
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          questions: [
            {
              q: "Mustafa Kemal Selanik’te doğmuştur.",
              correct: true,
            },
            {
              q: "Mustafa’nın annesinin adı Makbule’dir.",
              correct: false,
            },
            {
              q: "Selanik hareketli ve farklı kültürlerin yaşadığı bir şehirdi.",
              correct: true,
            },
            {
              q: "Mustafa Kemal çocukken hiç meraklı değildi.",
              correct: false,
            },
            {
              q: "Ali Rıza Efendi, Mustafa’nın babasıdır.",
              correct: true,
            },
          ],
        },
      ],
    },
  },

  "3": {
    okuyorumAnliyorum: {
      title: "Mavi Kase",
      theme: "Hayvan sevgisi - Kısa hikaye",
      text: "Zeynep mutfak penceresinden dışarı baktı. Bahçe kapısının önünde küçük bir kedi vardı. Kedi soğuktan titriyordu. Zeynep raftan mavi bir kase aldı. Kaseye biraz su koydu. Sonra annesiyle birlikte kedinin yanına çıktı. Kaseyi kapının yanına bıraktı. Kedi suyu içince biraz sakinleşti.",
      questions: [
        {
          q: "Zeynep dışarıya nereden baktı?",
          options: ["Mutfak penceresinden", "Okul kapısından", "Arabadan"],
          correct: 0,
        },
        {
          q: "Bahçe kapısının önünde hangi hayvan vardı?",
          options: ["Kedi", "Köpek", "Kuş"],
          correct: 0,
        },
        {
          q: "Kedi neden titriyordu?",
          options: ["Soğuktan", "Uykudan", "Oyundan"],
          correct: 0,
        },
        {
          q: "Zeynep hangi renk kase aldı?",
          options: ["Mavi", "Kırmızı", "Sarı"],
          correct: 0,
        },
        {
          q: "Zeynep kaseye ne koydu?",
          options: ["Su", "Toprak", "Kalem"],
          correct: 0,
        },
        {
          q: "Zeynep’in davranışı hangi duyguyu gösterir?",
          options: ["Hayvan sevgisini", "Korkuyu", "Kıskançlığı"],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Dilimi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Kelime ve Cümle",
          text: "Harfler ve heceler birleşerek kelimeleri oluşturur. Kelimeler de bir araya gelerek cümleleri oluşturur.\n    \n    Kelime, tek başına bir anlam taşıyan sözdür. Mesela okul, kedi, kitap, koşmak, güzel birer kelimedir.\n    \n    Cümle ise bize tam bir düşünce anlatır. Bir cümleyi okuduğumuzda ne olduğunu anlayabiliriz.\n    \n    Örnek:\n    “Kedi süt içti.” Bu bir cümledir. Çünkü bize kimin ne yaptığını anlatır.\n    \n    “Kedi süt” tam bir cümle değildir. Çünkü ne olduğu tamamlanmamıştır.\n    \n    Bir cümle büyük harfle başlar ve sonunda nokta, soru işareti ya da ünlem işareti bulunabilir.",
        },
        {
          type: "true_false",
          title: "Etkinlik 1: Cümle mi Değil mi?",
          desc: "İfadeyi oku ve cümle olup olmadığını seç.",
          questions: [
            {
              q: "Bugün hava çok güzel.",
              correct: true,
            },
            {
              q: "Yarın sabah erkenden",
              correct: false,
            },
            {
              q: "Annem pasta yaptı.",
              correct: true,
            },
            {
              q: "Parkta top",
              correct: false,
            },
            {
              q: "Kuşlar uçuyor.",
              correct: true,
            },
          ],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Cümleyi Tamamla",
          desc: "Eksik cümleyi uygun kelimeyle tamamla.",
          sentences: [
            {
              text: "Ali bahçede top {blank}.",
              answer: "oynadı",
            },
            {
              text: "Kedi süt {blank}.",
              answer: "içti",
            },
            {
              text: "Öğretmen sınıfa {blank}.",
              answer: "girdi",
            },
            {
              text: "Elif kitap {blank}.",
              answer: "okudu",
            },
            {
              text: "Kuş ağaca {blank}.",
              answer: "kondu",
            },
          ],
          words: ["oynadı", "içti", "girdi", "okudu", "kondu"],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 3: Kelime Sayısı",
          desc: "Cümlede kaç kelime olduğunu bul.",
          sentences: [
            {
              text: "Kedi süt içti. -> {blank} kelime",
              answer: "3",
            },
            {
              text: "Ali top oynadı. -> {blank} kelime",
              answer: "3",
            },
            {
              text: "Annem güzel yemek yaptı. -> {blank} kelime",
              answer: "4",
            },
            {
              text: "Bahçede küçük kuş gördüm. -> {blank} kelime",
              answer: "4",
            },
            {
              text: "Elif sabah erken uyandı. -> {blank} kelime",
              answer: "4",
            },
          ],
          words: ["3", "4"],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Ülkemi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "23 Nisan: Çocukların Bayramı",
          image: "/turkce-hazinem/3.0.png",
          text: "23 Nisan, Türkiye için çok özel bir gündür. Çünkü Türkiye Büyük Millet Meclisi 23 Nisan 1920’de açılmıştır. Meclis, halkın kendi geleceği hakkında söz sahibi olmasını temsil eder. Bu yüzden 23 Nisan sadece bir tarih değil, aynı zamanda milletin birlikte karar verme gücünü anlatan önemli bir gündür.\n\nAtatürk bu önemli günü çocuklara armağan etmiştir. Çünkü çocukların geleceğin büyükleri olduğuna inanıyordu. Ona göre çocuklar sadece bugünün küçükleri değil, yarının öğretmenleri, doktorları, sanatçıları, bilim insanları ve liderleridir.\n\n23 Nisan’da çocuklar törenler, şarkılar, gösteriler, şiirler ve farklı etkinliklerle bayramı kutlar. Bu bayram, çocukların değerli olduğunu ve fikirlerinin önemsendiğini gösterir. Türkiye’de çocuklara armağan edilmiş böyle özel bir bayramın olması, çocuklara verilen değerin güzel bir simgesidir.",
        },
        {
          type: "image_selection",
          title: "Etkinlik 1: Görsel Kartı Seç",
          desc: "23 Nisan ile ilgili doğru görsel kartları seç.",
          images: [
            {
              src: "/turkce-hazinem/3.0.png",
              label: "Çocukların bayram kutlaması",
              isCorrect: true,
            },
            {
              src: "/turkce-hazinem/3.4.png",
              label: "Türkiye Büyük Millet Meclisi",
              isCorrect: true,
            },
            {
              src: "/turkce-hazinem/3.1.png",
              label: "Kardan adam",
              isCorrect: false,
            },
            {
              src: "/turkce-hazinem/3.3.png",
              label: "Türk bayrağı",
              isCorrect: true,
            },
            {
              src: "/turkce-hazinem/3.2.png",
              label: "Denizaltı",
              isCorrect: false,
            },
          ],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            {
              text: "23 Nisan’da Türkiye Büyük Millet {blank} açılmıştır.",
              answer: "Meclisi",
            },
            {
              text: "Atatürk 23 Nisan’ı {blank} armağan etmiştir.",
              answer: "çocuklara",
            },
            {
              text: "23 Nisan, Ulusal Egemenlik ve {blank} Bayramı’dır.",
              answer: "Çocuk",
            },
            {
              text: "Meclis, halkın söz sahibi olmasını {blank} eder.",
              answer: "temsil",
            },
          ],
          words: ["Meclisi", "çocuklara", "Çocuk", "temsil"],
        },
        {
          type: "true_false",
          title: "Etkinlik 3: Doğru Yanlış",
          questions: [
            {
              q: "23 Nisan çocuklara armağan edilmiştir.",
              correct: true,
            },
            {
              q: "Türkiye Büyük Millet Meclisi 23 Nisan 1920’de açılmıştır.",
              correct: true,
            },
            {
              q: "23 Nisan sadece yetişkinlerin bayramıdır.",
              correct: false,
            },
            {
              q: "Atatürk çocukların gelecekte önemli görevler alacağına inanıyordu.",
              correct: true,
            },
            {
              q: "23 Nisan’da çocuklar çeşitli etkinliklerle bayramı kutlar.",
              correct: true,
            },
          ],
        },
      ],
    },
  },

  "4": {
    okuyorumAnliyorum: {
      title: "Kuruyan Çiçek",
      theme: "Doğa sevgisi - Kısa hikaye",
      text: "Eren sabah balkona çıktı. Köşedeki saksıda sarı bir çiçek vardı. Çiçeğin yaprakları aşağı doğru sarkmıştı. Eren toprağın çok kuru olduğunu fark etti. Mutfaktan küçük sulama kabını aldı. Kabı suyla doldurdu. Suyu yavaşça çiçeğin toprağına döktü. Akşam olduğunda çiçeğin yaprakları biraz canlandı.",
      questions: [
        {
          q: "Eren sabah nereye çıktı?",
          options: ["Balkona", "Bahçeye", "Sınıfa"],
          correct: 0,
        },
        {
          q: "Saksıdaki çiçek ne renkti?",
          options: ["Sarı", "Mavi", "Mor"],
          correct: 0,
        },
        {
          q: "Çiçeğin yaprakları nasıl duruyordu?",
          options: ["Aşağı sarkmıştı", "Kopmuştu", "Parlıyordu"],
          correct: 0,
        },
        {
          q: "Eren neyi fark etti?",
          options: [
            "Toprağın kuru olduğunu",
            "Saksının kırıldığını",
            "Çiçeğin kaybolduğunu",
          ],
          correct: 0,
        },
        {
          q: "Eren çiçeğe ne verdi?",
          options: ["Su", "Boya", "Şeker"],
          correct: 0,
        },
        {
          q: "Bu metinden hangi sonuç çıkarılır?",
          options: [
            "Bitkilerin suya ihtiyacı vardır.",
            "Çiçekler hiç bakım istemez.",
            "Saksılar hep balkonda olmalıdır.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Dilimi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Büyük Harf Kullanımı",
          text: "Türkçede bazı kelimeler büyük harfle başlar. Cümleye başlarken ilk kelimenin ilk harfini büyük yazarız.\n    \n    Örnek:\n    Bugün okula gittim.\n    \n    Ayrıca özel adlar da büyük harfle başlar. İnsan adları, şehir adları, ülke adları, hayvanlara verilen özel adlar büyük harfle yazılır.\n    \n    Örnekler:\n    Ayşe, İstanbul, Türkiye, Pamuk.\n    \n    Sıradan nesne ve varlık adları cümlenin ortasında küçük harfle yazılır.\n    \n    Örnek:\n    Masanın üzerinde kalem var.\n    Burada masa ve kalem özel ad değildir, bu yüzden küçük yazılır.",
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Büyük mü Küçük mü?",
          desc: "Boşluğa doğru harfi seç.",
          questions: [
            {
              q: "....li bugün okula geldi.",
              options: ["A", "a"],
              correct: 0,
            },
            {
              q: "Masada ....alem var.",
              options: ["K", "k"],
              correct: 1,
            },
            {
              q: "....ürkiye güzel bir ülkedir.",
              options: ["T", "t"],
              correct: 0,
            },
            {
              q: "Bahçede küçük ....edi var.",
              options: ["K", "k"],
              correct: 1,
            },
            {
              q: "....stanbul kalabalık bir şehirdir.",
              options: ["İ", "i"],
              correct: 0,
            },
          ],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Hatalı Yazımı Düzelt",
          desc: "Cümlede yanlış yazılan kelimeyi düzelt.",
          sentences: [
            {
              text: "ayşe kitap okuyor. -> {blank}",
              answer: "Ayşe kitap okuyor.",
            },
            {
              text: "Ben izmir’e gittim. -> {blank}",
              answer: "Ben İzmir’e gittim.",
            },
            {
              text: "Kedim pamuk uyuyor. -> {blank}",
              answer: "Kedim Pamuk uyuyor.",
            },
            {
              text: "türkiye üç tarafı denizlerle çevrili bir ülkedir. -> {blank}",
              answer: "Türkiye üç tarafı denizlerle çevrili bir ülkedir.",
            },
            {
              text: "Ali yeni bir kalem aldı. -> {blank}",
              answer: "Doğru yazılmıştır.",
            },
          ],
          words: [
            "Ayşe kitap okuyor.",
            "Ben İzmir’e gittim.",
            "Kedim Pamuk uyuyor.",
            "Türkiye üç tarafı denizlerle çevrili bir ülkedir.",
            "Doğru yazılmıştır.",
          ],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 3: Doğru Cümleyi Seç",
          questions: [
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["mehmet parka gitti.", "Mehmet parka gitti."],
              correct: 1,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: [
                "Kardeşim Ankara’da yaşıyor.",
                "Kardeşim ankara’da yaşıyor.",
              ],
              correct: 0,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Kedim pamuk süt içti.", "Kedim Pamuk süt içti."],
              correct: 1,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Masada kitap duruyor.", "Masada Kitap duruyor."],
              correct: 0,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Bugün hava güneşli.", "bugün hava güneşli."],
              correct: 0,
            },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Ülkemi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Renklerin ve Desenlerin Dili: Ebru, Çini ve Kil Sanatı",
          infoImages: [
            { src: "/turkce-hazinem/4.ebru.png", label: "Ebru" },
            { src: "/turkce-hazinem/4.cini.png", label: "Çini" },
            { src: "/turkce-hazinem/4.kil.png", label: "Kil Sanatı" },
          ],
          text: "Türkiye’de renkler, desenler ve el emeğiyle yapılan birçok geleneksel sanat vardır. Bu sanatlar sadece güzel görünmek için yapılmaz. Aynı zamanda insanların sabrını, dikkatini, zevkini ve kültürünü yansıtır.\n\nEbru sanatında özel boyalar suyun üzerine damlatılır. Sanatçı ince çubuklarla bu boyalara şekil verir. Bazen çiçek, bazen dalga, bazen de bambaşka desenler oluşur. Sonra kağıt suyun üzerine dikkatle bırakılır ve desen kağıda geçer. Her ebru deseni farklıdır. Bu yüzden ebru, suyun üzerinde oluşan renkli bir sürpriz gibidir.\n\nÇini sanatında tabak, vazo, kase veya duvar süslemeleri renkli desenlerle bezenir. Mavi ve beyaz renkler çinide çok sık görülür. Lale, karanfil, yaprak ve geometrik şekiller çini desenlerinde yer alabilir.\n\nKil sanatı ise toprağın şekil almasıyla oluşur. Kil yoğrulur, elde veya çarkta şekillendirilir ve pişirilerek kap, vazo ya da süs eşyasına dönüşebilir. \n\nEbru, çini ve kil sanatı bize el emeğinin kültürde ne kadar önemli olduğunu gösterir.",
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Sanatı doğru açıklamayla eşleştir.",
          sentences: [
            {
              text: "Suyun üzerinde renklerle yapılan sanat -> {blank}",
              answer: "Ebru",
            },
            {
              text: "Seramik üzerine yapılan renkli süsleme -> {blank}",
              answer: "Çini",
            },
            {
              text: "Toprağın şekillendirilmesiyle yapılan sanat -> {blank}",
              answer: "Kil sanatı",
            },
            {
              text: "Yüzeyleri süsleyen şekiller -> {blank}",
              answer: "Desen",
            },
          ],
          words: ["Ebru", "Çini", "Kil sanatı", "Desen"],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Görsel Kartı Seç",
          desc: "Açıklamaya uygun görseli seç.",
          questions: [
            {
              q: "Suyun üzerinde renkli boyalar var. Bu hangi sanat?",
              imageOptions: [
                {
                  src: "/turkce-hazinem/4.ebru.png",
                  label: "Ebru",
                },
                {
                  src: "/turkce-hazinem/4.cini.png",
                  label: "Çini",
                },
                {
                  src: "/turkce-hazinem/4.kil.png",
                  label: "Kil Sanatı",
                },
              ],
              correct: 0,
            },
            {
              q: "Mavi beyaz desenli bir tabak var. Bu hangi sanat?",
              imageOptions: [
                {
                  src: "/turkce-hazinem/4.ebru.png",
                  label: "Ebru",
                },
                {
                  src: "/turkce-hazinem/4.cini.png",
                  label: "Çini",
                },
                {
                  src: "/turkce-hazinem/4.kil.png",
                  label: "Kil Sanatı",
                },
              ],
              correct: 1,
            },
            {
              q: "Elde şekil verilen toprak görünüyor. Bu hangi sanat?",
              imageOptions: [
                {
                  src: "/turkce-hazinem/4.ebru.png",
                  label: "Ebru",
                },
                {
                  src: "/turkce-hazinem/4.cini.png",
                  label: "Çini",
                },
                {
                  src: "/turkce-hazinem/4.kil.png",
                  label: "Kil Sanatı",
                },
              ],
              correct: 2,
            },
          ],
        },
      ],
    },
  },

  "5": {
    okuyorumAnliyorum: {
      title: "Oyuncak Kutusu",
      theme: "Sorumluluk - Kısa hikaye",
      text: "Selim akşamüstü odasında oyun oynadı. Yerde renkli bloklar, arabalar ve kartlar vardı. Oyun bitince oda çok dağınık görünüyordu. Selim önce blokları kutuya koydu. Arabalarını rafa dizdi. Kartlarını masanın çekmecesine yerleştirdi. Sonra halının üzerini kontrol etti. Odası yeniden düzenli oldu.",
      questions: [
        {
          q: "Selim nerede oyun oynadı?",
          options: ["Odasında", "Bahçede", "Otobüste"],
          correct: 0,
        },
        {
          q: "Oyun bitince oda nasıl görünüyordu?",
          options: ["Dağınık", "Boş", "Karanlık"],
          correct: 0,
        },
        {
          q: "Selim blokları nereye koydu?",
          options: ["Kutuya", "Balkona", "Çantaya"],
          correct: 0,
        },
        {
          q: "Arabalarını nereye dizdi?",
          options: ["Rafa", "Lavaboya", "Bahçeye"],
          correct: 0,
        },
        {
          q: "Kartlarını nereye yerleştirdi?",
          options: ["Masanın çekmecesine", "Yastığın altına", "Ayakkabılığa"],
          correct: 0,
        },
        {
          q: "Selim’in davranışı hangi değeri gösterir?",
          options: ["Sorumluluk", "Korku", "Sabırsızlık"],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Dilimi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Alfabetik Sıralama",
          text: "Kelimeleri sözlükteki gibi sıraya dizerken alfabedeki harf sırasını kullanırız. Buna alfabetik sıralama denir.\n    \n    Önce kelimelerin ilk harfine bakarız. Alfabede önce gelen harfle başlayan kelime önce yazılır.\n    \n    Örnek:\n    Armut, balık, defter\n    A harfi B harfinden önce geldiği için armut önce gelir.\n    \n    Eğer kelimelerin ilk harfi aynıysa ikinci harfe bakarız.\n    \n    Örnek:\n    Bal, bebek, biber\n    Hepsi b harfiyle başlar. İkinci harflere bakarız: a, e, i. Alfabede a önce geldiği için bal ilk sırada olur.",
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: En Önce Hangisi Gelir?",
          questions: [
            {
              q: "Hangi kelime sözlükte en önce gelir?",
              options: ["Araba", "Balık", "Defter"],
              correct: 0,
            },
            {
              q: "Hangi kelime sözlükte en önce gelir?",
              options: ["Limon", "Elma", "Muz"],
              correct: 1,
            },
            {
              q: "Hangi kelime sözlükte en önce gelir?",
              options: ["Kalem", "Gözlük", "Lamba"],
              correct: 1,
            },
            {
              q: "Hangi kelime sözlükte en önce gelir?",
              options: ["Zeytin", "Fındık", "Portakal"],
              correct: 1,
            },
            {
              q: "Hangi kelime sözlükte en önce gelir?",
              options: ["Ömer", "Ali", "Can"],
              correct: 1,
            },
          ],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Sıraya Diz",
          questions: [
            {
              q: "Mavi, Sarı, Yeşil kelimelerinin doğru sırası nasıldır?",
              options: ["Mavi, Sarı, Yeşil", "Yeşil, Sarı, Mavi"],
              correct: 0,
            },
            {
              q: "Masa, Ayı, Çilek kelimelerinin doğru sırası nasıldır?",
              options: ["Ayı, Çilek, Masa", "Masa, Çilek, Ayı"],
              correct: 0,
            },
            {
              q: "Defter, Çanta, Boya kelimelerinin doğru sırası nasıldır?",
              options: ["Boya, Çanta, Defter", "Çanta, Defter, Boya"],
              correct: 0,
            },
            {
              q: "Kuş, Kedi, Köpek kelimelerinin doğru sırası nasıldır?",
              options: ["Kedi, Köpek, Kuş", "Köpek, Kedi, Kuş"],
              correct: 0,
            },
            {
              q: "Gazete, Göz, Gül kelimelerinin doğru sırası nasıldır?",
              options: ["Gazete, Göz, Gül", "Göz, Gül, Gazete"],
              correct: 0,
            },
          ],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 3: Aynı Harfle Başlayanlar",
          desc: "Kelimeleri alfabetik sıraya koy.",
          questions: [
            {
              q: "Bal, Bebek, Biber",
              options: ["Bal, Bebek, Biber", "Biber, Bebek, Bal"],
              correct: 0,
            },
            {
              q: "Karpuz, Kayısı, Kivi",
              options: ["Karpuz, Kayısı, Kivi", "Kayısı, Karpuz, Kivi"],
              correct: 0,
            },
            {
              q: "Masa, Mavi, Mor",
              options: ["Masa, Mavi, Mor", "Mavi, Masa, Mor"],
              correct: 0,
            },
            {
              q: "Deniz, Dere, Dağ",
              options: ["Dağ, Deniz, Dere", "Deniz, Dere, Dağ"],
              correct: 0,
            },
            {
              q: "Gül, Gazete, Göz",
              options: ["Gazete, Göz, Gül", "Gül, Göz, Gazete"],
              correct: 0,
            },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Ülkemi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Türkiye’nin Denizleri",
          image: "/turkce-hazinem/5.harita.png",
          text: "Türkiye’nin çevresinde dört önemli deniz vardır. Kuzeyde Karadeniz, güneyde Akdeniz, batıda Ege Denizi bulunur. Marmara Denizi ise Türkiye’nin içinde yer alan özel bir iç denizdir. Bu denizlerin her birinin kendine özgü bir yeri ve özelliği vardır.\n\nKaradeniz, Türkiye’nin kuzeyindedir. Yağışlı havası, güçlü dalgaları ve yeşil kıyılarıyla bilinir. Akdeniz, Türkiye’nin güneyindedir. Sıcak kıyıları, güneşli havası, portakal ve limon bahçeleriyle tanınır. Ege Denizi, Türkiye’nin batısındadır. Girintili çıkıntılı kıyıları, koyları ve sahil şehirleriyle dikkat çeker.\n\nMarmara Denizi ise Türkiye’nin iç denizidir. İstanbul ve Çanakkale Boğazlarıyla bağlantılıdır. Denizler ülkemize sadece güzellik katmaz. Balıkçılık, gemi ulaşımı, turizm ve deniz canlılarının yaşamı için de çok önemlidir. Denizleri öğrenmek, Türkiye haritasını daha iyi tanımamıza yardım eder.",
        },
        {
          type: "image_hotspots",
          title: "Etkinlik 1: Haritada Doğru Yere Sürükle",
          desc: "Deniz isimlerini Türkiye haritasında doğru yönlere tıkla ve yerleştir.",
          bgImage: "/turkce-hazinem/5.harita-bos.png",
          labels: ["Karadeniz", "Akdeniz", "Ege Denizi", "Marmara Denizi"],
          hotspots: [
            {
              id: "karadeniz",
              x: 47,
              y: 9.5,
              correctLabel: "Karadeniz",
            },
            {
              id: "akdeniz",
              x: 47,
              y: 90.8,
              correctLabel: "Akdeniz",
            },
            {
              id: "ege",
              x: 7.5,
              y: 68,
              correctLabel: "Ege Denizi",
            },
            {
              id: "marmara",
              x: 18.5,
              y: 32,
              correctLabel: "Marmara Denizi",
            },
          ],
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          desc: "Cümle doğruysa Doğru'yu, yanlışsa Yanlış'ı seç.",
          questions: [
            {
              q: "Karadeniz Türkiye’nin iç denizidir.",
              correct: 1,
            },
            {
              q: "Akdeniz Türkiye’nin batısındadır.",
              correct: 1,
            },
            {
              q: "Ege Denizi Türkiye’nin batısındadır.",
              correct: 0,
            },
            {
              q: "Marmara Denizi Türkiye’nin iç denizidir.",
              correct: 0,
            },
            {
              q: "Türkiye’nin dört önemli denizi vardır.",
              correct: 0,
            },
          ],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 3: Boşluk Doldurma",
          desc: "Cümledeki boşluklara uygun kelimeyi seç.",
          sentences: [
            {
              text: "Karadeniz Türkiye’nin {blank} yer alır.",
              answer: "kuzeyinde",
            },
            {
              text: "Akdeniz Türkiye’nin {blank} yer alır.",
              answer: "güneyinde",
            },
            {
              text: "Ege Denizi Türkiye’nin {blank} yer alır.",
              answer: "batısında",
            },
            {
              text: "Marmara Denizi Türkiye’nin {blank} denizidir.",
              answer: "iç",
            },
          ],
          words: ["kuzeyinde", "güneyinde", "batısında", "iç"],
        },
      ],
    },
  },

  "6": {
    okuyorumAnliyorum: {
      title: "Kayıp Silgi",
      theme: "Nezaket - Kısa hikaye",
      text: "Can sınıfta öğretmenini bekliyordu. Yanındaki Sıla çantasını karıştırıyordu. Sıla pembe silgisini bulamamıştı. Can sıranın altına baktı. Küçük pembe silgi oradaydı. Can silgiyi aldı. Sıla’ya uzattı. Sıla gülümseyerek teşekkür etti.",
      questions: [
        {
          q: "Can nerede bekliyordu?",
          options: ["Sınıfta", "Parkta", "Markette"],
          correct: 0,
        },
        {
          q: "Sıla neyi arıyordu?",
          options: ["Silgisini", "Ayakkabısını", "Şapkasını"],
          correct: 0,
        },
        {
          q: "Silgi ne renkti?",
          options: ["Pembe", "Yeşil", "Siyah"],
          correct: 0,
        },
        {
          q: "Can silgiyi nerede buldu?",
          options: ["Sıranın altında", "Bahçede", "Çantasında"],
          correct: 0,
        },
        {
          q: "Sıla ne yaptı?",
          options: ["Teşekkür etti", "Ağladı", "Sınıftan çıktı"],
          correct: 0,
        },
        {
          q: "Can’ın davranışı hangi özelliği gösterir?",
          options: ["Nazik olmayı", "Dağınık olmayı", "Kızgın olmayı"],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 6: Çağrışım Sandığı",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Alakalı Kelimeleri Seç",
          desc: "Verilen kelimeyle en alakalı seçeneği seç.",
          questions: [
            {
              q: "Okul kelimesiyle en alakalı seçenek hangisidir?",
              options: ["deniz", "öğretmen", "çilek"],
              correct: 1,
            },
            {
              q: "Mutfak kelimesiyle en alakalı seçenek hangisidir?",
              options: ["tencere", "bulut", "ayakkabı"],
              correct: 0,
            },
            {
              q: "Yağmur kelimesiyle en alakalı seçenek hangisidir?",
              options: ["fırın", "yastık", "şemsiye"],
              correct: 2,
            },
            {
              q: "Kitap kelimesiyle en alakalı seçenek hangisidir?",
              options: ["sayfa", "kaşık", "çorap"],
              correct: 0,
            },
            {
              q: "Deniz kelimesiyle en alakalı seçenek hangisidir?",
              options: ["kalem", "dalga", "defter"],
              correct: 1,
            },
            {
              q: "Kedi kelimesiyle en alakalı seçenek hangisidir?",
              options: ["merdiven", "pencere", "pati"],
              correct: 2,
            },
            {
              q: "Bahçe kelimesiyle en alakalı seçenek hangisidir?",
              options: ["çiçek", "bardak", "yorgan"],
              correct: 0,
            },
            {
              q: "Sınıf kelimesiyle en alakalı seçenek hangisidir?",
              options: ["limon", "tahta", "deniz"],
              correct: 1,
            },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Sandık 6: Atatürk’ün Okul Yılları: Öğrenmeyi Seven Bir Çocuk",
      activities: [
        {
          type: "info",
          title: "Atatürk’ün Okul Yılları",
          desc: "Okuyalım ve öğrenelim.",
          text: "Mustafa Kemal küçük yaşlardan itibaren öğrenmeye meraklıydı. Okul hayatına Selanik’te başladı. Önce Mahalle Mektebi’ne gitti. Daha sonra babasının isteğiyle, dönemine göre daha modern bir eğitim veren Şemsi Efendi Okulu’nda okudu.\n\nŞemsi Efendi Okulu, Mustafa’nın düşünme ve öğrenme becerilerinin gelişmesine katkı sağladı. Burada daha düzenli ve yenilikçi bir eğitim aldı. Mustafa sadece dersleri ezberleyen bir öğrenci değildi. Öğrenmeye merak duyar, başarılı olmak için çalışırdı.\n\nDaha sonra askeri okullara ilgi duydu. Disiplinli yaşamı, düzenli çalışmayı ve sorumluluk almayı bu okullarda daha da geliştirdi. Matematik dersinde çok başarılıydı. Matematik öğretmeni onun bilgili ve olgun tavrını fark ederek ona “Kemal” adını verdi. Böylece Mustafa, Mustafa Kemal olarak anılmaya başladı.",
        },
        {
          type: "text_selection",
          title: "Etkinlik 1: Doğru Bilgi Kartlarını Seç",
          desc: "Mustafa Kemal’in okul yıllarıyla ilgili doğru bilgi kartlarını seç.",
          options: [
            {
              text: "Mustafa Kemal öğrenmeye meraklı bir öğrenciydi.",
              isCorrect: true,
            },
            {
              text: "Şemsi Efendi Okulu, dönemine göre modern eğitim veren bir okuldu.",
              isCorrect: true,
            },
            {
              text: "Mustafa Kemal’e “Kemal” adını matematik öğretmeni verdi.",
              isCorrect: true,
            },
            {
              text: "Mustafa Kemal hiç okula gitmedi.",
              isCorrect: false,
            },
            {
              text: "Mustafa Kemal askeri okullarda eğitim aldı.",
              isCorrect: true,
            },
            {
              text: "“Kemal” adı ona resim öğretmeni tarafından verildi.",
              isCorrect: false,
            },
          ],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          desc: "Cümlelerdeki boşluklara uygun kelimeleri seç.",
          sentences: [
            {
              text: "Mustafa Kemal öğrenmeyi seven bir {blank} idi.",
              answer: "çocuk",
            },
            {
              text: "Şemsi Efendi Okulu, dönemine göre daha {blank} bir okuldu.",
              answer: "modern",
            },
            {
              text: "Mustafa’ya “Kemal” adını {blank} öğretmeni verdi.",
              answer: "matematik",
            },
            {
              text: "Mustafa Kemal askeri okullarda eğitim {blank}.",
              answer: "aldı",
            },
          ],
          words: ["çocuk", "modern", "matematik", "aldı"],
        },
        {
          type: "true_false",
          title: "Etkinlik 3: Doğru Yanlış",
          desc: "Cümle doğruysa Doğru'yu, yanlışsa Yanlış'ı seç.",
          questions: [
            {
              q: "Mustafa Kemal öğrenmeye meraklıydı.",
              correct: 0,
            },
            {
              q: "Mustafa Kemal hiç okula gitmedi.",
              correct: 1,
            },
            {
              q: "Şemsi Efendi Okulu modern eğitim veren bir okuldu.",
              correct: 0,
            },
            {
              q: "Kemal adını matematik öğretmeni verdi.",
              correct: 0,
            },
            {
              q: "Mustafa Kemal askeri okullarda eğitim aldı.",
              correct: 0,
            },
          ],
        },
      ],
    },
  },

  "7": {
    okuyorumAnliyorum: {
      title: "Bahçedeki Çöp",
      theme: "Çevre temizliği - Kısa hikaye",
      text: "Umut öğle arasında okul bahçesinde yürüyordu. Çimlerin üzerinde boş bir meyve suyu kutusu gördü. Kutunun orada durması bahçeyi kirli gösteriyordu. Umut kutuyu yerden aldı. Bahçenin köşesindeki çöp kutusuna yürüdü. Kutuyu çöpe attı. Sonra ellerini yıkamaya gitti. Bahçe eskisinden daha temiz görünüyordu.",
      questions: [
        {
          q: "Umut nerede yürüyordu?",
          options: ["Okul bahçesinde", "Kütüphanede", "Evde"],
          correct: 0,
        },
        {
          q: "Çimlerin üzerinde ne gördü?",
          options: ["Boş meyve suyu kutusu", "Oyuncak araba", "Kitap"],
          correct: 0,
        },
        {
          q: "Umut kutuyu ne yaptı?",
          options: ["Çöp kutusuna attı", "Cebine koydu", "Tekmeledi"],
          correct: 0,
        },
        {
          q: "Umut sonra nereye gitti?",
          options: ["Ellerini yıkamaya", "Uyumaya", "Alışverişe"],
          correct: 0,
        },
        {
          q: "Kutunun yerde durması bahçeyi nasıl gösteriyordu?",
          options: ["Kirli", "Sessiz", "Karanlık"],
          correct: 0,
        },
        {
          q: "Bu metnin ana fikri nedir?",
          options: [
            "Çevremizi temiz tutmalıyız.",
            "Bahçede koşmamalıyız.",
            "Meyve suyu içmemeliyiz.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Dilimi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Nokta ve Virgül",
          text: "Cümleleri doğru okumak ve yazmak için noktalama işaretlerini kullanırız.\n    \n    Nokta, biten cümlenin sonuna konur.\n    Örnek:\n    Bugün okula gittim.\n    \n    Nokta ayrıca sıra bildiren sayılardan sonra da kullanılır.\n    Örnek:\n    3. sınıf, 1. sıra.\n    \n    Virgül ise cümle içinde art arda gelen benzer kelimeleri ayırmak için kullanılır.\n    Örnek:\n    Pazardan elma, armut ve muz aldım.\n    \n    Virgül bize cümle içinde kısa bir duraklama yeri gösterir.",
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: İşareti Seç",
          questions: [
            {
              q: "Bugün çok erken uyandım( )",
              options: [".", ","],
              correct: 0,
            },
            {
              q: "Çantamda kalem( ) silgi ve defter var.",
              options: [".", ","],
              correct: 1,
            },
            {
              q: "Bu yıl 3( ) sınıfa geçtim.",
              options: [".", ","],
              correct: 0,
            },
            {
              q: "Masada elma( ) armut ve muz vardı.",
              options: [".", ","],
              correct: 1,
            },
            {
              q: "Kedim sütünü içti( )",
              options: [".", ","],
              correct: 0,
            },
          ],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Doğru Yazımı Seç",
          questions: [
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: [
                "Elma, armut ve muz aldım.",
                "Elma armut ve muz aldım,",
              ],
              correct: 0,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Bugün parka gittim.", "Bugün parka, gittim"],
              correct: 0,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["3, sınıfa geçtim.", "3. sınıfa geçtim."],
              correct: 1,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Ali, Ece ve Can geldi.", "Ali Ece ve Can geldi,"],
              correct: 0,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Kitabımı okudum.", "Kitabımı okudum,"],
              correct: 0,
            },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Sandık 7: 19 Mayıs: Bir Yolculukla Başlayan Umut",
      activities: [
        {
          type: "info",
          title: "19 Mayıs: Bir Yolculukla Başlayan Umut",
          image: "/turkce-hazinem/7.png",
          text: "19 Mayıs 1919, Türkiye tarihi için önemli bir gündür. Mustafa Kemal, 16 Mayıs 1919’da İstanbul’dan Bandırma Vapuru ile yola çıktı ve 19 Mayıs 1919’da Samsun’a ulaştı. Bu yolculuk, Milli Mücadele’nin başlangıcı olarak kabul edilir.\n\nMilli Mücadele, Türk halkının ülkesinin bağımsızlığı için verdiği mücadeledir. O dönemde Anadolu’nun bazı yerleri işgal edilmişti. Mustafa Kemal, Samsun’a gittikten sonra Anadolu’daki insanlarla görüşmeye, toplantılar yapmaya ve bağımsızlık için ortak bir yol oluşturmaya başladı.\n\nBu nedenle 19 Mayıs yalnızca bir yolculuk tarihi değildir. Aynı zamanda bağımsızlık için atılan ilk önemli adımlardan biridir. Atatürk daha sonra bu günü gençlere armağan etmiştir. Bugün 19 Mayıs, Atatürk’ü Anma, Gençlik ve Spor Bayramı olarak kutlanır.",
        },
        {
          type: "sorting",
          title: "Etkinlik 1: Sıralı Sürükle Bırak",
          desc: "Olayları doğru sıraya koy. 1 2 3 4 yukarıdan aşağı olsun cümleler sıralansın",
          items: [
            { label: "Samsun’a ulaştı.", category: "3. Olay" },
            { label: "Bandırma Vapuru ile yola çıktı.", category: "2. Olay" },
            { label: "İstanbul’dan hareket etti.", category: "1. Olay" },
            {
              label: "Milli Mücadele için çalışmalar başladı.",
              category: "4. Olay",
            },
          ],
          categories: ["1. Olay", "2. Olay", "3. Olay", "4. Olay"],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Tahmin Oyunu",
          desc: "İpucu: Ben bir bayramım. Mustafa Kemal’in Samsun’a çıkışıyla bağlantılıyım. Milli Mücadele’nin başlangıcı olarak kabul edilen günü anlatırım. Gençlere armağan edildim. Ben hangi bayramım?",
          questions: [
            {
              q: "Ben hangi bayramım?",
              options: ["23 Nisan", "19 Mayıs", "29 Ekim"],
              correct: 1,
            },
          ],
        },
      ],
    },
  },

  "8": {
    okuyorumAnliyorum: {
      title: "Temiz Eller",
      theme: "Sağlık ve hijyen - Kısa hikaye",
      text: "Kerem sokakta top oynadı. Eve gelince ellerinin kirlendiğini fark etti. Doğrudan banyoya gitti. Önce ellerini suyla ıslattı. Sonra sabunla iyice köpürttü. Parmak aralarını da yıkadı. Ellerini temiz suyla duruladı. Son olarak havluyla kuruladı.",
      questions: [
        {
          q: "Kerem sokakta ne oynadı?",
          options: ["Top", "Satranç", "Seksek"],
          correct: 0,
        },
        {
          q: "Kerem eve gelince neyi fark etti?",
          options: [
            "Ellerinin kirlendiğini",
            "Çantasının kaybolduğunu",
            "Ayakkabısının yırtıldığını",
          ],
          correct: 0,
        },
        {
          q: "Kerem nereye gitti?",
          options: ["Banyoya", "Balkona", "Mutfağa"],
          correct: 0,
        },
        {
          q: "Ellerini neyle köpürttü?",
          options: ["Sabunla", "Boyayla", "Sütle"],
          correct: 0,
        },
        {
          q: "Kerem parmak aralarını neden yıkadı?",
          options: [
            "Ellerinin tamamen temizlenmesi için",
            "Oyun oynamak için",
            "Havluyu bulmak için",
          ],
          correct: 0,
        },
        {
          q: "Bu metin bize neyi hatırlatır?",
          options: [
            "Ellerimizi doğru şekilde yıkamayı",
            "Top oynamamayı",
            "Banyoda koşmayı",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Dilimi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Soru İşareti ve “mi” Yazımı",
          text: "Bir cümlede soru soruyorsak cümlenin sonuna soru işareti koyarız. (?)\n    \n    Örnek:\n    Bugün okula geldin mi?\n    \n    Türkçede mı, mi, mu, mü soru anlamı verir. Bu kelimeler her zaman ayrı yazılır.\n    \n    Doğru:\n    Geliyor musun?\n    Yanlış:\n    Geliyormusun?\n    \n    Soru sorarken hem soru ekini ayrı yazmalı hem de cümlenin sonuna soru işareti koymalıyız.",
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Doğru Yazımı Seç",
          questions: [
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Benimle gelir misin?", "Benimle gelirmisin?"],
              correct: 0,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Sütünü içtin mi?", "Sütünü içtinmi?"],
              correct: 0,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Ödevini yaptın mı?", "Ödevini yaptınmı?"],
              correct: 0,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Kediyi gördün mü?", "Kediyi gördünmü?"],
              correct: 0,
            },
            {
              q: "Hangi cümle doğru yazılmıştır?",
              options: ["Yeni çanta aldın mı?", "Yeni çanta aldınmı?"],
              correct: 0,
            },
          ],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Son İşareti Seç",
          questions: [
            {
              q: "Bugün okula geldin mi( )",
              options: [".", "?"],
              correct: 1,
            },
            {
              q: "Bugün okula geldim( )",
              options: [".", "?"],
              correct: 0,
            },
            {
              q: "Benimle oyun oynar mısın( )",
              options: [".", "?"],
              correct: 1,
            },
            {
              q: "Bahçede top oynadım( )",
              options: [".", "?"],
              correct: 0,
            },
            {
              q: "Bu kalem senin mi( )",
              options: [".", "?"],
              correct: 1,
            },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Sandık 8: Ritim ve Hareket: Türk Müziği ve Halk Dansları",
      activities: [
        {
          type: "info",
          title: "Ritim ve Hareket: Türk Müziği ve Halk Dansları",
          infoImages: [
            { src: "/turkce-hazinem/8.horon.png", label: "Horon" },
            { src: "/turkce-hazinem/8.zeybek.png", label: "Zeybek" },
            { src: "/turkce-hazinem/8.halay.png", label: "Halay" },
          ],
          text: "Türkiye’nin farklı bölgelerinde farklı müzikler, çalgılar ve halk dansları vardır. Bu danslar sadece eğlenmek için yapılmaz. Bazen bir bölgenin doğasını, bazen insanların yaşam tarzını, bazen de ortak sevinci anlatır. Müzik ve dans kültürün hareketli yüzüdür.\n\nHoron, Karadeniz Bölgesi ile çok bağlantılıdır. Genellikle hızlı ve enerjik hareketlerle oynanır. Kemençe sesi horonla birlikte sıkça duyulur. Oyuncular bazen yan yana dizilir, kollarını birleştirir ve hızlı adımlarla ritme uyar. Karadeniz’in hareketli doğası horonda hissedilir.\n\nZeybek, özellikle Ege kültürüyle tanınır. Daha ağır, gururlu ve güçlü duruşlarla oynanır. Zeybek oynayan kişi kollarını açarak yavaş ve dikkatli hareket eder.\n\nHalay ise birçok bölgede topluca oynanan bir halk dansıdır. İnsanlar yan yana dizilir, el ele ya da omuz omuza tutunur ve birlikte hareket eder. Bağlama, davul, zurna ve kemençe gibi çalgılar da bu danslara eşlik edebilir. Böylece müzik, dans ve birlik duygusu bir araya gelir.",
        },
        {
          type: "sorting",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Dans veya çalgıyı doğru bilgiyle eşleştir.",
          items: [
            {
              category: "Horon",
              label: "Karadeniz’de sık görülen hızlı halk dansı",
            },
            {
              category: "Zeybek",
              label:
                "Ege kültürüyle bağlantılı, ağır ve güçlü duruşlu halk dansı",
            },
            {
              category: "Halay",
              label: "Birçok bölgede birlikte oynanan halk dansı",
            },
            {
              category: "Kemençe",
              label: "Karadeniz kültürüyle çok bağlantılı bir çalgı",
            },
            {
              category: "Bağlama",
              label: "Türk müziğinde kullanılan telli çalgı",
            },
          ],
          categories: ["Horon", "Zeybek", "Halay", "Kemençe", "Bağlama"],
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          questions: [
            { q: "Horon Karadeniz kültürüyle bağlantılıdır.", correct: true },
            { q: "Zeybek genellikle Ege kültürüyle tanınır.", correct: true },
            { q: "Halay sadece tek kişiyle oynanır.", correct: false },
            { q: "Kemençe Karadeniz müziğinde duyulabilir.", correct: true },
            {
              q: "Halk dansları kültürü yaşatmaya yardım eder.",
              correct: true,
            },
          ],
        },
      ],
    },
  },

  "9": {
    okuyorumAnliyorum: {
      title: "Günebakan Çiçeği",
      theme: "Bilgilendirici doğa - Kısa bilgilendirici metin",
      text: "Ayçiçeği, büyük sarı yapraklarıyla kolayca tanınır. Halk arasında ona günebakan da denir. Çünkü genç ayçiçekleri gün içinde güneşin yönüne doğru dönebilir. Sabah güneş doğudan yükselir. Gün ilerledikçe güneş gökyüzünde yer değiştirir. Ayçiçeği de ışığa yönelir. Bu hareket bitkinin büyümesine yardım eder. Ayçiçeği hem güzel görünür hem de çekirdek verir.",
      questions: [
        {
          q: "Ayçiçeği hangi rengiyle kolayca tanınır?",
          options: ["Sarı", "Mavi", "Siyah"],
          correct: 0,
        },
        {
          q: "Ayçiçeğine halk arasında ne denir?",
          options: ["Günebakan", "Gece çiçeği", "Kar çiçeği"],
          correct: 0,
        },
        {
          q: "Genç ayçiçekleri neye yönelebilir?",
          options: ["Güneşe", "Taşa", "Yağmurluğa"],
          correct: 0,
        },
        {
          q: "Sabah güneş nereden yükselir?",
          options: ["Doğudan", "Batıdan", "Kuzeyden"],
          correct: 0,
        },
        {
          q: "Ayçiçeğinin ışığa yönelmesi neye yardım eder?",
          options: ["Büyümesine", "Uçmasına", "Rengini kaybetmesine"],
          correct: 0,
        },
        {
          q: "Ayçiçeğiyle ilgili hangi bilgi doğrudur?",
          options: [
            "Işığa yönelebilir ve çekirdek verir.",
            "Geceleri denizde yaşar.",
            "Kışın yapraklarını maviye boyar.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Dilimi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Zıt Anlamlı Kelimeler",
          text: "Bazı kelimeler birbirinin tam tersini anlatır. Bu kelimelere zıt anlamlı kelimeler denir.\n    \n    Örnek:\n    Büyük ve küçük birbirinin zıttıdır.\n    Sıcak ve soğuk birbirinin zıttıdır.\n    Uzun ve kısa birbirinin zıttıdır.\n    \n    Zıt anlamlı kelimeleri öğrenmek, cümleleri daha iyi anlamamıza yardım eder.\n    \n    Örnek cümle:\n    Bugün hava sıcak, dün hava soğuktu.\n    Bu cümlede sıcak ve soğuk zıt anlamlıdır.",
        },
        {
          type: "sorting",
          title: "Etkinlik 1: Zıttını Bul eşleştirme",
          desc: "Kelimeleri zıt anlamlılarıyla eşleştir.",
          items: [
            { category: "Büyük", label: "Küçük" },
            { category: "Sıcak", label: "Soğuk" },
            { category: "Uzun", label: "Kısa" },
            { category: "Açık", label: "Kapalı" },
            { category: "Temiz", label: "Kirli" },
            { category: "Güzel", label: "Çirkin" },
            { category: "Uzak", label: "Yakın" },
            { category: "Karanlık", label: "Aydınlık" },
            { category: "Mutlu", label: "Üzgün" },
          ],
          categories: [
            "Büyük",
            "Sıcak",
            "Uzun",
            "Açık",
            "Temiz",
            "Güzel",
            "Uzak",
            "Karanlık",
            "Mutlu",
          ],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Cümlede Zıttını Seç",
          questions: [
            {
              q: "Çay çok sıcak, su ise çok ...............",
              options: ["soğuk", "büyük"],
              correct: 0,
            },
            {
              q: "Kutunun içi boş değil, ...............",
              options: ["dolu", "kısa"],
              correct: 0,
            },
            {
              q: "Uzun kalemin yanına ............... kalem koydu.",
              options: ["kısa", "temiz"],
              correct: 0,
            },
            {
              q: "Kapı açık değil, ...............",
              options: ["kapalı", "ağır"],
              correct: 0,
            },
            {
              q: "Kirli çorapları çıkarıp ............... çorap giydi.",
              options: ["temiz", "eski"],
              correct: 0,
            },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title:
        "Sandık 9: Gülümseten Hikayeler: Karagöz, Hacivat ve Nasreddin Hoca",
      activities: [
        {
          type: "info",
          title: "Gülümseten Hikayeler: Karagöz, Hacivat ve Nasreddin Hoca",
          infoImages: [
            {
              src: "/turkce-hazinem/9.hacivat.png",
              label: "Karagöz ve Hacivat",
            },
            { src: "/turkce-hazinem/9.nasrettin.png", label: "Nasreddin Hoca" },
          ],
          text: "Türk kültüründe insanları güldüren ama aynı zamanda düşündüren birçok hikaye vardır. Karagöz ve Hacivat, geleneksel gölge oyununun en bilinen karakterleridir. Bu oyunda figürler ışık yardımıyla perdeye yansıtılır ve izleyiciler karakterlerin konuşmalarını takip eder.\n\nKaragöz daha açık sözlü, daha halktan ve bazen yanlış anlayan bir karakterdir. Hacivat ise daha bilgili, daha süslü konuşan ve dikkatli davranmaya çalışan bir karakterdir. İkisi arasındaki konuşmalar, yanlış anlamalar ve komik cevaplar oyunu eğlenceli hale getirir.\n\nNasreddin Hoca ise fıkralarıyla tanınır. Onun hikayelerinde çoğu zaman kısa ama etkili bir düşünce vardır. Bazen insanları güldürür, bazen de “Acaba burada ne anlatılmak isteniyor?” diye düşündürür. Karagöz, Hacivat ve Nasreddin Hoca bize mizahın kültürde ne kadar güçlü olduğunu gösterir.",
        },
        {
          type: "sorting",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Karakteri veya oyunu doğru özelliğiyle eşleştir.",
          items: [
            { category: "Karagöz", label: "Açık sözlü ve komik karakter" },
            {
              category: "Hacivat",
              label: "Daha bilgili ve süslü konuşan karakter",
            },
            { category: "Nasreddin Hoca", label: "Fıkralarıyla tanınır" },
            {
              category: "Gölge oyunu",
              label: "Perde arkasından oynatılan geleneksel oyun",
            },
          ],
          categories: ["Karagöz", "Hacivat", "Nasreddin Hoca", "Gölge oyunu"],
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru mu, Yanlış mı?",
          questions: [
            { q: "Karagöz ve Hacivat bir gölge oyunudur.", correct: 0 },
            { q: "Nasreddin Hoca fıkralarıyla tanınır.", correct: 0 },
            { q: "Hacivat hiç konuşmayan bir karakterdir.", correct: 1 },
            { q: "Mizah bazen düşündürücü olabilir.", correct: 0 },
            { q: "Karagöz ve Hacivat Türk kültürünün parçasıdır.", correct: 0 },
          ],
        },
        {
          type: "sorting",
          title: "Etkinlik 3: Tahmin Oyunu",
          desc: "Bilmecelerin cevabını bul ve eşleştir.",
          items: [
            {
              category: "Karagöz",
              label:
                "Ben açık sözlü ve komik bir gölge oyunu karakteriyim. Hacivat ile konuşmalarım izleyenleri güldürür. Ben kimim?",
            },
            {
              category: "Nasreddin Hoca",
              label:
                "Ben fıkralarımla tanınırım. İnsanları hem güldürür hem düşündürürüm. Ben kimim?",
            },
            {
              category: "Gölge oyunu",
              label:
                "Ben ışık ve perdeyle oynatılan geleneksel bir oyunum. Ben neyim?",
            },
          ],
          categories: ["Karagöz", "Nasreddin Hoca", "Gölge oyunu"],
        },
      ],
    },
  },

  "10": {
    okuyorumAnliyorum: {
      title: "Kırmızı Işık",
      theme: "Güvenlik ve kurallar - Kısa hikaye",
      text: "Mert ve annesi markete gitmek için evden çıktı. Büyük caddenin kenarındaki kaldırımdan yürüdüler. Yaya geçidine geldiklerinde durdular. Trafik lambasında kırmızı insan işareti yanıyordu. Mert annesinin elini tuttu. Bir süre beklediler. Yeşil insan işareti yanınca karşıya geçtiler. Mert kurala uyduğu için güvenle yürüdü.",
      questions: [
        {
          q: "Mert ve annesi nereye gitmek için çıktı?",
          options: ["Markete", "Okula", "Sinemaya"],
          correct: 0,
        },
        {
          q: "Nereden yürüdüler?",
          options: ["Kaldırımdan", "Yolun ortasından", "Çimlerden"],
          correct: 0,
        },
        {
          q: "Yaya geçidinde önce hangi işaret yanıyordu?",
          options: ["Kırmızı insan işareti", "Mavi yıldız", "Sarı araba"],
          correct: 0,
        },
        {
          q: "Mert kimin elini tuttu?",
          options: ["Annesinin", "Öğretmeninin", "Arkadaşının"],
          correct: 0,
        },
        {
          q: "Ne zaman karşıya geçtiler?",
          options: [
            "Yeşil insan işareti yanınca",
            "Kırmızı ışık yanınca",
            "Hiç beklemeden",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Trafik kurallarına uymak güvenlik için önemlidir.",
            "Market alışverişi eğlencelidir.",
            "Kaldırımlar sadece oyun içindir.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Dilimi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Eş Anlamlı Kelimeler",
          text: "Bazı kelimeler farklı yazılır ama aynı ya da çok yakın anlamı taşır. Bu kelimelere eş anlamlı kelimeler denir.\n    \n    Örnek:\n    Hikaye ve öykü aynı anlama gelir.\n    Kelime ve sözcük aynı anlama gelir.\n    Cevap ve yanıt aynı anlama gelir.\n    \n    Eş anlamlı kelimeler cümle içinde bazen birbirinin yerine kullanılabilir.\n    Örnek:\n    Öğretmen bize güzel bir hikaye okudu.\n    Öğretmen bize güzel bir öykü okudu.\n    Bu iki cümlede anlam değişmez.",
        },
        {
          type: "sorting",
          title: "Etkinlik 1: Eşini Bul",
          desc: "Kelimeleri eş anlamlılarıyla eşleştir.",
          items: [
            { category: "Hikaye", label: "Öykü" },
            { category: "Kelime", label: "Sözcük" },
            { category: "Cevap", label: "Yanıt" },
            { category: "Doktor", label: "Hekim" },
            { category: "Yıl", label: "Sene" },
            { category: "Al", label: "Kırmızı" },
            { category: "Ak", label: "Beyaz" },
            { category: "Kara", label: "Siyah" },
          ],
          categories: [
            "Hikaye",
            "Kelime",
            "Cevap",
            "Doktor",
            "Yıl",
            "Al",
            "Ak",
            "Kara",
          ],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Doğru Kelimeyi Seç",
          questions: [
            {
              q: "Öğretmen bize güzel bir öykü okudu. Öykü yerine hangisi gelebilir?",
              options: ["Hikaye", "Kapı"],
              correct: 0,
            },
            {
              q: "Sorunun yanıtını biliyorum. Yanıt yerine hangisi gelebilir?",
              options: ["Cevap", "Defter"],
              correct: 0,
            },
            {
              q: "Bu sene köye gideceğiz. Sene yerine hangisi gelebilir?",
              options: ["Yıl", "Saat"],
              correct: 0,
            },
            {
              q: "Hasta olunca hekime gittik. Hekim yerine hangisi gelebilir?",
              options: ["Doktor", "Öğrenci"],
              correct: 0,
            },
            {
              q: "Tahtaya üç sözcük yazdı. Sözcük yerine hangisi gelebilir?",
              options: ["Kelime", "Cümle sonu"],
              correct: 0,
            },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title:
        "Sandık 10: Cumhuriyet’in Gökyüzü Öncüleri: Sabiha Gökçen ve Vecihi Hürkuş",
      activities: [
        {
          type: "info",
          title: "Cumhuriyet’in Gökyüzü Öncüleri",
          infoImages: [
            { src: "/turkce-hazinem/10.sabiha.png", label: "Sabiha Gökçen" },
            { src: "/turkce-hazinem/10.hurkus.png", label: "Vecihi Hürkuş" },
          ],
          text: "Cumhuriyet’in ilk yıllarında Türkiye’de eğitim, bilim ve teknoloji alanında birçok yenilik yapılmaya çalışıldı. İnsanlar sadece bugünü değil, geleceği de düşünüyordu. Havacılık da bu dönemde önem verilen alanlardan biriydi. Uçmak, gökyüzünü tanımak ve uçaklarla ilgili çalışmalar yapmak büyük cesaret ve emek istiyordu.\n\nSabiha Gökçen, Türkiye’nin ilk kadın pilotudur. Onun hikayesi, özellikle kız çocuklarına “Ben de başarabilirim” duygusu verir. O dönemde bir kadının pilot olması, birçok kişi için çok ilham verici bir örnekti. Sabiha Gökçen bize cesaretin ve çalışmanın kapıları açabileceğini gösterir.\n\nVecihi Hürkuş ise uçmayı ve uçakları çok seven önemli bir havacılık öncüsüdür. Uçaklarla ilgili çalışmaları ve havacılığa duyduğu büyük ilgiyle tanınır. Sabiha Gökçen ve Vecihi Hürkuş, gökyüzüne bakıp hayal kuran insanların neler başarabileceğini anlatan iki güçlü örnektir.",
        },
        {
          type: "sorting",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Kavramları ve kişileri doğru açıklamalarla eşleştir.",
          items: [
            {
              category: "Sabiha Gökçen",
              label: "Türkiye’nin ilk kadın pilotlarından biri",
            },
            {
              category: "Vecihi Hürkuş",
              label: "Türk havacılığının önemli öncülerinden biri",
            },
            {
              category: "Havacılık",
              label: "Uçaklar ve uçuşlarla ilgili alan",
            },
            {
              category: "Uçak",
              label: "Gökyüzünde yolculuk yapmayı sağlayan araç",
            },
          ],
          categories: ["Sabiha Gökçen", "Vecihi Hürkuş", "Havacılık", "Uçak"],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            {
              text: "Sabiha Gökçen Türkiye’nin ilk kadın {blank}.",
              answer: "pilotudur",
            },
            {
              text: "Vecihi Hürkuş {blank} alanının öncülerindendir.",
              answer: "havacılık",
            },
            {
              text: "Havacılık uçaklar ve {blank} ile ilgilidir.",
              answer: "uçuşlar",
            },
            {
              text: "Gökyüzüne ilgi duymak {blank} kurmakla başlar.",
              answer: "hayal",
            },
          ],
          words: ["pilotudur", "havacılık", "uçuşlar", "hayal"],
        },
      ],
    },
  },

  "11": {
    okuyorumAnliyorum: {
      title: "Parktaki Kulübe",
      theme: "Yardımlaşma - Hikaye",
      text: "Eda ve Kaan hafta sonu mahalledeki parka gittiler. Parkın köşesindeki çınar ağacında eski bir kuş kulübesi gördüler. Kulübenin çatısı eğilmiş, boyası dökülmüştü. Küçük kapısının kenarı da biraz kırılmıştı. Eda, kuşların yağmurda bu kulübede zorlanabileceğini düşündü. Kaan da kulübeyi birlikte onarabileceklerini söyledi. Bunun üzerine eve gidip gerekli malzemeleri almaya karar verdiler. Kaan küçük bir tamir kutusu getirdi. Eda da fırça, boya ve biraz yem aldı. Önce çatıyı düzelttiler, sonra kırık yeri dikkatlice sağlamlaştırdılar. Ardından kulübeyi sarı ve yeşil renklere boyadılar. Boya kuruyunca içine biraz yem ve küçük bir kap su bıraktılar. Kuşlar ağaca gelince iki arkadaş sessizce geri çekilip onları izledi. Yaptıkları küçük yardımın bir canlı için güvenli bir yuva olduğunu görmek ikisini de mutlu etti.",
      questions: [
        {
          q: "Eda ve Kaan nereye gitti?",
          options: ["Parka", "Müzeye", "Pazara"],
          correct: 0,
        },
        {
          q: "Eski kulübe neredeydi?",
          options: ["Çınar ağacında", "Bankın altında", "Çantanın içinde"],
          correct: 0,
        },
        {
          q: "Kulübenin hangi sorunları vardı?",
          options: [
            "Çatısı eğilmiş, boyası dökülmüş ve kapısının kenarı kırılmıştı.",
            "İçinde oyuncak vardı.",
            "Çok yeni görünüyordu.",
          ],
          correct: 0,
        },
        {
          q: "Kaan evden ne getirdi?",
          options: ["Tamir kutusu", "Uçurtma", "Top"],
          correct: 0,
        },
        {
          q: "Çocuklar kulübeyi boyamadan önce ne yaptı?",
          options: [
            "Çatıyı ve kırık yeri düzeltti.",
            "Eve döndü.",
            "Yem yedi.",
          ],
          correct: 0,
        },
        {
          q: "Kulübeye ne bıraktılar?",
          options: ["Yem ve su", "Taş ve ip", "Defter ve kalem"],
          correct: 0,
        },
        {
          q: "Eda neden kulübeyi onarmak istedi?",
          options: [
            "Kuşların yağmurda zorlanabileceğini düşündü.",
            "Kulübeyi eve götürmek istedi.",
            "Parktan sıkıldı.",
          ],
          correct: 0,
        },
        {
          q: "Bu metnin ana fikri nedir?",
          options: [
            "Birlikte çalışarak canlılara yardım edebiliriz.",
            "Parklarda hiç ağaç olmamalıdır.",
            "Kuşlar sadece sarı kulübeyi sever.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Dilimi Öğreniyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Eş Sesli Kelimeler",
          text: "Bazı kelimeler aynı yazılır ve aynı okunur ama farklı anlamlara gelebilir. Bu kelimelere eş sesli kelimeler denir.\n    \n    Örnek:\n    Gül kelimesi iki farklı anlama gelebilir.\n    Bahçede kırmızı bir gül açtı.\n    Bu cümlede gül çiçektir.\n    Arkadaşına bakıp gül.\n    Bu cümlede gül, gülümsemek anlamındadır.\n    \n    Başka örnekler:\n    Yüz: sayı olan 100, suda yüzmek ve yüzümüz!\n    Çay: içecek ya da küçük akarsu.\n    Yaz: mevsim ya da yazı yazmak.\n    \n    Eş sesli kelimenin anlamını cümleye bakarak anlarız.",
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Cümledeki Anlamı Seç",
          questions: [
            {
              q: "Bahçedeki gül çok güzel kokuyor.",
              options: ["Çiçek", "Gülmek"],
              correct: 0,
            },
            {
              q: "Tahtaya güzel yaz.",
              options: ["Mevsim", "Yazmak"],
              correct: 1,
            },
            {
              q: "Yaz çok sıcak geçti.",
              options: ["Mevsim", "Yazmak"],
              correct: 0,
            },
            {
              q: "Deredeki çay hızlı akıyor.",
              options: ["İçecek", "Küçük akarsu"],
              correct: 1,
            },
            {
              q: "Bardaktaki çay sıcaktı.",
              options: ["İçecek", "Küçük akarsu"],
              correct: 0,
            },
          ],
        },
        {
          type: "sorting",
          title: "Etkinlik 2: Eş Sesli mi Değil mi?",
          desc: "Kelimeleri eş sesli olup olmamalarına göre doğru kutuya yerleştir.",
          items: [
            { category: "Eş Sesli", label: "Gül" },
            { category: "Eş Sesli Değil", label: "Masa" },
            { category: "Eş Sesli", label: "Yaz" },
            { category: "Eş Sesli Değil", label: "Defter" },
            { category: "Eş Sesli", label: "Çay" },
          ],
          categories: ["Eş Sesli", "Eş Sesli Değil"],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 11",
      activities: [
        {
          type: "info",
          title: "Türkiye’de Hava ve Mevsimler",
          text: "Türkiye’de hava her yerde aynı değildir. Çünkü ülkemizde denizler, dağlar, ovalar ve yüksek bölgeler vardır. Bir şehir deniz kenarındaysa hava daha ılık olabilir. Bir şehir yüksek dağların arasındaysa kışlar daha soğuk ve karlı geçebilir. Bu yüzden Türkiye’de aynı mevsimde bile farklı bölgelerde farklı hava durumları görülebilir.\n\nTürkiye’yi düşünürken aklımızda birkaç kolay ipucu tutabiliriz. Karadeniz denince aklımıza yağmur, yeşil ormanlar, çay bahçeleri ve yaylalar gelir. Çünkü Karadeniz’de yağış fazladır. Bu yüzden doğa çoğu yerde yemyeşildir.\n\nAkdeniz denince aklımıza güneş, sıcak kıyılar, portakal, limon ve mandalina gelir. Çünkü Akdeniz kıyılarında yazlar sıcak ve kurak, kışlar ise daha ılık geçer. Bu hava, turunçgillerin yetişmesine yardım eder.\n\nİç Anadolu denince aklımıza geniş düzlükler, bozkır, buğday tarlaları, sıcak yazlar ve soğuk kışlar gelir. Çünkü İç Anadolu denizden uzak olduğu için denizin yumuşatıcı etkisini fazla hissetmez. Bu yüzden yaz ve kış arasındaki sıcaklık farkı daha belirgin olabilir.\n\nDoğu Anadolu denince aklımıza yüksek dağlar, uzun kışlar, kar ve soğuk hava gelir. Çünkü bu bölgede yükselti fazladır. Yükselti arttıkça hava genellikle serinler. Bu nedenle Doğu Anadolu’da kışlar daha uzun ve karlı geçebilir.\n\nDağlar ve denizler Türkiye’nin havasını etkiler. Denizler kıyı bölgelerde havayı daha ılık yapabilir. Dağlar ise bazı yerlerde denizden gelen havanın iç bölgelere ulaşmasını zorlaştırabilir. Bu nedenle Türkiye’de farklı iklimler, farklı bitkiler, farklı yiyecekler ve farklı yaşam şekilleri görülür.\n\nKısaca akılda tutalım:\n- Karadeniz yağmurlu ve yeşildir.\n- Akdeniz sıcak ve güneşlidir.\n- İç Anadolu yazın sıcak, kışın soğuk olabilir.\n- Doğu Anadolu yüksek, soğuk ve karlıdır.",
          infoImages: [
            { src: "/turkce-hazinem/11.bilgi.png", alt: "Hava ve Mevsimler" },
          ],
        },
        {
          type: "image_hotspots",
          title: "Etkinlik 1: Haritada Bölgeyi Bul",
          desc: "Bölge adlarını Türkiye haritasında doğru yerlere yerleştir.",
          bgImage: "/turkce-hazinem/11.etkinlik1.png",
          labels: [
            "Marmara",
            "Ege",
            "Akdeniz",
            "İç Anadolu",
            "Karadeniz",
            "Doğu Anadolu",
            "Güneydoğu Anadolu",
          ],
          hotspots: [
            { id: "marmara", correctLabel: "Marmara", x: 15, y: 30 },
            { id: "ege", correctLabel: "Ege", x: 15, y: 60 },
            { id: "akdeniz", correctLabel: "Akdeniz", x: 40, y: 82 },
            { id: "ic_anadolu", correctLabel: "İç Anadolu", x: 42, y: 50 },
            { id: "karadeniz", correctLabel: "Karadeniz", x: 55, y: 30 },
            { id: "dogu_anadolu", correctLabel: "Doğu Anadolu", x: 80, y: 45 },
            {
              id: "guneydogu_anadolu",
              correctLabel: "Güneydoğu Anadolu",
              x: 75,
              y: 70,
            },
          ],
        },
        {
          type: "sorting",
          title: "Etkinlik 2: Bölge İpucunu Eşleştir",
          desc: "İpuçlarını ait oldukları bölgelere yerleştir.",
          items: [
            { category: "Karadeniz", label: "Yağmurlu ve yeşil bölge" },
            { category: "Akdeniz", label: "Sıcak kıyılar ve turunçgiller" },
            { category: "Ege", label: "Zeytin, incir ve üzüm" },
            { category: "İç Anadolu", label: "Başkent, bozkır ve buğday" },
            {
              category: "Doğu Anadolu",
              label: "Yüksek dağlar ve karlı kışlar",
            },
            {
              category: "Güneydoğu Anadolu",
              label: "Sıcak ovalar ve tarihi yerler",
            },
            { category: "Marmara", label: "Köprüler ve kalabalık şehirler" },
          ],
          categories: [
            "Karadeniz",
            "Akdeniz",
            "Ege",
            "İç Anadolu",
            "Doğu Anadolu",
            "Güneydoğu Anadolu",
            "Marmara",
          ],
        },
        {
          type: "true_false",
          title: "Etkinlik 3: Doğru Yanlış",
          questions: [
            { q: "Türkiye 7 coğrafi bölgeye ayrılır.", correct: true },
            {
              q: "Marmara Bölgesi Türkiye’nin kuzeybatısındadır.",
              correct: true,
            },
            {
              q: "Karadeniz Bölgesi Türkiye’nin güneyindedir.",
              correct: false,
            },
            { q: "İç Anadolu ülkenin orta kısmındadır.", correct: true },
            {
              q: "Dağlar ve denizler bölgelerin havasını etkileyebilir.",
              correct: true,
            },
            {
              q: "Her bölgenin iklimi ve doğası tamamen aynıdır.",
              correct: false,
            },
          ],
        },
      ],
    },
  },

  "12": {
    okuyorumAnliyorum: {
      title: "Rüzgarlı Uçurtma",
      theme: "Paylaşma - Hikaye",
      text: "Emre rüzgarlı bir cumartesi sabahı sahile gitti. Elinde sarı ve lacivert çizgili bir uçurtma vardı. Rüzgar kuvvetli olduğu için uçurtma kısa sürede gökyüzüne yükseldi. Emre ipi dikkatle tutuyor, uçurtmanın sağa sola savrulmasını izliyordu. Biraz ileride küçük bir çocuk bankta oturuyordu. Çocuğun yanında oyuncak yoktu ve gözleri Emre’nin uçurtmasındaydı. Emre önce tek başına oynamaya devam etti. Sonra çocuğun uzun süre sessizce izlediğini fark etti. Yanına gidip uçurtmanın ipini birlikte tutmayı teklif etti. Çocuk sevinerek ayağa kalktı. Emre ona ipin nasıl tutulacağını gösterdi. İkisi sırayla ipi tuttular ve uçurtmanın daha da yükselmesini izlediler. Emre, oyuncağını paylaşınca oyunun daha keyifli olduğunu fark etti. Küçük çocuk da oyuna katıldığı için mutlu oldu.",
      questions: [
        {
          q: "Emre nereye gitti?",
          options: ["Sahile", "Ormana", "Sınıfa"],
          correct: 0,
        },
        {
          q: "Hava nasıldı?",
          options: ["Rüzgarlı", "Karlı", "Sisli"],
          correct: 0,
        },
        {
          q: "Uçurtmanın renkleri neydi?",
          options: ["Sarı ve lacivert", "Kırmızı ve beyaz", "Mor ve yeşil"],
          correct: 0,
        },
        {
          q: "Küçük çocuk ne yapıyordu?",
          options: [
            "Emre’nin uçurtmasını izliyordu.",
            "Koşuyordu.",
            "Uyuyordu.",
          ],
          correct: 0,
        },
        {
          q: "Emre çocuğun yanına neden gitti?",
          options: [
            "Onun uzun süre sessizce izlediğini fark ettiği için",
            "Uçurtmayı saklamak için",
            "Bankı almak için",
          ],
          correct: 0,
        },
        {
          q: "Emre çocuğa ne teklif etti?",
          options: [
            "Uçurtmanın ipini birlikte tutmayı",
            "Eve gitmeyi",
            "Denize girmeyi",
          ],
          correct: 0,
        },
        {
          q: "Emre neyi fark etti?",
          options: [
            "Paylaşınca oyunun daha keyifli olduğunu",
            "Uçurtmanın gereksiz olduğunu",
            "Sahilin çok uzak olduğunu",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Paylaşmak mutluluğu artırır.",
            "Rüzgarlı havada dışarı çıkılmaz.",
            "Uçurtma sadece tek kişiyle oynanır.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 12: Cümle Oluşturma",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik: Doğru Cümleyi Seç",
          desc: "Karışık verilen kelimelerden oluşan doğru cümleyi seç.",
          questions: [
            {
              q: "kitap, Elif, okudu",
              options: [
                "Kitap okudu Elif.",
                "Elif kitap okudu.",
                "Okudu Elif kitap.",
              ],
              correct: 1,
            },
            {
              q: "top, Ali, oynadı",
              options: [
                "Ali top oynadı.",
                "Top oynadı Ali.",
                "Oynadı Ali top.",
              ],
              correct: 0,
            },
            {
              q: "süt, kedi, içti",
              options: ["İçti kedi süt.", "Süt kedi içti.", "Kedi süt içti."],
              correct: 2,
            },
            {
              q: "yemek, annem, yaptı",
              options: [
                "Annem yemek yaptı.",
                "Yemek yaptı annem.",
                "Yaptı annem yemek.",
              ],
              correct: 0,
            },
            {
              q: "bahçede, çocuklar, oynadı",
              options: [
                "Bahçede oynadı çocuklar.",
                "Çocuklar bahçede oynadı.",
                "Oynadı bahçede çocuklar.",
              ],
              correct: 1,
            },
            {
              q: "gökyüzünde, kuş, uçtu",
              options: [
                "Uçtu kuş gökyüzünde.",
                "Gökyüzünde uçtu kuş.",
                "Kuş gökyüzünde uçtu.",
              ],
              correct: 2,
            },
            {
              q: "kalem, masada, duruyor",
              options: [
                "Kalem masada duruyor.",
                "Duruyor kalem masada.",
                "Masada kalem duruyor mu.",
              ],
              correct: 0,
            },
            {
              q: "sabah, Mert, uyandı",
              options: [
                "Sabah uyandı Mert.",
                "Mert sabah uyandı.",
                "Uyandı sabah Mert.",
              ],
              correct: 1,
            },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Atatürk ve Kitap Sevgisi - 12",
      activities: [
        {
          type: "info",
          title: "Atatürk ve Kitap Sevgisi",
          text: "Atatürk için öğrenmek sadece okulda yapılan bir şey değildi. O, hayatı boyunca okumaya ve kendini geliştirmeye önem verdi. Tarih, dil, bilim, toplum, sanat ve dünya olayları gibi pek çok konuda kitaplar okudu. Çünkü iyi kararlar verebilmek için bilgi sahibi olmak gerektiğini düşünürdü.\n\nAtatürk kitap okurken sadece sayfaları çevirmekle kalmazdı. Önemli bulduğu yerlerin altını çizer, kenarlara notlar alır ve okudukları üzerine düşünürdü. Bu, onun kitapları dikkatle okuduğunu ve bilgiyi gerçekten anlamaya çalıştığını gösterir.\n\nKitap sevgisi bize çok önemli bir şey öğretir. İnsan merak etmeye ve öğrenmeye devam ettikçe gelişir. Kitaplar yeni fikirler bulmamıza, farklı hayatları tanımamıza ve dünyayı daha iyi anlamamıza yardım eder. Atatürk’ün kitap sevgisi, öğrenmenin hayat boyu süren bir yolculuk olduğunu anlatır."
        },
        {
          type: "true_false",
          title: "Etkinlik 1: Doğru Yanlış",
          questions: [
            { q: "Atatürk kitap okumayı severdi.", correct: true },
            { q: "Atatürk sadece okul yıllarında kitap okumuştur.", correct: false },
            { q: "Okuduğu kitaplardan notlar alırdı.", correct: true },
            { q: "Kitap okumak düşünmeye yardımcı olabilir.", correct: true },
            { q: "Atatürk öğrenmeye önem verirdi.", correct: true }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            { text: "Atatürk hayatı boyunca {blank} devam etti.", answer: "öğrenmeye", options: ["öğrenmeye", "notlar", "düşünmesine", "önem"] },
            { text: "Okuduğu kitaplardan {blank} alırdı.", answer: "notlar", options: ["öğrenmeye", "notlar", "düşünmesine", "önem"] },
            { text: "Kitaplar insanın {blank} yardım eder.", answer: "düşünmesine", options: ["öğrenmeye", "notlar", "düşünmesine", "önem"] },
            { text: "Atatürk öğrenmeye {blank} verirdi.", answer: "önem", options: ["öğrenmeye", "notlar", "düşünmesine", "önem"] }
          ]
        }
      ],
    },
  },

  "13": {
    okuyorumAnliyorum: {
      title: "Arıların Dansı",
      theme: "Bilgilendirici hayvanlar - Bilgilendirici metin",
      text: "Arılar çiçeklerden nektar toplayarak bal yapar. Bir arı bol çiçekli bir yer bulduğunda bunu diğer arılara haber vermek ister. Çünkü kovandaki arıların birlikte çalışması gerekir. Çiçeklerin yerini bilen arı kovana döner. Kovanın içinde diğer arıların önünde özel bir hareket yapar. Bu harekete sallantı dansı denir. Arı dans ederken vücudunu sallar ve belli bir yönde ilerler. Dansın yönü, çiçeklerin hangi tarafta olduğunu anlatmaya yardım eder. Dansın süresi ve hareketi de çiçeklerin kovana uzaklığı hakkında bilgi verebilir. Diğer arılar bu hareketleri izler ve anlamaya çalışır. Sonra çiçeklerin olduğu yere doğru uçarlar. Böylece arılar konuşmadan birbirlerine bilgi aktarabilir. Bu davranış, doğadaki ilginç iletişim örneklerinden biridir.",
      questions: [
        {
          q: "Arılar çiçeklerden ne toplar?",
          options: ["Nektar", "Kum", "Tuz"],
          correct: 0,
        },
        {
          q: "Arı bol çiçekli yer bulunca nereye döner?",
          options: ["Kovana", "Denize", "Yola"],
          correct: 0,
        },
        {
          q: "Arının yaptığı harekete ne denir?",
          options: ["Sallantı dansı", "Sessiz uyku", "Kanat molası"],
          correct: 0,
        },
        {
          q: "Dansın yönü neyi anlatmaya yardım eder?",
          options: [
            "Çiçeklerin hangi tarafta olduğunu",
            "Arının rengini",
            "Kovanın kaç yaşında olduğunu",
          ],
          correct: 0,
        },
        {
          q: "Dansın süresi ve hareketi ne hakkında bilgi verebilir?",
          options: [
            "Çiçeklerin kovana uzaklığı",
            "Yağmurun rengi",
            "Arının adı",
          ],
          correct: 0,
        },
        {
          q: "Diğer arılar dansı izledikten sonra ne yapar?",
          options: [
            "Çiçeklerin olduğu yere uçar",
            "Kovandan çıkarılmaz",
            "Suda yüzer",
          ],
          correct: 0,
        },
        {
          q: "Arılar bu şekilde ne yapmış olur?",
          options: [
            "Konuşmadan anlaşmış olur",
            "Oyun oynamış olur",
            "Yuvasını boyamış olur",
          ],
          correct: 0,
        },
        {
          q: "Arıların sallantı dansı neden önemlidir?",
          options: [
            "Diğer arılara çiçeklerin yerini anlatmaya yardım eder.",
            "Arıların uyumasını sağlar.",
            "Çiçeklerin rengini değiştirir.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 13: Adlar",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Adlar",
          text: "Çevremizdeki varlıkları, kişileri, yerleri, hayvanları, eşyaları ve duyguları anlatmak için adları kullanırız. Adlara isim de denir.\n\nÖrnek:\nAli bir kişi adıdır.\nKedi bir hayvan adıdır.\nİstanbul bir şehir adıdır.\nTürkiye bir ülke adıdır.\nKalem bir eşya adıdır.\nSevinç bir duygu adıdır.\n\nBazı adlar özel addır. Özel adlar tek bir kişiye, yere ya da hayvana verilen adlardır. İnsan adları, şehir adları, ülke adları ve hayvanlara verilen özel adlar büyük harfle başlar.\n\nÖrnekler:\nAli, Zeynep, İstanbul, Ankara, Türkiye, Pamuk, Karabaş.\n\nBazı adlar ise cins addır. Cins adlar aynı türden birçok varlığı anlatan ortak adlardır. İnsan, şehir, ülke, kedi, köpek, kalem, masa, kitap gibi kelimeler cins addır.\n\nÖrnek:\nPamuk özel addır çünkü bir kedinin adıdır.\nKedi cins addır çünkü bütün kediler için kullanılan ortak addır.\nİstanbul özel addır çünkü bir şehrin adıdır.\nŞehir cins addır çünkü birçok şehir için kullanılan ortak addır."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Hangi Ad Grubu?",
          desc: "Kelimenin hangi gruba ait olduğunu seç.",
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
          desc: "Verilen adların özel ad mı cins ad mı olduğunu seç.",
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
          categories: ["Kişi adları", "Şehir adları", "Ülke adları", "Hayvan adları", "Hayvanlara verilen özel adlar", "Eşya adları"],
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
            { label: "Pamuk", category: "Hayvanlara verilen özel adlar" },
            { label: "Karabaş", category: "Hayvanlara verilen özel adlar" },
            { label: "Tekir", category: "Hayvanlara verilen özel adlar" },
            { label: "kalem", category: "Eşya adları" },
            { label: "masa", category: "Eşya adları" },
            { label: "defter", category: "Eşya adları" }
          ]
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "30 Ağustos: Zafer ve Bağımsızlık - 13",
      activities: [
        {
          type: "info",
          title: "30 Ağustos: Zafer ve Bağımsızlık",
          text: "30 Ağustos, Türkiye’nin bağımsızlık mücadelesinde çok önemli bir gündür. O dönemde insanlar ülkelerinin özgür olmasını istiyordu. Bunun için birlikte çalıştılar, zor zamanlara dayandılar ve büyük bir mücadele verdiler.\n\n30 Ağustos Zafer Bayramı, bu mücadelenin önemli bir başarısını hatırlatır. Zafer sadece savaş kazanmak anlamına gelmez. Aynı zamanda birlikte inanmak, emek vermek, kararlı olmak ve pes etmemek demektir. Bu yüzden 30 Ağustos, birlik duygusunu da anlatır.\n\nBağımsızlık, bir ülkenin kendi kararlarını kendisinin verebilmesi demektir. Bu değer kolay kazanılmamıştır. 30 Ağustos’u öğrenirken sadece bir tarihi değil, insanların vatanları için gösterdikleri dayanışmayı, cesareti ve umudu da öğreniriz."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Tahmin Oyunu",
          desc: "Aşağıdaki ipucunu oku ve doğru seçeneği bul.",
          questions: [
            {
              q: "İpucu: Ben bağımsızlık mücadelesindeki önemli bir başarıyı anlatan bayramım. 30 Ağustos’ta kutlanırım. Birlik, cesaret ve zafer benimle anlatılır. Ben hangi bayramım?",
              options: ["23 Nisan", "30 Ağustos", "29 Ekim"],
              correct: 1
            }
          ]
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          questions: [
            { q: "30 Ağustos Zafer Bayramı’dır.", correct: true },
            { q: "30 Ağustos sadece oyun ve eğlence bayramıdır.", correct: false },
            { q: "Zafer, birlikte çalışmanın ve kararlılığın sonucu olabilir.", correct: true },
            { q: "30 Ağustos bağımsızlık mücadelesiyle bağlantılıdır.", correct: true },
            { q: "Bağımsızlık önemli bir değerdir.", correct: true }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 3: Boşluk Doldurma",
          sentences: [
            { text: "30 Ağustos {blank} Bayramı’dır.", answer: "Zafer", options: ["Zafer", "kararlarını", "kararlılık", "birlik"] },
            { text: "Bağımsızlık, bir ülkenin kendi {blank} kendisinin verebilmesidir.", answer: "kararlarını", options: ["Zafer", "kararlarını", "kararlılık", "birlik"] },
            { text: "Zafer; emek, birlik ve {blank} ile kazanılır.", answer: "kararlılık", options: ["Zafer", "kararlarını", "kararlılık", "birlik"] },
            { text: "30 Ağustos bize {blank} olmanın önemini anlatır.", answer: "birlik", options: ["Zafer", "kararlarını", "kararlılık", "birlik"] }
          ]
        }
      ]
    },
  },

  "14": {
    okuyorumAnliyorum: {
      title: "Kırmızı Cüzdan",
      theme: "Dürüstlük - Hikaye",
      text: "Pelin öğle arasında okul bahçesine çıktı. Arkadaşları oyun alanına koşarken o bahçe kapısının yanında kırmızı çizgili küçük bir cüzdan gördü. Önce bunun bir oyuncak olduğunu sandı. Yaklaşınca içinde bozuk paralar olduğunu fark etti. Pelin etrafına baktı ama cüzdanın sahibini göremedi. Bir an ne yapması gerektiğini düşündü. Cüzdanı cebine koymayı ya da paraları kullanmayı doğru bulmadı. Onu iki eliyle tutup öğretmenler odasına götürdü. Nöbetçi öğretmene cüzdanı nerede bulduğunu anlattı. Öğretmen Pelin’e teşekkür etti ve sahibini bulmak için sınıflara haber verdi. Bir süre sonra cüzdanın sahibi bulundu. Pelin, kendisine ait olmayan bir şeyi doğru yere teslim ettiği için kendini iyi hissetti. Dürüst davranmanın bazen küçük bir seçimle başladığını anladı.",
      questions: [
        {
          q: "Pelin cüzdanı nerede buldu?",
          options: ["Bahçe kapısının yanında", "Kantinde", "Kütüphanede"],
          correct: 0,
        },
        {
          q: "Cüzdan nasıldı?",
          options: [
            "Kırmızı çizgili ve küçüktü",
            "Büyük ve maviydi",
            "Sarı ve boştu",
          ],
          correct: 0,
        },
        {
          q: "Cüzdanın içinde ne vardı?",
          options: ["Bozuk paralar", "Kalemler", "Oyuncaklar"],
          correct: 0,
        },
        {
          q: "Pelin neyi doğru bulmadı?",
          options: [
            "Cüzdanı cebine koymayı ya da paraları kullanmayı",
            "Öğretmenle konuşmayı",
            "Bahçede yürümeyi",
          ],
          correct: 0,
        },
        {
          q: "Pelin cüzdanı kime götürdü?",
          options: ["Nöbetçi öğretmene", "Market görevlisine", "Komşusuna"],
          correct: 0,
        },
        {
          q: "Öğretmen ne yaptı?",
          options: [
            "Sahibinin bulunması için sınıflara haber verdi.",
            "Cüzdanı çöpe attı.",
            "Pelin’e kızdı.",
          ],
          correct: 0,
        },
        {
          q: "Pelin’in davranışı hangi özelliği gösterir?",
          options: ["Dürüstlük", "Kıskançlık", "Dağınıklık"],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Bize ait olmayan eşyaları sahibine ulaştırmalıyız.",
            "Cüzdanlar bahçede saklanmalıdır.",
            "Öğle arasında dışarı çıkılmaz.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 14: Tekil ve Çoğul Adlar",
      activities: [
        {
          type: "info",
          title: "Tekil ve Çoğul Adlar",
          text: "Bir varlığı anlatan adlara tekil ad denir.\nÖrnek:\nkitap, kalem, çocuk, kuş.\n\nBirden fazla varlığı anlatan adlara çoğul ad denir. Çoğul yapmak için kelimelerin sonuna -ler ya da -lar getirilir.\nÖrnek:\nkitaplar, kalemler, çocuklar, kuşlar.\n\nHangi ekin geleceğini kelimenin sesine göre seçeriz. Bazı kelimeler ler alır, bazı kelimeler lar alır.\nÖrnek:\nkedi → kediler\naraba → arabalar\n\nNot: Eğer varlığın kaç tane olduğu belirtilmişse çoğul eki getirilmez.\nÖrnek:\nüç kediler YANLIŞ\nüç kedi DOĞRU\n\nsekiz kurabiyeler YANLIŞ\nsekiz kurabiye DOĞRU",
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Çoğul Yap",
          sentences: [
            { text: "Kedi {blank}", answer: "Kediler", options: ["Kediler", "Arabalar", "Defterler", "Çocuklar", "Kuşlar"] },
            { text: "Araba {blank}", answer: "Arabalar", options: ["Kediler", "Arabalar", "Defterler", "Çocuklar", "Kuşlar"] },
            { text: "Defter {blank}", answer: "Defterler", options: ["Kediler", "Arabalar", "Defterler", "Çocuklar", "Kuşlar"] },
            { text: "Çocuk {blank}", answer: "Çocuklar", options: ["Kediler", "Arabalar", "Defterler", "Çocuklar", "Kuşlar"] },
            { text: "Kuş {blank}", answer: "Kuşlar", options: ["Kediler", "Arabalar", "Defterler", "Çocuklar", "Kuşlar"] }
          ]
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
    ulkemiOgreniyorum: {
      title: "Marmara Bölgesi: Köprüler, Şehirler ve Hareket - 14",
      activities: [
        {
          type: "info",
          title: "Marmara Bölgesi",
          text: "Marmara Bölgesi, Türkiye’nin kuzeybatısında yer alır. İstanbul, Bursa, Edirne, Tekirdağ, Kocaeli, Sakarya, Balıkesir, Bilecik, Yalova, Kırklareli ve Çanakkale gibi şehirler bu bölgede bulunur. Türkiye’nin en kalabalık ve hareketli bölgelerinden biridir.\n\nİstanbul Boğazı, Asya ve Avrupa kıtalarını birbirinden ayırır. Boğaz üzerindeki köprüler ise iki yakayı birbirine bağlar. Bu yüzden İstanbul, iki kıtada toprağı olan özel bir şehirdir. Marmara Denizi de bölgenin ortasında yer alır ve bölgeye adını verir.\n\nMarmara Bölgesi’nde sanayi, ticaret, ulaşım ve tarih önemli yer tutar. İstanbul’daki tarihi camiler, saraylar, kuleler ve müzeler bölgenin geçmişini anlatır. Bursa Osmanlı tarihiyle, Çanakkale ise tarihimizdeki önemli olaylarla anılır. Bu bölge, geçmişle bugünün birlikte yaşadığı hareketli bir alan gibidir.",
          infoImages: [
            {
              src: "/turkce-hazinem/14.bilgi.png",
              label: "Marmara Bölgesi"
            }
          ]
        },
        {
          type: "text_selection",
          title: "Etkinlik 1: Marmara Bilgi Kartlarını Seç",
          desc: "Marmara Bölgesi ile ilgili doğru bilgi kartlarını seç.",
          options: [
            { text: "İstanbul Boğazı bu bölgede yer alır.", isCorrect: true },
            { text: "Marmara Denizi bölgeye adını verir.", isCorrect: true },
            { text: "İstanbul, Asya ve Avrupa kıtaları arasında özel bir konuma sahiptir.", isCorrect: true },
            { text: "Marmara Bölgesi Türkiye’nin en doğusunda yer alır.", isCorrect: false },
            { text: "Bölgede İstanbul, Bursa, Edirne ve Çanakkale gibi şehirler bulunur.", isCorrect: true },
            { text: "Marmara Bölgesi’nin denizle hiçbir bağlantısı yoktur.", isCorrect: false }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            { text: "Marmara Bölgesi Türkiye’nin {blank} yer alır.", answer: "kuzeybatısında", options: ["kuzeybatısında", "Avrupa", "bağlar", "hareketli"] },
            { text: "İstanbul Boğazı Asya ve {blank} kıtalarını ayırır.", answer: "Avrupa", options: ["kuzeybatısında", "Avrupa", "bağlar", "hareketli"] },
            { text: "Köprüler iki yakayı birbirine {blank} .", answer: "bağlar", options: ["kuzeybatısında", "Avrupa", "bağlar", "hareketli"] },
            { text: "Marmara Bölgesi kalabalık ve {blank} bir bölgedir.", answer: "hareketli", options: ["kuzeybatısında", "Avrupa", "bağlar", "hareketli"] }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 3: Tahmin Oyunu",
          desc: "Aşağıdaki ipucunu oku ve doğru seçeneği bul.",
          questions: [
            {
              q: "İpucu: Ben Türkiye’nin kuzeybatısındayım. İstanbul bendedir. Boğazlarım, köprülerim ve kalabalık şehirlerim vardır. Ben hangi bölgeyim?",
              options: ["Marmara Bölgesi", "Doğu Anadolu Bölgesi", "Akdeniz Bölgesi"],
              correct: 0
            }
          ]
        }
      ]
    },
  },

  "15": {
    okuyorumAnliyorum: {
      title: "Ağır Poşetler",
      theme: "Yaşlılara saygı - Hikaye",
      text: "Selim okuldan eve dönerken apartmanın girişinde Nebahat Teyze’yi gördü. Nebahat Teyze üst katta oturuyordu ve iki elinde sebze dolu poşetler vardı. Poşetler ağır olduğu için merdivenleri yavaş çıkıyordu. Bir basamakta durup biraz dinlenmek zorunda kaldı. Selim bu durumu görünce hemen yanına gitti. “İstersen poşetleri taşımana yardım edebilirim,” dedi. Nebahat Teyze önce onu yormak istemediğini söyledi. Selim ise poşetlerin bir kısmını taşıyabileceğini anlattı. Nebahat Teyze gülümseyerek iki poşeti Selim’e verdi. Birlikte acele etmeden üst kata çıktılar. Selim poşetleri kapının önüne bıraktı. Nebahat Teyze ona teşekkür etti ve nazik davranışının çok değerli olduğunu söyledi. Selim, küçük bir yardımın birinin işini kolaylaştırabileceğini anladı.",
      questions: [
        {
          q: "Selim apartmanda kimi gördü?",
          options: ["Nebahat Teyze’yi", "Öğretmenini", "Arkadaşını"],
          correct: 0,
        },
        {
          q: "Nebahat Teyze’nin elinde ne vardı?",
          options: ["Sebze dolu poşetler", "Oyuncaklar", "Kitaplar"],
          correct: 0,
        },
        {
          q: "Nebahat Teyze merdivenleri neden yavaş çıkıyordu?",
          options: [
            "Poşetler ağır olduğu için",
            "Merdiven yoktu",
            "Selim onu durdurduğu için",
          ],
          correct: 0,
        },
        {
          q: "Selim ne teklif etti?",
          options: ["Yardım etmeyi", "Oyun oynamayı", "Şarkı söylemeyi"],
          correct: 0,
        },
        {
          q: "Nebahat Teyze önce neden tereddüt etti?",
          options: [
            "Selim’i yormak istemediği için",
            "Poşetler boş olduğu için",
            "Eve gitmek istemediği için",
          ],
          correct: 0,
        },
        {
          q: "Selim poşetleri nereye bıraktı?",
          options: ["Kapının önüne", "Bahçeye", "Çöpe"],
          correct: 0,
        },
        {
          q: "Nebahat Teyze nasıl karşılık verdi?",
          options: ["Teşekkür etti", "Kızdı", "Uzaklaştı"],
          correct: 0,
        },
        {
          q: "Bu metinden hangi sonuç çıkarılır?",
          options: [
            "Yaşlılara nazikçe yardım etmek güzel bir davranıştır.",
            "Ağır poşetleri yere bırakmalıyız.",
            "Apartmanda kimseyle konuşmamalıyız.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 15: Ön Adlar-Sıfatlar",
      activities: [
        {
          type: "info",
          title: "Ön Adlar-Sıfatlar",
          text: "Bazı kelimeler isimlerin önüne gelir ve onların nasıl olduğunu anlatır. Bu kelimelere ön ad (sıfat) denir.\n\nÖn adlar bize renk, şekil, boyut ya da başka özellikler söyleyebilir.\nÖrnekler:\nkırmızı çanta\nyuvarlak masa\nbüyük kutu\ntemiz oda\n\nBurada kırmızı, yuvarlak, büyük ve temiz kelimeleri ön addır. Çünkü kendilerinden sonra gelen ismin özelliğini anlatırlar.\n\nBir ön adı bulmak için isme “Nasıl?” sorusunu sorabiliriz.\nNasıl çanta? Kırmızı çanta.\nNasıl masa? Yuvarlak masa."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Ön Adı Bul",
          sentences: [
            { text: "Kırmızı çanta {blank}", answer: "Kırmızı", options: ["Kırmızı", "Yuvarlak", "Temiz", "Büyük", "Mavi"] },
            { text: "Yuvarlak masa {blank}", answer: "Yuvarlak", options: ["Kırmızı", "Yuvarlak", "Temiz", "Büyük", "Mavi"] },
            { text: "Temiz oda {blank}", answer: "Temiz", options: ["Kırmızı", "Yuvarlak", "Temiz", "Büyük", "Mavi"] },
            { text: "Büyük kutu {blank}", answer: "Büyük", options: ["Kırmızı", "Yuvarlak", "Temiz", "Büyük", "Mavi"] },
            { text: "Mavi kalem {blank}", answer: "Mavi", options: ["Kırmızı", "Yuvarlak", "Temiz", "Büyük", "Mavi"] }
          ]
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
    ulkemiOgreniyorum: {
      title: "Sandık 15: Türkiye’nin Sofrası: Lezzetler ve Misafirlik",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı",
          image: "/turkce-hazinem/15.bilgi.png",
          text: "Türkiye’de yemek sadece karın doyurmak değildir. Sofra, insanların bir araya geldiği, sohbet ettiği ve paylaşmayı öğrendiği özel bir yerdir. Aile yemekleri, bayram sofraları ve misafirlikler kültürümüzde önemli yer tutar.\n\nBazı yiyecekler günlük hayatın parçasıdır. Simit ve çay birçok insan için tanıdık bir ikilidir. Mantı küçük hamur parçalarının iç malzemeyle hazırlanmasıyla yapılır ve genellikle yoğurtla servis edilir. Dolma, sebzelerin ya da yaprakların iç harçla doldurulmasıyla hazırlanır. Baklava ise bayramlarda ve özel günlerde sıkça görülen tatlılardan biridir.\n\nTürk kahvesi de kültürümüzde özel bir yere sahiptir. Küçük fincanlarda sunulur ve yanında lokum ya da su verilebilir. Misafir geldiğinde ona bir şey ikram etmek, sevgi ve saygı göstermenin yollarından biridir. Bu yüzden sofra kültürü bize paylaşmayı, birlikte olmayı ve misafirperverliği öğretir."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Yiyeceği veya içeceği doğru görselle eşleştir.",
          questions: [
            { 
              q: "Aşağıdakilerden hangisi Simit'tir?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.simit.png" }, 
                { src: "/turkce-hazinem/15.cay.png" }, 
                { src: "/turkce-hazinem/15.baklava.png" }
              ], 
              correct: 0 
            },
            { 
              q: "Aşağıdakilerden hangisi Çay'dır?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.baklava.png" }, 
                { src: "/turkce-hazinem/15.cay.png" }, 
                { src: "/turkce-hazinem/15.kahve.png" }
              ], 
              correct: 1 
            },
            { 
              q: "Aşağıdakilerden hangisi Baklava'dır?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.simit.png" }, 
                { src: "/turkce-hazinem/15.dolma.png" }, 
                { src: "/turkce-hazinem/15.baklava.png" }
              ], 
              correct: 2 
            },
            { 
              q: "Aşağıdakilerden hangisi Türk kahvesidir?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.kahve.png" }, 
                { src: "/turkce-hazinem/15.cay.png" }, 
                { src: "/turkce-hazinem/15.bilgi.png" }
              ], 
              correct: 0 
            },
            { 
              q: "Aşağıdakilerden hangisi Dolma'dır?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.dolma.png" }, 
                { src: "/turkce-hazinem/15.baklava.png" }, 
                { src: "/turkce-hazinem/15.simit.png" }
              ], 
              correct: 0 
            }
          ] },
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
    }
  },

  "16": {
    okuyorumAnliyorum: {
      title: "Yaprakların Renk Değişimi",
      theme: "Bilgilendirici doğa - Bilgilendirici metin",
      text: "Sonbahar geldiğinde ağaçların yaprakları renk değiştirmeye başlar. Yazın yeşil olan yapraklar sarı, turuncu, kırmızı ve kahverengi tonlarına dönebilir. Bu değişim doğada sık gördüğümüz ama çoğu zaman nedenini düşünmediğimiz bir olaydır. Yaprakların yeşil görünmesini sağlayan özel bir madde vardır. Havalar serinleyip günler kısaldığında ağaçlar besin üretmeyi yavaşlatır. Bu sırada yapraklardaki yeşil madde azalır. Yeşil renk azalınca yaprağın içindeki sarı ve turuncu tonlar daha belirgin görünür. Daha sonra bazı ağaçlar yapraklarını döker. Bu durum ağacın kışa hazırlanmasına yardım eder. Yere düşen yapraklar zamanla parçalanıp toprağa karışabilir. Böylece doğada bir döngü oluşur. İlkbahar geldiğinde ağaçlar yeniden tomurcuklanır ve yeşil yapraklar çıkarır. Sonbahardaki renk değişimi, doğanın mevsimlere uyum sağlama yollarından biridir.",
      questions: [
        {
          q: "Yapraklar en çok hangi mevsimde renk değiştirir?",
          options: ["Sonbahar", "Yaz", "Kış"],
          correct: 0,
        },
        {
          q: "Yapraklar hangi renklere dönebilir?",
          options: [
            "Sarı, turuncu, kırmızı ve kahverengi",
            "Mavi ve mor",
            "Siyah ve beyaz",
          ],
          correct: 0,
        },
        {
          q: "Renk değişiminin nedenlerinden biri nedir?",
          options: [
            "Günlerin kısalması ve havaların serinlemesi",
            "Denizlerin kabarması",
            "Kuşların ötmesi",
          ],
          correct: 0,
        },
        {
          q: "Ağaçlar bu dönemde neyi yavaşlatır?",
          options: [
            "Besin üretmeyi",
            "Köklerini büyütmeyi tamamen",
            "Yağmur yağdırmayı",
          ],
          correct: 0,
        },
        {
          q: "Yeşil madde azalınca ne olur?",
          options: [
            "Sarı ve turuncu tonlar daha belirgin görünür.",
            "Yapraklar mavi olur.",
            "Ağaçlar uçar.",
          ],
          correct: 0,
        },
        {
          q: "Bazı ağaçlar kışa hazırlanırken ne yapar?",
          options: ["Yapraklarını döker", "Çiçek açar", "Meyve toplar"],
          correct: 0,
        },
        {
          q: "Yere düşen yapraklar zamanla ne olabilir?",
          options: ["Toprağa karışabilir", "Taşa dönüşür", "Güneşe çıkar"],
          correct: 0,
        },
        {
          q: "Bu metnin ana konusu nedir?",
          options: [
            "Yaprakların sonbaharda neden renk değiştirdiği",
            "Kuşların nasıl uçtuğu",
            "Çocukların parkta oynadığı",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 16: Eylemler",
      activities: [
        {
          type: "info",
          title: "Eylemler",
          text: "Cümlede yapılan işi, hareketi ya da durumu anlatan kelimelere eylem denir.\nÖrnek:\nAli koştu.\nBu cümlede koştu kelimesi eylemdir. Çünkü Ali’nin ne yaptığını anlatır.\n\nZeynep güldü.\nBurada güldü eylemdir.\n\nKedi uyuyor.\nBurada uyuyor eylemdir.\n\nBir kelimenin eylem olup olmadığını anlamak için ona “Ne yaptı?” ya da “Ne yapıyor?” sorularını sorabiliriz."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Eylemi Bul",
          sentences: [
            { text: "Ali koştu. {blank}", answer: "koştu", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] },
            { text: "Kedi uyuyor. {blank}", answer: "uyuyor", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] },
            { text: "Elif kitap okudu. {blank}", answer: "okudu", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] },
            { text: "Kuş uçuyor. {blank}", answer: "uçuyor", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] },
            { text: "Annem yemek yaptı. {blank}", answer: "yaptı", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] }
          ]
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
      ],
    },
    ulkemiOgreniyorum: {
      title: "Sandık 16: Ege Bölgesi: Zeytin, Deniz ve Antik Kentler",
      activities: [
        {
          type: "info",
          title: "Ege Bölgesi",
          image: "/turkce-hazinem/16.bilgi.png",
          text: "Ege Bölgesi, Türkiye’nin batısında yer alır. Bu bölge, Ege Denizi kıyıları boyunca uzanır. Kıyıları girintili çıkıntılıdır. Bu nedenle bölgede birçok koy, körfez ve liman bulunur. Denizle iç içe olan bu yapı, Ege’nin doğasını ve yaşam tarzını etkiler.\n\nEge Bölgesi’nde zeytin, üzüm ve incir çok önemli ürünlerdir. Zeytin ağaçları bölgenin simgelerinden biridir. Üzüm bağları ve incir bahçeleri de Ege’nin tarım kültüründe yer tutar. Yazları sıcak ve kurak, kışları daha ılık ve yağışlı geçen iklim bu ürünlerin yetişmesine yardımcı olur.\n\nEge sadece denizi ve tarımıyla değil, tarihiyle de tanınır. Efes ve Bergama gibi antik kentler bu bölgede yer alır. Bu antik kentlerde çok eski dönemlerden kalan tiyatrolar, yollar, tapınaklar ve taş yapılar görülebilir. Bu yüzden Ege Bölgesi hem doğa hem tarım hem tarih açısından zengin bir bölgedir."
        },
        {
          type: "image_selection",
          title: "Etkinlik 1: Bölge ile Ürün Eşleştir",
          desc: "Ege Bölgesi ile ilgili ürünleri seç.",
          images: [
            { src: "/turkce-hazinem/16.zeytin.png", label: "Zeytin", isCorrect: true },
            { src: "/turkce-hazinem/16.incir.png", label: "İncir", isCorrect: true },
            { src: "/turkce-hazinem/16.cay.png", label: "Çay", isCorrect: false },
            { src: "/turkce-hazinem/16.muz.png", label: "Muz", isCorrect: false },
            { src: "/turkce-hazinem/16.findik.png", label: "Fındık", isCorrect: false }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Tahmin Oyunu",
          questions: [
            {
              q: "İpucu: Ben Türkiye’nin batısındayım. Kıyılarımda çok sayıda koy vardır. Zeytin, incir ve üzümle tanınırım. Efes ve Bergama benim bölgemdedir. Ben hangi bölgeyim?",
              options: ["Ege Bölgesi", "Karadeniz Bölgesi", "Doğu Anadolu Bölgesi"],
              correct: 0
            }
          ]
        }
      ]
    }
  },

  "17": {
    okuyorumAnliyorum: {
      title: "Islak Patiler",
      theme: "Hayvan sevgisi - Hikaye",
      text: "Dışarıda sabah boyunca yağmur yağmıştı. Nil pencereden sokaktaki su birikintilerine bakıyordu. İnsanlar şemsiyeleriyle hızlı hızlı yürüyordu. Birden kapının önünden ince bir miyavlama sesi duydu. Nil annesine seslendi ve birlikte kapıyı açtılar. Köşede, tüyleri ıslanmış küçük bir kedi duruyordu. Patileri çamurluydu ve üşümüş görünüyordu. Nil kediyi hemen içeri almak istedi ama annesi önce sakin ve dikkatli olmaları gerektiğini söyledi. Nil kilerden boş bir karton kutu getirdi. Annesi kutunun içine eski ama temiz bir kazak serdi. Kutuyu rüzgar almayan kapı girişine koydular. Sonra kediyi yavaşça kutunun yanına yönlendirdiler. Kedi kutuya girip kazağın üzerine kıvrıldı. Nil, hayvanlara yardım ederken hem şefkatli hem de dikkatli olmak gerektiğini öğrendi.",
      questions: [
        {
          q: "Dışarıda ne yağıyordu?",
          options: ["Yağmur", "Kar", "Dolu"],
          correct: 0,
        },
        {
          q: "Nil ne duydu?",
          options: ["Miyavlama sesi", "Zil sesi", "Davul sesi"],
          correct: 0,
        },
        {
          q: "Kapının önünde hangi hayvan vardı?",
          options: ["Kedi", "Kuş", "Tavşan"],
          correct: 0,
        },
        {
          q: "Kedinin tüyleri nasıldı?",
          options: ["Islanmıştı", "Boyanmıştı", "Taralıydı"],
          correct: 0,
        },
        {
          q: "Annesi neden dikkatli olmaları gerektiğini söyledi?",
          options: [
            "Hayvana yardım ederken sakin ve dikkatli olmak gerektiği için",
            "Kedi oyuncak olduğu için",
            "Yağmur hemen biteceği için",
          ],
          correct: 0,
        },
        {
          q: "Nil ne getirdi?",
          options: ["Karton kutu", "Çiçek saksısı", "Oyuncak sepeti"],
          correct: 0,
        },
        {
          q: "Kutuyu nereye koydular?",
          options: [
            "Rüzgar almayan kapı girişine",
            "Yağmurun altına",
            "Bahçenin ortasına",
          ],
          correct: 0,
        },
        {
          q: "Bu metindeki davranış hangi değeri gösterir?",
          options: [
            "Hayvanlara karşı duyarlı olmayı",
            "Eşyaları saklamayı",
            "Yağmurda koşmayı",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 17: Zamanı Anlıyorum",
      activities: [
        {
          type: "info",
          title: "Zamanı Anlıyorum",
          text: "Eylemler bize işin ne zaman yapıldığını da gösterebilir.\n\nGeçmiş zaman, işin daha önce yapıldığını anlatır.\nÖrnek:\nAli okula gitti.\n\nŞimdiki zaman, işin şimdi yapıldığını anlatır.\nÖrnek:\nAli okula gidiyor.\n\nGelecek zaman, işin daha sonra yapılacağını anlatır.\nÖrnek:\nAli okula gidecek.\n\nCümledeki eyleme bakarak zaman hakkında bilgi edinebiliriz."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Eylemi Bul",
          sentences: [
            { text: "Ali koştu. {blank}", answer: "koştu", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] },
            { text: "Kedi uyuyor. {blank}", answer: "uyuyor", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] },
            { text: "Elif kitap okudu. {blank}", answer: "okudu", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] },
            { text: "Kuş uçuyor. {blank}", answer: "uçuyor", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] },
            { text: "Annem yemek yaptı. {blank}", answer: "yaptı", options: ["koştu", "uyuyor", "okudu", "uçuyor", "yaptı"] }
          ]
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
    ulkemiOgreniyorum: {
      title: "Sandık 17: Çocuk Oyunları ve Gelenekler",
      activities: [
        {
          type: "info",
          title: "Çocuk Oyunları ve Gelenekler",
          text: "Çocuk oyunları, kültürün en eğlenceli parçalarından biridir. Saklambaç, seksek, mendil kapmaca, körebe ve yağ satarım bal satarım gibi oyunlar uzun yıllardır çocuklar tarafından oynanır. Bu oyunlar bazen sokakta, bazen okul bahçesinde, bazen de aile toplantılarında oynanabilir.\n\nSaklambaçta bir kişi ebe olur, diğerleri saklanır. Ebe saklanan arkadaşlarını bulmaya çalışır. Seksekte yere çizilen kutular üzerinde tek ayakla zıplanır. Mendil kapmacada iki grup karşılıklı durur ve ortadaki mendili hızlıca kapmaya çalışır. Körebede gözleri kapalı olan ebe, sesleri ve hareketleri takip ederek arkadaşlarını bulmaya çalışır.\n\nGelenekler de kültürümüzü yaşatır. Bayramlarda aileler bir araya gelir, büyüklerin elleri öpülür, çocuklara şeker ya da harçlık verilir. Nazar boncuğu, kına gecesi, bayramlaşma ve misafirlik gibi gelenekler insanların birbirini hatırlamasını sağlar. Oyunlar ve gelenekler bize birlikte eğlenmeyi, saygıyı ve paylaşmayı öğretir."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Oyunu veya geleneği doğru açıklamayla eşleştir.",
          questions: [
            {
              q: "Saklambaç nedir?",
              options: [
                "Kareler üzerinde zıplayarak oynanan oyun",
                "Bayramda insanların birbirini ziyaret etmesi",
                "Bir kişinin saklanıp diğerinin aradığı oyun",
                "Koşarak mendili alma oyunu"
              ],
              correct: 2
            },
            {
              q: "Seksek nedir?",
              options: [
                "Kareler üzerinde zıplayarak oynanan oyun",
                "Bayramda insanların birbirini ziyaret etmesi",
                "Bir kişinin saklanıp diğerinin aradığı oyun",
                "Koşarak mendili alma oyunu"
              ],
              correct: 0
            },
            {
              q: "Bayramlaşma nedir?",
              options: [
                "Kareler üzerinde zıplayarak oynanan oyun",
                "Bayramda insanların birbirini ziyaret etmesi",
                "Bir kişinin saklanıp diğerinin aradığı oyun",
                "Koşarak mendili alma oyunu"
              ],
              correct: 1
            },
            {
              q: "Mendil kapmaca nedir?",
              options: [
                "Kareler üzerinde zıplayarak oynanan oyun",
                "Bayramda insanların birbirini ziyaret etmesi",
                "Bir kişinin saklanıp diğerinin aradığı oyun",
                "Koşarak mendili alma oyunu"
              ],
              correct: 3
            }
          ]
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          questions: [
            { q: "Saklambaçta saklanan kişiler bulunmaya çalışılır.", correct: true },
            { q: "Seksek yere çizilen kutular üzerinde oynanabilir.", correct: true },
            { q: "Bayramlaşma kültürümüzde yer alan bir gelenektir.", correct: true },
            { q: "Mendil kapmaca sadece kitap okuyarak oynanır.", correct: false },
            { q: "Oyunlar çocukların birlikte eğlenmesine yardım eder.", correct: true }
          ]
        }
      ]
    }
  },

  "18": {
    okuyorumAnliyorum: {
      title: "Yeşil Takım",
      theme: "Çevre bilinci - Hikaye",
      text: "Mert ve arkadaşları pazar günü göl kenarında piknik yaptı. Oyunları bittikten sonra çevrede bazı plastik şişeler, kağıtlar ve boş kaplar gördüler. Çöpler çimlerin üzerinde duruyordu. Göl kenarı güzel görünse de bu çöpler çevreyi kirletiyordu. Mert, “Bu alanı temiz bırakmalıyız,” dedi. Arkadaşları da ona katıldı. Çocuklar temizlik yapmadan önce çantalarından eldivenlerini çıkardı. Plastik şişeleri, kağıtları ve boş kapları ayrı ayrı topladılar. Topladıkları çöpleri farklı torbalara koydular. Sonra geri dönüşüm kutularının olduğu yere gittiler. Şişeleri plastik kutusuna, kağıtları kağıt kutusuna attılar. Boş kapları da uygun kutuya yerleştirdiler. İşleri bitince göl kenarı yeniden temiz görünmeye başladı. Çocuklar, doğayı korumanın sadece konuşmakla değil, doğru davranışlarla mümkün olduğunu anladı.",
      questions: [
        {
          q: "Çocuklar nerede piknik yaptı?",
          options: ["Göl kenarında", "Sınıfta", "Otobüste"],
          correct: 0,
        },
        {
          q: "Çevrede ne gördüler?",
          options: [
            "Plastik şişeler, kağıtlar ve boş kaplar",
            "Yeni oyuncaklar",
            "Çiçek tohumları",
          ],
          correct: 0,
        },
        {
          q: "Mert ne söyledi?",
          options: [
            "Alanı temiz bırakmalıyız.",
            "Çöpleri saklayalım.",
            "Eve gitmeyelim.",
          ],
          correct: 0,
        },
        {
          q: "Çocuklar temizlikten önce ne taktı?",
          options: ["Eldiven", "Gözlük", "Şapka"],
          correct: 0,
        },
        {
          q: "Çöpleri nasıl topladılar?",
          options: [
            "Ayrı ayrı toplayıp farklı torbalara koydular.",
            "Çimlerin üstüne bıraktılar.",
            "Suya attılar.",
          ],
          correct: 0,
        },
        {
          q: "Şişeleri nereye attılar?",
          options: ["Plastik kutusuna", "Kağıt kutusuna", "Toprağa"],
          correct: 0,
        },
        {
          q: "Kağıtları nereye attılar?",
          options: ["Kağıt kutusuna", "Oyuncak kutusuna", "Lavaboya"],
          correct: 0,
        },
        {
          q: "Bu metnin ana fikri nedir?",
          options: [
            "Çevremizi temiz tutmalı ve geri dönüşüme dikkat etmeliyiz.",
            "Piknikte hiç oyun oynanmamalıdır.",
            "Çöpler çimlerde kalabilir.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 18: Varlık Tanımlama",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik: Hangisi Bu Varlığı Tanımlamaz?",
          desc: "Verilen varlığı anlatmayan kelimeyi seç.",
          questions: [
            { q: "Elma", options: ["kırmızı", "yuvarlak", "keskin"], correct: 2 },
            { q: "Pamuk", options: ["yumuşak", "gürültülü", "beyaz"], correct: 1 },
            { q: "Deniz", options: ["dalgalı", "tuzlu", "köşeli"], correct: 2 },
            { q: "Kalem", options: ["yazan", "uzun", "uykulu"], correct: 2 },
            { q: "Kedi", options: ["tüylü", "kanatlı", "miyavlayan"], correct: 1 },
            { q: "Limon", options: ["ekşi", "sarı", "konuşkan"], correct: 2 },
            { q: "Masa", options: ["konuşkan", "sert", "düz"], correct: 0 },
            { q: "Çanta", options: ["taşınabilir", "koklayan", "eşya koyulan"], correct: 1 }
          ]
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Sandık 18: Atatürk’ün Karakteri: Planlı, Cesur ve Kararlı",
      activities: [
        {
          type: "info",
          title: "Atatürk’ün Karakteri: Planlı, Cesur ve Kararlı",
          text: "Atatürk’ün en önemli özelliklerinden biri planlı çalışmasıydı. Bir işe başlamadan önce düşünür, araştırır ve ne yapması gerektiğini belirlemeye çalışırdı. Planlı olmak, zamanı ve enerjiyi doğru kullanmaya yardım eder. Bu özellik hem okul hayatında hem de büyük sorumluluklarda çok önemlidir.\n\nAtatürk’ün bir diğer önemli özelliği cesaretidir. Cesaret, hiç korkmamak anlamına gelmez. Bazen insan zor bir durumla karşılaşır ama doğru olduğuna inandığı şey için çalışmaya devam eder. Atatürk, zor zamanlarda sorumluluk almaktan kaçınmayan bir liderdi.\n\nKararlılık da onun kişiliğinde önemli bir yere sahipti. Kararlı olmak, hedefinden kolayca vazgeçmemektir. Atatürk ülkesinin gelişmesi, eğitimin yaygınlaşması ve Cumhuriyetin güçlenmesi için çalıştı. Planlılık, cesaret ve kararlılık onun liderliğini anlamamıza yardımcı olan üç önemli özelliktir."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Özelliği doğru açıklamayla eşleştir.",
          questions: [
            {
              q: "Planlı olmak",
              options: [
                "Zor zamanlarda doğru bildiği şey için çalışmak",
                "Yapılacak işleri önceden düşünmek",
                "Bir görevi önemseyip yerine getirmek",
                "Hedefinden kolayca vazgeçmemek"
              ],
              correct: 1
            },
            {
              q: "Cesaret",
              options: [
                "Zor zamanlarda doğru bildiği şey için çalışmak",
                "Yapılacak işleri önceden düşünmek",
                "Bir görevi önemseyip yerine getirmek",
                "Hedefinden kolayca vazgeçmemek"
              ],
              correct: 0
            },
            {
              q: "Kararlılık",
              options: [
                "Zor zamanlarda doğru bildiği şey için çalışmak",
                "Yapılacak işleri önceden düşünmek",
                "Bir görevi önemseyip yerine getirmek",
                "Hedefinden kolayca vazgeçmemek"
              ],
              correct: 3
            },
            {
              q: "Sorumluluk",
              options: [
                "Zor zamanlarda doğru bildiği şey için çalışmak",
                "Yapılacak işleri önceden düşünmek",
                "Bir görevi önemseyip yerine getirmek",
                "Hedefinden kolayca vazgeçmemek"
              ],
              correct: 2
            }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            { text: "Planlı olmak, yapılacak işleri önceden {blank} demektir.", answer: "düşünmek", options: ["düşünmek", "yapmaya", "vazgeçmemek", "önemseyerek"] },
            { text: "Cesaret, zor durumda bile doğru olanı {blank} çalışmaktır.", answer: "yapmaya", options: ["düşünmek", "yapmaya", "vazgeçmemek", "önemseyerek"] },
            { text: "Kararlılık, hedefinden kolayca {blank} demektir.", answer: "vazgeçmemek", options: ["düşünmek", "yapmaya", "vazgeçmemek", "önemseyerek"] },
            { text: "Sorumluluk, bir görevi {blank} yerine getirmektir.", answer: "önemseyerek", options: ["düşünmek", "yapmaya", "vazgeçmemek", "önemseyerek"] }
          ]
        }
      ]
    }
  },

  "19": {
    okuyorumAnliyorum: {
      title: "Dünyanın Hava Kalkanı",
      theme: "Bilgilendirici dünya ve uzay - Bilgilendirici metin",
      text: "Dünya, uzaydan bakıldığında mavi görünen bir gezegendir. Bunun nedeni Dünya’da geniş okyanusların bulunmasıdır. Dünya’nın etrafında atmosfer adı verilen bir hava tabakası vardır. Atmosfer gözle görülmez ama yaşam için çok önemlidir. İçindeki hava sayesinde insanlar, hayvanlar ve bitkiler nefes alabilir. Atmosfer yalnızca nefes almak için gerekli değildir. Aynı zamanda Güneş’ten gelen zararlı ışınların bir kısmını engeller. Dünya’nın çok fazla ısınıp çok fazla soğumasını azaltmaya da yardımcı olur. Hava, rüzgar, bulut ve yağmur gibi olaylar atmosferde gerçekleşir. Atmosfer olmasaydı canlıların yaşaması çok zor olurdu. Bu yüzden atmosfer Dünya’nın koruyucu hava kalkanı gibi düşünülebilir. Ancak bu hava tabakasını temiz tutmak da önemlidir. Havayı kirleten dumanlar ve zararlı gazlar doğaya zarar verebilir. Atmosferi korumak için temiz enerji kullanmak, ağaçları korumak ve havayı kirletmemek gerekir.",
      questions: [
        {
          q: "Dünya uzaydan bakıldığında nasıl görünür?",
          options: ["Mavi", "Siyah", "Mor"],
          correct: 0,
        },
        {
          q: "Dünya’nın etrafındaki hava tabakasına ne denir?",
          options: ["Atmosfer", "Okyanus", "Ada"],
          correct: 0,
        },
        {
          q: "Atmosfer neden önemlidir?",
          options: [
            "Canlıların nefes almasına yardım eder.",
            "Oyuncakları büyütür.",
            "Denizleri kurutur.",
          ],
          correct: 0,
        },
        {
          q: "Atmosfer Güneş’ten gelen neyin bir kısmını engeller?",
          options: ["Zararlı ışınların", "Balıkların", "Toprakların"],
          correct: 0,
        },
        {
          q: "Atmosfer neye yardımcı olur?",
          options: [
            "Dünya’nın aşırı ısınıp soğumasını azaltmaya",
            "Geceyi yok etmeye",
            "Dağları taşımaya",
          ],
          correct: 0,
        },
        {
          q: "Hava, rüzgar, bulut ve yağmur nerede gerçekleşir?",
          options: ["Atmosferde", "Kitaplıkta", "Yer altında"],
          correct: 0,
        },
        {
          q: "Atmosferi korumak için ne yapabiliriz?",
          options: [
            "Havayı kirletmemeye dikkat edebiliriz.",
            "Çöpleri yakabiliriz.",
            "Ağaçları kesebiliriz.",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Atmosfer Dünya’daki yaşam için çok önemlidir ve korunmalıdır.",
            "Dünya’da hiç hava yoktur.",
            "Güneş yalnızca geceleri görünür.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 19: Eklerle Yeni Kelimeler",
      activities: [
        {
          type: "info",
          title: "Eklerle Yeni Kelimeler",
          text: "Bazı kelimelerin sonuna ekler getirerek yeni kelimeler yapabiliriz.\nÖrnek:\nkitap → kitaplık\nKitaplık, kitapların konulduğu yerdir.\n\nçiçek → çiçekçi\nÇiçekçi, çiçek satan kişidir.\n\nşeker → şekerli\nŞekerli, içinde şeker olan demektir.\n\nşeker → şekersiz\nŞekersiz, içinde şeker olmayan demektir.\n\nBu ekler kelimenin anlamını değiştirir ve yeni bir kelime oluşturur."
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
            { text: "Kalemlik {blank}", answer: "Kalem konulan kutu", options: ["Kalem konulan kutu", "Kitap satan kişi", "İçinde şeker olmayan", "Tuz koyulan kap", "Balık tutan ya da satan kişi"] },
            { text: "Kitapçı {blank}", answer: "Kitap satan kişi", options: ["Kalem konulan kutu", "Kitap satan kişi", "İçinde şeker olmayan", "Tuz koyulan kap", "Balık tutan ya da satan kişi"] },
            { text: "Şekersiz {blank}", answer: "İçinde şeker olmayan", options: ["Kalem konulan kutu", "Kitap satan kişi", "İçinde şeker olmayan", "Tuz koyulan kap", "Balık tutan ya da satan kişi"] },
            { text: "Tuzluk {blank}", answer: "Tuz koyulan kap", options: ["Kalem konulan kutu", "Kitap satan kişi", "İçinde şeker olmayan", "Tuz koyulan kap", "Balık tutan ya da satan kişi"] },
            { text: "Balıkçı {blank}", answer: "Balık tutan ya da satan kişi", options: ["Kalem konulan kutu", "Kitap satan kişi", "İçinde şeker olmayan", "Tuz koyulan kap", "Balık tutan ya da satan kişi"] }
          ]
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
    },
    ulkemiOgreniyorum: {
      title: "Sandık 19: Akdeniz Bölgesi: Güneş, Turunçgiller ve Şelaleler",
      activities: [
        {
          type: "info",
          title: "Akdeniz Bölgesi",
          image: "/turkce-hazinem/19.bilgi.png",
          text: "Akdeniz Bölgesi, Türkiye’nin güneyinde yer alır. Bu bölge uzun kıyıları, sıcak havası, güneşli günleri ve deniz turizmiyle tanınır. Antalya, Mersin, Adana, Hatay, Burdur, Isparta, Osmaniye ve Kahramanmaraş’ın bazı bölümleri Akdeniz Bölgesi ile bağlantılıdır.\n\nAkdeniz ikliminde yazlar sıcak ve kurak, kışlar daha ılık ve yağışlı geçer. Bu yüzden portakal, limon, mandalina ve greyfurt gibi turunçgiller burada yetişebilir. Muz da Türkiye’de daha çok Akdeniz kıyılarındaki sıcak alanlarda yetişir. Seracılık da bu bölgede gelişmiştir, çünkü ılık hava bitki yetiştirmeyi kolaylaştırır.\n\nBölgenin arkasında Toros Dağları uzanır. Bu dağlar kıyı ile iç kesimler arasında doğal bir sınır gibi durur. Akdeniz Bölgesi’nde Düden ve Manavgat gibi şelaleler, mağaralar, plajlar ve tarihi yerler bulunur. Bu yüzden Akdeniz hem tarım hem doğa hem de turizm açısından önemli bir bölgedir."
        },
        {
          type: "text_selection",
          title: "Etkinlik 1: Bölge ile Ürün Eşleştir",
          desc: "Akdeniz Bölgesi ile ilgili ürünleri seç.",
          options: [
            { text: "Portakal", isCorrect: true },
            { text: "Limon", isCorrect: true },
            { text: "Mandalina", isCorrect: true },
            { text: "Muz", isCorrect: true },
            { text: "Çay", isCorrect: false },
            { text: "Buğday", isCorrect: false }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Tahmin Oyunu",
          questions: [
            {
              q: "İpucu: Ben Türkiye’nin güneyindeyim. Yazlarım sıcak ve kuraktır. Portakal, limon ve mandalina bahçelerim vardır. Antalya benim önemli şehirlerimdendir. Ben hangi bölgeyim?",
              options: ["Akdeniz Bölgesi", "İç Anadolu Bölgesi", "Karadeniz Bölgesi"],
              correct: 0
            }
          ]
        },
        {
          type: "true_false",
          title: "Etkinlik 3: Doğru Yanlış",
          questions: [
            { q: "Akdeniz Bölgesi Türkiye’nin güneyindedir.", correct: true },
            { q: "Akdeniz Bölgesi turunçgillerle tanınır.", correct: true },
            { q: "Toros Dağları Akdeniz Bölgesi ile bağlantılıdır.", correct: true },
            { q: "Akdeniz Bölgesi’nde yazlar genellikle soğuk ve karlıdır.", correct: false },
            { q: "Antalya Akdeniz Bölgesi’nin önemli şehirlerindendir.", correct: true }
          ]
        }
      ]
    }
  },

  "20": {
    okuyorumAnliyorum: {
      title: "Odamı Topluyorum",
      theme: "Sorumluluk - Hikaye",
      text: "Murat okuldan sonra odasında uzun süre oyun oynadı. Arkadaşı eve gidince odasına baktı. Legolar masanın üstünde, arabalar yatağın altında, kartlar halının üzerinde duruyordu. Ayrıca kirli çorapları kapının yanında unutulmuştu. Murat önce odasının çok karışık olduğunu fark etti. Bir an nereden başlayacağını bilemedi. Sonra eşyaları gruplara ayırmaya karar verdi. Legoları mavi kutuya topladı. Arabaları kitaplığın alt rafına dizdi. Kartları küçük kutusuna yerleştirdi. Kirli çoraplarını çamaşır sepetine attı. Çalışma masasının üzerindeki kalemleri de kalemliğe koydu. Son olarak halının üstünü kontrol etti. Oda düzenlenince Murat daha rahat hissetti. Eşyaları yerine koymanın, bir sonraki oyunu daha kolay başlatacağını düşündü.",
      questions: [
        {
          q: "Murat ne yaptıktan sonra odasına baktı?",
          options: ["Arkadaşı eve gidince", "Sabah uyanınca", "Yemek yerken"],
          correct: 0,
        },
        {
          q: "Legolar neredeydi?",
          options: ["Masanın üstünde", "Balkonda", "Banyoda"],
          correct: 0,
        },
        {
          q: "Arabalar neredeydi?",
          options: ["Yatağın altında", "Pencerenin dışında", "Lavaboda"],
          correct: 0,
        },
        {
          q: "Murat önce neyi fark etti?",
          options: [
            "Odasının karışık olduğunu",
            "Lambanın kırıldığını",
            "Kitabının kaybolduğunu",
          ],
          correct: 0,
        },
        {
          q: "Murat odasını toplarken nasıl bir yol izledi?",
          options: [
            "Eşyaları gruplara ayırdı.",
            "Her şeyi yatağın altına itti.",
            "Odadan çıktı.",
          ],
          correct: 0,
        },
        {
          q: "Kartları nereye yerleştirdi?",
          options: ["Küçük kutusuna", "Çamaşır makinesine", "Bahçeye"],
          correct: 0,
        },
        {
          q: "Oda düzenlenince Murat ne hissetti?",
          options: ["Daha rahat", "Daha kızgın", "Daha üzgün"],
          correct: 0,
        },
        {
          q: "Bu metinden hangi sonuç çıkarılır?",
          options: [
            "Eşyaları yerine koymak yaşam alanını düzenli hale getirir.",
            "Oyuncaklar hep yerde kalmalıdır.",
            "Oda toplamak imkansızdır.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 20: Kim Yaptı, Ne Yaptı?",
      activities: [
        {
          type: "info",
          title: "Kim Yaptı, Ne Yaptı?",
          text: "Cümlede yapılan işi anlatan bölüme yüklem denir. Bu işi yapan kişiyi ya da varlığı bulmak için “Kim?” ya da “Ne?” diye sorabiliriz.\nÖrnek:\nAli top oynadı.\nNe yaptı? Oynadı.\nKim oynadı? Ali.\n\nBurada “oynadı” yüklemdir. “Ali” ise işi yapan kişidir.\n\nBaşka örnek:\nKuş uçtu.\nNe yaptı? Uçtu.\nNe uçtu? Kuş.\n\nBu konu cümlede kimin ne yaptığını anlamamıza yardım eder."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Kim Yaptı?",
          sentences: [
            { text: "Ali koştu. Kim koştu? {blank}", answer: "Ali", options: ["Ali", "Elif", "Kuş", "Kedi", "Öğretmen"] },
            { text: "Elif kitap okudu. Kim okudu? {blank}", answer: "Elif", options: ["Ali", "Elif", "Kuş", "Kedi", "Öğretmen"] },
            { text: "Kuş uçtu. Ne uçtu? {blank}", answer: "Kuş", options: ["Ali", "Elif", "Kuş", "Kedi", "Öğretmen"] },
            { text: "Kedi uyudu. Ne uyudu? {blank}", answer: "Kedi", options: ["Ali", "Elif", "Kuş", "Kedi", "Öğretmen"] },
            { text: "Öğretmen anlattı. Kim anlattı? {blank}", answer: "Öğretmen", options: ["Ali", "Elif", "Kuş", "Kedi", "Öğretmen"] }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Ne Yaptı?",
          sentences: [
            { text: "Ali koştu. Ne yaptı? {blank}", answer: "Koştu", options: ["Koştu", "Okudu", "Uçtu", "Uyudu", "Yaptı"] },
            { text: "Elif kitap okudu. Ne yaptı? {blank}", answer: "Okudu", options: ["Koştu", "Okudu", "Uçtu", "Uyudu", "Yaptı"] },
            { text: "Kuş uçtu. Ne yaptı? {blank}", answer: "Uçtu", options: ["Koştu", "Okudu", "Uçtu", "Uyudu", "Yaptı"] },
            { text: "Kedi uyudu. Ne yaptı? {blank}", answer: "Uyudu", options: ["Koştu", "Okudu", "Uçtu", "Uyudu", "Yaptı"] },
            { text: "Annem yemek yaptı. Ne yaptı? {blank}", answer: "Yaptı", options: ["Koştu", "Okudu", "Uçtu", "Uyudu", "Yaptı"] }
          ]
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
    ulkemiOgreniyorum: {
      title: "Sandık 20: Sayıların ve Bilimin Ustaları: Harezmi, Cahit Arf ve Aziz Sancar",
      activities: [
        {
          type: "info",
          title: "Sayıların ve Bilimin Ustaları",
          image: "/turkce-hazinem/20.bilgi.png",
          text: "Bilim insanları dünyayı anlamak için soru sorar, araştırır ve çözüm arar. Bazen sayılarla, bazen deneylerle, bazen de uzun yıllar süren gözlemlerle çalışırlar. Bilim, merakla başlar. “Bu nasıl oluyor?” sorusu birçok keşfin ilk adımıdır.\n\nHarezmi, matematik tarihinde önemli bir isimdir. Cebir ve sayı sistemleriyle ilgili çalışmalarıyla bilinir. Bugün bilgisayarların ve problem çözme yollarının temelinde kullanılan “algoritma” kelimesi de onun adıyla bağlantılıdır. Bu bilgi çocuklara şunu gösterir: Matematik sadece işlem yapmak değil, düzenli düşünmeyi öğrenmektir.\n\nCahit Arf, Türkiye’nin önemli matematikçilerindendir. Zor matematik problemleri üzerinde çalışmış ve bilim dünyasında saygı görmüştür. Aziz Sancar ise hücrelerin kendini nasıl onardığını araştıran bir bilim insanıdır. Bu çalışmalarıyla Nobel Kimya Ödülü almıştır. Harezmi, Cahit Arf ve Aziz Sancar bize merakın, çalışmanın ve sabrın bilimin temelinde olduğunu gösterir."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Bilim insanını çalışma alanıyla eşleştir.",
          questions: [
            {
              q: "Harezmi",
              options: [
                "Nobel Kimya Ödülü alan bilim insanı",
                "Soru sorma ve araştırma yolu",
                "Matematik tarihinde önemli bir isim",
                "Türkiye’nin önemli matematikçilerinden biri"
              ],
              correct: 2
            },
            {
              q: "Cahit Arf",
              options: [
                "Nobel Kimya Ödülü alan bilim insanı",
                "Soru sorma ve araştırma yolu",
                "Matematik tarihinde önemli bir isim",
                "Türkiye’nin önemli matematikçilerinden biri"
              ],
              correct: 3
            },
            {
              q: "Aziz Sancar",
              options: [
                "Nobel Kimya Ödülü alan bilim insanı",
                "Soru sorma ve araştırma yolu",
                "Matematik tarihinde önemli bir isim",
                "Türkiye’nin önemli matematikçilerinden biri"
              ],
              correct: 0
            },
            {
              q: "Bilim",
              options: [
                "Nobel Kimya Ödülü alan bilim insanı",
                "Soru sorma ve araştırma yolu",
                "Matematik tarihinde önemli bir isim",
                "Türkiye’nin önemli matematikçilerinden biri"
              ],
              correct: 1
            }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            { text: "Harezmi {blank} alanındaki çalışmalarıyla bilinir.", answer: "matematik", options: ["matematik", "matematikçi", "Nobel", "aramakla"] },
            { text: "Cahit Arf önemli bir {blank} idi.", answer: "matematikçi", options: ["matematik", "matematikçi", "Nobel", "aramakla"] },
            { text: "Aziz Sancar {blank} Kimya Ödülü almıştır.", answer: "Nobel", options: ["matematik", "matematikçi", "Nobel", "aramakla"] },
            { text: "Bilim, soru sormak ve cevap {blank} başlar.", answer: "aramakla", options: ["matematik", "matematikçi", "Nobel", "aramakla"] }
          ]
        }
      ]
    }
  },

  "21": {
    okuyorumAnliyorum: {
      title: "Karanlıktaki Gölge",
      theme: "Cesaret - Hikaye",
      text: "Pelin akşam yatağına girdiğinde odasındaki büyük lambayı kapattı. Sadece sokak lambasından gelen hafif ışık odanın içine düşüyordu. Odanın bazı köşeleri aydınlık, bazı köşeleri ise karanlık görünüyordu. Pelin tam uyuyacakken karşı duvarda büyük bir gölge fark etti. Gölge, kollarını açmış biri gibi duruyordu. Pelin önce korktu ve battaniyesini çenesine kadar çekti. Kalbi hızlanmıştı ama gözlerini gölgeden ayıramıyordu. Bir süre sonra derin bir nefes aldı. “Önce ne olduğuna bakmalıyım,” diye düşündü. Yatağından kalkıp lambanın düğmesine bastı. Işık açılınca duvardaki gölge hemen kayboldu. Pelin sandalyenin üzerinde duran şapka ve hırkayı gördü. Sokak lambasının ışığı bu eşyaların gölgesini duvara yansıtmıştı. Pelin korktuğu şeyin aslında odasındaki eşyalar olduğunu anlayınca rahatladı. O gece, korktuğu bir şeyi anlamaya çalışmanın kendisini daha cesur hissettirdiğini fark etti.",
      questions: [
        {
          q: "Pelin ne zaman lambayı kapattı?",
          options: ["Yatağına girdiğinde", "Sabah uyanınca", "Yemek yerken"],
          correct: 0,
        },
        {
          q: "Odayı ne aydınlatıyordu?",
          options: [
            "Sokak lambasından gelen hafif ışık",
            "El feneri",
            "Bilgisayar ekranı",
          ],
          correct: 0,
        },
        {
          q: "Pelin duvarda ne gördü?",
          options: ["Büyük bir gölge", "Renkli bir resim", "Küçük bir böcek"],
          correct: 0,
        },
        {
          q: "Pelin ilk başta nasıl hissetti?",
          options: ["Korktu", "Çok güldü", "Hiç fark etmedi"],
          correct: 0,
        },
        {
          q: "Pelin korkunca ne yaptı?",
          options: [
            "Önce battaniyesini çenesine kadar çekti.",
            "Hemen bahçeye çıktı.",
            "Pencereyi açtı.",
          ],
          correct: 0,
        },
        {
          q: "Pelin ne yapmaya karar verdi?",
          options: [
            "Gölgenin ne olduğuna bakmaya",
            "Hemen ağlamaya",
            "Odadan kaçmaya",
          ],
          correct: 0,
        },
        {
          q: "Gölge aslında neyden oluşmuştu?",
          options: ["Şapka ve hırkadan", "Oyuncak ayıdan", "Kapının kolundan"],
          correct: 0,
        },
        {
          q: "Pelin neden rahatladı?",
          options: [
            "Korkusunun nedenini anladığı için",
            "Annesi geldiği için",
            "Gölge konuştuğu için",
          ],
          correct: 0,
        },
        {
          q: "Pelin’in davranışı hangi özelliği gösterir?",
          options: ["Cesaret", "Kıskançlık", "Dikkatsizlik"],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Korktuğumuz şeyleri anlamaya çalışmak bizi rahatlatabilir.",
            "Her gölge tehlikelidir.",
            "Işık hiçbir işe yaramaz.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 21: Ne Zaman, Nerede, Nasıl, Neden?",
      activities: [
        {
          type: "info",
          title: "Ne Zaman, Nerede, Nasıl, Neden?",
          text: "Bir cümleyi daha iyi anlamak için bazı sorular sorarız. Bu sorular bize olayın zamanını, yerini, yapılış biçimini ve sebebini gösterir.\nNe zaman? sorusu olayın zamanını bulmamıza yardım eder.\nÖrnek:\nAli sabah okula gitti.\nNe zaman gitti? Sabah.\n\nNerede? sorusu olayın yerini bulmamıza yardım eder.\nÖrnek:\nElif bahçede oyun oynadı.\nNerede oynadı? Bahçede.\n\nNasıl? sorusu bir işin nasıl yapıldığını anlatır.\nÖrnek:\nMert dikkatlice kitabını okudu.\nNasıl okudu? Dikkatlice.\n\nNeden? sorusu bir olayın sebebini bulmamıza yardım eder.\nÖrnek:\nZeynep hasta olduğu için okula gitmedi.\nNeden okula gitmedi? Hasta olduğu için.\n\nBu soruları sormak, cümlede anlatılan olayı daha iyi anlamamızı sağlar."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Sorunun Cevabını Seç",
          desc: "Cümleyi oku ve sorunun doğru cevabını seç.",
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
          desc: "Verilen cevaba uygun soruyu seç.",
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
          desc: "Cümleyi verilen soruya uygun şekilde tamamla.",
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
          desc: "Cümlede hangi sorunun cevabı var?",
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
    ulkemiOgreniyorum: {
      title: "Sandık 21: İç Anadolu Bölgesi: Başkent, Bozkır ve Kapadokya",
      activities: [
        {
          type: "info",
          title: "İç Anadolu Bölgesi",
          image: "/turkce-hazinem/21.bilgi.png",
          text: "İç Anadolu Bölgesi, Türkiye’nin orta kısmında bulunur. Bu yüzden ülkemizin kalbi gibi düşünülebilir. Ankara, Konya, Kayseri, Eskişehir, Nevşehir, Sivas, Aksaray, Kırşehir, Kırıkkale, Niğde ve Karaman gibi şehirler bu bölgeyle bağlantılıdır. Başkentimiz Ankara da İç Anadolu Bölgesi’nde yer alır.\n\nBölgede deniz etkisi az olduğu için yazlar sıcak ve kurak, kışlar soğuk geçebilir. Geniş düzlükler, ovalar ve bozkırlar İç Anadolu’nun dikkat çeken özelliklerindendir. Bozkır, ilkbaharda yeşeren ama yazın kuruyabilen ot topluluklarıyla tanınır.\n\nBuğday ve arpa gibi tahıllar bölgede çok yetişir. Bu yüzden İç Anadolu için “tahıl ambarı” ifadesi kullanılabilir. Ayrıca Kapadokya’daki Peri Bacaları, rüzgar ve yağmurun kayaları uzun yıllar boyunca aşındırmasıyla oluşmuştur. Peri Bacaları, yer altı şehirleri ve sıcak hava balonlarıyla Kapadokya çok özel bir turistik bölgedir."
        },
        {
          type: "text_selection",
          title: "Etkinlik 1: Bölge ile Ürün Eşleştir",
          desc: "İç Anadolu Bölgesi ile ilgili olanları seç.",
          options: [
            { text: "Ankara", isCorrect: true },
            { text: "Buğday", isCorrect: true },
            { text: "Arpa", isCorrect: true },
            { text: "Kapadokya", isCorrect: true },
            { text: "Çay", isCorrect: false },
            { text: "Portakal", isCorrect: false }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Tahmin Oyunu",
          questions: [
            {
              q: "İpucu: Ben Türkiye’nin ortasındayım. Başkent Ankara bendedir. Bozkırlarım ve geniş düzlüklerim vardır. Kapadokya da benim bölgemdedir. Ben hangi bölgeyim?",
              options: ["İç Anadolu Bölgesi", "Marmara Bölgesi", "Güneydoğu Anadolu Bölgesi"],
              correct: 0
            }
          ]
        },
        {
          type: "true_false",
          title: "Etkinlik 3: Doğru Yanlış",
          questions: [
            { q: "Ankara İç Anadolu Bölgesi’ndedir.", correct: true },
            { q: "İç Anadolu deniz kıyısında yer alır.", correct: false },
            { q: "Buğday ve arpa İç Anadolu’da yetişen ürünlerdendir.", correct: true },
            { q: "Kapadokya ve Peri Bacaları İç Anadolu ile bağlantılıdır.", correct: true },
            { q: "Bozkır İç Anadolu’da görülebilen bitki örtüsüdür.", correct: true }
          ]
        }
      ]
    }
  },

  "22": {
    okuyorumAnliyorum: {
      title: "Kemanın Sesi",
      theme: "Sanat sevgisi - Hikaye",
      text: "Arda hafta sonu babasıyla çarşıdaki müzik mağazasının önünden geçti. Vitrinde gitarlar, davullar, flütler ve kemanlar vardı. Bazıları büyük ve parlak, bazıları ise küçük ve sade görünüyordu. Arda en çok kahverengi kemanı merak etti. Kemanın ince gövdesi ve uzun yayı dikkatini çekti. O sırada mağazanın içinde bir müzisyen keman çalmaya başladı. Yay tellerin üzerinde yavaşça hareket ediyordu. Kemanın sesi ince, yumuşak ve sakindi. Arda sesi dinlerken mağazanın kalabalığını bir an unuttu. Müzik ona gökyüzünde süzülen kuşları ve hafif esen rüzgarı hatırlattı. Babasına, “Keman çalmayı öğrenmek isterim,” dedi. Babası, bir çalgıyı öğrenmenin sabır ve düzenli çalışma gerektirdiğini anlattı. Arda hemen mükemmel çalamayacağını biliyordu. Yine de bir gün kendi emeğiyle güzel bir melodi çalabilmeyi hayal etti. O gün Arda, sanatın insanın içinde yeni bir merak uyandırabileceğini fark etti.",
      questions: [
        {
          q: "Arda kiminle çarşıdaydı?",
          options: ["Babasıyla", "Öğretmeniyle", "Komşusuyla"],
          correct: 0,
        },
        {
          q: "Vitrinde hangi çalgılar vardı?",
          options: [
            "Gitarlar, davullar, flütler ve kemanlar",
            "Arabalar ve toplar",
            "Defterler ve kalemler",
          ],
          correct: 0,
        },
        {
          q: "Arda en çok hangi çalgıyı merak etti?",
          options: ["Kemanı", "Davulu", "Zili"],
          correct: 0,
        },
        {
          q: "Müzisyen ne çalmaya başladı?",
          options: ["Keman", "Piyano", "Kemençe"],
          correct: 0,
        },
        {
          q: "Kemanın sesi nasıldı?",
          options: [
            "İnce, yumuşak ve sakin",
            "Çok sert ve gürültülü",
            "Sessiz",
          ],
          correct: 0,
        },
        {
          q: "Arda müziği dinlerken neyi unuttu?",
          options: ["Mağazanın kalabalığını", "Adını", "Ayakkabısını"],
          correct: 0,
        },
        {
          q: "Müzik Arda’ya neyi hatırlattı?",
          options: [
            "Gökyüzünde süzülen kuşları ve hafif esen rüzgarı",
            "Karanlık bir odayı",
            "Kayıp bir çantayı",
          ],
          correct: 0,
        },
        {
          q: "Babası keman öğrenmek için ne gerektiğini söyledi?",
          options: [
            "Sabır ve düzenli çalışma",
            "Hiç çalışmamak",
            "Sadece hızlı koşmak",
          ],
          correct: 0,
        },
        {
          q: "Arda’nın hayali nedir?",
          options: [
            "Bir gün kendi emeğiyle güzel bir melodi çalabilmek",
            "Mağazayı kapatmak",
            "Çalgıları saklamak",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Sanat merak uyandırır ve emekle öğrenilir.",
            "Müzik mağazalarına girilmez.",
            "Keman sesi herkesi korkutur.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 22: Paragrafı Düzenliyorum",
      activities: [
        {
          type: "info",
          title: "Paragrafı Düzenliyorum",
          text: "Bir paragraf, aynı konu etrafında bir araya gelen cümlelerden oluşur. Paragraftaki cümleler karışık olmamalıdır. Önce olay ya da düşünce başlar, sonra gelişir, en sonunda tamamlanır.\nÖrnek:\nÖnce: Ali bahçeye çıktı.\nSonra: Yerde boş bir kutu gördü.\nSon olarak: Kutuyu çöp kutusuna attı.\n\nBu cümleler doğru sıraya konduğunda anlamlı bir paragraf olur.\nParagrafı düzenlerken “Önce ne oldu? Sonra ne oldu? En sonunda ne oldu?” diye düşünürüz."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Olayı Sıraya Koy 1",
          desc: "Aşağıdaki cümleleri doğru sıraya koy.",
          sentences: [
            { text: "1. {blank}", answer: "Elif uyandı." },
            { text: "2. {blank}", answer: "Dişlerini fırçaladı." },
            { text: "3. {blank}", answer: "Kahvaltı yaptı." },
            { text: "4. {blank}", answer: "Okul çantasını hazırladı." }
          ],
          words: ["Dişlerini fırçaladı.", "Elif uyandı.", "Okul çantasını hazırladı.", "Kahvaltı yaptı."]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Olayı Sıraya Koy 2",
          desc: "Aşağıdaki cümleleri doğru sıraya koy.",
          sentences: [
            { text: "1. {blank}", answer: "Mert parka gitti." },
            { text: "2. {blank}", answer: "Arkadaşıyla karşılaştı." },
            { text: "3. {blank}", answer: "Topunu aldı." },
            { text: "4. {blank}", answer: "Topu arkadaşına attı." },
            { text: "5. {blank}", answer: "Birlikte oyun oynadılar." }
          ],
          words: ["Mert parka gitti.", "Topunu aldı.", "Arkadaşıyla karşılaştı.", "Topu arkadaşına attı.", "Birlikte oyun oynadılar."]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 3: Olayı Sıraya Koy 3",
          desc: "Aşağıdaki cümleleri doğru sıraya koy.",
          sentences: [
            { text: "1. {blank}", answer: "Zeynep bahçeye çıktı." },
            { text: "2. {blank}", answer: "Bahçedeki çiçekleri gördü." },
            { text: "3. {blank}", answer: "Sulama kabını aldı." },
            { text: "4. {blank}", answer: "Çiçekleri suladı." },
            { text: "5. {blank}", answer: "Kuruyan yaprakları topladı." },
            { text: "6. {blank}", answer: "Bahçeyi temiz bıraktı." }
          ],
          words: ["Zeynep bahçeye çıktı.", "Bahçedeki çiçekleri gördü.", "Sulama kabını aldı.", "Çiçekleri suladı.", "Kuruyan yaprakları topladı.", "Bahçeyi temiz bıraktı."]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 4: Paragrafı Tamamla",
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
    ulkemiOgreniyorum: {
      title: "Sandık 22: Atatürk’ün İzinde: Anıtkabir ve Hatırlamak",
      activities: [
        {
          type: "info",
          title: "Atatürk’ün İzinde: Anıtkabir ve Hatırlamak",
          image: "/turkce-hazinem/22.bilgi.png",
          text: "Anıtkabir, Ankara’da bulunan ve Atatürk’ün anısını yaşatan özel bir yerdir. İnsanlar burayı ziyaret ederek Atatürk’e saygılarını gösterir. Anıtkabir, sadece bir yapı değil, aynı zamanda ortak hafızamızın önemli bir sembolüdür.\n\nBir kişiyi anmak, sadece adını söylemek değildir. Onun hayatını, düşüncelerini, yaptığı çalışmaları ve bıraktığı değerleri anlamaya çalışmaktır. Atatürk’ü anmak da Türkiye için yaptığı yenilikleri, Cumhuriyet’e verdiği önemi, eğitime ve çocuklara duyduğu güveni öğrenmekle mümkündür.\n\nAnıtkabir’i ziyaret eden insanlar genellikle saygılı ve sessiz davranır. Çünkü burası hatırlama ve düşünme yeridir. Çocuklar için Anıtkabir’i öğrenmek, Atatürk’ün hayat yolculuğunu ve Cumhuriyet’in neden önemli olduğunu anlamaya yardım eder."
        },
        {
          type: "true_false",
          title: "Etkinlik 1: Doğru Yanlış",
          questions: [
            { q: "Anıtkabir Ankara’dadır.", correct: true },
            { q: "Anıtkabir Atatürk’ün anısını yaşatan özel bir yerdir.", correct: true },
            { q: "Atatürk’ü anmak, onun hayatını ve çalışmalarını öğrenmekle de ilgilidir.", correct: true },
            { q: "Anıtkabir bir lunaparktır.", correct: false },
            { q: "Anıtkabir saygı ve hatırlama duygusunu temsil eder.", correct: true }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            { text: "Anıtkabir {blank} şehrindedir.", answer: "Ankara", options: ["Ankara", "yaşatan", "öğrenmek", "hatırlama"] },
            { text: "Anıtkabir, Atatürk’ün anısını {blank} özel bir yerdir.", answer: "yaşatan", options: ["Ankara", "yaşatan", "öğrenmek", "hatırlama"] },
            { text: "Atatürk’ü anmak, onun hayatını ve çalışmalarını {blank} demektir.", answer: "öğrenmek", options: ["Ankara", "yaşatan", "öğrenmek", "hatırlama"] },
            { text: "Anıtkabir saygı ve {blank} duygusunu temsil eder.", answer: "hatırlama", options: ["Ankara", "yaşatan", "öğrenmek", "hatırlama"] }
          ]
        }
      ]
    }
  },

  "23": {
    okuyorumAnliyorum: {
      title: "Topraktan Çıkan Saat",
      theme: "Tarih merakı - Hikaye",
      text: "Çınar dedesiyle birlikte arka bahçede toprağı kazıyordu. Yeni çiçek tohumları için küçük bir alan hazırlıyorlardı. Dedesi toprağı yavaş kazmasını, çünkü bazen toprağın altında eski kökler ya da sert taşlar olabileceğini söyledi. Bir süre sonra Çınar’ın küreği sert bir şeye çarptı. Topraktan “tık” diye bir ses geldi. Çınar hemen durdu ve toprağı elleriyle dikkatle açtı. Yuvarlak, paslanmış bir nesne buldu. Dedesi nesneyi yavaşça temizledi. Bunun eski bir köstekli saat olduğu ortaya çıktı. Saatin camı çatlamıştı ama akrep ve yelkovanı hâlâ görülebiliyordu. Çınar saatin kime ait olduğunu merak etti. Belki yıllar önce bu evde yaşayan biri kullanmıştı. Belki de bir cebin içinden düşüp uzun süre toprağın altında kalmıştı. Dedesi, eski eşyaların geçmiş hakkında ipuçları verebileceğini söyledi. Çınar o gün tarihin sadece kitaplarda olmadığını fark etti. Bazen geçmiş, toprağın içinden çıkan küçük bir eşyada da saklı olabilir.",
      questions: [
        {
          q: "Çınar kiminle bahçedeydi?",
          options: ["Dedesiyle", "Arkadaşıyla", "Öğretmeniyle"],
          correct: 0,
        },
        {
          q: "Bahçede ne hazırlıyorlardı?",
          options: ["Çiçek tohumları için alan", "Oyuncak yolu", "Havuz"],
          correct: 0,
        },
        {
          q: "Dedesi neden yavaş kazmasını söyledi?",
          options: [
            "Toprağın altında eski kökler ya da sert taşlar olabileceği için",
            "Hava çok sıcak olduğu için",
            "Çınar yorulmasın diye hiç kazmasın istediği için",
          ],
          correct: 0,
        },
        {
          q: "Çınar’ın küreği neye çarptı?",
          options: ["Sert bir şeye", "Çiçeğe", "Suya"],
          correct: 0,
        },
        {
          q: "Topraktan çıkan nesne nasıldı?",
          options: [
            "Yuvarlak ve paslanmış",
            "Yeni ve parlak",
            "Yumuşak ve beyaz",
          ],
          correct: 0,
        },
        {
          q: "Nesnenin ne olduğu ortaya çıktı?",
          options: ["Köstekli saat", "Oyuncak araba", "Anahtar"],
          correct: 0,
        },
        {
          q: "Saatin hangi parçaları görülebiliyordu?",
          options: ["Akrep ve yelkovan", "Pil ve düğme", "Kordon ve zil"],
          correct: 0,
        },
        {
          q: "Çınar neyi merak etti?",
          options: [
            "Saatin kime ait olduğunu",
            "Bahçedeki kuşları",
            "Toprağın rengini",
          ],
          correct: 0,
        },
        {
          q: "Çınar neyi fark etti?",
          options: [
            "Tarihin sadece kitaplarda olmadığını",
            "Saatlerin hiç bozulmadığını",
            "Çiçeklerin konuştuğunu",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Eski eşyalar geçmişi merak etmemizi sağlayabilir.",
            "Bahçede hiçbir şey bulunmaz.",
            "Saatler sadece yeni olmalıdır.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 23: Deyimler",
      activities: [
        {
          type: "info",
          title: "Deyimler",
          text: "Deyimler, gerçek anlamından farklı bir anlam taşıyan kalıplaşmış sözlerdir. Deyimleri kelime kelime düşünürsek bazen anlamını bulamayız. Cümlede ne anlatmak istediğine bakmamız gerekir.\nÖrnek:\nKulak misafiri olmak\nBu deyim, bir konuşmayı istemeden duymak anlamına gelir.\n\nEtekleri zil çalmak\nBu deyim, çok sevinmek anlamına gelir.\n\nAğzı kulaklarına varmak\nBu deyim, çok mutlu olmak anlamına gelir.\n\nDeyimler konuşmayı daha renkli hale getirir."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Deyimin Anlamını Bul",
          sentences: [
            { text: "Kulak misafiri olmak {blank}", answer: "Bir konuşmayı istemeden duymak", options: ["Bir konuşmayı istemeden duymak", "Çok sevinmek", "Çok mutlu olmak", "Çok dikkatli korumak", "Heyecandan ne yapacağını şaşırmak"] },
            { text: "Etekleri zil çalmak {blank}", answer: "Çok sevinmek", options: ["Bir konuşmayı istemeden duymak", "Çok sevinmek", "Çok mutlu olmak", "Çok dikkatli korumak", "Heyecandan ne yapacağını şaşırmak"] },
            { text: "Ağzı kulaklarına varmak {blank}", answer: "Çok mutlu olmak", options: ["Bir konuşmayı istemeden duymak", "Çok sevinmek", "Çok mutlu olmak", "Çok dikkatli korumak", "Heyecandan ne yapacağını şaşırmak"] },
            { text: "Gözü gibi bakmak {blank}", answer: "Çok dikkatli korumak", options: ["Bir konuşmayı istemeden duymak", "Çok sevinmek", "Çok mutlu olmak", "Çok dikkatli korumak", "Heyecandan ne yapacağını şaşırmak"] },
            { text: "Eli ayağına dolaşmak {blank}", answer: "Heyecandan ne yapacağını şaşırmak", options: ["Bir konuşmayı istemeden duymak", "Çok sevinmek", "Çok mutlu olmak", "Çok dikkatli korumak", "Heyecandan ne yapacağını şaşırmak"] }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Cümledeki Deyimi Seç",
          sentences: [
            { text: "Hediyeyi görünce etekleri zil çaldı. Deyim: {blank}", answer: "etekleri zil çalmak", options: ["etekleri zil çalmak", "gözü gibi bakmak", "kulak misafiri olmak", "eli ayağına dolaşmak", "ağzı kulaklarına varmak"] },
            { text: "Yeni bisikletine gözü gibi bakıyor. Deyim: {blank}", answer: "gözü gibi bakmak", options: ["etekleri zil çalmak", "gözü gibi bakmak", "kulak misafiri olmak", "eli ayağına dolaşmak", "ağzı kulaklarına varmak"] },
            { text: "Öğretmenin konuşmasına kulak misafiri oldum. Deyim: {blank}", answer: "kulak misafiri olmak", options: ["etekleri zil çalmak", "gözü gibi bakmak", "kulak misafiri olmak", "eli ayağına dolaşmak", "ağzı kulaklarına varmak"] },
            { text: "Sahnede eli ayağına dolaştı. Deyim: {blank}", answer: "eli ayağına dolaşmak", options: ["etekleri zil çalmak", "gözü gibi bakmak", "kulak misafiri olmak", "eli ayağına dolaşmak", "ağzı kulaklarına varmak"] },
            { text: "Haberi alınca ağzı kulaklarına vardı. Deyim: {blank}", answer: "ağzı kulaklarına varmak", options: ["etekleri zil çalmak", "gözü gibi bakmak", "kulak misafiri olmak", "eli ayağına dolaşmak", "ağzı kulaklarına varmak"] }
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
    ulkemiOgreniyorum: {
      title: "Sandık 23: 29 Ekim: Cumhuriyetin Doğum Günü",
      activities: [
        {
          type: "info",
          title: "29 Ekim: Cumhuriyetin Doğum Günü",
          image: "/turkce-hazinem/23.bilgi.png",
          text: "29 Ekim 1923’te Türkiye’de Cumhuriyet ilan edildi. Bu yüzden her yıl 29 Ekim’de Cumhuriyet Bayramı kutlanır. Bu tarih, Türkiye için yeni bir yönetim anlayışının başladığı çok önemli bir gündür.\n\nCumhuriyet, halkın kendi ülkesinin yönetiminde söz sahibi olması demektir. Yani ülkeyle ilgili kararlar tek bir kişinin isteğine göre değil, halkın seçtiği temsilciler aracılığıyla alınır. Bu fikir, insanların ülkenin geleceğinde daha aktif bir rol almasını sağlar.\n\n29 Ekim kutlamalarında bayraklar asılır, törenler yapılır, şiirler okunur, marşlar söylenir. Çocuklar için cumhuriyeti anlamak, sadece bir bayramı öğrenmek değildir. Aynı zamanda özgürlük, katılım, sorumluluk ve birlikte yaşama gibi değerleri tanımaktır."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Boşluk Doldurma",
          sentences: [
            { text: "Cumhuriyet {blank} Ekim 1923’te ilan edilmiştir.", answer: "29", options: ["29", "söz", "Bayramı", "başlangıcı"] },
            { text: "Cumhuriyet, halkın yönetimde {blank} sahibi olmasıdır.", answer: "söz", options: ["29", "söz", "Bayramı", "başlangıcı"] },
            { text: "29 Ekim, Cumhuriyet {blank} olarak kutlanır.", answer: "Bayramı", options: ["29", "söz", "Bayramı", "başlangıcı"] },
            { text: "Cumhuriyet Türkiye için yeni bir {blank} anlatır.", answer: "başlangıcı", options: ["29", "söz", "Bayramı", "başlangıcı"] }
          ]
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          questions: [
            { q: "29 Ekim Cumhuriyet Bayramı’dır.", correct: true },
            { q: "Cumhuriyet 1923 yılında ilan edilmiştir.", correct: true },
            { q: "Cumhuriyet halkın yönetimde söz sahibi olmasıyla ilgilidir.", correct: true },
            { q: "29 Ekim sadece denizlerimizi anlatan bir gündür.", correct: false },
            { q: "Cumhuriyet Bayramı coşkuyla kutlanır.", correct: true }
          ]
        }
      ]
    }
  },

  "24": {
    okuyorumAnliyorum: {
      title: "Güneş Enerjili Oyuncak",
      theme: "İcat ve bilim - Bilgilendirici hikaye",
      text: "Selim pazar günü mavi oyuncak arabasıyla oynamak istedi. Kumandaya bastı ama araba hareket etmedi. Önce kumandanın bozulduğunu düşündü. Babası arabayı kontrol edince pillerin bittiğini fark etti. Evde yeni pil kalmamıştı. Selim biraz üzüldü, çünkü arabasını o gün denemek istiyordu. Babası ona küçük bir güneş paneli gösterdi. Güneş paneli, güneş ışığını elektrik enerjisine çevirebilen bir parçadır. Babası bu parçanın bazı hesap makinelerinde, lambalarda ve farklı cihazlarda kullanılabildiğini anlattı. Sonra paneli arabanın üstüne güvenli bir şekilde bağladı. Selim arabayı güneş alan balkona koydu. Bir süre sonra araba yavaşça hareket etmeye başladı. Selim, güneş ışığının enerjiye dönüşebildiğini kendi gözleriyle gördü. Babası buna temiz enerji örneklerinden biri olduğunu söyledi. Temiz enerji doğaya daha az zarar veren enerji kaynakları için kullanılan bir ifadedir. Selim bu denemeden sonra başka oyuncakların nasıl çalıştığını da merak etti. Merak etmek, yeni fikirlerin ve küçük icatların başlangıcı olabilir.",
      questions: [
        {
          q: "Selim hangi oyuncağıyla oynamak istedi?",
          options: ["Mavi oyuncak araba", "Kırmızı top", "Sarı robot"],
          correct: 0,
        },
        {
          q: "Araba neden hareket etmedi?",
          options: ["Pilleri bitmişti", "Tekerleği yoktu", "Kaybolmuştu"],
          correct: 0,
        },
        {
          q: "Selim önce ne düşündü?",
          options: [
            "Kumandanın bozulduğunu",
            "Balkonda yağmur yağdığını",
            "Arabanın uçacağını",
          ],
          correct: 0,
        },
        {
          q: "Babası ne gösterdi?",
          options: ["Güneş paneli", "Yeni kalem", "Eski saat"],
          correct: 0,
        },
        {
          q: "Güneş paneli ne işe yarar?",
          options: [
            "Güneş ışığını elektrik enerjisine çevirebilir",
            "Arabayı boyar",
            "Oyuncağı saklar",
          ],
          correct: 0,
        },
        {
          q: "Panel nereye bağlandı?",
          options: ["Arabanın üstüne", "Kapının arkasına", "Çantaya"],
          correct: 0,
        },
        {
          q: "Araba sonra ne yaptı?",
          options: ["Yavaşça hareket etti", "Eridi", "Kayboldu"],
          correct: 0,
        },
        {
          q: "Temiz enerji neyle ilgilidir?",
          options: [
            "Doğaya daha az zarar veren enerji kaynaklarıyla",
            "Kirli oyuncaklarla",
            "Sadece karanlık odalarla",
          ],
          correct: 0,
        },
        {
          q: "Selim neyi merak etti?",
          options: [
            "Başka oyuncakların nasıl çalıştığını",
            "Çantaların rengini",
            "Kitapların kapağını",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Bilimsel merak yeni fikirler doğurabilir.",
            "Oyuncaklar hep pille çalışmalıdır.",
            "Güneş ışığı işe yaramaz.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 24: Atasözleri",
      activities: [
        {
          type: "info",
          title: "Atasözleri",
          text: "Atasözleri, geçmişten günümüze gelen kısa ve anlamlı öğütlerdir. İnsanların deneyimlerinden doğmuştur. Atasözleri bize hayatla ilgili düşünmeyi öğretir.\n\nBu sandıkta 8 atasözü öğreneceğiz.\n\nDamlaya damlaya göl olur.\nAnlamı: Küçük şeyler zamanla büyüyebilir. Her gün az az biriktirilen para, bilgi ya da emek zamanla çoğalır.\n\nAğaç yaşken eğilir.\nAnlamı: Bazı alışkanlıklar küçük yaşta daha kolay kazanılır. Düzenli okumak, temiz olmak, nazik konuşmak gibi davranışlar çocukken daha kolay öğrenilir.\n\nBir elin nesi var, iki elin sesi var.\nAnlamı: Birlikte çalışınca işler daha kolay ve güçlü olur. Yardımlaşmak başarıyı artırır.\n\nSakla samanı, gelir zamanı.\nAnlamı: Bugün gereksiz gibi görünen bir şey, ileride işe yarayabilir. Bu atasözü eşyaları, bilgileri veya imkanları dikkatli kullanmayı anlatır.\n\nAk akçe kara gün içindir.\nAnlamı: İnsan zor zamanlar için birikim yapmalıdır. Para, zaman veya emek dikkatli kullanılmalıdır.\n\nÜzüm üzüme baka baka kararır.\nAnlamı: İnsanlar birlikte vakit geçirdikleri kişilerden etkilenebilir. İyi arkadaşlıklar iyi alışkanlıklar kazandırabilir.\n\nİşleyen demir pas tutmaz.\nAnlamı: Çalışan, öğrenen ve kendini geliştiren kişi canlı ve güçlü kalır. Bir beceriyi kullanırsak onu daha iyi koruruz.\n\nTatlı dil yılanı deliğinden çıkarır.\nAnlamı: Nazik ve güzel konuşmak sorunları çözmeye yardım eder. Kibar sözler insanları olumlu etkileyebilir.\n\nAtasözleri kısa görünür ama içinde önemli bir ders taşır. Bir atasözünü anlamak için önce sözün hangi durumda kullanılabileceğini düşünürüz."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Atasözünü Tamamla",
          desc: "Boşluğu doğru kelimeyle tamamla.",
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
          desc: "Atasözünün anlamını doğru seçenekten bul.",
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
          type: "fill_in_blanks",
          title: "Etkinlik 3: Atasözü ile Anlamı Eşleştir",
          desc: "Anlama uygun olan atasözünü seç.",
          sentences: [
            { text: "Küçük birikimler zamanla büyür. -> {blank}", answer: "Damlaya damlaya göl olur." },
            { text: "Alışkanlıklar küçük yaşta daha kolay kazanılır. -> {blank}", answer: "Ağaç yaşken eğilir." },
            { text: "Birlikte çalışmak işleri kolaylaştırır. -> {blank}", answer: "Bir elin nesi var, iki elin sesi var." },
            { text: "Bugün gereksiz görünen şey ileride işe yarayabilir. -> {blank}", answer: "Sakla samanı, gelir zamanı." },
            { text: "Zor zamanlar için birikim yapmak gerekir. -> {blank}", answer: "Ak akçe kara gün içindir." },
            { text: "İnsan çevresindeki kişilerden etkilenebilir. -> {blank}", answer: "Üzüm üzüme baka baka kararır." },
            { text: "Çalışan ve öğrenmeye devam eden kişi gelişir. -> {blank}", answer: "İşleyen demir pas tutmaz." },
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
    ulkemiOgreniyorum: {
      title: "Sandık 24: Karadeniz Bölgesi: Yağmur, Çay ve Yaylalar",
      activities: [
        {
          type: "info",
          title: "Karadeniz Bölgesi",
          image: "/turkce-hazinem/24.bilgi.png",
          text: "Karadeniz Bölgesi, Türkiye’nin kuzeyinde yer alır. Bölge Karadeniz kıyısı boyunca uzanır. Samsun, Ordu, Giresun, Trabzon, Rize, Artvin, Sinop, Zonguldak, Bartın, Kastamonu, Amasya, Tokat, Gümüşhane, Bayburt, Bolu, Düzce, Karabük ve Çorum gibi şehirler bu bölgeyle bağlantılıdır.\n\nKaradeniz Bölgesi bol yağış alan bir bölgedir. Bu nedenle ormanlar gür, doğa yemyeşildir. Dağlar kıyıya paralel uzandığı için kıyı ile iç kesimler arasında ulaşım bazı yerlerde zorlaşabilir. Akarsular, dereler, ormanlar ve sisli yaylalar bölgenin doğasını çok özel kılar.\n\nKaradeniz’de çay ve fındık çok önemli ürünlerdir. Özellikle Rize çay bahçeleriyle, Ordu ve Giresun fındıkla tanınır. Yaylalar, dağların yüksek ve yeşil alanlarıdır. İnsanlar yaylalara serinlemek, hayvancılık yapmak veya doğayla iç içe olmak için çıkar. Kemençe sesi ve horon da Karadeniz kültürünün neşeli parçalarıdır."
        },
        {
          type: "text_selection",
          title: "Etkinlik 1: Bölge ile Ürün Eşleştir",
          desc: "Karadeniz Bölgesi ile ilgili ürün ve kültür kartlarını seç.",
          image: "/turkce-hazinem/24.etkinlik1.png",
          options: [
            { text: "Çay", isCorrect: true },
            { text: "Fındık", isCorrect: true },
            { text: "Yayla", isCorrect: true },
            { text: "Horon", isCorrect: true },
            { text: "Muz", isCorrect: false },
            { text: "Zeytin", isCorrect: false }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Tahmin Oyunu",
          questions: [
            {
              q: "İpucu: Ben Türkiye’nin kuzeyindeyim. Yağmurum boldur. Çay ve fındık bahçelerim vardır. Yaylalarım yemyeşildir. Ben hangi bölgeyim?",
              options: ["Karadeniz Bölgesi", "Akdeniz Bölgesi", "İç Anadolu Bölgesi"],
              correct: 0
            }
          ]
        }
      ]
    }
  },

  "25": {
    okuyorumAnliyorum: {
      title: "Yeni Gelen Arkadaş",
      theme: "Empati - Hikaye",
      text: "Pazartesi sabahı sınıfa Elif adında yeni bir öğrenci geldi. Elif başka bir ülkeden taşınmıştı ve Türkçe konuşurken biraz zorlanıyordu. Öğretmen onu sınıfa tanıttıktan sonra yanındaki boş sıraya oturttu. İlk derste Elif öğretmeni dikkatle dinledi ama bazı kelimeleri anlamakta zorlandı. Teneffüs zili çalınca sınıftaki çocuklar bahçeye çıktı. Elif ise sırasında kaldı ve etrafına sessizce baktı. Kerem onun yalnız kaldığını fark etti. Önce ne söyleyeceğini bilemedi. Sonra çantasından bir boyama kitabı ve renkli kalemler çıkardı. Elif’in yanına gidip gülümsedi. Kelimelerle uzun uzun konuşmak yerine kitabı açtı ve kalemleri ortaya koydu. Elif önce şaşırdı, sonra kırmızı kalemi aldı. İki çocuk aynı resmi birlikte boyamaya başladı. Bir süre sonra Elif de küçük bir gülümsemeyle Kerem’e mavi kalemi uzattı. Kerem, bazen dostluk kurmak için çok fazla kelime gerekmediğini anladı. Elif de sınıfta yalnız olmadığını hissetti.",
      questions: [
        {
          q: "Sınıfa yeni gelen öğrencinin adı neydi?",
          options: ["Elif", "Nil", "Pelin"],
          correct: 0,
        },
        {
          q: "Elif neden biraz zorlanıyordu?",
          options: [
            "Türkçe konuşurken zorlanıyordu",
            "Ayakkabısı yoktu",
            "Kitabı kaybolmuştu",
          ],
          correct: 0,
        },
        {
          q: "Teneffüste çocuklar nereye çıktı?",
          options: ["Bahçeye", "Kantine", "Kütüphaneye"],
          correct: 0,
        },
        {
          q: "Elif nerede kaldı?",
          options: ["Sırasında", "Bahçede", "Koridorda"],
          correct: 0,
        },
        {
          q: "Kerem neyi fark etti?",
          options: [
            "Elif’in yalnız kaldığını",
            "Öğretmenin geldiğini",
            "Kalemlerin kırıldığını",
          ],
          correct: 0,
        },
        {
          q: "Kerem çantasından ne çıkardı?",
          options: [
            "Boyama kitabı ve renkli kalemler",
            "Top ve ip",
            "Sandviç ve su",
          ],
          correct: 0,
        },
        {
          q: "Elif ilk olarak hangi kalemi aldı?",
          options: ["Kırmızı kalem", "Siyah kalem", "Beyaz kalem"],
          correct: 0,
        },
        {
          q: "Elif sonra Kerem’e ne uzattı?",
          options: ["Mavi kalemi", "Çantasını", "Montunu"],
          correct: 0,
        },
        {
          q: "Kerem neyi anladı?",
          options: [
            "Dostluk kurmak için bazen çok fazla kelime gerekmez.",
            "Kimseyle konuşulmamalıdır.",
            "Boyama kitapları saklanmalıdır.",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Empati kurmak ve küçük bir adım atmak birini iyi hissettirebilir.",
            "Yeni gelen öğrenciler yalnız kalmalıdır.",
            "Teneffüste sınıfta durmak yasaktır.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 25: Konu ve Ana Fikir",
      activities: [
        {
          type: "info",
          title: "Konu ve Ana Fikir",
          text: "Bir metinde anlatılan şeye konu denir. Konu bize “Bu metin ne hakkında?” sorusunun cevabını verir.\nAna fikir ise metnin bize vermek istediği asıl düşüncedir. Ana fikri bulmak için “Bu metinden ne öğreniyoruz?” diye sorabiliriz.\n\nÖrnek metin:\nElif her gün kitap okurdu. Yeni kelimeler öğrendikçe daha iyi konuşmaya başladı. Okuduklarını arkadaşlarına da anlattı.\n\nKonu: Kitap okumak\nAna fikir: Kitap okumak dilimizi ve anlatımımızı geliştirir.\n\nKonu genellikle kısa bir başlık gibidir. Ana fikir ise metnin bize verdiği derstir."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Konuyu Bul",
          desc: "Kısa açıklamayı oku ve metnin konusunu seç.",
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
    ulkemiOgreniyorum: {
      title: "Sandık 25: Deyimler",
      activities: [
        {
          type: "info",
          title: "Deyimler",
          text: "Deyimler, gerçek anlamından farklı bir anlam taşıyan kısa sözlerdir. Günlük konuşmada sık kullanılır ve anlatımı daha renkli hale getirir.\nÜç deyim örneği:\nKulak misafiri olmak: Bir konuşmayı istemeden duymak.\n Örnek: Annemle ablam konuşurken kulak misafiri oldum.\nEtekleri zil çalmak: Çok sevinmek.\n Örnek: Tatil haberini duyunca etekleri zil çaldı.\nAğzı kulaklarına varmak: Çok mutlu olmak.\n Örnek: Hediyesini görünce ağzı kulaklarına vardı."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Deyimin Anlamını Bul",
          desc: "Deyimleri doğru anlamlarıyla eşleştir.",
          questions: [
            {
              q: "Kulak misafiri olmak",
              options: ["Çok mutlu olmak", "Bir konuşmayı istemeden duymak", "Çok sevinmek"],
              correct: 1
            },
            {
              q: "Etekleri zil çalmak",
              options: ["Çok mutlu olmak", "Bir konuşmayı istemeden duymak", "Çok sevinmek"],
              correct: 2
            },
            {
              q: "Ağzı kulaklarına varmak",
              options: ["Çok mutlu olmak", "Bir konuşmayı istemeden duymak", "Çok sevinmek"],
              correct: 0
            }
          ]
        }
      ]
    }
  },

  "26": {
    okuyorumAnliyorum: {
      title: "Büyüteçle Bakınca",
      theme: "Bakış açısı - Düşündürücü hikaye",
      text: "Defne, dedesinin masasındaki büyüteci ilk kez eline aldı. Büyüteçle önce kendi parmağına baktı. Parmak çizgileri ona küçük yollar gibi göründü. Sonra masadaki yaprağı inceledi. Yaprağın üzerinde ince damarlar vardı. Defne bu ayrıntıları normalde fark etmediğini düşündü. Dedesi, “Bazen bir şeye yakından bakınca onu daha iyi anlarsın,” dedi. Defne bu sözü sadece büyüteç için düşünmedi. O gün okulda yaşadığı bir olayı hatırladı. Arkadaşı Elvan teneffüste onunla oynamamıştı. Defne önce Elvan’ın kendisine kızgın olduğunu sanmıştı. Şimdi ise belki de Elvan’ın yorgun, üzgün ya da başka bir şey düşünmüş olabileceğini fark etti. Dedesi, insanları anlamak için de bazen dikkatli bakmak ve dinlemek gerektiğini söyledi. Defne, olaylara hemen karar vermeden önce biraz düşünmesi gerektiğini anladı. Büyüteç ona sadece küçük ayrıntıları göstermemişti. Aynı zamanda farklı bir açıdan bakmanın önemini de hatırlatmıştı. Ertesi gün Elvan’la konuşup onu dinlemeye karar verdi.",
      questions: [
        {
          q: "Defne neyi eline aldı?",
          options: ["Büyüteç", "Saat", "Kalemlik"],
          correct: 0,
        },
        {
          q: "Parmak çizgileri Defne’ye ne gibi göründü?",
          options: ["Küçük yollar", "Büyük taşlar", "Balonlar"],
          correct: 0,
        },
        {
          q: "Defne yaprakta ne gördü?",
          options: ["İnce damarlar", "Mavi boya", "Küçük düğmeler"],
          correct: 0,
        },
        {
          q: "Dedesi ne söyledi?",
          options: [
            "Yakından bakınca bir şeyi daha iyi anlayabilirsin.",
            "Büyüteç hiç işe yaramaz.",
            "Yaprakları koparmalısın.",
          ],
          correct: 0,
        },
        {
          q: "Defne okulda hangi olayı hatırladı?",
          options: [
            "Elvan’ın onunla oynamamasını",
            "Öğretmenin kitap okumasını",
            "Kaleminin kırılmasını",
          ],
          correct: 0,
        },
        {
          q: "Defne önce ne sanmıştı?",
          options: [
            "Elvan’ın ona kızgın olduğunu",
            "Elvan’ın eve gittiğini",
            "Elvan’ın oyun kurduğunu",
          ],
          correct: 0,
        },
        {
          q: "Defne sonradan neyi düşündü?",
          options: [
            "Elvan’ın yorgun ya da üzgün olabileceğini",
            "Elvan’ın hiç konuşmadığını",
            "Elvan’ın okula gelmediğini",
          ],
          correct: 0,
        },
        {
          q: "“Bir olaya dikkatli bakmak” metinde ne anlama gelir?",
          options: [
            "Hemen karar vermeden anlamaya çalışmak",
            "Gözleri kapatmak",
            "Sadece uzaktan bakmak",
          ],
          correct: 0,
        },
        {
          q: "Büyüteç metinde neyi hatırlatır?",
          options: [
            "Ayrıntıları ve farklı açıdan bakmayı",
            "Acele etmeyi",
            "Saklanmayı",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Bir şeyi anlamak için bazen daha dikkatli ve farklı açıdan bakmak gerekir.",
            "Arkadaşlarımızı hiç dinlememeliyiz.",
            "Büyüteçle sadece parmaklara bakılır.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 26: 5N1K",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Sorunun Cevabını Seç",
          desc: "Cümleyi oku ve sorunun doğru cevabını seç.",
          questions: [
            { q: "Ali sabah bahçede top oynadı. (Kim top oynadı?)", options: ["Sabah", "Ali", "Bahçede"], correct: 1 },
            { q: "Elif okulda kitap okudu. (Nerede kitap okudu?)", options: ["Okulda", "Kitap", "Elif"], correct: 0 },
            { q: "Mert akşam dişlerini fırçaladı. (Ne zaman fırçaladı?)", options: ["Dişlerini", "Mert", "Akşam"], correct: 2 },
            { q: "Zeynep hasta olduğu için okula gitmedi. (Neden okula gitmedi?)", options: ["Hasta olduğu için", "Okula", "Zeynep"], correct: 0 },
            { q: "Kerem sessizce kapıyı kapattı. (Nasıl kapattı?)", options: ["Kapıyı", "Sessizce", "Kerem"], correct: 1 },
            { q: "Çocuklar parkta oyun oynadı. (Nerede oyun oynadı?)", options: ["Çocuklar", "Oyun", "Parkta"], correct: 2 },
            { q: "Annem pazardan elma aldı. (Ne aldı?)", options: ["Elma", "Pazardan", "Annem"], correct: 0 },
            { q: "Yağmur yağdığı için pikniğe gidemedik. (Neden pikniğe gidemedik?)", options: ["Pikniğe", "Yağmur yağdığı için", "Gidemedik"], correct: 1 }
          ]
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Sandık 26: Yıldızlara Bakanlar: Nüzhet Gökdoğan, Dilhan Eryurt ve Feryal Özel",
      activities: [
        {
          type: "info",
          title: "Yıldızlara Bakanlar",
          image: "/turkce-hazinem/26.bilgi.png",
          text: "İnsanlar çok eski zamanlardan beri gökyüzüne bakıp sorular sormuştur. Yıldızlar nasıl parlar? Güneş nasıl çalışır? Kara delikler nedir? Gezegenler nasıl hareket eder? Bu sorular astronominin alanına girer. Astronomi, gökyüzünü ve uzayı inceleyen bilim dalıdır.\n\nNüzhet Gökdoğan, Türkiye’de astronomi alanında önemli çalışmalar yapan öncü bilim insanlarından biridir. Onun çalışmaları, Türkiye’de gökyüzünü bilimsel olarak inceleyen insanların yetişmesine katkı sağlamıştır. Dilhan Eryurt ise Güneş ve yıldızlar üzerine araştırmalar yapmıştır. Güneş’in ve yıldızların nasıl enerji ürettiğini anlamaya çalışan bilim insanları, evreni daha iyi tanımamıza yardım eder.\n\nFeryal Özel ise kara delikler ve uzayla ilgili çalışmalarıyla tanınır. Kara delikler, uzaydaki en ilginç ve merak uyandıran konulardan biridir. Bu üç bilim kadını bize şunu gösterir: Gökyüzüne merakla bakmak, büyük bilim yolculuklarının başlangıcı olabilir. Bir çocuğun “Bu yıldız neden parlıyor?” sorusu bile gelecekte önemli araştırmalara dönüşebilir."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Kişiyi veya kavramı doğru açıklamayla eşleştir.",
          questions: [
            {
              q: "Nüzhet Gökdoğan",
              options: [
                "Güneş ve yıldızlar üzerine çalışmalarıyla bilinir",
                "Gökyüzünü ve uzayı inceleyen bilim dalı",
                "Türkiye’de astronomi alanında önemli çalışmalar yapan öncü isimlerden biri",
                "Kara delikler ve uzay çalışmalarıyla tanınır"
              ],
              correct: 2
            },
            {
              q: "Dilhan Eryurt",
              options: [
                "Güneş ve yıldızlar üzerine çalışmalarıyla bilinir",
                "Gökyüzünü ve uzayı inceleyen bilim dalı",
                "Türkiye’de astronomi alanında önemli çalışmalar yapan öncü isimlerden biri",
                "Kara delikler ve uzay çalışmalarıyla tanınır"
              ],
              correct: 0
            },
            {
              q: "Feryal Özel",
              options: [
                "Güneş ve yıldızlar üzerine çalışmalarıyla bilinir",
                "Gökyüzünü ve uzayı inceleyen bilim dalı",
                "Türkiye’de astronomi alanında önemli çalışmalar yapan öncü isimlerden biri",
                "Kara delikler ve uzay çalışmalarıyla tanınır"
              ],
              correct: 3
            },
            {
              q: "Astronomi",
              options: [
                "Güneş ve yıldızlar üzerine çalışmalarıyla bilinir",
                "Gökyüzünü ve uzayı inceleyen bilim dalı",
                "Türkiye’de astronomi alanında önemli çalışmalar yapan öncü isimlerden biri",
                "Kara delikler ve uzay çalışmalarıyla tanınır"
              ],
              correct: 1
            }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            { text: "Astronomi {blank} ve uzayı inceleyen bilim dalıdır.", answer: "gökyüzünü", options: ["gökyüzünü", "yıldızlar", "delikler", "başlangıcı"] },
            { text: "Dilhan Eryurt Güneş ve {blank} üzerine çalışmıştır.", answer: "yıldızlar", options: ["gökyüzünü", "yıldızlar", "delikler", "başlangıcı"] },
            { text: "Feryal Özel kara {blank} ile ilgili çalışmalarıyla tanınır.", answer: "delikler", options: ["gökyüzünü", "yıldızlar", "delikler", "başlangıcı"] },
            { text: "Gökyüzüne merakla bakmak bilimin güzel bir {blank} olabilir.", answer: "başlangıcı", options: ["gökyüzünü", "yıldızlar", "delikler", "başlangıcı"] }
          ]
        }
      ]
    }
  },

  "27": {
    okuyorumAnliyorum: {
      title: "Yaşlı Meşe Ağacı",
      theme: "Doğa ve ekosistem - Bilgilendirici hikaye",
      text: "Deniz, dedesiyle birlikte ormandaki yaşlı meşe ağacının yanında durdu. Ağacın gövdesi kalın, dalları geniş ve yaprakları gürdü. Dedesi bu ağacın çok uzun yıllardır orada yaşadığını söyledi. Deniz ağaca ilk baktığında sadece büyük bir ağaç gördüğünü düşündü. Sonra dedesi ondan daha dikkatli bakmasını istedi. Dallarında kuşlar dinleniyordu. Kabuğunun arasında küçük böcekler geziyordu. Gölgesinde mantarlar ve otlar büyüyordu. Toprağın altında ise kökleri geniş bir alana yayılmıştı. Dedesi, ağaçların birçok canlıya yuva, gölge ve besin sağladığını anlattı. Ayrıca ağaçların havayı temizlemeye yardım ettiğini söyledi. Deniz meşe palamutlarının da yeni ağaçların büyümesine katkı sağlayabileceğini öğrendi. Yaşlı meşe artık onun gözünde sadece bir ağaç değildi. Ormandaki pek çok canlının yaşamına dokunan önemli bir varlıktı. Deniz ormandan ayrılırken yere düşen küçük bir meşe palamudunu dikkatle inceledi. Bir ağacı korumanın, aslında birçok canlıyı korumak anlamına gelebileceğini düşündü.",
      questions: [
        {
          q: "Deniz hangi ağacın yanında durdu?",
          options: ["Yaşlı meşe ağacı", "Elma ağacı", "Palmiye"],
          correct: 0,
        },
        {
          q: "Ağacın gövdesi nasıldı?",
          options: ["Kalın", "İnce ve kırık", "Bembeyaz"],
          correct: 0,
        },
        {
          q: "Dallarda hangi canlılar dinleniyordu?",
          options: ["Kuşlar", "Balıklar", "Kediler"],
          correct: 0,
        },
        {
          q: "Ağacın kabuğunun arasında ne geziyordu?",
          options: ["Küçük böcekler", "Oyuncaklar", "Kalemler"],
          correct: 0,
        },
        {
          q: "Gölgesinde neler büyüyordu?",
          options: ["Mantarlar ve otlar", "Defterler", "Deniz kabukları"],
          correct: 0,
        },
        {
          q: "Toprağın altında ne vardı?",
          options: ["Kökler", "Şemsiye", "Saat"],
          correct: 0,
        },
        {
          q: "Ağaçlar canlılara ne sağlar?",
          options: ["Yuva, gölge ve besin", "Televizyon", "Ayakkabı"],
          correct: 0,
        },
        {
          q: "Deniz meşe palamutları hakkında ne öğrendi?",
          options: [
            "Yeni ağaçların büyümesine katkı sağlayabileceğini",
            "Her zaman taş olduklarını",
            "Suda yaşadıklarını",
          ],
          correct: 0,
        },
        {
          q: "Bir ağacı korumak ne anlama gelebilir?",
          options: [
            "Birçok canlıyı korumak",
            "Ormanı kirletmek",
            "Kuşları kovmak",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Ağaçlar birçok canlı için önemlidir ve korunmalıdır.",
            "Ormanda hiç canlı yoktur.",
            "Meşe palamudu bir oyuncaktır.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 27: Gerçek ve Mecaz Anlam",
      activities: [
        {
          type: "info",
          title: "Gerçek ve Mecaz Anlam",
          text: "Bir kelime bazen gerçek anlamıyla kullanılır, bazen de farklı bir anlam kazanır.\nGerçek anlam, kelimenin ilk ve bilinen anlamıdır.\n\nÖrnek:\nBardaktaki su soğuktu.\nBurada soğuk, gerçekten düşük sıcaklık anlamındadır.\n\nMecaz anlamda ise kelime gerçek anlamından uzaklaşır.\n\nÖrnek:\nBana soğuk davrandı.\nBurada soğuk, düşük sıcaklık değil; ilgisiz ve mesafeli davranmak anlamındadır.\n\nMecaz anlamı anlamak için cümlenin tamamına bakarız."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Gerçek mi Mecaz mı?",
          desc: "Cümledeki altı çizili kelimenin gerçek mi yoksa mecaz mı olduğunu seç.",
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
          desc: "Cümleleri gerçek veya mecaz anlam kutularına sürükle.",
          categories: ["Gerçek Anlam", "Mecaz Anlam"],
          items: [
            { label: "Soğuk su içtim.", category: "Gerçek Anlam" },
            { label: "Soğuk bir cevap verdi.", category: "Mecaz Anlam" },
            { label: "Tatlı yedim.", category: "Gerçek Anlam" },
            { label: "Tatlı bir sesle konuştu.", category: "Mecaz Anlam" },
            { label: "Ağır kutuyu kaldırdı.", category: "Gerçek Anlam" }
          ]
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Sandık 27: Doğu Anadolu Bölgesi: Dağlar, Kar ve Hayvancılık",
      activities: [
        {
          type: "info",
          title: "Doğu Anadolu Bölgesi",
          image: "/turkce-hazinem/27.bilgi.png",
          text: "Doğu Anadolu Bölgesi, Türkiye’nin doğusunda yer alır. Erzurum, Kars, Ağrı, Van, Muş, Bitlis, Bingöl, Elazığ, Malatya, Erzincan, Tunceli, Ardahan, Iğdır ve Hakkari gibi şehirler bu bölgeyle bağlantılıdır. Türkiye’nin yükseltisi en fazla olan bölgelerinden biridir.\n\nBölgede dağlar, platolar ve geniş meralar bulunur. Yükselti fazla olduğu için kış mevsimi uzun, soğuk ve karlı geçebilir. Kar bazı yerlerde uzun süre yerde kalır. Bu durum ulaşımı, tarımı ve günlük yaşamı etkileyebilir.\n\nDoğu Anadolu’da tarım alanları her yerde geniş olmadığı için hayvancılık önemli bir geçim kaynağıdır. Geniş meralarda büyükbaş hayvanlar otlatılır. Ağrı Dağı, Van Gölü ve İshak Paşa Sarayı bölgenin dikkat çeken yerlerindendir. Doğu Anadolu bize dağların, karın, meraların ve güçlü yaşam koşullarının şekillendirdiği bir bölgeyi tanıtır."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Tahmin Oyunu",
          questions: [
            {
              q: "İpucu: Ben Türkiye’nin doğusundayım. Dağlarım yüksektir. Kışlarım soğuk ve karlı geçebilir. Hayvancılık benim için önemlidir. Ben hangi bölgeyim?",
              options: ["Doğu Anadolu Bölgesi", "Ege Bölgesi", "Marmara Bölgesi"],
              correct: 0
            }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Yanlış Bilgiyi Düzelt",
          desc: "Yanlış cümlenin düzeltilmiş doğru halini seç.",
          questions: [
            {
              q: "Yanlış: Doğu Anadolu Türkiye’nin batısındadır.",
              options: [
                "Doğu Anadolu Türkiye’nin doğusundadır.",
                "Doğu Anadolu Türkiye’nin ortasındadır."
              ],
              correct: 0
            },
            {
              q: "Yanlış: Doğu Anadolu’da kışlar her zaman çok sıcak geçer.",
              options: [
                "Doğu Anadolu’da kışlar soğuk ve karlı geçebilir.",
                "Doğu Anadolu’da kışlar hiç olmaz."
              ],
              correct: 0
            },
            {
              q: "Yanlış: Ağrı Dağı Akdeniz Bölgesi’ndedir.",
              options: [
                "Ağrı Dağı Doğu Anadolu Bölgesi ile bağlantılıdır.",
                "Ağrı Dağı Ege Bölgesi ile bağlantılıdır."
              ],
              correct: 0
            }
          ]
        }
      ]
    }
  },

  "28": {
    okuyorumAnliyorum: {
      title: "Ataçtan Telefon Standı",
      theme: "Yaratıcı düşünme - Hikaye",
      text: "Lina, çevrim içi ders için tabletini masaya koydu. Ancak tablet sürekli arkaya düşüyordu. Ekranı düzgün göremediği için öğretmenini takip etmekte zorlandı. Önce tabletin arkasına birkaç kitap dizdi. Fakat kitaplar kayınca tablet yine devrildi. Lina biraz sıkıldı ama dersi kaçırmak istemiyordu. Masanın üzerinde duran büyük ataçları fark etti. İki atacı dikkatlice açıp küçük ayaklar haline getirdi. Sonra kalın bir kartonu arkaya destek olarak yerleştirdi. Tablet bu kez dik durdu. Lina ekrandaki öğretmenini rahatça görebildi. Ders boyunca yaptığı düzenek işe yaradı. Ders bitince tablet standına baktı ve gülümsedi. Çok pahalı bir araç kullanmamıştı. Sadece elindeki malzemelerle işe yarayan bir çözüm bulmuştu. Annesi bunun yaratıcı düşünme olduğunu söyledi. Lina, bir sorunla karşılaşınca hemen vazgeçmek yerine farklı yollar denemek gerektiğini anladı. Sonra bu küçük düzeneği daha sağlam hale getirmek için başka neler ekleyebileceğini düşünmeye başladı.",
      questions: [
        {
          q: "Lina ne için tabletini masaya koydu?",
          options: [
            "Çevrim içi ders için",
            "Film izlemek için",
            "Oyun oynamak için",
          ],
          correct: 0,
        },
        {
          q: "Tablet ne yapıyordu?",
          options: [
            "Sürekli arkaya düşüyordu",
            "Işık saçıyordu",
            "Şarkı söylüyordu",
          ],
          correct: 0,
        },
        {
          q: "Lina ekranı düzgün göremeyince ne yaşadı?",
          options: [
            "Öğretmenini takip etmekte zorlandı.",
            "Hemen uyudu.",
            "Tableti kapattı.",
          ],
          correct: 0,
        },
        {
          q: "Lina önce ne denedi?",
          options: [
            "Kitapları arkasına dizdi",
            "Tableti yere attı",
            "Dersini kapattı",
          ],
          correct: 0,
        },
        {
          q: "Lina masada neyi fark etti?",
          options: ["Büyük ataçları", "Çiçekleri", "Oyuncakları"],
          correct: 0,
        },
        {
          q: "Ataçları ne hale getirdi?",
          options: ["Küçük ayaklar", "Uzun ipler", "Kağıt topları"],
          correct: 0,
        },
        {
          q: "Arkaya ne koydu?",
          options: ["Karton destek", "Bardak", "Yastık"],
          correct: 0,
        },
        {
          q: "Annesi bunun ne olduğunu söyledi?",
          options: ["Yaratıcı düşünme", "Uyku hazırlığı", "Temizlik"],
          correct: 0,
        },
        {
          q: "Lina neyi anladı?",
          options: [
            "Sorunlarda farklı yollar denemek gerektiğini",
            "Derslere katılmamak gerektiğini",
            "Ataçların işe yaramadığını",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Basit malzemelerle yaratıcı çözümler bulunabilir.",
            "Tabletler asla dik durmaz.",
            "Sorun çıkınca hemen vazgeçmeliyiz.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Sandık 28: Anlamlı Cümle Kuruyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı: Anlamlı Cümle Kuruyorum",
          text: "Cümle kurarken kelimeleri doğru sıraya koymalıyız. Kelimeler yanlış sıradaysa cümle anlaşılmaz olabilir.\n\nÖrnek:\nYanlış: Okudu Elif kitap.\nDoğru: Elif kitap okudu.\n\nCümlede genellikle işi yapan kişi ya da varlık önce gelir. Sonra ne yaptığı anlatılır.\nKelimeleri sıraya koyarken cümlenin anlamlı olup olmadığına dikkat ederiz.\nAyrıca cümle büyük harfle başlar ve uygun noktalama işaretiyle biter."
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
    },
    ulkemiOgreniyorum: {
      title: "Sandık 28: İstiklal Marşı ve Bayrağımız",
      activities: [
        {
          type: "info",
          title: "İstiklal Marşı ve Bayrağımız",
          videoUrl: "/turkce-hazinem/28.bilgi.mp4",
          videoPoster: "/turkce-hazinem/istiklal_marsi_poster.png",
          text: "İstiklal Marşı, Türkiye’nin milli marşıdır. Mehmet Akif Ersoy tarafından yazılmıştır. Bu marş, zor zamanlarda bağımsızlık için verilen mücadeleyi, vatan sevgisini, cesareti ve umudu anlatır.\n\nMilli marşlar ülkeler için özel anlam taşır. İnsanlar marş söylerken saygı gösterir, çünkü marş ortak duyguları temsil eder. İstiklal Marşı okunurken ya da söylenirken dikkatli ve saygılı durmak bu yüzden önemlidir.\n\nBayrağımız da Türkiye’nin en önemli sembollerinden biridir. Kırmızı zemin üzerindeki ay ve yıldız, birçok insan için vatanı, bağımsızlığı ve birlikte yaşama duygusunu hatırlatır. İstiklal Marşı ve bayrağımız, farklı yerlerde yaşayan insanların ortak değerlerde buluşmasına yardım eder."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Kavramları doğru açıklamayla eşleştir.",
          questions: [
            {
              q: "İstiklal Marşı",
              options: [
                "Bayrağımızdaki semboller",
                "Türkiye’nin milli marşı",
                "İstiklal Marşı’nın yazarı",
                "Ülkemizi temsil eden önemli sembol"
              ],
              correct: 1
            },
            {
              q: "Mehmet Akif Ersoy",
              options: [
                "Bayrağımızdaki semboller",
                "Türkiye’nin milli marşı",
                "İstiklal Marşı’nın yazarı",
                "Ülkemizi temsil eden önemli sembol"
              ],
              correct: 2
            },
            {
              q: "Bayrak",
              options: [
                "Bayrağımızdaki semboller",
                "Türkiye’nin milli marşı",
                "İstiklal Marşı’nın yazarı",
                "Ülkemizi temsil eden önemli sembol"
              ],
              correct: 3
            },
            {
              q: "Ay ve yıldız",
              options: [
                "Bayrağımızdaki semboller",
                "Türkiye’nin milli marşı",
                "İstiklal Marşı’nın yazarı",
                "Ülkemizi temsil eden önemli sembol"
              ],
              correct: 0
            }
          ]
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          questions: [
            { q: "İstiklal Marşı Türkiye’nin milli marşıdır.", correct: true },
            { q: "İstiklal Marşı Mehmet Akif Ersoy tarafından yazılmıştır.", correct: true },
            { q: "Bayrağımızda ay ve yıldız vardır.", correct: true },
            { q: "Milli marş söylenirken saygı göstermek önemlidir.", correct: true },
            { q: "Bayrağımız yeşil zemin üzerine güneşten oluşur.", correct: false }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 3: Boşluk Doldurma",
          sentences: [
            { text: "İstiklal Marşı’nın yazarı Mehmet Akif {blank}.", answer: "Ersoy", options: ["Ersoy", "yıldız", "saygı", "vatan"] },
            { text: "Bayrağımızda ay ve {blank} vardır.", answer: "yıldız", options: ["Ersoy", "yıldız", "saygı", "vatan"] },
            { text: "Milli marş söylenirken {blank} göstermek önemlidir.", answer: "saygı", options: ["Ersoy", "yıldız", "saygı", "vatan"] },
            { text: "İstiklal Marşı bağımsızlık ve {blank} sevgisini anlatır.", answer: "vatan", options: ["Ersoy", "yıldız", "saygı", "vatan"] }
          ]
        }
      ]
    }
  },

  "29": {
    okuyorumAnliyorum: {
      title: "Sessiz Gün",
      theme: "İletişim - Hikaye",
      text: "Ela bir sabah boğazı ağrıdığı için konuşmakta zorlandı. Doktor, sesini dinlendirmesi gerektiğini söyledi. Ela o gün okulda mümkün olduğunca az konuşacaktı. Sınıfa girince arkadaşlarına küçük bir not gösterdi. Notta, “Bugün sesimi dinlendirmem gerekiyor,” yazıyordu. Arkadaşları onu anlayışla karşıladı. İlk derste öğretmen soru sorduğunda Ela cevabını defterine yazıp gösterdi. Teneffüste arkadaşları oyun seçerken Ela işaretlerle fikrini anlatmaya çalıştı. Başta zorlandı çünkü her şeyi kelimelerle söylemeye alışmıştı. Sonra yüz ifadelerinin, hareketlerin ve kısa notların da işe yaradığını fark etti. Bir şey istemek, teşekkür etmek ya da duygusunu anlatmak için farklı yollar denedi. Arkadaşları da onu daha dikkatli dinlemeye ve anlamaya çalıştı. Gün sonunda sesi biraz dinlenmişti. Ela, konuşmanın değerini ve dinlemenin önemini daha iyi anladı. Ertesi gün arkadaşlarına teşekkür etmek için küçük bir not hazırladı. Notta, “Beni anlamaya çalıştığınız için teşekkür ederim,” yazıyordu.",
      questions: [
        {
          q: "Ela neden konuşmakta zorlandı?",
          options: [
            "Boğazı ağrıdığı için",
            "Kitabı kaybolduğu için",
            "Ayakkabısı yırtıldığı için",
          ],
          correct: 0,
        },
        {
          q: "Doktor ne söyledi?",
          options: [
            "Sesini dinlendirmesi gerektiğini",
            "Koşması gerektiğini",
            "Şarkı söylemesi gerektiğini",
          ],
          correct: 0,
        },
        {
          q: "Ela sınıfta arkadaşlarına ne gösterdi?",
          options: ["Küçük bir not", "Oyuncak", "Resim çantası"],
          correct: 0,
        },
        {
          q: "Notta ne yazıyordu?",
          options: [
            "Bugün sesimi dinlendirmem gerekiyor.",
            "Bugün okula gelmedim.",
            "Bugün oyun yok.",
          ],
          correct: 0,
        },
        {
          q: "İlk derste öğretmen soru sorduğunda Ela ne yaptı?",
          options: [
            "Cevabını defterine yazıp gösterdi.",
            "Bağırarak cevap verdi.",
            "Sınıftan çıktı.",
          ],
          correct: 0,
        },
        {
          q: "Ela teneffüste nasıl iletişim kurdu?",
          options: [
            "İşaretler ve kısa notlarla",
            "Bağırarak",
            "Hiçbir şey yapmadan",
          ],
          correct: 0,
        },
        {
          q: "Ela neyi fark etti?",
          options: [
            "Yüz ifadeleri, hareketler ve kısa notlar da işe yarayabilir.",
            "Okulun kapalı olduğunu",
            "Suyun soğuk olduğunu",
          ],
          correct: 0,
        },
        {
          q: "Arkadaşları nasıl davrandı?",
          options: [
            "Onu daha dikkatli anlamaya çalıştı.",
            "Onu görmezden geldi.",
            "Notlarını sakladı.",
          ],
          correct: 0,
        },
        {
          q: "Gün sonunda neyi daha iyi anladı?",
          options: [
            "Konuşmanın değerini ve dinlemenin önemini",
            "Oyuncak almayı",
            "Koşmanın hızını",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "İletişim kurmanın farklı yolları vardır ve dinlemek de önemlidir.",
            "Hiç konuşmamak her zaman en iyisidir.",
            "Not yazmak gereksizdir.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
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
    },
    ulkemiOgreniyorum: {
      title: "Sandık 29: Güneydoğu Anadolu Bölgesi: Tarih, Taş Evler ve Sıcak Ovalar",
      activities: [
        {
          type: "info",
          title: "Güneydoğu Anadolu Bölgesi",
          image: "/turkce-hazinem/29.bilgi.png",
          infoImages: [
            { src: "/turkce-hazinem/29.etkinlik1.png", label: "Etkinlik Görseli" }
          ],
          text: "Güneydoğu Anadolu Bölgesi, Türkiye’nin güneydoğusunda yer alır. Şanlıurfa, Gaziantep, Mardin, Diyarbakır, Adıyaman, Batman, Siirt, Kilis ve Şırnak gibi şehirler bu bölgeyle bağlantılıdır. Türkiye’nin yüz ölçümü bakımından küçük bölgelerinden biridir ama tarihi ve kültürel zenginliği çok büyüktür.\n\nBölgede yazlar oldukça sıcak ve kurak geçebilir. Geniş ovalar ve plato alanları bulunur. Fırat ve Dicle nehirleri bölge için çok önemlidir. Bu nehirler tarım, yerleşim ve tarih boyunca yaşam için büyük değer taşımıştır.\n\nŞanlıurfa’da bulunan Göbeklitepe, insanlık tarihi açısından çok önemli bir arkeolojik alandır. Mardin taş evleri ve dar sokaklarıyla tanınır. Adıyaman’daki Nemrut Dağı, büyük heykelleriyle ünlüdür. Diyarbakır surları, Gaziantep’in yemek kültürü ve Şanlıurfa’nın tarihi dokusu da bölgeyi zenginleştirir. Güneydoğu Anadolu, sıcak ovaları, taş yapıları ve binlerce yıllık tarihiyle özel bir bölgedir."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Yerleri doğru bilgilerle eşleştir.",
          questions: [
            {
              q: "Göbeklitepe",
              options: [
                "Taş evleri ve tarihi sokaklarıyla tanınır",
                "Bölgedeki önemli nehirler",
                "Şanlıurfa’da bulunan çok önemli arkeolojik alan",
                "Büyük heykelleriyle ünlüdür"
              ],
              correct: 2
            },
            {
              q: "Mardin",
              options: [
                "Taş evleri ve tarihi sokaklarıyla tanınır",
                "Bölgedeki önemli nehirler",
                "Şanlıurfa’da bulunan çok önemli arkeolojik alan",
                "Büyük heykelleriyle ünlüdür"
              ],
              correct: 0
            },
            {
              q: "Nemrut Dağı",
              options: [
                "Taş evleri ve tarihi sokaklarıyla tanınır",
                "Bölgedeki önemli nehirler",
                "Şanlıurfa’da bulunan çok önemli arkeolojik alan",
                "Büyük heykelleriyle ünlüdür"
              ],
              correct: 3
            },
            {
              q: "Fırat ve Dicle",
              options: [
                "Taş evleri ve tarihi sokaklarıyla tanınır",
                "Bölgedeki önemli nehirler",
                "Şanlıurfa’da bulunan çok önemli arkeolojik alan",
                "Büyük heykelleriyle ünlüdür"
              ],
              correct: 1
            }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Tahmin Oyunu",
          questions: [
            {
              q: "İpucu: Ben Türkiye’nin güney doğusundayım. Yazlarım sıcak geçebilir. Göbeklitepe, Mardin taş evleri ve Nemrut Dağı benimle bağlantılıdır. Ben hangi bölgeyim?",
              options: [
                "Güneydoğu Anadolu Bölgesi",
                "Karadeniz Bölgesi",
                "Akdeniz Bölgesi"
              ],
              correct: 0
            }
          ]
        },
        {
          type: "true_false",
          title: "Etkinlik 3: Doğru Yanlış",
          questions: [
            { q: "Göbeklitepe Şanlıurfa ile bağlantılıdır.", correct: true },
            { q: "Mardin taş evleriyle tanınır.", correct: true },
            { q: "Nemrut Dağı büyük heykelleriyle bilinir.", correct: true },
            { q: "Güneydoğu Anadolu Türkiye’nin kuzeyindedir.", correct: false },
            { q: "Fırat ve Dicle bölge için önemli nehirlerdir.", correct: true }
          ]
        }
      ]
    }
  },

  "30": {
    okuyorumAnliyorum: {
      title: "Bilgi Sandığı",
      theme: "Öğrenme ve gelişim - Final hikayesi",
      text: "Efe, okulun kütüphanesinde eski görünümlü bir tahta sandık buldu. Sandığın üzerinde “Bilgi paylaştıkça büyür” yazıyordu. Efe önce bunun eski bir eşya olduğunu düşündü. Kütüphane öğretmeni, sandığın özel bir etkinlik için hazırlandığını anlattı. Her öğrenci sandığa yıl boyunca öğrendiği bir bilgiyi küçük bir karta yazacaktı. Kartların üzerinde isim yazmak zorunlu değildi. Önemli olan herkesin öğrendiği bir şeyi sınıfla paylaşmasıydı. Efe önce ne yazacağını bilemedi. Sonra yıl boyunca okudukları metinleri düşündü. Arıların dans ederek haberleşebildiğini hatırladı. Atmosferin Dünya’yı koruduğunu, yaprakların sonbaharda neden renk değiştirdiğini, güneş enerjisinin oyuncak bir arabayı çalıştırabildiğini düşündü. Ayrıca yardım etmenin, paylaşmanın, dürüst olmanın ve empati kurmanın da öğrenilen bilgiler kadar değerli olduğunu fark etti. Bir karta, “Merak etmek öğrenmenin ilk adımıdır,” yazdı. Arkadaşları da kendi kartlarını sandığa bıraktı. Kimi doğayla, kimi sanatla, kimi yardımlaşmayla, kimi de bilimle ilgili bilgiler yazmıştı. Sandık doldukça sınıfın ortak bilgi hazinesi oluştu. Efe, herkesin öğrendiği bir şeyi paylaşınca sınıfın daha da zenginleştiğini gördü. O gün bilgi sandığı sadece kartlarla değil, çocukların merakı, emeği ve düşünceleriyle de doldu.",
      questions: [
        {
          q: "Efe sandığı nerede buldu?",
          options: ["Kütüphanede", "Bahçede", "Markette"],
          correct: 0,
        },
        {
          q: "Sandığın üzerinde ne yazıyordu?",
          options: [
            "Bilgi paylaştıkça büyür",
            "Kapıyı kapat",
            "Sadece kitap koy",
          ],
          correct: 0,
        },
        {
          q: "Öğrenciler sandığa ne bırakacaktı?",
          options: [
            "Öğrendikleri bilgileri yazdıkları kartlar",
            "Oyuncaklar",
            "Yemekler",
          ],
          correct: 0,
        },
        {
          q: "Kartların üzerinde ne zorunlu değildi?",
          options: ["İsim yazmak", "Bilgi yazmak", "Kağıt kullanmak"],
          correct: 0,
        },
        {
          q: "Efe önce ne yaşadı?",
          options: ["Ne yazacağını bilemedi", "Sandığı kırdı", "Eve gitti"],
          correct: 0,
        },
        {
          q: "Efe hangi bilgileri hatırladı?",
          options: [
            "Arılar, atmosfer, yapraklar ve güneş enerjisiyle ilgili bilgileri",
            "Sadece futbol kurallarını",
            "Market listesini",
          ],
          correct: 0,
        },
        {
          q: "Efe değerler hakkında neyi fark etti?",
          options: [
            "Yardım, paylaşma, dürüstlük ve empatinin de değerli olduğunu",
            "Bunların önemsiz olduğunu",
            "Sadece bilim konularının öğrenileceğini",
          ],
          correct: 0,
        },
        {
          q: "Efe karta ne yazdı?",
          options: [
            "Merak etmek öğrenmenin ilk adımıdır.",
            "Bugün hava çok sıcak.",
            "Kitaplar ağırdır.",
          ],
          correct: 0,
        },
        {
          q: "Sandık doldukça ne oluştu?",
          options: [
            "Sınıfın ortak bilgi hazinesi",
            "Oyuncak kutusu",
            "Çöp kutusu",
          ],
          correct: 0,
        },
        {
          q: "Metnin ana fikri nedir?",
          options: [
            "Öğrenilen bilgileri paylaşmak herkesi geliştirir.",
            "Bilgi saklanmalıdır.",
            "Sadece öğretmenler öğrenebilir.",
          ],
          correct: 0,
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "SANDIK 30 SIRALAMA",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik: Olayları Doğru Sıraya Koy",
          desc: "Karışık verilen olayları okuyup doğru sıralamayı seç.",
          questions: [
            { 
              q: "1. Sonra kitabını çantasına koydu.\n2. Elif ödevini bitirdi.\n3. En sonunda annesine gösterdi.\n\nDoğru sıralama hangisidir?", 
              options: ["2, 1, 3", "1, 2, 3", "3, 2, 1"], 
              correct: 0 
            },
            {
              q: "1. Ali ellerini yıkadı.\n2. Sonra yemeğe oturdu.\n3. Önce bahçede oyun oynadı.\n\nDoğru sıralama hangisidir?",
              options: ["3, 1, 2", "1, 2, 3", "2, 3, 1"],
              correct: 0
            },
            {
              q: "1. En sonunda kitabı yerine koydu.\n2. Mert kitabı raftan aldı.\n3. Sonra sessizce okumaya başladı.\n\nDoğru sıralama hangisidir?",
              options: ["2, 3, 1", "1, 2, 3", "3, 2, 1"],
              correct: 0
            },
            {
              q: "1. Zeynep kalemlerini çantasına koydu.\n2. Önce ödevini tamamladı.\n3. Sonra okul çantasını hazırladı.\n\nDoğru sıralama hangisidir?",
              options: ["2, 1, 3", "1, 2, 3", "3, 1, 2"],
              correct: 0
            },
            {
              q: "1. Kedi sütünü içti.\n2. Nil kaseye süt koydu.\n3. Sonra kaseyi kapının yanına bıraktı.\n\nDoğru sıralama hangisidir?",
              options: ["2, 3, 1", "1, 2, 3", "3, 2, 1"],
              correct: 0
            },
            {
              q: "1. En sonunda çöpleri geri dönüşüme attılar.\n2. Çocuklar çöpleri topladı.\n3. Önce piknik yaptılar.\n\nDoğru sıralama hangisidir?",
              options: ["3, 2, 1", "1, 2, 3", "2, 1, 3"],
              correct: 0
            },
            {
              q: "1. Emre uçurtmasını aldı.\n2. Rüzgar çıkınca uçurtmasını uçurdu.\n3. Sonra sahile gitti.\n\nDoğru sıralama hangisidir?",
              options: ["1, 3, 2", "3, 1, 2", "2, 3, 1"],
              correct: 0
            },
            {
              q: "1. Pelin ışığı açtı.\n2. Duvarda büyük bir gölge gördü.\n3. Gölgenin hırkadan oluştuğunu fark etti.\n\nDoğru sıralama hangisidir?",
              options: ["2, 1, 3", "1, 2, 3", "3, 1, 2"],
              correct: 0
            }
          ]
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Sandık 30: Geleceği Tasarlayanlar: Canan Dağdeviren ve Alper Gezeravcı",
      activities: [
        {
          type: "info",
          title: "Geleceği Tasarlayanlar",
          image: "/turkce-hazinem/30.bilgi.png",
          text: "Bilim ve teknoloji sadece bugünü değil, geleceği de değiştirir. İnsanlar yeni sorular sordukça, yeni araçlar geliştirdikçe ve araştırmaya devam ettikçe dünya değişir. Bu yüzden bilim insanları, mühendisler, astronotlar ve tasarımcılar geleceğin kurulmasında önemli rol oynar.\n\nCanan Dağdeviren, insan sağlığına yardımcı olabilecek teknolojiler üzerine çalışan bir bilim insanıdır. Giyilebilir ve ince teknolojilerle vücudu daha iyi anlamaya yardımcı olacak çalışmalar yapar. Bu tür çalışmalar, bilimin günlük hayatla nasıl bağlantılı olabileceğini gösterir. Çünkü teknoloji bazen hastalıkları anlamaya, bazen insanların yaşamını kolaylaştırmaya yardım eder.\n\nAlper Gezeravcı ise Türkiye’nin uzaya giden ilk astronotudur. Uzay yolculuğu, sadece roketle gökyüzüne çıkmak değildir. Araştırma, eğitim, disiplin, ekip çalışması ve bilimsel merak gerektirir. Canan Dağdeviren ve Alper Gezeravcı bize şunu hatırlatır: Gelecek, merak eden ve çalışan insanların ellerinde şekillenir. Bugün soru soran bir çocuk, yarının bilim insanı, mühendisi, sanatçısı ya da kaşifi olabilir."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Boşluk Doldurma",
          sentences: [
            { text: "Canan Dağdeviren sağlık {blank} üzerine çalışır.", answer: "teknolojileri", options: ["teknolojileri", "astronotudur", "şekillendirmeye", "başlangıcıdır"] },
            { text: "Alper Gezeravcı Türkiye’nin uzaya giden ilk {blank}.", answer: "astronotudur", options: ["teknolojileri", "astronotudur", "şekillendirmeye", "başlangıcıdır"] },
            { text: "Bilim ve teknoloji geleceği {blank} yardım eder.", answer: "şekillendirmeye", options: ["teknolojileri", "astronotudur", "şekillendirmeye", "başlangıcıdır"] },
            { text: "Merak etmek, öğrenmenin önemli bir {blank}.", answer: "başlangıcıdır", options: ["teknolojileri", "astronotudur", "şekillendirmeye", "başlangıcıdır"] }
          ]
        }
      ]
    }
  },

  "tekrar-1": {
    dilimiOgreniyorum: {
      title: "Tekrar Sandığı 1: Dil Bilgisi",
      activities: [
        {
          type: "info",
          title: "Tekrar Sandığı 1",
          text: "Bu sandıkta harf, hece, kelime, cümle, büyük harf ve alfabetik sıralama konuları tekrar edilir. Hazırsan başlayalım!",
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Hatalı Cümleyi Düzelt",
          sentences: [
            {
              text: "ayşe kitap okudu. -> {blank}",
              answer: "Ayşe kitap okudu.",
            },
            {
              text: "kedim pamuk uyuyor. -> {blank}",
              answer: "Kedim Pamuk uyuyor.",
            },
            {
              text: "ben ankara’ya gittim. -> {blank}",
              answer: "Ben Ankara’ya gittim.",
            },
            {
              text: "masa üzerinde kalem var. -> {blank}",
              answer: "Masa üzerinde kalem var.",
            },
          ],
          words: [
            "Ayşe kitap okudu.",
            "Kedim Pamuk uyuyor.",
            "Ben Ankara’ya gittim.",
            "Masa üzerinde kalem var.",
          ],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Heceleri Birleştir",
          sentences: [
            {
              text: "ka, lem -> {blank}",
              answer: "kalem",
            },
            {
              text: "o, kul -> {blank}",
              answer: "okul",
            },
            {
              text: "çan, ta -> {blank}",
              answer: "çanta",
            },
            {
              text: "a, ra, ba -> {blank}",
              answer: "araba",
            },
          ],
          words: ["kalem", "okul", "çanta", "araba"],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 4: Alfabetik Sıra",
          questions: [
            {
              q: "Elma, Armut, Muz",
              options: ["Armut, Elma, Muz", "Muz, Elma, Armut"],
              correct: 0,
            },
            {
              q: "Kedi, Balık, Kuş",
              options: ["Balık, Kedi, Kuş", "Kuş, Kedi, Balık"],
              correct: 0,
            },
            {
              q: "Zeytin, Fındık, Portakal",
              options: ["Fındık, Portakal, Zeytin", "Portakal, Zeytin, Fındık"],
              correct: 0,
            },
            {
              q: "Can, Ali, Ece",
              options: ["Ali, Can, Ece", "Ece, Can, Ali"],
              correct: 0,
            },
          ],
        },
      ],
    },
    ulkemiOgreniyorum: {
      title: "Tekrar Sandığı 1: İlk Keşifler",
      activities: [
        {
          type: "info",
          title: "Tekrar Sandığı 1: İlk Keşifler",
          text: "Bu tekrar sandığında çocuk Türkiye’nin yeri, Atatürk’ün çocukluğu, 23 Nisan, geleneksel sanatlar ve denizlerle ilgili öğrendiklerini hatırlar.",
        },
        {
          type: "sorting",
          title: "Etkinlik 1: Eşleştirme",
          desc: "Kelimeleri açıklamalarıyla eşleştir.",
          items: [
            {
              label: "Selanik",
              category: "B. Atatürk’ün doğduğu şehir",
            },
            {
              label: "Ebru",
              category: "C. Suyun üzerinde yapılan sanat",
            },
            {
              label: "Marmara",
              category: "D. Türkiye’nin iç denizi",
            },
            {
              label: "Meclis",
              category: "A. 23 Nisan",
            },
          ],
          categories: [
            "A. 23 Nisan",
            "B. Atatürk’ün doğduğu şehir",
            "C. Suyun üzerinde yapılan sanat",
            "D. Türkiye’nin iç denizi",
          ],
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          desc: "Cümle doğruysa Doğru'yu, yanlışsa Yanlış'ı seç.",
          questions: [
            {
              q: "Türkiye bir yarımadadır.",
              correct: 0,
            },
            {
              q: "Atatürk Ankara’da doğmuştur.",
              correct: 1,
            },
            {
              q: "23 Nisan çocuklara armağan edilmiştir.",
              correct: 0,
            },
            {
              q: "Ebru sanatı taş üzerinde yapılır.",
              correct: 1,
            },
            {
              q: "Karadeniz Türkiye’nin kuzeyindedir.",
              correct: 0,
            },
          ],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 3: Boşluk Doldurma",
          desc: "Cümledeki boşluklara uygun kelimeyi seç.",
          sentences: [
            {
              text: "Türkiye, Asya ve Avrupa arasında bir {blank} gibidir.",
              answer: "köprü",
            },
            {
              text: "Atatürk {blank} şehrinde doğmuştur.",
              answer: "Selanik",
            },
            {
              text: "23 Nisan çocuklara armağan edilen bir {blank} günüdür.",
              answer: "bayram",
            },
            {
              text: "Ebru sanatında boyalar {blank} üzerine damlatılır.",
              answer: "su",
            },
          ],
          words: ["köprü", "Selanik", "bayram", "su"],
        },
      ],
    },
  },
  "tekrar-2": {
    ulkemiOgreniyorum: {
      title: "Tekrar Sandığı 2: Bayram, Sanat ve Gökyüzü",
      activities: [
        {
          type: "info",
          title: "Tekrar Sandığı 2",
          text: "Bu sandıkta Mustafa Kemal, 19 Mayıs, Ritim Hareket, Gülümseten Hikayeler ve Gökyüzü Öncüleri tekrar edilir.",
        },
        {
          type: "true_false",
          title: "Etkinlik 1: Doğru Yanlış",
          questions: [
            {
              q: "Mustafa Kemal’e Kemal adını matematik öğretmeni vermiştir.",
              correct: 0,
            },
            { q: "19 Mayıs çocuklara armağan edilmiştir.", correct: 1 },
            { q: "Horon Karadeniz kültürüyle bağlantılıdır.", correct: 0 },
            { q: "Karagöz ve Hacivat geleneksel gölge oyunudur.", correct: 0 },
            { q: "Vecihi Hürkuş havacılıkla bağlantılıdır.", correct: 0 },
          ],
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            {
              text: "19 Mayıs, Atatürk’ü Anma, Gençlik ve {blank} Bayramı’dır.",
              answer: "Spor",
            },
            {
              text: "Kemençe, {blank} kültürüyle bağlantılıdır.",
              answer: "Karadeniz",
            },
            {
              text: "Nasreddin Hoca {blank} ile tanınır.",
              answer: "fıkraları",
            },
            { text: "Sabiha Gökçen bir {blank} idi.", answer: "pilot" },
          ],
          words: ["Spor", "Karadeniz", "fıkraları", "pilot"],
        },
      ],
    },
    dilimiOgreniyorum: {
      title: "Tekrar Sandığı 2: Dil Bilgisi",
      activities: [
        {
          type: "info",
          title: "Tekrar Sandığı 2",
          text: "Bu sandıkta noktalama, soru eki, zıt anlam, eş anlam ve eş sesli kelimeler tekrar edilir.",
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Noktalama Tamiri",
          sentences: [
            {
              text: "Elma {blank} armut ve muz aldım {blank}",
              answer: [",", "."],
              options: [",", ".", "?"],
            },
            {
              text: "Bugün okula gittin mi {blank}",
              answer: "?",
              options: [",", ".", "?"],
            },
            {
              text: "Kedim süt içti {blank}",
              answer: ".",
              options: [",", ".", "?"],
            },
            {
              text: "Ali {blank} Ece ve Can geldi {blank}",
              answer: [",", "."],
              options: [",", ".", "?"],
            },
          ],
        },
        {
          type: "sorting",
          title: "Etkinlik 2: Kelime Anlamı Seç",
          desc: "Kelimeleri doğru özellikleriyle eşleştir.",
          items: [
            { category: "Küçük", label: "Büyük kelimesinin zıttı nedir?" },
            {
              category: "Öykü",
              label: "Hikaye kelimesinin eş anlamlısı nedir?",
            },
            { category: "Soğuk", label: "Sıcak kelimesinin zıttı nedir?" },
            {
              category: "Yanıt",
              label: "Cevap kelimesinin eş anlamlısı nedir?",
            },
          ],
          categories: ["Küçük", "Öykü", "Soğuk", "Yanıt"],
        },
        {
          type: "sorting",
          title: "Etkinlik 3: Eş Sesli Olanı Seç",
          desc: "Cümledeki eş sesli kelimenin anlamını eşleştir.",
          items: [
            { category: "Çiçek", label: "Gül bahçede açtı." },
            { category: "Gülmek", label: "Bana bakıp gül." },
            { category: "Mevsim", label: "Yaz geldi." },
            { category: "Yazmak", label: "Defterine yaz." },
          ],
          categories: ["Çiçek", "Gülmek", "Mevsim", "Yazmak"],
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 4: Doğru Yazımı Seç",
          questions: [
            {
              q: "Hangisinin yazımı doğrudur?",
              options: ["Gelirmisin?", "Gelir misin?"],
              correct: 1,
            },
            {
              q: "Hangisinin yazımı doğrudur?",
              options: ["Kitabı okudun mu?", "Kitabı okudunmu?"],
              correct: 0,
            },
            {
              q: "Hangisinin yazımı doğrudur?",
              options: [
                "Elma, armut ve muz aldım.",
                "Elma armut ve muz aldım,",
              ],
              correct: 0,
            },
            {
              q: "Hangisinin yazımı doğrudur?",
              options: ["2. sınıfa geçtim.", "2, sınıfa geçtim."],
              correct: 0,
            },
          ],
        },
      ],
    },
  },
  "tekrar-3": {
    ulkemiOgreniyorum: {
      title: "Tekrar Sandığı 3: Hava, Zafer ve Sofra",
      activities: [
        {
          type: "info",
          title: "Tekrar Sandığı 3: Hava, Zafer ve Sofra",
          text: "Bu tekrar sandığında çocuk hava ve mevsimleri, kitap sevgisini, 30 Ağustos’u, Marmara Bölgesi’ni ve sofra kültürünü tekrar eder."
        },
        {
          type: "true_false",
          title: "Etkinlik 1: Doğru Yanlış",
          questions: [
            { q: "Türkiye’de hava her bölgede aynı değildir.", correct: true },
            { q: "İstanbul Marmara Bölgesi’ndedir.", correct: true },
            { q: "30 Ağustos bağımsızlık mücadelesiyle bağlantılıdır.", correct: true },
            { q: "Türk kahvesi sofra kültürümüzle bağlantılı değildir.", correct: false },
            { q: "Atatürk kitaplardan notlar alırdı.", correct: true }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            { text: "Marmara Bölgesi’nde {blank} Boğazı bulunur.", answer: "İstanbul", options: ["İstanbul", "Zafer", "not", "sofra"] },
            { text: "30 Ağustos {blank} Bayramı’dır.", answer: "Zafer", options: ["İstanbul", "Zafer", "not", "sofra"] },
            { text: "Atatürk kitap okurken {blank} alırdı.", answer: "not", options: ["İstanbul", "Zafer", "not", "sofra"] },
            { text: "Misafire ikram etmek {blank} kültürünün parçasıdır.", answer: "sofra", options: ["İstanbul", "Zafer", "not", "sofra"] }
          ]
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Tekrar Sandığı 3",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Doğru Cümleyi Seç",
          questions: [
            {
              q: "Birden fazla kitap olduğunu anlatan cümle hangisidir?",
              options: ["Masada kitap var.", "Masada kitaplar var."],
              correct: 1
            },
            {
              q: "Bir kalemin rengini anlatan cümle hangisidir?",
              options: ["Mavi kalem çantamda.", "Büyük kalem çantamda."],
              correct: 0
            },
            {
              q: "İşin çoktan yapıldığını anlatan cümle hangisidir?",
              options: ["Dün okula gittim.", "Yarın okula gideceğim."],
              correct: 0
            },
            {
              q: "İşin şu anda yapıldığını anlatan cümle hangisidir?",
              options: ["Elif kitap okudu.", "Elif kitap okuyor."],
              correct: 1
            },
            {
              q: "İşin yarın yapılacağını anlatan cümle hangisidir?",
              options: ["Mert parka gidecek.", "Mert parka gitti."],
              correct: 0
            }
          ]
        },
        {
          type: "sorting",
          title: "Etkinlik 3: Zamanına Göre Eşleştir",
          desc: "Cümlelerin zamanlarını eşleştir.",
          items: [
            { category: "Dün oldu", label: "Dün resim yaptım." },
            { category: "Şimdi oluyor", label: "Şimdi yemek yiyorum." },
            { category: "Sonra olacak", label: "Yarın sinemaya gideceğim." },
            { category: "Dün oldu", label: "Kedi uyudu." },
            { category: "Şimdi oluyor", label: "Ali koşuyor." },
            { category: "Sonra olacak", label: "Elif kitap okuyacak." }
          ],
          categories: ["Dün oldu", "Şimdi oluyor", "Sonra olacak"]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 4: Cümleyi Tamamla",
          questions: [
            {
              q: "Kırmızı ............... masada duruyor.",
              options: ["kalem", "koştu"],
              correct: 0
            },
            {
              q: "Ağaçta birçok ............... var.",
              options: ["kuşlar", "kuş"],
              correct: 1
            },
            {
              q: "Şu an yağmur ...............",
              options: ["yağdı", "yağıyor"],
              correct: 1
            },
            {
              q: "Yarın okula ...............",
              options: ["gideceğim", "gittim"],
              correct: 0
            },
            {
              q: "Bahçede küçük bir ............... uyuyor.",
              options: ["kedi", "kediler"],
              correct: 0
            }
          ]
        }
      ]
    }
  },

  "tekrar-4": {
    ulkemiOgreniyorum: {
      title: "Tekrar Sandığı 4",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Tahmin Oyunu",
          desc: "Hangi bölge ya da kişiyim?",
          questions: [
            {
              q: "Ben batıdayım. Zeytin ve incirle tanınırım. Ben hangi bölgeyim?",
              options: ["Ege Bölgesi", "Akdeniz Bölgesi", "Karadeniz Bölgesi"],
              correct: 0
            },
            {
              q: "Ben güneydeyim. Portakal ve limon yetişir. Ben hangi bölgeyim?",
              options: ["Ege Bölgesi", "Akdeniz Bölgesi", "Karadeniz Bölgesi"],
              correct: 1
            },
            {
              q: "Ben Nobel Kimya Ödülü alan Türk bilim insanıyım. Ben kimim?",
              options: ["Harezmi", "Cahit Arf", "Aziz Sancar"],
              correct: 2
            }
          ]
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          questions: [
            { q: "Ege Bölgesi zeytinle tanınır.", correct: true },
            { q: "Akdeniz Bölgesi’nde portakal yetişir.", correct: true },
            { q: "Seksek geleneksel çocuk oyunlarından biridir.", correct: true },
            { q: "Atatürk plansız çalışmayı severdi.", correct: false },
            { q: "Cahit Arf matematik alanında önemli bir isimdir.", correct: true }
          ]
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Tekrar Sandığı 4",
      activities: [
        {
          type: "info",
          title: "Tekrar Sandığı 4",
          text: "Bu sandıkta eklerle yeni kelime yapma, cümlede kim ne yaptı, hal ekleri, gerçek ve mecaz anlam, deyimler tekrar edilir."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Eklerle Kelime Yap",
          desc: "Açıklamayı karşılayan kelimeyi seç.",
          questions: [
            { q: "Kitap koyulan yer", options: ["Kitapçı", "Kitaplık", "Kitapsız"], correct: 1 },
            { q: "Çiçek satan kişi", options: ["Çiçekli", "Çiçeklik", "Çiçekçi"], correct: 2 },
            { q: "Şekeri olmayan çay", options: ["Şekersiz çay", "Şekerli çay", "Şekerlik"], correct: 0 },
            { q: "Tuz koyulan kap", options: ["Tuzlu", "Tuzsuz", "Tuzluk"], correct: 2 }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Kim Ne Yaptı?",
          sentences: [
            { text: "Ali top oynadı. Kim? {blank} Ne yaptı? {blank}", answer: ["Ali", "oynadı"], options: ["Ali", "oynadı", "Kedi", "içti", "Öğretmen", "anlattı", "Kuş", "uçtu"] },
            { text: "Kedi süt içti. Kim ya da ne? {blank} Ne yaptı? {blank}", answer: ["Kedi", "içti"], options: ["Ali", "oynadı", "Kedi", "içti", "Öğretmen", "anlattı", "Kuş", "uçtu"] },
            { text: "Öğretmen ders anlattı. Kim? {blank} Ne yaptı? {blank}", answer: ["Öğretmen", "anlattı"], options: ["Ali", "oynadı", "Kedi", "içti", "Öğretmen", "anlattı", "Kuş", "uçtu"] },
            { text: "Kuş uçtu. Kim ya da ne? {blank} Ne yaptı? {blank}", answer: ["Kuş", "uçtu"], options: ["Ali", "oynadı", "Kedi", "içti", "Öğretmen", "anlattı", "Kuş", "uçtu"] }
          ]
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
          type: "multiple_choice",
          title: "Etkinlik 4: Deyimin Anlamı",
          desc: "Deyimin anlamını seç.",
          questions: [
            { q: "Etekleri zil çalmak", options: ["Çok sevinmek", "Bir konuşmayı istemeden duymak", "Çok dikkatli korumak", "Heyecandan ne yapacağını şaşırmak"], correct: 0 },
            { q: "Kulak misafiri olmak", options: ["Çok sevinmek", "Bir konuşmayı istemeden duymak", "Çok dikkatli korumak", "Heyecandan ne yapacağını şaşırmak"], correct: 1 },
            { q: "Gözü gibi bakmak", options: ["Çok sevinmek", "Bir konuşmayı istemeden duymak", "Çok dikkatli korumak", "Heyecandan ne yapacağını şaşırmak"], correct: 2 },
            { q: "Eli ayağına dolaşmak", options: ["Çok sevinmek", "Bir konuşmayı istemeden duymak", "Çok dikkatli korumak", "Heyecandan ne yapacağını şaşırmak"], correct: 3 }
          ]
        }
      ]
    }
  },

  "tekrar-5": {
    ulkemiOgreniyorum: {
      title: "Tekrar Sandığı 5",
      activities: [
        {
          type: "true_false",
          title: "Etkinlik 1: Doğru Yanlış",
          questions: [
            { q: "İç Anadolu Türkiye’nin ortasında yer alır.", correct: true },
            { q: "Anıtkabir İstanbul’dadır.", correct: false },
            { q: "29 Ekim Cumhuriyet Bayramı’dır.", correct: true },
            { q: "Karadeniz çay ve fındıkla tanınır.", correct: true },
            { q: "Atasözleri uzun romanlardır.", correct: false }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            { text: "Başkent Ankara {blank} Anadolu Bölgesi’ndedir.", answer: "İç", options: ["İç", "Ankara", "29", "çay"] },
            { text: "Anıtkabir {blank} şehrindedir.", answer: "Ankara", options: ["İç", "Ankara", "29", "çay"] },
            { text: "Cumhuriyet {blank} Ekim’de kutlanır.", answer: "29", options: ["İç", "Ankara", "29", "çay"] },
            { text: "Karadeniz’de {blank} ve fındık yetişir.", answer: "çay", options: ["İç", "Ankara", "29", "çay"] }
          ]
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Tekrar Sandığı 5",
      activities: [
        {
          type: "info",
          title: "Tekrar Sandığı 5",
          text: "Bu sandıkta atasözleri, konu, ana fikir, paragraf sıralama ve anlamlı cümle kurma konuları tekrar edilir."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Atasözünü Anlamıyla Eşleştir",
          desc: "Anlamı verilen atasözünü seç.",
          questions: [
            { q: "Küçük şeyler zamanla büyür.", options: ["Damlaya damlaya göl olur.", "Bir elin nesi var, iki elin sesi var.", "Ağaç yaşken eğilir.", "Sakla samanı, gelir zamanı."], correct: 0 },
            { q: "Birlikte çalışmak daha etkilidir.", options: ["Damlaya damlaya göl olur.", "Bir elin nesi var, iki elin sesi var.", "Ağaç yaşken eğilir.", "Sakla samanı, gelir zamanı."], correct: 1 },
            { q: "Alışkanlıklar küçük yaşta daha kolay kazanılır.", options: ["Damlaya damlaya göl olur.", "Bir elin nesi var, iki elin sesi var.", "Ağaç yaşken eğilir.", "Sakla samanı, gelir zamanı."], correct: 2 },
            { q: "Gereksiz görünen şeyler bir gün işe yarayabilir.", options: ["Damlaya damlaya göl olur.", "Bir elin nesi var, iki elin sesi var.", "Ağaç yaşken eğilir.", "Sakla samanı, gelir zamanı."], correct: 3 }
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
          type: "fill_in_blanks",
          title: "Etkinlik 3: Paragrafı Sırala",
          desc: "Aşağıdaki cümleleri doğru sıraya koy.",
          sentences: [
            { text: "1. {blank}", answer: "Elif sabah erkenden uyandı." },
            { text: "2. {blank}", answer: "Kahvaltısını yaptı." },
            { text: "3. {blank}", answer: "Çantasını kontrol edip kalemlerini yerleştirdi." },
            { text: "4. {blank}", answer: "Sonra kitabını çantasına koydu." },
            { text: "5. {blank}", answer: "Okuldan eve gelince dinlendi." },
            { text: "6. {blank}", answer: "Daha sonra masasına oturup ödevini yapmaya başladı." },
            { text: "7. {blank}", answer: "Ödevini bitirdi." },
            { text: "8. {blank}", answer: "En sonunda ödevini annesine gösterdi." }
          ],
          words: [
            "Sonra kitabını çantasına koydu.",
            "Elif sabah erkenden uyandı.",
            "En sonunda ödevini annesine gösterdi.",
            "Kahvaltısını yaptı.",
            "Okuldan eve gelince dinlendi.",
            "Daha sonra masasına oturup ödevini yapmaya başladı.",
            "Ödevini bitirdi.",
            "Çantasını kontrol edip kalemlerini yerleştirdi."
          ]
        }
      ]
    }
  },
  "tekrar-6": {
    ulkemiOgreniyorum: {
      title: "GENEL TEKRAR SANDIĞI 6: Ülkemi Tanıyorum",
      activities: [
        {
          type: "true_false",
          title: "Etkinlik 1: Doğru Yanlış",
          desc: "Tüm sandıklardan öğrendiğin bilgileri hatırla. Coğrafya, Atatürk, bayramlar, kültür, sanat, gelenekler, bilim ve gelecek konuları birlikte kullanıldı.",
          questions: [
            { q: "Türkiye bir yarımadadır.", correct: true },
            { q: "Atatürk Selanik’te doğmuştur.", correct: true },
            { q: "29 Ekim Cumhuriyet Bayramı’dır.", correct: true },
            { q: "Karadeniz portakal bahçeleriyle tanınır.", correct: false },
            { q: "Ebru sanatı su üzerinde yapılır.", correct: true },
            { q: "İstiklal Marşı Mehmet Akif Ersoy tarafından yazılmıştır.", correct: true },
            { q: "Alper Gezeravcı Türkiye’nin uzaya giden ilk astronotudur.", correct: true },
            { q: "Göbeklitepe Güneydoğu Anadolu Bölgesi’ndedir.", correct: true }
          ]
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 2: Boşluk Doldurma",
          sentences: [
            { text: "Türkiye’nin üç tarafı {blank} çevrilidir.", answer: "denizlerle", options: ["denizlerle", "bayramdır", "İç", "Ersoy", "teknolojileri"] },
            { text: "23 Nisan çocuklara armağan edilen bir {blank}.", answer: "bayramdır", options: ["denizlerle", "bayramdır", "İç", "Ersoy", "teknolojileri"] },
            { text: "Ankara {blank} Anadolu Bölgesi’ndedir.", answer: "İç", options: ["denizlerle", "bayramdır", "İç", "Ersoy", "teknolojileri"] },
            { text: "İstiklal Marşı’nın yazarı Mehmet Akif {blank}.", answer: "Ersoy", options: ["denizlerle", "bayramdır", "İç", "Ersoy", "teknolojileri"] },
            { text: "Canan Dağdeviren sağlık {blank} üzerine çalışır.", answer: "teknolojileri", options: ["denizlerle", "bayramdır", "İç", "Ersoy", "teknolojileri"] }
          ]
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "TEKRAR SANDIĞI 6",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı",
          text: "Artık harfleri, heceleri, kelimeleri ve cümleleri tanıyorsun. Büyük harf kullanmayı, noktalama işaretlerini, soru ekini, kelime anlamlarını, atasözlerini ve ana fikri öğrendin.\n\nDil bilgisi sadece kuralları ezberlemek değildir. Daha doğru okumak, daha açık yazmak ve kendini daha iyi anlatmak için kullanılır.\n\nBir cümleyi okurken şunlara dikkat edebiliriz:\n- Cümle büyük harfle başlamış mı?\n- Özel adlar doğru yazılmış mı?\n- Nokta, virgül ya da soru işareti doğru yerde mi?\n- Kelimeler anlamlı sırada mı?\n- Cümle ne anlatıyor?\n\nBu sandıkta öğrendiklerini seçenekler ve eşleştirmelerle tekrar edeceksin."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Doğru Yazımı Seç",
          desc: "Doğru yazılmış cümleyi seç.",
          questions: [
            { q: "Hangi cümle doğru yazılmıştır?", options: ["ali elma, armut ve muz aldı.", "Ali elma, armut ve muz aldı."], correct: 1 },
            { q: "Hangi cümle doğru yazılmıştır?", options: ["Bu kitap senin mi?", "Bu kitap seninmi?"], correct: 0 },
            { q: "Hangi cümle doğru yazılmıştır?", options: ["Kedim Pamuk süt içti.", "Kedim pamuk süt içti."], correct: 0 },
            { q: "Hangi cümle doğru yazılmıştır?", options: ["Elif kitap okudu.", "Elif okudu kitap."], correct: 0 },
            { q: "Hangi cümle doğru yazılmıştır?", options: ["Ben 3. sınıfa geçtim.", "Ben 3 sınıfa geçtim."], correct: 0 },
            { q: "Hangi cümle doğru yazılmıştır?", options: ["Masada kalem, silgi ve defter var.", "Masada kalem silgi ve defter var."], correct: 0 }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Boşluğu Doğru Tamamla",
          desc: "Cümledeki boşluğu doğru seçenekle tamamla.",
          questions: [
            { q: "Büyük kelimesinin zıttı {blank} kelimesidir.", options: ["küçük", "uzun"], correct: 0 },
            { q: "Hikaye kelimesinin eş anlamlısı {blank} kelimesidir.", options: ["öykü", "soru"], correct: 0 },
            { q: "Damlaya damlaya {blank} olur.", options: ["göl", "taş"], correct: 0 },
            { q: "Bir elin nesi var, iki elin {blank} var.", options: ["sesi", "rengi"], correct: 0 },
            { q: "Cümle soru soruyorsa sonuna {blank} konur.", options: ["soru işareti", "virgül"], correct: 0 },
            { q: "Liste yaparken kelimelerin arasına {blank} koyabiliriz.", options: ["virgül", "soru işareti"], correct: 0 }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 3: Anlamı Seç",
          desc: "Cümledeki kelimenin anlamını seç.",
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
          type: "multiple_choice",
          title: "Etkinlik 4: Eşleştirme",
          desc: "Soldaki ifadeleri doğru cevaplarla eşleştir.",
          questions: [
            {
              q: "Damlaya damlaya göl olur.",
              options: [
                "Küçük birikimler zamanla büyür.",
                "Alışkanlıklar küçük yaşta daha kolay kazanılır.",
                "Nazik konuşmak sorunları çözmeye yardım eder.",
                "Büyük ve küçük",
                "Hikaye ve öykü",
                "Soru işareti"
              ],
              correct: 0
            },
            {
              q: "Ağaç yaşken eğilir.",
              options: [
                "Küçük birikimler zamanla büyür.",
                "Alışkanlıklar küçük yaşta daha kolay kazanılır.",
                "Nazik konuşmak sorunları çözmeye yardım eder.",
                "Büyük ve küçük",
                "Hikaye ve öykü",
                "Soru işareti"
              ],
              correct: 1
            },
            {
              q: "Tatlı dil yılanı deliğinden çıkarır.",
              options: [
                "Küçük birikimler zamanla büyür.",
                "Alışkanlıklar küçük yaşta daha kolay kazanılır.",
                "Nazik konuşmak sorunları çözmeye yardım eder.",
                "Büyük ve küçük",
                "Hikaye ve öykü",
                "Soru işareti"
              ],
              correct: 2
            },
            {
              q: "Zıt anlamlı kelime çifti",
              options: [
                "Küçük birikimler zamanla büyür.",
                "Alışkanlıklar küçük yaşta daha kolay kazanılır.",
                "Nazik konuşmak sorunları çözmeye yardım eder.",
                "Büyük ve küçük",
                "Hikaye ve öykü",
                "Soru işareti"
              ],
              correct: 3
            },
            {
              q: "Eş anlamlı kelime çifti",
              options: [
                "Küçük birikimler zamanla büyür.",
                "Alışkanlıklar küçük yaşta daha kolay kazanılır.",
                "Nazik konuşmak sorunları çözmeye yardım eder.",
                "Büyük ve küçük",
                "Hikaye ve öykü",
                "Soru işareti"
              ],
              correct: 4
            },
            {
              q: "Soru cümlesinin sonuna gelen işaret",
              options: [
                "Küçük birikimler zamanla büyür.",
                "Alışkanlıklar küçük yaşta daha kolay kazanılır.",
                "Nazik konuşmak sorunları çözmeye yardım eder.",
                "Büyük ve küçük",
                "Hikaye ve öykü",
                "Soru işareti"
              ],
              correct: 5
            }
          ]
        }
      ]
    }
  }
};
