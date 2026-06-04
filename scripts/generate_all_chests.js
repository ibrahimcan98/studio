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
  },
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
  },
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
  },
  21: {
    title: "Karanlıktaki Gölge",
    theme: "Cesaret - Hikaye",
    text: "Pelin akşam yatağına girdiğinde odasındaki büyük lambayı kapattı. Sadece sokak lambasından gelen hafif ışık odanın içine düşüyordu. Odanın bazı köşeleri aydınlık, bazı köşeleri ise karanlık görünüyordu. Pelin tam uyuyacakken karşı duvarda büyük bir gölge fark etti. Gölge, kollarını açmış biri gibi duruyordu. Pelin önce korktu ve battaniyesini çenesine kadar çekti. Kalbi hızlanmıştı ama gözlerini gölgeden ayıramıyordu. Bir süre sonra derin bir nefes aldı. “Önce ne olduğuna bakmalıyım,” diye düşündü. Yatağından kalkıp lambanın düğmesine bastı. Işık açılınca duvardaki gölge hemen kayboldu. Pelin sandalyenin üzerinde duran şapka ve hırkayı gördü. Sokak lambasının ışığı bu eşyaların gölgesini duvara yansıtmıştı. Pelin korktuğu şeyin aslında odasındaki eşyalar olduğunu anlayınca rahatladı. O gece, korktuğu bir şeyi anlamaya çalışmanın kendisini daha cesur hissettirdiğini fark etti.",
    questions: [
      { q: "Pelin ne zaman lambayı kapattı?", options: ["Yatağına girdiğinde", "Sabah uyanınca", "Yemek yerken"], correct: 0 },
      { q: "Odayı ne aydınlatıyordu?", options: ["Sokak lambasından gelen hafif ışık", "El feneri", "Bilgisayar ekranı"], correct: 0 },
      { q: "Pelin duvarda ne gördü?", options: ["Büyük bir gölge", "Renkli bir resim", "Küçük bir böcek"], correct: 0 },
      { q: "Pelin ilk başta nasıl hissetti?", options: ["Korktu", "Çok güldü", "Hiç fark etmedi"], correct: 0 },
      { q: "Pelin korkunca ne yaptı?", options: ["Önce battaniyesini çenesine kadar çekti.", "Hemen bahçeye çıktı.", "Pencereyi açtı."], correct: 0 },
      { q: "Pelin ne yapmaya karar verdi?", options: ["Gölgenin ne olduğuna bakmaya", "Hemen ağlamaya", "Odadan kaçmaya"], correct: 0 },
      { q: "Gölge aslında neyden oluşmuştu?", options: ["Şapka ve hırkadan", "Oyuncak ayıdan", "Kapının kolundan"], correct: 0 },
      { q: "Pelin neden rahatladı?", options: ["Korkusunun nedenini anladığı için", "Annesi geldiği için", "Gölge konuştuğu için"], correct: 0 },
      { q: "Pelin’in davranışı hangi özelliği gösterir?", options: ["Cesaret", "Kıskançlık", "Dikkatsizlik"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Korktuğumuz şeyleri anlamaya çalışmak bizi rahatlatabilir.", "Her gölge tehlikelidir.", "Işık hiçbir işe yaramaz."], correct: 0 }
    ]
  },
  22: {
    title: "Kemanın Sesi",
    theme: "Sanat sevgisi - Hikaye",
    text: "Arda hafta sonu babasıyla çarşıdaki müzik mağazasının önünden geçti. Vitrinde gitarlar, davullar, flütler ve kemanlar vardı. Bazıları büyük ve parlak, bazıları ise küçük ve sade görünüyordu. Arda en çok kahverengi kemanı merak etti. Kemanın ince gövdesi ve uzun yayı dikkatini çekti. O sırada mağazanın içinde bir müzisyen keman çalmaya başladı. Yay tellerin üzerinde yavaşça hareket ediyordu. Kemanın sesi ince, yumuşak ve sakindi. Arda sesi dinlerken mağazanın kalabalığını bir an unuttu. Müzik ona gökyüzünde süzülen kuşları ve hafif esen rüzgarı hatırlattı. Babasına, “Keman çalmayı öğrenmek isterim,” dedi. Babası, bir çalgıyı öğrenmenin sabır ve düzenli çalışma gerektirdiğini anlattı. Arda hemen mükemmel çalamayacağını biliyordu. Yine de bir gün kendi emeğiyle güzel bir melodi çalabilmeyi hayal etti. O gün Arda, sanatın insanın içinde yeni bir merak uyandırabileceğini fark etti.",
    questions: [
      { q: "Arda kiminle çarşıdaydı?", options: ["Babasıyla", "Öğretmeniyle", "Komşusuyla"], correct: 0 },
      { q: "Vitrinde hangi çalgılar vardı?", options: ["Gitarlar, davullar, flütler ve kemanlar", "Arabalar ve toplar", "Defterler ve kalemler"], correct: 0 },
      { q: "Arda en çok hangi çalgıyı merak etti?", options: ["Kemanı", "Davulu", "Zili"], correct: 0 },
      { q: "Müzisyen ne çalmaya başladı?", options: ["Keman", "Piyano", "Kemençe"], correct: 0 },
      { q: "Kemanın sesi nasıldı?", options: ["İnce, yumuşak ve sakin", "Çok sert ve gürültülü", "Sessiz"], correct: 0 },
      { q: "Arda müziği dinlerken neyi unuttu?", options: ["Mağazanın kalabalığını", "Adını", "Ayakkabısını"], correct: 0 },
      { q: "Müzik Arda’ya neyi hatırlattı?", options: ["Gökyüzünde süzülen kuşları ve hafif esen rüzgarı", "Karanlık bir odayı", "Kayıp bir çantayı"], correct: 0 },
      { q: "Babası keman öğrenmek için ne gerektiğini söyledi?", options: ["Sabır ve düzenli çalışma", "Hiç çalışmamak", "Sadece hızlı koşmak"], correct: 0 },
      { q: "Arda’nın hayali nedir?", options: ["Bir gün kendi emeğiyle güzel bir melodi çalabilmek", "Mağazayı kapatmak", "Çalgıları saklamak"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Sanat merak uyandırır ve emekle öğrenilir.", "Müzik mağazalarına girilmez.", "Keman sesi herkesi korkutur."], correct: 0 }
    ]
  },
  23: {
    title: "Topraktan Çıkan Saat",
    theme: "Tarih merakı - Hikaye",
    text: "Çınar dedesiyle birlikte arka bahçede toprağı kazıyordu. Yeni çiçek tohumları için küçük bir alan hazırlıyorlardı. Dedesi toprağı yavaş kazmasını, çünkü bazen toprağın altında eski kökler ya da sert taşlar olabileceğini söyledi. Bir süre sonra Çınar’ın küreği sert bir şeye çarptı. Topraktan “tık” diye bir ses geldi. Çınar hemen durdu ve toprağı elleriyle dikkatle açtı. Yuvarlak, paslanmış bir nesne buldu. Dedesi nesneyi yavaşça temizledi. Bunun eski bir köstekli saat olduğu ortaya çıktı. Saatin camı çatlamıştı ama akrep ve yelkovanı hâlâ görülebiliyordu. Çınar saatin kime ait olduğunu merak etti. Belki yıllar önce bu evde yaşayan biri kullanmıştı. Belki de bir cebin içinden düşüp uzun süre toprağın altında kalmıştı. Dedesi, eski eşyaların geçmiş hakkında ipuçları verebileceğini söyledi. Çınar o gün tarihin sadece kitaplarda olmadığını fark etti. Bazen geçmiş, toprağın içinden çıkan küçük bir eşyada da saklı olabilir.",
    questions: [
      { q: "Çınar kiminle bahçedeydi?", options: ["Dedesiyle", "Arkadaşıyla", "Öğretmeniyle"], correct: 0 },
      { q: "Bahçede ne hazırlıyorlardı?", options: ["Çiçek tohumları için alan", "Oyuncak yolu", "Havuz"], correct: 0 },
      { q: "Dedesi neden yavaş kazmasını söyledi?", options: ["Toprağın altında eski kökler ya da sert taşlar olabileceği için", "Hava çok sıcak olduğu için", "Çınar yorulmasın diye hiç kazmasın istediği için"], correct: 0 },
      { q: "Çınar’ın küreği neye çarptı?", options: ["Sert bir şeye", "Çiçeğe", "Suya"], correct: 0 },
      { q: "Topraktan çıkan nesne nasıldı?", options: ["Yuvarlak ve paslanmış", "Yeni ve parlak", "Yumuşak ve beyaz"], correct: 0 },
      { q: "Nesnenin ne olduğu ortaya çıktı?", options: ["Köstekli saat", "Oyuncak araba", "Anahtar"], correct: 0 },
      { q: "Saatin hangi parçaları görülebiliyordu?", options: ["Akrep ve yelkovan", "Pil ve düğme", "Kordon ve zil"], correct: 0 },
      { q: "Çınar neyi merak etti?", options: ["Saatin kime ait olduğunu", "Bahçedeki kuşları", "Toprağın rengini"], correct: 0 },
      { q: "Çınar neyi fark etti?", options: ["Tarihin sadece kitaplarda olmadığını", "Saatlerin hiç bozulmadığını", "Çiçeklerin konuştuğunu"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Eski eşyalar geçmişi merak etmemizi sağlayabilir.", "Bahçede hiçbir şey bulunmaz.", "Saatler sadece yeni olmalıdır."], correct: 0 }
    ]
  },
  24: {
    title: "Güneş Enerjili Oyuncak",
    theme: "İcat ve bilim - Bilgilendirici hikaye",
    text: "Selim pazar günü mavi oyuncak arabasıyla oynamak istedi. Kumandaya bastı ama araba hareket etmedi. Önce kumandanın bozulduğunu düşündü. Babası arabayı kontrol edince pillerin bittiğini fark etti. Evde yeni pil kalmamıştı. Selim biraz üzüldü, çünkü arabasını o gün denemek istiyordu. Babası ona küçük bir güneş paneli gösterdi. Güneş paneli, güneş ışığını elektrik enerjisine çevirebilen bir parçadır. Babası bu parçanın bazı hesap makinelerinde, lambalarda ve farklı cihazlarda kullanılabildiğini anlattı. Sonra paneli arabanın üstüne güvenli bir şekilde bağladı. Selim arabayı güneş alan balkona koydu. Bir süre sonra araba yavaşça hareket etmeye başladı. Selim, güneş ışığının enerjiye dönüşebildiğini kendi gözleriyle gördü. Babası buna temiz enerji örneklerinden biri olduğunu söyledi. Temiz enerji doğaya daha az zarar veren enerji kaynakları için kullanılan bir ifadedir. Selim bu denemeden sonra başka oyuncakların nasıl çalıştığını da merak etti. Merak etmek, yeni fikirlerin ve küçük icatların başlangıcı olabilir.",
    questions: [
      { q: "Selim hangi oyuncağıyla oynamak istedi?", options: ["Mavi oyuncak araba", "Kırmızı top", "Sarı robot"], correct: 0 },
      { q: "Araba neden hareket etmedi?", options: ["Pilleri bitmişti", "Tekerleği yoktu", "Kaybolmuştu"], correct: 0 },
      { q: "Selim önce ne düşündü?", options: ["Kumandanın bozulduğunu", "Balkonda yağmur yağdığını", "Arabanın uçacağını"], correct: 0 },
      { q: "Babası ne gösterdi?", options: ["Güneş paneli", "Yeni kalem", "Eski saat"], correct: 0 },
      { q: "Güneş paneli ne işe yarar?", options: ["Güneş ışığını elektrik enerjisine çevirebilir", "Arabayı boyar", "Oyuncağı saklar"], correct: 0 },
      { q: "Panel nereye bağlandı?", options: ["Arabanın üstüne", "Kapının arkasına", "Çantaya"], correct: 0 },
      { q: "Araba sonra ne yaptı?", options: ["Yavaşça hareket etti", "Eridi", "Kayboldu"], correct: 0 },
      { q: "Temiz enerji neyle ilgilidir?", options: ["Doğaya daha az zarar veren enerji kaynaklarıyla", "Kirli oyuncaklarla", "Sadece karanlık odalarla"], correct: 0 },
      { q: "Selim neyi merak etti?", options: ["Başka oyuncakların nasıl çalıştığını", "Çantaların rengini", "Kitapların kapağını"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Bilimsel merak yeni fikirler doğurabilir.", "Oyuncaklar hep pille çalışmalıdır.", "Güneş ışığı işe yaramaz."], correct: 0 }
    ]
  },
  25: {
    title: "Yeni Gelen Arkadaş",
    theme: "Empati - Hikaye",
    text: "Pazartesi sabahı sınıfa Elif adında yeni bir öğrenci geldi. Elif başka bir ülkeden taşınmıştı ve Türkçe konuşurken biraz zorlanıyordu. Öğretmen onu sınıfa tanıttıktan sonra yanındaki boş sıraya oturttu. İlk derste Elif öğretmeni dikkatle dinledi ama bazı kelimeleri anlamakta zorlandı. Teneffüs zili çalınca sınıftaki çocuklar bahçeye çıktı. Elif ise sırasında kaldı ve etrafına sessizce baktı. Kerem onun yalnız kaldığını fark etti. Önce ne söyleyeceğini bilemedi. Sonra çantasından bir boyama kitabı ve renkli kalemler çıkardı. Elif’in yanına gidip gülümsedi. Kelimelerle uzun uzun konuşmak yerine kitabı açtı ve kalemleri ortaya koydu. Elif önce şaşırdı, sonra kırmızı kalemi aldı. İki çocuk aynı resmi birlikte boyamaya başladı. Bir süre sonra Elif de küçük bir gülümsemeyle Kerem’e mavi kalemi uzattı. Kerem, bazen dostluk kurmak için çok fazla kelime gerekmediğini anladı. Elif de sınıfta yalnız olmadığını hissetti.",
    questions: [
      { q: "Sınıfa yeni gelen öğrencinin adı neydi?", options: ["Elif", "Nil", "Pelin"], correct: 0 },
      { q: "Elif neden biraz zorlanıyordu?", options: ["Türkçe konuşurken zorlanıyordu", "Ayakkabısı yoktu", "Kitabı kaybolmuştu"], correct: 0 },
      { q: "Teneffüste çocuklar nereye çıktı?", options: ["Bahçeye", "Kantine", "Kütüphaneye"], correct: 0 },
      { q: "Elif nerede kaldı?", options: ["Sırasında", "Bahçede", "Koridorda"], correct: 0 },
      { q: "Kerem neyi fark etti?", options: ["Elif’in yalnız kaldığını", "Öğretmenin geldiğini", "Kalemlerin kırıldığını"], correct: 0 },
      { q: "Kerem çantasından ne çıkardı?", options: ["Boyama kitabı ve renkli kalemler", "Top ve ip", "Sandviç ve su"], correct: 0 },
      { q: "Elif ilk olarak hangi kalemi aldı?", options: ["Kırmızı kalem", "Siyah kalem", "Beyaz kalem"], correct: 0 },
      { q: "Elif sonra Kerem’e ne uzattı?", options: ["Mavi kalemi", "Çantasını", "Montunu"], correct: 0 },
      { q: "Kerem neyi anladı?", options: ["Dostluk kurmak için bazen çok fazla kelime gerekmez.", "Kimseyle konuşulmamalıdır.", "Boyama kitapları saklanmalıdır."], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Empati kurmak ve küçük bir adım atmak birini iyi hissettirebilir.", "Yeni gelen öğrenciler yalnız kalmalıdır.", "Teneffüste sınıfta durmak yasaktır."], correct: 0 }
    ]
  },
  26: {
    title: "Büyüteçle Bakınca",
    theme: "Bakış açısı - Düşündürücü hikaye",
    text: "Defne, dedesinin masasındaki büyüteci ilk kez eline aldı. Büyüteçle önce kendi parmağına baktı. Parmak çizgileri ona küçük yollar gibi göründü. Sonra masadaki yaprağı inceledi. Yaprağın üzerinde ince damarlar vardı. Defne bu ayrıntıları normalde fark etmediğini düşündü. Dedesi, “Bazen bir şeye yakından bakınca onu daha iyi anlarsın,” dedi. Defne bu sözü sadece büyüteç için düşünmedi. O gün okulda yaşadığı bir olayı hatırladı. Arkadaşı Elvan teneffüste onunla oynamamıştı. Defne önce Elvan’ın kendisine kızgın olduğunu sanmıştı. Şimdi ise belki de Elvan’ın yorgun, üzgün ya da başka bir şey düşünmüş olabileceğini fark etti. Dedesi, insanları anlamak için de bazen dikkatli bakmak ve dinlemek gerektiğini söyledi. Defne, olaylara hemen karar vermeden önce biraz düşünmesi gerektiğini anladı. Büyüteç ona sadece küçük ayrıntıları göstermemişti. Aynı zamanda farklı bir açıdan bakmanın önemini de hatırlatmıştı. Ertesi gün Elvan’la konuşup onu dinlemeye karar verdi.",
    questions: [
      { q: "Defne neyi eline aldı?", options: ["Büyüteç", "Saat", "Kalemlik"], correct: 0 },
      { q: "Parmak çizgileri Defne’ye ne gibi göründü?", options: ["Küçük yollar", "Büyük taşlar", "Balonlar"], correct: 0 },
      { q: "Defne yaprakta ne gördü?", options: ["İnce damarlar", "Mavi boya", "Küçük düğmeler"], correct: 0 },
      { q: "Dedesi ne söyledi?", options: ["Yakından bakınca bir şeyi daha iyi anlayabilirsin.", "Büyüteç hiç işe yaramaz.", "Yaprakları koparmalısın."], correct: 0 },
      { q: "Defne okulda hangi olayı hatırladı?", options: ["Elvan’ın onunla oynamamasını", "Öğretmenin kitap okumasını", "Kaleminin kırılmasını"], correct: 0 },
      { q: "Defne önce ne sanmıştı?", options: ["Elvan’ın ona kızgın olduğunu", "Elvan’ın eve gittiğini", "Elvan’ın oyun kurduğunu"], correct: 0 },
      { q: "Defne sonradan neyi düşündü?", options: ["Elvan’ın yorgun ya da üzgün olabileceğini", "Elvan’ın hiç konuşmadığını", "Elvan’ın okula gelmediğini"], correct: 0 },
      { q: "“Bir olaya dikkatli bakmak” metinde ne anlama gelir?", options: ["Hemen karar vermeden anlamaya çalışmak", "Gözleri kapatmak", "Sadece uzaktan bakmak"], correct: 0 },
      { q: "Büyüteç metinde neyi hatırlatır?", options: ["Ayrıntıları ve farklı açıdan bakmayı", "Acele etmeyi", "Saklanmayı"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Bir şeyi anlamak için bazen daha dikkatli ve farklı açıdan bakmak gerekir.", "Arkadaşlarımızı hiç dinlememeliyiz.", "Büyüteçle sadece parmaklara bakılır."], correct: 0 }
    ]
  },
  27: {
    title: "Yaşlı Meşe Ağacı",
    theme: "Doğa ve ekosistem - Bilgilendirici hikaye",
    text: "Deniz, dedesiyle birlikte ormandaki yaşlı meşe ağacının yanında durdu. Ağacın gövdesi kalın, dalları geniş ve yaprakları gürdü. Dedesi bu ağacın çok uzun yıllardır orada yaşadığını söyledi. Deniz ağaca ilk baktığında sadece büyük bir ağaç gördüğünü düşündü. Sonra dedesi ondan daha dikkatli bakmasını istedi. Dallarında kuşlar dinleniyordu. Kabuğunun arasında küçük böcekler geziyordu. Gölgesinde mantarlar ve otlar büyüyordu. Toprağın altında ise kökleri geniş bir alana yayılmıştı. Dedesi, ağaçların birçok canlıya yuva, gölge ve besin sağladığını anlattı. Ayrıca ağaçların havayı temizlemeye yardım ettiğini söyledi. Deniz meşe palamutlarının da yeni ağaçların büyümesine katkı sağlayabileceğini öğrendi. Yaşlı meşe artık onun gözünde sadece bir ağaç değildi. Ormandaki pek çok canlının yaşamına dokunan önemli bir varlıktı. Deniz ormandan ayrılırken yere düşen küçük bir meşe palamudunu dikkatle inceledi. Bir ağacı korumanın, aslında birçok canlıyı korumak anlamına gelebileceğini düşündü.",
    questions: [
      { q: "Deniz hangi ağacın yanında durdu?", options: ["Yaşlı meşe ağacı", "Elma ağacı", "Palmiye"], correct: 0 },
      { q: "Ağacın gövdesi nasıldı?", options: ["Kalın", "İnce ve kırık", "Bembeyaz"], correct: 0 },
      { q: "Dallarda hangi canlılar dinleniyordu?", options: ["Kuşlar", "Balıklar", "Kediler"], correct: 0 },
      { q: "Ağacın kabuğunun arasında ne geziyordu?", options: ["Küçük böcekler", "Oyuncaklar", "Kalemler"], correct: 0 },
      { q: "Gölgesinde neler büyüyordu?", options: ["Mantarlar ve otlar", "Defterler", "Deniz kabukları"], correct: 0 },
      { q: "Toprağın altında ne vardı?", options: ["Kökler", "Şemsiye", "Saat"], correct: 0 },
      { q: "Ağaçlar canlılara ne sağlar?", options: ["Yuva, gölge ve besin", "Televizyon", "Ayakkabı"], correct: 0 },
      { q: "Deniz meşe palamutları hakkında ne öğrendi?", options: ["Yeni ağaçların büyümesine katkı sağlayabileceğini", "Her zaman taş olduklarını", "Suda yaşadıklarını"], correct: 0 },
      { q: "Bir ağacı korumak ne anlama gelebilir?", options: ["Birçok canlıyı korumak", "Ormanı kirletmek", "Kuşları kovmak"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Ağaçlar birçok canlı için önemlidir ve korunmalıdır.", "Ormanda hiç canlı yoktur.", "Meşe palamudu bir oyuncaktır."], correct: 0 }
    ]
  },
  28: {
    title: "Ataçtan Telefon Standı",
    theme: "Yaratıcı düşünme - Hikaye",
    text: "Lina, çevrim içi ders için tabletini masaya koydu. Ancak tablet sürekli arkaya düşüyordu. Ekranı düzgün göremediği için öğretmenini takip etmekte zorlandı. Önce tabletin arkasına birkaç kitap dizdi. Fakat kitaplar kayınca tablet yine devrildi. Lina biraz sıkıldı ama dersi kaçırmak istemiyordu. Masanın üzerinde duran büyük ataçları fark etti. İki atacı dikkatlice açıp küçük ayaklar haline getirdi. Sonra kalın bir kartonu arkaya destek olarak yerleştirdi. Tablet bu kez dik durdu. Lina ekrandaki öğretmenini rahatça görebildi. Ders boyunca yaptığı düzenek işe yaradı. Ders bitince tablet standına baktı ve gülümsedi. Çok pahalı bir araç kullanmamıştı. Sadece elindeki malzemelerle işe yarayan bir çözüm bulmuştu. Annesi bunun yaratıcı düşünme olduğunu söyledi. Lina, bir sorunla karşılaşınca hemen vazgeçmek yerine farklı yollar denemek gerektiğini anladı. Sonra bu küçük düzeneği daha sağlam hale getirmek için başka neler ekleyebileceğini düşünmeye başladı.",
    questions: [
      { q: "Lina ne için tabletini masaya koydu?", options: ["Çevrim içi ders için", "Film izlemek için", "Oyun oynamak için"], correct: 0 },
      { q: "Tablet ne yapıyordu?", options: ["Sürekli arkaya düşüyordu", "Işık saçıyordu", "Şarkı söylüyordu"], correct: 0 },
      { q: "Lina ekranı düzgün göremeyince ne yaşadı?", options: ["Öğretmenini takip etmekte zorlandı.", "Hemen uyudu.", "Tableti kapattı."], correct: 0 },
      { q: "Lina önce ne denedi?", options: ["Kitapları arkasına dizdi", "Tableti yere attı", "Dersini kapattı"], correct: 0 },
      { q: "Lina masada neyi fark etti?", options: ["Büyük ataçları", "Çiçekleri", "Oyuncakları"], correct: 0 },
      { q: "Ataçları ne hale getirdi?", options: ["Küçük ayaklar", "Uzun ipler", "Kağıt topları"], correct: 0 },
      { q: "Arkaya ne koydu?", options: ["Karton destek", "Bardak", "Yastık"], correct: 0 },
      { q: "Annesi bunun ne olduğunu söyledi?", options: ["Yaratıcı düşünme", "Uyku hazırlığı", "Temizlik"], correct: 0 },
      { q: "Lina neyi anladı?", options: ["Sorunlarda farklı yollar denemek gerektiğini", "Derslere katılmamak gerektiğini", "Ataçların işe yaramadığını"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Basit malzemelerle yaratıcı çözümler bulunabilir.", "Tabletler asla dik durmaz.", "Sorun çıkınca hemen vazgeçmeliyiz."], correct: 0 }
    ]
  },
  29: {
    title: "Sessiz Gün",
    theme: "İletişim - Hikaye",
    text: "Ela bir sabah boğazı ağrıdığı için konuşmakta zorlandı. Doktor, sesini dinlendirmesi gerektiğini söyledi. Ela o gün okulda mümkün olduğunca az konuşacaktı. Sınıfa girince arkadaşlarına küçük bir not gösterdi. Notta, “Bugün sesimi dinlendirmem gerekiyor,” yazıyordu. Arkadaşları onu anlayışla karşıladı. İlk derste öğretmen soru sorduğunda Ela cevabını defterine yazıp gösterdi. Teneffüste arkadaşları oyun seçerken Ela işaretlerle fikrini anlatmaya çalıştı. Başta zorlandı çünkü her şeyi kelimelerle söylemeye alışmıştı. Sonra yüz ifadelerinin, hareketlerin ve kısa notların da işe yaradığını fark etti. Bir şey istemek, teşekkür etmek ya da duygusunu anlatmak için farklı yollar denedi. Arkadaşları da onu daha dikkatli dinlemeye ve anlamaya çalıştı. Gün sonunda sesi biraz dinlenmişti. Ela, konuşmanın değerini ve dinlemenin önemini daha iyi anladı. Ertesi gün arkadaşlarına teşekkür etmek için küçük bir not hazırladı. Notta, “Beni anlamaya çalıştığınız için teşekkür ederim,” yazıyordu.",
    questions: [
      { q: "Ela neden konuşmakta zorlandı?", options: ["Boğazı ağrıdığı için", "Kitabı kaybolduğu için", "Ayakkabısı yırtıldığı için"], correct: 0 },
      { q: "Doktor ne söyledi?", options: ["Sesini dinlendirmesi gerektiğini", "Koşması gerektiğini", "Şarkı söylemesi gerektiğini"], correct: 0 },
      { q: "Ela sınıfta arkadaşlarına ne gösterdi?", options: ["Küçük bir not", "Oyuncak", "Resim çantası"], correct: 0 },
      { q: "Notta ne yazıyordu?", options: ["Bugün sesimi dinlendirmem gerekiyor.", "Bugün okula gelmedim.", "Bugün oyun yok."], correct: 0 },
      { q: "İlk derste öğretmen soru sorduğunda Ela ne yaptı?", options: ["Cevabını defterine yazıp gösterdi.", "Bağırarak cevap verdi.", "Sınıftan çıktı."], correct: 0 },
      { q: "Ela teneffüste nasıl iletişim kurdu?", options: ["İşaretler ve kısa notlarla", "Bağırarak", "Hiçbir şey yapmadan"], correct: 0 },
      { q: "Ela neyi fark etti?", options: ["Yüz ifadeleri, hareketler ve kısa notlar da işe yarayabilir.", "Okulun kapalı olduğunu", "Suyun soğuk olduğunu"], correct: 0 },
      { q: "Arkadaşları nasıl davrandı?", options: ["Onu daha dikkatli anlamaya çalıştı.", "Onu görmezden geldi.", "Notlarını sakladı."], correct: 0 },
      { q: "Gün sonunda neyi daha iyi anladı?", options: ["Konuşmanın değerini ve dinlemenin önemini", "Oyuncak almayı", "Koşmanın hızını"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["İletişim kurmanın farklı yolları vardır ve dinlemek de önemlidir.", "Hiç konuşmamak her zaman en iyisidir.", "Not yazmak gereksizdir."], correct: 0 }
    ]
  },
  30: {
    title: "Bilgi Sandığı",
    theme: "Öğrenme ve gelişim - Final hikayesi",
    text: "Efe, okulun kütüphanesinde eski görünümlü bir tahta sandık buldu. Sandığın üzerinde “Bilgi paylaştıkça büyür” yazıyordu. Efe önce bunun eski bir eşya olduğunu düşündü. Kütüphane öğretmeni, sandığın özel bir etkinlik için hazırlandığını anlattı. Her öğrenci sandığa yıl boyunca öğrendiği bir bilgiyi küçük bir karta yazacaktı. Kartların üzerinde isim yazmak zorunlu değildi. Önemli olan herkesin öğrendiği bir şeyi sınıfla paylaşmasıydı. Efe önce ne yazacağını bilemedi. Sonra yıl boyunca okudukları metinleri düşündü. Arıların dans ederek haberleşebildiğini hatırladı. Atmosferin Dünya’yı koruduğunu, yaprakların sonbaharda neden renk değiştirdiğini, güneş enerjisinin oyuncak bir arabayı çalıştırabildiğini düşündü. Ayrıca yardım etmenin, paylaşmanın, dürüst olmanın ve empati kurmanın da öğrenilen bilgiler kadar değerli olduğunu fark etti. Bir karta, “Merak etmek öğrenmenin ilk adımıdır,” yazdı. Arkadaşları da kendi kartlarını sandığa bıraktı. Kimi doğayla, kimi sanatla, kimi yardımlaşmayla, kimi de bilimle ilgili bilgiler yazmıştı. Sandık doldukça sınıfın ortak bilgi hazinesi oluştu. Efe, herkesin öğrendiği bir şeyi paylaşınca sınıfın daha da zenginleştiğini gördü. O gün bilgi sandığı sadece kartlarla değil, çocukların merakı, emeği ve düşünceleriyle de doldu.",
    questions: [
      { q: "Efe sandığı nerede buldu?", options: ["Kütüphanede", "Bahçede", "Markette"], correct: 0 },
      { q: "Sandığın üzerinde ne yazıyordu?", options: ["Bilgi paylaştıkça büyür", "Kapıyı kapat", "Sadece kitap koy"], correct: 0 },
      { q: "Öğrenciler sandığa ne bırakacaktı?", options: ["Öğrendikleri bilgileri yazdıkları kartlar", "Oyuncaklar", "Yemekler"], correct: 0 },
      { q: "Kartların üzerinde ne zorunlu değildi?", options: ["İsim yazmak", "Bilgi yazmak", "Kağıt kullanmak"], correct: 0 },
      { q: "Efe önce ne yaşadı?", options: ["Ne yazacağını bilemedi", "Sandığı kırdı", "Eve gitti"], correct: 0 },
      { q: "Efe hangi bilgileri hatırladı?", options: ["Arılar, atmosfer, yapraklar ve güneş enerjisiyle ilgili bilgileri", "Sadece futbol kurallarını", "Market listesini"], correct: 0 },
      { q: "Efe değerler hakkında neyi fark etti?", options: ["Yardım, paylaşma, dürüstlük ve empatinin de değerli olduğunu", "Bunların önemsiz olduğunu", "Sadece bilim konularının öğrenileceğini"], correct: 0 },
      { q: "Efe karta ne yazdı?", options: ["Merak etmek öğrenmenin ilk adımıdır.", "Bugün hava çok sıcak.", "Kitaplar ağırdır."], correct: 0 },
      { q: "Sandık doldukça ne oluştu?", options: ["Sınıfın ortak bilgi hazinesi", "Oyuncak kutusu", "Çöp kutusu"], correct: 0 },
      { q: "Metnin ana fikri nedir?", options: ["Öğrenilen bilgileri paylaşmak herkesi geliştirir.", "Bilgi saklanmalıdır.", "Sadece öğretmenler öğrenebilir."], correct: 0 }
    ]
  }
};

let newContent = fileContent;

for (let i = 2; i <= 30; i++) {
  const d = chestData[i];
  
  // Create a regex to accurately match and replace the okuyorumAnliyorum section for this chest
  // We look for: "i": { followed by whitespace, then okuyorumAnliyorum: { until the next }, then dilimiOgreniyorum
  const regex = new RegExp('"' + i + '": \\{\\s*okuyorumAnliyorum: \\{[\\s\\S]*?\\},\\s*dilimiOgreniyorum');
  
  const replacement = '"' + i + '": {\n' +
    '    okuyorumAnliyorum: {\n' +
    '      title: "' + d.title + '",\n' +
    '      theme: "' + d.theme + '",\n' +
    '      text: "' + d.text + '",\n' +
    '      questions: ' + JSON.stringify(d.questions, null, 8).replace(/\\n/g, '\\n      ').replace(/}$/g, '      }') + '\n' +
    '    },\n' +
    '    dilimiOgreniyorum';
    
  newContent = newContent.replace(regex, replacement);
}

fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
console.log('Successfully updated chests 2-30 reading comprehension data using regex!');
