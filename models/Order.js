import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    localmateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Ongoing", "Completed", "Cancelled"],
      required: true,
      default: "Pending",
    },
    fare: {
      type: Number,
      required: true,
    },
    deliverdAt: {
      type: Date,
    },
    orderAt: {
      type: Date,
      default: Date.now,
    },
    category: [
      {
        type: String,
        enum: [
          "Shopping and product delivery",
          "Information",
          "Quick check",
          "Services",
        ],
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
