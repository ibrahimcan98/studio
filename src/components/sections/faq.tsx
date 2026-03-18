
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "1. Neden Türk Çocuk Akademisi?",
    answer: "Çünkü biz sadece dil öğretmiyoruz; dünyanın dört bir yanındaki çocuklarımıza Türk kimliğini, kültürünü ve değerlerini modern pedagojiyle aşılıyoruz. Uzman öğretmen kadromuz, PDR desteğimiz ve diaspora çocuklarına özel hazırlanmış tematik müfredatımızla bütünsel bir eğitim sunuyoruz."
  },
  {
    question: "2. Dersleriniz nasıl işleniyor ve ne kadar sürüyor?",
    answer: "Derslerimiz tamamen birebir (1-1) ve canlı olarak interaktif bir platformda işlenir. Çocuğunuzun odaklanma süresi ve verimliliği esas alınarak, derslerimiz 40 dakika sürmektedir. Bu süre boyunca oyunlar ve görsel içeriklerle ilgi en üst seviyede tutulur."
  },
  {
    question: "3. Çocuğumun Türkçe seviyesini nasıl belirliyorsunuz?",
    answer: "Kayıt öncesi gerçekleştirdiğimiz Ücretsiz Tanışma Dersi'nde uzman öğretmenimiz çocuğunuzla sohbet eder, dinleme ve konuşma becerilerini analiz eder. Bu değerlendirme sonucunda çocuğunuz, kendisine en uygun 4 farklı gelişim evresinden birine yerleştirilir."
  },
  {
    question: "4. Saat farkı sorun olur mu?",
    answer: "Kesinlikle hayır! 25’ten fazla ülkede öğrencimiz bulunuyor. Panelimiz üzerinden derslerinizi kendi yerel saatinize göre dilediğiniz gün ve saate planlayabilirsiniz. Program tamamen sizin yaşam temponuza uyum sağlar."
  },
  {
    question: "5. Derslere psikolojik danışman desteği dahil mi?",
    answer: "Evet, gelişim takibi bizim için çok önemli. Öğrencilerimizin motivasyonunu ve pedagojik gelişimini takip eden PDR uzmanımız sürece dahildir. Velilerimiz, çocuklarının gelişim seyri hakkında danışmanımızdan diledikleri zaman destek alabilirler."
  },
  {
    question: "6. İptal veya ders değişikliği yapabiliyor muyum?",
    answer: "Evet, esneklik bizim önceliğimiz. Üyelik politikamız çerçevesinde, ders saatinizden belirli bir süre öncesine kadar aile paneliniz üzerinden kolayca iptal veya değişiklik yapabilirsiniz. Böylece ders hakkınız yanmaz."
  },
  {
    question: "7. Kültürel içerikler müfredatın neresinde yer alıyor?",
    answer: "Kültür, müfredatımızın kalbinde! Sadece kelime öğretmiyoruz; Atatürk'ün hayatı, milli bayramlarımız, Türkiye'nin bölgeleri ve geleneklerimiz derslerimizin içine tematik olarak yedirilmiştir. Çocuğunuz dili öğrenirken kökleriyle bağ kurar."
  },
  {
    question: "8. Kaç ders sonra çocuğum bir üst seviyeye geçecek?",
    answer: "Her çocuğun öğrenme hızı, dile olan ilgisi ve hazırbulunuşluk düzeyi kendine özeldir. Bu nedenle sabit bir süre belirlemek yerine, çocuğunuzun gelişimini kişiye özel olarak takip ediyoruz. Öğretmenimiz her ders sonu gelişim raporu hazırlar ve çocuğunuz hedeflenen kazanımlara ulaştığında bir üst seviyeye geçişi planlanır. Amacımız sadece seviye atlamak değil, öğrenilenlerin kalıcı ve akıcı olmasını sağlamaktır."
  },
];

export default function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/40">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">❓ Sıkça Sorulan Sorular</h2>
          <p className="text-lg text-muted-foreground">
            Türk Çocuk Akademisi hakkında merak ettiğiniz her şey
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium text-left" suppressHydrationWarning>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
