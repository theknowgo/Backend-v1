import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
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
    default: false,
  },
  userType: {
    type: String,
    required: true,
    enum: ["Customer", "Localmate"],
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
  userPFP: { type: String },
  isAvailable: { type: Boolean, default: false },
  currentLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
});

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
