import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import User from "../models/User.js";
import { createResponse } from "../utils/helpers.js";

export const createOrder = async (req, res) => {
  try {
    const { customerId, orderDetail, status } = req.body;

    const newOrderDetail = await OrderDetail.create(orderDetail);
    const partner = await User.findOne({ userType: "Partner" }).sort({
      createdAt: 1,
    });

    if (!partner) {
      return res
        .status(404)
        .json(
          createResponse(false, "No partners available at the moment", null)
        );
    }

    const newOrder = await Order.create({
      customerId,
      partnerId: partner._id,
      orderDetailId: newOrderDetail._id,
      status,
    });

    res
      .status(201)
      .json(createResponse(true, "Order created successfully", newOrder));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

export const getOrder = async (req, res) => {
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

export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId")
      .populate("partnerId")
      .populate("orderDetailId");
    res.status(200).json(createResponse(true, "Orders found", orders));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};
