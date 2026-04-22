const BASE_STYLE = `
  font-family: 'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #1e293b;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const LOGO_URL = "https://turkcocukakademisi.com/logo.png";

/**
 * Bulletproof Button Helper for Email Clients (Outlook, Gmail, etc.)
 */
const getButtonHtml = (text: string, url: string, color = "#0ea5e9") => `
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;margin: 24px auto;">
    <tr>
      <td align="center" bgcolor="${color}" role="presentation" style="border:none;border-radius:12px;cursor:auto;background:${color};" valign="middle">
        <a href="${url}" style="display:inline-block;background:${color};color:#ffffff;font-family:inherit;font-size:16px;font-weight:700;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:14px 32px;border-radius:12px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>
`;

const generateGoogleCalendarUrl = (data: { studentName: string; teacherName: string; startTime?: string; courseName?: string; duration?: number }) => {
  if (!data.startTime) return null;
  const start = new Date(data.startTime);
  const durationInMinutes = data.duration || 45;
  const end = new Date(start.getTime() + durationInMinutes * 60 * 1000);

  const formatUTC = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const title = `Ders: ${data.studentName} - ${data.courseName || 'Akademik Ders'}`;
  const details = `Eğitmen: ${data.teacherName}\nSüre: ${durationInMinutes} Dakika\nPanel: https://turkcocukakademisi.com/ebeveyn-portali`;
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatUTC(start)}/${formatUTC(end)}&details=${encodeURIComponent(details)}`;
};

export const getBaseTemplate = (content: string) => `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Türk Çocuk Akademisi</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9;">
      <tr>
        <td align="center" style="padding: 40px 10px;">
          <div style="max-width: 600px; margin: 0 auto; text-align: left;">
            <!-- Header/Logo Area -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; padding: 15px; background: white; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 12px;">
                <img src="${LOGO_URL}" alt="Türk Çocuk Akademisi" style="width: 100px; height: auto; display: block;">
              </div>
              <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Türk Çocuk Akademisi</h1>
            </div>

            <!-- Main Content Card -->
            <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
              <div style="font-size: 16px; line-height: 1.6; color: #334155;">
                ${content}
              </div>
            </div>

            <!-- Footer Section -->
            <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
              <p style="margin: 5px 0; font-weight: 700; color: #64748b;">Türk Çocuk Akademisi</p>
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Tüm hakları saklıdır.</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0; display: inline-block; width: 100%;">
                 <p style="margin-top: 0;">
                   <a href="https://turkcocukakademisi.com/" style="color: #0ea5e9; text-decoration: none; font-weight: 700;">Web Sitemizi Ziyaret Edin</a>
                 </p>
                 <a href="mailto:iletisim@turkcocukakademisi.com" style="color: #94a3b8; text-decoration: none;">iletisim@turkcocukakademisi.com</a>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

export const getVerificationTemplate = (link: string) => getBaseTemplate(`
  <h2 style="color: #0f172a; font-size: 22px; margin-top: 0; text-align: center;">E-posta Doğrulaması</h2>
  <p style="text-align: center;">Hoş geldiniz! Akademiye giriş yapabilmek için lütfen e-posta adresinizi doğrulayın.</p>
  ${getButtonHtml('E-postayı Doğrula', link)}
  <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
    <p style="font-size: 12px; color: #94a3b8; margin: 0; text-align: center;">Buton çalışmıyorsa aşağıdaki bağlantıyı tarayıcınıza yapıştırın:</p>
    <p style="font-size: 11px; color: #0ea5e9; word-break: break-all; margin: 8px 0 0 0; text-align: center;">${link}</p>
  </div>
`);

export const getPasswordResetTemplate = (link: string) => getBaseTemplate(`
  <h2 style="color: #0f172a; font-size: 22px; margin-top: 0; text-align: center;">Şifre Sıfırlama</h2>
  <p style="text-align: center;">Hesabınız için bir şifre sıfırlama talebi aldık. Yeni şifrenizi belirlemek için aşağıdaki butona güvenle tıklayabilirsiniz.</p>
  ${getButtonHtml('Şifremi Sıfırla', link)}
  <p style="font-size: 14px; color: #64748b; margin-top: 25px; text-align: center;">Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
`);

