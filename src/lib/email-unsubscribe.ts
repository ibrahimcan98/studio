import { createHmac, timingSafeEqual } from 'crypto';

const getSecret = () => {
  const secret = process.env.EMAIL_UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY;

  if (!secret) {
    throw new Error('EMAIL_UNSUBSCRIBE_SECRET veya RESEND_API_KEY tanımlı olmalıdır.');
  }

  return secret;
};

export const createUnsubscribeToken = (userId: string) =>
  createHmac('sha256', getSecret()).update(userId).digest('base64url');

export const verifyUnsubscribeToken = (userId: string, token: string) => {
  const expected = Buffer.from(createUnsubscribeToken(userId));
  const received = Buffer.from(token);

  return expected.length === received.length && timingSafeEqual(expected, received);
};
