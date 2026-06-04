const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const chestData = {
  10: {
    title: "Kırmızı Işık",
    theme: "Güvenlik ve kurallar - Kısa hikaye",
    text: "Mert ve annesi markete gitmek için evden çıktı. Büyük caddenin kenarındaki kaldırımdan yürüdüler. Yaya geçidine geldiklerinde durdular. Trafik lambasında kırmızı insan işareti yanıyordu. Mert annesinin elini tuttu. Bir süre beklediler. Yeşil insan işareti yanınca karşıya geçtiler. Mert kurala uyduğu için güvenle yürüdü.",
    questions: [
      { q: "Mert ve annesi nereye gitmek için çıktı?", options: ["Markete", "Okula", "Sinemaya"], correct: 0 },
      { q: "Nereden yürüdüler?", options: ["Kaldırımdan", "Yolun ortasından", "Çimlerden"], correct: 0 },
      { q: "Yaya geçidinde önce hangi işaret yanıyordu?", options: ["Kırmızı insan işareti", "Mavi yıldız", "Sarı araba"], correct: 0 },
      { q: "Mert kimin elini tuttu?", options: ["Annesinin", "Öğretmeninin", "Arkadaşının"], correct: 0 },
      { q: "Ne zaman karşıya geçtiler?", options: ["Yeşil insan işareti yanınca", "Kırmızı ışık yanınca", "Hiç beklemeden"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Trafik kurallarına uymak güvenlik için önemlidir.", "Market alışverişi eğlencelidir.", "Kaldırımlar sadece oyun içindir."], correct: 0 }
    ]
  },
  11: {
    title: "Parktaki Kulübe",
    theme: "Yardımlaşma - Hikaye",
    text: "Eda ve Kaan hafta sonu mahalledeki parka gittiler. Parkın köşesindeki çınar ağacında eski bir kuş kulübesi gördüler. Kulübenin çatısı eğilmiş, boyası dökülmüştü. Küçük kapısının kenarı da biraz kırılmıştı. Eda, kuşların yağmurda bu kulübede zorlanabileceğini düşündü. Kaan da kulübeyi birlikte onarabileceklerini söyledi. Bunun üzerine eve gidip gerekli malzemeleri almaya karar verdiler. Kaan küçük bir tamir kutusu getirdi. Eda da fırça, boya ve biraz yem aldı. Önce çatıyı düzelttiler, sonra kırık yeri dikkatlice sağlamlaştırdılar. Ardından kulübeyi sarı ve yeşil renklere boyadılar. Boya kuruyunca içine biraz yem ve küçük bir kap su bıraktılar. Kuşlar ağaca gelince iki arkadaş sessizce geri çekilip onları izledi. Yaptıkları küçük yardımın bir canlı için güvenli bir yuva olduğunu görmek ikisini de mutlu etti.",
    questions: [
      { q: "Eda ve Kaan nereye gitti?", options: ["Parka", "Müzeye", "Pazara"], correct: 0 },
      { q: "Eski kulübe neredeydi?", options: ["Çınar ağacında", "Bankın altında", "Çantanın içinde"], correct: 0 },
      { q: "Kulübenin hangi sorunları vardı?", options: ["Çatısı eğilmiş, boyası dökülmüş ve kapısının kenarı kırılmıştı.", "İçinde oyuncak vardı.", "Çok yeni görünüyordu."], correct: 0 },
      { q: "Kaan evden ne getirdi?", options: ["Tamir kutusu", "Uçurtma", "Top"], correct: 0 },
      { q: "Çocuklar kulübeyi boyamadan önce ne yaptı?", options: ["Çatıyı ve kırık yeri düzeltti.", "Eve döndü.", "Yem yedi."], correct: 0 },
      { q: "Kulübeye ne bıraktılar?", options: ["Yem ve su", "Taş ve ip", "Defter ve kalem"], correct: 0 },
      { q: "Eda neden kulübeyi onarmak istedi?", options: ["Kuşların yağmurda zorlanabileceğini düşündü.", "Kulübeyi eve götürmek istedi.", "Parktan sıkıldı."], correct: 0 },
      { q: "Bu metnin ana fikri nedir?", options: ["Birlikte çalışarak canlılara yardım edebiliriz.", "Parklarda hiç ağaç olmamalıdır.", "Kuşlar sadece sarı kulübeyi sever."], correct: 0 }
    ]
  },
  12: {
    title: "Rüzgarlı Uçurtma",
    theme: "Paylaşma - Hikaye",
    text: "Emre rüzgarlı bir cumartesi sabahı sahile gitti. Elinde sarı ve lacivert çizgili bir uçurtma vardı. Rüzgar kuvvetli olduğu için uçurtma kısa sürede gökyüzüne yükseldi. Emre ipi dikkatle tutuyor, uçurtmanın sağa sola savrulmasını izliyordu. Biraz ileride küçük bir çocuk bankta oturuyordu. Çocuğun yanında oyuncak yoktu ve gözleri Emre’nin uçurtmasındaydı. Emre önce tek başına oynamaya devam etti. Sonra çocuğun uzun süre sessizce izlediğini fark etti. Yanına gidip uçurtmanın ipini birlikte tutmayı teklif etti. Çocuk sevinerek ayağa kalktı. Emre ona ipin nasıl tutulacağını gösterdi. İkisi sırayla ipi tuttular ve uçurtmanın daha da yükselmesini izlediler. Emre, oyuncağını paylaşınca oyunun daha keyifli olduğunu fark etti. Küçük çocuk da oyuna katıldığı için mutlu oldu.",
    questions: [
      { q: "Emre nereye gitti?", options: ["Sahile", "Ormana", "Sınıfa"], correct: 0 },
      { q: "Hava nasıldı?", options: ["Rüzgarlı", "Karlı", "Sisli"], correct: 0 },
      { q: "Uçurtmanın renkleri neydi?", options: ["Sarı ve lacivert", "Kırmızı ve beyaz", "Mor ve yeşil"], correct: 0 },
      { q: "Küçük çocuk ne yapıyordu?", options: ["Emre’nin uçurtmasını izliyordu.", "Koşuyordu.", "Uyuyordu."], correct: 0 },
      { q: "Emre çocuğun yanına neden gitti?", options: ["Onun uzun süre sessizce izlediğini fark ettiği için", "Uçurtmayı saklamak için", "Bankı almak için"], correct: 0 },
      { q: "Emre çocuğa ne teklif etti?", options: ["Uçurtmanın ipini birlikte tutmayı", "Eve gitmeyi", "Denize girmeyi"], correct: 0 },
      { q: "Emre neyi fark etti?", options: ["Paylaşınca oyunun daha keyifli olduğunu", "Uçurtmanın gereksiz olduğunu", "Sahilin çok uzak olduğunu"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Paylaşmak mutluluğu artırır.", "Rüzgarlı havada dışarı çıkılmaz.", "Uçurtma sadece tek kişiyle oynanır."], correct: 0 }
    ]
  },
  13: {
    title: "Arıların Dansı",
    theme: "Bilgilendirici hayvanlar - Bilgilendirici metin",
    text: "Arılar çiçeklerden nektar toplayarak bal yapar. Bir arı bol çiçekli bir yer bulduğunda bunu diğer arılara haber vermek ister. Çünkü kovandaki arıların birlikte çalışması gerekir. Çiçeklerin yerini bilen arı kovana döner. Kovanın içinde diğer arıların önünde özel bir hareket yapar. Bu harekete sallantı dansı denir. Arı dans ederken vücudunu sallar ve belli bir yönde ilerler. Dansın yönü, çiçeklerin hangi tarafta olduğunu anlatmaya yardım eder. Dansın süresi ve hareketi de çiçeklerin kovana uzaklığı hakkında bilgi verebilir. Diğer arılar bu hareketleri izler ve anlamaya çalışır. Sonra çiçeklerin olduğu yere doğru uçarlar. Böylece arılar konuşmadan birbirlerine bilgi aktarabilir. Bu davranış, doğadaki ilginç iletişim örneklerinden biridir.",
    questions: [
      { q: "Arılar çiçeklerden ne toplar?", options: ["Nektar", "Kum", "Tuz"], correct: 0 },
      { q: "Arı bol çiçekli yer bulunca nereye döner?", options: ["Kovana", "Denize", "Yola"], correct: 0 },
      { q: "Arının yaptığı harekete ne denir?", options: ["Sallantı dansı", "Sessiz uyku", "Kanat molası"], correct: 0 },
      { q: "Dansın yönü neyi anlatmaya yardım eder?", options: ["Çiçeklerin hangi tarafta olduğunu", "Arının rengini", "Kovanın kaç yaşında olduğunu"], correct: 0 },
      { q: "Dansın süresi ve hareketi ne hakkında bilgi verebilir?", options: ["Çiçeklerin kovana uzaklığı", "Yağmurun rengi", "Arının adı"], correct: 0 },
      { q: "Diğer arılar dansı izledikten sonra ne yapar?", options: ["Çiçeklerin olduğu yere uçar", "Kovandan çıkarılmaz", "Suda yüzer"], correct: 0 },
      { q: "Arılar bu şekilde ne yapmış olur?", options: ["Konuşmadan anlaşmış olur", "Oyun oynamış olur", "Yuvasını boyamış olur"], correct: 0 },
      { q: "Arıların sallantı dansı neden önemlidir?", options: ["Diğer arılara çiçeklerin yerini anlatmaya yardım eder.", "Arıların uyumasını sağlar.", "Çiçeklerin rengini değiştirir."], correct: 0 }
    ]
  },
  14: {
    title: "Kırmızı Cüzdan",
    theme: "Dürüstlük - Hikaye",
    text: "Pelin öğle arasında okul bahçesine çıktı. Arkadaşları oyun alanına koşarken o bahçe kapısının yanında kırmızı çizgili küçük bir cüzdan gördü. Önce bunun bir oyuncak olduğunu sandı. Yaklaşınca içinde bozuk paralar olduğunu fark etti. Pelin etrafına baktı ama cüzdanın sahibini göremedi. Bir an ne yapması gerektiğini düşündü. Cüzdanı cebine koymayı ya da paraları kullanmayı doğru bulmadı. Onu iki eliyle tutup öğretmenler odasına götürdü. Nöbetçi öğretmene cüzdanı nerede bulduğunu anlattı. Öğretmen Pelin’e teşekkür etti ve sahibini bulmak için sınıflara haber verdi. Bir süre sonra cüzdanın sahibi bulundu. Pelin, kendisine ait olmayan bir şeyi doğru yere teslim ettiği için kendini iyi hissetti. Dürüst davranmanın bazen küçük bir seçimle başladığını anladı.",
    questions: [
      { q: "Pelin cüzdanı nerede buldu?", options: ["Bahçe kapısının yanında", "Kantinde", "Kütüphanede"], correct: 0 },
      { q: "Cüzdan nasıldı?", options: ["Kırmızı çizgili ve küçüktü", "Büyük ve maviydi", "Sarı ve boştu"], correct: 0 },
      { q: "Cüzdanın içinde ne vardı?", options: ["Bozuk paralar", "Kalemler", "Oyuncaklar"], correct: 0 },
      { q: "Pelin neyi doğru bulmadı?", options: ["Cüzdanı cebine koymayı ya da paraları kullanmayı", "Öğretmenle konuşmayı", "Bahçede yürümeyi"], correct: 0 },
      { q: "Pelin cüzdanı kime götürdü?", options: ["Nöbetçi öğretmene", "Market görevlisine", "Komşusuna"], correct: 0 },
      { q: "Öğretmen ne yaptı?", options: ["Sahibinin bulunması için sınıflara haber verdi.", "Cüzdanı çöpe attı.", "Pelin’e kızdı."], correct: 0 },
      { q: "Pelin’in davranışı hangi özelliği gösterir?", options: ["Dürüstlük", "Kıskançlık", "Dağınıklık"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Bize ait olmayan eşyaları sahibine ulaştırmalıyız.", "Cüzdanlar bahçede saklanmalıdır.", "Öğle arasında dışarı çıkılmaz."], correct: 0 }
    ]
  },
  15: {
    title: "Ağır Poşetler",
    theme: "Yaşlılara saygı - Hikaye",
    text: "Selim okuldan eve dönerken apartmanın girişinde Nebahat Teyze’yi gördü. Nebahat Teyze üst katta oturuyordu ve iki elinde sebze dolu poşetler vardı. Poşetler ağır olduğu için merdivenleri yavaş çıkıyordu. Bir basamakta durup biraz dinlenmek zorunda kaldı. Selim bu durumu görünce hemen yanına gitti. “İstersen poşetleri taşımana yardım edebilirim,” dedi. Nebahat Teyze önce onu yormak istemediğini söyledi. Selim ise poşetlerin bir kısmını taşıyabileceğini anlattı. Nebahat Teyze gülümseyerek iki poşeti Selim’e verdi. Birlikte acele etmeden üst kata çıktılar. Selim poşetleri kapının önüne bıraktı. Nebahat Teyze ona teşekkür etti ve nazik davranışının çok değerli olduğunu söyledi. Selim, küçük bir yardımın birinin işini kolaylaştırabileceğini anladı.",
    questions: [
      { q: "Selim apartmanda kimi gördü?", options: ["Nebahat Teyze’yi", "Öğretmenini", "Arkadaşını"], correct: 0 },
      { q: "Nebahat Teyze’nin elinde ne vardı?", options: ["Sebze dolu poşetler", "Oyuncaklar", "Kitaplar"], correct: 0 },
      { q: "Nebahat Teyze merdivenleri neden yavaş çıkıyordu?", options: ["Poşetler ağır olduğu için", "Merdiven yoktu", "Selim onu durdurduğu için"], correct: 0 },
      { q: "Selim ne teklif etti?", options: ["Yardım etmeyi", "Oyun oynamayı", "Şarkı söylemeyi"], correct: 0 },
      { q: "Nebahat Teyze önce neden tereddüt etti?", options: ["Selim’i yormak istemediği için", "Poşetler boş olduğu için", "Eve gitmek istemediği için"], correct: 0 },
      { q: "Selim poşetleri nereye bıraktı?", options: ["Kapının önüne", "Bahçeye", "Çöpe"], correct: 0 },
      { q: "Nebahat Teyze nasıl karşılık verdi?", options: ["Teşekkür etti", "Kızdı", "Uzaklaştı"], correct: 0 },
      { q: "Bu metinden hangi sonuç çıkarılır?", options: ["Yaşlılara nazikçe yardım etmek güzel bir davranıştır.", "Ağır poşetleri yere bırakmalıyız.", "Apartmanda kimseyle konuşmamalıyız."], correct: 0 }
    ]
  }
};

let newContent = fileContent;

for (let i = 10; i <= 15; i++) {
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
console.log('Successfully updated chests 10-15 reading comprehension data!');
