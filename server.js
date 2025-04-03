import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
// Import necessary models and config
import { setupSocket } from "./controllers/notificationController.js";

const port = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// const localmates = new Map();
// const clients = new Map();

// Initialize Socket.IO with debug logging
console.log("Socket.IO initialized");

// Setup additional Socket configuration if necessary
setupSocket(io);

// Set the io instance for use in the app
app.set("io", io);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { io };
