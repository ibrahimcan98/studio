import { db } from '../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

async function run() {
    console.log("Deleting old backfilled logs...");
    const logsSnap = await db.collection('activity-log')
        .where('event', '==', '❌ Ders İptal Edildi (Öğretmen) [Geçmiş Kayıt]')
        .get();

    if (!logsSnap.empty) {
        const batch = db.batch();
        logsSnap.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log(`Deleted ${logsSnap.size} old backfill logs.`);
    }

    console.log("Querying lesson-slots for cancelled slots...");
    const slotsSnapshot = await db.collection('lesson-slots')
        .where('status', '==', 'cancelled')
        .get();

    if (slotsSnapshot.empty) {
        console.log("No cancelled slots found.");
        return;
    }

    // Group slots by parentId + childId + cancelReason + date(roughly)
    // To simplify, a lesson is usually consecutive slots.
    // Let's group by childId + teacherId + (rounded to nearest hour of startTime)
    const grouped = new Map<string, any>();

    for (const doc of slotsSnapshot.docs) {
        const data = doc.data();
        if (data.cancelledBy !== 'teacher') continue;

        const startTime = data.startTime.toDate();
        // create a key based on childId + teacherId + year-month-day-hour
        // Since a lesson is 45 mins, they will fall into the same or adjacent hours.
        // Actually, better: sort slots by time, and group them if they are within 45 mins.
        
        // Let's just group by childId + teacherId + date string (YYYY-MM-DD HH:00)
        // A lesson starting at 19:00 will be grouped together.
        const hourKey = `${startTime.getFullYear()}-${startTime.getMonth()}-${startTime.getDate()}-${startTime.getHours()}`;
        const key = `${data.childId}-${data.teacherId}-${hourKey}`;

        if (!grouped.has(key)) {
            grouped.set(key, {
                childId: data.childId,
                parentId: data.parentId,
                teacherId: data.teacherId,
                cancelReason: data.cancelReason,
                startTime: startTime,
                updatedAt: data.updatedAt
            });
        } else {
            const existing = grouped.get(key);
            // keep the earliest start time
            if (startTime < existing.startTime) {
                existing.startTime = startTime;
            }
        }
    }

    console.log(`Found ${grouped.size} unique cancelled lessons. Backfilling...`);

    let count = 0;
    const batch2 = db.batch();

    for (const [key, lesson] of grouped.entries()) {
        const teacherSnap = await db.collection('users').doc(lesson.teacherId).get();
        const teacherData = teacherSnap.exists ? teacherSnap.data() : null;
        const teacherFullName = (teacherData?.firstName && teacherData?.lastName) 
            ? `${teacherData.firstName} ${teacherData.lastName}` 
            : 'Eğitmen';

        // Fetch child name
        let childName = 'Bilinmiyor';
        if (lesson.parentId && lesson.childId) {
            const childSnap = await db.collection('users').doc(lesson.parentId).collection('children').doc(lesson.childId).get();
            if (childSnap.exists) {
                childName = childSnap.data()?.firstName || 'Bilinmiyor';
            }
        }

        const lessonTimeFormatted = lesson.startTime.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

        const activityRef = db.collection('activity-log').doc();
        batch2.set(activityRef, {
            event: '❌ Ders İptal Edildi (Öğretmen) [Geçmiş Kayıt]',
            icon: '👩‍🏫',
            details: {
                'İptal Eden': teacherFullName,
                'Öğrenci': childName,
                'Ders Saati': lessonTimeFormatted,
                'Mazeret': lesson.cancelReason || 'Belirtilmedi'
            },
            createdAt: lesson.updatedAt || FieldValue.serverTimestamp()
        });
        count++;
    }

    if (count > 0) {
        await batch2.commit();
        console.log(`Successfully backfilled ${count} teacher cancellation logs.`);
    }

}

run().catch(console.error);
