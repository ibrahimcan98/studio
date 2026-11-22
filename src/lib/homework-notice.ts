import { hasActiveHomework } from './homework-navigation';

export type HomeworkNotice = { key: string; childId: string; childName: string; title: string; category: string; kind: 'game' | 'file' };

export function collectHomeworkNotices(homeworks: any[], children: any[], slots: any[] = []): HomeworkNotice[] {
  const notices = new Map<string, HomeworkNotice>();
  for (const homework of homeworks) {
    const child = children.find(item => item.id === homework.childId);
    if (!child || homework.status !== 'assigned' || !hasActiveHomework(child, homework.topicId)) continue;
    const key = `game:${homework.id}`;
    notices.set(key, { key, childId: child.id, childName: child.firstName || homework.childName || 'Öğrenci', title: homework.topicName || 'Yeni etkinlik', category: homework.category || 'Oyun ödevi', kind: 'game' });
  }
  for (const slot of slots) {
    const child = children.find(item => item.id === slot.childId);
    if (!child) continue;
    for (const homework of slot.homeworks || []) {
      if (!homework.url) continue;
      // All five-minute slots of a lesson carry the same uploaded file.
      const key = `file:${child.id}:${homework.fileName || homework.url}`;
      notices.set(key, { key, childId: child.id, childName: child.firstName || 'Öğrenci', title: homework.title || 'Ders ödevi', category: 'Ders dosyası', kind: 'file' });
    }
  }
  return [...notices.values()];
}

export function unseenHomeworkNotices(notices: HomeworkNotice[], seen: Iterable<string>) {
  const keys = new Set(seen);
  return notices.filter(notice => !keys.has(notice.key));
}
