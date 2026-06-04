const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixLeonardoTrial() {
  console.log('Searching for children named Leonardo...');
  const usersRef = db.collection('users');
  const usersSnap = await usersRef.get();
  
  let found = false;

  for (const userDoc of usersSnap.docs) {
    const childrenRef = userDoc.ref.collection('children');
    const childrenSnap = await childrenRef.get();
    
    for (const childDoc of childrenSnap.docs) {
      const childData = childDoc.data();
      if (childData.firstName && childData.firstName.toLowerCase() === 'leonardo') {
        found = true;
        console.log(`Found Leonardo! Child ID: ${childDoc.id}, Parent ID: ${userDoc.id}`);
        
        // Update child
        await childDoc.ref.update({
          hasUsedFreeTrial: false
        });
        console.log('Updated child hasUsedFreeTrial to false');
        
        // Update parent
        const parentData = userDoc.data();
        let currentUsed = parentData.freeTrialsUsed || 1;
        if (currentUsed > 0) {
          await userDoc.ref.update({
            freeTrialsUsed: admin.firestore.FieldValue.increment(-1)
          });
          console.log(`Decreased freeTrialsUsed for parent ${userDoc.id}`);
        } else {
          console.log('Parent freeTrialsUsed is already 0 or less');
        }
      }
    }
  }
  
  if (!found) {
    console.log('Could not find a child named Leonardo.');
  }
  console.log('Done!');
}

fixLeonardoTrial().catch(console.error);
