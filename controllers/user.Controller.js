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

// Register User
export const registerUser = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const {
    firstName,
    lastName,
    is18plus,
    userType,
    contactNumber,
    hashedOTP,
    inputOTP,
  } = req.body;

  if (await checkUserExistsByNumber(contactNumber)) {
    return res
      .status(400)
      .json(createResponse(false, "User with this number already exists"));
  }

  if (!verifyHashedOTP(inputOTP, hashedOTP)) {
    return res.status(401).json(createResponse(false, "Invalid OTP"));
  }

  try {
    const user = await createUser({
      firstName,
      lastName,
      is18plus,
      userType,
      contactNumber,
    });

    const token = user.generateAuthToken();
    return res
      .status(201)
      .json(createResponse(true, "User created successfully", { user, token }));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message));
  }
};

// Login User
export const loginUser = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { contactNumber, inputOTP, userType } = req.body;

  const isVerified = await verifyOTP(contactNumber, inputOTP);
  if (!isVerified) {
    return res.status(401).json(createResponse(false, "Invalid OTP"));
  }

  const user = await checkUserExistsByNumber(contactNumber);

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
    return res
      .status(200)
      .json(createResponse(true, "User login successfully", { user, token }));
  } else {
    if (userType !== "Customer") {
      return res
        .status(400)
        .json(createResponse(false, "Localmate not found with this number"));
    }
    try {
      const user = await User.create({
        contactNumber,
      });

      const token = user.generateAuthToken();
      return res
        .status(201)
        .json(
          createResponse(true, "User created successfully", { user, token })
        );
    } catch (error) {
      return res.status(400).json(createResponse(false, error.message));
    }
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    await new BlockedToken({ token: req.token }).save();
    res.status(200).json(createResponse(true, "Logged out Successfully"));
  } catch (error) {
    res.status(500).json(createResponse(false, error.message));
  }
};

// Submit Rating
export const submitRating = async (req, res) => {
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
