import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { 
      slots, 
      parentId, 
      childId, 
      packageCode, 
      teacherId, 
      cancelReason, 
      studentName, 
      startTime,
      parentEmail
    } = await req.json();

    if (!slots || !parentId || !childId || !teacherId) {
      return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 });
    }

    const batch = db.batch();

    // 1. Mark slots as cancelled
    slots.forEach((slot: any) => {
      const slotRef = db.collection('lesson-slots').doc(slot.id);
      batch.update(slotRef, {
        status: 'cancelled',
        cancelledBy: 'teacher',
        cancelReason: cancelReason,
        parentSeenCancellation: false,
        updatedAt: FieldValue.serverTimestamp()
      });
    });

    // 2. Refund logic
    const childRef = db.collection('users').doc(parentId).collection('children').doc(childId);
    const parentRef = db.collection('users').doc(parentId);

    const childSnap = await childRef.get();
    const childData = childSnap.data();
    const currentChildLessons = childData?.remainingLessons || 0;
    let refundTarget = 'child';

    const getRefundPackageCode = (originalCode: string) => {
        if (originalCode === 'FREE_TRIAL') return 'FREE_TRIAL';
        const prefix = originalCode.replace(/[0-9]/g, '');
        return `${prefix}1`;
    };

    if (packageCode === 'FREE_TRIAL') {
      batch.update(parentRef, { freeTrialsUsed: FieldValue.increment(-1) });
      batch.update(childRef, { hasUsedFreeTrial: false });
      refundTarget = 'free_trial';
    } else if (currentChildLessons > 0) {
      batch.update(childRef, { remainingLessons: FieldValue.increment(1) });
    } else {
      const refundCode = getRefundPackageCode(packageCode);
      batch.update(parentRef, {
        enrolledPackages: FieldValue.arrayUnion(refundCode),
        remainingLessons: FieldValue.increment(1)
      });
      refundTarget = 'parent_pool';
    }

    await batch.commit();

    // 3. Activity Log & Teacher Data
    const teacherSnap = await db.collection('users').doc(teacherId).get();
    const teacherData = teacherSnap.exists ? teacherSnap.data() : null;
    const teacherFullName = (teacherData?.firstName && teacherData?.lastName) 
        ? `${teacherData.firstName} ${teacherData.lastName}` 
        : 'Eğitmen';

    await db.collection('activity-log').add({
      event: '❌ Ders İptal Edildi (Öğretmen)',
      icon: '❌',
      details: {
        'Öğrenci': studentName,
        'Eğitmen': teacherFullName,
        'Mazeret': cancelReason,
        'Ders Saati': startTime || '-'
      },
      createdAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ 
        success: true, 
        refundTarget,
        teacherFullName 
    });
  } catch (error: any) {
    console.error('Teacher cancel API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
