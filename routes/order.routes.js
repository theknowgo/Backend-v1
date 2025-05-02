import express from "express";
const router = express.Router();

import orderController from "../controllers/order.Controller.js";
import { authUser } from "../middlewares/authMiddleware.js";

// Order routes
router.post("/", orderController.createOrder);
router.get("/order/:orderId", authUser, orderController.getOrder);
router.patch(
  "/order/toggle/:orderId",
  authUser,
  orderController.toggleFevOrder
);
router.get("/orders/:userId", authUser, orderController.listOrdersByUserID);
router.patch("/accept/:orderId", authUser, orderController.acceptOrder);

export default router;