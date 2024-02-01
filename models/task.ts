// models/task.ts

import mongoose, { Document } from "mongoose";

export interface Task extends Document {
  userId: string;
  title: string;
  description: string;
  due_date: Date;
  priority: Number;
  status: string;
  deletedAt: Date;
  createdAt: Date;
}

const taskSchema = new mongoose.Schema<Task>(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      enum: [-1,0, 1, 2, 3],
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Task>("Task", taskSchema);
