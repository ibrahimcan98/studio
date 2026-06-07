const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function run() {
  const email = 'ibrahimcanonder_98@hotmail.com';
  const snapshot = await db.collection('users').where('email', '==', email).get();
  
  if (snapshot.empty) {
    console.log('User not found.');
    process.exit(1);
  }

  const doc = snapshot.docs[0];
  await doc.ref.update({
    subscriptionTier: 'adventurer',
    isPremium: true
  });

  console.log(`Updated user ${email} (${doc.id}) to adventurer.`);
}

run().catch(console.error).finally(() => process.exit(0));
