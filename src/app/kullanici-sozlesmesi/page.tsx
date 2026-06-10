import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Kullanıcı Sözleşmesi | Pati AI',
  description: 'Pati AI platformu kullanıcı ve ebeveyn onay sözleşmesi.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        <Link href="/register" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kayıt Sayfasına Dön
        </Link>
        
        <h1 className="text-4xl font-black text-slate-800 mb-8">Kullanıcı Sözleşmesi ve Ebeveyn Onayı</h1>
        <div className="prose prose-purple max-w-none text-slate-600">
          <p className="text-lg font-medium mb-8">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Taraflar ve Sözleşmenin Konusu</h2>
          <p>
            Bu sözleşme, Pati AI ("Platform") hizmetlerini kullanan yasal veli ("Kullanıcı" veya "Veli") ile platform yönetimi arasında yapılmıştır. Sözleşmenin konusu, çocuğun platformu kullanımı sırasında uyulması gereken kurallar ve veri gizliliği onay koşullarının belirlenmesidir.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Yasal Veli Beyanı</h2>
          <p>
            Kullanıcı, bu sözleşmeyi onaylayarak platforma kayıt olan çocuğun yasal velisi veya vasisi olduğunu beyan eder. Platform, 18 yaş altı kullanıcıların doğrudan kendi başlarına hesap oluşturmasına izin vermez. Tüm sorumluluk yasal veliye aittir.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Veri İşleme Onayı (Açık Rıza)</h2>
          <p>
            Kullanıcı, platforma kayıt olarak çocuğunun yapay zeka ile gerçekleştirdiği metin tabanlı sohbet verilerinin, eğitim deneyiminin kişiselleştirilmesi amacıyla işlenmesine Açık Rıza gösterdiğini kabul eder. Detaylı bilgi için <Link href="/gizlilik-politikasi" className="text-purple-600 hover:underline">Gizlilik ve Çocuk Güvenliği Politikası</Link> belgesini okuduğunuzu onaylamış sayılırsınız.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">4. Platform Kullanım Kuralları</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Platformda sağlanan yapay zeka araçları yalnızca eğitim ve dil pratikleri amacıyla kullanılabilir.</li>
            <li>Hesap bilgileri, şifre ve oturum açma yetkileri üçüncü şahıslarla paylaşılamaz.</li>
            <li>Kullanıcı (Veli), çocuğun platform içindeki etkileşimlerini denetlemekle yükümlüdür.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">5. Sözleşmenin Feshi ve Veri İptali</h2>
          <p>
            Kullanıcı, dilediği zaman platform üzerinden çocuğuna ait profili ve tüm geçmiş verileri kalıcı olarak silme hakkına sahiptir. Hesap silindiğinde tüm kişisel veriler sistemden (veritabanı yedekleri dahil) anonimleştirilir veya tamamen imha edilir.
          </p>

        </div>
      </div>
    </div>
  );
}
