import express from "express";
import { createTask,getTask,getTasks,updateTask,updateTaskStatus,deleteTask } from "../controllers/taskController.js";
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { idRule,createTaskRules,updateTaskRules,statusRules } from "../validators/taskValidators.js";

const router=express.Router();
 

// Every task route requires a logged-in user
router.use(protect);

router.route("/").get(getTasks).post(createTaskRules,validate,createTask);

router
  .route('/:id')
  .get(idRule, validate, getTask)
  .put(idRule, updateTaskRules, validate, updateTask)
  .delete(idRule, validate, deleteTask);

router.patch('/:id/status', idRule, statusRules, validate, updateTaskStatus);

export default router;