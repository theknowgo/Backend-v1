import mongoose from "mongoose";

const helpAndSupportSchema = new mongoose.Schema({
  // userID: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  userID: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Opened", "Closed"],
    required: "true",
    default: "Pending",
  },
  title: {
    type: String,
    enum: ["Froud", "Technical", "Payment", "Other"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  closedAt: {
    type: Date,
  },
});

const HelpAndSupport = mongoose.model("HelpAndSupport", helpAndSupportSchema);

export default HelpAndSupport;
