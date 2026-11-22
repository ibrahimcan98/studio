import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { auth, db } from '@/lib/firebase-admin';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getBaseTemplate } from '@/lib/email-templates';
import { homeworkNotificationContent } from '@/lib/homework-notification';

export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!token) return NextResponse.json({ error: 'Oturum gerekli.' }, { status: 401 });
  let uid: string;
  try { uid = (await auth.verifyIdToken(token)).uid; }
  catch { return NextResponse.json({ error: 'Geçersiz oturum.' }, { status: 401 }); }
  try {
    const actor = (await db.doc(`users/${uid}`).get()).data();
    if (!['admin', 'teacher'].includes(actor?.role)) return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 403 });
    const body = await request.json();
    const isGame = typeof body.homeworkId === 'string';
    const id = isGame ? body.homeworkId : body.lessonId;
    if (typeof id !== 'string' || !id || id.includes('/')) return NextResponse.json({ error: 'Geçersiz kayıt.' }, { status: 400 });
    const record = (await db.doc(`${isGame ? 'game-homeworks' : 'lesson-slots'}/${id}`).get()).data();
    if (!record) return NextResponse.json({ error: 'Kayıt bulunamadı.' }, { status: 404 });
    if (actor?.role !== 'admin' && record.teacherId !== uid) return NextResponse.json({ error: 'Bu ödeve erişiminiz yok.' }, { status: 403 });
    const attachment = !isGame && typeof body.homeworkUrl === 'string' ? record.homeworks?.find((hw: any) => hw.url === body.homeworkUrl) : null;
    if (!isGame && !attachment) return NextResponse.json({ error: 'Ödev bulunamadı.' }, { status: 404 });
    const parentId = isGame ? record.parentId : record.bookedBy;
    if (!parentId || !record.childId || [parentId, record.childId].some(value => typeof value !== 'string' || value.includes('/'))) return NextResponse.json({ error: 'Veli/öğrenci bilgisi eksik.' }, { status: 400 });
    const [parentSnapshot, childSnapshot] = await Promise.all([db.doc(`users/${parentId}`).get(), db.doc(`users/${parentId}/children/${record.childId}`).get()]);
    if (!parentSnapshot.exists || !childSnapshot.exists) return NextResponse.json({ error: 'Veli/öğrenci bulunamadı.' }, { status: 404 });
    const parent = parentSnapshot.data()!;
    const child = childSnapshot.data()!;
    const notificationId = createHash('sha256').update(isGame ? `game:${id}` : `lesson:${id}:${attachment.url}`).digest('hex');
    const notification = db.doc(`homework-notifications/${notificationId}`);
    if ((await notification.get()).data()?.sentAt) return NextResponse.json({ success: true, alreadySent: true });
    const title = String(isGame ? record.topicName : attachment.title || 'Ders ödevi');
    const studentName = [child.firstName, child.lastName].filter(Boolean).join(' ') || record.childName || 'Öğrenci';
    const content = homeworkNotificationContent({
      studentName,
      parentName: [parent.firstName, parent.lastName].filter(Boolean).join(' ') || parent.displayName || 'Velimiz',
      phone: typeof parent.phoneNumber === 'string' ? parent.phoneNumber : '',
      title, category: isGame ? record.category || 'Oyun ödevi' : 'Ders ödevi',
      teacherName: record.teacherName || [actor?.firstName, actor?.lastName].filter(Boolean).join(' ') || 'Yönetici',
      childId: record.childId, game: isGame,
    });
    const result = await resend.emails.send({ from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`, to: 'iletisim@turkcocukakademisi.com', subject: `Yeni Ödev — ${studentName} / ${title}`.replace(/[\r\n]/g, ' ').slice(0, 180), html: getBaseTemplate(content.html) }, { idempotencyKey: `homework-${notificationId}` });
    if (result.error) throw new Error('E-posta servisi bildirimi kabul etmedi.');
    await notification.set({ sentAt: FieldValue.serverTimestamp(), homeworkId: isGame ? id : null, lessonId: isGame ? null : id, emailId: result.data?.id || null });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Homework notification failed:', error);
    return NextResponse.json({ error: 'Ödev bildirimi gönderilemedi.' }, { status: 500 });
  }
}
