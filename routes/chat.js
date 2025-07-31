import express from "express";
import { handleChat, getAllChatsByUser, getChatById } from "../controller/chat.js";

const router = express.Router();

router.post("/", handleChat);
router.get("/", getAllChatsByUser);
router.get("/:id", getChatById);

export default router;
