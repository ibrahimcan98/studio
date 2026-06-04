const fs = require('fs');

const generateChestData = (id) => {
  return `
  "${id}": {
    okuyorumAnliyorum: {
      title: "Sandık ${id} Hikayesi",
      theme: "Macera ${id}",
      text: "Bu, Sandık ${id} için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık ${id}", "Sandık ${parseInt(id)+1}", "Sandık ${parseInt(id)+2}", "Sandık ${parseInt(id)+3}"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - ${id}",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru ${id}", "Yanliş ${id}", "Hata ${id}", "Kusur ${id}"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - ${id}",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  }`;
};

let output = `export interface Question {
  id?: string | number;
  q: string;
  options?: string[];
  words?: string[];
  images?: { src: string; alt?: string }[];
  correct: number | string;
}

export interface ReadingComprehensionData {
  title: string;
  theme: string;
  text: string;
  questions: Question[];
}

export interface LanguageLearningData {
  title: string;
  desc: string;
  questions: Question[];
}

export interface CountryLearningData {
  title: string;
  desc: string;
  questions: Question[];
}

export interface ChestContent {
  okuyorumAnliyorum: ReadingComprehensionData;
  dilimiOgreniyorum: LanguageLearningData;
  ulkemiOgreniyorum: CountryLearningData;
}

export const CHESTS_CONTENT: Record<string, ChestContent> = {
`;

for (let i = 1; i <= 30; i++) {
  output += generateChestData(i.toString());
  if (i < 30) output += ",\n";
}

output += "\n};\n";

fs.writeFileSync('src/data/turkce-hazinem-data.ts', output, 'utf8');
console.log('Successfully generated src/data/turkce-hazinem-data.ts with 30 chests.');
