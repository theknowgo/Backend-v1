import {
  toggleAvailability,
  updateLocation,
  findNearLocalmateNumber,
} from "../controllers/localmate.controller.js";
import express from "express";
const router = express.Router();
import { authUser, checkBanStatus } from "../middlewares/authMiddleware.js";

router.patch("/toggle-availability", authUser, toggleAvailability);
router.patch("/update-location", authUser, updateLocation);
router.get("/find-near-localmate-number", authUser, findNearLocalmateNumber);
export default router;
