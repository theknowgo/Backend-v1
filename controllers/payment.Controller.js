import Payment from "../models/Payment.js";

const createResponse = (res, statusCode, status, message, data) => {
  res.status(statusCode).json({
    status: status,
    message: message,
    data: data,
  });
};

export const createPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, currency, thirdPartyPaymentId, status } =
      req.body;
    const newPayment = await Payment.create({
      orderId,
      userId,
      amount,
      currency,
      thirdPartyPaymentId,
      status,
    });
    createResponse(res, 201, true, "Payment created successfully", newPayment);
  } catch (error) {
    createResponse(res, 400, false, error.message, null);
  }
};

export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ PaymentId: req.params.paymentId });
    if (!payment) {
      return createResponse(res, 404, false, "Payment not found", null);
    }
    createResponse(res, 200, true, "Payment retrieved successfully", payment);
  } catch (error) {
    createResponse(res, 400, false, error.message, null);
  }
};
