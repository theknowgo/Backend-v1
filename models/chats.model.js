import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatId: String,
  sender: String,
  message: String,
  imageUrl: String,
  timestamp: { type: Date, default: Date.now, expires: "3d" },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
