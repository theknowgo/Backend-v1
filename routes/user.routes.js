import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  setDefaultAddress,
  setUserPFP,
} from "../controllers/user.Controller.js";
import { createOrder, getOrder } from "../controllers/order.Controller.js";
import {
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
} from "../controllers/userAddress.Controller.js";
// import {
//   createPayment,
//   getPayment,
// } from "../controllers/payment.Controller.js";
import {
  updateOrderStatus,
  getOrdersByStatus,
} from "../controllers/status.Controller.js";
import { authUser, checkBanStatus } from "../middlewares/authMiddleware.js";
import {
  validateUserRegistration,
  validateUserLogin,
  validateRating,
} from "../services/validation.service.js";
import { submitRating } from "../controllers/user.Controller.js";
import { sendotp, verifyotp } from "../controllers/whatsapp.controller.js";
import upload from "../config/multerConfig.js";
import { findNearLocalmateNumber } from "../controllers/localmate.controller.js";
const router = express.Router();

// Public routes (no auth required)
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);

// Protected routes (require authentication and ban check)
router.get("/logout", authUser, checkBanStatus, logoutUser);

// Order routes
router.post("/order", authUser, checkBanStatus, createOrder);
router.get("/order/:orderId", authUser, checkBanStatus, getOrder);

// Address routes
router.post("/address", authUser, checkBanStatus, addUserAddress);
router.get("/address/:userId", authUser, checkBanStatus, getUserAddresses);
router.patch("/address/:userId", authUser, checkBanStatus, updateUserAddress);

// Payment routes
// router.post("/payment", authUser, checkBanStatus, createPayment);
// router.get("/payment/:paymentId", authUser, checkBanStatus, getPayment);

// Default address route
router.patch(
  "/address/:userId/default",
  authUser,
  checkBanStatus,
  setDefaultAddress
);
// Status routes
router.patch(
  "/order/:orderId/status",
  authUser,
  checkBanStatus,
  updateOrderStatus
);
router.get("/orders", authUser, checkBanStatus, getOrdersByStatus);

// New rating route
router.post("/rating", authUser, checkBanStatus, validateRating, submitRating);

// WhatsApp OTP routes
router.post("/sendotp", sendotp);
router.post("/verifyotp", verifyotp);

// set PFP route
router.patch(
  "/set-profile-picture", // Change this to "/set-profile-picture"
  upload.single("image"),
  authUser,
  setUserPFP
);

// localmate route
router.get("/find-localmate-number", authUser, findNearLocalmateNumber);
export default router;
