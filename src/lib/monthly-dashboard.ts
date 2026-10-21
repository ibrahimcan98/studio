import { buildCompletedTeacherSessions } from './teacher-earnings';

function dateOf(value: any): Date | null {
  const date = value?.toDate ? value.toDate() : new Date(value ?? NaN);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function buildMonthlyDashboard(slots: any[], transactions: any[], month: Date, now = new Date()) {
  const inMonth = (date: Date | null) => !!date && date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
  const completed = buildCompletedTeacherSessions(slots, now).filter(lesson => inMonth(lesson.firstStartTime));
  // Administrative transfers, gifts and lesson corrections are not package sales.
  const sales = transactions.filter(tx => tx.status === 'completed' && Number(tx.amountGbp) > 0)
    .map(tx => ({ ...tx, date: dateOf(tx.fulfilledAt || tx.createdAt) }))
    .filter(tx => tx.date).sort((a, b) => a.date!.getTime() - b.date!.getTime() || String(a.id).localeCompare(String(b.id)));
  const seen = new Set<string>();
  const monthSales: any[] = [];
  for (const sale of sales) {
    const repeat = sale.userId ? seen.has(sale.userId) : null;
    if (sale.userId) seen.add(sale.userId);
    if (inMonth(sale.date)) monthSales.push({ ...sale, repeat });
  }
  const packages: Record<string, number> = {};
  monthSales.forEach(sale => (sale.items || []).forEach((item: any) => {
    const name = item.name || 'Adı belirtilmeyen paket';
    const quantity = Number(item.quantity ?? 1);
    if (Number.isFinite(quantity) && quantity > 0) packages[name] = (packages[name] || 0) + quantity;
  }));
  const teachers: Record<string, { paid: number; trial: number }> = {};
  completed.forEach(lesson => {
    const key = lesson.teacherId || 'unknown';
    teachers[key] ||= { paid: 0, trial: 0 };
    teachers[key][lesson.packageCode === 'FREE_TRIAL' ? 'trial' : 'paid']++;
  });
  const weeks = Array.from({ length: Math.ceil(new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() / 7) }, (_, index) => ({
    label: `${index * 7 + 1}–${Math.min((index + 1) * 7, new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate())}`,
    paid: 0, trial: 0, sales: 0,
  }));
  completed.forEach(lesson => weeks[Math.floor((lesson.firstStartTime.getDate() - 1) / 7)][lesson.packageCode === 'FREE_TRIAL' ? 'trial' : 'paid']++);
  monthSales.forEach(sale => weeks[Math.floor((sale.date.getDate() - 1) / 7)].sales++);
  const trialParents = new Set(completed.filter(l => l.packageCode === 'FREE_TRIAL').map(l => slots.find(s => s.id === l.id)?.bookedBy).filter(Boolean));
  const converted = [...trialParents].filter(id => {
    const trialEnd = Math.min(...completed.filter(l => l.packageCode === 'FREE_TRIAL' && slots.find(s => s.id === l.id)?.bookedBy === id).map(l => l.lastEndTime.getTime()));
    return monthSales.some(sale => sale.userId === id && sale.date.getTime() >= trialEnd);
  }).length;
  return { completed, monthSales, packages, teachers, weeks, trialParents: trialParents.size, converted,
    first: monthSales.filter(s => s.repeat === false).length,
    repeat: monthSales.filter(s => s.repeat === true).length,
    unknown: monthSales.filter(s => s.repeat === null).length };
}
