
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function deepDiveChild() {
    const userId = '495mR75ytWSNZG1rMa5Kh21u1bh2';
    const childrenSnap = await db.collection('users').doc(userId).collection('children').get();
    
    childrenSnap.forEach(doc => {
        console.log(`--- ÇOCUK: ${doc.id} ---`);
        console.log(JSON.stringify(doc.data(), null, 2));
    });
}

deepDiveChild().catch(console.error);
