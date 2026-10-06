import validate from "../middleware/validate.js";
import { login, register } from "../controllers/authController.js";
import express from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";

const router=express.Router();
 
const registerRules=[

    body("email").isEmail().withMessage("Please provide a valid email").notEmpty().withMessage("Email is required"),
    body("password").isString().withMessage("Password must be a string").notEmpty().withMessage("Password is required")
    .isLength({min:6}).withMessage("Password must be at least 6 characters"),
    body("name").trim().notEmpty().withMessage("Name is required").isLength({max:50}).withMessage("Name cannot exceed 50 characters")
];

const loginRules=[
    body("email").isEmail().withMessage("Please provide a valid email").notEmpty().withMessage("Email is required"),
    body("password").isString().withMessage("Password must be a string").notEmpty().withMessage("Password is required")
];


//max 20 login attepts per IP every 15 mins
const loginlimiter=rateLimit({

    windowMs:15*60*1000,
    limit:20,
    standardHeaders:true,
    legacyHeaders:false,
    message:{success:false,message:"Too many login attempts. Try agin in 15 minutes."}

});

router.post("/register",registerRules,validate,register);
router.post("/login",loginlimiter,loginRules,validate,login)

export default router;