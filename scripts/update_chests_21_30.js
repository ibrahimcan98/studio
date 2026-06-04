const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const chestData = {
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

for (let i = 21; i <= 30; i++) {
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
console.log('Successfully updated chests 21-30 reading comprehension data!');
