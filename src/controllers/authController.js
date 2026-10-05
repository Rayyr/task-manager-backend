import User from "../models/User.js";
import { generateToken } from "../utils/token.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
//@route POST /api/v1/auth/register
//@access puplic

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
  //hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    name: name,
    password: hashedPassword,
    email: email,
  });
  return res.status(201).json({
    success: true,
    token: generateToken(User._id),
    newUser,
  });
});
