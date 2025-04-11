import express from "express";
const router = express.Router();

import addressController from "../controllers/userAddress.Controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

// Order routes
router.post("/address", authUser, addressController.addUserAddress);
router.get("/address/:userId", authUser, addressController.getUserAddresses);
router.patch("/address/:userId", authUser, addressController.updateUserAddress);
router.patch(
  "/address/default/:addressId",
  authUser,
  addressController.setDefaultAddress
);

export default router;
