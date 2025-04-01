import redis from "redis";

const client = redis.createClient();

client.on("error", (err) => console.error("Redis Error:", err));

const storeLocalmateLocation = async ({
  localmateId,
  phoneNumber,
  latitude,
  longitude,
}) => {
  try {
    await client.geoAdd("localmates", {
      longitude,
      latitude,
      member: `localmate:${localmateId}:${phoneNumber}`,
    });

    await client.expire(`localmate:${localmateId}:${phoneNumber}`, 300);

    console.log(`✅ Location Updated for ${localmateId}`);
  } catch (error) {
    console.error("❌ Error saving location:", error);
  }
};

const getLocalmateLocation = async (localmateId) => {
  try {
    const data = await client.hGetAll(`localmate:${localmateId}`);
    if (!data.latitude) return null; // If key expired or not found

    return {
      localmateId,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    };
  } catch (error) {
    console.error("❌ Error fetching location:", error);
    return null;
  }
};

const getNearbyKeys = async (latitude, longitude, radiusInMeters) => {
  return await client.geoSearch("localmates", {
    longitude,
    latitude,
    radius: radiusInMeters,
    unit: "m",
    WITHCOORD: true,
  });
};

export { storeLocalmateLocation, getLocalmateLocation, getNearbyKeys };
