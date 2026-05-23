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
        // Look for group sessions starting in 10-15 minutes specifically
        const windowStart = new Date(now.getTime() + 8 * 60000); 
        const windowEnd = new Date(now.getTime() + 15 * 60000);

        console.log(`Checking for group sessions between ${windowStart.toISOString()} and ${windowEnd.toISOString()}`);

        const sessionsRef = collection(db, 'groupCourseSessions');
        const q = query(
            sessionsRef,
            where('startTime', '>=', Timestamp.fromDate(windowStart)),
            where('startTime', '<=', Timestamp.fromDate(windowEnd)),
            where('status', '==', 'scheduled')
        );

        const querySnapshot = await getDocs(q);
        let totalRemindersSent = 0;

        for (const sessionDoc of querySnapshot.docs) {
            const session = sessionDoc.data();
            
            // Only send once per session
            if (session.pushReminderSent) continue;

            const sessionId = sessionDoc.id;
            const packageId = session.packageId;
            const startTime = session.startTime.toDate();
            const formattedTime = formatInTimeZone(startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });

            // Fetch Package Info
            const packageDoc = await getDoc(doc(db, 'groupCoursePackages', packageId));
            const packageData = packageDoc.data();
            const packageName = packageData?.title || 'Grup Dersi';
            const googleMeetLink = packageData?.googleMeetLink;

            // Fetch Teacher Info
            const teacherDoc = await getDoc(doc(db, 'users', session.teacherId));
            const teacherData = teacherDoc.data();
            const teacherName = teacherData?.firstName || 'Öğretmen';

            // Find all enrollments for this package
            const enrollmentsRef = collection(db, 'groupCourseEnrollments');
            const enrollmentsQ = query(enrollmentsRef, where('packageId', '==', packageId));
            const enrollmentsSnapshot = await getDocs(enrollmentsQ);

            for (const enrDoc of enrollmentsSnapshot.docs) {
                const enr = enrDoc.data();
                const parentId = enr.parentId;
                const childId = enr.studentId;

                // Fetch Parent Info
                const parentDoc = await getDoc(doc(db, 'users', parentId));
                const parentData = parentDoc.data();
                const parentName = parentData?.firstName || 'Veli';

                // Fetch Child Info
                const childDoc = await getDoc(doc(db, 'users', parentId, 'children', childId));
                const childName = childDoc.data()?.firstName || 'Öğrenci';

                // Send Push Notification
                await sendPushNotification(
                    parentId,
                    '⏰ Grup Dersi Başlıyor!',
                    `Merhaba ${parentName}, ${childName}'nin ${packageName} dersi 10 dakika içinde (${formattedTime}) başlayacaktır. İyi dersler! 🚀`,
                    '/ebeveyn-portali/derslerim'
                );

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
                                time: formattedTime,
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
            await updateDoc(doc(db, 'groupCourseSessions', sessionId), {
                pushReminderSent: true,
                pushReminderSentAt: Timestamp.fromDate(new Date())
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
