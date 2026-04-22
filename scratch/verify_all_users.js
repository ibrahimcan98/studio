const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Try to load service account
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
let serviceAccount;
if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
} else {
  console.error('Service account file not found!');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function verifyAllExistingUsers() {
  console.log('Starting mass verification...');
  try {
    const userSnapshot = await db.collection('users').get();
    console.log(`Found ${userSnapshot.size} users to process.`);

    let count = 0;
    for (const doc of userSnapshot.docs) {
      const userData = doc.data();
      const uid = doc.id;

      if (!userData.emailVerified) {
        // 1. Update Firestore
        await db.collection('users').doc(uid).update({
          emailVerified: true,
          emailOtp: admin.firestore.FieldValue.delete(),
          emailOtpExpires: admin.firestore.FieldValue.delete()
        });

        // 2. Update Auth (try-catch because user might not exist in Auth)
        try {
          await auth.updateUser(uid, {
            emailVerified: true
          });
        } catch (e) {
          console.warn(`Could not update Auth for user ${uid}:`, e.message);
        }

        count++;
        console.log(`Verified: ${userData.email || uid}`);
      }
    }

    console.log(`Successfully verified ${count} unverified users.`);
  } catch (error) {
    console.error('Error during mass verification:', error);
  } finally {
    process.exit(0);
  }
}

verifyAllExistingUsers();
