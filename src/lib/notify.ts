import { Resend } from 'resend';

const ADMIN_EMAILS = [
    'iletisim@turkcocukakademisi.com',
    'tubakodak@turkcocukakademisii.com'
];

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'iletisim@turkcocukakademisi.com';

export interface NotificationPayload {
    event: string;
    details: Record<string, string>;
}

export async function sendAdminNotification(payload: NotificationPayload) {
    const { event, details } = payload;

    const detailsHtml = Object.entries(details)
        .map(([k, v]) => `<tr><td style="padding:10px 15px;color:#64748b;font-weight:600;font-size:14px;border-bottom:1px solid #f1f5f9;">${k}</td><td style="padding:10px 15px;color:#0f172a;font-weight:700;font-size:15px;border-bottom:1px solid #f1f5f9;">${v}</td></tr>`)
        .join('');

    const html = `
    <div style="font-family:'Inter', sans-serif;max-width:550px;margin:0 auto;background:#f8fafc;padding:30px;">
      <div style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);padding:30px;text-align:center;">
          <h2 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:-0.5px;">🔔 ${event}</h2>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:13px;font-weight:600;">Türk Çocuk Akademisi • Sistem Bildirimi</p>
        </div>
        <div style="padding:30px;">
          <table style="width:100%;border-collapse:collapse;">
            ${detailsHtml}
          </table>
          <div style="margin-top:30px;text-align:center;">
            <a href="https://turkcocukakademisi.com/yonetici/dersler" style="display:inline-block;padding:14px 28px;background:#0ea5e9;color:#ffffff;text-decoration:none;border-radius:12px;font-weight:700;font-size:14px;">Paneli Görüntüle</a>
          </div>
        </div>
        <div style="padding:20px;background:#f8fafc;border-top:1px solid #f1f5f9;text-align:center;">
          <p style="margin:0;font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}</p>
        </div>
      </div>
    </div>`;

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: `Türk Çocuk Akademisi Asistanı <${FROM_EMAIL}>`,
            to: ADMIN_EMAILS,
            subject: `[Admin] ${event}`,
            html,
        });
    } catch (err) {
        console.error('[notify] Admin email notification error:', err);
    }
}
export async function sendUserPaymentReceipt(userEmail: string, data: { name: string, amount: string, packageInfo: string }) {
    const { name, amount, packageInfo } = data;

    const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
      <div style="background:#4f46e5;padding:40px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:28px;">Teşekkür Ederiz! 🎓</h1>
        <p style="color:#c7d2fe;margin:12px 0 0;font-size:16px;">Kaydınız başarıyla tamamlandı ve dersleriniz yüklendi.</p>
      </div>
      <div style="padding:32px 24px;">
        <p style="color:#374151;font-size:16px;line-height:1.5;">Merhaba ${name.split(' ')[0]},</p>
        <p style="color:#374151;font-size:16px;line-height:1.5;">Türk Çocuk Akademisi platformumuzdan yaptığınız satın alma işlemi başarıyla gerçekleşti. Detayları aşağıda bulabilirsiniz:</p>
        
        <div style="background:#f9fafb;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #f3f4f6;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px;">Satın Alınan Paket</td>
              <td style="padding:8px 0;color:#111827;font-size:16px;font-weight:700;text-align:right;">${packageInfo}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px;">Toplam Tutar</td>
              <td style="padding:8px 0;color:#111827;font-size:16px;font-weight:700;text-align:right;">${amount}</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;margin-top:32px;">
          <a href="https://turkcocukakademisi.com/ebeveyn-portali/paketlerim" style="background:#4f46e5;color:#fff;padding:16px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">Derslerimi Yönet</a>
        </div>
        
        <p style="color:#9ca3af;font-size:13px;margin-top:40px;text-align:center;">Herhangi bir sorunuz olursa lütfen bizimle iletişime geçin.</p>
      </div>
      <div style="padding:24px;background:#f3f4f6;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} Türk Çocuk Akademisi. Tüm hakları saklıdır.</p>
      </div>
    </div>`;

    try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'iletisim@turkcocukakademisi.com';
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: `Türk Çocuk Akademisi <${fromEmail}>`,
            to: userEmail,
            subject: 'Ödemeniz Başarıyla Alındı 🎓 - Türk Çocuk Akademisi',
            html,
        });
    } catch (err) {
        console.error('[notify] User receipt error:', err);
    }
}

export async function sendAdminEmail(subject: string, html: string) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: `Türk Çocuk Akademisi Asistanı <${FROM_EMAIL}>`,
            to: ADMIN_EMAILS,
            subject: subject,
            html,
        });
    } catch (err) {
        console.error('[notify] Admin professional email error:', err);
    }
}

