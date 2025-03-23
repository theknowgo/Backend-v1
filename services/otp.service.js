import crypto from "crypto";
import { sendWhatsAppMessage } from "../config/whatsappMessage.js";

// In-memory OTP store (after that we will setup Redis for production)
const otpStore = new Map();

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
};

export const verifyHashedOTP = (otp, hashedOTP) => {
  return hashOTP(otp) === hashedOTP;
};

export const sendOTP = async (phone) => {
  try {
    console.log("Sending OTP to", phone);
    const otp = generateAndStoreOTP(phone);
    const body = `Your OTP is ${otp}. It will expire in 5 minutes.`;
    await sendWhatsAppMessage(phone, body);
    const hashedOTP = hashOTP(otp);

    return { success: true, hashedOTP, message: "OTP sent successfully!" };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

const generateAndStoreOTP = (phone) => {
  const otp = generateOTP();
  otpStore.set(phone, otp); // Store OTP (Expire after 5 min in production)
  return otp;
};

export const verifyOTP = (phone, otp) => {
  if (otpStore.has(phone) && otpStore.get(phone) === otp) {
    otpStore.delete(phone); // Remove OTP after verification
    return { success: true, message: "OTP verified successfully!" };
  }
  return { success: false, message: "Invalid or expired OTP!" };
};
