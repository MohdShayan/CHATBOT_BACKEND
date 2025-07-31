import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import CHAT from "../schema/chat.js";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


export const handleChat = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user._id;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    let chat;
    let isNewChat = false;
    if (chatId) {
      chat = await CHAT.findOne({ _id: chatId, userId });
      if (!chat) return res.status(404).json({ error: "Chat not found" });
    } else {
      isNewChat = true;
      chat = await CHAT.create({
        userId,
        messages: [],
        chatTitle: message.slice(0, 20) || "New Chat",
      });
    }

 
    chat.messages.push({ sender: "user", content: message });

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const botReply =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply received.";

  

    chat.messages.push({ sender: "bot", content: botReply });
    await chat.save();

    return res.json({
      reply: botReply,
      chatId: chat._id,
      chatTitle: chat.chatTitle,
      isNewChat,
    });
  } catch (err) {
    console.error(" ERROR in handleChat with Gemini:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllChatsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await CHAT.find({ userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(" ERROR in getAllChatsByUser:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await CHAT.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};
