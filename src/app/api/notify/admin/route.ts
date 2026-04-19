import { NextResponse } from 'next/server';
import { notifyAdmin } from '@/lib/notifications';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getAdminLessonActionTemplate } from '@/lib/email-templates';

const ADMIN_EMAILS = [
  'iletisim@turkcocukakademisi.com',
  'tubakodak@turkcocukakademisii.com'
];

export async function POST(req: Request) {
  try {
    const { title, body, link, logData, sendEmail } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Başlık ve mesaj gereklidir.' }, { status: 400 });
    }

    // 1. Send FCM Push to specified admins
    const resultValue = await notifyAdmin(title, body, link);

    // 2. Conditionally send Email to admins
    if (sendEmail) {
        try {
            let html = `
              <div style="font-family: sans-serif; padding: 20px; color: #334155;">
                <h2 style="color: #0f172a;">${title}</h2>
                <p style="font-size: 16px;">${body}</p>
                ${link ? `<a href="https://turkcocukakademisi.com${link}" style="display: inline-block; padding: 12px 24px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Detayları Görüntüle</a>` : ''}
                <hr style="margin-top: 30px; border: 0; border-top: 1px solid #e2e8f0;" />
                <p style="font-size: 12px; color: #94a3b8;">Bu bir sistem bilgilendirmesidir.</p>
              </div>
            `;

            // If it's a lesson action with structured data, use the professional template
            if (logData?.details && (title.includes('Ders') || title.includes('Deneme'))) {
                const { studentName, teacherName, date, time, isTrial } = logData.details;
                const action = title.includes('Planlandı') ? 'Planlandı' : 
                               title.includes('İptal') ? 'İptal Edildi' : 
                               title.includes('Değiştirildi') ? 'Değiştirildi' : 'Planlandı';
                
                html = getAdminLessonActionTemplate({
                    action: action as any,
                    studentName: studentName || 'Öğrenci',
                    teacherName: teacherName || 'Öğretmen',
                    date: date || '',
                    time: time || '',
                    isTrial: isTrial || title.toLowerCase().includes('deneme')
                });
            }

            await resend.emails.send({
                from: `Türk Çocuk Akademisi Asistanı <${FROM_EMAIL}>`,
                to: ADMIN_EMAILS,
                subject: title,
                html: html
            });
        } catch (emailError) {
            console.error('Admin Email Notification Error:', emailError);
        }
    }

    // 3. Optionally log to the operational activity feed
    if (logData) {
        try {
            await db.collection('activity-log').add({
                icon: logData.icon || '🔔',
                event: logData.event || title,
                details: logData.details || {},
                createdAt: FieldValue.serverTimestamp()
            });
        } catch (e) {
            console.error('Activity Log Error:', e);
        }
    }

    return NextResponse.json(resultValue);
  } catch (error: any) {
    console.error('Notify Admin API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
