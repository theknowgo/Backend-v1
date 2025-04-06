import {
  handleValidationErrors,
  checkUserExistsByNumber,
  createResponse,
} from "../utils/helpers.js";
import { createUser } from "../services/user.service.js";
import BlockedToken from "../models/blockedTokken.js";
import User from "../models/User.js";
import Rating from "../models/rating.js";
import { verifyOTP } from "../services/otp.service.js";
import client from "../config/redisConfig.js"; // Redis client

// Login User
const loginUser = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { contactNumber, inputOTP, userType } = req.body;

  if (!(await verifyOTP(contactNumber, inputOTP))) {
    return res.status(401).json(createResponse(false, "Invalid OTP"));
  }

  let user = await User.findOne({ contactNumber });

  if (user) {
    if (user.isPermanentlyBanned) {
      return res
        .status(403)
        .json(
          createResponse(false, "Your account has been permanently banned")
        );
    }

    if (user.banExpiration && new Date() < user.banExpiration) {
      return res.status(403).json(
        createResponse(false, "Your account is temporarily banned", {
          banExpiration: user.banExpiration,
        })
      );
    }

    const token = user.generateAuthToken();
    return res.status(200).json(
      createResponse(true, "User login successfully", {
        user,
        token,
        isNewUser: false,
      })
    );
  } else {
    if (userType !== "Customer") {
      return res
        .status(400)
        .json(createResponse(false, "Localmate not found with this number"));
    }

    try {
      user = await User.create({ contactNumber });
      const token = user.generateAuthToken();
      return res.status(201).json(
        createResponse(true, "User created successfully", {
          user,
          token,
          isNewUser: true,
        })
      );
    } catch (error) {
      return res.status(400).json(createResponse(false, error.message));
    }
  }
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    const token = req.token;
    await client.setEx(`blockedToken:${token}`, 24 * 60 * 60, "blocked");
    res.status(200).json(createResponse(true, "Logged out Successfully"));
  } catch (error) {
    res.status(500).json(createResponse(false, error.message));
  }
};

// Submit Rating
const submitRating = async (req, res) => {
  try {
    const { partnerId, rating } = req.body;

    const partner = await User.findOne({
      userId: partnerId,
      userType: "Partner",
    });
    if (!partner) {
      return res.status(404).json(createResponse(false, "Partner not found"));
    }

    const newRating = new Rating({ partnerId, rating });
    await newRating.save();

    if (rating === 1) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const oneStarRatings = await Rating.countDocuments({
        partnerId,
        rating: 1,
        createdAt: { $gte: startOfDay },
      });

      if (oneStarRatings >= 3) {
        partner.banCount += 1;

        if (partner.banCount === 1) {
          partner.banExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
        } else if (partner.banCount === 2) {
          partner.banExpiration = new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          );
        } else if (partner.banCount >= 3) {
          partner.isPermanentlyBanned = true;
          partner.banExpiration = null;
        }

        await partner.save();

        return res.status(200).json(
          createResponse(true, "Rating submitted and ban applied", {
            banDetails: {
              count: partner.banCount,
              expiration: partner.banExpiration,
              permanent: partner.isPermanentlyBanned,
            },
          })
        );
      }
    }

    res.status(200).json(createResponse(true, "Rating submitted successfully"));
  } catch (error) {
    res.status(500).json(createResponse(false, error.message));
  }
};

// Update User Details
const updateUserDetails = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const userId = req.params.id;
    // Validate input
    if (!userId || !firstName || !lastName) {
      return res
        .status(400)
        .json(createResponse(false, "Missing required fields"));
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { firstName: firstName, lastName: lastName },
      { new: true }
    );

    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    res
      .status(200)
      .json(createResponse(true, "User details updated successfully", user));
  } catch (error) {
    res.status(500).json(createResponse(false, error.message));
  }
};

const setUserPFP = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    if (!imageUrl) {
      return res.status(400).json(createResponse(false, "No image uploaded"));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    user.userPFP = imageUrl;
    await user.save();
    return res.status(200).json(createResponse(true, "PFP set successfully"));
  } catch (error) {
    res.status(500).json(createResponse(false, error.message));
  }
};

// Set Default Address
const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    user.defaultAddress = addressId;
    await user.save();
    return res
      .status(200)
      .json(createResponse(true, "Default address set successfully"));
  } catch (error) {
    res.status(500).json(createResponse(false, error.message));
  }
};

export default {
  loginUser,
  logoutUser,
  submitRating,
  updateUserDetails,
  setUserPFP,
  setDefaultAddress,
};