export const getLessonPlannedTemplate = (data: { studentName: string; teacherName: string; date: string; time: string; courseName?: string; startTime?: string; role?: 'parent' | 'teacher'; duration?: number }) => {
  const calendarUrl = generateGoogleCalendarUrl(data);
  const isTeacher = data.role === 'teacher';
  const buttonText = isTeacher ? 'Öğretmen Paneline Git' : 'Veli Paneline Git';
  const buttonUrl = isTeacher ? 'https://turkcocukakademisi.com/ogretmen-portali' : 'https://turkcocukakademisi.com/ebeveyn-portali';

  return getBaseTemplate(`
    <h2 style="color: #0f172a; font-size: 22px; margin-top: 0;">Yeni Ders Planlandı</h2>
    <p>Merhaba, <strong>${data.studentName}</strong>'in akademik yolculuğu için yeni bir ders planlandı.</p>
    
    <div style="background-color: #f0f9ff; padding: 24px; border-radius: 20px; border: 1px solid #e0f2fe; margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 4px 0; color: #0369a1;"><strong>Ders Türü:</strong> ${data.courseName || '-'}</td></tr>
        <tr><td style="padding: 4px 0; color: #0369a1;"><strong>Öğrenci:</strong> ${data.studentName}</td></tr>
        <tr><td style="padding: 4px 0; color: #0369a1;"><strong>Ders Zamanı:</strong> ${data.date} ${data.time}</td></tr>
        <tr><td style="padding: 12px 0 0 0; color: #0369a1; font-size: 14px; border-top: 1px dashed #bae6fd; margin-top: 12px;"><strong>Eğitmen:</strong> ${data.teacherName}</td></tr>
      </table>
    </div>
    
    ${calendarUrl ? `
      <div style="text-align: center; margin-bottom: 10px;">
        <a href="${calendarUrl}" style="display: inline-block; padding: 12px 24px; background: #ffffff; color: #4285F4; text-decoration: none; border-radius: 12px; font-weight: 700; border: 2px solid #4285F4; font-size: 14px;">📅 Google Takvime Ekle</a>
      </div>
    ` : ''}

    <p style="font-size: 14px; color: #64748b; text-align: center;">Ders saati geldiğinde panelden canlı odaya katılabilirsiniz.</p>
    
    ${getButtonHtml(buttonText, buttonUrl)}
  `);
};

export const getLessonCancelledTemplate = (data: { studentName: string; teacherName: string; date: string; time: string; reason?: string; role?: 'parent' | 'teacher' }) => {
  const isTeacher = data.role === 'teacher';
  const buttonText = isTeacher ? 'Öğretmen Paneline Git' : 'Hemen Yeni Ders Planla';
  const buttonUrl = isTeacher ? 'https://turkcocukakademisi.com/ogretmen-portali' : 'https://turkcocukakademisi.com/ebeveyn-portali';

  return getBaseTemplate(`
    <h2 style="color: #ef4444; font-size: 22px; margin-top: 0;">Ders İptal Edildi</h2>
    <p>Merhaba, <strong>${data.studentName}</strong> için planlanan aşağıdaki ders iptal edilmiştir.</p>
    
    <div style="background-color: #fef2f2; padding: 24px; border-radius: 20px; border: 1px solid #fee2e2; margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 4px 0; color: #991b1b;"><strong>Eğitmen:</strong> ${data.teacherName}</td></tr>
        <tr><td style="padding: 4px 0; color: #991b1b;"><strong>Tarih:</strong> ${data.date}</td></tr>
        <tr><td style="padding: 4px 0; color: #991b1b;"><strong>Saat:</strong> ${data.time}</td></tr>
        ${data.reason ? `
        <tr><td style="padding: 12px 0 0 0; border-top: 1px dashed #fca5a5; margin-top: 12px;">
          <p style="margin: 0; color: #991b1b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Mazeret:</p>
          <p style="margin: 5px 0 0 0; color: #b91c1c; font-style: italic; font-size: 15px;">"${data.reason}"</p>
        </td></tr>
        ` : ''}
      </table>
    </div>

    <p style="font-size: 14px; color: #64748b; text-align: center;">${isTeacher ? 'İptal edilen saatleriniz takviminizde tekrar boşa çıkmıştır.' : 'İptal edilen ders krediniz hesabınıza iade edilmiştir.'}</p>
    
    ${getButtonHtml(buttonText, buttonUrl, isTeacher ? "#0ea5e9" : "#ef4444")}
  `);
};

