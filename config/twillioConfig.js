import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

// This file exports the Twilio configuration object containing the account SID and auth token.
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOtp = async (credential, otp) => {
  await client.messages.create({
    body: `Your OTP is ${otp}. It will expire in 2 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${credential}`,
  });
  console.log("OTP sent successfully to", credential);
};

export default sendOtp;
