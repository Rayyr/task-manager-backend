import express from "express";
import authRoutes from "./authRoutes.js";
import taskRoutes from './taskRoutes.js';

const router=express.Router();

//auth routes
router.use("/auth",authRoutes);

//task routes
router.use("/tasks",taskRoutes);

export default router;