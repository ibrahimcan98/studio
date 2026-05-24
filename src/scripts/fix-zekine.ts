import { db } from '../lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

async function fixZekineCredit() {
    const parentEmail = 'z_citak@hotmail.com';
    
    console.log(`Starting credit fix for parent: ${parentEmail}`);
    
    try {
        const userQuery = await db.collection('users').where('email', '==', parentEmail).limit(1).get();
        if (userQuery.empty) {
            console.error('❌ Parent not found!');
            return;
        }

        const parentDoc = userQuery.docs[0];
        const parentId = parentDoc.id;
        const parentData = parentDoc.data() as any;
        console.log(`Parent remainingLessons:`, parentData.remainingLessons);

        const batch = db.batch();
        let changed = false;

        if (parentData.remainingLessons < 0) {
            console.log(`Fixing parent remainingLessons: ${parentData.remainingLessons} -> 0`);
            batch.update(parentDoc.ref, {
                remainingLessons: 0,
                updatedAt: Timestamp.now()
            });
            
            const activityRef = db.collection('activity-log').doc();
            batch.set(activityRef, {
                event: '🔧 Veli Kredisi Düzeltildi',
                icon: '🔧',
                details: {
                    'Veli': `${parentData.firstName} ${parentData.lastName}`,
                    'Eski Kredi': String(parentData.remainingLessons),
                    'Yeni Kredi': '0'
                },
                createdAt: Timestamp.now()
            });
            changed = true;
        }

        const childrenQuery = await db.collection('users').doc(parentId).collection('children').get();
        for (const childDoc of childrenQuery.docs) {
            console.log(`Child ${childDoc.id} remainingLessons:`, childDoc.data().remainingLessons);
            if (childDoc.data().remainingLessons < 0) {
                batch.update(childDoc.ref, { remainingLessons: 0 });
                changed = true;
            }
        }
        
        if (changed) {
            await batch.commit();
            console.log(`🚀 [SUCCESS] Credit adjusted to 0.`);
        } else {
            console.log('No negative balance found.');
        }

    } catch (error) {
        console.error('❌ Error during fix:', error);
    }
}

fixZekineCredit();
