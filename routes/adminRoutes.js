import express from "express";
import { banUser, unbanUser } from "../controllers/adminController.js";
import isAdmin from "../middlewares/adminMiddleware.js";
import { authUser, checkBanStatus } from "../middlewares/authMiddleware.js";
import { createLog } from "../controllers/logController.js";

const router = express.Router();

// Ban a user (requires authentication, admin access, and ban status check)
router.post("/ban", authUser, checkBanStatus, isAdmin, createLog, banUser);

// Unban a user (requires authentication, admin access, and ban status check)
router.post("/unban", authUser, checkBanStatus, isAdmin, createLog, unbanUser);

export default router;