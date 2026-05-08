import { db } from '../lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

async function fixAttilaCredit() {
    const parentEmail = 'sema_kaya24@hotmail.com';
    
    console.log(`[Fix] Starting credit adjustment for ${parentEmail}...`);
    
    try {
        // 1. Find the parent
        const userQuery = await db.collection('users').where('email', '==', parentEmail).limit(1).get();
        
        if (userQuery.empty) {
            console.error('❌ Parent not found!');
            return;
        }
        
        const parentDoc = userQuery.docs[0];
        const parentId = parentDoc.id;
        const parentData = parentDoc.data();
        
        console.log(`✅ Parent found: ${parentData.firstName} ${parentData.lastName} (${parentId})`);
        
        // 2. Find the child "Attila"
        const childrenQuery = await db.collection('users').doc(parentId).collection('children').get();
        const attilaDoc = childrenQuery.docs.find(d => d.data().firstName?.toLowerCase() === 'attila');
        
        if (!attilaDoc) {
            console.error('❌ Child "Attila" not found for this parent!');
            return;
        }
        
        const childId = attilaDoc.id;
        const childData = attilaDoc.data();
        const currentLessons = childData.remainingLessons || 0;
        
        console.log(`✅ Child found: ${childData.firstName} (ID: ${childId}). Current Lessons: ${currentLessons}`);
        
        // 3. Perform Update
        const batch = db.batch();
        
        // Update child remainingLessons
        batch.update(attilaDoc.ref, {
            remainingLessons: FieldValue.increment(-1),
            updatedAt: Timestamp.now()
        });
        
        // Record Transaction
        const txRef = db.collection('transactions').doc();
        batch.set(txRef, {
            userId: parentId,
            childId: childId,
            childName: childData.firstName,
            status: 'completed',
            amountGbp: 0,
            description: '📉 Manuel Kredi Düzeltmesi (Split Ders Hatası Telafisi)',
            items: [{ name: 'Kredi Düzeltme', quantity: 1, price: 0 }],
            assignedLessons: -1,
            createdAt: Timestamp.now()
        });
        
        // Log Activity
        const activityRef = db.collection('activity-log').doc();
        batch.set(activityRef, {
            event: '📉 Manuel Kredi Düzeltildi',
            icon: '📉',
            details: {
                'Veli': `${parentData.firstName} ${parentData.lastName}`,
                'Öğrenci': childData.firstName,
                'Neden': 'Split ders hatası nedeniyle fazla iade edilen kredinin geri alınması.',
                'İşlem': '-1 Ders'
            },
            createdAt: Timestamp.now()
        });
        
        await batch.commit();
        
        console.log(`🚀 [SUCCESS] Credit adjusted. New predicted lessons: ${currentLessons - 1}`);
        
    } catch (error) {
        console.error('❌ Error during fix:', error);
    }
}

fixAttilaCredit();
