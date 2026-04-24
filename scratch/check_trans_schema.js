
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function checkTransactionFields() {
    const userId = '495mR75ytWSNZG1rMa5Kh21u1bh2';
    const transSnap = await db.collection('transactions').where('userId', '==', userId).limit(1).get();
    
    if (transSnap.empty) {
        console.log("İşlem kaydı bulunamadı.");
        return;
    }

    console.log("--- ÖRNEK İŞLEM KAYDI ---");
    console.log(JSON.stringify(transSnap.docs[0].data(), null, 2));
}

checkTransactionFields().catch(console.error);
