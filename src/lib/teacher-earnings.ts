export type TeacherCourseKey =
  | 'baslangic'
  | 'konusma'
  | 'akademik'
  | 'gelisim'
  | 'gcse'
  | 'FREE_TRIAL'
  | 'OTHER';

export const TEACHER_COURSES: Array<{ key: TeacherCourseKey; label: string }> = [
  { key: 'konusma', label: 'Konuşma Kursu' },
  { key: 'akademik', label: 'Akademik Kurs' },
  { key: 'baslangic', label: 'Başlangıç Kursu' },
  { key: 'gelisim', label: 'Gelişim Kursu' },
  { key: 'gcse', label: 'GCSE Türkçe' },
  { key: 'FREE_TRIAL', label: 'Deneme Dersi' },
  { key: 'OTHER', label: 'Diğer' },
];

export function getTeacherCourseKey(code?: string): TeacherCourseKey {
  if (!code) return 'OTHER';
  if (code === 'FREE_TRIAL') return 'FREE_TRIAL';

  const prefix = code.replace(/[0-9]/g, '').toUpperCase();
  const courseMap: Record<string, TeacherCourseKey> = {
    B: 'baslangic',
    K: 'konusma',
    G: 'gelisim',
    A: 'akademik',
    GCSE: 'gcse',
  };

  return courseMap[prefix] || 'OTHER';
}

export function getTeacherCourseRate(
  teacher: { lessonRates?: Partial<Record<TeacherCourseKey, number>>; lessonRate?: number } | null | undefined,
  courseKey: TeacherCourseKey
) {
  return Number(teacher?.lessonRates?.[courseKey] ?? teacher?.lessonRate ?? 0);
}

function toDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function bookingToken(slot: any) {
  if (slot.bookingId) return String(slot.bookingId);
  if (slot.bookedAt?.seconds != null) {
    return `${slot.bookedAt.seconds}-${slot.bookedAt.nanoseconds || 0}`;
  }
  return 'no-booking-token';
}

export type CompletedTeacherSession = {
  id: string;
  status: 'booked' | 'completed';
  firstStartTime: Date;
  lastEndTime: Date;
  teacherId?: string;
  childId?: string;
  packageCode?: string;
  courseKey: TeacherCourseKey;
  slotIds: string[];
};

/** Combines the five-minute Firestore slots that belong to one booked lesson. */
export function buildCompletedTeacherSessions(rawSlots: any[] | null | undefined, now = new Date()) {
  if (!rawSlots) return [] as CompletedTeacherSession[];

  const slots = rawSlots
    .filter(slot => slot.status === 'booked' || slot.status === 'completed')
    .map(slot => ({
      ...slot,
      parsedStartTime: toDate(slot.startTime),
      parsedEndTime: toDate(slot.endTime),
    }))
    .filter(slot => slot.parsedStartTime)
    .sort((a, b) => a.parsedStartTime.getTime() - b.parsedStartTime.getTime());

  const sessions: Array<CompletedTeacherSession & { bookingToken: string }> = [];

  for (const slot of slots) {
    const startTime = slot.parsedStartTime as Date;
    const endTime = (slot.parsedEndTime as Date | null) || new Date(startTime.getTime() + 5 * 60 * 1000);
    const current = sessions[sessions.length - 1];
    const token = bookingToken(slot);
    const isConsecutive = current
      && current.teacherId === slot.teacherId
      && current.childId === slot.childId
      && current.packageCode === slot.packageCode
      && current.status === slot.status
      && current.bookingToken === token
      && Math.abs(startTime.getTime() - current.lastEndTime.getTime()) < 2000;

    if (isConsecutive) {
      current.lastEndTime = endTime;
      current.slotIds.push(slot.id);
      continue;
    }

    sessions.push({
      id: slot.id,
      status: slot.status,
      firstStartTime: startTime,
      lastEndTime: endTime,
      teacherId: slot.teacherId,
      childId: slot.childId,
      packageCode: slot.packageCode,
      courseKey: getTeacherCourseKey(slot.packageCode),
      slotIds: [slot.id],
      bookingToken: token,
    });
  }

  return sessions
    .filter(session => session.status === 'completed' || session.lastEndTime < now)
    .map(({ bookingToken: _bookingToken, ...session }) => session);
}
