import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  localmateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Completed", "Ongoing", "Cancelled", "Pending"],
    required: true,
  },
  pickupAddress: {
    type: {
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  dropAddress: {
    type: {
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  isFev: {
    type: Boolean,
    default: false,
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
  timeTaken: {
    type: Number,
  },
  fare: {
    type: Number,
    min: 0,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: {
    type: Date,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
