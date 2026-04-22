import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getOTPTemplate } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();

    if (!email || !userId) {
      return NextResponse.json({ error: 'E-posta ve Kullanıcı ID zorunludur.' }, { status: 400 });
    }

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 2. Save OTP to Firestore
    await db.collection('users').doc(userId).update({
      emailOtp: otp,
      emailOtpExpires: expiresAt,
    });

    // 3. Send Email via Resend
    const { error, data } = await resend.emails.send({
      from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`,
      to: email,
      subject: `${otp} Doğrulama Kodunuz - Türk Çocuk Akademisi`,
      html: getOTPTemplate(otp),
    });

    if (error) {
      console.error('Resend OTP Error:', error);
      return NextResponse.json({ error: 'E-posta gönderilemedi.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Send OTP API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
