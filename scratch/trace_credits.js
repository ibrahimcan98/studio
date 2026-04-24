
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function traceCredits() {
    const userId = '495mR75ytWSNZG1rMa5Kh21u1bh2';
    console.log(`--- SİNAN AYDAR DERS GEÇMİŞİ ANALİZİ ---`);

    const transSnap = await db.collection('transactions').where('userId', '==', userId).get();
    
    const sorted = transSnap.docs
        .map(d => ({id: d.id, ...d.data()}))
        .sort((a,b) => a.createdAt.seconds - b.createdAt.seconds);

    let currentLessons = 0;
    sorted.forEach(t => {
        const added = t.totalLessonsToAdd || t.assignedLessons || 0;
        currentLessons += added;
        console.log(`[${t.createdAt.toDate().toISOString()}] Olay: ${t.description || t.type || 'Satın Alım'}, Eklenen: ${added}, Ara Toplam: ${currentLessons}`);
    });
}

traceCredits().catch(console.error);
