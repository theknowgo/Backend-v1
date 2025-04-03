import redis from "redis";

const client = redis.createClient();
// client.connect();
client.on("error", (err) => console.error("Redis Error:", err));

// client.on("connect", () => {
//   console.log("Redis connected successfully!");
// });
// client.on("ready", () => {
//   console.log("Redis is ready for use!");
// });

export default client;
