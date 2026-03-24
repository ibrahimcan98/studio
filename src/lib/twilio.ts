import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

const client = twilio(accountSid, authToken);

/**
 * Sends a WhatsApp message using Twilio
 * @param to The recipient's phone number (e.g., '+905051234567')
 * @param message The message content
 */
export async function sendWhatsAppMessage(to: string, message: string) {
    try {
        // Ensure the 'to' number starts with 'whatsapp:'
        const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to.startsWith('+') ? to : `+${to}`}`;
        
        const response = await client.messages.create({
            body: message,
            from: fromWhatsApp,
            to: formattedTo
        });

        console.log(`WhatsApp message sent to ${to}. SID: ${response.sid}`);
        return { success: true, sid: response.sid };
    } catch (error) {
        console.error(`Error sending WhatsApp message to ${to}:`, error);
        return { success: false, error };
    }
}
