const { db } = require('./src/lib/firebase-admin');

async function checkPendingTransactions() {
    try {
        const snapshot = await db.collection('transactions')
            .where('status', '==', 'pending')
            .limit(10)
            .get();

        if (snapshot.empty) {
            console.log('No pending transactions found.');
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`ID: ${doc.id}`);
            console.log(`Customer: ${data.userEmail}`);
            console.log(`Status: ${data.status}`);
            console.log(`CreatedAt: ${data.createdAt?.toDate()}`);
            console.log(`Amount: ${data.amount} ${data.currency}`);
            console.log('---');
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkPendingTransactions();
