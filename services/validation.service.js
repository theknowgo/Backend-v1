import { body } from "express-validator";

export const validateUserRegistration = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("is18plus").notEmpty().withMessage("Date of birth is required"),
  body("userType")
    .isIn(["Admin", "Customer", "Partner"])
    .withMessage("Invalid user type"),
  body("contactNumber")
    .notEmpty()
    .withMessage("Contact number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Contact number must be a valid Indian mobile number"),
];

export const validateUserLogin = [
  body("contactNumber")
    .notEmpty()
    .withMessage("Contact number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Contact number must be a valid Indian mobile number"),
  body("hashedOTP").notEmpty().withMessage("Hashed OTP is required"),
  body("inputOTP").notEmpty().withMessage("OTP is required"),
];

export const validateRating = [
  body("partnerId")
    .notEmpty()
    .withMessage("Partner ID is required")
    .isString()
    .withMessage("Partner ID must be a string"),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
];
