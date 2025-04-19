import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import client from "./config/redisConfig.js"; // Redis client

const port = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// When a localmate connects, we register their socket ID
io.on("connection", (socket) => {
  console.log("User connected!");

  // Register localmate to listen for their notifications
  socket.on("register-localmate", async (userId) => {
    try {
      await client.hSet("socketMap", userId, socket.id);
      console.log(
        `🔗 Registered localmate ${userId} with socket ID ${socket.id}`
      );
    } catch (err) {
      console.error("Error saving socket ID to Redis:", err);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const allSockets = await client.hGetAll("socketMap");
      const disconnectedUser = Object.keys(allSockets).find(
        (userId) => allSockets[userId] === socket.id
      );

      if (disconnectedUser) {
        await client.hDel("socketMap", disconnectedUser);
        console.log(`❌ Disconnected user ${disconnectedUser}`);
      }
    } catch (err) {
      console.error("Error removing socket ID from Redis:", err);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { io };
