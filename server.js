import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import Chat from "./models/chats.model.js";
import { storeLocalmateLocation } from "./config/redisConfig.js";

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
  });
  socket.on("registerClient", ({ clientId }) => {
    clients.set(clientId, socket.id);
  });

  // Handle location updates
  socket.on(
    "updateLocation",
    async ({ localmateId, phoneNumber, latitude, longitude }) => {
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
        }
      }
    }
  );

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    localmates.delete(socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
