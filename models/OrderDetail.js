import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema({
  startLocation: {
    type: String,
    required: true,
  },
  endLocation: {
    type: String,
    required: true,
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
});

const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);

export default OrderDetail;
