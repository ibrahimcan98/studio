import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN;

/**
 * Meta Conversions API (CAPI) helper to send events from the server.
 */
export async function sendMetaEvent({
  eventName,
  eventSourceUrl,
  userData = {},
  customData = {},
  eventId,
}: {
  eventName: string;
  eventSourceUrl: string;
  userData?: Record<string, any>;
  customData?: Record<string, any>;
  eventId?: string;
}) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('Meta CAPI: Missing PIXEL_ID or ACCESS_TOKEN');
    return;
  }

  // Hash user data if present (Meta requires SHA256)
  const hashedData: Record<string, any> = {};
  if (userData.email) hashedData.em = hashData(userData.email);
  if (userData.phone) hashedData.ph = hashData(userData.phone);
  if (userData.clientIpAddress) hashedData.client_ip_address = userData.clientIpAddress;
  if (userData.userAgent) hashedData.client_user_agent = userData.userAgent;
  if (userData.fbc) hashedData.fbc = userData.fbc;
  if (userData.fbp) hashedData.fbp = userData.fbp;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: eventSourceUrl,
        event_id: eventId, // Used for deduplication with browser pixel
        user_data: hashedData,
        custom_data: customData,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Meta CAPI Error:', error);
    return { error };
  }
}

function hashData(data: string) {
  if (!data) return '';
  return crypto
    .createHash('sha256')
    .update(data.trim().toLowerCase())
    .digest('hex');
}
