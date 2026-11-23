import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { sendPushNotification } from '@/lib/notifications';
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getLessonReminderTemplate } from '@/lib/email-templates';
import { groupReminderSessions, lessonReminderIdentity } from '@/lib/lesson-reminders';
import { deliverReminderOnce } from '@/lib/reminder-delivery';

const CRON_SECRET = process.env.CRON_SECRET || 'dev_secret_123';

export async function GET(request: Request) {
    if (new URL(request.url).searchParams.get('secret') !== CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const now = new Date();
        const windowStart = new Date(now.getTime() + 8 * 60000);
        const windowEnd = new Date(now.getTime() + 15 * 60000);
        // Read a bounded range with a single-field index. Include surrounding slots so a
        // continuation in the reminder window is never mistaken for a lesson start.
        const snapshot = await db.collection('lesson-slots')
            .where('startTime', '>=', Timestamp.fromDate(new Date(windowStart.getTime() - 120 * 60000)))
            .where('startTime', '<=', Timestamp.fromDate(new Date(windowEnd.getTime() + 120 * 60000)))
            .get();
        const sessions = groupReminderSessions(snapshot.docs.map(slot => ({ ...slot.data(), id: slot.id })))
            .filter(session => session.startDate >= windowStart && session.startDate <= windowEnd && !session.pushReminderSent);
        const remindersSent = [];
        const failed = [];
        for (const lesson of sessions) {
            try {
                const parent = (await db.collection('users').doc(lesson.bookedBy).get()).data();
                if (!parent) continue;
                const child = (await db.collection('users').doc(lesson.bookedBy).collection('children').doc(lesson.childId).get()).data();
                const teacher = (await db.collection('users').doc(lesson.teacherId).get()).data();
                const childName = child?.firstName || 'Öğrenci';
                const parentTimezone = parent.timezone || 'Europe/Istanbul';
                let formattedTime = formatInTimeZone(lesson.startDate, parentTimezone, 'HH:mm', { locale: tr });
                if (parentTimezone !== 'Europe/Istanbul') {
                    formattedTime += ` (Yerel Saatiniz) / ${formatInTimeZone(lesson.startDate, 'Europe/Istanbul', 'HH:mm', { locale: tr })} (TSİ)`;
                }
                const identity = lessonReminderIdentity(lesson);
                const emailState = parent.email ? await deliverReminderOnce(db, identity, 'email', async idempotencyKey => {
                    const result = await resend.emails.send({
                        from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`,
                        to: parent.email,
                        subject: '⏰ Dersiniz Başlıyor!',
                        html: getLessonReminderTemplate({ studentName: childName, teacherName: teacher?.firstName || 'Öğretmen', time: formattedTime, meetingLink: teacher?.googleMeetLink || '', materials: lesson.materials || [] }),
                    }, { idempotencyKey });
                    if (result.error || !result.data?.id) throw new Error('Hatırlatma e-postası gönderilemedi.');
                    return result.data.id;
                }) : 'already-sent';
                const pushState = await deliverReminderOnce(db, identity, 'push', async () => {
                    const result = await sendPushNotification(lesson.bookedBy, '⏰ Dersiniz Başlıyor!',
                        `Merhaba ${parent.firstName || 'Veli'}, ${childName}'nin dersi 10 dakika içinde (${formattedTime}) başlayacaktır. İyi dersler! 🚀`, '/ebeveyn-portali/dersler');
                    if (!result.success && result.error !== 'No tokens found') throw new Error('Push hatırlatması gönderilemedi.');
                });
                if (emailState === 'busy' || pushState === 'busy') continue;
                // Best-effort legacy flags. Delivery receipts above prevent duplicates even
                // if this write fails; there is no post-send composite-index query anymore.
                try {
                    const batch = db.batch();
                    for (const id of lesson.slotIds) batch.update(db.collection('lesson-slots').doc(id), { pushReminderSent: true, pushReminderSentAt: FieldValue.serverTimestamp() });
                    await batch.commit();
                } catch (error) { console.error('Reminder slot flags could not be updated:', error); }
                if (emailState === 'sent' || pushState === 'sent') remindersSent.push({ lessonId: lesson.id, childName, time: formattedTime });
            } catch (error) {
                console.error('Lesson reminder failed:', error);
                failed.push(lesson.id);
            }
        }
        return NextResponse.json({ success: failed.length === 0, remindersSentCount: remindersSent.length, remindersSent, failed }, { status: failed.length ? 500 : 200 });
    } catch (error) {
        console.error('Error in reminders cron:', error);
        return NextResponse.json({ error: 'Hatırlatmalar işlenemedi.' }, { status: 500 });
    }
}
