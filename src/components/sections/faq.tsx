"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Ücretsiz deneme var mı?",
    answer: "Evet, kesinlikle! Platformumuza kaydolduktan sonra, çocuğunuz için bir adet ücretsiz deneme dersi planlayabilirsiniz. Bu derste hem öğretmenimizle tanışır hem de öğrenme metodolojimizi deneyimlemiş olursunuz."
  },
  {
    question: "Çocuk modu güvenli mi?",
    answer: "Evet, tamamen güvenlidir. Çocuk modu, COPPA (Çocukların Çevrimiçi Gizliliğini Koruma Yasası) standartlarına uygun olarak tasarlanmıştır. Reklam içermez ve çocuğunuzun sadece eğitim içeriğine odaklanmasını sağlar."
  },
  {
    question: "Canlı dersler nasıl işliyor?",
    answer: "Canlı dersler, uzman Türkçe öğretmenlerimiz tarafından Zoom üzerinden birebir veya küçük gruplar halinde yapılır. Dersler interaktif oyunlar, şarkılar ve aktivitelerle doludur. Ders programını ebeveyn panelinizden kolayca yönetebilirsiniz."
  },
  {
    question: "Ödemeler güvenli mi?",
    answer: "Evet, tüm ödemeler dünya standartlarında güvenliğe sahip Stripe ödeme altyapısı üzerinden işlenmektedir. Kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmaz."
  },
  {
    question: "İçerik seviyesi nasıl belirleniyor?",
    answer: "Ücretsiz deneme dersi sırasında öğretmenimiz, çocuğunuzun mevcut Türkçe seviyesini değerlendirir. Bu değerlendirme sonucunda, çocuğunuzun yaşına ve dil becerilerine en uygun seviyeden başlayarak kişiselleştirilmiş bir öğrenme yolculuğu oluşturulur."
  },
];

export default function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/40">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Sıkça Sorulan Sorular</h2>
          <p className="text-lg text-muted-foreground">
            Merak ettiklerinizin cevapları
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
