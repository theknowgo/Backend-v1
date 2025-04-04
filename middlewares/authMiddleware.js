import User from "../models/User.js";
import jwt from "jsonwebtoken";
import BlockedToken from "../models/blockedTokken.js";

export const authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const blockedToken = await BlockedToken.findOne({ token });

  if (blockedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded._id;
    req.token = token;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const checkBanStatus = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.isPermanentlyBanned) {
    return res
      .status(403)
      .json({ message: "Your account has been permanently banned" });
  }
  if (user.banExpiration && new Date() < user.banExpiration) {
    return res.status(403).json({
      message: "Your account is temporarily banned",
      banExpiration: user.banExpiration,
    });
  }
  next();
};
