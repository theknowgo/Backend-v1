import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    unique: true,
  }, // It is use to Expose the user id to the user
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name must be at least 2 characters long"],
    maxlength: [50, "First name must be less than 50 characters long"],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, "Last name must be less than 50 characters long"],
  },
  is18plus: {
    type: Boolean,
    required: [true, "Age is required"],
    default: false,
  },
  userType: {
    type: String,
    required: [true, "User type is required"],
    enum: ["Customer", "Localmate"],
    default: "Customer",
  },
  contactNumber: {
    type: Number,
    required: [true, "Contact number is required"],
    validate: {
      validator: function (v) {
        return /^[6-9]\d{9}$/.test(v.toString());
      },
      message: (props) =>
        `${props.value} is not a valid Indian contact number!`,
    },
  },
  banCount: {
    type: Number,
    default: 0,
  },
  banExpiration: {
    type: Date,
    default: null,
  },
  isPermanentlyBanned: {
    type: Boolean,
    default: false,
  },
  fevServices: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
    unique: true,
  },
  feadback: {
    type: String,
  },
  defaultAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAddress",
    require: false,
  },
  userPFP: {
    type: String,
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
