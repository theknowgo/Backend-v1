import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import Chat from "./models/chats.model.js";
import { storeChatRedis } from "./config/resisConfig.js";

const port = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
