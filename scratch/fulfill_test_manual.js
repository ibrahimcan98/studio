const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
    const serviceAccount = require('c:/Users/ibrah/studio/service-account.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function fulfillManual() {
    const transactionId = 'jWlLOjzZHPXaBhbok57g';
    const txRef = db.collection('transactions').doc(transactionId);
    
    try {
        const txDoc = await txRef.get();
        if (!txDoc.exists) {
            console.log('Transaction not found');
            return;
        }

        const txData = txDoc.data();
        if (txData.status !== 'pending') {
            console.log('Transaction is already', txData.status);
            return;
        }

        const userId = txData.userId;
        const newPackages = txData.newPackages || ['4B']; // Fallback if missing, though it should be there
        const totalLessonsToAdd = txData.totalLessonsToAdd || 4;

        console.log(`Fulfilling for user: ${userId}, Lessons: ${totalLessonsToAdd}`);

        const userRef = db.collection('users').doc(userId);
        const childrenRef = userRef.collection('children');
        const childrenSnap = await childrenRef.get();
        const childrenList = childrenSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const batch = db.batch();

        if (childrenList.length === 1) {
            const child = childrenList[0];
            console.log(`Auto-assigning to child: ${child.firstName}`);
            
            const firstPackage = newPackages[0];
            const prefix = firstPackage ? firstPackage.replace(/[0-9]/g, '') : 'B';
            const courseNames = { 'B': 'Başlangıç Kursu (Pre A1)', 'K': 'Konuşma Kursu (A1)', 'A': 'Akademik Kurs (A2)', 'G': 'Gelişim Kursu (B1)', 'GCSE': 'GCSE Türkçe Kursu' };
            const courseName = courseNames[prefix] || 'Standart Kurs';

            batch.update(childrenRef.doc(child.id), {
                remainingLessons: FieldValue.increment(totalLessonsToAdd),
                assignedPackage: firstPackage || 'B4',
                assignedPackageName: courseName,
                updatedAt: FieldValue.serverTimestamp()
            });
        } else {
            console.log('Adding to parent pool');
            batch.update(userRef, {
                enrolledPackages: FieldValue.arrayUnion(...newPackages),
                remainingLessons: FieldValue.increment(totalLessonsToAdd),
            });
        }

        batch.update(txRef, { status: 'completed', fulfilledAt: FieldValue.serverTimestamp() });
        
        await batch.commit();

        console.log('Successfully fulfilled transaction manually.');

        // Add to activity log
        await db.collection('activity-log').add({
            event: '📦 Paket Satın Alındı (Manuel Kurtarma)',
            icon: '📦',
            details: { 
                'Müşteri': txData.userEmail || '-', 
                'Tutar': 'Manuel (Destek)',
                'Paket': newPackages.join(', '),
                'Ders Sayısı': totalLessonsToAdd
            },
            createdAt: FieldValue.serverTimestamp(),
        });

    } catch (err) {
        console.error('Error:', err.message);
    }
}

fulfillManual();
