
const turkishToEnglish = (str) => {
  return str.toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ /g, '-');
};

const mockTopics = [
  { id: 'hayvanlar', name: 'HAYVANLAR', icon: '🦁' },
  { id: 'renkler', name: 'RENKLER', icon: '🎨' },
  { id: 'vucudumuz', name: 'VÜCUDUMUZ', icon: '🖐️' },
  { id: 'meyveler-sebzeler', name: 'MEYVELER VE SEBZELER', icon: '🍎' },
  { id: 'sekiller', name: 'ŞEKİLLER', icon: '📐' },
  { id: 'duygular', name: 'DUYGULAR', icon: '😊' },
  { id: 'yemekler', name: 'YEMEKLER', icon: '🍲' },
  { id: 'meslekler', name: 'MESLEKLER', icon: '👨‍✈️' },
  { id: 'uzay', name: 'UZAY', icon: '🚀' },
  { id: 'duyu-organlari', name: 'DUYU ORGANLARI', icon: '👂' },
  { id: 'kisisel-bakim', name: 'KİŞİSEL BAKIM', icon: '🪥' },
  { id: 'hava-durumu', name: 'HAVA DURUMU', icon: '🌤️' },
  { id: 'kiyafetler', name: 'KIYAFETLER', icon: '👕' },
  { id: 'mevsimler', name: 'MEVSİMLER', icon: '🍂' },
  { id: 'dogum-gunu', name: 'DOĞUM GÜNÜ', icon: '🎂' },
  { id: 'hareket', name: 'HAREKET', icon: '🏃' },
  { id: 'deniz-canlilari', name: 'DENİZ CANLILARI', icon: '🐙' },
  { id: 'ciftlik-hayvanlari', name: 'ÇİFTLİK HAYVANLARI', icon: '🐄' },
  { id: 'rakamlar', name: 'RAKAMLAR', icon: '🔢' },
  { id: 'seyahat', name: 'SEYAHAT', icon: '✈️' },
  { id: 'muzik-aletleri', name: 'MÜZİK ALETLERİ', icon: '🎸' },
  { id: 'tasitlar', name: 'TAŞITLAR', icon: '🚗' },
  { id: 'ev', name: 'EV', icon: '🏠' },
  { id: 'alisveris', name: 'ALIŞVERİŞ', icon: '🛒' },
  { id: 'yemek-yapiyorum', name: 'YEMEK YAPIYORUM', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍C', icon: '👨‍🍳' },
  { id: 'hastalik', name: 'HASTALIK', icon: '🤒' },
  { id: 'spor', name: 'SPOR', icon: '⚽' },
  { id: 'yeryuzu', name: 'YERYÜZÜ', icon: '🌍' },
  { id: 'cihazlar', name: 'CİHAZLAR', icon: '💻' },
  { id: 'kisisel-ozellikler', name: 'KİŞİSEL ÖZELLİKLER', icon: '👤' },
  { id: 'sanat', name: 'SANAT', icon: '🎨' },
  { id: 'kamp', name: 'KAMP', icon: '⛺' },
  { id: 'ev-isleri', name: 'EV İŞLERİ', icon: '🧹' },
  { id: 'vahsi-ve-evcil-hayvanlar', name: 'VAHŞİ VE EVCİL HAYVANLAR', icon: '🦁' },
  { id: 'mekanlar', name: 'MEKANLAR', icon: '🏢' },
  { id: 'sifatlar', name: 'SIFATLAR', icon: '✨' }
];

const existingAnimals = [
  { "word": "Panda", "image": "/images/1-hayvanlar/panda.png", "audio": "" },
  { "word": "Kedi", "image": "/images/1-hayvanlar/cat.png", "audio": "" },
  { "word": "Aslan", "image": "/images/1-hayvanlar/lion.png", "audio": "" },
  { "word": "Köpek", "image": "/images/1-hayvanlar/dog.png", "audio": "" },
  { "word": "Kuş", "image": "/images/1-hayvanlar/bird.png", "audio": "" },
  { "word": "İnek", "image": "/images/1-hayvanlar/cow.png", "audio": "" },
  { "word": "Kurbağa", "image": "/images/1-hayvanlar/frog.png", "audio": "" },
  { "word": "Maymun", "image": "/images/1-hayvanlar/monkey.png", "audio": "" },
  { "word": "Fil", "image": "/images/1-hayvanlar/elephant.png", "audio": "" },
  { "word": "Zürafa", "image": "/images/1-hayvanlar/giraffe.png", "audio": "" }
];

const existingColors = [
  { "word": "Pembe", "image": "/images/2-renkler/pink.png", "audio": "" },
  { "word": "Sarı", "image": "/images/2-renkler/yellow.png", "audio": "" },
  { "word": "Turuncu", "image": "/images/2-renkler/orange.png", "audio": "" },
  { "word": "Mavi", "image": "/images/2-renkler/blue.png", "audio": "" },
  { "word": "Yeşil", "image": "/images/2-renkler/green.png", "audio": "" },
  { "word": "Kahverengi", "image": "/images/2-renkler/brown.png", "audio": "" },
  { "word": "Beyaz", "image": "/images/2-renkler/white.png", "audio": "" }
];

const vucudumuzWords = [
  "alın", "ağız", "yanak", "burun", "çene", "dil", "yüz", "saç", "boyun", "kaş", 
  "göz", "dudak", "ayak", "göbek", "diş", "kulak", "omuz", "baş", "bacak", "kol"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/3-vucudumuz/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const meyvelerWords = [
  "salatalık", "havuç", "soğan", "portakal", "brokoli", "domates", "kivi", 
  "elma", "karpuz", "armut", "kiraz", "çilek", "üzüm", "biber", "muz"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/4-meyvelersebzeler/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const sekillerWords = [
  "üçgen", "dikdörtgen", "kare", "daire", "kalp", "yıldız"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/5-sekiller/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const duygularWords = [
  "mutlu", "uzgun", "sinirli", "korkmus", "saskin"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/6-duygular/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const yemeklerWords = [
  "yumurta", "zeytin", "peynir", "ekmek", "reçel", "bal", "tereyağ", 
  "çorba", "pilav", "makarna", "köfte", "balık", "tavuk", "patates kızartması", "salata"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/7-yemekler/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const mesleklerWords = [
  "çiftçi", "ressam", "manav", "veteriner", "aşçı", "tamirci", "pilot", "doktor", "kuaför", "öğretmen"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/8-meslekler/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const uzayWords = [
  "güneş", "ay", "yıldız", "jüpiter", "merkür", "dünya", "astronot", "roket"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/9-uzay/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const duyuOrganlariWords = [
  "duymak", "görmek", "dokunmak", "tatmak", "koklamak"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/10-duyuorganlari/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const kisiselBakimWords = [
  "ellerini yıkamak", "sabun", "havlu", "su", "saç taramak", "tarak", "diş fırçalamak", 
  "diş fırçası", "diş macunu", "banyo yapmak", "banyo lifi", "şampuan", "duş jeli"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/11-kisiselbakim/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const havaDurumuWords = [
  "güneşli", "güneş", "yağmurlu", "yağmur", "karlı", "kar", "bulutlu", "bulut", 
  "rüzgarlı", "rüzgar", "fırtınalı", "hortum", "şimşek"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/12-havadurumu/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const kiyafetlerWords = [
  "kazak", "tişört", "hırka", "pantolon", "etek", "eldiven", "atkı", "mont", "ayakkabı", "çorap", "ceket"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/13-kiyafetler/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const mevsimlerWords = [
  "ilkbahar", "kelebek", "ağaç", "çiçek",
  "yaz", "kumdan kale", "güneş", "yüzmek", "dondurma",
  "sonbahar", "sararmış yapraklar", "rüzgar", "balkabağı",
  "kış", "kar", "kardan adam", "atkı", "bere"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/14-mevsimler/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const dogumGunuWords = [
  "pasta", "mum", "hediye", "kostüm", "maske", "balon", "parti şapkaları", "konfeti"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  image: `/images/15-dogumgunu/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const hareketWords = [
  "koşmak", "zıplamak", "pişirmek", "yoğurmak", "kesmek", "yapıştırmak", "sürmek", "tırmanmak", "yüzmek"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/16-hareket/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const denizCanlilariWords = [
  "köpek balığı", "denizanası", "deniz kabuğu", "deniz yıldızı", "deniz kaplumbağası", "yengeç", "karides", "ahtapot", "balina", "yunus", "denizatı"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/17-denizcanlilari/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const ciftlikHayvanlariWords = [
  "köpek", "horoz", "kedi", "civciv", "eşek", "inek", "koyun"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/18-ciftlikhayvanlari/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const rakamlarWords = [
  "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/19-rakamlar/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const seyahatWords = [
  "pasaport", "valiz", "bilet", "çadır", "harita", "pusula", "kamera", "karavan", "havaalanı"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/20-seyahat/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const tasitlarWords = [
  "denizaltı", "sıcak hava balonu", "yelkenli", "UFO", "motorsiklet", "helikopter", 
  "uzay mekiği", "yarış arabası", "otobüs", "taksi", "ambulans", "tren", 
  "polis arabası", "uçak", "gemi"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/22-tasitlar/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const evWords = [
  "yatak", "dolap", "klozet", "pano", "bulaşık makinesi", "buzdolabı", 
  "koltuk", "televizyon", "saat", "halı", "oturma odası", "yatak odası", "mutfak", "banyo"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/23-ev/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const alisverisWords = [
  "market", "çiçekçi", "eczane", "kitapçı", "kıyafet mağazası", 
  "ayakkabı mağazası", "indirim", "kredi kartı", "nakit para", "kasa"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/24-alisveris/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const yemekYapiyorumWords = [
  "rendele", "dök", "karıştır", "ekle", "kaynat", "doğra", 
  "dilimle", "hamuru aç", "hamuru yoğur", "tencere", "merdane"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/25-yemekyapiyorum/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const hastalikWords = [
  "öksürmek", "hapşurmak", "burnu akmak", "dişi ağrımak", "karnı ağrımak", 
  "başı ağrımak", "ateşi çıkmak", "boğazı ağrımak", "ayağı kırılmak", 
  "şurup", "hap", "iğne"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/26-hastalik/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const sporWords = [
  "yüzme", "boks", "koşu", "buz pateni", "futbol", "golf", "tenis", 
  "basketbol", "karate", "bisiklet sürme", "okçuluk", "ata binme", "dalış", "güreş"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/27-spor/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const yeryuzuWords = [
  "çöl", "orman", "göl", "mağara", "dağ", "deniz", "şelale", "volkan", "uçurum", "bataklık"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/28-yeryuzu/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const cihazlarWords = [
  "fare", "klavye", "akıllı saat", "telefon", "tablet", 
  "uzaktan kumandalı araba", "mikrofon", "hoparlör", "dizüstü bilgisayar", "yazıcı"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/29-cihazlar/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const kisilikOzellikleriWords = [
  "tembel", "çalışkan", "sinirli", "utangaç", "eğlenceli", "konuşkan", 
  "yardımsever", "cimri", "kaba", "cesur", "korkak"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/30-kisilikozellikleri/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const sanatWords = [
  "konser", "oyuncu", "koro", "kostüm", "tuval", "enstrüman", 
  "boya", "dans ayakkabısı", "fırça"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/31-sanat/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const kampWords = [
  "kamp ateşi", "pusula", "uyku tulumu", "termos", "çadır", 
  "sırt çantası", "orman", "el feneri", "harita"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/32-kamp/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const evIsleriWords = [
  "süpürmek", "toz almak", "yemek yapmak", "bulaşık yıkamak", "çamaşır yıkamak", 
  "ütü yapmak", "yerleri silmek", "çöpü çıkarmak", "çamaşır asmak", "yatak yapmak", 
  "dolapları düzenlemek", "bitkileri sulamak", "camları silmek", "sofra hazırlamak"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/33-evisleri/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const vahsiVeEvcilHayvanlarWords = [
  "aslan", "kaplan", "fil", "ayı", "tilki", "kurt", "zebra", "zürafa", "timsah", "kartal",
  "kedi", "köpek", "tavşan", "kuş", "balık", "papağan", "hamster", "inek", "at", "tavuk"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/34-vahsiveevcilhayvanlar/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const mekanlarWords = [
  "park", "okul", "kafe", "fırın", "otobüs durağı", "market", 
  "banka", "hastane", "restoran"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/35-mekanlar/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const muzikAletleriWords = [
  "piyano", "davul", "elektro gitar", "maraka", "bağlama", "kemençe", 
  "saksafon", "keman", "kanun"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/21-muzikaletleri/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const sifatlarWords = [
  "uzun", "kısa", "şişman", "zayıf", "büyük", "küçük", "yumuşak", "sert", 
  "temiz", "kirli", "kuru", "ıslak", "hızlı", "yavaş", "boş", "dolu", "sıcak", "soğuk"
].map(word => ({
  word: word.charAt(0).toUpperCase() + word.slice(1),
  image: `/images/36-sifatlar/${turkishToEnglish(word)}.png`,
  audio: ""
}));

const topics = mockTopics.map((t, index) => {
  let wordList = [];
  const num = index + 1;
  const folderName = t.id.replace(/-/g, '');
  const numberedFolder = `${num}-${folderName}`;
  
  if (t.id === 'hayvanlar') wordList = existingAnimals;
  else if (t.id === 'renkler') wordList = existingColors;
  else if (t.id === 'vucudumuz') wordList = vucudumuzWords;
  else if (t.id === 'meyveler-sebzeler') wordList = meyvelerWords;
  else if (t.id === 'sekiller') wordList = sekillerWords;
  else if (t.id === 'duygular') wordList = duygularWords;
  else if (t.id === 'yemekler') wordList = yemeklerWords;
  else if (t.id === 'meslekler') wordList = mesleklerWords;
  else if (t.id === 'uzay') wordList = uzayWords;
  else if (t.id === 'duyu-organlari') wordList = duyuOrganlariWords;
  else if (t.id === 'kisisel-bakim') wordList = kisiselBakimWords;
  else if (t.id === 'hava-durumu') wordList = havaDurumuWords;
  else if (t.id === 'kiyafetler') wordList = kiyafetlerWords;
  else if (t.id === 'mevsimler') wordList = mevsimlerWords;
  else if (t.id === 'dogum-gunu') wordList = dogumGunuWords;
  else if (t.id === 'hareket') wordList = hareketWords;
  else if (t.id === 'deniz-canlilari') wordList = denizCanlilariWords;
  else if (t.id === 'ciftlik-hayvanlari') wordList = ciftlikHayvanlariWords;
  else if (t.id === 'rakamlar') wordList = rakamlarWords;
  else if (t.id === 'seyahat') wordList = seyahatWords;
  else if (t.id === 'muzik-aletleri') wordList = muzikAletleriWords;
  else if (t.id === 'tasitlar') wordList = tasitlarWords;
  else if (t.id === 'ev') wordList = evWords;
  else if (t.id === 'alisveris') wordList = alisverisWords;
  else if (t.id === 'yemek-yapiyorum') wordList = yemekYapiyorumWords;
  else if (t.id === 'hastalik') wordList = hastalikWords;
  else if (t.id === 'spor') wordList = sporWords;
  else if (t.id === 'yeryuzu') wordList = yeryuzuWords;
  else if (t.id === 'cihazlar') wordList = cihazlarWords;
  else if (t.id === 'kisisel-ozellikler') wordList = kisilikOzellikleriWords;
  else if (t.id === 'sanat') wordList = sanatWords;
  else if (t.id === 'kamp') wordList = kampWords;
  else if (t.id === 'ev-isleri') wordList = evIsleriWords;
  else if (t.id === 'vahsi-ve-evcil-hayvanlar') wordList = vahsiVeEvcilHayvanlarWords;
  else if (t.id === 'mekanlar') wordList = mekanlarWords;
  else if (t.id === 'sifatlar') wordList = sifatlarWords;
  else {
    wordList = [{ "word": "Henüz Eklenmedi", "image": `/images/${numberedFolder}/${numberedFolder}.png`, "audio": "" }];
  }
  return { ...t, wordList };
});

require('fs').writeFileSync('src/data/topics.json', JSON.stringify(topics, null, 2));
console.log("topics.json updated with Final lists.");
