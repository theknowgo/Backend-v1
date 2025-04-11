import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema({
  addressId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const UserAddress = mongoose.model("UserAddress", userAddressSchema);

export default UserAddress;
