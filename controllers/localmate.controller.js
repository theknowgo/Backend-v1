import user from "../models/User.js";
import { createResponse } from "../utils/helpers.js";

export const findNearLocalmateNumber = async (req, res) => {
  try {
    const { latitude, longitude, distance } = req.body;
    const localmates = await user.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          maxDistance: parseFloat(distance),
          spherical: true,
          query: {},
        },
      },
      {
        $project: {
          _id: 0,
          contactNumber: 1,
          name: 1,
          distance: 1,
        },
      },
      { $sort: { distance: 1 } },
      { $limit: 2 },
    ]);

    const result = localmates.map((mate) => ({
      name: mate.firstName + " " + mate.lastName,
      contactNumber: mate.contactNumber,
      distance: mate.distance,
    }));

    return res
      .status(200)
      .json(createResponse(true, "Localmate Find Success", result));
  } catch (error) {
    console.error(error);
    return res.status(500).json(createResponse(false, error.message));
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const userId = req.user?._id || req.user;
    if (!userId) {
      return res
        .status(400)
        .json(createResponse(false, "User ID is missing", null));
    }

    const localmate = await user.findById(userId);

    if (!localmate) {
      return res
        .status(404)
        .json(createResponse(false, "Localmate not found", null));
    }
    console.log("localmate", localmate);
    localmate.isAvailable = !localmate.isAvailable;
    console.log("localmate", localmate);
    await localmate.save();

    return res.status(200).json(
      createResponse(true, "Availability updated", {
        isAvailable: localmate.isAvailable,
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(createResponse(false, error.message));
  }
};

export const updateLocation = async (req, res) => {
  try {
    const userId = req.user;
    const { latitude, longitude } = req.body;
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid latitude or longitude", null));
    }
    const localmate = await user.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          "currentLocation.coordinates": [
            parseFloat(longitude),
            parseFloat(latitude),
          ],
        },
        $setOnInsert: { new: true },
      },
      { new: true, upsert: true }
    );

    if (!localmate) {
      return res
        .status(404)
        .json(createResponse(false, "Localmate not found", null));
    }

    return res.status(200).json(createResponse(true, "Location updated"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(createResponse(false, error.message));
  }
};
