import { body } from "express-validator";
import validate from "../middleware/validate";
import { register } from "../controllers/authController";
import express from "express";

const router=express.Router();
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

router.post("/register",registerRules,validate,register);


export default router;