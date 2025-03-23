import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getActiveUsersWithinRadius,
  validateRequest,
} from "../controllers/map.Controller.js";
import { query } from "express-validator";

const router = express.Router();

router.get(
  "/get-coordinates",
  query("address").isString().isLength({ min: 3 }),
  validateRequest,
  authUser,
  getCoordinates
);

router.get(
  "/get-distance-time",
  [
    query("origin").isString().isLength({ min: 3 }),
    query("destination").isString().isLength({ min: 3 }),
  ],
  validateRequest,
  authUser,
  getDistanceTime
);

router.get(
  "/get-suggestions",
  query("input").isString().isLength({ min: 3 }),
  validateRequest,
  authUser,
  getAutoCompleteSuggestions
);

router.get(
  "/get-active-users-within-radius",
  query("latitude").isNumeric(),
  query("longitude").isNumeric(),
  query("radius").isNumeric(),
  validateRequest,
  authUser,
  getActiveUsersWithinRadius
);

export default router;
