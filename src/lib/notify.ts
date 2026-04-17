import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ibrahimcanonder_98@hotmail.com';

export interface NotificationPayload {
    event: string;
    details: Record<string, string>;
}

export async function sendAdminNotification(payload: NotificationPayload) {
    const { event, details } = payload;

    const detailsHtml = Object.entries(details)
        .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#6b7280;font-weight:500;">${k}</td><td style="padding:6px 12px;color:#111827;">${v}</td></tr>`)
        .join('');

    const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:#4f46e5;padding:20px 24px;">
        <h2 style="color:#fff;margin:0;font-size:18px;">🔔 ${event}</h2>
        <p style="color:#c7d2fe;margin:4px 0 0;font-size:13px;">Türk Çocuk Akademisi • Admin Bildirimi</p>
      </div>
      <div style="padding:20px 24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${detailsHtml}
        </table>
      </div>
      <div style="padding:12px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:12px;color:#9ca3af;">${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}</p>
      </div>
    </div>`;

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: 'Türk Çocuk Akademisi <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: `[Admin] ${event}`,
            html,
        });
    } catch (err) {
        console.error('[notify] Email send error:', err);
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
