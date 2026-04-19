import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/server'; 
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
        const now = new Date();
        // Look for lessons starting in 10-15 minutes specifically
        const windowStart = new Date(now.getTime() + 8 * 60000); 
        const windowEnd = new Date(now.getTime() + 15 * 60000);

        console.log(`Checking for lessons between ${windowStart.toISOString()} and ${windowEnd.toISOString()}`);

        const lessonsRef = collection(db, 'lesson-slots');
        const q = query(
            lessonsRef,
            where('startTime', '>=', Timestamp.fromDate(windowStart)),
            where('startTime', '<=', Timestamp.fromDate(windowEnd)),
            where('status', '==', 'booked')
        );

        const querySnapshot = await getDocs(q);
        const remindersSent = [];

        for (const lessonDoc of querySnapshot.docs) {
            const lesson = lessonDoc.data();
            
            // Only send once per lesson
            if (lesson.pushReminderSent) continue;

            const lessonId = lessonDoc.id;
            const parentId = lesson.bookedBy;
            const childId = lesson.childId;
            const startTime = lesson.startTime.toDate();

            // Fetch Parent Info
            const parentDoc = await getDoc(doc(db, 'users', parentId));
            const parentData = parentDoc.data();
            const parentName = parentData?.firstName || 'Veli';

            // Fetch Child Info
            const childDoc = await getDoc(doc(db, 'users', parentId, 'children', childId));
            const childName = childDoc.data()?.firstName || 'Öğrenci';

            // Fetch Teacher Info for Meet Link
            const teacherDoc = await getDoc(doc(db, 'users', lesson.teacherId));
            const teacherData = teacherDoc.data();
            const teacherName = teacherData?.firstName || 'Öğretmen';
            const googleMeetLink = teacherData?.googleMeetLink;

            const formattedTime = formatInTimeZone(startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });

            // Send Push Notification to Parent
            await sendPushNotification(
                parentId,
                '⏰ Dersiniz Başlıyor!',
                `Merhaba ${parentName}, ${childName}'nin dersi 10 dakika içinde (${formattedTime}) başlayacaktır. İyi dersler! 🚀`,
                '/ebeveyn-portali/derslerim'
            );

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
                            meetingLink: googleMeetLink
                        })
                    });
                } catch (emailError) {
                    console.error('Reminder Email Error:', emailError);
                }
            }

            // Mark as sent
            await updateDoc(doc(db, 'lesson-slots', lessonId), {
                pushReminderSent: true,
                pushReminderSentAt: Timestamp.fromDate(new Date())
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
