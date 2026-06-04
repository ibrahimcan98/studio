const fs = require('fs');

const chest1 = `
  "1": {
    okuyorumAnliyorum: {
      title: "Kırmızı Kulübe",
      theme: "Yardımlaşma - Kısa hikaye",
      text: "Ali ve Ömer öğleden sonra bahçede oynuyordu. Büyük ağacın dalında eski bir kuş yuvası gördüler. Yuvanın bazı tahtaları gevşemişti. Ali evden kırmızı boya getirdi. Ömer de iki fırça aldı. İki arkadaş yuvayı dikkatlice boyadı. Sonra içine biraz yem koydular. Akşam olunca bir kuş gelip yeni yuvasına kondu.",
      questions: [
        { q: "Ali ve Ömer nerede oynuyordu?", options: ["Bahçede", "Sınıfta", "Markette"], correct: 0 },
        { q: "Çocuklar ağacın dalında ne gördü?", options: ["Uçurtma", "Eski bir kuş yuvası", "Top"], correct: 1 },
        { q: "Ali evden ne getirdi?", options: ["Kırmızı boya", "Sarı ip", "Mavi kutu"], correct: 0 },
        { q: "Ömer ne aldı?", options: ["İki fırça", "Bir defter", "Bir tabak"], correct: 0 },
        { q: "Çocuklar yuvanın içine ne koydu?", options: ["Yem", "Oyuncak", "Taş"], correct: 0 },
        { q: "Bu hikayenin ana fikri nedir?", options: ["Yardımlaşarak güzel işler yapılabilir.", "Kuş yuvaları her zaman kırmızı olur.", "Ağaçlara çıkmak gerekir."], correct: 0 }
      ]
    },
    dilimiOgreniyorum: {
      title: "Harfleri Tanıyorum",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı",
          text: "Türkçede konuşurken çıkardığımız sesleri yazıda göstermek için harfleri kullanırız. Harfler birleşir, heceler oluşur. Heceler birleşir, kelimeler oluşur. Kelimeler de bir araya gelerek cümle kurar.\\nTürk alfabesinde 29 harf vardır. Bu harflerin bazıları sesli, bazıları sessiz harftir.\\nSesli harfler şunlardır: a, e, ı, i, o, ö, u, ü.\\nBu harfleri söylerken sesimiz daha rahat çıkar. Sessiz harfleri söylerken ise genellikle yanında bir sesli harf duyarız. Mesela b harfini söylerken “be”, k harfini söylerken “ke” gibi bir ses çıkarırız.\\nHarfleri tanımak, doğru okumak ve doğru yazmak için ilk adımdır."
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 1: Sesli Harfi Seç",
          desc: "Verilen harflerden sesli olanı seç.",
          questions: [
            { q: "Aşağıdakilerden hangisi sesli harftir?", options: ["a", "k", "m"], correct: 0 },
            { q: "Aşağıdakilerden hangisi sesli harftir?", options: ["t", "e", "s"], correct: 1 },
            { q: "Aşağıdakilerden hangisi sesli harftir?", options: ["l", "r", "o"], correct: 2 },
            { q: "Aşağıdakilerden hangisi sesli harftir?", options: ["b", "ü", "n"], correct: 1 },
            { q: "Aşağıdakilerden hangisi sesli harftir?", options: ["ı", "d", "y"], correct: 0 }
          ]
        },
        {
          type: "multiple_choice",
          title: "Etkinlik 2: Sessiz Harfi Seç",
          desc: "Verilen harflerden sessiz olanı seç.",
          questions: [
            { q: "Aşağıdakilerden hangisi sessiz harftir?", options: ["a", "m", "e"], correct: 1 },
            { q: "Aşağıdakilerden hangisi sessiz harftir?", options: ["o", "u", "k"], correct: 2 },
            { q: "Aşağıdakilerden hangisi sessiz harftir?", options: ["s", "i", "ö"], correct: 0 },
            { q: "Aşağıdakilerden hangisi sessiz harftir?", options: ["ü", "t", "e"], correct: 1 },
            { q: "Aşağıdakilerden hangisi sessiz harftir?", options: ["ı", "p", "a"], correct: 1 }
          ]
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
            { label: "t", category: "Sessiz" }
          ]
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye Nerede?",
      activities: [
        {
          type: "info",
          title: "Konu Anlatımı",
          text: "Türkiye, dünya haritasında çok özel bir yerde bulunur. Ülkemizin büyük bölümü Asya kıtasında, küçük bir bölümü ise Avrupa kıtasındadır. Bu yüzden Türkiye için sık sık 'iki kıtayı birbirine bağlayan ülke' denir. Türkiye'ye baktığımızda hem Asya'ya hem Avrupa'ya yakın olduğunu görürüz.\\nTürkiye'nin kuzeyinde Karadeniz, batısında Ege Denizi, güneyinde Akdeniz bulunur. Ayrıca Marmara Denizi de Türkiye'nin içinde yer alan özel bir iç denizdir. Üç tarafı denizlerle çevrili, bir tarafı karaya bağlı olan yerlere yarımada denir. Türkiye de bu özelliğiyle bir yarımadadır.\\nTürkiye'nin bu konumu tarih boyunca çok önemli olmuştur. Farklı insanlar, kültürler, ticaret yolları ve şehirler bu topraklarda buluşmuştur. Bu yüzden Türkiye'yi öğrenmeye başlarken önce onun haritadaki yerini tanımak çok önemlidir. Çünkü ülkemizin denizlerini, bölgelerini, şehirlerini ve kültürünü daha iyi anlamanın ilk adımı budur."
        },
        {
          type: "fill_in_blanks",
          title: "Etkinlik 1: Boşluk Doldurma",
          desc: "Cümleleri doğru kelimelerle tamamla.",
          sentences: [
            { text: "Türkiye’nin büyük bölümü {blank} kıtasındadır.", answer: "Asya" },
            { text: "Türkiye’nin küçük bir bölümü {blank} kıtasındadır.", answer: "Avrupa" },
            { text: "Üç tarafı denizlerle çevrili kara parçalarına {blank} denir.", answer: "yarımada" },
            { text: "Türkiye, Asya ve Avrupa arasında bir {blank} gibidir.", answer: "köprü" }
          ],
          words: ["Asya", "Avrupa", "yarımada", "köprü"]
        },
        {
          type: "true_false",
          title: "Etkinlik 2: Doğru Yanlış",
          desc: "Verilen cümleler doğru mu yanlış mı belirle.",
          questions: [
            { q: "Türkiye’nin üç tarafı denizlerle çevrilidir.", correct: true },
            { q: "Türkiye sadece Avrupa kıtasındadır.", correct: false },
            { q: "Türkiye bir yarımadadır.", correct: true },
            { q: "Türkiye Asya ve Avrupa arasında yer alır.", correct: true },
            { q: "Türkiye’nin çevresinde hiç deniz yoktur.", correct: false }
          ]
        }
      ]
    }
  }
`;

