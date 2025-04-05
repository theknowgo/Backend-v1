import crypto from "crypto";
import client from "../config/redisConfig.js"; // Redis client
import sendOtp from "../config/twillioConfig.js"; // Twilio client
const storeOTP = async (phoneNumber, otp) => {
  try {
    await client.setEx(`loginotp:${phoneNumber}`, 120, otp); // Store OTP in Redis with 2 min expiration
    console.log(`✅ OTP stored for ${phoneNumber}`);
  } catch (error) {
    console.error("❌ Error storing OTP:", error);
  }
};

export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const storedOTP = await client.get(`loginotp:${phoneNumber}`); // Get OTP from Redis
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
    const otp = await generateAndStoreOTP(phone);
    sendOtp(phone, otp); // Send OTP using Twilio
    console.log("OTP sent to", phone);

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
