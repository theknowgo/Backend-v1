import Chat from "../models/chats.model.js";
import { storeChatRedis, getActiveChat } from "../config/resisConfig.js";

const saveChats = async (req, res) => {
  try {
    const { chatId, sender, message } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const chatMessage = {
      chatId,
      sender,
      message,
      imageUrl,
      timestamp: new Date(),
    };

    // Save to Redis
    await storeChatRedis(chatId, chatMessage);

    // Save to MongoDB
    await Chat.create(chatMessage);

    res.json({
      success: true,
      message: "Chat stored successfully!",
      data: chatMessage,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🚀 API to fetch chat history (last 3 days)
const fetchChats = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const chats = await getActiveChat(chatId);

    if (chats.length === 0) {
      const chatHistory = await Chat.find({ chatId }).sort({ timestamp: 1 });
      return res.json({ success: true, data: chatHistory });
    }

    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export default { saveChats, fetchChats };