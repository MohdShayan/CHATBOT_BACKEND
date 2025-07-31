import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String, 
    enum: ["user", "bot"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  chatTitle: {
    type: String,
    default: "New Chat"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  messages: [messageSchema] 
});

const CHAT = mongoose.model("chat", chatSchema);
export default CHAT;
