// models/user.ts

import mongoose, { Document } from "mongoose";

export interface User extends Document {
  phone_number: string;
  priority: Number;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<User>({
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  priority: {
    type: Number,
    enum: [0, 1, 2],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<User>("User", userSchema);
