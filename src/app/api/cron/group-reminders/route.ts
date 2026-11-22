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
        // Look for group sessions starting in 8-15 minutes specifically
        const windowStart = new Date(now.getTime() + 8 * 60000); 
        const windowEnd = new Date(now.getTime() + 15 * 60000);

        console.log(`Checking for group sessions between ${windowStart.toISOString()} and ${windowEnd.toISOString()}`);

        const sessionsRef = db.collection('groupCourseSessions');
        const querySnapshot = await sessionsRef
            .where('startTime', '>=', Timestamp.fromDate(windowStart))
            .where('startTime', '<=', Timestamp.fromDate(windowEnd))
            .get();

        let totalRemindersSent = 0;

        for (const sessionDoc of querySnapshot.docs) {
            const session = sessionDoc.data();
            
            // In-memory status filter
            if (session.status !== 'scheduled') continue;
            // Only send once per session
            if (session.pushReminderSent) continue;

            const sessionId = sessionDoc.id;
            const packageId = session.packageId;
            const startTime = session.startTime?.toDate?.() || new Date(session.startTime);
            const formattedTime = formatInTimeZone(startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });

            // Fetch Package Info
            let packageName = 'Grup Dersi';
            let googleMeetLink = '';
            if (packageId) {
                const packageDoc = await db.collection('groupCoursePackages').doc(packageId).get();
                if (packageDoc.exists) {
                    const packageData = packageDoc.data();
                    packageName = packageData?.title || 'Grup Dersi';
                    googleMeetLink = packageData?.googleMeetLink || '';
                }
            }

            // Fetch Teacher Info
            let teacherName = 'Öğretmen';
            if (session.teacherId) {
                const teacherDoc = await db.collection('users').doc(session.teacherId).get();
                if (teacherDoc.exists) {
                    const teacherData = teacherDoc.data();
                    teacherName = teacherData?.firstName || 'Öğretmen';
                }
            }

            // Find all enrollments for this package
            const enrollmentsSnapshot = await db.collection('groupCourseEnrollments')
                .where('packageId', '==', packageId)
                .get();

            for (const enrDoc of enrollmentsSnapshot.docs) {
                const enr = enrDoc.data();
                const parentId = enr.parentId;
                const childId = enr.studentId;

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

                // Saat ve Saat Dilimi Formatlama
                const parentTimezone = parentData?.timezone || 'Europe/Istanbul';
                let sessionTime = formatInTimeZone(startTime, parentTimezone, 'HH:mm', { locale: tr });
                if (parentTimezone !== 'Europe/Istanbul') {
                    const istanbulTime = formatInTimeZone(startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });
                    sessionTime = `${sessionTime} (Yerel Saatiniz) / ${istanbulTime} (TSİ)`;
                }

                // Send Push Notification
                await sendPushNotification(
                    parentId,
                    '⏰ Grup Dersi Başlıyor!',
                    `Merhaba ${parentName}, ${childName}'nin ${packageName} dersi 10 dakika içinde (${sessionTime}) başlayacaktır. İyi dersler! 🚀`,
                    '/ebeveyn-portali/derslerim'
                ).catch(err => console.error('Push group reminder error:', err));

                // Send Email Notification
                if (parentData?.email) {
                    try {
                        await resend.emails.send({
                            from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`,
                            to: parentData.email,
                            subject: `⏰ ${packageName} Başlıyor!`,
                            html: getLessonReminderTemplate({
                                studentName: childName,
                                teacherName: teacherName,
                                time: sessionTime,
                                meetingLink: googleMeetLink
                            })
                        });
                    } catch (emailError) {
                        console.error('Group Reminder Email Error:', emailError);
                    }
                }
                totalRemindersSent++;
            }

            // Mark session as reminded
            await sessionDoc.ref.update({
                pushReminderSent: true,
                pushReminderSentAt: FieldValue.serverTimestamp()
            });
        }

        return NextResponse.json({ 
            success: true, 
            remindersSentCount: totalRemindersSent
        });

    } catch (error: any) {
        console.error('Error in group reminders cron:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
