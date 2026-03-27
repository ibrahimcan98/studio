import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY || '';
  return NextResponse.json({
    length: key.length,
    prefix: key.substring(0, 10),
    suffix: key.substring(key.length - 4),
    envLoaded: !!process.env.STRIPE_SECRET_KEY,
  });
}
