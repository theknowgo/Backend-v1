import paymentController from "../controllers/payment.Controller.js";
import express from "express";
const router = express.Router();

router.post("/", paymentController.createPaymentOrder);
router.post("/verify", paymentController.verifyCashfreeWebhook);

export default router;
