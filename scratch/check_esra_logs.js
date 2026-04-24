
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function checkCallLogs() {
    const userId = '495mR75ytWSNZG1rMa5Kh21u1bh2';
    console.log(`--- ${userId} İÇİN SİSTEM LOGLARI ---`);

    const logsSnap = await db.collection('users').doc(userId).collection('call-logs').orderBy('createdAt', 'desc').limit(10).get();
    
    if (logsSnap.empty) {
        console.log("Log bulunamadı.");
        return;
    }

    logsSnap.forEach(doc => {
        const d = doc.data();
        console.log(`[${d.createdAt?.toDate().toISOString()}] ${d.status}: ${d.note}`);
    });
}

checkCallLogs().catch(console.error);
