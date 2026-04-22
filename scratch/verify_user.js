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

async function verifyUser(email) {
  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      console.log('User not found in Firestore with email:', email);
      return;
    }

    const userDoc = userSnapshot.docs[0];
    const uid = userDoc.id;

    console.log('Found user:', uid);

    // 1. Update Firestore
    await db.collection('users').doc(uid).update({
      emailVerified: true,
      emailOtp: admin.firestore.FieldValue.delete(),
      emailOtpExpires: admin.firestore.FieldValue.delete()
    });

    // 2. Update Auth
    await auth.updateUser(uid, {
      emailVerified: true
    });

    console.log('Successfully verified user:', email);
  } catch (error) {
    console.error('Error verifying user:', error);
  } finally {
    process.exit(0);
  }
}

verifyUser('mycherryhoney@yahoo.com');
