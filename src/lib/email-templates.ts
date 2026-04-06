const BASE_STYLE = `
  font-family: 'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #1e293b;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const BUTTON_STYLE = `
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 14px;
  font-weight: 700;
  margin: 24px 0;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  text-align: center;
`;

const LOGO_URL = "https://turkcocukakademisii.com/logo.png";

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
  <body style="margin: 0; padding: 0; background-color: #f1f5f9;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <div style="${BASE_STYLE}">
            <!-- Header/Logo Area -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="display: inline-block; padding: 15px; background: white; border-radius: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); margin-bottom: 15px;">
                <img src="${LOGO_URL}" alt="Türk Çocuk Akademisi" style="width: 120px; height: auto; display: block;">
              </div>
              <h1 style="color: #0f172a; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Türk Çocuk Akademisi</h1>
            </div>

            <!-- Main Content Card -->
            <div style="background-color: #ffffff; padding: 48px; border-radius: 32px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08); border: 1px solid #f8fafc;">
              ${content}
            </div>

            <!-- Footer Section -->
            <div style="text-align: center; margin-top: 40px; color: #64748b; font-size: 13px;">
              <p style="margin: 5px 0; font-weight: 600;">Türk Çocuk Akademisi</p>
              <p style="margin: 5px 0; opacity: 0.8;">© ${new Date().getFullYear()} Tüm hakları saklıdır.</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0; display: inline-block; width: 100%;">
                 <p style="margin-top: 10px; font-weight: 700;">
                   <a href="https://turkcocukakademisi.com/" style="color: #0ea5e9; text-decoration: none; border-bottom: 2px solid #0ea5e9; padding-bottom: 2px;">Web Sitemizi Ziyaret Edin</a>
                 </p>
                 <a href="mailto:iletisim@turkcocukakademisi.com" style="color: #64748b; text-decoration: none; display: block; margin-top: 15px; font-size: 11px;">iletisim@turkcocukakademisi.com</a>
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
  <h2 style="color: #0f172a; font-size: 24px; margin-top: 0;">E-posta Doğrulaması</h2>
  <p style="font-size: 16px; color: #475569;">Akademiye giriş yapmak için e-posta adresinizi doğrulamanız gerekmektedir. Kaydınızı tamamlamak için aşağıdaki butona tıklayın.</p>
  <div style="text-align: center;">
    <a href="${link}" style="${BUTTON_STYLE}">E-postayı Doğrula</a>
  </div>
  <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 16px;">
    <p style="font-size: 12px; color: #94a3b8; margin: 0;">Buton çalışmıyorsa aşağıdaki bağlantıyı kopyalayıp tarayıcınıza yapıştırın:</p>
    <p style="font-size: 11px; color: #0ea5e9; word-break: break-all; margin: 8px 0 0 0;">${link}</p>
  </div>
`);

export const getPasswordResetTemplate = (link: string) => getBaseTemplate(`
  <h2 style="color: #0f172a; font-size: 24px; margin-top: 0;">Şifre Sıfırlama</h2>
  <p style="font-size: 16px; color: #475569;">Hesabınız için bir şifre sıfırlama talebi aldık. Yeni şifrenizi belirlemek için aşağıdaki butona güvenle tıklayabilirsiniz.</p>
  <div style="text-align: center;">
    <a href="${link}" style="${BUTTON_STYLE}">Şifremi Sıfırla</a>
  </div>
  <p style="font-size: 14px; color: #64748b; margin-top: 25px;">Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın. Hesabınız güvendedir.</p>
`);

