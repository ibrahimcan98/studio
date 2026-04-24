
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function fixSinanAydar() {
    const userId = '495mR75ytWSNZG1rMa5Kh21u1bh2';
    const childId = 'kator'; // Deep dive'dan aldığımız ID

    console.log(`--- SİNAN AYDAR DÜZELTİLİYOR ---`);

    const childRef = db.collection('users').doc(userId).collection('children').doc(childId);
    
    await childRef.update({
        assignedPackage: '8B',
        assignedPackageName: 'Başlangıç Kursu (Pre A1)',
        remainingLessons: 8, // Satın alınan asıl miktar
        updatedAt: FieldValue.serverTimestamp()
    });

    // Aktivite loguna not düşelim
    await db.collection('activity-log').add({
        event: '🔧 Hatalı Paket Düzeltildi',
        icon: '🔧',
        details: {
            'Öğrenci': 'Sinan Aydar',
            'Eski Paket': 'K-6 (Konuşma)',
            'Yeni Paket': '8B (Başlangıç)',
            'Sebep': 'Admin panelinden manuel hatalı giriş düzeltildi.'
        },
        createdAt: FieldValue.serverTimestamp()
    });

    console.log("Düzeltme başarıyla tamamlandı. Paket 8B (Başlangıç) ve ders sayısı 8 olarak güncellendi.");
}

fixSinanAydar().catch(console.error);
