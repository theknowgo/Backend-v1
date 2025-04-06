import express from "express";
import userController from "../controllers/user.Controller.js";
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
import { authUser } from "../middlewares/authMiddleware.js";
import {
  validateUserLogin,
  validateRating,
} from "../services/validation.service.js";
import { sendotp } from "../controllers/opt.controller.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// Public routes (no auth required)
router.post("/login", validateUserLogin, userController.loginUser);

// Protected routes (require authentication and ban check)
router.get("/logout", authUser, userController.logoutUser);

// User routes
router.patch("/name/:id", authUser, userController.updateUserDetails);

// set PFP route
router.patch(
  "/set-profile-picture", // Change this to "/set-profile-picture"
  upload.single("image"),
  authUser,
  userController.setUserPFP
);
// Order routes
router.post("/order", authUser, createOrder);
router.get("/order/:orderId", authUser, getOrder);

// Address routes
router.post("/address", authUser, addUserAddress);
router.get("/address/:userId", authUser, getUserAddresses);
router.patch("/address/:userId", authUser, updateUserAddress);

// Payment routes
router.post("/payment", authUser, createPayment);
router.get("/payment/:paymentId", authUser, getPayment);

// Status routes
router.patch(
  "/order/:orderId/status",
  authUser,

  updateOrderStatus
);
router.get("/orders", authUser, getOrdersByStatus);

// New rating route
router.post(
  "/rating",
  authUser,

  validateRating,
  userController.submitRating
);

//  OTP routes
router.post("/sendotp", sendotp);

export default router;
