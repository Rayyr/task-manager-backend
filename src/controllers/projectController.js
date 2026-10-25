import Project from "../models/Project.js";
import Task from "../models/Task.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import pick from "../utils/pick.js";

const ALLOWED_FIELDS = ["name", "description", "color"];

// Finds a project only if it belongs to the user. Otherwise: 404.
const findOwnProject = async (id, userId) => {
  const project = await Project.findOne({ _id: id, owner: userId });
  if (!project) throw new ApiError(404, "Project not found");
  return project;
};

// @route   POST /api/v1/projects
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...pick(req.body, ALLOWED_FIELDS),
    owner: req.user._id,
  });

  res.status(201).json({ success: true, data: project });
});

// @route   GET /api/v1/projects  (each project includes its task counts)
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ owner: req.user._id })
    .sort("name")
    .select("-__v")
    .lean();

  const counts = await Task.aggregate([
    { $match: { owner: req.user._id, project: { $ne: null } } },
    {
      $group: {
        _id: "$project",
        taskCount: { $sum: 1 },
        doneCount: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
      },
    },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c]));

  const data = projects.map((p) => {
    const c = countMap.get(String(p._id));
    return { ...p, taskCount: c?.taskCount || 0, doneCount: c?.doneCount || 0 };
  });

  res.status(200).json({ success: true, count: data.length, data });
});

// @route   GET /api/v1/projects/:id
export const getProject = asyncHandler(async (req, res) => {
  const project = await findOwnProject(req.params.id, req.user._id);

  res.status(200).json({ success: true, data: project });
});

// @route   PUT /api/v1/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  const project = await findOwnProject(req.params.id, req.user._id);

  project.set(pick(req.body, ALLOWED_FIELDS));
  await project.save();

  res.status(200).json({ success: true, data: project });
});

// @route   DELETE /api/v1/projects/:id
// The project's tasks are kept and unlinked (project becomes null)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await findOwnProject(req.params.id, req.user._id);

  const result = await Task.updateMany(
    { owner: req.user._id, project: project._id },
    { $set: { project: null } }
  );
  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project deleted",
    unlinkedTasks: result.modifiedCount,
  });
});