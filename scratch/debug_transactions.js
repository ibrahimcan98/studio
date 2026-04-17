const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin for local check
if (!admin.apps.length) {
    const serviceAccount = require('c:/Users/ibrah/studio/service-account.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkLastTransactions() {
    try {
        console.log('Fetching last 5 transactions...');
        const snapshot = await db.collection('transactions')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();

        if (snapshot.empty) {
            console.log('No transactions found.');
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`--- Transaction: ${doc.id} ---`);
            console.log(`User: ${data.userName} (${data.userEmail})`);
            console.log(`Status: ${data.status}`);
            console.log(`Amount: ${data.amount} ${data.currency}`);
            console.log(`CreatedAt: ${data.createdAt?.toDate()}`);
            console.log(`Metadata TransactionId: ${data.transactionId || 'None'}`);
            console.log(`Items: ${JSON.stringify(data.items)}`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkLastTransactions();
