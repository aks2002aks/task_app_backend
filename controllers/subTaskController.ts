import { Request, Response } from "express";
import SubTask from "../models/subtask";
import Task from "../models/task";

async function createSubTask(req: Request, res: Response) {
  try {
    const { taskId } = req.body;

    const newSubTask = new SubTask({
      task_id: taskId,
      status: 0,
    });

    const savedSubTask = await newSubTask.save();

    res.status(201).json(savedSubTask);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllSubTasks(req: Request, res: Response) {
  try {
    const { page, limit, taskId } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;

    const skip = (pageNumber - 1) * pageSize;

    const totalTasks = await SubTask.countDocuments({ task_id: taskId });
    const totalPages = Math.ceil(totalTasks / pageSize);

    const subTasks = await SubTask.find({ task_id: taskId, deleted_at: null })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      subTasks,
      currentPage: pageNumber,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function setSubTaskStatus(req: Request, res: Response) {
  try {
    const { subTaskId, status, taskId } = req.body;
    const updatedTask = await SubTask.findOneAndUpdate(
      { _id: subTaskId },
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    try {
      if (status == 1) {
        const updatedTask = await Task.findOneAndUpdate(
          { _id: taskId },
          { status: "IN_PROGRESS" },
          { new: true }
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteSubTask(req: Request, res: Response) {
  try {
    const { subTaskId } = req.body;

    const deletedTask = await SubTask.findOneAndUpdate(
      { _id: subTaskId },
      { deleted_at: new Date() },
      { new: true }
    );

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ success: true, deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
export { createSubTask, getAllSubTasks, setSubTaskStatus, deleteSubTask };
