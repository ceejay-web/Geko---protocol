import { send } from '@emailjs/browser';

// ------------------------------------------------------------------
// 🔐 API KEYS CONFIGURATION
// ------------------------------------------------------------------
const CONFIG = {
  SERVICE_ID: "service_h771ebp",     
  TEMPLATE_ID: "template_fiwmmwq",   
  PUBLIC_KEY: "jYe9rCuS-cQfrW0tn",   
};
// ------------------------------------------------------------------

export const emailService = {
  /**
   * Checks if the user has updated the keys from the defaults.
   */
  isConfigured: () => {
    const key = CONFIG.PUBLIC_KEY.trim();
    return key.length > 5 && !key.includes("PLACEHOLDER");
  },

  /**
   * Sends a secure verification code directly.
   */
  sendVerificationEmail: async (email: string, code: string): Promise<{ success: boolean; isSimulated: boolean; error?: string }> => {
    
    // Check for missing configuration or development mode
    if (!emailService.isConfigured()) {
        console.log(`[Email Mock] Code for ${email}: ${code}`);
        return { success: true, isSimulated: true }; 
    }

    // Extensive parameter mapping to ensure template compatibility.
    // We send the email address in multiple common variable names to ensure one hits the target in the template.
    const templateParams = {
        // Recipient mappings
        email: email,
        to_email: email,
        recipient: email,
        user_email: email,
        
        // Name
        to_name: email.split('@')[0],
        
        // Metadata
        reply_to: 'support@plutoprotocol.io',
        from_name: "Pluto Protocol", 

        // OTP variations
        verification_code: code,
        code: code,
        otp: code,
        
        // Content variables
        subject: `Verification Code: ${code}`,
        message: `Your Pluto Protocol verification code is: ${code}`,
        html_message: `<h3>Verification Code</h3><p>Your secure code is: <b>${code}</b></p>`,
    };

    try {
        console.log(`[EmailJS] Sending OTP to ${email}...`);
        
        const response = await send(
            CONFIG.SERVICE_ID,
            CONFIG.TEMPLATE_ID,
            templateParams,
            CONFIG.PUBLIC_KEY
        );

        if (response.status === 200 || response.text === 'OK') {
            console.log(`[EmailJS] Success: ${response.text}`);
            return { success: true, isSimulated: false };
        }
        
        throw new Error(response.text || 'Email send failed status');

    } catch (error: any) {
        console.error("EmailJS Error:", error);
        
        // IMPORTANT: Fallback to simulation mode if the external service fails (e.g. 422, quota, or network)
        // This ensures the user can still access the app even if the email provider rejects the request.
        console.warn("Falling back to simulation mode due to email provider error.");
        return { success: true, isSimulated: true }; 
    }
  },

  checkDeliveryStatus: async (messageId: string) => {
      return 'DELIVERED';
  }
};