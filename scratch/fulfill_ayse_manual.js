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

async function fix() {
  const userId = 'HH311pn9WmgCJRB00g2y2lXNXU03';
  const childId = 'rxkix5SoBNHO31rfoIg3';
  const txIds = ['FmOijTrfJ7WUC9NzWMph', 'rhJGtqVZdzE5OT83GWlu'];
  
  const batch = db.batch();
  
  // 1. Update Transactions
  for (const id of txIds) {
    const txRef = db.collection('transactions').doc(id);
    batch.update(txRef, { 
      status: 'completed', 
      fulfilledAt: admin.firestore.FieldValue.serverTimestamp(),
      manuallyFixed: true 
    });
  }
  
  // 2. Update Child (Single child logic: automatic assignment)
  const childRef = db.collection('users').doc(userId).collection('children').doc(childId);
  batch.update(childRef, {
    remainingLessons: admin.firestore.FieldValue.increment(8), // 4 + 4
    assignedPackage: 'B4',
    assignedPackageName: 'Başlangıç Kursu (Pre A1)',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();
  console.log('✅ Ayşe Kılıç için eksik kalan 2 işlem başarıyla tamamlandı (8 ders eklendi).');
}

fix().catch(console.error);
