const { db } = require('./src/lib/firebase-admin');

async function findPendingTransactions() {
  console.log('--- Bugünün Bekleyen (Pending) İşlemleri ---');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const txRef = db.collection('transactions');
  const snapshot = await txRef
    .where('status', '==', 'pending')
    .where('createdAt', '>=', today)
    .get();

  if (snapshot.empty) {
    console.log('Bekleyen işlem bulunamadı.');
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`Müşteri: ${data.userEmail}`);
    console.log(`Tutar: ${data.amountGbp || data.amountEur}`);
    console.log(`Paketler: ${data.newPackages?.join(', ')}`);
    console.log(`Ders Sayısı: ${data.totalLessonsToAdd}`);
    console.log('---');
  });
}

findPendingTransactions().catch(console.error);
