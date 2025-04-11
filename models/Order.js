import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderDetailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderDetail",
    required: true,
  },
  status: {
    type: String,
    enum: ["Completed", "Ongoing", "Cancelled"],
    required: true,
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  dropAddress: {
    type: String,
    required: true,
  },
  isFev: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
