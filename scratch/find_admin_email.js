const admin = require('firebase-admin');

if (!admin.apps.length) {
    const serviceAccount = require('c:/Users/ibrah/studio/service-account.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function findUser() {
    try {
        const snapshot = await db.collection('users').where('role', '==', 'admin').get();
        snapshot.forEach(doc => {
            console.log(`User: ${doc.data().email}, Role: ${doc.data().role}`);
        });
    } catch (err) {
        console.error(err);
    }
}

findUser();