const generateGenericChest = (id) => {
  return `
  "${id}": {
    okuyorumAnliyorum: {
      title: "Sandık ${id} Hikayesi",
      theme: "Macera ${id}",
      text: "Bu, Sandık ${id} için hazırlanmış örnek bir hikaye metnidir.",
      questions: [
        { q: "Bu hangi sandık?", options: ["Sandık ${id}", "Başka"], correct: 0 }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - ${id}",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik 1",
          questions: [
            { q: "Soru 1", options: ["A", "B"], correct: 0 }
          ]
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - ${id}",
      activities: [
        {
          type: "multiple_choice",
          title: "Etkinlik 1",
          questions: [
            { q: "Soru 1", options: ["A", "B"], correct: 0 }
          ]
        }
      ]
    }
  }`;
}


let output = `export interface Question {
  id?: string | number;
  q: string;
  options?: string[];
  correct: number | string | boolean;
}

export interface Activity {
  type: 'info' | 'multiple_choice' | 'sorting' | 'fill_in_blanks' | 'true_false';
  title: string;
  desc?: string;
  text?: string;
  questions?: Question[];
  categories?: string[];
  items?: { label: string; category: string }[];
  sentences?: { text: string; answer: string }[];
  words?: string[];
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
  okuyorumAnliyorum: ReadingComprehensionData;
  dilimiOgreniyorum: LanguageLearningData;
  ulkemiOgreniyorum: CountryLearningData;
}

export const CHESTS_CONTENT: Record<string, ChestContent> = {
${chest1},
`;

for (let i = 2; i <= 30; i++) {
  output += generateGenericChest(i.toString());
  if (i < 30) output += ",\n";
}

output += "\n};\n";

fs.writeFileSync('src/data/turkce-hazinem-data.ts', output, 'utf8');
console.log('Successfully updated src/data/turkce-hazinem-data.ts');
