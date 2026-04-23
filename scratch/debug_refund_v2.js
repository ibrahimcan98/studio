
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function debugCancellationSimple() {
    console.log("--- İPTAL EDİLEN DERSLERİ ARIYORUM ---");
    const slots = await db.collection('lesson-slots').limit(200).get();
    
    const cancelled = slots.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .filter(s => s.cancelledBy === 'admin')
        .sort((a, b) => (b.cancelledAt?.seconds || 0) - (a.cancelledAt?.seconds || 0));

    if (cancelled.length === 0) {
        console.log("Admin tarafından iptal edilen ders bulunamadı.");
        return;
    }

    const slot = cancelled[0];
    console.log(`Slot ID: ${slot.id}`);
    console.log(`Veli ID: ${slot.bookedBy}`);
    console.log(`Çocuk ID: ${slot.childId}`);
    console.log(`Paket: ${slot.packageCode}`);
    console.log(`İptal Zamanı: ${slot.cancelledAt?.toDate().toISOString()}`);

    if (slot.bookedBy && slot.childId) {
        const childRef = db.collection('users').doc(slot.bookedBy).collection('children').doc(slot.childId);
        const childSnap = await childRef.get();
        if (childSnap.exists) {
            console.log("\n--- ÇOCUK GÜNCEL DURUMU ---");
            console.log(JSON.stringify(childSnap.data(), null, 2));
        } else {
             console.log("\n!!! HATA: Çocuk dökümanı bulunamadı! Yol yanlış olabilir.");
             // Acaba çocuk başka bir yerde mi?
             const allChildren = await db.collectionGroup('children').get();
             const found = allChildren.docs.find(d => d.id === slot.childId);
             if (found) {
                 console.log(`Çocuk dökümanı bulundu! Gerçek yolu: ${found.ref.path}`);
             }
        }
    }
}

debugCancellationSimple().catch(console.error);
