import { validationResult } from "express-validator";
import User from "../models/User.js";

export const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

export const checkUserExistsByNumber = async (phoneNumber) => {
  return await User.findOne({ contactNumber: phoneNumber });
};

export const sendAuthResponse = (
  res,
  statusCode,
  user,
  token,
  status,
  message
) => {
  res.status(statusCode).json({ data: { token, user }, status, message });
};

export const createResponse = (status, message, data = null) => ({
  status,
  message,
  data,
});
