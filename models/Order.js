import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
      enum: ["Pending", "Accepted", "Ongoing", "Completed", "Cancelled"],
      required: true,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
