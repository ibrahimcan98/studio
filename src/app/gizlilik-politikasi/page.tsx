import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Gizlilik ve Çocuk Güvenliği Politikası | Pati AI',
  description: 'Pati AI platformunun veri işleme, gizlilik ve çocuk güvenliği politikaları.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        <Link href="/register" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kayıt Sayfasına Dön
        </Link>
        
        <h1 className="text-4xl font-black text-slate-800 mb-8">Gizlilik ve Çocuk Güvenliği Politikası</h1>
        <div className="prose prose-purple max-w-none text-slate-600">
          <p className="text-lg font-medium mb-8">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Ebeveyn Açık Rızası (Parental Consent)</h2>
          <p>
            Pati AI platformu, yalnızca yasal velinin hesabı açması ve açık rıza vermesiyle kullanılabilir. Çocuklar platforma kendi başlarına kayıt olamazlar. Veli, platform üzerinden çocuğuna ait profili ve tüm geçmiş verileri dilediği zaman tamamen silme hakkına sahiptir.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Veri Toplama ve İşleme (Data Collection)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Ses Verileri (Sıfır Kayıt Politikası):</strong> Çocuğun sesi, tarayıcının yerleşik teknolojisi (Web Speech API) ile doğrudan kullanıcının cihazında metne çevrilir. Sunucularımıza hiçbir ses kaydı (audio file) yüklenmez, depolanmaz ve işlenmez.</li>
            <li><strong>Kişisel Veriler:</strong> Sadece velinin sağladığı minimum bilgiler (isim, yaş) ve yapay zeka ile yapılan metin tabanlı sohbetler, eğitimin kişiselleştirilmesi amacıyla işlenir.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Yapay Zeka ve 3. Parti Paylaşımı</h2>
          <p>
            Pati AI, güvenli altyapılar (Örn: OpenAI API) kullanır. API üzerinden gönderilen anonimleştirilmiş metin verileri, söz konusu AI sağlayıcılarının <strong>kendi modellerini eğitmek için kesinlikle kullanılmaz.</strong> Kullanıcı ve çocuk verileri, reklamverenlerle veya yetkisiz üçüncü şahıslarla asla paylaşılmaz ve satılamaz.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">4. Çocuk Güvenliği Politikası</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Güvenli Çerçeve:</strong> Sistemdeki yapay zeka karakterleri, küfür, şiddet, nefret söylemi veya yaşa uygun olmayan herhangi bir içeriği engelleyen özel güvenlik komutlarıyla (System Prompts) donatılmıştır.</li>
            <li><strong>Kapalı Ekosistem (Walled Garden):</strong> Yapay zeka sistemi çocuklara harici web sitelerinin bağlantılarını (link) veremez ve çocukları platform dışına yönlendiremez.</li>
            <li><strong>Kişisel Veri Uyarısı:</strong> Yapay zeka, çocuklardan hiçbir zaman adres, telefon numarası veya okul adı gibi kişisel verileri paylaşmalarını talep etmez.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">5. İletişim</h2>
          <p>
            Veri gizliliği, güvenlik politikaları veya çocuğunuzun verileri hakkında sorularınız için bizimle her zaman iletişime geçebilirsiniz:<br/>
            <strong>E-posta:</strong> iletisim@turkcocukakademisi.com
          </p>
        </div>
      </div>
    </div>
  );
}
