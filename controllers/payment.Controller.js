import Cashfree from "../config/paymentConfig.js";
import Order from "../models/Order.js";
import crypto from "crypto"; // use 'import' instead of 'require'
const baseURL = process.env.BASE_URL || "http://localhost:5000";

const createPaymentOrder = async (req, res) => {
  const {
    orderId,
    customerid,
    amount,
    customerName,
    customerEmail,
    customerPhone,
  } = req.body;

  try {
    const response = await Cashfree.PGCreateOrder({
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerid,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `https://yourapp.com/payment-response?order_id=${orderId}`,
        notify_url: `${baseURL}/api/v1/cashfree/webhook`,
      },
    });

    const { payment_session_id } = response.data;
    res.status(200).json({
      success: true,
      sessionId: payment_session_id,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create Cashfree order",
    });
  }
};

const verifyCashfreeWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-cf-signature"];
    const rawBody = req.rawBody;
    const CASHFREE_WEBHOOK_SECRET = process.env.CASHFREE_WEBHOOK_SECRET;

    if (!verifySignature(rawBody, signature, CASHFREE_WEBHOOK_SECRET)) {
      return res.status(401).send("Invalid signature");
    }

    const { event, data } = req.body;
    const orderId = data?.order?.order_id;

    if (event === "PAYMENT_SUCCESS") {
      const order = await Order.findOne({ _id: orderId });
      if (order?.status === "Ongoing") {
        order.status = "Completed";
        order.completedAt = new Date();
        await order.save();

        console.log(`✅ Order ${orderId} marked complete via verified webhook`);
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.status(500).send("Server error");
  }
};

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const digest = hmac.digest("base64");
  return digest === signature;
}

export default {
  createPaymentOrder,
  verifyCashfreeWebhook,
};
