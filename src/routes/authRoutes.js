import validate from "../middleware/validate.js";
import { login, register } from "../controllers/authController.js";
import express from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";
import { getMe } from "../controllers/authController.js";
import { changePassword } from "../controllers/authController.js";
import { registerRules,loginRules,changePasswordRules } from "../validators/authValidators.js";
const router=express.Router();
 

 
 
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