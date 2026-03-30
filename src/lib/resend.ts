import { Resend } from 'resend';

// Only load API key from environment for security and to avoid 401 errors from old hardcoded tokens.
export const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Build-safe (real key will be used at runtime)
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'iletisim@turkcocukakademisi.com';
