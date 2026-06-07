const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function run() {
  const snapshot = await db.collection('users').get();
  let found = false;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.email && data.email.toLowerCase().includes('ibrahim')) {
      console.log(`Found: ${data.email} - UID: ${doc.id} - Tier: ${data.subscriptionTier}`);
      
      // Force update if it's the exact email
      if (data.email.toLowerCase() === 'ibrahimcanonder_98@hotmail.com' || data.email.toLowerCase() === 'ibrahimcanonder98@hotmail.com') {
          doc.ref.update({
              subscriptionTier: 'adventurer',
              isPremium: true
          }).then(() => console.log('Updated!'));
      }
      found = true;
    }
  });

  if (!found) {
    console.log('No user with ibrahim in email found.');
  }
}

run().catch(console.error);
