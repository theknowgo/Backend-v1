import express from "express";
const router = express.Router();

import orderController from "../controllers/order.Controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

// Order routes
router.post("/", orderController.createOrder);
router.get("/:orderId", authUser, orderController.getOrder);
router.patch("/toggle/:orderId", authUser, orderController.toggleFevOrder);
router.get("/user/:userId", authUser, orderController.listOrdersByUserID);
router.patch("/accept/:orderId", authUser, orderController.acceptOrder);
router.patch("/complete/:orderId", authUser, orderController.completeOrder);

export default router;
