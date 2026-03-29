const BASE_STYLE = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #1e293b;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const BUTTON_STYLE = `
  display: inline-block;
  padding: 12px 24px;
  background-color: #0ea5e9;
  color: #ffffff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: bold;
  margin: 20px 0;
`;

const LOGO_URL = "https://turkcocukakademisi.com/logo.png";

export const getBaseTemplate = (content: string) => `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="utf-8">
    <title>Türk Çocuk Akademisi</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc;">
    <div style="${BASE_STYLE}">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="${LOGO_URL}" alt="Türk Çocuk Akademisi" style="width: 80px; height: 80px;">
        <h1 style="color: #0f172a; margin-top: 10px; font-size: 24px;">Türk Çocuk Akademisi</h1>
      </div>
      <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        ${content}
      </div>
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Türk Çocuk Akademisi. Tüm hakları saklıdır.</p>
        <p>İletişim: iletisim@turkcocukakademisi.com</p>
      </div>
    </div>
  </body>
  </html>
`;

export const getVerificationTemplate = (link: string) => getBaseTemplate(`
  <h2 style="color: #0f172a;">Hoş Geldiniz!</h2>
  <p>Kaydınızı tamamlamak için lütfen e-posta adresinizi doğrulayın.</p>
  <div style="text-align: center;">
    <a href="${link}" style="${BUTTON_STYLE}">E-postayı Doğrula</a>
  </div>
  <p style="font-size: 14px; color: #64748b;">Eğer butona tıklayamıyorsanız, bu bağlantıyı tarayıcınıza yapıştırabilirsiniz: <br> ${link}</p>
`);

export const getPasswordResetTemplate = (link: string) => getBaseTemplate(`
  <h2 style="color: #0f172a;">Şifre Sıfırlama</h2>
  <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.</p>
  <div style="text-align: center;">
    <a href="${link}" style="${BUTTON_STYLE}">Şifremi Sıfırla</a>
  </div>
  <p>Bu talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayın.</p>
`);

export const getLessonPlannedTemplate = (data: { studentName: string; teacherName: string; date: string; time: string }) => getBaseTemplate(`
  <h2 style="color: #0f172a;">Yeni Dersiniz Planlandı</h2>
  <p>Merhaba,</p>
  <p><strong>${data.studentName}</strong> için yeni bir ders planlandı.</p>
  <div style="background-color: #f1f5f9; padding: 20px; border-radius: 16px; margin: 20px 0;">
    <p style="margin: 5px 0;"><strong>Eğitmen:</strong> ${data.teacherName}</p>
    <p style="margin: 5px 0;"><strong>Tarih:</strong> ${data.date}</p>
    <p style="margin: 5px 0;"><strong>Saat:</strong> ${data.time}</p>
  </div>
  <p>Ders saati geldiğinde öğrenci panelinden canlı derse katılabilirsiniz.</p>
`);

export const getLessonCancelledTemplate = (data: { studentName: string; teacherName: string; date: string; time: string }) => getBaseTemplate(`
  <h2 style="color: #ef4444;">Ders İptali Hakkında</h2>
  <p>Merhaba,</p>
  <p><strong>${data.studentName}</strong> için planlanan aşağıdaki ders iptal edilmiştir:</p>
  <div style="background-color: #fef2f2; padding: 20px; border-radius: 16px; margin: 20px 0; border: 1px solid #fee2e2;">
    <p style="margin: 5px 0;"><strong>Eğitmen:</strong> ${data.teacherName}</p>
    <p style="margin: 5px 0;"><strong>Tarih:</strong> ${data.date}</p>
    <p style="margin: 5px 0;"><strong>Saat:</strong> ${data.time}</p>
  </div>
  <p>Ders krediniz hesabınıza iade edilmiştir. Yeni bir ders planlamak için veli panelini kullanabilirsiniz.</p>
`);

export const getLessonRescheduledTemplate = (data: { studentName: string; teacherName: string; date: string; time: string }) => getBaseTemplate(`
  <h2 style="color: #0ea5e9;">Ders Saati Değiştirildi</h2>
  <p>Merhaba,</p>
  <p><strong>${data.studentName}</strong>'in ders saati güncellenmiştir.</p>
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 16px; margin: 20px 0; border: 1px solid #e0f2fe;">
    <p style="margin: 5px 0;"><strong>Eğitmen:</strong> ${data.teacherName}</p>
    <p style="margin: 5px 0;"><strong>Yeni Tarih:</strong> ${data.date}</p>
    <p style="margin: 5px 0;"><strong>Yeni Saat:</strong> ${data.time}</p>
  </div>
  <p>Ders saati geldiğinde öğrenci panelinden canlı derse katılabilirsiniz.</p>
`);

export const getFeedbackTemplate = (data: { studentName: string; teacherName: string }) => getBaseTemplate(`
  <h2 style="color: #0f172a;">Yeni Geri Bildirim!</h2>
  <p>Merhaba,</p>
  <p><strong>${data.teacherName}</strong>, <strong>${data.studentName}</strong>'in dersi hakkında yeni bir değerlendirme paylaştı.</p>
  <p>Detayları incelemek için veli panelindeki "İlerleme" sayfasını ziyaret edebilirsiniz.</p>
  <div style="text-align: center;">
    <a href="https://turkcocukakademisi.com/ebeveyn-portali" style="${BUTTON_STYLE}">Paneli Görüntüle</a>
  </div>
`);
