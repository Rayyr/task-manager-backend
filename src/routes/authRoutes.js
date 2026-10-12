import validate from "../middleware/validate.js";
import { login, register } from "../controllers/authController.js";
import express from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";
import { getMe } from "../controllers/authController.js";
import { changePassword } from "../controllers/authController.js";

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

const changePasswordRules=[
body("currentPassword").isString().notEmpty().withMessage("Current password is required"),
body("newPassword").isString().withMessage("New Password must be a string").
isLength({min:6}).withMessage("New password must be at least 6 characters")
];
//max 20 login attepts per IP every 15 mins
const loginlimiter=rateLimit({

    windowMs:15*60*1000,
    limit:20,
    standardHeaders:true,
    legacyHeaders:false,
    message:{success:false,message:"Too many login attempts. Try again in 15 minutes."}

});

router.post("/register",registerRules,validate,register);
router.post("/login",loginlimiter,loginRules,validate,login)
router.get("/me",protect,getMe);
router.put("/change-password",protect,changePasswordRules,validate,changePassword);

 
export default router;