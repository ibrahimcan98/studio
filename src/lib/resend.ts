import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_3DFgTCD8_DPvDZnoNX1fJftQHKUokKEqW');
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'iletisim@turkcocukakademisi.com';
