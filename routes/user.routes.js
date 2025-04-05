import express from "express";
import { loginUser, logoutUser } from "../controllers/user.Controller.js";
import { createOrder, getOrder } from "../controllers/order.Controller.js";
import {
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
} from "../controllers/userAddress.Controller.js";
import {
  createPayment,
  getPayment,
} from "../controllers/payment.Controller.js";
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
import { sendotp, verifyotp } from "../controllers/opt.controller.js";

const router = express.Router();

// Public routes (no auth required)
router.post("/login", validateUserLogin, loginUser);

// Protected routes (require authentication and ban check)
router.get("/logout", authUser, logoutUser);

// Order routes
router.post("/order", authUser, checkBanStatus, createOrder);
router.get("/order/:orderId", authUser, checkBanStatus, getOrder);

// Address routes
router.post("/address", authUser, checkBanStatus, addUserAddress);
router.get("/address/:userId", authUser, checkBanStatus, getUserAddresses);
router.patch("/address/:userId", authUser, checkBanStatus, updateUserAddress);

// Payment routes
router.post("/payment", authUser, checkBanStatus, createPayment);
router.get("/payment/:paymentId", authUser, checkBanStatus, getPayment);

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
export default router;
