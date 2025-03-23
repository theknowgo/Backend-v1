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
