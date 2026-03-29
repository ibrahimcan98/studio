import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '../../../../lib/resend';
import * as templates from '../../../../lib/email-templates';

export async function POST(req: Request) {
  try {
    const { to, subject, templateName, data } = await req.json();

    if (!to || !subject || !templateName) {
      return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 });
    }

    let html = '';
    switch (templateName) {
      case 'verification':
        html = templates.getVerificationTemplate(data.link);
        break;
      case 'password-reset':
        html = templates.getPasswordResetTemplate(data.link);
        break;
      case 'lesson-planned':
        html = templates.getLessonPlannedTemplate(data);
        break;
      case 'lesson-cancelled':
        html = templates.getLessonCancelledTemplate(data);
        break;
      case 'lesson-rescheduled':
        html = templates.getLessonRescheduledTemplate(data);
        break;
      case 'feedback':
        html = templates.getFeedbackTemplate(data);
        break;
      default:
        return NextResponse.json({ error: 'Geçersiz şablon ismi.' }, { status: 400 });
    }

    const { error, data: resendData } = await resend.emails.send({
      from: `Türk Çocuk Akademisi <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: resendData?.id });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
