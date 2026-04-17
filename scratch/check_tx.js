const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function check() {
  const email = 'ayse.kilic@gmail.com';
  console.log(`Checking transactions for: ${email}`);
  
  const snap = await db.collection('transactions').where('userEmail', '==', email).get();
  
  if (snap.empty) {
    console.log('No transactions found.');
    return;
  }
  
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`Status: ${data.status}`);
    console.log(`Created: ${data.createdAt?.toDate()}`);
    console.log('---');
  });
}

check().catch(console.error);
