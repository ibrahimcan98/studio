// Confirmed by the administrator from the old website and January–April 2026 payrolls.
export const HISTORICAL_PAYROLL = [
  { month: 0, name: 'Selvi', amountEur: 154, lessonCount: 17 },
  { month: 1, name: 'Selvi', amountEur: 118, lessonCount: 13 },
  { month: 2, name: 'Selvi', amountEur: 182, lessonCount: 20 },
  { month: 3, name: 'Selvi', amountEur: 142, lessonCount: 15 },
  { month: 0, name: 'Dilan', amountEur: 988, lessonCount: 139 },
  { month: 1, name: 'Dilan', amountEur: 751.5, lessonCount: 107 },
  { month: 2, name: 'Dilan', amountEur: 626, lessonCount: 90 },
  { month: 3, name: 'Dilan', amountEur: 623, lessonCount: 85 },
];

const sales: [number, string, string, number][] = [
  [10224, '2026-01-01T10:50:00+03:00', 'Rahşan Arber', 252],
  [10225, '2026-01-01T17:18:00+03:00', 'Nur Yıldırım', 100.8],
  [10226, '2026-01-14T16:26:00+03:00', 'Gizem Arici Rérat', 276],
  [10227, '2026-01-18T10:41:00+03:00', 'Işıl Ersintepe', 82],
  [10228, '2026-01-18T18:29:00+03:00', 'Sumru Yıldız', 240],
  [10229, '2026-01-19T10:18:00+03:00', 'Berfu Ceren…', 240],
  [10230, '2026-01-21T19:37:00+03:00', 'Elvan İnce Arslan', 330],
  [10231, '2026-01-21T22:33:00+03:00', 'Fatma Bayrak', 408],
  [10232, '2026-01-23T10:27:00+03:00', 'MARCOS D G…', 352],
  [10233, '2026-01-24T12:52:00+03:00', 'Ayşem Kılınç', 126],
  [10234, '2026-02-02T04:32:00+03:00', 'Gökhan Özgan', 330],
  [10235, '2026-02-09T18:09:00+03:00', 'Fatma Maleki…', 126],
  [10236, '2026-02-15T06:22:00+03:00', 'Aysel Özgür', 302.4],
  [10237, '2026-02-27T21:05:00+03:00', 'Esra Aydar', 187.2],
  [10238, '2026-03-02T15:32:00+03:00', 'Esra Aydoğan', 115.5],
  [10239, '2026-03-04T19:08:00+03:00', 'Ayşem Kılınç', 151.2],
  [10240, '2026-03-09T13:43:00+03:00', 'MARCOS D G…', 176],
  [10241, '2026-03-10T11:13:00+03:00', 'Mehtap Yanmaz…', 235.87],
  [10242, '2026-03-17T23:54:00+03:00', 'Ceylan Kaya Bilgin', 123.4],
  [10243, '2026-03-22T18:27:00+03:00', 'Leticia Warner', 489.6],
  [10244, '2026-03-26T13:23:00+03:00', 'Eser Takmaz', 302.4],
  [10245, '2026-03-31T10:44:00+03:00', 'Esra Aydoğan', 115.5],
  [10246, '2026-04-03T18:27:00+03:00', 'Fatma Maleki…', 88.2],
  [10247, '2026-04-03T20:11:00+03:00', 'Fatma Maleki…', 38],
  [10248, '2026-04-10T19:14:00+03:00', 'MARCOS D G…', 176],
];

export const historicalSales = sales.map(([orderId, date, userName, amountGbp]) => ({
  id: `legacy-${orderId}`, legacyOrderId: String(orderId), userName, amountGbp,
  status: 'completed', type: 'legacy',
  items: [{ quantity: 1, name: `Eski site siparişi #${orderId}` }],
  createdAt: { toDate: () => new Date(date) },
}));

export function payrollName(name: string) {
  return name.toLocaleLowerCase('tr-TR').split(/\s+/)[0];
}

export function historicalPayrollFor(name: string, date: Date) {
  return date.getFullYear() === 2026
    ? HISTORICAL_PAYROLL.find(row => payrollName(row.name) === payrollName(name) && row.month === date.getMonth())
    : undefined;
}
