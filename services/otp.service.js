import crypto from "crypto";
import { sendWhatsAppMessage } from "../config/whatsappMessage.js";
import client from "../config/redisConfig.js"; // Redis client

const otpStore = new Map(); // In-memory store for OTPs (for demonstration purposes)
const storeOTP = async (phoneNumber, otp) => {
  try {
    // await client.setEx(`loginotp:${phoneNumber}`, 120, otp); // Store OTP in Redis with 2 min expiration
    otpStore.set(phoneNumber, otp); // Store OTP in in-memory store
    console.log(`✅ OTP stored for ${phoneNumber}`);
  } catch (error) {
    console.error("❌ Error storing OTP:", error);
  }
};

export const verifyOTP = async (phoneNumber, otp) => {
  try {
    // const storedOTP = await client.get(`loginotp:${phoneNumber}`); // Get OTP from Redis
    const storedOTP = otpStore.get(phoneNumber); // Get OTP from in-memory store
    if (!storedOTP) {
      console.log(`OTP expired or not found for ${phoneNumber}`);
      return false;
    }
    if (storedOTP === otp) {
      // await client.del(`loginotp:${phoneNumber}`);
      otpStore.delete(phoneNumber); // Remove OTP after verification
      console.log(`✅ OTP verified for ${phoneNumber}`);
      return true;
    } else {
      console.log(`❌ OTP verification failed for ${phoneNumber}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    return false;
  }
};

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTP = async (phone) => {
  try {
    console.log("Sending OTP to", phone);
    const otp = await generateAndStoreOTP(phone);
    const body = `Your OTP is ${otp}. It will expire in 2 minutes.`;
    // await sendWhatsAppMessage(phone, body);
    console.log("OTP sent to", phone, body);

    return {
      success: true,
      message: `OTP sent successfully! Temp OTP = ${otp}`,
    };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

const generateAndStoreOTP = async (phone) => {
  const otp = generateOTP();
  await storeOTP(phone, otp); // Store OTP in Redis with 2 min expiration
  return otp;
};

// export const verifyOTP = (phone, otp) => {
//   if (otpStore.has(phone) && otpStore.get(phone) === otp) {
//     otpStore.delete(phone); // Remove OTP after verification
//     return { success: true, message: "OTP verified successfully!" };
//   }
//   return { success: false, message: "Invalid or expired OTP!" };
// };
