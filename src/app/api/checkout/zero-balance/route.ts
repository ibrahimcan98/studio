import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { resend, FROM_EMAIL } from '@/lib/resend';

export async function POST(req: Request) {
    try {
        const { userId, referrerId, newPackages, totalLessonsToAdd, balanceUsedGbp } = await req.json();
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const userRef = db.collection('users').doc(userId);
        const userSnap = await userRef.get();
        const userData = userSnap.data();
        const buyerName = userData?.displayName || 
                          (userData?.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : 'Bir Arkadaşınız');

        const childrenRef = userRef.collection('children');
        const childrenSnap = await childrenRef.get();
        const childrenList = childrenSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const isSingleChild = childrenList.length === 1;

        const batch = db.batch();

        if (isSingleChild) {
            const child = childrenList[0];
            const childRef = childrenRef.doc(child.id);
            const firstPackage = newPackages[0];
            const prefix = firstPackage ? firstPackage.replace(/[0-9]/g, '') : 'B';
            
            const isGroupPackage = prefix.toLowerCase().includes('grup');
            
            if (isGroupPackage) {
                const updatedPackages = [...(userData?.enrolledPackages || []), ...newPackages];
                batch.update(userRef, {
                    walletBalanceGbp: FieldValue.increment(-balanceUsedGbp),
                    enrolledPackages: updatedPackages
                });
            } else {
                const courseNames: any = { 
                    'B': 'Başlangıç Kursu (Pre A1)', 
                    'K': 'Konuşma Kursu (A1)', 
                    'A': 'Akademik Kurs (A2)', 
                    'G': 'Gelişim Kursu (B1)', 
                    'GCSE': 'GCSE Türkçe Kursu' 
                };
                
                batch.update(childRef, {
                    remainingLessons: FieldValue.increment(totalLessonsToAdd),
                    assignedPackage: `${prefix}${totalLessonsToAdd / newPackages.length}`, 
                    assignedPackageName: courseNames[prefix] || 'Standart Kurs',
                    updatedAt: FieldValue.serverTimestamp()
                });

                batch.update(userRef, {
                    walletBalanceGbp: FieldValue.increment(-balanceUsedGbp),
                });
            }
        } else {
            const updatedPackages = [...(userData?.enrolledPackages || []), ...newPackages];
            const isGroupPackage = newPackages.some((p: string) => p.toLowerCase().includes('grup'));
            batch.update(userRef, {
                walletBalanceGbp: FieldValue.increment(-balanceUsedGbp),
                remainingLessons: FieldValue.increment(isGroupPackage ? 0 : totalLessonsToAdd),
                enrolledPackages: updatedPackages
            });
        }

        if (referrerId) {
            const fs = require('fs');
            const logFile = 'checkout_logs.txt';
            fs.appendFileSync(logFile, `\n--- New Checkout ${new Date().toISOString()} ---\n`);
            fs.appendFileSync(logFile, `Processing referrerId: ${referrerId}\n`);
            
            const referrerRef = db.collection('users').doc(referrerId);
            const referrerSnap = await referrerRef.get();
            const referrerData = referrerSnap.data();

            fs.appendFileSync(logFile, `Referrer Email: ${referrerData?.email}\n`);

            if (referrerData && referrerData.email === 'ibrahimcanonder_98@hotmail.com') {
                fs.appendFileSync(logFile, `Test account detected!\n`);
                const referrerChildrenRef = referrerRef.collection('children');
                const referrerChildrenSnap = await referrerChildrenRef.get();
                
                fs.appendFileSync(logFile, `Referrer Children Count: ${referrerChildrenSnap.size}\n`);

                if (!referrerChildrenSnap.empty) {
                    const firstChild = referrerChildrenSnap.docs[0];
                    const giftId = Math.random().toString(36).substring(7);
                    
                    let courseName = firstChild.data().assignedPackageName || 'Mevcut Kurs';
                    const prevMatch = courseName.match(/\[Önceki:\s*(.*?)\]/);
                    if (prevMatch) {
                        courseName = prevMatch[1];
                    }

                    batch.update(referrerRef, {
                        referralGifts: FieldValue.arrayUnion({
                            id: giftId,
                            from: buyerName,
                            date: new Date().toISOString(),
                            courseName: courseName,
                            assigned: false
                        })
                    });

                    // Send email to referrer
                    try {
                        await resend.emails.send({
                            from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`,
                            to: referrerData.email,
                            subject: 'Tebrikler! +1 Hediye Ders Kazandınız! 🎉',
                            html: `
                              <div style="font-family: sans-serif; padding: 20px; color: #334155; line-height: 1.6;">
                                <h2 style="color: #0f172a; margin-bottom: 16px;">Harika Haber!</h2>
                                <p style="font-size: 16px; margin-bottom: 12px;">Bir arkadaşınızın referansınızla katılımı sayesinde <strong>+1 hediye ders</strong> kazandınız!</p>
                                <p style="font-size: 16px; margin-bottom: 12px;">Hediyeyi gönderen: <strong>${buyerName}</strong></p>
                                <p style="font-size: 16px; margin-bottom: 24px;">Ebeveyn portalına giriş yaparak hediyenizi dilediğiniz çocuğunuza tanımlayabilirsiniz.</p>
                                <a href="https://turkcocukakademisi.com/ebeveyn-portali" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">Hediyeyi Tanımla</a>
                                <hr style="margin-top: 32px; margin-bottom: 16px; border: 0; border-top: 1px solid #e2e8f0;" />
                                <p style="font-size: 12px; color: #94a3b8;">Bu e-posta Türk Çocuk Akademisi tarafından otomatik olarak gönderilmiştir.</p>
                              </div>
                            `
                        });
                        fs.appendFileSync(logFile, `Gift email sent to: ${referrerData.email}\n`);
                    } catch (emailError) {
                        console.error('Error sending gift email:', emailError);
                        fs.appendFileSync(logFile, `Error sending gift email: ${emailError}\n`);
                    }
                } else {
                    fs.appendFileSync(logFile, `No children found for referrer, falling back to points.\n`);
                    batch.update(referrerRef, { academyPoints: FieldValue.increment(500) });
                }
            } else {
                fs.appendFileSync(logFile, `Normal account, giving points.\n`);
                batch.update(referrerRef, { academyPoints: FieldValue.increment(500) });
            }
        }

        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('Zero Balance Checkout Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
