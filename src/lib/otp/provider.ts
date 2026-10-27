import { devOtpEnabled, isProd } from "../config";
import { AppError } from "../state";

export type OtpChannel = "whatsapp" | "sms";

export interface OtpProvider {
  readonly name: string;
  send(phoneE164: string, code: string, channel?: OtpChannel): Promise<{ devCode?: string; channel: OtpChannel }>;
}

/**
 * Meta WhatsApp Cloud API Provider.
 * Activated when WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID are configured in environment.
 */
class WhatsAppCloudProvider implements OtpProvider {
  readonly name = "whatsapp_cloud";
  constructor(private token: string, private phoneNumberId: string) {}

  async send(phoneE164: string, code: string, channel: OtpChannel = "whatsapp"): Promise<{ devCode?: string; channel: OtpChannel }> {
    const cleanPhone = phoneE164.replace(/\D/g, "");
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: cleanPhone,
          type: "text",
          text: {
            preview_url: false,
            body: `مددگار تصدیقی کوڈ (Maddadgaar Code): ${code}\n\nیہ کوڈ کسی کو نہ بتائیں۔ Valid for 5 minutes.`,
          },
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.error("WhatsApp Cloud API delivery failure:", errJson);
        if (devOtpEnabled()) {
          return { devCode: code, channel };
        }
        throw new AppError("Could not deliver verification code via WhatsApp. Please check your number or try SMS.");
      }
      return { channel };
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      console.error("WhatsApp Cloud API exception:", err);
      if (devOtpEnabled()) {
        return { devCode: code, channel };
      }
      throw new AppError("WhatsApp delivery service is currently unreachable. Please try again shortly.");
    }
  }
}

/**
 * Twilio Provider (Supports both WhatsApp and SMS).
 */
class TwilioProvider implements OtpProvider {
  readonly name = "twilio";
  constructor(
    private sid: string,
    private token: string,
    private fromWhatsApp?: string,
    private fromSms?: string,
  ) {}

  async send(phoneE164: string, code: string, channel: OtpChannel = "whatsapp"): Promise<{ devCode?: string; channel: OtpChannel }> {
    const isWhatsApp = channel === "whatsapp" && this.fromWhatsApp;
    const from = isWhatsApp ? `whatsapp:${this.fromWhatsApp}` : (this.fromSms || "+14155238886");
    const to = isWhatsApp ? `whatsapp:${phoneE164}` : phoneE164;
    const body = `Maddadgaar verification code: ${code}. Valid for 5 minutes.`;

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.sid}/Messages.json`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${this.sid}:${this.token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Twilio send failure:", errText);
        if (devOtpEnabled()) {
          return { devCode: code, channel };
        }
        throw new AppError("Could not deliver verification SMS. Please check your mobile number.");
      }
      return { channel };
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      console.error("Twilio exception:", err);
      if (devOtpEnabled()) {
        return { devCode: code, channel };
      }
      throw new AppError("SMS delivery service is currently unreachable. Please try again shortly.");
    }
  }
}

const devProvider: OtpProvider = {
  name: "development",
  async send(_phone, code, channel = "whatsapp") {
    if (!devOtpEnabled()) {
      throw new AppError("Verification provider is not configured for production delivery.");
    }
    return { devCode: code, channel };
  },
};

export function getOtpProvider(): OtpProvider | null {
  const env = process.env;
  if (env.WHATSAPP_API_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID) {
    return new WhatsAppCloudProvider(env.WHATSAPP_API_TOKEN, env.WHATSAPP_PHONE_NUMBER_ID);
  }
  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
    return new TwilioProvider(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN, env.TWILIO_WHATSAPP_FROM, env.TWILIO_PHONE_NUMBER);
  }
  // If we are in local dev and ENABLE_DEV_OTP is explicitly enabled:
  if (devOtpEnabled()) {
    return devProvider;
  }
  // Otherwise in production without providers, return null so caller throws AppError
  return null;
}