export const getLessonPlannedTemplate = (data: { studentName: string; teacherName: string; date: string; time: string; courseName?: string; startTime?: string; role?: 'parent' | 'teacher'; duration?: number }) => {
  const calendarUrl = generateGoogleCalendarUrl(data);
  const isTeacher = data.role === 'teacher';
  const buttonText = isTeacher ? 'Öğretmen Paneline Git' : 'Veli Paneline Git';
  const buttonUrl = isTeacher ? 'https://turkcocukakademisi.com/ogretmen-portali' : 'https://turkcocukakademisi.com/ebeveyn-portali';

  return getBaseTemplate(`
    <h2 style="color: #0f172a; font-size: 24px; margin-top: 0;">Yeni Ders Planlandı</h2>
    <p style="font-size: 16px; color: #475569;">Merhaba, <strong>${data.studentName}</strong>'in akademik yolculuğu için yeni bir ders planlandı.</p>
    
    <div style="background-color: #f0f9ff; padding: 24px; border-radius: 20px; border: 1px solid #e0f2fe; margin: 24px 0;">
      ${data.courseName ? `<p style="margin: 8px 0; color: #0369a1;"><strong>Kurs:</strong> ${data.courseName}</p>` : ''}
      <p style="margin: 8px 0; color: #0369a1;"><strong>Eğitmen:</strong> ${data.teacherName}</p>
      <p style="margin: 8px 0; color: #0369a1;"><strong>Tarih:</strong> ${data.date}</p>
      <p style="margin: 8px 0; color: #0369a1;"><strong>Saat:</strong> ${data.time}</p>
    </div>
    
    ${calendarUrl ? `
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${calendarUrl}" style="display: inline-block; padding: 10px 20px; background: #ffffff; color: #4285F4; text-decoration: none; border-radius: 10px; font-weight: 700; border: 2px solid #4285F4; font-size: 14px;">📅 Google Takvime Ekle</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #64748b;">Ders saati geldiğinde panele girerek canlı ders odasına katılabilirsiniz.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${buttonUrl}" style="${BUTTON_STYLE}">${buttonText}</a>
    </div>
  `);
};

export const getLessonCancelledTemplate = (data: { studentName: string; teacherName: string; date: string; time: string; reason?: string; role?: 'parent' | 'teacher' }) => {
  const isTeacher = data.role === 'teacher';
  const buttonText = isTeacher ? 'Öğretmen Paneline Git' : 'Hemen Yeni Ders Planla';
  const buttonUrl = isTeacher ? 'https://turkcocukakademisi.com/ogretmen-portali' : 'https://turkcocukakademisi.com/ebeveyn-portali';

  return getBaseTemplate(`
  <h2 style="color: #ef4444; font-size: 24px; margin-top: 0;">Ders İptal Edildi</h2>
  <p style="font-size: 16px; color: #475569;">Merhaba, <strong>${data.studentName}</strong> için planlanan aşağıdaki ders iptal edilmiştir.</p>
  
  <div style="background-color: #fef2f2; padding: 24px; border-radius: 20px; border: 1px solid #fee2e2; margin: 24px 0;">
    <p style="margin: 8px 0; color: #991b1b;"><strong>Eğitmen:</strong> ${data.teacherName}</p>
    <p style="margin: 8px 0; color: #991b1b;"><strong>Tarih:</strong> ${data.date}</p>
    <p style="margin: 8px 0; color: #991b1b;"><strong>Saat:</strong> ${data.time}</p>
    ${data.reason ? `
    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #fca5a5;">
      <p style="margin: 0; color: #991b1b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Mazeret:</p>
      <p style="margin: 5px 0 0 0; color: #b91c1c; font-style: italic; font-size: 15px;">"${data.reason}"</p>
    </div>
    ` : ''}
  </div>

  <p style="font-size: 14px; color: #64748b;">${isTeacher ? 'İptal edilen saatleriniz takviminizde tekrar boşa çıkmıştır.' : 'İptal edilen ders krediniz hesabınıza iade edilmiştir. Veli panelinden tekrar planlama yapabilirsiniz.'}</p>
  
  <div style="text-align: center; margin-top: 30px;">
    <a href="${buttonUrl}" style="${BUTTON_STYLE}">${buttonText}</a>
  </div>
`);
};

export const getLessonRescheduledTemplate = (data: { studentName: string; teacherName: string; date: string; time: string; startTime?: string; role?: 'parent' | 'teacher'; duration?: number }) => {
  const calendarUrl = generateGoogleCalendarUrl(data);
  const isTeacher = data.role === 'teacher';
  const buttonText = isTeacher ? 'Öğretmen Paneline Git' : 'Veli Paneline Git';
  const buttonUrl = isTeacher ? 'https://turkcocukakademisi.com/ogretmen-portali' : 'https://turkcocukakademisi.com/ebeveyn-portali';

  return getBaseTemplate(`
    <h2 style="color: #0ea5e9; font-size: 24px; margin-top: 0;">Ders Saati Güncellendi</h2>
    <p style="font-size: 16px; color: #475569;">Merhaba, <strong>${data.studentName}</strong>'in ders saati güncellenmiştir.</p>
    <div style="background-color: #f0f9ff; padding: 24px; border-radius: 20px; border: 1px solid #e0f2fe; margin: 24px 0;">
      <p style="margin: 8px 0; color: #0369a1;"><strong>Eğitmen:</strong> ${data.teacherName}</p>
      <p style="margin: 8px 0; color: #0369a1;"><strong>Yeni Tarih:</strong> ${data.date}</p>
      <p style="margin: 8px 0; color: #0369a1;"><strong>Yeni Saat:</strong> ${data.time}</p>
    </div>

    ${calendarUrl ? `
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${calendarUrl}" style="display: inline-block; padding: 10px 20px; background: #ffffff; color: #4285F4; text-decoration: none; border-radius: 10px; font-weight: 700; border: 2px solid #4285F4; font-size: 14px;">📅 Yeni Saati Takvime Ekle</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #64748b;">Yeni saatte görüşmek üzere!</p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${buttonUrl}" style="${BUTTON_STYLE}">${buttonText}</a>
    </div>
  `);
};

export const getFeedbackTemplate = (data: { studentName: string; teacherName: string; role?: 'parent' | 'teacher' }) => {
  const isTeacher = data.role === 'teacher';
  const buttonUrl = isTeacher ? 'https://turkcocukakademisi.com/ogretmen-portali' : 'https://turkcocukakademisi.com/ebeveyn-portali';
  const buttonText = isTeacher ? 'Öğretmen Paneline Git' : 'Panele Git';

  return getBaseTemplate(`
  <h2 style="color: #0f172a; font-size: 24px; margin-top: 0;">Yeni Geri Bildirim!</h2>
  <p style="font-size: 16px; color: #475569;">Sayın veli, <strong>${data.teacherName}</strong> bugün yapılan ders hakkında <strong>${data.studentName}</strong> için bir değerlendirme notu paylaştı.</p>
  <p style="font-size: 16px; color: #475569;">Öğrencimizin gelişimini takip etmek için hemen veli panelini ziyaret edebilirsiniz.</p>
  <div style="text-align: center;">
    <a href="${buttonUrl}" style="${BUTTON_STYLE}">${buttonText}</a>
  </div>
`);
};

