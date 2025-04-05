import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD,
});

client.connect();

client.on("connect", () => {
  console.log("Redis connected successfully!");
});
client.on("error", (err) => {
  console.error("Redis Client Error", err);
});
export default client;
