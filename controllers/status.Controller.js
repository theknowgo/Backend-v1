import Order from "../models/Order.js";

const createResponse = (status, message, data) => {
  return { status, message, data };
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status) {
      return res
        .status(400)
        .json(createResponse(false, "Missing orderId or status", null));
    }

    const validStatuses = ["Completed", "Ongoing", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid status value", null));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json(createResponse(false, "Order not found", null));
    }

    res.status(200).json(createResponse(true, "Order updated", updatedOrder));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

export const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    const validStatuses = ["Completed", "Ongoing", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid status value", null));
    }

    const orders = await Order.find({ status })
      .populate("customerId")
      .populate("partnerId")
      .populate("orderDetailId");

    res.status(200).json(createResponse(true, "Orders retrieved", orders));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};