export const getLessonRescheduledTemplate = (data: { studentName: string; teacherName: string; date: string; time: string; startTime?: string; role?: 'parent' | 'teacher'; duration?: number }) => {
  const calendarUrl = generateGoogleCalendarUrl(data);
  const isTeacher = data.role === 'teacher';
  const buttonText = isTeacher ? 'Öğretmen Paneline Git' : 'Veli Paneline Git';
  const buttonUrl = isTeacher ? 'https://turkcocukakademisi.com/ogretmen-portali' : 'https://turkcocukakademisi.com/ebeveyn-portali';

  return getBaseTemplate(`
    <h2 style="color: #0ea5e9; font-size: 22px; margin-top: 0;">Ders Saati Güncellendi</h2>
    <p>Merhaba, <strong>${data.studentName}</strong>'in ders saati güncellenmiştir.</p>
    <div style="background-color: #f0f9ff; padding: 24px; border-radius: 20px; border: 1px solid #e0f2fe; margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 4px 0; color: #0369a1;"><strong>Eğitmen:</strong> ${data.teacherName}</td></tr>
        <tr><td style="padding: 4px 0; color: #0369a1;"><strong>Yeni Tarih:</strong> ${data.date}</td></tr>
        <tr><td style="padding: 4px 0; color: #0369a1;"><strong>Yeni Saat:</strong> ${data.time}</td></tr>
      </table>
    </div>

    ${calendarUrl ? `
      <div style="text-align: center; margin-bottom: 10px;">
        <a href="${calendarUrl}" style="display: inline-block; padding: 12px 24px; background: #ffffff; color: #4285F4; text-decoration: none; border-radius: 12px; font-weight: 700; border: 2px solid #4285F4; font-size: 14px;">📅 Yeni Saati Takvime Ekle</a>
      </div>
    ` : ''}

    <p style="font-size: 14px; color: #64748b; text-align: center;">Yeni saatte görüşmek üzere!</p>

    ${getButtonHtml(buttonText, buttonUrl)}
  `);
};

export const getFeedbackTemplate = (data: { studentName: string; teacherName: string; role?: 'parent' | 'teacher' }) => {
  const isTeacher = data.role === 'teacher';
  const buttonUrl = isTeacher ? 'https://turkcocukakademisi.com/ogretmen-portali' : 'https://turkcocukakademisi.com/ebeveyn-portali';
  const buttonText = isTeacher ? 'Öğretmen Paneline Git' : 'Geri Bildirimi Gör';

  return getBaseTemplate(`
    <h2 style="color: #0f172a; font-size: 22px; margin-top: 0;">Yeni Geri Bildirim!</h2>
    <p>Sayın veli, <strong>${data.teacherName}</strong> bugün yapılan ders hakkında <strong>${data.studentName}</strong> için bir değerlendirme notu paylaştı.</p>
    <p>Öğrencimizin gelişimini takip etmek için hemen veli panelini ziyaret edebilirsiniz.</p>
    ${getButtonHtml(buttonText, buttonUrl)}
  `);
};

export const getLessonReminderTemplate = (data: { studentName: string; teacherName: string; time: string; meetingLink?: string }) => {
  return getBaseTemplate(`
    <h2 style="color: #0ea5e9; font-size: 22px; margin-top: 0; text-align: center;">⏰ Dersiniz Başlıyor!</h2>
    <p style="text-align: center;">Merhaba, <strong>${data.studentName}</strong>'in dersi 10 dakika içinde (<strong>${data.time}</strong>) başlayacaktır.</p>
    
    <div style="background-color: #f0f9ff; padding: 24px; border-radius: 20px; border: 1px solid #e0f2fe; margin: 24px 0; text-align: center;">
      <p style="color: #0369a1; font-weight: 700; margin-bottom: 15px;">Ders Bağlantısı (Google Meet):</p>
      ${data.meetingLink ? getButtonHtml('Derse Katıl', data.meetingLink, '#059669') : `
        <p style="color: #64748b; font-style: italic;">Bağlantı öğretmen tarafından henüz eklenmemiş. Lütfen panelden kontrol edin.</p>
      `}
    </div>

    <p style="font-size: 14px; color: #64748b; text-align: center;">İyi dersler dileriz! 🚀</p>
    
    <div style="text-align: center; margin-top: 25px;">
      <a href="https://turkcocukakademisi.com/ebeveyn-portali/derslerim" style="color: #0ea5e9; font-weight: 700; text-decoration: none;">Veli Paneline Git →</a>
    </div>
  `);
};

export const getFeedbackReminderTemplate = (data: { teacherName: string; studentName: string }) => {
  return getBaseTemplate(`
    <h2 style="color: #f59e0b; font-size: 22px; margin-top: 0; text-align: center;">📝 Rapor Hatırlatması</h2>
    <p style="text-align: center;">Merhaba ${data.teacherName}, <strong>${data.studentName}</strong> ile yaptığınız dersin üzerinden 24 saat geçti.</p>
    <p style="text-align: center;">Öğrencimizin gelişimi için lütfen geri bildirim raporunu tamamlayın.</p>
    
    ${getButtonHtml('Raporu Yaz', 'https://turkcocukakademisi.com/ogretmen-portali/derslerim', '#f59e0b')}
  `);
};

