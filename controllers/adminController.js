import User from "../models/User.js";
import { createResponse } from "../utils/helpers.js";

// Ban a User (Admin only)
export const banUser = async (req, res) => {
  try {
    const { userId, banDuration, isPermanent } = req.body;

    if (!userId) {
      return res.status(400).json(createResponse(false, "User ID is required"));
    }
    if (isPermanent !== true && (!banDuration || banDuration <= 0)) {
      return res
        .status(400)
        .json(
          createResponse(
            false,
            "Ban duration must be a positive number or permanent must be true"
          )
        );
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    if (user.userType === "Admin") {
      return res
        .status(403)
        .json(createResponse(false, "Cannot ban another admin"));
    }

    if (isPermanent) {
      user.isPermanentlyBanned = true;
      user.banExpiration = null;
      user.banCount += 1;
    } else {
      user.banExpiration = new Date(Date.now() + banDuration * 60 * 60 * 1000); // banDuration in hours
      user.banCount += 1;
      user.isPermanentlyBanned = false;
    }

    await user.save();

    const banDetails = {
      banCount: user.banCount,
      banExpiration: user.banExpiration,
      isPermanentlyBanned: user.isPermanentlyBanned,
    };

    res
      .status(200)
      .json(createResponse(true, "User banned successfully", banDetails));
  } catch (error) {
    res.status(500).json(createResponse(false, error.message));
  }
};

// Unban a User (Admin only)
export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json(createResponse(false, "User ID is required"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    if (
      !user.isPermanentlyBanned &&
      (!user.banExpiration || new Date() >= user.banExpiration)
    ) {
      return res.status(400).json(createResponse(false, "User is not banned"));
    }

    user.banCount = 0;
    user.banExpiration = null;
    user.isPermanentlyBanned = false;

    await user.save();

    res.status(200).json(createResponse(true, "User unbanned successfully"));
  } catch (error) {
    res.status(500).json(createResponse(false, error.message));
  }
};