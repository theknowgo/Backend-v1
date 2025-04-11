import Order from "../models/Order.js";
import { createResponse } from "../utils/helpers.js";

const createOrder = async (req, res) => {
  try {
    const { customerId, category, description, fare, localmateId } = req.body;

    const { error } = validateOrder(req.body);
    if (error) {
      return res
        .status(400)
        .json(createResponse(false, error.details[0].message, null));
    }

    const newOrder = await Order.create({
      customerId,
      category,
      description,
      fare,
      localmateId,
      status: "Pending",
    });

    res
      .status(201)
      .json(createResponse(true, "Order created successfully", newOrder));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate("customerId")
      .populate("partnerId")
      .populate("orderDetailId");
    if (!order) {
      return res
        .status(404)
        .json(createResponse(false, "Order not found", null));
    }
    res.status(200).json(createResponse(true, "Order found", order));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("orderDetailId");
    res.status(200).json(createResponse(true, "Orders found", orders));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};
const listOrdersByUserID = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return res
        .status(400)
        .json(createResponse(false, "Invalid or missing userId", null));
    }

    const orders = await Order.find({ customerId: userId });
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json(createResponse(false, "No orders found for this user", null));
    }
    res
      .status(200)
      .json(createResponse(true, "Orders found by userID", orders));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

const toggleFevOrder = async (req, res) => {
  try {
    const { orderId } = req.params.orderId;
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res
        .status(404)
        .json(createResponse(false, "Order not found", null));
    }

    order.isFev = !order.isFev;
    await order.save();

    res.status(200).json(createResponse(true, "Order marked as Toggled", null));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

export default {
  createOrder,
  getOrder,
  toggleFevOrder,
  listOrdersByUserID,
  listOrders,
};
