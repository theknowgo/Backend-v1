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
        .map((row) => {
          return row.elements.map((element) => {
            if (element.status === "OK") {
              return {
                distance: element.distance.text, // Extract distance in text
                duration: element.duration.text, // Extract duration in text
              };
            } else {
              return {
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
    console.error("Error fetching data:", err.response?.data?.message || err.message);
    throw err.response?.data?.message || err.message;
  }
};

const getNearbyLocalmates = async (latitude, longitude, radiusInMeters) => {
  try {
    // Get nearby localmates within the given radius
    const nearbyKeys = await getNearbyKeys(longitude, latitude, radiusInMeters);

    if (!nearbyKeys.length) return [];

    // Extract localmate IDs and phone numbers
    const localmates = nearbyKeys.map((item) => {
      const [localmateId, phoneNumber] = item.member.split(":").slice(1); // Extract from key
      return {
        localmateId,
        phoneNumber,
        latitude: item.coordinates.latitude,
        longitude: item.coordinates.longitude,
      };
    });

    return localmates;
  } catch (error) {
    console.error("❌ Error fetching nearby localmates:", error);
    throw error;
  }
};

export const getActiveUsers = async (latitude, longitude, radiusInMeters) => {
  try {
    const localmates = await getNearbyLocalmates(
      latitude,
      longitude,
      radiusInMeters
    );

    if (!localmates.length) return [];

    // Fetch details from MongoDB using phone numbers
    const users = await User.find(
      {
        phoneNumber: { $in: localmates.map((lm) => lm.phoneNumber) },
        status: "active",
      },
      { _id: 1, name: 1, phoneNumber: 1, location: 1 }
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
