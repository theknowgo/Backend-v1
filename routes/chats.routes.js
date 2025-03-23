import express from "express";
import upload from "../config/multerConfig.js";
import chatsController from "../controllers/chats.controller.js";

const router = express.Router();

// 🚀 API to send a chat message
router.post("/send-message", upload.single("image"), chatsController.saveChats);

// 🚀 API to fetch chat history (last 3 days)
router.get("/chat-history/:chatId", chatsController.fetchChats);

export default router;
