import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.frankfurter.dev/v2/rates?base=GBP&quotes=EUR,USD,TRY&providers=ecb', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Kur servisine ulaşılamadı.');
    const rows: { date: string; quote: string; rate: number }[] = await response.json();
    const rates: Record<string, number> = { GBP: 1 };
    for (const row of rows) {
      if (Number.isFinite(row.rate) && row.rate > 0) rates[row.quote.toUpperCase()] = row.rate;
    }
    if (!rates.EUR || !rates.USD || !rates.TRY) throw new Error('Kur bilgisi eksik.');
    return NextResponse.json({ rates, date: rows.find(row => row.quote.toUpperCase() === 'EUR')?.date, source: 'ECB' });
  } catch {
    return NextResponse.json({ error: 'Güncel kur alınamadı. Lütfen tekrar deneyin.' }, { status: 503 });
  }
}
