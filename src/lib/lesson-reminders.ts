const FIVE_MINUTES = 5 * 60 * 1000;

function dateOf(value: any): Date | null {
  const date = value?.toDate ? value.toDate() : new Date(value ?? NaN);
  return Number.isFinite(date.getTime()) ? date : null;
}

export type ReminderSession = {
  id: string;
  slotIds: string[];
  startDate: Date;
  endDate: Date;
  bookedBy: string;
  childId: string;
  teacherId: string;
  pushReminderSent?: boolean;
  materials?: any[];
};

/** Group real bookings, not every five-minute slot or unrelated lessons in the next hour. */
export function groupReminderSessions(rawSlots: any[]): ReminderSession[] {
  const bookings = new Map<string, any[]>();
  for (const slot of rawSlots) {
    if (slot.status !== 'booked' || !slot.bookedBy || !slot.childId || !slot.teacherId) continue;
    const startDate = dateOf(slot.startTime);
    if (!startDate) continue;
    const booking = slot.bookingId || (slot.bookedAt?.seconds != null
      ? `${slot.bookedAt.seconds}:${slot.bookedAt.nanoseconds || 0}`
      : dateOf(slot.bookedAt)?.toISOString() || 'legacy');
    const key = JSON.stringify([slot.teacherId, slot.bookedBy, slot.childId, slot.packageCode || '', booking]);
    const slots = bookings.get(key) || [];
    slots.push({ ...slot, startDate, endDate: dateOf(slot.endTime) || new Date(startDate.getTime() + FIVE_MINUTES) });
    bookings.set(key, slots);
  }
  const sessions: ReminderSession[] = [];
  for (const slots of bookings.values()) {
    slots.sort((a, b) => a.startDate.getTime() - b.startDate.getTime() || a.id.localeCompare(b.id));
    let session: ReminderSession | undefined;
    for (const slot of slots) {
      const duplicateOrAdjacent = session && slot.startDate.getTime() >= session.startDate.getTime()
        && slot.startDate.getTime() <= session.endDate.getTime();
      if (!duplicateOrAdjacent) {
        session = { ...slot, slotIds: [slot.id] };
        sessions.push(session!);
      } else {
        session!.slotIds.push(slot.id);
        if (slot.endDate > session!.endDate) session!.endDate = slot.endDate;
      }
    }
  }
  return sessions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export function lessonReminderIdentity(session: ReminderSession) {
  return JSON.stringify(['lesson-start', session.bookedBy, session.childId, session.teacherId, session.startDate.toISOString()]);
}
