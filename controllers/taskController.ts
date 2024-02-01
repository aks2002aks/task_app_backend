import { Request, Response } from "express";
import Task from "../models/task";

async function createTask(req: Request, res: Response) {
  try {
    const { title, description, due_date } = req.body;
    let priority: number;

    // Calculate priority based on due date
    const today = new Date();
    const dueDate = new Date(due_date);
    const timeDiff = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays === 0) {
      priority = 0;
    } else if (diffDays <= 2) {
      priority = 1;
    } else if (diffDays <= 4) {
      priority = 2;
    } else {
      priority = 3;
    }

    const newTask = new Task({
      title,
      description,
      due_date,
      priority,
      userId: res.locals.userId,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllTasks(req: Request, res: Response) {
  try {
    const { page, limit, sort } = req.query;
    const userId = res.locals.userId;

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;

    const skip = (pageNumber - 1) * pageSize;

    const totalTasks = await Task.countDocuments({ userId });
    const totalPages = Math.ceil(totalTasks / pageSize);

    let sortby;
    const splitSort = (sort as string).split(",").join(" ");
    const reverseSplitSort = ("-" + splitSort) as string;

    if ((sort as string).split(",")[1] === "-1") {
      sortby = reverseSplitSort;
    } else {
      sortby = splitSort;
    }

    const tasks = await Task.find({ userId, deletedAt: null })
      .skip(skip)
      .limit(pageSize)
      .sort(sortby);

    res.status(200).json({
      tasks,
      currentPage: pageNumber,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function setStatus(req: Request, res: Response) {
  try {
    const { taskId, status } = req.body;
    const userId = res.locals.userId;
    console.log(taskId, status, userId);

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function setDueDate(req: Request, res: Response) {
  try {
    const { taskId, dueDate } = req.body;
    const userId = res.locals.userId;

    const newDate = new Date(dueDate);
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { due_date: newDate },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function deleteTask(req: Request, res: Response) {
  try {
    const { taskId } = req.body;
    const userId = res.locals.userId;

    const deletedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ success: true, deletedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function getTaskDetails(req: Request, res: Response) {
  try {
    const { taskId } = req.body;
    const userId = res.locals.userId;

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export {
  createTask,
  getAllTasks,
  setStatus,
  setDueDate,
  deleteTask,
  getTaskDetails,
};
