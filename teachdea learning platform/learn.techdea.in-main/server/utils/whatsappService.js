/**
 * TechDea WhatsApp Notification Service
 * Integrates with Meta WhatsApp Business Cloud API.
 * Securely uses server environment variables.
 */

export const sendWhatsAppContactNotification = async ({
  name,
  email,
  phone,
  subject,
  message
}) => {
  const token = process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminPhone =
    process.env.ADMIN_WHATSAPP_NUMBER || process.env.WHATSAPP_ADMIN_PHONE;

  const formattedText =
    `*New TechDea Contact Inquiry*\n\n` +
    `*Name:* ${name}\n` +
    `*Email:* ${email}\n` +
    `*Phone:* ${phone || "Not provided"}\n` +
    `*Subject:* ${subject}\n\n` +
    `*Message:*\n${message}\n\n` +
    `_Sent from TechDea Learning Platform_`;

  console.log("------------------------------------------");
  console.log("WHATSAPP NOTIFICATION TRIGGERED:");
  console.log(formattedText);
  console.log("------------------------------------------");

  if (!token || !phoneNumberId || !adminPhone) {
    console.warn(
      "[WhatsAppService] WhatsApp API credentials or admin phone not fully configured in .env. Message logged to console."
    );
    return {
      success: false,
      simulated: true,
      message: "WhatsApp credentials not set in environment; notification logged to server."
    };
  }

  try {
    // Normalize phone number (strip whitespace, +, -)
    const cleanPhone = adminPhone.replace(/[^0-9]/g, "");

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: cleanPhone,
          type: "text",
          text: {
            preview_url: false,
            body: formattedText
          }
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("[WhatsAppService] API Error:", result);
      return { success: false, error: result };
    }

    return {
      success: true,
      messageId: result.messages?.[0]?.id,
      data: result
    };
  } catch (error) {
    console.error("[WhatsAppService] Network error:", error.message);
    return { success: false, error: error.message };
  }
};
