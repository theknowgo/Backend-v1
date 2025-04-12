import express from "express";
const router = express.Router();
import { authUser } from "../middlewares/authMiddleware.js";
import { validateRating } from "../services/validation.service.js";
import userController from "../controllers/user.Controller.js";

router.post("/", authUser, userController.submitRating);
router.get("/:userId", authUser, userController.getRatingByUserId);
export default router;
