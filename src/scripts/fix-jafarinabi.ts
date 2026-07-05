import { db } from '../lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

async function fixFreeTrial() {
    const parentEmail = 'jafarinabi360@gmail.com';
    
    console.log(`Starting free trial fix for parent: ${parentEmail}`);
    
    try {
        const userQuery = await db.collection('users').where('email', '==', parentEmail).limit(1).get();
        if (userQuery.empty) {
            console.error('❌ Parent not found!');
            return;
        }

        const parentDoc = userQuery.docs[0];
        const parentId = parentDoc.id;
        const parentData = parentDoc.data() as any;
        console.log(`Parent data:`, parentData);

        const batch = db.batch();
        let changed = false;

        if (parentData.freeTrialsUsed > 0) {
            console.log(`Decreasing freeTrialsUsed from ${parentData.freeTrialsUsed} to ${parentData.freeTrialsUsed - 1}`);
            batch.update(parentDoc.ref, {
                freeTrialsUsed: FieldValue.increment(-1)
            });
            changed = true;
        }

        const childrenQuery = await db.collection('users').doc(parentId).collection('children').get();
        for (const childDoc of childrenQuery.docs) {
            const childData = childDoc.data();
            console.log(`Child ${childDoc.id} (${childData.firstName}): hasUsedFreeTrial =`, childData.hasUsedFreeTrial);
            if (childData.firstName === 'WAHID' || childData.hasUsedFreeTrial === true) {
                console.log(`Setting hasUsedFreeTrial to false for child ${childDoc.id}`);
                batch.update(childDoc.ref, { hasUsedFreeTrial: false });
                changed = true;
            }
        }
        
        if (changed) {
            await batch.commit();
            console.log(`🚀 [SUCCESS] Free trial restored.`);
        } else {
            console.log('No changes needed.');
        }

    } catch (error) {
        console.error('❌ Error during fix:', error);
    }
}

fixFreeTrial();
