const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function run() {
  const usersSnap = await db.collection('users').get();
  let foundParents = [];
  let freeCount = 0;
  let premiumCount = 0;
  
  for (const doc of usersSnap.docs) {
    const parentData = doc.data();
    if (parentData.role === 'admin' || parentData.role === 'teacher') continue;
    
    const childrenSnap = await db.collection(`users/${doc.id}/children`).get();
    
    let hasPlayed = false;
    let playedChildren = [];
    
    childrenSnap.forEach(childDoc => {
      const childData = childDoc.data();
      const completedTopics = childData.completedTopics || [];
      const stories = Object.keys(childData.stats?.story || {}).length;
      const aiMinutes = Math.floor((childData.stats?.ai?.dailyUsageSeconds || 0) / 60);
      
      if (completedTopics.length > 0 || stories > 0 || aiMinutes > 0) {
        hasPlayed = true;
        playedChildren.push({
          name: childData.firstName || childData.name || 'İsimsiz',
          completedTopics: completedTopics.length,
          stories: stories,
          aiMinutes: aiMinutes
        });
      }
    });
    
    if (hasPlayed) {
      const isFree = parentData.subscriptionTier === 'free' || !parentData.subscriptionTier;
      if (isFree) freeCount++;
      else premiumCount++;
      
      foundParents.push({
        email: parentData.email,
        tier: parentData.subscriptionTier || 'free',
        children: playedChildren
      });
    }
  }
  
  console.log(`Toplam oyun oynayan/kullanan veli: ${foundParents.length}`);
  console.log(`Ücretsiz: ${freeCount}`);
  console.log(`Premium: ${premiumCount}`);
  console.log('\nDetaylar:');
  console.log(JSON.stringify(foundParents, null, 2));
}

run().catch(console.error);
