// routes/userRoutes.ts

import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskDetails,
  setDueDate,
  setStatus,
} from "../controllers/taskController";
import { isLoggedIn } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/createTask", isLoggedIn, createTask);
router.get("/getAllTasks", isLoggedIn, getAllTasks);
router.put("/setStatus", isLoggedIn, setStatus);
router.put("/setDueDate", isLoggedIn, setDueDate);
router.put("/deleteTask", isLoggedIn, deleteTask);
router.post("/getTaskDetails", isLoggedIn, getTaskDetails);

export default router;
