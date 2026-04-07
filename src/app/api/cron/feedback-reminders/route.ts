import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/server'; 
import { sendPushNotification } from '@/lib/notifications';

const CRON_SECRET = process.env.CRON_SECRET || 'dev_secret_123';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const now = new Date();
        // Lessons that started between 24 hours ago and 12 hours ago
        const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const windowEnd = new Date(now.getTime() - 12 * 60 * 60 * 1000);

        console.log(`Checking for missing feedback between ${windowStart.toISOString()} and ${windowEnd.toISOString()}`);

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
            
            // If feedback already exists or reminder already sent, skip
            if (lesson.feedback || lesson.feedbackReminderSent) continue;

            const lessonId = lessonDoc.id;
            const teacherId = lesson.teacherId;
            const childId = lesson.childId;
            const parentId = lesson.bookedBy;

            // Fetch Teacher Info
            const teacherDoc = await getDoc(doc(db, 'users', teacherId));
            const teacherData = teacherDoc.data();
            const teacherName = teacherData?.firstName || 'Öğretmenim';

            // Fetch Child Info
            const childDoc = await getDoc(doc(db, 'users', parentId, 'children', childId));
            const childName = childDoc.data()?.firstName || 'Öğrenci';

            // Send Push Notification to Teacher
            await sendPushNotification(
                teacherId,
                '📝 Geri Bildirim Hatırlatması',
                `Merhaba ${teacherName}, ${childName} ile yaptığınız dersin üzerinden 12 saat geçti. Lütfen gelişim raporunu tamamlamayı unutmayın.`,
                '/ogretmen-portali/derslerim'
            );

            // Mark as sent
            await updateDoc(doc(db, 'lesson-slots', lessonId), {
                feedbackReminderSent: true,
                feedbackReminderSentAt: Timestamp.fromDate(new Date())
            });

            remindersSent.push({ lessonId, teacherName, childName });
        }

        return NextResponse.json({ 
            success: true, 
            remindersSentCount: remindersSent.length,
            remindersSent 
        });

    } catch (error: any) {
        console.error('Error in feedback reminders cron:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
