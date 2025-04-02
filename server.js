import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
// Import necessary models and config
import { storeLocalmateLocation } from "./config/redisConfig.js";
import { setupSocket } from './controllers/notificationController.js';
// import Chat from "./models/chats.model.js"; // Uncomment if needed
// import { storeChatRedis } from "./config/redisConfig.js"; // Uncomment if needed

const port = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const localmates = new Map();
const clients = new Map();

io.on("connection", (socket) => {
  console.log("✅ Localmate connected:", socket.id);

  // Store Localmate's socket ID
  socket.on("register", ({ localmateId }) => {
    localmates.set(localmateId, socket.id);
    console.log(`Localmate ${localmateId} registered with socket ID ${socket.id}`);
  });

  socket.on("registerClient", ({ clientId }) => {
    clients.set(clientId, socket.id);
    console.log(`Client ${clientId} registered with socket ID ${socket.id}`);
  });

  // Handle location updates
  socket.on("updateLocation", async ({ localmateId, phoneNumber, latitude, longitude }) => {
    try {
      await storeLocalmateLocation({
        localmateId,
        phoneNumber,
        latitude,
        longitude,
      });

      // If Localmate is assigned to an order, notify the client
      const assignedOrder = await Order.findOne({
        localmateId,
        status: "ongoing",
      });
      if (assignedOrder) {
        const clientSocketId = clients.get(assignedOrder.clientId);
        if (clientSocketId) {
          io.to(clientSocketId).emit("localmateLocation", {
            localmateId,
            latitude,
            longitude,
          });
          console.log(`Notified client ${assignedOrder.clientId} of localmate location update.`);
        }
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    localmates.forEach((value, key) => {
      if (value === socket.id) {
        localmates.delete(key);
      }
    });
    clients.forEach((value, key) => {
      if (value === socket.id) {
        clients.delete(key);
      }
    });
  });
});

// Initialize Socket.IO with debug logging
console.log('Socket.IO initialized');

// Setup additional Socket configuration if necessary
setupSocket(io);

// Set the io instance for use in the app
app.set('io', io);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { io };