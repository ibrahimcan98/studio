import { Resend } from 'resend';

// Only load API key from environment for security and to avoid 401 errors from old hardcoded tokens.
export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'iletisim@turkcocukakademisi.com';
