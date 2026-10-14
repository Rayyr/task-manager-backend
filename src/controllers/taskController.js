import Task from "../models/Task.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import pick from "../utils/pick.js";

const ALLOWED_FIELDS = [
  "title",
  "description",
  "status",
  "priority",
  "dueDate",
  "tags",
];

// Finds a task only if it belongs to the user. Otherwise: 404.
const findOwnTask = async (id, userId) => {
  const task = await Task.findOne({ _id: id, owner: userId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return task;
};

// @route   POST /api/v1/tasks
export const createTask = asyncHandler(async (req, res) => {
  const data = pick(req.body, ALLOWED_FIELDS);
  if (data.status === "done") data.completedAt = new Date();

  const task = await Task.create({ ...data, owner: req.user._id });
  return res.status(201).json({ success: true, data: task });
});

// @route   GET /api/v1/tasks
// (Step 10 adds filtering, search, sorting and pagination)
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id }).sort("-createdAt");
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

// @route   GET /api/v1/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  const task = await findOwnTask(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: task });
});

// @route   PUT /api/v1/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const task = await findOwnTask(req.params.id, req.user._id);

  task.set(pick(req.body, ALLOWED_FIELDS));
  if (task.status === "done") {
    if (!task.completedAt) task.completedAt = new Date(); // keep the original date if already done
  } else {
    task.completedAt = undefined; // moved away from done -> clear it
  }
  await task.save(); // runs validators and the completedAt hook

  res.status(200).json({ success: true, data: task });
});

// @route   PATCH /api/v1/tasks/:id/status
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await findOwnTask(req.params.id, req.user._id);

  task.status = req.body.status;
  if (task.status === "done") {
    if (!task.completedAt) task.completedAt = new Date(); // keep the original date if already done
  } else {
    task.completedAt = undefined; // moved away from done -> clear it
  }
  await task.save();

  res.status(200).json({ success: true, data: task });
});

// @route   DELETE /api/v1/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findOwnTask(req.params.id, req.user._id);

  await task.deleteOne();

  res.status(200).json({ success: true, message: "Task deleted" });
});
