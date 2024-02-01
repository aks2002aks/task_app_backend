import { Schema, model, Document } from "mongoose";

export interface ISubTask extends Document {
  task_id: Schema.Types.ObjectId;
  status: number;
  deleted_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

const subTaskSchema = new Schema<ISubTask>({
  task_id: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  status: {
    type: Number,
    required: true,
    enum: [0, 1],
  },
  deleted_at: {
    type: Date,
    default: null,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const SubTask = model<ISubTask>("SubTask", subTaskSchema);

export default SubTask;
