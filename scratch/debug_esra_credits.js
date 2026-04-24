
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function debugUserCredits() {
    const email = 'esraaydar@gmail.com';
    console.log(`--- ${email} İÇİN VERİ KONTROLÜ ---`);

    const userSnap = await db.collection('users').where('email', '==', email).get();
    
    if (userSnap.empty) {
        console.log("HATA: Kullanıcı bulunamadı.");
        return;
    }

    const userDoc = userSnap.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    console.log(`Veli: ${userData.firstName} ${userData.lastName} (ID: ${userId})`);
    
    const childrenSnap = await db.collection('users').doc(userId).collection('children').get();
    
    if (childrenSnap.empty) {
        console.log("HATA: Çocuğu bulunamadı.");
        return;
    }

    childrenSnap.forEach(doc => {
        const d = doc.data();
        console.log(`\nÖğrenci: ${d.firstName}`);
        console.log(`Kalan Ders: ${d.remainingLessons}`);
        console.log(`Atanan Paket: ${d.assignedPackage}`);
        console.log(`Paketlerim: ${JSON.stringify(d.packages || [], null, 2)}`);
    });

    // Satış kayıtlarına bakalım
    console.log("\n--- SATIŞ KAYITLARI (Transactions) ---");
    const transSnap = await db.collection('transactions')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();

    transSnap.forEach(doc => {
        const t = doc.data();
        console.log(`[${t.createdAt.toDate().toISOString()}] Paket: ${t.packageCode}, Tutar: ${t.amount} TL`);
    });
}

debugUserCredits().catch(console.error);
