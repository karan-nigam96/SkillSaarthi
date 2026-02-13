const axios = require('axios');

/**
 * Send SMS to a mobile number
 * @param {string} mobile - The mobile number to send to
 * @param {string} message - The message content (usually contains OTP)
 * @returns {Promise<boolean>} - Returns true if sent successfully, false otherwise
 */
const sendSms = async (mobile, message) => {
    // 1. Console Log (Always active for dev/debugging)
    console.log(`[SMS SERVICE] Sending to ${mobile}: ${message}`);

    // 2. Real SMS Service Integration (Uncomment and configure one)

    // Option A: Fast2SMS (Indian Provider - Good for simple OTPs)
    /*
    try {
        if (process.env.FAST2SMS_API_KEY) {
            const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
                params: {
                    authorization: process.env.FAST2SMS_API_KEY,
                    variables_values: message.replace('Your OTP is ', ''), // Extract OTP if using template
                    route: 'otp',
                    numbers: mobile
                }
            });
            console.log('[SMS SERVICE] Fast2SMS Response:', response.data);
            return response.data.return;
        }
    } catch (error) {
        console.error('[SMS SERVICE] Fast2SMS Error:', error.message);
    }
    */

    // Option B: Twilio (Global Provider)
    /*
    try {
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
            const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            const response = await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: mobile.startsWith('+') ? mobile : `+91${mobile}` // Ensure country code
            });
            console.log('[SMS SERVICE] Twilio SID:', response.sid);
            return true;
        }
    } catch (error) {
        console.error('[SMS SERVICE] Twilio Error:', error.message);
    }
    */

    // Default: Return true in dev mode to simulate success
    return true;
};

module.exports = sendSms;
