import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getPasswordResetTemplate } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'E-posta adresi gerekli.' }, { status: 400 });
    }

    // Generate Firebase password reset link
    const resetLink = await auth.generatePasswordResetLink(email, {
        url: 'https://turkcocukakademisi.com/ebeveyn-portali', // Redirect URL after password reset
    });

    // Send email via Resend
    const { error, data } = await resend.emails.send({
      from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`,
      to: email,
      subject: 'Türk Çocuk Akademisi Şifre Sıfırlama',
      html: getPasswordResetTemplate(resetLink),
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('Password Reset API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
