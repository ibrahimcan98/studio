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

const auth = admin.auth();
const db = admin.firestore();

async function createAdmin() {
    const email = 'tubakodak@turkcocukakademisii.com';
    const password = 'brokolim';
    const permissions = ['satislar', 'ogrenciler', 'kullanicilar']; // Example permissions based on user request

    try {
        console.log(`Creating admin: ${email}...`);
        const userRecord = await auth.createUser({
            email,
            password,
            emailVerified: true,
            displayName: 'Tuba Kodak'
        });

        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: email.toLowerCase(),
            role: 'admin',
            permissions: permissions,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true,
            firstName: 'Tuba',
            lastName: 'Kodak'
        });

        console.log('Successfully created admin!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
