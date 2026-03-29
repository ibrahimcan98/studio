import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/firebase-admin';
import { resend, FROM_EMAIL } from '../../../../lib/resend';
import { getVerificationTemplate, getPasswordResetTemplate } from '../../../../lib/email-templates';

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();

    if (!email || !type) {
      return NextResponse.json({ error: 'E-posta ve tip zorunludur.' }, { status: 400 });
    }

    let link = '';
    let subject = '';
    let html = '';

    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://turkcocukakademisi.com'}/auth/email-onay`,
    };

    if (type === 'verification') {
      link = await auth.generateEmailVerificationLink(email, actionCodeSettings);
      subject = 'E-posta Adresinizi Doğrulayın';
      html = getVerificationTemplate(link);
    } else if (type === 'password-reset') {
      // Check if user exists before generating reset link
      try {
        await auth.getUserByEmail(email);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
        }
        throw err;
      }
      link = await auth.generatePasswordResetLink(email, actionCodeSettings);
      subject = 'Şifre Sıfırlama Talebi';
      html = getPasswordResetTemplate(link);
    } else {
      return NextResponse.json({ error: 'Geçersiz tip.' }, { status: 400 });
    }

    const { error, data: resendData } = await resend.emails.send({
      from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`,
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error('Resend Auth Email Error Details:', {
        email,
        type,
        error: error.message,
        name: error.name
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Auth email (${type}) successfully sent to ${email} via Resend.`);
    return NextResponse.json({ success: true, id: resendData?.id });
  } catch (err: any) {
    console.error('CRITICAL Auth Link API Error:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
