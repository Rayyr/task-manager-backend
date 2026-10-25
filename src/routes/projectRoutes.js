import { Router } from "express";
import validate from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import {
  createProject, getProjects, getProject, updateProject, deleteProject,
} from "../controllers/projectController.js";
import {
  projectIdRule, createProjectRules, updateProjectRules,
} from "../validators/projectValidators.js";

const router = Router();

router.use(protect);

router.route("/").get(getProjects).post(createProjectRules, validate, createProject);

router
  .route("/:id")
  .get(projectIdRule, validate, getProject)
  .put(projectIdRule, updateProjectRules, validate, updateProject)
  .delete(projectIdRule, validate, deleteProject);

export default router;