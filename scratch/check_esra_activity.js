
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function checkActivityLog() {
    const userName = 'Esra Aydar';
    console.log(`--- ${userName} İÇİN AKTİVİTE LOGLARI ---`);

    const logSnap = await db.collection('activity-log')
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();
    
    logSnap.forEach(doc => {
        const d = doc.data();
        const detailsStr = JSON.stringify(d.details || {});
        if (detailsStr.includes(userName) || detailsStr.includes('Sinan')) {
            console.log(`[${d.createdAt?.toDate().toISOString()}] Olay: ${d.event}, Detay: ${detailsStr}, Yapan: ${d.adminEmail || 'Sistem'}`);
        }
    });
}

checkActivityLog().catch(console.error);
