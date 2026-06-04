const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const chestData = {
  2: {
    title: "Paylaşılan Elma",
    theme: "Paylaşma - Kısa hikaye",
    text: "Murat okul çıkışında parkta bir banka oturdu. Çantasından kırmızı bir elma çıkardı. Tam elmayı yiyecekken yanına bir çocuk geldi. Çocuk elmaya baktı ama bir şey söylemedi. Murat onun aç olabileceğini düşündü. Elmayı ikiye böldü. Yarısını çocuğa uzattı. İki çocuk elmayı birlikte yedi.",
    questions: [
      { q: "Murat nereye oturdu?", options: ["Parktaki banka", "Sınıftaki sıraya", "Otobüse"], correct: 0 },
      { q: "Murat çantasından ne çıkardı?", options: ["Elma", "Muz", "Kek"], correct: 0 },
      { q: "Yanına gelen çocuk neye baktı?", options: ["Elmaya", "Çantaya", "Ayakkabıya"], correct: 0 },
      { q: "Murat elmayı ne yaptı?", options: ["Sakladı", "İkiye böldü", "Çöpe attı"], correct: 1 },
      { q: "Murat neden elmayı paylaştı?", options: ["Çocuğun aç olabileceğini düşündü.", "Elmayı sevmedi.", "Elma yere düştü."], correct: 0 },
      { q: "Bu metinde Murat’ın hangi özelliği görülür?", options: ["Paylaşmayı bilmesi", "Aceleci olması", "Kızgın olması"], correct: 0 }
    ]
  },
  3: {
    title: "Mavi Kase",
    theme: "Hayvan sevgisi - Kısa hikaye",
    text: "Zeynep mutfak penceresinden dışarı baktı. Bahçe kapısının önünde küçük bir kedi vardı. Kedi soğuktan titriyordu. Zeynep raftan mavi bir kase aldı. Kaseye biraz su koydu. Sonra annesiyle birlikte kedinin yanına çıktı. Kaseyi kapının yanına bıraktı. Kedi suyu içince biraz sakinleşti.",
    questions: [
      { q: "Zeynep dışarıya nereden baktı?", options: ["Mutfak penceresinden", "Okul kapısından", "Arabadan"], correct: 0 },
      { q: "Bahçe kapısının önünde hangi hayvan vardı?", options: ["Kedi", "Köpek", "Kuş"], correct: 0 },
      { q: "Kedi neden titriyordu?", options: ["Soğuktan", "Uykudan", "Oyundan"], correct: 0 },
      { q: "Zeynep hangi renk kase aldı?", options: ["Mavi", "Kırmızı", "Sarı"], correct: 0 },
      { q: "Zeynep kaseye ne koydu?", options: ["Su", "Toprak", "Kalem"], correct: 0 },
      { q: "Zeynep’in davranışı hangi duyguyu gösterir?", options: ["Hayvan sevgisini", "Korkuyu", "Kıskançlığı"], correct: 0 }
    ]
  },
  4: {
    title: "Kuruyan Çiçek",
    theme: "Doğa sevgisi - Kısa hikaye",
    text: "Eren sabah balkona çıktı. Köşedeki saksıda sarı bir çiçek vardı. Çiçeğin yaprakları aşağı doğru sarkmıştı. Eren toprağın çok kuru olduğunu fark etti. Mutfaktan küçük sulama kabını aldı. Kabı suyla doldurdu. Suyu yavaşça çiçeğin toprağına döktü. Akşam olduğunda çiçeğin yaprakları biraz canlandı.",
    questions: [
      { q: "Eren sabah nereye çıktı?", options: ["Balkona", "Bahçeye", "Sınıfa"], correct: 0 },
      { q: "Saksıdaki çiçek ne renkti?", options: ["Sarı", "Mavi", "Mor"], correct: 0 },
      { q: "Çiçeğin yaprakları nasıl duruyordu?", options: ["Aşağı sarkmıştı", "Kopmuştu", "Parlıyordu"], correct: 0 },
      { q: "Eren neyi fark etti?", options: ["Toprağın kuru olduğunu", "Saksının kırıldığını", "Çiçeğin kaybolduğunu"], correct: 0 },
      { q: "Eren çiçeğe ne verdi?", options: ["Su", "Boya", "Şeker"], correct: 0 },
      { q: "Bu metinden hangi sonuç çıkarılır?", options: ["Bitkilerin suya ihtiyacı vardır.", "Çiçekler hiç bakım istemez.", "Saksılar hep balkonda olmalıdır."], correct: 0 }
    ]
  },
  5: {
    title: "Oyuncak Kutusu",
    theme: "Sorumluluk - Kısa hikaye",
    text: "Selim akşamüstü odasında oyun oynadı. Yerde renkli bloklar, arabalar ve kartlar vardı. Oyun bitince oda çok dağınık görünüyordu. Selim önce blokları kutuya koydu. Arabalarını rafa dizdi. Kartlarını masanın çekmecesine yerleştirdi. Sonra halının üzerini kontrol etti. Odası yeniden düzenli oldu.",
    questions: [
      { q: "Selim nerede oyun oynadı?", options: ["Odasında", "Bahçede", "Otobüste"], correct: 0 },
      { q: "Oyun bitince oda nasıl görünüyordu?", options: ["Dağınık", "Boş", "Karanlık"], correct: 0 },
      { q: "Selim blokları nereye koydu?", options: ["Kutuya", "Balkona", "Çantaya"], correct: 0 },
      { q: "Arabalarını nereye dizdi?", options: ["Rafa", "Lavaboya", "Bahçeye"], correct: 0 },
      { q: "Kartlarını nereye yerleştirdi?", options: ["Masanın çekmecesine", "Yastığın altına", "Ayakkabılığa"], correct: 0 },
      { q: "Selim’in davranışı hangi değeri gösterir?", options: ["Sorumluluk", "Korku", "Sabırsızlık"], correct: 0 }
    ]
  },
  6: {
    title: "Kayıp Silgi",
    theme: "Nezaket - Kısa hikaye",
    text: "Can sınıfta öğretmenini bekliyordu. Yanındaki Sıla çantasını karıştırıyordu. Sıla pembe silgisini bulamamıştı. Can sıranın altına baktı. Küçük pembe silgi oradaydı. Can silgiyi aldı. Sıla’ya uzattı. Sıla gülümseyerek teşekkür etti.",
    questions: [
      { q: "Can nerede bekliyordu?", options: ["Sınıfta", "Parkta", "Markette"], correct: 0 },
      { q: "Sıla neyi arıyordu?", options: ["Silgisini", "Ayakkabısını", "Şapkasını"], correct: 0 },
      { q: "Silgi ne renkti?", options: ["Pembe", "Yeşil", "Siyah"], correct: 0 },
      { q: "Can silgiyi nerede buldu?", options: ["Sıranın altında", "Bahçede", "Çantasında"], correct: 0 },
      { q: "Sıla ne yaptı?", options: ["Teşekkür etti", "Ağladı", "Sınıftan çıktı"], correct: 0 },
      { q: "Can’ın davranışı hangi özelliği gösterir?", options: ["Nazik olmayı", "Dağınık olmayı", "Kızgın olmayı"], correct: 0 }
    ]
  },
  7: {
    title: "Bahçedeki Çöp",
    theme: "Çevre temizliği - Kısa hikaye",
    text: "Umut öğle arasında okul bahçesinde yürüyordu. Çimlerin üzerinde boş bir meyve suyu kutusu gördü. Kutunun orada durması bahçeyi kirli gösteriyordu. Umut kutuyu yerden aldı. Bahçenin köşesindeki çöp kutusuna yürüdü. Kutuyu çöpe attı. Sonra ellerini yıkamaya gitti. Bahçe eskisinden daha temiz görünüyordu.",
    questions: [
      { q: "Umut nerede yürüyordu?", options: ["Okul bahçesinde", "Kütüphanede", "Evde"], correct: 0 },
      { q: "Çimlerin üzerinde ne gördü?", options: ["Boş meyve suyu kutusu", "Oyuncak araba", "Kitap"], correct: 0 },
      { q: "Umut kutuyu ne yaptı?", options: ["Çöp kutusuna attı", "Cebine koydu", "Tekmeledi"], correct: 0 },
      { q: "Umut sonra nereye gitti?", options: ["Ellerini yıkamaya", "Uyumaya", "Alışverişe"], correct: 0 },
      { q: "Kutunun yerde durması bahçeyi nasıl gösteriyordu?", options: ["Kirli", "Sessiz", "Karanlık"], correct: 0 },
      { q: "Bu metnin ana fikri nedir?", options: ["Çevremizi temiz tutmalıyız.", "Bahçede koşmamalıyız.", "Meyve suyu içmemeliyiz."], correct: 0 }
    ]
  },
  8: {
    title: "Temiz Eller",
    theme: "Sağlık ve hijyen - Kısa hikaye",
    text: "Kerem sokakta top oynadı. Eve gelince ellerinin kirlendiğini fark etti. Doğrudan banyoya gitti. Önce ellerini suyla ıslattı. Sonra sabunla iyice köpürttü. Parmak aralarını da yıkadı. Ellerini temiz suyla duruladı. Son olarak havluyla kuruladı.",
    questions: [
      { q: "Kerem sokakta ne oynadı?", options: ["Top", "Satranç", "Seksek"], correct: 0 },
      { q: "Kerem eve gelince neyi fark etti?", options: ["Ellerinin kirlendiğini", "Çantasının kaybolduğunu", "Ayakkabısının yırtıldığını"], correct: 0 },
      { q: "Kerem nereye gitti?", options: ["Banyoya", "Balkona", "Mutfağa"], correct: 0 },
      { q: "Ellerini neyle köpürttü?", options: ["Sabunla", "Boyayla", "Sütle"], correct: 0 },
      { q: "Kerem parmak aralarını neden yıkadı?", options: ["Ellerinin tamamen temizlenmesi için", "Oyun oynamak için", "Havluyu bulmak için"], correct: 0 },
      { q: "Bu metin bize neyi hatırlatır?", options: ["Ellerimizi doğru şekilde yıkamayı", "Top oynamamayı", "Banyoda koşmayı"], correct: 0 }
    ]
  },
  9: {
    title: "Günebakan Çiçeği",
    theme: "Bilgilendirici doğa - Kısa bilgilendirici metin",
    text: "Ayçiçeği, büyük sarı yapraklarıyla kolayca tanınır. Halk arasında ona günebakan da denir. Çünkü genç ayçiçekleri gün içinde güneşin yönüne doğru dönebilir. Sabah güneş doğudan yükselir. Gün ilerledikçe güneş gökyüzünde yer değiştirir. Ayçiçeği de ışığa yönelir. Bu hareket bitkinin büyümesine yardım eder. Ayçiçeği hem güzel görünür hem de çekirdek verir.",
    questions: [
      { q: "Ayçiçeği hangi rengiyle kolayca tanınır?", options: ["Sarı", "Mavi", "Siyah"], correct: 0 },
      { q: "Ayçiçeğine halk arasında ne denir?", options: ["Günebakan", "Gece çiçeği", "Kar çiçeği"], correct: 0 },
      { q: "Genç ayçiçekleri neye yönelebilir?", options: ["Güneşe", "Taşa", "Yağmurluğa"], correct: 0 },
      { q: "Sabah güneş nereden yükselir?", options: ["Doğudan", "Batıdan", "Kuzeyden"], correct: 0 },
      { q: "Ayçiçeğinin ışığa yönelmesi neye yardım eder?", options: ["Büyümesine", "Uçmasına", "Rengini kaybetmesine"], correct: 0 },
      { q: "Ayçiçeğiyle ilgili hangi bilgi doğrudur?", options: ["Işığa yönelebilir ve çekirdek verir.", "Geceleri denizde yaşar.", "Kışın yapraklarını maviye boyar."], correct: 0 }
    ]
  }
};

