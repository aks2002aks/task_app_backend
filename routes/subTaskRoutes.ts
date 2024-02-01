// routes/userRoutes.ts

import express from "express";
import { isLoggedIn } from "../middleware/authMiddleware";
import {
  createSubTask,
  deleteSubTask,
  getAllSubTasks,
  setSubTaskStatus,
} from "../controllers/subTaskController";

const router = express.Router();

router.post("/createSubTask", isLoggedIn, createSubTask);
router.get("/getAllSubTasks", isLoggedIn, getAllSubTasks);
router.put("/setSubTaskStatus", isLoggedIn, setSubTaskStatus);
router.put("/deleteSubTask", isLoggedIn, deleteSubTask);

export default router;
