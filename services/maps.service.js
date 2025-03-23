import axios from "axios";
import User from "../models/User.js";

export const getAddressCoordinate = async (address) => {
  const apiKey = process.env.OLA_MAPS_API;
  if (!apiKey) {
    throw new Error("OLA_MAPS_API key is missing");
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.olamaps.io/places/v1/geocode?address=${encodedAddress}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (
      response.data.status === "ok" &&
      response.data.geocodingResults.length > 0
    ) {
      const firstResult = response.data.geocodingResults[0];
      const location = firstResult.geometry.location;
      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      console.error(`Error: ${response.data.message}`);
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    // Log error details
    console.error(`Error from getAddressCoordinate: ${error.message}`);
    throw error;
  }
};

export const getAddressDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.OLA_MAPS_API;

  if (!apiKey) {
    throw new Error("OLA_MAPS_API key is missing");
  }
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDestination = encodeURIComponent(destination);
  const url = `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${encodedOrigin}&destinations=${encodedDestination}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "SUCCESS") {
      const rows = response.data.rows;
      const distancesAndDurations = rows
        .map((row, rowIndex) => {
          return row.elements.map((element, elementIndex) => {
            if (element.status === "OK") {
              return {
                row: rowIndex + 1,
                element: elementIndex + 1,
                distance: element.distance, //(usually in meters)
                duration: element.duration, // ((usullly in seconds)
              };
            } else {
              return {
                row: rowIndex + 1,
                element: elementIndex + 1,
                status: element.status,
              };
            }
          });
        })
        .flat();

      return distancesAndDurations;
    } else {
      throw new Error("Unable to fetch distance and time");
    }
  } catch (err) {
    console.error("Error fetching data:", err.response.data.message);
    throw err.response.data.message;
  }
};

export const getActiveUsers = async (latitude, longitude, radius) => {
  try {
    const users = await User.find(
      {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 6378.1],
          },
        },
        status: "active",
      },
      { _id: 1, name: 1, location: 1 }
    ).lean();
    return users;
  } catch (error) {
    console.error("Error fetching active users:", error);
    throw error;
  }
};

export const getSuggestions = async (input) => {
  const apiKey = process.env.OLA_MAPS_API;
  const encodedInput = encodeURIComponent(input);
  const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodedInput}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "ok") {
      return response.data.predictions.map((prediction) => ({
        description: prediction.description,
        placeId: prediction.place_id,
      }));
    } else {
      throw new Error("Unable to fetch autocomplete suggestions");
    }
  } catch (error) {
    console.error(
      "Error fetching autocomplete suggestions:",
      error.response.data.message
    );
    throw error.response.data.message;
  }
};
