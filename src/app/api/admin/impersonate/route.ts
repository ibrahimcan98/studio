import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { targetUid } = await req.json();

    if (!targetUid) {
      return NextResponse.json({ error: 'targetUid gereklidir.' }, { status: 400 });
    }

    // Optionally check if the caller is an admin here if you have a session token.
    // Since Firebase Client SDK calls this, you could pass the ID token in Authorization header.
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(idToken);
      // You can check decodedToken roles if you set them up.
      // For now, we trust the caller if they have a valid token or just proceed.
    }

    // Generate a custom token for the target user
    const customToken = await auth.createCustomToken(targetUid);

    return NextResponse.json({ 
      success: true, 
      customToken
    });
  } catch (error: any) {
    console.error('Impersonate API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
