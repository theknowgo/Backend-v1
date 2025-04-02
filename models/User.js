import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    is18plus: {
      type: Boolean,
      required: true,
      default: false,
    },
    userType: {
      type: String,
      enum: ["Customer", "Localmate"],
      required: true,
    },
    contactNumber: {
      type: String, // Changed from Number to String
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^[6-9]\d{9}$/.test(v),
        message: (props) =>
          `${props.value} is not a valid Indian contact number!`,
      },
    },
    banCount: { type: Number, default: 0 },
    banExpiration: { type: Date, default: null },
    isPermanentlyBanned: { type: Boolean, default: false },
    fevServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    feedback: { type: String },
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAddress",
    },
    userPFP: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "online"],
      default: "inactive",
    },
  },
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, userType: this.userType },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
