
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function checkActivityRefund() {
    console.log("--- İPTAL LOGLARINI İNCELİYORUM ---");
    const logs = await db.collection('activity-log').orderBy('createdAt', 'desc').limit(50).get();
    
    logs.forEach(doc => {
        const d = doc.data();
        if (d.event === 'Ders İptal Edildi') {
            console.log(`[${d.createdAt.toDate().toISOString()}] İptal: ${JSON.stringify(d.details)}`);
        }
    });
}

checkActivityRefund().catch(console.error);
