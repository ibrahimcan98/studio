import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { userId, otp } = await req.json();

    if (!userId || !otp) {
      return NextResponse.json({ error: 'Eksik bilgi.' }, { status: 400 });
    }

    // 1. Get user document
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    const userData = userDoc.data();
    
    // 2. Validate OTP
    if (!userData?.emailOtp || userData.emailOtp !== otp) {
      return NextResponse.json({ error: 'Geçersiz doğrulama kodu.' }, { status: 400 });
    }

    // 3. Check Expiry
    if (userData.emailOtpExpires && userData.emailOtpExpires.toDate() < new Date()) {
      return NextResponse.json({ error: 'Doğrulama kodunun süresi dolmuş.' }, { status: 400 });
    }

    // 4. Update Auth & Firestore
    // Mark as verified in Firebase Auth
    await auth.updateUser(userId, { emailVerified: true });

    // Mark as verified in Firestore and clear OTP
    await userRef.update({
      emailVerified: true,
      emailOtp: null,
      emailOtpExpires: null
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Verify OTP API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
