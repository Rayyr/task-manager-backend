import validate from "../middleware/validate.js";
import { register } from "../controllers/authController.js";
import express from "express";

const router=express.Router();
 
router.post("/register",validate,register);


export default router;