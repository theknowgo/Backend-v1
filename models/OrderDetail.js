import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema({
  odId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true,
  },
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
  situation: {
    type: String,
    required: true,
  },
});

const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);

export default OrderDetail;
