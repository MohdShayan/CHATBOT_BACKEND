import express from "express";
import { connectDb } from "./ConnectDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import cors from "cors";
import { checkForAuthCookie } from "./middleware/auth.js";

dotenv.config();

connectDb();
const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://geekbot-eight.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", checkForAuthCookie("gfgauthToken"), chatRoutes);


export default app;
