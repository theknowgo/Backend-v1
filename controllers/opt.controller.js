import { sendOTP, verifyOTP } from "../services/otp.service.js";
import { createResponse } from "../utils/helpers.js";

export const sendotp = async (req, res) => {
  try {
    let { contactNumber, condition } = req.body;
    if (!contactNumber) {
      return res
        .status(400)
        .json(createResponse(false, "Contact number required!"));
    }
    if (!condition) {
      return res
        .status(400)
        .json(createResponse(false, "Condition is required!"));
    }
    const phone = contactNumber.trim();
    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid phone number format!"));
    }
    const response = await sendOTP(phone, condition);
    if (!response.success) {
      return res
        .status(400)
        .json(createResponse(false, response.message || "Failed to send OTP"));
    }

    res
      .status(201)
      .json(createResponse(true, response.message || "OTP sent successfully!"));
  } catch (error) {
    console.error("Error in sendotp:", error);
    res.status(500).json(createResponse(false, "Internal server error!"));
  }
};

export const verifyotp = async (req, res) => {
  try {
    let { contactNumber, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json(createResponse(false, "Phone and OTP required!"));
    }

    phone = contactNumber.trim();
    otp = otp.trim();

    if (!/^\+91[0-9]{10}$/.test(phone)) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid phone number format!"));
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json(createResponse(false, "Invalid OTP format!"));
    }

    const response = await verifyOTP(contactNumber, otp);
    if (!response.success) {
      return res
        .status(400)
        .json(
          createResponse(false, response.message || "Failed to verify OTP")
        );
    }

    res.json(createResponse(true, "OTP verified successfully!"));
  } catch (error) {
    console.error("Error in verifyotp:", error);
    res.status(500).json(createResponse(false, "Internal server error!"));
  }
};
