import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

// Exchange rate: 1 GBP = 1.18 EUR => 1 EUR = ~0.8475 GBP
const EUR_TO_GBP_RATE = 1.18;

// Active months: Nisan 2026 - Eylül 2026 (Mart ve Ekim hariç tutuldu)
const activeMonths = [
  '2026-04',
  '2026-05',
  '2026-06',
  '2026-07',
  '2026-08',
  '2026-09'
];

export async function POST() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const expensesRef = db.collection('expenses');
    
    // Check existing
    const existingSnap = await expensesRef.where('category', '==', 'ogretmen').get();
    const existingKeys = new Set<string>();
    existingSnap.forEach(doc => {
      const d = doc.data();
      if (d.month && d.title) {
        existingKeys.add(`${d.month}_${d.title.toLowerCase().trim()}`);
      }
    });

    const batch = db.batch();
    let count = 0;

    for (const m of activeMonths) {
      const [year, month] = m.split('-').map(Number);
      const dateObj = new Date(year, month - 1, 1, 12, 0, 0);
      const dateTimestamp = Timestamp.fromDate(dateObj);

      // 1. Şevval Maaş: 180 EUR
      const sTitle = 'Şevval Maaş';
      const sKey = `${m}_${sTitle.toLowerCase()}`;
      if (!existingKeys.has(sKey)) {
        const docRef = expensesRef.doc();
        batch.set(docRef, {
          title: sTitle,
          amount: 180,
          currency: 'EUR',
          amountGbp: Number((180 / EUR_TO_GBP_RATE).toFixed(2)),
          category: 'ogretmen',
          date: dateTimestamp,
          month: m,
          year: year,
          notes: 'Aylık sabit öğretmen maaşı (180 €)',
          createdAt: FieldValue.serverTimestamp()
        });
        count++;
      }

      // 2. Ebru Maaş: 800 EUR
      const eTitle = 'Ebru Maaş';
      const eKey = `${m}_${eTitle.toLowerCase()}`;
      if (!existingKeys.has(eKey)) {
        const docRef = expensesRef.doc();
        batch.set(docRef, {
          title: eTitle,
          amount: 800,
          currency: 'EUR',
          amountGbp: Number((800 / EUR_TO_GBP_RATE).toFixed(2)),
          category: 'ogretmen',
          date: dateTimestamp,
          month: m,
          year: year,
          notes: 'Aylık sabit öğretmen maaşı (800 €)',
          createdAt: FieldValue.serverTimestamp()
        });
        count++;
      }
    }

    if (count > 0) {
      await batch.commit();
      return NextResponse.json({ success: true, inserted: count, message: `${count} maaş gideri başarıyla eklendi.` });
    } else {
      return NextResponse.json({ success: true, inserted: 0, message: 'Kayıtlar zaten mevcut.' });
    }
  } catch (err: any) {
    console.error('Seed salaries error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE Mart ve Ekim maaş kayıtlarını siler
export async function DELETE() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const expensesRef = db.collection('expenses');
    const snapshot = await expensesRef.where('category', '==', 'ogretmen').get();

    const batch = db.batch();
    let deletedCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const month = data.month;
      // Mart 2026 veya Ekim 2026 kayıtları
      if (month === '2026-03' || month === '2026-10') {
        batch.delete(doc.ref);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      await batch.commit();
      return NextResponse.json({ success: true, deleted: deletedCount, message: `Mart ve Ekim aylarına ait ${deletedCount} kayıt başarıyla silindi.` });
    } else {
      return NextResponse.json({ success: true, deleted: 0, message: 'Silinecek Mart/Ekim kaydı bulunamadı.' });
    }
  } catch (err: any) {
    console.error('Delete salaries error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
