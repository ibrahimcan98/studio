import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { sendPushNotification } from '@/lib/notifications';
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getLessonReminderTemplate } from '@/lib/email-templates';

// Secret key to prevent unauthorized access to the cron route
const CRON_SECRET = process.env.CRON_SECRET || 'dev_secret_123';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Simple security check
    if (secret !== CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        if (!db) {
            return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
        }

        const now = new Date();
        // Look for lessons starting in 8-15 minutes specifically (10 min reminder window)
        const windowStart = new Date(now.getTime() + 8 * 60000); 
        const windowEnd = new Date(now.getTime() + 15 * 60000);

        console.log(`Checking for lessons between ${windowStart.toISOString()} and ${windowEnd.toISOString()}`);

        const lessonsRef = db.collection('lesson-slots');
        const querySnapshot = await lessonsRef
            .where('startTime', '>=', Timestamp.fromDate(windowStart))
            .where('startTime', '<=', Timestamp.fromDate(windowEnd))
            .get();

        const remindersSent = [];

        for (const lessonDoc of querySnapshot.docs) {
            const lesson = lessonDoc.data();
            
            // In-memory status filter (bypasses composite index requirement)
            if (lesson.status !== 'booked') continue;
            // Only send once per lesson
            if (lesson.pushReminderSent) continue;

            const lessonId = lessonDoc.id;
            const parentId = lesson.bookedBy;
            const childId = lesson.childId;
            const startTime = lesson.startTime?.toDate?.() || new Date(lesson.startTime);

            if (!parentId) continue;

            // Fetch Parent Info
            const parentDoc = await db.collection('users').doc(parentId).get();
            const parentData = parentDoc.data();
            const parentName = parentData?.firstName || 'Veli';

            // Fetch Child Info
            let childName = 'Öğrenci';
            if (childId) {
                const childDoc = await db.collection('users').doc(parentId).collection('children').doc(childId).get();
                if (childDoc.exists) {
                    childName = childDoc.data()?.firstName || 'Öğrenci';
                }
            }

            // Fetch Teacher Info for Meet Link
            let teacherName = 'Öğretmen';
            let googleMeetLink = '';
            if (lesson.teacherId) {
                const teacherDoc = await db.collection('users').doc(lesson.teacherId).get();
                if (teacherDoc.exists) {
                    const teacherData = teacherDoc.data();
                    teacherName = teacherData?.firstName || 'Öğretmen';
                    googleMeetLink = teacherData?.googleMeetLink || '';
                }
            }

            const formattedTime = formatInTimeZone(startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });

            // Send Push Notification to Parent
            await sendPushNotification(
                parentId,
                '⏰ Dersiniz Başlıyor!',
                `Merhaba ${parentName}, ${childName}'nin dersi 10 dakika içinde (${formattedTime}) başlayacaktır. İyi dersler! 🚀`,
                '/ebeveyn-portali/derslerim'
            ).catch(err => console.error('Push reminder error:', err));

            // Send Email Notification to Parent
            if (parentData?.email) {
                try {
                    await resend.emails.send({
                        from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`,
                        to: parentData.email,
                        subject: '⏰ Dersiniz Başlıyor!',
                        html: getLessonReminderTemplate({
                            studentName: childName,
                            teacherName: teacherName,
                            time: formattedTime,
                            meetingLink: googleMeetLink,
                            materials: lesson.materials || []
                        })
                    });
                } catch (emailError) {
                    console.error('Reminder Email Error:', emailError);
                }
            }

            // Mark as sent
            await lessonDoc.ref.update({
                pushReminderSent: true,
                pushReminderSentAt: FieldValue.serverTimestamp()
            });

            remindersSent.push({ lessonId, childName });
        }

        return NextResponse.json({ 
            success: true, 
            remindersSentCount: remindersSent.length,
            remindersSent 
        });

    } catch (error: any) {
        console.error('Error in reminders cron:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
