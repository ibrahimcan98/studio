import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase-admin';
import { verifyUnsubscribeToken } from '@/lib/email-unsubscribe';

const page = (title: string, message: string, form = '') => new NextResponse(`<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
  </head>
  <body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a">
    <main style="max-width:520px;margin:72px auto;padding:36px;background:#fff;border:1px solid #e2e8f0;border-radius:20px;text-align:center">
      <h1 style="font-size:24px">${title}</h1>
      <p style="color:#475569;line-height:1.6">${message}</p>
      ${form}
    </main>
  </body>
</html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

const readCredentials = (request: Request) => {
  const url = new URL(request.url);
  return {
    userId: url.searchParams.get('userId') || '',
    token: url.searchParams.get('token') || '',
  };
};

export async function GET(request: Request) {
  const { userId, token } = readCredentials(request);

  if (!userId || !token || !verifyUnsubscribeToken(userId, token)) {
    return page('Bağlantı geçersiz', 'Bu abonelikten çıkma bağlantısı geçerli değil veya artık kullanılamıyor.');
  }

  return page(
    'E-posta tercihi',
    'Duyuru ve kampanya e-postalarını almak istemediğinizi onaylıyor musunuz?',
    `<form method="post">
      <button type="submit" style="margin-top:16px;padding:12px 22px;border:0;border-radius:10px;background:#0f766e;color:#fff;font-weight:700;cursor:pointer">Abonelikten çık</button>
    </form>`,
  );
}

export async function POST(request: Request) {
  const { userId, token } = readCredentials(request);

  if (!userId || !token || !verifyUnsubscribeToken(userId, token)) {
    return page('Bağlantı geçersiz', 'Abonelik tercihiniz güncellenemedi. Lütfen e-postadaki bağlantıyı yeniden kullanın.');
  }

  await db.collection('users').doc(userId).update({
    'emailPreferences.marketingEmails': false,
    'emailPreferences.marketingUnsubscribedAt': FieldValue.serverTimestamp(),
  });

  return page('Abonelik sonlandırıldı', 'Duyuru ve kampanya e-postalarından çıkarıldınız. Hesap ve derslerle ilgili gerekli bildirimleri almaya devam edebilirsiniz.');
}
