/**
 * SABS-Approved WhatsApp Business Notification Service
 * Handles live transactional messages for orders, packaging queues, and courier dispatches.
 * 
 * Supports two production pipelines:
 * 1. Meta WhatsApp Business Cloud API (Recommended - Direct integration)
 * 2. Twilio WhatsApp Messaging Gateway (Easiest for sandbox testing)
 */

interface SendWhatsAppParams {
  toPhone: string;
  customerName: string;
  orderId: string;
  totalPrice?: number;
  messageBody: string;
}

/**
 * Sends a real-time WhatsApp notification using Meta's Official Cloud API
 * Set the following environment variables in production:
 * - META_WHATSAPP_TOKEN
 * - META_PHONE_NUMBER_ID
 */
async function sendViaMetaCloud(params: SendWhatsAppParams): Promise<boolean> {
  const token = process.env.META_WHATSAPP_TOKEN;
  const phoneId = process.env.META_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    console.warn("Meta WhatsApp integration is not configured. Missing META_WHATSAPP_TOKEN or META_PHONE_NUMBER_ID.");
    return false;
  }

  // Format phone number to E.164 (e.g., +27821234567)
  const cleanPhone = formatSouthAfricanPhone(params.toPhone);

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: cleanPhone,
          type: "text",
          text: {
            preview_url: true,
            body: params.messageBody,
          },
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      console.error("Meta WhatsApp API error:", result);
      return false;
    }

    console.log(`WhatsApp successfully sent via Meta to ${cleanPhone} (Order: ${params.orderId})`);
    return true;
  } catch (error) {
    console.error("Meta WhatsApp dispatch failed:", error);
    return false;
  }
}

/**
 * Sends a WhatsApp notification using Twilio Messaging API
 * Set the following environment variables in production:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_WHATSAPP_SENDER (e.g., +14155238886)
 */
async function sendViaTwilio(params: SendWhatsAppParams): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const sender = process.env.TWILIO_WHATSAPP_SENDER || "+14155238886"; // Twilio Sandbox Default

  if (!sid || !token) {
    console.warn("Twilio WhatsApp integration is not configured. Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN.");
    return false;
  }

  const cleanPhone = formatSouthAfricanPhone(params.toPhone);
  const authHeader = btoa(`${sid}:${token}`);

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: `whatsapp:${sender}`,
          To: `whatsapp:${cleanPhone}`,
          Body: params.messageBody,
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      console.error("Twilio WhatsApp API error:", result);
      return false;
    }

    console.log(`WhatsApp successfully sent via Twilio to ${cleanPhone} (Order: ${params.orderId})`);
    return true;
  } catch (error) {
    console.error("Twilio WhatsApp dispatch failed:", error);
    return false;
  }
}

/**
 * Unified dispatch helper to send transactional alerts
 */
export async function sendWhatsAppNotification(params: SendWhatsAppParams): Promise<boolean> {
  // 1. Try Meta Cloud API first
  if (process.env.META_WHATSAPP_TOKEN) {
    return await sendViaMetaCloud(params);
  }
  
  // 2. Fallback to Twilio
  if (process.env.TWILIO_ACCOUNT_SID) {
    return await sendViaTwilio(params);
  }

  console.log("--- MOCK WHATSAPP NOTIFICATION ---");
  console.log(`To: ${params.toPhone}`);
  console.log(`Message:\n${params.messageBody}`);
  console.log("----------------------------------");
  return true;
}

/**
 * Utility to format SA numbers safely into E.164 international standard
 * e.g., '082 555 0100' -> '+27825550100'
 */
function formatSouthAfricanPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.startsWith("0")) {
    cleaned = "27" + cleaned.slice(1);
  }
  
  if (!cleaned.startsWith("27") && !cleaned.startsWith("+")) {
    cleaned = "27" + cleaned;
  }

  return cleaned.startsWith("+") ? cleaned : "+" + cleaned;
}
