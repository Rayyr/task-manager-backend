import express from "express";
import authRoutes from "./authRoutes.js";
import taskRoutes from './taskRoutes.js';
import projectRoutes from "./projectRoutes.js";

const router=express.Router();

//auth routes
router.use("/auth",authRoutes);

//task routes
router.use("/tasks",taskRoutes);


//project routes
router.use("/projects",projectRoutes);

export default router;