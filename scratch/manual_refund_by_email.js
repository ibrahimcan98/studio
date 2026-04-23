
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function manualRefund() {
    const email = 'ibrahimcanonder_98@hotmail.com';
    console.log(`--- ${email} İÇİN İADE İŞLEMİ BAŞLATILDI ---`);

    const userSnap = await db.collection('users').where('email', '==', email).get();
    
    if (userSnap.empty) {
        console.log("HATA: Bu mail adresiyle bir kullanıcı bulunamadı.");
        return;
    }

    const userDoc = userSnap.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    console.log(`Veli bulundu: ${userData.firstName} ${userData.lastName} (ID: ${userId})`);

    const childrenSnap = await db.collection('users').doc(userId).collection('children').get();
    
    if (childrenSnap.empty) {
        console.log("HATA: Bu velinin kayıtlı çocuğu bulunamadı.");
        return;
    }

    // İlk çocuğu baz alıyoruz (genelde tek çocuk olur veya en son işlem yapılan budur)
    const childDoc = childrenSnap.docs[0];
    const childData = childDoc.data();
    const childId = childDoc.id;

    console.log(`Öğrenci: ${childData.firstName} (Kalan Ders: ${childData.remainingLessons}, Deneme Kullandı mı: ${childData.hasUsedFreeTrial})`);

    // İade İşlemi: Normal ders ise krediyi arttır, deneme dersi ise flag'i sıfırla
    if (childData.hasUsedFreeTrial === true) {
        console.log("İptal edilen dersin DENEME DERSİ olduğu varsayılarak hak iade ediliyor...");
        await childDoc.ref.update({ hasUsedFreeTrial: false });
        await userDoc.ref.update({ freeTrialsUsed: FieldValue.increment(-1) });
    } else {
        console.log("İptal edilen dersin NORMAL DERS olduğu varsayılarak 1 kredi iade ediliyor...");
        await childDoc.ref.update({ remainingLessons: FieldValue.increment(1) });
    }

    console.log("BAŞARILI: İade işlemi tamamlandı.");
}

manualRefund().catch(console.error);
