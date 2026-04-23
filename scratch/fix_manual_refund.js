
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function fixLastCancellation() {
    console.log("--- SON İPTAL EDİLENİ BULUP İADE EDİYORUM ---");
    const slots = await db.collection('lesson-slots')
        .where('cancelledBy', '==', 'admin')
        .orderBy('cancelledAt', 'desc')
        .limit(1)
        .get();

    if (slots.empty) {
        console.log("İptal edilmiş ders bulunamadı.");
        return;
    }

    const slot = slots.docs[0].data();
    // Normalde burada 'bookedBy' ve 'childId' sildiğimiz için boş olabilir.
    // O yüzden activity log'da iade edilmemiş olanı arayacağız veya direkt slot'un eski verisini tahmin edeceğiz.
    // Ama durun! Eğer slot 'available' ise ve 'cancelledBy' admin ise, son 1 saat içindekine bakabiliriz.
    
    console.log(`Bulunan Slot ID: ${slots.docs[0].id}, İptal Zamanı: ${slot.cancelledAt.toDate().toISOString()}`);
    // Eğer veriler null ise, kullanıcıdan isim isteyebilirim ama önce Activity Log'u (varsa) son kez kontrol edeyim.
}

fixLastCancellation().catch(console.error);