let newContent = fileContent;

for (let i = 2; i <= 9; i++) {
  const d = chestData[i];
  
  // Create the replacement block first
  const replacement = '"' + i + '": {\n' +
    '    okuyorumAnliyorum: {\n' +
    '      title: "' + d.title + '",\n' +
    '      theme: "' + d.theme + '",\n' +
    '      text: "' + d.text + '",\n' +
    '      questions: ' + JSON.stringify(d.questions, null, 8).replace(/\\n/g, '\\n      ').replace(/}$/g, '      }') + '\n' +
    '    },\n' +
    '    dilimiOgreniyorum';
    
  // Simple string split and join replacement to avoid RegExp issues
  const searchString = '"' + i + '": {\\n    okuyorumAnliyorum: {\\n      title: "Sandık ' + i + ' Hikayesi",\\n      theme: "Macera ' + i + '",\\n      text: "Bu, Sandık ' + i + ' için hazırlanmış örnek bir hikaye metnidir.",\\n      questions: [\\n        { q: "Bu hangi sandık?", options: ["Sandık ' + i + '", "Başka"], correct: 0 }\\n      ]\\n    },\\n    dilimiOgreniyorum';
  
  newContent = newContent.split(searchString).join(replacement);
}

fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
console.log('Successfully updated chests 2-9 reading comprehension data!');
