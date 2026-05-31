export interface Question {
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

  "1": {
    okuyorumAnliyorum: {
      title: "Sandık 1 Hikayesi",
      theme: "Macera 1",
      text: "Bu, Sandık 1 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 1", "Sandık 2", "Sandık 3", "Sandık 4"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 1",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 1", "Yanliş 1", "Hata 1", "Kusur 1"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 1",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "2": {
    okuyorumAnliyorum: {
      title: "Sandık 2 Hikayesi",
      theme: "Macera 2",
      text: "Bu, Sandık 2 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 2", "Sandık 3", "Sandık 4", "Sandık 5"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 2",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 2", "Yanliş 2", "Hata 2", "Kusur 2"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 2",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "3": {
    okuyorumAnliyorum: {
      title: "Sandık 3 Hikayesi",
      theme: "Macera 3",
      text: "Bu, Sandık 3 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 3", "Sandık 4", "Sandık 5", "Sandık 6"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 3",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 3", "Yanliş 3", "Hata 3", "Kusur 3"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 3",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "4": {
    okuyorumAnliyorum: {
      title: "Sandık 4 Hikayesi",
      theme: "Macera 4",
      text: "Bu, Sandık 4 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 4", "Sandık 5", "Sandık 6", "Sandık 7"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 4",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 4", "Yanliş 4", "Hata 4", "Kusur 4"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 4",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "5": {
    okuyorumAnliyorum: {
      title: "Sandık 5 Hikayesi",
      theme: "Macera 5",
      text: "Bu, Sandık 5 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 5", "Sandık 6", "Sandık 7", "Sandık 8"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 5",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 5", "Yanliş 5", "Hata 5", "Kusur 5"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 5",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "6": {
    okuyorumAnliyorum: {
      title: "Sandık 6 Hikayesi",
      theme: "Macera 6",
      text: "Bu, Sandık 6 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 6", "Sandık 7", "Sandık 8", "Sandık 9"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 6",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 6", "Yanliş 6", "Hata 6", "Kusur 6"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 6",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "7": {
    okuyorumAnliyorum: {
      title: "Sandık 7 Hikayesi",
      theme: "Macera 7",
      text: "Bu, Sandık 7 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 7", "Sandık 8", "Sandık 9", "Sandık 10"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 7",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 7", "Yanliş 7", "Hata 7", "Kusur 7"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 7",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "8": {
    okuyorumAnliyorum: {
      title: "Sandık 8 Hikayesi",
      theme: "Macera 8",
      text: "Bu, Sandık 8 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 8", "Sandık 9", "Sandık 10", "Sandık 11"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 8",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 8", "Yanliş 8", "Hata 8", "Kusur 8"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 8",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "9": {
    okuyorumAnliyorum: {
      title: "Sandık 9 Hikayesi",
      theme: "Macera 9",
      text: "Bu, Sandık 9 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 9", "Sandık 10", "Sandık 11", "Sandık 12"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 9",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 9", "Yanliş 9", "Hata 9", "Kusur 9"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 9",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "10": {
    okuyorumAnliyorum: {
      title: "Sandık 10 Hikayesi",
      theme: "Macera 10",
      text: "Bu, Sandık 10 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 10", "Sandık 11", "Sandık 12", "Sandık 13"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 10",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 10", "Yanliş 10", "Hata 10", "Kusur 10"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 10",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "11": {
    okuyorumAnliyorum: {
      title: "Sandık 11 Hikayesi",
      theme: "Macera 11",
      text: "Bu, Sandık 11 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 11", "Sandık 12", "Sandık 13", "Sandık 14"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 11",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 11", "Yanliş 11", "Hata 11", "Kusur 11"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 11",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "12": {
    okuyorumAnliyorum: {
      title: "Sandık 12 Hikayesi",
      theme: "Macera 12",
      text: "Bu, Sandık 12 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 12", "Sandık 13", "Sandık 14", "Sandık 15"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 12",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 12", "Yanliş 12", "Hata 12", "Kusur 12"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 12",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "13": {
    okuyorumAnliyorum: {
      title: "Sandık 13 Hikayesi",
      theme: "Macera 13",
      text: "Bu, Sandık 13 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 13", "Sandık 14", "Sandık 15", "Sandık 16"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 13",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 13", "Yanliş 13", "Hata 13", "Kusur 13"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 13",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "14": {
    okuyorumAnliyorum: {
      title: "Sandık 14 Hikayesi",
      theme: "Macera 14",
      text: "Bu, Sandık 14 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 14", "Sandık 15", "Sandık 16", "Sandık 17"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 14",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 14", "Yanliş 14", "Hata 14", "Kusur 14"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 14",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "15": {
    okuyorumAnliyorum: {
      title: "Sandık 15 Hikayesi",
      theme: "Macera 15",
      text: "Bu, Sandık 15 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 15", "Sandık 16", "Sandık 17", "Sandık 18"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 15",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 15", "Yanliş 15", "Hata 15", "Kusur 15"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 15",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "16": {
    okuyorumAnliyorum: {
      title: "Sandık 16 Hikayesi",
      theme: "Macera 16",
      text: "Bu, Sandık 16 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 16", "Sandık 17", "Sandık 18", "Sandık 19"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 16",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 16", "Yanliş 16", "Hata 16", "Kusur 16"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 16",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "17": {
    okuyorumAnliyorum: {
      title: "Sandık 17 Hikayesi",
      theme: "Macera 17",
      text: "Bu, Sandık 17 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 17", "Sandık 18", "Sandık 19", "Sandık 20"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 17",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 17", "Yanliş 17", "Hata 17", "Kusur 17"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 17",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "18": {
    okuyorumAnliyorum: {
      title: "Sandık 18 Hikayesi",
      theme: "Macera 18",
      text: "Bu, Sandık 18 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 18", "Sandık 19", "Sandık 20", "Sandık 21"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 18",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 18", "Yanliş 18", "Hata 18", "Kusur 18"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 18",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "19": {
    okuyorumAnliyorum: {
      title: "Sandık 19 Hikayesi",
      theme: "Macera 19",
      text: "Bu, Sandık 19 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 19", "Sandık 20", "Sandık 21", "Sandık 22"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 19",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 19", "Yanliş 19", "Hata 19", "Kusur 19"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 19",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "20": {
    okuyorumAnliyorum: {
      title: "Sandık 20 Hikayesi",
      theme: "Macera 20",
      text: "Bu, Sandık 20 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 20", "Sandık 21", "Sandık 22", "Sandık 23"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 20",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 20", "Yanliş 20", "Hata 20", "Kusur 20"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 20",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "21": {
    okuyorumAnliyorum: {
      title: "Sandık 21 Hikayesi",
      theme: "Macera 21",
      text: "Bu, Sandık 21 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 21", "Sandık 22", "Sandık 23", "Sandık 24"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 21",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 21", "Yanliş 21", "Hata 21", "Kusur 21"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 21",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "22": {
    okuyorumAnliyorum: {
      title: "Sandık 22 Hikayesi",
      theme: "Macera 22",
      text: "Bu, Sandık 22 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 22", "Sandık 23", "Sandık 24", "Sandık 25"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 22",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 22", "Yanliş 22", "Hata 22", "Kusur 22"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 22",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "23": {
    okuyorumAnliyorum: {
      title: "Sandık 23 Hikayesi",
      theme: "Macera 23",
      text: "Bu, Sandık 23 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 23", "Sandık 24", "Sandık 25", "Sandık 26"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 23",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 23", "Yanliş 23", "Hata 23", "Kusur 23"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 23",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "24": {
    okuyorumAnliyorum: {
      title: "Sandık 24 Hikayesi",
      theme: "Macera 24",
      text: "Bu, Sandık 24 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 24", "Sandık 25", "Sandık 26", "Sandık 27"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 24",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 24", "Yanliş 24", "Hata 24", "Kusur 24"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 24",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "25": {
    okuyorumAnliyorum: {
      title: "Sandık 25 Hikayesi",
      theme: "Macera 25",
      text: "Bu, Sandık 25 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 25", "Sandık 26", "Sandık 27", "Sandık 28"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 25",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 25", "Yanliş 25", "Hata 25", "Kusur 25"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 25",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "26": {
    okuyorumAnliyorum: {
      title: "Sandık 26 Hikayesi",
      theme: "Macera 26",
      text: "Bu, Sandık 26 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 26", "Sandık 27", "Sandık 28", "Sandık 29"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 26",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 26", "Yanliş 26", "Hata 26", "Kusur 26"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 26",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "27": {
    okuyorumAnliyorum: {
      title: "Sandık 27 Hikayesi",
      theme: "Macera 27",
      text: "Bu, Sandık 27 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 27", "Sandık 28", "Sandık 29", "Sandık 30"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 27",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 27", "Yanliş 27", "Hata 27", "Kusur 27"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 27",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "28": {
    okuyorumAnliyorum: {
      title: "Sandık 28 Hikayesi",
      theme: "Macera 28",
      text: "Bu, Sandık 28 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 28", "Sandık 29", "Sandık 30", "Sandık 31"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 28",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 28", "Yanliş 28", "Hata 28", "Kusur 28"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 28",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "29": {
    okuyorumAnliyorum: {
      title: "Sandık 29 Hikayesi",
      theme: "Macera 29",
      text: "Bu, Sandık 29 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 29", "Sandık 30", "Sandık 31", "Sandık 32"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 29",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 29", "Yanliş 29", "Hata 29", "Kusur 29"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 29",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  },

  "30": {
    okuyorumAnliyorum: {
      title: "Sandık 30 Hikayesi",
      theme: "Macera 30",
      text: "Bu, Sandık 30 için hazırlanmış örnek bir hikaye metnidir. Buradaki cümleleri okuyup anladıktan sonra aşağıdaki soruları cevaplamalısın.",
      questions: [
        {
          q: "Metne göre bu hangi sandığın hikayesidir?",
          options: ["Sandık 30", "Sandık 31", "Sandık 32", "Sandık 33"],
          correct: 0
        }
      ]
    },
    dilimiOgreniyorum: {
      title: "Kelime ve Dilbilgisi - 30",
      desc: "Bu bölümde Türkçemizin kurallarını öğreneceğiz.",
      questions: [
        {
          q: "Aşağıdaki kelimelerden hangisi doğru yazılmıştır?",
          options: ["Doğru 30", "Yanliş 30", "Hata 30", "Kusur 30"],
          correct: 0
        }
      ]
    },
    ulkemiOgreniyorum: {
      title: "Türkiye'yi Tanıyoruz - 30",
      desc: "Ülkemizin güzelliklerini keşfetmeye hazır mısın?",
      questions: [
        {
          q: "Türkiye'nin başkenti neresidir?",
          options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
          correct: 0
        }
      ]
    }
  }
};
