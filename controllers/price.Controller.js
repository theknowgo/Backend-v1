import {
  calculateTotalCostOfServiceAndProduct,
  calculateCappedTimeCost,
  calculateIncrementalTimeCost,
  calculateQuickLookupCost,
} from "../services/price.service.js";
import { dynamicPrices } from "../config/dynamicPrice.js";
const serviceAndProductPrice = async (req, res) => {
  try {
    // Destructure and validate query parameters
    const { distance, timeTaken, videoCallSeconds } = req.query;

    if (!distance || !timeTaken || !videoCallSeconds) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters" });
    }

    // Convert query parameters to appropriate numeric types
    const parsedDistance = parseFloat(distance);
    const parsedTimeTaken = parseFloat(timeTaken);
    const parsedVcMin = parseFloat(videoCallSeconds) / 60; // Convert seconds to minutes

    // Validate parsed values (ensure they are valid numbers)
    if (isNaN(parsedDistance) || isNaN(parsedTimeTaken) || isNaN(parsedVcMin)) {
      return res.status(400).json({
        status: false,
        message: "Invalid query parameter values",
        data: null,
      });
    }

    // Calculate the total cost using helper function
    const totalCost = calculateTotalCostOfServiceAndProduct(
      parsedDistance,
      dynamicPrices.pricePerKm,
      dynamicPrices.platformFee,
      parsedTimeTaken,
      parseFloat(dynamicPrices.vcForFirstMinute),
      parsedVcMin
    );

    // Respond with the total cost, formatted to two decimal places
    return res.json({
      status: true,
      message: "Total cost calculated successfully",
      data: { totalCost: parseFloat(totalCost.toFixed(2)) },
    });
  } catch (error) {
    console.error("Error calculating total cost:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", data: null });
  }
};

const cappedTimeForInfo = async (req, res) => {
  const { timeInSeconds } = req.query;

  if (!timeInSeconds) {
    return res.status(400).json({
      status: false,
      message: "Missing timeInSeconds parameter",
      data: null,
    });
  }

  const parsedTimeInSeconds = parseInt(timeInSeconds);
  if (isNaN(parsedTimeInSeconds)) {
    return res.status(400).json({
      status: false,
      message: "Invalid query parameter values",
      data: null,
    });
  }

  const totalCost = calculateCappedTimeCost(parsedTimeInSeconds);
  return res.json({
    status: true,
    message: "Total cost calculated successfully",
    data: { totalCost: parseFloat(totalCost.toFixed(2)) },
  });
};

const incrementalTimeForInfo = async (req, res) => {
  const { timeInSeconds } = req.query;

  if (!timeInSeconds) {
    return res.status(400).json({
      status: false,
      message: "Missing timeInSeconds parameter",
      data: null,
    });
  }

  const parsedTimeInSeconds = parseInt(timeInSeconds);
  if (isNaN(parsedTimeInSeconds)) {
    return res.status(400).json({
      status: false,
      message: "Invalid query parameter values",
      data: null,
    });
  }

  const totalCost = calculateIncrementalTimeCost(parsedTimeInSeconds);
  return res.json({
    status: true,
    message: "Total cost calculated successfully",
    data: { totalCost: parseFloat(totalCost.toFixed(2)) },
  });
};

const quickLookup = async (req, res) => {
  try {
    const { distance, videoCallSeconds } = req.query;

    if (!distance || !videoCallSeconds) {
      return res.status(400).json({
        status: false,
        message: "Missing required query parameters",
        data: null,
      });
    }

    const parsedDistance = parseFloat(distance);
    const parsedVideoCallSeconds = parseFloat(videoCallSeconds);

    if (isNaN(parsedDistance) || isNaN(parsedVideoCallSeconds)) {
      return res.status(400).json({
        status: false,
        message: "Invalid query parameter values",
        data: null,
      });
    }

    const totalCost = calculateQuickLookupCost(
      parsedDistance,
      dynamicPrices.pricePerKm,
      dynamicPrices.platformFeeForlookup,
      parsedVideoCallSeconds,
      dynamicPrices.vcForFirstMinute
    );

    return res.json({
      status: true,
      message: "Total cost calculated successfully",
      data: { totalCost: parseFloat(totalCost.toFixed(2)) },
    });
  } catch (error) {
    console.error("Error calculating total cost:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", data: null });
  }
};

export default {
  serviceAndProductPrice,
  cappedTimeForInfo,
  incrementalTimeForInfo,
  quickLookup,
};
