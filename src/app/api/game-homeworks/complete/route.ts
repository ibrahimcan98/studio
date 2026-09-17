import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { auth, db } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Oturum doğrulanamadı.' }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(authHeader.slice(7));
    const { childId, topicId } = await request.json();

    if (typeof childId !== 'string' || typeof topicId !== 'string' || !childId || !topicId) {
      return NextResponse.json({ error: 'Çocuk ve oyun bilgisi gereklidir.' }, { status: 400 });
    }

    // Çocuk yalnızca giriş yapan velinin kendi alt koleksiyonunda aranır.
    const childRef = db.doc(`users/${decodedToken.uid}/children/${childId}`);
    const childSnapshot = await childRef.get();
    if (!childSnapshot.exists) {
      return NextResponse.json({ error: 'Bu öğrenci için işlem yetkiniz yok.' }, { status: 403 });
    }

    const homeworkSnapshot = await db.collection('game-homeworks')
      .where('childId', '==', childId)
      .get();

    const matchingHomeworks = homeworkSnapshot.docs.filter((homework) => {
      const data = homework.data();
      return data.parentId === decodedToken.uid
        && data.topicId === topicId
        && data.status === 'assigned';
    });

    const batch = db.batch();
    const completedAt = FieldValue.serverTimestamp();
    matchingHomeworks.forEach((homework) => {
      batch.update(homework.ref, { status: 'completed', completedAt });
    });

    const childData = childSnapshot.data();
    const childUpdates: Record<string, FieldValue | null> = {
      activeHomeworkTopics: FieldValue.arrayRemove(topicId),
    };
    if (childData?.activeHomeworkTopic === topicId) {
      childUpdates.activeHomeworkTopic = null;
    }
    batch.update(childRef, childUpdates);
    await batch.commit();

    return NextResponse.json({ success: true, updated: matchingHomeworks.length });
  } catch (error) {
    console.error('Game homework completion error:', error);
    return NextResponse.json({ error: 'Ödev durumu güncellenemedi.' }, { status: 500 });
  }
}
