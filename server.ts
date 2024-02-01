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

// Connect to MongoDB
connectDatabase();
connectRedisDatabase();
// Middleware
app.use(express.json());
// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", subTaskRoutes);

// cron.schedule("* * * * *", () => {
//   // console.log("running a task every minute");
//   CalucaltePriority();
// });

// cron.schedule("*/2 * * * *", () => {
//   // console.log("running a task every minute");
//   VoiceCallUser();
// });

CalucaltePriority();

VoiceCallUser();

client.on("error", (err) => {
  console.log("Redis error: ", err);
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
