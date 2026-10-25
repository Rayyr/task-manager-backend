import Task from "../models/Task.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import pick from "../utils/pick.js";
import Project from "../models/Project.js";

const ALLOWED_FIELDS = [
  "title",
  "description",
  "status",
  "priority",
  "dueDate",
  "tags",
  "project"
];

// Finds a task only if it belongs to the user. Otherwise: 404.
const findOwnTask = async (id, userId) => {
  const task = await Task.findOne({ _id: id, owner: userId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return task;
};

// The project must exist AND belong to the user. Empty or null means "no project".
const assertOwnProject = async (projectId, userId) => {
  if (!projectId) return;
  const exists = await Project.exists({ _id: projectId, owner: userId });
  if (!exists) throw new ApiError(404, "Project not found");
};

// Replaces the project id in the response with { _id, name, color }
const withProject = (task) => task.populate({ path: "project", select: "name color" });

// @route   POST /api/v1/tasks
export const createTask = asyncHandler(async (req, res) => {
  const data = pick(req.body, ALLOWED_FIELDS);
  await assertOwnProject(data.project, req.user._id);

  if (data.status === "done") data.completedAt = new Date();

  const task = await Task.create({ ...data, owner: req.user._id });
  await withProject(task);

  res.status(201).json({ success: true, data: task });
});

// @route   GET /api/v1/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const filter = { owner: req.user._id }; // the owner is ALWAYS part of the filter

  if (typeof req.query.project === "string") {
    filter.project = req.query.project;
  }

  const tasks = await Task.find(filter)
    .sort("-createdAt")
    .populate({ path: "project", select: "name color" });

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});


// @route   GET /api/v1/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  const task = await findOwnTask(req.params.id, req.user._id);
  await withProject(task);

  res.status(200).json({ success: true, data: task });
});

// @route   PUT /api/v1/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const task = await findOwnTask(req.params.id, req.user._id);

  const data = pick(req.body, ALLOWED_FIELDS);
  await assertOwnProject(data.project, req.user._id);
  task.set(data);

  if (task.status === "done") {
    if (!task.completedAt) task.completedAt = new Date();
  } else {
    task.completedAt = undefined;
  }

  await task.save();
  await withProject(task);

  res.status(200).json({ success: true, data: task });
});

// @route   PATCH /api/v1/tasks/:id/status
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await findOwnTask(req.params.id, req.user._id);

  task.status = req.body.status;

  if (task.status === "done") {
    if (!task.completedAt) task.completedAt = new Date();
  } else {
    task.completedAt = undefined;
  }

  await task.save();
  await withProject(task);

  res.status(200).json({ success: true, data: task });
});

// @route   DELETE /api/v1/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findOwnTask(req.params.id, req.user._id);

  await task.deleteOne();

  res.status(200).json({ success: true, message: "Task deleted" });
});
