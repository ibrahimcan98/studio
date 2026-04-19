import { Resend } from 'resend';
import { getPaymentReceiptTemplate } from './email-templates';

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
    const html = getPaymentReceiptTemplate({
        studentName: data.name,
        packageName: data.packageInfo,
        amount: data.amount
    });

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

