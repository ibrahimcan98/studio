const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const chestData = {
  16: {
    title: "Yaprakların Renk Değişimi",
    theme: "Bilgilendirici doğa - Bilgilendirici metin",
    text: "Sonbahar geldiğinde ağaçların yaprakları renk değiştirmeye başlar. Yazın yeşil olan yapraklar sarı, turuncu, kırmızı ve kahverengi tonlarına dönebilir. Bu değişim doğada sık gördüğümüz ama çoğu zaman nedenini düşünmediğimiz bir olaydır. Yaprakların yeşil görünmesini sağlayan özel bir madde vardır. Havalar serinleyip günler kısaldığında ağaçlar besin üretmeyi yavaşlatır. Bu sırada yapraklardaki yeşil madde azalır. Yeşil renk azalınca yaprağın içindeki sarı ve turuncu tonlar daha belirgin görünür. Daha sonra bazı ağaçlar yapraklarını döker. Bu durum ağacın kışa hazırlanmasına yardım eder. Yere düşen yapraklar zamanla parçalanıp toprağa karışabilir. Böylece doğada bir döngü oluşur. İlkbahar geldiğinde ağaçlar yeniden tomurcuklanır ve yeşil yapraklar çıkarır. Sonbahardaki renk değişimi, doğanın mevsimlere uyum sağlama yollarından biridir.",
    questions: [
      { q: "Yapraklar en çok hangi mevsimde renk değiştirir?", options: ["Sonbahar", "Yaz", "Kış"], correct: 0 },
      { q: "Yapraklar hangi renklere dönebilir?", options: ["Sarı, turuncu, kırmızı ve kahverengi", "Mavi ve mor", "Siyah ve beyaz"], correct: 0 },
      { q: "Renk değişiminin nedenlerinden biri nedir?", options: ["Günlerin kısalması ve havaların serinlemesi", "Denizlerin kabarması", "Kuşların ötmesi"], correct: 0 },
      { q: "Ağaçlar bu dönemde neyi yavaşlatır?", options: ["Besin üretmeyi", "Köklerini büyütmeyi tamamen", "Yağmur yağdırmayı"], correct: 0 },
      { q: "Yeşil madde azalınca ne olur?", options: ["Sarı ve turuncu tonlar daha belirgin görünür.", "Yapraklar mavi olur.", "Ağaçlar uçar."], correct: 0 },
      { q: "Bazı ağaçlar kışa hazırlanırken ne yapar?", options: ["Yapraklarını döker", "Çiçek açar", "Meyve toplar"], correct: 0 },
      { q: "Yere düşen yapraklar zamanla ne olabilir?", options: ["Toprağa karışabilir", "Taşa dönüşür", "Güneşe çıkar"], correct: 0 },
      { q: "Bu metnin ana konusu nedir?", options: ["Yaprakların sonbaharda neden renk değiştirdiği", "Kuşların nasıl uçtuğu", "Çocukların parkta oynadığı"], correct: 0 }
    ]
  },
  17: {
    title: "Islak Patiler",
    theme: "Hayvan sevgisi - Hikaye",
    text: "Dışarıda sabah boyunca yağmur yağmıştı. Nil pencereden sokaktaki su birikintilerine bakıyordu. İnsanlar şemsiyeleriyle hızlı hızlı yürüyordu. Birden kapının önünden ince bir miyavlama sesi duydu. Nil annesine seslendi ve birlikte kapıyı açtılar. Köşede, tüyleri ıslanmış küçük bir kedi duruyordu. Patileri çamurluydu ve üşümüş görünüyordu. Nil kediyi hemen içeri almak istedi ama annesi önce sakin ve dikkatli olmaları gerektiğini söyledi. Nil kilerden boş bir karton kutu getirdi. Annesi kutunun içine eski ama temiz bir kazak serdi. Kutuyu rüzgar almayan kapı girişine koydular. Sonra kediyi yavaşça kutunun yanına yönlendirdiler. Kedi kutuya girip kazağın üzerine kıvrıldı. Nil, hayvanlara yardım ederken hem şefkatli hem de dikkatli olmak gerektiğini öğrendi.",
    questions: [
      { q: "Dışarıda ne yağıyordu?", options: ["Yağmur", "Kar", "Dolu"], correct: 0 },
      { q: "Nil ne duydu?", options: ["Miyavlama sesi", "Zil sesi", "Davul sesi"], correct: 0 },
      { q: "Kapının önünde hangi hayvan vardı?", options: ["Kedi", "Kuş", "Tavşan"], correct: 0 },
      { q: "Kedinin tüyleri nasıldı?", options: ["Islanmıştı", "Boyanmıştı", "Taralıydı"], correct: 0 },
      { q: "Annesi neden dikkatli olmaları gerektiğini söyledi?", options: ["Hayvana yardım ederken sakin ve dikkatli olmak gerektiği için", "Kedi oyuncak olduğu için", "Yağmur hemen biteceği için"], correct: 0 },
      { q: "Nil ne getirdi?", options: ["Karton kutu", "Çiçek saksısı", "Oyuncak sepeti"], correct: 0 },
      { q: "Kutuyu nereye koydular?", options: ["Rüzgar almayan kapı girişine", "Yağmurun altına", "Bahçenin ortasına"], correct: 0 },
      { q: "Bu metindeki davranış hangi değeri gösterir?", options: ["Hayvanlara karşı duyarlı olmayı", "Eşyaları saklamayı", "Yağmurda koşmayı"], correct: 0 }
    ]
  },
  18: {
    title: "Yeşil Takım",
    theme: "Çevre bilinci - Hikaye",
    text: "Mert ve arkadaşları pazar günü göl kenarında piknik yaptı. Oyunları bittikten sonra çevrede bazı plastik şişeler, kağıtlar ve boş kaplar gördüler. Çöpler çimlerin üzerinde duruyordu. Göl kenarı güzel görünse de bu çöpler çevreyi kirletiyordu. Mert, “Bu alanı temiz bırakmalıyız,” dedi. Arkadaşları da ona katıldı. Çocuklar temizlik yapmadan önce çantalarından eldivenlerini çıkardı. Plastik şişeleri, kağıtları ve boş kapları ayrı ayrı topladılar. Topladıkları çöpleri farklı torbalara koydular. Sonra geri dönüşüm kutularının olduğu yere gittiler. Şişeleri plastik kutusuna, kağıtları kağıt kutusuna attılar. Boş kapları da uygun kutuya yerleştirdiler. İşleri bitince göl kenarı yeniden temiz görünmeye başladı. Çocuklar, doğayı korumanın sadece konuşmakla değil, doğru davranışlarla mümkün olduğunu anladı.",
    questions: [
      { q: "Çocuklar nerede piknik yaptı?", options: ["Göl kenarında", "Sınıfta", "Otobüste"], correct: 0 },
      { q: "Çevrede ne gördüler?", options: ["Plastik şişeler, kağıtlar ve boş kaplar", "Yeni oyuncaklar", "Çiçek tohumları"], correct: 0 },
      { q: "Mert ne söyledi?", options: ["Alanı temiz bırakmalıyız.", "Çöpleri saklayalım.", "Eve gitmeyelim."], correct: 0 },
      { q: "Çocuklar temizlikten önce ne taktı?", options: ["Eldiven", "Gözlük", "Şapka"], correct: 0 },
      { q: "Çöpleri nasıl topladılar?", options: ["Ayrı ayrı toplayıp farklı torbalara koydular.", "Çimlerin üstüne bıraktılar.", "Suya attılar."], correct: 0 },
      { q: "Şişeleri nereye attılar?", options: ["Plastik kutusuna", "Kağıt kutusuna", "Toprağa"], correct: 0 },
      { q: "Kağıtları nereye attılar?", options: ["Kağıt kutusuna", "Oyuncak kutusuna", "Lavaboya"], correct: 0 },
      { q: "Bu metnin ana fikri nedir?", options: ["Çevremizi temiz tutmalı ve geri dönüşüme dikkat etmeliyiz.", "Piknikte hiç oyun oynanmamalıdır.", "Çöpler çimlerde kalabilir."], correct: 0 }
    ]
  },
  19: {
    title: "Dünyanın Hava Kalkanı",
    theme: "Bilgilendirici dünya ve uzay - Bilgilendirici metin",
    text: "Dünya, uzaydan bakıldığında mavi görünen bir gezegendir. Bunun nedeni Dünya’da geniş okyanusların bulunmasıdır. Dünya’nın etrafında atmosfer adı verilen bir hava tabakası vardır. Atmosfer gözle görülmez ama yaşam için çok önemlidir. İçindeki hava sayesinde insanlar, hayvanlar ve bitkiler nefes alabilir. Atmosfer yalnızca nefes almak için gerekli değildir. Aynı zamanda Güneş’ten gelen zararlı ışınların bir kısmını engeller. Dünya’nın çok fazla ısınıp çok fazla soğumasını azaltmaya da yardımcı olur. Hava, rüzgar, bulut ve yağmur gibi olaylar atmosferde gerçekleşir. Atmosfer olmasaydı canlıların yaşaması çok zor olurdu. Bu yüzden atmosfer Dünya’nın koruyucu hava kalkanı gibi düşünülebilir. Ancak bu hava tabakasını temiz tutmak da önemlidir. Havayı kirleten dumanlar ve zararlı gazlar doğaya zarar verebilir. Atmosferi korumak için temiz enerji kullanmak, ağaçları korumak ve havayı kirletmemek gerekir.",
    questions: [
      { q: "Dünya uzaydan bakıldığında nasıl görünür?", options: ["Mavi", "Siyah", "Mor"], correct: 0 },
      { q: "Dünya’nın etrafındaki hava tabakasına ne denir?", options: ["Atmosfer", "Okyanus", "Ada"], correct: 0 },
      { q: "Atmosfer neden önemlidir?", options: ["Canlıların nefes almasına yardım eder.", "Oyuncakları büyütür.", "Denizleri kurutur."], correct: 0 },
      { q: "Atmosfer Güneş’ten gelen neyin bir kısmını engeller?", options: ["Zararlı ışınların", "Balıkların", "Toprakların"], correct: 0 },
      { q: "Atmosfer neye yardımcı olur?", options: ["Dünya’nın aşırı ısınıp soğumasını azaltmaya", "Geceyi yok etmeye", "Dağları taşımaya"], correct: 0 },
      { q: "Hava, rüzgar, bulut ve yağmur nerede gerçekleşir?", options: ["Atmosferde", "Kitaplıkta", "Yer altında"], correct: 0 },
      { q: "Atmosferi korumak için ne yapabiliriz?", options: ["Havayı kirletmemeye dikkat edebiliriz.", "Çöpleri yakabiliriz.", "Ağaçları kesebiliriz."], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Atmosfer Dünya’daki yaşam için çok önemlidir ve korunmalıdır.", "Dünya’da hiç hava yoktur.", "Güneş yalnızca geceleri görünür."], correct: 0 }
    ]
  },
  20: {
    title: "Odamı Topluyorum",
    theme: "Sorumluluk - Hikaye",
    text: "Murat okuldan sonra odasında uzun süre oyun oynadı. Arkadaşı eve gidince odasına baktı. Legolar masanın üstünde, arabalar yatağın altında, kartlar halının üzerinde duruyordu. Ayrıca kirli çorapları kapının yanında unutulmuştu. Murat önce odasının çok karışık olduğunu fark etti. Bir an nereden başlayacağını bilemedi. Sonra eşyaları gruplara ayırmaya karar verdi. Legoları mavi kutuya topladı. Arabaları kitaplığın alt rafına dizdi. Kartları küçük kutusuna yerleştirdi. Kirli çoraplarını çamaşır sepetine attı. Çalışma masasının üzerindeki kalemleri de kalemliğe koydu. Son olarak halının üstünü kontrol etti. Oda düzenlenince Murat daha rahat hissetti. Eşyaları yerine koymanın, bir sonraki oyunu daha kolay başlatacağını düşündü.",
    questions: [
      { q: "Murat ne yaptıktan sonra odasına baktı?", options: ["Arkadaşı eve gidince", "Sabah uyanınca", "Yemek yerken"], correct: 0 },
      { q: "Legolar neredeydi?", options: ["Masanın üstünde", "Balkonda", "Banyoda"], correct: 0 },
      { q: "Arabalar neredeydi?", options: ["Yatağın altında", "Pencerenin dışında", "Lavaboda"], correct: 0 },
      { q: "Murat önce neyi fark etti?", options: ["Odasının karışık olduğunu", "Lambanın kırıldığını", "Kitabının kaybolduğunu"], correct: 0 },
      { q: "Murat odasını toplarken nasıl bir yol izledi?", options: ["Eşyaları gruplara ayırdı.", "Her şeyi yatağın altına itti.", "Odadan çıktı."], correct: 0 },
      { q: "Kartları nereye yerleştirdi?", options: ["Küçük kutusuna", "Çamaşır makinesine", "Bahçeye"], correct: 0 },
      { q: "Oda düzenlenince Murat ne hissetti?", options: ["Daha rahat", "Daha kızgın", "Daha üzgün"], correct: 0 },
      { q: "Bu metinden hangi sonuç çıkarılır?", options: ["Eşyaları yerine koymak yaşam alanını düzenli hale getirir.", "Oyuncaklar hep yerde kalmalıdır.", "Oda toplamak imkansızdır."], correct: 0 }
    ]
  }
};

let newContent = fileContent;

for (let i = 16; i <= 20; i++) {
  const d = chestData[i];
  
  const replacement = '"' + i + '": {\n' +
    '    okuyorumAnliyorum: {\n' +
    '      title: "' + d.title + '",\n' +
    '      theme: "' + d.theme + '",\n' +
    '      text: "' + d.text + '",\n' +
    '      questions: ' + JSON.stringify(d.questions, null, 8).replace(/\\n/g, '\\n      ').replace(/}$/g, '      }') + '\n' +
    '    },\n' +
    '    dilimiOgreniyorum';
    
  const searchString = '"' + i + '": {\\n    okuyorumAnliyorum: {\\n      title: "Sandık ' + i + ' Hikayesi",\\n      theme: "Macera ' + i + '",\\n      text: "Bu, Sandık ' + i + ' için hazırlanmış örnek bir hikaye metnidir.",\\n      questions: [\\n        { q: "Bu hangi sandık?", options: ["Sandık ' + i + '", "Başka"], correct: 0 }\\n      ]\\n    },\\n    dilimiOgreniyorum';
  
  newContent = newContent.split(searchString).join(replacement);
}

fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
console.log('Successfully updated chests 16-20 reading comprehension data!');
