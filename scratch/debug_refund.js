
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../service-account.json');

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function debugCancellation() {
    console.log("--- SON İPTAL EDİLEN DERS SLOTU (Admin Tarafından) ---");
    const cancelledSlots = await db.collection('lesson-slots')
        .where('cancelledBy', '==', 'admin')
        .orderBy('cancelledAt', 'desc')
        .limit(1)
        .get();

    if (cancelledSlots.empty) {
        console.log("Son zamanlarda admin tarafından iptal edilen ders bulunamadı.");
        return;
    }

    const slot = cancelledSlots.docs[0].data();
    console.log(`Slot ID: ${cancelledSlots.docs[0].id}`);
    console.log(`Veli ID: ${slot.bookedBy}`);
    console.log(`Çocuk ID: ${slot.childId}`);
    console.log(`Paket: ${slot.packageCode}`);

    if (slot.bookedBy && slot.childId) {
        const childRef = db.collection('users').doc(slot.bookedBy).collection('children').doc(slot.childId);
        const childSnap = await childRef.get();
        if (childSnap.exists) {
            console.log("\n--- ÇOCUK GÜNCEL DURUMU ---");
            console.log(JSON.stringify(childSnap.data(), null, 2));
        } else {
            console.log("\n!!! HATA: Çocuk dökümanı bulunamadı! Yol yanlış olabilir.");
            // Alternatif yol kontrolü (Collection Group ile ara)
            const childGroup = await db.collectionGroup('children').get();
            const foundChild = childGroup.docs.find(d => d.id === slot.childId);
            if (foundChild) {
                console.log(`Çocuk bulundu ama farklı bir veli altında: ${foundChild.ref.parent.parent.id}`);
            }
        }
    }
}

debugCancellation().catch(console.error);
