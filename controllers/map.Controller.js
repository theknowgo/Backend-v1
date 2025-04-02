import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getAddressDistanceTime,
  getActiveUsers,
  getSuggestions,
} from "../services/maps.service.js";
import { createResponse } from "../utils/helpers.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(createResponse(false, "Validation error", errors.array()));
  }
  next();
};

export const getCoordinates = async (req, res) => {
  try {
    const { address } = req.query;
    const coordinates = await getAddressCoordinate(address);
    res
      .status(200)
      .json(createResponse(true, "Coordinates found", coordinates));
  } catch (error) {
    res
      .status(500)
      .json(createResponse(false, "Coordinates not found", error.message));
  }
};

export const getDistanceTime = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res
        .status(400)
        .json(createResponse(false, "Origin and destination are required"));
    }

    const distanceTime = await getAddressDistanceTime(origin, destination);
    res
      .status(200)
      .json(createResponse(true, "Distance and time found", distanceTime));
  } catch (err) {
    res
      .status(500)
      .json(createResponse(false, "Internal server error", err.message));
  }
};

export const getActiveUsersWithinRadius = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;
    if (!latitude || !longitude || !radius) {
      return res
        .status(400)
        .json(
          createResponse(false, "Latitude, longitude, and radius are required")
        );
    }
    const activeUsers = await getActiveUsers(latitude, longitude, radius);
    res
      .status(200)
      .json(createResponse(true, "Active users found", activeUsers));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(createResponse(false, "Internal server error", err.message));
  }
};

export const getAutoCompleteSuggestions = async (req, res) => {
  try {
    const { input } = req.query;
    const suggestions = await getSuggestions(input);
    res
      .status(200)
      .json(createResponse(true, "Suggestions found", suggestions));
  } catch (err) {
    res
      .status(500)
      .json(createResponse(false, "Internal server error", err.message));
  }
};
