import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
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