export const getAdminPurchaseTemplate = (data: { customerName: string; email: string; packageName: string; amount: string; currency: string }) => {
  return getBaseTemplate(`
    <h2 style="color: #059669; font-size: 22px; margin-top: 0;">💰 Yeni Satın Alım!</h2>
    <p>Sistemde yeni bir paket satışı gerçekleşti.</p>
    
    <div style="background-color: #f0fdf4; padding: 24px; border-radius: 20px; border: 1px solid #dcfce7; margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 4px 0; color: #166534;"><strong>Müşteri:</strong> ${data.customerName}</td></tr>
        <tr><td style="padding: 4px 0; color: #166534;"><strong>E-posta:</strong> ${data.email}</td></tr>
        <tr><td style="padding: 4px 0; color: #166534;"><strong>Paket:</strong> ${data.packageName}</td></tr>
        <tr><td style="padding: 12px 0 0 0; color: #166534; font-size: 18px; font-weight: 800; border-top: 1px dashed #bbf7d0; margin-top: 12px;">Tutar: ${data.amount} ${data.currency}</td></tr>
      </table>
    </div>
    
    ${getButtonHtml('Kullanıcıyı Görüntüle', 'https://turkcocukakademisi.com/yonetici/kullanicilar', '#059669')}
  `);
};

export const getAdminLessonActionTemplate = (data: { action: 'Planlandı' | 'İptal Edildi' | 'Değiştirildi'; studentName: string; teacherName: string; date: string; time: string; isTrial?: boolean }) => {
  const color = data.isTrial ? '#f43f5e' : '#0ea5e9';
  const label = data.isTrial ? '🚨 DENEME DERSİ' : '📅 Ders';

  return getBaseTemplate(`
    <h2 style="color: ${color}; font-size: 22px; margin-top: 0;">${label} ${data.action}</h2>
    <p>Aşağıdaki ders işlemi gerçekleştirildi:</p>
    
    <div style="background-color: #f8fafc; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 4px 0; color: #334155;"><strong>İşlem:</strong> ${data.action}</td></tr>
        <tr><td style="padding: 4px 0; color: #334155;"><strong>Öğrenci:</strong> ${data.studentName}</td></tr>
        <tr><td style="padding: 4px 0; color: #334155;"><strong>Eğitmen:</strong> ${data.teacherName}</td></tr>
        <tr><td style="padding: 4px 0; color: #334155;"><strong>Zaman:</strong> ${data.date} ${data.time}</td></tr>
      </table>
    </div>
    
    ${getButtonHtml('Derslere Git', 'https://turkcocukakademisi.com/yonetici/dersler', color)}
  `);
};

export const getPaymentReceiptTemplate = (data: { studentName: string; packageName: string; amount: string }) => {
  return getBaseTemplate(`
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #059669; font-size: 24px; margin: 0;">Ödemeniz Alındı! 🎓</h2>
      <p style="color: #64748b; margin-top: 5px;">Maceraya hoş geldiniz, dersleriniz başarıyla yüklendi.</p>
    </div>
    
    <p>Merhaba <strong>${data.studentName.split(' ')[0]}</strong>,</p>
    <p>Türk Çocuk Akademisi üzerinden yaptığınız satın alma işlemi başarıyla gerçekleşti. Paketiniz hesabınıza tanımlanmıştır.</p>
    
    <div style="background-color: #f0fdf4; padding: 24px; border-radius: 20px; border: 1px solid #dcfce7; margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 6px 0; color: #166534; font-size: 14px;">Satın Alınan</td><td style="text-align: right; color: #166534; font-weight: 700;">${data.packageName}</td></tr>
        <tr><td style="padding: 6px 0; color: #166534; font-size: 14px; border-top: 1px dashed #bbf7d0; padding-top: 12px; margin-top: 12px;">Toplam Tutar</td><td style="text-align: right; color: #166534; font-weight: 800; font-size: 18px; border-top: 1px dashed #bbf7d0; padding-top: 12px; margin-top: 12px;">${data.amount}</td></tr>
      </table>
    </div>
    
    <p style="text-align: center; font-size: 14px; color: #64748b;">Hemen derslerinizi planlamaya başlayabilirsiniz.</p>
    
    ${getButtonHtml('Ders Planla', 'https://turkcocukakademisi.com/ebeveyn-portali/ders-planla', '#059669')}
  `);
};


