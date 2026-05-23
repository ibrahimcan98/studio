export interface Question {
  id?: string | number;
  q: string;
  options: string[];
  correct: number | string;
}

export interface StoryData {
  title: string;
  theme: string;
  text: string;
  questions: Question[];
}

export interface Rule {
  name: string;
  desc: string;
  example?: string;
}

export interface LangData {
  title: string;
  info: {
    title: string;
    rules: Rule[];
  };
  etkinlik1: {
    title: string;
    desc: string;
    questions: any[];
  };
  etkinlik2: {
    title: string;
    desc: string;
    questions: any[];
  };
  country?: CountryData;
}

export interface CountryData {
  title: string;
  info: {
    title: string;
    rules: Rule[];
  };
  etkinlik1: {
    title: string;
    desc: string;
    questions: any[];
  };
  etkinlik2: {
    title: string;
    desc: string;
    questions: any[];
  };
}

export interface ChestContent {
  story: StoryData;
  lang?: LangData;
  country?: CountryData;
}

export const CHESTS_CONTENT: Record<string, ChestContent> = {
  "1": {
    story: {
      title: "KIRMIZI KULÜBE",
      theme: "Yardımlaşma",
      text: "Ali ve Ömer öğleden sonra bahçede oynuyorlardı. Büyük ağacın dalında eski bir kuş yuvası gördüler. Yuvanın tahtaları eskimiş ve rengi solmuştu. Ali koşarak evden kırmızı bir boya kutusu getirdi. Ömer ise elinde iki tane geniş fırça tutuyordu. İki arkadaş el ele verip yuvayı güzelce boyadılar. Kulübe parlak kırmızı rengiyle harika görünüyordu. Son olarak içine bir avuç sarı yem koydular.",
      questions: [
        {
          id: 1,
          q: "Ali ve Ömer ne zaman bahçede oynuyorlardı?",
          options: ["Sabah erkenden", "Öğleden sonra", "Gece vakti"],
          correct: 1,
        },
        {
          id: 2,
          q: "Çocuklar ağacın dalında ne gördüler?",
          options: [
            "Eski bir kuş yuvası",
            "Büyük bir uçurtma",
            "Renkli bir top",
          ],
          correct: 0,
        },
        {
          id: 3,
          q: "Ali evden ne getirdi?",
          options: [
            "Yeşil bir sulama kabı",
            "Kırmızı bir boya kutusu",
            "Küçük bir tahta merdiven",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Ömer'in elinde ne vardı?",
          options: [
            "İki tane geniş fırça",
            "Üç tane renkli balon",
            "Büyük bir torba yem",
          ],
          correct: 0,
        },
        {
          id: 5,
          q: "Boyanan kulübe hangi renk oldu?",
          options: ["Mavi", "Yeşil", "Kırmızı"],
          correct: 2,
        },
        {
          id: 6,
          q: "Çocuklar kulübenin içine en son ne koydular?",
          options: [
            "Küçük bir su bardağı",
            "Bir avuç sarı yem",
            "Yumuşak bir bez",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🎨 Harflerin Boyu!",
        rules: [
          {
            name: "Cümle Başları",
            desc: "Yazı yazarken kurduğumuz her cümlenin ilk harfi her zaman Büyük yazılır!",
            example: "Bugün hava çok güzel.",
          },
          {
            name: "Özel İsimler",
            desc: "İnsan isimleri, şehir isimleri, ülke isimleri ve evcil hayvanlarımıza verdiğimiz isimler cümlenin neresinde olursa olsun hep Büyük harfle başlar!",
            example: "Arkadaşım Ali, İstanbul’dan kedisi Pamuk ile geldi.",
          },
          {
            name: "Diğerleri",
            desc: "Sıradan esyalar (masa, kalem, ağaç) ise cümle içinde küçük harfle yazılır.",
            example: "",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Harf Avcısı",
        desc: "Cümlelerde boş bırakılan yerlere gelmesi gereken doğru harfi (Büyük veya Küçük) seçiniz.",
        questions: [
          {
            id: 1,
            q: "Dün akşam ....eyda bize gelip ders çalıştı.",
            options: ["Ş", "ş"],
            correct: 0,
          },
          {
            id: 2,
            q: "....edim Pamuk koltukta uyuyor.",
            options: ["K", "k"],
            correct: 0,
          },
          {
            id: 3,
            q: "Gelecek yaz ....zmir'e tatile gideceğiz.",
            options: ["İ", "i"],
            correct: 0,
          },
          {
            id: 4,
            q: "Bahçedeki küçük ....öpek kemiğini yiyor.",
            options: ["K", "k"],
            correct: 1,
          },
          {
            id: 5,
            q: "29 Ekim Cumhuriyet Bayramı ....kim ayında kutlanır.",
            options: ["E", "e"],
            correct: 0,
          },
          {
            id: 6,
            q: "Sınıfımıza yeni gelen arkadaşımın adı ....mer'dir.",
            options: ["Ö", "ö"],
            correct: 0,
          },
          {
            id: 7,
            q: "Masanın üzerinde iki tane ....ırmızı kalem duruyor.",
            options: ["K", "k"],
            correct: 1,
          },
          {
            id: 8,
            q: "....ürkiye, üç tarafı denizlerle çevrili bir ülkedir.",
            options: ["T", "t"],
            correct: 0,
          },
          {
            id: 9,
            q: "En sevdiğim arkadaşım ....li bugün okula gelmedi.",
            options: ["A", "a"],
            correct: 0,
          },
          {
            id: 10,
            q: "Annem pazardan taze ....limon aldı.",
            options: ["L", "l"],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Cümle Mimarı",
        desc: "Karışık verilen kelimeleri, büyük harf kuralına ve anlam akışına dikkat ederek anlamlı bir cümle olacak şekilde sıraya diziniz.",
        questions: [
          {
            words: ["ankara'dan", "geldi", "amcam", "dün"],
            correct: "Amcam dün Ankara'dan geldi.",
          },
          {
            words: ["ayşe", "aldı", "yeni", "kalem"],
            correct: "Ayşe yeni kalem aldı.",
          },
          {
            words: ["süt", "içti", "kedim", "pamuk"],
            correct: "Kedim Pamuk süt içti.",
          },
          {
            words: ["gittik", "pazar günü", "istanbul'a", "biz"],
            correct: "Biz pazar günü İstanbul'a gittik.",
          },
          {
            words: ["top", "bahçede", "murat", "oynadı"],
            correct: "Murat bahçede top oynadı.",
          },
          {
            words: ["kitap", "okudu", "odasında", "zeynep"],
            correct: "Zeynep odasında kitap okudu.",
          },
          {
            words: ["köpeğim", "havladı", "karabaş", "gece"],
            correct: "Köpeğim Karabaş gece havladı.",
          },
          {
            words: ["yıkadı", "ellerini", "suyla", "kerem"],
            correct: "Kerem ellerini suyla yıkadı.",
          },
          {
            words: ["uyandı", "erkenden", "sabah", "elif"],
            correct: "Elif sabah erkenden uyandı.",
          },
          {
            words: ["izledi", "kuşları", "balkondan", "pelin"],
            correct: "Pelin balkondan kuşları izledi.",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🗺️ Dünyadaki Adresimiz!",
          rules: [
            {
              name: "Üç Tarafı Deniz",
              desc: "Ülkemiz Türkiye, haritaya bakıldığında üç tarafı masmavi denizlerle çevrili harika bir yarımadadır!",
              example: "",
            },
            {
              name: "Köprü Ülke",
              desc: "Dünyadaki iki dev kıta olan Asya ve Avrupa'yı birbirine sımsıkı bağlayan çok önemli, sihirli bir köprü gibiyiz.",
              example: "",
            },
            {
              name: "Değerli Konum",
              desc: "Bu özel konumumuz sayesinde ülkemiz dünyadaki en değerli ve stratejik yerlerden birine sahiptir.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Konum Avcısı",
          desc: "Türkiye'nin dünyadaki konumuyla ilgili soruları dikkatlice okuyup doğru seçeneği işaretleyiniz.",
          questions: [
            {
              id: 1,
              q: "Haritaya bakıldığında Türkiye'nin üç tarafı neyle çevrilidir?",
              options: [
                "Büyük dağlarla",
                "Masmavi denizlerle",
                "Derin kanyonlarla",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "Üç tarafı denizlerle çevrili, bir tarafı karaya bağlı olan kara parçalarına ne ad verilir?",
              options: ["Ada", "Yarımada", "Ova"],
              correct: 1,
            },
            {
              id: 3,
              q: "Türkiye, dünyadaki hangi iki dev kıtayı birbirine bağlayan bir köprü gibidir?",
              options: [
                "Asya - Avrupa",
                "Afrika - Amerika",
                "Asya - Antarktika",
              ],
              correct: 0,
            },
            {
              id: 4,
              q: "Ülkemizin Asya ve Avrupa kıtaları arasında bulunması ona nasıl bir özellik kazandırır?",
              options: [
                "Sadece soğuk bir ülke olmasını",
                "Stratejik ve çok değerli bir köprü olmasını",
                "Ormanlarının yok olmasını",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Türkiye coğrafi şekil olarak aşağıdakilerden hangisine benzer?",
              options: [
                "Tam bir yuvarlak adaya",
                "Geniş bir yarımadaya",
                "Küçük bir taş parçasına",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Kıtaları birbirine bağlayan ülkemizin bu özel konumuna ne ad verilir?",
              options: ["Sözlük sırası", "Coğrafi konum", "Hece bilgisi"],
              correct: 1,
            },
            {
              id: 7,
              q: "Türkiye haritasının üst, sol ve alt kısımlarında somut olarak ne yer alır?",
              options: ["Denizler", "Çöller", "Büyük göller"],
              correct: 0,
            },
            {
              id: 8,
              q: '"Türkiye, dünyadaki ticari yolların tam ortasındadır." Bu durum ülkemizin hangi özelliğiyle ilgilidir?',
              options: [
                "Nüfusunun az olmasıyla",
                "Stratejik konumuyla",
                "Kitap okuma sevgisiyle",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Aşağıdaki ifadelerden hangisi ülkemizin konumu için doğrudur?",
              options: [
                "Etrafında hiç deniz yoktur.",
                "Asya ve Avrupa'yı birbirine bağlar.",
                "Sadece bir kıtada toprağı vardır.",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Türkiye'nin dünyadaki yeri aşağıdakilerden hangisine benzetilmiştir?",
              options: [
                "Büyük bir kaleye",
                "Stratejik bir köprüye",
                "Eski bir sandığa",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Harita Dedektifi",
          desc: "Cümlelerde boş bırakılan yerleri Kültür Kartı'ndaki bilgilere uygun şekilde seçeneklerden bularak tamamlayınız.",
          questions: [
            {
              q: "Türkiye, üç tarafı denizlerle çevrili somut bir .................... özelliğindedir.",
              words: ["ada", "yarımada"],
              correct: "yarımada",
            },
            {
              q: "Ülkemiz, Asya ve .................... kıtalarını birbirine bağlar.",
              words: ["Avrupa", "Afrika"],
              correct: "Avrupa",
            },
            {
              q: "Türkiye, kıtalar arasında duran çok değerli stratejik bir .................... gibidir.",
              words: ["duvar", "köprü"],
              correct: "köprü",
            },
            {
              q: "Haritayı açtığımızda ülkemizin .................... tarafının denizlerle kaplı olduğunu görürüz.",
              words: ["iki", "üç"],
              correct: "üç",
            },
            {
              q: "Asya kıtası ile Avrupa kıtası ülkemizin toprakları sayesinde birbiriyle ....................",
              words: ["birleşir", "ayrılır"],
              correct: "birleşir",
            },
            {
              q: "Türkiye'nin dünyadaki adresi onun çok .................... bir yer olmasını sağlar.",
              words: ["sıradan", "değerli"],
              correct: "değerli",
            },
            {
              q: "Ülkemiz coğrafi konumu sebebiyle dünya ülkeleri arasında büyük bir .................... sahiptir.",
              words: ["öneme", "tehlikeye"],
              correct: "öneme",
            },
            {
              q: "Denizlerin ortasındaki bu güzel yarımada bizim .................... topraklarımızdır.",
              words: ["Türkiye", "Almanya"],
              correct: "Türkiye",
            },
            {
              q: "Asya'dan Avrupa'ya gitmek isteyen bir yolcu yolculuk sırasında ülkemizden ....................",
              words: ["geçebilir", "geçemez"],
              correct: "geçebilir",
            },
            {
              q: "Üç tarafımızın deniz olması ülkemize harika bir .................... güzelliği katar.",
              words: ["doğa", "çöl"],
              correct: "doğa",
            },
          ],
        },
      },
    },
  },
  "2": {
    story: {
      title: "İKİ RENKLİ ELMA",
      theme: "Paylaşma",
      text: "Murat okul çıkışında yeşil parktaki banka oturdu. Karnı çok acıkmıştı ve çantasını yanına koydu. Cebinden büyük ve kıpkırmızı bir elma çıkardı. Tam o sırada yanındaki boş koltuğa bir çocuk oturdu. Çocuk üzgün bir şekilde Murat'ın elindeki elmaya bakıyordu. Murat cebinden küçük meyve bıçağını dikkatlice çıkardı. Elmayı tam ortadan eşit bir şekilde ikiye böldü. Yarısını yanındaki çocuğa uzattı ve birlikte neşeyle yediler.",
      questions: [
        {
          id: 1,
          q: "Murat okul çıkışında nereye oturdu?",
          options: [
            "Sınıftaki sırasına",
            "Yeşil parktaki banka",
            "Evdeki yumuşak koltuğa",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Murat cebinden ne çıkardı?",
          options: [
            "Büyük ve kıpkırmızı bir elma",
            "Sarı bir muz",
            "Renkli bir oyuncak araba",
          ],
          correct: 0,
        },
        {
          id: 3,
          q: "Murat'ın yanına oturan çocuğun durumu nasıldı?",
          options: [
            "Çok neşeliydi ve gülüyordu",
            "Üzgündü ve elmaya bakıyordu",
            "Kitap okuyordu",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Murat elmayı neyle kesti?",
          options: ["Büyük bir makasla", "Küçük meyve bıçağıyla", "Cetvelle"],
          correct: 1,
        },
        {
          id: 5,
          q: "Murat elmayı nasıl böldü?",
          options: [
            "Üç parçaya ayırdı",
            "Sadece kabuğunu soydu",
            "Tam ortadan ikiye böldü",
          ],
          correct: 2,
        },
        {
          id: 6,
          q: "Hikayenin sonunda ne yaptılar?",
          options: [
            "Elmayı birlikte neşeyle yediler",
            "Parkta top oynadılar",
            "Eve doğru yürüdılar",
          ],
          correct: 0,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🗣️ Ağzımızın Tek Hareketi!",
        rules: [
          {
            name: "Tanım",
            desc: "Konuşurken ağzımızın tek bir hareketiyle dışarı çıkan ses topluluğuna hece denir. Kelimeleri hecelerine ayırırken aralarına minik çizgiler koyarız.",
            example: "E - el - ma (2 hece), A - ra - ba (3 hece)",
          },
          {
            name: "Sihirli İpucu",
            desc: "Bir kelimede kaç hece olduğunu bulmak çok kolay! Kelimedeki ünlü (sesli) harfleri (a, e, ı, i, o, ö, u, ü) sayman yeterlidir.",
            example:
              '"Kelebek" kelimesinde 3 tane ünlü harf var, yani bu kelime tam 3 heceli!',
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Hece Sayacı",
        desc: "Sorularda verilen kelimelerin hece sayılarını doğru seçenekten bulunuz.",
        questions: [
          {
            id: 1,
            q: '"Türkiye" kelimesi kaç hecelidir?',
            options: ["2", "3", "4"],
            correct: 1,
          },
          {
            id: 2,
            q: '"Park" kelimesi kaç hecelidir?',
            options: ["1", "2", "3"],
            correct: 0,
          },
          {
            id: 3,
            q: '"Bilgisayar" kelimesi kaç hecelidir?',
            options: ["3", "4", "5"],
            correct: 1,
          },
          {
            id: 4,
            q: '"Domates" kelimesi kaç hecelidir?',
            options: ["2", "3", "4"],
            correct: 1,
          },
          {
            id: 5,
            q: '"Sert" kelimesi kaç hecelidir?',
            options: ["1", "2", "3"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Oyuncak" kelimesi kaç hecelidir?',
            options: ["2", "3", "4"],
            correct: 1,
          },
          {
            id: 7,
            q: '"Kelebek" kelimesi kaç hecelidir?',
            options: ["2", "3", "4"],
            correct: 1,
          },
          {
            id: 8,
            q: '"Pencere" kelimesi kaç hecelidir?',
            options: ["2", "3", "4"],
            correct: 2,
          },
          {
            id: 9,
            q: '"Limon" kelimesi kaç hecelidir?',
            options: ["1", "2", "3"],
            correct: 1,
          },
          {
            id: 10,
            q: '"Masa" kelimesi kaç hecelidir?',
            options: ["2", "3", "4"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Hece Yapbozu",
        desc: "Karışık olarak verilen heceleri birleştirerek anlamlı bir kelime oluşturunuz.",
        questions: [
          { words: ["ta", "çan"], correct: "Çanta" },
          { words: ["ba", "ra", "a"], correct: "Araba" },
          { words: ["lık", "ba"], correct: "Balık" },
          { words: ["ter", "def"], correct: "Defter" },
          { words: ["sap", "hes"], correct: "Hesap" },
          { words: ["le", "ka", "ler"], correct: "Kaleler" },
          { words: ["fek", "kö"], correct: "Köpek" },
          { words: ["çi", "çek"], correct: "Çiçek" },
          { words: ["ra", "sı"], correct: "Sıra" },
          { words: ["bek", "le", "ke"], correct: "Kelebek" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🌊 Masmavi Vatanımız!",
          rules: [
            {
              name: "Karadeniz",
              desc: "Ülkemizin tam kuzeyinde (en üstte) yer alan, hırçın dalgalı denizimizdir.",
              example: "",
            },
            {
              name: "Akdeniz",
              desc: "Ülkemizin tam güneyinde (en altta) yer alan, sıcak ve mavi denizimizdir.",
              example: "",
            },
            {
              name: "Ege Denizi",
              desc: "Ülkemizin batısında (sol tarafta) bulunan, çok sayıda girintili çıkıntılı kıyısı olan denizimizdir.",
              example: "",
            },
            {
              name: "Marmara Denizi",
              desc: "Topraklarımızın içinde kalan, İstanbul ve Çanakkale boğazlarına ev sahipliği yapan sihirli bir iç denizimizdir.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Deniz Kaşifi",
          desc: "Denizlerimiz ve Mavi Vatanımızla ilgili soruların doğru cevabını bulunuz.",
          questions: [
            {
              id: 1,
              q: "Ülkemizin kuzeyinde (en üstte) yer alan hırçın dalgalı denizimizin adı nedir?",
              options: ["Akdeniz", "Karadeniz", "Ege Denizi"],
              correct: 1,
            },
            {
              id: 2,
              q: "Türkiye'nin güneyinde (en altta) bulunan sıcak denizimizin adı nedir?",
              options: ["Karadeniz", "Akdeniz", "Marmara Denizi"],
              correct: 1,
            },
            {
              id: 3,
              q: 'Topraklarımızın tamamen içinde yer alan ve bir "iç deniz" olan denizimiz hangisidir?',
              options: ["Ege Denizi", "Marmara Denizi", "Karadeniz"],
              correct: 1,
            },
            {
              id: 4,
              q: "İstanbul ve Çanakkale Boğazları hangi denizimizin sınırları içinde yer alır?",
              options: ["Akdeniz", "Marmara Denizi", "Ege Denizi"],
              correct: 1,
            },
            {
              id: 5,
              q: "Batı tarafımızda bulunan ve girintili çıkıntılı kıyıları olan denizimiz hangisidir?",
              options: ["Ege Denizi", "Karadeniz", "Akdeniz"],
              correct: 0,
            },
            {
              id: 6,
              q: "Ülkemizin etrafındaki deniz sularına ve onların haklarına ne ad verilir?",
              options: ["Kara Vatan", "Mavi Vatan", "Uzay Üssü"],
              correct: 1,
            },
            {
              id: 7,
              q: "Türkiye'nin sınırları içinde toplam kaç tane deniz bulunmaktadır?",
              options: ["2", "3", "4"],
              correct: 2,
            },
            {
              id: 8,
              q: "Hangi denizimiz tamamen ülkemizin topraklarıyla çevrili gizli bir havuz gibidir?",
              options: ["Karadeniz", "Marmara Denizi", "Akdeniz"],
              correct: 1,
            },
            {
              id: 9,
              q: "Kıyılarında limon ve portakal ağaçlarının yetiştiği en sıcak denizimiz hangisidir?",
              options: ["Karadeniz", "Akdeniz", "Marmara Denizi"],
              correct: 1,
            },
            {
              id: 10,
              q: "Denizlerimizin ülkemize sağladığı en büyük somut fayda hangisidir?",
              options: [
                "Hava sıcaklığını her gün sıfır yapmak",
                "Balıkçılık, turizm ve deniz ticareti sağlaması",
                "Toprakları tamamen kurutması",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Mavi Vatan Eşleştirmesi",
          desc: "Denizlerimizle ilgili verilen ifadelerin doğru mu yanlış mı olduğunu parantez içine yazarak eşleştiriniz.",
          questions: [
            {
              q: "Karadeniz, ülkemizin tam güneyinde yer alan en sıcak denizimizdir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Marmara Denizi, Türkiye'nin bir iç denizidir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Ülkemizin etrafındaki deniz alanlarına Mavi Vatan denir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Ege Denizi ülkemizin en doğu ucunda, dağların arkasındadır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Akdeniz, güney kıyılarımızı saran masmavi bir denizdir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Türkiye'nin etrafında toplamda beş adet büyük deniz vardır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "İstanbul Boğazı, Marmara Denizi ile bağlantılıdır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Hırçın dalgalarıyla bilinen denizimiz Ege Denizi'dir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Marmara Denizi'nin etrafı tamamen Türkiye topraklarıyla çevrilidir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Denizlerimiz sayesinde ülkemizde deniz ticareti ve gemi yolculukları yapılabilir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
          ],
        },
      },
    },
  },
  "3": {
    story: {
      title: "MAVİ KASE",
      theme: "Hayvan Sevgisi",
      text: "Zeynep mutfak penceresinden dışarıya doğru baktı. Bahçe kapısının önünde küçük, beyaz bir kedi duruyordu. Kedinin tüyleri soğuk rüzgardan hafifçe titriyordu. Zeynep hemen tezgahın üzerindeki mavi kaseyi eline aldı. Buzdolabından soğuk süt şişesini çıkardı. Kasenin içine dikkatlice beyaz sütü doldurdu. Koşarak bahçe kapısına çıktı ve kaseyi yere bıraktı. Küçük kedi hemen kaseye yaklaştı ve sütü içti.",
      questions: [
        {
          id: 1,
          q: "Zeynep dışarıya nereden baktı?",
          options: [
            "Odasının kapısından",
            "Mutfak penceresinden",
            "Balkon demirlerinden",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Bahçe kapısının önündeki kedi ne renkliydi?",
          options: ["Siyah", "Beyaz", "Siyah beyaz lekeli"],
          correct: 1,
        },
        {
          id: 3,
          q: "Kedinin tüyleri neden titriyordu?",
          options: [
            "Islandığı için",
            "Soğuk rüzgardan dolayı",
            "Korktuğu için",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Zeynep'in eline aldığı kasenin rengi nedir?",
          options: ["Mavi", "Kırmızı", "Sarı"],
          correct: 0,
        },
        {
          id: 5,
          q: "Zeynep kasenin içine buzdolabından ne doldurdu?",
          options: ["Su", "Meyve suyu", "Süt"],
          correct: 2,
        },
        {
          id: 6,
          q: "Zeynep kaseyi nereye bıraktı?",
          options: [
            "Ağacın altına",
            "Bahçe kapısının önüne",
            "Merdivenin basamağına",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🔤 Harf Treni!",
        rules: [
          {
            name: "Harf",
            desc: "Konuşurken çıkardığımız sesleri yazmak için kullandığımız işaretlere harf denir. Harflerin sırayla dizildiği trene ise Alfabe diyoruz. Alfabemizde tam 29 harf var!",
            example: "",
          },
          {
            name: "Ünlü (Sesli) Harfler",
            desc: "Ağzımızdan rahatça çıkan harflerdir (8 Tane).",
            example: "A, E, I, İ, O, Ö, U, Ü",
          },
          {
            name: "Ünsüz (Sessiz) Harfler",
            desc: "Tek başına ses çıkaramayan, yanına bir ünlü isteyen harflerdir (21 Tane).",
            example: "B, C, D, F, G...",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Harf Sınıflandırıcı",
        desc: "Verilen harflerin türünü doğru kutuyla eşleştiriniz.",
        questions: [
          {
            id: 1,
            q: '"A" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 0,
          },
          {
            id: 2,
            q: '"B" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 1,
          },
          {
            id: 3,
            q: '"E" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 0,
          },
          {
            id: 4,
            q: '"M" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 1,
          },
          {
            id: 5,
            q: '"O" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 0,
          },
          {
            id: 6,
            q: '"T" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 1,
          },
          {
            id: 7,
            q: '"Ü" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 0,
          },
          {
            id: 8,
            q: '"K" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 1,
          },
          {
            id: 9,
            q: '"İ" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Z" harfi',
            options: ["Ünlü (Sesli) Harf", "Ünsüz (Sessiz) Harf"],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Gizli Kelime",
        desc: "Karışık verilen harfleri birleştirerek anlamlı ve somut bir kelime oluşturunuz.",
        questions: [
          { words: ["k", "t", "a", "i", "p"], correct: "Kitap" },
          { words: ["m", "a", "l", "e", "k"], correct: "Kalem" },
          { words: ["s", "a", "m", "a"], correct: "Masa" },
          { words: ["u", "k", "ş"], correct: "Kuş" },
          { words: ["k", "e", "d", "i"], correct: "Kedi" },
          { words: ["f", "e", "d", "t", "e", "r"], correct: "Defter" },
          { words: ["a", "a", "ğ", "ç"], correct: "Ağaç" },
          { words: ["ı", "r", "s", "a"], correct: "Sıra" },
          { words: ["e", "v"], correct: "Ev" },
          { words: ["t", "o", "p"], correct: "Top" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "☀️ Dört Mevsim Bir Arada!",
          rules: [
            {
              name: "Kar ve Deniz Yan Yana",
              desc: "Bir yanda yüksek dağlarda (örneğin Erzurum'da) lapa lapa kar yağarken ve insanlar kayak yaparken; aynı gün güney kıyılarımızda (örneğin Antalya'da) hava sıpsıcaktır ve insanlar denize girip yüzebilirler.",
              example: "",
            },
            {
              name: "Zengin İklim",
              desc: "Bu harika çeşitliliğe ülkemizin zengin iklim yapısı denir ve bu durum dünyada çok az ülkeye nasip olur.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: İklim Dedektifi",
          desc: "Ülkemizin iklim ve mevsim çeşitliliğiyle ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Türkiye'de aynı anda farklı mevsim özelliklerinin yaşanabilmesine ne ad verilir?",
              options: [
                "Harf bilgisi",
                "Eşsiz iklim yapısı",
                "Sözlük sıralaması",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "Ülkemizin bir ucunda kar yağarken diğer ucunda ne yapılabilmektedir?",
              options: [
                "Havuzda buz pateni yapılması",
                "Denizde neşeyle yüzülebilmesi",
                "Kazak giyilip uyunması",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Aynı gün içinde hem kayak yapıp hem denize girilebilen ülke hangisidir?",
              options: ["Türkiye", "Almanya", "İngiltere"],
              correct: 0,
            },
            {
              id: 4,
              q: "Türkiye'de iklim çeşitliliğinin fazla olması aşağıdakilerden hangisini doğrudan etkiler?",
              options: [
                "Sadece tek bir meyve yetişmesini",
                "Birçok farklı meyve, sebze ve bitkinin yetişebilmesini",
                "Denizlerin tamamen kurumasını",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Yüksek dağların tepesinde kar varken sahillerin sıcak olması neyin somut bir göstergesidir?",
              options: [
                "Dünyanın döndüğünün",
                "Ülkemizin zengin iklim yapısının",
                "Her yerde kış yaşandığının",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Türkiye'de aynı anda kaç mevsimin özellikleri bir arada görülebilmektedir?",
              options: ["2", "3", "4"],
              correct: 2,
            },
            {
              id: 7,
              q: "Güneydeki kıyılarda insanlar güneşlenirken yüksek dağlarda ne yapılabilir?",
              options: [
                "Karlar üzerinde kızakla kayılabilir",
                "Çöl kumlarında yürünebilir",
                "Botla denize açılınabilir",
              ],
              correct: 0,
            },
            {
              id: 8,
              q: "Ülkemizin bu eşsiz mevsim yapısı turizm açısından nasıl bir fayda sağlar?",
              options: [
                "Ülkeye hiç turist gelmemesini sağlar",
                "Hem kış turizminin hem yaz turizminin aynı anda yapılabilmesini sağlar",
                "Sadece pazar günleri gezi yapılmasını sağlar",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Aşağıdaki ifadelerden hangisi ülkemizin iklim çeşitliliğinin bir sonucudur?",
              options: [
                "Her bölgenin ağaç türünün ve meyvesinin farklı olması",
                "Türkiye'de hiç nehir kalmaması",
                "Her gün her yere yağmur yağması",
              ],
              correct: 0,
            },
            {
              id: 10,
              q: "Metne göre ülkemizin mevsim yapısı dünyada nasıl değerlendirilir?",
              options: [
                "Çok sıradan ve sıkıcı",
                "Eşsiz ve çok nadir bulunan bir zenginlik",
                "Tamamen buzullarla kaplı",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Mevsim Eşleştirici",
          desc: "Cümlelerdeki boşlukları iklim yapımıza uygun somut kelimelerle doldurunuz.",
          questions: [
            {
              q: "Türkiye'de aynı gün içinde hem kar görebilir hem de .................... girebiliriz.",
              words: ["denize", "buzula"],
              correct: "denize",
            },
            {
              q: "Yüksek dağların zirvesinde kış yaşanırken, sahillerde .................... mevsimi havası olabilir.",
              words: ["sonbahar", "yaz"],
              correct: "yaz",
            },
            {
              q: "Ülkemizin bu zengin yapısına eşsiz .................... yapısı adı verilir.",
              words: ["iklim", "toprak"],
              correct: "iklim",
            },
            {
              q: "Aynı anda .................... mevsimin birden yaşanabilmesi Türkiye'nin büyük bir zenginliğidir.",
              words: ["iki", "dört"],
              correct: "dört",
            },
            {
              q: "İklim çeşitliliği sayesinde ülkemizin her yerinde farklı .................... yetiştirilebilir.",
              words: ["meyveler", "taşlar"],
              correct: "meyveler",
            },
            {
              q: "Bir yanda insanlar kayak yaparken, diğer yanda kıyılarda .................... gözlüğü takıp güneşlenirler.",
              words: ["güneş", "kar"],
              correct: "güneş",
            },
            {
              q: "Ülkemizin dağlık alanlarında lapa lapa .................... yağabilir.",
              words: ["kar", "yaprak"],
              correct: "kar",
            },
            {
              q: "Türkiye'nin bu iklim zenginliği dünyada .................... ülkede bulunan bir özelliktir.",
              words: ["çok az", "her"],
              correct: "çok az",
            },
            {
              q: "Çeşitli hava durumlarının olması doğamızın çok .................... görünmesini sağlar.",
              words: ["renkli", "kurak"],
              correct: "renkli",
            },
            {
              q: "Güneydeki sıcak şehirlerimizde kış aylarında bile hava sıcaklığı oldukça .................... olabilir.",
              words: ["yüksek", "dondurucu"],
              correct: "yüksek",
            },
          ],
        },
      },
    },
  },
  "4": {
    story: {
      title: "KURUYAN ÇİÇEK",
      theme: "Doğa Sevgisi",
      text: "Eren sabah uyanınca doğrudan balkona doğru yürüdü. Köşedeki kahverengi saksının içinde sarı bir çiçek vardı. Çiçeğin yeşil yaprakları susuzluktan aşağıya doğru sarkmıştı. Eren mutfaktaki küçük yeşil sulama kabını eline aldı. Musluktan kabın içine temiz ve serin su doldurdu. Tekrar balkona çıkıp suyu çiçeğin toprağına döktü. Toprak suyu hızlı bir şekilde içine çekti. Akşama doğru sarı çiçeğin yaprakları yeniden canlandı.",
      questions: [
        {
          id: 1,
          q: "Eren sabah uyanınca nereye yürüdü?",
          options: [
            "Doğrudan balkona",
            "Okula gitmek için durağa",
            "Salondaki televizyonun yanına",
          ],
          correct: 0,
        },
        {
          id: 2,
          q: "Saksının rengi neydi?",
          options: ["Kırmızı", "Kahverengi", "Beyaz"],
          correct: 1,
        },
        {
          id: 3,
          q: "Saksıdaki çiçeğin rengi nedir?",
          options: ["Kırmızı", "Mavi", "Sarı"],
          correct: 2,
        },
        {
          id: 4,
          q: "Çiçeğin yaprakları neden aşağıya sarkmıştı?",
          options: [
            "Çok rüzgarlı olduğu için",
            "Susuzluktan dolayı",
            "Üzerine taş düşüldüğü için",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Eren'in sulama kabı ne renkliydi?",
          options: ["Yeşil", "Sarı", "Mavi"],
          correct: 0,
        },
        {
          id: 6,
          q: "Suyu dökünce ne oldu?",
          options: [
            "Toprak suyu içine çekti ve akşama çiçek canlandı",
            "Çiçeğin yaprakları tamamen koptu",
            "Saksı balkondan aşağıya düştü",
          ],
          correct: 0,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🧱 Bilgi Duvarı Nasıl Örülür?",
        rules: [
          {
            name: "Sıralama",
            desc: "Her şey en küçük parça olan Harf ile başlar. Harfler birleşince Hece, heceler birleşince Kelime olur. Anlamlı kelimeler yan yana gelince de en büyük parça olan Cümle kurulur!",
            example:
              "Harf: k -> Hece: ki -> Kelime: kitap -> Cümle: Mert odasında kitap okudu.",
          },
          {
            name: "Cümle Olma Şartı",
            desc: "Bir ifadenin cümle olması için bize tam bir iş, durum veya hareket anlatması gerekir.",
            example: '"Bugün pazardan elma..." bir cümle değildir!',
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Kelime Sayıcı",
        desc: "Aşağıdaki cümlelerin kaç kelimeden olustuğunu bulunuz.",
        questions: [
          {
            id: 1,
            q: '"Kedi süt içti." cümlesi kaç kelimeden oluşmuştur?',
            options: ["2", "3", "4"],
            correct: 1,
          },
          {
            id: 2,
            q: '"Koştum." ifadesi tek başına kaç kelimelik bir cümledir?',
            options: ["1", "2", "3"],
            correct: 0,
          },
          {
            id: 3,
            q: '"Annem lezzetli bir pasta yaptı." cümlesi kaç kelimelidir?',
            options: ["4", "5", "6"],
            correct: 1,
          },
          {
            id: 4,
            q: '"Büyük sarı balon havaya uçtu." cümlesi kaç kelimelidir?',
            options: ["4", "5", "6"],
            correct: 1,
          },
          {
            id: 5,
            q: '"Ali topu bana hızlıca attı." cümlesi kaç kelimelidir?',
            options: ["4", "5", "6"],
            correct: 1,
          },
          {
            id: 6,
            q: '"Dışarıda şiddetli yağmur yağıyor." cümlesi kaç kelimelidir?',
            options: ["3", "4", "5"],
            correct: 0,
          },
          {
            id: 7,
            q: '"Kitabımı odamda okudum." cümlesi kaç kelimelidir?',
            options: ["2", "3", "4"],
            correct: 1,
          },
          {
            id: 8,
            q: '"Kerem ellerini sabunla yıkadı." cümlesi kaç kelimelidir?',
            options: ["3", "4", "5"],
            correct: 1,
          },
          {
            id: 9,
            q: '"Bahçede küçük bir kuş gördüm." cümlesi kaç kelimelidir?',
            options: ["4", "5", "6"],
            correct: 1,
          },
          {
            id: 10,
            q: '"Ufka doğru baktı." cümlesi kaç kelimelidir?',
            options: ["2", "3", "4"],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Cümle Dedektifi",
        desc: "Verilen ifadelerin tam bir cümle olup olmadığını kutularla eşleştiriniz.",
        questions: [
          { words: ["Bugün hava çok güzel."], correct: "Cümle" },
          { words: ["Yarın sabah erkenden"], correct: "Cümle Değil" },
          { words: ["Pazardan kırmızı elma aldım."], correct: "Cümle" },
          { words: ["Arkadaşımla parkta oyun"], correct: "Cümle Değil" },
          { words: ["Ödevlerimi bitirdim."], correct: "Cümle" },
          { words: ["Kedim Pamuk yavaşça"], correct: "Cümle Değil" },
          { words: ["Gülümsedi."], correct: "Cümle" },
          { words: ["Yeni aldığım mavi boya kutusu"], correct: "Cümle Değil" },
          { words: ["Kuşlar neşeyle uçuyor."], correct: "Cümle" },
          { words: ["Masanın üzerindeki defteri"], correct: "Cümle Değil" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🌉 Kıtaları Birleştiren Bölge!",
          rules: [
            {
              name: "İstanbul Boğazı ve Köprüler",
              desc: "Asya ve Avrupa kıtalarını dev köprülerle birbirine bağlayan muhteşem İstanbul Boğazı buradadır.",
              example: "",
            },
            {
              name: "Tarihi Doku",
              desc: "Deniz ortasında parıldayan gizemli Kız Kulesi, büyük saraylar ve tarihi camiler bu bölgenin birleştirici gücünü ve kültürel zenginliğini somut olarak gözler önüne serer.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Bölge Kaşifi",
          desc: "Marmara Bölgesi'nin özellikleri ile ilgili test sorularını cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Asya ve Avrupa kıtalarını dev köprülerle birbirine bağlayan ünlü boğazımız hangisidir?",
              options: [
                "Çanakkale Boğazı değil, İstanbul Boğazı",
                "Gibraltar Boğazı",
                "Süveyş Kanalı",
              ],
              correct: 0,
            },
            {
              id: 2,
              q: "Marmara Denizi'nin ortasında küçük bir adacık üzerinde yer alan tarihi kulenin adı nedir?",
              options: ["Galata Kulesi", "Kız Kulesi", "Saat Kulesi"],
              correct: 1,
            },
            {
              id: 3,
              q: "Marmara Bölgesi'nin ülkemizdeki en belirgin ortak özelliği aşağıdakilerden hangisidir?",
              options: [
                "En kalabalık ve en hareketli bölge olması",
                "Tamamen çöllerle kaplı olması",
                "Hiç deniz kıyısının olmaması",
              ],
              correct: 0,
            },
            {
              id: 4,
              q: "İstanbul Boğazı üzerinde yer alan büyük yapılar kıtalar arasında nasıl bir görev üstlenir?",
              options: [
                "Kıtaları birbirinden tamamen ayırır",
                "Birleştirici bir güç olarak yolları bağlar",
                "Sadece gemilerin durmasını sağlar",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Bölgeye adını veren ve bölgenin tam ortasında yer alan denizimiz hangisidir?",
              options: ["Akdeniz", "Karadeniz", "Marmara Denizi"],
              correct: 2,
            },
            {
              id: 6,
              q: "Marmara Bölgesi'nde yer alan tarihi saraylar ve eski camiler bölgenin hangi zenginliğini gösterir?",
              options: [
                "Sadece taş zenginliğini",
                "Kültürel ve tarihi dokusunu",
                "Ormanlık alanlarını",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Boğaz köprülerinden geçen bir otomobil hangi iki kıta arasında yolculuk yapmış olur?",
              options: ["Asya - Avrupa", "Afrika - Amerika", "Asya - Afrika"],
              correct: 0,
            },
            {
              id: 8,
              q: "Aşağıdaki somut tarihi yapılardan hangisi Marmara Bölgesi'ndeki İstanbul şehrindedir?",
              options: ["Düden Şelalesi", "Kız Kulesi", "Peri Bacaları"],
              correct: 1,
            },
            {
              id: 9,
              q: "Marmara Bölgesi'nin iklimi ve doğası nasılıdır?",
              options: [
                "Her yer tamamen buzullarla kaplıdır",
                "Denizlerin ve boğazın etkisiyle geçiş iklimi özelliklerine sahiptir",
                "Bitkiler sıcaktan hiç büyümez",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Metne göre Marmara Bölgesi'ndeki köprülerin en büyük simgesel anlamı nedir?",
              options: [
                "Sadece arabaların geçmesi",
                "Kıtaların ve kültürlerin birleştirici gücü olması",
                "Deniz sularını engellemesi",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Yapı Eşleştirici",
          desc: "Marmara Bölgesi'yle ilgili ifadelerin doğru mu yanlış mı olduğunu belirtiniz.",
          questions: [
            {
              q: "İstanbul Boğazı, Marmara Bölgesi'nin en önemli tarihi ve coğrafi zenginliklerinden biridir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Peri Bacaları, Marmara Bölgesi'nin tam ortasında yer alan tarihi evlerdir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Kız Kulesi, denizin ortasında parıldayan tarihi bir dokuya sahiptir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Marmara Bölgesi, Türkiye'nin nüfus olarak en küçük ve en sakin bölgesidir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Boğaz üzerindeki köprüler Asya ve Avrupa kıtalarını birbirine bağlar.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Marmara Bölgesi adını Karadeniz'in hırçın dalgalından almıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Bölgede çok sayıda tarihi saray, cami ve müze yer almaktadır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Düden Şelalesi, İstanbul Boğazı'nın hemen yanından aşağıya doğru akar.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Kıtaları birleştiren bu bölge, deniz ticaret açısından çok hareketlidir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Marmara Bölgesi'nde ulaşım sadece büyük at arabalarıyla sağlanır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
          ],
        },
      },
    },
  },
  "5": {
    story: {
      title: "OYUNCAK KUTUSU",
      theme: "Sorumluluk",
      text: "Selim akşamüstü odasında oyun oynuyordu. Yerdeki büyük halının üzerinde renkli bloklar dağılmıştı. Odası bu haliyle çok karışık görünüyordu. Selim yatağının altındaki büyük plastik kutuyu önüne çekti. Yerde duran kırmızı ve mavi blokları eline aldı. Hepsini teker teker kutunun içine dikkatlice attı. Son olarak sarı oyuncak arabasını da rafa koydu. Artık odadaki bütün oyuncaklar yerini bulmuştu.",
      questions: [
        {
          id: 1,
          q: "Selim odasında ne zaman oyununu bitirdi?",
          options: ["Sabah erkenden", "Akşamüstü", "Gece yarısı"],
          correct: 1,
        },
        {
          id: 2,
          q: "Halının üzerinde dağılan oyuncaklar neydi?",
          options: ["Küçük bilyeler", "Renkli bloklar", "Resimli kartlar"],
          correct: 1,
        },
        {
          id: 3,
          q: "Selim plastik kutuyu nereden önüne çekti?",
          options: [
            "Yatağının altından",
            "Giysi dolabının içinden",
            "Masanın üzerinden",
          ],
          correct: 0,
        },
        {
          id: 4,
          q: "Selim blokları nereye attı?",
          options: [
            "Büyük plastik kutunun içine",
            "Yatağın arkasına",
            "Çöp poşetine",
          ],
          correct: 0,
        },
        {
          id: 5,
          q: "Selim sarı oyuncak arabasını nereye koydu?",
          options: ["Masanın altına", "Rafa", "Kutunun en altına"],
          correct: 1,
        },
        {
          id: 6,
          q: "Hikayenin sonunda odanın durumu nasıldı?",
          options: [
            "Halen çok dağınıktı",
            "Bütün oyuncaklar yerini bulmuştu",
            "Odada hiç oyuncak kalmamıştı",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🕵️ Harf Dedektifliği!",
        rules: [
          {
            name: "Kural 1",
            desc: "Kelimeleri sözlükteki gibi sıraya dizmek için alfabedeki yerlerine bakarız. Kelimelerin ilk harfine bak.",
            example:
              'Armut ve Muz. "A" harfi alfabenin başında olduğu için Armut önce gelir.',
          },
          {
            name: "Kural 2",
            desc: "Eğer ilk harfler aynıysa, hemen ikinci harflere bak!",
            example:
              'Bal ve Bebek. İlk harfler (B) aynı. İkinci harfler: "a" ve "e". Bal önce gelir!',
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Sözlük Yarışı",
        desc: "Seçeneklerde verilen kelimelerden sözlükte en başta yer alanı bulunuz.",
        questions: [
          {
            id: 1,
            q: "Hangi kelime sözlükte en başta yer alır?",
            options: ["Araba", "Balık", "Defter"],
            correct: 0,
          },
          {
            id: 2,
            q: "Hangi kelime sözlükte en başta yer alır?",
            options: ["Çilek", "Elma", "Muz"],
            correct: 0,
          },
          {
            id: 3,
            q: "Hangi kelime sözlükte en başta yer alır?",
            options: ["Kalem", "Limon", "Gözlük"],
            correct: 2,
          },
          {
            id: 4,
            q: "Hangi kelime sözlükte en başta yer alır?",
            options: ["Sıra", "Nar", "Kapı"],
            correct: 2,
          },
          {
            id: 5,
            q: "Hangi kelime sözlükte en başta yer alır?",
            options: ["Tavşan", "Horon", "Zeybek"],
            correct: 1,
          },
          {
            id: 6,
            q: "Hangi kelime sözlükte en başta yer alır?",
            options: ["Öykü", "Kitap", "Fındık"],
            correct: 2,
          },
          {
            id: 7,
            q: '"Bal - Bebek - Biber" kelimelerinden hangisi sözlükte en önce gelir?',
            options: ["Bal", "Bebek", "Biber"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Karpuz - Kivi - Kayısı" kelimelerinden hangisi sözlükte en önce gelir?',
            options: ["Karpuz", "Kivi", "Kayısı"],
            correct: 2,
          },
          {
            id: 9,
            q: "Hangi kelime sözlükte en başta yer alır?",
            options: ["Orman", "Çadır", "Balon"],
            correct: 2,
          },
          {
            id: 10,
            q: '"Mavi - Mor - Masa" kelimelerinden hangisi sözlükte en önce gelir?',
            options: ["Mavi", "Mor", "Masa"],
            correct: 2,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Harf Sıralayıcı",
        desc: "Karışık verilen kelime gruplarını alfabetik sıraya (sözlük sırasına) uygun şekilde diziniz.",
        questions: [
          { words: ["Mavi", "Yeşil", "Sarı"], correct: "Mavi - Sarı - Yeşil" },
          { words: ["Masa", "Ayı", "Çilek"], correct: "Ayı - Çilek - Masa" },
          {
            words: ["Aslan", "Kaplan", "Tavşan"],
            correct: "Aslan - Kaplan - Tavşan",
          },
          {
            words: ["Defter", "Çanta", "Boya"],
            correct: "Boya - Çanta - Defter",
          },
          { words: ["Limon", "Nar", "Muz"], correct: "Limon - Muz - Nar" },
          { words: ["Ömer", "Ali", "Can"], correct: "Ali - Can - Ömer" },
          {
            words: ["Zeytin", "Fındık", "Portakal"],
            correct: "Fındık - Portakal - Zeytin",
          },
          { words: ["Kuş", "Kedi", "Köpek"], correct: "Kedi - Köpek - Kuş" },
          { words: ["Deniz", "Dere", "Dağ"], correct: "Dağ - Deniz - Dere" },
          { words: ["Gül", "Göz", "Gazete"], correct: "Gazete - Göz - Gül" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🗺️ Ege Bölgesi ve Özellikleri",
          rules: [
            {
              name: "Coğrafi Yapı ve Kıyılar",
              desc: "Ülkemizin batısında yer alır. Dağların denize dik uzanması nedeniyle kıyıları çok girintili çıkıntılıdır. Bu yapısı sayesinde bölgede çok sayıda doğal koy, körfez ve liman oluşmuştur.",
              example: "",
            },
            {
              name: "Tarım ve Bitki Örtüsü",
              desc: "Akdeniz iklimi görülür. Bölge genelinde uçsuz bucaksız zeytinlikler, üzüm bağları, incir ve tütün bahçeleri geniş yer tutar. Bitki örtüsü makidir.",
              example: "",
            },
            {
              name: "Tarihi ve Kültürel Miras",
              desc: "Antik çağlardan kalan Efes ve Bergama gibi dünyaca ünlü antik kentlere ev sahipliği yapar. Ayrıca geleneksel Türk tiyatrosunun ve halk oyunlarının sergilendiği tarihi köy meydanları ve orta oyunu alanları bulunur.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Ege Bölgesi Testi",
          desc: "Ege Bölgesi'nin özellikleri ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Ege Bölgesi'nde dağların denize dik uzanması doğrudan hangi coğrafi sonuca yol açmıştır?",
              options: [
                "Bölgenin tamamen ormanlarla kaplanmasına",
                "Kıyıların çok girintili çıkıntılı olmasına, koy ve körfezler oluşmasına",
                "Bölgede hiç dağ kalmamasına",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "Ege Bölgesi aşağıdaki tarım ürünlerinden hangisinin üretiminde ülkemizde çok önemli bir yere sahiptir?",
              options: [
                "Çay ve fındık",
                "Zeytin, incir ve üzüm",
                "Muz ve kivi",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Bölgede geniş yer tutan, kuraklığa dayanıklı kısa çalı ve ağaççıklardan oluşan bitki örtüsü hangisidir?",
              options: ["Bozkır", "Maki", "Orman"],
              correct: 1,
            },
            {
              id: 4,
              q: "Ege Bölgesi'nde yer alan dünyaca ünlü Efes ve Bergama gibi tarihi yerleşimlerin ortak adı nedir?",
              options: ["Antik kent", "Doğal şelale", "Peri bacası"],
              correct: 0,
            },
            {
              id: 5,
              q: "Ege Bölgesi ülkemizin hangi coğrafi yönünde yer almaktadır?",
              options: ["Kuzeyinde", "Batısında", "Doğusunda"],
              correct: 1,
            },
            {
              id: 6,
              q: "Dağların denize dik uzanmasının deniz ulaşımına sağladığı en büyük somut kolaylık hangisidir?",
              options: [
                "Deniz sularının donmasını engellemesi",
                "Çok sayıda korunaklı doğal liman ve körfez oluşturması",
                "Dalgaların tamamen durmasını sağlaması",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Bölgenin iç kısımlarına doğru deniz etkisinin girebilmesi hangi coğrafi özellik sayesinde gerçekleşir?",
              options: [
                "Dağların denize dik uzanmasıyla aralarında boşluklar kalması sayesinde",
                "Bölgede hiç nehir bulunmaması sayesinde",
                "Toprağın tamamen kumlu olması sayesinde",
              ],
              correct: 0,
            },
            {
              id: 8,
              q: "Ege kıyılarında Akdeniz ikliminin görülmesi yaz aylarının nasıl geçmesine neden olur?",
              options: [
                "Sürekli yağmurlu ve serin",
                "Sıcak ve kurak",
                "Karlı ve dondurucu",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Efes Antik Kenti'ni ziyaret eden bir turist bu bölgede neyi somut olarak gözlemlemiş olur?",
              options: [
                "Binlerce yıl öncesine ait tarihi ve arkeolojik yapıları",
                "Modern fabrikaların üretim hatlarını",
                "Sadece doğal bitki örtüsünü",
              ],
              correct: 0,
            },
            {
              id: 10,
              q: "Ege Bölgesi'nin kıyı şeridinin uzunluğu düz bir çizgiye göre neden daha fazladır?",
              options: [
                "Dağların çok yüksek olmasından",
                "Girinti ve çıkıntıların, koyların çok fazla olmasından",
                "Deniz seviyesinin sürekli yükselmesinden",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Ege Bilgi Doğrulama",
          desc: "Ege Bölgesi'yle ilgili ifadelerin doğru mu yanlış mı olduğunu belirtiniz.",
          questions: [
            {
              q: "Ege Bölgesi'nde dağlar denize paralel değil, dik uzanır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Bölgedeki en önemli tarihi miraslardan biri Efes Antik Kenti'dir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Ege Bölgesi, Türkiye'nin çay ve fındık ihtiyacının tamamını karşılar.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Girintili çıkıntılı kıyı yapısı, bölgede çok sayıda koy ve körfez oluşmasını sağlamıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Ege Bölgesi'nin genel bitki örtüsü uzun ömürlü gür ormanlardır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Zeytinlikler ve incir bahçeleri bu bölgenin ekonomisinde önemli bir yere sahiptir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Ege Bölgesi ülkemizin en doğu ucunda yer alan sınır bölgesidir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Dağların dik uzanması denizden gelen nemli havanın iç kısımlara girmesini kolaylaştırır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Bergama, Ege Bölgesi'nde yer alan tarihi bir antik kenttir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Bölgede yaz mevsimi yağışlı, kış mevsimi ise tamamen kurak ve sıcaktır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
          ],
        },
      },
    },
  },
  "6": {
    story: {
      title: "KAYIP SİLGİ",
      theme: "Nezaket",
      text: "Can okulda sırasına oturmuş öğretmenini bekliyordu. Yanındaki arkadaşı Sıla çantasını hızlıca karıştırıyordu. Sıla sıranın altına doğru eğilip bir şey aradı. Onun pembe silgisini kaybettiğini Can hemen anladı. Can kendi sırasının altındaki ahşap bölmeye baktı. Küçük pembe silgi orada sessizce duruyordu. Eğilip silgiyi aldı ve Sıla’ya doğru uzattı. Sıla silgiyi görünce Can’a gülümseyerek teşekkür etti.",
      questions: [
        {
          id: 1,
          q: "Can okulda sırasına oturmuş kimi bekliyordu?",
          options: ["Okul müdürünü", "Öğretmenini", "En yakın arkadaşını"],
          correct: 1,
        },
        {
          id: 2,
          q: "Can'ın yanındaki arkadaşının adı nedir?",
          options: ["Sıla", "Pelin", "Ayşe"],
          correct: 0,
        },
        {
          id: 3,
          q: "Sıla sıranın altında ne arıyordu?",
          options: ["Kurşun kalemini", "Pembe silgisini", "Resimli defterini"],
          correct: 1,
        },
        {
          id: 4,
          q: "Can silgiyi kendi sırasının neresinde buldu?",
          options: [
            "Ahşap bölmesinde",
            "Kalemliğinin içinde",
            "Sandalyesinin arkasında",
          ],
          correct: 0,
        },
        {
          id: 5,
          q: "Kaybolan silgi ne renkliydi?",
          options: ["Mavi", "Beyaz", "Pembe"],
          correct: 2,
        },
        {
          id: 6,
          q: "Sıla silgiyi alınca Can'a ne yaptı?",
          options: [
            "Kendi kalemini hediye etti",
            "Gülümseyerek teşekkür etti",
            "Silgiyi çantasına sakladı",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "⚖️ Birbirinin Tam Tersi!",
        rules: [
          {
            name: "Tanım",
            desc: "Anlamları yönüyle birbirinin tamamen karşısı, yani tam tersi olan kelimelere Zıt Anlamlı Kelimeler denir.",
            example: "Siyah ↔️ Beyaz, Büyük ↔️ Küçük, Sıcak ↔️ Soğuk",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Karşıt Kutuplar",
        desc: "Verilen kelimeleri zıt anlamlı karşılıklarıyla doğru şekilde eşleştiriniz.",
        questions: [
          {
            id: 1,
            q: '"Uzun" kelimesinin zıttı hangisidir?',
            options: ["Kısa", "Aşağı", "Küçük"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Yukarı" kelimesinin zıttı hangisidir?',
            options: ["Kısa", "Aşağı", "Küçük"],
            correct: 1,
          },
          {
            id: 3,
            q: '"Büyük" kelimesinin zıttı hangisidir?',
            options: ["Kısa", "Aşağı", "Küçük"],
            correct: 2,
          },
          {
            id: 4,
            q: '"Sıcak" kelimesinin zıttı hangisidir?',
            options: ["Soğuk", "Aşağı", "Küçük"],
            correct: 0,
          },
          {
            id: 5,
            q: '"Boş" kelimesinin zıttı hangisidir?',
            options: ["Kısa", "Dolu", "Küçük"],
            correct: 1,
          },
          {
            id: 6,
            q: '"Ağır" kelimesinin zıttı hangisidir?',
            options: ["Kısa", "Aşağı", "Hafif"],
            correct: 2,
          },
          {
            id: 7,
            q: '"Yeni" kelimesinin zıttı hangisidir?',
            options: ["Eski", "Aşağı", "Küçük"],
            correct: 0,
          },
          {
            id: 8,
            q: '"İç" kelimesinin zıttı hangisidir?',
            options: ["Kısa", "Dış", "Küçük"],
            correct: 1,
          },
          {
            id: 9,
            q: '"Açık" kelimesinin zıttı hangisidir?',
            options: ["Kısa", "Aşağı", "Kapalı"],
            correct: 2,
          },
          {
            id: 10,
            q: '"Temiz" kelimesinin zıttı hangisidir?',
            options: ["Kirli", "Aşağı", "Küçük"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Tersini Bul",
        desc: "Cümlelerde altı çizili olan kelimenin zıt anlamlısını seçeneklerden bularak boşluğu doldurunuz.",
        questions: [
          {
            id: 1,
            q: "Çay çok sıcak olduğu için bardağa biraz .... su ekledim.",
            options: ["Ilık", "Soğuk"],
            correct: 1,
          },
          {
            id: 2,
            q: "Kutunun içi boş değil, tamamen oyuncakla .... görünüyordu.",
            options: ["Kirli", "Dolu"],
            correct: 1,
          },
          {
            id: 3,
            q: "Büyük taşları kenara aldı, yerdeki .... çakılları topladı.",
            options: ["İnce", "Küçük"],
            correct: 1,
          },
          {
            id: 4,
            q: "Kitaplığın üst rafında defterler, .... rafında ise boyalar var.",
            options: ["Yan", "Alt"],
            correct: 1,
          },
          {
            id: 5,
            q: "Poşet çok ağır gelince ablam elindeki .... paketle değiştirdi.",
            options: ["Yumuşak", "Hafif"],
            correct: 1,
          },
          {
            id: 6,
            q: "Eski ayakkabısını çöpe atıp yerine .... bir bot aldı.",
            options: ["Yeni", "Güzel"],
            correct: 0,
          },
          {
            id: 7,
            q: "Bahçede uzun direklerin yanına .... bir tahta koydular.",
            options: ["İnce", "Kısa"],
            correct: 1,
          },
          {
            id: 8,
            q: "Evin iç duvarı boyandı, .... cephesi ise haftaya kalacak.",
            options: ["Arka", "Dış"],
            correct: 1,
          },
          {
            id: 9,
            q: "Odasındaki kirli kıyafetleri makineye atıp .... olanları giydi.",
            options: ["Yeni", "Temiz"],
            correct: 1,
          },
          {
            id: 10,
            q: "Sabah kapıyı açık unutmuştu, akşama kadar .... kalmış.",
            options: ["Kilitli", "Kapalı"],
            correct: 1,
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🗺️ Akdeniz Bölgesi ve Özellikleri",
          rules: [
            {
              name: "Yeryüzü Şekilleri ve Dağlar",
              desc: "Ülkemizin güneyinde yer alır. Bölgenin arkasında denize paralel olarak uzanan kıvrımlı ve yüksek Toros Dağları bulunur. Dağların paralel uzanması nedeniyle kıyı ile iç kesimler arasında ulaşım geçitlerle sağlanır.",
              example: "",
            },
            {
              name: "İklim ve Tarım",
              desc: "Tipik Akdeniz iklimi hakimdir. Kış ayları oldukça ılık geçtiği için tarımda seracılık ve turunçgil (portakal, limon, mandalina) yetiştiriciliği çok gelişmiştir. Türkiye'nin muz ihtiyacının büyük kısmı bu kıyılardan karşılanır.",
              example: "",
            },
            {
              name: "Doğal Güzellikler",
              desc: "Karstik yapı nedeniyle bölgede çok sayıda mağara, yeraltı suyu ve çağlayan bulunur. En bilinen doğal varlıklarından biri Düden Şelalesi'dir.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Akdeniz Coğrafyası Testi",
          desc: "Akdeniz Bölgesi'nin özellikleri ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Akdeniz Bölgesi'nin kıyı şeridinin hemen arkasında denize paralel olarak uzanan dağ sırası hangisidir?",
              options: ["Kaçkar Dağları", "Toros Dağları", "Ilgaz Dağları"],
              correct: 1,
            },
            {
              id: 2,
              q: "Kış aylarının ılık geçmesi Akdeniz Bölgesi'nde hangi tarım faaliyetinin çok gelişmesini sağlamıştır?",
              options: [
                "Seracılık ve turunçgil yetiştiriciliği",
                "Çay tarımı",
                "Patates ve buğday üretimi",
              ],
              correct: 0,
            },
            {
              id: 3,
              q: "Bölgenin en önemli somut doğal varlıklarından biri olan çağlayan aşağıdakilerden hangisidir?",
              options: [
                "Manavgat ve Düden Şelalesi",
                "Tortum Şelalesi",
                "Muradiye Şelalesi",
              ],
              correct: 0,
            },
            {
              id: 4,
              q: "Akdeniz Bölgesi'nde dağların denize paralel uzanması kıyı ile iç kesimler arasında neyi zorlaştırmıştır?",
              options: [
                "Deniz ticaretini",
                "Karayolu ulaşımını",
                "Balıkçılık faaliyetlerini",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Türkiye'de muz üretiminin neredeyse tamamı hangi bölgemizde gerçekleştirilir?",
              options: ["Ege Bölgesi", "Akdeniz Bölgesi", "Marmara Bölgesi"],
              correct: 1,
            },
            {
              id: 6,
              q: "Dağların denize paralel uzanmasının iklimsel sonucu aşağıdakilerden hangisidir?",
              options: [
                "Denizden gelen nemli havanın iç kısımlara geçmesini engellemesi",
                "İç kısımların daha sıcak olmasını sağlaması",
                "Her gün kar yağışına neden olması",
              ],
              correct: 0,
            },
            {
              id: 7,
              q: "Akdeniz kıyılarında portakal, limon ve mandalina gibi ürünlerin yoğun olarak yetişme sebebi nedir?",
              options: [
                "Toprağın sürekli çamur olması",
                "Kış aylarının ılık ve don olaysız geçmesi",
                "Bölgede hiç dağ olmaması",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Akdeniz Bölgesi ülkemizin hangi coğrafi yönünde yer almaktadır?",
              options: ["Kuzeyinde", "Güneyinde", "Batısında"],
              correct: 1,
            },
            {
              id: 9,
              q: "Bölgede yer alan karstik mağaralar ve şelaleler en çok hangi sektöre fayda sağlar?",
              options: ["Ağır sanayiye", "Turizm sektörüne", "Hayvancılığa"],
              correct: 1,
            },
            {
              id: 10,
              q: "Akdeniz Bölgesi'nde dağların dik değil de paralel uzanması kıyı çizgisini nasıl etkilemiştir?",
              options: [
                "Girinti ve çıkıntının az, düz bir kıyı şeridi olmasını sağlamıştır",
                "Çok sayıda büyük doğal körfez oluşturmuştur",
                "Kıyı uzunluğunu üç katına çıkarmıştır",
              ],
              correct: 0,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Akdeniz Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "Akdeniz Bölgesi'nin güney sınırını oluşturan dağlara .................... Dağları denir.",
              words: ["Toros", "Kaçkar"],
              correct: "Toros",
            },
            {
              q: "Bölgede kışlar ılık geçtiği için naylon veya cam odalarda yapılan .................... faaliyeti gelişmiştir.",
              words: ["seracılık", "madencilik"],
              correct: "seracılık",
            },
            {
              q: "Antalya şehrinde yer alan ve doğrudan denize dökülen ünlü çağlayan .................... Şelalesi'dir.",
              words: ["Düden", "Tortum"],
              correct: "Düden",
            },
            {
              q: "Portakal, limon ve mandalina gibi meyvelerin ortak adı .................... olarak bilinir.",
              words: ["turunçgil", "baklagil"],
              correct: "turunçgil",
            },
            {
              q: "Akdeniz Bölgesi'nde dağlar denize .................... uzandığı için iç kısımlara ulaşım geçitlerle sağlanır.",
              words: ["dik", "paralel"],
              correct: "paralel",
            },
            {
              q: "Ülkemizde sadece bu bölgenin mikroklimalı sıcak alanlarında .................... meyvesi yetiştirilebilir.",
              words: ["muz", "fındık"],
              correct: "muz",
            },
            {
              q: "Akdeniz ikliminin etkisiyle yaz ayları oldukça sıcak ve .................... geçer.",
              words: ["kurak", "yağışlı"],
              correct: "kurak",
            },
            {
              q: "Dağlar kıyıya paralel olduğu için deniz etkisi iç kesimlere doğru ....................",
              words: ["ilerleyemez.", "ilerler."],
              correct: "ilerleyemez.",
            },
            {
              q: "Akdeniz Bölgesi, Türkiye haritasının tam .................... kısmında şerit halinde uzanır.",
              words: ["güney", "kuzey"],
              correct: "güney",
            },
            {
              q: "Bölgedeki mağaralar ve şelaleler doğal birer .................... merkezidir.",
              words: ["turizm", "fabrika"],
              correct: "turizm",
            },
          ],
        },
      },
    },
  },
  "7": {
    story: {
      title: "BAHÇEDEKİ ÇÖP",
      theme: "Çevre Temizliği",
      text: "Umut öğle arasında okulun büyük bahçesinde yürüyordu. Yerde, yeşil çimlerin üzerinde bir nesne gördü. Bu, birisi tarafından atılmış boş bir kutuydu. Kutu, meyve suyu içildikten sonra oraya bırakılmıştı. Umut bu kirli görüntüyü okuluna hiç yakıştıramadı. Hemen yere doğru eğilip boş kutuyu eline aldı. Bahçenin köşesindeki büyük yeşil çöp kutusuna doğru yürüdü. Kutuyu çöpün içine attı ve bahçe temizlendi.",
      questions: [
        {
          id: 1,
          q: "Umut ne zaman okulun bahçesinde yürüyordu?",
          options: [
            "Sabah ders başlamadan",
            "Öğle arasında",
            "Okul çıkışında saat beşte",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Umut yerde, yeşil çimlerin üzerinde ne gördü?",
          options: ["Boş bir kutu", "Küçük bir taş", "Renkli bir anahtarlık"],
          correct: 0,
        },
        {
          id: 3,
          q: "Yerde duran boş kutu daha önce ne için kullanılmıştı?",
          options: [
            "Süt içmek için",
            "Meyve suyu içmek için",
            "Boya yapmak için",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Umut yerdeki kutuyu görünce ne hissetti?",
          options: [
            "Çok eğlendi ve kutuya tekme attı",
            "Görüntüyü okuluna hiç yakıştıramadı",
            "Kutuyu cebine koymak istedi",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Bahçenin köşesindeki çöp kutusu ne renkliydi?",
          options: ["Kırmızı", "Mavi", "Yeşil"],
          correct: 2,
        },
        {
          id: 6,
          q: "Umut kutuyu çöp kutusuna atınca ne oldu?",
          options: [
            "Bahçe temizlendi",
            "Kutunun içinden su döküldü",
            "Bahçe görevlisi geldi",
          ],
          correct: 0,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "👥 İkiz Kelimeler!",
        rules: [
          {
            name: "Tanım",
            desc: "Yazılışları ve okunuşları birbirlerinden tamamen farklı olan ama aynı anlamı taşıyan kelimelere Eş Anlamlı Kelimeler denir.",
            example: "Kırmızı = Al, Okul = Mektep, Öğrenci = Talebe",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Anlam İkizleri",
        desc: "Verilen kelimeleri eş anlamlı karşılıklarıyla doğru şekilde eşleştiriniz.",
        questions: [
          {
            id: 1,
            q: '"Kırmızı" kelimesinin eş anlamlısı hangisidir?',
            options: ["Al", "Kara", "Beyaz"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Siyah" kelimesinin eş anlamlısı hangisidir?',
            options: ["Al", "Kara", "Beyaz"],
            correct: 1,
          },
          {
            id: 3,
            q: '"Okul" kelimesinin eş anlamlısı hangisidir?',
            options: ["Mektep", "Kara", "Beyaz"],
            correct: 0,
          },
          {
            id: 4,
            q: '"Öğretmen" kelimesinin eş anlamlısı hangisidir?',
            options: ["Muallim", "Kara", "Beyaz"],
            correct: 0,
          },
          {
            id: 5,
            q: '"Öğrenci" kelimesinin eş anlamlısı hangisidir?',
            options: ["Talebe", "Kara", "Beyaz"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Öykü" kelimesinin eş anlamlısı hangisidir?',
            options: ["Hikaye", "Kara", "Beyaz"],
            correct: 0,
          },
          {
            id: 7,
            q: '"Yıl" kelimesinin eş anlamlısı hangisidir?',
            options: ["Sene", "Kara", "Beyaz"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Doktor" kelimesinin eş anlamlısı hangisidir?',
            options: ["Hekim", "Kara", "Beyaz"],
            correct: 0,
          },
          {
            id: 9,
            q: '"Kelime" kelimesinin eş anlamlısı hangisidir?',
            options: ["Sözcük", "Kara", "Beyaz"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Beyaz" kelimesinin eş anlamlısı hangisidir?',
            options: ["Ak", "Kara", "Sarı"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Yer Değiştirme",
        desc: "Cümlelerde altı çizili kelimelerin yerine hangi eş anlamlısı gelirse cümlenin anlamı değişmez?",
        questions: [
          {
            id: 1,
            q: '"Öğretmenimiz bize çok güzel bir öykü okudu."',
            options: ["Masal", "Hikaye", "Şiir"],
            correct: 1,
          },
          {
            id: 2,
            q: '"Yaz tatili için bu sene köye gideceğiz."',
            options: ["Yıl", "Ay", "Gün"],
            correct: 0,
          },
          {
            id: 3,
            q: '"Bayrağımızın üzerindeki al renk çok parlak."',
            options: ["Beyaz", "Kırmızı", "Kara"],
            correct: 1,
          },
          {
            id: 4,
            q: '"Bahçedeki kara kedi sütünü hızlıca içti."',
            options: ["Beyaz", "Gri", "Siyah"],
            correct: 2,
          },
          {
            id: 5,
            q: '"Yeni başladığım okul evimize çok yakın duruyor."',
            options: ["Sınıf", "Mektep", "Kurs"],
            correct: 1,
          },
          {
            id: 6,
            q: '"Sıranın üzerinde üç farklı sözcük yazılıydı."',
            options: ["Cümle", "Harf", "Kelime"],
            correct: 2,
          },
          {
            id: 7,
            q: '"Hasta olunca annemle birlikte hekim yanına gittik."',
            options: ["Hemşire", "Doktor", "Eczacı"],
            correct: 1,
          },
          {
            id: 8,
            q: '"Gökyüzünde ak güvercinler süzülerek uçuyordu."',
            options: ["Beyaz", "Siyah", "Sarı"],
            correct: 0,
          },
          {
            id: 9,
            q: '"Sınıftaki çalışkan talebe ödevini erkenden bitirdi."',
            options: ["Öğretmen", "Öğrenci", "Müdür"],
            correct: 1,
          },
          {
            id: 10,
            q: '"Bu sınavdaki en büyük vazife dikkatli okumaktır."',
            options: ["Amaç", "İş", "Görev"],
            correct: 2,
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🗺️ İç Anadolu Bölgesi ve Özellikleri",
          rules: [
            {
              name: "Konumu ve Önemi",
              desc: "Ülkemizin tam merkezinde, yani kalbinde yer alır. Etrafı yüksek dağlarla çevrili olduğu için denizlerin nemli havası buraya ulaşamaz. Bu yüzden bölgede Karasal İklim görülür. Yazlar sıcak, kışlar çok soğuk ve karlıdır.",
              example: "",
            },
            {
              name: "Yeryüzü Şekilleri ve Tarım",
              desc: "Geniş düzlükler, platolar ve ovalar yer tutar. Türkiye'nin tahıl (buğday, arpa) ihtiyacının büyük kısmı buradan karşılandığı için bölgeye \"Türkiye'nin Tahıl Ambarı\" denir.",
              example: "",
            },
            {
              name: "Kültürel ve Siyasi Merkez",
              desc: "Ülkemizin başkenti olan Ankara bu bölgededir. Ayrıca rüzgar ve yağmurun tüf kayaları aşındırmasıyla oluşan Peri Bacaları (Nevşehir Kapadokya) en önemli doğal ve turistik mirasıdır.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: İç Anadolu Testi",
          desc: "İç Anadolu Bölgesi'nin özellikleri ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "İç Anadolu Bölgesi'nin ülkemiz için en önemli siyasi ve idari özelliği aşağıdakilerden hangisidir?",
              options: [
                "En çok yağış alan yer olması",
                "Başkentimiz Ankara'nın bu bölgede yer alması",
                "Üç tarafının denizlerle çevrili olması",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "Bölgede geniş düzlüklerin bulunması ve kurak iklim nedeniyle en çok hangi tarım ürünü yetiştirilir?",
              options: [
                "Buğday ve arpa (Tahıl)",
                "Çay ve tütün",
                "Portakal ve muz",
              ],
              correct: 0,
            },
            {
              id: 3,
              q: "Nevşehir sınırları içinde yer alan, rüzgarların ve yağmurların kayaları aşındırmasıyla oluşan doğal yapılar hangisidir?",
              options: ["Düden Şelalesi", "Peri Bacaları", "İstanbul Boğazı"],
              correct: 1,
            },
            {
              id: 4,
              q: "İç Anadolu Bölgesi'ne tarımsal üretiminden dolayı ülkemizde hangi somut unvan verilmiştir?",
              options: [
                "Mavi Vatan",
                "Türkiye'nin Tahıl Ambarı",
                "Sanayi Merkezi",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "İç Anadolu Bölgesi'nde görülen, yazları sıcak ve kurak, kışları ise soğuk ve karlı geçen iklim türı hangisidir?",
              options: ["Akdeniz İklimi", "Karasal İklim", "Karadeniz İklimi"],
              correct: 1,
            },
            {
              id: 6,
              q: "Bölgenin etrafının yüksek dağlarla çevrili olmasının iklimsel sonucu hangisidir?",
              options: [
                "Denizlerin nemli havasının iç kısımlara ulaşamaması ve kuraklık oluşması",
                "Bölgenin her gün çok yoğun yağış alması",
                "Hava sıcaklığının yıl boyu hiç değişmemesi",
              ],
              correct: 0,
            },
            {
              id: 7,
              q: "İç Anadolu Bölgesi'nin doğal bitki örtüsü olan, ilkbaharda yeşerip yazın kuruyan küçük ot topluluğuna ne ad verilir?",
              options: ["Maki", "Bozkır (Step)", "Orman"],
              correct: 1,
            },
            {
              id: 8,
              q: "Haritaya bakıldığında İç Anadolu Bölgesi ülkemizin hangi konumunda yer alır?",
              options: [
                "En batı ucunda",
                "Tam merkezinde, orta kısmında",
                "Kuzey kıyısında",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Kapadokya bölgesinde peri bacalarını görmek isteyen turistler somut olarak hangi şehre gitmelidir?",
              options: ["Ankara", "Nevşehir", "Antalya"],
              correct: 1,
            },
            {
              id: 10,
              q: "İç Anadolu Bölgesi'nde kış aylarının çok soğuk geçmesi eylemleri nasıl etkiler?",
              options: [
                "Tarımda seracılığın yapılmasını zorlaştırır, kar yağışlarına neden olur",
                "Deniz turizminin gelişmesini sağlar",
                "Her yerin sürekli yeşil kalmasını sağlar",
              ],
              correct: 0,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: İç Anadolu Doğrulama",
          desc: "İç Anadolu Bölgesi'yle ilgili ifadelerin doğru mu yanlış mı olduğunu belirtiniz.",
          questions: [
            {
              q: "Türkiye'nin başkenti Ankara, İç Anadolu Bölgesi sınırları içindedir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "İç Anadolu Bölgesi'nin üç tarafı büyük denizlerle çevrilidir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Bölge genelinde buğday ve arpa gibi tahıl ürünleri yoğun olarak üretilir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Peri Bacaları, rüzgar ve suyun aşındırmasıyla oluşan doğal yapılardır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "İç Anadolu Bölgesi, Türkiye'nin en çok yağış alan ve en sulak bölgesidir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Bölgenin hakim iklim türü yazları sıcak, kışları soğuk olan Karasal İklimdir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Geniş ovalar ve platolar bu bölgenin yeryüzü şekillerini oluşturur.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "İç Anadolu Bölgesi'nin doğal bitki örtüsü Akdeniz makileridir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Nevşehir Kapadokya bölgesi, her yıl binlerce turist çeken tarihi ve doğal bir merkezdir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Dağlar deniz etkisini engellediği için bölgenin iç kısımları nemli ve ılıktır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
          ],
        },
      },
    },
  },
  "8": {
    story: {
      title: "TEMİZ ELLER",
      theme: "Sağlık ve Hijyen",
      text: "Kerem arkadaşlarıyla sokakta uzun süre top oynadı. Eve girdiğinde ellerinin tamamen çok kirli olduğunu fark etti. Doğrudan banyoya giderek beyaz lavabonun önünde durdu. Musluğu çevirdi ve su ellerinden aşağıya aktı. Duvardaki sabunluktan eline biraz beyaz sabun döktü. Parmaklarını iyice sürterek köpükler içinde yıkadı. Kirli su lavabonun deliğinden hızlıca akıp gitti. Son olarak temiz havluyla ellerini güzelce kuruladı.",
      questions: [
        {
          id: 1,
          q: "Kerem arkadaşlarıyla sokakta ne oynadı?",
          options: ["Saklambaç", "Top", "Körebe"],
          correct: 1,
        },
        {
          id: 2,
          q: "Kerem eve girdiğinde elleri ne renk olmuştu?",
          options: ["Siyah", "Kırmızı", "Sarı"],
          correct: 0,
        },
        {
          id: 3,
          q: "Kerem temizlenmek için evin hangi odasına gitti?",
          options: ["Kendi odasına", "Banyoya", "Mutfağa"],
          correct: 1,
        },
        {
          id: 4,
          q: "Sabun ve eller birleşince lavaboda ne oluştu?",
          options: ["Renkli boyalar", "Köpükler", "Küçük taşlar"],
          correct: 1,
        },
        {
          id: 5,
          q: "Lavabonun rengi neydi?",
          options: ["Mavi", "Siyah", "Beyaz"],
          correct: 2,
        },
        {
          id: 6,
          q: "Kerem ellerini sabunla yıkadıktan sonra neyle kuruladı?",
          options: ["Kendi kıyafetiyle", "Temiz havluyla", "Kağıt mendille"],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🎭 Tek Kelime, İki Maske!",
        rules: [
          {
            name: "Tanım",
            desc: "Yazılışları ve okunuşları tıpatıp aynı olan ama akla bambaşka iki farklı anlam getiren kelimelere Sesteş Kelimeler denir.",
            example: "Gül: Hem çiçek hem gülmek. Yüz: Hem sayı hem yüzmek.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Sesteş Avı",
        desc: "Seçeneklerde verilen kelimelerden sesteş (eş sesli) olanı doğru şıktan bulunuz.",
        questions: [
          {
            id: 1,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Masa", "Bin", "Kitap"],
            correct: 1,
          },
          {
            id: 2,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Gül", "Kapı", "Kalem"],
            correct: 0,
          },
          {
            id: 3,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Çay", "Sıra", "Defter"],
            correct: 0,
          },
          {
            id: 4,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Çanta", "Yaz", "Silgi"],
            correct: 1,
          },
          {
            id: 5,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Yüz", "Lamba", "Pencere"],
            correct: 0,
          },
          {
            id: 6,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Dal", "Halı", "Koltuk"],
            correct: 0,
          },
          {
            id: 7,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Yat", "Duvar", "Sehpa"],
            correct: 0,
          },
          {
            id: 8,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Ekmek", "Kaşık", "Bardak"],
            correct: 0,
          },
          {
            id: 9,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Kaz", "Sünger", "Tabak"],
            correct: 0,
          },
          {
            id: 10,
            q: "Hangisi sesteş (eş sesli) bir kelimedir?",
            options: ["Saç", "Dolap", "Minder"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: İki Anlam Bir Kelime",
        desc: "Tanımları verilen iki farklı somut anlamın ortak kelimesini bularak eşleştiriniz.",
        questions: [
          { words: ["Hem sıcak içecek hem de küçük dere"], correct: "Çay" },
          {
            words: ["Hem kırmızı kokulu çiçek hem de sevinçle gülmek"],
            correct: "Gül",
          },
          {
            words: ["Hem sayı olan 100 hem de denizde ilerlemek"],
            correct: "Yüz",
          },
          {
            words: ["Hem sıcak yaz mevsimi hem de kalemle not etmek"],
            correct: "Yaz",
          },
          {
            words: ["Hem ağacın bir kolu hem de suya kafayla girmek"],
            correct: "Dal",
          },
          {
            words: ["Hem sayı olan 1000 hem de ata/bisiklete binmek"],
            correct: "Bin",
          },
          {
            words: ["Hem fırındaki taze yiyecek hem de tohumu toprağa koymak"],
            correct: "Ekmek",
          },
          {
            words: ["Hem beyaz bir kuş hayvanı hem de toprağı kürekle açmak"],
            correct: "Kaz",
          },
          {
            words: ["Hem başımızdaki kıllar hem de etrafa tohum/para dağıtmak"],
            correct: "Saç",
          },
          {
            words: ["Hem geceleri yatağa uzanmak hem de denizdeki lüks tekne"],
            correct: "Yat",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🗺️ Karadeniz Bölgesi ve Özellikleri",
          rules: [
            {
              name: "Konumu ve İklimi",
              desc: "Ülkemizin kuzey şeridi boyunca uzanır. Her mevsim yağışlı olan Karadeniz İklimi görülür. Yıl boyu yağış aldığı için Türkiye'nin en gür ve en geniş ormanlık alanlarına sahiptir.",
              example: "",
            },
            {
              name: "Yeryüzü Şekilleri ve Doğası",
              desc: "Kıyıya paralel uzanan yüksek Kaçkar Dağları bulunur. Dik yamaçlar, gür akarsular ve dağların tepesinde yer alan yemyeşil, sisli yaylalar bölgenin en belirgin yeryüzü şekilleridir. Kıyı şeridi hırçın dalgalarla kaplıdır.",
              example: "",
            },
            {
              name: "Tarım Ürünleri",
              desc: "Sürekli nemli ve yağışlı hava isteyen fındık ve çay bahçeleri bu bölgenin temel ekonomik kaynağıdır.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Karadeniz Coğrafyası Testi",
          desc: "Karadeniz Bölgesi'nin özellikleri ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Karadeniz Bölgesi'nin her mevsim yağış almasının doğrudan sonucu aşağıdakilerden hangisidir?",
              options: [
                "Geniş düzlüklerin ve ovaların oluşması",
                "Gür ormanların ve yemyeşil bitki örtüsünün bulunması",
                "Bölgenin tamamen kurak bir çöle dönmesi",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "Türkiye'de çay ve fındık üretiminin neredeyse tamamı hangi bölgemizde gerçekleştirilir?",
              options: [
                "İç Anadolu Bölgesi",
                "Karadeniz Bölgesi",
                "Akdeniz Bölgesi",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Karadeniz Bölgesi'nde dağların tepelerinde yer alan, hayvancılık ve turizm yapılan dik, sisli düzlüklere ne ad verilir?",
              options: ["Peri bacası", "Yayla", "Delta ovası"],
              correct: 1,
            },
            {
              id: 4,
              q: "Bölgenin kıyı şeridinin hemen arkasında uzanan yüksek dağ sırası hangisidir?",
              options: ["Toros Dağları", "Kaçkar Dağları", "Aydın Dağları"],
              correct: 1,
            },
            {
              id: 5,
              q: "Karadeniz Bölgesi ülkemizin hangi coğrafi yönünde yer almaktadır?",
              options: ["Güneyinde", "Kuzeyinde", "Batısında"],
              correct: 1,
            },
            {
              id: 6,
              q: "Çay bitkisinin Karadeniz Bölgesi'nde çok iyi yetişmesinin temel sebebi nedir?",
              options: [
                "Bölgenin çok kurak ve sıcak olması",
                "Her mevsim bol yağış ve nem istemesi, bölgenin bu şartları sağlaması",
                "Toprağın tamamen taşlardan oluşması",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Karadeniz'de dağların denize paralel uzanması kıyı yapısını nasıl etkilemiştir?",
              options: [
                "Kıyıların çok girintili çıkıntılı olmasına yol açmıştır",
                "Girinti ve çıkıntısı az, dik ve düz kıyılar oluşmasını sağlamıştır",
                "Deniz sularının tamamen çekilmesine neden olmuştur",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Karadeniz Bölgesi'nin deniz kıyısı hangi özelliği ile bilinir?",
              options: [
                "Çok sakin ve dalgasız olmasıyla",
                "Hırçın ve güçlü dalgalara sahip olmasıyla",
                "Suyunun tamamen sıcak olmasıyla",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Bölgede evlerin yapımında ormanların bolluğu nedeniyle en çok hangi somut malzeme kullanılır?",
              options: ["Taş ve tuğla", "Ahşap (Tahta)", "Kerpiç ve çamur"],
              correct: 1,
            },
            {
              id: 10,
              q: "Karadeniz ikliminin en belirgin özelliği aşağıdakilerden hangisidir?",
              options: [
                "Sadece yaz aylarında yağmur yağması",
                "Her mevsiminin düzenli olarak yağışlı geçmesi",
                "Kış aylarında hiç kar yağmaması",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Karadeniz Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "Karadeniz Bölgesi, Türkiye haritasının en .................... kısmında ince bir şerit olarak uzanır.",
              words: ["kuzey", "güney"],
              correct: "kuzey",
            },
            {
              q: "Her mevsim yağış alması nedeniyle ülkemizin en zengin .................... alanları bu bölgededir.",
              words: ["orman", "çöl"],
              correct: "orman",
            },
            {
              q: "Dağların üst kısımlarındaki yemyeşil düzlüklere .................... adı verilir ve burada hayvancılık yapılır.",
              words: ["yayla", "ova"],
              correct: "yayla",
            },
            {
              q: "Bölgenin en önemli iki tarım ürünü fındık ve .................... bitkisidir.",
              words: ["çay", "muz"],
              correct: "çay",
            },
            {
              q: "Doğu Karadeniz bölümünde yer alan yüksek dağlara .................... Dağları denir.",
              words: ["Kaçkar", "Toros"],
              correct: "Kaçkar",
            },
            {
              q: "Karadeniz'in kıyı yapısı, dağlar paralel uzandığı için oldukça düz ve .................... görünür.",
              words: ["dik", "girintili çıkıntılı"],
              correct: "dik",
            },
            {
              q: "Nemli iklim sebebiyle Karadeniz Bölgesi'nde yaz ayları Akdeniz kadar sıcak ve kurak ....................",
              words: ["geçmez.", "geçer."],
              correct: "geçmez.",
            },
            {
              q: "Yağışların fazla olması bölgedeki akarsuların su miktarını yıl boyu .................... tutar.",
              words: ["yüksek", "düşük"],
              correct: "yüksek",
            },
            {
              q: "Türkiye'nin fındık ihtiyacının büyük kısmı .................... kıyılarındaki bahçelerden toplanır.",
              words: ["Karadeniz", "İç Anadolu"],
              correct: "Karadeniz",
            },
            {
              q: "Bölgedeki gür bitki örtüsü dik yamaçlarda yeşil bir .................... oluşturur.",
              words: ["görünüm", "kuraklık"],
              correct: "görünüm",
            },
          ],
        },
      },
    },
  },
  "9": {
    story: {
      title: "GÜNEBAKAN ÇİÇEĞİ",
      theme: "Bilgilendirici / Doğa",
      text: "Köydeki büyük tarlada binlerce sarı ayçiçeği vardı. Bu çiçeklerin çok ilginç somut bir özelliği bulunuyordu. Sabahleyin güneş doğarken hepsi yüzünü doğuya çeviriyordu. Gün boyunca gökyüzündeki parlak güneşi yavaşça takip ediyorlardı. Güneş nereye giderse çiçeklerin kafası oraya dönüyordu. Bu yüzden insanlar onlara günebakan adını vermişti. Akşam olup güneş batınca hepsi başını aşağıya eğiyordu. Gece boyunca sessizce sabah güneşini bekliyorlardı.",
      questions: [
        {
          id: 1,
          q: "Tarladaki ayçiçekleri ne renkliydi?",
          options: ["Sarı", "Turuncu", "Kırmızı"],
          correct: 0,
        },
        {
          id: 2,
          q: "Çiçekler sabah güneş doğarken yüzlerini nereye çeviriyordu?",
          options: ["Batıya", "Doğuya", "Kuzeye"],
          correct: 1,
        },
        {
          id: 3,
          q: "Çiçekler gün boyunca gökyüzünde neyi takip ediyordu?",
          options: ["Parlak güneşi", "Beyaz bulutları", "Uçan kuşları"],
          correct: 0,
        },
        {
          id: 4,
          q: "İnsanlar bu çiçeklere hangi ismi vermişti?",
          options: ["Gece çiçeği", "Günebakan", "Altın yaprak"],
          correct: 1,
        },
        {
          id: 5,
          q: "Akşam güneş batınca ayçiçekleri ne yapıyordu?",
          options: [
            "Yapraklarını döküyordu",
            "Başını aşağıya eğiyordu",
            "Gökyüzüne doğru uzuyordu",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Çiçekler gece boyunca neyi bekliyordu?",
          options: ["Yağmur yağmasını", "Sabah güneşini", "Rüzgarın durmasını"],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🛑 Trafik İşaretleri!",
        rules: [
          {
            name: "Nokta (.)",
            desc: "Tamamen bitmiş, sonuna gelmiş cümlelerin en arkasına konur.",
            example: "Kedim sütünü içti.",
          },
          {
            name: "Virgül (,)",
            desc: "Cümle içinde peş peşe gelen benzer kelimeleri ayırmak için araya konur.",
            example: "Pazardan elma, armut, çilek aldım.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Doğru Noktalama",
        desc: "Cümlelerde boş bırakılan parantez içlerine gelmesi gereken doğru işareti seçiniz.",
        questions: [
          {
            id: 1,
            q: "Bugün sabah erkenden kalktım( )",
            options: [",", "."],
            correct: 1,
          },
          {
            id: 2,
            q: "Çantamda kalem( ) silgi ve defter var.",
            options: [",", "."],
            correct: 0,
          },
          {
            id: 3,
            q: "Ömer( ) Ali ve Can bahçede top oynuyorlar.",
            options: [",", "."],
            correct: 0,
          },
          {
            id: 4,
            q: "Ben bu sene okula başlayıp 3( ) sınıfa geçtim.",
            options: [",", "."],
            correct: 1,
          },
          {
            id: 5,
            q: "Annem pazardan taze limon( ) portakal ve muz aldı.",
            options: [",", "."],
            correct: 0,
          },
          {
            id: 6,
            q: "Yarın sabah hep birlikte pikniğe gideceğiz( )",
            options: [",", "."],
            correct: 1,
          },
          {
            id: 7,
            q: "Kitaplıktan sarı( ) kırmızı ve mavi boyaları çıkardı.",
            options: [",", "."],
            correct: 0,
          },
          {
            id: 8,
            q: "Yarışmada bizim sınıf tam 1( ) oldu.",
            options: [",", "."],
            correct: 1,
          },
          {
            id: 9,
            q: "Kedim Pamuk yerdeki sütü hızlıca içti( )",
            options: [",", "."],
            correct: 1,
          },
          {
            id: 10,
            q: "Masanın üzerinde silgi( ) kalemtıraş duruyordu.",
            options: [",", "."],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: İşaret Yerleştirme",
        desc: "Verilen cümlelerdeki parantezlerin içine sırasıyla hangi noktalama işaretleri gelmelidir?",
        questions: [
          {
            words: ["Virgül", "Virgül", "Nokta"],
            correct: "Virgül Virgül Nokta",
          },
          { words: ["Virgül", "Nokta"], correct: "Virgül Nokta" },
          { words: ["Nokta", "Nokta"], correct: "Nokta Nokta" },
          { words: ["Virgül", "Nokta"], correct: "Virgül Nokta" },
          { words: ["Virgül", "Nokta"], correct: "Virgül Nokta" },
          { words: ["Virgül", "Nokta"], correct: "Virgül Nokta" },
          { words: ["Virgül", "Nokta"], correct: "Virgül Nokta" },
          { words: ["Nokta", "Nokta"], correct: "Nokta Nokta" },
          { words: ["Virgül", "Nokta"], correct: "Virgül Nokta" },
          { words: ["Virgül", "Nokta"], correct: "Virgül Nokta" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🗺️ Doğu Anadolu Bölgesi ve Özellikleri",
          rules: [
            {
              name: "Coğrafi Yapı ve Dağlar",
              desc: "Ülkemizin doğusunda yer alır. Türkiye'nin en yüksek ve en dağlık bölgesidir. Yüksekliği nedeniyle kış mevsimi son derece sert, soğuk ve yoğun kar yağışlı geçer. Karlar yerde aylarca kalır.",
              example: "",
            },
            {
              name: "Ekonomik Faaliyetler",
              desc: "Tarım alanları az ve engebeli olduğu için bölgenin en büyük geçim kaynağı büyükbaş hayvancılıktır. Geniş meralarda hayvanlar otlatılır.",
              example: "",
            },
            {
              name: "Kültürel ve Tarihi Yapı",
              desc: "Ağrı'nın Doğubayazıt ilçesinde yer alan, mimarisiyle göz kamaştıran tarihi İshak Paşa Sarayı bu bölgenin en önemli kültürel ve mimari mirasıdır. Bölge, sert kış güzellikleri ve yüksek karlı dağ manzaralarıyla bilinir.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Doğu Anadolu Testi",
          desc: "Doğu Anadolu Bölgesi'nin özellikleri ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Doğu Anadolu Bölgesi'nin Türkiye'deki en belirgin fiziki özelliği aşağıdakilerden hangisidir?",
              options: [
                "En düz ve alçak bölge olması",
                "En yüksek, dağlık ve engebeli bölge olması",
                "Etrafının tamamen denizlerle çevrili olması",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "Bölgenin engebeli yapısı ve yüksekliği nedeniyle kış mevsimi nasıl geçmektedir?",
              options: [
                "Çok kısa, ılık ve yağmursuz",
                "Oldukça sert, çok soğuk ve yoğun kar yağışlı",
                "Sıcak ve kurak",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Ağrı sınırları içinde yer alan, Türk mimarisinin en önemli somut örneklerinden olan tarihi saray hangisidir?",
              options: [
                "Topkapı Sarayı",
                "İshak Paşa Sarayı",
                "Dolmabahçe Sarayı",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: "Doğu Anadolu Bölgesi'nde tarım arazilerinin az olması nedeniyle halk en çok hangi ekonomik faaliyete yönelmiştir?",
              options: [
                "Seracılık ve muz tarımı",
                "Büyükbaş hayvancılık",
                "Deniz ticaretini",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Doğu Anadolu Bölgesi ülkemizin hangi coğrafi yönünde yer almaktadır?",
              options: ["Batısında", "Doğusunda", "Kuzeyinde"],
              correct: 1,
            },
            {
              id: 6,
              q: "Bölgede yağan karların dağlarda ve şehirlerde aylarca yerde kalmasının temel sebebi nedir?",
              options: [
                "Hava sıcaklığının kışın sıfırın altında çok düşük değerlerde olması",
                "Bölgede hiç rüzgar esmemesi",
                "Toprağın sürekli sıcak olması",
              ],
              correct: 0,
            },
            {
              id: 7,
              q: "Doğu Anadolu Bölgesi'nin yüksek dağları en çok hangi spor ve turizm faaliyetine somut imkan sağlar?",
              options: [
                "Deniz yüzücülüğüne",
                "Kış sporları ve kayak turizmine",
                "Çöl safarisine",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Hayvancılığın geliştiği bu bölgede dağların eteklerinde hangi bitki örtüsü geniş yer tutar?",
              options: [
                "Akdeniz makileri",
                "Gür alpin çayırları ve otlaklar",
                "Çöl çalılıkları",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "İshak Paşa Sarayı mimari olarak incelendiğinde taş işçiliği bize neyi gösterir?",
              options: [
                "Bölgenin sanayi fabrikası olduğunu",
                "Tarihi ve kültürel el sanatlarının geçmişteki zenginliğini",
                "Bölgede hiç taş kalmadığını",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Doğu Anadolu Bölgesi'ndeki engebeli dağlık yapı ulaşımı nasıl etkiler?",
              options: [
                "Karayolu ve demiryolu yapımını zorlaştırır, kışın yolları kapatabilir",
                "Ulaşımın çok hızlı ve kolay olmasını sağlar",
                "Ulaşımı tamamen engeller, hiç yol yapılamaz",
              ],
              correct: 0,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Doğu Anadolu Doğrulama",
          desc: "Doğu Anadolu Bölgesi'yle ilgili ifadelerin doğru mu yanlış mı olduğunu belirtiniz.",
          questions: [
            {
              q: "Doğu Anadolu Bölgesi, Türkiye'nin ortalama yükseltisi en fazla olan bölgesidir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "İshak Paşa Sarayı, Doğu Anadolu Bölgesi'ndeki Ağrı şehrinde yer alan tarihi bir yapıdır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Bölgede yaz ayları Akdeniz Bölgesi'nden çok daha uzun ve sıcak geçer.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Geniş çayırlar ve meralar bulunması sebebiyle büyükbaş hayvancılık gelişmiştir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Doğu Anadolu Bölgesi'nde kışın yağan karlar hava ılık olduğu için hemen erir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Bölge, engebeli ve yüksek karlı dağ silsileleriyle kaplıdır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Doğu Anadolu Bölgesi, Türkiye'nin en batı ucunda, Ege Denizi'nin yanındadır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Yüksek dağlar, bölgede kış turizmi ve kayak merkezlerinin kurulmasını sağlamıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Bölgede evlerin yapımında kuraklıktan dolayı sadece palmiye yaprakları kullanılır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Sert karasal iklim nedeniyle kış aylarında sıcaklık sıfırın altına sıkça düşer.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
          ],
        },
      },
    },
  },
  "10": {
    story: {
      title: "KIRMIZI IŞIK",
      theme: "Güvenlik ve Kurallar",
      text: "Mert ve annesi öğlen markete gitmek için çıktı. Büyük caddenin kenarındaki geniş kaldırımdan yavaşça yürüdüler. Yaya geçidinin önüne geldiklerinde güvenle durdular. Karşıdaki elektrik direğinde uzun bir lamba vardı. Lambanın en üstünde kırmızı insan şekli yanıyordu. Mert annesinin elini sımsıkı tutarak beklemeye başladı. Az sonra lambadaki kırmızı renk söndü ve yeşil yandı. İkili çizgilerin üzerinden güvenli bir şekilde karşıya geçti.",
      questions: [
        {
          id: 1,
          q: "Mert ve annesi öğlen nereye gitmek için evden çıktı?",
          options: ["Okula", "Markete", "Parka"],
          correct: 1,
        },
        {
          id: 2,
          q: "Mert ve annesi caddenin neresinden yürüdüler?",
          options: [
            "Geniş kaldırımdan",
            "Arabaların geçtiği yoldan",
            "Bisiklet yolundan",
          ],
          correct: 0,
        },
        {
          id: 3,
          q: "Mert yaya geçidinin önünde durunca lambada hangi şekil yanıyordu?",
          options: [
            "Kırmızı insan şekli",
            "Yeşil araba şekli",
            "Sarı bir yıldız",
          ],
          correct: 0,
        },
        {
          id: 4,
          q: "Mert beklerken annesinin neresini sımsıkı tuttu?",
          options: ["Montunun cebini", "Elini", "Çantasını"],
          correct: 1,
        },
        {
          id: 5,
          q: "Bekledikten sonra hangi renk lamba yandı?",
          options: ["Sarı", "Mavi", "Yeşil"],
          correct: 2,
        },
        {
          id: 6,
          q: "Mert ve annesi yolun karşısına neyin üzerinden geçtiler?",
          options: [
            "Yoldaki çizgilerin üzerinden",
            "Üst geçidin merdiveninden",
            "Büyük taşların üzerinden",
          ],
          correct: 0,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🤔 Meraklı İşaret!",
        rules: [
          {
            name: "Soru İşareti (?)",
            desc: "İçinde soru sorma, bir şeyi merak edip öğrenme anlamı olan cümlelerin en sonuna konur.",
            example: "Kalemimi sen mi aldın?",
          },
          {
            name: "mı / mi Kuralı",
            desc: "Cümleye soru anlamı katan bu küçük ekler, kendinden önceki kelimeye asla yapışmaz! Her zaman ayrı yazılır.",
            example: "Doğru: Geliyor musun? Yanlış: Geliyormusun?",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİİK 1: Doğru Yazım Avcısı",
        desc: "Seçeneklerde soru ekinin yazımı tamamen doğru olan cümleyi bulunuz.",
        questions: [
          {
            id: 1,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: [
              "Bu kalemi senmi aldın?",
              "Benimle gelir misin?",
              "Kitap okuyacakmısın?",
            ],
            correct: 1,
          },
          {
            id: 2,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: [
              "Akşam bize geliyormusun?",
              "Sütünü içtin mi?",
              "Yuvayı gördünmü?",
            ],
            correct: 1,
          },
          {
            id: 3,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: [
              "Oyun bitti mi?",
              "Kalemini buldunmu?",
              "Ödevini yaptınmı?",
            ],
            correct: 0,
          },
          {
            id: 4,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: [
              "Topu bana atarmısın?",
              "Kapıyı açtın mı?",
              "Dışarı çıkalımmı?",
            ],
            correct: 1,
          },
          {
            id: 5,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: [
              "Kediyi gördün mü?",
              "Kediyi gördünmü?",
              "Kediyimü gördün?",
            ],
            correct: 0,
          },
          {
            id: 6,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: [
              "Silgin bende kaldımı?",
              "Ders başladı mı?",
              "Saat kaçoldumu?",
            ],
            correct: 1,
          },
          {
            id: 7,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: [
              "Elmayı yedinmi?",
              "Yeni çanta aldın mı?",
              "Parka gidelimmi?",
            ],
            correct: 1,
          },
          {
            id: 8,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: [
              "Havuzda yüzdün mü?",
              "Havuzda yüzdünmü?",
              "Havuzdamı yüzdün?",
            ],
            correct: 0,
          },
          {
            id: 9,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: [
              "Bu kitabı okudunmu?",
              "Ankara'ya gittin mi?",
              "Sınav bitmişmi?",
            ],
            correct: 1,
          },
          {
            id: 10,
            q: "Hangi cümlenin yazımı doğrudur?",
            options: ["Beni duydun mu?", "Beni duydunmu?", "Benimi duydun?"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Son İşaret",
        desc: "Cümlelerin sonundaki parantezlerin içine Nokta (.) mı yoksa Soru İşareti (?) mi gelmelidir?",
        questions: [
          { words: ["Bugün okula gittin mi"], correct: "?" },
          { words: ["Bugün sabah erkenden okula gittim"], correct: "." },
          { words: ["Benimle bahçede top oynar mısın"], correct: "?" },
          { words: ["Bahçede arkadaşlarımla top oynadım"], correct: "." },
          { words: ["Odandaki oyuncak kutusunu topladın mı"], correct: "?" },
          { words: ["Akşamüstü bütün odamı güzelce topladım"], correct: "." },
          { words: ["Bu kırmızı çizgili cüzdan senin mi"], correct: "?" },
          {
            words: ["Yerde bulduğum cüzdanı öğretmenime verdim"],
            correct: ".",
          },
          { words: ["Saat kaçta evde olacaksın"], correct: "?" },
          {
            words: ["Anneminin elini sımsıkı tutup markete yürüdüm"],
            correct: ".",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🗺️ Güneydoğu Anadolu Bölgesi ve Özellikleri",
          rules: [
            {
              name: "Konumu ve Fiziki Yapısı",
              desc: "Ülkemizin güneydoğusunda yer alır. Yüzölçümü olarak en küçük bölgelerimizden biridir. Genellikle düzlükler ve geniş platolardan oluşur. Yaz ayları Türkiye'nin en sıcak ve en kurak dönemini yaşar.",
              example: "",
            },
            {
              name: "Kültürel ve Tarihi Miras",
              desc: "İnsanlık tarihinin en önemli somut yapılarına ev sahipliği yapar. Şanlıurfa'da yer alan ve \"tarihin sıfır noktası\" olarak kabul edilen dünyanın en eski tapınağı Göbeklitepe buradadır. Ayrıca Adıyaman'daki dev kral heykellerinin bulunduğu Nemrut Dağı ve Mardin'deki tarihi taş evler bölgenin köklü geçmişini somut olarak kanıtlar.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Güneydoğu Coğrafyası Testi",
          desc: "Güneydoğu Anadolu Bölgesi'nin özellikleri ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: 'Şanlıurfa sınırları içinde yer alan ve "tarihin sıfır noktası" olarak kabul edilen dünyanın en eski tapınak kalıntısı hangisidir?',
              options: ["Efes Antik Kenti", "Göbeklitepe", "İshak Paşa Sarayı"],
              correct: 1,
            },
            {
              id: 2,
              q: "Adıyaman'da yer alan, zirvesinde dev kral ve tanrı heykellerinin bulunduğu tarihi dağ hangisidir?",
              options: ["Kaçkar Dağı", "Nemrut Dağı", "Erciyes Dağı"],
              correct: 1,
            },
            {
              id: 3,
              q: "Güneydoğu Anadolu Bölgesi'ndeki Mardin şehrinin en belirgin mimari ve kültürel özelliği hangisidir?",
              options: [
                "Tamamen ahşaptan yapılmış gökdelenler",
                "Tarihi ve mimari değere sahip sarı kalker taşından evler",
                "Evlerin sadece çadırardan oluşması",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: "Güneydoğu Anadolu Bölgesi'nin yaz mevsimi iklim özellikleri yönünden nasıl tanımlanır?",
              options: [
                "Türkiye'nin en sıcak ve buharlaşmanın en yoğun olduğu kurak bölgesi",
                "Her gün düzenli olarak yağmur yağan serin yer",
                "Karlar hiçbir zaman erimediği dondurucu alan",
              ],
              correct: 0,
            },
            {
              id: 5,
              q: "Güneydoğu Anadolu Bölgesi yeryüzü şekilleri bakımından nasıldır?",
              options: [
                "Çok yüksek, aşırı engebeli dağ zincirleriyle kaplıdır",
                "Genellikle düzlükler, alçak platolar ve geniş ovalardan oluşur",
                "Tamamen derin deniz çukurları ile doludur",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Göbeklitepe'nin dünya tarihi açısından en büyük somut önemi aşağıdakilerden hangisidir?",
              options: [
                "Bilinen en eski tarım fabrikası olması",
                "İnsanlık tarihinin inşa edilmiş en eski anıtsal tapınağı ve merkezi olması",
                "Sadece büyük bir çöp alanı olması",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Bölgenin güney sınırında yer alan ovaların sulanması ve tarımın gelişmesi hangi büyük proje ile sağlanmıştır?",
              options: [
                "Mavi Vatan Projesi",
                "Güneydoğu Anadolu Projesi (GAP)",
                "İstanbul Boğazı Köprü Projesi",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Mardin'deki tarihi evlerin yapımında taş kullanılmasının somut sebebi nedir?",
              options: [
                "Bölgede hiç toprak bulunmaması",
                "Taşın yazın serin, kışın sıcak tutma özelliği ve bölgede kolay bulunması",
                "Evlerin hafif olmasını sağlamak istemeleri",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Nemrut Dağı'nin zirvesindeki dev heykeller hangi tarihi krallığa ait kalıntılardır?",
              options: [
                "Kommagene Krallığı",
                "Roma İmparatorluğu",
                "Osmanlı Devleti",
              ],
              correct: 0,
            },
            {
              id: 10,
              q: "Güneydoğu Anadolu Bölgesi ülkemizin hangi coğrafi yönünde yer almaktadır?",
              options: ["Kuzeybatısında", "Güneydoğusunda", "Tam merkezinde"],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Güneydoğu Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "Dünyanın en eski tapınak merkez olan Göbeklitepe .................... şehrimiz sınırları içindedir.",
              words: ["Şanlıurfa", "Adıyaman"],
              correct: "Şanlıurfa",
            },
            {
              q: "Üzerinde dev heykellerin bulunduğu tarihi miras .................... Dağı'nın zirvesindedir.",
              words: ["Nemrut", "Kaçkar"],
              correct: "Nemrut",
            },
            {
              q: "Mardin ilindeki evlerin en büyük yapı malzemesi sarı renkli .................... olarak bilinir.",
              words: ["taşlar", "tahtalar"],
              correct: "taşlar",
            },
            {
              q: "Güneydoğu Anadolu Bölgesi yaz aylarında Türkiye'nin en .................... yeridir.",
              words: ["sıcak", "soğuk"],
              correct: "sıcak",
            },
            {
              q: "Fiziki yapı incelendiğinde bölge Doğu Anadolu gibi dağlık değil, daha .................... bir yapıya sahiptir.",
              words: ["düz", "engebeli"],
              correct: "düz",
            },
            {
              q: "Göbeklitepe mimari ve tarihi özellikleri sebebiyle uzmanlarca tarihin .................... noktası seçilmiştir.",
              words: ["sıfır", "son"],
              correct: "sıfır",
            },
            {
              q: "Bölgedeki kuraklık ve yüksek sıcaklık yaz aylarında sudaki .................... oranını artırır.",
              words: ["buharlaşma", "donma"],
              correct: "buharlaşma",
            },
            {
              q: "Fırat ve Dicle nehirlerinin suları bu kurak bölgedeki ovalara .................... sağlar.",
              words: ["sulama", "kuraklık"],
              correct: "sulama",
            },
            {
              q: "Adıyaman'daki Nemrut Dağı her yıl çok sayıda yerli ve yabancı .................... ağırlar.",
              words: ["turisti", "fabrikayı"],
              correct: "turisti",
            },
            {
              q: "Bölgenin coğrafi yapısı geniş otlaklar yerine ekilebilir büyük .................... uygundur.",
              words: ["ovalara", "dağlara"],
              correct: "ovalara",
            },
          ],
        },
      },
    },
  },
  "11": {
    story: {
      title: "PARKTAKİ ESKİ KULÜBE",
      theme: "Yardımlaşma",
      text: "Eda ve Kaan, güneşli bir hafta sonu mahalledeki büyük çocuk parkına gittiler. Parkın en köşesinde duran yaşlı çınar ağacının dalında eski bir kuş kulübesi gördüler. Kulübenin tahtaları fırtınadan dolayı çatlamış ve mavi boyaları tamamen dökülmüştü. İki arkadaş, sevimli kuşların evsiz kalmasına çok üzüldü ve hemen bir plan yaptı. Kaan koşarak evdeki atölyeden sarı, yeşil ve kırmızı boya kutularını getirdi. Eda ise çantasına sakladığı iki adet kalın fırçayı masanın üzerine çıkardı. El ele veren iki arkadaş, çatlak tahtaları düzeltip kulübeyi neşeyle boyamaya başladılar. Kısa süre sonra eski kulübe rengarenk ve pırıl pırıl bir yuvaya dönüştü. İçine kuşlar acıkmasın diye bir avuç buğday ve taze su bıraktılar. İki küçük dost, ağacın altına geçip neşeyle öten minik kuşları mutlulukla izledi.",
      questions: [
        {
          id: 1,
          q: "Eda ve Kaan parka ne zaman gittiler?",
          options: [
            "Yağmurlu bir kış günü",
            "Güneşli bir hafta sonu",
            "Okul çıkışı akşam vakti",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Eski kuş kulübesi hangi ağacın dalında duruyordu?",
          options: [
            "Yaşlı çınar ağacının",
            "Küçük yeşil çam ağacının",
            "Meyve dolu elma ağacının",
          ],
          correct: 0,
        },
        {
          id: 3,
          q: "Kulübenin eski boyası ne renkliydi?",
          options: ["Kırmızı", "Sarı", "Mavi"],
          correct: 2,
        },
        {
          id: 4,
          q: "Kaan evdeki atölyeden hangi renk boyaları getirdi?",
          options: [
            "Sarı, yeşil ve kırmızı",
            "Mavi, mor ve beyaz",
            "Siyah, gri ve turuncu",
          ],
          correct: 0,
        },
        {
          id: 5,
          q: "Eda fırçaları parka nerede taşıyarak getirdi?",
          options: [
            "Elinde tutarak",
            "Çantasına saklayarak",
            "Büyük bir kutunun içinde",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Çocuklar boyama yapmadan önce kulübeye ne yaptılar?",
          options: [
            "Ağaçtan aşağıya indirdiler",
            "Çatlak tahtaları düzelttiler",
            "Kulübenin kapısını kırdılar",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Kulübenin içine kuşlar için ne koydular?",
          options: [
            "Bir avuç buğday ve taze su",
            "Renkli küçük taşlar",
            "Yumuşak beyaz pamuklar",
          ],
          correct: 0,
        },
        {
          id: 8,
          q: "Hikayenin sonunda iki arkadaş ne yaptı?",
          options: [
            "Parktaki salıncakta sallandılar",
            "Ağacın altına geçip öten kuşları izlediler",
            "Evlerine doğru hızlıca koştular",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🏷️ Dünyadaki Her Şeyin Bir Adı Var!",
        rules: [
          {
            name: "Ad (İsim)",
            desc: "Çevremizde gördüğümüz bütün somut varlıkları çağırmak ve tanımak için kullandığımız kelimelere Ad (İsim) denir.",
            example: "",
          },
          {
            name: "Özel Adlar",
            desc: "Dünyada sadece tek bir varlığa ait olan, eşi benzeri olmayan isimlerdir. İlk harfferi her zaman büyük yazılır!",
            example: "Eda, İstanbul, Türkiye, Pamuk.",
          },
          {
            name: "Cins (Tür) Adları",
            desc: "Aynı türden olan birçok sıradan varlığın ortak adıdır. Cümle içinde küçük harfle yazılırlar.",
            example: "ağaç, defter, fırça, kuş.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Ad Sınıflandırıcı",
        desc: "Verilen kelimelerin özel ad mı yoksa cins ad mı olduğunu kutularla doğru şekilde eşleştiriniz.",
        questions: [
          {
            id: 1,
            q: '"Kaan" kelimesi',
            options: ["Özel Ad", "Cins Ad"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Kulübe" kelimesi',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
          {
            id: 3,
            q: '"Ankara" kelimesi',
            options: ["Özel Ad", "Cins Ad"],
            correct: 0,
          },
          {
            id: 4,
            q: '"Fırça" kelimesi',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
          {
            id: 5,
            q: '"Tekir" (Kedi ismi)',
            options: ["Özel Ad", "Cins Ad"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Ağaç" kelimesi',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
          {
            id: 7,
            q: '"Almanya" kelimesi',
            options: ["Özel Ad", "Cins Ad"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Kitap" kelimesi',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
          {
            id: 9,
            q: '"Cumartesi" kelimesi',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
          {
            id: 10,
            q: '"Masa" kelimesi',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Türünü Seç",
        desc: "Sorularda altı çizili olan kelimenin türünü seçeneklerden bulunuz.",
        questions: [
          {
            id: 1,
            q: '"Kaan koşarak evdeki atölyeden boyaları getirdi." cümlesindeki boya kelimesi hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
          {
            id: 2,
            q: '"Eda, sevimli kuşların evsiz kalmasına çok üzüldü." cümlesindeki Eda kelimesi hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 0,
          },
          {
            id: 3,
            q: '"Ülkemiz Türkiye çok güzel bir yerdedir." cümlesindeki altı çizili kelime hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 0,
          },
          {
            id: 4,
            q: '"Masanın üzerinde iki tane fırça duruyordu." cümlesindeki altı çizili kelime hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
          {
            id: 5,
            q: '"Köpeğim Karabaş bahçede kulübesine doğru koştu." cümlesindeki altı çizili kelime hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Pazardan taze taze yeşil elma aldım." cümlesindeki altı çizili kelime hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
          {
            id: 7,
            q: '"Gelecek hafta sonu İzmir şehrine teyzemlere gideceğiz." cümlesindeki altı çizili kelime hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Sırtımdaki okul çantası bugün çok ağır geliyordu." cümlesindeki altı çizili kelime hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
          {
            id: 9,
            q: '"Arkadaşım Murat bankta oturup beni bekledi." cümlesindeki altı çizili kelime hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Bahçedeki çınar ağacının yaprakları tamamen dökülmüş." cümlesindeki altı çizili kelime hangisidir?',
            options: ["Özel Ad", "Cins Ad"],
            correct: 1,
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Selanik'teki Pembe Ev",
          rules: [
            {
              name: "Üç Katlı Pembe Ev Resmi",
              desc: "Tarih atlaslarında Mustafa Kemal Atatürk'ün çocukluk günleri incelendiğinde, ilk olarak Selanik şehrinde bulunan üç katlı, pembe boyalı, ahşap pencereli bir ev resmi görülür. Atatürk, bu evde doğmuş ve çocukluk yıllarını annesi Zübeyde Hanım, babası Ali Rıza Efendi ve kız kardeşi Makbule Hanım ile bu sıcak odalarda geçirmiştir.",
              example: "",
            },
            {
              name: "Çiftlik Hayatı ve Karga Simgeleri",
              desc: "Haritada Selanik'in hemen yanında geniş bir çiftlik arazisi çizilmiştir; burası Dayısı Hüseyin Efendi'nin çalıştığı Langaza Çiftliği'dir. Babasını küçük yaşta kaybeden Mustafa, annesiyle birlikte bu çiftliğe taşınmıştır. Tarım haritasında bu çiftliğin üzerinde, elinde küçük bir sopa tutan çocuk figürü ile tarladaki mısırları korumak için kovaladığı siyah karga resimleri yer alır. Bu somut sahneler onun doğaya ve sorumluluklara alışma dönemini betimler.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Çocukluk Günleri Testi",
          desc: "Mustafa Kemal Atatürk'ün çocukluğu ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Mustafa Kemal Atatürk'ün doğduğu ve çocukluğunun ilk yıllarını geçirdiği o ünlü üç katlı pembe ev hangi şehirdedir?",
              options: ["İstanbul", "Selanik", "Ankara"],
              correct: 1,
            },
            {
              id: 2,
              q: "Mustafa'nın çocukluk aile tablosunda annesinin ve kız kardeşinin isimleri sırasıyla hangi seçenekte doğru verilmiştir?",
              options: [
                "Melahat Hanım - Fatma Hanım",
                "Zübeyde Hanım - Makbule Hanım",
                "Latife Hanım - Sabiha Hanım",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Mustafa'nın babasının ve dayısının isimleri albümde sırasıyla nasıl yer alır?",
              options: [
                "Ahmet Bey - Mehmet Efendi",
                "Ali Rıza Efendi - Hüseyin Efendi",
                "Hasan Bey - Ömer Efendi",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: "Mustafa ve ailesinin babasının vefatından sonra taşınarak bir süre yaşadığı geniş tarım arazisinin adı nedir?",
              options: ["Langaza Çiftliği", "Orman Çiftliği", "Saray Bahçesi"],
              correct: 0,
            },
            {
              id: 5,
              q: "Çiftlik resimlerinde Mustafa'nın mısır tarlalarını korumak için üstlendiği ilk somut sorumluluk görevi hangisidir?",
              options: [
                "Traktör sürmek",
                "Zararlı kargaları tarladan uzaklaştırmak",
                "Koyunları kırkmak",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Selanik şehrinin haritadaki konumuna bakıldığında deniz kıyısında ve ticaret yollarında olması Mustafa'nın çocukluğunu nasıl etkilemiştir?",
              options: [
                "Farklı kültürleri ve dünyayı küçük yaşta tanımasını sağlamıştır.",
                "Okula gitmesini tamamen engellemiştir.",
                "Sadece çiftçilik yapmasına neden olmuştur.",
              ],
              correct: 0,
            },
            {
              id: 7,
              q: "Albümdeki pembe evin ahşap mimarisi geçmiş dönemdeki hangi yaşam tarzını somutlaştırır?",
              options: [
                "Modern gökdelen mimarisini",
                "Osmanlı dönemindeki geleneksel aile evi yapısını",
                "Taş mağara düzenini",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Mustafa'nın çiftlikte çalışırken kazandığı en belirgin özellik aşağıdakilerden hangisidir?",
              options: [
                "Sorumluluk alma ve doğayı sevme bilinci",
                "Ticaret yaparak zengin olma amacı",
                "Kitap okumaktan tamamen vazgeçmesi",
              ],
              correct: 0,
            },
            {
              id: 9,
              q: "Mustafa'nın çocukluk yıllarında babası Ali Rıza Efendi'nin yaptığı meslekler nelerdir?",
              options: [
                "Gümrük memurluğu ve kereste ticareti",
                "Sadece çiftçilik",
                "Saray doktorluğu",
              ],
              correct: 0,
            },
            {
              id: 10,
              q: "Mustafa'nın doğduğu dönemde Selanik şehri hangi devletin sınırları içerisinde yer alan hareketli bir limandı?",
              options: [
                "Osmanlı Devleti",
                "Fransa Cumhuriyeti",
                "Almanya İmparatorluğu",
              ],
              correct: 0,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Çocukluk Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "Mustafa Kemal Atatürk, Osmanlı Devleti'nin önemli bir liman şehri olan .................... 'de doğmuştur.",
              words: ["Selanik", "Ankara"],
              correct: "Selanik",
            },
            {
              q: "Çocukluk albümünde yer alan Atatürk'ün doğduğu ev üç katlı ve .................... boyalıdır.",
              words: ["pembe", "mavi"],
              correct: "pembe",
            },
            {
              q: "Mustafa'nın babası vefat edince annesi .................... Hanım çocuklarını alarak çiftliğe gitmiştir.",
              words: ["Zübeyde", "Makbule"],
              correct: "Zübeyde",
            },
            {
              q: "Dayısı Hüseyin Efendi'nin çalıştığı yerin adı .................... Çiftliği olarak bilinir.",
              words: ["Langaza", "Devlet"],
              correct: "Langaza",
            },
            {
              q: "Tarlada çalışırken Mustafa'nın görevi mısırlara zarar veren siyah .................... kuşlarını kovalamaktır.",
              words: ["karga", "güvercin"],
              correct: "karga",
            },
            {
              q: "Mustafa'nın babasının adı .................... Efendi'dir ve gümrük memurluğu yapmıştır.",
              words: ["Ali Rıza", "Hüseyin"],
              correct: "Ali Rıza",
            },
            {
              q: "Kız kardeşi .................... Hanım ile çiftlikteki yeşil alanlarda oyunlar oynamışlardır.",
              words: ["Makbule", "Sabiha"],
              correct: "Makbule",
            },
            {
              q: "Çiftlikteki bu hareketli açık hava hayatı Mustafa'nın .................... sevgisini artırmıştır.",
              words: ["doğa", "fabrika"],
              correct: "doğa",
            },
            {
              q: "Selanik'in deniz kıyısında olması şehirde büyük bir deniz .................... bulunmasını sağlıyordu.",
              words: ["ticareti", "kuraklığı"],
              correct: "ticareti",
            },
            {
              q: "Mustafa, çocukluk yıllarında karşılaştığı zorluklar karşısında asla .................... etmemiştir.",
              words: ["pes", "kabul"],
              correct: "pes",
            },
          ],
        },
      },
    },
  },
  "12": {
    story: {
      title: "EN UZUN ÇİZGİLİ UÇURTMA",
      theme: "Paylaşma",
      text: "Emre, rüzgarlı bir cumartesi sabahı rengarenk uçurtmasını uçurmak için sahildeki geniş alana gitti. Elindeki uçurtma, üzerinde sarı ve lacivert çizgiler olan dev bir üçgendi. Güçlü rüzgar sayesinde uçurtma gökyüzünde adeta bir kuş gibi süzülmeye başladı. O sırada sahil kenarındaki bankta oturan minik bir çocuk dikkatini çekti. Bu küçük çocuk, elinde hiçbir oyuncak olmadan sadece Emre'nin uçurtmasını izliyordu. Çocuğun gözlerindeki üzgün bakışları fark eden Emre, hemen onun yanına doğru yürüdü. Gülümseyerek, 'Bu uçurtmayı gökyüzünde birlikte tutmak ister misin?' diye sordu. Küçük çocuk heyecanla ayağa kalktı ve Emre'nin uzattığı kalın ipi sıkıca yakaladı. İki çocuk, rüzgara karşı ipi birlikte salıp uçurtmanın bulutlara kadar yükselişini izlediler. Paylaşmanın mutluluğu, sahilde esen sert rüzgardan çok daha sıcaktı.",
      questions: [
        {
          id: 1,
          q: "Emre sahile hangi gün gitti?",
          options: [
            "Rüzgarlı bir cumartesi sabahı",
            "Güneşli bir pazar akşamı",
            "Karlı bir cuma öğleden sonra",
          ],
          correct: 0,
        },
        {
          id: 2,
          q: "Emre'nin uçurtması hangi şekle benziyordu?",
          options: [
            "Büyük bir kareye",
            "Dev bir üçgene",
            "Yuvarlak bir daireye",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "Uçurtmanın üzerinde hangi renk çizgiler vardı?",
          options: ["Sarı ve lacivert", "Yeşil ve siyah", "Kırmızı ve beyaz"],
          correct: 0,
        },
        {
          id: 4,
          q: "Bankta oturan küçük çocuk ne yapıyordu?",
          options: [
            "Kitap okuyordu",
            "Sadece Emre'nin uçurtmasını izliyordu",
            "Simit yiyordu",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Emre banktaki çocuğun yanına gidince ona ne sordu?",
          options: [
            "'Uçurtmayı gökyüzünde birlikte tutmak ister misin?'",
            "'Benimle parkta top oynamaya gelir misin?'",
            "'Çantandaki boya kalemlerini bana verir misin?'",
          ],
          correct: 0,
        },
        {
          id: 6,
          q: "Küçük çocuk teklifi duyunca ne yaptı?",
          options: [
            "Ağlayarak annesinin yanına kaçtı",
            "Heyecanla ayağa kalkıp ipi sıkıca yakaladı",
            "Bankta oturup izlemeye devam etti",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Uçurtma gökyüzünde nereye kadar yükseldi?",
          options: [
            "Ağaçların boyuna kadar",
            "Bulutlara kadar",
            "Deniz seviyesine kadar",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Hikayenin ana fikri aşağıdakilerden hangisidir?",
          options: [
            "Rüzgarlı havada dışarı çıkmamalıyız.",
            "Paylaşmak insanı mutlu eder.",
            "Sahilde tek başımıza oynamalıyız.",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🔢 Bir mi, Çok mu?",
        rules: [
          {
            name: "Tekil Adlar",
            desc: "Sadece tek bir varlığı anlatan, içinde çokluk eki barındırmayan isimlerdir.",
            example: "uçurtma, kuş, çocuk, sahil, ip.",
          },
          {
            name: "Çoğul Adlar",
            desc: 'Aynı varlıktan birden fazla olduğunu gösteren isimlerdir. Kelimelerin sonuna gelen "-ler" veya "-lar" ekiyle yapılırlar!',
            example: "uçurtmalar, kuşlar, çocuklar, bulutlar.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Çoğul Yapıcı",
        desc: 'Verilen tekil kelimeleri çoğul yapmak için boş bırakılan yerlere "-ler" mi yoksa "-lar" mı gelmelidir?',
        questions: [
          {
            id: 1,
            q: "Uçurtma.... gökyüzünde süzülüyor.",
            options: ["-ler", "-lar"],
            correct: 1,
          },
          {
            id: 2,
            q: "Çocuk.... parkta neşeyle koşuyor.",
            options: ["-ler", "-lar"],
            correct: 1,
          },
          {
            id: 3,
            q: "Ev.... rüzgardan dolayı sallandı.",
            options: ["-ler", "-lar"],
            correct: 0,
          },
          {
            id: 4,
            q: "Bulut.... gökyüzünü kapladı.",
            options: ["-ler", "-lar"],
            correct: 1,
          },
          {
            id: 5,
            q: "Kalem.... çantamın içine döküldü.",
            options: ["-ler", "-lar"],
            correct: 0,
          },
          {
            id: 6,
            q: "Balık.... denizde hızlıca yüzüyor.",
            options: ["-ler", "-lar"],
            correct: 1,
          },
          {
            id: 7,
            q: "Defter.... masanın üzerinde duruyor.",
            options: ["-ler", "-lar"],
            correct: 0,
          },
          {
            id: 8,
            q: "Ağaç.... sonbaharda yaprak döker.",
            options: ["-ler", "-lar"],
            correct: 1,
          },
          {
            id: 9,
            q: "Kedi.... bahçe kapısında bekliyor.",
            options: ["-ler", "-lar"],
            correct: 0,
          },
          {
            id: 10,
            q: "Silgi.... sıranın altına düşmüş.",
            options: ["-ler", "-lar"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Sayı Dedektifi",
        desc: "Verilen kelimelerin tekil mi çoğul mu olduğunu kutularla doğru şekilde eşleştiriniz.",
        questions: [
          { words: ["Uçurtma", "Tekil", "Çoğul"], correct: "Tekil" },
          { words: ["Çizgiler", "Tekil", "Çoğul"], correct: "Çoğul" },
          { words: ["Bank", "Tekil", "Çoğul"], correct: "Tekil" },
          { words: ["Bulutlar", "Tekil", "Çoğul"], correct: "Çoğul" },
          { words: ["İpler", "Tekil", "Çoğul"], correct: "Çoğul" },
          { words: ["Sahil", "Tekil", "Çoğul"], correct: "Tekil" },
          { words: ["Kuşlar", "Tekil", "Çoğul"], correct: "Çoğul" },
          { words: ["Deniz", "Tekil", "Çoğul"], correct: "Tekil" },
          { words: ["Gemiler", "Tekil", "Çoğul"], correct: "Çoğul" },
          { words: ["Kavanoz", "Tekil", "Çoğul"], correct: "Tekil" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Mahalle Mektebinden Askeri İdadile",
          rules: [
            {
              name: "Farklı Okul Binaları",
              desc: "Mustafa'nın eğitim kronolojisi incelendiğinde harita üzerinde sırayla dizilmiş farklı okul binalarının resimleri görülür. İlk olarak annesinin isteğiyle gittiği geleneksel Mahalle Mektebi binası, hemen ardından babasının isteğiyle geçtiği modern eğitim veren Şemsi Efendi İlkokulu çizilidir.",
              example: "",
            },
            {
              name: '"Kemal" Adının Alındığı Askeri Okul',
              desc: 'Eğitim haritasında en dikkat çekici logo, Selanik Askeri Rüştiyesi (Ortaokulu) binasıdır. Mustafa, askerlik mesleğini çok sevdiği için gizlice bu okulun sınavlarına girmiş ve kazanmıştır. Matematik dersindeki üstün başarısı sebebiyle, matematik öğretmeni Mustafa Bey ona "Bilgi bakımından eksiksiz, olgun" anlamına gelen "Kemal" adını bu okulun taş sınıflarında vermiştir.',
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Eğitim Kronolojisi Testi",
          desc: "Mustafa Kemal'in eğitim hayatı ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Mustafa'nın eğitim hayatında annesinin isteğiyle başladığı geleneksel tarzda eğitim veren ilk okul hangisidir?",
              options: [
                "Şemsi Efendi İlkokulu",
                "Mahalle Mektebi",
                "Harp Okulu",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "Mustafa'nın babasının isteğiyle geçtiği, yeni ve modern yöntemlerle eğitim sunan ilkokul binasının adı nedir?",
              options: [
                "Selanik Mülkiye Rüştiyesi",
                "Şemsi Efendi İlkokulu",
                "Harp Akademisi",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: 'Mustafa\'ya ikinci adı olan "Kemal" ismi hangi ders öğretmeni tarafından somut başarıları sonucunda verilmiştir?',
              options: [
                "Tarih öğretmeni",
                "Matematik öğretmeni Mustafa Bey",
                "Türkçe öğretmeni",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: 'Mustafa Kemal\'in "Kemal" adını aldığı ve üniforma giymeye başladığı askeri rüştiye hangi şehirdedir?',
              options: ["Ankara", "Selanik", "İstanbul"],
              correct: 1,
            },
            {
              id: 5,
              q: "Mustafa Kemal, tarih dersine ve edebiyata büyük ilgi duyduğu Askeri İdadiyi (Liseyi) hangi şehirde okumuştur?",
              options: ["Selanik", "Manastır", "Trablusgarp"],
              correct: 1,
            },
            {
              id: 6,
              q: "Eğitim hayatının en son aşamasında kurmay yüzbaşı rütbesyle mezun olduğu, haritada en üst rütbe çizgisiyle gösterilen okul hangisidir?",
              options: [
                "Selanik Askeri Rüştiyesi",
                "İstanbul Harp Akademisi",
                "Mahalle Mektebi",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Askeri okullardaki ders başarı grafikleri incelendiğinde Mustafa Kemal'in en çok hangi alanlara yeteneği olduğu görülür?",
              options: [
                "Matematik, yabancı dil, tarih ve hitabet (güzel konuşma)",
                "Sadece resim ve müzik",
                "Ticaret ve muhasebe",
              ],
              correct: 0,
            },
            {
              id: 8,
              q: "Mustafa Kemal'in askeri okullara girmek için annesinden gizli olarak sınavlara katılması onun hangi karakter özelliğini gösterir?",
              options: [
                "Kararsız ve korkak olduğunu",
                "Kararlı, idealist ve ne istediğini bilen bir yapıya sahip olduğunu",
                "Okulu hiç sevmediğini",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Mustafa Kemal'in eğitim aldığı dönemde İstanbul şehri Osmanlı Devleti için hangi konumdaydı?",
              options: [
                "Sadece küçük bir ticaret kasabasıydı.",
                "Devletin başkenti ve en büyük yönetim merkeziydi.",
                "Denizlerden uzak bir kara köyüydü.",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Şemsi Efendi İlkokulu'nun Mustafa Kemal'in zihin yapısına sağladığı en büyük somut katkı nedir?",
              options: [
                "Sadece okuma yazma öğretmesi",
                "Modern, bilimsel ve yenilikçi düşüncelerin temelini atması",
                "Askerlikten tamamen uzaklaştırması",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Eğitim Alanı Doğrulaması",
          desc: "Mustafa Kemal'in eğitim hayatıyla ilgili ifadelerin doğru mu yanlış mı olduğunu belirtiniz.",
          questions: [
            {
              q: "Mustafa Kemal'e \"Kemal\" adı Selanik Askeri Rüştiyesi'nde matematik öğretmeni tarafından verilmiştir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Mustafa Kemal eğitim hayatına ilk olarak İstanbul Harp Akademisi binasında başlamıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Şemsi Efendi İlkokulu, dönemine göre oldukça modern ve yenilikçi eğitim veren bir okuldu.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Mustafa Kemal askeri liseyi Manastır şehrindeki Askeri İdadi binasında tamamlamıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Eğitim hayatı boyunca Mustafa Kemal matematik dersinden her zaman başarısız olmuş ve kalmıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Haritada en son mezun olduğu en üst askeri okul İstanbul'daki Harp Akademisi'dir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Mustafa Kemal, annesinin zoruyla askeri okulların sınavlarına katılmış ve istemeden subay olmuştur.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Manastır Askeri İdadisi'nde okurken tarih derslerine karşı büyük bir ilgi ve merak geliştirmiştir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Mustafa Kemal okul yıllarında sadece kendi ders kitaplarını okumuş, başka hiçbir kitapla ilgilenmemiştir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Kurmay yüzbaşı rütbe çizgisi, onun orduya adım attığı ilk resmi başarı simgesidir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
          ],
        },
      },
    },
  },
  "13": {
    story: {
      title: "ARILARIN GİZLİ DANSI",
      theme: "Bilgilendirici / Hayvanlar",
      text: "Arılar, doğadaki en çalışkan ve en akıllı küçük canlılar arasında yer alır. Onlar gün boyunca rengarenk çiçekleri gezerek tatlı bal yapmak için nektar toplarlar. Peki bir arı, çok güzel çiçeklerle dolu bir yer bulduğunda arkadaşlarına nasıl haber verir? Arıların kendi aralarında kullandıkları harika ve gizli bir konuşma dili vardır. Kovana dönen kaşif arı, diğer işçi arıların önüne geçerek havada uçmaya başlar. Uçarken gökyüzünde sürekli olarak mükemmel bir 'sekiz' şekli çizer. Bu özel hareketlere bilim insanları arıların 'sallantı dansı' adını vermişti. Dansın yönü ve hızı, çiçeklerin kovana ne kadar uzakta olduğunu tam olarak anlatır. Diğer arılar bu somut dansı izler ve yönlerini kolayca bulup çiçeğe uçarlar. Küçücük arıların haritaya ihtiyaç duymadan bu şekilde anlaşması gerçekten büyüleyicidir.",
      questions: [
        {
          id: 1,
          q: "Arılar gün boyunca bal yapmak için çiçeklerden ne toplarlar?",
          options: ["Renkli yapraklar", "Tatlı nektarlar", "Küçük tohumlar"],
          correct: 1,
        },
        {
          id: 2,
          q: "Çiçek bulan bir arı arkadaşlarına haber vermek için nereye döner?",
          options: ["Kovana", "Ağaç dalına", "Büyük bir taşa"],
          correct: 0,
        },
        {
          id: 3,
          q: "Kaşif arı diğer arıların önünde havada hangi şekli çizer?",
          options: [
            "Büyük bir kare şekli",
            "Mükemmel bir 'sekiz' şekli",
            "Uzun bir düz çizgi",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Bilim insanları arıların yaptığı bu hareketlere ne ad vermiştir?",
          options: ["Koşu yarışı", "Sallantı dansı", "Bahar temizliği"],
          correct: 1,
        },
        {
          id: 5,
          q: "Arıların yaptığı dansın hızı ve yönü neyi anlatır?",
          options: [
            "Kovanın ne renk boyanacağını",
            "Çiçeklerin kovana ne kadar uzakta olduğunu",
            "Havada kaç tane kuş olduğunu",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Diğer işçi arılar bu dansı izledikten sonra ne yaparlar?",
          options: [
            "Kovanda uyumaya devam ederler",
            "Yönlerini kolayca bulup çiçeğe uçarlar",
            "Başka bahçelere doğru kaçarlar",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Arıların anlaşmak için neye ihtiyaçları yoktur?",
          options: ["Bir haritaya", "Çiçeklere", "Kanatlarına"],
          correct: 0,
        },
        {
          id: 8,
          q: "Metne göre arıların en belirgin özelliği nedir?",
          options: [
            "Çok hızlı koşmaları",
            "Çalışkan ve akıllı olmaları",
            "Geceleri çok iyi görmeleri",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🧙 Kelime Sihirbazlığı!",
        rules: [
          {
            name: "-ci / -cı",
            desc: "O işi yapan kişiyi veya mesleği türetir.",
            example: "kitap ↔️ kitapçı",
          },
          {
            name: "-lik / -luk",
            desc: "O şeyin konulduğu yeri veya aleti türetir.",
            example: "kitap ↔️ kitaplık",
          },
          {
            name: "-li / -lı",
            desc: "O şeye sahip olan varlığı türetir.",
            example: "şeker ↔️ şekerli",
          },
          {
            name: "-siz / -suz",
            desc: "O şeyin içinde olmadığını anlatır.",
            example: "şeker ↔️ şekersiz",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Yeni Kelime Yapıcı",
        desc: "Sorularda kök halindeki kelimelere ek getirilerek türetilen yeni kelimeyi bulunuz.",
        questions: [
          {
            id: 1,
            q: '"Kitap" kelimesine "-lik" eki gelirse yeni kelime ne olur?',
            options: ["Kitapçı", "Kitaplık", "Kitapsız"],
            correct: 1,
          },
          {
            id: 2,
            q: '"Balık" kelimesine "-çı" eki gelirse o işi yapan kişinin adı ne olur?',
            options: ["Balıkçı", "Balıklık", "Balıklı"],
            correct: 0,
          },
          {
            id: 3,
            q: '"Şeker" kelimesinin içinde şeker olmadığını anlatmak için hangi ek gelmelidir?',
            options: ["-li", "-ci", "-siz"],
            correct: 2,
          },
          {
            id: 4,
            q: '"Tuz" konulan cam kabın adı aşağıdakilerden hangisidir?',
            options: ["Tuzcu", "Tuzluk", "Tuzsuz"],
            correct: 1,
          },
          {
            id: 5,
            q: '"Göz" organına takılan somut aletin adı aşağıdakilerden hangisidir?',
            options: ["Gözlük", "Gözcü", "Gözlü"],
            correct: 0,
          },
          {
            id: 6,
            q: "Çiçek satan veya çiçek yetiştiren kişiye ne ad verilir?",
            options: ["Çiçeklik", "Çiçekçi", "Çiçeksiz"],
            correct: 1,
          },
          {
            id: 7,
            q: "İçinde bolca tuz olan bir çorbaya ne ad verilir?",
            options: ["Tuzsuz", "Tuzlu", "Tuzluk"],
            correct: 1,
          },
          {
            id: 8,
            q: '"Kovanda işçi arılar bal yapar." cümlesindeki işçi kelimesinin kökü nedir?',
            options: ["İş", "İşçilik", "İşsiz"],
            correct: 0,
          },
          {
            id: 9,
            q: '"Su" koyduğumuz cam veya plastik büyük kaba ne ad verilir?',
            options: ["Sucu", "Suluk", "Susuz"],
            correct: 1,
          },
          {
            id: 10,
            q: "Ayakkabı tamiri yapan veya satan meslek sahibine ne denir?",
            options: ["Ayakkabılık", "Ayakkabıcı", "Ayakkabısız"],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Sihirli Ek Eşleştirme",
        desc: "Verilen kelimelerin ek alarak kazandığı yeni anlamları eşleştiriniz.",
        questions: [
          {
            words: ["Kalemlik", "Kalem konulan kutu", "Kalem satan kişi"],
            correct: "Kalem konulan kutu",
          },
          {
            words: ["Kalemci", "Kalem konulan kutu", "Kalem satan kişi"],
            correct: "Kalem satan kişi",
          },
          {
            words: [
              "Şekerli",
              "İçinde şeker olan yiyecek",
              "İçinde şeker olmayan yiyecek",
            ],
            correct: "İçinde şeker olan yiyecek",
          },
          {
            words: [
              "Şekersiz",
              "İçinde şeker olan yiyecek",
              "İçinde şeker olmayan yiyecek",
            ],
            correct: "İçinde şeker olmayan yiyecek",
          },
          {
            words: ["Tuzluk", "Tuz koymaya yarayan kap", "Tuz satan kişi"],
            correct: "Tuz koymaya yarayan kap",
          },
          {
            words: [
              "Sucu",
              "Evlere su taşıyan/satan kişi",
              "Okulda su içtiğimiz somut kap",
            ],
            correct: "Evlere su taşıyan/satan kişi",
          },
          {
            words: [
              "Suluk",
              "Evlere su taşıyan/satan kişi",
              "Okulda su içtiğimiz somut kap",
            ],
            correct: "Okulda su içtiğimiz somut kap",
          },
          {
            words: ["Susuz", "Suyu kalmamış, kurumuş toprak", "Su dolu bardak"],
            correct: "Suyu kalmamış, kurumuş toprak",
          },
          {
            words: [
              "Kitaplık",
              "Kitapları dizdiğimiz ahşap raf",
              "Dükkanında kitap satan kişi",
            ],
            correct: "Kitapları dizdiğimiz ahşap raf",
          },
          {
            words: [
              "Kitapçı",
              "Kitapları dizdiğimiz ahşap raf",
              "Dükkanında kitap satan kişi",
            ],
            correct: "Dükkanında kitap satan kişi",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Kitap Tutkusu ve Planlı Çalışma",
          rules: [
            {
              name: "Geniş Kütüphane ve Kitap Resimleri",
              desc: "Atatürk'ün kişilik özelliklerini gösteren şablonda, yan yana dizilmiş binlerce kalın kitap resmi yer alır. O, hayatı boyunca savaş cephelerinde bile çadırında kitap okumayı bırakmamış büyük bir kitap tutkunudur. Okuduğu kitapların kenarlarına somut olarak kendi el yazısıyla önemli notlar ve çizgiler eklemiştir.",
              example: "",
            },
            {
              name: "Planlılık ve İleri Görüşlülük Logoları",
              desc: "Karakter haritasında bir pusula ve zaman saati simgesi yer alır; bunlar onun planlılık ve ileri görüşlülük özelliklerini simgeler. Atatürk, yapacağı her işi önceden gün gün planlar ve rastgele hareket etmezdi. Olayların sonuçlarını önceden tahmin edebilme gücü, yani ileri görüşlülüğü sayesinde aldığı kararlarda hiçbir zaman yanılmamıştır.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Karakter Analizi Testi",
          desc: "Atatürk'ün kişilik özellikleri ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Atatürk'ün savaş cephelerinde bile kitap okumayı sürdürmesi ve binlerce kitap bitirmesi onun hangi kişilik özelliğini somut olarak gösterir?",
              options: [
                "Sadece zaman geçirmek istediğini",
                "Büyük bir kitap tutkusuna, bilgiye ve öğrenme sevgisine sahip olduğunu",
                "Resim yapmayı daha çok sevdiğini",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "Atatürk'ün yapacağı askeri ve siyasi işleri önceden takvime bağlaması ve düzenli çalışması hangi karakter simgesiyle gösterilir?",
              options: ["Kararsızlık", "Planlılık ve disiplin", "Acelecilik"],
              correct: 1,
            },
            {
              id: 3,
              q: '"Gelecekte yaşanacak coğrafi ve siyasi olayları önceden doğru tahmin edebilme yeteneği" Atatürk\'ün hangi özelliğidir?',
              options: ["İleri görüşlülük", "Sabırsızlık", "Çabuk pes etme"],
              correct: 0,
            },
            {
              id: 4,
              q: "Atatürk okuduğu kitapların somut olarak neresine kendi el yazısıyla notlar ve eleştiri çizgileri eklemiştir?",
              options: [
                "Kitapların kapak arkalarına",
                "Sayfa kenarlarındaki boşluklara",
                "Kitapların en arkasındaki boş sayfalara",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Karakter haritasındaki pusula simgesi onun hangi yönetsel gücünü temsil eder?",
              options: [
                "Yolunu kaybetmesini",
                "Zor anlarda bile hedefinden şaşmadan doğru yönü bulma ve kararlılık özelliğini",
                "Sadece harita çizmeyi bilmesini",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Atatürk'ün zekasını planlı kullanması askeri başarılarına nasıl yansımıştır?",
              options: [
                "Savaşların plansızlık yüzünden kaybedilmesine yol açmıştır.",
                "Her adımın önceden hesaplanması sayesinde büyük zaferler kazanılmasını sağlamıştır.",
                "Askerlerin hiç dinlenememesine neden olmuştur.",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Aşağıdakilerden hangisi Atatürk'ün kitap okuma alışkanlığı ile ilgili somut bir bilgidir?",
              options: [
                "Sadece yerli romanları okumuştur.",
                "Tarih, felsefe, bilim ve edebiyat gibi pek çok farklı alanda binlerce kitap incelemiştir.",
                "Kitapları sadece kütüphanede saklamıştır.",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: '"Yolunda yürüyen bir yolcunun yalnız ufku görmesi kafi değildir, ufkun ötesini de görmesi lazımdır." sözü onun hangi özelliğini betimler?',
              options: [
                "İleri görüşlülüğünü",
                "Sadece uzağa bakabildiğini",
                "Gözlerinin çok sağlam olduğunu",
              ],
              correct: 0,
            },
            {
              id: 9,
              q: "Planlı çalışma disiplini bir öğrenci için aşağıdakilerden hangisini somut olarak kolaylaştırır?",
              options: [
                "Derslerinde daha başarısız olmasını",
                "Zamanı iyi yöneterek hedeflerine planlı şekilde ulaşmasını",
                "Kitap okumaktan sıkılmasını",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Atatürk'ün eşsiz zekası sorunlar karşısında nasıl çalışırdı?",
              options: [
                "Panik yapar ve vazgeçerdi.",
                "Mantıklı, gerçekçi ve akılcı çözümler üretirdi.",
                "Sorunları görmezden gelirdi.",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Kişilik Özellikleri Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "Atatürk, hayatı boyunca cephede bile yanından ayırmadığı binlerce kitabı okuyan büyük bir .................... tutkunudur.",
              words: ["kitap", "oyun"],
              correct: "kitap",
            },
            {
              q: "Yapacağı işleri önceden gün gün belirlemesi onun .................... bir lider olduğunu gösterir.",
              words: ["planlı", "aceleci"],
              correct: "planlı",
            },
            {
              q: "Olayların sonuçlarını önceden tam isabetle tahmin etmesi coğrafyada .................... özelliği olarak adlandırılır.",
              words: ["ileri görüşlülük", "geçmişe bağlılık"],
              correct: "ileri görüşlülük",
            },
            {
              q: "Kitap haritasını incelediğimizde Atatürk'ün okuduğu sayfaların .................... notlar aldığını görürüz.",
              words: ["kenarlarına", "arkasına"],
              correct: "kenarlarına",
            },
            {
              q: "Karakter haritasındaki zaman saati onun planlı ve .................... çalışmasını simgeler.",
              words: ["disiplinli", "düzensiz"],
              correct: "disiplinli",
            },
            {
              q: "Zor askeri durumlarda bile pusula gibi tam hedefi göstermesi onun büyük .................... kanıtıdır.",
              words: ["kararlılığının", "korkusunun"],
              correct: "kararlılığının",
            },
            {
              q: "Atatürk'ün fikir yapısının bu kadar zengin olması okuduğu bilim ve .................... kitapları sayesindedir.",
              words: ["tarih", "masal"],
              correct: "tarih",
            },
            {
              q: '"Ufkun ötesini görmek" ifadesi doğrudan liderin .................... gücünü betimler.',
              words: ["tahmin", "görme"],
              correct: "tahmin",
            },
            {
              q: "Onun akılcı adımları sayesinde Türk ordusu zafer yol çizgilerini .................... çizmiştir.",
              words: ["başarıyla", "tesadüfen"],
              correct: "başarıyla",
            },
            {
              q: "Atatürk, kararlarını alırken her zaman bilime ve akla dayalı .................... yöntemler kullanmıştır.",
              words: ["gerçekçi", "hayali"],
              correct: "gerçekçi",
            },
          ],
        },
      },
    },
  },
  "14": {
    story: {
      title: "KIRMIZI ÇİZGİLİ CÜZDAN",
      theme: "Dürüstlük",
      text: "Pelin, öğle zili çalınca arkadaşlarıyla oynamak için okul bahçesine koştu. Koşarken büyük bahçe kapısının yanındaki yeşil çimlerin üzerinde bir nesne gördü. Yaklaştığında, bunun kumaştan yapılmış kırmızı çizgili küçük bir cüzdan olduğunu fark etti. Cüzdanın fermuarını hafifçe açtığında içi metal bozuk paralarla doluydu. Pelin etrafına bakındı ama cüzdanı düşüren kişiyi buralarda göremedi. Parayı harcamayı veya cüzdanı cebine saklamayı aklından bile geçirmedi. Cüzdanı iki eliyle sıkıca tutarak doğrudan öğretmenler odasına doğru yürüdü. Durumu nöbetçi öğretmeni Ahmet Bey’e anlattı ve cüzdanı ona güvenle teslim etti. Ahmet Bey, Pelin'in bu dürüst davranışı karşısında onun saçlarını okşayıp teşekkür etti. Sahibinin bulunmasıyla Pelin, kalbinde tarif edilemez büyük bir huzur ve mutluluk hissetti.",
      questions: [
        {
          id: 1,
          q: "Pelin ne zaman okul bahçesine koştu?",
          options: [
            "Sabah ilk ders başlamadan önce",
            "Öğle zili çalınca",
            "Okul çıkışında servis beklerken",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Pelin cüzdanı bahçenin neresinde buldu?",
          options: [
            "Spor salonunun merdiveninde",
            "Büyük bahçe kapısının yanındaki yeşil çimlerin üzerinde",
            "Kantindeki masanın altında",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "Bulunan cüzdanın dış görünüşü nasıldı?",
          options: [
            "Deriden yapılmış siyah düz bir cüzdan",
            "Kumaştan yapılmış kırmızı çizgili küçük bir cüzdan",
            "Plastik sarı renkli büyük bir cüzdan",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Cüzdanın içinde ne vardı?",
          options: [
            "Renkli okul pulları",
            "Metal bozuk paralar",
            "Küçük bir not kağıdı",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Pelin cüzdanı bulduktan sonra nereye gitti?",
          options: [
            "Doğrudan öğretmenler odasına",
            "Sınıftaki kendi sırasına",
            "Okulun dışındaki markete",
          ],
          correct: 0,
        },
        {
          id: 6,
          q: "Pelin cüzdanı hangi öğretmene teslim etti?",
          options: [
            "Matematik öğretmeni Meltem Hanım'a",
            "Nöbetçi öğretmen Ahmet Bey'a",
            "Okul müdürü müdür yardımcısına",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Ahmet Bey dürüst davranışı karşısında Pelin'e ne yaptı?",
          options: [
            "Ona kırmızı bir kalem hediye etti",
            "Saçlarını okşayıp teşekkür etti",
            "Bahçede nöbet tutmasını istedi",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Cüzdanın sahibi bulununca Pelin ne hissetti?",
          options: [
            "Cüzdanı verdiği için pişman oldu",
            "Kalbinde büyük bir huzur ve mutluluk hissetti",
            "Korktu ve sınıfa kaçtı",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🎨 İsimlerin Önündeki Renkler ve Şekiller!",
        rules: [
          {
            name: "Ön Ad (Sıfat)",
            desc: "Cins isimlerin hemen önüne gelerek onların rengini veya şeklini (biçimini) belirten somut kelimelere Ön Ad (Sıfat) denir.",
            example: "",
          },
          {
            name: "Renk Bildirenler",
            desc: "İsmin rengini belirtir.",
            example: "kırmızı cüzdan, yeşil çim, mavi kutu.",
          },
          {
            name: "Şekil Bildirenler",
            desc: "İsmin şeklini veya biçimini belirtir.",
            example: "yuvarlak masa, kare kutu, uzun lamba.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Özellik Avcısı",
        desc: "Cümlelerdeki boşluklara gelmesi gereken uygun ön adı (sıfatı) seçeneklerden bularak yerleştiriniz.",
        questions: [
          {
            id: 1,
            q: "Pelin bahçede içi para dolu .... çizgili bir cüzdan buldu.",
            options: ["kırmızı", "yuvarlak"],
            correct: 0,
          },
          {
            id: 2,
            q: "Ahmet Bey odasındaki .... masanın önünde oturuyordu.",
            options: ["yeşil", "kare"],
            correct: 1,
          },
          {
            id: 3,
            q: "Bahçedeki .... çimlerin üzerine küçük bir cüzdan düşmüştü.",
            options: ["uzun", "yeşil"],
            correct: 1,
          },
          {
            id: 4,
            q: "Duvara asmak için .... çerçeveli yeni bir resim aldık.",
            options: ["yuvarlak", "sarı"],
            correct: 0,
          },
          {
            id: 5,
            q: "Kutunun içinden .... renkli üç tane metal para çıktı.",
            options: ["uzun", "parlak"],
            correct: 1,
          },
          {
            id: 6,
            q: "Sınıfın ortasında .... bir masa etrafında toplandık.",
            options: ["kırmızı", "geniş"],
            correct: 1,
          },
          {
            id: 7,
            q: "Çantamdan .... renkli boya kalemlerimi sırayla çıkardım.",
            options: ["kare", "mavi"],
            correct: 1,
          },
          {
            id: 8,
            q: "Bahçe kapısının yanında .... bir direk duruyordu.",
            options: ["uzun", "yeşil"],
            correct: 0,
          },
          {
            id: 9,
            q: "Kitaplıktan okumak için .... kapaklı kalın bir kitap seçtim.",
            options: ["yuvarlak", "sarı"],
            correct: 1,
          },
          {
            id: 10,
            q: "Resim dersinde kağıda büyük bir .... dünya çizdim.",
            options: ["mavi", "üçgen"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Ön Ad Dedektifi",
        desc: "Verilen ön adların (sıfatların) ismin hangi özelliğini (renk mi şekil mi) belirttiğini eşleştiriniz.",
        questions: [
          {
            words: ["Kırmızı cüzdan", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Renk Bildiren",
          },
          {
            words: ["Yuvarlak masa", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Şekil Bildiren",
          },
          {
            words: ["Yeşil çim", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Renk Bildiren",
          },
          {
            words: ["Kare kutu", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Şekil Bildiren",
          },
          {
            words: ["Mavi balon", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Renk Bildiren",
          },
          {
            words: ["Uzun direk", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Şekil Bildiren",
          },
          {
            words: ["Sarı elma", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Renk Bildiren",
          },
          {
            words: ["Üçgen levha", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Şekil Bildiren",
          },
          {
            words: ["Siyah kedi", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Renk Bildiren",
          },
          {
            words: ["Geniş kaldırım", "Renk Bildiren", "Şekil Bildiren"],
            correct: "Şekil Bildiren",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Vatanseverlik ve Sanat Sevgisi",
          rules: [
            {
              name: "Kırmızı Türk Bayrağı ve Vatan Haritası",
              desc: "Karakter şablonunun ikinci kısmında, üzerinde kocaman kırmızı bir Türk bayrağı resmi olan vatan haritası yer alır. Bu görsel onun en büyük özelliği olan vatanseverliğini ve milletine olan derin sevgisini somutlaştırır. Vatanı kurtarmak için canını ortaya koyarak cepheden cepheye koşmuştur.",
              example: "",
            },
            {
              name: "Sanatçı ve Çocuk Simgeleri",
              desc: 'Haritada bir tiyatro maskesi, nota çizgileri ve el ele tutuşmuş neşeli çocuk çizimleri yer alır. Atatürk, "Sanatsız kalan bir milletin hayat damarlarından biri kopmuş demektir." diyerek sanata ve sanatçıya çok büyük bir değer vermiştir. Ayrıca dünyada çocuklara bir bayram (23 Nisan) hediye eden tek lider olarak, çocuk sevgisini tüm dünyaya somut bir miras olarak bırakmıştır.',
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Vatan ve Sanat Sevgisi Testi",
          desc: "Atatürk'ün vatan ve sanat sevgisi ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Atatürk'ün vatan topraklarını korumak için ömrü boyunca cephelerde savaşması onun hangi temel kişilik özelliğidir?",
              options: ["Sanat sevgisi", "Vatanseverlik", "Planlılık"],
              correct: 1,
            },
            {
              id: 2,
              q: '"Sanatsız kalan bir milletin hayat damarlarından biri kopmuş demektir." sözü onun hangi alanlara verdiği önemi somut olarak gösterir?',
              options: [
                "Sadece sanayi fabrikalarına",
                "Kültür, sanat, tiyatro ve müzik alanlarına",
                "Sadece askeri binalara",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Atatürk'ü dünyadaki diğer bütün liderlerden ayıran, çocuk sevgisini gösteren en büyük somut adım hangisidir?",
              options: [
                "Büyük fabrikalar kurması",
                "Dünyada çocuklara özel bir bayram (23 Nisan) hediye eden tek lider olması",
                "Yeni okullar yaptırması",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: "Karakter albümünde yer alan el ele tutuşmuş neşeli çocuk çizimleri hangi ulusal değerimizi simgeler?",
              options: [
                "29 Ekim Cumhuriyet Bayramı'nı",
                "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı'nı",
                "30 Ağustos Zafer Bayramı'nı",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Haritadaki tiyatro maskesi ve nota çizgileri logoları Atatürk'ün devlet yapısında neyi geliştirmek istediğini gösterir?",
              options: [
                "Sadece matematik derslerini",
                "Ülkenin sanat ve kültür seviyesini, sanatçıların değerini",
                "Askeri araç sayısını",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Atatürk'ün milletine olan sevgisi vatan haritasında hangi renkli sembolle betimlenmiştir?",
              options: [
                "Sarı çöl simgesiyle",
                "Kırmızı Türk bayrağı ve vatan sınırlarıyla",
                "Mavi buzul resmiyle",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Bir liderin sanatçılara saygı duyması toplumda neyin somut olarak ilerlemesini sağlar?",
              options: [
                "Sadece bina yapımının",
                "Toplumun estetik, düşünce ve yaratıcılık dünyasının gelişmesini",
                "Ticaret yollarının kapanmasını",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "23 Nisan Bayramı'nin çocuklara armağan edilmesi dünya çocukları arasında nasıl bir bağ kurar?",
              options: [
                "Birbirlerinden uzaklaşmalarına neden olur.",
                "Barış, kardeşlik ve ortak bir neşe bağı kurar.",
                "Sadece tatil yapmalarını sağlar.",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Aşağıdaki sözlerden hangisi Atatürk'ün vatanseverlik özelliğini doğrudan anlatır?",
              options: [
                '"Yurt toprağı! Sana her şey feda olsun. Kutlu olan sensin."',
                '"Matematik çok kilit bir bilimdir."',
                '"Bu kitapları kütüphaneye diziniz."',
              ],
              correct: 0,
            },
            {
              id: 10,
              q: "Atatürk'ün çocuklarla yan yana gülerken çekilmiş somut fotoğrafları onun karakterinin hangi yönünü aydınlatır?",
              options: [
                "Çok sert ve ulaşılamaz olduğunu",
                "Sevgi dolu, insancıl ve geleceğe umutla bakan bir lider olduğunu",
                "Sadece resim çekilmeyi sevdiğini",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Değerler Doğrulaması",
          desc: "Atatürk'ün değerleri ile ilgili ifadelerin doğru mu yanlış mı olduğunu belirtiniz.",
          questions: [
            {
              q: "Atatürk, vatanını ve milletini her şeyden çok seven büyük bir vatanseverdir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Dünyada çocuklara bayram hediye eden ilk ve tek lider Mustafa Kemal Atatürk'tür.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: '"Hayat damarları" sözüyle Atatürk, askeri fabrikaların önemini anlatmak istemiştir.',
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Karakter haritasında çocuk sevgisi 23 Nisan Çocuk Bayramı simgesiyle somutlaştırılmıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Atatürk sanatçıları sıradan insanlar olarak görmüş ve onlara hiç değer vermemiştir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Kırmızı Türk bayrağı, liderin vatanına olan derin bağını gösteren en büyük görseldir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Atatürk sadece askeri zaferlerle ilgilenmiş, ülkenin resmi tiyatrosu ve müziğiyle hiç ilgilenmemiştir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "23 Nisan Bayramı çizimlerinde dünya çocuklarının el ele tutuştuğu barış çizgileri yer alır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Liderin vatanseverliği sadece sözde kalmış, cephelerde hiç savaşmamıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Çocuklar, Atatürk'ün gözünde ülkenin geleceğini kuracak olan en değerli varlıklardır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
          ],
        },
      },
    },
  },
  "15": {
    story: {
      title: "AĞIR POŞETLER",
      theme: "Yaşlılara Saygı",
      text: "Selim, okul çantası sırtında yorgun bir şekilde apartmanın giriş kapısını açtı. Merdivenlerin ilk basamağında, üst katta oturan tonton komşuları Nebahat Teyze vardı. Nebahat Teyze’nin iki elinde de sebze dolu büyük pazar poşetleri duruyordu. Yaşlı kadın ağır poşetler yüzünden basamakları çok yavaş ve zorlanarak çıkıyordu. Selim bu durumu görür görmez hemen yukarı doğru koştu. Nebahat Teyze’nin yanına varınca yüzüne bakarak nazikçe gülümsedi. 'Nebahat Teyze, poşetlerin çok ağır görünüyor, sana yardım edebilir miyim?' diye sordu. Yaşlı kadın sevinçle poşetlerin en büyük olan iki tanesini Selim’e uzattı. Birlikte yavaş adımlarla merdivenleri tırmanıp Nebahat Teyze’nin kapısının önüne kadar geldiler. Nebahat Teyze kapıyı açarken Selim’e tatlı bir teşekkür gülümsemesiyle beraber mutfaktan lezzetli bir kurabiye ikram etti.",
      questions: [
        {
          id: 1,
          q: "Selim apartmana girdiğinde sırtında ne vardı?",
          options: [
            "Büyük bir spor torbası",
            "Okul çantası",
            "Renkli bir gitar kutusu",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Merdivenin basamağında hangi komşu vardı?",
          options: ["Nebahat Teyze", "Ayşe Teyze", "Fatma Teyze"],
          correct: 0,
        },
        {
          id: 3,
          q: "Nebahat Teyze'nin elindeki poşetlerin içinde ne vardı?",
          options: [
            "Yeni alınmış kıyafetler",
            "Sebze dolu pazar malzemeleri",
            "Renkli temizlik kutuları",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Yaşlı kadın merdivenleri neden yavaş çıkıyordu?",
          options: [
            "Hava çok karanlık olduğu için",
            "Ağır poşetler yüzünden zorlandığı için",
            "Anahtarını kaybettiği için",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Selim Nebahat Teyze'nin yanına gidince ne yaptı?",
          options: [
            "Nazikçe gülümseyip yardım etmek istediğini söyledi",
            "Poşetleri almadan kendi evine kaçtı",
            "Çantasını merdivene bırakıp oyun oynamaya gitti",
          ],
          correct: 0,
        },
        {
          id: 6,
          q: "Nebahat Teyze Selim'e hangi poşetleri uzattı?",
          options: [
            "İçinde sadece ekmek olan küçük poşeti",
            "En büyük olan iki tanesini",
            "Boş olan bez torbayı",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Merdivenleri çıkınca nereye kadar geldiler?",
          options: [
            "Apartmanın çatı katına",
            "Nebahat Teyze'nin kapısının önüne",
            "Selimlerin evinin balkonuna",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Nebahat Teyze yardımından dolayı Selim'e ne verdi?",
          options: [
            "Küçük bir harçlık",
            "Lezzetli bir kurabiye",
            "Renkli bir oyuncak araba",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🎬 Hareket Başlasın!",
        rules: [
          {
            name: "Eylem (Fiil)",
            desc: "Cümlelerin sonunda yer alarak bize yapılan bir işi, bir hareketi veya bir durumu anlatan kelimelere Eylem (Fiil) denir.",
            example: "",
          },
          {
            name: "İpucu",
            desc: 'Bir kelimenin eylem olduğunu anlamak için sonuna "-mek / -mak" ekini getirebiliriz. Anlamlı oluyorsa o kelime bir eylemdir!',
            example: "koş(mak), yürü(mek), aç(mak).",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Eylem Avcısı",
        desc: "Seçeneklerde verilen kelimelerden iş ve hareket bildiren elemi bulunuz.",
        questions: [
          {
            id: 1,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Çanta", "Koştu", "Ağaç"],
            correct: 1,
          },
          {
            id: 2,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Taşıdı", "Poşet", "Merdiven"],
            correct: 0,
          },
          {
            id: 3,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Teyze", "Kapı", "Açtı"],
            correct: 2,
          },
          {
            id: 4,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Okul", "Yıkadı", "Sabun"],
            correct: 1,
          },
          {
            id: 5,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Baktı", "Pencere", "Kedi"],
            correct: 0,
          },
          {
            id: 6,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Sarı", "Çiçek", "Suladı"],
            correct: 2,
          },
          {
            id: 7,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Kutuyu", "Topladı", "Oyuncak"],
            correct: 1,
          },
          {
            id: 8,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Yazdı", "Defter", "Kalem"],
            correct: 0,
          },
          {
            id: 9,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Sıra", "Buldu", "Silgi"],
            correct: 1,
          },
          {
            id: 10,
            q: "Aşağıdaki kelimelerden hangisi bir eylemdir (fiildir)?",
            options: ["Attı", "Çöp", "Bahçe"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Cümle Sonu Tamamlayıcı",
        desc: "Cümlelerin sonundaki boşlukları hareket kuralına uygun eylemlerle tamamlayınız.",
        questions: [
          { words: ["girdi", "kapı"], correct: "girdi" },
          { words: ["basamak", "taşıdı"], correct: "taşıdı" },
          { words: ["tırmandı", "yukarı"], correct: "tırmandı" },
          { words: ["gülümsedi", "tonton"], correct: "gülümsedi" },
          { words: ["fırın", "pişirdi"], correct: "pişirdi" },
          { words: ["kondu", "yuva"], correct: "kondu" },
          { words: ["yıkadı", "temiz"], correct: "yıkadı" },
          { words: ["döktü", "kova"], correct: "döktü" },
          { words: ["doldurdu", "halı"], correct: "doldurdu" },
          { words: ["yeşil", "attı"], correct: "attı" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Hayat Kronolojisi ve Anıtkabir",
          rules: [
            {
              name: "1881'den Başlayan Zaman Çizgisi",
              desc: "Atatürk'ün hayat kronolojisi incelendiğinde, harita üzerinde 1881 yılından başlayıp Ankara'ya kadar uzanan somut bir zaman çizgisi görülür. Çizginin başında Selanik'teki pembe ev resmi, ortasında askeri başarılarını gösteren cephe logoları ve 1923 yılında parıldayan Cumhuriyetin İlanı simgesi yer alır.",
              example: "",
            },
            {
              name: "Ankara'daki Anıt Mezar",
              desc: "Kronolojinin son durağında Ankara'nın tam ortasında yükselen, yüksek taş sütunları ve aslanlı yolu olan görkemli bir yapı resmi bulunur; burası onun son istirahatgahı olan Anıtkabir'dir. Haritadaki bu somut mekan, Türk milletinin ona olan sonsuz saygısını ve sevgisini gösteren en büyük kültürel ve mimari yapıdır.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Kronoloji Testi",
          desc: "Atatürk'ün hayat kronolojisi ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Atatürk'ün zaman çizgisinin başlangıç noktasını oluşturan, doğduğu yıl hangisidir?",
              options: ["1881", "1919", "1923"],
              correct: 0,
            },
            {
              id: 2,
              q: "Kronoloji haritasının tam ortasında yer alan ve ülkemizin yönetim şeklini değiştiren büyük tarihi olay hangisidir?",
              options: [
                "Selanik'ten taşınma",
                "1923 yılında Cumhuriyetin İlan edilmesi",
                "Çiftlik hayatının bitmesi",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Atatürk'ün son yolculuğunun ardından naaşının nakledildiği, Ankara'da bulunan görkemli yapının adı nedir?",
              options: ["Dolmabahçe Sarayı", "Anıtkabir", "TBMM Binası"],
              correct: 1,
            },
            {
              id: 4,
              q: "Anıtkabir mimarisinde girişten itibaren uzanan, üzerinde somut taş heykellerin bulunduğu yolun adı nedir?",
              options: ["Aslanlı Yol", "Tören Meydanı", "Bayrak Direği Yolu"],
              correct: 0,
            },
            {
              id: 5,
              q: "Tarih atlasına bakıldığında Anıtkabir yapısı ülkemizin hangi şehrinde inşa edilmiştir?",
              options: ["İstanbul", "Selanik", "Ankara"],
              correct: 2,
            },
            {
              id: 6,
              q: "Atatürk'ün hayat çizgisi üzerinde yer alan askeri cephe logoları (Çanakkale, Kurtuluş Savaşı) bize neyi gösterir?",
              options: [
                "Ömrünü vatan savunmasına ve askeri zaferlere adadığını",
                "Sürekli şehir değiştirmeyi sevdiğini",
                "Okul yıllarının çok rahat geçtiğini",
              ],
              correct: 0,
            },
            {
              id: 7,
              q: "Anıtkabir'in yüksek taş sütunlu mimari yapısı genel olarak neyi somutlaştırır?",
              options: [
                "Sadece sıradan bir taş binayı",
                "Türk milletinin Atatürk'e duyduğu sonsuz saygıyı, sevgiyi ve bağlılığı",
                "Eski askeri kışlaları",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Kronoloji çizgisinde 1919 yılında Samsun'a çıkış simgesi yer alır. Bu simge hangi mücadelenin başlangıcıdır?",
              options: [
                "İlkokul eğitiminin",
                "Milli Mücadele'nin (Kurtuluş Savaşı'nın)",
                "Kitap yazma sürecinin",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Atatürk'ün vefat ettiği gün olan 10 Kasım tarihi Türk milleti için neyi ifade eder?",
              options: [
                "Sadece resmi bir tatil gününü",
                "Büyük lideri anma, onun fikirlerini anlama ve hüzün gününü",
                "Sıradan bir pazar gününü",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Haritadaki zaman çizgisinin baştan sona incelenmesi bir öğrenciye hangi bilinci kazandırır?",
              options: [
                "Başarıların kolayca kazanıldığını",
                "Büyük liderin zorluklarla dolu ama başarılarla biten ömrünün somut kronolojisini",
                "Şehirlerin sadece isimlerini",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Kronoloji Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "Mustafa Kemal Atatürk, 1881 yılında .................... şehrinde dünyaya somut olarak gözlerini açmıştır.",
              words: ["Selanik", "Ankara"],
              correct: "Selanik",
            },
            {
              q: "Hayat kronolojisinin en kilit siyasi başarısı 1923 yılında .................... ilan edilmesidir.",
              words: ["Cumhuriyetin", "Meşrutiyetin"],
              correct: "Cumhuriyetin",
            },
            {
              q: "Ankara'da bulunan ve her yıl milyonlarca kişinin ziyaret ettiği anıt mezarın adı .................... olarak bilinir.",
              words: ["Anıtkabir", "Saray"],
              correct: "Anıtkabir",
            },
            {
              q: "Anıtkabir'e giriş yaparken yürüdüğümüz taş heykelli yola .................... Yol adı verilir.",
              words: ["Aslanlı", "Kuşlu"],
              correct: "Aslanlı",
            },
            {
              q: "Zaman çizgisinde yer alan 1919 yılı, Kurtuluş Savaşı'nın başlangıç .................... çizgisidir.",
              words: ["tarih", "bitiş"],
              correct: "tarih",
            },
            {
              q: "Atatürk'ün son nefesini verdiği resmi tarih çizgisi 10 .................... 1938 günüdür.",
              words: ["Kasım", "Ekim"],
              correct: "Kasım",
            },
            {
              q: "Anıtkabir binası, haritada ülkemizin başkenti olan .................... şehri merkezine çizilmiştir.",
              words: ["Ankara", "İstanbul"],
              correct: "Ankara",
            },
            {
              q: "Onun askeri başarı kronolojisinde en çok parıldayan logo .................... Zaferi simgesidir.",
              words: ["Çanakkale", "Trablusgarp"],
              correct: "Çanakkale",
            },
            {
              q: "Anıtkabir'in yüksek taş sütunları heybetli ve .................... bir mimari yapı oluşturur.",
              words: ["görkemli", "küçük"],
              correct: "görkemli",
            },
            {
              q: "Liderin hayat çizgisi, Türk milletinin özgürlük yolunun somut bir .................... haritasıdır.",
              words: ["başarı", "yenilgi"],
              correct: "başarı",
            },
          ],
        },
      },
    },
  },
  "16": {
    story: {
      title: "YAPRAKLARIN RENK DEĞİŞİMİ",
      theme: "Bilgilendirici / Doğa",
      text: "Sonbahar mevsimi geldiğinde doğada harika ve çok belirgin değişimler başlar. Yaz boyunca yemyeşil kıyafetler giyen ağaçlar, yavaş yavaş renk değiştirmeye başlar. Parklardaki yapraklar önce parlak sarıya, sonra turuncuya ve en son kahverengiye döner. Peki ağaçlardaki bu renkli elbiselerin değişme sebebi aslında nedir? Havalar soğuyup günler kısaldığında ağaçlar besin üretmeyi yavaş yavaş azaltır. Yapraklara yeşil rengini veren özel maddeler soğuk hava yüzünden kaybolur. Böylece yaprağın altındaki saklı sarı ve turuncu renkler somut olarak ortaya çıkar. Ağaçlar kışın sert soğuğundan korunmak için yapraklarını tamamen yere dökerler. Bu dökülen yapraklar toprak için harika bir koruyucu battaniye haline gelir. Ağaçlar ilkbaharda yeniden yeşermek üzere derin bir kış uykusuna yatarlar.",
      questions: [
        {
          id: 1,
          q: "Ağaçlardaki belirgin renk değişimleri hangi mevsimde başlar?",
          options: ["İlkbahar", "Yaz", "Sonbahar"],
          correct: 2,
        },
        {
          id: 2,
          q: "Yapraklar sırasıyla hangi renklere dönüşür?",
          options: [
            "Önce parlak sarıya, sonra turuncuya ve en son kahverengiye",
            "Önce kırmızıya, sonra maviye ve en son siyaha",
            "Önce beyaza, sonra griye ve en son mor renge",
          ],
          correct: 0,
        },
        {
          id: 3,
          q: "Ağaçlar besin üretmeyi ne zaman azaltırlar?",
          options: [
            "Havalar soğuyup günler kısaldığında",
            "Yazın en sıcak günleri geldiğinde",
            "Yağmur çok fazla yağdığında",
          ],
          correct: 0,
        },
        {
          id: 4,
          q: "Yaprakların normalde yeşil görünmesini sağlayan şey ne yüzünden kaybolur?",
          options: [
            "Sert rüzgarlar yüzünden",
            "Soğuk hava yüzünden",
            "Çok fazla su verilmesi yüzünden",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Yeşil maddeler kaybolunca yaprağın altından hangi renkler çıkar?",
          options: ["Siyah ve beyaz", "Sarı ve turuncu", "Mavi ve mor"],
          correct: 1,
        },
        {
          id: 6,
          q: "Ağaçlar kışın sert soğuğundan korunmak için ne yaparlar?",
          options: [
            "Yapraklarını tamamen yere dökerler",
            "Gövdelerini toprakla kapatırlar",
            "Dalları arasına kuşları çağırırlar",
          ],
          correct: 0,
        },
        {
          id: 7,
          q: "Yere dökülen yapraklar toprak için neye dönüşür?",
          options: [
            "Büyük bir çöp yığınına",
            "Harika bir koruyucu battaniyeye",
            "Sert taştan bir yola",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Ağaçlar ilkbaharda tekrar yeşermek için ne yaparlar?",
          options: [
            "Başka bahçelere doğru uzarlar",
            "Derin bir kış uykusuna yatarlar",
            "Köklerini sudan çıkarırlar",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "⏳ Zaman Tüneli!",
        rules: [
          {
            name: "Geçmiş Zaman",
            desc: 'İşin önceden yapılıp bittiğini anlatır. Eylemin sonuna "-di / -dı / -miş" ekleri gelir.',
            example: "Yapraklar yere döküldü.",
          },
          {
            name: "Şimdiki Zaman",
            desc: 'İşin tam şu anda, gözümüzün önünde yapıldığını anlatır. Eylemin sonuna "-yor" eki gelir.',
            example: "Şiddetli yağmur yağıyor.",
          },
          {
            name: "Gelecek Zaman",
            desc: 'İşin henüz yapılmadığını, daha sonra yapılacağını anlatır. Eylemin sonuna "-acak / -ecek" ekleri gelir.',
            example: "Yarın ağaçlar yeniden yeşerecek.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Zaman Bulucu",
        desc: "Cümlelerdeki eylemlerin hangi zamanda yapıldığını seçeneklerden bulunuz.",
        questions: [
          {
            id: 1,
            q: '"Sonbahar mevsimi geldiğinde yapraklar sararıyor." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 1,
          },
          {
            id: 2,
            q: '"Ağaçlar kışın sert soğuğundan korunmak için yapraklarını tamamen döktü." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 0,
          },
          {
            id: 3,
            q: '"İlkbahar mevsimi geldiğinde bütün çiçekler yeniden açacak." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 2,
          },
          {
            id: 4,
            q: '"Mert odasındaki oyuncakları hızlıca kutuya doldurdu." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 0,
          },
          {
            id: 5,
            q: '"Dışarıda sabahtan beri çok şiddetli bir yağmur yağıyor." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 1,
          },
          {
            id: 6,
            q: '"Biz gelecek hafta sonu ailece pikniğe gideceğiz." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 2,
          },
          {
            id: 7,
            q: '"Kerem ellerini beyaz sabunla köpürterek yıkadı." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Kuşlar gökyüzünde neşeyle uçuyorlar." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 1,
          },
          {
            id: 9,
            q: '"Ödevlerimi bitirdikten sonra hemen uyuyacağım." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 2,
          },
          {
            id: 10,
            q: '"Yerdeki boş meyve suyu kutusunu çöp kutusuna attı." cümlesi hangi zamandadır?',
            options: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Zaman Eşleştirme",
        desc: "Verilen cümleleri taşıdıkları zaman kavramıyla doğru şekilde eşleştiriniz.",
        questions: [
          {
            words: [
              "Yaz tatilinde köye gideceğim.",
              "Gelecek Zaman",
              "Şimdiki Zaman",
            ],
            correct: "Gelecek Zaman",
          },
          {
            words: ["Şu an kitap okuyorum.", "Gelecek Zaman", "Şimdiki Zaman"],
            correct: "Şimdiki Zaman",
          },
          {
            words: ["Dün akşam erken uyudum.", "Geçmiş Zaman", "Şimdiki Zaman"],
            correct: "Geçmiş Zaman",
          },
          {
            words: ["Kedi sütünü içiyor.", "Geçmiş Zaman", "Şimdiki Zaman"],
            correct: "Şimdiki Zaman",
          },
          {
            words: ["Yarın kar yağacak.", "Gelecek Zaman", "Şimdiki Zaman"],
            correct: "Gelecek Zaman",
          },
          {
            words: ["Eren çiçeğe su döktü.", "Geçmiş Zaman", "Şimdiki Zaman"],
            correct: "Geçmiş Zaman",
          },
          {
            words: ["Kuşlar yuvada ötüyor.", "Geçmiş Zaman", "Şimdiki Zaman"],
            correct: "Şimdiki Zaman",
          },
          {
            words: [
              "Yeni bir kalem alacağım.",
              "Gelecek Zaman",
              "Şimdiki Zaman",
            ],
            correct: "Gelecek Zaman",
          },
          {
            words: ["Odamı güzelce topladım.", "Geçmiş Zaman", "Şimdiki Zaman"],
            correct: "Geçmiş Zaman",
          },
          {
            words: ["Bahçede top oynuyorlar.", "Geçmiş Zaman", "Şimdiki Zaman"],
            correct: "Şimdiki Zaman",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Meclisin Açılışı ve Çocuklara Armağan",
          rules: [
            {
              name: "Kırmızı Bayraklı Meclis Binası",
              desc: "Milli bayramlar haritasında 23 Nisan günü incelendiğinde, Ankara'da bulunan ve üzerinde kırmızı Türk bayrağı dalgalanan ilk Türkiye Büyük Millet Meclisi (TBMM) binası resmi görülür. 23 Nisan 1920 günü bu binanın kapıları açılmış ve halkın kendi kendini yönetme gücü somut olarak başlamıştır.",
              example: "",
            },
            {
              name: "Dünya Çocuklarının El Ele Çizimi",
              desc: "Bayram şablonunda, bu tarihi binanın önünde el ele tutuşmuş, neşeyle gülen dünya çocuklarının resimleri yer alır. Atatürk, meclisin açıldığı bu kilit günü geleceğimiz olan çocuklara bir bayram olarak armağan etmiştir. Haritadaki çocuk çizimleri, bu bayramın dünyadaki tek çocuk bayramı olduğunu simgeler.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: 23 Nisan Testi",
          desc: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "23 Nisan 1920 günü Ankara'da açılan ve halkın yönetim gücünü somutlaştıran tarihi binanın adı nedir?",
              options: [
                "Dolmabahçe Sarayı",
                "Türkiye Büyük Millet Meclisi (TBMM)",
                "Çankaya Köşkü",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "23 Nisan günü Türk milleti tarafından her yıl hangi milli bayram olarak coşkuyla kutlanır?",
              options: [
                "Cumhuriyet Bayramı",
                "Ulusal Egemenlik ve Çocuk Bayramı",
                "Zafer Bayramı",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Atatürk, meclisin açılış günü olan bu kilit tarihi somut olarak kimlere bayram olarak armağan etmiştir?",
              options: [
                "Sadece askerlere",
                "Geleceğimiz olan çocuklara",
                "Yabancı devlet yöneticilerine",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: "23 Nisan Bayramı'nın dünya genelindeki en benzersiz coğrafi özelliği aşağıdakilerden hangisidir?",
              options: [
                "Sadece kışın kutlanması",
                "Dünyada çocuklara armağan edilen ilk ve tek çocuk bayramı olması",
                "Hiç bayrak asılmadan kutlanması",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Meclis binasının tepesinde dalgalanan kırmızı renkli sembolümüz hangisidir?",
              options: [
                "Beyaz bir flama",
                "Ay yıldızlı al bayrağımız",
                "Renkli bir okul arması",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "23 Nisan kutlama resimlerinde okulların ve sokakların neyle süslendiği görülür?",
              options: [
                "Sadece büyük taşlarla",
                "Kırmızı beyaz balonlar, bayraklar ve süsleme şeritleriyle",
                "Kurumuş yapraklarla",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Haritadaki el ele tutuşmuş dünya çocukları figürleri bu bayramın hangi yönünü somutlaştırır?",
              options: [
                "Çocukların oyun oynamaktan sıkıldığını",
                "Bayramın tüm dünya çocukları arasında barış ve kardeşlik köprüsü kurduğunu",
                "Sadece okul bahçelerini",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "TBMM'nin açılmasıyla birlikte ülkemizde hangi kavram resmi olarak başlamış oldu?",
              options: [
                "Kralın tek başına yönetimi",
                "Ulusal egemenlik (Halkın kendi kendini yönetme gücü)",
                "Sadece askeri düzen",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "23 Nisan günü meclis önünde toplanan halk resimleri neyi simgeler?",
              options: [
                "Herkesin çok yorgun olduğunu",
                "Milletin meclise ve kendi özgürlüğüne neşeyle sahip çıktığını",
                "Sadece yürüyüş yapıldığını",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir öğrenci 23 Nisan Çocuk Bayramı resimlerine baktığında hangi temel duyguyu hisseder?",
              options: [
                "Korku ve endişe",
                "Milli coşku, neşe, gurur ve birlik ruhu",
                "Sıkıntı ve yalnızlık",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: 23 Nisan Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "23 Nisan 1920 tarihinde Ankara'da kısa adı .................... olan meclis binası açılmıştır.",
              words: ["TBMM", "TRT"],
              correct: "TBMM",
            },
            {
              q: "Atatürk, bu önemli günü tüm dünya .................... bir bayram olarak hediye etmiştir.",
              words: ["çocuklarına", "askerlerine"],
              correct: "çocuklarına",
            },
            {
              q: "Meclis binasının üzerinde dalgalanan ay yıldızlı .................... bizim bağımsızlık sembolümüzdür.",
              words: ["bayrağımız", "flamamız"],
              correct: "bayrağımız",
            },
            {
              q: "23 Nisan günü sokaklarda kırmızı beyaz .................... uçurulur ve şarkılar söylenir.",
              words: ["balonlar", "yapraklar"],
              correct: "balonlar",
            },
            {
              q: "Bu bayramın tam adı Ulusal .................... ve Çocuk Bayramı olarak kayıtlara geçmiştir.",
              words: ["Egemenlik", "Kurtuluş"],
              correct: "Egemenlik",
            },
            {
              q: "Haritadaki çocuk resimleri dünya çocuklarının Türkiye'de .................... içinde buluştuğunu gösterir.",
              words: ["kardeşlik", "kavga"],
              correct: "kardeşlik",
            },
            {
              q: "Meclisin açılmasıyla devlet yönetiminde son söz hakkı somut olarak .................... verilmiştir.",
              words: ["millete", "krallara"],
              correct: "millete",
            },
            {
              q: "23 Nisan sabahı okullarda şiirler okunur ve renkli .................... gösterileri yapılır.",
              words: ["dans", "sınav"],
              correct: "dans",
            },
            {
              q: "Ankara'daki ilk tarihi meclis binası günümüzde korunan bir .................... olarak ziyaret edilir.",
              words: ["müze", "fabrika"],
              correct: "müze",
            },
            {
              q: "Bayram coşkusu çocukların kalbinde büyük bir vatan .................... oluşturur.",
              words: ["sevgisi", "korkusu"],
              correct: "sevgisi",
            },
          ],
        },
      },
    },
  },
  "17": {
    story: {
      title: "ISLAK PATİLER",
      theme: "Hayvan Sevgisi",
      text: "Dışarıda sabahtan beri durmaksızın çok şiddetli bir ilkbahar yağmuru yağıyordu. Nil, odasının penceresinden sokaktaki su birikintilerini ve koşan insanları izliyordu. Tam o sırada bahçe kapısının altından ince bir kedi sesi duyuldu. Nil ve annesi hemen dış kapıyı açıp merdiven boşluğuna baktılar. Kapının köşesine sığınmış, gri tüyleri tamamen ıslanmış minik bir kedi duruyordu. Zavallı kediciğin küçük patileri çamur olmuş ve soğuktan titriyordu. Nil, hemen koşarak kilerden eski ve boş bir karton kutu getirdi. Annesi ise yumuşak kahverengi bir kazak çıkarıp kutunun içine serdi. Kutuyu rüzgar almayan sıcak kapı girişine koyup kediyi yavaşça içine yerleştirdiler. Minik kedi sıcak kazağın üzerine kıvrılarak ıslak patilerini temizlemeye başladı.",
      questions: [
        {
          id: 1,
          q: "Dışarıda sabahtan beri ne yağıyordu?",
          options: [
            "Yoğun bir beyaz kar",
            "Şiddetli bir ilkbahar yağmuru",
            "Küçük dolu taneleri",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Nil odasının penceresinden dışarı bakarken ne duydu?",
          options: [
            "Küçük bir kuş sesi",
            "İnce bir kedi sesi",
            "Büyük bir köpek havlaması",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "Kapının köşesine sığınan kedinin tüyleri ne renkliydi?",
          options: ["Siyah", "Beyaz", "Gri"],
          correct: 2,
        },
        {
          id: 4,
          q: "Kedinin patileri neden çamur olmuştu?",
          options: [
            "Bahçedeki toprağı kazdığı için",
            "Yağmurdan dolayı sokaklar çamur olduğu için",
            "Sütün içine bastığı için",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Nil kediye yuva yapmak için kilerden ne getirdi?",
          options: [
            "Eski ve boş bir karton kutu",
            "Büyük plastik bir leğen",
            "Tahta bir meyve kasası",
          ],
          correct: 0,
        },
        {
          id: 6,
          q: "Annesi kutunun içine sermek için banyodan ne getirdi?",
          options: [
            "Büyük beyaz bir havlu",
            "Eski, yumuşak kahverengi bir kazak",
            "Renkli küçük bir kilim",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Hazırlanan kutuyu evin neresine koydular?",
          options: [
            "Balkonun en uç köşesine",
            "Rüzgar almayan sıcak kapı girişine",
            "Mutfağın tezgahının altına",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Kutunun içine giren kedi en son ne yapmaya başladı?",
          options: [
            "Odaların içinde koşmaya başladı",
            "Sıcak kazağa kıvrılıp ıslak patilerini temizledi",
            "Miyavlayarak dışarı çıkmak istedi",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "✂️ Kelimeleri Ayıran Sihirli Çizgi!",
        rules: [
          {
            name: "Kesme İşareti ( ' )",
            desc: "Özel isimlerin (insan, şehir, ülke ve hayvan isimleri) sonuna gelen bazı somut ekleri ayırmak için kelimenin tepesine koyduğumuz işarete Kesme İşareti ( ' ) denir.",
            example: "Nil'in kedisi, Ankara'ya gittim.",
          },
          {
            name: "Dikkat",
            desc: "Cins isimlerin sonuna gelen ekler asla kesme işaretiyle ayrılmaz!",
            example: "Yanlış: Kedi'nin sütü, Çanta'yı aldım.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Doğru Kesme Avcısı",
        desc: "Seçeneklerde kesme işaretinin kullanımı tamamen doğru olan cümleyi bulunuz.",
        questions: [
          {
            id: 1,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Nil'in gri tüylü kedisi çok sevimliydi.",
              "Nilin gri tüylü kedi'si çok sevimliydi.",
              "Nil'in gri tüylü kedisi' çok sevimliydi.",
            ],
            correct: 0,
          },
          {
            id: 2,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Dün sabah Ankara'ya doğru yola çıktık.",
              "Dün sabah Ankaraya doğru yol'a çıktık.",
              "Dün sabah Ankara'ya doğru yola' çıktık.",
            ],
            correct: 0,
          },
          {
            id: 3,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Kedim Pamuk'un beyaz bir kasesi var.",
              "Kedim Pamukun beyaz bir kase'si var.",
              "Kedim Pamuk'un beyaz bir kasesi' var.",
            ],
            correct: 0,
          },
          {
            id: 4,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Ömer'in elindeki fırça çok kalındı.",
              "Ömerin elindeki fırça' çok kalındı.",
              "Ömer'in elindeki fırçayı' kırdı.",
            ],
            correct: 0,
          },
          {
            id: 5,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Biz pazar günü İstanbul'da piknik yaptık.",
              "Biz pazar günü İstanbulda piknik' yaptık.",
              "Biz pazar günü İstanbul'da piknik yaptık'.",
            ],
            correct: 0,
          },
          {
            id: 6,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Yarın sınıfa Elfe'nin annesi gelecek.",
              "Yarın sınıfa Elfenin anne'si gelecek.",
              "Yarın sınıfa Elfe'nin annesi' gelecek.",
            ],
            correct: 0,
          },
          {
            id: 7,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Türkiye'nin üç tarafı denizle kaplıdır.",
              "Türkiyenin üç tarafı deniz'le kaplıdır.",
              "Türkiye'nin üç tarafı denizle' kaplıdır.",
            ],
            correct: 0,
          },
          {
            id: 8,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Mert'in yeni bir Yeşil Takım'ı var.",
              "Mertin yeni bir Yeşil Takımı var.",
              "Mert'in yeni bir Yeşil Takımı var.",
            ],
            correct: 2,
          },
          {
            id: 9,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Kaan'ın getirdiği boyalar çok parlaktı.",
              "Kaanın getirdiği boya'lar çok parlaktı.",
              "Kaan'ın getirdiği boyalar' çok parlaktı.",
            ],
            correct: 0,
          },
          {
            id: 10,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Ali'nin sırasının altında bir silgi duruyordu.",
              "Alinin sırasının altında bir silgi' duruyordu.",
              "Ali'nin sırasının altında bir silgi duruyordu'.",
            ],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Kesme mi Değil mi?",
        desc: "Cümlelerde boş bırakılan parantez içlerine Kesme İşareti ( ' ) gelmeli midir, yoksa boş mu kalmalıdır?",
        questions: [
          {
            words: [
              "Nil",
              "in odasındaki pencere sokağa bakıyordu.",
              "Kesme İşareti gelmeli",
            ],
            correct: "Kesme İşareti gelmeli",
          },
          {
            words: [
              "Çanta",
              "sını masanın üzerine yavaşça bıraktı.",
              "Boş kalmalı",
            ],
            correct: "Boş kalmalı",
          },
          {
            words: [
              "Yarın sabah Kerem",
              "in banyodaki lavabosu tamir edilecek.",
              "Kesme İşareti gelmeli",
            ],
            correct: "Kesme İşareti gelmeli",
          },
          {
            words: [
              "Bahçe",
              "deki büyük çınar ağacının dalı kırıldı.",
              "Boş kalmalı",
            ],
            correct: "Boş kalmalı",
          },
          {
            words: [
              "Gelecek ay ablamla birlikte Bursa",
              "ya gideceğiz.",
              "Kesme İşareti gelmeli",
            ],
            correct: "Kesme İşareti gelmeli",
          },
          {
            words: [
              "Masanın üzerindeki defter",
              "i çantama koydum.",
              "Boş kalmalı",
            ],
            correct: "Boş kalmalı",
          },
          {
            words: [
              "Köpeğim Karabaş",
              "ın uzun beyaz bir tasması var.",
              "Kesme İşareti gelmeli",
            ],
            correct: "Kesme İşareti gelmeli",
          },
          {
            words: ["Limon", "ları sepete tek tek doldurdum.", "Boş kalmalı"],
            correct: "Boş kalmalı",
          },
          {
            words: [
              "Zeynep",
              "in kırmızı boya kalemleri kaybolmuş.",
              "Kesme İşareti gelmeli",
            ],
            correct: "Kesme İşareti gelmeli",
          },
          {
            words: [
              "Oyuncak",
              "ları plastik büyük kutunun içine attım.",
              "Boş kalmalı",
            ],
            correct: "Boş kalmalı",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Bandırma Vapuru ve Kurtuluş Meşalesi",
          rules: [
            {
              name: "Mavi Dalgalar Üstündeki Siyah Gemi",
              desc: "Haritada 19 Mudanya veya İstanbul hattından Karadeniz'in hırçın mavi dalgalarına doğru ilerleyen siyah bir gemi resmi görülür; bu ünlü Bandırma Vapuru'dur. 19 Mayıs 1919 günü Mustafa Kemal, bu gemiyle Samsun limanına somut olarak ayak basmıştır.",
              example: "",
            },
            {
              name: "Yanan Kurtuluş Meşalesi Logosu",
              desc: "Samsun kıyısında haritaya parlak sarı renkli, etrafına ışık saçan dev bir meşale resmi çizilmiştir. Bu meşale, Kurtuluş Savaşı'nın başlangıcını simgeler. Atatürk, bu hareketli ve enerjik günü Türk gençliğine spor temasıyla armağan etmiştir. Haritada stadyumlarda spor yapan, koşan atletik genç figürleri yer alır.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: 19 Mayıs Gençlik Testi",
          desc: "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Mustafa Kemal'in 19 Mayıs 1919 günü Samsun'a ulaşmasını sağlayan o ünlü siyah geminin adı nedir?",
              options: ["Savarona Gemisi", "Bandırma Vapuru", "Ertuğrul Yatı"],
              correct: 1,
            },
            {
              id: 2,
              q: "19 Mayıs tarihi ülkemizde her yıl hangi resmi milli bayram olarak büyük stadyumlarda ve meydanlarda kutlanır?",
              options: [
                "Çocuk Bayramı",
                "Atatürk'ü Anma, Gençlik ve Spor Bayramı",
                "Zafer Bayramı",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Bandırma Vapuru'nun haritadaki rotasına bakıldığında hangi denizimizin hırçın mavi sularında yolculuk yapmıştır?",
              options: ["Akdeniz", "Karadeniz", "Ege Denizi"],
              correct: 1,
            },
            {
              id: 4,
              q: "Haritada Samsun kıyısına çizilen o parlak sarı renkli yanan meşale somut olarak neyi simgeler?",
              options: [
                "Sadece büyük bir ateşi",
                "Kurtuluş Savaşı'nın ve özgürlük mücadelesinin başlangıcını, umut ışığını",
                "Akşam vakti olduğunu",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Atatürk bu büyük mücadele başlangıcı olan günü somut olarak kimlere bayram olarak hediye etmiştir?",
              options: [
                "Sadece yaşlı komşulara",
                "Ülkenin geleceği olan dinamik Türk gençliğine",
                "Yabancı tüccarlara",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Bayram haritasındaki koşan, spor yapan genç figürleri bayramın hangi ikinci büyük temasını gösterir?",
              options: [
                "Sadece uyumayı sevdiklerini",
                "Spor, sağlık, energy ve dinamizm hareketlerini",
                "Resim yapma sürecini",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "19 Mayıs günü okul bahçelerinde ve spor salonlarında yapılan gösterilerin ortak adı nedir?",
              options: [
                "Matematik olimpiyatları",
                "Gençlik ve spor gösterileri, jimnastik hareketleri",
                "Sessiz oturma yarışı",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Mustafa Kemal'in Samsun'a çıkış amacı haritadaki askeri planlara göre hangisidir?",
              options: [
                "Sadece dinlenmek ve gezi yapmak",
                "Milli Mücadele'yi başlatıp vatanı düşmanlardan kurtarmak",
                "Yeni bir okul binası aramak",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "19 Mayıs Bayramı'nın isminin başında \"Atatürk'ü Anma\" ifadesinin bulunması gençlere hangi görevi hatırlatır?",
              options: [
                "Sadece eski fotoğraflara bakmayı",
                "Atatürk'ün fikirlerini, emanet ettiği vatanı korumayı ve onu saygıyla hatırlamayı",
                "Bayramda hiç dışarı çıkmamayı",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir öğrenci 19 Mayıs kutlamalarındaki Türk bayraklı koşu çizgilerini izlediğinde ne hisseder?",
              options: [
                "Korku ve gerileme",
                "Büyük bir güç, enerji, vatan sevgisi ve gurur duygusu",
                "Sadece yorgunluk",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: 19 Mayıs Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "Mustafa Kemal, 19 Mayıs 1919 günü Karadeniz kıyısındaki .................... şehrine ayak basmıştır.",
              words: ["Samsun", "Antalya"],
              correct: "Samsun",
            },
            {
              q: "Bu tarihi yolculuğu gerçekleştiren siyah renkli geminin adı .................... Vapuru'dur.",
              words: ["Bandırma", "İstanbul"],
              correct: "Bandırma",
            },
            {
              q: "Kıyıda yanan sarı .................... resmi özgürlük mücadelesinin somut ilk ışığıdır.",
              words: ["meşale", "mum"],
              correct: "meşale",
            },
            {
              q: "Atatürk, bu kilit ve enerjik günü Türk .................... bayram olarak hediye etmiştir.",
              words: ["gençliğine", "çocuklarına"],
              correct: "gençliğine",
            },
            {
              q: "Bayram şablonundaki jimnastik yapan figürler bayramın .................... temasını simgeler.",
              words: ["spor", "resim"],
              correct: "spor",
            },
            {
              q: "19 Mayıs günü stadyumlarda kırmızı beyaz şeritler ve dev .................... taşınır.",
              words: ["bayraklar", "kutular"],
              correct: "bayraklar",
            },
            {
              q: "Samsun'a çıkış ile birlikte tarihimizdeki büyük .................... Savaşı resmi olarak başlamıştır.",
              words: ["Kurtuluş", "Dünya"],
              correct: "Kurtuluş",
            },
            {
              q: "Bayramın tam adı Atatürk'ü Anma, Gençlik ve .................... Bayramı'dır.",
              words: ["Spor", "Oyun"],
              correct: "Spor",
            },
            {
              q: "Gençler, ellerinde Türk bayraklarıyla meydanlarda büyük .................... koşuları yaparlar.",
              words: ["saygı", "kaçış"],
              correct: "saygı",
            },
            {
              q: "Bu bayram her yıl gençliğin vatanı koruma .................... tazeleyen kilit bir gündür.",
              words: ["azmini", "korkusunu"],
              correct: "azmini",
            },
          ],
        },
      },
    },
  },
  "18": {
    story: {
      title: "YEŞİL TAKIM İŞ BAŞINDA",
      theme: "Çevre Bilinci",
      text: "Mert ve arkadaşları, pazar günü göl kenarındaki yeşil alanda piknik yaptılar. Oyunları bittikten sonra etraftaki diğer masaların altına doğru dikkatlice baktılar. Bazı insanların plastik şişeleri ve kağıtları çimlerin üzerinde bıraktığını gördüler. Bu kirli manzara çocukların güzel doğayı koruma duygusunu hemen harekete geçirdi. Mert, 'Haydi arkadaşlar, hemen bir Yeşil Takım kuralım!' diye bağırdı. Çocuklar çantalarından şeffaf temizlik eldivenlerini çıkarıp ellerine hızlıca taktılar. Yerlerde duran bütün pet şişeleri, eski kağıtları ve plastik kapları topladılar. Topladıkları çöpleri büyük torbalara koyarak parkın çıkışındaki geri dönüşüm alanına taşıdılar. Şişeleri mavi, kağıtları ise sarı renkli olan geri dönüşüm kutularına attılar. İşleri bittiğinde göl kenarı tamamen temiz ve yemyeşil görünüyordu.",
      questions: [
        {
          id: 1,
          q: "Mert ve arkadaşları pazar günü nerede piknik yaptılar?",
          options: [
            "Okulun büyük spor salonunda",
            "Göl kenarındaki yeşil alanda",
            "Evlerinin geniş balkonunda",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Çocuklar masaların altında ne gördüler?",
          options: [
            "Unutulmuş renkli oyuncaklar",
            "Plastik şişeler ve kirli kağıtlar",
            "Küçük tatlı köpek yavruları",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "Mert arkadaşlarına ne kurmayı teklif etti?",
          options: [
            "Büyük bir futbol takımı",
            "Bir Yeşil Takım",
            "Yeni bir müzik grubu",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Çocuklar temizlik yapmadan önce ellerine ne taktılar?",
          options: [
            "Şeffaf temizlik eldivenleri",
            "Kışlık yün örgülü eldivenler",
            "Kırmızı boks eldivenleri",
          ],
          correct: 0,
        },
        {
          id: 5,
          q: "Toplanan çöpleri nereye koyarak taşıdılar?",
          options: [
            "Ahşap pazar kasalarına",
            "Büyük torbalara",
            "Sırt çantalarının içine",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Çöpleri parkın neresindeki geri dönüşüm alanına götürdüler?",
          options: [
            "Parkın tam ortasındaki çocuk oyun alanına",
            "Parkın çıkışındaki alana",
            "Gölün hemen üzerindeki küçük köprüye",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Plastik pet şişeleri hangi renkli kutuya attılar?",
          options: ["Sarı", "Mavi", "Yeşil"],
          correct: 1,
        },
        {
          id: 8,
          q: "Temizlik bittikten sonra göl kenarı nasıl görünüyordu?",
          options: [
            "Halen kirli ve çöplerle doluydu",
            "Tamamen temiz ve yemyeşil",
            "Sular yükseldiği için ıslaktı",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "📏 Satır Sonuna Sığmayan Kelimeler!",
        rules: [
          {
            name: "Kural",
            desc: "Defterimize yazı yazarken satırın en sonuna geldiğimizde, eğer kelime oraya tamamen sığmıyorsa onu hecesinden böleriz. Kalan kısmı alt satıra yazarız ve satırın sonuna Kısa Çizgi ( - ) koyarız.",
            example: "Mert ve arkadaşla-rı göl kenarında piknik yaptılar.",
          },
          {
            name: "En Önemli Kural",
            desc: "Kelimeler satır sonunda bölünürken mutlaka hecelerinden bölünmelidir! Asla tek bir harf yukarıda bırakılmamalıdır.",
            example: "Yanlış: ark-adaşları",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Doğru Bölme Avcısı",
        desc: "Satır sonunda kısa çizgiyle doğru şekilde hecesinden bölünmüş olan kelimeyi bulunuz.",
        questions: [
          {
            id: 1,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["arka-daşları", "arkad-aşları", "a-rkadaşları"],
            correct: 0,
          },
          {
            id: 2,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["pas-tahane", "pasta-hane", "past-ahane"],
            correct: 1,
          },
          {
            id: 3,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["te-mizlik", "tem-izlik", "temizl-ik"],
            correct: 0,
          },
          {
            id: 4,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["oyun-caklar", "oyunc-aklar", "o-yuncaklar"],
            correct: 0,
          },
          {
            id: 5,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["çan-tamızda", "çant-amızda", "ça-ntamızda"],
            correct: 0,
          },
          {
            id: 6,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["bi-lgisayar", "bil-gisayar", "bilgi-sayar"],
            correct: 2,
          },
          {
            id: 7,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["do-matesler", "doma-tesler", "domat-esler"],
            correct: 1,
          },
          {
            id: 8,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["ka-lemıtraş", "kalem-tıraş", "kal-emtiraş"],
            correct: 1,
          },
          {
            id: 9,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["pen-cereden", "pence-reden", "pencered-en"],
            correct: 1,
          },
          {
            id: 10,
            q: "Hangi kelime satır sonunda doğru bölünmüştür?",
            options: ["ke-lebekler", "kel-ebekler", "keleb-ekler"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Bölme Dedektifi",
        desc: "Satır sonunda kısa çizgiyle yapılan bölme işlemlerinin doğru mu yanlış mı olduğunu eşleştiriniz.",
        questions: [
          { words: ["piknik-ten", "Doğru", "Yanlış"], correct: "Doğru" },
          { words: ["pikn-ikten", "Doğru", "Yanlış"], correct: "Yanlış" },
          { words: ["u-çurtma", "Doğru", "Yanlış"], correct: "Yanlış" },
          { words: ["uçurt-ma", "Doğru", "Yanlış"], correct: "Doğru" },
          { words: ["balık-çılar", "Doğru", "Yanlış"], correct: "Doğru" },
          { words: ["ba-lıkçılar", "Doğru", "Yanlış"], correct: "Doğru" },
          { words: ["karon-kutu", "Doğru", "Yanlış"], correct: "Yanlış" },
          { words: ["eldi-venler", "Doğru", "Yanlış"], correct: "Doğru" },
          { words: ["eldiv-enler", "Doğru", "Yanlış"], correct: "Yanlış" },
          { words: ["geri-dönüşüm", "Doğru", "Yanlış"], correct: "Doğru" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Büyük Taarruz ve Birlik Ruhu",
          rules: [
            {
              name: "Askeri Harita and Taarruz Çizgileri",
              desc: "Zafer haritasında 30 Ağustos günü incelendiğinde, Kütahya Dumlupınar bölgesinde kırmızı ve mavi oklarla çizilmiş büyük bir askeri harekat planı görülür; bu Büyük Taarruz'dur. Türk ordusu, tek bir yürek halinde birleşerek vatanı düşmanlardan tamamen temizlemek için bu çizgiler üzerinden harekete geçmiştir.",
              example: "",
            },
            {
              name: "Kazanılan Büyük Zafer Logosu",
              desc: "Haritada harekat oklarının birleştiği yerde, üzerinde defne yaprakları olan büyük bir gümüş Zafer Madalyası resmi yer alır. 30 Ağustos günü kazanılan bu kesin askeri başarı, ordumuzun kahramanlığını ve milletimizin sarsılmaz birlik ruhunu somutlaştırır. Haritada gururla yürüyen şanlı Türk askerlerinin geçit töreni resimleri çizilidir.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Zafer Bayramı Testi",
          desc: "30 Ağustos Zafer Bayramı ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "30 Ağustos 1922 günü Dumlupınar'da başarıyla sonuçlanan ve düşmanı topraklardan çıkaran askeri harekatın adı nedir?",
              options: [
                "Birinci İnönü Savaşı",
                "Büyük Taarruz ve Başkomutanlık Meydan Muharebesi",
                "Sakarya Savaşı",
              ],
              correct: 1,
            },
            {
              id: 2,
              q: "Her yıl 30 Ağustos günü Türk milleti ve şanlı ordumuz tarafından hangi resmi bayram olarak gururla kutlanır?",
              options: [
                "Gençlik Bayramı",
                "Zafer Bayramı",
                "Cumhuriyet Bayramı",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Zafer haritasındaki kırmızı harekat okları ordumuzun hangi büyük özelliğini ve gücünü somut olarak gösterir?",
              options: [
                "Sürekli geri çekildiğini",
                "Kahramanlığını, vatanı kurtarma azmini ve büyük taarruz gücünü",
                "Savaşmaktan vazgeçtiğini",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: "30 Ağustos günü meydanlarda ve askeri kışlalarda düzenlenen, tankların ve askerlerin yürüdüğü etkinliklerin adı nedir?",
              options: [
                "Okul spor müsabakaları",
                "Resmi geçit törenleri",
                "Kitap okuma saatleri",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Haritadaki gümüş zafer madalyası simgesi Türk milletinin hangi ruhla kazandığı zaferi simgeler?",
              options: [
                "Ayrılık ve kavga ruhuyla",
                "Sarsılmaz bir birlik, beraberlik ve el ele tutuşma ruhuyla",
                "Sadece şans eseri",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "30 Ağustos Zafer Bayramı'nda evlerin balkonlarına ve caddelere en çok hangi somut nesne asılır?",
              options: [
                "Renkli balonlar",
                "Devasa boyutta ay yıldızlı Türk bayrakları",
                "Okul çantaları",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: 'Askeri haritaya göre Büyük Taarruz emrini "Ordular! İlk hedefiniz Akdeniz\'dir, ileri!" sözüyle veren başkomutan kimdir?',
              options: [
                "Ali Rıza Efendi",
                "Başkomutan Mustafa Kemal Atatürk",
                "Ahmet Bey",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "30 Ağustos Zaferi'nin ülkemizin sınır çizgilerine olan en büyük somut etkisi aşağıdakilerden hangisidir?",
              options: [
                "Vatan topraklarının düşman işgalinden tamamen kurtarılmasını sağlaması",
                "Şehirlerin isimlerinin tamamen silinmesi",
                "Denizlerin suyunun kuruması",
              ],
              correct: 0,
            },
            {
              id: 9,
              q: "Geçit törenlerinde askeri bando takımlarının çaldığı marşlar halkta hangi duyguyu uyandırır?",
              options: [
                "Korku ve kaçma isteği",
                "Büyük bir milli gurur, coşku ve kahramanlık hissi",
                "Yorgunluk ve uyku",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir çocuk 30 Ağustos Zafer Bayramı resimlerindeki kahraman asker figürlerine baktığında neyi anlar?",
              options: [
                "Güvenli bir vatanda özgürce yaşayabilmemizi bu büyük zaferlere borçlu olduğumuzu",
                "Askerlerin sadece yürüdüğünü",
                "Bayramın önemsiz olduğunu",
              ],
              correct: 0,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Zafer Bayramı Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "30 Ağustos 1922 tarihinde Dumlupınar'da büyük bir askeri .................... kazanılmıştır.",
              words: ["zafer", "yenilgi"],
              correct: "zafer",
            },
            {
              q: "Bu büyük başarının haritadaki askeri adı .................... Taarruz olarak çizilmiştir.",
              words: ["Büyük", "Küçük"],
              correct: "Büyük",
            },
            {
              q: "Zafer haritasındaki gümüş madalya şanlı ordumuzun .................... simgeler.",
              words: ["kahramanlığını", "korkusunu"],
              correct: "kahramanlığını",
            },
            {
              q: "30 Ağustos günü caddelerde askerlerin katıldığı resmi geçit .................... düzenlenir.",
              words: ["törenleri", "sınavları"],
              correct: "törenleri",
            },
            {
              q: "Evlerin pencerelerinden sarkan ay yıldızlı al .................... sokakları kırmızıya boyar.",
              words: ["bayraklar", "perdeler"],
              correct: "bayraklar",
            },
            {
              q: "Bu zafer, Türk milletinin el ele vererek oluşturduğu sarsılmaz .................... ruhunun sonucudur.",
              words: ["birlik", "ayrılık"],
              correct: "birlik",
            },
            {
              q: 'Başkomutan Mustafa Kemal\'in "İleri!" emriyle ordu haritadaki ok yönlerinde .................... etmiştir.',
              words: ["hareket", "takibat"],
              correct: "hareket",
            },
            {
              q: "Bayramın resmi adı .................... Bayramı olarak tüm yurtta gururla kutlanır.",
              words: ["Zafer", "Çocuk"],
              correct: "Zafer",
            },
            {
              q: "Askeri bandoların çaldığı kahramanlık marşları tören alanını büyük bir .................... ile doldurur.",
              words: ["coşku", "sessizlik"],
              correct: "coşku",
            },
            {
              q: "30 Ağustos günü, vatanımızın düşmanlardan tamamen .................... günüdür.",
              words: ["temizlendiği", "ayrıldığı"],
              correct: "temizlendiği",
            },
          ],
        },
      },
    },
  },
  "19": {
    story: {
      title: "MAVİ GEZEGENİN BATTANİYESİ",
      theme: "Bilgilendirici / Uzay-Dünya",
      text: "Üzerinde yaşadığımız dünya, uzay boşluğunda parıldayan masmavi güzel bir gezegendir. Dünyamızın etrafını saran, gözle göremediğimiz sihirli kalın bir hava tabakası vardır. Bilim insanları bu önemli gaz tabakasına 'atmosfer' adını vermişlerdir. Atmosfer, aslında dünyamızı sıkıca koruyan devasa görünmez bir battaniye gibidir. Bu harika battaniye, güneşten gelen çok zararlı ve fazla sıcak ışınları engeller. Eğer atmosfer olmasaydı, güneş dünyamızı tamamen kurutur ve her yeri yakardı. Aynı zamanda bu battaniye, uzayın dondurucu soğuğunun içeri girmesine de izin vermez. İçindeki temiz hava sayesinde dünyadaki bütün insanlar, hayvanlar ve bitkiler güvenle nefes alır. Mavi gezegenimizin bu koruyucu örtüsü olmasaydı dünyada hiçbir canlı yaşayamazdı.",
      questions: [
        {
          id: 1,
          q: "Dünyamız uzay boşluğundan bakıldığında ne renk görünür?",
          options: ["Sapsarı", "Masmavi", "Yemyeşil"],
          correct: 1,
        },
        {
          id: 2,
          q: "Dünyanın etrafını saran hava tabakasına ne ad verilir?",
          options: ["Atmosfer", "Okyanus", "Bulut kümesi"],
          correct: 0,
        },
        {
          id: 3,
          q: "Atmosfer somut olarak neye benzetilmiştir?",
          options: [
            "Demir bir kaleye",
            "Devasa görünmez bir battaniyeye",
            "Uzun ince bir cam boru",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Bu hava battaniyesi güneşten gelen neleri engeller?",
          options: [
            "Zararlı ve fazla sıcak ışınları",
            "Küçük renkli yıldızları",
            "Uzaydaki gök taşlarını",
          ],
          correct: 0,
        },
        {
          id: 5,
          q: "Eğer atmosfer olmasaydı güneş dünyamıza ne yapardı?",
          options: [
            "Dünyayı tamamen kurutur ve her yeri yakardı",
            "Dünyayı buzlarla kaplardı",
            "Dünyanın rengini pembeye çevirirdi",
          ],
          correct: 0,
        },
        {
          id: 6,
          q: "Atmosfer uzaydan gelen neyin içeri girmesini engeller?",
          options: [
            "Büyük yağmur bulutlarının",
            "Dondurucu soğuğun",
            "Parlak ışıkların",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Canlıların nefes almasını sağlayan şey atmosferin neresindedir?",
          options: [
            "İçindeki temiz havada",
            "En üstteki bulutlarda",
            "Deniz seviyesinin altında",
          ],
          correct: 0,
        },
        {
          id: 8,
          q: "Bu koruyucu örtü olmasaydı dünyada ne olurdu?",
          options: [
            "Sadece balıklar yaşayabilirdi",
            "Hiçbir canlı yaşayamazdı",
            "Her gün kar yağardı",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🚨 Büyük Duyguların İşareti!",
        rules: [
          {
            name: "Ünlem İşareti ( ! )",
            desc: "Cümle içinde ani gelişen büyük duyguları; yani korku, sevinç, heyecan, şaşkınlık, üzüntü gibi hisleri veya seslenme, uyarı anlamlarını bildiren cümlelerin sonuna konur.",
            example: "Eyvah, kedinin patileri çamur olmuş! (Korku/Üzüntü)",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: İşaret Seçici",
        desc: "Cümlelerin sonundaki parantezlerin içine Nokta (.) mı yoksa Ünlem İşareti (!) mi gelmelidir?",
        questions: [
          {
            id: 1,
            q: "Yaşasın, yarın hep birlikte pikniğe gidiyoruz( )",
            options: [".", "!"],
            correct: 1,
          },
          {
            id: 2,
            q: "Bugün öğle arasında okulun bahçesinde yavaşça yürüdüm( )",
            options: [".", "!"],
            correct: 0,
          },
          {
            id: 3,
            q: "İmdat, bahçe kapısının önündeki kedi ağaçta mahsur kaldı( )",
            options: [".", "!"],
            correct: 1,
          },
          {
            id: 4,
            q: "Kutunun içine bütün renkli legoları tek tek doldurdum( )",
            options: [".", "!"],
            correct: 0,
          },
          {
            id: 5,
            q: "Eyvah, cüzdanımı okul bahçesinde düşürmüşüm( )",
            options: [".", "!"],
            correct: 1,
          },
          {
            id: 6,
            q: "Ahmet Bey dürüst davranışından dolayı Pelin’e teşekkür etti( )",
            options: [".", "!"],
            correct: 0,
          },
          {
            id: 7,
            q: "Dikkat, merdivenlerin basamakları yağmurdan dolayı çok ıslak( )",
            options: [".", "!"],
            correct: 1,
          },
          {
            id: 8,
            q: "Havalar soğuyunca ağaçlar kış uykusuna yatmak üzere hazırlanır( )",
            options: [".", "!"],
            correct: 0,
          },
          {
            id: 9,
            q: "Hey, oradaki pet şişeleri hemen geri dönüşüm kutusuna at( )",
            options: [".", "!"],
            correct: 1,
          },
          {
            id: 10,
            q: "Dünyamız uzay boşluğunda parıldayan masmavi bir gezegendir( )",
            options: [".", "!"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Duygu Dedektifi",
        desc: "Ünlem işareti taşıyan cümlelerin hangi duyguyu veya somut anlamı bildirdiğini doğru şekilde eşleştiriniz.",
        questions: [
          {
            words: [
              "Yaşasın, oyuncağım çalıştı!",
              "Sevinç / Heyecan",
              "Üzüntü / Telaş",
            ],
            correct: "Sevinç / Heyecan",
          },
          {
            words: [
              "Eyvah, piller tamamen bitmiş!",
              "Sevinç / Heyecan",
              "Üzüntü / Telaş",
            ],
            correct: "Üzüntü / Telaş",
          },
          {
            words: [
              "Dikkat, poşet her an yırtılabilir!",
              "Uyarı / Korku",
              "Şaşkınlık",
            ],
            correct: "Uyarı / Korku",
          },
          {
            words: [
              "İmdat, kedi merdivenden düşüyor!",
              "Korku / Yardım isteme",
              "Seslenme",
            ],
            correct: "Korku / Yardım isteme",
          },
          {
            words: ["Aaa, dünyamız meğer maviymiş!", "Şaşkınlık", "Seslenme"],
            correct: "Şaşkınlık",
          },
          {
            words: ["Hey, arkadaşım buraya bak!", "Seslenme", "Şaşkınlık"],
            correct: "Seslenme",
          },
          {
            words: [
              "Vah vah, zavallı kedicik çok ıslanmış!",
              "Üzüntü / Acıma",
              "Sevinç",
            ],
            correct: "Üzüntü / Acıma",
          },
          {
            words: ["Dur, yola aniden fırlama!", "Uyarı", "Bıkkınlık"],
            correct: "Uyarı",
          },
          {
            words: ["Harika, odam pırıl pırıl oldu!", "Sevinç", "Üzüntü"],
            correct: "Sevinç",
          },
          {
            words: [
              "Of, çantam bugün çok ağır!",
              "Bıkkınlık / Üzüntü",
              "Sevinç",
            ],
            correct: "Bıkkınlık / Üzüntü",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Modern Türkiye'nin Doğuşu",
          rules: [
            {
              name: "Altın Harflerle Yazılmış Tarih",
              desc: 'Bayram atlasında 29 Ekim günü incelendiğinde, üzerinde altın renkli harflerle "Cumhuriyet" yazılı büyük bir tabela resmi görülür. 29 Ekim 1923 günü Mustafa Kemal Atatürk, "Efendiler, yarın cumhuriyeti ilan edeceğiz!" sözünü söylemiş ve modern Türkiye Cumhuriyeti resmi olarak doğmuştur.',
              example: "",
            },
            {
              name: "Gece Fener Alayları ve Meşale Çizgileri",
              desc: "Haritada 29 Ekim gecesini süsleyen, ellerinde parıldayan fenerler ve yanan meşalelerle yürüyen yüz binlerce neşeli insan figürü çizilidir; bunlara Fener Alayı denir. Bu görsel, halkın kendi liderlerini seçme özgürlüğünü (cumhuriyeti) en büyük milli bayram olarak neşeyle kutlamasını betimler.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Cumhuriyet Bayramı Testi",
          desc: "29 Ekim Cumhuriyet Bayramı ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "29 Ekim 1923 günü Mustafa Kemal Atatürk önderliğinde ilan edilen ve modern devletimizin adı olan yönetim şekli hangisidir?",
              options: ["Krallık", "Türkiye Cumhuriyeti", "Padişahlık"],
              correct: 1,
            },
            {
              id: 2,
              q: "Her yıl 29 Ekim günü ülkemizde ve okullarımızda hangi en büyük milli bayram olarak coşkuyla kutlanır?",
              options: [
                "Gençlik Bayramı",
                "Cumhuriyet Bayramı",
                "Zafer Bayramı",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Atatürk'ün cumhuriyetin ilanından bir gece önce söylediği tarihi ve kilit söz aşağıdakilerden hangisidir?",
              options: [
                '"Efendiler, yarın cumhuriyeti ilan edeceğiz!"',
                '"Bu kitapları rafa diziniz."',
                '"Sokaktaki çöpleri toplayalım."',
              ],
              correct: 0,
            },
            {
              id: 4,
              q: "29 Ekim gecesi sokaklarda ellerinde ışıklar, fenerler ve meşalelerle yürüyen kalabalık insan gruplarının oluşturduğu görsel etkinliğe ne ad verilir?",
              options: [
                "Okul spor koşusu",
                "Fener Alayı",
                "Askeri kışla nöbeti",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Cumhuriyet yönetim şeklinin halka verdiği en büyük somut hak ve özgürlük aşağıdakilerden hangisidir?",
              options: [
                "Hiç okula gitmeme hakkı",
                "Kendi yöneticilerini ve liderlerini oy vererek kendisinin seçmesi hakkı",
                "Sadece pazar günleri dışarı çıkma izni",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: 'Bayram haritasındaki altın renkli harflerle yazılmış "Cumhuriyet" tabelası neyi simgeler?',
              options: [
                "Devletimizin modern ve özgür bir şekilde doğuşunu",
                "Paranın çok değerli olduğunu",
                "Tabelaların yeni boyandığını",
              ],
              correct: 0,
            },
            {
              id: 7,
              q: "29 Ekim Cumhuriyet Bayramı sabahı stadyumlarda öğrencilerin okuduğu uzun ve coşkulu yazı türü hangisidir?",
              options: [
                "Sadece kelime listeleri",
                "Cumhuriyet şiirleri ve Atatürk kompozisyonları",
                "Matematik formülleri",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Cumhuriyet Bayramı'nda gökyüzünü aydınlatan parlak, renkli ışık gösterilerine ne ad verilir?",
              options: [
                "Yağmur bulutu",
                "Havai fişek gösterileri",
                "Sokak lambası ışığı",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Mustafa Kemal Atatürk'ün cumhuriyeti kurduktan sonra seçildiği ilk devlet makamı rütbesi hangisidir?",
              options: [
                "Okul müdürü",
                "Türkiye Cumhuriyeti'nin ilk Cumhurbaşkanı",
                "Belediye başkanı",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir çocuk 29 Ekim Cumhuriyet Bayramı'nda caddelerdeki kırmızı beyaz bayrak denizini gördüğünde ne hisseder?",
              options: [
                "Korku ve çekinme",
                "Sonsuz bir özgürlük, milli gurur, neşe ve vatan sevgisi",
                "Sadece yalnızlık",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Cumhuriyet Doğrulama",
          desc: "Cumhuriyet Bayramı ile ilgili ifadelerin doğru mu yanlış mı olduğunu belirtiniz.",
          questions: [
            {
              q: "Türkiye Cumhuriyeti, 29 Ekim 1923 tarihinde resmi olarak ilan edilip kurulmuştur.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: '"Efendiler, yarın cumhuriyeti ilan edeceğiz!" sözü Başkomutan Atatürk\'e aittir.',
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: 'Cumhuriyet bayramında geceleri sokaklarda yapılan ışıklı yürüyüşlere "Kuş Alayı" denir.',
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Cumhuriyet yönetimi sayesinde halk, kendi yöneticilerini seçme özgürlüğünü kazanmıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "29 Ekim günü ülkemizin en küçük ve en önemsiz sıradan bir köy bayramıdır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Bayram haritasındaki altın renkli Cumhuriyet yazısı modern Türkiye'nin doğuşunu simgeler.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Cumhuriyet ilan edildikten sonra devletin ilk Cumhurbaşkanı Ali Rıza Efendi olmuştur.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "29 Ekim günü okullarda, evlerin pencerelerinde ay yıldızlı al bayraklar coşkuyla dalgalanır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Geceleri gökyüzünü kaplayan havai fişek resimleri bayramın kutlama neşesini somutlaştırır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Cumhuriyet Bayramı sadece Ankara'da kutlanır, diğer şehirlerde hiçbir şey yapılmaz.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
          ],
        },
      },
    },
  },
  "20": {
    story: {
      title: "ODAMDAKİ DAĞINIK ÜLKE",
      theme: "Sorumluluk",
      text: "Murat, okuldan sonra odasında arkadaşıyla akşama kadar çok eğlenceli oyunlar oynadı. Arkadaşı eve gittikten sonra odanın halini görünce gözlerine inanamadı. Yerdeki büyük kırmızı halının üzerinde bütün oyuncaklar birbirine karışmıştı. Yarış arabaları yatağın altında, renkli legolar ise masanın üstünde duruyordu. Odası bu haliyle adeta savaş çıkmış dağınık bir ülkeye benziyordu. Murat derin bir nefes aldı ve kendi odasının kahramanı olmaya karar verdi. Önce köşedeki büyük mavi plastik oyuncak kutusunu halının ortasına çekti. Yerdeki bütün legoları ve küçük taş blokları tek tek kutuya doldurdu. Ardından devrilmiş sarı yarış arabalarını kaldırıp kitaplığın en alt rafına dizdi. İşini bitirip kapının arkasından odasına baktığında her yer düzenli ve tertemizdi.",
      questions: [
        {
          id: 1,
          q: "Murat odasında ne zamana kadar oyun oynadı?",
          options: [
            "Sabah ders başlayana kadar",
            "Akşama kadar",
            "Gece yarısı olana kadar",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Murat'ın odasındaki büyük halı ne renkliydi?",
          options: ["Yeşil", "Kırmızı", "Mavi"],
          correct: 1,
        },
        {
          id: 3,
          q: "Yarış arabaları odanın neresine kaçmıştı?",
          options: [
            "Yatağın altına",
            "Giysi dolabının arkasına",
            "Balkonun köşesine",
          ],
          correct: 0,
        },
        {
          id: 4,
          q: "Murat dağınık odayı görünce ne olmaya karar verdi?",
          options: [
            "Hemen uyumaya çalışan bir çocuk",
            "Kendi odasının kahramanı",
            "Oyunu yeniden başlatacak bir oyuncu",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Murat'ın odasındaki plastik oyuncak kutusu ne renkliydi?",
          options: ["Sarı", "Kırmızı", "Mavi"],
          correct: 2,
        },
        {
          id: 6,
          q: "Murat kutunun içine ilk olarak neleri doldurdu?",
          options: [
            "Kalın hikaye kitaplarını",
            "Bütün legoları ve küçük taş blokları",
            "Kirli kıyafetlerini",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Sarı yarış arabalarını kitaplığın neresine dizdi?",
          options: ["En üst rafına", "En alt rafına", "Masanın çekmecesine"],
          correct: 1,
        },
        {
          id: 8,
          q: "Murat kapının arkasından odasına baktığında ne gördü?",
          options: [
            "Odanın halen çok dağınık olduğunu",
            "Her yerin düzenli ve tertemiz olduğunu",
            "Oyuncakların kaybolduğunu",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🚦 İşaretlerin Büyük Görevleri!",
        rules: [
          {
            name: "İki Nokta ( : )",
            desc: "Cümle içinde bir şeyle ilgili örnekler vereceğimiz zaman veya bir açıklamaya başlayacağımız zaman kelimenin hemen arkasına konur.",
            example:
              "Atölyeden şu renk boyaları getirdi: sarı, yeşil, kırmızı.",
          },
          {
            name: "Noktalı Virgül ( ; )",
            desc: "Cümle içinde virgüllerle ayrılmış farklı türleri veya grupları birbirine bağlamak için tam ortadaki sınır kapısına konur.",
            example: "Pazardan elma, armut; pırasa, ıspanak aldım.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Doğru İşaret Seçici",
        desc: "Boş bırakılan parantez içlerine İki Nokta ( : ) mı yoksa Noktalı Virgül ( ; ) mü gelmelidir?",
        questions: [
          {
            id: 1,
            q: "Çantamda şu oyuncaklar var( ) arabalar, legolar, taş bloklar.",
            options: [":", ";"],
            correct: 0,
          },
          {
            id: 2,
            q: "Mert, Can, Ömer erkekler( ) Sıla, Elif, Zeynep ise kızlar grubundadır.",
            options: [":", ";"],
            correct: 1,
          },
          {
            id: 3,
            q: "Geri dönüşüm alanında iki farklı kutu vardı( ) mavi ve sarı kutular.",
            options: [":", ";"],
            correct: 0,
          },
          {
            id: 4,
            q: "Pazardan elma, limon, portakal( ) kiler için ise patates, soğan aldık.",
            options: [":", ";"],
            correct: 1,
          },
          {
            id: 5,
            q: "Bilim insanları atmosferin önemini şöyle açıklar( ) Dünyayı koruyan bir battaniyedir.",
            options: [":", ";"],
            correct: 0,
          },
          {
            id: 6,
            q: "Murat odasında iki farklı oyun oynadı( ) legolar ve yarış arabaları.",
            options: [":", ";"],
            correct: 0,
          },
          {
            id: 7,
            q: "Kırtasiyeden defter, kitap, sözlük( ) banyoya ise sabun, havlu aldık.",
            options: [":", ";"],
            correct: 1,
          },
          {
            id: 8,
            q: "Bahçede iki tür ağaç bulunuyordu( ) yaşlı çınar ve dev meşe ağacı.",
            options: [":", ";"],
            correct: 0,
          },
          {
            id: 9,
            q: "Türkiye'nin etrafında üç büyük deniz uzanır( ) Karadeniz, Ege ve Akdeniz.",
            options: [":", ";"],
            correct: 0,
          },
          {
            id: 10,
            q: "Ankara, İstanbul, İzmir şehirler( ) Türkiye, Almanya, Fransa ise ülkelerdir.",
            options: [":", ";"],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Görev Dedektifi",
        desc: "Cümlelerde işaretlerin hangi amaçla (Örnek verme mi Türleri ayırma mı) kullanıldığını bulunuz.",
        questions: [
          {
            words: [
              "Masada şu meyveler duruyordu : elma, armut ve limon.",
              "Örnek vermek için",
              "Farklı grupları ayırmak için",
            ],
            correct: "Örnek vermek için",
          },
          {
            words: [
              "Kırmızı, sarı, mavi renkler ; kare, üçgen, yuvarlak ise şekillerdir.",
              "Örnek vermek için",
              "Renkle ve şekiller gruplarını ayırmak için",
            ],
            correct: "Renkle ve şekiller gruplarını ayırmak için",
          },
          {
            words: [
              "Kutunun içinden şunlar çıktı : metal paralar, eski bir anahtar.",
              "Örnek vermek için",
              "Farklı grupları ayırmak için",
            ],
            correct: "Örnek vermek için",
          },
          {
            words: [
              "Kedi, köpek, kuş hayvanlar ; çınar, meşe, çam ise ağaçlardır.",
              "Örnek vermek için",
              "Hayvanlar ve ağaçlar gruplarını ayırmak için",
            ],
            correct: "Hayvanlar ve ağaçlar gruplarını ayırmak için",
          },
          {
            words: [
              "Yarın yapılacak işleri sırayla yazdı : odasını toplamak, ders çalışmak.",
              "Örnek vermek için",
              "Farklı grupları ayırmak için",
            ],
            correct: "Örnek vermek için",
          },
          {
            words: [
              "Pelin, Sıla, Zeynep 3. sınıfa ; Kaan, Murat, Ömer ise 2. sınıfa gidiyor.",
              "Örnek vermek için",
              "Sınıf gruplarını ayırmak için",
            ],
            correct: "Sınıf gruplarını ayırmak için",
          },
          {
            words: [
              "Arıların kovanında iki tür arı bulunur : kaşif arılar ve işçi arılar.",
              "Örnek vermek için",
              "Farklı grupları ayırmak için",
            ],
            correct: "Örnek vermek için",
          },
          {
            words: [
              "Limon, portakal, mandalina kış meyveleri ; karpuz, kavun, çilek ise yaz meyveleridir.",
              "Örnek vermek için",
              "Kış ve yaz meyveleri gruplarını ayırmak için",
            ],
            correct: "Kış ve yaz meyveleri gruplarını ayırmak için",
          },
          {
            words: [
              "Çantamda şu eşyalar var : mavi boya kutusu, iki fırça ve defter.",
              "Örnek vermek için",
              "Farklı grupları ayırmak için",
            ],
            correct: "Örnek vermek için",
          },
          {
            words: [
              "Futbol, basketbol, tenis top oyunları ; saklambaç, körebe ise bahçe oyunlarıdır.",
              "Örnek vermek için",
              "Top ve bahçe oyunları gruplarını ayırmak için",
            ],
            correct: "Top ve bahçe oyunları gruplarını ayırmak için",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Bayrağımızın Simgesi Marşımız ve Mehmet Akif Ersoy",
          rules: [
            {
              name: "Nota Sayfası ve Ay Yıldız Resmi",
              desc: "Milli semboller şablonunda, üzerinde kırmızı bir ay yıldız çizimi olan büyük bir müzik nota sayfası görülür; bu bizim bağımsızlık şarkımız olan İstiklal Marşı'mızdır. Okullarda pazartesi ve cuma günleri bayrak direğinin önünde hazır rolda durarak söylediğimiz marşımızın somut resmidir.",
              example: "",
            },
            {
              name: "Kalem Tutan Şair Figürü",
              desc: "Sayfanın hemen yanında, elinde mürekkepli bir kalem tutan tonton şairimiz Mehmet Akif Ersoy'un resmi yer alır. O, Kurtuluş Savaşı sürerken askerlerimize ve milletimize cesaret vermek için bu muhteşem marşı yazmıştır. Marşımız meclis kürsüsünde okunduğunda tüm milletvekilleri onu somut olarak ayakta alkışlamıştır.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: İstiklal Marşı Testi",
          desc: "İstiklal Marşı'mız ile ilgili soruları cevaplayınız.",
          questions: [
            {
              id: 1,
              q: "Kırmızı ay yıldızlı bayrağımızın yanındaki en büyük bağımsızlık sembolümüz olan milli şarkımızın adı nedir?",
              options: ["Gençlik Marşı", "İstiklal Marşı", "Okul Şarkısı"],
              correct: 1,
            },
            {
              id: 2,
              q: "İstiklal Marşı'mızın muhteşem sözlerini kalemiyle yazan, haritada resmi bulunan kilit şairimiz kimdir?",
              options: ["Ahmet Bey", "Mehmet Akif Ersoy", "Necip Fazıl"],
              correct: 1,
            },
            {
              id: 3,
              q: "Okullarda İstiklal Marşı okunurken tüm öğrencilerin ve öğretmenlerin alması gereken somut duruş pozisyonu hangisidir?",
              options: [
                "Sıralara oturup dinlemek",
                "Hazır ol duruşunda, kıpırdamadan ve saygıyla bayrağa bakarak eşlik etmek",
                "Bahçede sessizce yürümek",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: "Mehmet Akif Ersoy, İstiklal Marşı'nı yazarken kime hitap etmiş ve ilk kelime olarak neyi seçmiştir?",
              options: [
                '"Koş" kelimesini seçmiştir.',
                '"Korkma!" diyerek şanlı Türk milletine ve kahraman ordumuza hitap etmiştir.',
                '"Uyu" kelimesiyle başlamıştır.',
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "İstiklal Marşı'mız yazıldıktan sonra ilk kez nerede okunmuş ve tüm milletvekilleri tarafından ayakta alkışlanmıştır?",
              options: [
                "Okul sınıfında",
                "Türkiye Büyük Millet Meclisi (TBMM) kürsüsünde",
                "Savaş çadırında",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Mehmet Akif Ersoy, kazandığı ödül parasını fakir çocuklara ve kadınlara iş öğreten bir yardım vakfına bağışlamıştır. Bu onun hangi özelliğidir?",
              options: [
                "Parayı çok sevdiğini gösterir.",
                "Yardımsever, fedakar ve asil bir karaktere sahip olduğunu gösterir.",
                "Çok cimri olduğunu anlatır.",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "İstiklal Marşı'mızın törenlerde coşkuyla söylediğimiz bestelenmiş halini (müziğini) yapan kilit kişi kimdir?",
              options: [
                "Mehmet Akif Bey",
                "Osman Zeki Üngör",
                "Ali Rıza Efendi",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "İstiklal Marşı toplam kaç kıtadan (bölümden) oluşur ve biz okullarda kaç kıtasını sesli okuruz?",
              options: [
                "5 kıtadır - 5 kıtasını okuruz.",
                "10 kıtadan oluşur - İlk 2 kıtasını hazır olda okuruz.",
                "3 kıtadır - Son kıtasını okuruz.",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: 'Mehmet Akif Ersoy, bu marşı kendi kitaplarına eklememiş ve "O benim değil, Türk milletinin eseridir." demiştir. Bu neyi gösterir?',
              options: [
                "Marşı beğenmediğini",
                "Milletine olan sonsuz saygısını ve alçakgönüllülüğünü",
                "Kitap yazmayı bilmediğini",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir öğrenci direkteki Türk bayrağı göğe yükselirken İstiklal Marşı'nı söylediğinde ne hisseder?",
              options: [
                "Korku ve yalnızlık",
                "Büyük bir bağımsızlık aşkı, vatan sevgisi, gurur ve milli birlik ruhu",
                "Sadece uykulu bir hal",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Milli Marş Boşluk Doldurma",
          desc: "Cümlelerde boş bırakılan yerleri doğru kelimelerle doldurunuz.",
          questions: [
            {
              q: "Biz miili bağımsızlık şarkımızın adı .................... Marşı olarak bilinir.",
              words: ["İstiklal", "Gençlik"],
              correct: "İstiklal",
            },
            {
              q: "Bu ölümsüz marşın kalemi kuvvetli olan ünlü şairi .................... Akif Ersoy'dur.",
              words: ["Mehmet", "Ahmet"],
              correct: "Mehmet",
            },
            {
              q: 'İstiklal Marşı\'mızın ilk kelimesi şanlı ordumuza cesaret veren "...................." sözüdür.',
              words: ["Korkma", "Yürü"],
              correct: "Korkma",
            },
            {
              q: "Okul bahçesindeki törenlerde marşımızı söylerken .................... ol duruşunda bekleriz.",
              words: ["hazır", "rahat"],
              correct: "hazır",
            },
            {
              q: "Marşımız, Ankara'daki tarihi .................... binasında alkışlarla kabul edilmiştir.",
              words: ["meclis", "saray"],
              correct: "meclis",
            },
            {
              q: "İstiklal Marşı'mızın bugünkü resmi ve somut müziğini (bestesini) yapan kişi Osman Zeki .................... 'dür.",
              words: ["Üngör", "Bey"],
              correct: "Üngör",
            },
            {
              q: "Törenlerde marşımız söylenirken gözlerimiz direkteki ay yıldızlı al .................... bakar.",
              words: ["bayrağa", "panoya"],
              correct: "bayrağa",
            },
            {
              q: "İstiklal Marşı toplam 10 kıtadır ama biz törenlerde ilk .................... kıtasını sesli okuruz.",
              words: ["iki", "beş"],
              correct: "iki",
            },
            {
              q: "Şair Mehmet Akif, bu büyük eseri kahraman Türk .................... ithaf ederek yazmıştır.",
              words: ["ordusuna", "tüccarlarına"],
              correct: "ordusuna",
            },
            {
              q: "İstiklal Marşı'mız, ülkemizin sonsuza kadar .................... kalacağının somut bir sembolüdür.",
              words: ["özgür", "bağımlı"],
              correct: "özgür",
            },
          ],
        },
      },
    },
  },
  "21": {
    story: {
      title: "KARANLIKTAKİ GÖLGELER",
      theme: "İleriye Geçiş / Cesaret",
      text: "Pelin, akşam yatağına yattığında odasındaki büyük lambayı kapattı. Sadece sokak lambasından gelen hafif ışık odanın içini aydınlatıyordu. Pelin tam gözlerini kapatacakken karşı duvarda devasa ve siyah bir gölge gördü. Gölge, kolları olan kollu bir canavara benziyordu ve kıpırdamadan duruyordu. Pelin'in kalbi hızlıca çarpmaya başladı ve korkudan battaniyesini burnuna kadar çekti. Kendi kendine, 'Korkacak bir şey yok, sadece bir gölge,' diyerek cesaretini topladı. Yatağından hızla kalkıp duvardaki elektrik düğmesine bastı ve ışığı açtı. Işık açılınca o korkunç canavar gölgesi birden yok oldu. Duvardaki gölgenin, aslında sandalyenin üzerine üst üste bırakılmış şapkası ve kalın hırkası olduğunu gördü. Pelin kendi korkusuyla neşeyle dalga geçerek yatağına döndü ve ışığı kapatıp rahatça uyudu.",
      questions: [
        {
          id: 1,
          q: "Pelin yatağına yattığında neyi kapattı?",
          options: [
            "Odasındaki büyük lambayı",
            "Pencerenin kalın perdesini",
            "Müziğin sesini",
          ],
          correct: 0,
        },
        {
          id: 2,
          q: "Pelin'in odasını gece ne aydınlatıyordu?",
          options: [
            "Masasındaki küçük gece lambası",
            "Sokak lambasından gelen hafif ışık",
            "Tavandaki renkli yıldızlar",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "Pelin duvarda nasıl bir gölge gördü?",
          options: [
            "Küçük bir kuş gölgesi",
            "Devasa ve siyah bir gölge",
            "Hızlıca koşan bir kedi gölgesi",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Pelin duvardaki gölgeyi ilk başta neye benzetti?",
          options: [
            "Kolları olan bir canavara",
            "Büyük bir ağaç dalına",
            "Kanatlı bir hayalete",
          ],
          correct: 0,
        },
        {
          id: 5,
          q: "Pelin korkunca battaniyesini nereye kadar çekti?",
          options: [
            "Sadece ayaklarına kadar",
            "Burnuna kadar",
            "Kafasının tamamen üstüne",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Pelin korkusunu yenmek için ilk olarak ne yaptı?",
          options: [
            "Ağlayarak annesini çağırdı",
            "Kendine korkacak bir şey olmadığını söyleyip cesaretini topladı",
            "Gözlerini sımsıkı kapatıp ağladı",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Duvardaki gölgenin gerçekte ne olduğu ortaya çıktı?",
          options: [
            "Pencerenin önündeki büyük saksı",
            "Sandalyenin üzerindeki şapka ve kalın hırka",
            "Kapının arkasında asılı duran okul çantası",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Pelin gerçeği öğrenince ne yaptı?",
          options: [
            "Korkusuyla neşeyle dalga geçip rahatça uyudu",
            "Başka bir odada uyumak istedi",
            "Sandalyeyi odanın dışına çıkardı",
          ],
          correct: 0,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🔍 Cümlenin Kaptanları!",
        rules: [
          {
            name: "Yüklem",
            desc: "Cümlenin en sonunda yer alan, işi ve hareketi bitiren ana kelimedir (Eylemdir). Yüklem olmadan cümle tamamlanmaz!",
            example: "",
          },
          {
            name: "Özne",
            desc: 'Cümledeki o işi, hareketi kimin veya neyin yaptığını gösteren varlıktır. Yükleme "Kim?" veya "Ne?" sorularını sorarak özneyi buluruz.',
            example:
              "Pelin odasındaki büyük lambayı kapattı. (Kapattı: Yüklem, Kim kapattı?: Pelin -> Özne)",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Kaptanı Bul",
        desc: "Aşağıdaki cümlelerin yüklemini (işi bitiren ana kelimeyi) seçeneklerden bulunuz.",
        questions: [
          {
            id: 1,
            q: '"Pelin yatağından hızla kalkıp duvardaki elektrik düğmesine bastı." cümlesinin yüklemi hangisidir?',
            options: ["yatağından", "bastı", "hızla"],
            correct: 1,
          },
          {
            id: 2,
            q: '"Işık açılınca o korkunç canavar gölgesi birden yok oldu." cümlesinin yüklemi hangisidir?',
            options: ["Işık", "canavar", "yok oldu"],
            correct: 2,
          },
          {
            id: 3,
            q: '"Korkunç gölge sandalyenin üzerinde üst üste bırakılmış hırkaydı." cümlesinin yüklemi hangisidir?',
            options: ["hırkaydı", "gölge", "sandalyenin"],
            correct: 0,
          },
          {
            id: 4,
            q: '"Küçük çocuk kendi korkusuyla neşeyle dalga geçti." cümlesinin yüklemi hangisidir?',
            options: ["çocuk", "dalga geçti", "korkusuyla"],
            correct: 1,
          },
          {
            id: 5,
            q: '"Can, hafta sonu evdeki eski ahşap çekmeceyi güzelce karıştırdı." cümlesinin yüklemi hangisidir?',
            options: ["karıştırdı", "çekmeceyi", "Can"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Büyütecin arkasından bakınca odadaki sıradan eşyalar tamamen değişti." cümlesinin yüklemi hangisidir?',
            options: ["eşyalar", "değişti", "büyütecin"],
            correct: 1,
          },
          {
            id: 7,
            q: '"Mutfaktan aldığı yeşil bulaşık süngerini masanın üzerine bıraktı." cümlesinin yüklemi hangisidir?',
            options: ["bıraktı", "süngerini", "masanın"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Küçük yeşil tırtıl bahçedeki yaprağın üzerinde günlerdir duruyor." cümlesinin yüklemi hangisidir?',
            options: ["tırtıl", "yaprağın", "duruyor"],
            correct: 2,
          },
          {
            id: 9,
            q: '"Kuru meşe palamudunu eline alarak toprağa sevgiyle gömdü." cümlesinin yüklemi hangisidir?',
            options: ["gömdü", "toprağa", "palamudunu"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Eren, odasındaki ahşap çalışma masasının çekmecesini hızlıca açtı." cümlesinin yüklemi hangisidir?',
            options: ["açtı", "masasının", "Eren"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: İşi Yapan Kim?",
        desc: "Cümlelerde işi yapan varlığı (özneyi) bulmak için sorunun cevabı olan kelimeyi bularak yerleştiriniz.",
        questions: [
          { words: ["Pelin", "Sokak lambası", "Arda"], correct: "Pelin" },
          {
            words: ["Pelin", "Sokak lambası", "Arda"],
            correct: "Sokak lambası",
          },
          { words: ["Pelin", "Sokak lambası", "Arda"], correct: "Arda" },
          {
            words: ["Büyüleyici müzik sesi", "Pelin", "Arda"],
            correct: "Büyüleyici müzik sesi",
          },
          { words: ["Çınar", "Küçük metal kürek", "Selim"], correct: "Çınar" },
          {
            words: ["Çınar", "Küçük metal kürek", "Selim"],
            correct: "Küçük metal kürek",
          },
          { words: ["Çınar", "Küçük metal kürek", "Selim"], correct: "Selim" },
          {
            words: ["Oyuncağın içindeki piller", "Selim", "Elfe"],
            correct: "Oyuncağın içindeki piller",
          },
          {
            words: ["Oyuncağın içindeki piller", "Selim", "Elfe"],
            correct: "Elfe",
          },
          { words: ["Kerem", "Elfe", "Pelin"], correct: "Kerem" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Su Üstünde Renklerin Dansı",
          rules: [
            {
              name: "Geniş Su Teknesi ve Boya Damlaları",
              desc: "Kültür ve sanat haritasında 21. Sandık açıldığında, içi kitre adı verilen özel bir sıvıyla dolu kare şeklinde metal bir tekne resmi görülür; bu bizim geleneksel Ebru Sanatı'mızdır. Haritada bu teknenin içindeki suyun üzerinde rengarenk boyaların yüzdüğü somut olarak çizilmiştir.",
              example: "",
            },
            {
              name: "Gül Dalı Fırçalar ve Biz Çubuğu",
              desc: "Resimde teknenin kenarında duran, ucu at kılından yapılmış ve sapı somut olarak gül dalından olan özel fırçalar ile boyalara şekil veren ince metal bir biz çubuğu resmi yer alır. Sanatçı bu çubukla suyun üzerindeki boyaları hareket ettirerek harika çiçek ve lale resimleri oluşturur. En son suyun üzerine beyaz bir kağıt kapatılır ve su üzerindeki renkler kağıda somut olarak transfer edilir.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Ebru Sanatı Testi",
          desc: "Ebru sanatı ile ilgili soruların doğru cevabını bulunuz.",
          questions: [
            {
              id: 1,
              q: "İçi özel yoğun bir sıvıyla dolu tekne içinde, suyun üzerinde boyaların yüzdürülmesiyle yapılan geleneksel resim sanatımız hangisidir?",
              options: ["Çinicilik", "Ebru Sanatı", "Çömlekçilik"],
              correct: 1,
            },
            {
              id: 2,
              q: "Ebru sanatında boyaları suyun üzerine damlatmak için kullanılan fırçaların sapı hangi somut ağaç parçasından yapılır?",
              options: [
                "Plastik borulardan",
                "Gül dalından ve at kılından",
                "Demir çubuklardan",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Suyun üzerine damlatılan renkli boyalara şekil vermek, lale veya çiçek resmi çizmek için kullanılan ince metal çubuğun adı nedir?",
              options: ["Çekiç", "Biz çubuğu", "Pense"],
              correct: 1,
            },
            {
              id: 4,
              q: "Ebru sanatı resimlerinde suyun üzerindeki o renkli motiflerin kağıda aktarılması işlemi somut olarak nasıl yapılır?",
              options: [
                "Boyaları fırçayla kağıda sürerek",
                "Temiz beyaz bir kağıdı suyun üzerine yavaşça kapatıp geri çekerek",
                "Suyun içine kağıdı tamamen batırıp yıkayarak",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Ebru teknesinin içindeki suyun sıradan bir su olmayıp yoğun olması için içine eklenen bitkisel sıvının adı nedir?",
              options: ["Kitre", "Zeytinyağı", "Limon suyu"],
              correct: 0,
            },
            {
              id: 6,
              q: "Ebru sanatında kullanılan boyaların en büyük somut coğrafi özelliği aşağıdakilerden hangisidir?",
              options: [
                "Fabrikalarda yapılan plastik boyalar olması",
                "Doğadaki renkli taşlardan ve topraktan elde edilen tamamen doğal boyalar olması",
                "Sadece siyah renkte olması",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Haritada ebru kağıdının üzerinde en sık çizilen, kültürümüzün simgesi olan geleneksel çiçek resmi hangisidir?",
              options: [
                "Palmiye yaprağı",
                "Lale ve Gül motifleri",
                "Çöl çalısı",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Ebru sanatında yapılırken boyaların suyun dibine batmadan yüzmesinin sebebi nedir?",
              options: [
                "Boyaların çok ağır olması",
                "Öd adı verilen özel bir sıvı sayesinde boyaların su yüzeyinde dengede kalması",
                "Teknenin çok derin olması",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Bir çocuk ebru sanatı yapan bir ustayı izlediğinde bu sanatın hangi yönünü somut olarak anlar?",
              options: [
                "Çok aceleyle yapılan bir iş olduğunu",
                "Büyük bir sabır, dikkat, hayal gücü ve el becerisi gerektirdiğini",
                "Sadece suyla oynamak olduğunu",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Ebru sanatının haritadaki yeri düşünüldüğünde geçmişi hangi köklü devletimize kadar uzanan bir ata mirasıdır?",
              options: [
                "Osmanlı Devleti ve eski Türk kültürüne",
                "Fransa Krallığı'na",
                "Amerika Birleşik Devletleri'ne",
              ],
              correct: 0,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Ebru Sanatı Boşluk Doldurma",
          desc: "Ebru sanatı ile ilgili boşlukları doldurunuz.",
          questions: [
            {
              q: "Ebru sanatı, özel yoğun bir suyun üzerinde renklerin dans ettirildiği somut bir .................... sanatımızdır.",
              words: ["resim", "heykel"],
              correct: "resim",
            },
            {
              q: "Teknenin içindeki suyun yoğun olmasını sağlayan sihirli bitki sıvısına .................... adı verilir.",
              words: ["kitre", "süt"],
              correct: "kitre",
            },
            {
              q: "Ebru fırçalarının sapı, esnek ve sağlam olması için gerçek .................... dalından yapılır.",
              words: ["gül", "çam"],
              correct: "gül",
            },
            {
              q: "Boyaları su üzerinde incelterek onlara lale şekli veren metal çubuğa .................... çubuğu denir.",
              words: ["biz", "çivi"],
              correct: "biz",
            },
            {
              q: "Ebru sanatında kullanılan boyalar doğadaki renkli .................... ezilmesiyle hazırlanan doğal renklerdir.",
              words: ["topraklardan", "plastiklerden"],
              correct: "topraklardan",
            },
            {
              q: "Boyaların suyun üstünde batmadan yayılmasını sağlayan doğal malzemeye .................... adı verilir.",
              words: ["öd", "su"],
              correct: "öd",
            },
            {
              q: "Renklerin uyumu tamamlanınca teknenin üzerine temiz beyaz bir .................... kapatılır.",
              words: ["kağıt", "kumaş"],
              correct: "kağıt",
            },
            {
              q: "Kağıt yukarı doğru çekildiğinde suyun üzerindeki tüm desenler kağıda .................... olarak geçer.",
              words: ["eksiksiz", "silik"],
              correct: "eksiksiz",
            },
            {
              q: "Geleneksel ebru motifleri arasında en çok parıldayan çiçek şekli kırmızı .................... simgesidir.",
              words: ["lale", "papatya"],
              correct: "lale",
            },
            {
              q: "Bu sanat, Türk kültürünün estetik ve zarafet dünyasını gösteren büyük bir .................... mirasıdır.",
              words: ["ata", "yabancı"],
              correct: "ata",
            },
          ],
        },
      },
    },
  },
  "22": {
    story: {
      title: "SİHİRLİ KEMAN",
      theme: "İleriye Geçiş / Sanat Sevgisi",
      text: "Arda, hafta sonu babasıyla birlikte çarşıdaki eski bir müzik mağazasının önünde durdu. Mağazanın camından içeride duran telli çalgıları, parlak gitarları ve büyük davulları hayranlıkla izledi. Tam o sırada mağazanın kapısından dışarıya doğru büyüleyici bir müzik sesi yayıldı. İçerideki bir müzisyen, parlak kahverengi bir kemanın tellerine yayı yavaşça sürterek çalıyordu. Kemanın somut sesi Arda'nın kulaklarına ulaştığı an çocuk gözlerini hafifçe kapattı. Bu tatlı ses, Arda'nın zihninde birden rengarenk resimlerin canlanmasına neden oldu. Kendini gökyüzünde uçuşan renkli kuşların ve pembe bulutların arasında geziyor gibi hayal etti. Müziğin sesinin nasıl bu kadar renkli bir hayale dönüştürdüğüne hayret etti. Sanatın bu sihirli gücü Arda'nın kalbini sıcacık yaptı. Babasının elini tutarak bir gün o da keman çalabilmenin hayalini kurmaya başladı.",
      questions: [
        {
          id: 1,
          q: "Arda ve babası nerede durdular?",
          options: [
            "Büyük bir oyuncakçı dükkanının önünde",
            "Eski bir müzik mağazasının önünde",
            "Okulun kütüphanesinin girişinde",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Arda mağazanın camından neleri izledi?",
          options: [
            "Telli çalgıları, parlak gitarları ve büyük davulları",
            "Renkli defterleri ve parlak boya kalemlerini",
            "Elektronik robotları ve uzay gemilerini",
          ],
          correct: 0,
        },
        {
          id: 3,
          q: "Mağazanın içindeki müzisyen hangi enstrümanı çalıyordu?",
          options: [
            "Büyük siyah bir piyanoyu",
            "Parlak kahverengi bir kemanı",
            "Uzun ahşap bir flütü",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Müzisyen kemanı çalmak için yayın tellerini nasıl hareket ettiriyordu?",
          options: [
            "Telleri eliyle sertçe çekiyordu",
            "Yayı tellere yavaşça sürterek çalıyordu",
            "Kemanın gövdesine parmaklarıyla vuruyordu",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Kemanın sesini duyan Arda gözlerini ne yaptı?",
          options: [
            "Korkuyla sımsıkı kapattı",
            "Hafifçe kapattı",
            "Kocaman açarak etrafa baktı",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Müzik sesi Arda'nın zihninde neye neden oldu?",
          options: [
            "Okul ödevlerini hatırlamasına",
            "Rengarenk soyut resimlerin canlanmasına",
            "Uykusunun gelmesine",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Arda kendini hayalinde nerede geziyor gibi hissetti?",
          options: [
            "Derin bir okyanusun altındaki balıkların arasında",
            "Gökyüzündeki renkli kuşların ve pembe bulutların arasında",
            "Yüksek karlı dağların en tepesinde",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Hikayenin sonunda Arda neyin hayalini kurmaya başladı?",
          options: [
            "Mağazadaki davulu satın almanın",
            "Bir gün kendisinin de keman çalabilmesinin",
            "Babasıyla birlikte lunaparka gitmenin",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🎭 Kelimelerin Gizli Dünyası!",
        rules: [
          {
            name: "Gerçek Anlam",
            desc: "Bir kelimeyi duyduğumuzda aklımıza gelen ilk, sıradan ve somut anlamıdır.",
            example: "Kemanın tellerine yayı sürerek çaldı.",
          },
          {
            name: "Mecaz Anlam",
            desc: "Kelimenin gerçek anlamından tamamen uzaklaşarak kazandığı yeni ve soyut anlamdır. Genellikle duyguları ve durumları anlatır.",
            example:
              "Kerem ile Elfe arasında harika bir dostluk köprüsü kuruldu. (Soyut bağ)",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Maskeyi Kaldır",
        desc: "Cümlelerde altı çizili olan kelimelerin gerçek anlamda mı yoksa mecaz anlamda mı kullanıldığını eşleştiriniz.",
        questions: [
          {
            id: 1,
            q: '"Mağazadaki kemanın telleri çok parlaktı." cümlesindeki tel kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Sanatın bu sihirli gücü Arda\'nın kalbini sıcacık yaptı." cümlesindeki sıcacık kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 1,
          },
          {
            id: 3,
            q: '"Kavanozun içine beyaz, temiz süt doldurdu." cümlesindeki süt kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 0,
          },
          {
            id: 4,
            q: '"Arkadaşının bu kaba sözlerine çok kırıldı." cümlesindeki kaba kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 1,
          },
          {
            id: 5,
            q: '"Bahçedeki kuru odunları büyük bir kutuya topladı." cümlesindeki kuru kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Matematik sınavından yüksek puan alınca sevinçten uçtu." cümlesindeki uçtu kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 1,
          },
          {
            id: 7,
            q: '"Eren çekmeceyi sabitlemek için küçük metal bir çivi aradı." cümlesindeki çivi kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Sınıfa yeni gelen arkadaşına çok sıcak davrandı." cümlesindeki sıcak kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 1,
          },
          {
            id: 9,
            q: '"Balkondaki kahverengi saksının toprağı tamamen kurumuş." cümlesindeki kurumuş kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Bu felsefi öyküyü okuyunca kafasında yeni ışıklar yandı." cümlesindeki ışıklar kelimesi',
            options: ["Gerçek Anlam", "Mecaz Anlam"],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Hangisi Mecaz?",
        desc: "Seçeneklerde verilen cümlelerden, mecaz anlamlı bir kelime barındıran seçeneği bulunuz.",
        questions: [
          {
            words: [
              "Mutfaktaki ahşap masayı bezle sildi.",
              "Bu keskin koku hepimizin burnunu sızlattı.",
              "Kırtasiyeden yeni bir kurşun kalem aldı.",
            ],
            correct: "Bu keskin koku hepimizin burnunu sızlattı.",
          },
          {
            words: [
              "Çantasındaki renkli boyama kitabını sıraya açtı.",
              "Öğretmenimizin okuduğu öykü derin düşüncelere yol açtı.",
              "Bahçedeki çınar ağacının gölgesinde oturduk.",
            ],
            correct: "Öğretmenimizin okuduğu öykü derin düşüncelere yol açtı.",
          },
          {
            words: [
              "Annem sabah buzdolabından soğuk süt çıkardı.",
              "Bize çok soğuk davranınca hepimiz biraz üzüldük.",
              "Dışarıda dondurucu bir kış rüzgarı esiyordu.",
            ],
            correct: "Bize çok soğuk davranınca hepimiz biraz üzüldük.",
          },
          {
            words: [
              "Toprağı kazarken yuvarlak metal bir nesne buldu.",
              "Sinan'ın boğazındaki acı akşama doğru hafifçe azaldı.",
              "Ağır adımlarla merdivenleri yukarı doğru tırmandı.",
            ],
            correct: "Sinan'ın boğazındaki acı akşama doğru hafifçe azaldı.",
          },
          {
            words: [
              "Kendi odasının kahramanı olmaya karar verdi.",
              "Bu ağır poşetleri merdivenden tek başına çıkardı.",
              "Söylediği ağır sözler yüzünden arkadaşı çok üzüldü.",
            ],
            correct: "Söylediği ağır sözler yüzünden arkadaşı çok üzüldü.",
          },
          {
            words: [
              "Kitabın sararmış eski sayfalarını büyüteçle inceledi.",
              "Sınavı kazandığını duyunca gözleri sevinçle parladı.",
              "Mağazanın camından içerideki parlak gitarlara baktı.",
            ],
            correct: "Sınavı kazandığını duyunca gözleri sevinçle parladı.",
          },
          {
            words: [
              "Çekmecedeki metal ataçları büküp tel yaptı.",
              "İki çocuk hiç konuşmadan resim boyayarak anlaştı.",
              "O kadar ince bir insandı ki herkes onu çok severdi.",
            ],
            correct: "O kadar ince bir insandı ki herkes onu çok severdi.",
          },
          {
            words: [
              "Bahçedeki yaşlı meşe ağacının kabuğu çok sertti.",
              "Yeni gelen çocuğun kalbini kırmamak için sustu.",
              "Plastik mavi oyuncak kutusunu halının ortasına çekti.",
            ],
            correct: "Yeni gelen çocuğun kalbini kırmamak için sustu.",
          },
          {
            words: [
              "Akşam olunca tarladaki ayçiçekleri başını eğdi.",
              "Sorduğu soruyla sınıftaki bütün dikkatleri üzerine çekti.",
              "Yaya geçidinin önünde durup yeşil ışığı bekledi.",
            ],
            correct:
              "Sorduğu soruyla sınıftaki bütün dikkatleri üzerine çekti.",
          },
          {
            words: [
              "Karanlık odada elektrik düğmesini arayıp buldu.",
              "Kirli suyu lavabonun deliğinden aşağıya döktü.",
              "Bu karanlık işlerin arkasında kimin olduğunu anlamadı.",
            ],
            correct: "Bu karanlık işlerin arkasında kimin olduğunu anlamadı.",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Toprağa Hayat Veren El Sanatlarımız",
          rules: [
            {
              name: "Dönen Çömlek Tekerleği ve Çamur",
              desc: "El sanatları haritasında 22. Sandık'ta, kendi etrafında hızla dönen ahşap bir tekerlek ve üzerinde nemli gri çamur resmi görülür; bu bizim geleneksel Çömlekçilik sanatımızdır. Sanatçının elleriyle bu dönen çamura dokunarak onu somut bir testiye, vazoya veya çorba kasesine dönüştürme resmi çizilmiştir.",
              example: "",
            },
            {
              name: "Mavi Beyaz Çini Simgeleri",
              desc: "Sayfanın diğer yanında, fırınlarda pişirilmiş sert beyaz tabaklar ve duvar taşları yer alır; bunlar sarayları süsleyen ünlü Çini motifleridir. Çinilerin üzerinde mavi, lacivert ve kırmızı renklerle boyanmış geleneksel lale ve yaprak resimleri bulunur. Haritada bu sanatın merkezi olan Kütahya ve İznik şehirleri parlak yıldızlarla işaretlenmiştir.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Çini ve Çömlek Testi",
          desc: "Çini ve çömlekçilik ile ilgili soruların doğru cevabını bulunuz.",
          questions: [
            {
              id: 1,
              q: "Nemli kırmızı veya gri toprağın (çamurun) dönen bir tekerlek üzerinde el yardımıyla şekillendirilerek testi ve vazo yapılması sanatına ne ad verilir?",
              options: ["Ebru Sanatı", "Çömlekçilik", "Resim Sanatı"],
              correct: 1,
            },
            {
              id: 2,
              q: "Pişirilmiş topraktan yapılan tabak, kase veya duvar fayanslarının üzerinin renkli motiflerle süslenmesiyle oluşan geleneksel sanatımız hangisidir?",
              options: ["Çinicilik", "Halıcılık", "Bakırcılık"],
              correct: 0,
            },
            {
              id: 3,
              q: "Haritada çini sanatının dünyaca ünlü iki büyük üretim merkezi olan, yıldızla işaretlenmiş şehirlerimiz hangileridir?",
              options: [
                "Ankara - İstanbul",
                "Kütahya - İznik",
                "Antalya - İzmir",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: "Çömlekçilik sanatında çamura şekil vermek için kullanılan, ayakla veya motorla dönen somut aletin adı nedir?",
              options: [
                "Çömlekçi çarkı (tekerleği)",
                "Demir çekiç",
                "Dokuma tezgahı",
              ],
              correct: 0,
            },
            {
              id: 5,
              q: "Çini ve çömleklerin yapıldıktan sonra kırılmaması, sert ve taş gibi dayanıklı olması için hangi somut işlemden geçirilmesi şarttır?",
              options: [
                "Su dolu kovada bekletilmesi",
                "Yüksek ateşli özel fırınlarda pişirilmesi",
                "Güneyde kurutulup boyanması",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Geleneksel çini desenlerinde tarihi camilerin ve eski sarayların duvarlarını süsleyen en belirgin renkler hangileridir?",
              options: [
                "Siyah ve gri tonları",
                "Turkuaz, mavi, lacivert ve parlak kırmızı",
                "Sarı ve mor karışımı",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Toprağa şekil veren çömlek ustalarının en büyük somut hammaddesi aşağıdakilerden hangisidir?",
              options: [
                "Plastik hamurlar",
                "Suyla karıştırılarak yumuşatılmış özel killi toprak (çamur)",
                "Demir tozları",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Tarihi çini tabakların üzerindeki o parıltılı cam gibi parlak tabakaya ne ad verilir?",
              options: ["Sır (Cam kaplama)", "Boya kutusu", "Çamur lekesi"],
              correct: 0,
            },
            {
              id: 9,
              q: "Çömlekten yapılan testilerin geçmişte evlerde kullanılmasının en büyük somut faydası neydi?",
              options: [
                "Suyu çok hızlı ısıtması",
                "İçindeki suyu doğal olarak serin ve taze tutması",
                "Suyu tamamen kurutması",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir çocuk çini desenlerini incelediğinde bu el sanatının kültürümüzdeki yeri hakkında neyi anlar?",
              options: [
                "Sadece duvarları kapatmak için yapıldığını",
                "Türk milletinin köklü geçmişini, estetik anlayışini ve saray mimarisinin zenginliğini",
                "Çok kolay ve zahmetsiz olduğunu",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Toprak Sanatı Doğrulaması",
          desc: "Çini ve çömlekçilik ile ilgili ifadelerin doğru mu yanlış mı olduğunu belirtiniz.",
          questions: [
            {
              q: "Çömlekçilik, killi çamurun çark üzerinde el ile şekillendirilmesiyle yapılan somut bir ata sanatıdır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Çini sanatının en önemli ve en renkli somut merkezlerinden biri Kütahya şehrimizdir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Çömlekten yapılan vazolar ve testiler fırına atılmadan doğrudan buzdolabına konur.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Çini motifleri arasında mavi renkli lale ve geleneksel yaprak çizimleri geniş yer tutar.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Çömlekçilik yapmak için sadece deniz kenarındaki beyaz sahil kumları kullanılır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: 'Çinilerin üzerindeki o cam gibi parıldayan koruyucu tabakaya coğrafyada "Sır" adı verilir.',
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Çini sanatı sadece eski köylerde yapılmış, büyük padişah saraylarında hiç kullanılmamıştır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Çömlek ustası, ayaklarıyla çarkı döndürürken elleriyle çamura pürüzsüz şekiller verir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Çiniler fırından çıktıktan sonra üzerindeki renkler tamamen silinir ve sapsarı kalır.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Toprağa can veren bu iki el sanatı, kültürümüzün el emeğine verdiği değeri somut olarak gösterir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
          ],
        },
      },
    },
  },
  "23": {
    story: {
      title: "TOPRAKTAN ÇIKAN SAAT",
      theme: "İleriye Geçiş / Tarih Merakı",
      text: "Çınar, hafta içi güneşli bir günde dedesiyle birlikte arka bahçedeki toprağı kazıyordu. Amaçları, bahçedeki küçük saksılara dikmek üzere yeni çiçek tohumları için yer açmaktı. Çınar'ın elindeki küçük metal kürek sert bir şeye çarptı ve 'tık' diye bir ses çıktı. Çınar toprağı elleriyle dikkatlice kazıyınca yuvarlak, paslanmış metal bir nesne buldu. Üzerindeki çamurları temizlediğinde bunun eski bir köstekli saat olduğunu fark etti. Saatin camı çatlamıştı ama içindeki siyah akrep ve yelkovan halen olarak görülebiliyordu. Çınar avucundaki bu eski saate bakarak derin bir düşünceye daldı. 'Zaman eskiden nasıl akıyordu? Bu saate yüz yıl önce kim bakmıştı?' diye kendi kendine sordu. Geçmiş zamanın kokusunu bu küçük metal nesnede hissetmek onu çok heyecanlandırdı. Dedesi saati alıp parlatacağını söyleyince Çınar tarihin gizemli dünyasını daha çok merak etmeye başladı.",
      questions: [
        {
          id: 1,
          q: "Çınar ve dedesi bahçede ne yapıyorlardı?",
          options: [
            "Büyük ağaçların dallarını kesiyorlardı",
            "Bahçedeki toprağı kazıyorlardı",
            "Oyuncak arabaları için yol yapıyorlardı",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Çınar ve dedesinin toprağı kazmaktaki amaçları neydi?",
          options: [
            "Çiçek tohumları dikmek için yer açmak",
            "Kayayı aramak",
            "Bahçedeki çöpleri temizlemek",
          ],
          correct: 0,
        },
        {
          id: 3,
          q: "Çınar'ın elindeki küçük metal kürek neye çarptı?",
          options: [
            "Büyük bir kaya parçasına",
            "Sert bir şeye",
            "Ağacın kalın köküne",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Çınar toprağı elleriyle kazınca ne buldu?",
          options: [
            "Yuvarlak, paslanmış metal bir nesne",
            "Demir bir kutu kapısı",
            "Eski bir madeni para",
          ],
          correct: 0,
        },
        {
          id: 5,
          q: "Çınar'amurları temizlenen nesnenin ne olduğu anlaşıldı?",
          options: [
            "Eski bir pusula",
            "Eski bir köstekli saat",
            "Küçük bir el aynası",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Saatin içindeki hangi parçalar halen somut olarak görülebiliyordu?",
          options: [
            "İçindeki küçük parlak çarklar",
            "Siyah akrep ve yelkovan",
            "Arkasındaki gümüş zincir",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Çınar saate bakarken neyi sorgulamaya başladı?",
          options: [
            "Saatin ne kadar para edeceğini",
            "Zamanın eskiden nasıl aktığını ve saate kimin baktığını",
            "Bahçeye daha kaç tane çiçek dikeceklerini",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Dedesi saatle ilgili ne yapacağını söyledi?",
          options: [
            "Onu çöpe atacağını",
            "Parlatacağını",
            "Saati Çınar'ın odasına asacağını",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🏠 İsmin Beş Farklı Odası!",
        rules: [
          {
            name: "Yalın Hali",
            desc: "Hiçbir durum eki almamış sıradan isimdir.",
            example: "bahçe, çekiç, saat",
          },
          {
            name: "Belirtme Hali (-i)",
            desc: "Kelimenin sonuna -i, -ı, -u, -ü gelir.",
            example: "saati buldu",
          },
          {
            name: "Yönelme Hali (-e)",
            desc: "Bir yere doğru gitmeyi anlatır, sonuna -e, -a gelir.",
            example: "bahçeye gitti",
          },
          {
            name: "Bulunma Hali (-de)",
            desc: "Bir yerde durduğunu anlatır, sonuna -de, -da, -te, -ta gelir.",
            example: "bahçede oynadı",
          },
          {
            name: "Ayrılma Hali (-den)",
            desc: "Bir yerden çıkıp gitmeyi anlatır, sonuna -den, -dan, -ten, -tan gelir.",
            example: "bahçeden çıktı",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Durumunu Seç",
        desc: "Cümlelerde altı çizili isimlerin adın hangi durumunda (halinde) olduğunu doğru şıktan bulunuz.",
        questions: [
          {
            id: 1,
            q: '"Çınar güneşli bir günde dedesiyle arka bahçede toprağı kazıyordu." cümlesindeki bahçede kelimesi',
            options: [
              "Yönelme Hali (-e)",
              "Bulunma Hali (-de)",
              "Ayrılma Hali (-den)",
            ],
            correct: 1,
          },
          {
            id: 2,
            q: '"Çekmeceyi düzeltmek için odaya gitti." cümlesindeki odaya kelimesi hangisidir?',
            options: ["Yalın Hali", "Yönelme Hali (-e)", "Bulunma Hali (-de)"],
            correct: 1,
          },
          {
            id: 3,
            q: '"Çınar çamurları temizleyince eski köstekli saati hayretle fark etti." cümlesindeki saati kelimesi',
            options: ["Belirtme Hali (-i)", "Bulunma Hali (-de)", "Yalın Hali"],
            correct: 0,
          },
          {
            id: 4,
            q: '"Kutusunun en altına bakmasına rağmen aradığı çiviyi bulamadı." cümlesindeki çiviyi kelimesi',
            options: [
              "Belirtme Hali (-i)",
              "Ayrılma Hali (-den)",
              "Yalın Hali",
            ],
            correct: 0,
          },
          {
            id: 5,
            q: '"Eren, babasının eski alet kutusundan vidaları tek tek çıkardı." cümlesindeki kutusundan kelimesi',
            options: [
              "Yönelme Hali (-e)",
              "Bulunma Hali (-de)",
              "Ayrılma Hali (-den)",
            ],
            correct: 2,
          },
          {
            id: 6,
            q: '"Küçük metal kürek toprağın altındaki sert bir taşa çarptı." cümlesindeki taşa kelimesi',
            options: ["Yönelme Hali (-e)", "Bulunma Hali (-de)", "Yalın Hali"],
            correct: 0,
          },
          {
            id: 7,
            q: '"Eda ve Kaan güneşli bir hafta sonu mahalledeki çocuk parkına gittiler." cümlesindeki parkına kelimesi',
            options: [
              "Yönelme Hali (-e)",
              "Bulunma Hali (-de)",
              "Ayrılma Hali (-den)",
            ],
            correct: 0,
          },
          {
            id: 8,
            q: '"Kaan koşarak evdeki atölyeden renkli boya kutularını getirdi." cümlesindeki atölyeden kelimesi',
            options: [
              "Belirtme Hali (-i)",
              "Bulunma Hali (-de)",
              "Ayrılma Hali (-den)",
            ],
            correct: 2,
          },
          {
            id: 9,
            q: '"Masanın üzerinde duran ataçlar Eren’in dikkatini hemen çekti." cümlesindeki ataçlar kelimesi',
            options: ["Yalın Hali", "Belirtme Hali (-i)", "Bulunma Hali (-de)"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Sinan salı sabahı uyandığında boğazında somut bir acı hissetti." cümlesindeki boğazında kelimesi',
            options: [
              "Yönelme Hali (-e)",
              "Bulunma Hali (-de)",
              "Ayrılma Hali (-den)",
            ],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Odaya Yerleştir",
        desc: "Verilen kelimelerin sonuna cümle anlamına uygun doğru hal ekini bularak yerleştiriniz.",
        questions: [
          { words: ["odasına", "odada", "odadan"], correct: "odasına" },
          { words: ["balkonda", "balkona", "balkondan"], correct: "balkonda" },
          { words: ["çimde", "çime", "çimden"], correct: "çimde" },
          { words: ["odasına", "odada", "odadan"], correct: "odasına" },
          { words: ["Bey'e", "Bey'i", "Bey'de"], correct: "Bey'e" },
          {
            words: ["apartmandan", "apartmanda", "apartmana"],
            correct: "apartmandan",
          },
          {
            words: ["merdivende", "merdivene", "merdivenden"],
            correct: "merdivende",
          },
          { words: ["Selim'e", "Selim'i", "Selim'de"], correct: "Selim'e" },
          { words: ["kapının", "kapıyı", "kapıda"], correct: "kapının" },
          { words: ["alanda", "alana", "alandan"], correct: "alanda" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: El Ele Tutuşan Bölgeler: Halk Danslarımız",
          rules: [
            {
              name: "Horon Tepen Çocuklar",
              desc: "Kültür haritasının dans bölümünde, Karadeniz şeridi üzerinde yan yana dizilmiş, ellerini gökyüzüne doğru kaldırıp ayaklarını hızlıca yere vuran insan figürleri görülür; bu coğrafyamızın hızlı halk oyunu olan Horon'dur. Yanlarında kemençe çalan bir müzisyen resmi yer alır.",
              example: "",
            },
            {
              name: "Zeybek ve Halay Logoları",
              desc: "Haritanın solunda (Ege'de) kollarını dev bir kartal gibi iki yana açarak dizini sertçe yere vuran tekli yiğit figürleri çizilidir; bu Zeybek oyunudur. Haritanın orta ve sağ kısımlarında ise parmak parmağa tutuşarak uzun bir kuyruk oluşturan, davul zurna eşliğinde oynayan kalabalık gruplar yer alır; bu da Anadolu'nun kalbi olan Halay'dır. Bu görsel simgeler bölgelerimizin neşesini ve birliğini yansıtır.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Halk Dansları Testi",
          desc: "Halk dansları ile ilgili soruların doğru cevabını bulunuz.",
          questions: [
            {
              id: 1,
              q: "Karadeniz kıyısında, kemençe müziği eşliğinde elleri yukarı kaldırıp zincir oluşturarak hızlıca oynanan halk oyunumuz hangisidir?",
              options: ["Zeybek", "Horon", "Halay"],
              correct: 1,
            },
            {
              id: 2,
              q: "Ege Bölgesi haritasında, kolların kartal kanadı gibi açılıp dizlerin yere sertçe vurulmasıyla oynanan yiğitlik oyunu hangisidir?",
              options: ["Horon", "Zeybek", "Bar"],
              correct: 1,
            },
            {
              id: 3,
              q: "Anadolu'nun iç ve doğu kesimlerinde, davul zurna eşliğinde parmak parmağa tutuşarak grup halinde oynanan oyun hangisidir?",
              options: ["Halay", "Zeybek", "Vals"],
              correct: 0,
            },
            {
              id: 4,
              q: "Kıyı haritasında horon oynayan figürlerin hemen yanında hangi somut telli/yaylı müzik aletinin resmi çizilidir?",
              options: ["Bağlama", "Kemençe", "Davul"],
              correct: 1,
            },
            {
              id: 5,
              q: "Halay çekilirken grubun en başında duran ve elindeki renkli mendili havada sallayan kişiye ne ad verilir?",
              options: ["Davulcu", "Halay başı", "Hakem"],
              correct: 1,
            },
            {
              id: 6,
              q: "Zeybek dansı figürleri incelendiğinde bu oyun temel olarak hangi duyguyu somut olarak betimler?",
              options: [
                "Korku ve çekingenliği",
                "Yiğitliği, cesareti, mertliği ve gururlu bir duruşu",
                "Sadece üzüntüyü",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Halk oyunları oynanırken giyilen, üzerleri gümüş işlemeli, renkli yelekleri olan geleneksel kıyafetlere ne ad verilir?",
              options: [
                "Okul üniforması",
                "Yöresel kostüm (Halk oyunları kıyafeti)",
                "Spor forması",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Davul ve zurnanın sesi haritada en çok hangi halk oyunumuzun kalabalık insan çizgileriyle birleşir?",
              options: ["Zeybek", "Halay", "Bale"],
              correct: 1,
            },
            {
              id: 9,
              q: "Bölgelerimizin halk oyunlarının ritimlerinin (hızlarının) farklı olması ne ile doğrudan ilgilidir?",
              options: [
                "Şehirlerin büyüklüğüyle",
                "O bölgenin coğrafi yapısı, insan karakteri ve kültürel yaşam tarzıyla",
                "Oyuncuların boylarıyla",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir düğünde veya bayramda insanların el ele tutuşup halk oyunları oynaması toplumda neyi güçlendirir?",
              options: [
                "İnsanların birbirinden uzaklaşmasını",
                "Birlik, beraberlik, ortak neşe ve dayanışma duygusunu",
                "Sadece yorulmayı",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Dans Alanı Eşleştirmesi",
          desc: "Halk dansları ile ilgili boşlukları doldurunuz.",
          questions: [
            {
              q: "Karadeniz haritası üzerinde hızlı hareketlerle oynayan çocukların oyunu .................... olarak bilinir.",
              words: ["Horon", "Zeybek"],
              correct: "Horon",
            },
            {
              q: "Ege'nin dağlarını ve yiğitliğini simgeleyen kartal kanatlı oyun .................... oyunudur.",
              words: ["Zeybek", "Halay"],
              correct: "Zeybek",
            },
            {
              q: "Davul zurna çalınırken halay çeken grubun liderine .................... başı adı verilir.",
              words: ["halay", "oyun"],
              correct: "halay",
            },
            {
              q: "Horon oynayan ekibin hızlanmasını sağlayan küçük yaylı çalgı .................... olarak çizilmiştir.",
              words: ["kemençe", "gitar"],
              correct: "kemençe",
            },
            {
              q: "Anadolu'da parmakların kenetlenerek çekildiği kalabalık sıra oyununa .................... denir.",
              words: ["halay", "horon"],
              correct: "halay",
            },
            {
              q: "Zeybek oynayan efe figürlerinin başındaki püsküllü şapkayı andıran başlığa .................... denir.",
              words: ["fes / fesli başlık", "kask"],
              correct: "fes / fesli başlık",
            },
            {
              q: 'Karadeniz\'de horon tepilirken usta oyuncular aniden "...................." diye bağırarak birlikte aşağı eğilirler.',
              words: ["İhsa / Ala", "Dur"],
              correct: "İhsa / Ala",
            },
            {
              q: "Halk oyunları oynamak için giyilen gümüş nakışlı parlak giysilere .................... kostüm denir.",
              words: ["yöresel", "modern"],
              correct: "yöresel",
            },
            {
              q: "Haritadaki düğün resimlerinde halay çekenlerin elinde sallanan somut nesne renkli bir .................... olarak görünür.",
              words: ["mendildir", "kalendir"],
              correct: "mendildir",
            },
            {
              q: "Bu danslar, Türk milletinin neşesini ve el ele tutuşma gücünü gösteren kültürel .................... ögelerimizdir.",
              words: ["zenginlik", "yük"],
              correct: "zenginlik",
            },
          ],
        },
      },
    },
  },
  "24": {
    story: {
      title: "GÜNEŞ ENERJİLİ OYUNCAK",
      theme: "İleriye Geçiş / İcat ve Bilim",
      text: "Selim, pazar günü en sevdiği mavi yarış arabasıyla oynamak için odasındaki halının üzerine oturdu. Arabanın kumandasına bastı ama tekerlekler hiç dönmedi çünkü oyuncağın içindeki piller tamamen bitmişti. Evde hiç yeni pil kalmadığı için Selim arabasıyla oynayamayacağını düşünüp üzüldü. O sırada babası yanına geldi. Elinde küçük, parlak, siyah bir plaka tutuyordu. Bu plaka, güneş ışığını elektrik enerjisine çeviren somut bir mini güneş paneliydi. Babasıyla birlikte arabanın tavanındaki plastik bölmeye bu paneli ince tellerle dikkatlice bağladılar. Ardından arabayı doğrudan güneş alan parlak balkondaki mermerin üzerine bıraktılar. Araba, güneş ışığını aldığı an pilsiz bir şekilde birden kendi kendine hızlıca hareket etmeye başladı. Selim hayretle arabanın peşinden koştu ve doğadaki temiz enerjinin gücünü keşfetti. Piller olmadan da güneşin gücüyle oyuncakların çalışabileceğini görmek ona yeni icatlar yapma ilhamı verdi.",
      questions: [
        {
          id: 1,
          q: "Selim'in en sevdiği oyuncak araba ne renkliydi?",
          options: ["Kırmızı", "Mavi", "Yeşil"],
          correct: 1,
        },
        {
          id: 2,
          q: "Oyuncak araba kumandaya basılmasına rağmen neden çalışmadı?",
          options: [
            "Tekerleği kırıldığı için",
            "İçindeki piller tamamen bittiği için",
            "Kumandası suya düştüğü için",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "Babasının elinde getirdiği parlak siyah plaka neydi?",
          options: [
            "Yeni bir şarj cihazı",
            "Mini bir güneş paneli",
            "Demir bir oyuncak parçası",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Güneş paneli ne işe yarıyordu?",
          options: [
            "Arabanın daha parlak görünmesini sağlıyordu",
            "Güneş ışığını elektrik enerjisine çeviriyordu",
            "Arabanın ses çıkarmasını sağlıyordu",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Paneli arabanın neresine tellerle bağladılar?",
          options: [
            "Arabanın tavanındaki plastik bölmeye",
            "Ön tekerleklerin hemen arkasına",
            "Kumandanın içine",
          ],
          correct: 0,
        },
        {
          id: 6,
          q: "Hazırlıkları arabayı çalışması için nereye bıraktılar?",
          options: [
            "Odadaki masanın çekmecesine",
            "Doğrudan güneş alan parlak balkondaki mermerin üzerine",
            "Banyodaki lavabonun kenarına",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Araba güneş ışığını alınca nasıl bir tepki verdi?",
          options: [
            "Pilsiz bir şekilde birden kendi kendine hareket etmeye başladı",
            "Yüksek sesle müzik çalmaya başladı",
            "Paneli tavanından aşağıya düştü",
          ],
          correct: 0,
        },
        {
          id: 8,
          q: "Selim bu deneyim sayesinde neyi keşfetti ve ne ilhamı aldı?",
          options: [
            "Oyuncakların pilsiz asla çalışamayacağını",
            "Doğadaki temiz enerjinin gücünü keşfetti ve icat yapma ilhamı aldı",
            "Balkonda oyun oynamanın tehlikeli olduğunu",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🗣️ Atalarımızın ve Dilimizin Hazinesi!",
        rules: [
          {
            name: "Deyimler",
            desc: "Genellikle anlık durumları, duyguları daha etkili anlatmak için kullanılan mecaz anlamlı kalıplardır.",
            example: "gözlerine inanamamak, kalbi çarpmak.",
          },
          {
            name: "Atasözleri",
            desc: "Geçmişteki uzun deneyimlere dayanarak bize öğüt veren, ders çıkaran kısa ve bilgece cümlelerdir.",
            example: "Damlaya damlaya göl olur.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Deyim mi Atasözü mü?",
        desc: "Verilen kalıplaşmış ifadelerin deyim mi yoksa atasözü mü olduğunu kutularla eşleştiriniz.",
        questions: [
          {
            id: 1,
            q: '"Gözlerine inanamamak" ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Birlikten kuvvet doğar." ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 1,
          },
          {
            id: 3,
            q: '"Kalbi yerinden çıkacak gibi olmak" ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 0,
          },
          {
            id: 4,
            q: '"Damlaya damlaya göl olur." ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 1,
          },
          {
            id: 5,
            q: '"Kulak kabartmak" ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Ağaç yaşken eğilir." ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 1,
          },
          {
            id: 7,
            q: '"Göğsü kabarmak" ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Sakla samanı, gelir zamanı." ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 1,
          },
          {
            id: 9,
            q: '"Can kulağıyla dinlemek" ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Bugünün işini yarına bırakma." ifadesi',
            options: ["Deyim", "Atasözü"],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Anlamını Bul",
        desc: "Cümlelerde geçen deyimlerin somut anlam karşılıklarını seçeneklerden bulunuz.",
        questions: [
          {
            words: [
              "Çok fazla uykusu gelmek",
              "Aşırı derecede şaşırmak",
              "Gözlerini sımsıkı kapatmak",
            ],
            correct: "Aşırı derecede şaşırmak",
          },
          {
            words: [
              "Hemen uykuya dalmak",
              "Bir şeyi çok detaylı ve uzun süre düşünmek",
              "Bahçedeki çukura düşmek",
            ],
            correct: "Bir şeyi çok detaylı ve uzun süre düşünmek",
          },
          {
            words: [
              "Kulaklarını elleriyle kapatmak",
              "Çok büyük bir dikkatle ve özenle dinlemek",
              "Sessizce şarkı mırıldanmak",
            ],
            correct: "Çok büyük bir dikkatle ve özenle dinlemek",
          },
          {
            words: [
              "Saçını taramak",
              "Sevgi ve şefkat göstermek, ödüllendirmek",
              "Sınıftan dışarı çıkarmak",
            ],
            correct: "Sevgi ve şefkat göstermek, ödüllendirmek",
          },
          {
            words: [
              "Çok fazla acıkmak",
              "Hayranlıktan büyük bir şaşkınlık yaşamak",
              "Esnemeye başlamak",
            ],
            correct: "Hayranlıktan büyük bir şaşkınlık yaşamak",
          },
          {
            words: [
              "Karnının çok ağrıması",
              "Birinin durumuna çok üzülmek, merhamet etmek",
              "Bahçede hızlıca koşmak",
            ],
            correct: "Birinin durumuna çok üzülmek, merhamet etmek",
          },
          {
            words: [
              "Çok fazla yorulup nefes alamamak",
              "Büyük bir gurur ve mutluluk duymak",
              "Göl kenarından uzaklaşmak",
            ],
            correct: "Büyük bir gurur ve mutluluk duymak",
          },
          {
            words: [
              "Korkup babasını çağırmayı",
              "Bir işi başarabileceğine somut olarak inanmayı",
              "Oyun oynamaktan sıkılmayı",
            ],
            correct: "Bir işi başarabileceğine somut olarak inanmayı",
          },
          {
            words: [
              "Yeniden hastalanmak",
              "Mutsuzluğu bitip neşelenmek, rahatlamak",
              "Odasında uykuya dalmak",
            ],
            correct: "Mutsuzluğu bitip neşelenmek, rahatlamak",
          },
          {
            words: [
              "İstediği, umduğu parlak hazineyi bulamayıp üzülmeyi",
              "Sandığın içinde altın bulup sevinmeyi",
              "Ahşap dolapları temizlemekten vazgeçmeyi",
            ],
            correct: "İstediği, umduğu parlak hazineyi bulamayıp üzülmeyi",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Karagöz ile Hacivat ve Orta Oyunu",
          rules: [
            {
              name: "Gölge Perdesi ve İki Çubuklu Kukla",
              desc: "Geleneksel tiyatro şablonunda, arkasından beyaz bir ışık sızan kumaş bir perde resmi görülür; bu bizim ünlü Karagöz ve Hacivat gölge oyunumuzdur. Perdenin üzerinde, arkadan çubuklarla hareket ettirilen deriden yapılmış iki komik figürün gölgesi yansımaktadır.",
              example: "",
            },
            {
              name: "Karşı Karşıya Duran Karakterler",
              desc: "Kuklalardan biri kel kafalı, büyük gözlü ve şakacı olan Karagöz'dür. Diğeri ise sivri sakallı, bilgili ve kibar konuşan Hacivat'tır. Haritada bu iki karakterin komik atışmaları çizilmiştir. Sayfanın alt köşesinde ise sahnesiz, doğrudan halkın ortasındaki boş bir alanda oynanan canlı Orta Oyunu görseli yer alır.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Geleneksel Tiyatro Testi",
          desc: "Geleneksel tiyatro ile ilgili soruların doğru cevabını bulunuz.",
          questions: [
            {
              id: 1,
              q: "Arkasından beyaz bir ışık konulan şeffaf perdede, çubuklu deriden kuklaların oynatılmasıyla yapılan geleneksel gölge oyunumuz hangisidir?",
              options: ["Orta Oyunu", "Karagöz ve Hacivat", "Modern Tiyatro"],
              correct: 1,
            },
            {
              id: 2,
              q: "Gölge oyunundaki kel kafalı, söylenen kelimeleri hep yanlış anlayarak bizi güldüren şakacı halk karakteri kimdir?",
              options: ["Hacivat", "Karagöz", "Kavuklu"],
              correct: 1,
            },
            {
              id: 3,
              q: "Karagöz'ın tam karşısında duran, kibar diliyle konuşan, okumuş ve bilgili olan gölge oyunu karakteri kimdir?",
              options: ["Pişekar", "Hacivat", "Karagöz"],
              correct: 1,
            },
            {
              id: 4,
              q: "Çevresi seyircilerle kaplı, ortadaki boş bir meydanda (sahnesiz) canlı oyuncularla oynanan geleneksel halk tiyatrosuna ne denir?",
              options: ["Gölge Oyunu", "Orta Oyunu", "Sinema"],
              correct: 1,
            },
            {
              id: 5,
              q: "Gölge oyununda Karagöz ve Hacivat'ın arkasından ışık verilen o beyaz şeffaf düzlüğe ne ad verilir?",
              options: [
                "Sahne arkası",
                "Hayal perdesi (Gölge perdesi)",
                "Kamera önü",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Bu gölge oyunundaki kuklaları perdenin arkasından tek başına oynatan ve seslendiren usta sanatçıya ne ad verilir?",
              options: ["Yönetmen", "Hayali (Hayalbaz)", "Sufleci"],
              correct: 1,
            },
            {
              id: 7,
              q: "Karagöz ile Hacivat arasındaki o konuşmaların en belirgin ortak komik özelliği aşağıdakilerden hangisidir?",
              options: [
                "Sürekli ağlamaları",
                "Kelimelerin yanlış anlaşılmasına dayalı tatlı atışmalar ve şakalar içermesi",
                "Sadece yabancı dilde konuşmaları",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Orta oyunu resimlerinde yer alan, gölge oyunundaki Karagöz'ün canlı karşılığı olan ana karakter kimdir?",
              options: ["Pişekar", "Kavuklu", "Hacivat"],
              correct: 1,
            },
            {
              id: 9,
              q: "Geleneksel Türk tiyatrosunun çocuklara ve halka sağladığı en büyük somut fayda nedir?",
              options: [
                "Sadece can sıkıntısını artırması",
                "Güldürürken derin derin düşündürmesi, dilimizin kelime zenginliğini eğlendirerek öğretmesi",
                "Okuma yazmayı tamamen unutturması",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Haritada bu eski tiyatro oyunlarının gösterildiği tarihi köy meydanları resimleri bize hangi dönemleri somutlaştırır?",
              options: [
                "Tamamen fabrikalaşmış modern dönemleri",
                "Eski ramazan gecelerini, geleneksel Türk kültürünü ve halk eğlencelerini",
                "Gelecekteki uzay çağını",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Tiyatro Doğrulaması",
          desc: "Geleneksel tiyatro ile ilgili ifadelerin doğru mu yanlış mı olduğunu belirtiniz.",
          questions: [
            {
              q: "Karagöz ve Hacivat, Türk kültürünün en kilit ve en bilinen geleneksel gölge oyunudur.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Oyundaki şakacı ve kel kafalı karakterin adı Hacivat olarak bilinir.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Gölge oyunundaki kuklalar şeffaf bir perdenin arkasından ince çubuklarla oynatılır.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Orta Oyunu, büyük tiyatro binaları yerine halkın ortasındaki boş bir meydanda canlı oynanırdı.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: 'Perdenin arkasındaki tüm sesleri ve taklitleri yapan ustaya "Tiyatrocu" değil, "Hayali" denir.',
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Hacivat, kibar ve okumuş diliyle Karagöz'e sürekli bir şeyler öğretmeye çalışan karakterdir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: "Karagöz ve Hacivat oyununda sadece iki karakter vardır, başka hiç kimse perdeye çıkmaz.",
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "İki karakter arasındaki kelime oyunları izleyicileri güldüren en büyük somut ögedir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
            {
              q: 'Orta oyunundaki "Kavuklu" karakteri, gölge oyunundaki Hacivat\'ın birebir canlı kopyasıdır.',
              words: ["Doğru", "Yanlış"],
              correct: "Yanlış",
            },
            {
              q: "Bu eski tiyatro miraslarımız, dilimizin mizah ve güldürü gücünü gösteren kültürel değerlerdir.",
              words: ["Doğru", "Yanlış"],
              correct: "Doğru",
            },
          ],
        },
      },
    },
  },
  "25": {
    story: {
      title: "YENİ GELEN ARKADAŞ",
      theme: "İleriye Geçiş / Empati",
      text: "Pazartesi sabahı sınıfa başka bir ülkeden gelen Elfe adında yeni bir kız öğrenci katıldı. Elfe, büyük mavi gözleri olan, henüz hiç Türkçe bilmeyen sessiz bir çocuktu. İlk teneffüs zili çaldığında sınıftaki bütün çocuklar oyun oynamak için bahçeye koştular. Elfe ise sırasından hiç kalkmadı ve pencerenin kenarında tek başına üzgünce oturdu. Kerem onun tek başına kaldığını fark etti ve kendi çantasından renkli boyama kitabını çıkardı. Elfe'nin sırasına doğru yürüdü ve aralarında hiç konuşma geçmeden yanındaki boş sandalyeye oturdu. Kerem hiçbir kelime kullanmadı çünkü Elfe'nin onu anlamayacağını biliyordu. Sadece nazikçe gülümsedi ve boyama kitabını sıranın tam ortasına açıp renkli kalemleri ona uzattı. Elfe, Kerem'in bu sıcak hareketini görünce gözlerindeki üzüntü uçup gitti ve eline kırmızı kalemi aldı. İki çocuk hiç konuşmadan, sadece resimleri boyayarak aralarında harika bir dostluk köprüsü kurdular.",
      questions: [
        {
          id: 1,
          q: "Sınıfa yeni gelen kız öğrencinin adı nedir?",
          options: ["Sıla", "Elfe", "Ceren"],
          correct: 1,
        },
        {
          id: 2,
          q: "Elfe'nin sınıfta sessiz kalmasının temel sebebi neydi?",
          options: [
            "Kimseyi sevmemesi",
            "Henüz hiç Türkçe bilmemesi",
            "Uykusunun olması",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "İlk teneffüs zili çalınca Elfe ne yaptı?",
          options: [
            "Bahçeye çıkıp hızlıca koştu",
            "Sırasından hiç kalkmadan pencere kenarında oturdu",
            "Kantine gidip su satın aldı",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Kerem Elfe'nin yanına gitmeden önce çantasından ne çıkardı?",
          options: [
            "Renkli boyama kitabını",
            "Büyük beyaz futbol topunu",
            "Yeni aldığı hikaye kitabını",
          ],
          correct: 0,
        },
        {
          id: 5,
          q: "Kerem Elfe'nin yanına gidince neden hiç konuşmadı?",
          options: [
            "Elfe'ye kızgın olduğu için",
            "Elfe'nin onu anlamayacağını bildiği için",
            "Konuşmayı sevmediği için",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Kerem boyama kitabını nereye açtı ve kalemleri ne yaptı?",
          options: [
            "Öğretmen masasına açıp kalemleri çantasına koydu",
            "Sıranın tam ortasına açıp kalemleri Elfe'ye uzattı",
            "Kendi sırasına açıp Elfe'nin gelmesini bekledi",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Kerem'in hareketini gören Elfe hangi renk kalemi eline aldı?",
          options: ["Mavi", "Kırmızı", "Yeşil"],
          correct: 1,
        },
        {
          id: 8,
          q: "İki çocuk hiç konuşmadan nasıl anlaştılar?",
          options: [
            "Birbirlerine not yazarak",
            "Sadece resimleri boyayarak dostluk köprüsü kurdular",
            "İşaret diliyle konuşarak",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🎯 Hikayenin Kalbini Bul!",
        rules: [
          {
            name: "Metnin Konusu",
            desc: '"Bu hikayede ne anlatılıyor?" sorusunun cevabıdır. Genellikle metindeki somut olaydır.',
            example: "Çocuğun odasını toplaması.",
          },
          {
            name: "Metnin Ana Fikri",
            desc: '"Bu hikaye bize nasıl bir ders vermek istiyor?" sorusunun cevabıdır. Yazarın kalbimize bırakmak istediği o bilgece öğüttür.',
            example: "Paylaşmak bizi mutlu eder.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Hikaye Konusu Nedir?",
        desc: "Aşağıda özetleri verilen hikayelerin konularını seçeneklerden bularak işaretleyiniz.",
        questions: [
          {
            id: 1,
            q: '"Eda ve Kaan parkta gördükleri eski, boyası dökülmüş çatlak kuş yuvasını evden getirdikleri boyalarla el ele verip neşeyle tamir ederler."',
            options: [
              "Parktaki çocukların salıncak kavgası",
              "Eski bir kuş kulübesinin yardımlaşarak boyanması",
              "Hafta sonu yağan fırtınanın ağaçlara zarar vermesi",
            ],
            correct: 1,
          },
          {
            id: 2,
            q: '"Emre sahilde tek başına uçurtma uçururken, oyuncağı olmayan ve onu üzgünce izleyen küçük bir çocukla uçurtmasının ipini paylaşır."',
            options: [
              "Sahilde esen sert rüzgarın gücü",
              "İki çocuğun sahilde uçurtmayı paylaşarak birlikte uçurması",
              "Yeni alınan sarı lacivert uçurtmanın yapım aşamaları",
            ],
            correct: 1,
          },
          {
            id: 3,
            q: '"Kaşif arı kovanına dönerek diğer işçi arıların önünde gökyüzünde sekiz şekli çizerek dans eder ve çiçeklerin yerini haber verir."',
            options: [
              "Arıların kovandaki temizlik kuralları",
              "Arıların dans yoluyla aralarında kurdukları gizli iletişim dili",
              "Çiçeklerin sonbaharda renk değiştirmesi",
            ],
            correct: 1,
          },
          {
            id: 4,
            q: '"Pelin okul bahçesinde içi bozuk para dolu kırmızı çizgili bir cüzdan bulur ve paraya hiç dokunmadan doğrudan nöbetçi öğretmene teslim eder."',
            options: [
              "Okul bahçesindeki yeşil çimlerin temizliği",
              "Pelin'in bulduğu cüzdanı dürüst bir şekilde öğretmenine teslim etmesi",
              "Ahmet Bey'in Pelin'e verdiği matematik ödevi",
            ],
            correct: 1,
          },
          {
            id: 5,
            q: '"Selim apartman merdivenlerinden elindeki ağır pazar poşetleriyle zorlanarak çıkan komşusu Nebahat Teyze\'ye yardım ederek poşetleri kapısına kadar taşır."',
            options: [
              "Apartman kapısının anahtarının kaybolması",
              "Selim'in pazar poşetlerini taşıyan yaşlı komşusuna yardım etmesi",
              "Nebahat Teyze'nin manavdan aldığı elmaların tadı",
            ],
            correct: 1,
          },
          {
            id: 6,
            q: '"Sonbahar geldiğinde havaların soğumasıyla ağaçların yapraklarının yeşilden sarı, turuncu ve kahverengiye dönerek dökülmesini ve kış uykusuna hazırlanmasını anlatır."',
            options: [
              "İlkbaharda açan sarı çiçeklerin bakımı",
              "Sonbaharda ağaçlardaki yaprakların renk değişimi ve dökülme sebepleri",
              "Toprağın altına serilen eski yün battaniyeler",
            ],
            correct: 1,
          },
          {
            id: 7,
            q: '"Nil ve annesi yağmurlu bir günde kapının köşesine sığınmış, tüyleri ıslanmış minik gri bir kediyi evdeki eski bir karton kutu ve eski kazakla sıcak bir yuvaya kavuşturur."',
            options: [
              "İlkbahar yağmurunun sokakları çamur yapması",
              "Islanmış minik bir sokak kedisine karton kutudan sıcak bir yuva yapılması",
              "Kilerden çıkarılan eski eşyaların temizlenmesi",
            ],
            correct: 1,
          },
          {
            id: 8,
            q: '"Mert ve arkadaşları piknik yaptıktan sonra etraftaki plastik şişeleri ve kağıtları görünce bir Yeşil Takım kurup tüm çöpleri geri dönüşüm kutularına renklerine göre ayırarak atarlar."',
            options: [
              "Göl kenarında oynanan futbol maçının kuralları",
              "Bir grup çocuğun çevre temizliği için takım kurup çöpleri toplaması",
              "Şeffaf temizlik eldivenlerinin kırtasiyeden satın alınması",
            ],
            correct: 1,
          },
          {
            id: 9,
            q: '"Dünyamızın etrafını saran atmosfer tabakasının bizi güneşin zararlı ışınlarından ve uzayın dondurucu soğuğundan koruyan sihirli bir battaniye olduğunu açıklar."',
            options: [
              "Gökyüzündeki beyaz bulutların yağmur bırakma şekli",
              "Dünyamızı koruyan atmosfer tabakasının görevleri ve önemi",
              "Uzay boşluğundaki parlak yıldızların isimleri",
            ],
            correct: 1,
          },
          {
            id: 10,
            q: '"Murat odasındaki büyük halının üzerine dağılmış olan legoları mavi kutuya, oyuncak arabaları ise rafa dizerek odasını düzenli hale getirir."',
            options: [
              "Murat'ın arkadaşıyla oynadığı yeni bilgisayar oyunu",
              "Murat'ın dağınık olan odasını sorumluluk alarak toplaması",
              "Kitaplığın en alt rafındaki hikaye kitaplarının sayısı",
            ],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Çıkarılan Ders Nedir?",
        desc: "Hikaye özetlerinin altındaki boş bırakılan yerlere gelebilecek en doğru ana fikri bularak yerleştiriniz.",
        questions: [
          { words: ["unuturuz", "anlarız"], correct: "anlarız" },
          { words: ["zararlı", "sihirli"], correct: "sihirli" },
          { words: ["çöp", "bilgi"], correct: "bilgi" },
          { words: ["oyun", "icat"], correct: "icat" },
          { words: ["paylaşma", "konuşma"], correct: "paylaşma" },
          { words: ["kapatır", "kazandırır"], correct: "kazandırır" },
          { words: ["bozmak", "korumak"], correct: "korumak" },
          { words: ["sorunlar", "çözümler"], correct: "çözümler" },
          { words: ["yüklerden", "hazinelerden"], correct: "hazinelerden" },
          { words: ["paranın", "bilginin"], correct: "bilginin" },
        ],
      },
    },
  },
  "26": {
    story: {
      title: "BÜYÜTECİN ARKASINDAKİ DÜNYA",
      theme: "Usta / Bakış Açısı",
      text: "Can, hafta sonu evdeki eski ahşap çekmeceyi karıştırırken sapı siyah, camı yuvarlak bir büyüteç buldu. Bu nesneyi gözüne yaklaştırıp odasındaki sıradan eşyaları incelemeye başladı. Büyütecin arkasından baktığında, her gün gördüğü küçük detayların ne kadar değişik gözüktüğünü fark etti. Mutfaktan aldığı yeşil bulaşık süngerine baktığında, süngerin aslında devasa delikleri olan gizemli bir mağaraya benzediğini gördü. Masasının üzerinde duran tükenmez kalemin ince metal ucuna baktı; kalemin ucundaki minik bilye uzayda parıldayan parlak bir gezegen gibi görünüyordu. Can, büyüteci nesnelere yaklaştırıp uzaklaştırarak saatlerce bu eğlenceli dünyayı izledi. Hayatta nesnelere ve olaylara ne kadar yakından veya uzaktan baktığımıza göre her şeyin görüntüsünün ve anlamının değişebileceğini fark etti. Bu küçük cam parçasının arkasındaki dünya ona yepyeni bir bakış açısı kazandırmıştı. Sıradan şeylerin içinde saklı olan büyük mucizeleri görmek Can'ın zihnini fazlasıyla büyüttü. Eşyaların sadece dış görünüşleriyle değil, içlerindeki saklı dünyalarla da değerli olduğunu anladı. Büyüteci çantasına koyarak artık dünyaya daha dikkatli bakmaya karar verdi.",
      questions: [
        {
          id: 1,
          q: "Can büyüteci evin neresinde buldu?",
          options: [
            "Balkondaki büyük saksının arkasında",
            "Eski ahşap çekmecenin içinde",
            "Çantasının en alt gözünde",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Can'ın bulduğu büyütecin dış görünüşü nasıldı?",
          options: [
            "Sapı siyah, camı yuvarlak",
            "Demir çerçeveli ve kare şeklinde",
            "Plastik sarı saplı ve uzun",
          ],
          correct: 0,
        },
        {
          id: 3,
          q: "Can büyüteçle odasındaki neleri incelemeye başladı?",
          options: [
            "Duvardaki eski tabloları",
            "Sıradan eşyaları",
            "Kitapların kalın kapaklarını",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Büyüteçle bakıldığında yeşil bulaşık süngeri neye benziyordu?",
          options: [
            "Yüksek karlı bir dağın zirvesine",
            "Devasa delikleri olan gizemli bir mağaraya",
            "Derin mavi bir nehir yatağına",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Tükenmez kalemin ucundaki minik bilye Can'a neyi hatırlattı?",
          options: [
            "Denizdeki küçük bir çakıl taşını",
            "Uzayda parıldayan parlak bir gezegeni",
            "Küçük bir cam bilyeyi",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Can büyüteçle saatlerce ne yaptı?",
          options: [
            "Camı temizlemek için bez aradı",
            "Büyüteci nesnelere yaklaştırıp uzaklaştırarak dünyayı izledi",
            "Büyütecin sapını boyamaya çalıştı",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Can bu deneyim sayesinde olaylarla ilgili neyi fark etti?",
          options: [
            "Büyük eşyaların küçüklerden daha yararlı olduğunu",
            "Bakış açımıza göre her şeyin görüntüsünün ve anlamının değişebileceğini",
            "Eski çekmecelerin her zaman temiz tutulması gerektiğini",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Can sıradan şeylerin içinde nelerin saklı olduğunu gördü?",
          options: [
            "Küçük böceklerin",
            "Büyük mucizelerin",
            "Renkli boyaların",
          ],
          correct: 1,
        },
        {
          id: 9,
          q: "Can eşyaların neyle değerli olduğunu somut olarak anladı?",
          options: [
            "Sadece dış görünüşleriyle",
            "İçlerindeki saklı dünyalarla",
            "Ne kadar pahalı olduklarıyla",
          ],
          correct: 1,
        },
        {
          id: 10,
          q: "Hikayenin sonunda Can büyüteci nereye koydu ve neye karar verdi?",
          options: [
            "Masanın üzerine bıraktı ve oyun oynamaya gitti",
            "Çantasına koydu ve dünyaya daha dikkatli bakmaya karar verdi",
            "Dedesine hediye etti ve kütüphaneye yürüdü",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🌳 Kelimenin Ağaç Kökü!",
        rules: [
          {
            name: "Kök",
            desc: "Bir kelimenin üzerindeki bütün ekleri kestiğimizde elimizde kalan anlamlı, en küçük somut parçaya Kök denir.",
            example: "",
          },
          {
            name: "İsim Kökleri",
            desc: 'Sonuna "-mek / -mak" eki geldiğinde anlamsız olan kelime kökleridir.',
            example: "göz, taş, masa.",
          },
          {
            name: "Fiil Kökleri",
            desc: 'Sonuna "-mek / -mak" eki geldiğinde anlamlı olan, bir hareket bildiren köklerdir.',
            example: "bak(mak), bul(mak), aç(mak).",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Kökünü Kes",
        desc: "Verilen ek almış kelimelerin en küçük anlamlı parçasını (kökünü) bularak karşılarındaki boşluğa yazınız.",
        questions: [
          {
            id: 1,
            q: '"Büyüteçten" kelimesinin kökü hangisidir?',
            options: ["büyü", "büyüteç", "büyük"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Gözlüğü" kelimesinin kökü hangisidir?',
            options: ["göz", "gözlük", "gözcü"],
            correct: 0,
          },
          {
            id: 3,
            q: '"Odama" kelimesinin kökü hangisidir?',
            options: ["oda", "odak", "odaş"],
            correct: 0,
          },
          {
            id: 4,
            q: '"Eşyaları" kelimesinin kökü hangisidir?',
            options: ["eşya", "eşy", "eş"],
            correct: 0,
          },
          {
            id: 5,
            q: '"Karıştırdı" kelimesinin kökü hangisidir?',
            options: ["karış", "kar", "kara"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Baktığında" kelimesinin kökü hangisidir?',
            options: ["bak", "bakış", "baktı"],
            correct: 0,
          },
          {
            id: 7,
            q: '"Mutfaktan" kelimesinin kökü hangisidir?',
            options: ["mutfak", "mut", "fırın"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Süngerini" kelimesinin kökü hangisidir?',
            options: ["sünger", "sün", "ger"],
            correct: 0,
          },
          {
            id: 9,
            q: '"Masanın" kelimesinin kökü hangisidir?',
            options: ["masa", "mas", "as"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Bilyesi" kelimesinin kökü hangisidir?',
            options: ["bilye", "bil", "ye"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Türünü Seç",
        desc: "Bulunan kelime köklerinin isim kökü mü fiil kökü mü olduğunu doğru şekilde eşleştiriniz.",
        questions: [
          { words: ["Göz", "İsim Kökü", "Fiil Kökü"], correct: "İsim Kökü" },
          { words: ["Bak", "İsim Kökü", "Fiil Kökü"], correct: "Fiil Kökü" },
          { words: ["Masa", "İsim Kökü", "Fiil Kökü"], correct: "İsim Kökü" },
          { words: ["Bul", "İsim Kökü", "Fiil Kökü"], correct: "Fiil Kökü" },
          { words: ["Taş", "İsim Kökü", "Fiil Kökü"], correct: "İsim Kökü" },
          { words: ["Aç", "İsim Kökü", "Fiil Kökü"], correct: "Fiil Kökü" },
          { words: ["Kutu", "İsim Kökü", "Fiil Kökü"], correct: "İsim Kökü" },
          { words: ["Yaz", "İsim Kökü", "Fiil Kökü"], correct: "Fiil Kökü" },
          { words: ["Kitap", "İsim Kökü", "Fiil Kökü"], correct: "İsim Kökü" },
          { words: ["Koş", "İsim Kökü", "Fiil Kökü"], correct: "Fiil Kökü" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Tellerin Dili Bağlama, Ney ve Kanun",
          rules: [
            {
              name: "Geniş Gövdeli Ahşap Saz",
              desc: "Müzik kültürü haritasında 26. Sandık açıldığında, üzerinde uzun bir sapı ve telleri olan ahşap bir enstrüman resmi görülür; bu bizim milli çalgımız olan Bağlama (Saz)'dır. Halk ozanlarımızın elinde bu tellere mızrapla vurularak türküler söylendiği resmedilmiştir.",
              example: "",
            },
            {
              name: "Üflemeli Ney ve Yatay Kanun",
              desc: "Sayfanın orta kısmında, içi boş sarı renkli bir kamıştan yapılmış, üzerinde delikler olan dik bir çalgı çizilidir; bu huzur dolu sesiyle bilinen Ney'dir. Alt köşede ise masa üzerine yatay konularak parmaklara takılan metal yüzüklerle (mızraplarla) çalınan, çok sayıda teli olan yamuk şekilli Kanun resmi yer alır. Bu çalgılar Türk müziğinin ses zenginliğini somutlaştırır.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Enstrümanlar Testi",
          desc: "Enstrümanlar ile ilgili soruları dikkatlice okuyup doğru seçeneği işaretleyiniz.",
          questions: [
            {
              id: 1,
              q: "Türk halk müziğinde ozanların elinde gördüğümüz, uzun saplı ve telli olan en önemli milli çalgımız hangisidir?",
              options: ["Piyano", "Bağlama (Saz)", "Flüt"],
              correct: 1,
            },
            {
              id: 2,
              q: "Özel bir sarı kamıştan yapılan, üflendiğinde insana huzur ve sessizlik veren geleneksel üflemeli çalgımızın adı nedir?",
              options: ["Kanun", "Ney", "Kemençe"],
              correct: 1,
            },
            {
              id: 3,
              q: "Masa üzerine yatay yatırılarak, parmaklara takılan yüzük şekilli mızraplarla çalınan çok telli yamuk çalgı hangisidir?",
              options: ["Davul", "Kanun", "Ney"],
              correct: 1,
            },
            {
              id: 4,
              q: "Bağlama çalınırken tellere somut olarak vurulan o küçük plastik veya plastiğe benzer yumuşak aletin adı nedir?",
              options: ["Çekiç", "Mızrap (Tezene)", "Biz çubuğu"],
              correct: 1,
            },
            {
              id: 5,
              q: "Ney enstrümanının yapıldığı o içi boş delikli sarı bitkinin somut coğrafi adı nedir?",
              options: ["Çam odunu", "Kargı kamışı (Kargı)", "Palmiye yaprağı"],
              correct: 1,
            },
            {
              id: 6,
              q: "Kanun çalgısının ses telleri incelendiğinde müzikte nasıl bir güce sahiptir?",
              options: [
                "Sadece tek bir ses çıkarabilir.",
                "Rengarenk ve neşeli tınısıyla Türk müziğinin tüm ses makamlarını çalabilir.",
                "Sadece gürültü yapar.",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Geçmişte ve günümüzde sazı eline alıp şehir şehir gezerek türküler söyleyen müzisyenlere ne ad verilir?",
              options: ["Sufleci", "Halk Ozanı (Aşık)", "Hakem"],
              correct: 1,
            },
            {
              id: 8,
              q: "Haritada ney çalan insanın dudak şekline bakıldığında bu çalgı nasıl ses çıkarır?",
              options: [
                "Tellerine vurularak",
                "İçine nefesle doğru açıdan üflenerek",
                "Üzerine çekiçle vurularak",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Bağlamanın tekne (gövde) kısmı genellikle hangi somut malzemeden oyularak üretilir?",
              options: [
                "Plastik kalıplardan",
                "Dut veya ardıç gibi ağaç odunlarından",
                "Demir levhalardan",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir çocuk bu geleneksel enstrümanların seslerini dinlediğinde Türk müzik kültürü hakkında neyi anlar?",
              options: [
                "Müziğimizin çok yeni ve ses çeşitliliğinin az olduğunu",
                "Yüzyıllardır süregelen, duygulu, zengin ve köklü bir ses dünyasına sahip olduğumuzu",
                "Çalgıların tamamen süs olduğunu",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Müzik Kültürü Boşluk Doldurma",
          desc: "Boşluk doldurma sorularını tamamlayınız.",
          questions: [
            { words: ["bağlama", "flüt"], correct: "bağlama" },
            { words: ["ney", "kanun"], correct: "ney" },
            { words: ["kanun", "davul"], correct: "kanun" },
            { words: ["sap", "tekne"], correct: "sap" },
            { words: ["mızrap", "çivi"], correct: "mızrap" },
            { words: ["delikler", "teller"], correct: "delikler" },
            { words: ["ozanı", "yazarı"], correct: "ozanı" },
            { words: ["neşeli", "boğuk"], correct: "neşeli" },
            { words: ["ağaç", "demir"], correct: "ağaç" },
            { words: ["zenginlik", "kuraklık"], correct: "zenginlik" },
          ],
        },
      },
    },
  },
  "27": {
    story: {
      title: "YAŞLI MEŞENİN KONUŞMASI",
      theme: "Usta / Ekolojik Denge",
      text: "Asya, bir sonbahar sabahında evlerinin arkasındaki büyük ve derin ormanda yürüyüşe çıktı. Ormanın tam ortasında, gövdesi kalınlığıyla dikkat çeken yüz yaşındaki dev bir meşe ağacı duruyordu. Ağacın yanına yaklaştı ve sert, tırtıklı kahverengi kabuğuna elleriyle dokundu. Geçen yıl kesilmiş olan yan daldaki düz yuvarlak bölümün üzerindeki ince halkaları gördü. Bu halkalar, yaşlı meşenin ne kadar yıldır burada yaşadığını gösteren çizgilerdi. Asya çizgileri sayarken, ormanda esen rüzgar ağacın sarı yapraklarını hafifçe sallayarak ses çıkardı. Asya, ağaçların aslında kendi aralarında toprağın altındaki uzun kökleriyle gizli mesajlar gönderdiğini biliyordu. Bu dev ağaç, kökleriyle yerin altındaki minik mantarlara ve diğer genç ağaçlara su paylaşıyordu. Ormandaki her canlının, karıncalardan kuşlara kadar birbirine görünmez iplerle bağlı olduğunu düşündü. Eğer bu yaşlı meşe ağacı zarar görseydi, üzerindeki kuş yuvaları ve altındaki karınca yuvaları da evsiz kalacaktı. Doğanın içindeki bu harika ortak yaşam sistemi Asya'nın kalbinde büyük bir hayranlık uyandırdı. Her ağacın sadece bir odun olmadığını, canlı bir şehir gibi binlerce canlıya yuva olduğunu anladı. Yerde duran kuru bir meşe palamudunu eline alarak onu toprağa sevgiyle gömdü. Gelecekte bu küçük tohumun da dev bir şehir ağaç olacağını bilerek evine doğru mutlu adımlarla döndü.",
      questions: [
        {
          id: 1,
          q: "Asya ne zaman ve nerede yürüyüşe çıktı?",
          options: [
            "Yaz akşamında okulun yeşil bahçesinde",
            "Sonbahar sabahında evlerinin arkasındaki büyük ormanda",
            "Kış gününde mahalledeki çocuk parkında",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Ormanın ortasında duran dev meşe ağacı kaç yaşındaydı?",
          options: ["On", "Yüz", "Beş yüz"],
          correct: 1,
        },
        {
          id: 3,
          q: "Asya meşe ağacının neresine elleriyle somut olarak dokundu?",
          options: [
            "En üstteki ince yeşil yapraklarına",
            "Sert, tırtıklı kahverengi kabuğuna",
            "Toprağın dışındaki kalın köklerine",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Kesilmiş yan daldaki yuvarlak bölümın üzerindeki halkalar neyi gösteriyordu?",
          options: [
            "Ağacın ne kadar su emdiğini",
            "Ağacın kaç yıldır burada yaşadığını",
            "Üzerine kaç tane kuş konduğunu",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Ağaçlar toprağın altından birbirlerine neyle gizli mesajlar gönderirler?",
          options: [
            "Küçük renkli taşlarla",
            "Uzun kökleriyle",
            "Toprak solucanlarıyla",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Yaşlı meşe ağacı kökleriyle kimlerle su paylaşıyordu?",
          options: [
            "Ormandan geçen nehirle",
            "Minik mantarlara ve diğer genç ağaçlara",
            "Bahçedeki evlerin kuyularıyla",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Yaşlı meşe ağacı zarar görseydi kimler evsiz kalacaktı?",
          options: [
            "Ormandaki büyük ayılar ve geyikler",
            "Üzerindeki kuş yuvaları ve altındaki karınca yuvaları",
            "Nehirdeki küçük balıklar",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Asya deneyimi sonunda her ağaçla ilgili neyi anladı?",
          options: [
            "Ağaçların kışın tamamen kuruduğunu",
            "Canlı bir şehir gibi binlerce canlıya yuva olduğunu",
            "Sadece gölge yapmak için büyüdüklerini",
          ],
          correct: 1,
        },
        {
          id: 9,
          q: "Asya yerde bulduğu hangi somut nesneyi toprağa gömdü?",
          options: [
            "Küçük beyaz bir çakıl taşını",
            "Kuru bir meşe palamudunu",
            "İnce bir çam dalını",
          ],
          correct: 1,
        },
        {
          id: 10,
          q: "Hikayenin sonunda Asya evine dönerken neyi düşünüyordu?",
          options: [
            "Akşam hangi oyunu oynayacağını",
            "Küçük tohumun gelecekte dev bir ağaç olacağını",
            "Yarın okula erken gitmesi gerektiğini",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "👍 Yapıldı mı, 👎 Yapılmadı mı?",
        rules: [
          {
            name: "Olumlu Cümle",
            desc: "Cümledeki işin, hareketin yapıldığını, olduğunu veya var olduğunu anlatan cümlelerdir.",
            example: "Asya ormanda kalın meşe ağacını gördü.",
          },
          {
            name: "Olumsuz Cümle",
            desc: 'Cümledeki işin yapılmadığını, olmadığını veya yok olduğunu anlatan cümlelerdir. Eylemlerin sonuna gelen "-ma / -me" ekleriyle veya "değil / yok" kelimeleriyle kurulurlar.',
            example: "Kutunun içinde hiç küçük çivi bulamadı.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Yönünü Seç",
        desc: "Verilen cümlelerin yapıca olumlu mu yoksa olumsuz mu olduğunu doğru kutularla eşleştiriniz.",
        questions: [
          {
            id: 1,
            q: '"Asya, sonbahar sabahında büyük ormanda yürüyüşe çıktı." cümlesi',
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Ağacın en üstteki ince dallarına elleriyle dokunamadı." cümlesi',
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 1,
          },
          {
            id: 3,
            q: '"Alet kutusunun en altına bakmasına rağmen küçük çivi yoktu." cümlesi',
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 1,
          },
          {
            id: 4,
            q: '"Eren metal atacı sertçe bükerek düz uzun bir tel yaptı." cümlesi',
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 0,
          },
          {
            id: 5,
            q: '"Sinan sabah uyandığında ağzından hiçbir ses çıkmadı." cümlesi',
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 1,
          },
          {
            id: 6,
            q: "\"Derin bir nefes alarak 'Merhaba baba!' sözünü neşeyle söyledi.\" cümlesi",
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 0,
          },
          {
            id: 7,
            q: '"Murat sandığın içinde aradığı parıltılı altınları bulamadı." cümlesi',
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 1,
          },
          {
            id: 8,
            q: '"Tozlu kitabı masanın üzerindeki ışığın altına götürdü." cümlesi',
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 0,
          },
          {
            id: 9,
            q: '"Bu büyük odada hiç kimse sessizce oturuyor değildi." cümlesi',
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 1,
          },
          {
            id: 10,
            q: '"Her kitabın arkasında saklı duran hazineyi aramaya hazırdı." cümlesi',
            options: ["Olumlu Cümle", "Olumsuz Cümle"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Olumsuza Çevir",
        desc: "Verilen olumlu cümlelerin sonundaki eylemleri, boş bırakılan yerlere olumsuz olacak şekilde tamamlayınız.",
        questions: [
          { words: ["dokunmadı", "dokundu"], correct: "dokunmadı" },
          { words: ["buldu", "bulamadı"], correct: "bulamadı" },
          { words: ["konuşamadı", "konuştu"], correct: "konuşamadı" },
          { words: ["okudu", "okumadı"], correct: "okumadı" },
          { words: ["toplamadı", "topladı"], correct: "toplamadı" },
          { words: ["aldı", "almadı"], correct: "almadı" },
          { words: ["yıkamadı", "yıkadı"], correct: "yıkamadı" },
          { words: ["canlandı", "canlanmadı"], correct: "canlanmadı" },
          { words: ["uçurmadı", "uçurdu"], correct: "uçurmadı" },
          { words: ["getirdi", "getirmedi"], correct: "getirmedi" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title: "🗺️ Dünyaya Robotların İlhamını Veren Deha: Cezeri",
          rules: [
            {
              name: "Bakır Dişliler ve Otomatik Robot Resmi",
              desc: "Bilim tarihi haritasında 27. Sandık açıldığında, üzerinde büyük bakır çarklar, su kanalları ve kendi kendine hareket eden metal kuklalar olan bir makine çizimi görülür; bu dünyaca ünlü mucidimiz Cezeri'nin robot tasarımıdır. Cezeri, sekiz yüz yıl önce yaşamış ve bilgisayar biliminin, robot teknolojisinin temelini somut olarak atmıştır.",
              example: "",
            },
            {
              name: "Filli Su Saati Çizimi",
              desc: "Haritada onun en meşhur icadı olan dev bir Filli Su Saati resmi yer alır. Büyük bir fil heykelinin sırtına yerleştirilmiş su mekanizmaları, dişli çarklar ve su aktıkça hareket edip saati haber veren metal kuş figürleri çizilmiştir. Haritadaki bu somut icat, onun elektriksiz sadece su gücüyle çalışan robotlar yaptığını kanıtlar.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Cezeri ve İcatlar Testi",
          desc: "Türkiye'nin dünyadaki konumuyla ilgili soruları dikkatlice okuyup doğru seçeneği işaretleyiniz.",
          questions: [
            {
              id: 1,
              q: "Sekiz yüz yıl önce Artuklular döneminde yaşamış, dünyada robot teknolojisinin ve sibernetiğin (haberleşme-kontrol) babası kabul edilen tarihi bilim insanımız kimdir?",
              options: ["Harezmi", "Cezeri", "Aziz Sancar"],
              correct: 1,
            },
            {
              id: 2,
              q: "Cezeri'nin haritada resmi bulunan, fil heykelinin sırtına dişli çarklar koyarak suyun gücüyle çalıştırdığı en ünlü icadı hangisidir?",
              options: ["Güneş Paneli", "Filli Su Saati", "Hesap Makinesi"],
              correct: 1,
            },
            {
              id: 3,
              q: "Cezeri'nin icat ettiği makinelerin en büyük somut çalışma mekanizması kuralı aşağıdakilerden hangisidir?",
              options: [
                "Elektrik ve pillerle çalışması",
                "Tamamen su gücü, yerçekimi ve bakır dişli çarkların dengesiyle kendi kendine hareket etmesi",
                "Kömür yakarak çalışması",
              ],
              correct: 1,
            },
            {
              id: 4,
              q: "Dünyada ilk kez kendi kendine çalışan otomatik makineler yani robotlar tasarlayan Cezeri'nin bilim dünyasındaki kilit unvanı nedir?",
              options: [
                "Astronomi Müdürü",
                "Sibernetiğin Kurucusu (İlk Robot Bilimci)",
                "Tıp Doktoru",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Cezeri'nin su saatinde saat başlarında hareket ederek ses çıkaran ve saati haber veren somut hayvan figürleri hangileridir?",
              options: [
                "Büyük balıklar",
                "Metal kuşlar ve ejderha çarkları",
                "Küçük kediler",
              ],
              correct: 1,
            },
            {
              id: 6,
              q: "Cezeri icatlarını ve çizimlerini kaybolmaması için hangi somut eserde toplayıp geleceğe miras bırakmıştır?",
              options: [
                "Harf Sözlüğü kitaplarında",
                "Olağanüstü Mekanik Araçların Bilgisi Kitabı'nda (Çizimli İcatlar Kitabı)",
                "Sadece şiir defterlerinde",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Cezeri'nin makinelerinde kullandığı, hareketin yönünü değiştiren kilit metal parçaların adı nedir?",
              options: [
                "Plastik ipler",
                "Dişli çarklar ve bakır miller",
                "Büyük tahta çiviler",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Haritaya göre Cezeri bu büyük robot icatlarını ülkemizin hangi tarihi bölgesinde (Güneydoğu Anadolu - Diyarbakır/Mardin) somut olarak üretmiştir?",
              options: [
                "Marmara Bölgesi'nde",
                "Artuklu Devleti sarayında (Cizre/Diyarbakır hattı)",
                "Ege kıyılarında",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Cezeri'nin abdest almak için padişahlara yaptığı, su döken ve havlu uzatan otomatik icadın adı nedir?",
              options: [
                "Çamaşır makinesi",
                "Otomatik abdest alma robotu (Tavus kuşlu leğen)",
                "Elektrikli süpürge",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir öğrenci Cezeri'nin sekiz yüz yıl önceki robot çizimlerine baktığında Türk bilim tarihi hakkında neyi anlar?",
              options: [
                "Teknolojide çok geri kaldığımızı",
                "Türk İslam dünyasının geçmişte bilimde, robotikte ve mühendislikte dünyaya öncülük ettiğini",
                "Çizimlerin sadece resim dersi için yapıldığını",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Robot Bilimci Boşluk Doldurma",
          desc: "Boşluk doldurma sorularını tamamlayınız.",
          questions: [
            { words: ["Cezeri", "Harezmi"], correct: "Cezeri" },
            { words: ["Filli", "Kuşlu"], correct: "Filli" },
            { words: ["su", "rüzgar"], correct: "su" },
            { words: ["dişli", "düz"], correct: "dişli" },
            { words: ["sibernetiğin", "matematiğin"], correct: "sibernetiğin" },
            { words: ["abdest", "yemek"], correct: "abdest" },
            { words: ["kitabında", "kutusunda"], correct: "kitabında" },
            { words: ["Artuklu", "Osmanlı"], correct: "Artuklu" },
            { words: ["bilyeler", "taşlar"], correct: "bilyeler" },
            { words: ["ilham", "engel"], correct: "ilham" },
          ],
        },
      },
    },
  },
  "28": {
    story: {
      title: "KAYIP ÇİVİNİN ÖYKÜSÜ",
      theme: "Usta / İnovasyon",
      text: "Eren, odasındaki ahşap çalışma masasının çekmecesini açtığında rayların yerinden çıktığını gördü. Çekmeceyi düzeltmek için köşedeki tahta bölmeyi küçük bir metal çiviyle sabitlemesi gerekiyordu. Babasının eski alet kutusunu önüne çekti ve içindeki vidaları, çekiçleri tek tek aradı. Kutunun en altına kadar bakmasına rağmen aradığı boyutta hiçbir küçük çivi bulamadı. Çekmece tamir edilmezse içindeki bütün boya kalemleri ve defterler yere dökülecekti. Eren durup biraz düşündü ve etrafındaki nesneleri inceleyerek yaratıcı bir çözüm aradı. Masasının üzerindeki şeffaf kutuda duran metal, bükülebilen ataçlar dikkatini çekti. Eline kalın bir ataç aldı ve onu sertçe bükerek düz uzun bir tel haline getirdi. Bu teli çekmecenin kırık olan deliğinden geçirip arkasından penseyle sımsıkı kıvırdı. Ataç, tıpkı güçlü bir çivi gibi tahtaları birbirine mükemmel bir şekilde bağlamıştı. Çekmeceyi yavaşça ittiğinde raylar hiç takılmadan pürüzsüzce kayarak kapandı. Eren, bir ihtiyacın insanı nasıl yeni fikirler üretmeye zorladığını anladı. Gerçek çözümlerin sadece hazır malzemelerle değil, hayal gücüyle üretildiğini anladı. KOwn yaptığı bu minik kilitleme sistemine bakarak büyük bir mucit gibi gülümsedi.",
      questions: [
        {
          id: 1,
          q: "Eren çalışma masasının çekmecesini açınca neyi fark etti?",
          options: [
            "İçindeki kitapların kaybolduğunu",
            "Rayların yerinden çıktığını",
            "Çekmecenin boyasının döküldüğünü",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Eren çekmeceyi sabitlemek için ilk olarak ne aradı?",
          options: [
            "Büyük plastik bir yapıştırıcı",
            "Küçük bir metal çivi",
            "Uzun mavi bir ip",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "Eren çivi bulmak için neyi önüne doğru çekti?",
          options: [
            "Kendi okul çantasını",
            "Babasının eski alet kutusunu",
            "Kitaplığın en alt rafındaki kutuyu",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Çekmece tamir edilmezse ne olacaktı?",
          options: [
            "Masanın lambası kırılacaktı",
            "İçindeki bütün boya kalemleri ve defterler yere dökülecekti",
            "Masanın ayağı tamamen kopacaktı",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Eren masanın üzerindeki şeffaf kutuda ne gördü?",
          options: [
            "Renkli silgiler",
            "Metal, bükülebilen ataçlar",
            "Küçük kurşun kalemler",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Eren atacı çivi yerine kullanmak için ona ne yaptı?",
          options: [
            "Atacı kırmızı boyayla boyadı",
            "Sertçe bükerek düz uzun bir tel haline getirdi",
            "Atacı çekiçle ezerek kırdı",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Eren ataç telini delikten geçirdikten sonra neyle kıvırdı?",
          options: ["Büyük bir makasla", "Penseyle", "Kendi elleriyle hafifçe"],
          correct: 1,
        },
        {
          id: 8,
          q: "Tamir bittikten sonra çekmece nasıl kapandı?",
          options: [
            "Halen takılıyordu ve kapanmıyordu",
            "Hiç takılmadan pürüzsüzce kayarak kapandı",
            "Gürültülü bir ses çıkararak kırıldı",
          ],
          correct: 1,
        },
        {
          id: 9,
          q: "Eren bu deneyim sonucunda çözümlerle ilgili neyi anladı?",
          options: [
            "Sadece marketten alınan yeni mallarla tamir yapılacağını",
            "Gerçek çözümlerin hayal gücüyle üretildiğini",
            "Çekmecelerin hiçbir zaman tamir edilemeyeceğini",
          ],
          correct: 1,
        },
        {
          id: 10,
          q: "Hikayenin sonunda Eren kendine bakarak ne hissetti?",
          options: [
            "İş yapmaktan çok yorulduğunu hissetti",
            "Büyük bir mucit gibi gülümsedi",
            "Çiviyi bulamadığı için üzüldü",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "💥 Doğanın Kendi Sesi!",
        rules: [
          {
            name: "Yansıma Sözcükler",
            desc: "Doğada duyduğumuz somut nesnelerin, hayvanların veya hareketlerin çıkardığı seslerin taklit edilmesiyle kurulan kelimelere denir.",
            example: "tık, hışır hışır, miyav.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Sesi Duy",
        desc: "Aşağıdaki cümlelerde geçen yansıma sözcüğü (doğadaki taklit sesi) seçeneklerden bulunuz.",
        questions: [
          {
            id: 1,
            q: "\"Çınar'ın küçük metal küreği sert bir taşa çarpınca 'tık' diye bir ses çıkardı.\" cümlesindeki yansıma sözcük hangisidir?",
            options: ["kürek", "tık", "ses"],
            correct: 1,
          },
          {
            id: 2,
            q: '"Sonbahar rüzgarı esince meşe ağacının kuru yaprakları hışır hışır döküldü." cümlesindeki yansıma sözcük hangisidir?',
            options: ["rüzgarı", "meşe", "hışır hışır"],
            correct: 2,
          },
          {
            id: 3,
            q: '"Eren tamir yaparken elindeki ağır çekiç tahtaya çat diye vurdu." cümlesindeki yansıma sözcük hangisidir?',
            options: ["çekiç", "çat", "tahtaya"],
            correct: 1,
          },
          {
            id: 4,
            q: '"Odasındaki balon birden pat diye patlayınca Murat çok korktu." cümlesindeki yansıma sözcük hangisidir?',
            options: ["pat", "balon", "korktu"],
            correct: 0,
          },
          {
            id: 5,
            q: '"Mutfaktaki eski musluktan sabahtan beri şırıl şırıl su akıyordu." cümlesindeki yansıma sözcük hangisidir?',
            options: ["musluktan", "su", "şırıl şırıl"],
            correct: 2,
          },
          {
            id: 6,
            q: '"Bahçe kapısının arkasındaki küçük köpek gürültüye karşı hav hav havladı." cümlesindeki yansıma sözcük hangisidir?',
            options: ["hav hav", "köpek", "gürültüye"],
            correct: 0,
          },
          {
            id: 7,
            q: '"Dışarıdaki şiddetli yağmur damlaları pencerenin camına tıkır tıkır vuruyordu." cümlesindeki yansıma sözcük hangisidir?',
            options: ["yağmur", "tıkır tıkır", "camına"],
            correct: 1,
          },
          {
            id: 8,
            q: '"Yaz gecesi ormanda yürürken kuru dallar ayağımızın altında çıtır çıtır kırıldı." cümlesindeki yansıma sözcük hangisidir?',
            options: ["ormanda", "dallar", "çıtır çıtır"],
            correct: 2,
          },
          {
            id: 9,
            q: '"Arıların kovanından sabahtan beri vızır vızır sesler yükseliyordu." cümlesindeki yansıma sözcük hangisidir?',
            options: ["vızır vızır", "kovanından", "sesler"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Soba gürül gürül yanarken odanın içi sıcacık oldu." cümlesindeki yansıma sözcük hangisidir?',
            options: ["gürül gürül", "soba", "sıcacık"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Doğru Sesi Seç",
        desc: "Cümlelerdeki boşluklara nesnelerin çıkardığı seslere uygun olan doğru yansıma sözcüğü yerleştiriniz.",
        questions: [
          { words: ["küt", "şırıl"], correct: "küt" },
          { words: ["çatır", "şırıl şırıl"], correct: "şırıl şırıl" },
          { words: ["hışır hışır", "hav hav"], correct: "hışır hışır" },
          { words: ["şırıl", "tıkır"], correct: "tıkır" },
          { words: ["vız vız", "çat çat"], correct: "vız vız" },
          { words: ["tık tık", "çıtır çıtır"], correct: "çıtır çıtır" },
          { words: ["güm", "fısıl"], correct: "güm" },
          { words: ["çat", "şırıl"], correct: "çat" },
          { words: ["fıkır fıkır", "hışır hışır"], correct: "fıkır fıkır" },
          { words: ["miyav miyav", "vız vız"], correct: "miyav miyav" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Sıfırı Keşfeden Deha: Harezmi",
          rules: [
            {
              name: "Matematik Sayıları ve Sıfır (0) Logosu",
              desc: "Bilim haritasında 28. Sandık açıldığında, etrafında binlerce rakam çizgisi olan ve tam ortada kırmızı bir daire olarak parıldayan Sıfır (0) sayısı resmi görülür; bu ünlü matematikçimiz Harezmi'nin dünyaya hediyesidir. Harezmi, sıfır sayısını ilk kez matematik işlemlerinde somut bir rakam olarak kullanmıştır.",
              example: "",
            },
            {
              name: 'Denklem ve "X" İşareti Çizimleri',
              desc: 'Sayfa üzerinde yan yana dizilmiş toplama, çıkarma çizgileri ve bilinmeyen sayıları simgeleyen büyük "X" harfi resimleri yer alır. Harezmi, matematiğin kilit bir dalı olan Cebir biliminin kurucusudur. İki bilinmeyenli somut denklemleri çözerek günümüzdeki bilgisayar kodlarının çalışma mantığını bin yıl önce inşa etmiştir.',
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Harezmi ve Matematik Testi",
          desc: "Türkiye'nin dünyadaki konumuyla ilgili soruları dikkatlice okuyup doğru seçeneği işaretleyiniz.",
          questions: [
            {
              id: 1,
              q: 'Bin yıl önce yaşamış, matematik derslerinde kullandığımız "Sıfır (0)" sayısını dünyaya somut bir rakam olarak tanıtan büyük Türk bilim insanımız kimdir?',
              options: ["Cezeri", "Harezmi", "Aziz Sancar"],
              correct: 1,
            },
            {
              id: 2,
              q: 'Harezmi\'nin haritada denklemlerle ve "X" işaretleriyle gösterilen, kurucusu olduğu kilit matematik dalının adı nedir?',
              options: [
                "Geometri",
                "Cebir (Denklem Bilimi)",
                "Heceleme Bilgisi",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Harezmi keşfetmeden önce dünya genelinde matematik sayımları yapılırken hangi rakam hiç yoktu ve yeri boş bırakılıyordu?",
              options: ["Beş (5)", "Sıfır (0)", "Dokuz (9)"],
              correct: 1,
            },
            {
              id: 4,
              q: 'Bugün bilgisayarların, akıllı telefonların çalışmasını sağlayan "Algoritma" (adım adım çözüm) sisteminin ilk kurucusu kimdir?',
              options: ["Cezeri", "Harezmi", "Alper Gezeravcı"],
              correct: 1,
            },
            {
              id: 5,
              q: "Matematik haritasında bilinmeyen sayıları bulmak için kullanılan ve Harezmi'nin sistemine dayanan ünlü harf simgesi hangisidir?",
              options: ["A harfi", "X işareti (Bilinmeyen simgesi)", "Z harfi"],
              correct: 1,
            },
            {
              id: 6,
              q: "Harezmi'nin sıfır sayısını işlemlere dahil etmesinin matematiğe sağladığı en büyük somut kolaylık hangisidir?",
              options: [
                "Sayıların tamamen silinmesini sağlaması",
                "Çok büyük sayıların yazılmasını, çarpma ve bölme işlemlerinin kolayca yapılmasını sağlaması",
                "Sayıların sadece kışın kullanılmasını sağlaması",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Bilim tarihindeki kilit bilgilere göre Harezmi o dönem dünyadaki en büyük kütüphane olan Bağdat'taki hangi merkezde çalışmıştır?",
              options: [
                "Rasathane kulesinde",
                "Beytü'l-Hikme (Bilgelik Evi) kütüphanesinde",
                "Savaş çadırında",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Harezmi'nin ismi Avrupa'daki matematik kitaplarına geçince onun kurduğu sistem hangi yabancı kelimeye dönüşmüştür?",
              options: [
                "Matematik",
                "Algoritma (Harezmi'nin adından türetilmiştir)",
                "Pusula",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Harezmi sadece matematikle değil, gökyüzünü inceleyen hangi bilim dalıyla da ilgilenip haritalar çizmiştir?",
              options: [
                "Tıp bilimiyle",
                "Astronomi (Gökbilim) ve Coğrafya ile",
                "Sadece müzikle",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Bir öğrenci matematik dersinde sıfır (0) rakamını her yazdığında Türk bilim tarihi hakkında neyi hatırlamalıdır?",
              options: [
                "Sayıların çok sıkıcı olduğunu",
                "Dünyadaki tüm matematik hesaplarının bizim bilim insanlarımızın keşifleriyle büyüdüğünü",
                "Sıfırın hiçbir değerinin olmadığını",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Matematik Dehası Boşluk Doldurma",
          desc: "Boşluk doldurma sorularını tamamlayınız.",
          questions: [
            { words: ["Harezmi", "Cezeri"], correct: "Harezmi" },
            { words: ["Cebir", "Geometri"], correct: "Cebir" },
            { words: ["sıfır", "bir"], correct: "sıfır" },
            { words: ["algoritma", "ebru"], correct: "algoritma" },
            { words: ["Evi'nde", "Sarayı'nda"], correct: "Evi'nde" },
            { words: ["kolay", "imkansız"], correct: "kolay" },
            { words: ["astronomi", "müzik"], correct: "astronomi" },
            { words: ["X", "A"], correct: "X" },
            { words: ["dünya", "hiçbir"], correct: "dünya" },
            { words: ["zeka", "engel"], correct: "zeka" },
          ],
        },
      },
    },
  },
  "29": {
    story: {
      title: "SUSKUN GÜN",
      theme: "Usta / Kelimelerin Gücü",
      text: "Sinan, salı sabahı uyandığında boğazında acı hissetti ve konuşmaya çalıştı. Ancak ağzından hiçbir ses çıkmadı çünkü dünkü soğuk rüzgar yüzünden ses telleri tamamen kısılmıştı. Annesi yanına gelerek ona sıcak bir ıhlamur verdi ve bugün hiç konuşmaması gerektiğini söyledi. Sinan için konuşmadan geçecek bu suskun gün tam olarak o an başladı. Kahvaltıda masada duran sürahiden su istemek istedi ama sesini kullanamadı. Parmağıyla bardağı ve sürahiyi işaret ederek annesine ne istediğini zorlukla anlattı. Öğleden sonra arkadaşı Can kapıyı çaldı ve elindeki futbol topunu göstererek onu çağırdı. Sinan dışarı çıkamayacağını anlatmak için elini salladı ve boynuna yün atkısını sardı. Kelimeler olmadan sadece el hareketleriyle ve çizimlerle anlaşmanın ne kadar yorucu olduğunu fark etti. Gün boyunca içindeki neşeli düşünceleri arkadaşlarıyla paylaşamadığı için caddeleri sessizce izledi. Akşam olup babası eve geldiğinde Sinan'ın boğazındaki çoktan acı azalmıştı. Derin bir nefes alarak ağzından 'Merhaba baba!' sözünü neşeyle ve yüksek sesle çıkardı. Sesini yeniden kullanabildiği an, kelimelerin insanlar arasında köprü kuran ne kadar büyük bir güç olduğunu anladı. Dilin ve konuşmanın hayatımızı kolaylaştıran sihirli bir hazine olduğunu bilerek kelimelerine sarıldı.",
      questions: [
        {
          id: 1,
          q: "Sinan salı sabahı uyandığında neresinde somut bir acı hissetti?",
          options: ["Başında", "Boğazında", "Karnında"],
          correct: 1,
        },
        {
          id: 2,
          q: "Sinan'ın sesinin kısılmasının temel sebebi neydi?",
          options: [
            "Çok fazla dondurma yemesi",
            "Dünkü soğuk rüzgar yüzünden ses tellerinin kısılması",
            "Çok yüksek sesle şarkı söylemesi",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "Annesi iyileşmesi için Sinan'a ne verdi?",
          options: [
            "Soğuk bir meyve suyu",
            "Sıcak bir ıhlamur",
            "Büyük bir bardak süt",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Sinan kahvaltıda sürahiden su istemek için ne yaptı?",
          options: [
            "Yüksek sesle bağırdı",
            "Parmağıyla bardağı ve sürahiyi işaret etti",
            "Masaya parmağıyla yazı yazdı",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Arkadaşı Can elindeki hangi somut nesneyle Sinan'ı çağırdı?",
          options: ["Renkli uçurtmayla", "Futbol topuyla", "Oyuncak arabayla"],
          correct: 1,
        },
        {
          id: 6,
          q: "Sinan dışarı çıkamayacağını Can'a hangi somut hareketle gösterdi?",
          options: [
            "Kapıyı tamamen kapatarak",
            "Elini sallayıp boynuna yün atkısını sararak",
            "Kağıda resim çizerek",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Sinan gün boyunca kelimeler olmadan anlaşırken neyi fark etti?",
          options: [
            "Sessiz kalmanın çok eğlenceli olduğunu",
            "El hareketleriyle anlaşmanın ne kadar yorucu olduğunu",
            "Resim çizmenin çok zor olduğunu",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Sinan akşam babası eve geldiğinde ağzından hangi kelimeleri çıkardı?",
          options: [
            "Ben çok hastayım",
            "Merhaba baba!",
            "Bana su verir misin?",
          ],
          correct: 1,
        },
        {
          id: 9,
          q: "Sinan sesini yeniden kullanınca kelimelerle ilgili neyi anladı?",
          options: [
            "Kelimelerin sadece okulda gerekli olduğunu",
            "İnsanlar arasında köprü kuran ne kadar büyük bir güç olduğunu",
            "Konuşmanın insanı çok yorduğunu",
          ],
          correct: 1,
        },
        {
          id: 10,
          q: "Hikayenin sonunda dil ve konuşma neye benzetilmiştir?",
          options: [
            "Büyük renkli bir kaleye",
            "Hayatımızı kolaylaştıran sihirli bir hazineye",
            "Sonu olmayan uzun bir yola",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🔗 Yapışkan mı, Özgür mü?",
        rules: [
          {
            name: "Bağlaç olan de ve ki",
            desc: 'Cümleye "bile, dahi" anlamı katan "de" ile iki cümleyi bağlayan "ki" ayrı yazılır.',
            example: "Sinan da bizimle oynayacak.",
          },
          {
            name: "Ek olan de ve ki",
            desc: 'Bulunma bildiren "-de" ile aitlik bildiren "-ki" bitişik yazılır.',
            example: "Kalemim odada kalmış.",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Doğru Yazım Avcısı",
        desc: 'Seçeneklerde "de" ve "ki"nin yazımı tamamen doğru olan cümleyi bularak işaretleyiniz.',
        questions: [
          {
            id: 1,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Çınar da dedesiyle bahçede toprağı kazıyordu.",
              "Çınarda dedesiyle bahçede toprağı kazıyordu.",
              "Çınar da dedesiyle bahçe de toprağı kazıyordu.",
            ],
            correct: 0,
          },
          {
            id: 2,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Masadaki büyüteç sapı siyah bir nesneydi.",
              "Masa daki büyüteç sapı siyah bir nesneydi.",
              "Masadaki büyüteç sapı siyah bir nesneydide.",
            ],
            correct: 0,
          },
          {
            id: 3,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Anladımki kelimeler bizim en büyük hazinemizdir.",
              "Anladım ki kelimeler bizim en büyük hazinemizdir.",
              "Anladım ki kelimeler bizim enbüyük hazinemizdir.",
            ],
            correct: 1,
          },
          {
            id: 4,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Eren de alet kutusunda küçük çivi aradı.",
              "Erende alet kutusunda küçük çivi aradı.",
              "Eren de alet kutusun da küçük çivi aradı.",
            ],
            correct: 0,
          },
          {
            id: 5,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Bahçede ki yaşlı meşe ağacı yüz yaşındaydı.",
              "Bahçedeki yaşlı meşe ağacı yüz yaşındaydı.",
              "Bahçedeki yaşlı meşe ağacı yüz yaşındaydı da.",
            ],
            correct: 1,
          },
          {
            id: 6,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Sinanın boğazı da sabahtan beri çok ağrıyordu.",
              "Sinan'ın boğazı da sabahtan beri çok ağrıyordu.",
              "Sinan'ın boğazıda sabahtan beri çok ağrıyordu.",
            ],
            correct: 1,
          },
          {
            id: 7,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Öyle büyük bir hazine ki altınlar onun yanında sönük kalır.",
              "Öyle büyük bir hazineki altınlar onun yanında sönük kalır.",
              "Öyle büyük bir hazine ki altınlarda onun yanında sönük kalır.",
            ],
            correct: 0,
          },
          {
            id: 8,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Murat tavan arasında ki eski sandığı büyük güçle açtı.",
              "Murat tavan arasındaki eski sandığı büyük güçle açtı.",
              "Murat tavanarasındaki eski sandığı büyük güçle açtı.",
            ],
            correct: 1,
          },
          {
            id: 9,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Pelin de okul bahçesinde kırmızı çizgili bir cüzdan gördü.",
              "Pelinde okul bahçesinde kırmızı çizgili bir cüzdan gördü.",
              "Pelin de okul bahçesinde kırmızı çizgili bir cüzdan gördüde.",
            ],
            correct: 0,
          },
          {
            id: 10,
            q: "Hangi cümlenin yazımı tamamen doğrudur?",
            options: [
              "Kutuda ki piller bittiği için yarış arabası dönmedi.",
              "Kutudaki piller bittiği için yarış arabası dönmedi.",
              "Kutudaki piller bittiğiiçin yarış arabası dönmedi.",
            ],
            correct: 1,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Yapışkan mı Özgür mü?",
        desc: 'Cümlelerde altı çizili olan "de/da" ve "ki"lerin ayrı mı bitişik mi yazılması gerektiğini eşleştiriniz.',
        questions: [
          {
            words: ["Masadaki", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Bitişik Yazılır",
          },
          {
            words: ["Murat da", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Ayrı Yazılır",
          },
          {
            words: ["Bahçede", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Bitişik Yazılır",
          },
          {
            words: ["Öyle hızlı koştu ki", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Ayrı Yazılır",
          },
          {
            words: ["sendeki", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Bitişik Yazılır",
          },
          {
            words: ["Balkonda", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Bitişik Yazılır",
          },
          {
            words: ["kurabiyeler de", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Ayrı Yazılır",
          },
          {
            words: ["saat de", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Ayrı Yazılır",
          },
          {
            words: ["Kilerdeki", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Bitişik Yazılır",
          },
          {
            words: ["Demek ki", "Bitişik Yazılır", "Ayrı Yazılır"],
            correct: "Ayrı Yazılır",
          },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Nobel Ödüllü Gururumuz: Aziz Sancar",
          rules: [
            {
              name: "Mikroskop ve DNA Sarmal Çizgileri",
              desc: "Modern bilim şablonunda 29. Sandık açıldığında, bir laboratuvar masası, üzerinde mercekli bir mikroskop ve birbirine dolanmış renkli şeritler gibi duran DNA sarmalı resmi görülür; bu bizim yaşayan büyük bilim insanımız Aziz Sancar'ın çalışma alanıdır. Haritada onun Mardin'in Savur ilçesinden başlayıp tüm dünyaya uzanan başarı çizgisi yer alır.",
              example: "",
            },
            {
              name: "Altın Nobel Madalyası Logosu",
              desc: "Sayfanın tam ortasında, üzerinde büyük bilim insanlarının resmi olan parıltılı altın bir Nobel Kimya Ödülü madalyası çizilidir. Aziz Sancar, hücrelerin hasar gören DNA'ları nasıl tamir ettiğini somut olarak haritalandırarak bu büyük ödülü kazanan ilk Türk bilim insanı olmuştur.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Aziz Sancar ve Kimya Testi",
          desc: "Türkiye'nin dünyadaki konumuyla ilgili soruları dikkatlice okuyup doğru seçeneği işaretleyiniz.",
          questions: [
            {
              id: 1,
              q: "2015 yılında Kimya alanında dünyadaki en büyük bilim ödülü olan Nobel Ödülü'nü kazanarak göğsümüzü kabartan modern bilim insanımız kimdir?",
              options: ["Cezeri", "Prof. Dr. Aziz Sancar", "Harezmi"],
              correct: 1,
            },
            {
              id: 2,
              q: "Aziz Sancar'ın laboratuvarda mikroskop altında yıllarca incelediği, vücudumuzun şifrelerini barındıran renkli sarmal yapıların adı nedir?",
              options: [
                "Kan hücreleri",
                "DNA (Genetik bağlar)",
                "Kemik dokusu",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "Haritadaki o parlak altın renkli Nobel madalyası simgesi Aziz Sancar'a hangi bilim dalında yaptığı keşifler için verilmiştir?",
              options: ["Matematik", "Kimya", "Tarih"],
              correct: 1,
            },
            {
              id: 4,
              q: "Aziz Sancar'ın dünya tıp bilimine sağladığı en büyük somut başarı aşağıdakilerden hangisidir?",
              options: [
                "Yeni bir mikroskop icat etmesi",
                "Hücrelerin hasar gören DNA'ları nasıl tamir ettiğini somut olarak haritalandırması ve açıklaması",
                "Sadece yeni ilaç kutuları tasarlaması",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Coğrafya haritasına göre Aziz Sancar, Türkiye'nin hangi tarihi taş evleriyle ünlü güneydoğu şehrinde doğup büyümüştür?",
              options: ["İzmir", "Mardin (Savur ilçesi)", "Trabzon"],
              correct: 1,
            },
            {
              id: 6,
              q: "Aziz Sancar, kazandığı o büyük altın Nobel madalyasını somut olarak nereye hediye etmiş ve milletine teslim etmiştir?",
              options: [
                "Amerika'daki kütüphaneye",
                "Ankara'daki Anıtkabir Müzesi'ne (Atatürk'e ve milletine bağlılığından dolayı)",
                "Kendi evindeki çekmeceye",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Aziz Sancar'ın genç öğrencilere başarılı olmak için verdiği en kilit somut öğüt hangisidir?",
              options: [
                '"Çok şanslı olmaya çalışın."',
                '"Zekaya güvenmeyin, her şeyin temeli çalışmaktır. Emek verin."',
                '"Sadece tatil günlerinde çalışın."',
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Haritadaki laboratuvar cam tüpleri ve DNA çizgileri Aziz Sancar'ın en çok hangi kötü hastalıkla mücadele için bilim ürettiğini gösterir?",
              options: [
                "Grip hastalığı",
                "Kanser hastalığı ve hücre tedavileri",
                "Sadece boğaz ağrısı",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Bir Türk bilim insanının Nobel Ödülü alması okuldaki çocuklar üzerinde nasıl bir etki yaratır?",
              options: [
                "Bilim yapmanın imkansız olduğunu düşünmelerine yol açar.",
                "Büyük bir gurur, özgüven ve gelecekte dünya çapında bilim insanı olma ilhamı verir.",
                "Sadece laboratuvardan korkmalarına neden olur.",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: "Aziz Sancar'ın hayat grafiğindeki o zor şartlardan gelip dünya zirvesine çıkış çizgisi onun hangi özelliğidir?",
              options: [
                "Çok çabuk pes ettiğini gösterir.",
                "Büyük bir azim, kararlılık, vatan sevgisi ve durmaksızın çalışma disiplini gösterir.",
                "Sadece şanslı olduğunu anlatır.",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Nobel Ödüllü Deha Boşluk Doldurma",
          desc: "Boşluk doldurma sorularını tamamlayınız.",
          questions: [
            { words: ["Sancar", "Akif"], correct: "Sancar" },
            { words: ["DNA", "Kan"], correct: "DNA" },
            { words: ["Nobel", "Olimpiyat"], correct: "Nobel" },
            { words: ["DNA", "Kemik"], correct: "DNA" },
            { words: ["Mardin", "Antalya"], correct: "Mardin" },
            { words: ["Anıtkabir", "Meclis"], correct: "Anıtkabir" },
            { words: ["kanser", "nezle"], correct: "kanser" },
            { words: ["çalışmak", "uyumak"], correct: "çalışmak" },
            { words: ["araştırma", "eğlence"], correct: "araştırma" },
            { words: ["büyükçe", "hiç"], correct: "büyükçe" },
          ],
        },
      },
    },
  },
  "30": {
    story: {
      title: "DÜNYANIN EN BÜYÜK HAZİNESİ",
      theme: "Usta / Büyük Final",
      text: "Murat, hafta sonu evlerinin tavan arasındaki eski ahşap dolapları merakla temizliyordu. En karanlık köşede, üzerinde demir kalın bir kilit olan eski bir sandık buldu. Sandığın ağır kapağını iki eliyle somut olarak kavradı ve büyük bir güçle yukarı doğru çekti. İçinden parlak altınlar veya parıltılı elmaslar çıkacağını umarak heyecanla içeriye baktı. Ancak sandığın en altında sadece eski, sararmış sayfaları olan kalın, resimli bir kitap duruyordu. Murat ilk başta aradığı şeyi bulamadığı için somut olarak biraz hayal kırıklığı yaşadı. Tozlu kitabı eline aldı, kapağını açtı ve masanın üzerindeki ışığın altına geçip okumaya başladı. Kitabın sayfalarında dünyanın harika nehirleri, dev dağları ve gökyüzündeki eski yıldızların bilgileri yazıyordu. Murat sayfaları tek tek çevirip yeni bilgiler öğrendikçe zihninde yepyeni dünyalar açıldığını hissetti. Okuduğu her cümle, onu altınlardan çok daha zengin bir hayal gücüne ve bilgelere doğru taşıyordu. Gerçek büyük hazinenin parlak metaller değil, insanın zihnini büyüten 'bilgi' olduğunu somut olarak anladı. Kitabı göğsüne sımsıkı bastırarak tavan arasından odasına doğru neşeyle indi. Türkçe Hazinesi'nin bu en son sandığında bulduğu şey, onun hayatı boyunca taşıyacağı en büyük güç olacaktı. Murat artık her kitabın arkasında saklı duran o gerçek büyük hazineyi aramaya tamamen hazırdı.",
      questions: [
        {
          id: 1,
          q: "Murat tavan arasında ne yapıyordu?",
          options: [
            "Eski oyuncaklarını tamir ediyordu",
            "Eski ahşap dolapları merakla temizliyordu",
            "Resim defterine büyük bir ev çiziyordu",
          ],
          correct: 1,
        },
        {
          id: 2,
          q: "Murat'ın bulduğu eski sandığın üzerinde ne vardı?",
          options: [
            "Renkli büyük pullar",
            "Demir kalın bir kilit",
            "Siyah eski bir kumaş",
          ],
          correct: 1,
        },
        {
          id: 3,
          q: "Murat sandığın içinden ilk başta ne çıkacağını umuyordu?",
          options: [
            "Eski model oyuncak arabalar",
            "Parlak altınlar veya parıltılı elmaslar",
            "Renkli boya kutuları",
          ],
          correct: 1,
        },
        {
          id: 4,
          q: "Sandık açılınca içinden somut olarak ne çıktı?",
          options: [
            "Demir bir anahtar",
            "Eski, sararmış sayfaları olan kalın, resimli bir kitap",
            "Büyük bir dünya haritası",
          ],
          correct: 1,
        },
        {
          id: 5,
          q: "Murat sandığın içinde sadece kitap görünce ilk olarak ne yaşadı?",
          options: [
            "Çok büyük bir sevinç çığlığı attı",
            "Somut olarak biraz hayal kırıklığı yaşadı",
            "Korktu ve sandığı hemen kapattı",
          ],
          correct: 1,
        },
        {
          id: 6,
          q: "Murat kitabı okumak için tavan arasında nereye geçti?",
          options: [
            "Kapının hemen arkasındaki karanlık köşeye",
            "Masanın üzerindeki ışığın altına",
            "Merdivenin en üst basamağına",
          ],
          correct: 1,
        },
        {
          id: 7,
          q: "Kitabın sayfalarında hangi harika bilgiler yazıyordu?",
          options: [
            "Eski oyunların kuralları ve hileleri",
            "Dünyanın nehirleri, dev dağları ve gökyüzündeki yıldızlar",
            "Evdeki dolapların nasıl temizleneceği",
          ],
          correct: 1,
        },
        {
          id: 8,
          q: "Murat sayfaları tek tek okudukça neyin açıldığını hissetti?",
          options: [
            "Tavan arasındaki pencerelerin",
            "Zihninde yepyeni dünyaların",
            "Sandığın gizli alt bölmesinin",
          ],
          correct: 1,
        },
        {
          id: 9,
          q: "Murat bu büyük final macerasında gerçek hazinenin ne olduğunu anladı?",
          options: [
            "Sandıktaki eski demir kilidin kendisi olduğunu",
            "İnsanın zihnini büyüten 'bilgi' olduğunu",
            "Sandığı bulduğu tavan arası odası olduğunu",
          ],
          correct: 1,
        },
        {
          id: 10,
          q: "Hikayenin sonunda Murat kitabı ne yaptı ve neye hazır hale geldi?",
          options: [
            "Sandığın içine geri bıraktı ve uyumaya gitti",
            "Göğsüne sımsıkı bastırarak odasına indi ve her kitaptaki hazineyi aramaya hazır oldu",
            "Arkadaşına hediye etmek için çantasına sakladı",
          ],
          correct: 1,
        },
      ],
    },
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "🏆 Büyük Final Kapısı!",
        rules: [
          {
            name: "Genel Tekrar",
            desc: "Bu son sandıkta, yolculuğumuz boyunca öğrendiğimiz bütün sihirli noktalama işaretlerini tek bir büyük arenada topluyoruz.",
            example: "",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Hangi İşaret?",
        desc: "Cümlelerde altı çizili veya boş bırakılan parantez içlerine gelmesi gereken en doğru işareti seçeneklerden bulunuz.",
        questions: [
          {
            id: 1,
            q: '"Murat tavan arasında eski bir sandık buldu( )" Cümlenin sonuna hangi işaret gelmelidir?',
            options: [". (Nokta)", "? (Soru İşareti)", "! (Ünlem İşareti)"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Eyvah( ) sandığın içinde hiç altın yokmuş!" Parantez içine hangi işaret gelmelidir?',
            options: [", (Virgül)", ". (Nokta)", "? (Soru İşareti)"],
            correct: 0,
          },
          {
            id: 3,
            q: '"Sandıktan şu nesneler çıktı( ) eski bir kitap, sararmış sayfalar." Parantez içine hangi işaret gelmelidir?',
            options: [
              "; (Noktalı Virgül)",
              ": (İki Nokta)",
              "! (Ünlem İşareti)",
            ],
            correct: 1,
          },
          {
            id: 4,
            q: '"Murat( )ın bulduğu tozlu kitabın kapağı çok kalındı." Cümledeki parantez yerine ne gelmelidir?',
            options: ["' (Kesme İşareti)", "- (Kısa Çizgi)", ", (Virgül)"],
            correct: 0,
          },
          {
            id: 5,
            q: '"Bu harika resimli kitabı sen mi okudun( )" Cümlenin sonuna hangi işaret gelmelidir?',
            options: [". (Nokta)", "? (Soru İşareti)", "! (Ünlem İşareti)"],
            correct: 1,
          },
          {
            id: 6,
            q: '"Kırtasiyeden defter( ) kalem ve silgi aldım." Parantez içine hangi işaret gelmelidir?',
            options: [", (Virgül)", ". (Nokta)", ": (İki Nokta)"],
            correct: 0,
          },
          {
            id: 7,
            q: '"Yaşasın( ) gerçek hazineyi kütüphanede buldum!" Parantez içine hangi işaret gelmelidir?',
            options: [", (Virgül)", "? (Soru İşareti)", ": (İki Nokta)"],
            correct: 0,
          },
          {
            id: 8,
            q: '"Ben bu sene okulda okuma yarışmasında 1( ) oldum." Parantez içine hangi işaret gelmelidir?',
            options: [". (Nokta)", ", (Virgül)", "' (Kesme İşareti)"],
            correct: 0,
          },
          {
            id: 9,
            q: '"Dün akşam Ankara( )dan teyzemler bize geldi." Parantez içine hangi işaret gelmelidir?',
            options: ["' (Kesme İşareti)", "- (Kısa Çizgi)", ", (Virgül)"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Mert, Can, Ömer erkekler( ) Elfe, Sıla, Zeynep ise kızlar grubundadır." Parantez içine hangi işaret gelmelidir?',
            options: ["; (Noktalı Virgül)", ": (İki Nokta)", ". (Nokta)"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Hepsini Yerleştir",
        desc: "Verilen cümlelerdeki parantezlerin içine sırasıyla gelmesi gereken noktalama işaretlerini bularak yerleştiriniz.",
        questions: [
          {
            words: ["Virgül", "Virgül", "Nokta"],
            correct: "Virgül Virgül Nokta",
          },
          { words: ["Kesme", "Kesme", "Nokta"], correct: "Kesme Kesme Nokta" },
          { words: ["Soru İşareti"], correct: "Soru İşareti" },
          { words: ["Virgül", "Ünlem"], correct: "Virgül Ünlem" },
          {
            words: ["İki Nokta", "Virgül", "Nokta"],
            correct: "İki Nokta Virgül Nokta",
          },
          { words: ["Nokta", "Nokta"], correct: "Nokta Nokta" },
          { words: ["Kesme", "Nokta"], correct: "Kesme Nokta" },
          {
            words: ["Virgül", "Noktalı Virgül", "Virgül", "Nokta"],
            correct: "Virgül Noktalı Virgül Virgül Nokta",
          },
          { words: ["Virgül", "Ünlem"], correct: "Virgül Ünlem" },
          { words: ["Virgül", "Nokta"], correct: "Virgül Nokta" },
        ],
      },
      country: {
        title: "Ülkemi Tanıyorum",
        info: {
          title:
            "📇 ÜLKEMİ ÖĞRENİYORUM KÜLTÜR KARTI: Gökyüzünü Aşan İlk Türk Astronot ve Bilgi Hazinesi",
          rules: [
            {
              name: "Beyaz Astronot Kıyafeti ve Dev Roket",
              desc: "Büyük final sandığında, üzerinde ay yıldızlı Türk bayrağı arması olan beyaz renkli bir astronot kıyafeti ve uzay boşluğuna doğru ateşlenen dev bir roket resmi görülür; bu ilk uzay misyonumuzu gerçekleştiren Alper Gezeravcı's somut görselidir. Alper Gezeravcı, gökyüzünü aşarak uzay istasyonuna giden ilk Türk astronot olarak tarihe geçmiştir. Uzayda Türk bilim insanları için tam 13 kilit bilimsel deney gerçekleştirmiştir.",
              example: "",
            },
            {
              name: "Bilgi ve Sandık Hazinesi",
              desc: "Sayfanın alt şeridinde, 1. Sandıktan 30. Sandığa kadar olan tüm coğrafya, tarih, kültür ve bilim logoları büyük bir daire içinde toplanmıştır. Tavan arasındaki o kilitli sandıktan çıkan en büyük ödül işte bu öğrenilen bilgilerdir. Haritadaki bu somut final çizgisi, Türk çocuklarının geçmişteki dehalardan (Cezeri, Harezmi) ve günümüzdeki kahramanlardan (Aziz Sancar, Alper Gezeravcı) ilham alarak geleceğin büyük hazinesini, yani bilgiyi taşımaya hazır olduğunu gösterir.",
              example: "",
            },
          ],
        },
        etkinlik2: {
          title: "🎯 ETKİNLİK 2: Uzay Misyonu ve Büyük Final Testi",
          desc: "Türkiye'nin dünyadaki konumuyla ilgili soruları dikkatlice okuyup doğru seçeneği işaretleyiniz.",
          questions: [
            {
              id: 1,
              q: "Üzerinde Türk bayrağı arması olan astronot kıyafetiyle uzay istasyonuna giderek ilk uzay misyonumuzu gerçekleştiren ilk Türk astronot kimdir?",
              options: ["Aziz Sancar", "Alper Gezeravcı", "Mehmet Akif Bey"],
              correct: 1,
            },
            {
              id: 2,
              q: "Alper Gezeravcı'nın dev roketle fırlatılarak gittiği, gökyüzünün çok yukarısında yer alan uluslararası merkezin adı nedir?",
              options: [
                "Meteoroloji İstasyonu",
                "Uluslararası Uzay İstasyonu (ISS)",
                "Havalimanı Kulesi",
              ],
              correct: 1,
            },
            {
              id: 3,
              q: "İlk Türk astronotumuz uzaydaki yerçekimsiz ortamda Türk bilim insanları ve üniversiteleri için toplam kaç tane bilimsel deney yapmıştır?",
              options: ["3", "13", "30"],
              correct: 1,
            },
            {
              id: 4,
              q: "Uzay haritasındaki ateşlenen dev roket resmi ülkemizin bilim ve teknolojide hangi alana resmi olarak adım attığını somutlaştırır?",
              options: [
                "Sadece denizcilik alanına",
                "Havacılık, uzay teknolojileri ve gelecek vizyonu alanına",
                "Çömlekçilik faaliyetlerine",
              ],
              correct: 1,
            },
            {
              id: 5,
              q: "Alper Gezeravcı uzay tünelinden dünyaya dönerken kurduğu ve tarihe geçen kilit cümle hangisidir?",
              options: [
                '"İstikbal göklerdedir!" (Atatürk\'ün sözüyle uzay misyonunu taçlandırmıştır)',
                '"Yarın okullar tatil olacak."',
                '"Bu sandığı tavan arasında saklayın."',
              ],
              correct: 0,
            },
            {
              id: 6,
              q: "Sandıktan 30. Sandığa kadar olan tüm bu Türkçe ve Ülkemi Öğreniyorum yolculuğunun çocuklar için en büyük somut kazancı hangisidir?",
              options: [
                "Sadece oyun skorları kazanmak",
                'Geleceğe yön verecek olan en büyük güç ve hazinenin "Bilgi ve Kültür" olduğunu somut olarak anlamak',
                "Şehirlerin sadece isimlerini ezberlemek",
              ],
              correct: 1,
            },
            {
              id: 7,
              q: "Haritadaki Cezeri'nin çarkları, Harezmi'nin sıfırı ve Alper Gezeravcı'nın roketi simgeleri yan yana gelince neyi ifade eder?",
              options: [
                "Bilimin sürekli değişip önemsizleştiğini",
                "Türk milletinin geçmişten geleceğe uzanan büyük bilim ve akıl bağını",
                "Sadece eski resimleri",
              ],
              correct: 1,
            },
            {
              id: 8,
              q: "Uzay kıyafetinin omzunda parıldayan kırmızı beyaz ay yıldızlı arma neyin simgesidir?",
              options: [
                "Sıradan bir kumaş parçasının",
                "Bağımsız Türkiye Cumhuriyeti devletinin ve milletimizin haklı gururunun",
                "Bir okulun logosunun",
              ],
              correct: 1,
            },
            {
              id: 9,
              q: "Bir öğrencinin uzay misyonu resimlerine bakarak kuracağı gelecek hedefi somut olarak nasıl olmalıdır?",
              options: [
                '"Uzaya gitmek çok zor, asla yapamam." demek',
                '"Ben de çok çalışarak gelecekte bilimde ve teknolojide ülkemi en üst seviyeye taşıyacağım." demek',
                "Bilim kitaplarını tamamen kapatmak",
              ],
              correct: 1,
            },
            {
              id: 10,
              q: ' "Türkçe Hazinesi" platformunun bu büyük final sandığı kapandığında ulaşılan gerçek somut hazine kutusundan ne çıkmıştır?',
              options: [
                "Parlak altın madenleri",
                'İnsanın zihnini büyüten, aydınlatan köklü "Bilgi, Dil ve Kültür Hazinesi"',
                "Boş bir kağıt parçası",
              ],
              correct: 1,
            },
          ],
        },
        etkinlik1: {
          title: "🎯 ETKİNLİK 1: Uzay ve Büyük Final Doğrulama",
          desc: "Boşluk doldurma sorularını tamamlayınız.",
          questions: [
            { words: ["Doğru", "Yanlış"], correct: "Doğru" },
            { words: ["Doğru", "Yanlış"], correct: "Yanlış" },
            { words: ["Doğru", "Yanlış"], correct: "Doğru" },
            { words: ["Doğru", "Yanlış"], correct: "Doğru" },
            { words: ["Doğru", "Yanlış"], correct: "Yanlış" },
            { words: ["Doğru", "Yanlış"], correct: "Doğru" },
            { words: ["Doğru", "Yanlış"], correct: "Yanlış" },
            { words: ["Doğru", "Yanlış"], correct: "Doğru" },
            { words: ["Doğru", "Yanlış"], correct: "Yanlış" },
            { words: ["Doğru", "Yanlış"], correct: "Doğru" },
          ],
        },
      },
    },
  },

  "tekrar-1": {
    country: {
      title: "Ülkemi Tanıyorum",
      info: {
        title:
          "📇 ÜLKEMİ ÖĞRENİYORUM SÜPER KÜLTÜR KARTI: Haritadaki İlk Coğrafi Adımlar",
        rules: [
          {
            name: "Dünyadaki Yerimiz ve Denizlerimiz (Sandık 1-2)",
            desc: "Dünya haritası açıldığında ülkemiz, üç tarafı mavi şeritlerle çevrili bir yarımada olarak görünür. Haritanın üstünde Karadeniz, altında Akdeniz, solunda Ege Denizi ve tamamen topraklarımızın içine saklanmış küçük bir havuz gibi duran Marmara Denizi olmak üzere 4 denizimiz (Mavi Vatanımız) yer alır. Ülkemiz, Asya ve Avrupa kıtalarını birleştiren kilit bir köprüdür.",
          },
          {
            name: "İklim Çeşitliliği ve Ege (Sandık 3-5)",
            desc: "Haritada aynı gün içinde bir yanda beyaz kar logoları, diğer yanda parlak sarı güneş ve deniz resimleri seçilebilir. Bu dört mevsimlik zengin iklim yapısı tarım çeşitliliğini artırır. Haritanın solundaki Ege Bölgesi'nde ise dağlar denize dik uzandığı için kıyı çizgisi çok girintili çıkıntılıdır ve zikzaklar çizer.",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Coğrafya Avı",
        desc: "Açıklama: Aşağıdaki cümlelerde boş bırakılan yerleri Kültür Kartı'ndaki harita bilgilerine uygun şekilde tamamlayınız.",
        questions: [
          {
            q: "Türkiye, haritadaki konumuna göre Asya ve Avrupa kara parçalarını birbirine bağlayan kilit bir ..... durumundadır.",
            words: ["köprü", "duvar"],
            correct: "köprü",
          },
          {
            q: "Tamamen Türkiye toprakları ve şehir çizgileriyle çevrelenmiş olan iç denizimiz ..... Denizi'dir.",
            words: ["Marmara", "Ege"],
            correct: "Marmara",
          },
          {
            q: "Bir bölgede kar resmi varken diğer bölgede insanların yüzebilmesi ülkemizin zengin ..... yapısının bir sonucudur.",
            words: ["iklim", "maden"],
            correct: "iklim",
          },
          {
            q: "Ege Bölgesi haritasında dağ çizgileri kıyı şeridine tam ..... bir şekilde uzanmaktadır.",
            words: ["dik", "paralel"],
            correct: "dik",
          },
          {
            q: "Üç tarafı mavi deniz şeritleriyle kaplı, bir ucu karaya bağlı olan coğrafi şekillere ..... adı verilir.",
            words: ["yarımada", "ada"],
            correct: "yarımada",
          },
          {
            q: "Haritanın en üst (kuzey) çizgisinde yer alan, hırçın dalga simgeleriyle betimlenen denizimiz ..... 'dir.",
            words: ["Karadeniz", "Akdeniz"],
            correct: "Karadeniz",
          },
          {
            q: "Türkiye'nin iklim haritasında yıl içinde ve bazen aynı dönemde ..... mevsimin özellikleri bir arada görülebilir.",
            words: ["dört", "iki"],
            correct: "dört",
          },
          {
            q: "Dağların dik uzanması sebebiyle Ege kıyıları düz değil, haritada oldukça ..... zikzaklar çizer.",
            words: ["girintili çıkıntılı", "düz ve dik"],
            correct: "girintili çıkıntılı",
          },
          {
            q: "Ülkemizin etrafındaki tüm deniz sularına, deniz altı kaynaklarına ve haklarımıza coğrafyada ..... Vatan denir.",
            words: ["Mavi", "Kara"],
            correct: "Mavi",
          },
          {
            q: "Ege'nin Akdeniz iklimiyle boyanmış tepelerinde yeşil zeytin ve kısa çalı resimlerinden oluşan ..... bitki örtüsü yer alır.",
            words: ["maki", "bozkır"],
            correct: "maki",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Büyük Karma Test",
        desc: "Açıklama: Karışık konulardan oluşan test sorularında harita özelliklerine dikkat ederek doğru seçeneği bulunuz.",
        questions: [
          {
            q: "Harita açıldığında Türkiye'nin sınırlarının kaç yönünün deniz sularıyla kaplandığı somut olarak sayılabilir?",
            options: ["İki", "Üç", "Dört"],
            correct: 1,
          },
          {
            q: "Marmara Denizi'nin uç kısımlarında yer alan, büyük gemi çizgilerinin geçtiği iki kilit su yolunun adı nedir?",
            options: [
              "İstanbul ve Çanakkale Boğazları",
              "Manavgat Şelalesi",
              "Van Gölü nehirleri",
            ],
            correct: 0,
          },
          {
            q: "İklim haritasındaki bu renk ve sembol çeşitliliği ülkemizde en çok hangi alanın bereketli olmasını sağlar?",
            options: [
              "Sadece tek bir ağaç türünün yetişmesini",
              "Birbirinden farklı meyve, sebze ve tarım ürünlerinin üretilmesini",
              "Denizlerin tamamen kurumasını",
            ],
            correct: 1,
          },
          {
            q: "Ege kıyı çizgilerinde yer alan dünyaca ünlü Efes ve Bergama gibi tarihi yerleşimlerin haritadaki ortak adı nedir?",
            options: ["Doğal şelale", "Antik kent", "Peri bacası"],
            correct: 1,
          },
          {
            q: "Türkiye Cumhuriyeti devletinin dünya haritasındaki yeri hangi iki dev kıtanın tam kesişim kavşağında durmaktadır?",
            options: ["Asya - Avrupa", "Afrika - Amerika", "Asya - Afrika"],
            correct: 0,
          },
          {
            q: "Haritanın solunda yer alan, kıvrımlı yapısı nedeniyle çok sayıda koy, körfez ve liman resmi bulunan deniz hangisidir?",
            options: ["Akdeniz", "Ege Denizi", "Marmara Denizi"],
            correct: 1,
          },
          {
            q: "Haritada her bölgenin üzerinde farklı meyve resimlerinin (muz, elma, fındık) bulunması ekonomimiz için neyi gösterir?",
            options: [
              "Ülkemizin tarım ve gıda yönünden çok zengin ve şanslı olduğunu",
              "Ülkede hiç yiyecek bulunamadığını",
              "Toprakların tamamen çölleştiğini",
            ],
            correct: 0,
          },
          {
            q: "Dağ çizgilerinin denize dik uzanmasının Ege'deki deniz havalarına sağladığı somut fayda hangisidir?",
            options: [
              "Denizden gelen ılık havanın iç kısımlara doğru kolayca ilerleyebilmesi",
              "İç kısımların tamamen buz tutması",
              "Deniz ticaretinin durması",
            ],
            correct: 0,
          },
          {
            q: 'Türkiye için kullanılan "Stratejik konum" ifadesi haritadaki bilgilere göre ne anlama gelmektedir?',
            options: [
              "Dünyadaki en soğuk yerde bulunduğunu",
              "Kıtalar ve denizler arasında çok değerli, merkezi ve kilit bir rolde olduğunu",
              "Sadece bir ada olduğunu",
            ],
            correct: 1,
          },
          {
            q: "Haritanın en alt çizgisinde yer alan, kıyılarında parlak güneş resimleri olan en sıcak denizimiz hangisidir?",
            options: ["Karadeniz", "Akdeniz", "Marmara Denizi"],
            correct: 1,
          },
        ],
      },
    },
    story: null as any,
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "📇 DİL BİLGİSİ SÜPER BİLGİ KARTI",
        rules: [
          {
            name: "Büyük ve Küçük Harfler",
            desc: "Cümle başları ve özel isimler (Antalya, Tekir, Ömer) her zaman Büyük harfle başlar!",
            example: "",
          },
          {
            name: "Hece Kavramı",
            desc: "Ağzımızın tek hareketiyle çıkan sestir. Ünlü harfleri (a, e, ı, i...) sayarak hece sayısını kolayca bulabilirsin! (Pen-ce-re = 3 hece)",
            example: "",
          },
          {
            name: "Alfabe Bilgisi",
            desc: "Alfabemizde 29 harf vardır. 8 tanesi ünlü (sesli), 21 tanesi ünsüz (sessiz) harftir.",
            example: "",
          },
          {
            name: "Harften Cümleye",
            desc: "Harfler birleşip heceyi, heceler kelimeyi, kelimeler ise tam bir iş ve hareket anlatan Cümleyi oluşturur!",
            example: "",
          },
          {
            name: "Alfabetik Sıralama",
            desc: "Kelimeleri sözlük sırasına dizerken ilk harflerine, eğer ilk harfler aynıysa hemen ikinci harflerine bakarız.",
            example: "",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Boşluk Doldurma (10 Soru)",
        desc: "Boşluk doldurma sorularını cevaplayınız.",
        questions: [
          {
            id: 1,
            q: "Önümüzdeki hafta sonu teyzemlerle birlikte ....zmir'e doğru yola çıkacağız.",
            options: ["İ", "i"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Kütüphane" kelimesinin doğru hecelenmiş hali "kü - tüp - .... - ne" şeklindedir.',
            options: ["ha", "ah"],
            correct: 0,
          },
          {
            id: 3,
            q: 'Alfabemizde "M" harfinden hemen önce gelen harf .... harfidir.',
            options: ["L", "N"],
            correct: 0,
          },
          {
            id: 4,
            q: '"Dün akşam kırtasiyeden yeni bir mavi boya...." ifadesi bir işi tam bitirmediği için cümle ....................',
            options: ["değildir.", "cümledir."],
            correct: 0,
          },
          {
            id: 5,
            q: '"Armut" kelimesi, alfabenin ilk harfiyle başladığı için sözlükte "Portakal" kelimesinden çok daha .................... bir sırada yer alır.',
            options: ["önce", "sonra"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Televizyon" kelimesinde tam 4 tane ünlü harf olduğu için bu kelime toplam .................... hecelidir.',
            options: ["4", "5"],
            correct: 0,
          },
          {
            id: 7,
            q: 'Alfabemizde tek başlarına ses çıkarabilen "A, E, I, İ, O, Ö, U, Ü" harflerine .................... harfler adı verilir.',
            options: ["ünlü (sesli)", "ünsüz (sessiz)"],
            correct: 0,
          },
          {
            id: 8,
            q: "Sınıfımıza yeni gelen sıra arkadaşımın adı ....eyda'dır.",
            options: ["Ş", "ş"],
            correct: 0,
          },
          {
            id: 9,
            q: "Kelimelerin yan yana gelerek kurallı bir cümle oluşturabilmesi için mutlaka anlamlı bir .................... bildirmesi gerekir.",
            options: ["duygu veya hareket", "sözlük sırası"],
            correct: 0,
          },
          {
            id: 10,
            q: 'İlk harfleri aynı olan "Bal" ve "Bebek" kelimelerini sözlük sırasına dizerken kelimelerin .................... harflerine bakarak karar veririz.',
            options: ["ikinci", "son"],
            correct: 0,
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Karma Test Arenası (10 Soru)",
        desc: "Doğru olan seçeneği tıklayıp seçiniz.",
        questions: [
          {
            q: "Hangi cümledeki büyük harflerin yazımıyla ilgili bir hata yapılmıştır?",
            words: [
              "Bugün okul bahçesinde top oynadık.",
              "Minik kedim boncuk koltukta uyuyor.",
              "Ankara, ülkemizin başkentidir.",
            ],
            correct: "Minik kedim boncuk koltukta uyuyor.",
          },
          {
            q: '"Bilgisayar" kelimesi kaç heceden oluşmaktadır?',
            words: ["3", "4", "5"],
            correct: "4",
          },
          {
            q: '"B, C, D, F, G, H, J..." gibi tek başlarına ses çıkaramayan harf grubunun alfabemizdeki adı nedir?',
            words: ["Ünlü Harfler", "Ünsüz (Sessiz) Harfler", "Kelime Kökleri"],
            correct: "Ünsüz (Sessiz) Harfler",
          },
          {
            q: '"Annem mutfakta lezzetli bir kurabiye pişirdi." ifadesi toplam kaç kelimeden oluşan tam bir cümledir?',
            words: ["4", "5", "6"],
            correct: "5",
          },
          {
            q: '"Çilek - Armut - Limon" kelimeleri sözlük sırasına (alfabetik sıraya) göre nasıl dizilmelidir?',
            words: [
              "Çilek - Armut - Limon",
              "Armut - Çilek - Limon",
              "Limon - Armut - Çilek",
            ],
            correct: "Armut - Çilek - Limon",
          },
          {
            q: "Aşağıdaki kelimelerden hangisi tek heceli bir nesne adıdır?",
            words: ["Kart", "Masa", "Kapı"],
            correct: "Kart",
          },
          {
            q: "Türk alfabesinde toplam kaç tane harf yer almaktadır?",
            words: ["27", "29", "31"],
            correct: "29",
          },
          {
            q: "Aşağıdaki kelime gruplarından hangisi tam bir cümle özelliği taşımaktadır?",
            words: [
              "Ödevlerimi vaktinde bitirdim.",
              "Dün sabah parktaki salıncakta",
              "Yeni aldığım mavi renkli okul çantası",
            ],
            correct: "Ödevlerimi vaktinde bitirdim.",
          },
          {
            q: '"29 ekim cumhuriyet bayramı okullarda coşkuyla kutlanır." cümlesinde kaç tane kelimenin ilk harfi büyük yazılmalıydı?',
            words: ["1", "2", "3"],
            correct: "3",
          },
          {
            q: '"Karpuz - Kivi - Kayısı" kelimeleri sözlük sırasına dizildiğinde en başta hangisi yer alır?',
            words: ["Karpuz", "Kivi", "Kayısı"],
            correct: "Karpuz",
          },
        ],
      },
    },
  },
  "tekrar-2": {
    country: {
      title: "Ülkemi Tanıyorum",
      info: {
        title:
          "📇 ÜLKEMİ ÖĞRENİYORUM SÜPER KÜLTÜR KARTI: Haritadaki Bölgeler ve Tarihi Miraslar",
        rules: [
          {
            name: "Kıyı Bölgelerimiz (Sandık 6-7/9-10)",
            desc: "Haritanın en altında (güneyde) denize paralel yüksek Toros Dağları ile kaplı Akdeniz Bölgesi uzanır; buralarda kışın bile sıcak olan şeffaf seralar ve turunçgiller çizilidir. Haritanın en üstünde (kuzeyde) ise her mevsim yağmurlu bulutlarla kaplı, gür ormanların ve çay yapraklarının çizildiği Karadeniz Bölgesi şerit halinde yer alır.",
          },
          {
            name: "İç ve Doğu Bölgelerimiz (Sandık 8/9-10)",
            desc: "Haritanın tam merkezinde sarı başak tarlalarıyla kaplı, başkent Ankara'nın ve taş yapılı Peri Bacaları'nın yer aldığı İç Anadolu (Tahıl Ambarımız) bulunur. Haritanın en sağında en yüksek kahverengi dağlarla çizili, büyükbaş hayvancılık yapılan ve İshak Paşa Sarayı'nı barındıran Doğu Anadolu ile onun hemen altında en sıcak kurak ovaların, dünyanın en eski tapınağı olan Göbeklitepe'nin yer aldığı Güneydoğu Anadolu uzanır.",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Coğrafya Avı",
        desc: "Açıklama: Aşağıdaki cümlelerde boş bırakılan yerleri Kültür Kartı'ndaki harita bilgilerine uygun şekilde tamamlayınız.",
        questions: [
          {
            q: "Kıyı şeridinin hemen arkasında bir duvar gibi yükselen paralel dağ zincirine ..... Dağları adı verilir.",
            words: ["Toros", "Kaçkar"],
            correct: "Toros",
          },
          {
            q: "Nevşehir sınırları içinde rüzgarların kayaları oymasıyla oluşan külah şekilli doğal yapılara ..... Bacaları denir.",
            words: ["Peri", "Taş"],
            correct: "Peri",
          },
          {
            q: "Her mevsim yağmur bulutlarıyla çizilen Karadeniz'in yamaçlarında en çok fındık ve yeşil yapraklı ..... tarımı resmedilir.",
            words: ["çay", "muz"],
            correct: "çay",
          },
          {
            q: "Türkiye haritasının ortalama yükseltisi en fazla olan, en koyu kahverengi boyalı yeri ..... Anadolu Bölgesi'dir.",
            words: ["Doğu", "Güneydoğu"],
            correct: "Doğu",
          },
          {
            q: "Şanlıurfa'da yer alan, mimari özellikleri sebebiyle uzmanlarca \"tarihin sıfır noktası\" seçilen merkezin adı ..... 'dir.",
            words: ["Göbeklitepe", "Nemrut"],
            correct: "Göbeklitepe",
          },
          {
            q: "Antalya kıyılarında mavi su çizgileriyle yüksek kayalardan aşağı dökülen ünlü doğal çağlayan ..... Şelalesi'dir.",
            words: ["Düden", "Tortum"],
            correct: "Düden",
          },
          {
            q: "Geniş ovalarında çok yoğun buğday başağı çizimleri bulunduğu için bu iç bölgemize Türkiye'nin ..... Ambarı unvanı verilir.",
            words: ["Tahıl", "Sanayi"],
            correct: "Tahıl",
          },
          {
            q: "Dağların bulutlara yakın yüksek tepelerinde yer alan, ahşap evlerin çizildiği o yeşil temiz düzlüklere ..... denir.",
            words: ["yayla", "ova"],
            correct: "yayla",
          },
          {
            q: "Ağrı ilinde yüksek bir tepenin üzerine taşlardan inşa edilmiş olan ünlü tarihi somut miras ..... Paşa Sarayı'dır.",
            words: ["İshak", "Topkapı"],
            correct: "İshak",
          },
          {
            q: "Adıyaman'da yer alan, zirvesinde Kommagene Krallığı'na ait dev taş kral heykellerinin çizimleri bulunan yer ..... Dağdır.",
            words: ["Nemrut", "Erciyes"],
            correct: "Nemrut",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Büyük Karma Test",
        desc: "Açıklama: Karışık konulardan oluşan test sorularında harita özelliklerine dikkat ederek doğru seçeneği bulunuz.",
        questions: [
          {
            q: "Akdeniz kıyılarında kış aylarının çok yumuşak ve ılık geçmesi tarım haritasına hangi üretim resimlerinin eklenmesini sağlamıştır?",
            options: [
              "Naylon ve cam kaplı seracılık alanlarının",
              "Karlar altında yapılan çay bahçelerinin",
              "Sadece geniş buğday ovalarının",
            ],
            correct: 0,
          },
          {
            q: "Yazları sıcak ve kurak, kışları dondurucu ve karlı geçen, sarı renkli bozkır bitki örtüsüne sahip iklim türü hangisidir?",
            options: ["Karadeniz İklimi", "Karasal İklim", "Akdeniz İklimi"],
            correct: 1,
          },
          {
            q: "Karadeniz Bölgesi haritasının ülkemizde en koyu yeşil renkle boyanmasının temel sebebi aşağıdakilerden hangisidir?",
            options: [
              "Her yerinin tamamen düzlüklerden oluşması",
              "Yılın her mevsiminde düzenli ve bol yağış alarak gür ormanlar oluşturması",
              "Bölgede hiç dağ çizgisi olmaması",
            ],
            correct: 1,
          },
          {
            q: "Tarım arazileri az ve engebeli olduğu için Doğu Anadolu haritasındaki yeşil dağ eteklerine (meralara) en çok hangi figürler çizilir?",
            options: [
              "Büyükbaş hayvancılık (inek ve boğa) resimleri",
              "Deniz ticareti yapan liman gemileri",
              "Portakal ve limon sepetleri",
            ],
            correct: 0,
          },
          {
            q: "Sarı kalker taşından yapılmış tarihi ev resimleriyle kaplı olan, yazın Türkiye'nin en sıcak günlerini yaşayan güneydoğu şehrimiz hangisidir?",
            options: ["Trabzon", "Mardin", "İzmir"],
            correct: 1,
          },
          {
            q: "Akdeniz Bölgesi'nde Toros Dağları'nın paralel uzanması kıyıdaki şehir çizgileriyle iç iller arasında hangisini zorlaştırmıştır?",
            options: [
              "Denizde yüzme faaliyetlerini",
              "Karayolu ulaşımını ve araç geçişlerini",
              "Balıkçılık yapmayı",
            ],
            correct: 1,
          },
          {
            q: "Türkiye Cumhuriyeti devletinin yönetim kalbi ve başkenti olan Ankara şehri haritada hangi bölgemizin sınırları içindedir?",
            options: ["Marmara Bölgesi", "İç Anadolu Bölgesi", "Ege Bölgesi"],
            correct: 1,
          },
          {
            q: "Ormanlık alanların ve kereste miktarının çok fazla olması sebebiyle Karadeniz ev resimlerinde en çok hangi malzeme kullanılır?",
            options: [
              "Kalın kerpiç çamuru",
              "Ahşap (Ağaç - Tahta)",
              "Demir levhalar",
            ],
            correct: 1,
          },
          {
            q: "Doğu Anadolu Bölgesi'nde yağan beyaz karların dağlarda ve sokaklarda aylarca erimeden kalabilmesinin temel sebebi nedir?",
            options: [
              "Hava sıcaklığının kış aylarında sıfırın altında çok dondurucu değerlerde olması",
              "Bölgeye hiçbir zaman güneş ışığının ulaşmaması",
              "Bölgenin denize çok yakın olması",
            ],
            correct: 0,
          },
          {
            q: "Kurak ovaların sulanması ve tarımın gelişmesi amacıyla Fırat ve Dicle nehirleri üzerine kurulan dev projenin adı nedir?",
            options: [
              "Mavi Vatan Projesi",
              "Güneydoğu Anadolu Projesi (GAP)",
              "Boğaz Köprüleri Sistemi",
            ],
            correct: 1,
          },
        ],
      },
    },
    story: null as any,
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "📇 DİL BİLGİSİ SÜPER BİLGİ KARTI",
        rules: [
          {
            name: "Zıt Anlamlılar",
            desc: "Anlamları birbirinin tam tersi olan kelimelerdir. (Büyük ↔️ Küçük)",
            example: "",
          },
          {
            name: "Eş Anlamlılar",
            desc: "Yazılışları farklı ama anlamları aynı olan ikiz kelimelerdir. (Okul = Mektep)",
            example: "",
          },
          {
            name: "Sesteş Kelimeler",
            desc: "Tek kelimenin iki farklı maskesi olmasıdır! (Gül: hem çiçek hem gülmek)",
            example: "",
          },
          {
            name: "Nokta ve Virgül",
            desc: "Cümle tamamen biterse Nokta (.) konur. Kelimeler sıralanırsa araya Virgül (,) yerleştirilir.",
            example: "",
          },
          {
            name: 'Soru İşareti ve "mi" Yazımı',
            desc: 'Soru anlamı olan cümlelerin sonuna Soru İşareti (?) konur. Soru eki olan "mı / mi" her zaman kelimeden ayrı yazılır.',
            example: "",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Boşluk Doldurma (10 Soru)",
        desc: "Boşluk doldurma sorularını cevaplayınız.",
        questions: [
          {
            id: 1,
            q: "Sabah aldığımız taze ekmekler akşama kadar iyice .................... olmuştu.",
            options: ["bayat", "sıcak"],
            correct: 0,
          },
          {
            id: 2,
            q: "Beyaz bulutların arkasından birden bembeyaz, yani .................... bir güvercin havalandı.",
            options: ["ak", "kara"],
            correct: 0,
          },
          {
            id: 3,
            q: "Kümesteki beyaz .................... toprağı ayaklarıyla kazıyordu. (Hem eylem hem hayvan)",
            options: ["kaz", "ördek"],
            correct: 0,
          },
          {
            id: 4,
            q: "Kırtasiyeden defter( ) kitap ve boya kalemleri satın aldım.",
            options: [", (Virgül)", ". (Nokta)"],
            correct: 0,
          },
          {
            id: 6,
            q: "Akşamüstü hep birlikte mahalledeki parka gidiyor muzu.... ?",
            options: ["muyuz (ayrı)", "muyuz (bitişik)"],
            correct: 0,
          },
          {
            id: 7,
            q: "Bardaktaki soğuk sütün içine biraz da .................... su karıştırdım.",
            options: ["sıcak", "serin"],
            correct: 0,
          },
          {
            id: 8,
            q: "Doktor yanına gidip muayene olduktan sonra .................... bize bir ilaç yazdı.",
            options: ["hekim", "öğretmen"],
            correct: 0,
          },
          {
            id: 9,
            q: "Abim cebinden tam .................... lira çıkarıp bana harçlık verdi. (Hem sayı hem eylem)",
            options: ["bin", "yüz"],
            correct: 0,
          },
          {
            id: 10,
            q: "Ödevlerimi bitirdikten sonra hemen çantamı hazırladım( )",
            options: [". (Nokta)", ", (Virgül)"],
            correct: 0,
          },
          {
            id: 12,
            q: "Bu yeşil kapaklı yeni defter senin mi( )",
            options: ["? (Soru İşareti)", ". (Nokta)"],
            correct: 0,
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Karma Test Arenası (10 Soru)",
        desc: "Doğru olan seçeneği tıklayıp seçiniz.",
        questions: [
          {
            q: '"Ağır - Hafif" kelimeleri arasındaki anlam ilişkisi aşağıdakilerden hangisinde vardır?',
            words: ["Siyah - Kara", "Uzun - Kısa", "Mektep - Okul"],
            correct: "Uzun - Kısa",
          },
          {
            q: '"Vazife" kelimesinin eş anlamlısı hangi cümlede kullanılmıştır?',
            words: [
              "Bu zor görevi başarıyla tamamladık.",
              "Yeni bir kitap okumaya başladım.",
              "Yarın erkenden yola çıkacağız.",
            ],
            correct: "Bu zor görevi başarıyla tamamladık.",
          },
          {
            q: "Aşağıdaki kelimelerden hangisi sesteş (eş sesli) bir kelime değildir?",
            words: ["Çay", "Sıra", "Yat"],
            correct: "Sıra",
          },
          {
            q: '"Bahçede koşan köpek( ) kedi ve kuşlar çok neşeliydi( )" Parantezlerin içine sırasıyla hangileri gelmelidir?',
            words: ["(,) (.)", "(.) (,)", "(,) (,)"],
            correct: "(,) (.)",
          },
          {
            q: "Hangi seçenekteki soru ekinin yazımı tamamen doğrudur?",
            words: [
              "Benimle oynamaya geliyormusun?",
              "Kalemimi sen mi aldın?",
              "Ders zili çaldımı?",
            ],
            correct: "Kalemimi sen mi aldın?",
          },
          {
            q: '"Ucuz" kelimesinin zıt anlamlısı aşağıdakilerden hangisidir?',
            words: ["Pahalı", "Kolay", "Güzel"],
            correct: "Pahalı",
          },
          {
            q: "Hangi kelime çifti birbirinin eş anlamlısı (ikizi) durumundadır?",
            words: ["İyi - Kötü", "Siyah - Kara", "Alt - Üst"],
            correct: "Siyah - Kara",
          },
          {
            q: '"Dal" kelimesinin iki farklı anlamı hangi seçenekte doğru verilmiştir?',
            words: [
              "Ağacın kolu - Denizin içine dalmak",
              "Koşmak - Uyumak",
              "Yazı yazmak - Şarkı söylemek",
            ],
            correct: "Ağacın kolu - Denizin içine dalmak",
          },
          {
            q: "Virgül (,) işareti cümle içinde hangi amaçla kullanılır?",
            words: [
              "Cümleyi tamamen bitirmek için",
              "Art arda sıralanan benzer kelimeleri ayırmak için",
              "Soru sormak için",
            ],
            correct: "Art arda sıralanan benzer kelimeleri ayırmak için",
          },
          {
            q: "Hangi cümleninin en sonuna soru işareti (?) konması hatalı olur?",
            words: [
              "Saat kaçta geleceksin?",
              "Bugün hava çok bulutlu?",
              "Çantanı nerede unuttun?",
            ],
            correct: "Bugün hava çok bulutlu?",
          },
        ],
      },
    },
  },
  "tekrar-3": {
    country: {
      title: "Ülkemi Tanıyorum",
      info: {
        title:
          "📇 ÜLKEMİ ÖĞRENİYORUM SÜPER KÜLTÜR KARTI: Atatürk'ün Hayatı ve Zaman Çizgisi",
        rules: [
          {
            name: "Çocukluk ve Okul Yılları (Sandık 11-12)",
            desc: "Tarih albümünde Mustafa Kemal'in doğduğu Selanik'teki üç katlı pembe ev resmi ve mısır tarlalarında karga kovaladığı Langaza Çiftliği çizgileri yer alır. Eğitim kronolojisinde ise Mahalle Mektebi'nden başlayıp, modern eğitim sunan Şemsi Efendi İlkokulu'na ve matematik öğretmeninden \"Kemal\" adını aldığı askeri okula uzanan okul binaları sıralanır.",
          },
          {
            name: "Karakter ve Son Yolculuk (Sandık 13-15)",
            desc: "Karakter şablonunda cephede bile okunan binlerce kitap resmi, pusula gibi yön belirleyen planlılığı ve kırmızı bayraklı vatanseverlik haritası uzanır. Zaman çizgisinin en son durağında ise Ankara'nın tam ortasında yükselen, yüksek taş sütunlu görkemli Anıtkabir yapısı yer alır.",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Coğrafya Avı",
        desc: "Açıklama: Aşağıdaki cümlelerde boş bırakılan yerleri Kültür Kartı'ndaki harita bilgilerine uygun şekilde tamamlayınız.",
        questions: [
          {
            q: "Mustafa Kemal Atatürk'ün doğduğu ve çocukluğunun ilk dönemini geçirdiği üç katlı pembe ev ..... şehrindedir.",
            words: ["Selanik", "Ankara"],
            correct: "Selanik",
          },
          {
            q: "Mustafa'ya üstün matematik yeteneği nedeniyle \"Kemal\" ek adı ..... Askeri Rüştiyesi'nde verilmiştir.",
            words: ["Selanik", "İstanbul"],
            correct: "Selanik",
          },
          {
            q: "Savaş çadırında bile yanından ayırmadığı binlerce eseri bitirmesi onun en büyük ..... sevgisini gösterir.",
            words: ["kitap", "eğlence"],
            correct: "kitap",
          },
          {
            q: "Dünyada çocuklara özel bir milli bayram (23 Nisan) armağan eden ilk ve tek devlet lideri ..... 'dir.",
            words: ["Mustafa Kemal Atatürk", "Ali Rıza Efendi"],
            correct: "Mustafa Kemal Atatürk",
          },
          {
            q: "Büyük liderin Ankara'nın merkezinde yükselen şanlı kabrinin adı ..... olarak haritaya çizilmiştir.",
            words: ["Anıtkabir", "Meclis"],
            correct: "Anıtkabir",
          },
          {
            q: "Babası vefat ettikten sonra ailesiyle taşındığı tarım arazisinin adı ..... Çiftliği'dir.",
            words: ["Langaza", "Orman"],
            correct: "Langaza",
          },
          {
            q: "Yeni ve modern yöntemlerle eğitim sunarak Mustafa'nın fikir yapısını geliştiren ilkokul binası ..... Efendi Okulu'dur.",
            words: ["Şemsi", "Mahalle"],
            correct: "Şemsi",
          },
          {
            q: "Gelecekte yaşanacak coğrafi ve siyasi olayları önceden tam isabetle tahmin edebilmesi onun ..... görüşlülük özelliğidir.",
            words: ["ileri", "geçmişe bağlı"],
            correct: "ileri",
          },
          {
            q: "Haritadaki kırmızı renkli Türk bayrağı ve sınırlar, liderin içindeki büyük ..... duygusunun simgesidir.",
            words: ["vatanseverlik", "kararsızlık"],
            correct: "vatanseverlik",
          },
          {
            q: "Anıtkabir mimarisinin hemen girişinde yer alan, taş heykellerle kaplı o uzun yolun adı ..... Yol'dur.",
            words: ["Aslanlı", "Kuşlu"],
            correct: "Aslanlı",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Büyük Karma Test",
        desc: "Açıklama: Karışık konulardan oluşan test sorularında harita özelliklerine dikkat ederek doğru seçeneği bulunuz.",
        questions: [
          {
            q: "Mustafa'nın çocukluk resimlerinde mısır tarlalarını korumak için üstlendiği sorumluluk görevi hangisidir?",
            options: [
              "Traktör çizgilerini incelemek",
              "Zararlı siyah kargaları tarladan kovalamak",
              "Koyunları dağlarda otlatmak",
            ],
            correct: 1,
          },
          {
            q: "Mustafa Kemal'in eğitim haritasının en son aşamasında Kurmay Yüzbaşı rütbe çizgisiyle mezun olduğu okul hangisidir?",
            options: [
              "Manastır Askeri İdadisi",
              "İstanbul Harp Akademisi",
              "Selanik Mahalle Mektebi",
            ],
            correct: 1,
          },
          {
            q: "Atatürk'ün yapacağı askeri adımları önceden takvime bağlaması ve saat gibi düzenli çalışması hangi karakter özelliğidir?",
            options: ["Planlılık ve disiplin", "Acelecilik", "Kararsızlık"],
            correct: 0,
          },
          {
            q: "Karakter albümündeki tiyatro maskesi, nota çizgileri ve müzik aletleri resimleri onun neye verdiği değeri somutlaştırır?",
            options: [
              "Sadece askeri binalara",
              "Sanata, kültüre, estetiğe ve sanatçılara olan saygısını",
              "Fabrika bacalarına",
            ],
            correct: 1,
          },
          {
            q: "Hayat kronolojisi çizgisi üzerinde 1923 yılında parıldayan en büyük tarihi ve siyasi başarı simgesi hangisidir?",
            options: [
              "Çiftlikten şehre taşınma resmi",
              "modern Türkiye Cumhuriyeti'nin ilan edilmesi",
              "Okul eğitiminin bitiş belgesi",
            ],
            correct: 1,
          },
          {
            q: "Mustafa'nın doğduğu dönemde Selanik şehrinin haritadaki konumuna bakılarak ulaşılabilecek en doğru bilgi hangisidir?",
            options: [
              "Osmanlı Devleti sınırları içinde yer alan, deniz ticareti çok hareketli bir limandı.",
              "Denizlerden uzak, küçük bir kara köyüydü.",
              "Tamamen buzullarla kaplı bir kutup kasabasıydı.",
            ],
            correct: 0,
          },
          {
            q: "Mustafa Kemal'in askeri okullara girmek için annesinden gizli olarak sınav salonlarına gitmesi onun hangi özelliğidir?",
            options: [
              "Kararsız ve korkak bir yapıda olduğunu gösterir.",
              "Hedefine kilitlenmiş, kararlı ve idealist bir karakteri olduğunu gösterir.",
              "Okumayı hiç sevmediğini anlatır.",
            ],
            correct: 1,
          },
          {
            q: '"Yolunda yürüyen bir yolcunun yalnız ufku görmesi kafi değildir, ufkun ötesini de görmesi lazımdır." sözü liderin hangi gücünü betimler?',
            options: [
              "İleri görüşlülük ve coğrafi tahmin yeteneğini",
              "Sadece uzağa bakabildiğini",
              "Gözlerinin çok sağlam renk seçtiğini",
            ],
            correct: 0,
          },
          {
            q: '"Sanatsız kalan bir milletin hayat damarlarından biri kopmuş demektir." sözünde geçen "hayat damarları" ifadesi neyi anlatır?',
            options: [
              "Askeri kışlaların sayısını",
              "Toplumun ilerlemesinde sanatın ve yaratıcılığın ne kadar kilit olduğunu",
              "Ticaret yollarının genişliğini",
            ],
            correct: 1,
          },
          {
            q: "Anıtkabir'in yüksek taş sütunlu görkemli mimari yapısı genel olarak neyi somutlaştıran bir abidedir?",
            options: [
              "Sıradan bir taş deposunu",
              "Türk milletinin Atatürk'e olan sonsuz saygısını, sevgisini ve bağlılığını",
              "Eski askeri karargah binalarını",
            ],
            correct: 1,
          },
        ],
      },
    },
    story: null as any,
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "📇 DİL BİLGİSİ SÜPER BİLGİ KARTI",
        rules: [
          {
            name: "Adlar (Özel ve Cins)",
            desc: "Dünyada tek olanlar Özel Ad (Ankara), sıradan nesneler Cins Ad (fırça) olur.",
            example: "",
          },
          {
            name: "Tekil ve Çoğul",
            desc: 'Tek bir varlık Tekil, sonuna "-ler / -lar" eki alanlar ise Çoğul ad olur. (Kuşlar)',
            example: "",
          },
          {
            name: "Türetilmiş Adlar",
            desc: 'Kelimelerin sonuna gelen sihirli "-lik, -ci, -li, -siz" ekleri tamamen yeni anlamlı kelimeler türetir. (Sözlük)',
            example: "",
          },
          {
            name: "Ön Adlar (Sıfatlar)",
            desc: "İsimlerin hemen önüne gelerek onların rengini veya şeklini belirten kelimelerdir. (Kare kutu)",
            example: "",
          },
          {
            name: "Eylemler (Fiiller)",
            desc: "Cümle sonunda iş, hareket ve durum bildiren kelimelerdir. (yıkadı, tırmandı)",
            example: "",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Boşluk Doldurma (10 Soru)",
        desc: "Boşluk doldurma sorularını cevaplayınız.",
        questions: [
          {
            id: 1,
            q: "Kedimiz .................... koltuğun üzerinde yumakla oynuyordu. (Özel isim)",
            options: ["Tekir", "kedi"],
            correct: 0,
          },
          {
            id: 2,
            q: "Masanın üzerindeki defter.... çantamın içine döküldü. (Çoğul eki)",
            options: ["-ler", "-lar"],
            correct: 0,
          },
          {
            id: 3,
            q: "Sucu dükkanından kiler için yeni bir .................... satın aldık. (Su konulan yer)",
            options: ["suluk", "susuz"],
            correct: 0,
          },
          {
            id: 4,
            q: "Resim dersinde kağıda kocaman üçgen bir .................... çizdim. (Şekil sıfatı)",
            options: ["ev", "mavi"],
            correct: 0,
          },
          {
            id: 5,
            q: "Kardeşim banyoda ellerini beyaz sabunla güzelce .................... (Eylem)",
            options: ["yıkadı", "temiz"],
            correct: 0,
          },
          {
            id: 6,
            q: "Odamdaki ahşap .................... üzerine kitaplarımı yerleştirdim. (Cins isim)",
            options: ["rafın", "Ömer'in"],
            correct: 0,
          },
          {
            id: 7,
            q: "Bahçedeki ağaç.... sonbahar gelince sarı yapraklarını döktü.",
            options: ["-lar", "-ler"],
            correct: 0,
          },
          {
            id: 8,
            q: "Çiçekçiden annem için mis kokulu bir .................... buketi aldım.",
            options: ["çiçek", "çiçekçi"],
            correct: 0,
          },
          {
            id: 9,
            q: "Masanın üzerinde duran .................... cüzdan ablama aittir. (Renk sıfatı)",
            options: ["kırmızı", "kare"],
            correct: 0,
          },
          {
            id: 10,
            q: "İki arkadaş merdivenlerin basamaklarını hızlıca yukarı ....................",
            options: ["tırmandı", "basamak"],
            correct: 0,
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Karma Test Arenası (10 Soru)",
        desc: "Doğru olan seçeneği tıklayıp seçiniz.",
        questions: [
          {
            q: '"Almanya" kelimesinin dil bilgisindeki isim türü aşağıdakilerden hangisidir?',
            words: ["Cins Ad", "Özel Ad", "Ön Ad"],
            correct: "Özel Ad",
          },
          {
            q: "Aşağıdaki kelimelerden hangisi birden fazla varlığı anlatan Çoğul bir addır?",
            words: ["Slaytlar", "Mermer", "Saksı"],
            correct: "Slaytlar",
          },
          {
            q: '"Tuz" kelimesine hangi ek gelirse "içine tuz koyduğumuz kap" anlamına gelen yeni bir kelime türetilir?',
            words: ["-lu", "-luk", "-cu"],
            correct: "-luk",
          },
          {
            q: '"Geniş kaldırımda yavaş adımlarla yürüdüler." cümlesindeki ön ad (sıfat) hangisidir?',
            words: ["Geniş", "kaldırımda", "yürüdüler"],
            correct: "Geniş",
          },
          {
            q: 'Aşağıdaki kelimelerden hangisi sonuna "-mek / -mak" alabilen bir eylem (fiil) bildirmektedir?',
            words: ["Kitaplık", "Gülümsedi", "Pencere"],
            correct: "Gülümsedi",
          },
          {
            q: "Aşağıdaki kelimelerden hangisi cümle içinde her zaman küçük harfle yazılan bir cins addır?",
            words: ["Bursa", "Koltuk", "Atatürk"],
            correct: "Koltuk",
          },
          {
            q: '"Çanta" tekil adının çoğul yapılmış şekli aşağıdakilerden hangisidir?',
            words: ["Çantalar", "Çantacı", "Çantalı"],
            correct: "Çantalar",
          },
          {
            q: '"Şekersiz çay" tamlamasındaki "Şekersiz" kelimesi ne tür bir kelimedir?',
            words: [
              "Kök kelime",
              "Türetilmiş (Yapım eki almış) kelime",
              "Özel isim",
            ],
            correct: "Türetilmiş (Yapım eki almış) kelime",
          },
          {
            q: '"Yuvarlak sehpa" tamlamasındaki ön ad nesnenin hangi özelliğini belirtmektedir?',
            words: ["Rengini", "Şeklini (Biçimini)", "Ağırlığını"],
            correct: "Şeklini (Biçimini)",
          },
          {
            q: '"Mert yerdeki boş kutuyu çöp kutusuna attı." cümlesindeki eylem hangisidir?',
            words: ["Mert", "attı", "kutuyu"],
            correct: "attı",
          },
        ],
      },
    },
  },
  "tekrar-4": {
    country: {
      title: "Ülkemi Tanıyorum",
      info: {
        title:
          "📇 ÜLKEMİ ÖĞRENİYORUM SÜPER KÜLTÜR KARTI: Milli Bayramlarımız ve Bağımsızlık Sembollerimiz",
        rules: [
          {
            name: "Milli Bayramlar Haritası (Sandık 16-19)",
            desc: "Bayram atlasında Ankara'da açılan ve üzerinde şanlı Türk bayrağı dalgalanan ilk TBMM binası ile önündeki dünya çocukları resmi (23 Nisan) yer alır. Karadeniz'in mavi dalgaları üzerindeki siyah Bandırma Vapuru çizgisi ve Samsun kıyısındaki parlak sarı kurtuluş meşalesi (19 Mayıs) onu takip eder. Kütahya Dumlupınar'daki kırmızı oklarla çizilmiş Büyük Taarruz planı (30 Ağustos) ve altın harfli Cumhuriyet tabelası ile parıldayan fener alayları (29 Ekim) sıralanır.",
          },
          {
            name: "Bağımsızlık Simgemiz (Sandık 20)",
            desc: "Haritanın tam kalbinde, üzerinde kırmızı bir ay yıldız çizimi olan büyük bir müzik nota sayfası ve yanında mürekkepli kalem tutan şairimiz Mehmet Akif Ersoy'un resmi bulunur; bu bizim bağımsızlık sembolümüz olan İstiklal Marşı'mızdır.",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Coğrafya Avı",
        desc: "Açıklama: Aşağıdaki cümlelerde boş bırakılan yerleri Kültür Kartı'ndaki harita bilgilerine uygun şekilde tamamlayınız.",
        questions: [
          {
            q: "Ankara'da açılan ve halkın kendi kendini yönetme gücünü başlatan tarihi binanın adı ..... olarak haritada çizilmiştir.",
            words: ["TBMM", "Saray"],
            correct: "TBMM",
          },
          {
            q: "Mustafa Kemal'in 19 Mayıs günü Samsun limanına ulaşmasını sağlayan siyah gemi ..... Vapuru'dur.",
            words: ["Bandırma", "Savarona"],
            correct: "Bandırma",
          },
          {
            q: "Dumlupınar bölgesinde düşmanı vatan topraklarından tamamen çıkaran büyük askeri harekatın adı Büyük ..... 'dur.",
            words: ["Taarruz", "Savunma"],
            correct: "Taarruz",
          },
          {
            q: "29 Ekim 1923 tarihinde modern Türkiye devletinin resmi yönetim şekli olan ..... ilan edilmiştir.",
            words: ["Cumhuriyet", "Krallık"],
            correct: "Cumhuriyet",
          },
          {
            q: "Bizim kırmızı ay yıldızlı nota sayfasıyla simgelenen bağımsızlık şarkımızın adı ..... Marşı'dır.",
            words: ["İstiklal", "Gençlik"],
            correct: "İstiklal",
          },
          {
            q: "Atatürk meclisin açıldığı bu kilit ulusal günü dünyada ilk ve tek olarak tüm dünya ..... hediye etmiştir.",
            words: ["çocuklarına", "tüccarlarına"],
            correct: "çocuklarına",
          },
          {
            q: "Samsun kıyısına çizilen o parlak sarı renkli ..... resmi, özgürlük mücadelesinin ilk kilit ışığıdır.",
            words: ["meşale", "mum"],
            correct: "meşale",
          },
          {
            q: "30 Ağustos Zafer Bayramı'nda caddelerde tankların ve kahraman askerlerin katıldığı resmi geçit ..... düzenlenir.",
            words: ["törenleri", "sınavları"],
            correct: "törenleri",
          },
          {
            q: "Cumhuriyet Bayramı gecelerinde insanların ellerinde ışıklar ve fenerlerle yaptığı yürüyüşlere ..... Alayı denir.",
            words: ["Fener", "Kuş"],
            correct: "Fener",
          },
          {
            q: "Okul bahçesindeki törenlerde marşımız coşkuyla söylenirken bayrak direğinin önünde ..... ol duruşunda bekleriz.",
            words: ["hazır", "rahat"],
            correct: "hazır",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Büyük Karma Test",
        desc: "Açıklama: Karışık konulardan oluşan test sorularında harita özelliklerine dikkat ederek doğru seçeneği bulunuz.",
        questions: [
          {
            q: "23 Nisan Çocuk Bayramı resimlerinde okulların, sokakların ve pencerelerin neyle süslendiği somut olarak görünür?",
            options: [
              "Sadece büyük kaya parçalarıyla",
              "Kırmızı beyaz renkli balonlar, süs şeritleri ve ay yıldızlı bayraklarla",
              "Kurumuş kahverengi yapraklarla",
            ],
            correct: 1,
          },
          {
            q: "Bandırma Vapuru resmi haritadaki coğrafi bilgilere göre ülkemizin hangi hırçın dalgalı denizinde yolculuk yapmıştır?",
            options: ["Akdeniz", "Karadeniz", "Ege Denizi"],
            correct: 1,
          },
          {
            q: "Haritada üzerinde gümüş renkli bir Zafer Madalyası ve defne yaprakları bulunan başarı kurgusu hangi tarihi günü simgeler?",
            options: [
              "23 Nisan Çocuk Bayramı'nı",
              "30 Ağustos Zafer Bayramı'nı",
              "19 Mayıs Gençlik Bayramı'nı",
            ],
            correct: 1,
          },
          {
            q: 'Atatürk\'ün "Efendiler, yarın cumhuriyeti ilan edeceğiz!" sözüyle kurulan modern devletimizin resmi adı nedir?',
            options: [
              "Osmanlı İmparatorluğu",
              "Türkiye Cumhuriyeti",
              "Selanik Cumhuriyeti",
            ],
            correct: 1,
          },
          {
            q: "Kırmızı ay yıldızlı nota sayfasının üzerinde yer alan, bağımsızlık marşımızın ilk ve en kilit kelimesi hangisidir?",
            options: ["Yürü!", "Korkma!", "Dur!"],
            correct: 1,
          },
          {
            q: "Haritada önünde dünya çocuklarının el ele tutuştuğu, üzerinde Türk bayrağı dalgalanan meclis binası hangi şehrimizdedir?",
            options: ["İstanbul", "Ankara", "İzmir"],
            correct: 1,
          },
          {
            q: "Bayram haritasındaki atletik koşan genç figürleri 19 Mayıs'ın hangi kilit temasını ve önemini simgeler?",
            options: [
              "Sadece ders çalışmayı",
              "Gençlik, spor, sağlık, dinamizm ve yüksek enerjiyi",
              "Sessizce oturma kuralını",
            ],
            correct: 1,
          },
          {
            q: "30 Ağustos askeri haritasındaki kırmızı taarruz okları ve harekat planları ordumuzun hangi özelliğinin kanıtıdır?",
            options: [
              "Vatanı düşmanlardan kurtarma azminin ve kahramanlık gücünün",
              "Korkup geri çekilme ve saklanma planının",
              "Sadece yürüyüş yapmayı sevmesinin",
            ],
            correct: 0,
          },
          {
            q: "Cumhuriyet Bayramı'nda gece gökyüzünü kaplayan o parıltılı ve renkli ışık şölenlerine somut olarak ne ad verilir?",
            options: [
              "Havai fişek gösterileri",
              "Yağmur bulutu gölgesi",
              "Sokak lambası parıltısı",
            ],
            correct: 0,
          },
          {
            q: "Şair Mehmet Akif Ersoy, kazandığı ödül parasını fakir çocuklara ve kadınlara yardım eden bir vakfa bağışlayarak hangi özelliğini göstermiştir?",
            options: [
              "Çok cimri olduğunu",
              "Yardımsever, fedakar ve asil bir karaktere sahip olduğunu",
              "Parayı çok sevdiğini",
            ],
            correct: 1,
          },
        ],
      },
    },
    story: null as any,
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "📇 DİL BİLGİSİ SÜPER BİLGİ KARTI",
        rules: [
          {
            name: "Zaman Kavramı",
            desc: "İş bittiyse Geçmiş Zaman (-di), şu an oluyorsa Şimdiki Zaman (-yor), daha sonra olacaksa Gelecek Zaman (-acak) olur.",
            example: "",
          },
          {
            name: "Kesme İşareti ( ' )",
            desc: "Özel isimlerin sonuna gelen ekleri ayırmak için kelimenin tepesine konur. (Bursa'ya)",
            example: "",
          },
          {
            name: "Kısa Çizgi ( - )",
            desc: "Satır sonuna sığmayan kelimeleri hecelerinden bölmek için satır sonuna konur.",
            example: "",
          },
          {
            name: "Ünlem İşareti ( ! )",
            desc: "Korku, sevinç, heyecan, şaşkınlık (Yaşasın!) gibi büyük duygularda cümlenin sonuna konur.",
            example: "",
          },
          {
            name: "İki Nokta ( ",
            desc: ") ve Noktalı Virgül ( ; ): Örnek verilecekse İki Nokta (:), farklı gruplar ayrılacaksa araya Noktalı Virgül (;) konur.",
            example: "",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Boşluk Doldurma (10 Soru)",
        desc: "Boşluk doldurma sorularını cevaplayınız.",
        questions: [
          {
            id: 1,
            q: '"Dün akşam ödevlerimi bitirip erkenden uyu.... " (Geçmiş zaman)',
            options: ["dum", "yorum"],
            correct: 0,
          },
          {
            id: 2,
            q: "Gelecek yaz ailece Bursa( )ya tatile gideceğiz.",
            options: ["' (Kesme işareti)", "- (Kısa çizgi)"],
            correct: 0,
          },
          {
            id: 3,
            q: '"Elbise" kelimesi satır sonunda bölünürken elbi( )se şeklinde hecelenmelidir.',
            options: ["-", "."],
            correct: 0,
          },
          {
            id: 4,
            q: "Yaşasın, yarın hep birlikte maça gidiyoruz( )",
            options: ["!", "."],
            correct: 0,
          },
          {
            id: 5,
            q: "Kırtasiyeden şunları aldım( ) defter, silgi ve yeni bir kurşun kalem.",
            options: [":", ";"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Kuşlar gökyüzünde neşeyle uçuyor( )" cümlesi şimdiki zamandadır.',
            options: ["lar", "du"],
            correct: 0,
          },
          {
            id: 7,
            q: "Arkadaşım Ömer( )in elindeki mavi fırça çok kalındı.",
            options: ["'", ","],
            correct: 0,
          },
          {
            id: 8,
            q: "Eyvah, cüzdanımı okul bahçesinde düşürmüşüm( )",
            options: ["!", "."],
            correct: 0,
          },
          {
            id: 9,
            q: "Mert, Ömer, Can erkekler( ) Sıla, Elif, Zeynep ise kızlar grubundadır.",
            options: [";", ":"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Yarın sabah hava tamamen aç.... " (Gelecek zaman)',
            options: ["acak", "tı"],
            correct: 0,
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Karma Test Arenası (10 Soru)",
        desc: "Doğru olan seçeneği tıklayıp seçiniz.",
        questions: [
          {
            q: "Eylemin şu an, tam gözümüzün önünde yapıldığını anlatan zaman eki hangisidir?",
            words: ["-di", "-yor", "-ecek"],
            correct: "-yor",
          },
          {
            q: "Aşağıdaki kelimelerin hangisinde ek ayrımı tamamen doğru yapılmıştır?",
            words: ["İzmir'den", "Masa'dan", "Kalem'i"],
            correct: "İzmir'den",
          },
          {
            q: "Hangi kelime satır sonunda kısa çizgiyle doğru hecelenerek bölünmüştür?",
            words: ["ka-lemıtraş", "kal-emtiraş", "kalemı-traş"],
            correct: "ka-lemıtraş",
          },
          {
            q: "Ani gelişen büyük korku, panik veya sevinç bildiren cümlelerin sonuna hangisi konur?",
            words: ["Nokta (.)", "Ünlem İşareti (!)", "Soru İşareti (?)"],
            correct: "Ünlem İşareti (!)",
          },
          {
            q: '"Kırmızı, sarı renkler ; kare, üçgen ise şekillerdir." cümlesinde noktalı virgül hangi amaçla kullanılmıştır?',
            words: [
              "Örnekleri sıralamak için",
              "Renkler ve şekiller gibi iki farklı grubu ayırmak için",
              "Soru sormak için",
            ],
            correct: "Renkler ve şekiller gibi iki farklı grubu ayırmak için",
          },
          {
            q: '"Dün akşam odamı çok güzel topladım." cümlesinin zaman yapısı hangisidir?',
            words: ["Geçmiş Zaman", "Şimdiki Zaman", "Gelecek Zaman"],
            correct: "Geçmiş Zaman",
          },
          {
            q: "Cins isimlerin (çanta, kapı, kase) sonuna gelen ekler kesme işaretiyle ayrılır mı?",
            words: [
              "Hayır, asla ayrılmaz.",
              "Evet, her zaman ayrılır.",
              "Kelimenin boyuna göre değişir.",
            ],
            correct: "Hayır, asla ayrılmaz.",
          },
          {
            q: "Satır sonunda kelime bölünürken yukarıdaki satırda tek bir harf (örneğin a-raba şeklinde) bırakılabilir mi?",
            words: [
              "Evet, bırakılabilir.",
              "Hayır, kesinlikle bırakılamaz (Yazım hatası olur).",
              "Sadece isimlerde bırakılır.",
            ],
            correct: "Hayır, kesinlikle bırakılamaz (Yazım hatası olur).",
          },
          {
            q: '"Dikkat, yerdeki basamaklar yağmurdan ötürü ıslak!" cümlesi ne tür bir cümledir?',
            words: [
              "Soru cümlesi",
              "Uyarı bildiren ünlem cümlesi",
              "Sıradan bitmiş cümle",
            ],
            correct: "Uyarı bildiren ünlem cümlesi",
          },
          {
            q: '"Dolaptan şunları çıkardım : mavi kase, iki kaşık ve tabak." cümlesinde iki nokta işareti neden kullanılmıştır?',
            words: [
              "Farklı grupları ayırmak için",
              "Örnekler verileceğini göstermek için",
              "Cümleyi bitirmek için",
            ],
            correct: "Örnekler verileceğini göstermek için",
          },
        ],
      },
    },
  },
  "tekrar-5": {
    country: {
      title: "Ülkemi Tanıyorum",
      info: {
        title:
          "📇 ÜLKEMİ ÖĞRENİYORUM SÜPER KÜLTÜR KARTI: Türk Kültürü, Sanatı ve Bilgeliği",
        rules: [
          {
            name: "El Sanatları ve Danslarımız (Sandık 21-23)",
            desc: "Kültür ve sanat haritasında içi yoğun kitreli sıvı dolu tekne üzerinde renklerin yüzdüğü Ebru Sanatı çizgileri; çark üzerinde dönen gri çamurdan testi yapımı ve mavi renkli Kütahya çinileri yer alır. Dans bölümünde ise Karadeniz'de hızlı adımlarla oynayan Horon ekibi, Ege'de kartal gibi kanat açan Zeybek ve el ele tutuşulan Halay çizgileri resmedilmiştir.",
          },
          {
            name: "Tiyatro ve Bilgelik (Sandık 24-25)",
            desc: 'Geleneksel sahne şablonunda arkasından ışık sızan gölge perdesinde atışan çubuklu Karagöz ve Hacivat kuklaları ile meydanda oynanan Orta Oyunu çizgileri bulunur. Mizah haritasında ise ak sakallı, eşeğe ters binmiş Nasreddin Hoca resmi ve Akşehir Gölü\'ne yoğurt mayası çalarken "Ya tutarsa!" dediği o bilge fıkra sahnesi parıldar.',
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Coğrafya Avı",
        desc: "Açıklama: Aşağıdaki cümlelerde boş bırakılan yerleri Kültür Kartı'ndaki harita bilgilerine uygun şekilde tamamlayınız.",
        questions: [
          {
            q: "Yoğunlaştırılmış bitkisel sıvı dolu tekne üzerinde boyaların yüzdürülmesiyle yapılan geleneksel resim sanatına ..... sanatı denir.",
            words: ["ebru", "çini"],
            correct: "ebru",
          },
          {
            q: "Killi nemli toprağın dönen bir çark üzerinde el yardımıyla kap ve kase yapılması işine ..... adı verilir.",
            words: ["çömlekçilik", "halıcılık"],
            correct: "çömlekçilik",
          },
          {
            q: "Karadeniz kıyısındaki insanların kemençe sesinin ritmiyle hızlıca oynadığı zincir dansı ..... 'dur.",
            words: ["Horon", "Zeybek"],
            correct: "Horon",
          },
          {
            q: "Gölge oyunundaki kel kafalı, söylenen her şeyi yanlış anlayarak bizi güldüren halk karakteri ..... 'göz'dür.",
            words: ["Karagöz", "Hacivat"],
            correct: "Karagöz",
          },
          {
            q: "Eşeğine yüzü arkaya bakacak şekilde ters binen o tonton ak sakallı bilge dedemiz ..... Hoca'dır.",
            words: ["Nasreddin", "Ahmet"],
            correct: "Nasreddin",
          },
          {
            q: "Ebru boyalarına suyun yüzeyinde lale ve çiçek şekli vermek için kullanılan ince metal çubuğun adı ..... çubuğudur.",
            words: ["biz", "çekiç"],
            correct: "biz",
          },
          {
            q: "Tabak kase resimlerinin ve saray duvarı taşlarının mavi renkli lale motifleriyle süslenmesi ..... sanatıdır.",
            words: ["çini", "ebru"],
            correct: "çini",
          },
          {
            q: "Ege efelerinin kollarını tıpkı bir kartal gibi iki yana açarak oynadığı mertlik dansı ..... oyunudur.",
            words: ["Zeybek", "Halay"],
            correct: "Zeybek",
          },
          {
            q: "Karagöz ve Hacivat'ın arkasından ışık verilen o şeffaf beyaz perde alanına hayal ..... adı verilir.",
            words: ["perdesi", "odası"],
            correct: "perdesi",
          },
          {
            q: "Nasreddin Hoca'nın elindeki kaseyle göl kıyısında yaptığı kilit hareket, şaşkın bakan komşularına karşı göle ..... çalmaktır.",
            words: ["maya", "taş"],
            correct: "maya",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Büyük Karma Test",
        desc: "Açıklama: Karışık konulardan oluşan test sorularında harita özelliklerine dikkat ederek doğru seçeneği bulunuz.",
        questions: [
          {
            q: "Ebru fırçalarının sapı haritadaki somut nesne tanımlarına göre hangi ağacın veya bitkinin dalından yapılmaktadır?",
            options: [
              "Çam ağacı dalından",
              "Gerçek gül dalından ve at kılından",
              "Plastik borulardan",
            ],
            correct: 1,
          },
          {
            q: "Üzerinde parlak mavi, lacivert ve kırmızı çini tabak resimleri olan, haritada yıldızla işaretlenmiş tarihi çini ve seramik şehrimiz hangisidir?",
            options: ["Antalya", "Kütahya", "Trabzon"],
            correct: 1,
          },
          {
            q: "Davul zurna eşliğinde insanların parmak parmağa kenetlenerek yan yana uzun bir sıra oluşturduğu geleneksel halk oyunumuz hangisidir?",
            options: ["Halay", "Zeybek", "Vals"],
            correct: 0,
          },
          {
            q: "Gölge oyununda Karagöz'ün tam karşısında duran, kibar diliyle konuşan, okumuş ve bilgili olan diğer ana karakter kimdir?",
            options: ["Kavuklu", "Hacivat", "Pişekar"],
            correct: 1,
          },
          {
            q: "Nasreddin Hoca'nın elindeki kaşıklarla yoğurt mayası döktüğü, İç Anadolu Bölgesi'ndeki o meşhur gölün adı nedir?",
            options: ["Van Gölü", "Akşehir Gölü", "Tuz Gölü"],
            correct: 1,
          },
          {
            q: "Ebru teknesindeki suyun yoğun, kıvamlı olmasını ve boyaların dibe batmadan yüzmesini sağlayan bitkisel sıvının adı nedir?",
            options: ["Kitre", "Sirke", "Limonata"],
            correct: 0,
          },
          {
            q: "Toprak kaselerin ve testilerin kırılmaması, taş gibi sert ve dayanıklı olması için usta çömlekçiler hangi somut işlemi yapar?",
            options: [
              "Suyu içine doldurup bekletirler.",
              "Yüksek ateşli özel fırınlarda pişirirler.",
              "Güneşte kuruturlar.",
            ],
            correct: 1,
          },
          {
            q: "Kemençenin hızlı ritim çizgileriyle eşleşen, oyuncuların ellerini yukarı kaldırıp aniden aşağı eğildiği Karadeniz oyunu hangisidir?",
            options: ["Zeybek", "Horon", "Bar"],
            correct: 1,
          },
          {
            q: "Büyük tiyatro binaları ve sahne olmadan, doğrudan halkın ortasındaki boş meydanda canlı oyuncularla oynanan halk tiyatrosu hangisidir?",
            options: ["Gölge Oyunu", "Orta Oyunu", "Sinema filmi"],
            correct: 1,
          },
          {
            q: "Nasreddin Hoca fıkralarının kültürümüzdeki en büyük ve en kilit ortak amacı aşağıdakilerden hangisidir?",
            options: [
              "Çocukları sadece korkutup susturmak",
              "İnsanları neşeyle güldürürken aynı zamanda bilgece düşündürmek ve önemli dersler vermek",
              "Sadece kelimeleri heceletmek",
            ],
            correct: 1,
          },
        ],
      },
    },
    story: null as any,
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "📇 DİL BİLGİSİ SÜPER BİLGİ KARTI",
        rules: [
          {
            name: "Özne ve Yüklem",
            desc: "İşi bitiren ana kelime Yüklem, o işi yapan varlık ise Özne adını alır.",
            example: "",
          },
          {
            name: "Gerçek ve Mecaz Anlam",
            desc: "Sözcüğün akla gelen ilk somut anlamı Gerçek, kazandığı soyut anlam ise Mecaz anlamdır.",
            example: "",
          },
          {
            name: "Hal Ekleri",
            desc: "İsmin odalarıdır: yalın, -e (yönelme), -i (belirtme), -de (bulunma), -den (ayrılma) durumlarıdır.",
            example: "",
          },
          {
            name: "Deyimler ve Atasözleri",
            desc: "Durumları etkili anlatan mecaz kalıplardır veya bilgece öğüt veren cümlelerdir.",
            example: "",
          },
          {
            name: "Metin Bilgisi (Konu ve Ana Fikir)",
            desc: "Metindeki somut olay metnin Konusu, çıkarılan ana ders ise Ana Fikir olur.",
            example: "",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Boşluk Doldurma (10 Soru)",
        desc: "Boşluk doldurma sorularını cevaplayınız.",
        questions: [
          {
            id: 1,
            q: '"Mert odasındaki bütün renkli blokları kutuya doldurdu." cümlesinde doldurma işini yapan .................... kelimesi öznedir.',
            options: ["Mert", "kutuya"],
            correct: 0,
          },
          {
            id: 2,
            q: "Arkadaşının söylediği o çok kırıcı, ağır sözlere çok .................... (Mecaz anlam)",
            options: ["kırıldı", "düştü"],
            correct: 0,
          },
          {
            id: 3,
            q: "Kaan koşarak evdeki atölye.... renkli fırçaları getirdi. (Ayrılma hali)",
            options: ["den", "de"],
            correct: 0,
          },
          {
            id: 4,
            q: "Murat odasının dağınık halini görünce çok şaşırdı, yani gözlerine ....................",
            options: ["inanamadı", "baktı"],
            correct: 0,
          },
          {
            id: 5,
            q: "Bir hikayenin okuyucuya vermek istediği ana öğüde ve derse metnin .................... fikri denir.",
            options: ["ana", "yan"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Zeynep odasında sessizce yeni bir öykü okudu." cümlesindeki "okudu" kelimesi cümlenin .................... ögesidir.',
            options: ["yüklem", "özne"],
            correct: 0,
          },
          {
            id: 7,
            q: "Kış sabahı buzdolabından buz gibi soğuk bir .................... çıkardı. (Gerçek anlam)",
            options: ["süt", "söz"],
            correct: 0,
          },
          {
            id: 8,
            q: "Selim en sevdiği mavi oyuncak yarış arabasıyla oynamak için odaya doğru .................... (Yönelme hali eylemi)",
            options: ["yürüdü", "oturdu"],
            correct: 0,
          },
          {
            id: 9,
            q: 'Biriktirmenin ve tasarrufun önemini anlatan ünlü atasözümüz "Damlaya damlaya .................... olur." şeklindedir.',
            options: ["göl", "deniz"],
            correct: 0,
          },
          {
            id: 10,
            q: '"Bu okuma metninde genel olarak ne anlatılıyor?" sorusunun cevabı bize metnin .................... verir.',
            options: ["konusunu", "ana fikrini"],
            correct: 0,
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Karma Test Arenası (10 Soru)",
        desc: "Doğru olan seçeneği tıklayıp seçiniz.",
        questions: [
          {
            q: '"Usta çömlekçi killi çamura elleriyle pürüzsüz bir şekil verdi." cümlesinin yüklemi (işi bitiren kelimesi) hangisidir?',
            words: ["çamura", "şekil verdi", "elleriyle"],
            correct: "şekil verdi",
          },
          {
            q: "Hangi seçenekte yer alan altı çizili kelime tamamen mecaz (soyut) anlamda kullanılmıştır?",
            words: [
              "Karanlık odada elektrik düğmesini aradı.",
              "Bu karanlık işlerin arkasında kimin olduğunu anlamadı.",
              "Kutunun içindeki eski anahtarı buldu.",
            ],
            correct: "Bu karanlık işlerin arkasında kimin olduğunu anlamadı.",
          },
          {
            q: '"Çınar bahçede eski bir köstekli saat buldu." cümlesindeki "bahçede" kelimesi adın hangi halindedir?',
            words: [
              "Yönelme Hali (-e)",
              "Bulunma Hali (-de)",
              "Ayrılma Hali (-den)",
            ],
            correct: "Bulunma Hali (-de)",
          },
          {
            q: "Çok büyük bir dikkatle ve hiçbir kelimeyi kaçırmadan dinlemeyi anlatan deyim hangisidir?",
            words: ["Kulak kabartmak", "Can kulağıyla dinlemek", "Göz yummak"],
            correct: "Can kulağıyla dinlemek",
          },
          {
            q: "Bir metnin ana fikri okuyucuya neyi aktarmak amacıyla yazılır?",
            words: [
              "Hikayedeki karakterlerin isimlerini",
              "Metinden çıkarılması gereken bilgece ana dersi ve öğüdü",
              "Olayın geçtiği yerin adresini",
            ],
            correct: "Metinden çıkarılması gereken bilgece ana dersi ve öğüdü",
          },
          {
            q: '"Küçük yeşil tırtıl bahçedeki yaprağın üzerinde günlerdir duruyor." cümlesinde durma eylemini yapan Özne hangisidir?',
            words: ["Küçük yeşil tırtıl", "yaprağın", "duruyor"],
            correct: "Küçük yeşil tırtıl",
          },
          {
            q: "Aşağıdaki altı çizili kelimelerden hangisi akla gelen ilk gerçek (somut) anlamıyla kullanılmıştır?",
            words: [
              "Ağır poşetleri merdivenden yukarı çıkardı.",
              "Söylediği ağır sözler arkadaşını çok üzdü.",
              "O kadar ince bir insandı ki herkes onu severdi.",
            ],
            correct: "Ağır poşetleri merdivenden yukarı çıkardı.",
          },
          {
            q: "İsmin yönelme halini (-e hali) içeren kelime hangi seçenekte yer almaktadır?",
            words: ["Atölyeden çıktı.", "Parka doğru koştu.", "Evde bekliyor."],
            correct: "Parka doğru koştu.",
          },
          {
            q: '"Birlikten kuvvet doğar." atasözü bize temel olarak hangi erdemi ve gücü öğütler?',
            words: [
              "Tek başına çalışmayı",
              "Birlik olmayı, yardımlaşmayı ve el ele vermeyi",
              "Sürekli dinlenmeyi",
            ],
            correct: "Birlik olmayı, yardımlaşmayı ve el ele vermeyi",
          },
          {
            q: "Metindeki olayların bütününe ve somut olarak ne anlatıldığına ne ad verilir?",
            words: ["Metnin Konusu", "Metnin Ana Fikri", "Metnin Yazarı"],
            correct: "Metnin Konusu",
          },
        ],
      },
    },
  },
  "tekrar-6": {
    country: {
      title: "Ülkemi Tanıyorum",
      info: {
        title:
          "📇 ÜLKEMİ ÖĞRENİYORUM SÜPER KÜLTÜR KARTI: Türk Müziği ve Büyük Bilim Yolculuğu",
        rules: [
          {
            name: "Müzik ve Tarihi Bilim (Sandık 26-28)",
            desc: "Müzik kültürü haritasında uzun saplı telli bağlama, sarı kamıştan yapılmış huzur sesli ney ve yatay çalınan çok telli kanun resimleri yer alır. Bilim haritasında ise sekiz yüz yıl önce yapılan bakır dişli çarklar, su gücüyle çalışan otomatik robotlar, dev Filli Su Saati icat çizgileri (Cezeri) ve matematik haritasının tam ortasında parıldayan kırmızı Sıfır (0) rakamı ile bilinmeyeni çözen X işareti (Harezmi) uzanır.",
          },
          {
            name: "Modern Bilim ve Büyük Final (Sandık 29-30)",
            desc: "Laboratuvardaki mercekli mikroskop, vücudumuzun kalıtım şifresi olan renkli DNA sarmalı ve parlak altın Nobel Ödülü madalyası (Aziz Sancar) çizilidir. Final çizgisi ise göğe yükselen dev roket, beyaz uzay giysisiyle Alper Gezeravcı ve zihnimizi büyüten o en büyük büyük Bilgi Hazinesi simgesidir.",
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 1: Karma Coğrafya Avı",
        desc: "Açıklama: Aşağıdaki cümlelerde boş bırakılan yerleri Kültür Kartı'ndaki harita bilgilerine uygun şekilde tamamlayınız.",
        questions: [
          {
            q: "Türk halk müziğinde ozanların elinde gördüğümüz, mızrapla çalınan en kilit telli çalgı ..... sazıdır.",
            words: ["bağlama", "piyano"],
            correct: "bağlama",
          },
          {
            q: "Dünyada ilk kez kendi kendine çalışan otomatik makineler ve robotlar tasarlayan Artuklu mucidimiz ..... 'dir.",
            words: ["Cezeri", "Harezmi"],
            correct: "Cezeri",
          },
          {
            q: "Matematik işlemlerine sıfır (0) rakamını kazandırarak Cebir biliminin temellerini kuran dehamız ..... 'dir.",
            words: ["Harezmi", "Aziz Sancar"],
            correct: "Harezmi",
          },
          {
            q: "2015 yılında hücrelerin DNA tamir haritasını somut olarak çıkarıp altın Nobel Ödülü'nü alan gururumuz ..... 'dır.",
            words: ["Aziz Sancar", "Alper Bey"],
            correct: "Aziz Sancar",
          },
          {
            q: "Ay yıldızlı şanlı bayrağımızla uzay istasyonuna giderek ilk uzay misyonunu yapan astronotumuz ..... Gezeravcı'dır.",
            words: ["Alper", "Mehmet"],
            correct: "Alper",
          },
          {
            q: "Sarı kargı kamışından yapılan, içine nefesle doğru açıdan üflenerek çalınan huzur sesli çalgıya ..... adı verilir.",
            words: ["ney", "kanun"],
            correct: "ney",
          },
          {
            q: "Cezeri'nin su gücü ve bakır dişlilerle çalıştırdığı, üzerinde fil ve ejderha çarkları bulunan en ünlü eseri Filli Su ..... 'dir.",
            words: ["Saati", "Motoru"],
            correct: "Saati",
          },
          {
            q: "Bugün bilgisayarların ve akıllı telefonların çalışma mantığı olan adım adım çözüm sıralamasına ..... sistemi denir.",
            words: ["algoritma", "çini"],
            correct: "algoritma",
          },
          {
            q: "Profesör Doktor Aziz Sancar, tıp ve kimya laboratuvarında en çok hücre tedavileri ve ..... hastalığı üzerine çalışmıştır.",
            words: ["kanser", "nezle"],
            correct: "kanser",
          },
          {
            q: "1. Sandıktan 30. Sandığa kadar açılan tüm bu kutulardan çıkan, ömür boyu taşıyacağımız gerçek büyük hazine ..... gücüdür.",
            words: ["bilginin", "paranın"],
            correct: "bilginin",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 2: Büyük Karma Test",
        desc: "Açıklama: Karışık konulardan oluşan test sorularında harita özelliklerine dikkat ederek doğru seçeneği bulunuz.",
        questions: [
          {
            q: "Masa üzerine yatay yatırılarak, parmak uçlarına takılan yüzük mızraplarla çalınan çok telli geleneksel çalgımız hangisidir?",
            options: ["Davul", "Kanun", "Ney"],
            correct: 1,
          },
          {
            q: "Cezeri'nin icat ettiği o harika otomatik makinelerin ve mekanik araçların resimli çizimlerini topladığı kilit eserin adı nedir?",
            options: [
              "Kelime Sözlüğü Kitabı",
              "Olağanüstü Mekanik Araçların Bilgisi Kitabı",
              "Şiir Defteri",
            ],
            correct: 1,
          },
          {
            q: "Harezmi sıfır (0) sayısını matematik dünyasına dahil etmeden önce, dünyadaki hesap kitap işlemlerinde sıfırın yeri nasıl bırakılıyordu?",
            options: [
              "Dokuz yazılıyordu.",
              "Tamamen boş bir alan olarak boşluk bırakılıyordu.",
              "Yıldız simgesi konuyordu.",
            ],
            correct: 1,
          },
          {
            q: "Aziz Sancar, laboratuvarda tüpler içinde mikroskopla incelediği, vücudumuzun kalıtım şifresini barındıran sarmal yapı hangisidir?",
            options: ["Kan pulcukları", "DNA sarmalları", "Kas lifleri"],
            correct: 1,
          },
          {
            q: "Uzay haritasındaki ateşlenen o dev roket resmi ülkemizin bilim ve teknolojide hangi alana somut olarak güçlü bir adım attığını gösterir?",
            options: [
              "Sadece denizcilik alanına",
              "Havacılık, uzay teknolojileri ve gelecek bilim vizyonu alanına",
              "Çömlekçilik faaliyetlerine",
            ],
            correct: 1,
          },
          {
            q: "Bağlama (saz) çalınırken tellerin ses vermesi için el ile tellere somut olarak vurmamızı sağlayan o küçük esnek nesnenin adı nedir?",
            options: ["Mızrap (Tezene)", "Çekiç", "Biz çubuğu"],
            correct: 0,
          },
          {
            q: "Cezeri'nin icat ettiği robotik ve otomatik makinelerin en büyük somut çalışma kuralı aşağıdakilerden hangisidir?",
            options: [
              "Büyük elektrik pilleri ve kablolarla çalışması",
              "Tamamen su gücü, yerçekimi ve bakır dişli çarkların dengesiyle kendi kendine hareket etmesi",
              "Kömür yakarak duman çıkarması",
            ],
            correct: 1,
          },
          {
            q: "Denklem çözerken bulmaya çalıştığımız, Harezmi'nin sistemine dayanan gizli ve bilinmeyen sayıya matematik haritasında hangi simge verilir?",
            options: ["A harfi", "X işareti", "Z harfi"],
            correct: 1,
          },
          {
            q: "Aziz Sancar, kazandığı o büyük parlak altın Nobel madalyasını vatanına ve Ata'sına bağlılığından ötürü hangi müzeye hediye etmiştir?",
            options: [
              "Amerika'daki kütüphaneye",
              "Ankara'daki Anıtkabir Müzesi'ne",
              "Kendi evindeki çekmeceye",
            ],
            correct: 1,
          },
          {
            q: '"Türkçe Hazinesi" platformunun bu en son büyük final sandığı kapandığında ulaşılan gerçek somut hazine kutusundan ne çıkmıştır?',
            options: [
              "Parlak altın madenleri",
              'İnsanın zihnini büyüten, aydınlatan köklü "Bilgi, Dil ve Kültür Hazinesi"',
              "Boş bir kağıt parçası",
            ],
            correct: 1,
          },
        ],
      },
    },
    story: null as any,
    lang: {
      title: "Dilimi Geliştiriyorum",
      info: {
        title: "📇 DİL BİLGİSİ SÜPER BİLGİ KARTI",
        rules: [
          {
            name: "Kök Bilgisi (İsim ve Fiil)",
            desc: 'Kelimenin en küçük parçasıdır. "-mek" alanlar Fiil Kökü (bak-), almayanlar İsim Kökü (göz) olur.',
            example: "",
          },
          {
            name: "Cümle Türleri (Olumlu/Olumsuz)",
            desc: "İş yapıldıysa Olumlu, yapılmadıysa (-me, değil, yok) Olumsuz cümle kurulur.",
            example: "",
          },
          {
            name: "Yansıma Sözcükler",
            desc: "Doğadaki seslerin birebir taklitleridir. Kulağımızla duyduğumuz somut seslerdir. (tık, çat, pat, hışır)",
            example: "",
          },
          {
            name: "de / ki Bağlaçlarının Yazımı",
            desc: "Cümleden çıkınca anlam bozulmayan bağlaçlar ayrı, nerede olduğunu bildiren ekler bitişik yazılır.",
            example: "",
          },
        ],
      },
      etkinlik2: {
        title: "🎯 ETKİNLİK 1: Karma Boşluk Doldurma (10 Soru)",
        desc: "Boşluk doldurma sorularını cevaplayınız.",
        questions: [
          {
            id: 1,
            q: '"Gözlüğü" kelimesinin anlamlı en küçük isim kökü .................... sözcüğüdür.',
            options: ["göz", "gözlük"],
            correct: 0,
          },
          {
            id: 2,
            q: '"Eren alet kutusunda küçük çiviyi bulamadı." cümlesi yapıca .................... bir cümledir.',
            options: ["olumsuz", "olumlu"],
            correct: 1,
          },
          {
            id: 3,
            q: "Kürek metal saate çarpınca merdivende .... diye somut bir ses çıkardı.",
            options: ["tıkır", "şırıl"],
            correct: 0,
          },
          {
            id: 4,
            q: "Bugün okul çıkışında Murat .... bizimle parka gelecek.",
            options: ["da (ayrı)", "da (bitişik)"],
            correct: 0,
          },
          {
            id: 5,
            q: '"Baktığında" kelimesinin anlamlı en küçük eylem (fiil) kökü .................... sözcüğüdür.',
            options: ["bak", "bakış"],
            correct: 0,
          },
          {
            id: 6,
            q: '"Tozlu kitabı masanın üzerindeki ışığın altına götürdü." cümlesi yapıca .................... bir cümledir.',
            options: ["olumlu", "olumsuz"],
            correct: 0,
          },
          {
            id: 7,
            q: "Sonbahar rüzgarı estikçe meşe ağacının kuru yaprakları .... dökülüyordu.",
            options: ["hışır hışır", "vız vız"],
            correct: 0,
          },
          {
            id: 8,
            q: "Masanın üzerindeki yerini alan masa.... büyüteç çok parlaktı.",
            options: ["daki (bitişik)", "da ki (ayrı)"],
            correct: 0,
          },
          {
            id: 9,
            q: 'Sonuna "-mek / -mak" eki getirilebilen hareket bildiren köklere .................... kökü adı verilir.',
            options: ["fiil (eylem)", "isim"],
            correct: 0,
          },
          {
            id: 10,
            q: "Bir cümlede işin, hareketin yapılmadığını veya yok olduğunu anlatmak için yükleme .................... eki getirilir.",
            options: ["-ma / -me", "-yor"],
            correct: 0,
          },
        ],
      },
      etkinlik1: {
        title: "🎯 ETKİNLİK 2: Karma Test Arenası (10 Soru)",
        desc: "Doğru olan seçeneği tıklayıp seçiniz.",
        questions: [
          {
            q: '"Kitapçıdan yeni bir sözlük aldım." cümlesindeki "kitapçıdan" kelimesinin en küçük anlamlı kökü hangisidir?',
            words: ["kitap", "kitapçı", "kitapçılık"],
            correct: "kitap",
          },
          {
            q: "Aşağıdaki cümlelerden hangisi anlamı ve yapısı yönüyle Olumsuz bir cümle özelliğidir?",
            words: [
              "Asya sonbahar sabahında büyük ormanda yürüdü.",
              "Kutunun içinde aradığı küçük çividen hiç yoktu.",
              "Eren metal atacı bükerek düz uzun bir tel yaptı.",
            ],
            correct: "Kutunun içinde aradığı küçük çividen hiç yoktu.",
          },
          {
            q: "Aşağıdaki cümlelerin hangisinde doğadaki seslerin taklit edildiği bir yansıma sözcük kullanılmıştır?",
            words: [
              "Bahçedeki küçük kedi sütünü içti.",
              "Balon aniden pat diye patlayınca çok korktum.",
              "Kırtasiyeden sarı bir silgi aldım.",
            ],
            correct: "Balon aniden pat diye patlayınca çok korktum.",
          },
          {
            q: 'Hangi cümledeki "de" bağlacının yazımı tamamen doğrudur?',
            words: [
              "Kardeşim de bizimle bahçede oynayacak.",
              "Kardeşimde bizimle bahçede oynayacak.",
              "Kardeşim de bizimle bahçe de oynayacak.",
            ],
            correct: "Kardeşim de bizimle bahçede oynayacak.",
          },
          {
            q: '"Masa, taş, kutu, kitap" kelimelerinin tamamı kök türü bakımından hangisine girmektedir?',
            words: ["Fiil Kökü", "İsim Kökü", "Yapım Eki"],
            correct: "İsim Kökü",
          },
          {
            q: "\"Sinan derin bir nefes alarak 'Merhaba baba!' sözünü neşeyle söyledi.\" cümlesinin türü hangisidir?",
            words: ["Olumsuz cümle", "Olumlu cümle", "Soru cümlesi"],
            correct: "Olumlu cümle",
          },
          {
            q: "Kulağımızla somut sesini duymadığımız, sadece görselliği olan aşağıdaki kelimelerden hangisi bir yansıma sözcük olamaz?",
            words: ["Çat", "Parlamak", "Tıkır"],
            correct: "Parlamak",
          },
          {
            q: 'Hangi cümledeki "ki" ekinin/bağlacının yazımında bir hata yapılmıştır?',
            words: [
              "Bahçedeki yaşlı meşe ağacı yüz yaşındaydı.",
              "Öyle büyük bir hazineki altınlar onun yanında sönük kalır.",
              "Demek ki gerçek hazine altın değil, bilgiymiş.",
            ],
            correct:
              "Öyle büyük bir hazineki altınlar onun yanında sönük kalır.",
          },
          {
            q: "Kelimelerin üzerindeki tüm ekler kesilip atıldığında geriye kalan en küçük anlamlı parçaya ne ad verilir?",
            words: ["Kök", "Gövde", "Yapım eki"],
            correct: "Kök",
          },
          {
            q: '" de, değil, yok, -me" unsurları cümle yüklemine geldiğinde o cümlenin anlam yönünü nasıl etkiler?',
            words: [
              "Cümleyi olumlu yapar.",
              "Cümleyi olumsuz yapar, işin gerçekleşmediğini bildirir.",
              "Cümleyi soru cümlesine çevirir.",
            ],
            correct: "Cümleyi olumsuz yapar, işin gerçekleşmediğini bildirir.",
          },
        ],
      },
    },
  },
};

// RUNTIME FIX: Fix schema issues dynamically
for (const chestKey in CHESTS_CONTENT) {
  const chest = CHESTS_CONTENT[chestKey];
  if (chest) {
    // 1. Move country data OUT of lang if it was accidentally nested inside lang
    if (chest.lang && (chest.lang as any).country) {
      chest.country = (chest.lang as any).country;
      delete (chest.lang as any).country;
    }

    // 2. Swap etkinlik1 and etkinlik2 for ALL chests because their data was injected backwards.
    // This prevents the UI from crashing on "options map undefined" or "words undefined".
    if (chest.lang && chest.lang.etkinlik1 && chest.lang.etkinlik2) {
      const temp = chest.lang.etkinlik1;
      chest.lang.etkinlik1 = chest.lang.etkinlik2 as any;
      chest.lang.etkinlik2 = temp as any;
    }
    if (chest.country && chest.country.etkinlik1 && chest.country.etkinlik2) {
      const temp = chest.country.etkinlik1;
      chest.country.etkinlik1 = chest.country.etkinlik2 as any;
      chest.country.etkinlik2 = temp as any;
    }
  }
}
