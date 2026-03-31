import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { email, password, permissions } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre gereklidir.' }, { status: 400 });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true,
      displayName: email.split('@')[0],
    });

    // 2. Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email.toLowerCase(),
      role: 'admin',
      permissions: permissions || [],
      createdAt: FieldValue.serverTimestamp(),
      isActive: true,
      firstName: email.split('@')[0],
      lastName: 'Admin'
    });

    return NextResponse.json({ 
      success: true, 
      uid: userRecord.uid,
      message: 'Admin başarıyla oluşturuldu.' 
    });
  } catch (error: any) {
    console.error('Create Admin API Error:', error);
    if (error.code === 'auth/email-already-exists') {
        return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanımda.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
