import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
// import Chat from "./models/chats.model.js";
// import { storeChatRedis } from "./config/resisConfig.js";
import { setupSocket } from './controllers/notificationController.js';

const port = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO with debug logging
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing (replace with Postman's origin if known)
    methods: ['GET'],
    allowedHeaders: ['*'],
    credentials: true
  },
  transports: ['websocket'], // Explicitly force WebSocket
  allowEIO3: true // Support older clients if needed
});

console.log('Socket.IO initialized');

setupSocket(io);
app.set('io', io);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

io.on('connection', (socket) => {
  console.log('Socket.IO connection attempt:', socket.id);
});

io.engine.on('connection_error', (err) => {
  console.log('Connection error:', err);
});

export { io };