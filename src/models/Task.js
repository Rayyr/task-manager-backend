import mongoose from "mongoose";
import { TASK_PRIORITY, TASK_STATUS } from "../config/constants.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: TASK_STATUS,
        message: `Status must be one of: ${TASK_STATUS.join(", ")}`,
      },
      default: "todo",
    },
    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITY,
        message: `Priority must be one of: ${TASK_PRIORITY.join(", ")}`,
      },
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    tags: {
      type: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    id: false,
  },
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
