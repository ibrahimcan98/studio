import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/server'; 
import { sendWhatsAppMessage } from '@/lib/twilio';
import { formatInTimeZone } from 'date-fns-tz';
import { tr } from 'date-fns/locale';

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
        const windowStart = new Date(now.getTime() + 5 * 60000); // 5 mins from now
        const windowEnd = new Date(now.getTime() + 15 * 60000);  // 15 mins from now

        console.log(`Checking for lessons between ${windowStart.toISOString()} and ${windowEnd.toISOString()}`);

        const lessonsRef = collection(db, 'lesson-slots');
        const q = query(
            lessonsRef,
            where('status', '==', 'booked'),
            where('startTime', '>=', Timestamp.fromDate(windowStart)),
            where('startTime', '<=', Timestamp.fromDate(windowEnd))
        );

        const querySnapshot = await getDocs(q);
        const remindersSent = [];

        for (const lessonDoc of querySnapshot.docs) {
            const lesson = lessonDoc.data();
            
            // Skip if reminder already sent
            if (lesson.whatsappReminderSent) continue;

            const lessonId = lessonDoc.id;
            const teacherId = lesson.teacherId;
            const parentId = lesson.bookedBy;
            const childId = lesson.childId;
            const startTime = lesson.startTime.toDate();

            // Fetch Teacher Info
            const teacherDoc = await getDoc(doc(db, 'users', teacherId));
            const teacherData = teacherDoc.data();
            const teacherPhone = teacherData?.phoneNumber;
            const teacherName = teacherData?.displayName || 'Öğretmen';

            // Fetch Parent Info
            const parentDoc = await getDoc(doc(db, 'users', parentId));
            const parentData = parentDoc.data();
            const parentPhone = parentData?.phoneNumber;
            const parentName = parentData?.firstName || 'Veli';

            // Fetch Child Info
            const childDoc = await getDoc(doc(db, 'users', parentId, 'children', childId));
            const childName = childDoc.data()?.firstName || 'Öğrenci';

            const formattedTime = formatInTimeZone(startTime, 'Europe/Istanbul', 'HH:mm', { locale: tr });

            // 1. Send to Teacher
            if (teacherPhone) {
                const teacherMsg = `Merhaba ${teacherName}, ${childName} ile olan dersiniz saat ${formattedTime}'de başlayacaktır. İyi dersler dileriz! 🎓`;
                await sendWhatsAppMessage(teacherPhone, teacherMsg);
            }

            // 2. Send to Parent
            if (parentPhone) {
                const parentMsg = `Merhaba ${parentName}, ${childName}'nin Türk Çocuk Akademisi dersi saat ${formattedTime}'de başlayacaktır. Lütfen öğrencinin hazır olduğundan emin olun. İyi dersler! 📚`;
                await sendWhatsAppMessage(parentPhone, parentMsg);
            }

            // Mark as sent
            await updateDoc(doc(db, 'lesson-slots', lessonId), {
                whatsappReminderSent: true,
                whatsappReminderSentAt: Timestamp.fromDate(new Date())
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
