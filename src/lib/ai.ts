import { doc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Çocuklar için Dinamik AI (Yapay Zeka) Limiti Sıfırlama Mantığı (Lazy Evaluation)
 * Bu fonksiyon, çocuk AI ile her sohbet ettiğinde veya chat ekranını açtığında çağrılmalıdır.
 */

export const checkAndResetAiUsage = async (dbInstance: any, userId: string, childId: string) => {
    if (!dbInstance || !userId || !childId) return false;

    try {
        const childRef = doc(dbInstance, 'users', userId, 'children', childId);
        const childSnap = await getDoc(childRef);
        
        if (!childSnap.exists()) return false;
        const childData = childSnap.data();

        const now = new Date();
        const cycleEnd = childData.aiCycleEnd?.toDate?.() || null;

        // Ebeveynin üyelik paketini kontrol et (Free = Günlük, Premium = Aylık sıfırlanır)
        const userRef = doc(dbInstance, 'users', userId);
        const userSnap = await getDoc(userRef);
        const isFree = !userSnap.exists() || userSnap.data().subscriptionTier === 'free';

        // Döngü tarihi (1 gün veya 1 ay) geçmişse veya hiç atanmamışsa sıfırla
        if (!cycleEnd || now > cycleEnd) {
            let nextCycleEnd = new Date(now);
            
            if (isFree) {
                // Ücretsiz paket: Ertesi gün gece yarısı (00:00) sıfırlanır
                nextCycleEnd.setDate(nextCycleEnd.getDate() + 1);
            } else {
                // Premium paket: Tam 1 ay sonraki gün gece yarısı (00:00) sıfırlanır
                nextCycleEnd.setMonth(nextCycleEnd.getMonth() + 1);
            }
            
            // Her halükarda sıfırlanma saati tam gece yarısı (00:00:00) olsun
            nextCycleEnd.setHours(0, 0, 0, 0);
            
            await updateDoc(childRef, {
                aiUsageMinutes: 0,
                aiCycleStart: now,
                aiCycleEnd: nextCycleEnd,
            });
            
            console.log(`[AI Limit] Child ${childId} - Usage dynamically reset. Next cycle: ${nextCycleEnd}`);
            return true; // Sıfırlandı
        }

        return false; // Sıfırlanmaya gerek yok, ay henüz bitmedi
    } catch (error) {
        console.error('[AI Limit] Error checking usage:', error);
        return false;
    }
};

/**
 * Çocuk AI kullandığında bu fonksiyonu çağırarak kullanım süresini (dakika cinsinden) güncelleriz.
 */
export const incrementAiUsage = async (dbInstance: any, userId: string, childId: string, usedMinutes: number) => {
    // 1. Önce tarihi kontrol et (Ay dönümü gelmişse otomatik sıfırlayacak)
    await checkAndResetAiUsage(dbInstance, userId, childId);

    // 2. Ardından bu kullanım süresini üzerine ekle
    try {
        const childRef = doc(dbInstance, 'users', userId, 'children', childId);
        const childSnap = await getDoc(childRef);
        
        if (!childSnap.exists()) return;
        
        const currentUsage = childSnap.data().aiUsageMinutes || 0;
        
        await updateDoc(childRef, {
            aiUsageMinutes: currentUsage + usedMinutes
        });
        
    } catch (error) {
        console.error('[AI Limit] Error incrementing usage:', error);
    }
};
