// server.ts

import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
import { connectDatabase } from "./database";
import cors from "cors";
import { client, connectRedisDatabase } from "./redis";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import subTaskRoutes from "./routes/subTaskRoutes";
import { CalucaltePriority } from "./cron/calculatePriority";
import { VoiceCallUser } from "./cron/voiceCallUser";
import cron from "node-cron";

dotenv.config();

const app = express();
app.use(express.json());
app.use(mongoSanitize());

// Connect to MongoDB and redisDB
connectDatabase();
connectRedisDatabase();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "https://task-app-smoky.vercel.app",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://task-app-smoky.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS"); // Include PUT method
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // If your requests include credentials like cookies

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    // Preflight request response
    return res.sendStatus(200);
  }

  // Pass control to the next middleware
  next();
});

// Routes
app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", subTaskRoutes);

cron.schedule("0 0 * * *", () => {
  // Run the task at midnight
  CalucaltePriority();
});

cron.schedule("0 16 * * *", () => {
  // Run the task at 4 PM
  VoiceCallUser();
});

// CalucaltePriority();
// VoiceCallUser();

client.on("error", (err) => {
  console.log("Redis error: ", err);
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
